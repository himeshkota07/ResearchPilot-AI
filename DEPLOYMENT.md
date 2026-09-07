# 🚀 ResearchPilot AI — Deployment Guide

This guide walks you through deploying **ResearchPilot AI** (FastAPI Backend + React Frontend) using:

- **Render** for the FastAPI backend (its native Python runtime handles `torch` / `sentence-transformers` / ChromaDB comfortably — platforms built for serverless functions, like Vercel, don't fit this workload)
- **Vercel** for the React + Vite frontend

---

## Step 1: Deploy the Backend to Render

A pre-configured `render.yaml` blueprint is included at the repo root.

1. Push your code to GitHub (already done if you're reading this from your repo).
2. Go to **[Render.com](https://render.com)** and sign in with your GitHub account.
3. Click **New +** → **Blueprint**.
4. Select your `ResearchPilot-AI` repository.
5. Render detects `render.yaml` and configures **`researchpilot-backend`** (FastAPI Web Service, Python 3.12, free plan).
6. Under the service's **Environment** tab, set:
   - `MISTRAL_API_KEY` — your key from [console.mistral.ai](https://console.mistral.ai)
7. Click **Apply** / **Create Web Service**.
8. Once deployed, copy the backend URL (e.g. `https://researchpilot-backend.onrender.com`).
   - API routes are under `/api` (e.g. `https://researchpilot-backend.onrender.com/api/upload`)
   - Health check: `https://researchpilot-backend.onrender.com/health`

> Free-tier Render web services spin down after inactivity and take ~30–60s to wake up on the next request — expect a cold-start delay on the first request after idling.

---

## Step 2: Deploy the Frontend to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `ResearchPilot-AI` repository.
4. In Project Settings:
   - **Root Directory**: click `Edit` and choose `frontend`.
   - **Framework Preset**: `Vite` (auto-detected).
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://researchpilot-backend.onrender.com/api` *(use your actual Render backend URL)*
6. Click **Deploy**.
7. Vercel builds and deploys the app to a `https://*.vercel.app` domain in seconds.

The repo already includes `frontend/vercel.json` with the SPA rewrite rule needed for client-side routing (React Router), so no extra config is required there.

---

## 🔑 Environment Variables Reference

| Variable | Location | Required | Value |
| :--- | :--- | :--- | :--- |
| `MISTRAL_API_KEY` | Backend (Render) | **Yes** | Your API key from [console.mistral.ai](https://console.mistral.ai) |
| `LLM_MODEL` | Backend (Render) | Optional | `open-mistral-7b` (default, set in `render.yaml`) |
| `VITE_API_BASE_URL` | Frontend (Vercel) | **Yes** | `https://researchpilot-backend.onrender.com/api` |

---

## Notes

- Every push to the branch Render is tracking redeploys the backend automatically.
- Every push to the branch Vercel is tracking redeploys the frontend automatically.
- CORS on the backend is currently open (`allow_origins=["*"]`) in [backend/app/main.py](backend/app/main.py), so no CORS configuration is needed on the Vercel side.
- `backend/Dockerfile` is kept for local Docker use or alternative container hosts (Railway, Fly.io, Hugging Face Spaces if your account has Docker SDK access) — Render's blueprint above uses its native Python runtime instead, not the Dockerfile.
