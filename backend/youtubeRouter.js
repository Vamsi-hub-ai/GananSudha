const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('./db');

const router = express.Router();

// Multer storage for custom YouTube video thumbnail uploads
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const THUMB_UPLOADS_DIR = path.join(UPLOADS_DIR, 'thumbnails');
if (!fs.existsSync(THUMB_UPLOADS_DIR)) {
  fs.mkdirSync(THUMB_UPLOADS_DIR, { recursive: true });
}

const thumbStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, THUMB_UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `thumb_${Date.now()}_${safeBase}${ext}`);
  }
});

const uploadThumb = multer({
  storage: thumbStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed.'));
    }
  }
}).single('file');

const uploadThumbnailHandler = (req, res) => {
  uploadThumb(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }
    const publicUrl = `/uploads/thumbnails/${req.file.filename}`;
    res.json({ success: true, url: publicUrl, filename: req.file.filename });
  });
};

/**
 * -------------------------------------------------------------
 * YouTube URL Parsing & Video ID Extraction Engine
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * -------------------------------------------------------------
 */
function extractYouTubeVideoId(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();

  // If directly provided an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Add protocol if missing for proper URL parsing
    const urlString = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    // 1. youtu.be/VIDEO_ID
    if (host === 'youtu.be') {
      const pathname = parsed.pathname.slice(1);
      const id = pathname.split('/')[0].split('?')[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    // 2. youtube.com, m.youtube.com, youtube-nocookie.com
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      // /watch?v=VIDEO_ID
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      }

      // /shorts/VIDEO_ID
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }

      // /embed/VIDEO_ID
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }

      // /live/VIDEO_ID
      if (parsed.pathname.startsWith('/live/')) {
        const id = parsed.pathname.split('/live/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }

      // /v/VIDEO_ID
      if (parsed.pathname.startsWith('/v/')) {
        const id = parsed.pathname.split('/v/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
    }
  } catch {
    // Fallback regex matching across various formats
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Standard YouTube thumbnail generator
 */
function getDefaultThumbnail(videoId) {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Validate custom thumbnail URL for security
 */
function isValidCustomThumbnail(url) {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim();
  if (trimmed === '') return true;
  if (/^https?:\/\//i.test(trimmed)) return true;
  if (/^\/(uploads|assets)\//i.test(trimmed)) return true;
  return false;
}

/**
 * Filter out default YouTube thumbnails or internal asset paths from custom field
 */
function getCustomThumbnailValue(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.includes('img.youtube.com') || trimmed.includes('i.ytimg.com') || trimmed.startsWith('/assets/')) {
    return '';
  }
  return trimmed;
}

const VEDIC_TERM_TRANSLATIONS = [
  [/\bSri Maha Ganapathi Homam & Sankalpam Rituals\b/gi, 'శ్రీ మహా గణపతి హోమం & సంకల్ప పూజా విధానం'],
  [/\bSri Satyanarayana Swamy Vratam Complete Katha & Pooja\b/gi, 'శ్రీ సత్యనారాయణ స్వామి వ్రతం సంపూర్ణ కథ & పూజ'],
  [/\bMaha Mrityunjaya Homam for Health, Healing & Longevity\b/gi, 'మహా మృత్యుంజయ హోమం - ఆయురారోగ్య రక్ష'],
  [/\bSacred Shiva Linga Rudrabhishekam with Namakam & Chamakam\b/gi, 'శ్రీ శివలింగ రుద్రాభిషేకం - నమకం & చమకం'],
  [/\bNavagraha Shanti Homam & Dosha Nivarana Vidhanam\b/gi, 'నవగ్రహ శాంతి హోమం & గ్రహ దోష నివారణ'],
  [/\bSri Lakshmi Kubera Pooja for Abundance & Financial Harmony\b/gi, 'శ్రీ లక్ష్మీ కుబేర పూజ - ధన ధాన్య సమృద్ధి'],
  [/\bWitness the sacred invocation of Lord Ganesha by scholarly Vedic pandits for removing obstacles and bringing prosperity\.?\b/gi, 'విఘ్నాలు తొలగి సర్వకార్యాలలో విజయం, ఐశ్వర్యం సిద్ధించుటకై వేద పండితులు నిర్వహించే శ్రీ మహాగణపతి హోమ క్రతువు.'],
  [/\bStep-by-step sacred Satyanarayana Swamy Pooja recitation, Kalasha sthapana, and prasadam offerings\.?\b/gi, 'కలశ స్థాపన, పంచామృత అభిషేకం, వ్రత కథా శ్రవణం మరియు ప్రసాద వితరణతో కూడిన సంపూర్ణ సత్యనారాయణ పూజ.'],
  [/\bVedic recitation of the sacred Tryambakam mantra with 108 ahutis of amrita valli and sesame oblations\.?\b/gi, 'ఆయురారోగ్య ప్రాప్తికి, అపమృత్యు దోష నివారణకు 108 అమృతవల్లి ఆహుతులతో సమర్పించే మహా మృత్యుంజయ హోమ విధానం.'],
  [/\bHoly abhishekam with milk, honey, sugarcane juice, and sacred vibhooti performed by senior purohits\.?\b/gi, 'నమక చమక సహితంగా పాలు, తేనె, చెరకురసం మరియు విభూతితో సీనియర్ పురోహితులు నిర్వహించే పరమ పవిత్ర శివార్చన.'],
  [/\bHarmonizing the planetary influences through nine sacred grains and dedicated Vedic graha suktams\.?\b/gi, 'నవధాన్యాలు, సమిధలు మరియు వేద సూక్తాలతో గ్రహ పీడలను నివారించే సంపూర్ణ నవగ్రహ శాంతి హోమం.'],
  [/\bDivine worship of Goddess Maha Lakshmi and Lord Kubera with lotus flowers and kumkum archana\.?\b/gi, 'తామర పూలు, కుంకుమార్చనలతో అష్టైశ్వర్యాలు మరియు వ్యాపార అభివృద్ధిని ప్రసాదించే లక్ష్మీ కుబేర పూజ.'],

  // Key deity & concept translations for future additions
  [/\bSatyanarayana\s+Swamy\b/gi, 'శ్రీ సత్యనారాయణ స్వామి'],
  [/\bSatyanarayana\b/gi, 'సత్యనారాయణ'],
  [/\bMaha\s+Lakshmi\b/gi, 'మహాలక్ష్మి'],
  [/\bLakshmi\b/gi, 'లక్ష్మి'],
  [/\bGanapathi\b/gi, 'గణపతి'],
  [/\bGanesha\b/gi, 'గణేశ'],
  [/\bKubera?\b/gi, 'కుబేర'],
  [/\bShiva\s+Linga\b/gi, 'శివలింగ'],
  [/\bShiva\b/gi, 'శివ'],
  [/\bNavagraha\b/gi, 'నవగ్రహ'],
  [/\bSaraswati\b/gi, 'సరస్వతి'],
  [/\bVaralakshmi\b/gi, 'వరలక్ష్మి'],
  [/\bHanuman\b/gi, 'హనుమాన్'],
  [/\bDurga\b/gi, 'దుర్గా'],
  [/\bRudrabhishekam\b/gi, 'రుద్రాభిషేకం'],
  [/\bAbhishekam\b/gi, 'అభిషేకం'],
  [/\bNamakam\s+&\s+Chamakam\b/gi, 'నమకం & చమకం'],
  [/\bSankalpam\s+Rituals\b/gi, 'సంకల్ప క్రతువులు'],
  [/\bSankalpam\b/gi, 'సంకల్పం'],
  [/\bDosha\s+Nivarana\s+Vidhanam\b/gi, 'దోష నివారణ విధానం'],
  [/\bDosha\s+Nivarana\b/gi, 'దోష నివారణ'],
  [/\bVidhanam\b/gi, 'విధానం'],
  [/\bRituals\b/gi, 'క్రతువులు'],
  [/\bRitual\b/gi, 'క్రతువు'],
  [/\bComplete\s+Katha\s+&\s+Pooja\b/gi, 'సంపూర్ణ కథ & పూజ'],
  [/\bKatha\b/gi, 'కథ'],
  [/\bVratam\b/gi, 'వ్రతం'],
  [/\bVratham\b/gi, 'వ్రతం'],
  [/\bShanti\s+Homam\b/gi, 'శాంతి హోమం'],
  [/\bHomam\b/gi, 'హోమం'],
  [/\bHavan\b/gi, 'హవనం'],
  [/\bPooja\b/gi, 'పూజ'],
  [/\bPuja\b/gi, 'పూజ'],
  [/\bSpiritual\s+Guidance\b/gi, 'ఆధ్యాత్మిక మార్గదర్శకత్వం'],
  [/\bFestivals\b/gi, 'పండుగలు'],
  [/\bTemple\b/gi, 'దేవాలయం'],
  [/\bTemples\b/gi, 'దేవాలయాలు'],
  [/\bHealth,\s*Healing\s*&\s*Longevity\b/gi, 'ఆయురారోగ్య రక్షణ'],
  [/\bAbundance\s*&\s*Financial\s*Harmony\b/gi, 'ధన ధాన్య సమృద్ధి & ఆర్థిక శ్రేయస్సు'],
  [/\bVedic\b/gi, 'వేదోక్త'],
  [/\bSacred\b/gi, 'పవిత్ర'],
  [/\bHoly\b/gi, 'దివ్య'],
  [/\bDivine\b/gi, 'మంగళప్రద']
];

function autoTranslateToTelugu(text) {
  if (!text || typeof text !== 'string') return text || '';
  let result = text;
  for (const [pattern, replacement] of VEDIC_TERM_TRANSLATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// -------------------------------------------------------------------------
// PUBLIC ENDPOINTS
// -------------------------------------------------------------------------

/**
 * GET /api/youtube-videos/homepage
 * Returns up to 6 published homepage featured videos in admin-defined display order.
 */
router.get('/homepage', async (req, res) => {
  try {
    const query = `
      SELECT id, title, title_te, youtube_url, youtube_video_id, description, description_te, category, thumbnail_url, display_order, created_at
      FROM youtube_videos 
      WHERE status = 'published' AND is_homepage_featured = 1
      ORDER BY display_order ASC, created_at DESC
      LIMIT 6
    `;
    const [rows] = await pool.query(query);

    // Fallback thumbnail & Telugu normalization
    const videos = (rows || []).map(v => ({
      ...v,
      title_te: v.title_te || autoTranslateToTelugu(v.title),
      description_te: v.description_te || (v.description ? autoTranslateToTelugu(v.description) : ''),
      thumbnail_url: v.thumbnail_url || getDefaultThumbnail(v.youtube_video_id),
      embed_url: `https://www.youtube-nocookie.com/embed/${v.youtube_video_id}`
    }));

    res.json({
      success: true,
      data: videos
    });
  } catch (err) {
    console.error('[YouTube API Error] /homepage:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch homepage videos' });
  }
});

/**
 * GET /api/youtube-videos
 * Returns published videos with pagination, optional category filter, and search.
 */
router.get('/', async (req, res) => {
  try {
    let { page = 1, limit = 12, category, search } = req.query;
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (page - 1) * limit;

    let baseQuery = "FROM youtube_videos WHERE status = 'published'";
    const queryParams = [];

    if (category && category !== 'All') {
      baseQuery += " AND category = ?";
      queryParams.push(category);
    }

    if (search && search.trim()) {
      baseQuery += " AND (title LIKE ? OR description LIKE ?)";
      const pattern = `%${search.trim()}%`;
      queryParams.push(pattern, pattern);
    }

    // Get total count
    const countSql = `SELECT COUNT(*) AS total ${baseQuery}`;
    const [countResult] = await pool.query(countSql, queryParams);
    const total = countResult[0]?.total || 0;

    // Get paginated rows
    const dataSql = `
      SELECT id, title, title_te, youtube_url, youtube_video_id, description, description_te, category, thumbnail_url, display_order, is_homepage_featured, created_at
      ${baseQuery}
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataSql, [...queryParams, limit, offset]);

    const videos = (rows || []).map(v => ({
      ...v,
      title_te: v.title_te || autoTranslateToTelugu(v.title),
      description_te: v.description_te || (v.description ? autoTranslateToTelugu(v.description) : ''),
      thumbnail_url: v.thumbnail_url || getDefaultThumbnail(v.youtube_video_id),
      embed_url: `https://www.youtube-nocookie.com/embed/${v.youtube_video_id}`
    }));

    res.json({
      success: true,
      data: videos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (err) {
    console.error('[YouTube API Error] GET /:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
});

/**
 * GET /api/youtube-videos/:id
 * Returns a single published video by ID. Drafts are strictly withheld from public access.
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM youtube_videos WHERE id = ? AND status = 'published'",
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found or not published' });
    }

    const video = rows[0];
    const customThumb = getCustomThumbnailValue(video.thumbnail_url);
    res.json({
      success: true,
      data: {
        ...video,
        custom_thumbnail_url: customThumb,
        thumbnail_url: customThumb || getDefaultThumbnail(video.youtube_video_id),
        embed_url: `https://www.youtube-nocookie.com/embed/${video.youtube_video_id}`
      }
    });
  } catch (err) {
    console.error('[YouTube API Error] GET /:id:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch video details' });
  }
});

// -------------------------------------------------------------------------
// ADMIN ENDPOINTS
// -------------------------------------------------------------------------

/**
 * GET /api/admin/youtube-videos (or /api/youtube-videos/admin)
 * List all videos (draft + published) with summary statistics and administrative filters.
 */
const getAdminVideosHandler = async (req, res) => {
  try {
    let { page = 1, limit = 50, status, category, search, featured } = req.query;
    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const offset = (page - 1) * limit;

    // 1. Fetch real summary statistics from database
    const [totalRows] = await pool.query('SELECT COUNT(*) AS total FROM youtube_videos');
    const [publishedRows] = await pool.query("SELECT COUNT(*) AS total FROM youtube_videos WHERE status = 'published'");
    const [draftRows] = await pool.query("SELECT COUNT(*) AS total FROM youtube_videos WHERE status = 'draft'");
    const [featuredRows] = await pool.query("SELECT COUNT(*) AS total FROM youtube_videos WHERE is_homepage_featured = 1");

    const stats = {
      total: totalRows[0]?.total || 0,
      published: publishedRows[0]?.total || 0,
      drafts: draftRows[0]?.total || 0,
      featured: featuredRows[0]?.total || 0
    };

    // 2. Build filtered query for admin table
    let whereClause = "WHERE 1=1";
    const queryParams = [];

    if (status && status !== 'all') {
      whereClause += " AND status = ?";
      queryParams.push(status);
    }

    if (featured !== undefined && featured !== 'all' && featured !== '') {
      whereClause += " AND is_homepage_featured = ?";
      queryParams.push(featured === '1' || featured === 'true' || featured === true ? 1 : 0);
    }

    if (category && category !== 'All' && category !== 'all') {
      whereClause += " AND category = ?";
      queryParams.push(category);
    }

    if (search && search.trim()) {
      whereClause += " AND (title LIKE ? OR description LIKE ?)";
      const pattern = `%${search.trim()}%`;
      queryParams.push(pattern, pattern);
    }

    const countSql = `SELECT COUNT(*) AS filtered_total FROM youtube_videos ${whereClause}`;
    const [filteredCount] = await pool.query(countSql, queryParams);
    const totalFiltered = filteredCount[0]?.filtered_total || 0;

    const dataSql = `
      SELECT * FROM youtube_videos 
      ${whereClause}
      ORDER BY display_order ASC, id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataSql, [...queryParams, limit, offset]);

    const videos = (rows || []).map(v => {
      const customThumb = getCustomThumbnailValue(v.thumbnail_url);
      return {
        ...v,
        custom_thumbnail_url: customThumb,
        thumbnail_url: customThumb || getDefaultThumbnail(v.youtube_video_id),
        embed_url: `https://www.youtube-nocookie.com/embed/${v.youtube_video_id}`
      };
    });

    res.json({
      success: true,
      stats,
      data: videos,
      pagination: {
        total: totalFiltered,
        page,
        limit,
        totalPages: Math.ceil(totalFiltered / limit) || 1
      }
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] List:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch admin video list' });
  }
};

/**
 * POST /api/admin/youtube-videos (or /api/youtube-videos/admin)
 * Create and publish/draft a new YouTube video entry.
 */
const createVideoHandler = async (req, res) => {
  try {
    const {
      title,
      title_te,
      youtube_url,
      description = '',
      description_te = '',
      category = 'Pooja',
      thumbnail_url = '',
      display_order,
      is_homepage_featured = true,
      status = 'published'
    } = req.body;

    // Validate title
    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: 'Video title is required.' });
    }

    // Validate YouTube URL & extract Video ID
    if (!youtube_url || !youtube_url.trim()) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required.' });
    }

    const videoId = extractYouTubeVideoId(youtube_url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL. Please provide a valid link from youtube.com, youtu.be, or youtube.com/shorts.'
      });
    }

    // Validate custom thumbnail if provided
    if (thumbnail_url && !isValidCustomThumbnail(thumbnail_url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail URL. Must be a valid HTTP/HTTPS link or local asset path.'
      });
    }

    // Auto-translate to Telugu if omitted
    const finalTitleTe = (title_te && title_te.trim()) ? title_te.trim() : autoTranslateToTelugu(title);
    const finalDescTe = (description_te && description_te.trim()) ? description_te.trim() : (description ? autoTranslateToTelugu(description) : '');

    // Resolve final thumbnail URL: if no custom thumbnail provided, save null in DB so it dynamically resolves
    const customThumb = getCustomThumbnailValue(thumbnail_url);
    const finalThumbnail = customThumb || null;

    // Calculate display order if omitted
    let finalOrder = parseInt(display_order, 10);
    if (isNaN(finalOrder)) {
      const [orderRows] = await pool.query('SELECT MAX(display_order) AS max_order FROM youtube_videos');
      finalOrder = (orderRows[0]?.max_order || 0) + 1;
    }

    const finalStatus = status === 'draft' ? 'draft' : 'published';
    const finalFeatured = is_homepage_featured ? 1 : 0;

    const insertSql = `
      INSERT INTO youtube_videos 
      (title, title_te, youtube_url, youtube_video_id, description, description_te, category, thumbnail_url, display_order, is_homepage_featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertSql, [
      title.trim(),
      finalTitleTe,
      youtube_url.trim(),
      videoId,
      description ? description.trim() : '',
      finalDescTe,
      category ? category.trim() : 'Pooja',
      finalThumbnail,
      finalOrder,
      finalFeatured,
      finalStatus
    ]);

    const [createdRows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [result.insertId]);
    const created = createdRows[0];
    const createdCustomThumb = getCustomThumbnailValue(created.thumbnail_url);

    res.status(201).json({
      success: true,
      message: 'YouTube video added successfully.',
      data: {
        ...created,
        custom_thumbnail_url: createdCustomThumb,
        thumbnail_url: createdCustomThumb || getDefaultThumbnail(created.youtube_video_id),
        embed_url: `https://www.youtube-nocookie.com/embed/${created.youtube_video_id}`
      }
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Create:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to create YouTube video.' });
  }
};

