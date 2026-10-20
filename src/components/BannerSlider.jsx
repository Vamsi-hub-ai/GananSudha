import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import './BannerSlider.css';

export default function BannerSlider() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState(new Set());
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    fetchActiveBanners();
  }, []);

  const fetchActiveBanners = async () => {
    try {
      const res = await fetch('/api/banners/active');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBanners(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load active banners from API:', err);
    }
    
    // Fallback default banners if API unreachable
    setBanners([
      {
        id: 1,
        title: 'Authentic Vedic Poojas & Homams',
        subtitle: 'Experience traditional rituals performed by verified Vedic priests in the comfort of your home.',
        image_path: '/assets/hero_illustration_1782464564369.png',
        cta_text: 'Book a Pooja',
        cta_url: '/poojas',
        alt_text: 'Vedic Poojas & Homams'
      },
      {
        id: 2,
        title: 'Premium Spiritual Store & Samagri',
        subtitle: 'Handpicked, 100% pure and shastra-compliant items delivered directly to your doorstep.',
        image_path: '/assets/product_pooja_kit.png',
        cta_text: 'Explore Shop',
        cta_url: '/shop',
        alt_text: 'Spiritual Store Samagri'
      }
    ]);
    setLoading(false);
  };

  // Autoplay every 5 seconds (paused when user hovers)
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // Handle Touch Swipes for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    touchStartX.current = null;
  };

  const handleImageError = (id, imgUrl) => {
    console.warn(`[BannerSlider] Failed to load banner image: ${imgUrl} (Banner ID: ${id})`);
    setFailedImages((prev) => new Set(prev).add(id));
  };

  if (loading) {
    return (
      <div className="banner-slider-container banner-slider-skeleton">
        <div className="banner-skeleton-shimmer"></div>
      </div>
    );
  }

  // Graceful fallback if 0 banners exist
  if (banners.length === 0) {
    return (
      <div className="banner-slider-container banner-empty-fallback">
        <div className="banner-fallback-content">
          <Sparkles className="fallback-icon" size={32} />
          <h3>Welcome to Gnana Sudha</h3>
          <p>Your sacred destination for authentic Vedic rituals, poojas, and pure spiritual samagri.</p>
          <button className="btn-primary" onClick={() => navigate('/poojas')}>
            Explore Our Services <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="banner-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Banners Slider"
    >
      <div 
        className="banner-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, idx) => {
          const hasFailed = failedImages.has(banner.id);

          return (
            <div 
              key={banner.id || idx} 
              className={`banner-slide ${banner.cta_url ? 'clickable-slide' : ''}`}
              onClick={() => {
                if (banner.cta_url) navigate(banner.cta_url);
              }}
            >
              {!hasFailed ? (
                <picture className="banner-picture">
                  {banner.mobile_image_path && (
                    <source 
                      media="(max-width: 640px)" 
                      srcSet={banner.mobile_image_path} 
                    />
                  )}
                  <img 
                    src={banner.image_path} 
                    alt={banner.alt_text || banner.title || `Banner ${idx + 1}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                    onError={() => handleImageError(banner.id, banner.image_path)}
                  />
                </picture>
              ) : (
                <div className="banner-failed-fallback">
                  <div className="fallback-badge">
                    <AlertCircle size={18} />
                    <span>Gnana Sudha Spiritual Banner</span>
                  </div>
                  <h2>{banner.title}</h2>
                  {banner.subtitle && <p>{banner.subtitle}</p>}
                </div>
              )}

              {/* Text & CTA Overlay */}
              {(banner.title || banner.cta_text) && !hasFailed && (
                <div className="banner-overlay">
                  <div className="banner-text-box">
                    {banner.title && <h2 className="banner-title">{banner.title}</h2>}
                    {banner.subtitle && <p className="banner-subtitle">{banner.subtitle}</p>}
                    {banner.cta_text && (
                      <button 
                        className="banner-cta-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (banner.cta_url) navigate(banner.cta_url);
                        }}
                      >
                        {banner.cta_text} <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {banners.length > 1 && (
        <>
          <button 
            className="banner-nav-btn prev" 
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            className="banner-nav-btn next" 
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          <div className="banner-dots">
            {banners.map((_, idx) => (
              <button 
                key={idx} 
                className={`banner-dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
