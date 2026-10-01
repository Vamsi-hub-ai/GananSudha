const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize DB schema
const initDB = async () => {
    try {
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await pool.query(schema);
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
            const { rows } = await pool.query(`SELECT * FROM ${tableName} ORDER BY id ASC`);
            res.json(rows);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    router.post('/', async (req, res) => {
        try {
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);
            const placeholders = keys.map((_, i) => `$${i + 1}`).join(',');
            const query = `INSERT INTO ${tableName} (${keys.map(k => `"${k}"`).join(',')}) VALUES (${placeholders}) RETURNING *`;
            const { rows } = await pool.query(query, values);
            res.status(201).json(rows[0]);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const keys = Object.keys(req.body);
            const values = Object.values(req.body);
            const updates = keys.map((k, i) => `"${k}" = $${i + 1}`).join(',');
            const query = `UPDATE ${tableName} SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`;
            const { rows } = await pool.query(query, [...values, id]);
            res.json(rows[0]);
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [id]);
            res.json({ message: 'Deleted successfully' });
        } catch (err) { res.status(500).json({ error: err.message }); }
    });

    if(extraRoutes) extraRoutes(router);
    return router;
};

app.use('/api/poojas', generateCRUD('poojas'));
app.use('/api/homams', generateCRUD('homams'));
app.use('/api/categories', generateCRUD('categories'));
app.use('/api/products', generateCRUD('products'));
app.use('/api/admin_users', generateCRUD('admin_users'));
app.use('/api/orders', generateCRUD('orders'));
app.use('/api/coupons', generateCRUD('coupons'));

// Customers custom
app.use('/api/customers', generateCRUD('customers', (router) => {
    router.post('/register', async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existing = await pool.query('SELECT * FROM customers WHERE email = $1', [email]);
            if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Email ID already exists' });
            
            const { rows } = await pool.query('INSERT INTO customers (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password]);
            res.json({ success: true, user: rows[0] });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    });
}));

// Pandits custom
app.use('/api/pandits', generateCRUD('pandits', (router) => {
    router.post('/register', async (req, res) => {
        try {
            const { name, email, password, phone, specialization } = req.body;
            const existing = await pool.query('SELECT * FROM pandits WHERE username = $1', [email]);
            if (existing.rows.length > 0) return res.status(400).json({ success: false, message: 'Email ID already exists' });
            
            const { rows } = await pool.query(
                `INSERT INTO pandits (name, username, password, phone, specialization, status) 
                 VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *`, 
                [name, email, password, phone, specialization || 'General Rituals']
            );
            res.json({ success: true, user: rows[0] });
        } catch (err) { res.status(500).json({ success: false, message: err.message }); }
    });
}));

// Consultations custom (string IDs)
const consultationsRouter = express.Router();
consultationsRouter.get('/', async (req, res) => {
    const { rows } = await pool.query(`SELECT * FROM consultations`);
    res.json(rows);
});
consultationsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { price, discountPrice } = req.body;
    const { rows } = await pool.query(`UPDATE consultations SET price = $1, "discountPrice" = $2 WHERE id = $3 RETURNING *`, [price, discountPrice, id]);
    res.json(rows[0]);
});
app.use('/api/consultations', consultationsRouter);

// Unified Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { loginId, password } = req.body;
    try {
        // Admin check
        let result = await pool.query('SELECT * FROM admin_users WHERE username = $1 AND password = $2', [loginId, password]);
        if (result.rows.length > 0) return res.json({ type: 'admin', user: result.rows[0] });
        
        // Customer check
        result = await pool.query('SELECT * FROM customers WHERE email = $1 AND password = $2', [loginId, password]);
        if (result.rows.length > 0) return res.json({ type: 'customer', user: result.rows[0] });
        
        // Pandit check
        result = await pool.query('SELECT * FROM pandits WHERE username = $1 AND password = $2', [loginId, password]);
        if (result.rows.length > 0) return res.json({ type: 'pandit', user: result.rows[0] });
        
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

app.listen(PORT, async () => {
    console.log(`Backend server running on port ${PORT}`);
    await initDB();
});
