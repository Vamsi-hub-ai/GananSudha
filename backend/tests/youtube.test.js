const test = require('node:test');
const assert = require('node:assert/strict');
const {
  extractYouTubeVideoId,
  getDefaultThumbnail,
  isValidCustomThumbnail
} = require('../youtubeRouter');
const pool = require('../db');

test('YouTube Management & Validation Suite', async (t) => {
  await t.test('1. YouTube URL Parsing & Video ID Extraction Engine', () => {
    // Standard watch URL
    assert.equal(
      extractYouTubeVideoId('https://www.youtube.com/watch?v=kYJp38X-9_k'),
      'kYJp38X-9_k',
      'Should extract ID from standard watch URL'
    );

    // Watch URL with extra query parameters
    assert.equal(
      extractYouTubeVideoId('https://www.youtube.com/watch?v=0h6Q5XQ_0lE&feature=share&t=20s'),
      '0h6Q5XQ_0lE',
      'Should extract ID from watch URL with extra query params'
    );

    // Short youtu.be link
    assert.equal(
      extractYouTubeVideoId('https://youtu.be/J9fP87Z8k0I?si=abc123xyz'),
      'J9fP87Z8k0I',
      'Should extract ID from youtu.be shortened link'
    );

    // YouTube Shorts link
    assert.equal(
      extractYouTubeVideoId('https://www.youtube.com/shorts/M5A7D8K9l4s'),
      'M5A7D8K9l4s',
      'Should extract ID from youtube.com/shorts link'
    );

    // YouTube Embed link
    assert.equal(
      extractYouTubeVideoId('https://www.youtube.com/embed/P8m4F9A2b3c?rel=0'),
      'P8m4F9A2b3c',
      'Should extract ID from embed link'
    );

    // Mobile YouTube link
    assert.equal(
      extractYouTubeVideoId('https://m.youtube.com/watch?v=T6v8N4Q1d7e'),
      'T6v8N4Q1d7e',
      'Should extract ID from mobile YouTube URL'
    );

    // Direct 11-char ID
    assert.equal(
      extractYouTubeVideoId('kYJp38X-9_k'),
      'kYJp38X-9_k',
      'Should accept raw 11-char video ID'
    );

    // Rejection of invalid links
    assert.equal(extractYouTubeVideoId('https://vimeo.com/123456789'), null, 'Should reject non-YouTube domains');
    assert.equal(extractYouTubeVideoId('https://www.youtube.com/watch?v=too_short'), null, 'Should reject malformed IDs');
    assert.equal(extractYouTubeVideoId('not-a-valid-url'), null, 'Should reject arbitrary strings');
    assert.equal(extractYouTubeVideoId(''), null, 'Should reject empty strings');
    assert.equal(extractYouTubeVideoId(null), null, 'Should handle null input safely');
  });

  await t.test('2. Thumbnail Generator & Security Validation', () => {
    assert.equal(
      getDefaultThumbnail('kYJp38X-9_k'),
      'https://img.youtube.com/vi/kYJp38X-9_k/hqdefault.jpg',
      'Should format standard hqdefault thumbnail URL'
    );
    assert.equal(getDefaultThumbnail(null), null, 'Should handle null video ID safely');

    // Custom thumbnail URL security validation
    assert.equal(isValidCustomThumbnail('https://images.example.com/thumb.jpg'), true, 'Allow valid HTTPS URL');
    assert.equal(isValidCustomThumbnail('http://images.example.com/thumb.jpg'), true, 'Allow valid HTTP URL');
    assert.equal(isValidCustomThumbnail('/uploads/banners/custom_thumb.jpg'), true, 'Allow local upload paths');
    assert.equal(isValidCustomThumbnail('/assets/custom.png'), true, 'Allow local asset paths');
    assert.equal(isValidCustomThumbnail('javascript:alert(1)'), false, 'Reject javascript: pseudo-protocols');
    assert.equal(isValidCustomThumbnail('data:text/html,<script>'), false, 'Reject dangerous data URLs');
  });

  await t.test('3. Database Querying & Homepage 6-Video Limit', async () => {
    // Query homepage videos (up to 6 published)
    const [homepageRows] = await pool.query(`
      SELECT id, title, youtube_video_id, display_order, is_homepage_featured, status 
      FROM youtube_videos 
      WHERE status = 'published' AND is_homepage_featured = 1
      ORDER BY display_order ASC, created_at DESC
      LIMIT 6
    `);

    assert.ok(Array.isArray(homepageRows), 'Homepage query should return an array');
    assert.ok(homepageRows.length <= 6, 'Homepage videos must never exceed 6 videos');
    
    homepageRows.forEach(v => {
      assert.equal(v.status, 'published', 'All homepage videos must have status = published');
      assert.ok(v.is_homepage_featured === 1 || v.is_homepage_featured === true, 'All homepage videos must be featured');
      assert.ok(v.youtube_video_id && v.youtube_video_id.length === 11, 'Video ID must be valid 11 characters');
    });
  });

  await t.test('4. Draft vs Published Isolation', async () => {
    // Create a temporary draft video
    const draftTitle = `Draft Test Video ${Date.now()}`;
    const [insertResult] = await pool.query(`
      INSERT INTO youtube_videos 
      (title, youtube_url, youtube_video_id, description, category, thumbnail_url, display_order, is_homepage_featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      draftTitle,
      'https://www.youtube.com/watch?v=kYJp38X-9_k',
      'kYJp38X-9_k',
      'Draft description',
      'Pooja',
      'https://img.youtube.com/vi/kYJp38X-9_k/hqdefault.jpg',
      99,
      1,
      'draft'
    ]);

    const draftId = insertResult.insertId;

    // Verify public query does NOT return the draft
    const [publicRows] = await pool.query(`
      SELECT * FROM youtube_videos WHERE status = 'published' AND id = ?
    `, [draftId]);
    assert.equal(publicRows.length, 0, 'Public published query must NEVER expose drafts');

    // Verify admin query CAN see the draft
    const [adminRows] = await pool.query(`
      SELECT * FROM youtube_videos WHERE id = ?
    `, [draftId]);
    assert.equal(adminRows.length, 1, 'Admin query must find draft record');
    assert.equal(adminRows[0].status, 'draft', 'Status should be draft');

    // Clean up temporary draft
    await pool.query('DELETE FROM youtube_videos WHERE id = ?', [draftId]);
  });

  await t.test('5. Full Admin Video CRUD Lifecycle', async () => {
    // 5a. Create video
    const newTitle = `Sacred Havan ${Date.now()}`;
    const testUrl = 'https://youtu.be/kYJp38X-9_k';
    const videoId = extractYouTubeVideoId(testUrl);
    const thumbnail = getDefaultThumbnail(videoId);

    const [createRes] = await pool.query(`
      INSERT INTO youtube_videos 
      (title, youtube_url, youtube_video_id, description, category, thumbnail_url, display_order, is_homepage_featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [newTitle, testUrl, videoId, 'Vedic fire ceremony description', 'Homam', thumbnail, 10, 1, 'published']);

    const videoIdDb = createRes.insertId;
    assert.ok(videoIdDb > 0, 'Video should have positive database ID');

    // 5b. Read video
    const [fetched] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [videoIdDb]);
    assert.equal(fetched.length, 1);
    assert.equal(fetched[0].title, newTitle);
    assert.equal(fetched[0].youtube_video_id, 'kYJp38X-9_k');

    // 5c. Update video title & category
    const updatedTitle = `${newTitle} (Updated Edition)`;
    await pool.query(`
      UPDATE youtube_videos 
      SET title = ?, category = ? 
      WHERE id = ?
    `, [updatedTitle, 'Festivals', videoIdDb]);

    const [afterUpdate] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [videoIdDb]);
    assert.equal(afterUpdate[0].title, updatedTitle);
    assert.equal(afterUpdate[0].category, 'Festivals');

    // 5d. Toggle status to draft
    await pool.query('UPDATE youtube_videos SET status = ? WHERE id = ?', ['draft', videoIdDb]);
    const [afterDraft] = await pool.query('SELECT status FROM youtube_videos WHERE id = ?', [videoIdDb]);
    assert.equal(afterDraft[0].status, 'draft');

    // 5e. Toggle homepage featured
    await pool.query('UPDATE youtube_videos SET is_homepage_featured = ? WHERE id = ?', [0, videoIdDb]);
    const [afterUnfeatured] = await pool.query('SELECT is_homepage_featured FROM youtube_videos WHERE id = ?', [videoIdDb]);
    assert.ok(afterUnfeatured[0].is_homepage_featured === 0 || afterUnfeatured[0].is_homepage_featured === false);

    // 5f. Delete video
    await pool.query('DELETE FROM youtube_videos WHERE id = ?', [videoIdDb]);
    const [afterDelete] = await pool.query('SELECT * FROM youtube_videos WHERE id = ?', [videoIdDb]);
    assert.equal(afterDelete.length, 0, 'Video must be deleted from database');
  });
});

