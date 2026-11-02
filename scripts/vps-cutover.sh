#!/usr/bin/env bash
# Run on the VPS by .github/workflows/deploy.yml. Not a local script.
# Creates /opt/hcr, refuses to touch PM2 until .env is safe, then replaces
# the PM2 process `hcr` with the GHCR container. Does not delete /root/hcr
# and does not change Caddy.
set -euo pipefail

app_dir=/opt/hcr
mkdir -p "$app_dir"
cd "$app_dir"

cat > ENV.txt <<'EOF'
Human Code Reader reads /opt/hcr/.env when the container starts. This file is a note, not the env.

One-time copy from the PM2 checkout (do this before the first Actions deploy):

  cp /root/hcr/.env /opt/hcr/.env

Then edit /opt/hcr/.env so the process inside the container is reachable:

  HOST=0.0.0.0
  PORT=3773
  NODE_ENV=production

Keep APP_KEY, TZ, and LOG_LEVEL. HOST is the bind address inside the container.
docker-compose.yml publishes 127.0.0.1:3773 on the VPS. Do not commit .env.
EOF

if [ ! -f docker-compose.yml ]; then
  echo "Refusing to deploy: ${app_dir}/docker-compose.yml is missing. PM2 was not touched."
  exit 1
fi

if ! grep -q 'image: ghcr.io/kstrat2001/hcr:latest' docker-compose.yml; then
  echo "Refusing to deploy: docker-compose.yml is not the HCR production file. PM2 was not touched."
  exit 1
fi

if [ ! -f .env ]; then
  echo "Refusing to deploy: ${app_dir}/.env is missing."
  echo "Copy /root/hcr/.env to ${app_dir}/.env and set HOST=0.0.0.0 and PORT=3773. See ${app_dir}/ENV.txt."
  echo "PM2 was not touched."
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
  echo "Compose publishes 127.0.0.1:3773. Binding to localhost inside the container makes that publish miss the process. PM2 was not touched."
  exit 1
fi

if [ -n "$port" ] && [ "$port" != "3773" ]; then
  echo "Refusing to deploy: PORT=${port}. Caddy proxies to 127.0.0.1:3773 and this workflow does not change Caddy. Set PORT=3773. PM2 was not touched."
  exit 1
fi

if [ -n "$node_env" ] && [ "$node_env" != "production" ]; then
  echo "Refusing to deploy: NODE_ENV=${node_env}. Set NODE_ENV=production. PM2 was not touched."
  exit 1
fi

if [ -z "$app_key" ]; then
  echo "Refusing to deploy: APP_KEY is empty. PM2 was not touched."
  exit 1
fi

if [ -z "${GHCR_USER:-}" ] || [ -z "${GHCR_TOKEN:-}" ]; then
  echo "Refusing to deploy: GHCR credentials were not passed in. PM2 was not touched."
  exit 1
fi

echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
unset GHCR_TOKEN
trap 'docker logout ghcr.io >/dev/null 2>&1 || true' EXIT

docker compose pull

if command -v pm2 >/dev/null 2>&1 && pm2 describe hcr >/dev/null 2>&1; then
  echo "CUTOVER: stopping and deleting PM2 process hcr so the container can bind 127.0.0.1:3773. /root/hcr is left in place. Caddy is not changed."
  pm2 stop hcr
  pm2 delete hcr
  pm2 save || true
else
  echo "PM2 process hcr is not running. Continuing with the container."
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
