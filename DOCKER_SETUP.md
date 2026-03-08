# 🐳 Docker Setup Guide

## Prerequisites

- Docker Desktop installed ([Download Here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)
- All required API keys (Groq, Google Gemini, etc.)

## Quick Start

### 1. **Set Up Environment Variables**

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```env
GROQ_API_KEY=your_actual_key
GOOGLE_GENAI_API_KEY=your_actual_key
ANTHROPIC_API_KEY=your_actual_key
UNSPLASH_API_KEY=your_actual_key
OPENWEATHER_API_KEY=your_actual_key
MONGO_PASSWORD=your_mongodb_password
JWT_SECRET=your_secret_key
```

### 2. **Build and Start Services**

```bash
# From project root
docker-compose up --build
```

This will:

- ✅ Build the frontend (Vite)
- ✅ Build the backend (Node.js + Express)
- ✅ Start MongoDB service
- ✅ Start the application server
- ✅ Health check all services

Wait for output:

```
travel-assistant-app  | Server running on http://localhost:5000
```

### 3. **Access the Application**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **MongoDB:** localhost:27017 (admin/your_password)

### 4. **Stop Services**

```bash
docker-compose down
```

To also remove volumes (persistent data):

```bash
docker-compose down -v
```

---

## Common Commands

### Run in foreground (see logs)

```bash
docker-compose up
```

### Run in background

```bash
docker-compose up -d
```

### View logs

```bash
docker-compose logs -f app      # App logs
docker-compose logs -f mongodb  # DB logs
```

### Rebuild after code changes

```bash
docker-compose up --build
```

### Stop all services

```bash
docker-compose stop
```

### Remove everything (containers, networks, volumes)

```bash
docker-compose down -v
```

### Access MongoDB shell

```bash
docker-compose exec mongodb mongosh -u admin -p
```

### Rebuild specific service

```bash
docker-compose build app
docker-compose up app
```

---

## File Structure

```
.
├── Dockerfile              # Production-ready multistage build
├── docker-compose.yml      # Orchestration config
├── .dockerignore          # Files to exclude from build
├── .env.example           # Template for environment variables
├── .env                   # Actual env vars (created by you)
├── backend/               # Node.js + Express server
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── ...
└── travel-planner-fronted/  # React + Vite frontend
    ├── src/
    ├── vite.config.js
    ├── package.json
    └── ...
```

---

## Troubleshooting

### Problem: "Port 5000 already in use"

```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9
```

### Problem: "MongoDB connection failed"

```bash
# Check if MongoDB container is running
docker-compose ps

# View MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Problem: "Module not found" error

```bash
# Rebuild without cache
docker-compose build --no-cache
docker-compose up
```

### Problem: "Cannot connect to Docker daemon"

- Ensure Docker Desktop is running
- Restart Docker Desktop

### Problem: Build takes too long

```bash
# Use .dockerignore to exclude node_modules
# Check .dockerignore file has node_modules/
docker-compose build --no-cache
```

---

## Performance Tips

1. **Use `.dockerignore`** - Speeds up build (file already configured)
2. **Mount volumes for development:**

```bash
# Edit docker-compose.yml to add:
    volumes:
      - ./travel-planner-fronted/src:/app/frontend/src
      - ./backend/src:/app/backend/src
```

3. **Use multi-stage builds** - Already done in Dockerfile (reduces image size)

4. **Layer caching** - Dependencies layer is separate from code layer

---

## Production Deployment

### Before deploying to production:

1. **Update `.env` with production values:**

   ```env
   NODE_ENV=production
   JWT_SECRET=strong_random_secret_key
   MONGO_PASSWORD=strong_database_password
   ```

2. **Build production image:**

   ```bash
   docker build -t travel-assistant:v1.0 .
   ```

3. **Test production build locally:**

   ```bash
   docker run -p 5000:5000 -p 3000:3000 \
     --env-file .env \
     travel-assistant:v1.0
   ```

4. **Push to registry (Docker Hub/ECR/GCR):**

   ```bash
   docker tag travel-assistant:v1.0 yourrepo/travel-assistant:v1.0
   docker push yourrepo/travel-assistant:v1.0
   ```

5. **Deploy to cloud (Heroku/AWS/GCP/Azure)**

---

## Docker Architecture

```
┌─────────────────────────────────────────────┐
│        Docker Compose Network                │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────╖    ┌──────────────┐  │
│  │  App Container   ║    │   MongoDB    │  │
│  ├──────────────────╢    ├──────────────┤  │
│  │ - Node.js        ║    │  Port 27017  │  │
│  │ - Frontend Build ║    │  Volume:     │  │
│  │ - Backend Server ║    │  - db        │  │
│  │ Port 5000        ║    │  - configdb  │  │
│  │ Port 3000        ║    └──────────────┘  │
│  └──────────────────╜         ▲            │
│         ▲                      │            │
│         └──────────────────────┘            │
│                                              │
└──────────────────┬──────────────────────────┘
                   │
            Host Machine
            (localhost:5000)
```

---

## Next Steps After Docker Setup

✅ Docker running locally  
⬜ TASK 1.2: Deploy to Heroku  
⬜ TASK 1.3: User Feedback System  
⬜ TASK 1.4: BLEU/ROUGE Metrics

After Docker is verified working, proceed to Heroku deployment.

---

## Need Help?

Common issues and solutions in [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Last Updated:** February 13, 2026  
**Docker Version:** v20.10+  
**Docker Compose Version:** v2.0+