/**
 * PUT /api/admin/youtube-videos/:id
 * Update existing YouTube video.
 */
const updateVideoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      title_te,
      youtube_url,
      description,
      description_te,
      category,
      thumbnail_url,
      display_order,
      is_homepage_featured,
      status
    } = req.body;

    const [existingRows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video record not found.' });
    }
    const existing = existingRows[0];

    let videoId = existing.youtube_video_id;
    let finalUrl = existing.youtube_url;

    if (youtube_url && youtube_url.trim() !== existing.youtube_url) {
      const extracted = extractYouTubeVideoId(youtube_url);
      if (!extracted) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL. Please provide a valid YouTube link.'
        });
      }
      videoId = extracted;
      finalUrl = youtube_url.trim();
    }

    if (thumbnail_url && !isValidCustomThumbnail(thumbnail_url)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid thumbnail URL.'
      });
    }

    const finalTitle = title !== undefined ? title.trim() : existing.title;
    if (!finalTitle) {
      return res.status(400).json({ success: false, message: 'Video title cannot be empty.' });
    }

    const finalTitleTe = (title_te !== undefined && title_te.trim()) ? title_te.trim() : (existing.title_te || autoTranslateToTelugu(finalTitle));
    const finalDescription = description !== undefined ? description.trim() : existing.description;
    const finalDescTe = (description_te !== undefined && description_te.trim()) ? description_te.trim() : (existing.description_te || (finalDescription ? autoTranslateToTelugu(finalDescription) : ''));
    const finalCategory = category !== undefined ? category.trim() : existing.category;
    let finalThumbnail = existing.thumbnail_url;
    if (thumbnail_url !== undefined) {
      const customThumb = getCustomThumbnailValue(thumbnail_url);
      finalThumbnail = customThumb || null;
    }
    const finalOrder = display_order !== undefined ? parseInt(display_order, 10) || 0 : existing.display_order;
    const finalFeatured = is_homepage_featured !== undefined ? (is_homepage_featured ? 1 : 0) : existing.is_homepage_featured;
    const finalStatus = status !== undefined ? (status === 'draft' ? 'draft' : 'published') : existing.status;

    const updateSql = `
      UPDATE youtube_videos 
      SET title = ?, title_te = ?, youtube_url = ?, youtube_video_id = ?, description = ?, description_te = ?, category = ?, 
          thumbnail_url = ?, display_order = ?, is_homepage_featured = ?, status = ?
      WHERE id = ?
    `;

    await pool.query(updateSql, [
      finalTitle,
      finalTitleTe,
      finalUrl,
      videoId,
      finalDescription,
      finalDescTe,
      finalCategory,
      finalThumbnail,
      finalOrder,
      finalFeatured,
      finalStatus,
      id
    ]);

    const [updatedRows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);
    const updated = updatedRows[0];
    const updatedCustomThumb = getCustomThumbnailValue(updated.thumbnail_url);

    res.json({
      success: true,
      message: 'YouTube video updated successfully.',
      data: {
        ...updated,
        custom_thumbnail_url: updatedCustomThumb,
        thumbnail_url: updatedCustomThumb || getDefaultThumbnail(updated.youtube_video_id),
        embed_url: `https://www.youtube-nocookie.com/embed/${updated.youtube_video_id}`
      }
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Update:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Failed to update video.' });
  }
};

