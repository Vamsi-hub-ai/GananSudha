const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');

const router = express.Router();

// Determine persistent storage directories
const UPLOADS_DIR = process.env.UPLOADS_DIR 
  ? path.resolve(process.env.UPLOADS_DIR) 
  : path.join(__dirname, 'uploads');
const BANNERS_DIR = path.join(UPLOADS_DIR, 'banners');

// Ensure upload directory exists
if (!fs.existsSync(BANNERS_DIR)) {
  fs.mkdirSync(BANNERS_DIR, { recursive: true });
}

// Configure Multer Disk Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, BANNERS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `banner-${safeBase}-${uniqueSuffix}${ext}`);
  }
});

// Allowed file types: JPEG, PNG, WebP
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024 // 5MB default
  },
  fileFilter
});

const bannerUploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 }
]);

// Helper to remove an uploaded file safely if not used elsewhere
async function safeDeleteFile(relativePath) {
  if (!relativePath || !relativePath.startsWith('/uploads/banners/')) {
    return; // Do not touch external or bundled assets
  }

  const filename = path.basename(relativePath);
  const fullPath = path.join(BANNERS_DIR, filename);

  try {
    // Check if another banner references this same file
    const [rows] = await pool.query(
      'SELECT id FROM banners WHERE image_path = ? OR mobile_image_path = ?', 
      [relativePath, relativePath]
    );
    if (rows && rows.length > 0) {
      return; // Still in use
    }

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`[Storage] Deleted old banner file: ${fullPath}`);
    }
  } catch (err) {
    console.warn(`[Storage] Error cleaning up file ${fullPath}:`, err.message);
  }
}

