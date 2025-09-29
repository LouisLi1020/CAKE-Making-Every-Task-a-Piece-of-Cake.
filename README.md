# C.A.K.E — MERN Task Management + mini CRM

A full‑stack web application for task management with lightweight CRM and statistics — like slicing a cake into pieces you can assign, track, and enjoy.

## 🚀 Project Status

**Current Version**: M5.5 ✅  
**Status**: Core functionality complete, ready for advanced features

### ✅ Completed Features
- **Authentication & RBAC**: JWT-based auth with Manager/Leader/Member roles
- **Task Management**: Full CRUD with assignment, tracking, and revenue management
- **Client Management**: Mini-CRM with tier system and contact management
- **Feedback System**: Client feedback tracking with types and priorities
- **Modern UI/UX**: Table-based layouts with search, filter, and sort functionality
- **API Documentation**: Complete Swagger documentation and Postman collection

### 🚧 Next Phase
- Advanced analytics and reporting
- Theme system and mobile optimization
- Performance monitoring and automated testing

## 🛠 Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** components
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose ODM**
- **JWT** authentication + **bcrypt** password hashing
- **Swagger** for API documentation

### Development
- **ESLint** for code quality
- **Postman** for API testing
- **Git** with conventional commits

## 🏗 Project Structure

```
cake/
├── client/          # React frontend (see client/README.md)
├── server/          # Express backend (see server/README.md)
├── docs/            # Documentation and guides
├── shared/          # Shared constants
└── README.md        # This file
```

> 📖 **Detailed Documentation**: Each module has its own README with specific setup and development instructions.

## 🚀 Quick Start

### Prerequisites
- Node.js LTS (≥ 18)
- MongoDB (local or Atlas)
- Git

### 1. Clone & Setup
```bash
git clone <repository-url>
cd cake

# Copy environment files
cp server/env.example server/.env
cp client/.env.example client/.env
```

### 2. Install Dependencies
```bash
# Backend
cd server && npm install

# Frontend  
cd ../client && npm install
```

### 3. Start Development
```bash
# Terminal 1: Backend (port 3000)
cd server && npm run dev

# Terminal 2: Frontend (port 5173)
cd client && npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:3000/api-docs
- **Default Login**: alice@cake.dev / Passw0rd! (Manager)

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **Manager** | Full system access, user management |
| **Leader** | Task assignment, client management |
| **Member** | Task execution, status updates |

## 📚 Documentation

### Module-Specific Guides
- **[Frontend Guide](client/README.md)** - React app setup, components, and development
- **[Backend Guide](server/README.md)** - API development, models, and deployment
- **[API Testing](docs/API_TESTING_GUIDE.md)** - Complete testing guide with Postman
- **[Architecture](docs/ARCHITECTURE.md)** - System design and data models
- **[Git Conventions](docs/GIT_CONVENTIONS.md)** - Commit standards and workflow

### API Resources
- **Swagger UI**: http://localhost:3000/api-docs
- **Postman Collection**: `docs/C.A.K.E_API_Collection.json`

## 🛠 Development

### Available Scripts
```bash
# Backend
cd server
npm run dev        # Development server with nodemon
npm start          # Production server

# Frontend  
cd client
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

### Database Setup
```bash
# Seed database with sample data
cd server
node scripts/seed.js
```

### Code Quality
- **ESLint** configuration for both frontend and backend
- **Conventional commits** for consistent version control
- **TypeScript** for type safety in frontend

## 🚀 Deployment

### Production Setup
- **Database**: MongoDB Atlas (free tier)
- **Backend**: Railway, Render, or similar  
- **Frontend**: Netlify, Vercel, or Cloudflare Pages

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
- `refactor:` Code refactoring
- `chore:` Build process changes

---

**Built with ❤️ using the MERN stack**


