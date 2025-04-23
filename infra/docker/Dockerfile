FROM node:23-slim AS builder

LABEL maintainer="richiebono@gmail.com"
LABEL version="1.0.0"

WORKDIR /usr/src/app

# Adjust the context for copying files
COPY ../../package*.json ./
COPY ../../tsconfig.json ./

# Install all dependencies (including devDependencies for build tools)
RUN npm install

# Install tsc-alias globally for build
RUN npm install -g tsc-alias

# Copy source code
COPY ../../ ./
COPY ../../infra ./infra

# Build the application (tsc + tsc-alias via postbuild script)
RUN npm run build

# Production stage
FROM node:23-slim

LABEL maintainer="richiebono@gmail.com"
LABEL version="1.0.0"

WORKDIR /usr/src/app

# Adjust the context for copying files
COPY ../../package*.json ./
COPY ../../tsconfig.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy .env file
COPY ../../.env ./
COPY ../../infra ./infra

RUN chmod -R +x ./infra/scripts

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Use node to run the compiled JavaScript
CMD ["npm", "start"]
