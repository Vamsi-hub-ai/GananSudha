import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, Filter, ArrowLeft, X, Film, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { autoTranslateToTelugu } from '../locales/dynamicTerms';
import './Videos.css';

const CATEGORIES = ['All', 'Pooja', 'Homam', 'Festivals', 'Spiritual Guidance', 'Temple', 'Other'];

export default function Videos() {
  const navigate = useNavigate();
  const { t, translateDynamic, language } = useLanguage();

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVideos, setTotalVideos] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  // Fetch videos whenever category, search, or page changes
  useEffect(() => {
    let isCurrent = true;

    async function loadVideos() {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: '9'
        });

        if (selectedCategory && selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const res = await fetch(`/api/youtube-videos?${params.toString()}`);
        if (res.ok) {
          const json = await res.json();
          if (isCurrent && json.success) {
            if (page === 1) {
              setVideos(json.data || []);
            } else {
              setVideos(prev => [...prev, ...(json.data || [])]);
            }
            if (json.pagination) {
              setTotalPages(json.pagination.totalPages || 1);
              setTotalVideos(json.pagination.total || 0);
            }
          }
        }
      } catch (err) {
        console.error('[VideosPage] Error loading videos:', err);
      } finally {
        if (isCurrent) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    }

    loadVideos();

    return () => {
      isCurrent = false;
    };
  }, [selectedCategory, searchQuery, page]);

  // Handle ESC key for modal player
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setActiveVideo(null);
    }
    if (activeVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeVideo]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="videos-page-container">
      {/* Devotional Hero Banner */}
      <section className="videos-hero">
        <div className="videos-hero-content">
          <button className="videos-back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span>{t('common.back', 'Back to Home')}</span>
          </button>

          <div className="videos-hero-pill">
            <Film size={14} />
            <span>{t('videos.section_title', 'Watch Our Sacred Rituals')}</span>
          </div>

          <h1 className="videos-hero-title">
            {t('videos.all_videos_title', 'Sacred Devotional Videos & Rituals')}
          </h1>

          <p className="videos-hero-subtitle">
            {t('videos.all_videos_subtitle', 'Watch authentic Vedic poojas, homams, and spiritual guidance videos from Gnana Sudha.')}
          </p>

          <div className="videos-hero-divider">
            <img src="/lotus.svg" alt="Lotus" />
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="videos-toolbar-wrapper">
        <div className="videos-toolbar">
          {/* Category Chips */}
          <div className="videos-category-chips">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`videos-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="videos-search-box">
            <Search size={18} className="videos-search-icon" />
            <input
              type="text"
              placeholder={t('videos.search_placeholder', 'Search devotional videos...')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="videos-search-input"
            />
            {searchQuery && (
              <button
                className="videos-search-clear"
                onClick={() => { setSearchQuery(''); setPage(1); }}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Video Listing */}
      <main className="videos-main-content">
        {/* Count indicator */}
        {!loading && (
          <div className="videos-count-bar">
            <span>Showing <strong>{videos.length}</strong> of <strong>{totalVideos}</strong> published videos</span>
          </div>
        )}

        {/* Video Cards Grid */}
        {loading ? (
          <div className="videos-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`skel-all-${i}`} className="sacred-video-card skeleton">
                <div className="sacred-video-thumb-wrap">
                  <div className="skeleton-thumb" />
                </div>
                <div className="sacred-video-body">
                  <div className="skeleton-text" />
                  <div className="skeleton-text short" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="videos-empty-state">
            <Film size={44} className="empty-icon" />
            <h3>{t('videos.no_videos_found', 'No videos found matching your criteria.')}</h3>
            <p>Try selecting a different category or clearing your search filter.</p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                className="videos-reset-filter-btn"
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setPage(1); }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map(vid => {
              const fallbackThumb = `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`;
              const defaultDevotionalFallback = '/assets/sacred_pooja_ritual.jpg';
              const displayTitle = language === 'te'
                ? (vid.title_te || translateDynamic(vid, 'title') || autoTranslateToTelugu(vid.title))
                : vid.title;
              const displayDesc = language === 'te'
                ? (vid.description_te || translateDynamic(vid, 'description') || (vid.description ? autoTranslateToTelugu(vid.description) : ''))
                : vid.description;
              const displayCategory = language === 'te'
                ? (translateDynamic(vid.category || 'Pooja', 'category') || vid.category)
                : vid.category;

              return (
                <article
                  key={vid.id}
                  className="sacred-video-card"
                  onClick={() => setActiveVideo(vid)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveVideo(vid);
                    }
                  }}
                  aria-label={`Play ${displayTitle}`}
                >
                  <div className="sacred-video-thumb-wrap">
                    <img
                      src={vid.thumbnail_url || fallbackThumb}
                      alt={displayTitle}
                      className="sacred-video-thumb"
                      loading="lazy"
                      onError={(e) => {
                        if (e.target.src !== defaultDevotionalFallback) {
                          e.target.src = defaultDevotionalFallback;
                        }
                      }}
                    />
                    {displayCategory && (
                      <span className="sacred-video-category-badge">{displayCategory}</span>
                    )}
                    <div className="sacred-video-thumb-overlay">
                      <div className="sacred-video-play-btn" title="Play Video">
                        <Play size={22} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="sacred-video-body">
                    <h3 className="sacred-video-card-title" title={displayTitle}>
                      {displayTitle}
                    </h3>
                    {displayDesc && (
                      <p className="sacred-video-card-desc">{displayDesc}</p>
                    )}
                    <div className="sacred-video-card-cta">
                      <span>{t('videos.play_video', 'Watch Video')}</span>
                      <Play size={12} fill="currentColor" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <div className="videos-load-more-wrap">
            <button
              className="videos-load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 size={18} className="spinner" />
                  <span>Loading More...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>{t('videos.load_more', 'Load More Videos')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </main>

      {/* Click-to-Play Modal */}
      {activeVideo && (
        <div
          className="sacred-video-modal-backdrop"
          onClick={() => setActiveVideo(null)}
          role="dialog"
          aria-modal="true"
          aria-label={language === 'te' ? (activeVideo.title_te || translateDynamic(activeVideo, 'title') || activeVideo.title) : activeVideo.title}
        >
          <div
            className="sacred-video-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="sacred-video-modal-close"
              onClick={() => setActiveVideo(null)}
              aria-label={t('videos.close_video', 'Close Video')}
            >
              <X size={20} />
            </button>

            <div className="sacred-video-iframe-wrap">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_video_id}?autoplay=1&rel=0&modestbranding=1`}
                title={language === 'te' ? (activeVideo.title_te || translateDynamic(activeVideo, 'title') || activeVideo.title) : activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            <div className="sacred-video-modal-meta">
              <h3 className="sacred-video-modal-title">
                {language === 'te' ? (activeVideo.title_te || translateDynamic(activeVideo, 'title') || activeVideo.title) : activeVideo.title}
              </h3>
              {(activeVideo.description || activeVideo.description_te) && (
                <p className="sacred-video-modal-desc">
                  {language === 'te' ? (activeVideo.description_te || translateDynamic(activeVideo, 'description') || activeVideo.description) : activeVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
