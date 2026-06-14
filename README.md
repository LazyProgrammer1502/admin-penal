# Admin Dashboard (MERN)

A full-stack admin dashboard: JWT auth with roles, product management (search / sort / paginate / CRUD), CSV export, and an analytics overview powered by a MongoDB aggregation pipeline.

**Stack:** React + Vite + Tailwind + Recharts · Node + Express · MongoDB (Mongoose) · JWT auth.

![Dashboard screenshot](./screenshot.png)
<!-- Replace screenshot.png with a real screenshot of your running app -->

## Live demo
- App: _your-frontend.vercel.app_
- Demo login: `admin@demo.com` / `admin123`

## Run locally
```bash
# 1. Backend
cd backend
npm install
cp .env.example .env        # set MONGO_URI + JWT_SECRET
npm run seed                # demo admin + 30 products
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api
npm run dev                 # http://localhost:5173
```

## Features
- Email/password auth, passwords hashed with bcrypt, JWT (7-day) sessions
- Role-based access: only admins can create / edit / delete
- Product table: debounced search, server-side sort & pagination
- Add / edit / delete via modal; CSV export
- Overview: stat cards + bar/pie charts from a `/stats` aggregation pipeline

See `DEPLOYMENT.md` to put it online (MongoDB Atlas + Render + Vercel).
