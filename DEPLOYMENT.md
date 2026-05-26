# Cloud Deployment

This project is set up for:

- Frontend: Vercel
- Backend API: Render
- Production database: Render Postgres

## 1. Deploy Backend On Render

1. Push this repository to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml` and create:
   - `vantor-marketplace-api`
   - `vantor-marketplace-db`
4. Set `FRONTEND_URL` after the Vercel frontend URL is available.
5. Render build command:

```bash
npm run render:build
```

6. Render start command:

```bash
npm start
```

## 2. Deploy Frontend On Vercel

1. Import the same GitHub repository in Vercel.
2. Set the project root directory to:

```text
frontend/my-react-app
```

3. Vercel settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. Add this environment variable:

```text
VITE_API_BASE_URL=https://your-render-api.onrender.com/api
```

## 3. Connect Frontend And Backend

After Vercel deploys, copy the Vercel URL and set this Render environment variable:

```text
FRONTEND_URL=https://your-vercel-app.vercel.app
```

Redeploy the Render service after updating `FRONTEND_URL`.

## Notes

- Local development currently uses SQLite through `backend/prisma/schema.prisma`.
- Production uses Postgres through `backend/prisma/schema.production.prisma`.
- Uploaded files are stored on the Render instance filesystem. For real production use, move uploads to S3, Cloudinary, or another object storage service.
