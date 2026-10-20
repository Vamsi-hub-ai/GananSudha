# Gnana Sudha — Production Deployment Guide for Hostinger

This guide provides end-to-end instructions for deploying the **Gnana Sudha** full-stack Vedic platform on Hostinger (Shared Hosting, Cloud Hosting, or VPS).

---

## 1. Architecture Overview

* **Frontend**: React 19 (compiled by Vite into `./dist`)
* **Backend**: Node.js & Express (`./server.js` & `./backend/`)
* **Database**: MySQL 8.0+ (with automatic schema initialization & JSON dev fallback)
* **Storage**: Persistent Hostinger disk storage (`./uploads/` for banners, products, and thumbnails)
* **Process Manager**: Hostinger Node.js Manager or PM2 (`ecosystem.config.cjs`)

---

## 2. Hostinger Database Setup (hPanel MySQL)

1. Log into your **Hostinger hPanel**.
2. Navigate to **Databases** &rarr; **MySQL Databases**.
3. Create a new database:
   * **Database Name**: e.g. `u399032990_gnanasudha`
   * **Username**: e.g. `u399032990_admin`
   * **Password**: Create a strong password and note it down.
4. Click **Create**.
5. *(Optional but recommended)* Open **phpMyAdmin** for this database, go to the **Import** tab, and import [`backend/schema.sql`](file:///backend/schema.sql) if you want to pre-seed the tables immediately. *(Note: The backend also runs schema checks automatically on startup).*

---

## 3. Environment Variables Configuration (`.env`)

In your Hostinger root directory (or in the hPanel Node.js Application settings), create or configure a `.env` file containing:

```env
# Server
PORT=5000
NODE_ENV=production

# Hostinger MySQL Connection (Option 1 - Connection URL)
DATABASE_URL="mysql://u399032990_admin:YourStrongPassword@localhost:3306/u399032990_gnanasudha"

# Hostinger MySQL Connection (Option 2 - Individual variables)
DB_HOST=localhost
DB_PORT=3306
DB_USER=u399032990_admin
DB_PASSWORD=YourStrongPassword
DB_NAME=u399032990_gnanasudha

# Uploads & Media
UPLOADS_DIR="uploads"
MAX_FILE_SIZE_MB=5

# URLs
FRONTEND_URL="https://yourdomain.com"
PUBLIC_MEDIA_URL="https://yourdomain.com/uploads"

# Security
JWT_SECRET="generate_a_secure_random_string_here"

# (Optional) WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN="EAAxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="1056xxxxxxxxxxx"
WHATSAPP_BUSINESS_ACCOUNT_ID="3901xxxxxxxxxxx"
WHATSAPP_VERIFY_TOKEN="gnana_sudha_whatsapp_token_2026"
```

---

## 4. Deploying via Hostinger hPanel Node.js Manager

1. In hPanel, go to **Advanced** &rarr; **Node.js** (or search for *Node.js*).
2. Click **Create Application**:
   * **Node.js Version**: Select **20.x** or **22.x** LTS.
   * **Application Root**: `/home/u399032990/domains/yourdomain.com/public_html` (or project folder).
   * **Application Startup File**: `server.js`
   * **Application Mode**: `Production`
3. Click **Create**.
4. In the Application dashboard:
   * Click **NPM Install** to install dependencies.
   * If you need to rebuild the frontend on the server: run `npm run build`.
   * Click **Restart** to start the application.

---

## 5. Deploying via Hostinger Git Auto-Deployment

1. In hPanel, navigate to **Advanced** &rarr; **Git**.
2. Connect your repository:
   * **Repository URL**: `https://github.com/Vamsi-hub-ai/GananSudha.git`
   * **Branch**: `main`
   * **Install Path**: `public_html`
3. Check **Auto Deployment** so future pushes to `main` automatically deploy to Hostinger.
4. Click **Create**.

---

## 6. Hostinger VPS / Cloud (PM2 Deployment)

If using a Hostinger VPS:
```bash
# Clone repository
git clone https://github.com/Vamsi-hub-ai/GananSudha.git
cd GananSudha

# Install production dependencies and build frontend
npm install
npm run build

# Start with PM2 using the included configuration
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 7. Storage Permissions Checklist

Ensure write permissions exist for the persistent upload folders:
```bash
chmod -R 755 uploads/
```
The application will automatically organize files into:
* `uploads/banners/`
* `uploads/products/`
* `uploads/thumbnails/`
* `uploads/categories/`
* `uploads/media/`

---

## 8. Fixing Missing Pandits & Broken Images

If you previously deployed and noticed pandit photos missing, pandits not adding, or pooja cards displaying broken images:

### Fast Fix Option A: Automatic Fix via App Restart
1. Upload the updated `gnana-sudha-deploy.zip` to your Hostinger file manager (or `git pull origin main`).
2. Run `npm install` and `npm run build` (or the updated build in `dist/` is already included).
3. In Hostinger **Node.js Manager**, click **Restart**.
4. The server automatically runs database migrations on startup:
   - Upgrades `poojas.img`, `homams.img`, `pandits.img`, and `products.image` to `LONGTEXT`
   - Adds `experience`, `img`, `languages`, `city`, `bio` to `pandits` table
   - Makes `username` and `password` nullable so admin pandit registration works flawlessly
   - Seeds default verified pandits and poojas if missing.

### Fast Fix Option B: Manual SQL in phpMyAdmin (Instant)
1. In Hostinger hPanel, go to **Databases** &rarr; open **phpMyAdmin** for your database.
2. Click the **SQL** tab.
3. Open [`backend/migrations/fix_pandits_and_images.sql`](file:///backend/migrations/fix_pandits_and_images.sql), copy all queries, paste into the box, and click **Go**.
4. Hard refresh your browser (`Ctrl + Shift + R`). All images and pandit details will load immediately!
