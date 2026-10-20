import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, X, Film, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { autoTranslateToTelugu } from '../locales/dynamicTerms';
import './HomeVideosSection.css';

export default function HomeVideosSection() {
  const navigate = useNavigate();
  const { t, translateDynamic, language } = useLanguage();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHomepageVideos() {
      try {
        const res = await fetch('/api/youtube-videos/homepage');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data)) {
            setVideos(json.data.slice(0, 6)); // Guarantee max 6 videos
          }
        }
      } catch (err) {
        console.warn('[HomeVideosSection] Failed to load homepage videos:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHomepageVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setActiveVideo(null);
      }
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

  // Clean empty state: if finished loading and no videos are published, hide the section
  if (!loading && (!videos || videos.length === 0)) {
    return null;
  }

  const defaultDevotionalFallback = '/assets/sacred_pooja_ritual.jpg';

  return (
    <section className="sacred-videos-section" id="sacred-videos-homepage" aria-label="Watch Our Sacred Rituals">
      {/* Section Header */}
      <div className="sacred-videos-header">
        <div className="sacred-videos-pill">
          <Film size={14} />
          <span>{t('videos.section_pill', 'Watch Our Sacred Rituals')}</span>
        </div>
        <h2 className="sacred-videos-title">
          {t('videos.section_title', 'Watch Our Sacred Rituals')}
        </h2>
        <p className="sacred-videos-subtitle">
          {t('videos.section_subtitle', 'Explore poojas, homams, spiritual guidance, temple traditions, and devotional videos from Gnana Sudha.')}
        </p>
        <div className="sacred-videos-divider">
          <img src="/lotus.svg" alt="Sacred Lotus" />
        </div>
      </div>

      {/* Grid: 3 columns on desktop (up to 6 videos in 2 rows of 3) */}
      <div className="sacred-videos-grid">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={`skel-${idx}`} className="sacred-video-card skeleton">
              <div className="sacred-video-thumb-wrap">
                <div className="skeleton-thumb" />
              </div>
              <div className="sacred-video-body">
                <div className="skeleton-text" />
                <div className="skeleton-text short" />
              </div>
            </div>
          ))
        ) : (
          videos.map((vid) => {
            const fallbackThumb = `https://img.youtube.com/vi/${vid.youtube_video_id}/hqdefault.jpg`;
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
                {/* 16:9 Thumbnail Area */}
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
                    <span className="sacred-video-category-badge">
                      {displayCategory}
                    </span>
                  )}
                  <div className="sacred-video-thumb-overlay">
                    <div className="sacred-video-play-btn" title="Play Video">
                      <Play size={22} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="sacred-video-body">
                  <h3 className="sacred-video-card-title" title={displayTitle}>
                    {displayTitle}
                  </h3>
                  {displayDesc && (
                    <p className="sacred-video-card-desc">
                      {displayDesc}
                    </p>
                  )}
                  <div className="sacred-video-card-cta">
                    <span>{t('videos.play_video', 'Watch Video')}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* View All Videos CTA */}
      {!loading && videos.length > 0 && (
        <div className="sacred-videos-footer">
          <button
            className="sacred-videos-view-all-btn"
            onClick={() => navigate('/videos')}
          >
            <span>{t('videos.view_all', 'View All Videos')}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Click-to-Play Privacy-Enhanced Video Modal */}
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
    </section>
  );
}
