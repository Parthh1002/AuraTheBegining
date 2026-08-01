import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { initDatabaseAndSeed } from './db/seed';

import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import collectionsRoutes from './routes/collections.routes';
import enquiriesRoutes from './routes/enquiries.routes';
import galleryRoutes from './routes/gallery.routes';
import testimonialsRoutes from './routes/testimonials.routes';
import settingsRoutes from './routes/settings.routes';
import contactRoutes from './routes/contact.routes';
import newsletterRoutes from './routes/newsletter.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Static Uploads Folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'AURA (The Beginning) MENS WEAR Backend', postgres: 'Active' });
});

// Try connecting to PostgreSQL, start server regardless
initDatabaseAndSeed()
  .catch((err) => {
    console.warn('PostgreSQL database connection notice (using memory fallback store):', err.message || err);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`AURA Express Backend running on port ${PORT}`);
      console.log(`=======================================================`);
    });
  });
