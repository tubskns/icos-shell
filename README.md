# ICOS Ecosystem GUI

A Next.js-based web interface for the ICOS Shell that displays cluster topology, deployments, resources, and metrics — all fetched live from the real server after user login.

## 🚀 Key Features

- ✅ **Real-time Data**: All data fetched from ICOS Shell (no mocks, no hardcoded tokens)
- ✅ **Dynamic Authentication**: New token generated every login via `/user/login`
- ✅ **Live Topology**: Interactive cluster topology visualization
- ✅ **Project Management**: Real-time deployments and resources
- ✅ **Metrics Tracking**: Live metrics with train/predict/delete capabilities
- ✅ **Universal Access**: Works locally (Node.js) or with Docker

## 🛠️ Quick Start

### Prerequisites
- Node.js ≥ 16 and npm ≥ 8 (or Docker & Docker Compose)
- Network/VPN access to your ICOS Shell instance

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Update with your actual ICOS Shell address:

```bash
# Example configuration
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://10.160.3.20:32500/api/v3
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

## ⚙️ Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CONTROLLER_ADDRESS` | Base URL of ICOS Shell (no trailing slash) | ✅ Yes |
| `NEXT_PUBLIC_CONTROLLER_TIMEOUT` | Request timeout in milliseconds | ❌ No (default: 15000) |

## 🔄 Data Flow

1. **Login** → User authenticates via `/user/login` endpoint
2. **Token Generation** → New token received from ICOS Shell
3. **API Calls** → All subsequent requests use `api_key: ${TOKEN}` header
4. **Real-time Data** → Deployments, controllers, resources, and metrics fetched live

## 🌐 Shell API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/user/login` | GET | User authentication (username, password, otp?) |
| `/resource/` | GET | Fetch available resources |
| `/controller/` | GET | Fetch controller information |
| `/deployment/` | GET | List all deployments |
| `/deployment/{id}/start` | PUT | Start specific deployment |
| `/deployment/{id}/stop` | PUT | Stop specific deployment |
| `/deployment/{id}` | DELETE | Delete specific deployment |
| `/metrics/get` | GET | Fetch available metrics |
| `/metrics/train` | POST | Train a metric |
| `/metrics/predict` | POST | Make predictions |
| `/metrics/delete` | POST | Delete a metric |

**Headers**: `api_key: <token>` + `accept: application/json` where applicable

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check VPN/connectivity and controller address |
| 401 Unauthorized | Invalid credentials/token; login again |
| 204/Empty response | Valid response; verify Shell state |
| Missing env variable | Ensure `.env.local` exists with correct values |

## 📦 Project Structure

```
GUI/
├── components/          # React components
│   ├── _App/           # Main app components
│   ├── Projects/       # Project management
│   ├── Metrics/        # Metrics handling
│   └── UIElements/     # Reusable UI components
├── pages/              # Next.js pages and API routes
├── utils/              # Utility functions
├── config.js           # Configuration management
├── .env.example        # Environment template
└── start.sh            # Auto setup script
```

## 🤝 Contributing

- **Branch**: Work on `GUI` branch
- **Security**: Never commit secrets or `.env.local`
- **Data**: Ensure all data fetched live with `api_key`
- **Commits**: Group changes by area (config/auth/projects/pages/metrics)

## 📋 Recent Updates

- ✅ **Environment Configuration**: Added proper environment variable support
- ✅ **Real Server Connection**: Connected to actual ICOS Shell at `10.160.3.20:32500`
- ✅ **Token Management**: Dynamic token generation on every login
- ✅ **Documentation**: Complete setup and deployment guides

## 🚀 Deployment Updates

```bash
# Stop and remove existing containers
docker compose stop
docker compose rm -f

# Build and start fresh
docker compose up -d --build
```

## 📄 License

Apache-2.0

🇪🇺 This work has received funding from the European Union's HORIZON research and innovation programme under grant agreement No. 101070177.

---

**Status**: ✅ Production Ready  
**Last Updated**: August 2025  
**Version**: Final Release  
**Branch**: GUI
