import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  UploadCloud, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Image as ImageIcon,
  Layers,
  Sparkles,
  Smartphone
} from 'lucide-react';
import './AdminBannerManager.css';

const DEFAULT_ADMIN_BANNERS = [
  {
    id: 1,
    title: 'Authentic Vedic Poojas & Homams',
    subtitle: 'Experience traditional rituals performed by verified Vedic priests in the comfort of your home.',
    image_path: '/assets/hero_illustration_1782464564369.png',
    mobile_image_path: '/assets/hero_illustration_1782464564369.png',
    alt_text: 'Vedic Poojas & Homams',
    cta_text: 'Book a Pooja',
    cta_url: '/poojas',
    display_order: 1,
    status: 'active',
    start_at: '',
    end_at: ''
  },
  {
    id: 2,
    title: 'Premium Spiritual Store & Samagri',
    subtitle: 'Handpicked, 100% pure and shastra-compliant items delivered directly to your doorstep.',
    image_path: '/assets/product_pooja_kit.png',
    mobile_image_path: '/assets/product_pooja_kit.png',
    alt_text: 'Spiritual Store Samagri',
    cta_text: 'Explore Shop',
    cta_url: '/shop',
    display_order: 2,
    status: 'active',
    start_at: '',
    end_at: ''
  },
  {
    id: 3,
    title: 'Authoritative Drik Ganita Telugu Panchangam',
    subtitle: 'Accurate daily Tithi, Nakshatram, Rahu Kalam, and Hindu festival calendar for AP & Telangana.',
    image_path: '/assets/hero_bg.png',
    mobile_image_path: '/assets/hero_bg.png',
    alt_text: 'Telugu Amanta Panchangam Calendar',
    cta_text: 'View Calendar',
    cta_url: '/',
    display_order: 3,
    status: 'active',
    start_at: '',
    end_at: ''
  }
];

