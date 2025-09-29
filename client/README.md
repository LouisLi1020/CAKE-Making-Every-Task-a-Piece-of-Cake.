# C.A.K.E Frontend

React-based frontend application for the C.A.K.E task management system with modern UI/UX and comprehensive CRUD operations.

## 🚀 Current Status

**Version**: M5.5 ✅  
**Status**: Core frontend functionality complete with table-based layouts and real-time data integration

### ✅ Implemented Features
- **Authentication System**: Login/Register with JWT integration
- **Dashboard**: Real-time statistics and task overview
- **Task Management**: Full CRUD with assignment, filtering, and sorting
- **Client Management**: Mini-CRM with tier system
- **User Management**: Role-based user administration
- **Feedback System**: Client feedback tracking and management
- **Modern UI/UX**: Table-based layouts with search, filter, and sort

## 🛠 Tech Stack

### Core Framework
- **React 18** with **TypeScript** for type safety
- **Vite** for fast development and building
- **React Router** for client-side routing

### UI & Styling
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible component library
- **Radix UI** primitives for complex components
- **Lucide React** for consistent iconography

### State & Data
- **React Context API** for global state management
- **Axios** for HTTP client and API communication
- **Custom Hooks** for data fetching and management

### Development Tools
- **ESLint** for code quality and consistency
- **TypeScript** for type checking and IntelliSense

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui component library
│   ├── Layout.tsx       # Main layout wrapper
│   ├── TopNav.tsx       # Global navigation bar
│   ├── Sidebar.tsx      # Collapsible sidebar
│   ├── RightPanel.tsx   # Right panel drawer
│   ├── Dashboard.tsx    # Dashboard implementation
│   ├── Header.tsx       # Dashboard header
│   ├── Maincontent.tsx  # Dashboard main content
│   └── TaskChart.tsx    # Data visualization
├── pages/
│   ├── Login.tsx        # Authentication login
│   ├── Register.tsx     # User registration
│   ├── Home.tsx         # Dashboard page wrapper
│   ├── Tasks.tsx        # Task management
│   ├── Clients.tsx      # Client management
│   ├── Users.tsx        # User management
│   ├── Feedback.tsx     # Feedback management
│   └── Profile.tsx      # User profile
├── contexts/
│   ├── AuthContext.tsx  # Authentication state
│   └── ThemeContext.tsx # Theme management
├── hooks/
│   └── useDashboard.ts  # Dashboard data hooks
├── services/
│   └── api.js          # API service layer
├── types/
│   └── index.ts        # TypeScript definitions
└── lib/
    └── design-system.ts # Design tokens
```

## 🚀 Quick Start

### Prerequisites
- Node.js LTS (≥ 18)
- Backend server running on port 3000
- MongoDB database connection

### 1. Installation
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### 2. Environment Setup
```bash
# .env file
VITE_API_URL=http://localhost:3000
```

### 3. Development
```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### 4. Available Scripts
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🎨 Key Features

### Authentication & Authorization
- **JWT-based authentication** with secure token handling
- **Role-based access control** (Manager, Leader, Member)
- **Protected routes** with automatic redirects
- **Persistent login state** across browser sessions

### Dashboard & Analytics
- **Real-time statistics** with live data updates
- **Task overview** with status tracking and progress bars
- **Project metrics** and completion analytics
- **Interactive charts** for data visualization

### CRUD Operations
- **Task Management**: Create, assign, track, and complete tasks
- **Client Management**: Full client lifecycle with tier system
- **User Management**: Role-based user administration
- **Feedback System**: Client feedback tracking and resolution

### Modern UI/UX
- **Table-based layouts** with sorting and filtering
- **Search functionality** across all data tables
- **Responsive design** for desktop and mobile
- **Accessible components** with keyboard navigation
- **Dark mode support** (planned for next phase)

## 🛠 Development Guide

### Component Architecture
- **Modular design** with reusable components
- **TypeScript interfaces** for type safety
- **Custom hooks** for data management
- **Context providers** for global state

### State Management
- **AuthContext**: User authentication and permissions
- **ThemeContext**: Theme switching and preferences
- **Local state**: Component-specific data with useState
- **API integration**: Centralized service layer

### Styling Approach
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components
- **Design tokens**: Consistent spacing and colors
- **Responsive breakpoints**: Mobile-first approach

### Code Quality
- **ESLint configuration** for consistent code style
- **TypeScript strict mode** for type safety
- **Component documentation** with JSDoc comments
- **Error boundaries** for graceful error handling

## 🚀 Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Variables
```bash
# Production .env
VITE_API_URL=https://your-api-domain.com
```

### Deployment Platforms
- **Netlify**: Connect GitHub repo for automatic deployments
- **Vercel**: Zero-config deployment with Vite support
- **Cloudflare Pages**: Fast global CDN deployment

## 🔧 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Verify backend server is running on port 3000
- Check `VITE_API_URL` in `.env` file
- Ensure CORS is configured on backend

**TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Development Tips
- Use React DevTools for component debugging
- Check browser console for API errors
- Use Network tab to monitor API requests
- Enable TypeScript strict mode for better type safety

---

**For backend setup, see [server/README.md](../server/README.md)**
