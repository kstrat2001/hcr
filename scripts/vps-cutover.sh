#!/usr/bin/env bash
# Run on the VPS by .github/workflows/deploy.yml. Not a local script.
# Pulls ghcr.io/kstrat2001/hcr:latest and recreates container hcr from
# /opt/hcr/docker-compose.yml, then checks http://127.0.0.1:3773/.
# Does not change Caddy.
set -euo pipefail

app_dir=/opt/hcr
mkdir -p "$app_dir"
cd "$app_dir"

cat > ENV.txt <<'EOF'
Human Code Reader runs from /opt/hcr. This file is a note, not the env.

  /opt/hcr/docker-compose.yml       container hcr (ghcr.io/kstrat2001/hcr:latest)
  /opt/hcr/.env                     production env, read by the container; not in git
  /opt/hcr/scripts/vps-cutover.sh   pull, up, and health check

The process inside the container uses HOST=0.0.0.0, PORT=3773, and
NODE_ENV=production. Keep APP_KEY, TZ, and LOG_LEVEL. Compose publishes
127.0.0.1:3773 and restarts the container unless it is stopped.
Do not commit .env. A deploy does not change Caddy.
EOF

if [ ! -f docker-compose.yml ]; then
  echo "Refusing to deploy: ${app_dir}/docker-compose.yml is missing."
  exit 1
fi

if ! grep -q 'image: ghcr.io/kstrat2001/hcr:latest' docker-compose.yml; then
  echo "Refusing to deploy: docker-compose.yml is not the HCR production file."
  exit 1
fi

if [ ! -f .env ]; then
  echo "Refusing to deploy: ${app_dir}/.env is missing."
  echo "Create ${app_dir}/.env with HOST=0.0.0.0, PORT=3773, NODE_ENV=production, and APP_KEY. See ${app_dir}/ENV.txt."
  exit 1
fi

# Read KEY=value without sourcing, so a hostile or odd .env cannot execute.
read_env() {
  local key="$1"
  local line
  line="$(grep -E "^${key}=" .env | head -n 1 || true)"
  line="${line#*=}"
  line="${line%\"}"
  line="${line#\"}"
  line="${line%\'}"
  line="${line#\'}"
  printf '%s' "$line"
}

host="$(read_env HOST)"
port="$(read_env PORT)"
node_env="$(read_env NODE_ENV)"
app_key="$(read_env APP_KEY)"

if [ -n "$host" ] && [ "$host" != "0.0.0.0" ]; then
  echo "Refusing to deploy: HOST=${host}. Inside the container HOST must be 0.0.0.0 (or unset, so the image default applies)."
  echo "Compose publishes 127.0.0.1:3773. Binding to localhost inside the container makes that publish miss the process."
  exit 1
fi

if [ -n "$port" ] && [ "$port" != "3773" ]; then
  echo "Refusing to deploy: PORT=${port}. Caddy proxies to 127.0.0.1:3773 and this workflow does not change Caddy. Set PORT=3773."
  exit 1
fi

if [ -n "$node_env" ] && [ "$node_env" != "production" ]; then
  echo "Refusing to deploy: NODE_ENV=${node_env}. Set NODE_ENV=production."
  exit 1
fi

if [ -z "$app_key" ]; then
  echo "Refusing to deploy: APP_KEY is empty."
  exit 1
fi

if [ -z "${GHCR_USER:-}" ] || [ -z "${GHCR_TOKEN:-}" ]; then
  echo "Refusing to deploy: GHCR credentials were not passed in."
  exit 1
fi

echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
unset GHCR_TOKEN
trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT

docker compose pull

# Leftover only. Production is container hcr. PM2 is not required.
# If a process named hcr is still registered, stop it so it cannot hold the port.
if command -v pm2 >/dev/null 2>&1 && pm2 describe hcr >/dev/null 2>&1; then
  echo "Stopping and deleting leftover PM2 process hcr so it cannot hold 127.0.0.1:3773."
  pm2 stop hcr
  pm2 delete hcr
  pm2 save || true
fi

docker compose up -d
docker image prune -f

echo "Waiting for http://127.0.0.1:3773/ to return 200."
for _ in $(seq 1 30); do
  body="$(mktemp)"
  code="$(curl -sS -o "$body" -w '%{http_code}' http://127.0.0.1:3773/ || true)"
  if [ "$code" = "200" ] && grep -q "Human Code Reader" "$body"; then
    rm -f "$body"
    echo "Healthy: GET / returned 200."
    exit 0
  fi
  rm -f "$body"
  sleep 2
done

echo "Health check failed. Container logs:"
docker compose logs --tail 80 || true
exit 1
