# syntax=docker/dockerfile:1

# Use Bun as the base image
FROM oven/bun:1 AS base
WORKDIR /app

# Create a stage for installing dependencies
FROM base AS deps
# Copy only package.json and lockfile to leverage Docker caching
COPY package.json bun.lock /app/

# Install dependencies including dev dependencies
RUN bun install

# Create a stage for production
FROM base AS build
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules /app/node_modules
# Copy application code
COPY . /app/
# Make the CLI tool executable
RUN chmod +x /app/src/index.ts
RUN chmod +x /app/src/api/api.ts
# Build the application
RUN bun run bun-build

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
COPY --from=build --chown=bunuser:bunuser /app/package.json /app/package.json
COPY --from=build --chown=bunuser:bunuser /app/bun.lock /app/bun.lock
COPY --from=build --chown=bunuser:bunuser /app/node_modules /app/node_modules
COPY --from=build --chown=bunuser:bunuser /app/src/index.ts /app/src/index.ts
COPY --from=build --chown=bunuser:bunuser /app/src/api/api.ts /app/src/api/api.ts
COPY --from=build --chown=bunuser:bunuser /app/dist /app/dist
COPY --from=build --chown=bunuser:bunuser /app/src /app/src
COPY --from=build --chown=bunuser:bunuser /app/config /app/config
COPY --from=build --chown=bunuser:bunuser /app/resources /app/resources
COPY --from=build --chown=bunuser:bunuser /app/sushi-config.yaml /app/sushi-config.yaml
# Create symbolic link to make the CLI tool available globally
RUN ln -s /app/src/index.ts /usr/local/bin/wt2xt

# Create output, templates, and tmp directories with more permissive permissions
RUN mkdir -p /app/out /app/templates /app/tmp && chmod -R 777 /app/out /app/tmp

# Switch to non-root user
USER bunuser

# Expose port for API server
EXPOSE 3000

# Create an entrypoint script to handle both CLI and API modes
COPY --from=build --chown=bunuser:bunuser /app/cli /app/cli
RUN echo '#!/bin/sh\nif [ "$1" = "api" ]; then\n  shift\n  exec bun run /app/src/api/api.ts "$@"\nelse\n  exec bun run /app/src/index.ts "$@"\nfi' > /app/cli/entrypoint.sh && \
    chmod +x /app/cli/entrypoint.sh

ENTRYPOINT ["/app/cli/entrypoint.sh"]

# Default command runs the API server
CMD ["api"]
