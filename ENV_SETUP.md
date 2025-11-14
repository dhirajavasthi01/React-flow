# Environment Variables Setup for Vite

## Important: Vite Environment Variables

Vite uses `import.meta.env` instead of `process.env`, and environment variables must be prefixed with `VITE_` to be exposed to client-side code.

## Frontend .env File

Create or update `.env` file in the **root directory** (not in server folder):

```env
VITE_API_URL=http://localhost:3000
```

**OR** if you want to keep the old naming for compatibility:

```env
REACT_APP_API_URL=http://localhost:3000
```

The code now supports both `VITE_API_URL` and `REACT_APP_API_URL`.

## Backend .env File

The backend `.env` file in `server/` folder uses standard `process.env` (Node.js):

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=react_flow_db
DB_USER=postgres
DB_PASSWORD=admin
CORS_ORIGIN=http://localhost:5173
```

## Quick Fix

1. **Create/Update root `.env` file:**
   ```env
   VITE_API_URL=http://localhost:3000
   ```

2. **Restart the frontend dev server** after creating/updating `.env`:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

## Note

- Vite only exposes variables prefixed with `VITE_` to the client
- Variables without `VITE_` prefix are not accessible in browser code
- Restart dev server after changing `.env` file

