const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const router = express.Router();

// -------------------------------------------------------------
// Hostinger Persistent Storage Directories
// -------------------------------------------------------------
const UPLOADS_DIR = process.env.UPLOADS_DIR 
  ? path.resolve(process.env.UPLOADS_DIR) 
  : path.join(__dirname, 'uploads');

const PRODUCTS_DIR = path.join(UPLOADS_DIR, 'products');
const CATEGORIES_DIR = path.join(UPLOADS_DIR, 'categories');

if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}
if (!fs.existsSync(CATEGORIES_DIR)) {
  fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
}

// Multer Storage Configuration
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PRODUCTS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    cb(null, `product-${safeBase}-${uniqueSuffix}${ext}`);
  }
});

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CATEGORIES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    cb(null, `category-${safeBase}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const uploadProductMedia = multer({
  storage: productStorage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 8 }
]);

const uploadCategoryImage = multer({
  storage: categoryStorage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter
}).single('image');

// Safe file cleanup helper
async function safeDeleteStoredFile(relativePath) {
  if (!relativePath || !relativePath.startsWith('/uploads/')) return;
  const fullPath = path.join(UPLOADS_DIR, relativePath.replace('/uploads/', ''));
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`[Storage] Cleaned up file: ${fullPath}`);
    }
  } catch (err) {
    console.warn(`[Storage] Failed to delete file ${fullPath}:`, err.message);
  }
}

// POST /api/upload/product-image - Direct persistent Hostinger storage upload
const uploadSingleProduct = multer({
  storage: productStorage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 },
  fileFilter
}).single('file');

router.post('/upload/product-image', (req, res) => {
  uploadSingleProduct(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided for upload.' });
    }
    const publicUrl = `/uploads/products/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

// POST /api/upload/category-image - Direct category image upload
router.post('/upload/category-image', (req, res) => {
  uploadCategoryImage(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No category image file provided.' });
    }
    const publicUrl = `/uploads/categories/${req.file.filename}`;
    res.json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});

// =============================================================
// 1. PRODUCTS API
// =============================================================

// GET /api/products - Search, Filter, Sort, Paginate
router.get('/products', async (req, res) => {
  try {
    const {
      categoryid,
      search,
      minPrice,
      maxPrice,
      inStock,
      featured,
      bestseller,
      sort,
      limit,
      page
    } = req.query;

    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.categoryid = c.id WHERE 1=1';
    const params = [];

    if (categoryid) {
      query += ' AND p.categoryid = ?';
      params.push(Number(categoryid));
    }

    if (search && search.trim()) {
      query += ' AND (p.name LIKE ? OR p.desc LIKE ? OR p.sku LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (minPrice !== undefined && minPrice !== '') {
      query += ' AND p.price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      query += ' AND p.price <= ?';
      params.push(Number(maxPrice));
    }

    if (inStock === 'true' || inStock === '1') {
      query += ' AND p.stock > 0';
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND p.featured = 1';
    }

    if (bestseller === 'true' || bestseller === '1') {
      query += ' AND p.bestseller = 1';
    }

    // Status check
    query += " AND (p.status = 'active' OR p.status IS NULL)";

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else if (sort === 'rating_desc') {
      query += ' ORDER BY p.rating DESC, p.reviews DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY p.id DESC';
    } else {
      query += ' ORDER BY p.featured DESC, p.bestseller DESC, p.id ASC';
    }

    if (limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = parseInt(limit, 10) || 20;
      const offset = (pageNum - 1) * limitNum;
      query += ` LIMIT ${limitNum} OFFSET ${offset}`;
    }

    const [rows] = await pool.query(query, params);

    // Format JSON fields safely
    const formatted = (rows || []).map(p => ({
      ...p,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      stock: p.stock !== undefined ? Number(p.stock) : 50,
      rating: p.rating ? Number(p.rating) : 4.8,
      reviews: p.reviews ? Number(p.reviews) : 0,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || (p.image ? [p.image] : [])),
      variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || []),
      badge: p.badge_text ? { text: p.badge_text, type: p.badge_type || 'primary' } : null
    }));

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id - Single Product Details
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.categoryid = c.id WHERE p.id = ?',
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const p = rows[0];
    const formatted = {
      ...p,
      price: Number(p.price),
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      stock: p.stock !== undefined ? Number(p.stock) : 50,
      rating: p.rating ? Number(p.rating) : 4.8,
      reviews: p.reviews ? Number(p.reviews) : 0,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || (p.image ? [p.image] : [])),
      variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : (p.variants || []),
      badge: p.badge_text ? { text: p.badge_text, type: p.badge_type || 'primary' } : null
    };

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products - Create Product with Hostinger Image Upload
router.post('/products', (req, res) => {
  uploadProductMedia(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const {
        name,
        name_te,
        slug,
        desc,
        desc_te,
        price,
        oldPrice,
        categoryid,
        sku,
        stock,
        badge_text,
        badge_type,
        highlights,
        usage_instructions,
        specifications,
        featured,
        bestseller,
        status,
        variants: variantsRaw,
        existing_images: existingImagesRaw
      } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Product title is required.' });
      }

      if (!price && price !== 0) {
        return res.status(400).json({ success: false, message: 'Product price is required.' });
      }

      // Collect image URLs
      let images = [];
      if (existingImagesRaw) {
        try {
          images = typeof existingImagesRaw === 'string' ? JSON.parse(existingImagesRaw) : existingImagesRaw;
        } catch {}
      }

      if (req.files && req.files['image'] && req.files['image'][0]) {
        images.unshift(`/uploads/products/${req.files['image'][0].filename}`);
      }

      if (req.files && req.files['images']) {
        for (const f of req.files['images']) {
          images.push(`/uploads/products/${f.filename}`);
        }
      }

      if (images.length === 0) {
        images = ['/assets/product_pooja_kit.png'];
      }

      const primaryImage = images[0];

      let parsedVariants = [];
      if (variantsRaw) {
        try {
          parsedVariants = typeof variantsRaw === 'string' ? JSON.parse(variantsRaw) : variantsRaw;
        } catch {}
      }

      const safeSlug = slug && slug.trim() 
        ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') 
        : name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

      const [result] = await pool.query(
        `INSERT INTO products (
          name, name_te, slug, \`desc\`, desc_te, price, oldPrice, categoryid, sku, stock, 
          badge_text, badge_type, image, images, variants, highlights, 
          usage_instructions, specifications, featured, bestseller, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          name.trim(),
          name_te ? name_te.trim() : null,
          safeSlug,
          desc || null,
          desc_te || null,
          Number(price),
          oldPrice ? Number(oldPrice) : null,
          categoryid ? Number(categoryid) : null,
          sku ? sku.trim() : null,
          stock !== undefined ? Number(stock) : 50,
          badge_text || null,
          badge_type || 'primary',
          primaryImage,
          JSON.stringify(images),
          JSON.stringify(parsedVariants),
          highlights || null,
          usage_instructions || null,
          specifications || null,
          featured ? 1 : 0,
          bestseller ? 1 : 0,
          status || 'active'
        ]
      );

      const [newRows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Product created successfully.',
        data: newRows[0]
      });
    } catch (createErr) {
      console.error('Error creating product:', createErr);
      res.status(500).json({ success: false, message: createErr.message });
    }
  });
});

// PUT /api/products/:id - Update Product
router.put('/products/:id', (req, res) => {
  uploadProductMedia(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { id } = req.params;

    try {
      const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      if (!existing || existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }

      const current = existing[0];
      const {
        name,
        name_te,
        slug,
        desc,
        desc_te,
        price,
        oldPrice,
        categoryid,
        sku,
        stock,
        badge_text,
        badge_type,
        highlights,
        usage_instructions,
        specifications,
        featured,
        bestseller,
        status,
        variants: variantsRaw,
        existing_images: existingImagesRaw
      } = req.body;

      let images = [];
      if (existingImagesRaw !== undefined) {
        try {
          images = typeof existingImagesRaw === 'string' ? JSON.parse(existingImagesRaw) : existingImagesRaw;
        } catch {}
      } else {
        try {
          images = typeof current.images === 'string' ? JSON.parse(current.images) : (current.images || []);
        } catch {}
      }

      if (req.files && req.files['image'] && req.files['image'][0]) {
        images.unshift(`/uploads/products/${req.files['image'][0].filename}`);
      }

      if (req.files && req.files['images']) {
        for (const f of req.files['images']) {
          images.push(`/uploads/products/${f.filename}`);
        }
      }

      if (images.length === 0) {
        images = [current.image || '/assets/product_pooja_kit.png'];
      }

      const primaryImage = images[0];

      let parsedVariants = current.variants;
      if (variantsRaw !== undefined) {
        try {
          parsedVariants = typeof variantsRaw === 'string' ? JSON.parse(variantsRaw) : variantsRaw;
        } catch {}
      }

      await pool.query(
        `UPDATE products SET 
          name = ?, name_te = ?, slug = ?, \`desc\` = ?, desc_te = ?, price = ?, oldPrice = ?, categoryid = ?, 
          sku = ?, stock = ?, badge_text = ?, badge_type = ?, image = ?, images = ?, 
          variants = ?, highlights = ?, usage_instructions = ?, specifications = ?, 
          featured = ?, bestseller = ?, status = ?
        WHERE id = ?`,
        [
          name !== undefined ? name.trim() : current.name,
          name_te !== undefined ? (name_te ? name_te.trim() : null) : current.name_te,
          slug !== undefined ? slug.trim() : current.slug,
          desc !== undefined ? desc : current.desc,
          desc_te !== undefined ? desc_te : current.desc_te,
          price !== undefined ? Number(price) : current.price,
          oldPrice !== undefined ? (oldPrice ? Number(oldPrice) : null) : current.oldPrice,
          categoryid !== undefined ? (categoryid ? Number(categoryid) : null) : current.categoryid,
          sku !== undefined ? sku : current.sku,
          stock !== undefined ? Number(stock) : current.stock,
          badge_text !== undefined ? badge_text : current.badge_text,
          badge_type !== undefined ? badge_type : current.badge_type,
          primaryImage,
          JSON.stringify(images),
          typeof parsedVariants === 'string' ? parsedVariants : JSON.stringify(parsedVariants),
          highlights !== undefined ? highlights : current.highlights,
          usage_instructions !== undefined ? usage_instructions : current.usage_instructions,
          specifications !== undefined ? specifications : current.specifications,
          featured !== undefined ? (featured ? 1 : 0) : current.featured,
          bestseller !== undefined ? (bestseller ? 1 : 0) : current.bestseller,
          status !== undefined ? status : current.status,
          id
        ]
      );

      const [updatedRows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      res.json({
        success: true,
        message: 'Product updated successfully.',
        data: updatedRows[0]
      });
    } catch (updateErr) {
      console.error('Error updating product:', updateErr);
      res.status(500).json({ success: false, message: updateErr.message });
    }
  });
});

