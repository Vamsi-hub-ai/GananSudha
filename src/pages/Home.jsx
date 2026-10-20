import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import TeluguCalendar from '../components/TeluguCalendar';
import BannerSlider from '../components/BannerSlider';
import HomeVideosSection from '../components/HomeVideosSection';
import {
  Heart, ShoppingCart, CalendarDays, ArrowRight, Star, 
  ShieldCheck, CheckCircle2, DollarSign, 
  Flame, User, Award, Clock, Users, MapPin, FileCheck, Headset, FileText
} from 'lucide-react';
import '../App.css';
import './Hero.css';

const testimonialsEn = [
  { name: 'Ramesh Kumar', loc: 'Bengaluru', review: 'The pooja was performed beautifully and the pandit was very knowledgeable. Very peaceful experience.' },
  { name: 'Lakshmi Priya', loc: 'Chennai', review: 'Booking was so easy and the team is very professional. Highly recommended for all spiritual needs.' },
  { name: 'Suresh Reddy', loc: 'Hyderabad', review: 'Premium quality products and on-time service. Very satisfied with Gnana Sudha.' },
  { name: 'Anil Desai', loc: 'Pune', review: 'Excellent service. The pandit arrived on time and conducted the homam with utmost devotion.' },
  { name: 'Meenakshi Iyer', loc: 'Mumbai', review: 'Very authentic and pure pooja items. The delivery was fast and packaging was secure.' },
  { name: 'Karthik Sharma', loc: 'Delhi', review: 'I booked a Gruha Pravesham pooja. The entire process was seamless and divine. Highly satisfied.' },
  { name: 'Priya Patel', loc: 'Ahmedabad', review: 'Great experience booking a pandit online. Saves so much time and the quality of service is top-notch.' },
  { name: 'Venkatesh Rao', loc: 'Visakhapatnam', review: 'The Navagraha homam brought so much peace to our home. Thank you Gnana Sudha.' },
  { name: 'Sneha Gupta', loc: 'Kolkata', review: 'Beautifully arranged pooja samagri. Everything was perfect as per the shastras.' }
];

const testimonialsTe = [
  { name: 'రమేష్ కుమార్', loc: 'బెంగళూరు', review: 'పూజా కార్యక్రమం ఎంతో శాస్త్రోక్తంగా జరిగింది. పండితులు ఎంతో జ్ఞాన సంపన్నులు, ఎంతో ప్రశాంతత లభించింది.' },
  { name: 'లక్ష్మీ ప్రియ', loc: 'చెన్నై', review: 'బుకింగ్ విధానం ఎంతో సులభంగా ఉంది. ఆధ్యాత్మిక సేవలన్నింటికీ జ్ఞాన సుధను నిస్సందేహంగా సంప్రదించవచ్చు.' },
  { name: 'సురేష్ రెడ్డి', loc: 'హైదరాబాద్', review: 'అత్యుత్తమ నాణ్యమైన పూజా సామాగ్రి మరియు సరైన సమయానికి డెలివరీ. జ్ఞాన సుధ సేవలు ఎంతో సంతృప్తినిచ్చాయి.' },
  { name: 'అనిల్ దేశాయ్', loc: 'పూణే', review: 'అద్భుతమైన సేవలు. పండితులు సరైన సమయానికి వచ్చి ఎంతో భక్తి శ్రద్ధలతో హోమం నిర్వహించారు.' },
  { name: 'మీనాక్షి అయ్యర్', loc: 'ముంబై', review: 'చాలా స్వచ్ఛమైన మరియు ప్రామాణికమైన పూజా ద్రవ్యాలు. ప్యాకింగ్ మరియు డెలివరీ చాలా వేగంగా ఉన్నాయి.' },
  { name: 'కార్తీక్ శర్మ', loc: 'ఢిల్లీ', review: 'నేను గృహప్రవేశం పూజను బుక్ చేసుకున్నాను. మొత్తం ప్రక్రియ ఎంతో పవిత్రంగా, సులభంగా పూర్తయింది.' },
  { name: 'ప్రియా పటేల్', loc: 'అహ్మదాబాద్', review: 'ఆన్‌లైన్‌లో పండితులను బుక్ చేసుకోవడం చాలా సమయం ఆదా చేసింది. సేవల నాణ్యత అత్యుత్తమం.' },
  { name: 'వెంకటేశ్ రావు', loc: 'విశాఖపట్నం', review: 'నవగ్రహ హోమం మా ఇంట ఎంతో శాంతిని, సంతోషాన్ని తెచ్చింది. ధన్యవాదాలు జ్ఞాన సుధ.' },
  { name: 'స్నేహ గుప్తా', loc: 'కోల్‌కతా', review: 'పూజా సామాగ్రి అంతా శాస్త్రోక్తంగా, పరిపూర్ణంగా సిద్ధం చేయబడింది. చాలా సంతోషం.' }
];

