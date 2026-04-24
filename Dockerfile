# Use bun image
FROM oven/bun:1 as builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Generate drizzle client and build next app
# Set env to avoid type check errors in production build
ENV NEXT_TELEMETRY_DISABLED 1

# Disable eslint and typescript checks during build to speed up and avoid blocking on unused variables
ENV NEXT_IGNORE_ESLINT 1
ENV NEXT_IGNORE_TYPE_CHECKS 1

RUN bun run build

FROM oven/bun:1 as runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "server.js"]
