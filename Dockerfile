# syntax=docker/dockerfile:1

# Use a specific version of the Bun image for better reproducibility
FROM oven/bun:1 as base
WORKDIR /app

# Create a stage for installing dependencies
FROM base as deps
# Copy only package.json and lockfile to leverage Docker caching
COPY package.json bun.lockb* ./
# Install dependencies including dev dependencies
RUN bun install --frozen-lockfile

# Create a stage for production
FROM base as build
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Make the CLI tool executable
RUN chmod +x ./src/index.ts

# Create the final production image
FROM base as runtime
WORKDIR /app

# Install Pandoc and TeX Live (BasicTex equivalent for Linux)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pandoc \
    texlive-base \
    texlive-latex-recommended \
    texlive-fonts-recommended && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and set permissions
RUN addgroup --system --gid 1001 bunuser && \
    adduser --system --uid 1001 --ingroup bunuser bunuser && \
    chown -R bunuser:bunuser /app

# Copy only the necessary files from the build stage
COPY --from=build --chown=bunuser:bunuser /app/package.json ./package.json
COPY --from=build --chown=bunuser:bunuser /app/node_modules ./node_modules
COPY --from=build --chown=bunuser:bunuser /app/src ./src
COPY --from=build --chown=bunuser:bunuser /app/config ./config

# Create symbolic link to make the CLI tool available globally
RUN ln -s /app/src/index.ts /usr/local/bin/wt2docbx

# Switch to non-root user
USER bunuser

# Set the entrypoint to the CLI tool
ENTRYPOINT ["bun", "/app/src/index.ts"]

# Default command (can be overridden)
CMD ["--help"]
