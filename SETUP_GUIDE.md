# Complete Setup Guide - React Flow Project with Template Feature

## Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v12 or higher) installed and running
3. **npm** or **yarn** package manager

## Step 1: Database Setup

### 1.1 Create PostgreSQL Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE react_flow_db;
```

### 1.2 Verify Database Creation

```sql
\l
```

You should see `react_flow_db` in the list.

## Step 2: Backend Setup

### 2.1 Navigate to Server Directory

```bash
cd server
```

### 2.2 Install Backend Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `pg` - PostgreSQL client
- `cors` - CORS middleware
- `dotenv` - Environment variables

### 2.3 Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

Add the following content to `server/.env`:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=react_flow_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `your_postgres_password_here` with your actual PostgreSQL password.

### 2.4 How Tables Are Created

The tables are created **automatically** when you start the server. Here's how it works:

1. **Migration Script** (`server/database/migrate.js`):
   - Reads the SQL schema from `server/database/schema.sql`
   - Executes the SQL to create tables and indexes
   - Uses `CREATE TABLE IF NOT EXISTS` so it's safe to run multiple times

2. **Automatic Migration** (`server/server.js`):
   - When the server starts, it calls `await migrate()`
   - This runs before the server starts listening
   - If migration fails, the server won't start

3. **Schema File** (`server/database/schema.sql`):
   - Contains the `CREATE TABLE` statement for `Template_diagram`
   - Creates indexes for better query performance
   - Uses `IF NOT EXISTS` to prevent errors if table already exists

### 2.5 Start Backend Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

**Expected Output:**
```
Connected to PostgreSQL database
Database migration completed successfully
Server is running on port 3000
Health check: http://localhost:3000/health
Templates API: http://localhost:3000/api/templates
```

### 2.6 Verify Database Tables

You can verify the table was created by connecting to PostgreSQL:

```sql
\c react_flow_db
\dt
```

You should see `Template_diagram` table listed.

To see the table structure:

```sql
\d Template_diagram
```

## Step 3: Frontend Setup

### 3.1 Navigate to Root Directory

```bash
cd ..
```

(From the server directory, go back to project root)

### 3.2 Install Frontend Dependencies

```bash
npm install
```

### 3.3 Configure Frontend Environment Variables

Create a `.env` file in the **root** directory (not in server folder):

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Linux/Mac
touch .env
```

Add the following content to `.env` (in root directory):

```env
REACT_APP_API_URL=http://localhost:3000
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 4: Verify Everything Works

### 4.1 Check Backend Health

Open browser and visit: `http://localhost:3000/health`

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### 4.2 Check Templates API

Visit: `http://localhost:3000/api/templates/names`

You should see an empty array (or templates if you've created any):
```json
[]
```

### 4.3 Check Frontend

Open: `http://localhost:5173`

You should see the React Flow application with:
- Template selector dropdown (may be empty initially)
- Template sidebar
- Flow canvas

## Troubleshooting

### Database Connection Issues

**Error:** `Connection refused` or `password authentication failed`

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Linux/Mac
   sudo systemctl status postgresql
   ```

2. Check your `.env` file has correct credentials
3. Verify database exists: `\l` in psql
4. Test connection manually:
   ```bash
   psql -h localhost -U postgres -d react_flow_db
   ```

### Migration Errors

**Error:** `relation "Template_diagram" already exists`

**Solution:** This is normal if the table already exists. The migration uses `IF NOT EXISTS` so it's safe.

**Error:** `permission denied`

**Solution:** Ensure your PostgreSQL user has CREATE TABLE permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE react_flow_db TO postgres;
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
1. Change PORT in `server/.env` to another port (e.g., 3001)
2. Update `REACT_APP_API_URL` in root `.env` to match
3. Or stop the process using port 3000

### CORS Errors

**Error:** CORS policy blocking requests

**Solution:** Ensure `CORS_ORIGIN` in `server/.env` matches your frontend URL (default: `http://localhost:5173`)

## Manual Migration (Optional)

If you want to run the migration manually without starting the server:

```bash
cd server
node database/migrate.js
```

This will:
1. Connect to the database
2. Execute the schema.sql file
3. Create tables and indexes
4. Exit

## Project Structure

```
React-flow/
├── server/                 # Backend server
│   ├── database/
│   │   ├── connection.js  # PostgreSQL connection pool
│   │   ├── migrate.js      # Migration script
│   │   └── schema.sql      # Database schema
│   ├── routes/
│   │   └── templateRoutes.js  # API routes
│   ├── .env               # Backend environment variables
│   ├── package.json
│   └── server.js          # Server entry point
├── src/                   # Frontend React app
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── ...
├── .env                   # Frontend environment variables
└── package.json
```

## Quick Start Commands Summary

```bash
# 1. Create database (in PostgreSQL)
CREATE DATABASE react_flow_db;

# 2. Setup and start backend
cd server
npm install
# Edit .env with your database credentials
npm start

# 3. Setup and start frontend (in new terminal)
cd ..  # Back to root
npm install
# Create .env with REACT_APP_API_URL=http://localhost:3000
npm run dev
```

## Next Steps

Once everything is running:
1. Select nodes on the canvas
2. Click "Save as Template" button
3. Enter a template name
4. Template will be saved to database
5. Select template from dropdown
6. Drag template from sidebar to canvas

