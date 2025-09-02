ICOS GUI - Deployment Package (GUI branch)
=========================================

What this package contains
- GUI branch with split commits: config, auth, projects, pages, metrics
- No local secrets. Example env in .env.example
- Ready to push to a new remote and deploy

Requirements
- Node.js >= 16 and npm >= 8
- Or Docker (optional)

Quick Start (local)
1) Copy .env.example to .env.local and set the real Shell URL
   cp .env.example .env.local
   # edit .env.local if needed

2) Install and run
   npm install --legacy-peer-deps
   npm run dev
   # open http://localhost:3000

Server endpoints used
- Deployments:   GET/PUT/DELETE {CONTROLLER}/deployment(...)
- Controllers:   GET {CONTROLLER}/controller/
- Resources:     GET {CONTROLLER}/resource/
- Metrics:       GET/POST {CONTROLLER}/metrics/(get|train|predict|delete)
- Auth:          GET {CONTROLLER}/user/login (username/password[/otp])
- Header:        api_key: <token>

Docker (optional)
- docker compose up -d --build

Pushing this code to GitLab
A) Using the git bundle file (recommended)
   git clone icos-gui-GUI.bundle -b GUI icos-gui
   cd icos-gui
   git remote add origin <YOUR_GITLAB_REPO_URL>
   # If 2FA enabled use PAT for HTTPS or ensure SSH key is added
   git push -u origin GUI

B) Using the source archive (tar/zip)
   Extract archive, init git and push:
   tar -xzf icos-gui-GUI-src.tar.gz
   cd icos-gui-GUI-src
   git init
   git add -A
   git commit -m "init: import GUI package"
   git branch -M GUI
   git remote add origin <YOUR_GITLAB_REPO_URL>
   git push -u origin GUI

Notes
- Do not commit .env.local or config_local.yml
- Authentication uses Shell user/login and stores token as api_key
- All data is fetched live after login from the real Shell server
