import React, { useState, useEffect, useMemo } from 'react';
import {
  Film,
  Plus,
  Search,
  RefreshCw,
  Edit2,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  X,
  Loader2,
  Check,
  ArrowUpDown,
  Sparkles,
  UploadCloud,
  RotateCcw,
  Image as ImageIcon
} from 'lucide-react';
import { autoTranslateToTelugu } from '../locales/dynamicTerms';
import './AdminYouTubeManager.css';

const CATEGORIES = ['Pooja', 'Homam', 'Festivals', 'Spiritual Guidance', 'Temple', 'Other'];

/**
 * Client-side YouTube ID extractor for real-time validation and preview
 */
function extractClientVideoId(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const urlString = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(urlString);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0].split('?')[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (parsed.pathname === '/watch') {
        const v = parsed.searchParams.get('v');
        if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        const id = parsed.pathname.split('/shorts/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
      if (parsed.pathname.startsWith('/embed/')) {
        const id = parsed.pathname.split('/embed/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
      if (parsed.pathname.startsWith('/live/')) {
        const id = parsed.pathname.split('/live/')[1].split('/')[0].split('?')[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
    }
  } catch {
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i);
    if (match && match[1]) return match[1];
  }
  return null;
}

export default function AdminYouTubeManager() {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, featured: 0 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [deletingVideo, setDeletingVideo] = useState(null);

  // Inline Display Order Editing
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [inlineOrderVal, setInlineOrderVal] = useState('');

  // Form State
  const [formValues, setFormValues] = useState({
    title: '',
    title_te: '',
    youtube_url: '',
    description: '',
    description_te: '',
    category: 'Pooja',
    thumbnail_url: '',
    display_order: 1,
    is_homepage_featured: true,
    status: 'published'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const thumbFileInputRef = React.useRef(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchVideos = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch('/api/admin/youtube-videos');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setVideos(json.data || []);
          if (json.stats) {
            setStats(json.stats);
          }
        }
      } else {
        showToast('error', 'Failed to fetch videos from server.');
      }
    } catch (err) {
      console.error('[AdminYouTubeManager] Fetch error:', err);
      showToast('error', 'Network error connecting to backend.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Filtered List
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      // Status
      if (statusFilter !== 'all' && v.status !== statusFilter) return false;
      // Category
      if (categoryFilter !== 'all' && (v.category || '').toLowerCase() !== categoryFilter.toLowerCase()) return false;
      // Featured
      if (featuredFilter === '1' && !(v.is_homepage_featured === 1 || v.is_homepage_featured === true)) return false;
      if (featuredFilter === '0' && (v.is_homepage_featured === 1 || v.is_homepage_featured === true)) return false;
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const titleMatch = (v.title || '').toLowerCase().includes(term);
        const descMatch = (v.description || '').toLowerCase().includes(term);
        const catMatch = (v.category || '').toLowerCase().includes(term);
        if (!titleMatch && !descMatch && !catMatch) return false;
      }
      return true;
    });
  }, [videos, statusFilter, categoryFilter, featuredFilter, searchTerm]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const nextOrder = videos.length > 0 ? Math.max(...videos.map(v => v.display_order || 0)) + 1 : 1;
    setEditingVideo(null);
    setFormValues({
      title: '',
      title_te: '',
      youtube_url: '',
      description: '',
      description_te: '',
      category: 'Pooja',
      thumbnail_url: '',
      display_order: nextOrder,
      is_homepage_featured: true,
      status: 'published'
    });
    setFormErrors({});
    setIsAddModalOpen(true);
  };

  // Open Edit Modal with sanitized custom thumbnail
  const handleOpenEdit = (vid) => {
    setEditingVideo(vid);

    // Sanitize custom thumbnail: if it's default YouTube thumbnail or legacy internal asset path, default to empty
    let customThumb = vid.custom_thumbnail_url;
    if (customThumb === undefined || customThumb === null) {
      const isDefaultOrAsset = vid.thumbnail_url && (
        vid.thumbnail_url.includes('img.youtube.com/vi/') ||
        vid.thumbnail_url.includes('i.ytimg.com/vi/') ||
        vid.thumbnail_url.startsWith('/assets/')
      );
      customThumb = isDefaultOrAsset ? '' : (vid.thumbnail_url || '');
    }

    setFormValues({
      title: vid.title || '',
      title_te: vid.title_te || '',
      youtube_url: vid.youtube_url || '',
      description: vid.description || '',
      description_te: vid.description_te || '',
      category: vid.category || 'Pooja',
      thumbnail_url: customThumb || '',
      display_order: vid.display_order !== undefined ? vid.display_order : 1,
      is_homepage_featured: vid.is_homepage_featured === 1 || vid.is_homepage_featured === true,
      status: vid.status || 'published'
    });
    setFormErrors({});
  };

  // Thumbnail direct file upload handler
  const handleThumbFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be less than 5MB.');
      return;
    }

    setIsUploadingThumb(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Attempt dedicated thumbnail upload endpoint first, then fallback to product-image
      let res = await fetch('/api/youtube-videos/upload-thumbnail', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        res = await fetch('/api/upload/product-image', {
          method: 'POST',
          body: formData
        });
      }

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        setFormValues(prev => ({ ...prev, thumbnail_url: json.url }));
        showToast('success', 'Custom thumbnail uploaded successfully!');
      } else {
        throw new Error(json.message || 'Image upload failed');
      }
    } catch (err) {
      console.error('[AdminYouTubeManager] Upload error:', err);
      showToast('error', err.message || 'Failed to upload custom thumbnail image.');
    } finally {
      setIsUploadingThumb(false);
      if (thumbFileInputRef.current) thumbFileInputRef.current.value = '';
    }
  };

  // Reset to default YouTube thumbnail
  const handleResetToDefaultThumb = () => {
    setFormValues(prev => ({ ...prev, thumbnail_url: '' }));
    showToast('success', 'Reset to automatic standard YouTube thumbnail.');
  };

  // Form Validation
  const validateForm = () => {
    const errors = {};
    if (!formValues.title || !formValues.title.trim()) {
      errors.title = 'Title is required.';
    }
    if (!formValues.youtube_url || !formValues.youtube_url.trim()) {
      errors.youtube_url = 'YouTube URL is required.';
    } else {
      const vidId = extractClientVideoId(formValues.youtube_url);
      if (!vidId) {
        errors.youtube_url = 'Invalid YouTube URL. Please provide a valid watch, youtu.be, or shorts link.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save (Add or Edit)
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const isEdit = Boolean(editingVideo);
      const url = isEdit
        ? `/api/admin/youtube-videos/${editingVideo.id}`
        : '/api/admin/youtube-videos';
      const method = isEdit ? 'PUT' : 'POST';

      // Auto-translate to Telugu if omitted
      const resolvedTitleTe = formValues.title_te?.trim() || autoTranslateToTelugu(formValues.title);
      const resolvedDescTe = formValues.description_te?.trim() || (formValues.description ? autoTranslateToTelugu(formValues.description) : '');

      const payload = {
        ...formValues,
        title_te: resolvedTitleTe,
        description_te: resolvedDescTe
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', isEdit ? 'Video updated successfully.' : 'New video added successfully.');
        setIsAddModalOpen(false);
        setEditingVideo(null);
        await fetchVideos(true);
      } else {
        showToast('error', json.message || 'Failed to save video.');
      }
    } catch (err) {
      console.error('[AdminYouTubeManager] Save error:', err);
      showToast('error', 'Error submitting video data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (vid) => {
    const newStatus = vid.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/admin/youtube-videos/${vid.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast('success', `Video marked as ${newStatus}.`);
        await fetchVideos(true);
      } else {
        showToast('error', 'Failed to update video status.');
      }
    } catch {
      showToast('error', 'Network error updating status.');
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (vid) => {
    const newFeatured = !(vid.is_homepage_featured === 1 || vid.is_homepage_featured === true);
    try {
      const res = await fetch(`/api/admin/youtube-videos/${vid.id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_homepage_featured: newFeatured })
      });
      if (res.ok) {
        showToast('success', newFeatured ? 'Video featured on homepage.' : 'Video removed from homepage.');
        await fetchVideos(true);
      } else {
        showToast('error', 'Failed to update homepage featured state.');
      }
    } catch {
      showToast('error', 'Network error updating featured state.');
    }
  };

  // Direct inline display order update
  const handleStartEditOrder = (vid) => {
    setEditingOrderId(vid.id);
    setInlineOrderVal(String(vid.display_order ?? 0));
  };

  const handleSaveInlineOrder = async (vidId) => {
    const parsed = parseInt(inlineOrderVal, 10);
    if (isNaN(parsed)) {
      showToast('error', 'Please enter a valid numeric order.');
      return;
    }
    try {
      const res = await fetch(`/api/admin/youtube-videos/${vidId}/order`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ display_order: parsed })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Display order updated to #${parsed}.`);
        setEditingOrderId(null);
        await fetchVideos(true);
      } else {
        showToast('error', json.message || 'Failed to update display order.');
      }
    } catch {
      showToast('error', 'Network error updating display order.');
    }
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingVideo) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/youtube-videos/${deletingVideo.id}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('success', `Video "${deletingVideo.title}" deleted.`);
        setDeletingVideo(null);
        await fetchVideos(true);
      } else {
        showToast('error', json.message || 'Failed to delete video.');
      }
    } catch {
      showToast('error', 'Network error deleting video.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Derived real-time video ID and thumbnail status for form preview
  const liveVideoId = extractClientVideoId(formValues.youtube_url);
  const hasCustomThumbnail = Boolean(formValues.thumbnail_url && formValues.thumbnail_url.trim());
  const liveThumbnailUrl = hasCustomThumbnail 
    ? formValues.thumbnail_url.trim() 
    : (liveVideoId ? `https://img.youtube.com/vi/${liveVideoId}/hqdefault.jpg` : null);

  return (
    <div className="aym-container">
      {/* Header */}
      <div className="aym-header">
        <div className="aym-title-area">
          <h2>
            <Film size={22} color="#C53018" />
            <span>YouTube Videos Management</span>
          </h2>
          <p>Manage devotional videos, homepage featured reels, categories, and video publication status.</p>
        </div>

        <div className="aym-header-actions">
          <button
            className="aym-refresh-btn"
            onClick={() => fetchVideos(true)}
            disabled={isRefreshing}
            title="Refresh database records"
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="aym-add-btn" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add YouTube Video</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="aym-stats-grid">
        <div className="aym-stat-card">
          <div className="aym-stat-icon total">
            <Film size={22} />
          </div>
          <div className="aym-stat-info">
            <span className="aym-stat-val">{stats.total}</span>
            <span className="aym-stat-lbl">Total Videos</span>
          </div>
        </div>

        <div className="aym-stat-card">
          <div className="aym-stat-icon published">
            <CheckCircle2 size={22} />
          </div>
          <div className="aym-stat-info">
            <span className="aym-stat-val">{stats.published}</span>
            <span className="aym-stat-lbl">Published</span>
          </div>
        </div>

        <div className="aym-stat-card">
          <div className="aym-stat-icon draft">
            <EyeOff size={22} />
          </div>
          <div className="aym-stat-info">
            <span className="aym-stat-val">{stats.drafts}</span>
            <span className="aym-stat-lbl">Drafts</span>
          </div>
        </div>

        <div className="aym-stat-card">
          <div className="aym-stat-icon featured">
            <Star size={22} />
          </div>
          <div className="aym-stat-info">
            <span className="aym-stat-val">{stats.featured}</span>
            <span className="aym-stat-lbl">Homepage Featured</span>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="aym-toolbar">
        <div className="aym-search-wrap">
          <Search size={16} className="aym-search-icon" />
          <input
            type="text"
            placeholder="Search by title, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="aym-search-input"
          />
          {searchTerm && (
            <button className="aym-search-clear" onClick={() => setSearchTerm('')}>
              <X size={12} />
            </button>
          )}
        </div>

        <div className="aym-filters-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="aym-select"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>

          {/* Featured Filter */}
          <select
            value={featuredFilter}
            onChange={(e) => setFeaturedFilter(e.target.value)}
            className="aym-select"
          >
            <option value="all">All Placements</option>
            <option value="1">Homepage Featured</option>
            <option value="0">Standard Listing</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="aym-select"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="aym-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>
            <Loader2 size={32} className="spin" style={{ margin: '0 auto 12px auto' }} />
            <p>Loading YouTube videos from MySQL database...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Film size={40} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ margin: '0 0 6px 0', color: '#1E293B' }}>No videos found</h4>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || featuredFilter !== 'all'
                ? 'Try resetting the active filters above.'
                : 'Click "Add YouTube Video" above to publish your first devotional video.'}
            </p>
          </div>
        ) : (
          <table className="aym-table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Video Title & Details</th>
                <th>Category</th>
                <th>Homepage</th>
                <th>Order</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((vid) => {
                const isFeatured = vid.is_homepage_featured === 1 || vid.is_homepage_featured === true;
                const isPub = vid.status === 'published';
                const fallbackThumb = `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`;

                return (
                  <tr key={vid.id}>
                    {/* Thumbnail */}
                    <td>
                      <div
                        className="aym-thumb-cell"
                        onClick={() => setPreviewVideo(vid)}
                        title="Click to preview video player"
                      >
                        <img
                          src={vid.thumbnail_url || fallbackThumb}
                          alt={vid.title}
                          className="aym-thumb-img"
                          onError={(e) => {
                            if (e.target.src !== fallbackThumb) e.target.src = fallbackThumb;
                          }}
                        />
                        <div className="aym-thumb-play-overlay">
                          <Play size={18} fill="currentColor" />
                        </div>
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td>
                      <div className="aym-video-title-wrap">
                        <div className="aym-video-title" title={vid.title}>
                          {vid.title}
                        </div>
                        {vid.description && (
                          <div className="aym-video-desc-preview" title={vid.description}>
                            {vid.description}
                          </div>
                        )}
                        <a
                          href={vid.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aym-video-url-link"
                          title="Open on YouTube"
                        >
                          <span>{vid.youtube_video_id}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="aym-category-badge">{vid.category || 'Pooja'}</span>
                    </td>

                    {/* Homepage Featured Toggle */}
                    <td>
                      <button
                        className={`aym-badge-toggle ${isFeatured ? 'featured' : 'not-featured'}`}
                        onClick={() => handleToggleFeatured(vid)}
                        title={isFeatured ? 'Click to remove from homepage' : 'Click to feature on homepage'}
                      >
                        <Star size={12} fill={isFeatured ? 'currentColor' : 'none'} />
                        <span>{isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>

                    {/* Display Order */}
                    <td>
                      {editingOrderId === vid.id ? (
                        <div className="aym-inline-order-wrap">
                          <input
                            type="number"
                            min="0"
                            value={inlineOrderVal}
                            onChange={(e) => setInlineOrderVal(e.target.value)}
                            className="aym-inline-order-input"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInlineOrder(vid.id);
                              if (e.key === 'Escape') setEditingOrderId(null);
                            }}
                          />
                          <button
                            type="button"
                            className="aym-inline-order-btn save"
                            onClick={() => handleSaveInlineOrder(vid.id)}
                            title="Save Order"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            type="button"
                            className="aym-inline-order-btn cancel"
                            onClick={() => setEditingOrderId(null)}
                            title="Cancel"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="aym-order-display clickable"
                          onClick={() => handleStartEditOrder(vid)}
                          title="Click to edit display order"
                        >
                          <span>#{vid.display_order ?? 0}</span>
                          <Edit2 size={11} className="aym-order-edit-icon" />
                        </div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td>
                      <button
                        className={`aym-badge-toggle ${isPub ? 'published' : 'draft'}`}
                        onClick={() => handleToggleStatus(vid)}
                        title={isPub ? 'Click to set as Draft (Unpublish)' : 'Click to Publish on Website'}
                      >
                        {isPub ? <Check size={12} /> : <EyeOff size={12} />}
                        <span>{isPub ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Created Date */}
                    <td>
                      <span className="aym-date-display">
                        {vid.created_at ? new Date(vid.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="aym-actions-cell">
                        <button
                          className="aym-action-btn preview"
                          onClick={() => setPreviewVideo(vid)}
                          title="Preview Video Player"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                        <button
                          className="aym-action-btn edit"
                          onClick={() => handleOpenEdit(vid)}
                          title="Edit Video Details"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="aym-action-btn delete"
                          onClick={() => setDeletingVideo(vid)}
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ADD / EDIT VIDEO MODAL */}
      {(isAddModalOpen || editingVideo) && (
        <div className="aym-modal-backdrop" onClick={() => { setIsAddModalOpen(false); setEditingVideo(null); }}>
          <div className="aym-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="aym-modal-header">
              <h3>{editingVideo ? 'Edit YouTube Video' : 'Add New YouTube Video'}</h3>
              <button
                className="aym-modal-close-btn"
                onClick={() => { setIsAddModalOpen(false); setEditingVideo(null); }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveVideo}>
              <div className="aym-modal-body">
                {/* Video Title (English) */}
                <div className="aym-form-group">
                  <label>
                    Video Title (English) <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sri Maha Ganapathi Homam & Sankalpam Rituals"
                    value={formValues.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      const shouldAutoSync = !formValues.title_te || formValues.title_te === autoTranslateToTelugu(formValues.title);
                      setFormValues({
                        ...formValues,
                        title: newTitle,
                        title_te: shouldAutoSync ? autoTranslateToTelugu(newTitle) : formValues.title_te
                      });
                    }}
                    className="aym-form-input"
                  />
                  {formErrors.title && <span className="aym-input-error">{formErrors.title}</span>}
                </div>

                {/* Video Title (Telugu) */}
                <div className="aym-form-group">
                  <div className="aym-input-header">
                    <label>వీడియో శీర్షిక (Telugu Title)</label>
                    <button
                      type="button"
                      className="aym-btn-autotranslate"
                      onClick={() => {
                        if (formValues.title) {
                          setFormValues({ ...formValues, title_te: autoTranslateToTelugu(formValues.title) });
                        }
                      }}
                    >
                      <Sparkles size={12} />
                      <span>ఆటో అనువాదం</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="ఉదా: శ్రీ మహా గణపతి హోమం & సంకల్ప పూజా విధానం"
                    value={formValues.title_te}
                    onChange={(e) => setFormValues({ ...formValues, title_te: e.target.value })}
                    className="aym-form-input"
                  />
                  <span className="aym-form-hint">తెలుగు భాష ఎంపిక చేసినప్పుడు కనిపిస్తుంది. ఖాళీగా ఉంచితే ఆటోమేటిక్‌గా తెలుగులోకి మారుతుంది.</span>
                </div>

                {/* YouTube URL */}
                <div className="aym-form-group">
                  <label>
                    YouTube URL <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={formValues.youtube_url}
                    onChange={(e) => setFormValues({ ...formValues, youtube_url: e.target.value })}
                    className="aym-form-input"
                  />
                  {formErrors.youtube_url && (
                    <span className="aym-input-error">{formErrors.youtube_url}</span>
                  )}
                </div>

                {/* Real-time Video ID Preview Box */}
                {liveVideoId && (
                  <div className="aym-preview-box">
                    <img
                      src={liveThumbnailUrl}
                      alt="Thumbnail Preview"
                      className="aym-preview-thumb"
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${liveVideoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="aym-preview-details">
                      <div className="aym-preview-id-badge">Video ID: {liveVideoId}</div>
                      <span className="aym-preview-status">✓ Valid YouTube URL Recognized</span>
                    </div>
                  </div>
                )}

                {/* Short Description (English) */}
                <div className="aym-form-group">
                  <label>Short Description (English)</label>
                  <textarea
                    placeholder="Brief devotional summary of the pooja, homam, or spiritual guidance..."
                    value={formValues.description}
                    onChange={(e) => {
                      const newDesc = e.target.value;
                      const shouldAutoSync = !formValues.description_te || formValues.description_te === autoTranslateToTelugu(formValues.description);
                      setFormValues({
                        ...formValues,
                        description: newDesc,
                        description_te: shouldAutoSync ? autoTranslateToTelugu(newDesc) : formValues.description_te
                      });
                    }}
                    className="aym-form-textarea"
                  />
                </div>

                {/* Short Description (Telugu) */}
                <div className="aym-form-group">
                  <div className="aym-input-header">
                    <label>సంక్షిప్త వివరణ (Telugu Description)</label>
                    <button
                      type="button"
                      className="aym-btn-autotranslate"
                      onClick={() => {
                        if (formValues.description) {
                          setFormValues({ ...formValues, description_te: autoTranslateToTelugu(formValues.description) });
                        }
                      }}
                    >
                      <Sparkles size={12} />
                      <span>ఆటో అనువాదం</span>
                    </button>
                  </div>
                  <textarea
                    placeholder="సంక్షిప్త భక్తి పూర్వక పూజా వివరణ..."
                    value={formValues.description_te}
                    onChange={(e) => setFormValues({ ...formValues, description_te: e.target.value })}
                    className="aym-form-textarea"
                  />
                  <span className="aym-form-hint">ఖాళీగా ఉంచితే ఆటోమేటిక్‌గా తెలుగులోకి మార్చబడుతుంది.</span>
                </div>

                {/* Category & Display Order Row */}
                <div className="aym-form-row">
                  <div className="aym-form-group">
                    <label>Category</label>
                    <select
                      value={formValues.category}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                      className="aym-form-select"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="aym-form-group">
                    <label>Display Order (Priority)</label>
                    <input
                      type="number"
                      min="0"
                      value={formValues.display_order}
                      onChange={(e) => setFormValues({ ...formValues, display_order: parseInt(e.target.value, 10) || 0 })}
                      className="aym-form-input"
                    />
                  </div>
                </div>

                {/* Custom Thumbnail Manager (Optional) */}
                <div className="aym-form-group aym-thumb-manager-section">
                  <div className="aym-thumb-header-row">
                    <label className="aym-thumb-main-label">
                      <ImageIcon size={15} />
                      <span>Custom Thumbnail (Optional)</span>
                    </label>
                    <span className={`aym-thumb-status-badge ${hasCustomThumbnail ? 'badge-custom' : 'badge-auto'}`}>
                      {hasCustomThumbnail ? '🏷️ Custom Thumbnail Active' : '⚡ Automatic YouTube Thumbnail'}
                    </span>
                  </div>

                  {/* Control Row: Input + Upload + Reset */}
                  <div className="aym-thumb-control-row">
                    <div className="aym-thumb-input-wrapper">
                      <input
                        type="text"
                        placeholder="Leave empty for automatic YouTube thumbnail"
                        value={formValues.thumbnail_url}
                        onChange={(e) => setFormValues({ ...formValues, thumbnail_url: e.target.value })}
                        className="aym-form-input aym-thumb-url-input"
                      />
                      {formValues.thumbnail_url && (
                        <button
                          type="button"
                          className="aym-thumb-clear-btn"
                          onClick={handleResetToDefaultThumb}
                          title="Clear and revert to YouTube thumbnail"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={thumbFileInputRef}
                      accept="image/png, image/jpeg, image/webp, image/jpg"
                      style={{ display: 'none' }}
                      onChange={handleThumbFileUpload}
                    />

                    <button
                      type="button"
                      className="aym-btn-thumb-upload"
                      onClick={() => thumbFileInputRef.current?.click()}
                      disabled={isUploadingThumb}
                      title="Upload image directly from your computer"
                    >
                      {isUploadingThumb ? <Loader2 size={15} className="spin" /> : <UploadCloud size={15} />}
                      <span>{isUploadingThumb ? 'Uploading...' : 'Upload Image'}</span>
                    </button>

                    {hasCustomThumbnail && (
                      <button
                        type="button"
                        className="aym-btn-thumb-reset"
                        onClick={handleResetToDefaultThumb}
                        title="Reset back to standard YouTube thumbnail"
                      >
                        <RotateCcw size={15} />
                        <span>Use YouTube Default</span>
                      </button>
                    )}
                  </div>

                  {/* Live Thumbnail Visual Preview Card */}
                  <div className="aym-thumb-preview-card">
                    <div className="aym-thumb-preview-media">
                      {liveThumbnailUrl ? (
                        <img
                          src={liveThumbnailUrl}
                          alt="Thumbnail preview"
                          className="aym-thumb-preview-img"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/sacred_pooja_ritual.jpg';
                          }}
                        />
                      ) : (
                        <div className="aym-thumb-preview-empty">
                          <Film size={26} />
                          <span>Enter YouTube URL to preview thumbnail</span>
                        </div>
                      )}
                    </div>

                    <div className="aym-thumb-preview-info">
                      <div className="aym-thumb-preview-tag">
                        {hasCustomThumbnail ? 'Custom Image Override' : 'Automatic YouTube Thumbnail'}
                      </div>
                      <p className="aym-thumb-preview-text">
                        {hasCustomThumbnail
                          ? 'This custom image will be displayed on the homepage and video cards instead of the standard YouTube thumbnail.'
                          : 'Gnana Sudha automatically retrieves this high-quality thumbnail directly from YouTube. Leave the field above empty to keep it.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status & Homepage Visibility */}
                <div className="aym-form-row">
                  <div className="aym-form-group">
                    <label>Publication Status</label>
                    <select
                      value={formValues.status}
                      onChange={(e) => setFormValues({ ...formValues, status: e.target.value })}
                      className="aym-form-select"
                    >
                      <option value="published">Published (Visible on site)</option>
                      <option value="draft">Draft (Admin only)</option>
                    </select>
                  </div>

                  <div className="aym-form-group">
                    <label>Homepage Visibility</label>
                    <label className="aym-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formValues.is_homepage_featured}
                        onChange={(e) => setFormValues({ ...formValues, is_homepage_featured: e.target.checked })}
                      />
                      <span>Show on Homepage Grid</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="aym-modal-footer">
                <button
                  type="button"
                  className="aym-btn-cancel"
                  onClick={() => { setIsAddModalOpen(false); setEditingVideo(null); }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="aym-btn-save"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingVideo ? 'Update Video' : 'Save & Publish'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW VIDEO MODAL */}
      {previewVideo && (
        <div
          className="sacred-video-modal-backdrop"
          onClick={() => setPreviewVideo(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="sacred-video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="sacred-video-modal-close"
              onClick={() => setPreviewVideo(null)}
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>
            <div className="sacred-video-iframe-wrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.youtube_video_id}?autoplay=1&rel=0`}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="sacred-video-modal-meta">
              <h3 className="sacred-video-modal-title">{previewVideo.title}</h3>
              {previewVideo.description && (
                <p className="sacred-video-modal-desc">{previewVideo.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingVideo && (
        <div className="aym-modal-backdrop" onClick={() => setDeletingVideo(null)}>
          <div className="aym-modal-card aym-delete-card" onClick={(e) => e.stopPropagation()}>
            <div className="aym-delete-body">
              <div className="aym-delete-icon-wrap">
                <Trash2 size={26} />
              </div>
              <h4>Delete YouTube Video?</h4>
              <p>
                Are you sure you want to permanently remove this video from Gnana Sudha?
              </p>
              <div className="aym-delete-video-title">
                "{deletingVideo.title}"
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                This action will immediately remove the video from both the homepage grid and public videos catalog.
              </p>
            </div>
            <div className="aym-modal-footer">
              <button
                className="aym-btn-cancel"
                onClick={() => setDeletingVideo(null)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="aym-btn-confirm-delete"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete Video'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`aym-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
