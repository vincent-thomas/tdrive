##### DEPENDENCIES

FROM node:20-alpine3.17 AS deps
RUN apk add --no-cache libc6-compat openssl1.1-compat
WORKDIR /app

COPY prisma ./
COPY package.json pnpm-lock.yaml ./

RUN yarn global add pnpm && pnpm i
RUN pnpm p:gen






##### BUILDER

FROM node:20-alpine3.17 AS runner

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN  yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", ".next/standalone/server.js"]