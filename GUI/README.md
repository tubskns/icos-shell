# ICOS Ecosystem GUI

A Next.js-based web interface for the ICOS Ecosystem that displays cluster topology and deployment information.

## Features

- ✅ **Real-time Data**: Connects directly to ICOS backend server
- ✅ **Authentication**: Secure login with real server credentials
- ✅ **Topology Visualization**: Interactive cluster topology graphs
- ✅ **Universal Deployment**: Works on any system with Docker
- ✅ **Fallback Support**: Graceful handling of connection issues

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- VPN connection to the ICOS testbed (if required)
- Access to the ICOS backend server

### Deployment

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Build and run with Docker:**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application:**
   - Open your browser and go to `http://127.0.0.1:3000`
   - Login with your ICOS credentials

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

3. **Access at `http://localhost:3000`**

## Configuration

### Environment Variables

The application uses the following environment variables:

- `NEXT_PUBLIC_CONTROLLER_ADDRESS`: ICOS backend server address
- `NEXT_PUBLIC_LIGHTHOUSE_ADDRESS`: Lighthouse server address

### Server Configuration

The application connects directly to:
- **Backend Server**: `http://10.160.3.20:32500`
- **API Endpoints**: 
  - Login: `/api/v3/user/login`
  - Resources: `/api/v3/resource/`
  - Deployments: `/api/v3/deployment/`

## Architecture

### Components

- **Authentication**: Direct connection to ICOS backend
- **Topology Graph**: D3.js-based visualization
- **Data Fetching**: Real-time API calls with fallback
- **Error Handling**: Graceful degradation

### Data Flow

1. User logs in → Direct API call to backend
2. Token stored → Used for subsequent requests
3. Data fetched → Real-time cluster information
4. Graph rendered → Interactive topology display

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check VPN connection and server availability
2. **Authentication Failed**: Verify credentials with backend team
3. **No Data Displayed**: Check API endpoints and token validity

### Logs

View application logs:
```bash
docker-compose logs -f app
```

### Updates

To update the application:
```bash
docker-compose stop
docker-compose rm -f
docker-compose up --build -d
```

## API Documentation

### Authentication
- **Method**: GET
- **URL**: `/api/v3/user/login`
- **Parameters**: `username`, `password`
- **Headers**: `accept: application/json`

### Resources
- **Method**: GET
- **URL**: `/api/v3/resource/`
- **Headers**: `api_key: <token>`, `accept: application/json`

## Contributing

1. Make changes to the codebase
2. Test with Docker deployment
3. Ensure universal compatibility
4. Submit pull request

## License

[Add your license information here]
