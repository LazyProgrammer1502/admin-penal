# Admin Dashboard — Backend (Day 1)

Auth (with admin role), product CRUD (search/filter/sort/pagination), and a `/stats` endpoint that powers the dashboard cards and charts.

## Run
```bash
cd backend
npm install
cp .env.example .env     # set a real JWT_SECRET and your MONGO_URI
npm run seed             # creates admin@demo.com / admin123 + 30 sample products
npm run dev              # http://localhost:5000
```

## Quick test (curl)
```bash
# 1. log in -> copy the token from the response
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.com","password":"admin123"}'

# 2. use it (replace TOKEN)
curl -s http://localhost:5000/api/stats -H "Authorization: Bearer TOKEN"
curl -s "http://localhost:5000/api/products?search=Product%201&page=1&limit=5" -H "Authorization: Bearer TOKEN"
```

## Endpoints
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | public |
| POST | `/api/auth/login` | public |
| GET  | `/api/stats` | logged-in |
| GET  | `/api/products` | logged-in (search, category, sort, page, limit) |
| GET  | `/api/products/:id` | logged-in |
| POST | `/api/products` | admin |
| PUT  | `/api/products/:id` | admin |
| DELETE | `/api/products/:id` | admin |

## Notes
- Passwords are hashed with bcrypt; auth uses a JWT (7-day expiry).
- `/stats` uses an **aggregation pipeline** (`$group`, `$multiply`, `$project`) — the same one from your interview prep.
- Writes are admin-only via the `protect` + `adminOnly` middleware chain.

## Next (Day 2)
React frontend: login page → dashboard layout (sidebar) → stat cards + charts from `/stats`.
