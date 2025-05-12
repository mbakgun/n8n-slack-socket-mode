#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
bun install

# Build the project
echo "Building the project..."
rm -rf dist
bun run build

# Start Docker containers
echo "Starting n8n with Docker..."
docker compose up -d

echo "n8n is running at http://localhost:5678"
echo "The dist folder and node_modules are mounted to the container"
