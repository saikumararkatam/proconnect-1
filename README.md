# ProConnect - Freelance Marketplace (MERN)

Clients post jobs, freelancers send proposals or list services, clients hire.
One Express server serves both the API and the built React app, so you deploy once and get one live URL.

## Folder layout
```
proconnect/
  package.json        <- backend deps + build/start scripts
  server/             <- Express + MongoDB (Mongoose) API
  client/             <- React (Vite) frontend
  .env.example
```

## Deploy live (Render + MongoDB Atlas, both have free tiers)

### 1. Database (MongoDB Atlas)
1. Create a free cluster at https://www.mongodb.com/atlas
2. Database Access: create a user and password.
3. Network Access: add `0.0.0.0/0` (allow from anywhere) so your host can connect.
4. Click Connect > Drivers and copy the connection string. Put `/proconnect` before the `?`:
   `mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/proconnect?retryWrites=true&w=majority`

### 2. Push code to GitHub
```
git init
git add .
git commit -m "ProConnect"
git branch -M main
git remote add origin https://github.com/<you>/proconnect.git
git push -u origin main
```

### 3. Create the web service on Render (https://render.com)
New > Web Service > connect your GitHub repo, then set:

| Setting        | Value               |
|----------------|---------------------|
| Runtime        | Node                |
| Build Command  | `npm install && npm run build` |
| Start Command  | `npm start`         |

Environment variables:
```
NODE_ENV=production
MONGO_URI=<your Atlas string>
JWT_SECRET=<any long random string>
```
Click Deploy. Render gives you a live URL like `https://proconnect.onrender.com`.
Check `https://<your-url>/api/health` returns `{"app":"ProConnect","status":"ok"}`.

(Railway, Koyeb, or any VPS work the same way: build = `npm install && npm run build`, start = `npm start`.)

### Own VPS / custom domain (optional)
```
git clone <repo> && cd proconnect
cp .env.example .env   # fill values
npm install && npm run build
npm i -g pm2 && pm2 start server/server.js --name proconnect
```
Put Nginx in front (proxy_pass to port 5000) and add SSL with certbot.

## Split hosting (frontend on Vercel/Netlify)
Deploy `client/` there with env `VITE_API_URL=https://<your-backend-url>`,
and set `CLIENT_URL=https://<your-frontend-url>` on the backend for CORS.

## Local development (optional)
```
cp .env.example .env
npm install && npm install --prefix client
npm run dev
```

## API summary
- POST /api/auth/register, /api/auth/login, GET/PUT /api/auth/me
- GET/POST /api/gigs, GET /api/gigs/:id, GET /api/gigs/mine, DELETE /api/gigs/:id
- GET/POST /api/jobs, GET /api/jobs/:id, GET /api/jobs/mine, GET /api/jobs/:id/proposals, PUT /api/jobs/:id/complete
- POST /api/proposals, GET /api/proposals/mine, PUT /api/proposals/:id/accept
