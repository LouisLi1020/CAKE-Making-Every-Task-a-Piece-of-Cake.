# CAKE Frontend

This is the frontend application for the CAKE project, now integrated with the Figma Dashboard design components.

## Features

- **Modern UI Components**: Based on shadcn/ui and Tailwind CSS
- **Figma Dashboard Design**: Complete dashboard layout with sidebar, header, main content, and right panel
- **Authentication**: Login and registration system
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Recharts** for data visualization

## Project Structure

```
src/
├── components/
│   ├── UI/           # shadcn/ui components
│   ├── Dashboard.tsx # Main dashboard layout
│   ├── Header.tsx    # Top navigation bar
│   ├── Sidebar.tsx   # Left navigation sidebar
│   ├── Maincontent.tsx # Main content area
│   ├── RightPanel.tsx # Right sidebar panel
│   └── TaskChart.tsx # Data visualization charts
├── pages/
│   ├── Login.tsx     # Login page
│   └── Register.tsx  # Registration page
├── contexts/
│   └── AuthContext.tsx # Authentication context
├── hooks/
│   └── useDashboard.ts # Dashboard data management
├── types/
│   └── index.ts      # TypeScript type definitions
└── lib/
    └── design-system.ts # Design system configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Dashboard Features

- **Statistics Cards**: Display key metrics and KPIs
- **Task Management**: View and manage tasks with different statuses
- **Project Progress**: Track project completion with progress bars
- **Team Members**: See team member status and availability
- **Recent Messages**: Quick access to team communications
- **Analytics Charts**: Visual representation of task data
- **Dark Mode Toggle**: Switch between light and dark themes

## Components from Figma Dashboard

The project now includes all UI components from the [figma-dashboard](https://github.com/LouisLi1020/figma-dashboard) repository:

- Complete dashboard layout with proper spacing and design
- Responsive sidebar that collapses on smaller screens
- Modern card-based design with proper shadows and borders
- Interactive task management interface
- Real-time data visualization with charts
- Professional color scheme and typography

## Development

The project uses a modular component architecture with:
- Centralized type definitions
- Custom hooks for data management
- Design system tokens for consistent styling
- Proper TypeScript typing throughout
