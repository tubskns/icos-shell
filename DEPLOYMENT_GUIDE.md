# 🚀 ICOS GUI Deployment Guide

## ✅ Project Status: READY FOR DEPLOYMENT

The ICOS GUI project has been successfully configured and is now connected to the real ICOS Shell server. All data is fetched live with no mock data.

## 🎯 Quick Start (Choose One)

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

## 🔧 Environment Configuration

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

## 🔍 What We Fixed

### ✅ Environment Configuration
- **Problem**: Missing `NEXT_PUBLIC_CONTROLLER_ADDRESS` environment variable
- **Solution**: Added proper environment variable support with `.env.local` and `.env.example`
- **Result**: GUI now connects to real ICOS Shell server

### ✅ Real Server Connection
- **Problem**: GUI was not connecting to actual ICOS Shell
- **Solution**: Configured connection to `http://10.160.3.20:32500/api/v3`
- **Result**: All data now fetched live from real server

### ✅ Token Management
- **Problem**: Static or hardcoded tokens
- **Solution**: Dynamic token generation on every login via `/user/login` endpoint
- **Result**: Secure authentication with fresh tokens

### ✅ Dependency Issues Resolved
- **Problem**: Peer dependency conflicts with React 18
- **Solution**: Added `--legacy-peer-deps` flag to all npm commands
- **Files Updated**: 
  - `package.json` - Added new scripts and dependencies
  - `Dockerfile.app` - Updated build process
  - `Dockerfile` - Updated build process

### ✅ Documentation Created
- **README.md** - Complete setup guide with real server configuration
- **DEPLOYMENT_GUIDE.md** - This deployment guide
- **start.sh** - Auto setup script
- **.env.example** - Environment configuration template

## 📋 Files Created/Updated

### New Files
- ✅ `.gitignore` - Proper Git ignore patterns
- ✅ `.env.example` - Environment configuration template
- ✅ `README.md` - Complete project documentation

### Updated Files
- ✅ `package.json` - Added missing dependencies and scripts
- ✅ `DEPLOYMENT_GUIDE.md` - This updated guide
- ✅ `Dockerfile.app` - Fixed build process
- ✅ `Dockerfile` - Fixed build process

## 🎯 Success Indicators

When the project is running correctly, you should see:

### Docker Method
```bash
# Container status
docker ps
# Should show: icos-gui-final (Up)

# Application logs
docker logs icos-gui-final
# Should show: "Ready in XXXms"

# Health check
curl http://localhost:3000
# Should return HTML content
```

### Local Method
```bash
# Development server
npm run dev
# Should show: "Ready - started server on 0.0.0.0:3000"

# Application access
open http://localhost:3000
# Should load the dashboard
```

### Real Server Connection
```bash
# Test connection to ICOS Shell
curl -I "http://YOUR_SERVER_IP:PORT/api/v3/resource/"
# Should return HTTP response (even if 404/405 - server is reachable)
```

## 🔍 Troubleshooting

### If Environment Variables Missing
```bash
# Check if .env.local exists
ls -la .env.local

# Create from template
cp .env.example .env.local
# Edit with your actual server address
```

### If Docker Fails
```bash
# Clean and rebuild
docker system prune -a
docker compose up -d --build
```

### If Local Setup Fails
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### If Server Connection Fails
```bash
# Test network connectivity
ping YOUR_SERVER_IP

# Test API endpoint
curl -I "http://YOUR_SERVER_IP:PORT/api/v3/resource/"

# Check VPN/network access
```

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Environment Config | ✅ Fixed | Proper .env.local support |
| Real Server Connection | ✅ Working | Connected to 10.160.3.20:32500 |
| Token Management | ✅ Dynamic | New token on every login |
| Dependencies | ✅ Fixed | Legacy peer deps configured |
| Docker Build | ✅ Working | Multi-stage build optimized |
| Local Build | ✅ Working | All dependencies resolved |
| Documentation | ✅ Complete | Multiple guides available |
| Auto Setup | ✅ Ready | start.sh script available |

## 🎉 Ready for Distribution

The project is now ready for distribution to other users. They can:

1. **Use Docker** (easiest) - No dependency issues
2. **Use Auto Script** - `./start.sh` handles everything
3. **Use Manual Setup** - Clear instructions provided

All configuration issues have been resolved, and the GUI now connects to the real ICOS Shell server.

---

**Status**: ✅ Production Ready  
**Last Updated**: August 2025  
**Version**: Final Release  
**Server**: Connected to real ICOS Shell  
**Branch**: GUI 