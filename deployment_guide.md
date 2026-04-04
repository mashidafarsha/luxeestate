# 🚀 Deployment Guide: LuxeEstate AI

This guide provides a professional roadmap for deploying **LuxeEstate AI** to a production-grade cloud environment.

---

## 🏗️ 1. Infrastructure Preparation

### MongoDB Atlas (Database)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
2. Create a new **Shared Cluster** (Free Tier).
3. Under **Network Access**, allow access from `0.0.0.0/0` (Temporary for Vercel/Render).
4. Under **Database Access**, create a user with `readWriteAnyDatabase` permissions.
5. Copy your **Connection String** (SRV) for the `.env` configuration.

---

## 🎨 2. Frontend Deployment (Vercel)

LuxeEstate AI is optimized for Vercel's Edge Network.

1. **Connect Repository**: Link your GitHub repo to Vercel.
2. **Build Settings**:
   - Framework: `Vite` (Auto-detected).
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://luxeestate-api.onrender.com`).

---

## ⚙️ 3. Backend Deployment (Render / Railway)

### Using Render
1. Create a new **Web Service**.
2. **Connect Repository**: Select the same GitHub repo.
3. **Build Settings**:
   - Runtime: `Node.js`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start` (or `node server.js`)
4. **Environment Variables**:
   - `PORT`: `5000` (Render will override if needed).
   - `MONGO_URI`: Your SRV string from MongoDB Atlas.
   - `JWT_SECRET`: A long, unique string (e.g., `PLATINUM_SECURE_VAULT_2024`).
   - `NODE_ENV`: `production`

---

## 🛡️ 4. Final Verification Checklist

| Task | Status |
| :--- | :--- |
| **CORS Configuration** | Ensure `backend/server.js` allows your Vercel URL. |
| **Auth Persistency** | Verify `localStorage` is holding session tokens on the production domain. |
| **Environment Keys** | Double-check that `VITE_API_URL` does NOT have a trailing slash. |
| **Asset URLs** | Confirm all Unsplash image links are resolving. |

---

## 🌌 Support & Maintenance
LuxeEstate AI is designed as a standalone enterprise asset. For any technical escalations or feature expansions (e.g., Stripe Payment Integration), please refer to the private repository documentation.

*LuxeEstate AI Engineering — Precision. Performance. Platinum.*