// -------------------------------------------------------------
// 1. GET /api/banners/active - Public Active Banners for Homepage
// -------------------------------------------------------------
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    // Query active banners
    const [rows] = await pool.query(`SELECT * FROM banners WHERE status = 'active' ORDER BY display_order ASC, id ASC`);
    
    // Filter by schedule in case query returns raw rows
    const activeBanners = (rows || []).filter(b => {
      if (b.status !== 'active') return false;
      if (b.start_at && new Date(b.start_at) > now) return false;
      if (b.end_at && new Date(b.end_at) < now) return false;
      return true;
    });

    res.json({
      success: true,
      data: activeBanners
    });
  } catch (err) {
    console.error('Error fetching active banners:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// -------------------------------------------------------------
// 2. GET /api/admin/banners or /api/banners - All Banners for Admin
// -------------------------------------------------------------
router.get(['/', '/admin'], async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM banners ORDER BY display_order ASC, id ASC`);
    res.json({
      success: true,
      data: rows || []
    });
  } catch (err) {
    console.error('Error fetching admin banners:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 3. POST /api/admin/banners or /api/banners - Create a New Banner
// -------------------------------------------------------------
router.post(['/', '/admin'], (req, res) => {
  bannerUploadFields(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, message: uploadErr.message });
    }

    try {
      const {
        title,
        subtitle,
        alt_text,
        cta_text,
        cta_url,
        display_order,
        status,
        start_at,
        end_at,
        existing_image_path
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Banner title is required.' });
      }

      let imagePath = null;
      if (req.files && req.files['image'] && req.files['image'][0]) {
        imagePath = `/uploads/banners/${req.files['image'][0].filename}`;
      } else if (existing_image_path) {
        imagePath = existing_image_path.trim();
      } else if (req.body.image_url) {
        imagePath = req.body.image_url.trim();
      } else if (req.body.image) {
        imagePath = req.body.image.trim();
      }

      if (!imagePath) {
        return res.status(400).json({ success: false, message: 'Banner image is required.' });
      }

      let mobileImagePath = null;
      if (req.files && req.files['mobile_image'] && req.files['mobile_image'][0]) {
        mobileImagePath = `/uploads/banners/${req.files['mobile_image'][0].filename}`;
      } else if (req.body.existing_mobile_image_path) {
        mobileImagePath = req.body.existing_mobile_image_path.trim();
      } else if (req.body.mobile_image_url) {
        mobileImagePath = req.body.mobile_image_url.trim();
      } else if (req.body.mobile_image) {
        mobileImagePath = req.body.mobile_image.trim();
      }

      const orderVal = parseInt(display_order, 10) || 0;
      const statusVal = status === 'active' ? 'active' : 'inactive';
      const startAtVal = start_at && start_at.trim() ? start_at.trim() : null;
      const endAtVal = end_at && end_at.trim() ? end_at.trim() : null;

      const [result] = await pool.query(
        `INSERT INTO banners (
          title, subtitle, image_path, mobile_image_path, alt_text, 
          cta_text, cta_url, display_order, status, start_at, end_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title.trim(),
          subtitle ? subtitle.trim() : null,
          imagePath,
          mobileImagePath,
          alt_text ? alt_text.trim() : null,
          cta_text ? cta_text.trim() : null,
          cta_url ? cta_url.trim() : null,
          orderVal,
          statusVal,
          startAtVal,
          endAtVal
        ]
      );

      const [newRow] = await pool.query('SELECT * FROM banners WHERE id = ?', [result.insertId]);

      res.status(201).json({
        success: true,
        message: 'Banner created successfully.',
        data: newRow && newRow[0] ? newRow[0] : { id: result.insertId, title, image_path: imagePath }
      });
    } catch (err) {
      console.error('Error creating banner:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// -------------------------------------------------------------
// 4. PUT /api/admin/banners/:id or /api/banners/:id - Update Banner
// -------------------------------------------------------------
router.put(['/:id', '/admin/:id'], (req, res) => {
  bannerUploadFields(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ success: false, message: uploadErr.message });
    }

    const { id } = req.params;

    try {
      const [existingRows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
      if (!existingRows || existingRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Banner not found.' });
      }
      const existingBanner = existingRows[0];

      const {
        title,
        subtitle,
        alt_text,
        cta_text,
        cta_url,
        display_order,
        status,
        start_at,
        end_at,
        existing_image_path,
        existing_mobile_image_path
      } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, message: 'Banner title is required.' });
      }

      let newImagePath = existingBanner.image_path;
      let oldImageToDelete = null;

      if (req.files && req.files['image'] && req.files['image'][0]) {
        newImagePath = `/uploads/banners/${req.files['image'][0].filename}`;
        oldImageToDelete = existingBanner.image_path;
      } else if (existing_image_path) {
        newImagePath = existing_image_path.trim();
      } else if (req.body.image_url) {
        newImagePath = req.body.image_url.trim();
      } else if (req.body.image) {
        newImagePath = req.body.image.trim();
      }

      let newMobileImagePath = existingBanner.mobile_image_path;
      let oldMobileImageToDelete = null;

      if (req.files && req.files['mobile_image'] && req.files['mobile_image'][0]) {
        newMobileImagePath = `/uploads/banners/${req.files['mobile_image'][0].filename}`;
        oldMobileImageToDelete = existingBanner.mobile_image_path;
      } else if (existing_mobile_image_path !== undefined) {
        newMobileImagePath = existing_mobile_image_path ? existing_mobile_image_path.trim() : null;
      } else if (req.body.mobile_image_url) {
        newMobileImagePath = req.body.mobile_image_url.trim();
      } else if (req.body.mobile_image) {
        newMobileImagePath = req.body.mobile_image.trim();
      }

      const orderVal = display_order !== undefined ? parseInt(display_order, 10) : (existingBanner.display_order || 0);
      const statusVal = status ? (status === 'active' ? 'active' : 'inactive') : existingBanner.status;
      const startAtVal = start_at !== undefined ? (start_at && start_at.trim() ? start_at.trim() : null) : existingBanner.start_at;
      const endAtVal = end_at !== undefined ? (end_at && end_at.trim() ? end_at.trim() : null) : existingBanner.end_at;

      await pool.query(
        `UPDATE banners SET 
          title = ?, subtitle = ?, image_path = ?, mobile_image_path = ?, 
          alt_text = ?, cta_text = ?, cta_url = ?, display_order = ?, 
          status = ?, start_at = ?, end_at = ?
        WHERE id = ?`,
        [
          title.trim(),
          subtitle ? subtitle.trim() : null,
          newImagePath,
          newMobileImagePath,
          alt_text ? alt_text.trim() : null,
          cta_text ? cta_text.trim() : null,
          cta_url ? cta_url.trim() : null,
          orderVal,
          statusVal,
          startAtVal,
          endAtVal,
          id
        ]
      );

      // Clean up replaced images safely
      if (oldImageToDelete && oldImageToDelete !== newImagePath) {
        await safeDeleteFile(oldImageToDelete);
      }
      if (oldMobileImageToDelete && oldMobileImageToDelete !== newMobileImagePath) {
        await safeDeleteFile(oldMobileImageToDelete);
      }

      const [updatedRows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);

      res.json({
        success: true,
        message: 'Banner updated successfully.',
        data: updatedRows[0]
      });
    } catch (err) {
      console.error('Error updating banner:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// -------------------------------------------------------------
// 5. PATCH /api/admin/banners/:id/status or /api/banners/:id/status
// -------------------------------------------------------------
router.patch(['/:id/status', '/admin/:id/status'], async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    const newStatus = status ? status : (rows[0].status === 'active' ? 'inactive' : 'active');

    await pool.query('UPDATE banners SET status = ? WHERE id = ?', [newStatus, id]);
    const [updated] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Banner status updated to ${newStatus}.`,
      data: updated[0]
    });
  } catch (err) {
    console.error('Error toggling banner status:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 6. PATCH /api/admin/banners/reorder or /api/banners/reorder
// -------------------------------------------------------------
router.patch(['/reorder', '/admin/reorder'], async (req, res) => {
  const { orders } = req.body; // Expects array: [{ id: 1, display_order: 1 }, ...]

  if (!Array.isArray(orders)) {
    return res.status(400).json({ success: false, message: 'Orders array is required.' });
  }

  try {
    for (const item of orders) {
      if (item.id !== undefined && item.display_order !== undefined) {
        await pool.query('UPDATE banners SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
      }
    }

    const [rows] = await pool.query('SELECT * FROM banners ORDER BY display_order ASC, id ASC');
    res.json({
      success: true,
      message: 'Banners reordered successfully.',
      data: rows || []
    });
  } catch (err) {
    console.error('Error reordering banners:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// 7. DELETE /api/admin/banners/:id or /api/banners/:id
// -------------------------------------------------------------
router.delete(['/:id', '/admin/:id'], async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Banner not found.' });
    }

    const bannerToDelete = rows[0];

    // Remove DB record first
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);

    // Clean up stored files safely
    if (bannerToDelete.image_path) {
      await safeDeleteFile(bannerToDelete.image_path);
    }
    if (bannerToDelete.mobile_image_path) {
      await safeDeleteFile(bannerToDelete.mobile_image_path);
    }

    res.json({
      success: true,
      message: 'Banner deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting banner:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = {
  bannerRouter: router,
  UPLOADS_DIR,
  BANNERS_DIR
};
