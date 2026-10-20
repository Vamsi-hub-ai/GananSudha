import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import BookingModal from '../components/BookingModal';
import SacredRitualsBooking from '../components/SacredRitualsBooking';
import { 
  CalendarDays, MapPin, ArrowRight, User, FileText, 
  CheckCircle2, ShieldCheck, Home, Globe, PackageOpen, 
  Flame, Languages, Clock, MessageCircle, Phone, Star, Sparkles 
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

export default function Poojas() {
  const { poojas, homams, currentCustomer } = useContext(DataContext);
  const { t, translateDynamic, language } = useLanguage();
  const navigate = useNavigate();
  const topPoojas = poojas;
  const topHomams = homams;

  const [bookingModalService, setBookingModalService] = useState(null);

  const handleOpenBooking = (service, type = 'pooja') => {
    setBookingModalService({
      ...service,
      type
    });
  };

  return (
    <div className={`poojas-page ${language === 'te' ? 'lang-te' : ''}`}>
      {/* 1. ROYAL VEDIC HERO SECTION */}
      <section className="vedic-page-hero-wrap">
        <div className="vedic-page-hero-card">
          <div className="vedic-hero-mandala"></div>

          {/* Ornamental Vedic Corner Accents */}
          <div className="vedic-hero-corner top-left">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45">
              <path d="M4,4 L36,4 C20,12 12,20 4,36 Z" />
              <circle cx="8" cy="8" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,16 C16,16 16,4 28,4" />
            </svg>
          </div>
          <div className="vedic-hero-corner bottom-right">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45" style={{ transform: 'rotate(180deg)' }}>
              <path d="M4,4 L36,4 C20,12 12,20 4,36 Z" />
              <circle cx="8" cy="8" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,16 C16,16 16,4 28,4" />
            </svg>
          </div>

          <div className="vedic-hero-grid">
            {/* Left Content Column */}
            <div className="vedic-hero-left">
              <div className="vedic-hero-eyebrow">
                <div className="vedic-eyebrow-badge">
                  <span>🪷</span>
                  <span>{language === 'te' ? 'ప్రామాణిక వైదిక పూజలు & హోమాలు' : 'AUTHENTIC VEDIC POOJAS & RITUALS'}</span>
                  <span>🪷</span>
                </div>
              </div>

              <h1 className="vedic-hero-title">
                {language === 'te' ? (
                  <>
                    మీ ఇంట <br />
                    <span className="vedic-title-gradient">పవిత్ర పూజా సంకల్పం</span>
                  </>
                ) : (
                  <>
                    BOOK YOUR <br />
                    <span className="vedic-title-gradient">SACRED POOJA</span>
                  </>
                )}
              </h1>

              <p className="vedic-hero-subtitle">
                {language === 'te'
                  ? 'గృహప్రవేశం, వివాహం, ఆయుష్య హోమం లేదా విశేష వ్రతం ఏదైనా — శాస్త్రోక్త వేద సంప్రదాయంతో, అనుభవజ్ఞులైన వేద పండితులచే మీ ఇంట సంపూర్ణ దైవానుగ్రహాన్ని పొందండి.'
                  : 'Celebrate every sacred milestone with peace of mind. We connect your family with verified Vedic scholars who perform each ritual strictly according to ancient Shastras with pure sanctified samagri.'}
              </p>

              {/* 4 Sacred Pillars Grid */}
              <div className="vedic-hero-pillars">
                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <Flame size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {language === 'te' ? '100% శాస్త్రోక్త సంప్రదాయం' : '100% Shastra Compliant'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <ShieldCheck size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {language === 'te' ? 'గురుకుల వేద పండితులు' : 'Verified Gurukul Priests'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <PackageOpen size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {language === 'te' ? 'స్వచ్ఛమైన పూజా ద్రవ్యాలు' : 'Pure Certified Samagri'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <Clock size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {language === 'te' ? 'శుభ ముహూర్త నిర్ణయం' : 'Auspicious Muhurtham'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="vedic-hero-actions">
                <button 
                  className="vedic-btn-primary" 
                  onClick={() => {
                    const el = document.querySelector('.pooja-services-wrapper');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>{language === 'te' ? 'పూజలను పరిశీలించి బుక్ చేయండి' : 'Explore Poojas & Book'}</span>
                  <ArrowRight size={16} />
                </button>

                <a 
                  href="https://wa.me/919281867001?text=Namaste%20Gnana%20Sudha,%20I%20would%20like%20guidance%20for%20booking%20a%20Pooja."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vedic-btn-whatsapp"
                >
                  <MessageCircle size={16} />
                  <span>{language === 'te' ? 'వాట్సాప్ సహాయం' : 'WhatsApp Support'}</span>
                </a>
              </div>

              {/* Social Proof Strip */}
              <div className="vedic-hero-trust">
                <div className="vedic-avatar-group">
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="vedic-trust-info">
                  <div className="vedic-trust-rating">
                    <span>★ ★ ★ ★ ★</span>
                    <span>4.9 / 5.0</span>
                  </div>
                  <div className="vedic-trust-label">
                    {language === 'te' ? '10,000+ కుటుంబాల ఆధ్యాత్మిక విశ్వాసం' : 'Trusted by 10,000+ Devotee Families'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Temple Arch Frame */}
            <div className="vedic-hero-right">
              <div className="vedic-arch-frame">
                {/* Floating Chips */}
                <div className="vedic-floating-chip top-left">
                  <div className="vedic-chip-icon crimson">
                    <Flame size={15} />
                  </div>
                  <div className="vedic-chip-texts">
                    <span className="vedic-chip-title">{language === 'te' ? 'శాస్త్రోక్త విధి' : 'Authentic Vidhi'}</span>
                    <span className="vedic-chip-sub">{language === 'te' ? 'వేద పండితులచే' : 'By Vedic Scholars'}</span>
                  </div>
                </div>

                <div className="vedic-floating-chip bottom-right">
                  <div className="vedic-chip-icon emerald">
                    <ShieldCheck size={15} />
                  </div>
                  <div className="vedic-chip-texts">
                    <span className="vedic-chip-title">{language === 'te' ? 'పూర్తి సామగ్రి' : '100% Complete'}</span>
                    <span className="vedic-chip-sub">{language === 'te' ? 'స్వచ్ఛమైన ద్రవ్యాలు' : 'Sanctified Samagri'}</span>
                  </div>
                </div>

                <div className="vedic-arch-inner">
                  <img 
                    src="/assets/sacred_pooja_ritual.jpg" 
                    alt="Authentic Vedic Pooja Altar" 
                    className="vedic-arch-img"
                  />
                  <div className="vedic-arch-vignette"></div>
                </div>

                <div className="vedic-arch-floating-badge">
                  <span className="vedic-badge-pulse"></span>
                  <span>{language === 'te' ? '🟢 పవిత్ర ముహూర్త బుకింగ్స్ అందుబాటులో ఉన్నాయి' : '🟢 Sacred Muhurtham Bookings Live'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOP 10 POOJA SERVICES */}
      <section className="pooja-services-wrapper">
        <div className="container-box">
          <div className="section-header-row theme-pooja">
            <div style={{ marginBottom: '8px' }}><img src="/lotus.svg" alt="Lotus" width="32" style={{ filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} /></div>
            <h2 className="section-title">{t('home.top_poojas.title')}</h2>
            <p className="section-subtitle" style={{ fontSize: '13px', color: '#6C5D53', marginTop: '8px' }}>
              {t('home.top_poojas.subtitle')}
            </p>
          </div>

          <div className="services-10-grid theme-pooja">
            {topPoojas.map((service, idx) => (
              <div className="top-service-card" key={`pooja-${idx}`}>
                <div className="card-badge">{idx + 1}</div>
                <img src={service.img} alt={translateDynamic(service, 'name')} className="top-service-img" />
                <h4 className="top-service-title">{translateDynamic(service, 'name')}</h4>
                <p className="top-service-desc">{translateDynamic(service, 'desc')}</p>
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', padding: '12px 16px 16px', gap: '8px', alignItems: 'center' }}>
                  <button 
                    className="top-service-btn" 
                    onClick={() => handleOpenBooking(service, 'pooja')} 
                    style={{ 
                      width: '100%', 
                      cursor: 'pointer', 
                      border: 'none', 
                      background: 'linear-gradient(135deg, #E04E15 0%, #C53018 100%)', 
                      color: 'white', 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      fontWeight: '700',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(224, 78, 21, 0.25)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{language === 'te' ? 'ఈ పూజను బుక్ చేయండి' : 'Book This Pooja'}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP 10 HOMAM SERVICES */}
      <section className="homam-services-wrapper">
        <div className="container-box">
          <div className="homam-box-container theme-homam">
            <div className="section-header-row">
              <div style={{ marginBottom: '8px', fontSize: '24px' }}>🔥</div>
              <h2 className="section-title">{t('home.top_homams.title')}</h2>
              <p className="section-subtitle" style={{ fontSize: '13px', color: '#6C5D53', marginTop: '8px' }}>
                {t('home.top_homams.subtitle')}
              </p>
            </div>

            <div className="services-10-grid theme-homam">
              {topHomams.map((service, idx) => (
                <div className="top-service-card" key={`homam-${idx}`}>
                  <div className="card-badge">{idx + 1}</div>
                  <img src={service.img} alt={translateDynamic(service, 'name')} className="top-service-img" />
                  <h4 className="top-service-title">{translateDynamic(service, 'name')}</h4>
                  <p className="top-service-desc">{translateDynamic(service, 'desc')}</p>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', padding: '12px 16px 16px', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="top-service-btn" 
                      onClick={() => handleOpenBooking(service, 'homam')} 
                      style={{ 
                        width: '100%', 
                        cursor: 'pointer', 
                        border: 'none', 
                        background: 'linear-gradient(135deg, #E04E15 0%, #C53018 100%)', 
                        color: 'white', 
                        padding: '12px 16px', 
                        borderRadius: '8px', 
                        fontWeight: '700',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(224, 78, 21, 0.25)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{language === 'te' ? 'ఈ హోమాన్ని బుక్ చేయండి' : 'Book This Homam'}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Consultations Available */}
      <ConsultationsAvailable />

      {/* Why Choose Gnana Sudha */}
      <section className="poojas-usp-section" style={{ padding: '60px 0' }}>
        <div className="section-header center">
          <div className="decorative-icon" style={{ marginBottom: '10px' }}><img src="/lotus.svg" style={{ width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} alt="Lotus" /></div>
          <h2 className="section-title" style={{ color: '#2B1D14', fontSize: '32px', marginBottom: '10px' }}>
            {t('home.why_choose.title')}
          </h2>
          <div className="decorative-icon"><img src="/lotus.svg" style={{ width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} alt="Lotus" /></div>
        </div>
        <div className="container-box why-choose-flex">
          <div className="usp-box">
            <User size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>ధృవీకరించబడిన<br />వేద పండితులు</> : <>Verified &<br />Experienced<br />Vedic Priests</>}</span>
          </div>
          <div className="usp-box">
            <FileText size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>శాస్త్రోక్త పవిత్ర<br />పూజా విధానం</> : <>Authentic<br />Rituals as Per<br />Scriptures</>}</span>
          </div>
          <div className="usp-box">
            <CheckCircle2 size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>సులభమైన ఆన్‌లైన్<br />బుకింగ్</> : <>Easy<br />Online<br />Booking</>}</span>
          </div>
          <div className="usp-box">
            <CalendarDays size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>మీ అనుకూల తేదీ &<br />సమయం</> : <>Flexible Date<br />& Time<br />Selection</>}</span>
          </div>
          <div className="usp-box">
            <ShieldCheck size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>పారదర్శకమైన<br />రుసుము</> : <>Transparent<br />Pricing</>}</span>
          </div>
          <div className="usp-box">
            <Home size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>ఇంటివద్దకే పురోహిత<br />సేవలు</> : <>Doorstep<br />Pooja<br />Services</>}</span>
          </div>
          <div className="usp-box">
            <Globe size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>తెలుగు & ఇంగ్లీష్<br />భాషల్లో సేవలు</> : <>Support in<br />Multiple<br />Languages</>}</span>
          </div>
          <div className="usp-box">
            <PackageOpen size={36} strokeWidth={1.5} color="#E04E15" style={{ marginBottom: '10px' }} />
            <span>{language === 'te' ? <>స్వచ్ఛమైన పూజా<br />సామాగ్రి కిట్లు</> : <>Pooja Samagri<br />Available on<br />Request</>}</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-header center">
          <div className="decorative-icon">🕉️</div>
          <h2 className="section-title">{t('home.how_it_works.title')}</h2>
        </div>
        <div className="container-box steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-icon"><CalendarDays size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">{t('home.how_it_works.step1_title')}</h4>
            <p className="step-desc">{t('home.how_it_works.step1_desc')}</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-icon"><MapPin size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">{t('home.how_it_works.step2_title')}</h4>
            <p className="step-desc">{t('home.how_it_works.step2_desc')}</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-icon"><User size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">{t('home.how_it_works.step3_title')}</h4>
            <p className="step-desc">{t('home.how_it_works.step3_desc')}</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>

          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-icon"><div style={{ fontSize: 40 }}>🪔</div></div>
            <h4 className="step-title">{t('home.how_it_works.step5_title')}</h4>
            <p className="step-desc">{t('home.how_it_works.step5_desc')}</p>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="poojas-banner-section">
        <div className="container-box">
          <div className="poojas-banner">
            <div className="banner-content">
              <h2>{language === 'te' ? 'ఆధ్యాత్మిక పరిపూర్ణతను విశ్వాసంతో అనుభవించండి' : 'Experience Spirituality with Confidence'}</h2>
              <p>
                {language === 'te'
                  ? 'జ్ఞాన సుధలో ప్రతి పూజా కార్యక్రమం భక్తి, శ్రద్ధ మరియు శాస్త్రోక్త నిష్ఠతో నిర్వహించబడుతుంది. మీ కుటుంబానికి ఆధ్యాత్మిక శాంతిని చేకూర్చడమే మా ధ్యేయం.'
                  : "At Gnana Sudha, every ritual is performed with authenticity, care, and devotion. From intimate family ceremonies to grand celebrations, we're committed to making every spiritual journey meaningful and memorable."}
              </p>
              <button className="btn-secondary" style={{ color: '#C53018', marginTop: 20, background: 'white', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {t('common.book_now')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sacred Rituals Booking Section — New UI */}
      <div className="container-box" style={{ padding: '20px 0 60px' }}>
        <SacredRitualsBooking />
      </div>

      {/* Real Customer Booking Modal */}
      {bookingModalService && (
        <BookingModal
          selectedService={bookingModalService}
          onClose={() => setBookingModalService(null)}
        />
      )}
    </div>
  );
}
