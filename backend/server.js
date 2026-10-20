const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

const PORT = process.env.PORT || 5000;

// Initialize DB schema and run migrations safely
const runMigrations = async () => {
    const migrations = [
        "ALTER TABLE pandits ADD COLUMN experience VARCHAR(100) DEFAULT '5+ Years'",
        "ALTER TABLE pandits ADD COLUMN img LONGTEXT NULL",
        "ALTER TABLE pandits ADD COLUMN languages VARCHAR(255) DEFAULT 'Telugu, Sanskrit, Hindi'",
        "ALTER TABLE pandits ADD COLUMN city VARCHAR(100) DEFAULT 'Hyderabad, Telangana'",
        "ALTER TABLE pandits ADD COLUMN bio TEXT NULL",
        "ALTER TABLE pandits MODIFY COLUMN username VARCHAR(255) NULL",
        "ALTER TABLE pandits MODIFY COLUMN password VARCHAR(255) NULL DEFAULT 'password123'",
        "ALTER TABLE pandits MODIFY COLUMN status VARCHAR(50) DEFAULT 'Approved'",
        "ALTER TABLE poojas MODIFY COLUMN img LONGTEXT NULL",
        "ALTER TABLE homams MODIFY COLUMN img LONGTEXT NULL",
        "ALTER TABLE products MODIFY COLUMN image LONGTEXT NULL",
        "ALTER TABLE categories MODIFY COLUMN image LONGTEXT NULL",
        "ALTER TABLE poojas ADD COLUMN name_te VARCHAR(255) NULL",
        "ALTER TABLE poojas ADD COLUMN desc_te TEXT NULL",
        "ALTER TABLE homams ADD COLUMN name_te VARCHAR(255) NULL",
        "ALTER TABLE homams ADD COLUMN desc_te TEXT NULL",
        "ALTER TABLE categories ADD COLUMN name_te VARCHAR(255) NULL",
        "ALTER TABLE categories ADD COLUMN desc_te TEXT NULL",
        "ALTER TABLE products ADD COLUMN name_te VARCHAR(255) NULL",
        "ALTER TABLE products ADD COLUMN desc_te TEXT NULL"
    ];

    for (const q of migrations) {
        try {
            await pool.query(q);
        } catch {
            // Ignore if column already exists (ER_DUP_FIELDNAME)
        }
    }

    // Seed default pandits if table is empty
    try {
        const [existingPandits] = await pool.query('SELECT COUNT(*) as cnt FROM pandits');
        if (existingPandits && existingPandits[0] && existingPandits[0].cnt === 0) {
            await pool.query(`
                INSERT IGNORE INTO pandits (id, username, password, name, phone, specialization, experience, rating, reviews, status, gender, img, languages, city) VALUES
                (1, 'pandit.sharma@gnanasudha.com', 'password123', 'Vidwan Rama Sharma', '+91 98480 12345', 'Satyanarayana Vratham & Gruhapravesham Specialist', '18+ years', '4.9', '124', 'Approved', 'male', '/assets/gruhapravesham_pandit_1782492787455.png', 'Telugu, Sanskrit, Hindi', 'Hyderabad, Telangana'),
                (2, 'pandit.shastry@gnanasudha.com', 'password123', 'Acharya Venkata Shastry', '+91 98480 23456', 'Homams, Havans & Vedic Vivaham', '22+ years', '5.0', '98', 'Approved', 'male', '/assets/homam_specialist_1782492829402.png', 'Telugu, Sanskrit', 'Hyderabad, Telangana'),
                (3, 'pandita.manju@gnanasudha.com', 'password123', 'Manju', '+91 98480 34567', 'Devi Poojas, Lalitha Sahasranamam & Chanting', '15+ years', '4.9', '84', 'Approved', 'female', '/assets/female_pandit.png', 'Telugu, Sanskrit, Kannada', 'Hyderabad, Telangana'),
                (4, 'pandit.vamsi@gnanasudha.com', 'password123', 'vamsi', '+91 98480 45678', 'Vedic Rituals', '0-2 Years', '5.0', '12', 'Approved', 'male', '/assets/male_pandit.png', 'Telugu, English', 'Hyderabad, Telangana')
            `);
            console.log("[DB] Default pandits initialized.");
        }
    } catch (e) {
        console.warn("[DB] Pandits seed check:", e.message);
    }

    // Seed default poojas if table is empty
    try {
        const [existingPoojas] = await pool.query('SELECT COUNT(*) as cnt FROM poojas');
        if (existingPoojas && existingPoojas[0] && existingPoojas[0].cnt === 0) {
            await pool.query(`
                INSERT IGNORE INTO poojas (id, name, \`desc\`, price, \`discountPrice\`, img) VALUES
                (1, 'Sri Satyanarayana Swamy Vratham', 'Auspicious ritual dedicated to Lord Vishnu for peace, prosperity, removing obstacles, and family harmony.', 3500.00, 2999.00, '/assets/satyanarayana_vratham_1782492802363.png'),
                (2, 'Gruhapravesham Pooja', 'Sacred housewarming ceremony with Vastu Shanti and Navagraha blessings before entering your new home.', 5500.00, 4800.00, '/assets/gruhapravesham_pandit_1782492787455.png'),
                (3, 'Vivaham (Vedic Wedding Rituals)', 'Complete traditional wedding ceremonies performed strictly as per Vedic Shastras by senior scholarly priests.', 15000.00, 12500.00, '/assets/vivaham_priest_1782492816322.png'),
                (4, 'Nitya Devatha Archana & Daily Pooja', 'Daily devotional pooja performed at your home or office for divine positive vibrations and abundance.', 1500.00, 1200.00, '/assets/daily_pooja_1782492845891.png')
            `);
            console.log("[DB] Default poojas initialized.");
        }
    } catch (e) {
        console.warn("[DB] Poojas seed check:", e.message);
    }

    // Seed default homams if table is empty
    try {
        const [existingHomams] = await pool.query('SELECT COUNT(*) as cnt FROM homams');
        if (existingHomams && existingHomams[0] && existingHomams[0].cnt === 0) {
            await pool.query(`
                INSERT IGNORE INTO homams (id, name, \`desc\`, price, \`discountPrice\`, img) VALUES
                (1, 'Sri Maha Ganapathi Homam', 'Powerful Vedic fire ritual invoking Lord Ganesha to eliminate hurdles, bring auspicious beginnings, and ensure success.', 4500.00, 3800.00, '/assets/homam_specialist_1782492829402.png'),
                (2, 'Sudarshana Homam', 'Vedic fire ritual dedicated to Lord Sudarshana for protection against negative energies, health restoration, and victory.', 5000.00, 4200.00, '/assets/homam_specialist_1782492829402.png'),
                (3, 'Navagraha Homam', 'Homam performed to appease all nine planetary deities, pacifying graha doshas and blessing you with prosperity and health.', 5500.00, 4600.00, '/assets/homam_specialist_1782492829402.png'),
                (4, 'Maha Mrityunjaya Homam', 'Sacred havan dedicated to Lord Shiva for health recovery, longevity, rejuvenation, and freedom from fear.', 6000.00, 5100.00, '/assets/homam_specialist_1782492829402.png')
            `);
            console.log("[DB] Default homams initialized.");
        }
    } catch (e) {
        console.warn("[DB] Homams seed check:", e.message);
    }
};

