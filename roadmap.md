## Roadmap — Piece of Cake

Milestones are ordered to de‑risk environment, auth, data model, and deployment early. Each milestone should end with a working build and minimal docs.

### M0 — Environment & Repo (Day 0) ✅
- Verify toolchain: `node -v`, `npm -v`, `git --version`, `mongosh --version` or Atlas access
- Create repo structure: `client/`, `server/`, `.editorconfig`, `.nvmrc` (optional)
- Decide package manager (npm/pnpm)

Deliverable: tools verified + empty folders with README stubs

### M1 — Scaffolding (Day 0–1) ✅
- Frontend: Vite React app in `client/`
- Backend: Express app in `server/` with health route `/healthz`
- Shared: constants for roles
- Dev scripts: `client dev`, `server dev`

Deliverable: open `http://localhost:5173`, backend `GET /healthz` returns 200

### M2 — Auth & Users (Day 1–2) ✅
- User model (name, email, role, password hash)
- Endpoints: `POST /auth/register`, `POST /auth/login`, `GET /me`
- JWT middleware, password hashing, basic rate limit
- Frontend auth pages: Login/Register; persist token

Deliverable: can register/login and see profile; protected routes enforced

### M3 — Clients (mini‑CRM) (Day 2) ✅
- Client model (name, contact, tier, notes)
- CRUD endpoints with role checks
- Frontend: Clients list/detail/edit

Deliverable: manage clients, basic validation

### M4 — Tasks CRUD + RBAC (Day 3–4) ✅
- Task model (title, description, clientId, assigneeIds, status, priority, estimateHours, revenue, timestamps)
- CRUD endpoints with RWX‑style permissions:
  - creator: full on own tasks; read others
  - assigner: assign/change assignees and priority
  - member: read assigned; update own task status/time
- Frontend: Tasks board/table + forms

Deliverable: end‑to‑end task lifecycle under role rules

### M4.5 — API Documentation & Testing (Day 4) ✅
- Swagger UI integration with complete endpoint documentation
- Postman Collection for comprehensive API testing
- API testing guide with test cases and validation
- Basic UI/UX improvements and manual integration testing
- Ensure API stability and documentation completeness

Deliverable: fully documented and tested API with stable foundation for M5

### M5 — Feedback & Stats (Day 4–5) ✅
- Feedback model (title, description, type, priority, status, taskId, clientId, score, comment)
- CRUD endpoints with role checks
- Frontend: Feedback list/detail/edit with table layout
- Stats endpoint `/stats/overview?from&to` with:
  - revenue total and by client
  - avg completion duration
  - CSAT (avg feedback score)
- Frontend: Dashboard with charts and filters

Deliverable: feedback lifecycle + dashboard shows metrics from real data

### M5.5 — Enhanced UI/UX & Data Model Alignment (Day 5-6) ✅
- Unified Layout component across all pages
- Remove duplicate navigation code from individual pages
- Ensure consistent navigation and logout functionality
- Convert all pages to modern table-based layouts with sorting and filtering
- Implement comprehensive search functionality across all entities
- Fix data model mismatches between frontend and backend
- Enhanced seed data for better demo experience
- Improved RBAC implementation with task creator permissions
- Dashboard integration with real-time data

Deliverable: polished UI/UX with consistent data models and enhanced user experience

### M6 — Advanced UI/UX Components (Day 5-6)
#### 6.1 — Responsive Sidebar Navigation ✅
- Replace current top navigation with collapsible left sidebar
- CAKE logo as home button (returns to dashboard)
- Icon + text navigation items with hover effects
- Collapse/expand functionality with smooth animations
- Mobile-responsive design (hamburger menu on small screens)

#### 6.2 — Header Components ✅
- Sticky header with user profile section
- Profile icon dropdown menu
- Day/Night mode toggle button
- User avatar and role display
- Logout functionality

#### 6.3 — Profile Management
- Profile page with user information editing
- Fields: name, alias, email, phone, description
- Avatar upload functionality
- Password change section
- Account settings and preferences

#### 6.4 — Theme System ✅
- CSS variables for color schemes
- Day/Night mode implementation
- LocalStorage persistence
- Smooth theme transitions
- Accessible color contrasts

#### 6.5 — UI Component Library
- Modal/Dialog components for forms
- Toast notification system
- Loading spinners and skeletons
- Form components with validation
- Button and input styling consistency

#### 6.6 — Dashboard Layout & Data Visualization
- Enhanced dashboard with statistical cards and charts
- Reference Task-Management-Dashboard and AWS Dashboard designs
- Add comprehensive metrics (task completion rate, client satisfaction, team efficiency)
- Implement data visualization components (charts, graphs)
- Create reusable card components with consistent design
- Add quick action areas and improved information hierarchy
- Responsive grid layout using CSS Grid/Flexbox
- Task status distribution charts
- Client feedback statistics visualization

Deliverable: modern, responsive UI with theme support, profile management, and enhanced dashboard with data visualization

### M7 — Testing & CI (Day 6-7)
- Backend: Jest + Supertest for auth, RBAC, CRUD
- Frontend: Vitest + React Testing Library for key flows
- CI: GitHub Actions running tests + lint
- E2E testing with Playwright or Cypress

Deliverable: green CI; comprehensive test coverage

### M8 — Deployment (Day 7)
- DB: MongoDB Atlas free tier
- Backend: Railway (set env vars)
- Frontend: Netlify or Cloudflare Pages (set `VITE_API_URL`)
- Verify CORS and HTTPS
- Environment-specific configurations

Deliverable: live URLs for API and web app

### Stretch Goals
- File uploads on tasks (attachments)
- WebSocket for real‑time updates
- Audit logs (who changed what)
- i18n (EN/ZH)
- Advanced analytics and reporting
- Mobile app (React Native)
- Email notifications
- Calendar integration

### Tracking Definition of Done (per milestone)
- Lint passes, unit tests updated
- README/Docs reflect current state
- Manual smoke test checklist complete
- Code review completed
- Performance considerations addressed


