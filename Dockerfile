# syntax=docker/dockerfile:1

# Use a specific version of the Node.js image for better reproducibility
FROM node:21-slim AS base
WORKDIR /app

# Create a stage for installing dependencies
FROM base AS deps
# Copy only package.json and lockfile to leverage Docker caching
COPY package.json package-lock.json* ./
# Install dependencies including dev dependencies
RUN npm ci

# Create a stage for production
FROM base AS build
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application code
COPY . .
# Make the CLI tool executable
RUN chmod +x ./src/index.ts

# Create the final production image
FROM base AS runtime
WORKDIR /app

# Install Pandoc and TeX Live (BasicTex equivalent for Linux)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    pandoc \
    texlive-latex-base \
    texlive-fonts-recommended \
    texlive-latex-extra \
    texlive-xetex \
    texlive-fonts-extra && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user and set permissions
RUN addgroup --system --gid 1001 nodeuser && \
    adduser --system --uid 1001 --ingroup nodeuser nodeuser && \
    chown -R nodeuser:nodeuser /app

# Copy only the necessary files from the build stage
COPY --from=build --chown=nodeuser:nodeuser /app/package.json ./package.json
COPY --from=build --chown=nodeuser:nodeuser /app/node_modules ./node_modules
COPY --from=build --chown=nodeuser:nodeuser /app/src ./src
COPY --from=build --chown=nodeuser:nodeuser /app/config ./config
COPY --from=build --chown=nodeuser:nodeuser /app/resources ./resources
COPY --from=build --chown=nodeuser:nodeuser /app/sushi-config.yaml ./sushi-config.yaml
# Create symbolic link to make the CLI tool available globally
RUN ln -s /app/src/index.ts /usr/local/bin/wt2xt

# Switch to non-root user
USER nodeuser

# Set the entrypoint to the CLI tool
ENTRYPOINT ["node", "--require", "ts-node/register", "/app/src/index.ts"]

EXPOSE 3000
# Default command (can be overridden)
CMD ["--help"]
