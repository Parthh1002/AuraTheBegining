# AURA (The Beginning) — PostgreSQL & Express Backend

This directory contains the custom **Node.js / Express / PostgreSQL** backend server for **AURA (The Beginning) MENS WEAR**.

## Stack & Features
- **Database**: Native PostgreSQL via direct `pg` connection pool (`src/config/db.ts`).
- **Authentication**: Custom JWT authentication (`jsonwebtoken` + `bcryptjs`) for CMS Admin (`/api/auth/login`).
- **File Storage**: Local Multer image upload handler (`src/middleware/upload.ts`) saving to `uploads/` and served statically at `/uploads`.
- **Emails**: Brevo (Sendinblue) transactional email services (`src/services/brevo.ts`).

## Directory Layout
```
Backend/
├── src/
│   ├── config/        # PostgreSQL Connection Pool (db.ts)
│   ├── db/            # Database SQL Schema (schema.sql) & Seed Script (seed.ts)
│   ├── middleware/    # Auth (auth.ts) & Multer File Upload (upload.ts)
│   ├── routes/        # Express REST API Endpoints (auth, products, collections, enquiries, etc.)
│   ├── services/      # Brevo Email Handlers (brevo.ts)
│   └── server.ts      # Express Server Entrypoint (Port 5000)
├── uploads/           # Uploaded Image Files Storage
├── .env.example       # Environment Variables Template
└── package.json
```

## Quick Start Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   Ensure PostgreSQL is running locally or remotely. Create your database (e.g. `aura_db`).
   Set database connection parameters in `.env`:
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/aura_db
   ```

3. **Run Seed & Start Server**:
   ```bash
   # Seeds tables & default admin user (admin@auramenswear.com / admin123)
   npm run seed

   # Start Development Server with Auto-Reload
   npm run dev
   ```

Default Admin Credentials seeded:
- **Email**: `admin@auramenswear.com`
- **Password**: `admin123`
