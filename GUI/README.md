# ICOS Ecosystem GUI

A Next.js-based web interface for the ICOS Shell that displays cluster topology, deployments, resources, and metrics — all fetched live from the real server after user login.

## Key Features

- **Real-time Data**: All data fetched from ICOS Shell (no mocks, no hardcoded tokens)
- **Dynamic Authentication**: New token generated every login via `/user/login`
- **Live Topology**: Interactive cluster topology visualization
- **Project Management**: Real-time deployments and resources
- **Metrics Tracking**: Live metrics with train/predict/delete capabilities
- **Universal Access**: Works locally (Node.js) or with Docker

## Quick Start

### Prerequisites
- Node.js ≥ 16 and npm ≥ 8 (or Docker & Docker Compose)
- Network/VPN access to your ICOS Shell instance

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Update with your actual ICOS Shell address:

```bash
# Example configuration
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER_IP:PORT/api/v3
NEXT_PUBLIC_CONTROLLER_TIMEOUT=15000
```

### Development
```bash
# Install dependencies (IMPORTANT: Use legacy peer deps)
npm install --legacy-peer-deps

# Start development server
npm run dev
# Access at: http://localhost:3000
```

### Docker Deployment
```bash
# Build and start with Docker
docker compose up -d --build
# Access at: http://127.0.0.1:3000
```

## Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTROLLER_ADDRESS` | Base URL of ICOS Shell (no trailing slash) | ✅ Yes |
| `NEXT_PUBLIC_CONTROLLER_TIMEOUT` | Request timeout in milliseconds | ❌ No (default: 15000) |

## Data Flow

1. **Login** → User authenticates via `/user/login` endpoint
2. **Token Generation** → New token received from ICOS Shell
3. **API Calls** → All subsequent requests use `api_key: ${TOKEN}` header
4. **Real-time Data** → Deployments, controllers, resources, and metrics fetched live

## Important Notes

- **No Mock Data**: All data is fetched from real ICOS Shell server
- **Dynamic Tokens**: New authentication token generated on every login
- **Real Server**: No hardcoded data or fake endpoints
- **Network Access**: Requires connection to ICOS Shell instance

## Troubleshooting

- **Connection Issues**: Check your ICOS Shell server address and network access
- **Authentication Errors**: Ensure your credentials are correct
- **Dependency Issues**: Use `npm install --legacy-peer-deps` for compatibility
