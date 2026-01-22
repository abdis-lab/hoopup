# Hoopsesh 🏀

**Live Demo:** [hoopsesh.me](https://hoopsesh.me)

Hoopsesh is a full-stack web application that connects basketball players by helping them find courts and organize pickup games. Users can create sessions at their favorite courts, join games, and build a community of basketball enthusiasts.

![Hoopsesh Screenshot](https://via.placeholder.com/800x400?text=Add+Your+Screenshot+Here)

---

## Features

- **User Authentication** - Secure registration and login with JWT token-based authentication
- **Session Management** - Create basketball sessions with location, date, time, and notes
- **Join/Leave Sessions** - Players can easily join or leave sessions
- **Real-time Updates** - Session attendee lists update dynamically
- **Persistent Sessions** - Stay logged in across browser sessions
- **Responsive Design** - Works seamlessly on desktop and mobile devices

---

## Tech Stack

### Frontend
- **React 19** - Modern UI library for building interactive interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Spring Boot 3.x** - Java framework for building REST APIs
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database abstraction layer
- **PostgreSQL** - Relational database for data persistence
- **JWT (JSON Web Tokens)** - Secure stateless authentication
- **Maven** - Dependency management and build tool

### DevOps & Infrastructure
- **Digital Ocean App Platform** - Cloud hosting and deployment
- **Digital Ocean Managed Database** - PostgreSQL database hosting
- **Docker** - Containerization for consistent deployments
- **GitHub Actions** - CI/CD pipeline for automatic deployments
- **Custom Domain** - Professional domain with SSL/HTTPS

---

## Architecture

Hoopsesh follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────┐         HTTPS          ┌──────────────────┐
│   React Frontend│  ◄──────────────────►  │  Spring Boot API │
│  (hoopsesh.me)  │     REST API + JWT     │ (api.hoopsesh.me)│
└─────────────────┘                        └──────────────────┘
                                                     │
                                                     │ JDBC
                                                     ▼
                                            ┌──────────────────┐
                                            │   PostgreSQL DB  │
                                            │ (Digital Ocean)  │
                                            └──────────────────┘
```

### Key Design Decisions

1. **JWT Authentication** - Stateless authentication allows horizontal scaling without session storage
2. **Fixed JWT Secret** - Environment-variable-based secret ensures tokens remain valid across deployments
3. **CORS Configuration** - Explicit origin whitelisting for security
4. **Environment-based Config** - Separate configurations for development and production
5. **Managed Database** - Using Digital Ocean's managed PostgreSQL for reliability and automated backups
6. **Multi-stage Docker Build** - Optimized container images with separate build and runtime stages

---

## API Endpoints

### Authentication
- `POST /users/register` - Create a new user account
- `POST /users/login` - Login and receive JWT token

### Sessions (Protected - requires JWT)
- `GET /sessions` - Get all basketball sessions
- `POST /sessions` - Create a new session
- `GET /sessions/{id}` - Get session by ID
- `PUT /sessions/{id}` - Update session details
- `DELETE /sessions/{id}` - Delete a session
- `POST /sessions/{id}/join` - Join a session
- `POST /sessions/{id}/leave` - Leave a session

### Health Check
- `GET /` - API health check endpoint
- `GET /health` - Detailed health status

---

## Local Development Setup

### Prerequisites
- **Java 21** or higher
- **Node.js 18+** and npm
- **PostgreSQL 14+**
- **Maven 3.9+**
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdis-lab/hoopup.git
   cd hoopup
   ```

2. **Configure PostgreSQL**
   - Create a database named `hoopup`
   - Update `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/hoopup
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     jwt.secret=your-256-bit-secret-key
     ```

3. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend will start at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd hoopup-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Create `.env` file:
     ```
     VITE_API_URL=http://localhost:8080
     ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:5173`

---

## Deployment

### Automated Deployment Pipeline

This project uses **GitHub Actions** for CI/CD:

1. Push code to `main` branch
2. GitHub triggers Digital Ocean deployment
3. Backend builds using Docker multi-stage build
4. Frontend builds with Vite
5. Both services automatically deploy to production
6. DNS automatically routes traffic to new deployments

### Environment Variables (Production)

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `JWT_SECRET` - Fixed secret for JWT signing (256-bit)

**Frontend:**
- `VITE_API_URL` - Backend API URL (`https://api.hoopsesh.me`)

---

## Security Features

- **Password Hashing** - BCrypt with salt for secure password storage
- **JWT Tokens** - Signed tokens with 24-hour expiration
- **CORS Protection** - Whitelisted origins only
- **HTTPS Everywhere** - All traffic encrypted with SSL/TLS
- **SQL Injection Prevention** - Parameterized queries via JPA
- **XSS Protection** - React's built-in sanitization
- **Secure Headers** - Spring Security default headers

---

## Challenges & Solutions

### Challenge 1: JWT Secret Management
**Problem:** Randomly generated JWT secrets invalidated tokens on each deployment.  
**Solution:** Implemented environment-variable-based fixed secret, ensuring tokens remain valid across restarts.

### Challenge 2: CORS Configuration
**Problem:** Conflicting CORS annotations between controllers and global config.  
**Solution:** Removed controller-level `@CrossOrigin` annotations, centralized CORS in `SecurityConfig`.

### Challenge 3: DNS Propagation
**Problem:** Custom domain not resolving immediately after configuration.  
**Solution:** Used DNS propagation checkers and proper A/CNAME record setup with Digital Ocean nameservers.

---

## Future Enhancements

- [ ] **Google Maps Integration** - Visual court locations on a map
- [ ] **Court Ratings & Reviews** - Community-driven court information
- [ ] **Photo Uploads** - Let users share court photos
- [ ] **Push Notifications** - Alert users when someone joins their session
- [ ] **User Profiles** - Display player stats and game history
- [ ] **Search & Filters** - Find sessions by location, date, or skill level
- [ ] **Mobile App** - React Native version for iOS and Android
- [ ] **Real-time Chat** - In-session messaging for coordination
- [ ] **Weather Integration** - Show weather for session times
- [ ] **Social Features** - Friend system and private sessions

---

## Lessons Learned

1. **Environment Configuration** - Separating dev and prod configs is crucial for smooth deployments
2. **JWT Best Practices** - Fixed secrets prevent token invalidation across deployments
3. **DNS Management** - Understanding nameservers, CNAME records, and propagation delays
4. **CORS Debugging** - Centralized configuration prevents conflicts and simplifies troubleshooting
5. **Full-Stack Integration** - Coordinating frontend and backend deployments with environment variables
6. **Cloud Deployment** - Working with managed services (databases, app platforms) vs. self-hosting

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contact

**Abdi** - [GitHub](https://github.com/abdis-lab)

**Project Link:** [github.com/abdis-lab/hoopup](https://github.com/abdis-lab/hoopup)

**Live Demo:** [hoopsesh.me](https://hoopsesh.me)

---

## Acknowledgments

- Built as a portfolio project to demonstrate full-stack development skills
- Deployed using Digital Ocean's App Platform
- Domain provided through GitHub Student Developer Pack
- Inspired by the need to connect basketball players in local communities

---

Made with ❤️ and 🏀 by Abdi
