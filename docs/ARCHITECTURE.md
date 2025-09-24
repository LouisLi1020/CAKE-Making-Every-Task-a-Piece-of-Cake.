# C.A.K.E Frontend Architecture

## 🏗 Architecture Design Principles

### Separation of Concerns
- **Pages**: Responsible for API calls, business logic, and state management
- **Components**: Responsible for UI rendering and user interactions
- **UI Components**: Reusable UI component library

### File Organization
```
src/
├── pages/           # Page components (API calls + business logic)
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Clients.tsx
│   ├── Users.tsx
│   ├── Feedback.tsx
│   ├── Login.tsx
│   └── Register.tsx
├── components/      # Layout and business components
│   ├── Layout.tsx   # Main layout component
│   ├── Sidebar.tsx  # Sidebar navigation
│   ├── Header.tsx   # Header component
│   └── UI/          # UI component library
├── contexts/        # React contexts
├── services/        # API services
└── App.tsx         # Main application component
```

## 📁 Component Classification

### 1. Pages (Page Components)
**Responsibilities**: API calls, business logic, state management
**Characteristics**:
- Contains useState, useEffect for state management
- Calls API services
- Handles business logic
- Uses UI components for rendering

**Example**:
```tsx
// pages/Dashboard.tsx
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    const response = await api.get('/stats/overview');
    setStats(response.data);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          {/* UI rendering */}
        </CardContent>
      </Card>
    </div>
  );
};
```

### 2. Layout Components
**Responsibilities**: Page layout, navigation, theme management
**Characteristics**:
- Provides unified page layout
- Manages sidebar and header
- Handles theme switching
- Responsive design

**Example**:
```tsx
// components/Layout.tsx
export default function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 3. UI Components (UI Component Library)
**Responsibilities**: Reusable UI components
**Characteristics**:
- Pure presentation components
- No business logic
- Highly configurable
- TypeScript support

**Example**:
```tsx
// components/UI/button.tsx
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children: React.ReactNode;
}

export function Button({ variant = 'default', size = 'default', children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
}
```

## 🔄 Data Flow

### 1. API Call Flow
```
Page Component → API Service → Backend → Response → State Update → UI Re-render
```

### 2. State Management Flow
```
Context Provider → Page Component → Local State → UI Component → User Interaction
```

### 3. Theme Management Flow
```
ThemeContext → Layout → Sidebar/Header → UI Components → CSS Variables
```

## 🎨 Design System

### 1. Color System
```css
:root {
  --primary-color: #3B82F6;
  --success-color: #10B981;
  --warning-color: #F59E0B;
  --error-color: #EF4444;
  --background: #F9FAFB;
  --foreground: #1F2937;
  --muted-foreground: #6B7280;
}
```

### 2. Component Variants
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## 🚀 Best Practices

### 1. Component Design
- **Single Responsibility**: Each component has one clear responsibility
- **Reusability**: UI components should be highly configurable
- **TypeScript**: All components use TypeScript
- **Props Interface**: Clearly define component props interfaces

### 2. State Management
- **Local State**: Use useState for component internal state
- **Global State**: Use Context for cross-component state
- **API State**: Manage API call state in page components

### 3. Styling Management
- **Tailwind CSS**: Use Tailwind for styling
- **CSS Variables**: Use CSS variables for theme management
- **Component Variants**: Use class-variance-authority for component variants

### 4. Performance Optimization
- **Lazy Loading**: Use React.lazy for code splitting
- **Memoization**: Use React.memo for render optimization
- **Dependency Optimization**: Properly manage useEffect dependencies

## 📝 Development Guidelines

### 1. Creating New Pages
1. Create new `.tsx` file in `pages/` directory
2. Define TypeScript interfaces
3. Implement API call logic
4. Use UI components for rendering
5. Add route in `App.tsx`

### 2. Creating New Components
1. Create new `.tsx` file in `components/` directory
2. Define Props interface
3. Implement component logic
4. Add TypeScript type annotations
5. Export in `components/UI/index.ts`

### 3. Adding New Features
1. Add API services in `services/`
2. Implement business logic in `pages/`
3. Add necessary UI components in `components/UI/`
4. Update routing configuration

This architecture ensures code maintainability, reusability, and scalability while maintaining clear separation of concerns.