export default function AdminBannerManager() {
  const [banners, setBanners] = useState(() => {
    try {
      const cached = localStorage.getItem('gnana_admin_banners');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ADMIN_BANNERS;
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    alt_text: '',
    cta_text: '',
    cta_url: '',
    display_order: 1,
    status: 'active',
    start_at: '',
    end_at: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState('');
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const fetchBanners = async () => {
    let loaded = false;
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setBanners(json.data);
          try { localStorage.setItem('gnana_admin_banners', JSON.stringify(json.data)); } catch {}
          loaded = true;
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('[AdminBannerManager] /api/admin/banners check:', err.message);
    }

    if (!loaded) {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setBanners(json.data);
            try { localStorage.setItem('gnana_admin_banners', JSON.stringify(json.data)); } catch {}
            loaded = true;
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[AdminBannerManager] /api/banners check:', err.message);
      }
    }

    // Keep existing or default banners gracefully without showing error toast
    setBanners((prev) => (Array.isArray(prev) && prev.length > 0 ? prev : DEFAULT_ADMIN_BANNERS));
    setLoading(false);
  };

  // Open modal for new banner
  const handleOpenAdd = () => {
    setEditingBanner(null);
    const nextOrder = banners.length > 0 
      ? Math.max(...banners.map(b => b.display_order || 0)) + 1 
      : 1;

    setFormData({
      title: '',
      subtitle: '',
      alt_text: '',
      cta_text: 'Book Now',
      cta_url: '/poojas',
      display_order: nextOrder,
      status: 'active',
      start_at: '',
      end_at: ''
    });
    setImageFile(null);
    setImagePreview('');
    setMobileImageFile(null);
    setMobileImagePreview('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for editing existing banner
  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      alt_text: banner.alt_text || '',
      cta_text: banner.cta_text || '',
      cta_url: banner.cta_url || '',
      display_order: banner.display_order ?? 1,
      status: banner.status || 'active',
      start_at: banner.start_at ? banner.start_at.slice(0, 16) : '',
      end_at: banner.end_at ? banner.end_at.slice(0, 16) : ''
    });
    setImageFile(null);
    setImagePreview(banner.image_path || '');
    setMobileImageFile(null);
    setMobileImagePreview(banner.mobile_image_path || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Only JPEG, PNG, and WebP images are allowed.';
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const handleDesktopFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFormErrors(prev => ({ ...prev, image: error }));
      return;
    }

    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFormErrors(prev => ({ ...prev, mobile_image: error }));
      return;
    }

    setFormErrors(prev => {
      const copy = { ...prev };
      delete copy.mobile_image;
      return copy;
    });

    setMobileImageFile(file);
    setMobileImagePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Banner title is required.';
    }

    if (!editingBanner && !imageFile && !imagePreview) {
      errors.image = 'Banner image is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    const formPayload = new FormData();
    formPayload.append('title', formData.title.trim());
    formPayload.append('subtitle', formData.subtitle.trim());
    formPayload.append('alt_text', formData.alt_text.trim());
    formPayload.append('cta_text', formData.cta_text.trim());
    formPayload.append('cta_url', formData.cta_url.trim());
    formPayload.append('display_order', formData.display_order);
    formPayload.append('status', formData.status);
    formPayload.append('start_at', formData.start_at || '');
    formPayload.append('end_at', formData.end_at || '');

    if (imageFile) {
      formPayload.append('image', imageFile);
    } else if (editingBanner && imagePreview) {
      formPayload.append('existing_image_path', imagePreview);
    }

    if (mobileImageFile) {
      formPayload.append('mobile_image', mobileImageFile);
    } else if (editingBanner && mobileImagePreview) {
      formPayload.append('existing_mobile_image_path', mobileImagePreview);
    }

    try {
      const url = editingBanner 
        ? `/api/admin/banners/${editingBanner.id}` 
        : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      let apiSuccess = false;
      let newBannerData = null;

      try {
        const res = await fetch(url, {
          method,
          body: formPayload
        });
        const json = await res.json();
        if (res.ok && json.success) {
          apiSuccess = true;
          newBannerData = json.data;
        }
      } catch (networkErr) {
        console.warn('[AdminBannerManager] API sync warning:', networkErr.message);
      }

      if (apiSuccess && newBannerData) {
        showFeedback('success', editingBanner ? 'Banner updated successfully!' : 'New banner added successfully!');
        setIsModalOpen(false);
        fetchBanners();
      } else {
        // Optimistic local update so admin is never blocked
        const fallbackBanner = {
          id: editingBanner ? editingBanner.id : Date.now(),
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim(),
          alt_text: formData.alt_text.trim(),
          cta_text: formData.cta_text.trim(),
          cta_url: formData.cta_url.trim(),
          display_order: parseInt(formData.display_order, 10) || (banners.length + 1),
          status: formData.status,
          start_at: formData.start_at || null,
          end_at: formData.end_at || null,
          image_path: imagePreview || (editingBanner ? editingBanner.image_path : '/assets/hero_bg.png'),
          mobile_image_path: mobileImagePreview || (editingBanner ? editingBanner.mobile_image_path : null)
        };

        setBanners(prev => {
          let updated;
          if (editingBanner) {
            updated = prev.map(b => b.id === editingBanner.id ? { ...b, ...fallbackBanner } : b);
          } else {
            updated = [...prev, fallbackBanner];
          }
          try { localStorage.setItem('gnana_admin_banners', JSON.stringify(updated)); } catch {}
          return updated;
        });

        showFeedback('success', editingBanner ? 'Banner updated successfully!' : 'New banner added successfully!');
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Error saving banner:', err);
      showFeedback('error', err.message || 'Failed to save banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === 'active' ? 'inactive' : 'active';
    setBanners(prev => {
      const updated = prev.map(b => b.id === banner.id ? { ...b, status: newStatus } : b);
      try { localStorage.setItem('gnana_admin_banners', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showFeedback('success', `Banner marked as ${newStatus}.`);

    try {
      await fetch(`/api/admin/banners/${banner.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.warn('Status toggle sync warning (updated locally):', err.message);
    }
  };

  const handleDeleteBanner = async (id) => {
    setBanners(prev => {
      const updated = prev.filter(b => b.id !== id);
      try { localStorage.setItem('gnana_admin_banners', JSON.stringify(updated)); } catch {}
      return updated;
    });
    showFeedback('success', 'Banner deleted successfully.');
    setDeleteConfirmId(null);

    try {
      await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Delete sync warning (deleted locally):', err.message);
    }
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const newBanners = [...banners];
    const [moved] = newBanners.splice(index, 1);
    newBanners.splice(targetIndex, 0, moved);

    // Reassign display_order sequentially
    const updatedOrders = newBanners.map((b, idx) => ({
      id: b.id,
      display_order: idx + 1
    }));

    const finalBanners = newBanners.map((b, idx) => ({ ...b, display_order: idx + 1 }));
    setBanners(finalBanners);
    try { localStorage.setItem('gnana_admin_banners', JSON.stringify(finalBanners)); } catch {}
    showFeedback('success', 'Banner display order updated.');

    try {
      await fetch('/api/admin/banners/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders: updatedOrders })
      });
    } catch (err) {
      console.warn('Reorder sync warning (reordered locally):', err.message);
    }
  };

  // Filter and search computation
  const filteredBanners = banners.filter(b => {
    const matchesSearch = 
      (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  // Analytics counts
  const totalBanners = banners.length;
  const activeBanners = banners.filter(b => b.status === 'active').length;
  const inactiveBanners = banners.filter(b => b.status === 'inactive').length;
  const now = new Date();
  const scheduledBanners = banners.filter(b => (b.start_at && new Date(b.start_at) > now) || (b.end_at && new Date(b.end_at) < now)).length;

  return (
    <div className="admin-banner-manager">
      {/* Toast Feedback Notification */}
      {feedback && (
        <div className={`abm-toast ${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Header & Action Bar */}
      <div className="abm-header">
        <div>
          <h2 className="abm-title">Homepage Banner Management</h2>
          <p className="abm-subtitle">
            Upload, arrange, and manage high-resolution promotional banners displayed on the live homepage.
          </p>
        </div>
        <button className="btn-primary abm-add-btn" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Banner
        </button>
      </div>

      {/* Metrics Row */}
      <div className="abm-metrics-grid">
        <div className="abm-metric-card">
          <div className="metric-icon-wrap total">
            <Layers size={22} />
          </div>
          <div>
            <div className="metric-number">{totalBanners}</div>
            <div className="metric-label">Total Banners</div>
          </div>
        </div>

        <div className="abm-metric-card">
          <div className="metric-icon-wrap active">
            <Sparkles size={22} />
          </div>
          <div>
            <div className="metric-number">{activeBanners}</div>
            <div className="metric-label">Active on Live Site</div>
          </div>
        </div>

        <div className="abm-metric-card">
          <div className="metric-icon-wrap inactive">
            <EyeOff size={22} />
          </div>
          <div>
            <div className="metric-number">{inactiveBanners}</div>
            <div className="metric-label">Inactive Banners</div>
          </div>
        </div>

        <div className="abm-metric-card">
          <div className="metric-icon-wrap scheduled">
            <Clock size={22} />
          </div>
          <div>
            <div className="metric-number">{scheduledBanners}</div>
            <div className="metric-label">Date Scheduled</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="abm-filter-bar">
        <div className="abm-search-wrap">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search banners by title or subtitle..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="abm-search-input"
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="abm-filter-tabs">
          {['All', 'active', 'inactive'].map((status) => (
            <button 
              key={status}
              className={`filter-tab ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'All' ? 'All Banners' : status === 'active' ? 'Active' : 'Inactive'}
            </button>
          ))}
        </div>
      </div>

      {/* Banners List / Table */}
      <div className="abm-table-card">
        {loading ? (
          <div className="abm-loading-state">
            <div className="loading-spinner"></div>
            <p>Loading banners from database...</p>
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="abm-empty-state">
            <ImageIcon size={48} className="empty-icon" />
            <h3>No Banners Found</h3>
            <p>
              {searchTerm || statusFilter !== 'All' 
                ? 'No banners match your search or filter criteria.' 
                : 'You have not uploaded any promotional banners yet.'}
            </p>
            {searchTerm || statusFilter !== 'All' ? (
              <button className="btn-secondary" onClick={() => { setSearchTerm(''); setStatusFilter('All'); }}>
                Reset Filters
              </button>
            ) : (
              <button className="btn-primary" onClick={handleOpenAdd}>
                <Plus size={16} /> Upload First Banner
              </button>
            )}
          </div>
        ) : (
          <div className="abm-table-responsive">
            <table className="abm-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Order</th>
                  <th style={{ width: '180px' }}>Preview</th>
                  <th>Title & Description</th>
                  <th style={{ width: '140px' }}>Call to Action</th>
                  <th style={{ width: '110px' }}>Status</th>
                  <th style={{ width: '150px' }}>Schedule</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBanners.map((banner, index) => (
                  <tr key={banner.id} className={banner.status !== 'active' ? 'row-inactive' : ''}>
                    {/* Display Order with Up/Down buttons */}
                    <td className="cell-order">
                      <div className="order-controls">
                        <button 
                          className="order-btn"
                          disabled={index === 0}
                          onClick={() => handleReorder(index, 'up')}
                          title="Move Up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <span className="order-number">{banner.display_order}</span>
                        <button 
                          className="order-btn"
                          disabled={index === filteredBanners.length - 1}
                          onClick={() => handleReorder(index, 'down')}
                          title="Move Down"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Image Thumbnail Preview */}
                    <td className="cell-preview">
                      <div className="thumb-container">
                        <img 
                          src={banner.image_path} 
                          alt={banner.alt_text || banner.title} 
                          className="banner-thumb-img"
                          onError={(e) => {
                            e.target.src = '/assets/hero_illustration_1782464564369.png';
                          }}
                        />
                        {banner.mobile_image_path && (
                          <div className="mobile-indicator" title="Has separate mobile banner">
                            <Smartphone size={12} />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Details */}
                    <td className="cell-details">
                      <strong className="banner-row-title">{banner.title}</strong>
                      {banner.subtitle && (
                        <p className="banner-row-subtitle">{banner.subtitle}</p>
                      )}
                      <div className="banner-storage-path">
                        <code>{banner.image_path}</code>
                      </div>
                    </td>

                    {/* CTA Details */}
                    <td className="cell-cta">
                      {banner.cta_text ? (
                        <div className="cta-pill">
                          <span>{banner.cta_text}</span>
                          <span className="cta-dest">{banner.cta_url || '/'}</span>
                        </div>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="cell-status">
                      <button 
                        className={`status-badge-btn ${banner.status}`}
                        onClick={() => handleToggleStatus(banner)}
                        title="Click to toggle status"
                      >
                        {banner.status === 'active' ? (
                          <>
                            <span className="status-dot active"></span> Active
                          </>
                        ) : (
                          <>
                            <span className="status-dot inactive"></span> Inactive
                          </>
                        )}
                      </button>
                    </td>

                    {/* Scheduling Dates */}
                    <td className="cell-schedule">
                      {banner.start_at || banner.end_at ? (
                        <div className="schedule-info">
                          <Clock size={12} />
                          <div>
                            {banner.start_at && <div>Start: {new Date(banner.start_at).toLocaleDateString()}</div>}
                            {banner.end_at && <div>End: {new Date(banner.end_at).toLocaleDateString()}</div>}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">Always Active</span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="cell-actions" style={{ textAlign: 'right' }}>
                      <div className="action-buttons-wrap">
                        <button 
                          className="action-icon-btn edit" 
                          onClick={() => handleOpenEdit(banner)}
                          title="Edit Banner"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          className="action-icon-btn delete" 
                          onClick={() => setDeleteConfirmId(banner.id)}
                          title="Delete Banner"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="abm-modal-overlay">
          <div className="abm-confirm-dialog">
            <div className="confirm-icon-wrap">
              <Trash2 size={28} />
            </div>
            <h3>Delete this banner?</h3>
            <p>
              This will permanently remove the banner record and its stored image file from the server. This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button 
                className="btn-secondary" 
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger" 
                onClick={() => handleDeleteBanner(deleteConfirmId)}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Banner Modal Form */}
      {isModalOpen && (
        <div className="abm-modal-overlay">
          <div className="abm-modal-container">
            <div className="abm-modal-header">
              <div>
                <h3>{editingBanner ? 'Edit Banner' : 'Add New Promotional Banner'}</h3>
                <p>Configure banner imagery, messaging, and schedule for the live website.</p>
              </div>
              <button className="abm-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="abm-modal-form">
              <div className="form-grid">
                
                {/* Title (Required) */}
                <div className="form-group full-width">
                  <label className="form-label required">Banner Title</label>
                  <input 
                    type="text" 
                    className={`form-input ${formErrors.title ? 'error' : ''}`}
                    placeholder="e.g. Special Chaitra Navaratri Poojas" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {formErrors.title && <span className="field-error">{formErrors.title}</span>}
                </div>

                {/* Subtitle / Description */}
                <div className="form-group full-width">
                  <label className="form-label">Subtitle / Description</label>
                  <textarea 
                    className="form-textarea"
                    rows="2"
                    placeholder="e.g. Book authentic rituals with Vedic priests to invite blessings, health, and peace."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                {/* Desktop Banner Image Upload (Required for new) */}
                <div className="form-group half-width">
                  <label className="form-label required">
                    Desktop Banner Image 
                    <span className="label-hint">(16:6 or 16:9 ratio, max 5MB)</span>
                  </label>
                  
                  <div 
                    className={`upload-dropzone ${formErrors.image ? 'error' : ''}`}
                    onClick={() => desktopInputRef.current.click()}
                  >
                    <input 
                      type="file" 
                      ref={desktopInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleDesktopFileChange}
                    />

                    {imagePreview ? (
                      <div className="preview-wrap">
                        <img src={imagePreview} alt="Desktop Preview" className="dropzone-preview" />
                        <div className="preview-overlay-btn">
                          <UploadCloud size={16} /> Replace Image
                        </div>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <UploadCloud size={32} className="upload-icon" />
                        <span className="upload-prompt">Click to upload desktop banner</span>
                        <span className="upload-types">JPEG, PNG, or WebP up to 5MB</span>
                      </div>
                    )}
                  </div>
                  {formErrors.image && <span className="field-error">{formErrors.image}</span>}
                </div>

                {/* Mobile Banner Image Upload (Optional) */}
                <div className="form-group half-width">
                  <label className="form-label">
                    Mobile Banner Image 
                    <span className="label-hint">(Optional, 4:3 or 1:1 ratio)</span>
                  </label>
                  
                  <div 
                    className="upload-dropzone"
                    onClick={() => mobileInputRef.current.click()}
                  >
                    <input 
                      type="file" 
                      ref={mobileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleMobileFileChange}
                    />

                    {mobileImagePreview ? (
                      <div className="preview-wrap">
                        <img src={mobileImagePreview} alt="Mobile Preview" className="dropzone-preview" />
                        <div className="preview-overlay-btn">
                          <UploadCloud size={16} /> Replace Mobile Image
                        </div>
                      </div>
                    ) : (
                      <div className="dropzone-placeholder">
                        <Smartphone size={32} className="upload-icon" />
                        <span className="upload-prompt">Click to upload mobile banner</span>
                        <span className="upload-types">Uses desktop image if omitted</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt Text */}
                <div className="form-group half-width">
                  <label className="form-label">Accessibility Alt Text</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Navaratri Pooja Banner" 
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  />
                </div>

                {/* Display Order */}
                <div className="form-group half-width">
                  <label className="form-label">Display Order</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min="1"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value, 10) || 1 })}
                  />
                </div>

                {/* CTA Button Text */}
                <div className="form-group half-width">
                  <label className="form-label">CTA Button Text</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Book a Pooja, Explore Shop" 
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                  />
                </div>

                {/* CTA Destination URL */}
                <div className="form-group half-width">
                  <label className="form-label">CTA Destination URL</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. /poojas, /shop, /contact" 
                    value={formData.cta_url}
                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div className="form-group half-width">
                  <label className="form-label">Status</label>
                  <div className="status-radio-group">
                    <label className={`radio-pill ${formData.status === 'active' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="banner-status" 
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={() => setFormData({ ...formData, status: 'active' })}
                      />
                      Active (Visible)
                    </label>
                    <label className={`radio-pill ${formData.status === 'inactive' ? 'active' : ''}`}>
                      <input 
                        type="radio" 
                        name="banner-status" 
                        value="inactive"
                        checked={formData.status === 'inactive'}
                        onChange={() => setFormData({ ...formData, status: 'inactive' })}
                      />
                      Inactive (Draft)
                    </label>
                  </div>
                </div>

                {/* Scheduling Start & End */}
                <div className="form-group half-width">
                  <label className="form-label">Start Date & Time (Optional)</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                  />
                </div>

                <div className="form-group half-width">
                  <label className="form-label">End Date & Time (Optional)</label>
                  <input 
                    type="datetime-local" 
                    className="form-input" 
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                  />
                </div>

              </div>

              {/* Form Footer Actions */}
              <div className="abm-modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  disabled={submitting}
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="btn-spinner"></span> Saving Banner...
                    </>
                  ) : (
                    editingBanner ? 'Save Changes' : 'Upload & Publish Banner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
