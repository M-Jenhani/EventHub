# EventHub Frontend

A modern, responsive event management platform frontend built with Angular 17 standalone components, Material UI, and real-time WebSocket notifications.

## 🚀 Features

- **Modern Angular Architecture**
  - Standalone components (no NgModules)
  - Reactive programming with RxJS
  - Lazy-loaded routes
  - Strongly-typed models

- **Authentication & Authorization**
  - JWT token management
  - HTTP interceptors for auth
  - Route guards (auth & admin)
  - Persistent login state

- **Event Management**
  - Browse and filter events
  - Create/edit events with rich forms
  - RSVP system with real-time updates
  - Search and filtering by category, location, date

- **User Experience**
  - Responsive design (mobile-first)
  - Dark mode toggle
  - Material Design UI
  - Real-time notifications via WebSocket
  - Smooth animations and transitions

- **Dashboards**
  - User dashboard (my events, RSVPs)
  - Admin dashboard (stats, user management)
  - Charts and analytics (Chart.js)

## 🛠️ Tech Stack

- **Framework**: Angular 17
- **UI Library**: Angular Material
- **State Management**: RxJS
- **HTTP Client**: Angular HttpClient
- **WebSocket**: @stomp/stompjs
- **Charts**: Chart.js + ng2-charts
- **Styling**: SCSS with CSS variables
- **Build Tool**: Angular CLI

## 📋 Prerequisites

- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`

## 🏃 Getting Started

### Development Mode

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'http://localhost:8080/ws'
   };
   ```

3. **Run development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

### Production Build

1. **Build for production**
   ```bash
   npm run build
   ```
   Output will be in `dist/eventhub-frontend`

2. **Serve production build**
   ```bash
   npx http-server dist/eventhub-frontend -p 4200
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t eventhub-frontend .
   ```

2. **Run container**
   ```bash
   docker run -p 80:80 eventhub-frontend
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/        # Standalone components
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── event-list/
│   │   │   ├── event-detail/
│   │   │   ├── event-form/
│   │   │   ├── user-dashboard/
│   │   │   └── admin-dashboard/
│   │   ├── services/          # Business logic services
│   │   │   ├── auth.service.ts
│   │   │   ├── event.service.ts
│   │   │   ├── rsvp.service.ts
│   │   │   ├── notification.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── theme.service.ts
│   │   │   └── websocket.service.ts
│   │   ├── interceptors/      # HTTP interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── guards/            # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── models/            # TypeScript interfaces
│   │   │   └── models.ts
│   │   ├── app.component.ts   # Root component
│   │   ├── app.routes.ts      # Route configuration
│   │   └── app.config.ts      # Application config
│   ├── environments/          # Environment configs
│   ├── assets/                # Static assets
│   ├── styles.scss            # Global styles
│   └── index.html             # HTML entry point
├── angular.json               # Angular configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── Dockerfile                 # Docker configuration
├── nginx.conf                 # Nginx config for production
└── README.md
```

## 🎨 Features Walkthrough

### Authentication Flow
1. User registers or logs in
2. JWT token stored in localStorage
3. Token automatically attached to requests via interceptor
4. Protected routes require authentication

### Event Management
- Browse events with filters (category, location, keyword)
- View event details with RSVP status
- Create/edit events (authenticated users)
- Admin can manage all events

### RSVP System
- Join events (auto-waitlist if full)
- Leave events (auto-promotes waitlist)
- Real-time notifications via WebSocket
- View your RSVPs in dashboard

### Dark Mode
- Toggle between light and dark themes
- Preference saved to localStorage
- CSS variables for theming

## 🌐 Deployment

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Follow prompts to deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag `dist/eventhub-frontend` to Netlify drop zone
3. Configure redirects in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### Environment Variables

For production deployments, update environment variables:

| Variable | Description |
|----------|-------------|
| `apiUrl` | Backend API URL |
| `wsUrl` | WebSocket server URL |

## 🔧 Development

### Generate Components
```bash
ng generate component components/my-component --standalone
```

### Generate Services
```bash
ng generate service services/my-service
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
ng lint
```

## 🎨 Theming & Customization

Themes are defined in `src/styles.scss` using CSS variables:

```scss
:root {
  --bg-color: #fafafa;
  --surface-color: #ffffff;
  --text-color: #333333;
  --primary-color: #3f51b5;
  --accent-color: #ff4081;
}

body.dark-theme {
  --bg-color: #121212;
  --surface-color: #1e1e1e;
  --text-color: #ffffff;
  // ...
}
```

Modify these variables to customize the theme.

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Security

- JWT tokens in HTTP-only headers
- XSS protection via Angular sanitization
- CSRF protection
- Secure WebSocket connections (WSS in production)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Angular 17**
