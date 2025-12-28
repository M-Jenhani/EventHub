# EventHub

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github)](https://eventhub-demo25.vercel.app)

🌐 Live Demo : [https://eventhub-demo25.vercel.app](https://eventhub-demo25.vercel.app)
*Note: The backend is hosted on Render's free tier. If the site takes time to load, it may be waking up due to inactivity.*
---

# EventHub - Event Management Platform

A full-stack event management application built with Spring Boot and Angular.

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Access the app
# Frontend: http://localhost
# Backend: http://localhost:8080
```

### Option 2: Manual

**Backend**
```bash
cd backend
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm start
# Access at http://localhost:4200
```

## Default Credentials

- **Admin**: admin@eventhub.tn / admin123
- **Sample Users**: 
  - ahmed.ben.salem@gmail.com / password123
  - fatma.trabelsi@gmail.com / password123
  - (5 more sample users available)

## Tech Stack

- **Backend**: Spring Boot 3.2 + PostgreSQL + Spring Security + JWT
- **Frontend**: Angular 17 + Material Design + RxJS
- **Real-time**: WebSocket/STOMP
- **DevOps**: Docker + Docker Compose + Nginx

## Features

- ✅ User authentication (JWT)
- ✅ Event CRUD operations
- ✅ RSVP system with waitlist
- ✅ Real-time WebSocket notifications
- ✅ User & Admin dashboards
- ✅ Responsive design + Dark mode
- ✅ Role-based access control

## Project Structure

```
EventHub/
├── backend/          # Spring Boot API
├── frontend/         # Angular app
├── docker-compose.yml
└── DOCKER.md        # Docker documentation
```

## API Endpoints

🌐 Backend URL : [https://eventhub-backend-z1da.onrender.com](https://eventhub-backend-z1da.onrender.com)  

### Events
- `GET /api/events` - List all events
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### RSVP
- `POST /api/rsvps/events/{eventId}` - Join event
- `DELETE /api/rsvps/events/{eventId}` - Leave event
- `GET /api/rsvps/my-rsvps` - Get my RSVPs

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/admin/stats` - Admin statistics

## Development

### Backend Development
```bash
cd backend
# Development mode (H2 database)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# Production mode (PostgreSQL)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

### Frontend Development
```bash
cd frontend
npm install
npm start
# Hot reload enabled
```

## Environment Configuration

Edit `.env` file to customize:
- Port mappings
- Database credentials
- JWT secret
- CORS origins

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker-compose logs backend

# Reset database
docker-compose down -v
docker-compose up -d
```

### Frontend can't connect to API
- Ensure backend is running on port 8080
- Check nginx.conf proxy settings
- Verify environment.prod.ts uses `/api` not `http://localhost:8080`

### Database errors
- Check PostgreSQL container: `docker-compose ps`
- Verify database credentials in `.env`
- Reset with: `docker-compose down -v`

## Docker Deployment

See [DOCKER.md](DOCKER.md) for:
- Container management commands
- Useful troubleshooting tips
- Production considerations

## Key Files

- `backend/src/main/resources/application.yml` - Spring Boot config
- `frontend/src/environments/` - Environment configs
- `docker-compose.yml` - Full stack orchestration
- `frontend/nginx.conf` - Web server routing
- `.env` - Environment variables

## Database Schema

**Key Tables:**
- `users` - User accounts
- `events` - Event listings
- `rsvps` - Attendee registrations (CONFIRMED/WAITLIST)
- `notifications` - User notifications

Data is automatically initialized with sample Tunisian users and events on first startup.

## Performance Notes

- Frontend builds with production optimization
- Backend uses JPA for efficient queries
- WebSocket for real-time updates
- Database indexes on frequently queried fields

## Security

- JWT authentication (24h expiration)
- BCrypt password encryption
- CORS configured
- SQL injection protected via JPA
- XSS prevention with Angular sanitization

## License

MIT License

## Support

- Check logs: `docker-compose logs <service>`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d`
