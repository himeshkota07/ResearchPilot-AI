# 🚀 ResearchPilot AI — Deployment Guide

**ResearchPilot AI** (FastAPI Backend + React Frontend) deploys entirely on **Render** using the included `render.yaml` blueprint — one click provisions both services:

- **`researchpilot-backend`** — FastAPI web service (Python 3.12 native runtime), using Mistral's hosted `mistral-embed` API for embeddings and ChromaDB for the vector store — no local ML stack, keeps it well within the free tier's 512MB memory limit
- **`researchpilot-frontend`** — React + Vite static site

---

## Deploy both services

1. Push your code to GitHub (already done if you're reading this from your repo).
2. Go to **[Render.com](https://render.com)** and sign in with your GitHub account.
3. Click **New +** → **Blueprint**.
4. Select your `ResearchPilot-AI` repository. Render detects `render.yaml` and shows both services it will create.
5. Click **Apply**.
6. Once `researchpilot-backend` is created, open its **Environment** tab and set:
   - `MISTRAL_API_KEY` — your key from [console.mistral.ai](https://console.mistral.ai)
7. Render builds and deploys both services.
8. **Important**: Render assigns each service a unique URL (often with a random suffix, e.g. `researchpilot-backend-oxjq.onrender.com`) — the exact suffix isn't known until after the backend is created. Once you have it, open `render.yaml`, update the `VITE_API_BASE_URL` value under `researchpilot-frontend` to match your actual backend URL + `/api`, commit, push, and trigger a redeploy of the frontend service (Render's cross-service `fromService` env var reference doesn't support the URL templating needed to wire this automatically).
9. Your app will be live at whatever URLs Render assigned, e.g.:
   - Frontend: `https://researchpilot-frontend-xxxx.onrender.com`
   - Backend: `https://researchpilot-backend-xxxx.onrender.com` (health check at `/health`, API routes under `/api`)

> Free-tier Render web services spin down after inactivity and take ~30–60s to wake up on the next request — expect a cold-start delay after idling, on both the frontend and backend.

---

## 🔑 Environment Variables Reference

| Variable | Location | Required | Value |
| :--- | :--- | :--- | :--- |
| `MISTRAL_API_KEY` | Backend (Render) | **Yes** — set manually in dashboard | Your API key from [console.mistral.ai](https://console.mistral.ai) |
| `LLM_MODEL` | Backend (Render) | Optional | `open-mistral-7b` (default, set in `render.yaml`) |
| `VITE_API_BASE_URL` | Frontend (Render) | **Yes** — hardcoded in `render.yaml` | Your actual backend service URL + `/api`, e.g. `https://researchpilot-backend-xxxx.onrender.com/api` |

---

## Notes

- Every push to the branch Render is tracking redeploys both services automatically.
- CORS on the backend is open (`allow_origins=["*"]`) in [backend/app/main.py](backend/app/main.py), so no extra CORS configuration is needed.
- `backend/Dockerfile` is unused by this deployment path (Render's blueprint uses its native Python runtime) — it's kept only for local Docker use or if you ever move the backend to a container-based host.
- `frontend/vercel.json` is likewise unused here — it's inert and harmless, kept only in case you deploy the frontend to Vercel separately in the future.
- The free-tier backend has an **ephemeral disk** — its filesystem resets on every redeploy and (per Render's free-tier behavior) after the service spins down from inactivity. That means the local ChromaDB store (`backend/app/chroma_db`) and any uploaded PDFs are lost on restart; you'd need to re-upload and re-analyze a paper after the service wakes back up. This is a limitation of the free plan, not a bug — a paid plan with a persistent disk add-on would fix it.
- Embeddings use Mistral's hosted `mistral-embed` API (via `MistralAIEmbeddings` in `backend/app/services/vector_store.py`) rather than a locally-loaded model — this was a deliberate fix after `torch`/`sentence-transformers` with a local model caused the free-tier backend to run out of memory (512MB limit) and crash-loop.