/**
 * PATCH /api/admin/youtube-videos/:id/status
 * Quick toggle between draft and published.
 */
const updateStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['published', 'draft'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be either "published" or "draft".' });
    }

    await pool.query('UPDATE youtube_videos SET status = ? WHERE id = ?', [status, id]);
    const [rows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    res.json({
      success: true,
      message: `Video ${status === 'published' ? 'published' : 'moved to draft'} successfully.`,
      data: rows[0]
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Status:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update video status.' });
  }
};

/**
 * PATCH /api/admin/youtube-videos/:id/featured
 * Quick toggle for homepage featured visibility.
 */
const updateFeaturedHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_homepage_featured } = req.body;
    const val = is_homepage_featured ? 1 : 0;

    await pool.query('UPDATE youtube_videos SET is_homepage_featured = ? WHERE id = ?', [val, id]);
    const [rows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    res.json({
      success: true,
      message: `Video ${val === 1 ? 'featured on' : 'removed from'} homepage.`,
      data: rows[0]
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Featured:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update homepage featured status.' });
  }
};

/**
 * PATCH /api/admin/youtube-videos/reorder
 * Reorder display orders.
 */
const reorderVideosHandler = async (req, res) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'Orders array is required.' });
    }

    for (const item of orders) {
      if (item && item.id !== undefined && item.display_order !== undefined) {
        await pool.query(
          'UPDATE youtube_videos SET display_order = ? WHERE id = ?',
          [parseInt(item.display_order, 10) || 0, item.id]
        );
      }
    }

    res.json({
      success: true,
      message: 'Video display orders updated successfully.'
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Reorder:', err.message);
    res.status(500).json({ success: false, message: 'Failed to reorder videos.' });
  }
};

