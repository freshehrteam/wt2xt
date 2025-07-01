# syntax=docker/dockerfile:1

# Use Bun as the base image
FROM oven/bun:1 AS base
WORKDIR /app

# Create a stage for installing dependencies
FROM base AS deps
# Copy only package.json and lockfile to leverage Docker caching
COPY package.json bun.lockb* ./

# Install dependencies including dev dependencies
RUN bun install

# Create a stage for production
FROM base AS build
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Make the CLI tool executable
RUN chmod +x ./src/index.ts
# Build the application
RUN bun run build

# Create the final production image
FROM base AS runtime
WORKDIR /app

# Install Pandoc and TeX Live (BasicTex equivalent for Linux)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pandoc \
    fonts-lmodern \
    lmodern && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and set permissions
RUN addgroup --system --gid 1001 bunuser && \
    adduser --system --uid 1001 --ingroup bunuser bunuser && \
    chown -R bunuser:bunuser /app

# Copy only the necessary files from the build stage
COPY --from=build --chown=bunuser:bunuser /app/package.json ./package.json
COPY --from=build --chown=bunuser:bunuser /app/bun.lockb ./bun.lockb
COPY --from=build --chown=bunuser:bunuser /app/node_modules ./node_modules
COPY --from=build --chown=bunuser:bunuser /app/dist ./dist
COPY --from=build --chown=bunuser:bunuser /app/config ./config
COPY --from=build --chown=bunuser:bunuser /app/resources ./resources
COPY --from=build --chown=bunuser:bunuser /app/sushi-config.yaml ./sushi-config.yaml
# Create symbolic link to make the CLI tool available globally
RUN ln -s /app/dist/index.js /usr/local/bin/wt2xt

# Switch to non-root user
USER bunuser

# Set the entrypoint to the CLI tool
ENTRYPOINT ["bun", "run", "/app/dist/index.js"]

EXPOSE 3000
# Default command (can be overridden)
CMD ["--help"]
