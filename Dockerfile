# Multi-stage build for SCHOOL101 MCP Server

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm ci --only=development

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    giflib \
    pixman \
    dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application from builder
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package*.json ./

# Copy environment and configuration files
COPY .env.example .env
COPY public/ ./public/ 2>/dev/null || true
COPY data/ ./data/ 2>/dev/null || true

# Set ownership
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose ports
EXPOSE 3000 9229

# Use dumb-init to handle signals properly
ENTRYPOINT ["/sbin/dumb-init", "--"]

# Start application
CMD ["node", "dist/index.js"]

# Alternative: for development with hot reload
# CMD ["npm", "run", "dev"]

# Build arguments
ARG NODE_ENV=production
ARG APP_VERSION=1.0.0

# Environment variables
ENV NODE_ENV=${NODE_ENV}
ENV APP_VERSION=${APP_VERSION}
ENV PORT=3000

# Labels for metadata
LABEL maintainer="SCHOOL101 Team <team@school101.ai>"
LABEL description="Global MCP for Education - Unified Model Context Protocol Server"
LABEL version="${APP_VERSION}"