/**
 * DELETE /api/admin/youtube-videos/:id
 * Delete a video entry.
 */
const deleteVideoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);

    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    await pool.query('DELETE FROM youtube_videos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Video "${existing[0].title}" deleted successfully.`,
      deleted_id: parseInt(id, 10)
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Delete:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete video.' });
  }
};

/**
 * PATCH /api/admin/youtube-videos/:id/order
 * Quick update of a single video's display order.
 */
const updateOrderHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { display_order } = req.body;
    const orderVal = parseInt(display_order, 10);
    if (isNaN(orderVal)) {
      return res.status(400).json({ success: false, message: 'Valid display order number is required.' });
    }

    await pool.query('UPDATE youtube_videos SET display_order = ? WHERE id = ?', [orderVal, id]);
    const [rows] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Video not found.' });
    }

    res.json({
      success: true,
      message: `Display order updated to #${orderVal}.`,
      data: rows[0]
    });
  } catch (err) {
    console.error('[YouTube Admin API Error] Order:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update display order.' });
  }
};

// Mount admin endpoints directly on subpath if needed or via admin router
const adminRouter = express.Router();
adminRouter.post('/upload-thumbnail', uploadThumbnailHandler);
adminRouter.get('/', getAdminVideosHandler);
adminRouter.post('/', createVideoHandler);
adminRouter.put('/:id', updateVideoHandler);
adminRouter.patch('/:id/status', updateStatusHandler);
adminRouter.patch('/:id/featured', updateFeaturedHandler);
adminRouter.patch('/:id/order', updateOrderHandler);
adminRouter.patch('/:id', updateVideoHandler);
adminRouter.patch('/reorder', reorderVideosHandler);
adminRouter.delete('/:id', deleteVideoHandler);

// Also expose on public router for convenience
router.post('/upload-thumbnail', uploadThumbnailHandler);
router.get('/admin/list', getAdminVideosHandler);

module.exports = {
  youtubeRouter: router,
  adminYouTubeRouter: adminRouter,
  extractYouTubeVideoId,
  getDefaultThumbnail,
  isValidCustomThumbnail,
  getCustomThumbnailValue
};
