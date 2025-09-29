# C.A.K.E Backend

Node.js/Express backend API for the C.A.K.E task management system with MongoDB database and comprehensive CRUD operations.

## 🚀 Current Status

**Version**: M5.5 ✅  
**Status**: Core backend functionality complete with full API coverage and data model alignment

### ✅ Implemented Features
- **Authentication System**: JWT-based auth with role-based access control
- **User Management**: Complete user CRUD with role permissions
- **Task Management**: Full task lifecycle with assignment and tracking
- **Client Management**: Mini-CRM with tier system and contact management
- **Feedback System**: Client feedback tracking with types and priorities
- **API Documentation**: Complete Swagger documentation
- **Data Validation**: Mongoose schemas with comprehensive validation

## 🛠 Tech Stack

### Core Framework
- **Node.js** with **Express.js** for RESTful API
- **MongoDB** with **Mongoose ODM** for database operations
- **JavaScript ES6+** with modern async/await patterns

### Authentication & Security
- **JWT (jsonwebtoken)** for stateless authentication
- **bcrypt** for password hashing and verification
- **express-rate-limit** for API rate limiting
- **CORS** configuration for cross-origin requests

### Development & Documentation
- **Swagger/OpenAPI** for interactive API documentation
- **nodemon** for development hot reloading
- **dotenv** for environment variable management
- **ESLint** for code quality and consistency

## 🏗 Project Structure

```
server/
├── models/
│   ├── User.js          # User schema with roles and authentication
│   ├── Client.js        # Client schema with contact and tier info
│   ├── Task.js          # Task schema with assignment and tracking
│   └── Feedback.js      # Feedback schema with types and priorities
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── users.js         # User management endpoints
│   ├── clients.js       # Client management endpoints
│   ├── tasks.js         # Task management endpoints
│   ├── feedback.js      # Feedback management endpoints
│   └── stats.js         # Statistics and analytics endpoints
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── utils/
│   └── jwt.js           # JWT utility functions
├── scripts/
│   └── seed.js          # Database seeding script
├── swagger.js           # API documentation configuration
├── index.js             # Main server entry point
└── package.json         # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js LTS (≥ 18)
- MongoDB (local or Atlas)
- Git

### 1. Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env
```

### 2. Environment Setup
```bash
# .env file
MONGODB_URI=mongodb://127.0.0.1:27017/cake
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
```

### 3. Database Setup
```bash
# Start MongoDB (if using local)
# Windows: net start MongoDB
# macOS/Linux: brew services start mongodb-community

# Seed database with sample data
node scripts/seed.js
```

### 4. Development
```bash
# Start development server
npm run dev

# Server runs on http://localhost:3000
# API docs available at http://localhost:3000/api-docs
```

### 5. Available Scripts
```bash
npm start          # Production server
npm run dev        # Development server with nodemon
npm run seed       # Run database seeding
```

## 🔐 Authentication & Authorization

### JWT Implementation
- **Access tokens** with 24-hour expiration
- **Secure token generation** with user ID and role
- **Middleware protection** for all protected routes
- **Role-based permissions** for different operations

### User Roles & Permissions
| Role | User Mgmt | Client Mgmt | Task Creation | Task Assignment | Task Updates |
|------|-----------|-------------|---------------|-----------------|--------------|
| **Manager** | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Leader** | ❌ None | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| **Member** | ❌ None | 👁️ Read | ❌ None | ❌ None | 🔒 Own Tasks |

### Protected Routes
All routes except `/auth/login` and `/auth/register` require valid JWT token in Authorization header:
```bash
Authorization: Bearer <jwt-token>
```

