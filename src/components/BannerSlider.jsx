import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './BannerSlider.css';

export default function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    // Supabase removed, returning static banners or empty list for now
    setBanners([
      '/assets/banner_1.jpg',
      '/assets/banner_2.jpg'
    ]);
    setLoading(false);
  };


  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000); // Auto-play every 5 seconds
    
    return () => clearInterval(interval);
  }, [banners]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  if (loading) {
    return <div className="banner-slider-placeholder">Loading Banners...</div>;
  }

  if (banners.length === 0) {
    return null; // Don't show anything if no banners exist
  }

  return (
    <div className="banner-slider-container">
      <div 
        className="banner-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((url, idx) => (
          <div key={idx} className="banner-slide">
            <img src={url} alt={`Banner ${idx + 1}`} />
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button className="banner-nav-btn prev" onClick={goToPrev}>
            <ChevronLeft size={24} />
          </button>
          <button className="banner-nav-btn next" onClick={goToNext}>
            <ChevronRight size={24} />
          </button>

          <div className="banner-dots">
            {banners.map((_, idx) => (
              <button 
                key={idx} 
                className={`banner-dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
