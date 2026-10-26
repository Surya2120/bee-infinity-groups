# Bee Infinity Groups Merch (/merch)

This folder is the **/merch** section for Bee Infinity Groups: a black + gold cinematic 3D merch store.

## Stack
- Frontend: React (Vite) + Tailwind + Framer Motion + React Three Fiber
- Backend: Node.js + Express
- DB: MongoDB (Mongoose)
- Auth: JWT

## Folder Structure
- `client/` React/Vite app (builds with `base=/merch/`)
- `server/` Express API (`/api/*`)

## Local Setup
1. Install dependencies:
   - `npm install`
   - `npm install --prefix client`
   - `npm install --prefix server`
2. Configure env:
   - Copy `server/.env.example` to `server/.env`
   - Copy `client/.env.example` to `client/.env` (optional)
3. Run:
   - `npm run dev`
4. Open:
   - Frontend: `http://localhost:5173/merch/`
   - API: `http://localhost:4000/api/health`

## Add Real Products + 3D Models
- Products are stored in MongoDB. Add/edit via seed script: `npm run seed`
- Place GLTF/GLB files under `client/public/models/` and set `modelUrl` on products (e.g. `/models/tshirt.glb`)

## Deployment Notes (High Level)
- Frontend build output is `client/dist/`. Upload it to your hosting under the `/merch` folder.
- Backend can be deployed to Render; set env vars from `server/.env.example`.