function Home() {
  const navigate = useNavigate();
  const { addToCart, products, categories } = useContext(DataContext);
  const { t, translateDynamic, language } = useLanguage();
  
  const [storeTab, setStoreTab] = useState('featured');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const testimonials = language === 'te' ? testimonialsTe : testimonialsEn;

  return (
    <div className="home-container">
      {/* ---------- Hero Section ---------- */}
      <section className="hero-section-new">
        <div className="hero-bg-wrapper">
          <img src="/assets/ganesha_hero.png" alt="Lord Ganesha" className="hero-ganesha-img" />
          <div className="hero-bg-overlay"></div>
        </div>

        <div className="hero-content-new">
          <div className="hero-left-new">
            <div className="hero-pill-top">
              <img src="/lotus.svg" alt="lotus" style={{ width: '14px', filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} />
              {t('home.hero.pill')}
            </div>
            
            <h1 className="hero-title-new">
              {t('home.hero.title_line1')} <br />
              <span>{t('home.hero.title_line2')}</span><br /> 
              {t('home.hero.title_line3')} <br />
              {t('home.hero.title_line4')}
            </h1>

            <p className="hero-desc-new">
              {t('home.hero.desc')}
            </p>

            <div className="hero-features-boxes">
              <div className="hero-feature-box">
                <div className="hero-feature-box-icon"><ShieldCheck size={22} /></div>
                <div className="hero-feature-box-text">
                  <h4>{t('home.hero.verified_pandits_title')}</h4>
                  <p>{t('home.hero.verified_pandits_desc')}</p>
                </div>
              </div>
              <div className="hero-feature-box">
                <div className="hero-feature-box-icon"><Users size={22} /></div>
                <div className="hero-feature-box-text">
                  <h4>{t('home.hero.custom_poojas_title')}</h4>
                  <p>{t('home.hero.custom_poojas_desc')}</p>
                </div>
              </div>
            </div>

            <div className="hero-cta-new">
              <button className="btn-primary-new" onClick={() => navigate('/poojas')}>
                <CalendarDays size={18} />
                {t('home.hero.book_pooja_cta')} <ArrowRight size={18} />
              </button>
              <button className="btn-secondary-new" onClick={() => navigate('/shop')}>
                <img src="/lotus.svg" alt="lotus" style={{ width: '18px', filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} />
                {t('home.hero.sacred_shop_cta')} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Overlapping Features ---------- */}
      <div className="container-box features-overlap">
        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/pandit')} style={{ cursor: 'pointer' }}>
            <div className="feature-img-wrapper">
              <lord-icon
                  src="https://cdn.lordicon.com/dxjqoygy.json"
                  trigger="hover"
                  colors="primary:#d23522,secondary:#2a1c15"
                  style={{ width: '48px', height: '48px' }}>
              </lord-icon>
            </div>
            <div className="feature-content-wrapper">
              <h4 className="feature-title">{t('home.overlap.pandits_title', 'Vedic Pandits')}</h4>
              <p className="feature-desc">{t('home.overlap.pandits_desc', 'Expert verified pandits')}</p>
            </div>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
          </div>
          <div className="feature-card" onClick={() => navigate('/poojas')} style={{ cursor: 'pointer' }}>
            <div className="feature-img-wrapper">
              <lord-icon
                  src="https://cdn.lordicon.com/rjzlnunf.json"
                  trigger="hover"
                  colors="primary:#d23522,secondary:#2a1c15"
                  style={{ width: '48px', height: '48px' }}>
              </lord-icon>
            </div>
            <div className="feature-content-wrapper">
              <h4 className="feature-title">{language === 'te' ? 'పూజలు' : 'Poojas'}</h4>
              <p className="feature-desc">{language === 'te' ? 'పవిత్ర వేద పూజలు' : 'Sacred Vedic Poojas'}</p>
            </div>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
          </div>
          <div className="feature-card" onClick={() => navigate('/poojas')} style={{ cursor: 'pointer' }}>
            <div className="feature-img-wrapper">
              <lord-icon
                  src="https://cdn.lordicon.com/zpxybbhl.json"
                  trigger="hover"
                  colors="primary:#d23522,secondary:#2a1c15"
                  style={{ width: '48px', height: '48px' }}>
              </lord-icon>
            </div>
            <div className="feature-content-wrapper">
              <h4 className="feature-title">{language === 'te' ? 'హోమాలు' : 'Homams'}</h4>
              <p className="feature-desc">{language === 'te' ? 'శాస్త్రోక్త దివ్య హోమాలు' : 'Sacred homams'}</p>
            </div>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
          </div>
          <div className="feature-card" onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>
            <div className="feature-img-wrapper">
              <lord-icon
                  src="https://cdn.lordicon.com/slkvcfos.json"
                  trigger="hover"
                  colors="primary:#d23522,secondary:#2a1c15"
                  style={{ width: '48px', height: '48px' }}>
              </lord-icon>
            </div>
            <div className="feature-content-wrapper">
              <h4 className="feature-title">{t('home.overlap.items_title', 'Pooja Store')}</h4>
              <p className="feature-desc">{t('home.overlap.items_desc', 'Premium pooja items')}</p>
            </div>
            <div className="feature-arrow"><ArrowRight size={16} /></div>
          </div>
        </div>
      </div>

      <div className="container-box" style={{ marginTop: '40px', marginBottom: '20px' }}>
        <BannerSlider />
      </div>

      <div className="container-box">
        {/* ---------- Our Services ---------- */}
        <div style={{ textAlign: 'center', marginBottom: '40px', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className="section-subtitle" style={{ color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {language === 'te' ? 'మా విశిష్ట సేవలు' : 'Our Services'}
          </span>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15', marginTop: '8px', marginBottom: '0' }}>
            {language === 'te' ? 'సేవలు & పవిత్ర ఉత్పత్తులు' : 'Services & Products'}
          </h2>
          <div className="floral-divider"><img src="/lotus.svg" alt="divider" /></div>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>
            {language === 'te' ? 'మా విస్తృతమైన ఆధ్యాత్మిక సేవలు మరియు నాణ్యమైన పూజా ద్రవ్యాలను అన్వేషించండి.' : 'Explore our extensive range of spiritual services and premium products.'}
          </p>
        </div>

        <div className="modern-services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '80px', justifyContent: 'center' }}>
          
          <div className="modern-service-card" onClick={() => navigate('/poojas')} style={{ cursor: 'pointer' }}>
            <div className="service-icon-ring">
              <lord-icon
                  src="https://cdn.lordicon.com/rjzlnunf.json"
                  trigger="hover"
                  colors="primary:#e55d14,secondary:#2a1c15"
                  style={{ width: '64px', height: '64px' }}>
              </lord-icon>
            </div>
            <h4>{language === 'te' ? 'పూజల బుకింగ్' : 'Pooja Booking'}</h4>
            <p>{language === 'te' ? 'మీ సౌలభ్యం ప్రకారం అన్ని శుభకార్యాలకు ప్రామాణిక పురోహితులను బుక్ చేయండి.' : 'Book verified priests for all your rituals and ceremonies at your convenience.'}</p>
            <button className="btn-outline-orange">{language === 'te' ? 'పూజలను చూడండి' : 'Explore Poojas'}</button>
          </div>

          <div className="modern-service-card" onClick={() => navigate('/poojas')} style={{ cursor: 'pointer' }}>
            <div className="service-icon-ring">
              <lord-icon
                  src="https://cdn.lordicon.com/zpxybbhl.json"
                  trigger="hover"
                  colors="primary:#e55d14,secondary:#2a1c15"
                  style={{ width: '64px', height: '64px' }}>
              </lord-icon>
            </div>
            <h4>{language === 'te' ? 'హోమాలు & హవనాలు' : 'Homam & Havans'}</h4>
            <p>{language === 'te' ? 'ఆరోగ్యం, ఐశ్వర్యం మరియు శాంతి కోసం శక్తివంతమైన వేద హోమాలను నిర్వహించండి.' : 'Perform powerful Vedic homams for health, prosperity, and spiritual blessings.'}</p>
            <button className="btn-outline-orange">{language === 'te' ? 'హోమం బుక్ చేయండి' : 'Book Homam'}</button>
          </div>

          <div className="modern-service-card" onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>
            <div className="service-icon-ring">
              <lord-icon
                  src="https://cdn.lordicon.com/slkvcfos.json"
                  trigger="hover"
                  colors="primary:#e55d14,secondary:#2a1c15"
                  style={{ width: '64px', height: '64px' }}>
              </lord-icon>
            </div>
            <h4>{language === 'te' ? 'పవిత్ర పూజా షాప్' : 'Pooja Shop'}</h4>
            <p>{language === 'te' ? 'స్వచ్ఛమైన పూజా సామాగ్రి మరియు ఆధ్యాత్మిక వస్తువులను ఆన్‌లైన్‌లో పొందండి.' : 'Buy premium quality pooja samagri and spiritual products online.'}</p>
            <button className="btn-outline-orange">{language === 'te' ? 'షాప్ చేయండి' : 'Shop Now'}</button>
          </div>

        </div>

        {/* ---------- Shop by Sacred Category ---------- */}
        {categories && categories.length > 0 && (
          <div className="home-categories-section" style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#E04E15', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                {language === 'te' ? 'ప్రామాణిక ఆధ్యాత్మిక కేటలాగ్' : 'Authentic Spiritual Catalog'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#2A1C15', marginTop: '6px', marginBottom: '8px' }}>
                {language === 'te' ? 'విభాగాల వారీగా పూజా సామాగ్రి' : 'Shop by Sacred Category'}
              </h2>
              <div className="floral-divider"><img src="/lotus.svg" alt="divider" /></div>
              <p style={{ color: '#666', fontSize: '14px', maxWidth: '550px', margin: '0 auto' }}>
                {language === 'te' ? 'నిత్య పూజా సామాగ్రి నుండి సంపూర్ణ హోమ కిట్ల వరకు శాస్త్రోక్తంగా రూపొందించిన పవిత్ర వస్తువులు.' : 'From daily pooja essentials to complete homam kits, explore sacred items curated according to Vedic tradition.'}
              </p>
            </div>

            <div className="categories-one-line-grid">
              {categories.slice(0, 6).map(cat => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/shop?cat=${cat.id}`)}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #F0E6DD',
                    borderRadius: '20px',
                    padding: '28px 16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 16px rgba(42, 28, 21, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    minHeight: '210px'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = '#E04E15';
                    e.currentTarget.style.boxShadow = '0 14px 30px rgba(224, 78, 21, 0.16)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#F0E6DD';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(42, 28, 21, 0.05)';
                  }}
                >
                  <div style={{
                    width: '84px',
                    height: '84px',
                    borderRadius: '50%',
                    background: '#FFF5F0',
                    border: '2px solid #FADED7',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(224, 78, 21, 0.1)'
                  }}>
                    {(() => {
                      const getCatImg = (c) => {
                        if (c?.image && typeof c.image === 'string' && c.image.trim() !== '') return c.image;
                        const n = (c?.name || '').toLowerCase();
                        if (n.includes('samagri') && !n.includes('homam')) return '/assets/product_kalash.png';
                        if (n.includes('diya') || n.includes('lamp')) return '/assets/product_diya.png';
                        if (n.includes('idol') || n.includes('murti')) return '/assets/ganesha_popup_clean.jpg';
                        if (n.includes('rudraksha') || n.includes('mala')) return '/assets/product_rudraksha.png';
                        if (n.includes('kit')) return '/assets/product_pooja_kit.png';
                        if (n.includes('homam')) return '/assets/sacred_pooja_ritual.jpg';
                        if (n.includes('incense') || n.includes('dhoop')) return '/assets/product_pooja_kit.png';
                        return '/assets/product_kalash.png';
                      };
                      const imgSrc = getCatImg(cat);
                      return (
                        <img
                          src={imgSrc}
                          alt={translateDynamic(cat, 'name')}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            if (e.target.src !== '/assets/product_kalash.png') {
                              e.target.src = '/assets/product_kalash.png';
                            }
                          }}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#2A1C15', lineHeight: '1.35', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      {translateDynamic(cat, 'name')}
                    </h4>
                    {cat.product_count !== undefined && (
                      <span style={{ fontSize: '12px', color: '#887B75', fontWeight: 500, marginTop: '4px', display: 'inline-block' }}>
                        {cat.product_count} {language === 'te' ? 'వస్తువులు' : 'Items'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => navigate('/shop')}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #E04E15',
                  color: '#E04E15',
                  padding: '10px 24px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF5F0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {language === 'te' ? 'అన్ని విభాగాలు చూడండి' : 'View All Categories'} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ---------- Featured Pooja Essentials & Samagri ---------- */}
        {products && products.length > 0 && (
          <div className="home-featured-products-section" style={{ marginBottom: '80px', background: '#FCF9F5', padding: '36px 20px', borderRadius: '24px', border: '1px solid #F0E6DD' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
              <div>
                <span style={{ color: '#E04E15', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  {language === 'te' ? 'దివ్య పూజా ద్రవ్యాలు' : 'Divine Essentials'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#2A1C15', margin: '4px 0 0' }}>
                  {language === 'te' ? 'విశేష పూజా ద్రవ్యాలు & సామాగ్రి' : 'Featured Pooja Essentials & Samagri'}
                </h2>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', background: '#fff', padding: '4px', borderRadius: '30px', border: '1px solid #e8ded4' }}>
                {[
                  { id: 'featured', label: language === 'te' ? 'ప్రత్యేకమైనవి' : 'Featured' },
                  { id: 'bestseller', label: language === 'te' ? 'అత్యధిక ఆదరణ' : 'Best Sellers' },
                  { id: 'all', label: language === 'te' ? 'అన్ని వస్తువులు' : 'All Items' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStoreTab(tab.id)}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '24px',
                      border: 'none',
                      background: storeTab === tab.id ? '#C53018' : 'transparent',
                      color: storeTab === tab.id ? '#fff' : '#666',
                      fontWeight: storeTab === tab.id ? 600 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards Grid - All 6 in One Single Line on Desktop */}
            <div className="featured-products-one-line-grid">
              {(() => {
                const activeList = products.filter(p => (p.status || 'active') !== 'inactive');
                let displayed = activeList;
                if (storeTab === 'featured') {
                  const filtered = activeList.filter(p => p.featured);
                  displayed = filtered.length >= 6 ? filtered : activeList;
                } else if (storeTab === 'bestseller') {
                  const filtered = activeList.filter(p => p.bestseller);
                  displayed = filtered.length >= 6 ? filtered : activeList;
                }
                return displayed.slice(0, 6).map(prod => {
                  const hasStock = prod.stock === undefined || prod.stock > 0;
                  const discountPct = prod.oldPrice && prod.oldPrice > prod.price 
                    ? Math.round(((prod.oldPrice - prod.price) / prod.oldPrice) * 100) 
                    : null;

                  return (
                    <div
                      key={prod.id}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #eee',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                        position: 'relative'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                      }}
                    >
                      {/* Badge */}
                      {prod.badge_text && (
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: prod.badge_type === 'success' ? '#2e7d32' : prod.badge_type === 'warning' ? '#ed6c02' : '#C53018',
                          color: '#fff',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '10px',
                          zIndex: 2,
                          letterSpacing: '0.3px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}>
                          {prod.badge_text}
                        </span>
                      )}

                      {/* Image */}
                      <div
                        onClick={() => navigate(`/product/${prod.id}`)}
                        style={{
                          height: '150px',
                          background: '#FFFDF9',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <img
                          src={prod.image || (prod.images && prod.images[0]) || '/assets/product_pooja_kit.png'}
                          alt={prod.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px', transition: 'transform 0.3s ease' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      </div>

                      {/* Info */}
                      <div style={{ padding: '14px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', color: '#f59e0b' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} fill={i < Math.floor(prod.rating || 4.8) ? '#f59e0b' : 'transparent'} color="#f59e0b" />
                            ))}
                          </div>
                          <span style={{ fontSize: '11px', color: '#888', fontWeight: 500 }}>({prod.reviews || 0})</span>
                        </div>

                        <h3
                          onClick={() => navigate(`/product/${prod.id}`)}
                          style={{
                            margin: '0 0 6px 0',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#2A1C15',
                            cursor: 'pointer',
                            lineHeight: '1.35',
                            height: '36px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textTransform: 'uppercase'
                          }}
                        >
                          {translateDynamic(prod, 'name')}
                        </h3>

                        <p style={{
                          color: '#777',
                          fontSize: '11px',
                          margin: '0 0 10px 0',
                          lineHeight: '1.35',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '30px'
                        }}>
                          {translateDynamic(prod, 'desc')}
                        </p>

                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '16px', fontWeight: 700, color: '#C53018' }}>₹{prod.price}</span>
                          {prod.oldPrice && (
                            <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>₹{prod.oldPrice}</span>
                          )}
                          {discountPct && (
                            <span style={{ fontSize: '11px', color: '#2e7d32', fontWeight: 700 }}>{discountPct}% OFF</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            disabled={!hasStock}
                            onClick={() => {
                              addToCart(prod, 1);
                              showToast(language === 'te' ? `"${translateDynamic(prod, 'name')}" కార్ట్‌కు జోడించబడింది!` : `Added "${prod.name}" to cart!`);
                            }}
                            style={{
                              flex: 1,
                              padding: '8px 4px',
                              borderRadius: '8px',
                              border: '1px solid #C53018',
                              background: '#fff',
                              color: '#C53018',
                              fontWeight: 600,
                              fontSize: '11px',
                              cursor: hasStock ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap',
                              transition: 'all 0.2s',
                              opacity: hasStock ? 1 : 0.6
                            }}
                            onMouseEnter={e => {
                              if (hasStock) {
                                e.currentTarget.style.background = '#FFF5F0';
                              }
                            }}
                            onMouseLeave={e => {
                              if (hasStock) {
                                e.currentTarget.style.background = '#fff';
                              }
                            }}
                          >
                            <ShoppingCart size={13} /> {t('common.add_to_cart')}
                          </button>

                          <button
                            disabled={!hasStock}
                            onClick={() => {
                              addToCart(prod, 1);
                              navigate('/checkout');
                            }}
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#C53018',
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '11px',
                              whiteSpace: 'nowrap',
                              cursor: hasStock ? 'pointer' : 'not-allowed',
                              transition: 'all 0.2s',
                              opacity: hasStock ? 1 : 0.6
                            }}
                            onMouseEnter={e => {
                              if (hasStock) e.currentTarget.style.background = '#A32511';
                            }}
                            onMouseLeave={e => {
                              if (hasStock) e.currentTarget.style.background = '#C53018';
                            }}
                          >
                            {t('common.buy_now')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* View Full Store Button */}
            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <button
                onClick={() => navigate('/shop')}
                style={{
                  background: 'linear-gradient(135deg, #E04E15 0%, #C53018 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '30px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(197, 48, 24, 0.25)',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {language === 'te' ? 'పూర్తి షాప్‌ను అన్వేషించండి' : 'Explore Complete Store'} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#2A1C15',
            color: '#fff',
            padding: '14px 22px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}>
            <CheckCircle2 size={18} color="#4ade80" />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{toastMessage}</span>
          </div>
        )}


        {/* ---------- Telugu Calendar Section ---------- */}
        <TeluguCalendar />

        {/* ---------- Consultations Available ---------- */}
        <ConsultationsAvailable />

        {/* ---------- YouTube Videos Section (Watch Our Sacred Rituals) ---------- */}
        <HomeVideosSection />

        {/* ---------- Why Choose Gnana Sudha ---------- */}
        <div className="why-choose-modern-section" style={{ textAlign: 'center', marginBottom: '80px', marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15' }}>
            {t('home.why_choose.title')}
          </h2>
          <div className="floral-divider"><img src="/lotus.svg" alt="divider" /></div>
          
          <div className="why-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '30px', width: '100%' }}>
            <div className="why-feature-item">
              <div className="why-icon-wrap"><ShieldCheck size={24} /></div>
              <h4>{t('home.why_choose.f1_title')}</h4>
              <p>{t('home.why_choose.f1_desc')}</p>
            </div>
            
            <div className="why-feature-item">
              <div className="why-icon-wrap"><Flame size={24} /></div>
              <h4>{t('home.why_choose.f2_title')}</h4>
              <p>{t('home.why_choose.f2_desc')}</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><MapPin size={24} /></div>
              <h4>{t('home.why_choose.f3_title')}</h4>
              <p>{t('home.why_choose.f3_desc')}</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><DollarSign size={24} /></div>
              <h4>{t('home.why_choose.f4_title')}</h4>
              <p>{t('home.why_choose.f4_desc')}</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><Heart size={24} /></div>
              <h4>{t('home.why_choose.f5_title')}</h4>
              <p>{t('home.why_choose.f5_desc')}</p>
            </div>
          </div>
        </div>

        {/* ---------- How It Works ---------- */}
        <div className="how-it-works-section" style={{ textAlign: 'center', marginBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#E04E15', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '4px' }}>
            {t('home.how_it_works.badge')}
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15', margin: '4px 0 0' }}>
            {t('home.how_it_works.title')}
          </h2>
          <div className="floral-divider"><img src="/lotus.svg" alt="divider" /></div>
          
          <div className="how-timeline-modern">
            <div className="how-line"></div>
            
            <div className="how-step">
              <div className="how-icon-wrap">
                <CalendarDays size={38} />
                <div className="how-step-num">1</div>
              </div>
              <h4>{t('home.how_it_works.step1_title')}</h4>
              <p>{t('home.how_it_works.step1_desc')}</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <Clock size={38} />
                <div className="how-step-num">2</div>
              </div>
              <h4>{t('home.how_it_works.step2_title')}</h4>
              <p>{t('home.how_it_works.step2_desc')}</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <User size={38} />
                <div className="how-step-num">3</div>
              </div>
              <h4>{t('home.how_it_works.step3_title')}</h4>
              <p>{t('home.how_it_works.step3_desc')}</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <Flame size={38} />
                <div className="how-step-num">4</div>
              </div>
              <h4>{t('home.how_it_works.step4_title')}</h4>
              <p>{t('home.how_it_works.step4_desc')}</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <CheckCircle2 size={38} />
                <div className="how-step-num">5</div>
              </div>
              <h4>{t('home.how_it_works.step5_title')}</h4>
              <p>{t('home.how_it_works.step5_desc')}</p>
            </div>
          </div>
        </div>

        {/* ---------- Testimonials ---------- */}
        <div className="testimonials-section">
          <h2>{t('home.testimonials.title')}</h2>
          <div className="floral-divider" style={{ margin: '-20px auto 40px auto' }}>
            <img src="/lotus.svg" alt="divider" />
          </div>
          <div className="testimonials-marquee-container">
            <div className="testimonials-marquee-content">
              {[...testimonials, ...testimonials].map((test, idx) => (
                <div className="review-card" key={idx} style={{ minWidth: '340px', flexShrink: 0 }}>
                  <div className="review-stars">
                    <Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} />
                  </div>
                  <p className="review-text">"{test.review}"</p>
                  
                  <div className="review-header-wrap">
                    <img src="/lotus.svg" alt={test.name} className="reviewer-img" />
                    <div>
                      <div className="reviewer-name">{test.name}</div>
                      <div className="reviewer-loc">{test.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- Become a Pandit Registration Section ---------- */}
        <div className="become-pandit-section">
          <div className="section-divider-lotus">
            <span className="divider-line"></span>
            <div className="divider-lotus-wrap">
              <img src="/lotus.svg" alt="Lotus Divider" className="divider-lotus-icon" />
            </div>
            <span className="divider-line"></span>
          </div>
          <div className="pandit-reg-container">
            <div className="pandit-reg-left">
              <div className="pandit-reg-subtitle">{t('home.become_pandit.badge')}</div>
              <h2 className="pandit-reg-title">
                {t('home.become_pandit.title_prefix')}{' '}
                <span className="text-orange">{t('home.become_pandit.title_highlight')}</span>
              </h2>
              <p className="pandit-reg-desc">
                {t('home.become_pandit.desc')}
              </p>
              
              <h4 className="pandit-reg-subheading">{t('home.become_pandit.benefits_title')}</h4>
              <div className="benefits-grid">
                {(t('home.become_pandit.benefits') || [
                  "Receive Genuine Booking Requests",
                  "Dedicated Customer Support",
                  "Expand Your Reach Across Cities",
                  "Easy Booking Management",
                  "Flexible Working Schedule",
                  "More Opportunities During Festivals & Auspicious Seasons",
                  "Secure & Transparent Payments",
                  "Build Your Professional Reputation"
                ]).map((benefit, i) => (
                  <div key={i} className="benefit-item">
                    <CheckCircle2 size={18} className="text-orange check-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-primary pill-btn gradient-red register-btn" onClick={() => navigate('/register-pandit')}>
                {t('home.become_pandit.register_cta')} <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="pandit-reg-right">
              <h4 className="pandit-reg-subheading-dark">{t('home.become_pandit.who_title')}</h4>
              <p className="pandit-reg-small-text">{t('home.become_pandit.who_subtitle')}</p>
              
              <div className="specializations-grid">
                {[
                  { en: "Gruhapravesham", te: "గృహప్రవేశ క్రతువులు" },
                  { en: "Annaprasana", te: "అన్నప్రాశన సంస్కారం" },
                  { en: "Satyanarayana Vratham", te: "సత్యనారాయణ వ్రతం" },
                  { en: "Upanayanam", te: "ఉపనయన వేడుక" },
                  { en: "Wedding Ceremonies", te: "వివాహ సంస్కారాలు" },
                  { en: "Shraddha & Pitru Karmas", te: "శ్రాద్ధ & పితృ కార్యాలు" },
                  { en: "Homams & Havans", te: "దివ్య హోమాలు & హవనాలు" },
                  { en: "Temple Rituals", te: "దేవాలయ క్రతువులు" },
                  { en: "Naming Ceremonies", te: "నామకరణ మహోత్సవం" },
                  { en: "Daily Poojas", te: "నిత్య విశేష పూజలు" }
                ].map((spec, i) => (
                  <div key={i} className="spec-tag">
                    <CheckCircle2 size={16} className="text-orange" />
                    <span>{language === 'te' ? spec.te : spec.en}</span>
                  </div>
                ))}
              </div>
              
              <h4 className="pandit-reg-subheading-dark border-top-mt">{t('home.become_pandit.docs_title')}</h4>
              <div className="docs-grid">
                <div className="doc-card">
                  <FileText size={28} className="text-orange" />
                  <span>{t('home.become_pandit.doc_id')}</span>
                </div>
                <div className="doc-card">
                  <User size={28} className="text-orange" />
                  <span>{t('home.become_pandit.doc_photo')}</span>
                </div>
                <div className="doc-card">
                  <MapPin size={28} className="text-orange" />
                  <span>{t('home.become_pandit.doc_address')}</span>
                </div>
              </div>
              
              <div className="optional-docs-list">
                {[
                  { en: "Experience Details", te: "పూర్వ అనుభవ వివరాలు" },
                  { en: "Specialization Information", te: "ప్రత్యేక నైపుణ్య వివరాలు" },
                  { en: "Languages Spoken", te: "మాట్లాడే భాషలు" },
                  { en: "Optional Certification or Temple Recommendation", te: "ధృవీకరణ పత్రాలు / దేవాలయ లేఖ (ఐచ్ఛికం)" }
                ].map((doc, i) => (
                  <div key={i} className="opt-doc-item">
                    <CheckCircle2 size={16} className="text-orange" />
                    <span>{language === 'te' ? doc.te : doc.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CTA & Trust Badges ---------- */}
        <div className="home-bottom-cta">
          <div className="floral-divider" style={{ margin: '0 auto 36px auto' }}>
            <img src="/lotus.svg" alt="divider" />
          </div>
          <div className="cta-banner">
            <div className="cta-left" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <lord-icon
                  src="https://cdn.lordicon.com/tqywkdcz.json"
                  trigger="loop"
                  delay="1000"
                  colors="primary:#c53018,secondary:#e95221"
                  style={{ width: '150px', height: '150px' }}>
              </lord-icon>
            </div>
            <div className="cta-content">
              <h2>{language === 'te' ? 'మీ ఇంట దివ్యత్వము వెల్లివిరియనీయండి' : 'Let Divinity Enter Your Life'}</h2>
              <p>{language === 'te' ? 'శాస్త్రోక్త పూజలను బుక్ చేసుకోండి మరియు ఆయురారోగ్య ఐశ్వర్యాలు పొందండి.' : 'Book authentic rituals and invite blessings, peace and prosperity.'}</p>
            </div>
            <div className="cta-right" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <button className="btn-primary" onClick={() => navigate('/poojas')}>
                {language === 'te' ? 'ఇప్పుడే పూజ బుక్ చేయండి' : 'Book Your Pooja Now'} <ArrowRight size={16} />
              </button>
              <div className="cta-icon-right" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <lord-icon
                    src="https://cdn.lordicon.com/qhgmphtg.json"
                    trigger="loop"
                    delay="1000"
                    colors="primary:#c53018,secondary:#e95221"
                    style={{ width: '150px', height: '150px' }}>
                </lord-icon>
              </div>
            </div>
          </div>

          <div className="trust-badges-row">
            <div className="trust-badge">
              <Award size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>{language === 'te' ? '100% సంతృప్తి' : '100% Satisfaction'}</h5>
                <p>{language === 'te' ? 'సంపూర్ణ హామీ' : 'Guaranteed'}</p>
              </div>
            </div>
            <div className="trust-divider"></div>
            
            <div className="trust-badge">
              <FileCheck size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>{language === 'te' ? 'సురక్షిత చెల్లింపులు' : 'Secure Payments'}</h5>
                <p>{language === 'te' ? '100% భద్రమైనది' : '100% Safe & Secure'}</p>
              </div>
            </div>
            <div className="trust-divider"></div>
            
            <div className="trust-badge">
              <Headset size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>{language === 'te' ? '24/7 సహాయం' : '24/7 Support'}</h5>
                <p>{language === 'te' ? 'మేము మీకు తోడుగా ఉన్నాము' : 'We are here to help'}</p>
              </div>
            </div>
            <div className="trust-divider"></div>

            <div className="trust-badge">
              <Clock size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>{language === 'te' ? 'సమయపాలన సేవలు' : 'On-time Service'}</h5>
                <p>{language === 'te' ? 'సమయానికి హాజరు' : 'Punctual & Reliable'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
