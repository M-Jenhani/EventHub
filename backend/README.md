# EventHub Backend

A comprehensive event management platform backend built with Spring Boot, featuring JWT authentication, role-based access control, real-time notifications via WebSocket, and a complete REST API.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (USER, ADMIN)
  - Secure password encryption with BCrypt

- **Event Management**
  - Create, read, update, delete events
  - Search and filter events by category, location, date
  - Event capacity management
  - File upload for event posters

- **RSVP System**
  - Join/leave events
  - Automatic waitlist when event is full
  - Auto-promotion from waitlist when spots open

- **Real-time Notifications**
  - WebSocket/STOMP integration
  - Real-time RSVP notifications
  - Notification management (read/unread)

- **Admin Dashboard**
  - User management
  - Platform statistics
  - Event oversight

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: PostgreSQL (Production), H2 (Development)
- **Security**: Spring Security + JWT
- **Real-time**: WebSocket + STOMP
- **Build Tool**: Maven
- **ORM**: Spring Data JPA
- **Documentation**: Swagger/OpenAPI (optional)

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (for production)

## 🏃 Getting Started

### Development Mode

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The application will start on `http://localhost:8080` using H2 in-memory database.

3. **Access H2 Console**
   - URL: `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:eventhub`
   - Username: `sa`
   - Password: (leave empty)

### Production Mode

1. **Set environment variables**
   ```bash
   export DATABASE_URL=jdbc:postgresql://localhost:5432/eventhub
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   export JWT_SECRET=your-256-bit-secret-key
   export FRONTEND_URL=https://your-frontend-domain.com
   ```

2. **Build and run**
   ```bash
   mvn clean package
   java -jar target/eventhub-backend-1.0.0.jar --spring.profiles.active=prod
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t eventhub-backend .
   ```

2. **Run container**
   ```bash
   docker run -p 8080:8080 \
     -e DATABASE_URL=jdbc:postgresql://host:5432/eventhub \
     -e DB_USERNAME=username \
     -e DB_PASSWORD=password \
     -e JWT_SECRET=your-secret-key \
     -e FRONTEND_URL=https://frontend.com \
     eventhub-backend
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Event Endpoints

#### Get All Events
```http
GET /api/events
```

#### Get Event by ID
```http
GET /api/events/{id}
```

#### Create Event (Authenticated)
```http
POST /api/events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "description": "Annual tech conference",
  "eventDate": "2024-12-31T18:00:00",
  "location": "San Francisco, CA",
  "capacity": 100,
  "category": "CONFERENCE"
}
```

#### Update Event (Authenticated)
```http
PUT /api/events/{id}
Authorization: Bearer {token}
Content-Type: application/json
```

#### Delete Event (Authenticated)
```http
DELETE /api/events/{id}
Authorization: Bearer {token}
```

#### Search Events
```http
GET /api/events/search?category=CONFERENCE&location=San Francisco
GET /api/events/search/keyword?keyword=tech
```

### RSVP Endpoints

#### Join Event (Authenticated)
```http
POST /api/rsvps/events/{eventId}
Authorization: Bearer {token}
```

#### Cancel RSVP (Authenticated)
```http
DELETE /api/rsvps/events/{eventId}
Authorization: Bearer {token}
```

#### Get My RSVPs (Authenticated)
```http
GET /api/rsvps/my-rsvps
Authorization: Bearer {token}
```

#### Get Event RSVPs
```http
GET /api/rsvps/events/{eventId}
```

### User Endpoints

#### Get Current User (Authenticated)
```http
GET /api/users/me
Authorization: Bearer {token}
```

#### Get All Users (Admin Only)
```http
GET /api/users
Authorization: Bearer {token}
```

#### Get Admin Stats (Admin Only)
```http
GET /api/users/admin/stats
Authorization: Bearer {token}
```

### Notification Endpoints

#### Get Notifications (Authenticated)
```http
GET /api/notifications
Authorization: Bearer {token}
```

#### Get Unread Notifications (Authenticated)
```http
GET /api/notifications/unread
Authorization: Bearer {token}
```

#### Mark as Read (Authenticated)
```http
PUT /api/notifications/{id}/read
Authorization: Bearer {token}
```

#### Mark All as Read (Authenticated)
```http
PUT /api/notifications/read-all
Authorization: Bearer {token}
```

### File Upload Endpoints

#### Upload Event Poster
```http
POST /api/upload/event-poster
Content-Type: multipart/form-data
file: (binary)
```

## 🔌 WebSocket Connection

Connect to WebSocket for real-time notifications:

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
  stompClient.subscribe('/user/queue/notifications', function(message) {
    console.log('Notification:', message.body);
  });
});
```

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/eventhub/
│   │   │   ├── config/          # Configuration classes
│   │   │   ├── controller/      # REST controllers
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── exception/       # Custom exceptions
│   │   │   ├── model/           # JPA entities
│   │   │   ├── repository/      # Data repositories
│   │   │   ├── security/        # Security & JWT
│   │   │   ├── service/         # Business logic
│   │   │   └── EventHubApplication.java
│   │   └── resources/
│   │       └── application.yml  # Configuration
│   └── test/                    # Unit tests
├── uploads/                     # Event poster uploads
├── Dockerfile
├── pom.xml
└── README.md
```

## 🌍 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `mvn clean package`
4. Set start command: `java -jar target/eventhub-backend-1.0.0.jar`
5. Add environment variables (DATABASE_URL, JWT_SECRET, etc.)

### Deploy to Railway

1. Create a new project on Railway
2. Add PostgreSQL service
3. Connect your GitHub repository
4. Railway will auto-detect Spring Boot and deploy

## 🔐 Security Notes

- Change the default JWT secret in production
- Use strong passwords for database
- Enable HTTPS in production
- Configure CORS allowed origins properly

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Production |
| DB_USERNAME | Database username | Production |
| DB_PASSWORD | Database password | Production |
| JWT_SECRET | JWT signing secret (256-bit) | Production |
| FRONTEND_URL | Frontend URL for CORS | Production |
| UPLOAD_DIR | File upload directory | Optional |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.


---

**Made with ❤️ using Spring Boot**
