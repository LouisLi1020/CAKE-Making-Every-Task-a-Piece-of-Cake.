# C.A.K.E — MERN Task Management + mini CRM

A full‑stack web application for task management with lightweight CRM and statistics — like slicing a cake into pieces you can assign, track, and enjoy.

## 🚀 Current Status

**Milestones Completed**: M0-M5.5 ✅
- **M0**: Environment & Repository Setup
- **M1**: Scaffolding (Frontend + Backend)
- **M2**: Authentication & Users (JWT, RBAC)
- **M3**: Clients mini-CRM (CRUD operations)
- **M4**: Tasks CRUD + RBAC (Role-based permissions)
- **M4.5**: API Documentation & Testing (Swagger, Postman Collection)
- **M5**: Feedback System (CRUD operations with RBAC)
- **M5.5**: Enhanced UI/UX with Table Layouts & Data Model Alignment

**Next Milestone**: M6 - Advanced Features & Polish

## ✨ Key Features

### ✅ Implemented Features
- **🔐 Authentication**: JWT-based auth with role-based access control
- **👥 User Management**: Manager, Leader, Member roles with RWX-style permissions
- **🏢 Client Management**: Mini-CRM with tier system (Basic, Premium, Enterprise)
- **📋 Task Management**: Full CRUD with status tracking, priority levels, time estimation
- **💬 Feedback System**: Client feedback tracking with types, priorities, and status management
- **🔒 RBAC System**: Role-based permissions for all operations
- **📊 Task Statistics**: Revenue tracking, completion metrics
- **🎨 Modern UI/UX**: Table-based layouts with sorting, filtering, and search functionality
- **📚 API Documentation**: Swagger UI with complete endpoint documentation
- **🧪 Testing Tools**: Postman Collection for comprehensive API testing

### 🚧 Planned Features
- **📊 Advanced Analytics**: Enhanced dashboard with charts and insights
- **🌙 Theme System**: Day/Night mode with persistent preferences
- **📱 Responsive Design**: Mobile-optimized UI/UX
- **🧪 Automated Testing**: Unit and integration tests
- **🚀 Deployment**: Production-ready deployment setup
- **📈 Performance Monitoring**: Real-time performance tracking

## 🛠 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **express-rate-limit** for security
- **Swagger** for API documentation

### Development Tools
- **ESLint** for code quality
- **Postman** for API testing
- **Thunder Client** for VS Code API testing
- **Git** for version control

### Database
- **MongoDB Atlas** (cloud) or local MongoDB
- **Indexed collections** for performance
- **Data validation** with Mongoose schemas

## 🏗 Project Architecture

```
cake/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   └── public/             # Public files
├── server/                 # Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   └── swagger.js          # API documentation
├── shared/                 # Shared constants
├── docs/                   # Documentation
│   ├── API_TESTING_GUIDE.md
│   └── C.A.K.E_API_Collection.json
└── docker-compose.yml      # Development environment
```

## 🔐 Authentication & Authorization

### User Roles
- **Manager**: Full system access, user management
- **Leader**: Task assignment, priority management
- **Member**: Task execution, status updates

### Permission Matrix
| Operation | Manager | Leader | Member |
|-----------|---------|--------|--------|
| User Management | ✅ | ❌ | ❌ |
| Client Management | ✅ | ✅ | ✅ |
| Task Creation | ✅ | ✅ | ❌ |
| Task Assignment | ✅ | ✅ | ❌ |
| Task Updates | ✅ | ✅ | Limited |
| Task Deletion | ✅ | ❌ | ❌ |

## 📚 API Documentation

### Interactive Documentation
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Complete endpoint coverage** with request/response examples
- **Authentication integration** for testing

### Testing Tools
- **Postman Collection**: `docs/C.A.K.E_API_Collection.json`
- **Thunder Client**: VS Code extension for API testing
- **Comprehensive test guide**: `docs/API_TESTING_GUIDE.md`

## 🚀 Quick Start

### Prerequisites
- Node.js LTS (≥ 18)
- npm or pnpm
- MongoDB (Atlas or local)
- Git

### Installation

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd cake
   ```

2. **Environment Setup**
   ```bash
   # Copy environment files
   cp server/env.example server/.env
   cp env.example .env
   
   # Configure your environment variables
   # MONGODB_URI, JWT_SECRET, etc.
   ```

3. **Install Dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1: Backend
   cd server
   npm start
   
   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

5. **Access Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000`
   - API Docs: `http://localhost:3000/api-docs`

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'manager' | 'leader' | 'member',
  createdAt: Date,
  updatedAt: Date
}
```

### Client
```javascript
{
  name: String,
  contact: {
    email: String,
    phone: String,
    address: String
  },
  tier: 'basic' | 'premium' | 'enterprise',
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  clientId: ObjectId (ref: Client),
  assigneeIds: [ObjectId] (ref: User),
  createdBy: ObjectId (ref: User),
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  estimateHours: Number,
  actualHours: Number,
  revenue: Number,
  startedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Available Scripts

**Backend (server/)**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

**Frontend (client/)**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Code Quality
- **ESLint** configuration for both frontend and backend
- **Consistent code formatting** with editor config
- **Git conventions** for commit messages

## 🧪 Testing

### API Testing
1. **Import Postman Collection**: `docs/C.A.K.E_API_Collection.json`
2. **Follow Testing Guide**: `docs/API_TESTING_GUIDE.md`
3. **Use Swagger UI**: Interactive API testing

### Manual Testing
- **Authentication flow**: Register → Login → Access protected routes
- **CRUD operations**: Create, read, update, delete for all entities
- **Role permissions**: Test different user roles and permissions
- **Data validation**: Test input validation and error handling

## 📈 Performance & Security

### Performance Optimizations
- **Database indexing** on frequently queried fields
- **Pagination** for large datasets
- **Efficient queries** with proper population
- **Rate limiting** on authentication endpoints

### Security Features
- **JWT authentication** with secure token handling
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS configuration** for cross-origin requests
- **Rate limiting** to prevent abuse

## 🚀 Deployment

### Production Setup
- **Database**: MongoDB Atlas (free tier)
- **Backend**: Railway, Render, or similar
- **Frontend**: Netlify, Vercel, or Cloudflare Pages
- **Environment Variables**: Configure for production

### Environment Variables
```bash
# Backend (.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production

# Frontend (.env)
VITE_API_URL=https://your-api-url.com
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Commit Convention
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check `docs/` folder
- **API Testing**: Use provided Postman collection
- **Issues**: Create GitHub issue with detailed description
- **Questions**: Open discussion in GitHub

---

**Built with ❤️ using the MERN stack**