## 📊 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: 'manager' | 'leader' | 'member',
  createdAt: Date,
  updatedAt: Date
}
```

### Client Model
```javascript
{
  name: String (required),
  contact: {
    email: String (required),
    phone: String (optional),
    address: String (optional)
  },
  tier: 'basic' | 'premium' | 'enterprise',
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  taskNumber: String (auto-generated, unique),
  title: String (required),
  description: String (required),
  clientId: ObjectId (ref: Client),
  assigneeIds: [ObjectId] (ref: User),
  createdBy: ObjectId (ref: User),
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  estimateHours: Number,
  actualHours: Number,
  revenue: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Feedback Model
```javascript
{
  title: String (required),
  description: String (required),
  type: 'bug' | 'feature' | 'improvement' | 'other',
  priority: 'low' | 'medium' | 'high',
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  taskId: ObjectId (ref: Task),
  clientId: ObjectId (ref: Client),
  score: Number (1-5),
  comment: String (optional),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Users
- `GET /users` - Get all users (Manager only)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Manager only)
- `PUT /users/:id` - Update user (Manager only)
- `DELETE /users/:id` - Delete user (Manager only)

### Clients
- `GET /clients` - Get all clients
- `GET /clients/:id` - Get client by ID
- `POST /clients` - Create new client (Manager/Leader)
- `PUT /clients/:id` - Update client (Manager/Leader)
- `DELETE /clients/:id` - Delete client (Manager/Leader)

### Tasks
- `GET /tasks` - Get all tasks with pagination
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task (Manager/Leader)
- `PUT /tasks/:id` - Update task (Manager/Leader + Task Creator)
- `DELETE /tasks/:id` - Delete task (Manager only)

### Feedback
- `GET /feedback` - Get all feedback with pagination
- `GET /feedback/:id` - Get feedback by ID
- `POST /feedback` - Create new feedback (Manager/Leader)
- `PUT /feedback/:id` - Update feedback (Manager/Leader)
- `DELETE /feedback/:id` - Delete feedback (Manager/Leader)

### Statistics
- `GET /stats/overview` - Get dashboard statistics
- `GET /stats/tasks` - Get task analytics
- `GET /stats/revenue` - Get revenue metrics

## 🛠 Development Guide

### Database Operations
- **Mongoose ODM** for schema definition and validation
- **Pre-save hooks** for automatic field generation (task numbers)
- **Population** for related document references
- **Indexing** for query performance optimization

### Error Handling
- **Centralized error handling** with consistent response format
- **Validation errors** with detailed field information
- **Authentication errors** with proper HTTP status codes
- **Database errors** with user-friendly messages

### API Design Principles
- **RESTful conventions** for endpoint naming
- **Consistent response format** across all endpoints
- **Pagination** for large datasets
- **Filtering and sorting** query parameters
- **HTTP status codes** following REST standards

### Security Best Practices
- **Password hashing** with bcrypt salt rounds
- **JWT token expiration** and secure generation
- **Input validation** and sanitization
- **Rate limiting** on authentication endpoints
- **CORS configuration** for frontend integration

## 🚀 Deployment

### Production Setup
```bash
# Environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cake
JWT_SECRET=your-production-secret-key
PORT=3000
```

### Deployment Platforms
- **Railway**: Zero-config Node.js deployment
- **Render**: Automatic deployments from GitHub
- **Heroku**: Traditional PaaS with add-ons
- **DigitalOcean App Platform**: Container-based deployment

### Database Options
- **MongoDB Atlas**: Cloud database service
- **MongoDB Community**: Self-hosted database
- **Docker MongoDB**: Containerized database

## 🔧 Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check MongoDB service status
# Windows: sc query MongoDB
# macOS/Linux: brew services list | grep mongodb

# Test connection
mongosh mongodb://127.0.0.1:27017/cake
```

**JWT Token Issues**
- Verify `JWT_SECRET` is set in environment
- Check token expiration (24 hours default)
- Ensure Authorization header format: `Bearer <token>`

**Port Conflicts**
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux
```

### Development Tips
- Use **Postman** or **Thunder Client** for API testing
- Check **Swagger UI** at `/api-docs` for interactive testing
- Monitor **console logs** for debugging information
- Use **MongoDB Compass** for database inspection

### Performance Optimization
- **Database indexing** on frequently queried fields
- **Pagination** for large result sets
- **Population limits** to prevent over-fetching
- **Query optimization** with proper field selection

---

**For frontend setup, see [client/README.md](../client/README.md)**