const initDB = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const queries = schema
            .split(/;\s*[\r\n]+/)
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));
        for (let q of queries) {
            try {
                await pool.query(q);
            } catch {
                // Ignore individual table/insert errors so entire sequence continues
            }
        }
        await runMigrations();
        console.log("Database initialized and migrations completed successfully.");
    } catch (err) {
        console.error("Error initializing DB:", err);
    }
};

// Generic CRUD helper generator with column validation
const generateCRUD = (tableName, extraRoutes = null) => {
    const router = express.Router();
    
    router.get('/', async (req, res) => {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
            res.json(rows);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    router.post('/', async (req, res) => {
        try {
            let colSet = null;
            try {
                const [cols] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
                if (Array.isArray(cols)) colSet = new Set(cols.map(c => c.Field));
            } catch {}

            const keys = Object.keys(req.body).filter(k => !colSet || colSet.has(k));
            if (keys.length === 0) return res.status(400).json({ error: 'No valid fields provided' });

            const values = keys.map(k => req.body[k]);
            const placeholders = keys.map(() => `?`).join(',');
            const query = `INSERT INTO ${tableName} (${keys.map(k => `\`${k}\``).join(',')}) VALUES (${placeholders})`;
            const [result] = await pool.query(query, values);
            const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [result.insertId]);
            res.status(201).json(rows[0]);
        } catch (err) { 
            console.error(`Error in POST /${tableName}:`, err);
            res.status(500).json({ error: err.message }); 
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            let colSet = null;
            try {
                const [cols] = await pool.query(`SHOW COLUMNS FROM ${tableName}`);
                if (Array.isArray(cols)) colSet = new Set(cols.map(c => c.Field));
            } catch {}

            const keys = Object.keys(req.body).filter(k => k !== 'id' && (!colSet || colSet.has(k)));
            if (keys.length === 0) {
                const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
                return res.json(rows[0] || req.body);
            }

            const values = keys.map(k => req.body[k]);
            const updates = keys.map((k) => `\`${k}\` = ?`).join(',');
            const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
            await pool.query(query, [...values, id]);
            const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
            res.json(rows[0]);
        } catch (err) { 
            console.error(`Error in PUT /${tableName}:`, err);
            res.status(500).json({ error: err.message }); 
        }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query(`DELETE FROM ${tableName} WHERE id = ?`, [id]);
            res.json({ message: 'Deleted successfully' });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    if(extraRoutes) extraRoutes(router);
    return router;
};

