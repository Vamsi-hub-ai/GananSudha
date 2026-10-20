import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';
import './DevotionalWelcomePopup.css';

/**
 * DevotionalWelcomePopup
 * Displays a premium devotional Lord Ganesha blessing automatically on first visit.
 * Auto-closes after exactly 3000 milliseconds with a smooth fade-out animation.
 * Protected by sessionStorage so it only shows once per browser session.
 */
export default function DevotionalWelcomePopup() {
  const [isOpen, setIsOpen] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      return !sessionStorage.getItem('gs_devotional_welcome_shown');
    } catch {
      return false;
    }
  });

  const [isClosing, setIsClosing] = useState(false);
  const autoCloseTimerRef = useRef(null);
  const animationTimerRef = useRef(null);

  const handleClose = useCallback(() => {
    // Stop the 3-second auto-close timer if user closed manually
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }

    setIsClosing(true);

    // Wait for the 350ms fade-out/scale-down animation to finish before removing from DOM
    animationTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 350);
  }, []);

  useEffect(() => {
    window.__openDevotionalWelcomePopup = () => {
      setIsClosing(false);
      setIsOpen(true);
    };
    return () => {
      delete window.__openDevotionalWelcomePopup;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    try {
      sessionStorage.setItem('gs_devotional_welcome_shown', 'true');
    } catch {
      // sessionStorage unavailable or restricted
    }

    // Auto-close after exactly 3000ms (3 seconds) from full display
    autoCloseTimerRef.current = setTimeout(() => {
      handleClose();
    }, 3000);

    // Close on Escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div 
      className={`devotional-popup-overlay ${isClosing ? 'closing' : ''}`}
      onClick={(e) => {
        // Close if backdrop overlay clicked
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Gnana Sudha Devotional Welcome Blessing"
    >
      <div className={`devotional-popup-card ${isClosing ? 'closing' : ''}`}>
        {/* Floating sacred flower petals */}
        <div className="devotional-petals-container" aria-hidden="true">
          <span className="devotional-petal p1" />
          <span className="devotional-petal p2" />
          <span className="devotional-petal p3" />
          <span className="devotional-petal p4" />
          <span className="devotional-petal p5" />
        </div>

        {/* Top-Right Circular Close Button */}
        <button 
          type="button" 
          className="devotional-close-btn" 
          onClick={handleClose}
          aria-label="Close welcome blessing"
        >
          <X size={18} />
        </button>

        {/* Left Column: Lord Ganesha Image */}
        <div className="devotional-image-col">
          <img 
            src="/assets/ganesha_popup.jpg" 
            alt="Lord Ganesha Devotional Blessing" 
            className="devotional-ganesha-img"
            onError={(e) => {
              e.currentTarget.src = '/assets/ganesha_popup_ref.jpg';
            }}
          />
        </div>

        {/* Right Column: Telugu Devotional Blessing */}
        <div className="devotional-content-col">
          {/* Top Golden Lotus Flourish */}
          <div className="devotional-flourish" aria-hidden="true">
            <span className="flourish-line flourish-line-left" />
            <svg className="flourish-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2c0 0-4 4-4 8s4 12 4 12 4-8 4-12-4-8-4-8z" fill="#D4AF37" />
              <path d="M12 22s-6-4-6-10c0-6 4-5 6-7 2 2 6 1 6 7 0 6-6 10-6 10z" stroke="#D4AF37" strokeWidth="1.2" />
              <path d="M3 12c0 4 3 8 9 10 0 0-8-2-8-6s4-8 6-9c0 0-7 1-7 5z" fill="#D4AF37" />
              <path d="M21 12c0 4-3 8-9 10 0 0 8-2 8-6s-4-8-6-9c0 0 7 1 7 5z" fill="#D4AF37" />
            </svg>
            <span className="flourish-line flourish-line-right" />
          </div>

          {/* Telugu Blessing Message */}
          <div className="devotional-blessing-text">
            <span className="blessing-line-primary">🙏 శ్రీ గణేశుని ఆశీస్సులతో</span>
            <span className="blessing-line-secondary">మీ ఇంట సుఖసంతోషాలు, అష్టైశ్వర్యాలు</span>
            <span className="blessing-line-body">వెల్లివిరియాలని, ప్రతి అడుగులోనూ</span>
            <span className="blessing-line-accent">
              <span className="text-divine-orange">దైవానుగ్రహం</span> మీకు తోడుగా ఉండాలని
            </span>
            <span className="blessing-line-close">మనస్ఫూర్తిగా కోరుకుంటున్నాం! 🌺</span>
          </div>

          {/* Bottom Golden Lotus Flourish */}
          <div className="devotional-flourish" aria-hidden="true">
            <span className="flourish-line flourish-line-left" />
            <svg className="flourish-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2c0 0-4 4-4 8s4 12 4 12 4-8 4-12-4-8-4-8z" fill="#D4AF37" />
              <path d="M12 22s-6-4-6-10c0-6 4-5 6-7 2 2 6 1 6 7 0 6-6 10-6 10z" stroke="#D4AF37" strokeWidth="1.2" />
              <path d="M3 12c0 4 3 8 9 10 0 0-8-2-8-6s4-8 6-9c0 0-7 1-7 5z" fill="#D4AF37" />
              <path d="M21 12c0 4-3 8-9 10 0 0 8-2 8-6s-4-8-6-9c0 0 7 1 7 5z" fill="#D4AF37" />
            </svg>
            <span className="flourish-line flourish-line-right" />
          </div>

          {/* Prominent Vermilion Confirmation Button */}
          <button 
            type="button" 
            className="devotional-confirm-btn" 
            onClick={handleClose}
            aria-label="Acknowledge blessing"
          >
            <span>🙏 ధన్యవాదాలు</span>
            <ArrowRight size={18} className="confirm-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}
