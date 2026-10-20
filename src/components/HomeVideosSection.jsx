import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, X, Film, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { autoTranslateToTelugu } from '../locales/dynamicTerms';
import './HomeVideosSection.css';

const DEFAULT_HOMEPAGE_VIDEOS = [
  {
    id: 1,
    title: 'Sri Maha Ganapathi Homam & Sankalpam Rituals',
    title_te: 'శ్రీ మహా గణపతి హోమం & సంకల్ప పూజా విధానం',
    youtube_url: 'https://www.youtube.com/watch?v=kYJp38X-9_k',
    youtube_video_id: 'kYJp38X-9_k',
    description: 'Witness the sacred invocation of Lord Ganesha by scholarly Vedic pandits for removing obstacles and bringing prosperity.',
    description_te: 'విఘ్న నివారణ మరియు సకల కార్యసిద్ధి కొరకు విద్వత్ పండితులచే నిర్వహించబడిన సంప్రదాయ శ్రీ మహాగణపతి హోమ దృశ్యాలు.',
    category: 'Homam',
    thumbnail_url: 'https://img.youtube.com/vi/kYJp38X-9_k/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/kYJp38X-9_k',
    display_order: 1
  },
  {
    id: 2,
    title: 'Sri Satyanarayana Swamy Vratam Complete Katha & Pooja',
    title_te: 'శ్రీ సత్యనారాయణ స్వామి వ్రత కథ & సంపూర్ణ పూజ',
    youtube_url: 'https://www.youtube.com/watch?v=0h6Q5XQ_0lE',
    youtube_video_id: '0h6Q5XQ_0lE',
    description: 'Step-by-step sacred Satyanarayana Swamy Pooja recitation, Kalasha sthapana, and prasadam offerings.',
    description_te: 'కలశస్థాపన, నవగ్రహ పూజ, వ్రత కథా శ్రవణం మరియు ప్రసాద వితరణతో కూడిన సంపూర్ణ సత్యనారాయణ వ్రత పూజా విధానం.',
    category: 'Pooja',
    thumbnail_url: 'https://img.youtube.com/vi/0h6Q5XQ_0lE/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/0h6Q5XQ_0lE',
    display_order: 2
  },
  {
    id: 3,
    title: 'Maha Mrityunjaya Homam for Health, Healing & Longevity',
    title_te: 'ఆరోగ్య ఆయుర్వృద్ధి కొరకు మహా మృత్యుంజయ హోమం',
    youtube_url: 'https://www.youtube.com/watch?v=J9fP87Z8k0I',
    youtube_video_id: 'J9fP87Z8k0I',
    description: 'Vedic recitation of the sacred Tryambakam mantra with 108 ahutis of amrita valli and sesame oblations.',
    description_te: 'దీర్ఘకాలిక అనారోగ్య నివారణ, ఆయురారోగ్య రక్షణ కొరకు 108 అమృతవల్లి ఆహుతులతో కూడిన మహా మృత్యుంజయ హవనం.',
    category: 'Homam',
    thumbnail_url: 'https://img.youtube.com/vi/J9fP87Z8k0I/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/J9fP87Z8k0I',
    display_order: 3
  },
  {
    id: 4,
    title: 'Sacred Shiva Linga Rudrabhishekam with Namakam & Chamakam',
    title_te: 'శ్రీ రుద్రాభిషేకం (నమకం & చమక సహిత శివ పూజ)',
    youtube_url: 'https://www.youtube.com/watch?v=M5A7D8K9l4s',
    youtube_video_id: 'M5A7D8K9l4s',
    description: 'Holy abhishekam with milk, honey, sugarcane juice, and sacred vibhooti performed by senior purohits.',
    description_te: 'క్షీర, మధు, ఇక్షురస, భస్మ అభిషేకములతో వేద పండితులచే శాస్త్రోక్తంగా నిర్వహించబడే దివ్య రుద్రాభిషేక దర్శనం.',
    category: 'Pooja',
    thumbnail_url: 'https://img.youtube.com/vi/M5A7D8K9l4s/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/M5A7D8K9l4s',
    display_order: 4
  },
  {
    id: 5,
    title: 'Navagraha Shanti Homam & Dosha Nivarana Vidhanam',
    title_te: 'నవగ్రహ శాంతి హోమం & దోష నివారణ పద్ధతి',
    youtube_url: 'https://www.youtube.com/watch?v=P8m4F9A2b3c',
    youtube_video_id: 'P8m4F9A2b3c',
    description: 'Harmonizing the planetary influences through nine sacred grains and dedicated Vedic graha suktams.',
    description_te: 'జాతక దోషాల ఉపశమనం, గ్రహ శాంతి మరియు కుటుంబ క్షేమం కొరకు నవధాన్య ఆహుతులతో నిర్వహించే శాంతి హోమం.',
    category: 'Spiritual Guidance',
    thumbnail_url: 'https://img.youtube.com/vi/P8m4F9A2b3c/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/P8m4F9A2b3c',
    display_order: 5
  },
  {
    id: 6,
    title: 'Sri Lakshmi Kubera Pooja for Abundance & Financial Harmony',
    title_te: 'సిరిసంపదల కొరకు శ్రీ లక్ష్మీ కుబేర పూజా విధానం',
    youtube_url: 'https://www.youtube.com/watch?v=T6v8N4Q1d7e',
    youtube_video_id: 'T6v8N4Q1d7e',
    description: 'Divine worship of Goddess Maha Lakshmi and Lord Kubera with lotus flowers and kumkum archana.',
    description_te: 'కమల పుష్పాలు, కుంకుమార్చన మరియు కనకధారా స్తోత్ర పారాయణంతో అమ్మవారి దివ్య అనుగ్రహం పొందే పూజ.',
    category: 'Festivals',
    thumbnail_url: 'https://img.youtube.com/vi/T6v8N4Q1d7e/hqdefault.jpg',
    embed_url: 'https://www.youtube-nocookie.com/embed/T6v8N4Q1d7e',
    display_order: 6
  }
];

export default function HomeVideosSection() {
  const navigate = useNavigate();
  const { t, translateDynamic, language } = useLanguage();
  const [videos, setVideos] = useState(DEFAULT_HOMEPAGE_VIDEOS.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHomepageVideos() {
      try {
        const res = await fetch('/api/youtube-videos/homepage');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setVideos(json.data.slice(0, 6)); // Guarantee max 6 videos
          }
        }
      } catch (err) {
        console.warn('[HomeVideosSection] API unavailable, keeping authentic defaults:', err.message);
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

  const displayVideos = (videos && videos.length > 0) ? videos : DEFAULT_HOMEPAGE_VIDEOS.slice(0, 3);

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
          displayVideos.map((vid) => {
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
      {displayVideos.length > 0 && (
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
