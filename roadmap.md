## Roadmap — Piece of Cake

Milestones are ordered to de‑risk environment, auth, data model, and deployment early. Each milestone should end with a working build and minimal docs.

### M0 — Environment & Repo (Day 0)
- Verify toolchain: `node -v`, `npm -v`, `git --version`, `mongosh --version` or Atlas access
- Create repo structure: `client/`, `server/`, `.editorconfig`, `.nvmrc` (optional)
- Decide package manager (npm/pnpm)

Deliverable: tools verified + empty folders with README stubs

### M1 — Scaffolding (Day 0–1)
- Frontend: Vite React app in `client/`
- Backend: Express app in `server/` with health route `/healthz`
- Shared: constants for roles
- Dev scripts: `client dev`, `server dev`

Deliverable: open `http://localhost:5173`, backend `GET /healthz` returns 200

### M2 — Auth & Users (Day 1–2)
- User model (name, email, role, password hash)
- Endpoints: `POST /auth/register`, `POST /auth/login`, `GET /me`
- JWT middleware, password hashing, basic rate limit
- Frontend auth pages: Login/Register; persist token

Deliverable: can register/login and see profile; protected routes enforced

### M3 — Clients (mini‑CRM) (Day 2)
- Client model (name, contact, tier, notes)
- CRUD endpoints with role checks
- Frontend: Clients list/detail/edit

Deliverable: manage clients, basic validation

### M4 — Tasks CRUD + RBAC (Day 3–4)
- Task model (title, description, clientId, assigneeIds, status, priority, estimateHours, revenue, timestamps)
- CRUD endpoints with RWX‑style permissions:
  - creator: full on own tasks; read others
  - assigner: assign/change assignees and priority
  - member: read assigned; update own task status/time
- Frontend: Tasks board/table + forms

Deliverable: end‑to‑end task lifecycle under role rules

### M5 — Feedback & Stats (Day 4–5)
- Feedback model (taskId, clientId, score, comment)
- Stats endpoint `/stats/overview?from&to` with:
  - revenue total and by client
  - avg completion duration
  - CSAT (avg feedback score)
- Frontend: Dashboard with charts and filters

Deliverable: dashboard shows metrics from real data

### M6 — Theming + UX (Day 5)
- Day/Night mode via CSS variables; toggle in header; persisted in LocalStorage
- Polished layout, empty states, toasts

Deliverable: theme toggle works globally; accessible colors

### M7 — Testing & CI (Day 5–6)
- Backend: Jest + Supertest for auth, RBAC, CRUD
- Frontend: Vitest + React Testing Library for key flows
- CI: GitHub Actions running tests + lint

Deliverable: green CI; basic coverage

### M8 — Deployment (Day 6)
- DB: MongoDB Atlas free tier
- Backend: Railway (set env vars)
- Frontend: Netlify or Cloudflare Pages (set `VITE_API_URL`)
- Verify CORS and HTTPS

Deliverable: live URLs for API and web app

### Stretch
- File uploads on tasks (attachments)
- WebSocket for real‑time updates
- Audit logs (who changed what)
- i18n (EN/ZH)

### Tracking Definition of Done (per milestone)
- Lint passes, unit tests updated
- README/Docs reflect current state
- Manual smoke test checklist complete


