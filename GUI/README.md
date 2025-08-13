<<<<<<< HEAD
## ICOS Ecosystem GUI

A Next.js-based web interface for the ICOS Shell that displays cluster topology, deployments, resources, and metrics — all fetched live from the real server after user login.

### Key Features
- Real-time data from ICOS Shell after login (no mocks, no hardcoded tokens)
- Authentication via Shell `/user/login` (username/password, optional OTP)
- Topology visualization and deployments view
- Metrics listing and actions (train/predict/delete)
- Works locally (Node.js) or with Docker

## Quick Start

### Prerequisites
- Node.js ≥ 16 and npm ≥ 8 (or Docker & Docker Compose)
- Network/VPN access to your ICOS Shell instance

### Environment
Create `.env.local` (or use `.env.example`):
```
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://10.160.3.20:32500/api/v3
NEXT_PUBLIC_CONTROLLER_TIMEOUT=15000
```

### Development
```
npm install --legacy-peer-deps
npm run dev
# http://localhost:3000
```

### Docker
```
docker compose up -d --build
# http://127.0.0.1:3000
```

## Configuration

- `NEXT_PUBLIC_CONTROLLER_ADDRESS`: Base URL of ICOS Shell (no trailing slash)
- `NEXT_PUBLIC_CONTROLLER_TIMEOUT`: Request timeout in ms (optional)

No Lighthouse variable is used.

## Data Flow

1) Login via `/user/login` → token (string)
2) Store token as `api_key`
3) Use `api_key` for all subsequent requests
4) Fetch and render deployments/controllers/resources/metrics

## Shell API (used by GUI)

- Auth: GET `/user/login` (query: username, password, otp?)
- Resources: GET `/resource/`
- Controllers: GET `/controller/`
- Deployments: GET `/deployment/`, PUT `/deployment/{id}/start|stop`, DELETE `/deployment/{id}`
- Metrics: GET `/metrics/get`, POST `/metrics/train|predict|delete`

Headers: `api_key: <token>` (+ `accept: application/json` where applicable)

## Troubleshooting

- Connection refused → check VPN/connectivity and controller address
- 401 → credentials/token; login again
- 204/empty → valid; verify Shell state

## Deployment Updates
```
docker compose stop
docker compose rm -f
docker compose up -d --build
```

## Contributing

- Work on branch `GUI`; do not commit secrets
- Ensure all data fetched live with `api_key`
- Group changes by area (config/auth/projects/pages/metrics) in commits

## License

Apache-2.0

🇪🇺 This work has received funding from the European Union's HORIZON research and innovation programme under grant agreement No. 101070177.

=======
>>>>>>> d06f9c431af588ddbf5309434a52ceaf42a6d58e
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

<<<<<<< HEAD
The ICOS Shell GUI is released under the Apache license 2.0.
Copyright © 2022-2025 Rasool Seyghaly, Polytechnic University of Catalonia and Marc Michalke, Technische Universität Braunschweig. All rights reserved.

🇪🇺 This work has received funding from the European Union's HORIZON research and innovation programme under grant agreement No. 101070177.
=======
[Add your license information here]
>>>>>>> d06f9c431af588ddbf5309434a52ceaf42a6d58e
