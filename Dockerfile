FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV STANDALONE=true
ENV DATABASE_URL=postgres://reverse:reverse_password@localhost:5432/reverse
ENV PAYLOAD_SECRET=build-time-placeholder-do-not-use
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV RUNNING_IN_DOCKER=true
ENV PORT=3000
RUN apk add --no-cache su-exec
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
RUN mkdir -p /app/.tmp /app/public/uploads && chown -R nextjs:nodejs /app/.tmp /app/public
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["sh", "-c", "mkdir -p /app/.tmp /app/public/uploads && chown -R nextjs:nodejs /app/.tmp /app/public/uploads && exec su-exec nextjs:nodejs \"$@\"", "--"]
CMD ["node", "server.js"]
