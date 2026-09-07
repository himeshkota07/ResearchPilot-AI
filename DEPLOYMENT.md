# 🚀 ResearchPilot AI — Deployment Guide

This guide walks you through deploying **ResearchPilot AI** (FastAPI Backend + React Frontend) using:

- **Vercel** for the React + Vite frontend
- **Hugging Face Spaces** for the FastAPI backend (needed because the backend depends on `torch`, `sentence-transformers`, and a local ChromaDB store — workloads that don't fit serverless platforms like Vercel, which are ephemeral, time-limited, and cap deployment size well below what these ML dependencies need)

---

## Step 1: Deploy the Backend to Hugging Face Spaces

1. Go to **[Hugging Face Spaces](https://huggingface.co/spaces)** → **Create new Space**.
2. Name it (e.g. `researchpilot-backend`).
3. Space SDK: **Docker** → **Blank**.
4. Push the contents of the `backend/` folder to the Space repo (it already includes a `Dockerfile`).
5. In **Space Settings → Variables and secrets**, add:
   - `MISTRAL_API_KEY` — your key from [console.mistral.ai](https://console.mistral.ai)
   - `LLM_MODEL` (optional) — defaults to `open-mistral-7b`
6. The Space will build and your backend will be live at:
   `https://<your-username>-researchpilot-backend.hf.space`
   - API routes are under `/api` (e.g. `https://<your-username>-researchpilot-backend.hf.space/api/upload`)
   - Health check: `https://<your-username>-researchpilot-backend.hf.space/health`

---

## Step 2: Deploy the Frontend to Vercel

1. Go to **[Vercel.com](https://vercel.com)** and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import the `ResearchPilot-AI` repository.
4. In Project Settings:
   - **Root Directory**: click `Edit` and choose `frontend`.
   - **Framework Preset**: `Vite` (auto-detected).
5. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-username>-researchpilot-backend.hf.space/api`
6. Click **Deploy**.
7. Vercel builds and deploys the app to a `https://*.vercel.app` domain in seconds.

The repo already includes `frontend/vercel.json` with the SPA rewrite rule needed for client-side routing (React Router), so no extra config is required there.

---

## 🔑 Environment Variables Reference

| Variable | Location | Required | Value |
| :--- | :--- | :--- | :--- |
| `MISTRAL_API_KEY` | Backend (Hugging Face Space secret) | **Yes** | Your API key from [console.mistral.ai](https://console.mistral.ai) |
| `LLM_MODEL` | Backend (Hugging Face Space variable) | Optional | `open-mistral-7b` (default) |
| `VITE_API_BASE_URL` | Frontend (Vercel env var) | **Yes** | `https://<your-username>-researchpilot-backend.hf.space/api` |

---

## Notes

- Every time you push changes to the Hugging Face Space, it rebuilds the Docker image automatically.
- Every time you push to the branch Vercel is tracking, it redeploys the frontend automatically.
- The free Hugging Face Spaces CPU tier gives 16 GB RAM, which comfortably fits the embedding model (`BAAI/bge-base-en-v1.5`) and ChromaDB.
- CORS on the backend is currently open (`allow_origins=["*"]`) in [backend/app/main.py](backend/app/main.py), so no CORS configuration is needed on the Vercel side.
