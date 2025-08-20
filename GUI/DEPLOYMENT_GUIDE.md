# ICOS GUI Deployment Guide

## Project Status: READY FOR DEPLOYMENT

The ICOS GUI project has been successfully configured and is now connected to the real ICOS Shell server. All data is fetched live with no mock data.

## Quick Start (Choose One)

### Option 1: Docker (Recommended - Easiest)
```bash
# 1. Extract/Clone the project
cd GUI

# 2. Run with Docker (handles everything automatically)
docker compose up -d

# 3. Access the application
open http://localhost:3000
```

### Option 2: Auto Setup Script
```bash
# 1. Extract/Clone the project
cd GUI

# 2. Run the auto setup script
./start.sh

# 3. Follow the instructions displayed
```

### Option 3: Manual Setup
```bash
# 1. Extract/Clone the project
cd GUI

# 2. Install dependencies (IMPORTANT: Use legacy peer deps)
npm install --legacy-peer-deps

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your ICOS Shell address

# 4. Start development server
npm run dev

# 5. Access the application
open http://localhost:3000
```

## Environment Configuration

### Required Environment Variables
Create `.env.local` file with:

```bash
# ICOS Shell server address (REQUIRED)
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER_IP:PORT/api/v3

# Request timeout in milliseconds (optional)
NEXT_PUBLIC_CONTROLLER_TIMEOUT=15000
```

### Example Configuration
```bash
# For the current production server
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://10.160.3.20:32500/api/v3
NEXT_PUBLIC_CONTROLLER_TIMEOUT=15000
```

## What We Fixed

### Environment Configuration
- **Problem**: Missing `NEXT_PUBLIC_CONTROLLER_ADDRESS` environment variable
- **Solution**: Added proper environment variable support with `.env.local` and `.env.example`
- **Result**: GUI now connects to real ICOS Shell server

### Real Server Connection
- **Problem**: GUI was not connecting to actual ICOS Shell
- **Solution**: Configured connection to real server address
- **Result**: All data now fetched live from real server

### Authentication System
- **Problem**: No proper token management
- **Solution**: Implemented dynamic token generation on every login
- **Result**: Secure authentication with fresh tokens

### No Mock Data
- **Problem**: Potential for fake data
- **Solution**: All data fetched from real ICOS Shell endpoints
- **Result**: 100% real-time data from production server

## Data Sources

All data is fetched from real ICOS Shell endpoints:

- **Projects/Deployments**: `/deployment/`
- **Metrics**: `/metrics/get`, `/metrics/train`, `/metrics/predict`, `/metrics/delete`
- **Controllers**: `/controller/`
- **Resources**: `/resource/`
- **Authentication**: `/user/login`

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check your ICOS Shell server address in `.env.local`
2. **Authentication Error**: Ensure your credentials are correct
3. **Dependency Issues**: Use `npm install --legacy-peer-deps`
4. **Port Conflicts**: Ensure port 3000 is available

### Network Requirements

- **VPN Access**: May be required to access ICOS Shell server
- **Firewall**: Ensure port access to ICOS Shell server
- **DNS Resolution**: Server address must be resolvable

## Production Deployment

### Docker Production
```bash
# Build production image
docker build -t icos-gui:latest .

# Run production container
docker run -d -p 3000:3000 --env-file .env.local icos-gui:latest
```

### Environment Variables for Production
```bash
NEXT_PUBLIC_CONTROLLER_ADDRESS=https://your-production-server.com/api/v3
NEXT_PUBLIC_CONTROLLER_TIMEOUT=30000
```

## Support

For issues or questions:
1. Check this deployment guide
2. Verify environment configuration
3. Test network connectivity to ICOS Shell
4. Review browser console for errors
