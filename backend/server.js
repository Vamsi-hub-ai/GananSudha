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

// Initialize DB schema safely
const initDB = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const queries = schema
            .split(/;\s*[\r\n]+/)
            .map(q => q.trim())
            .filter(q => q.length > 0 && !q.startsWith('--'));
        for (let q of queries) {
            await pool.query(q);
        }
        console.log("Database initialized.");
    } catch (err) {
        console.error("Error initializing DB:", err);
    }
};

// Generic CRUD helper generator
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
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);
            const placeholders = keys.map(() => `?`).join(',');
            const query = `INSERT INTO ${tableName} (${keys.map(k => `\`${k}\``).join(',')}) VALUES (${placeholders})`;
            const [result] = await pool.query(query, values);
            const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [result.insertId]);
            res.status(201).json(rows[0]);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);
            const updates = keys.map((k) => `\`${k}\` = ?`).join(',');
            const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`;
            await pool.query(query, [...values, id]);
            const [rows] = await pool.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id]);
            res.json(rows[0]);
        } catch (err) { res.status(500).json({ error: err.message }); }
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

// Pandits custom
app.use('/api/pandits', generateCRUD('pandits', (router) => {
    router.post('/register', async (req, res) => {
        try {
            const { name, email, password, phone, specialization } = req.body;
            const [existing] = await pool.query('SELECT * FROM pandits WHERE username = ?', [email]);
            if (existing.length > 0) return res.status(400).json({ success: false, message: 'Email ID already exists' });
            
            const [result] = await pool.query(
                `INSERT INTO pandits (name, username, password, phone, specialization, status) 
                 VALUES (?, ?, ?, ?, ?, 'Pending')`, 
                [name, email, password, phone, specialization || 'General Rituals']
            );
            const [rows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [result.insertId]);
            res.json({ success: true, user: rows[0] });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    });
}));

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

