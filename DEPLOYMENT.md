# Deploy Expense Tracker on Render

This guide walks you through deploying the Expense Tracker app (React frontend, Spring Boot backend, PostgreSQL database) on [Render](https://render.com). You will create three Render services: **PostgreSQL**, **Backend (Web Service)**, and **Frontend (Static Site)**.

---

## Overview

| Component | Render type      | Notes |
|-----------|------------------|--------|
| Database  | PostgreSQL       | Use Render’s managed PostgreSQL (internal URL for backend). |
| Backend   | Web Service (Docker) | Spring Boot API; Dockerfile in `Expense-Tracker-Backend/ExpenseTracker`. |
| Frontend  | Static Site      | Vite build; publish `dist`; set `VITE_*` at build time. |

**Important:** Render provides **PostgreSQL**, not MySQL. Your backend already includes the PostgreSQL driver, so it works with Render when you set the datasource to the Render Postgres URL.

---

## Prerequisites

- [Render](https://render.com) account (free tier is fine).
- Code pushed to **GitHub**, **GitLab**, or **Bitbucket** (Render deploys from Git).
- **Google** and/or **GitHub** OAuth2 app credentials for production (optional but recommended).

---

## Step 1: Create PostgreSQL database

1. In [Render Dashboard](https://dashboard.render.com), click **New +** → **PostgreSQL**.
2. Set:
   - **Name:** e.g. `expense-tracker-db`
   - **Database:** `expensetracker` (or leave default)
   - **User / Password:** note them or use the generated ones
   - **Region:** choose a region (e.g. **Oregon**); use the **same region** for backend later.
3. Click **Create Database**.
4. After it’s created, open the database → **Info** (or **Connections**).
5. Copy the **Internal Database URL** (use this for the backend so it connects inside Render’s network).

Format will look like:
`postgresql://USER:PASSWORD@INTERNAL_HOST:PORT/DATABASE`

You’ll convert this to Spring Boot env vars in Step 2.

---

## Step 2: Deploy the backend (Web Service with Docker)

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your Git repository and select the **Expense-Tracker-Application** repo.
3. Configure:
   - **Name:** e.g. `expense-tracker-backend`
   - **Region:** **same as the PostgreSQL database** (so internal URL works).
   - **Branch:** `main` (or your default branch).
   - **Root Directory:** `Expense-Tracker-Backend/ExpenseTracker` (required so the Docker build context contains `pom.xml` and `src`).
   - **Runtime:** **Docker**.
   - **Dockerfile Path:** `Dockerfile` (relative to Root Directory).
   - **Instance Type:** Free (or paid if you prefer).

4. **Environment variables** (Add all; use **Internal** Database URL from Step 1):

   From the Internal Database URL  
   `postgresql://USER:PASSWORD@INTERNAL_HOST:PORT/DATABASE`  
   set:

   | Key | Value |
   |-----|--------|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://INTERNAL_HOST:PORT/DATABASE` (replace INTERNAL_HOST, PORT, DATABASE from the internal URL; do **not** put user/password in the URL) |
   | `SPRING_DATASOURCE_USERNAME` | `USER` from the internal URL |
   | `SPRING_DATASOURCE_PASSWORD` | `PASSWORD` from the internal URL |
   | `JWT_SECRET` | A long random string (e.g. generate with `openssl rand -base64 32`) |
   | `SPRING_JPA_HIBERNATE_DDL_AUTO` | `update` |

   Optional (for OAuth2 in production):

   | Key | Value |
   |-----|--------|
   | `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID` | Your Google OAuth2 client ID |
   | `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_SECRET` | Your Google OAuth2 client secret |
   | `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_ID` | Your GitHub OAuth2 client ID |
   | `SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GITHUB_CLIENT_SECRET` | Your GitHub OAuth2 client secret |
   | `APP_OAUTH2_REDIRECT_URI` | Your **frontend** production URL + `/auth/callback` (e.g. `https://expense-tracker-frontend.onrender.com/auth/callback`) |

   Spring Boot maps these env vars over `application.properties`. Use the **Internal** host so the backend talks to Postgres over Render’s private network.

5. Click **Create Web Service**. Render will build the Docker image and deploy.
6. After deploy, note the backend URL, e.g. `https://expense-tracker-backend.onrender.com`. You’ll use this for the frontend and for OAuth redirect URIs.

---

## Step 3: Deploy the frontend (Static Site)

1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect the **same** Git repository.
3. Configure:
   - **Name:** e.g. `expense-tracker-frontend`
   - **Branch:** `main`
   - **Root Directory:** `Expense-Tracker-Frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment variables** (needed at **build time** for Vite):

   | Key | Value |
   |-----|--------|
   | `VITE_API_BASE_URL` | Your backend URL + `/api` (e.g. `https://expense-tracker-backend.onrender.com/api`) |
   | `VITE_OAUTH2_REDIRECT_URI` | Your **frontend** URL + `/auth/callback` (e.g. `https://expense-tracker-frontend.onrender.com/auth/callback`) |

   Use the **exact** Render URLs of your backend and frontend services. If you don’t have the frontend URL yet, you can set a placeholder and change it after the first deploy (then redeploy the static site).

5. **Redirects / Rewrites** (for React Router SPA):
   - Add a rewrite so all routes serve `index.html`:
     - **Source Path:** `/*`
     - **Destination Path:** `/index.html`
     - **Action:** **Rewrite** (not Redirect)

6. Click **Create Static Site**. After the first deploy, note the frontend URL (e.g. `https://expense-tracker-frontend.onrender.com`).

7. **Optional:** If you used a placeholder for `VITE_OAUTH2_REDIRECT_URI`, update it to the real frontend URL and trigger a **Manual Deploy** so the build uses the correct value.

---

## Step 4: Backend CORS and OAuth2 (production)

- **CORS:** Ensure your backend allows the frontend origin. In your Spring app, the allowed origin list should include your Render frontend URL (e.g. `https://expense-tracker-frontend.onrender.com`). If you use a config like `CorsFilter` or `WebMvcConfigurer`, add this origin there and redeploy the backend.
- **OAuth2:** In **Google Cloud Console** and **GitHub OAuth App** settings, add:
  - **Authorized redirect URI (backend):**  
    `https://<your-backend-host>/login/oauth2/code/google` and  
    `https://<your-backend-host>/login/oauth2/code/github`
  - Your frontend callback is already set via `APP_OAUTH2_REDIRECT_URI` and `VITE_OAUTH2_REDIRECT_URI`.

---

## Step 5: Verify

1. Open the **frontend** URL in a browser. You should see the Expense Tracker UI.
2. Sign up / log in (and, if configured, test “Login with Google” or “Login with GitHub”).
3. Create an expense or income and confirm they appear (data is stored in Render PostgreSQL).

---

## Render-specific notes

- **Free tier:** Backend and DB may spin down after inactivity; first request can be slow. Paid plans avoid spin-down.
- **Port:** Render sets **PORT** (e.g. 10000). Your backend must listen on that port. In `application.properties` (or copy from `application.properties.example`) use `server.port=${PORT:8080}` so the app uses Render’s PORT when set.
- **PostgreSQL:** Always use the **Internal** connection details for the backend; use **External** only for local tools (e.g. connecting from your machine).
- **Redeploys:** Push to the connected branch to trigger a new deploy for backend and frontend. For frontend, changing only env vars usually requires a **Manual Deploy** so the build runs again with new `VITE_*` values.

---

## Checklist

- [ ] PostgreSQL created and **Internal** URL used for backend env vars.
- [ ] Backend Web Service uses **Docker** with correct Dockerfile path and context.
- [ ] Backend env: `SPRING_DATASOURCE_*`, `JWT_SECRET`, and optional OAuth2 + `APP_OAUTH2_REDIRECT_URI`.
- [ ] Frontend Static Site: Root = `Expense-Tracker-Frontend`, Publish = `dist`, build env `VITE_API_BASE_URL` and `VITE_OAUTH2_REDIRECT_URI` set to production URLs.
- [ ] SPA rewrite: `/*` → `/index.html` (Rewrite).
- [ ] Backend CORS includes the frontend Render URL.
- [ ] Google/GitHub OAuth2 redirect URIs updated to production backend and frontend URLs.

---

## Quick reference

| Item | Value |
|------|--------|
| Backend Dockerfile | `Expense-Tracker-Backend/ExpenseTracker/Dockerfile` |
| Backend root/context | `Expense-Tracker-Backend/ExpenseTracker` |
| Frontend root | `Expense-Tracker-Frontend` |
| Frontend build | `npm install && npm run build` |
| Frontend publish | `dist` |
| Database | Render PostgreSQL (use Internal URL for backend) |

For local development and other deployment options (Docker Compose, Kubernetes), see the main [README.md](README.md).
