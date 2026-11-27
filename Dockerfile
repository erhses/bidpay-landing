# ===== Builder =====
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ===== Runner =====
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# 3004 on the BiD server (see the Makefile); 3001, 3003 and 8086 are taken there.
ENV PORT=3004
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# next.config.ts builds a self-contained server; copy it with the static files it serves.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node
EXPOSE 3004
CMD ["node", "server.js"]
