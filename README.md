# AURA (The Beginning) MENS WEAR — Official Website

> **Store Reference**: AURA (The beginning) MENS WEAR — Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305 (5.0★ Google Rating).

A high-performance **Premium Men's Wear Catalog & WhatsApp Enquiry Website** built with **Next.js 14 App Router**, **PostgreSQL**, **Node.js/Express**, **GSAP + Lenis** smooth motion system, and **Brevo Transactional Emails**.

---

## 1. Top-Level Folder Architecture

The project strictly follows a two-folder structure:

```
AuraTheBegining/
├── Frontend/                 # Next.js 14 App Router Application (Storefront & Admin CMS)
│   ├── app/                  # Public storefront pages & protected /admin CMS
│   ├── components/           # UI, Animation, Product & Storefront components
│   ├── lib/                  # Unified API Client (`lib/api.ts`), WhatsApp link builder, Utils
│   └── package.json
│
└── Backend/                  # Native PostgreSQL + Express API Server
    ├── src/
    │   ├── config/           # PostgreSQL Pool (db.ts)
    │   ├── db/               # Database SQL Schema (schema.sql) & Seed Script (seed.ts)
    │   ├── middleware/       # JWT Auth (auth.ts) & Multer Uploads (upload.ts)
    │   ├── routes/           # REST API Routes (auth, products, collections, enquiries, etc.)
    │   ├── services/         # Brevo Email Handlers (brevo.ts)
    │   └── server.ts         # Express Entrypoint (Port 5000)
    ├── uploads/              # Local image storage
    └── package.json
```

---

## 2. Key Features

- **Design System**: "Aura Noir / Amber Glow" dark luxury palette (#0A0A0C, #151517, #D4A02A gold accent).
- **First-Load Animation**: GSAP 2.4s intro overlay with expanding radial amber point revealing the "AURA" clip-path wordmark.
- **Conversion System**: Direct WhatsApp enquiry checkout with encoded garment details (Name, Size, SKU, Price).
- **Backend & Database**: Zero third-party database dependency — pure native **PostgreSQL** schema & query pool.
- **Protected Admin CMS (`/admin`)**: Custom JWT authentication (`jsonwebtoken` + `bcryptjs`), live enquiry inbox, product CRUD, and local file uploads.
- **Transactional Email**: Brevo API integration for customer contact auto-replies, owner alerts, and newsletter double opt-in.

---

## 3. How to Run Locally

### Start PostgreSQL Backend (`Backend/`)
```bash
cd Backend
npm install
npm run dev
```
*App connects to PostgreSQL on `localhost:5432` and listens on Port `5000`.*

### Start Next.js Storefront (`Frontend/`)
```bash
cd Frontend
npm install
npm run dev
```
*Visit `http://localhost:3000` for storefront and `http://localhost:3000/admin` for CMS.*