// Mount E-Commerce Router (Products, Categories, Cart Calculation, Orders, Reviews, Inventory)
const { ecommerceRouter } = require('./ecommerceRouter');
app.use('/api', ecommerceRouter);

// Mount Bookings Router (Real Spiritual Bookings & Workflow Management)
const { bookingRouter } = require('./bookingRouter');
app.use('/api/bookings', bookingRouter);

// Mount Pandit Scheduling, Availability & WhatsApp Notification Router
const { panditSchedulingRouter } = require('./panditSchedulingRouter');
const { processOutbox } = require('./whatsappService');
app.use('/api/scheduling', panditSchedulingRouter);
app.use('/api/whatsapp', panditSchedulingRouter); // Convenient webhook and status alias

app.use('/api/poojas', generateCRUD('poojas'));
app.use('/api/homams', generateCRUD('homams'));
app.use('/api/admin_users', generateCRUD('admin_users'));
app.use('/api/coupons', generateCRUD('coupons'));

// Customers custom
app.use('/api/customers', generateCRUD('customers', (router) => {
    router.post('/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const [existing] = await pool.query('SELECT * FROM customers WHERE email = ?', [email]);
            if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email ID already exists' });
            
            const [result] = await pool.query('INSERT INTO customers (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
            const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [result.insertId]);
            res.json({ success: true, user: rows[0] });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    });
}));

// Dedicated Pandits Router (Safe handling of images, experience, status, credentials)
const panditsRouter = express.Router();

panditsRouter.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pandits ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching pandits:', err);
        res.status(500).json({ error: err.message });
    }
});

panditsRouter.post('/', async (req, res) => {
    try {
        const {
            name, specialization, experience, rating, reviews,
            status, gender, img, phone, username, password,
            languages, city, bio
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Pandit name is required' });
        }

        const finalGender = gender || 'male';
        const defaultImg = finalGender === 'female' ? '/assets/female_pandit.png' : '/assets/male_pandit.png';
        const finalImg = img && img !== '/assets/avatar_placeholder.png' ? img : defaultImg;
        const finalUsername = username || `pandit_${Date.now()}_${Math.floor(Math.random() * 1000)}@gnanasudha.com`;
        const finalPassword = password || 'password123';
        const finalStatus = status || 'Approved';
        const finalExp = experience || '5+ Years';
        const finalSpec = specialization || 'Vedic Rituals';
        const finalRating = rating || '5.0';
        const finalReviews = reviews || '0';

        const [result] = await pool.query(
            `INSERT INTO pandits 
             (name, specialization, experience, rating, reviews, status, gender, img, phone, username, password, languages, city, bio)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, finalSpec, finalExp, finalRating, finalReviews,
                finalStatus, finalGender, finalImg, phone || null,
                finalUsername, finalPassword,
                languages || 'Telugu, Sanskrit, Hindi',
                city || 'Hyderabad, Telangana',
                bio || null
            ]
        );

        const [rows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating pandit:', err);
        res.status(500).json({ error: err.message });
    }
});

panditsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const allowedFields = [
            'name', 'specialization', 'experience', 'rating', 'reviews',
            'status', 'gender', 'img', 'phone', 'username', 'password',
            'languages', 'city', 'bio'
        ];

        const updates = [];
        const values = [];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                let val = req.body[field];
                if (field === 'img' && (!val || val === '/assets/avatar_placeholder.png')) {
                    val = req.body.gender === 'female' ? '/assets/female_pandit.png' : '/assets/male_pandit.png';
                }
                updates.push(`\`${field}\` = ?`);
                values.push(val);
            }
        }

        if (updates.length > 0) {
            values.push(id);
            await pool.query(`UPDATE pandits SET ${updates.join(', ')} WHERE id = ?`, values);
        }

        const [rows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        console.error('Error updating pandit:', err);
        res.status(500).json({ error: err.message });
    }
});

panditsRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM pandits WHERE id = ?', [id]);
        res.json({ message: 'Pandit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

panditsRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, specialization, gender, experience, img } = req.body;
        const [existing] = await pool.query('SELECT * FROM pandits WHERE username = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email ID already registered' });

        const finalGender = gender || 'male';
        const defaultImg = finalGender === 'female' ? '/assets/female_pandit.png' : '/assets/male_pandit.png';
        const [result] = await pool.query(
            `INSERT INTO pandits (name, username, password, phone, specialization, status, gender, experience, img) 
             VALUES (?, ?, ?, ?, ?, 'Approved', ?, ?, ?)`,
            [name, email, password || 'password123', phone || null, specialization || 'General Rituals', finalGender, experience || '5+ Years', img || defaultImg]
        );
        const [rows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [result.insertId]);
        res.json({ success: true, user: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.use('/api/pandits', panditsRouter);

// Consultations custom (string IDs)
const consultationsRouter = express.Router();
consultationsRouter.get('/', async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM consultations`);
    res.json(rows);
});
consultationsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { price, discountPrice } = req.body;
        await pool.query(`UPDATE consultations SET price = ?, \`discountPrice\` = ? WHERE id = ?`, [price, discountPrice, id]);
        const [rows] = await pool.query(`SELECT * FROM consultations WHERE id = ?`, [id]);
        res.json(rows[0] || { id, price, discountPrice });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.use('/api/consultations', consultationsRouter);

// Panchangam API Router
const { calculateDailyPanchang, getMonthlyFestivals, recalculateYearlyFestivals } = require('./panchangService');
const panchangRouter = express.Router();

panchangRouter.get('/', (req, res) => {
    try {
        let { date, lat, lon, city } = req.query;
        if (!date) {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' });
            date = formatter.format(now);
        }

        const customLocation = {};
        if (lat) customLocation.latitude = parseFloat(lat);
        if (lon) customLocation.longitude = parseFloat(lon);
        if (city) customLocation.city = city;

        const panchangData = calculateDailyPanchang(date, customLocation);
        res.json({
            success: true,
            data: panchangData
        });
    } catch (err) {
        console.error('Error calculating Panchangam:', err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

panchangRouter.get('/festivals', async (req, res) => {
    try {
        let { year, month, lat, lon } = req.query;
        if (!year || !month) {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit' });
            const [y, m] = formatter.format(now).split('-').map(Number);
            year = year || y;
            month = month || m;
        }

        const customLocation = {};
        if (lat) customLocation.latitude = parseFloat(lat);
        if (lon) customLocation.longitude = parseFloat(lon);

        const festivals = await getMonthlyFestivals(parseInt(year, 10), parseInt(month, 10), customLocation);
        res.json({
            success: true,
            data: festivals
        });
    } catch (err) {
        console.error('Error fetching festivals:', err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
});

app.use('/api/panchang', panchangRouter);

// Festivals Admin & Management Router
const festivalsRouter = express.Router();

festivalsRouter.get('/', async (req, res) => {
    try {
        let { year, month } = req.query;
        if (year && month) {
            const y = parseInt(year, 10);
            const m = parseInt(month, 10);
            let [rows] = await pool.query('SELECT * FROM festivals WHERE year = ? AND month = ? ORDER BY date ASC', [y, m]);
            if (!rows || rows.length === 0) {
                // Populate via astronomical engine
                await getMonthlyFestivals(y, m);
                [rows] = await pool.query('SELECT * FROM festivals WHERE year = ? AND month = ? ORDER BY date ASC', [y, m]);
            }
            return res.json(rows);
        } else if (year) {
            const y = parseInt(year, 10);
            const [rows] = await pool.query('SELECT * FROM festivals WHERE year = ? ORDER BY date ASC', [y]);
            return res.json(rows);
        }
        const [rows] = await pool.query('SELECT * FROM festivals ORDER BY date ASC LIMIT 200');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

festivalsRouter.post('/', async (req, res) => {
    try {
        const {
            festival_key, title_en, title_te, date, year, month,
            day_te, day_en, category, tradition, description_en,
            description_te, puja_muhurat_en, puja_muhurat_te, icon, is_active
        } = req.body;

        const key = festival_key || `custom_${Date.now()}`;
        const [result] = await pool.query(
            `INSERT INTO festivals 
             (festival_key, title_en, title_te, date, year, month, day_te, day_en, category, tradition, description_en, description_te, puja_muhurat_en, puja_muhurat_te, icon, is_active, is_custom, source)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Admin Custom')`,
            [
                key, title_en, title_te, date, year, month,
                day_te || '', day_en || '', category || 'major', tradition || 'Telugu Amanta (Andhra & Telangana)',
                description_en || '', description_te || '', puja_muhurat_en || '', puja_muhurat_te || '',
                icon || '🕉️', is_active !== undefined ? is_active : 1
            ]
        );
        const [rows] = await pool.query('SELECT * FROM festivals WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

festivalsRouter.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const keys = Object.keys(req.body).filter(k => k !== 'id' && k !== 'created_at');
        if (keys.length === 0) return res.status(400).json({ error: 'No fields provided to update' });
        
        const values = keys.map(k => req.body[k]);
        const updates = keys.map(k => `\`${k}\` = ?`).join(', ');
        const query = `UPDATE festivals SET ${updates} WHERE id = ?`;
        await pool.query(query, [...values, id]);
        const [rows] = await pool.query('SELECT * FROM festivals WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

festivalsRouter.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM festivals WHERE id = ?', [id]);
        res.json({ message: 'Festival deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

festivalsRouter.post('/recalculate', async (req, res) => {
    try {
        const { year } = req.body;
        const targetYear = parseInt(year, 10) || (new Date()).getFullYear();
        // Clear non-custom festivals for the target year so clean recalculation takes place
        await pool.query('DELETE FROM festivals WHERE year = ? AND is_custom = 0', [targetYear]);
        const result = await recalculateYearlyFestivals(targetYear);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/api/festivals', festivalsRouter);

// Banner Management API & Persistent Static Uploads
const { bannerRouter, UPLOADS_DIR } = require('./bannerRouter');
const multer = require('multer');

// General media storage and uploads
const generalMediaDir = path.join(UPLOADS_DIR, 'media');
if (!fs.existsSync(generalMediaDir)) {
    fs.mkdirSync(generalMediaDir, { recursive: true });
}
const generalStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, generalMediaDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${safeBase}-${Date.now()}${ext}`);
    }
});
const generalUpload = multer({ 
    storage: generalStorage, 
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// Upload endpoint for pooja, homam, and pandit images
app.post('/api/upload', generalUpload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/media/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
});

// Explicit static serving for assets and uploads
app.use('/assets', express.static(path.join(__dirname, '../public/assets')));
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')));
app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/api/banners', bannerRouter);
app.use('/api/admin/banners', bannerRouter);

// YouTube Videos Management API (Public & Admin)
const { youtubeRouter, adminYouTubeRouter } = require('./youtubeRouter');
app.use('/api/youtube-videos', youtubeRouter);
app.use('/api/admin/youtube-videos', adminYouTubeRouter);

// Unified Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    let { loginId, password } = req.body;
    try {
        if (loginId) loginId = loginId.trim();
        // Admin check
        let [rows] = await pool.query('SELECT * FROM admin_users WHERE LOWER(username) = LOWER(?) AND password = ?', [loginId, password]);
        if (rows.length > 0) return res.json({ type: 'admin', user: rows[0] });
        
        // Customer check
        [rows] = await pool.query('SELECT * FROM customers WHERE LOWER(email) = LOWER(?) AND password = ?', [loginId, password]);
        if (rows.length > 0) return res.json({ type: 'customer', user: rows[0] });
        
        // Pandit check
        [rows] = await pool.query('SELECT * FROM pandits WHERE LOWER(username) = LOWER(?) AND password = ?', [loginId, password]);
        if (rows.length > 0) return res.json({ type: 'pandit', user: rows[0] });
        
        // Hardcoded special customer fallback
        if (loginId.toLowerCase() === 'vamsipallela31@gmail.com' && password === 'Vamsi@123') {
            return res.json({ type: 'customer', user: { id: 'special-vamsi', name: 'Vamsi', email: 'vamsipallela31@gmail.com' } });
        }
        
        // Hardcoded special admin fallback
        if (loginId.toLowerCase() === 'gnanasudha18@gmail.com' && password === 'GnanaSudha@336') {
            return res.json({ type: 'admin', user: { id: 'special-admin', username: 'Gnanasudha18@gmail.com', name: 'Gnana Sudha Admin' } });
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Backend server running on port ${PORT}`);
    await initDB();
    // Periodic background processor for WhatsApp notification outbox (every 45s)
    setInterval(() => {
        processOutbox().catch(err => console.error('[WhatsApp Background Worker Error]', err.message));
    }, 45000);
});

