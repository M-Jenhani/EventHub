# EventHub - Complete Event Management Platform

<div align="center">
  
  ![EventHub Logo](https://via.placeholder.com/150)
  
  **A production-ready, full-stack event management platform**
  
  [![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![Angular](https://img.shields.io/badge/Angular-17-red.svg)](https://angular.io/)
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

EventHub is a comprehensive event management platform that allows users to create, discover, and manage events with real-time notifications, RSVP functionality, and role-based access control. Built with modern technologies and best practices, it's ready for production deployment.

## ✨ Features

### Core Features
- ✅ **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access (USER, ADMIN)
  - Secure password encryption
  - Persistent login sessions

- ✅ **Event Management**
  - Create, read, update, delete events
  - Rich event details (title, description, date, location, capacity, category)
  - Event posters/images
  - Search and filter by category, location, date, keyword

- ✅ **RSVP System**
  - Join/leave events
  - Automatic waitlist management
  - Auto-promotion from waitlist when spots open
  - Real-time capacity tracking

- ✅ **Real-time Notifications**
  - WebSocket/STOMP integration
  - Instant RSVP notifications
  - Event updates and reminders
  - Unread notification badges

- ✅ **User Dashboard**
  - View created events
  - View RSVPs (upcoming & past)
  - Event statistics
  - Quick actions

- ✅ **Admin Dashboard**
  - Platform statistics with charts
  - User management
  - Event oversight
  - Analytics

- ✅ **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop optimized
  - Dark mode support
  - Material Design UI

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL (Production), H2 (Development)
- **ORM**: Spring Data JPA
- **WebSocket**: Spring WebSocket + STOMP
- **Build Tool**: Maven

### Frontend
- **Framework**: Angular 17 (Standalone Components)
- **UI Library**: Angular Material
- **State Management**: RxJS
- **WebSocket**: @stomp/stompjs
- **Charts**: Chart.js
- **Styling**: SCSS + CSS Variables

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (Frontend)
- **CI/CD**: GitHub Actions (optional)

## 🏗️ Architecture

```
EventHub/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/java/com/eventhub/
│   │   │   ├── config/     # Security, WebSocket, CORS
│   │   │   ├── controller/ # REST endpoints
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── exception/  # Exception handling
│   │   │   ├── model/      # JPA entities
│   │   │   ├── repository/ # Data access layer
│   │   │   ├── security/   # JWT, UserDetails
│   │   │   └── service/    # Business logic
│   │   └── resources/
│   │       └── application.yml
│   ├── Dockerfile
│   ├── pom.xml
│   └── README.md
│
├── frontend/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Standalone components
│   │   │   ├── services/   # HTTP & business services
│   │   │   ├── interceptors/
│   │   │   ├── guards/
│   │   │   └── models/
│   │   ├── environments/
│   │   └── assets/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── angular.json
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml       # Full stack deployment
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Java 17+** and Maven 3.6+
- **Node.js 18+** and npm
- **Docker** and Docker Compose (optional)
- **PostgreSQL** (for production)

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EventHub
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - API Docs: http://localhost:8080/swagger-ui.html (if configured)

4. **Stop services**
   ```bash
   docker-compose down
   ```

### Option 2: Manual Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Run in development mode (H2 database)**
   ```bash
   mvn spring-boot:run
   ```

3. **Or build and run**
   ```bash
   mvn clean package
   java -jar target/eventhub-backend-1.0.0.jar
   ```

4. **Access H2 Console** (Development only)
   - URL: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:eventhub`
   - Username: `sa`
   - Password: (empty)

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm start
   ```

4. **Access application**
   - URL: http://localhost:4200

## 📦 Deployment

### Backend Deployment

#### Deploy to Render

1. Create a new Web Service
2. Connect GitHub repository
3. Set build command: `mvn clean package`
4. Set start command: `java -jar target/eventhub-backend-1.0.0.jar`
5. Add environment variables:
   ```
   DATABASE_URL=<postgres-url>
   DB_USERNAME=<db-user>
   DB_PASSWORD=<db-password>
   JWT_SECRET=<your-secret-key>
   FRONTEND_URL=<frontend-url>
   ```

#### Deploy to Railway

1. Create new project
2. Add PostgreSQL service
3. Connect GitHub repo
4. Railway auto-detects Spring Boot
5. Configure environment variables

### Frontend Deployment

#### Deploy to Vercel

```bash
cd frontend
npm install -g vercel
vercel
```

#### Deploy to Netlify

1. Build: `npm run build`
2. Deploy: `netlify deploy --prod --dir=dist/eventhub-frontend`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Event Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all events | No |
| GET | `/api/events/{id}` | Get event by ID | No |
| POST | `/api/events` | Create event | Yes |
| PUT | `/api/events/{id}` | Update event | Yes (Owner/Admin) |
| DELETE | `/api/events/{id}` | Delete event | Yes (Owner/Admin) |
| GET | `/api/events/search` | Search events | No |
| GET | `/api/events/upcoming` | Get upcoming events | No |

### RSVP Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/rsvps/events/{eventId}` | Join event | Yes |
| DELETE | `/api/rsvps/events/{eventId}` | Leave event | Yes |
| GET | `/api/rsvps/my-rsvps` | Get my RSVPs | Yes |
| GET | `/api/rsvps/events/{eventId}` | Get event RSVPs | No |

### User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/me` | Get current user | Yes |
| GET | `/api/users` | Get all users | Yes (Admin) |
| GET | `/api/users/admin/stats` | Get platform stats | Yes (Admin) |
| DELETE | `/api/users/{id}` | Delete user | Yes (Admin) |

For complete API documentation with request/response examples, see [backend/README.md](backend/README.md).

## 📸 Screenshots

### Home Page - Event List
![Event List](https://via.placeholder.com/800x400?text=Event+List+Screenshot)

### Event Details
![Event Details](https://via.placeholder.com/800x400?text=Event+Details+Screenshot)

### User Dashboard
![User Dashboard](https://via.placeholder.com/800x400?text=User+Dashboard+Screenshot)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard+Screenshot)

### Dark Mode
![Dark Mode](https://via.placeholder.com/800x400?text=Dark+Mode+Screenshot)

## 🔒 Security

- JWT token authentication with 24-hour expiration
- Password encryption using BCrypt
- CORS configuration for allowed origins
- SQL injection prevention via JPA
- XSS protection with Angular sanitization
- CSRF token handling
- Secure WebSocket connections

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Mahdi Jenhani** - [GitHub](https://github.com/M-Jenhani)

## 🙏 Acknowledgments

- Spring Boot community
- Angular team
- Material Design
- All contributors


---

<div align="center">
  
  **Built with ❤️ using Spring Boot & Angular**
  
  ⭐ Star this repo if you find it helpful!
  
</div>
