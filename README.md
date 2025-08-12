# icosguiaug5v1 - 29 July Final Version

A production-ready dashboard with hierarchical topology visualization, project management, and metrics tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- Docker (optional, for containerized deployment)

### Installation & Setup

#### Method 1: Local Development
```bash
# Clone the repository
git clone <repository-url>
cd icosguiaug4v5

# Install dependencies with legacy peer deps (IMPORTANT!)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

#### Method 2: Docker Deployment (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd icosguiaug4v5

# Build and run with Docker Compose
docker compose up -d

# Access the application
open http://localhost:3000
```

## 🔧 Configuration

### Environment Variables
Create a `config_local.yml` file in the root directory:
```yaml
# API Configuration
apiBaseUrl: "http://your-api-server:port"
jobManagerUrl: "http://your-job-manager:port"
```

### Authentication
The application uses dynamic token authentication. Tokens are automatically managed and refreshed.

## 📁 Project Structure

```
icosguiaug4v5/
├── components/          # React components
├── pages/              # Next.js pages
├── styles/             # CSS/SCSS files
├── utils/              # Utility functions
├── config.js           # Configuration
├── docker-compose.yml  # Docker configuration
└── Dockerfile.app      # Production Dockerfile
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `docker compose up -d` - Start with Docker

## 🔍 Troubleshooting

### Common Issues

#### 1. Dependency Conflicts
If you encounter peer dependency conflicts:
```bash
npm install --legacy-peer-deps
```

#### 2. Build Failures
If the build fails due to missing dependencies:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 3. Docker Build Issues
If Docker build fails:
```bash
# Clean Docker cache
docker system prune -a
# Rebuild
docker compose up -d --build
```

### Dependencies Note
This project uses some packages with peer dependency conflicts. The `--legacy-peer-deps` flag is required for installation to handle these conflicts gracefully.

## 🌐 Features

- **Hierarchical Topology Visualization** - Interactive D3.js graphs
- **Project Management** - Create, deploy, and manage projects
- **Metrics Tracking** - Real-time metrics and analytics
- **Authentication** - Dynamic token-based authentication
- **Responsive Design** - Works on desktop and mobile
- **Dark/Light Mode** - Theme switching capability

## 🔐 Security

- No hardcoded tokens
- Dynamic authentication
- Secure API communication
- Production-ready Docker configuration

## 📞 Support

For issues or questions, please check the troubleshooting section above or contact the development team.

## 📄 License

Proprietary - ICOS Development Team
