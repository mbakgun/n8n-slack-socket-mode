# Running n8n with Docker

This repository includes configurations to run n8n locally with Docker while mounting the `dist` directory of this Slack Socket Trigger node.

## Prerequisites

- Docker and Docker Compose installed on your machine
- Bun (or Node.js and npm) for building the project

## Getting Started

### Option 1: Using the provided script

1. Run the start script:

```bash
./start-n8n.sh
```

This script will:
- Install dependencies with Bun
- Build the project using Bun
- Start the Docker container with n8n
- Mount the `dist` directory and node_modules to n8n

### Option 2: Manual steps

1. Install dependencies:

```bash
bun install
```

2. Build the project:

```bash
bun run build
```

3. Start the Docker container:

```bash
docker compose up -d
```

4. To stop the container:

```bash
docker compose down
```

## Accessing n8n

Once the container is running, you can access n8n at:
- http://localhost:5678

## Using the Custom Node

The custom Slack Socket Trigger node will be available in n8n's node palette once you login.

## Troubleshooting

If you don't see the custom node in n8n:
1. Ensure the build was successful
2. Check that the `dist` directory contains the compiled node files
3. Check logs for issues with `docker compose logs`
4. Restart the Docker container:
   ```bash
   docker compose restart
   ``` 
