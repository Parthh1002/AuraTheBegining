import { Router } from 'express';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { collection_slug, tag, is_featured, limit, search, ids } = req.query;

    let query = `
      SELECT p.*,
             c.name as collection_name, c.slug as collection_slug,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'storage_path', pi.storage_path,
                   'is_primary', pi.is_primary,
                   'display_order', pi.display_order
                 ) ORDER BY pi.display_order
               ) FILTER (WHERE pi.id IS NOT NULL), '[]'
             ) as product_images
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE 1=1
    `;

    const values: any[] = [];

    if (collection_slug) {
      values.push(collection_slug);
      query += ` AND c.slug = $${values.length}`;
    }

    if (tag) {
      values.push(tag);
      query += ` AND $${values.length} = ANY(p.tags)`;
    }

    if (is_featured === 'true') {
      query += ` AND p.is_featured = true`;
    }

    if (search) {
      values.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${values.length} OR p.description ILIKE $${values.length} OR p.fabric ILIKE $${values.length})`;
    }

    if (ids) {
      const idArray = (ids as string).split(',').map((i) => i.trim());
      values.push(idArray);
      query += ` AND p.id = ANY($${values.length})`;
    }

    query += ` GROUP BY p.id, c.name, c.slug ORDER BY p.display_order ASC, p.created_at DESC`;

    if (limit) {
      values.push(parseInt(limit as string, 10));
      query += ` LIMIT $${values.length}`;
    }

    const { rows } = await pool.query(query, values);
    return res.json(rows);
  } catch (err: any) {
    // Fallback to memoryStore
    let result = [...memoryStore.products];
    const { collection_slug, tag, is_featured, limit, search } = req.query;

    if (collection_slug) {
      result = result.filter((p) => p.collection_slug === collection_slug);
    }
    if (tag) {
      result = result.filter((p) => p.tags?.includes(tag as string));
    }
    if (is_featured === 'true') {
      result = result.filter((p) => p.is_featured);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.fabric?.toLowerCase().includes(q)
      );
    }
    if (limit) {
      result = result.slice(0, Number(limit));
    }
    return res.json(result);
  }
});

// GET /api/products/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT p.*,
             c.name as collection_name, c.slug as collection_slug,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'storage_path', pi.storage_path,
                   'is_primary', pi.is_primary,
                   'display_order', pi.display_order
                 ) ORDER BY pi.display_order
               ) FILTER (WHERE pi.id IS NOT NULL), '[]'
             ) as product_images
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.slug = $1
      GROUP BY p.id, c.name, c.slug
    `;

    const { rows } = await pool.query(query, [slug]);
    if (rows.length === 0) {
      const p = memoryStore.products.find((prod) => prod.slug === slug);
      if (!p) return res.status(404).json({ error: 'Product not found' });
      const related = memoryStore.products.filter((prod) => prod.collection_id === p.collection_id && prod.id !== p.id);
      return res.json({ product: p, relatedProducts: related });
    }

    const product = rows[0];

    const relatedQuery = `
      SELECT p.*, c.name as collection_name,
             COALESCE(
               json_agg(
                 json_build_object('storage_path', pi.storage_path, 'is_primary', pi.is_primary)
               ) FILTER (WHERE pi.id IS NOT NULL), '[]'
             ) as product_images
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.collection_id = $1 AND p.id != $2
      GROUP BY p.id, c.name
      LIMIT 4
    `;

    const relatedRes = await pool.query(relatedQuery, [product.collection_id, product.id]);

    return res.json({ product, relatedProducts: relatedRes.rows });
  } catch (err: any) {
    const p = memoryStore.products.find((prod) => prod.slug === req.params.slug);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    const related = memoryStore.products.filter((prod) => prod.collection_id === p.collection_id && prod.id !== p.id);
    return res.json({ product: p, relatedProducts: related });
  }
});

// POST /api/products (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku, images } = req.body;

    const prodRes = await pool.query(
      `INSERT INTO products (name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, slug, collection_id || null, description, fabric, sizes || [], price_label, tags || [], in_stock ?? true, is_featured ?? false, sku]
    );

    const product = prodRes.rows[0];

    if (images && Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await pool.query(
          `INSERT INTO product_images (product_id, storage_path, alt_text, display_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [product.id, img.path || img.storage_path, name, i + 1, img.is_primary || i === 0]
        );
      }
    }

    return res.status(201).json(product);
  } catch (err: any) {
    const newProd = {
      id: `p-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString(),
    };
    memoryStore.products.push(newProd);
    return res.status(201).json(newProd);
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku, images } = req.body;

    const prodRes = await pool.query(
      `UPDATE products
       SET name=$1, slug=$2, collection_id=$3, description=$4, fabric=$5, sizes=$6, price_label=$7, tags=$8, in_stock=$9, is_featured=$10, sku=$11
       WHERE id=$12 RETURNING *`,
      [name, slug, collection_id || null, description, fabric, sizes || [], price_label, tags || [], in_stock, is_featured, sku, id]
    );

    if (images && Array.isArray(images)) {
      await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await pool.query(
          `INSERT INTO product_images (product_id, storage_path, alt_text, display_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, img.path || img.storage_path, name, i + 1, img.is_primary || i === 0]
        );
      }
    }

    return res.json(prodRes.rows[0]);
  } catch (err: any) {
    const idx = memoryStore.products.findIndex((p) => p.id === req.params.id);
    if (idx !== -1) {
      memoryStore.products[idx] = { ...memoryStore.products[idx], ...req.body };
      return res.json(memoryStore.products[idx]);
    }
    return res.json({ id: req.params.id, ...req.body });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err: any) {
    memoryStore.products = memoryStore.products.filter((p) => p.id !== req.params.id);
    return res.json({ success: true });
  }
});

export default router;
