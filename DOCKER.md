# EventHub - Docker Setup Guide

## Quick Start

### Prerequisites
- Docker & Docker Compose installed
- At least 2GB free disk space

### Run the Application

```bash
# Navigate to project root
cd EventHub

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

The application will be available at:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

---

## Default Credentials

### Admin Account
- Email: `admin@eventhub.tn`
- Password: `admin123`

### Sample Users
- Email: `ahmed.ben.salem@gmail.com`
- Email: `fatma.trabelsi@gmail.com`
- Email: `mohamed.hamdi@gmail.com`
- Email: `leila.gharbi@gmail.com`
- Email: `karim.bouazizi@gmail.com`

All sample users have password: `password123`

### Database
- Username: `eventhub`
- Password: `eventhub123`
- Database: `eventhub`

---

## Useful Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (clean reset)
docker-compose down -v

# Rebuild images
docker-compose build

# Rebuild and restart
docker-compose up --build

# Access database
docker exec -it eventhub-postgres psql -U eventhub -d eventhub

# Access backend container shell
docker exec -it eventhub-backend sh

# Access frontend container shell
docker exec -it eventhub-frontend sh
```

---

## Architecture

```
EventHub (Port 80)
    ├── Frontend (Nginx)
    │   └── Angular App
    │
    └── Backend API (Port 8080)
        └── Spring Boot
            └── PostgreSQL (Port 5432)
```

- **Frontend**: Multi-stage build (Node.js → Nginx)
- **Backend**: Multi-stage build (Maven → JRE)
- **Database**: PostgreSQL 15 with persistent volume

---

## Configuration

Edit `.env` file to customize:
- Port mappings
- Database credentials
- JWT secret
- CORS allowed origins

Example:
```env
POSTGRES_PORT=5432
BACKEND_PORT=8080
FRONTEND_PORT=80
FRONTEND_URL=http://localhost
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild
docker-compose down -v
docker-compose up --build
```

### Database connection issues
```bash
# Verify database is running
docker exec eventhub-postgres pg_isready -U eventhub

# Check backend logs
docker-compose logs backend
```

### Port already in use
Edit `.env` and change port mappings, then restart:
```bash
docker-compose down
docker-compose up -d
```

---

## Production Considerations

For production deployment:
1. Change all default passwords in `.env`
2. Set `SPRING_PROFILES_ACTIVE=prod`
3. Use environment-specific configuration
4. Enable HTTPS
5. Use managed database service (RDS, Cloud SQL)
6. Implement proper backup strategy
7. Use container registry (Docker Hub, ECR, GCR)

---

## Files

- `docker-compose.yml` - Orchestration configuration
- `backend/Dockerfile` - Backend build configuration
- `frontend/Dockerfile` - Frontend build configuration
- `frontend/nginx.conf` - Web server configuration
- `.env` - Environment variables
- `.dockerignore` - Files to exclude from Docker builds