// DELETE /api/products/:id - Delete Product
router.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const product = rows[0];
    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    // Clean up stored files if they are in /uploads/
    if (product.image) safeDeleteStoredFile(product.image);
    let images = [];
    try {
      images = typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []);
    } catch {}
    for (const img of images) {
      if (img !== product.image) safeDeleteStoredFile(img);
    }

    res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/products/:id/stock - Quick Stock Update
router.patch('/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock, reason } = req.body;

  try {
    const newStock = Math.max(0, parseInt(stock, 10) || 0);
    const [existing] = await pool.query('SELECT stock FROM products WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const oldStock = existing[0].stock || 0;
    const diff = newStock - oldStock;

    await pool.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);

    if (diff !== 0) {
      await pool.query(
        'INSERT INTO inventory_movements (product_id, change_amount, reason) VALUES (?, ?, ?)',
        [id, diff, reason || 'Manual Admin Adjustment']
      );
    }

    res.json({
      success: true,
      message: 'Stock updated successfully.',
      stock: newStock
    });
  } catch (err) {
    console.error('Error updating stock:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// =============================================================
// 2. CATEGORIES API
// =============================================================

// GET /api/categories - All Categories with Product Count
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.categoryid 
      GROUP BY c.id 
      ORDER BY c.display_order ASC, c.id ASC
    `);

    res.json(rows || []);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories - Create Category with Image
router.post('/categories', (req, res) => {
  uploadCategoryImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, slug, desc, iconname, display_order, status } = req.body;
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Category name is required.' });
      }

      let imagePath = '/assets/product_pooja_kit.png';
      if (req.file) {
        imagePath = `/uploads/categories/${req.file.filename}`;
      } else if (req.body.image) {
        imagePath = req.body.image.trim();
      }

      const safeSlug = slug && slug.trim() 
        ? slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
        : name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

      const [result] = await pool.query(
        'INSERT INTO categories (name, slug, `desc`, image, iconname, display_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          name.trim(),
          safeSlug,
          desc ? desc.trim() : null,
          imagePath,
          iconname || 'Box',
          parseInt(display_order, 10) || 0,
          status || 'active'
        ]
      );

      const [newRow] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
      res.status(201).json(newRow[0]);
    } catch (createErr) {
      console.error('Error creating category:', createErr);
      res.status(500).json({ success: false, message: createErr.message });
    }
  });
});

// PUT /api/categories/:id - Update Category
router.put('/categories/:id', (req, res) => {
  uploadCategoryImage(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    const { id } = req.params;
    try {
      const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      if (!existing || existing.length === 0) {
        return res.status(404).json({ success: false, message: 'Category not found.' });
      }

      const current = existing[0];
      const { name, slug, desc, iconname, display_order, status } = req.body;

      let imagePath = current.image;
      if (req.file) {
        imagePath = `/uploads/categories/${req.file.filename}`;
        if (current.image && current.image.startsWith('/uploads/')) {
          safeDeleteStoredFile(current.image);
        }
      } else if (req.body.image) {
        imagePath = req.body.image.trim();
      }

      await pool.query(
        'UPDATE categories SET name = ?, slug = ?, `desc` = ?, image = ?, iconname = ?, display_order = ?, status = ? WHERE id = ?',
        [
          name !== undefined ? name.trim() : current.name,
          slug !== undefined ? slug.trim() : current.slug,
          desc !== undefined ? desc : current.desc,
          imagePath,
          iconname !== undefined ? iconname : current.iconname,
          display_order !== undefined ? parseInt(display_order, 10) : current.display_order,
          status !== undefined ? status : current.status,
          id
        ]
      );

      const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
      res.json(updated[0]);
    } catch (updateErr) {
      console.error('Error updating category:', updateErr);
      res.status(500).json({ success: false, message: updateErr.message });
    }
  });
});

// DELETE /api/categories/:id - Delete Category
router.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    if (existing[0].image && existing[0].image.startsWith('/uploads/')) {
      safeDeleteStoredFile(existing[0].image);
    }
    res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: err.message });
  }
});

// =============================================================
// 3. CART CALCULATION & COUPON VALIDATION API
// =============================================================

// POST /api/cart/calculate - Server-Side Totals & Stock Verification
router.post('/cart/calculate', async (req, res) => {
  try {
    const { items = [], couponCode } = req.body;

    let subtotal = 0;
    const validatedItems = [];

    // Query and validate each item against real DB prices and stock
    for (const item of items) {
      if (!item.id) continue;
      
      let itemPrice = Number(item.price) || 0;
      let itemStock = 50;
      let itemName = item.name || 'Item';
      let itemImage = item.image || item.img || '/assets/product_pooja_kit.png';

      // Check if it's a product
      const [prodRows] = await pool.query('SELECT * FROM products WHERE id = ?', [item.id]);
      if (prodRows && prodRows.length > 0) {
        const prod = prodRows[0];
        itemName = prod.name;
        itemImage = prod.image || itemImage;
        itemPrice = Number(prod.price);
        itemStock = prod.stock !== undefined ? Number(prod.stock) : 50;

        // If a specific variant was selected, match its price and stock
        if (item.variant && prod.variants) {
          try {
            const variants = typeof prod.variants === 'string' ? JSON.parse(prod.variants) : prod.variants;
            const matchedVariant = variants.find(v => v.attribute === item.variant);
            if (matchedVariant) {
              itemPrice = Number(matchedVariant.price);
              if (matchedVariant.stock !== undefined) itemStock = Number(matchedVariant.stock);
            }
          } catch {}
        }
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = itemPrice * qty;
      subtotal += lineTotal;

      validatedItems.push({
        ...item,
        name: itemName,
        image: itemImage,
        price: itemPrice,
        quantity: qty,
        lineTotal,
        inStock: itemStock >= qty,
        availableStock: itemStock
      });
    }

    // Coupon Calculation
    let discountAmount = 0;
    let couponDetails = null;

    if (couponCode && couponCode.trim()) {
      const codeUpper = couponCode.trim().toUpperCase();
      const [cRows] = await pool.query(
        "SELECT * FROM coupons WHERE UPPER(code) = ? AND (status = 'active' OR status IS NULL)", 
        [codeUpper]
      );

      if (cRows && cRows.length > 0) {
        const coupon = cRows[0];
        const now = new Date();
        const isExpired = coupon.expiry && new Date(coupon.expiry) < now;
        const minMet = !coupon.min_order_value || subtotal >= Number(coupon.min_order_value);

        if (!isExpired && minMet) {
          if (coupon.discount_type === 'fixed') {
            discountAmount = Math.min(subtotal, Number(coupon.discount));
          } else {
            discountAmount = Math.round(subtotal * (Number(coupon.discount) / 100));
            if (coupon.max_discount) {
              discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
            }
          }

          couponDetails = {
            code: coupon.code,
            discount: Number(coupon.discount),
            discount_type: coupon.discount_type || 'percentage',
            discountAmount
          };
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    // 18% GST standard on spiritual goods / samagri
    const tax = Math.round(taxableAmount * 0.18);
    // Free shipping threshold: ₹499
    const shippingFee = (subtotal === 0 || taxableAmount >= 499) ? 0 : 50;
    const finalTotal = taxableAmount + tax + shippingFee;

    res.json({
      success: true,
      subtotal,
      discount: discountAmount,
      taxableAmount,
      tax,
      shippingFee,
      freeShippingThreshold: 499,
      totalAmount: finalTotal,
      coupon: couponDetails,
      items: validatedItems
    });
  } catch (err) {
    console.error('Error calculating cart totals:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/coupons/validate - Validate a coupon code
router.post('/coupons/validate', async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ valid: false, message: 'Please enter a coupon code.' });
  }

  try {
    const codeUpper = code.trim().toUpperCase();
    const [cRows] = await pool.query(
      "SELECT * FROM coupons WHERE UPPER(code) = ? AND (status = 'active' OR status IS NULL)", 
      [codeUpper]
    );

    if (!cRows || cRows.length === 0) {
      return res.status(400).json({ valid: false, message: 'Invalid coupon code.' });
    }

    const coupon = cRows[0];
    const now = new Date();
    if (coupon.expiry && new Date(coupon.expiry) < now) {
      return res.status(400).json({ valid: false, message: 'This coupon has expired.' });
    }

    const minSpend = Number(coupon.min_order_value) || 0;
    if (subtotal > 0 && subtotal < minSpend) {
      return res.status(400).json({ 
        valid: false, 
        message: `Minimum order value of ₹${minSpend} required for this coupon.` 
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'fixed') {
      discountAmount = Math.min(subtotal, Number(coupon.discount));
    } else {
      discountAmount = Math.round(subtotal * (Number(coupon.discount) / 100));
      if (coupon.max_discount) {
        discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
      }
    }

    res.json({
      valid: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      data: {
        code: coupon.code,
        discount: Number(coupon.discount),
        discount_type: coupon.discount_type || 'percentage',
        discountAmount
      }
    });
  } catch (err) {
    console.error('Error validating coupon:', err);
    res.status(500).json({ valid: false, message: err.message });
  }
});

// =============================================================
// 4. ORDERS & CHECKOUT API
// =============================================================

// POST /api/orders - Place Order with Inventory Deduction & Price Lock
router.post('/orders', async (req, res) => {
  try {
    const {
      customerid,
      items = [],
      shippingDetails = {},
      paymentMethod = 'Cash on Delivery',
      couponApplied,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty.' });
    }

    // Server-side recalculate totals to avoid frontend price manipulation
    let subtotal = 0;
    const finalItems = [];

    for (const item of items) {
      let price = Number(item.price) || 0;
      let name = item.name || 'Order Item';
      let img = item.img || item.image || '/assets/product_pooja_kit.png';

      // Cross-verify with DB
      if (item.id) {
        const [pRows] = await pool.query('SELECT name, price, stock, variants, image FROM products WHERE id = ?', [item.id]);
        if (pRows && pRows.length > 0) {
          const prod = pRows[0];
          name = prod.name;
          price = Number(prod.price);
          img = prod.image || img;

          if (item.variant && prod.variants) {
            try {
              const variants = typeof prod.variants === 'string' ? JSON.parse(prod.variants) : prod.variants;
              const matched = variants.find(v => v.attribute === item.variant);
              if (matched) price = Number(matched.price);
            } catch {}
          }
        }
      }

      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      subtotal += price * qty;

      finalItems.push({
        id: item.id,
        name,
        price,
        quantity: qty,
        variant: item.variant || null,
        image: img,
        pandit: item.pandit || null,
        date: item.date || null,
        time: item.time || null,
        type: item.pandit ? 'pooja' : 'product'
      });
    }

    // Validate coupon
    let discount = 0;
    if (couponApplied) {
      const [cRows] = await pool.query("SELECT * FROM coupons WHERE UPPER(code) = ?", [couponApplied.toUpperCase()]);
      if (cRows && cRows.length > 0) {
        const c = cRows[0];
        if (!c.expiry || new Date(c.expiry) >= new Date()) {
          discount = c.discount_type === 'fixed' 
            ? Math.min(subtotal, Number(c.discount)) 
            : Math.round(subtotal * (Number(c.discount) / 100));
        }
      }
    }

    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.18);
    const shippingFee = (subtotal === 0 || taxableAmount >= 499) ? 0 : 50;
    const totalAmount = taxableAmount + tax + shippingFee;

    // Generate readable order number
    const uniqueNum = `GS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending';

    // Insert order into DB
    const [orderResult] = await pool.query(
      `INSERT INTO orders (
        order_number, customerid, status, items, subtotal, discount, tax, 
        shipping_fee, \`totalAmount\`, \`paymentMethod\`, paymentStatus, 
        \`shippingDetails\`, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uniqueNum,
        customerid ? Number(customerid) : null,
        'Confirmed',
        JSON.stringify(finalItems),
        subtotal,
        discount,
        tax,
        shippingFee,
        totalAmount,
        paymentMethod,
        paymentStatus,
        JSON.stringify(shippingDetails),
        notes || null
      ]
    );

    const orderId = orderResult.insertId;

    // Concurrency-safe inventory deduction for physical products
    for (const item of finalItems) {
      if (item.id && !item.pandit) {
        try {
          await pool.query(
            'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
            [item.quantity, item.id]
          );
          await pool.query(
            'INSERT INTO inventory_movements (product_id, change_amount, reason, reference_id) VALUES (?, ?, ?, ?)',
            [item.id, -item.quantity, 'Order Placed', uniqueNum]
          );
        } catch (stockErr) {
          console.warn(`[Inventory] Could not update stock for product ${item.id}:`, stockErr.message);
        }
      }
    }

    const [createdRows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const createdOrder = createdRows[0];

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order: {
        ...createdOrder,
        items: finalItems,
        shippingDetails
      }
    });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders - Fetch orders (supports ?customerid=... for profile and search/filter for admin)
router.get('/orders', async (req, res) => {
  try {
    const { customerid, status, search, startDate, endDate } = req.query;
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (customerid) {
      query += ' AND customerid = ?';
      params.push(Number(customerid));
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      query += ' AND (order_number LIKE ? OR id LIKE ? OR shippingDetails LIKE ?)';
      const t = `%${search.trim()}%`;
      params.push(t, t, t);
    }

    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate + ' 23:59:59');
    }

    query += ' ORDER BY id DESC';

    const [rows] = await pool.query(query, params);

    const formatted = (rows || []).map(o => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
      shippingDetails: typeof o.shippingDetails === 'string' ? JSON.parse(o.shippingDetails) : (o.shippingDetails || {})
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id - Single Order
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const o = rows[0];
    res.json({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
      shippingDetails: typeof o.shippingDetails === 'string' ? JSON.parse(o.shippingDetails) : (o.shippingDetails || {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT & PATCH /api/orders/:id - Update Order Status / Shipping
router.patch('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const {
    status,
    paymentStatus,
    tracking_number,
    courier_name,
    estimated_delivery,
    notes
  } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const current = existing[0];
    const newStatus = status || current.status;

    // If order is transitioning to Cancelled from another status, restore inventory stock
    if (newStatus === 'Cancelled' && current.status !== 'Cancelled') {
      try {
        const items = typeof current.items === 'string' ? JSON.parse(current.items) : (current.items || []);
        for (const item of items) {
          if (item.id && !item.pandit) {
            await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.id]);
            await pool.query(
              'INSERT INTO inventory_movements (product_id, change_amount, reason, reference_id) VALUES (?, ?, ?, ?)',
              [item.id, item.quantity, 'Order Cancelled (Restock)', current.order_number || id]
            );
          }
        }
      } catch (restockErr) {
        console.warn('[Inventory] Failed to restock cancelled order:', restockErr.message);
      }
    }

    await pool.query(
      `UPDATE orders SET 
        status = ?, paymentStatus = ?, tracking_number = ?, 
        courier_name = ?, estimated_delivery = ?, notes = ?
      WHERE id = ?`,
      [
        newStatus,
        paymentStatus !== undefined ? paymentStatus : current.paymentStatus,
        tracking_number !== undefined ? tracking_number : current.tracking_number,
        courier_name !== undefined ? courier_name : current.courier_name,
        estimated_delivery !== undefined ? estimated_delivery : current.estimated_delivery,
        notes !== undefined ? notes : current.notes,
        id
      ]
    );

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Order updated successfully.',
      data: updated[0]
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/status - Dedicated status change endpoint
router.patch('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, cancelReason } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    const current = existing[0];
    const newStatus = status || current.status;

    if (newStatus === 'Cancelled' && current.status !== 'Cancelled') {
      try {
        const items = typeof current.items === 'string' ? JSON.parse(current.items) : (current.items || []);
        for (const item of items) {
          if (item.id && !item.pandit) {
            await pool.query('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.id]);
            await pool.query(
              'INSERT INTO inventory_movements (product_id, change_amount, reason, reference_id) VALUES (?, ?, ?, ?)',
              [item.id, item.quantity, cancelReason || 'Order Cancelled (Restock)', current.order_number || id]
            );
          }
        }
      } catch (restockErr) {
        console.warn('[Inventory] Failed to restock cancelled order:', restockErr.message);
      }
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id]);
    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Order status updated to ${newStatus}`,
      data: updated[0]
    });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/orders/:id/tracking - Dedicated shipment tracking endpoint
router.patch('/orders/:id/tracking', async (req, res) => {
  const { id } = req.params;
  const { courier_name, tracking_number, estimated_delivery } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const current = existing[0];
    const newStatus = (current.status === 'Confirmed' || current.status === 'Processing') ? 'Shipped' : current.status;

    await pool.query(
      'UPDATE orders SET courier_name = ?, tracking_number = ?, estimated_delivery = ?, status = ? WHERE id = ?',
      [courier_name || null, tracking_number || null, estimated_delivery || null, newStatus, id]
    );

    const [updated] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Shipment and tracking details updated successfully.',
      data: updated[0]
    });
  } catch (err) {
    console.error('Error updating tracking:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// =============================================================
// 5. REVIEWS & RATINGS API
// =============================================================

// GET /api/products/:id/reviews
router.get('/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM product_reviews WHERE product_id = ? ORDER BY id DESC', [id]);
    res.json({ success: true, data: rows || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products/:id/reviews
router.post('/products/:id/reviews', async (req, res) => {
  const { id } = req.params;
  const customer_name = (req.body.customer_name || req.body.name || '').trim();
  const customer_email = (req.body.customer_email || req.body.email || '').trim();
  const rating = req.body.rating;
  const review_title = req.body.review_title || req.body.title || null;
  const comment = (req.body.comment || '').trim();

  if (!customer_name || !comment || !rating) {
    return res.status(400).json({ success: false, message: 'Name, rating, and comment are required.' });
  }

  try {
    const rVal = Math.min(5, Math.max(1, parseInt(rating, 10) || 5));
    const [insRes] = await pool.query(
      'INSERT INTO product_reviews (product_id, customer_name, customer_email, rating, review_title, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [id, customer_name, customer_email || null, rVal, review_title, comment]
    );

    // Recalculate product rating & reviews count
    const [reviewsRows] = await pool.query('SELECT rating FROM product_reviews WHERE product_id = ?', [id]);
    if (reviewsRows && reviewsRows.length > 0) {
      const avg = reviewsRows.reduce((sum, r) => sum + r.rating, 0) / reviewsRows.length;
      await pool.query(
        'UPDATE products SET rating = ?, reviews = ? WHERE id = ?',
        [avg.toFixed(1), reviewsRows.length, id]
      );
    }

    const newRev = {
      id: insRes?.insertId || Date.now(),
      product_id: id,
      customer_name,
      customer_email,
      rating: rVal,
      review_title,
      comment,
      created_at: new Date().toISOString()
    };

    res.status(201).json({ success: true, message: 'Review submitted successfully.', data: newRev });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// =============================================================
// 6. INVENTORY & ANALYTICS API
// =============================================================

// GET /api/admin/inventory
router.get('/admin/inventory', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.sku, p.price, p.stock, p.image, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.categoryid = c.id 
      ORDER BY p.stock ASC, p.id ASC
    `);

    const lowStock = (rows || []).filter(r => (r.stock || 0) < 10);
    const outOfStock = (rows || []).filter(r => (r.stock || 0) <= 0);

    res.json({
      success: true,
      totalCount: rows.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      data: rows || []
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/dashboard-stats - Real-time Authoritative Database Metrics
router.get('/admin/dashboard-stats', async (req, res) => {
  try {
    const [allProducts] = await pool.query('SELECT id, name, price, stock, status, categoryid FROM products');
    const [allCategories] = await pool.query('SELECT id, name FROM categories');
    const [allOrders] = await pool.query('SELECT * FROM orders ORDER BY id DESC');
    const [allCustomers] = await pool.query('SELECT id, name, email, created_at FROM customers');
    const [allPoojas] = await pool.query('SELECT id, name FROM poojas');
    const [allHomams] = await pool.query('SELECT id, name FROM homams');
    
    let allBookings = [];
    try {
      const [bRows] = await pool.query('SELECT * FROM bookings ORDER BY id DESC');
      allBookings = bRows || [];
    } catch (bErr) {
      console.warn('[DashboardStats] Bookings query notice:', bErr.message);
    }

    const productsList = allProducts || [];
    const ordersList = allOrders || [];
    const customersList = allCustomers || [];
    const categoriesList = allCategories || [];
    const bookingsList = allBookings || [];

    // Products breakdown
    const totalProducts = productsList.length;
    const activeProducts = productsList.filter(p => (p.status || 'active') === 'active').length;
    const inactiveProducts = productsList.filter(p => p.status === 'inactive').length;
    const lowStockCount = productsList.filter(p => {
      const s = p.stock !== undefined ? p.stock : 50;
      return s > 0 && s <= 10;
    }).length;
    const outOfStockCount = productsList.filter(p => {
      const s = p.stock !== undefined ? p.stock : 50;
      return s === 0;
    }).length;

    // Categories & Customers
    const totalCategories = categoriesList.length;
    const totalCustomers = customersList.length;

    // Separate Bookings Breakdown (Spiritual Services)
    const totalBookings = bookingsList.length;
    const bookingsByStatus = {
      'Pending Review': 0,
      'Awaiting Customer Confirmation': 0,
      'Confirmed': 0,
      'Pandit Assigned': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0,
      'Rejected': 0
    };

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let todayBookings = 0;
    let monthlyBookings = 0;

    bookingsList.forEach(b => {
      const st = b.status || 'Pending Review';
      bookingsByStatus[st] = (bookingsByStatus[st] || 0) + 1;

      const bDate = new Date(b.created_at || Date.now());
      const bDateStr = bDate.toISOString().split('T')[0];
      if (bDateStr === todayStr) {
        todayBookings++;
      }
      if (bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear) {
        monthlyBookings++;
      }
    });

    const pendingBookings = bookingsByStatus['Pending Review'] || 0;
    const confirmedBookings = bookingsByStatus['Confirmed'] || 0;
    const panditAssignedBookings = bookingsByStatus['Pandit Assigned'] || 0;
    const completedBookings = bookingsByStatus['Completed'] || 0;
    const cancelledBookings = bookingsByStatus['Cancelled'] || 0;

    // Separate Orders Breakdown (E-Commerce Store)
    const totalOrders = ordersList.length;
    const ordersByStatus = {
      Confirmed: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0
    };
    ordersList.forEach(o => {
      const st = o.status || 'Confirmed';
      ordersByStatus[st] = (ordersByStatus[st] || 0) + 1;
    });

    // Authoritative Revenue (ONLY from real e-commerce orders, excluding cancelled)
    let grossRevenue = 0;
    let netRevenue = 0;
    let todayRevenue = 0;
    let monthlyRevenue = 0;

    ordersList.forEach(o => {
      const amt = Number(o.totalAmount) || 0;
      grossRevenue += amt;
      if (o.status !== 'Cancelled') {
        netRevenue += amt;
      }

      const oDate = new Date(o.date || o.created_at || Date.now());
      const oDateStr = oDate.toISOString().split('T')[0];
      if (oDateStr === todayStr && o.status !== 'Cancelled') {
        todayRevenue += amt;
      }
      if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear && o.status !== 'Cancelled') {
        monthlyRevenue += amt;
      }
    });

    // Top selling products calculated from real order items
    const productSalesMap = {};
    ordersList.forEach(o => {
      if (o.status === 'Cancelled') return;
      let items = [];
      try {
        items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
      } catch {}
      items.forEach(it => {
        if (!it.name) return;
        if (!productSalesMap[it.name]) {
          productSalesMap[it.name] = {
            id: it.id,
            name: it.name,
            totalSold: 0,
            revenue: 0,
            image: it.image || '/assets/product_pooja_kit.png'
          };
        }
        const q = Number(it.quantity) || 1;
        const p = Number(it.price) || 0;
        productSalesMap[it.name].totalSold += q;
        productSalesMap[it.name].revenue += (p * q);
      });
    });

    const topSelling = Object.values(productSalesMap)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    // Revenue trends: 7 Days & 30 Days
    const trend7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      let dayRev = 0;
      ordersList.forEach(o => {
        if (o.status === 'Cancelled') return;
        const oDateStr = new Date(o.date || o.created_at || Date.now()).toISOString().split('T')[0];
        if (oDateStr === dStr) dayRev += (Number(o.totalAmount) || 0);
      });
      trend7Days.push({ name: label, revenue: dayRev });
    }

    const trend30Days = [];
    for (let i = 29; i >= 0; i -= 3) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      let dayRev = 0;
      ordersList.forEach(o => {
        if (o.status === 'Cancelled') return;
        const oDateStr = new Date(o.date || o.created_at || Date.now()).toISOString().split('T')[0];
        if (oDateStr === dStr) dayRev += (Number(o.totalAmount) || 0);
      });
      trend30Days.push({ name: label, revenue: dayRev });
    }

    res.json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        lowStockCount,
        outOfStockCount,
        totalCategories,
        totalCustomers,
        totalOrders,
        totalPoojas: (allPoojas || []).length,
        totalHomams: (allHomams || []).length,
        // Authoritative Bookings
        totalBookings,
        pendingBookings,
        confirmedBookings,
        panditAssignedBookings,
        completedBookings,
        cancelledBookings,
        todayBookings,
        monthlyBookings,
        bookingsByStatus,
        recentBookings: bookingsList.slice(0, 5),
        // E-commerce orders & revenue
        ordersByStatus,
        grossRevenue,
        netRevenue,
        todayRevenue,
        monthlyRevenue,
        recentOrders: ordersList.slice(0, 5),
        topSelling,
        chart7Days: trend7Days,
        chart30Days: trend30Days
      }
    });

  } catch (err) {
    console.error('Error computing dashboard stats:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews - All Customer Reviews for Admin Moderation
router.get('/reviews', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, p.name as product_name, p.image as product_image 
      FROM product_reviews r 
      LEFT JOIN products p ON r.product_id = p.id 
      ORDER BY r.id DESC
    `);
    res.json({ success: true, data: rows || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id - Remove Customer Review
router.delete('/reviews/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM product_reviews WHERE id = ?', [id]);
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/customers - Customers List with Order History Aggregates
router.get('/admin/customers', async (req, res) => {
  try {
    const [customers] = await pool.query('SELECT id, name, email, created_at FROM customers ORDER BY id DESC');
    const [orders] = await pool.query('SELECT customerid, totalAmount, date, created_at, status FROM orders');

    const customerStats = (customers || []).map(c => {
      const userOrders = (orders || []).filter(o => String(o.customerid) === String(c.id));
      const validOrders = userOrders.filter(o => o.status !== 'Cancelled');
      const totalSpent = validOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
      const lastOrder = userOrders.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))[0];

      return {
        ...c,
        ordersCount: userOrders.length,
        totalSpent,
        lastOrderDate: lastOrder ? (lastOrder.date || lastOrder.created_at) : null
      };
    });

    res.json({ success: true, data: customerStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/reports - Sales Performance & Category Reports
router.get('/admin/reports', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE status != "Cancelled"');
    const [categories] = await pool.query('SELECT id, name FROM categories');

    let totalRevenue = 0;
    let totalItemsSold = 0;
    const categorySales = {};

    (categories || []).forEach(c => {
      categorySales[c.name] = 0;
    });

    (orders || []).forEach(o => {
      totalRevenue += Number(o.totalAmount) || 0;
      let items = [];
      try {
        items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []);
      } catch {}

      items.forEach(it => {
        const qty = Number(it.quantity) || 1;
        totalItemsSold += qty;
        const lineVal = (Number(it.price) || 0) * qty;
        const catName = it.category_name || (categories.find(c => c.id === it.categoryid)?.name) || 'Pooja Kits';
        categorySales[catName] = (categorySales[catName] || 0) + lineVal;
      });
    });

    const categoryBreakdown = Object.keys(categorySales).map(k => ({
      category: k,
      sales: categorySales[k]
    })).sort((a, b) => b.sales - a.sales);

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders: (orders || []).length,
        totalItemsSold,
        averageOrderValue: (orders || []).length > 0 ? Math.round(totalRevenue / orders.length) : 0,
        categoryBreakdown
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = {
  ecommerceRouter: router,
  UPLOADS_DIR,
  PRODUCTS_DIR,
  CATEGORIES_DIR
};
