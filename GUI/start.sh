#!/bin/bash

echo "ICOS GUI - Auto Setup Script"
echo "============================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js >= 16.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version is too old. Please install Node.js >= 16.0.0"
    exit 1
fi

echo "Node.js version: $(node -v)"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Warning: .env.local not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "Created .env.local from .env.example"
        echo "IMPORTANT: Please edit .env.local with your ICOS Shell server address"
        echo "Example: NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER:PORT/api/v3"
        echo ""
        echo "Press Enter to continue after editing .env.local..."
        read
    else
        echo "Error: .env.example not found. Please create .env.local manually"
        echo "Required: NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER:PORT/api/v3"
        exit 1
    fi
else
    echo "Found .env.local"
fi

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Docker detected - Using Docker deployment (recommended)"
    
    # Stop any existing containers
    docker compose down 2>/dev/null
    
    # Build and start
    echo "Building and starting Docker containers..."
    docker compose up -d --build
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "Docker deployment successful!"
        echo "Access the application at: http://localhost:3000"
        echo ""
        echo "To stop: docker compose down"
        echo "To view logs: docker compose logs -f"
    else
        echo "Docker deployment failed. Trying local setup..."
        run_local_setup
    fi
else
    echo "Docker not available. Using local Node.js setup..."
    run_local_setup
fi

run_local_setup() {
    echo ""
    echo "Local Node.js Setup"
    echo "=================="
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        echo "Dependencies installed successfully"
        
        # Start development server
        echo "Starting development server..."
        echo "Access the application at: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop the server"
        npm run dev
    else
        echo "Failed to install dependencies"
        exit 1
    fi
}

echo ""
echo "Setup complete! Check the URLs above to access the application."
echo ""
echo "Important Notes:"
echo "- All data is fetched from real ICOS Shell server"
echo "- New authentication token generated on every login"
echo "- No mock data - everything is live"
echo "- Edit .env.local to change server address"
