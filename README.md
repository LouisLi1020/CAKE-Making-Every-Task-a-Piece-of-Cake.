## Piece of Cake — MERN Task Management + mini CRM

A full‑stack web application for task management with lightweight CRM and statistics — like slicing a cake into pieces you can assign, track, and enjoy.

### Key Features
- **Task CRUD**: create, read, update, delete tasks
- **User CRUD**: manage users and basic client records (mini‑CRM)
- **Role/RWX‑style permissions**: task creator, assigner, member/other (similar to rwx)
- **Task analytics**: revenue, average completion duration, customer satisfaction, on‑time rate
- **Day/Night mode**: theme toggle with persistent preference
- **Deployable to free tiers**: e.g. Railway (backend), MongoDB Atlas (DB), Netlify/Cloudflare Pages (frontend)

### Tech Stack (proposed)
- **Frontend**: React + Vite, React Router, state via React Query or minimal Context, CSS variables for theming
- **Backend**: Node.js, Express, Mongoose (MongoDB), JSON Web Tokens (JWT) + RBAC middleware
- **Database**: MongoDB Atlas free tier (or local MongoDB community)
- **Charts/Stats**: lightweight chart lib (e.g. chart.js or recharts)
- **Testing**: Vitest/RTL (frontend), Jest/Supertest (backend)

Note: We will verify your environment first; if missing, we’ll provide install steps per OS.

### Domain Model (initial)
- **User**: { name, email, role: "creator" | "assigner" | "member", hashedPassword, status }
- **Client**: { name, contactEmail, tier, notes }
- **Task**: { title, description, clientId, assigneeIds, createdBy, status, priority, estimateHours, actualHours, revenue, createdAt, startedAt, completedAt }
- **Feedback**: { taskId, clientId, score: 1–5, comment, createdAt }

Derived metrics:
- Average completion duration = avg(completedAt - startedAt)
- Revenue per period = sum(task.revenue within range)
- CSAT = avg(feedback.score)

### Folder Structure (planned)
- `client/` React app (Vite)
- `server/` Express API with Mongoose models and RBAC middleware
- `shared/` optional DTO/types/constants (if needed)
- `docs/` additional documentation (optional)

### Environment Prerequisites
- Node.js LTS (≥ 18; recommended 20 LTS)
- npm or pnpm
- Git
- MongoDB: Atlas free tier account OR local MongoDB Community

Quick checks (Windows/macOS/Linux):
- `node -v`
- `npm -v`
- `git --version`
- `mongosh --version` (or confirm Atlas credentials)

If any are missing, see Install Notes below.

### Local Development (once environment is verified)
1) Scaffold frontend and backend
- Frontend: Vite React app in `client/`
- Backend: Express + Mongoose in `server/`

2) Configure environment variables
- `server/.env`:
  - `MONGODB_URI=...` (Atlas connection string or local)
  - `JWT_SECRET=...`
  - `PORT=4000`

3) Run apps
- Backend: `npm run dev` inside `server/`
- Frontend: `npm run dev` inside `client/` (proxy API or env var for API URL)

4) Visit the app
- Frontend dev server: `http://localhost:5173`

### Theming (Day/Night)
- CSS variables on `:root` and `[data-theme="dark"]`
- LocalStorage to persist theme

### RBAC (RWX‑like)
- Roles: `creator`, `assigner`, `member`
- Example rule set:
  - creator: rwx on own tasks, r on others
  - assigner: rw on any task assignment fields, r on others
  - member: r on assigned tasks, w on own task status

Middleware sketches:
- `requireAuth` (validate JWT)
- `requireRole` (check role)
- `requireOwnershipOrRole` (creator on own task or assigner)

### API Outline (draft)
- `POST /auth/login`, `POST /auth/register`
- `GET/POST/PUT/DELETE /users`
- `GET/POST/PUT/DELETE /clients`
- `GET/POST/PUT/DELETE /tasks`
- `GET /stats/overview?from=...&to=...`

### Deployment (free‑tier friendly)
- **Database**: MongoDB Atlas free tier
- **Backend**: Railway free tier (Express)
- **Frontend**: Netlify or Cloudflare Pages

Basic flow:
- Push repo to GitHub
- Connect `server/` to Railway → set `MONGODB_URI` and `JWT_SECRET`
- Connect `client/` to Netlify/Cloudflare Pages → set `VITE_API_URL`

### Install Notes
- Windows: Node via `winget install -e --id OpenJS.NodeJS.LTS`
- macOS: `brew install node`
- Linux (Debian/Ubuntu): NodeSource or nvm
- MongoDB: prefer Atlas; for local, install MongoDB Community + `mongosh`

### Status
- This README defines scope and the initial architecture. Next steps: verify environment, scaffold `client/` and `server/`, then implement auth, CRUD, RBAC, stats, theming, and deployment.


