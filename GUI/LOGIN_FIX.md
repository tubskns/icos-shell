# Login Issue Fix Documentation

## Problem
Login requests were being sent to localhost instead of the actual ICOS Shell server, causing authentication failures.

## Root Cause
The `NEXT_PUBLIC_CONTROLLER_ADDRESS` environment variable was not configured, causing the application to default to an empty string and resulting in requests to local paths.

## Solution

### 1. Create `.env.local` file in the GUI directory
```bash
cd GUI
cp .env.example .env.local
```

### 2. Update `.env.local` with your ICOS Shell server address
```bash
# Edit .env.local and set:
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://YOUR_SERVER_IP:PORT/api/v3
```

### 3. Restart the development server
```bash
# Stop any running server (Ctrl+C)
# Start from the GUI directory:
cd GUI
npm run dev
```

## Verification
After applying these changes:
- Login requests will be sent to: `http://YOUR_SERVER_IP:PORT/api/v3/user/login`
- Check browser DevTools Network tab to confirm requests are going to the correct server
- The server logs should show: `Reload env: .env.local`

## Example Configuration
For the staging environment:
```
NEXT_PUBLIC_CONTROLLER_ADDRESS=http://10.160.3.20:32500/api/v3
NEXT_PUBLIC_CONTROLLER_TIMEOUT=15000
```

## Important Notes
- Never commit `.env.local` to version control
- Always run the server from the `GUI` directory, not the repository root
- The environment variable MUST be prefixed with `NEXT_PUBLIC_` to be accessible in the browser
