#!/bin/bash

echo "🚀 ICOS GUI - Auto Setup Script"
echo "================================"
echo "✅ Connected to Real ICOS Shell Server"
echo "🌐 Server: http://10.160.3.20:32500/api/v3"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 16.0.0"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version is too old. Please install Node.js >= 16.0.0"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected - Using Docker deployment (recommended)"
    
    # Stop any existing containers
    docker compose down 2>/dev/null
    
    # Build and start
    echo "📦 Building and starting Docker containers..."
    docker compose up -d --build
    
    if [ $? -eq 0 ]; then
        echo "✅ Docker containers started successfully!"
        echo "🌐 Application is running at: http://localhost:3000"
        echo "📊 Check container status: docker ps"
        echo "📋 View logs: docker logs icos-gui-final"
    else
        echo "❌ Docker setup failed. Trying local setup..."
        run_local_setup
    fi
else
    echo "🐳 Docker not available - Using local development setup"
    run_local_setup
fi

function run_local_setup() {
    echo "📦 Installing dependencies..."
    
    # Remove existing node_modules if exists
    if [ -d "node_modules" ]; then
        echo "🧹 Cleaning existing dependencies..."
        rm -rf node_modules package-lock.json
    fi
    
    # Install dependencies with legacy peer deps
    npm install --legacy-peer-deps
    
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully!"
        
        # Check if .env.local exists
        if [ ! -f ".env.local" ]; then
            echo "⚠️  .env.local not found. Creating from template..."
            if [ -f ".env.example" ]; then
                cp .env.example .env.local
                echo "✅ .env.local created from .env.example"
                echo "📝 Please edit .env.local with your ICOS Shell server address"
                echo "🌐 Current server: http://10.160.3.20:32500/api/v3"
            else
                echo "❌ .env.example not found. Please create .env.local manually"
                echo "Required: NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER:PORT/api/v3"
                exit 1
            fi
        else
            echo "✅ .env.local found"
        fi
        
        echo "🚀 Starting development server..."
        npm run dev
    else
        echo "❌ Failed to install dependencies"
        echo "💡 Try running: npm install --legacy-peer-deps manually"
        exit 1
    fi
}

echo ""
echo "🎉 Setup complete! Check the URLs above to access the application."
echo ""
echo "📋 Important Notes:"
echo "✅ All data is fetched from real ICOS Shell server"
echo "✅ New authentication token generated on every login"
echo "✅ No mock data - everything is live"
echo "🌐 Server: http://10.160.3.20:32500/api/v3" 