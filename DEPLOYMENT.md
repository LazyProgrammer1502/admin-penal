# Deployment Guide

Three free services: **MongoDB Atlas** (database), **Render** (backend), **Vercel** (frontend). Do them in this order.

---

## 1. Database — MongoDB Atlas
1. Create a free account at mongodb.com/atlas and make a free **M0 cluster**.
2. **Database Access** → add a user (username + password).
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere — needed so Render can connect).
4. **Connect → Drivers** → copy the connection string. It looks like:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/admin_dashboard`
   (add `/admin_dashboard` before the `?` to name the database).

---

## 2. Backend — Render
1. Push your project to GitHub (the `.gitignore` keeps `node_modules` and `.env` out — never commit secrets).
2. On render.com → **New → Web Service** → connect the repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment** → add variables:
   - `MONGO_URI` = your Atlas string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your Vercel URL (fill in after step 3; you can update it later)
   - (Don't set `PORT` — Render provides it, and the code already reads `process.env.PORT`.)
5. Deploy. Test: visit `https://your-backend.onrender.com/health` → should return `{"status":"ok"}`.
6. **Seed the database once:** open Render's **Shell** tab and run `npm run seed` (creates the demo admin + products against Atlas).

> Note: Render's free tier sleeps after inactivity, so the first request can take ~30–50s to wake. Mention this on your portfolio, or use a free uptime pinger.

---

## 3. Frontend — Vercel
1. On vercel.com → **Add New → Project** → import the same repo.
2. Settings:
   - **Root Directory:** `frontend`
   - Framework preset: **Vite** (auto-detected)
3. **Environment Variables:**
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
4. Deploy. Vercel gives you a URL like `your-frontend.vercel.app`.
5. Go back to **Render → CLIENT_URL** and set it to this Vercel URL, then redeploy the backend (so CORS allows your frontend).

---

## 4. Final checks
- Open the Vercel URL, log in with `admin@demo.com` / `admin123`.
- Cards + charts load, the product table searches/sorts/paginates, add/edit/delete and CSV export work.
- Take a screenshot, save it as `screenshot.png` in the repo root, and add the live link to your CV and portfolio.

## Common gotchas
- **CORS error in the browser console** → `CLIENT_URL` on Render doesn't exactly match your Vercel URL (no trailing slash), or you didn't redeploy after setting it.
- **Refreshing /products gives a 404** → `vercel.json` rewrite missing (it's included).
- **Login fails / 500** → backend can't reach Atlas: check `MONGO_URI` and that Network Access allows `0.0.0.0/0`.
