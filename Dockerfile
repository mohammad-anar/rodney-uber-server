# Stage 1: Build
FROM node:20-alpine AS builder
 
# Set working directory
WORKDIR /app
 
# Install pnpm globally
RUN npm install -g pnpm
 
# Copy configuration and lockfiles first for better caching
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
 
# Install all dependencies (including devDeps for building)
RUN pnpm install --frozen-lockfile
 
# Copy source code
COPY . .
 
# Build the project (generates 'dist' folder as per package.json)
RUN pnpm build
 
# Stage 2: Production
FROM node:20-alpine AS runner
 
WORKDIR /app
 
# Set environment to production
ENV NODE_ENV=production
 
# Install pnpm globally
RUN npm install -g pnpm
 
# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs
 
# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
 
# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile
 
# Ensure logs and uploads directories exist and have correct permissions
RUN mkdir -p logs uploads && chown -R expressjs:nodejs /app
 
USER expressjs
 
# Expose the application port
EXPOSE 5000
 
# Start the application
CMD ["node", "dist/server.js"]