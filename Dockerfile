# Node.js 24 (Krypton) is the LTS line this app targets (README: Node.js 24+).
# Pin the patch. Do not float `node:24-slim`: a later rebuild would change the
# runtime under an unchanged app. darklyenergized pins `node:24.19-slim` for
# that reason. This image does not copy that patch.
#
# `node:24.19-slim` is Node 24.19.0 (2026-08-03). That release crashes some
# native addons (`RemoveEnvironmentCleanupHook`). HCR has no native addons;
# the pin is still an exact patch so rebuilds stay reproducible.
#
# 24.22.2 is the newest Node 24 release as of 2026-11-02 (Maintenance LTS,
# supported through April 2028). Active LTS moved to Node 26 on 2026-10-28.
# Stay on 24 until the app is deliberately moved off the line it is written for.
FROM node:24.22.2-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:24.22.2-slim AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build && rm -rf build/tests build/bin/test.js build/playwright.config.js

FROM node:24.22.2-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3773 \
    LOG_LEVEL=info \
    TZ=UTC

WORKDIR /app

COPY --from=build /app/build ./
RUN npm ci --omit=dev \
    && npm cache clean --force \
    && mkdir -p tmp \
    && chown -R node:node /app

USER node

EXPOSE 3773

CMD ["node", "bin/server.js"]
