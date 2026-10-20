import React, { useContext, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, ChevronDown, User, LogOut, Menu, X, Heart, 
  Search, Phone, Calendar, ShieldCheck, Flame, ShoppingBag,
  Globe, Check, MessageCircle
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart = [], wishlist = [], currentCustomer, currentPandit, currentAdmin, logout } = useContext(DataContext);
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const langDropdownRef = useRef(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll listener for glassmorphism compact transition (with hysteresis to prevent any jitter/shaking)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          if (y > 45) {
            setIsScrolled(true);
          } else if (y < 15) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Announcement & Trust Bar - Scrolls naturally with document to prevent any height bounce */}
      <div className="navbar-top-strip">
        <div className="container-box navbar-top-strip-inner">
          <div className="top-strip-left">
            <span className="top-strip-badge">{t('nav.top_badge')}</span>
            <span className="top-strip-text">{t('nav.top_announcement')}</span>
          </div>
          <div className="top-strip-right">
            <a href="tel:+919281867002" className="top-strip-link" title="Direct Helpline: +91 92818 67002">
              <Phone size={12} /> Helpline: +91 92818 67002
            </a>
            <span className="top-strip-sep">•</span>
            <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer" className="top-strip-link" title="WhatsApp Support: +91 92818 67001">
              <MessageCircle size={12} style={{ color: '#25D366' }} /> WhatsApp: +91 92818 67001
            </a>
            <span className="top-strip-sep">•</span>
            <span className="top-strip-highlight">{t('nav.free_delivery_badge')}</span>
          </div>
        </div>
      </div>

      {/* Main Glass Navigation Bar - Stays sticky with 100% stable height */}
      <header className={`navbar-wrapper ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-main-container">
        <div className="container-box">
          <nav className="navbar">
            {/* Brand Logo & Typography Lockup */}
            <Link to="/" className="nav-brand" aria-label="Gnana Sudha Divine Services">
              <div className="nav-brand-logo-seal">
                <img src="/assets/logo.jpeg" alt="Gnana Sudha" className="nav-logo-img-responsive" />
              </div>
              <div className="nav-brand-text">
                <span className="nav-brand-title">GNANA SUDHA</span>
                <span className="nav-brand-tagline">{t('nav.tagline')}</span>
              </div>
            </Link>
            
            {/* Desktop Navigation Links */}
            <div className="nav-links">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                <span>{t('nav.home')}</span>
              </Link>
              <Link to="/poojas" className={`nav-link ${location.pathname === '/poojas' ? 'active' : ''}`}>
                <span>{t('nav.poojas')}</span>
              </Link>
              <Link to="/pandit" className={`nav-link ${location.pathname === '/pandit' ? 'active' : ''}`}>
                <span>{t('nav.pandits')}</span>
              </Link>
              <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>
                <span>{t('nav.shop')}</span>
              </Link>
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                <span>{t('nav.contact')}</span>
              </Link>
            </div>

            {/* Quick Header Search Bar */}
            <form onSubmit={handleSearchSubmit} className="nav-search-form" role="search">
              <Search size={15} className="nav-search-icon" />
              <input 
                type="text" 
                placeholder={t('nav.search_placeholder')}
                value={headerSearch}
                onChange={e => setHeaderSearch(e.target.value)}
                className="nav-search-input"
              />
              {headerSearch && (
                <button 
                  type="button" 
                  onClick={() => setHeaderSearch('')} 
                  className="nav-search-clear-btn"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </form>

            {/* Action Buttons & Profile */}
            <div className="nav-actions">
              {/* Wishlist Button */}
              <button 
                className="icon-btn wishlist-icon-btn" 
                onClick={() => navigate('/profile?tab=wishlist')} 
                aria-label={`Saved wishlist with ${wishlist.length} items`}
                title="My Saved Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && <span className="icon-badge">{wishlist.length}</span>}
              </button>

              {/* Shopping Cart Button */}
              <button 
                className="icon-btn cart-icon-btn" 
                onClick={() => navigate('/cart')} 
                aria-label={`Shopping cart with ${cart.length} items`}
                title="Shopping Cart"
              >
                <ShoppingCart size={18} />
                {cart.length > 0 && <span className="icon-badge">{cart.length}</span>}
              </button>
              
              {/* Desktop Language Selector Dropdown */}
              <div className="language-selector-wrapper" ref={langDropdownRef}>
                <button
                  type="button"
                  className={`language-selector-btn ${langDropdownOpen ? 'active' : ''}`}
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  aria-label="Select Language"
                  aria-expanded={langDropdownOpen}
                  title={language === 'te' ? 'భాషను మార్చుకోండి' : 'Change Language'}
                >
                  <Globe size={15} className="lang-globe-icon" />
                  <span className="lang-code-text">{language === 'te' ? 'తెలుగు' : 'English'}</span>
                  <ChevronDown size={13} className={`lang-chevron ${langDropdownOpen ? 'rotated' : ''}`} />
                </button>
                
                {langDropdownOpen && (
                  <div className="language-dropdown-menu">
                    <button
                      type="button"
                      className={`language-option ${language === 'en' ? 'selected' : ''}`}
                      onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    >
                      <span className="lang-flag">🇬🇧</span>
                      <span className="lang-label">English</span>
                      {language === 'en' && <Check size={14} className="lang-check" />}
                    </button>
                    <button
                      type="button"
                      className={`language-option ${language === 'te' ? 'selected' : ''}`}
                      onClick={() => { setLanguage('te'); setLangDropdownOpen(false); }}
                    >
                      <span className="lang-flag">🇮🇳</span>
                      <span className="lang-label">తెలుగు</span>
                      {language === 'te' && <Check size={14} className="lang-check" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Authentication / Account Menu */}
              {currentCustomer || currentPandit || currentAdmin ? (
                <div className="nav-dropdown user-dropdown-container">
                  <button 
                    className="desktop-user-pill" 
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="user-pill-avatar">
                      <User size={14} />
                    </div>
                    <span className="user-btn-name">
                      {currentCustomer 
                        ? currentCustomer.name?.split(' ')[0] 
                        : currentPandit 
                          ? currentPandit.name?.split(' ')[0] 
                          : (currentAdmin?.name || currentAdmin?.username || 'Admin').split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className={`user-chevron ${userDropdownOpen ? 'rotated' : ''}`} />
                  </button>
                  <div className={`dropdown-menu ${userDropdownOpen ? 'open' : ''}`}>
                    <div className="dropdown-user-header">
                      <div className="dropdown-user-name">
                        {currentCustomer 
                          ? currentCustomer.name 
                          : currentPandit 
                            ? currentPandit.name 
                            : (currentAdmin?.name || currentAdmin?.username || 'Administrator')}
                      </div>
                      <div className="dropdown-user-role">
                        {currentCustomer ? 'Devotee / Customer' : currentPandit ? 'Vedic Pandit' : 'Administrator'}
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    {currentCustomer && (
                      <Link to="/profile">
                        <User size={15} /> {t('nav.my_account')}
                      </Link>
                    )}
                    <Link to="/cart">
                      <ShoppingCart size={15} /> {t('nav.cart')} ({cart.length})
                    </Link>
                    <Link to="/profile?tab=wishlist">
                      <Heart size={15} /> Wishlist ({wishlist.length})
                    </Link>
                    {currentAdmin && !currentCustomer && !currentPandit && (
                      <Link to="/admin">
                        <ShieldCheck size={15} /> {t('nav.admin_portal')}
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button 
                      onClick={() => { logout(); navigate('/'); }} 
                      className="dropdown-logout-item"
                    >
                      <LogOut size={15} /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  className="desktop-login-cta" 
                  onClick={() => navigate('/login')}
                >
                  <User size={15} />
                  <span>{t('nav.login')}</span>
                </button>
              )}

              {/* Mobile Menu Toggle Button */}
              <button 
                className="mobile-hamburger-btn" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </nav>
        </div>
      </div>
      </header>

      {/* Mobile Drawer via Portal (escapes header backdrop-filter stacking context) */}
      {typeof document !== 'undefined' && createPortal(
        <>
          {mobileMenuOpen && (
            <div 
              className="mobile-drawer-overlay" 
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          <aside className={`mobile-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`} aria-label="Mobile Navigation">
            <div className="mobile-drawer-header">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-drawer-brand">
                <div className="nav-brand-logo-seal" style={{ width: '38px', height: '38px' }}>
                  <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                </div>
                <div className="nav-brand-text">
                  <span className="nav-brand-title" style={{ fontSize: '16px' }}>GNANA SUDHA</span>
                  <span className="nav-brand-tagline" style={{ fontSize: '9px' }}>DIVINE SERVICES</span>
                </div>
              </Link>
              <button 
                className="mobile-drawer-close-btn" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Mobile Search */}
            <div style={{ padding: '16px 16px 0 16px' }}>
              <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                <Search size={16} className="nav-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search poojas, samagri..." 
                  value={headerSearch}
                  onChange={e => setHeaderSearch(e.target.value)}
                  className="mobile-search-input"
                />
                {headerSearch && (
                  <button type="button" onClick={() => setHeaderSearch('')} style={{ background: 'none', border: 'none', color: '#9CA3AF' }}>
                    <X size={14} />
                  </button>
                )}
              </form>
            </div>

            <div className="mobile-drawer-body">
              {/* Language Selector in Mobile Drawer */}
              <div className="mobile-language-section">
                <div className="mobile-language-label">
                  <Globe size={14} /> <span>{t('nav.language')}</span>
                </div>
                <div className="mobile-language-pills">
                  <button
                    type="button"
                    className={`mobile-lang-pill ${language === 'en' ? 'active' : ''}`}
                    onClick={() => setLanguage('en')}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    className={`mobile-lang-pill ${language === 'te' ? 'active' : ''}`}
                    onClick={() => setLanguage('te')}
                  >
                    🇮🇳 తెలుగు
                  </button>
                </div>
              </div>

              <nav className="mobile-nav-list">
                <Link 
                  to="/" 
                  className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.home')}</span>
                </Link>

                <Link 
                  to="/poojas" 
                  className={`mobile-nav-item ${location.pathname === '/poojas' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.poojas')}</span>
                </Link>

                <Link 
                  to="/pandit" 
                  className={`mobile-nav-item ${location.pathname === '/pandit' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.pandits')}</span>
                </Link>

                <Link 
                  to="/register-pandit" 
                  className={`mobile-nav-item ${location.pathname === '/register-pandit' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('home.become_pandit.register_cta')}</span>
                </Link>

                <Link 
                  to="/shop" 
                  className={`mobile-nav-item ${location.pathname === '/shop' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.shop')}</span>
                </Link>
                
                <Link 
                  to="/contact" 
                  className={`mobile-nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{t('nav.contact')}</span>
                </Link>
              </nav>

              <div className="mobile-drawer-divider" />

              {/* Quick Support Card in Drawer */}
              <div className="mobile-support-box">
                <div className="mobile-support-title">{t('nav.need_guidance')}</div>
                <div className="mobile-support-desc">{t('nav.talk_priests')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <a 
                    href="tel:+919281867002"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'linear-gradient(135deg, #C53018, #A3200B)',
                      color: '#FFF',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={14} /> Direct Helpline: +91 92818 67002
                  </a>
                  <a 
                    href="https://wa.me/919281867001?text=Namaste%20Gnana%20Sudha,%20I%20need%20assistance%20with%20Pooja%20booking."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-whatsapp-btn"
                  >
                    <MessageCircle size={14} /> WhatsApp Support: +91 92818 67001
                  </a>
                </div>
              </div>

              <div className="mobile-drawer-divider" />

              {/* User Section in Drawer */}
              <div className="mobile-drawer-user-section">
                {currentCustomer || currentPandit || currentAdmin ? (
                  <div className="mobile-user-box">
                    <div className="mobile-user-info">
                      <div className="mobile-user-avatar">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="mobile-user-name">
                          {currentCustomer 
                            ? currentCustomer.name 
                            : currentPandit 
                              ? currentPandit.name 
                              : (currentAdmin?.name || currentAdmin?.username || 'Administrator')}
                        </div>
                        <div className="mobile-user-email">
                          {currentCustomer 
                            ? currentCustomer.email 
                            : currentPandit 
                              ? currentPandit.username 
                              : (currentAdmin?.username || 'admin@gnanasudha.com')}
                        </div>
                      </div>
                    </div>

                    <div className="mobile-user-actions">
                      {currentCustomer && (
                        <Link 
                          to="/profile" 
                          className="mobile-user-link" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User size={15} /> My Profile
                        </Link>
                      )}
                      {currentAdmin && !currentCustomer && !currentPandit && (
                        <Link 
                          to="/admin" 
                          className="mobile-user-link" 
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ShieldCheck size={15} /> Admin Setup
                        </Link>
                      )}
                      <button 
                        className="mobile-logout-btn" 
                        onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-auth-buttons">
                    <button 
                      className="mobile-login-btn-full" 
                      onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                    >
                      <User size={16} /> Sign In / Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
}
