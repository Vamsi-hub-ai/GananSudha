import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  MapPin, Phone, Mail, ArrowRight, ChevronDown, 
  CheckCircle2, MessageCircle, PhoneCall, Clock, 
  Send, ShieldCheck, Flame, Sparkles, HeartHandshake, 
  User, Tag, MessageSquare, Copy, Check, ExternalLink, 
  HelpCircle, Calendar
} from 'lucide-react';
import '../App.css';

export default function Contact() {
  const { t, isTelugu } = useLanguage();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);
  const [selectedTopic, setSelectedTopic] = useState('pooja');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const topics = [
    { id: 'pooja', te: 'పూజా బుకింగ్', en: 'Pooja Booking' },
    { id: 'pandit', te: 'పండితుల సేవలు', en: 'Pandit Services' },
    { id: 'shop', te: 'పూజా సామాగ్రి', en: 'Pooja Shop' },
    { id: 'muhurtham', te: 'ముహూర్తం & జ్యోతిష్యం', en: 'Muhurtham & Astrology' },
    { id: 'other', te: 'ఇతర సందేహాలు', en: 'General Inquiries' }
  ];

  const faqs = [
    {
      qTe: "పూజను ఎలా బుక్ చేసుకోవాలి? ప్రక్రియ ఏమిటి?",
      qEn: "How do I book a pooja? What is the process?",
      aTe: "మా వెబ్‌సైట్‌లో 'పూజలు & హోమాలు' విభాగం నుండి మీకు కావలసిన పూజను ఎంచుకోండి, తేదీ, స్థలం నమోదు చేసి బుక్ చేసుకోండి. మా వేద సమన్వయకర్త మీకు కాల్ చేసి మీ గోత్ర నామాలు, అవసరమైన పూజా ద్రవ్యాలు మరియు అర్హులైన పండితులను ఖరారు చేస్తారు.",
      aEn: "Select your preferred pooja from our Poojas & Havans catalog, choose the date and location, and place your request. Our Vedic coordinator will connect with you to confirm your Gotra/Nakshatra, pooja samagri checklist, and assign a certified scholarly priest."
    },
    {
      qTe: "మేము ఒక నిర్దిష్ట వేద పండితుడిని కోరవచ్చా?",
      qEn: "Can I request a specific Vedic Pandit?",
      aTe: "ఖచ్చితంగా! 'పురోహితులు' విభాగంలో వారి విద్యార్హతలు, వేద శాఖ (యజుర్వేదం, ఋగ్వేదం మొదలైనవి), అనుభవం మరియు భక్తుల రేటింగ్‌లను పరిశీలించి మీ ఇష్టానుసారంగా పురోహితులను ఎంచుకోవచ్చు.",
      aEn: "Yes! In our Pandits section, you can review scholarly backgrounds, Vedic traditions (Yajur Veda, Rig Veda, Smartha), years of experience, and devotee reviews to request your preferred priest, subject to availability."
    },
    {
      qTe: "పూజా సామాగ్రిని మీరే సరఫరా చేస్తారా?",
      qEn: "Do you supply complete, certified pooja samagri?",
      aTe: "అవును. జ్ఞాన సుధ పూజా స్టోర్ ద్వారా 100% శాస్త్రోక్తమైన, స్వచ్ఛమైన మరియు పవిత్రమైన సంపూర్ణ పూజా కిట్లను మీ ఇంటి వద్దకే డెలివరీ చేస్తాము. లేదా మీరు స్వయంగా కూడా సమకూర్చుకోవచ్చు.",
      aEn: "Yes. We curate 100% authentic, tamper-proof sealed pooja kits containing pure havan samagri, dry fruits, unadulterated oils, and brass essentials delivered right to your doorstep."
    },
    {
      qTe: "పూజా ముహూర్తం నిర్ణయించడంలో సహాయం చేస్తారా?",
      qEn: "Can your scholars assist with finding an auspicious Muhurtham?",
      aTe: "అవును, మా వద్ద అనుభవజ్ఞులైన పంచాంగ విద్వాంసులు మరియు జ్యోతిష్య నిపుణులు ఉన్నారు. మీ గృహప్రవేశం, వివాహం, ఉపనయనం లేదా వ్యాపార ప్రారంభోత్సవానికి శుభ ముహూర్తాన్ని నిర్ణయించి సహాయం అందిస్తారు.",
      aEn: "Yes, our certified Vedic astrologers and Panchanga scholars can analyze your planetary positions to identify the most auspicious Muhurtham for housewarming, weddings, or business openings."
    },
    {
      qTe: "జ్ఞాన సుధ సేవలు ఏయే నగరాల్లో అందుబాటులో ఉన్నాయి?",
      qEn: "Which cities are covered by Gnana Sudha services?",
      aTe: "ప్రస్తుతం హైదరాబాద్, సికింద్రాబాద్, విజయవాడ, విశాఖపట్నం, తిరుపతి, బెంగళూరు మరియు తెలుగు రాష్ట్రాలలోని ప్రధాన ప్రాంతాలతో పాటు దేశవ్యాప్తంగా మా వేద పండితుల సేవలు విస్తరిస్తున్నాయి.",
      aEn: "We actively serve Hyderabad, Secunderabad, Vijayawada, Visakhapatnam, Tirupati, Bengaluru, and major metro regions across India, with pan-India delivery for pooja samagri."
    }
  ];

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <div className={`contact-page ${isTelugu ? 'lang-te' : 'lang-en'}`}>
      
      {/* 1. ROYAL VEDIC HERO CARD */}
      <section className="contact-hero-v2">
        <div className="contact-hero-card">
          <div className="contact-mandala-bg" aria-hidden="true"></div>
          
          {/* Corner Filigree Accents */}
          <div className="contact-corner-accent top-left" aria-hidden="true">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45">
              <path d="M4,4 L36,4 C20,12 12,20 4,36 Z" />
              <circle cx="8" cy="8" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,16 C16,16 16,4 28,4" />
              <path d="M4,28 C20,20 20,20 28,4" />
            </svg>
          </div>
          <div className="contact-corner-accent bottom-left" aria-hidden="true">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45">
              <path d="M4,76 L36,76 C20,68 12,60 4,44 Z" />
              <circle cx="8" cy="72" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,64 C16,64 16,76 28,76" />
            </svg>
          </div>

          <div className="contact-hero-inner-grid">
            {/* Left Content Column */}
            <div className="contact-hero-left-col">
              <div className="contact-eyebrow">
                <span className="contact-lotus-icon">🪷</span>
                <span className="contact-eyebrow-text">
                  {isTelugu ? 'దైవ సేవా సమన్వయ కేంద్రం' : 'DIVINE DEVOTEE HELPLINE'}
                </span>
                <span className="contact-lotus-icon">🪷</span>
              </div>

              <h1 className="contact-title">
                {isTelugu ? (
                  <>
                    మమ్మల్ని <br />
                    <span className="contact-title-gradient">సంప్రదించండి</span>
                  </>
                ) : (
                  <>
                    CONNECT WITH <br />
                    <span className="contact-title-gradient">GNANA SUDHA</span>
                  </>
                )}
              </h1>

              <p className="contact-subtitle">
                {isTelugu 
                  ? 'మీ ఆధ్యాత్మిక ప్రయాణంలో ప్రతి అడుగులోనూ మేము మీకు తోడుగా ఉంటాము. పూజా సంకల్పం, పండితుల ఎంపిక, ముహూర్త నిర్ణయం లేదా సేవల గురించిన ఏవైనా సందేహాల కోసం మా వేద సమన్వయ బృందం ఎల్లప్పుడూ సిద్ధంగా ఉంది.'
                  : 'We are devoted to assisting your sacred spiritual journey. Whether you need guidance on pooja rituals, verified scholars, auspicious muhurtham, or samagri delivery, our dedicated acharyas are here for you.'}
              </p>

              {/* Quick Action Badges */}
              <div className="contact-quick-pills">
                <a href="tel:+919281867002" className="contact-pill-item" title="Direct Helpline: +91 92818 67002">
                  <PhoneCall size={16} className="pill-icon text-terracotta" />
                  <span>{isTelugu ? 'హెల్ప్‌లైన్: +91 92818 67002' : 'Helpline: +91 92818 67002'}</span>
                </a>
                <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer" className="contact-pill-item highlight-whatsapp" title="WhatsApp Support: +91 92818 67001">
                  <MessageCircle size={16} className="pill-icon text-emerald" />
                  <span>{isTelugu ? 'వాట్సాప్: +91 92818 67001' : 'WhatsApp: +91 92818 67001'}</span>
                </a>
                <div className="contact-pill-item">
                  <Clock size={16} className="pill-icon text-amber" />
                  <span>{isTelugu ? '8:00 AM - 9:00 PM (రోజూ)' : '8:00 AM - 9:00 PM (Daily)'}</span>
                </div>
              </div>
            </div>

            {/* Right Visual Temple Arch Frame */}
            <div className="contact-hero-right-col">
              <div className="contact-arch-frame">
                <div className="contact-arch-inner">
                  <img 
                    src="/assets/hero_illustration_1782464564369.png" 
                    alt="Vedic Temple and Sacred Rituals" 
                    className="contact-arch-img"
                  />
                  <div className="contact-arch-vignette"></div>
                </div>
                <div className="contact-arch-floating-badge">
                  <span className="contact-badge-pulse"></span>
                  <span className="contact-badge-text">
                    {isTelugu ? '🟢 ప్రత్యక్ష సహాయం అందుబాటులో ఉంది' : '🟢 Devotee Support Live'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FOUR LUXURY CONTACT HUB CARDS */}
      <section className="contact-hubs-container">
        <div className="container-box">
          <div className="contact-section-header">
            <span className="section-eyebrow-small">{isTelugu ? 'వేగవంతమైన సహాయం' : 'DIRECT CHANNELS'}</span>
            <h2 className="section-title-royal">
              {isTelugu ? 'మా సేవా కేంద్రాలతో అనుసంధానం అవ్వండి' : 'Our Direct Connect Hubs'}
            </h2>
            <div className="contact-gold-divider"></div>
          </div>

          <div className="contact-hubs-grid">
            
            {/* HUB 1: PHONE (DIRECT HELPLINE) */}
            <div className="contact-hub-card">
              <div className="hub-top">
                <div className="hub-icon-circle icon-terracotta">
                  <PhoneCall size={24} />
                </div>
                <span className="hub-badge-live">{isTelugu ? 'ప్రత్యక్ష హెల్ప్‌లైన్' : 'Direct Helpline'}</span>
              </div>
              <h3 className="hub-title">{isTelugu ? 'ప్రత్యక్ష హెల్ప్‌లైన్' : 'Direct Helpline'}</h3>
              <p className="hub-desc">{isTelugu ? 'పూజా బుకింగ్, పండితుల లభ్యత & అత్యవసర సందేహాల కోసం' : 'For pooja booking, queries & coordinator assistance'}</p>
              <div className="hub-main-val">
                <a href="tel:+919281867002">+91 92818 67002</a>
              </div>
              <div className="hub-timing">
                <Clock size={13} />
                <span>{isTelugu ? 'సోమ - ఆదివారం (ఉదయం 8:00 - రాత్రి 9:00)' : 'Mon - Sun (8:00 AM - 9:00 PM)'}</span>
              </div>
              <a href="tel:+919281867002" className="hub-action-btn btn-call">
                <Phone size={15} />
                <span>{isTelugu ? 'హెల్ప్‌లైన్‌కు కాల్ చేయండి' : 'Call Helpline Now'}</span>
              </a>
            </div>

            {/* HUB 2: WHATSAPP */}
            <div className="contact-hub-card featured-whatsapp">
              <div className="hub-top">
                <div className="hub-icon-circle icon-emerald">
                  <MessageCircle size={24} />
                </div>
                <span className="hub-badge-fast">{isTelugu ? '~5 నిమిషాల్లో ప్రత్యుత్తరం' : '~5 min response'}</span>
              </div>
              <h3 className="hub-title">{isTelugu ? 'వాట్సాప్ తక్షణ సేవ' : 'WhatsApp Support'}</h3>
              <p className="hub-desc">{isTelugu ? 'ముహూర్తం, పండితుల లభ్యత & ఫోటోల వివరాలు' : 'Quick pandit availability, photos & pooja guidance'}</p>
              <div className="hub-main-val">
                <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer">+91 92818 67001</a>
              </div>
              <div className="hub-timing">
                <CheckCircle2 size={13} color="#16A34A" />
                <span>{isTelugu ? '24/7 సందేశాలు స్వీకరించబడతాయి' : 'Messages accepted 24/7'}</span>
              </div>
              <a 
                href="https://wa.me/919281867001" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hub-action-btn btn-whatsapp"
              >
                <MessageCircle size={15} />
                <span>{isTelugu ? 'వాట్సాప్‌లో చాట్ చేయండి' : 'Chat on WhatsApp'}</span>
              </a>
            </div>

            {/* HUB 3: EMAIL */}
            <div className="contact-hub-card">
              <div className="hub-top">
                <div className="hub-icon-circle icon-gold">
                  <Mail size={24} />
                </div>
                <span className="hub-badge-copy" onClick={() => handleCopyEmail('support@gnanasudha.com')}>
                  {copiedEmail ? (
                    <><Check size={12} /> {isTelugu ? 'కాపీ చేయబడింది' : 'Copied'}</>
                  ) : (
                    <><Copy size={12} /> {isTelugu ? 'కాపీ' : 'Copy'}</>
                  )}
                </span>
              </div>
              <h3 className="hub-title">{isTelugu ? 'ఈమెయిల్ ద్వారా సహాయం' : 'Email Assistance'}</h3>
              <p className="hub-desc">{isTelugu ? 'వివరమైన ప్రణాళికలు & భాగస్వామ్యాల కొరకు' : 'Detailed booking requests & partnerships'}</p>
              <div className="hub-email-list">
                <div className="hub-email-row">
                  <span className="email-lbl">{isTelugu ? 'భక్తుల సహాయం:' : 'Support:'}</span>
                  <a href="mailto:support@gnanasudha.com">support@gnanasudha.com</a>
                </div>
                <div className="hub-email-row">
                  <span className="email-lbl">{isTelugu ? 'పండితుల నమోదు:' : 'Pandits:'}</span>
                  <a href="mailto:pandits@gnanasudha.com">pandits@gnanasudha.com</a>
                </div>
              </div>
              <a href="mailto:support@gnanasudha.com" className="hub-action-btn btn-email">
                <Mail size={15} />
                <span>{isTelugu ? 'ఈమెయిల్ పంపండి' : 'Send an Email'}</span>
              </a>
            </div>

            {/* HUB 4: OFFICE */}
            <div className="contact-hub-card">
              <div className="hub-top">
                <div className="hub-icon-circle icon-crimson">
                  <MapPin size={24} />
                </div>
                <span className="hub-badge-loc">{isTelugu ? 'ప్రధాన కేంద్రం' : 'Headquarters'}</span>
              </div>
              <h3 className="hub-title">{isTelugu ? 'కార్యాలయ చిరునామా' : 'Central Office'}</h3>
              <p className="hub-desc">{isTelugu ? 'జ్ఞాన సుధ వేద సేవా నిలయం' : 'Gnana Sudha Vedic Foundation'}</p>
              <address className="hub-address-block">
                {isTelugu ? (
                  <>
                    జ్ఞాన సుధ, 123 ఆధ్యాత్మిక కేంద్రం,<br />
                    రోడ్ నం. 10, జూబ్లీహిల్స్,<br />
                    హైదరాబాద్, తెలంగాణ - 500033
                  </>
                ) : (
                  <>
                    Gnana Sudha, 123 Spiritual Center,<br />
                    Road No. 10, Jubilee Hills,<br />
                    Hyderabad, Telangana - 500033
                  </>
                )}
              </address>
              <a 
                href="https://maps.google.com/?q=Jubilee+Hills+Hyderabad" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hub-action-btn btn-map"
              >
                <ExternalLink size={15} />
                <span>{isTelugu ? 'మ్యాప్‌లో చూడండి' : 'View on Google Maps'}</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MAIN INTERACTIVE 2-COLUMN SECTION: FORM & ACCORDION */}
      <section className="contact-main-grid-section">
        <div className="container-box">
          <div className="contact-dual-grid">
            
            {/* LEFT: PREMIUM INQUIRY FORM */}
            <div className="contact-form-glass-card">
              <div className="form-card-header">
                <div className="form-title-wrap">
                  <img src="/lotus.svg" alt="Lotus" className="form-lotus-icon" />
                  <div>
                    <h3 className="form-heading">
                      {isTelugu ? 'మాకు సందేశం పంపండి' : 'Send Us a Sacred Inquiry'}
                    </h3>
                    <p className="form-subheading">
                      {isTelugu 
                        ? 'మీ వివరాలు నమోదు చేయండి, మా వేద సమన్వయకర్త కొద్దిసేపట్లోనే మిమ్మల్ని సంప్రదిస్తారు.' 
                        : 'Share your requirements below and our Vedic advisory team will respond promptly.'}
                    </p>
                  </div>
                </div>
              </div>

              {submitted ? (
                <div className="contact-submitted-success-card">
                  <div className="success-om-icon">🕉️</div>
                  <h4 className="success-title">
                    {isTelugu ? 'ధన్యవాదాలు! మీ సందేశం విజయవంతంగా చేరింది' : 'Thank You! Your Sacred Inquiry is Received'}
                  </h4>
                  <p className="success-desc">
                    {isTelugu 
                      ? 'మా వేద విద్వత్ బృందం మీ వివరాలను పరిశీలించి అతి త్వరలోనే ఫోన్ లేదా వాట్సాప్ ద్వారా మీకు మార్గదర్శనం అందిస్తుంది. లోకా సమస్తా సుఖినోభవంతు!' 
                      : 'Our Vedic coordinator will review your request and get in touch via phone or WhatsApp shortly. May divine blessings be upon your family!'}
                  </p>
                  <button 
                    type="button" 
                    className="contact-submit-btn pill-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    <span>{isTelugu ? 'మరొక సందేశాన్ని పంపండి' : 'Send Another Message'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="contact-actual-form">
                  {/* Category Filter Chips */}
                  <div className="form-topic-selector">
                    <label className="field-label-small">
                      {isTelugu ? 'విచారణ విభాగం ఎంచుకోండి:' : 'Select Inquiry Topic:'}
                    </label>
                    <div className="topic-chips-row">
                      {topics.map(tItem => (
                        <button
                          key={tItem.id}
                          type="button"
                          className={`topic-chip ${selectedTopic === tItem.id ? 'active' : ''}`}
                          onClick={() => setSelectedTopic(tItem.id)}
                        >
                          {isTelugu ? tItem.te : tItem.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name and Phone Row */}
                  <div className="form-two-col">
                    <div className="form-input-field">
                      <label className="input-field-label">
                        {isTelugu ? 'పూర్తి పేరు' : 'Full Name'} <span className="req">*</span>
                      </label>
                      <div className="input-wrap-icon">
                        <User size={18} className="field-icon-left" />
                        <input
                          type="text"
                          className="contact-text-input"
                          placeholder={isTelugu ? 'మీ పూర్తి పేరు' : 'Enter your full name'}
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-input-field">
                      <label className="input-field-label">
                        {isTelugu ? 'ఫోన్ నంబర్' : 'Phone Number'} <span className="req">*</span>
                      </label>
                      <div className="input-wrap-icon">
                        <div className="input-prefix-tag">🇮🇳 +91</div>
                        <input
                          type="tel"
                          className="contact-text-input has-prefix"
                          placeholder={isTelugu ? 'మొబైల్ నంబర్' : 'Mobile number'}
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email and Subject Row */}
                  <div className="form-two-col">
                    <div className="form-input-field">
                      <label className="input-field-label">
                        {isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} <span className="req">*</span>
                      </label>
                      <div className="input-wrap-icon">
                        <Mail size={18} className="field-icon-left" />
                        <input
                          type="email"
                          className="contact-text-input"
                          placeholder={isTelugu ? 'మీ ఈమెయిల్' : 'Enter email address'}
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-input-field">
                      <label className="input-field-label">
                        {isTelugu ? 'విషయం / పూజ పేరు' : 'Subject / Occasion'}
                      </label>
                      <div className="input-wrap-icon">
                        <Tag size={18} className="field-icon-left" />
                        <input
                          type="text"
                          className="contact-text-input"
                          placeholder={isTelugu ? 'ఉదా: గృహప్రవేశం ముహూర్తం' : 'e.g., Gruhapravesham pooja'}
                          value={formData.subject}
                          onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="form-input-field">
                    <label className="input-field-label">
                      {isTelugu ? 'మీ సందేశం / వివరాలు' : 'Your Message / Special Requests'} <span className="req">*</span>
                    </label>
                    <div className="input-wrap-icon textarea-wrap">
                      <MessageSquare size={18} className="field-icon-left top-align" />
                      <textarea
                        rows="4"
                        className="contact-textarea-input"
                        placeholder={isTelugu 
                          ? 'మీకు కావలసిన పూజ, తేదీ, ప్రదేశం లేదా ఏవైనా ప్రత్యేక సందేహాలను ఇక్కడ రాయండి...' 
                          : 'Please specify the rituals, preferred date, city, or any specific spiritual requirements...'}
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        required
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-submit-row">
                    <button 
                      type="submit" 
                      className="contact-submit-btn pill-btn"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span>{isTelugu ? 'సందేశం పంపబడుతోంది...' : 'Transmitting Inquiry...'}</span>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>{isTelugu ? 'సందేశాన్ని పంపండి' : 'Send Sacred Inquiry'}</span>
                          <ArrowRight size={18} className="btn-arrow-right" />
                        </>
                      )}
                    </button>
                    <div className="form-secure-tag">
                      <ShieldCheck size={16} color="#16A34A" />
                      <span>{isTelugu ? '100% గోప్యత & భద్రమైన సమాచారం' : '100% Confidential & Sacred'}</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* RIGHT: INTERACTIVE FAQ ACCORDION & DIRECT WHATSAPP CARD */}
            <div className="contact-faq-col">
              <div className="faq-glass-card">
                <div className="faq-card-header">
                  <div className="faq-title-wrap">
                    <HelpCircle size={24} className="text-terracotta" />
                    <div>
                      <h3 className="faq-heading">
                        {isTelugu ? 'తరచుగా అడిగే ప్రశ్నలు (FAQ)' : 'Frequently Asked Questions'}
                      </h3>
                      <p className="faq-subheading">
                        {isTelugu 
                          ? 'పూజా బుకింగ్ మరియు సేవలపై స్పష్టమైన సమాధానాలు' 
                          : 'Clear clarity on rituals, scheduling, and samagri'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="faq-items-list">
                  {faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div 
                        key={idx}
                        className={`contact-faq-item ${isOpen ? 'active-faq' : ''}`}
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                      >
                        <div className="faq-item-header">
                          <span className="faq-number">0{idx + 1}</span>
                          <h4 className="faq-question-text">
                            {isTelugu ? faq.qTe : faq.qEn}
                          </h4>
                          <div className={`faq-arrow-icon ${isOpen ? 'rotated' : ''}`}>
                            <ChevronDown size={18} />
                          </div>
                        </div>

                        {isOpen && (
                          <div className="faq-item-body">
                            <p>{isTelugu ? faq.aTe : faq.aEn}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Direct WhatsApp Prompt Box */}
                <div className="faq-whatsapp-prompt-box">
                  <div className="prompt-content">
                    <h4>{isTelugu ? 'ఇంకా ఏవైనా సందేహాలు ఉన్నాయా?' : 'Have More Specific Questions?'}</h4>
                    <p>
                      {isTelugu 
                        ? 'మా ఆధ్యాత్మిక సమన్వయకర్తలు వాట్సాప్‌లో అందుబాటులో ఉన్నారు. తక్షణ సమాధానం పొందండి.' 
                        : 'Our Vedic acharyas are active on WhatsApp right now for immediate answers.'}
                    </p>
                  </div>
                  <a 
                    href="https://wa.me/919281867001" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="prompt-whatsapp-btn"
                  >
                    <MessageCircle size={16} />
                    <span>{isTelugu ? 'వాట్సాప్‌లో మాట్లాడండి' : 'Chat with Acharya'}</span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OUR COMMITMENT TO DEVOTEES (WHY TRUST GNANA SUDHA) */}
      <section className="contact-pillars-section">
        <div className="container-box">
          <div className="contact-section-header">
            <span className="section-eyebrow-small">{isTelugu ? 'మా సేవా ప్రమాణాలు' : 'DIVINE STANDARDS'}</span>
            <h2 className="section-title-royal">
              {isTelugu ? 'జ్ఞాన సుధను ఎందుకు విశ్వసించాలి?' : 'Why Thousands of Devotees Trust Us'}
            </h2>
            <div className="contact-gold-divider"></div>
          </div>

          <div className="contact-pillars-grid">
            <div className="pillar-item-card">
              <div className="pillar-icon-box icon-orange">
                <ShieldCheck size={28} />
              </div>
              <h4 className="pillar-title">
                {isTelugu ? 'ధృవీకరించబడిన వేద పండితులు' : 'Vedic Certified Scholars'}
              </h4>
              <p className="pillar-desc">
                {isTelugu 
                  ? 'ప్రముఖ వేద పాఠశాలల్లో శిక్షణ పొందిన, శాస్త్రోక్త జ్ఞానం మరియు సదాచార సంపన్నులైన పురోహితులు మాత్రమే మా వేదికపై ఉంటారు.' 
                  : 'Every priest is thoroughly vetted for Gurukula lineage, Sanskrit diction, ritual discipline, and proven Vedic experience.'}
              </p>
            </div>

            <div className="pillar-item-card">
              <div className="pillar-icon-box icon-red">
                <Flame size={28} />
              </div>
              <h4 className="pillar-title">
                {isTelugu ? 'శాస్త్రోక్త పవిత్ర క్రతువులు' : 'Pure Shastric Rituals'}
              </h4>
              <p className="pillar-desc">
                {isTelugu 
                  ? 'ప్రతి మంత్రం, సంకల్పం మరియు హవన ప్రక్రియ మీ కులధర్మం మరియు కుటుంబ సాంప్రదాయానుసారం నిర్దుష్టంగా నిర్వహించబడుతుంది.' 
                  : 'All rituals strictly follow Grihya Sutras, Vedic injunctions, and regional family customs with uncompromised sanctity.'}
              </p>
            </div>

            <div className="pillar-item-card">
              <div className="pillar-icon-box icon-gold">
                <Sparkles size={28} />
              </div>
              <h4 className="pillar-title">
                {isTelugu ? 'స్వచ్ఛమైన పూజా ద్రవ్యాలు' : 'Pure Certified Samagri'}
              </h4>
              <p className="pillar-desc">
                {isTelugu 
                  ? 'హవన సమిధలు, ఆవు నెయ్యి, దర్భలు మరియు సుగంధ ద్రవ్యాలు ఏ విధమైన కల్తీ లేకుండా అత్యున్నత నాణ్యతతో అందించబడతాయి.' 
                  : 'Tamper-proof, laboratory-tested natural samagri, A2 cow ghee, and fresh sacred herbs delivered directly for your ritual.'}
              </p>
            </div>

            <div className="pillar-item-card">
              <div className="pillar-icon-box icon-emerald">
                <HeartHandshake size={28} />
              </div>
              <h4 className="pillar-title">
                {isTelugu ? 'పారదర్శకత & నిరంతర తోడ్పాటు' : 'Transparent & Dedicated'}
              </h4>
              <p className="pillar-desc">
                {isTelugu 
                  ? 'ఎటువంటి దాగివున్న ఛార్జీలు లేవు. బుకింగ్ సమయం నుండి పూజ ముగిసే వరకు ప్రత్యేక సమన్వయకర్త మీకు సహాయంగా ఉంటారు.' 
                  : 'Zero hidden fees, transparent dakshina schedules, and a dedicated coordinator by your side until complete ritual completion.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROYAL CRIMSON SACRED CTA BANNER */}
      <section className="contact-bottom-cta-section">
        <div className="container-box">
          <div className="contact-royal-banner">
            <div className="royal-banner-mandala" aria-hidden="true"></div>

            <div className="royal-banner-content">
              <div className="royal-banner-left">
                <span className="royal-tagline">
                  {isTelugu ? '🪷 సనాతన సంప్రదాయ సంకల్పం 🪷' : '🪷 SACRED SANKALPAM 🪷'}
                </span>
                <h2 className="royal-banner-title">
                  {isTelugu 
                    ? 'ప్రతి పవిత్ర సందర్భాన్ని చిరస్మరణీయంగా మలచుకోండి' 
                    : "Let's Make Every Sacred Occasion Divinely Memorable"}
                </h2>
                <p className="royal-banner-desc">
                  {isTelugu 
                    ? 'మీరు గృహప్రవేశం, వివాహం, ఆయుష్య హోమం లేదా విశేష వ్రతం ఏది తలపెట్టినా, సంపూర్ణ శాస్త్రోక్త అనుగ్రహాన్ని అందించడానికి జ్ఞాన సుధ సిద్ధంగా ఉంది.' 
                    : 'Whether planning a Gruhapravesham, wedding ritual, Ayushya homam, or seasonal vratham, experience peace of mind with authentic Vedic ceremonies.'}
                </p>
                <div className="royal-banner-actions">
                  <button 
                    type="button" 
                    className="royal-book-btn pill-btn"
                    onClick={() => navigate('/poojas')}
                  >
                    <Calendar size={18} />
                    <span>{isTelugu ? 'పూజలను పరిశీలించి బుక్ చేయండి' : 'Explore Poojas & Book'}</span>
                    <ArrowRight size={18} />
                  </button>
                  <a 
                    href="tel:+919281867002" 
                    className="royal-call-link"
                  >
                    <PhoneCall size={17} />
                    <span>{isTelugu ? 'హెల్ప్‌లైన్: +91 92818 67002' : 'Helpline: +91 92818 67002'}</span>
                  </a>
                </div>
              </div>

              <div className="royal-banner-right">
                <div className="royal-connect-box">
                  <h4 className="connect-box-title">
                    {isTelugu ? 'సామాజిక మాధ్యమాలు & అధికారిక ఛానళ్ళు' : 'Follow Our Social Channels'}
                  </h4>
                  <p className="connect-box-desc">
                    {isTelugu 
                      ? 'తాజా ఆధ్యాత్మిక సమాచారం, పండుగ విశేషాలు మరియు వీడియోల కోసం మమ్మల్ని అనుసరించండి.' 
                      : 'Connect with our official channels for Vedic wisdom, festival muhurthams, and devotional updates.'}
                  </p>
                  
                  <div className="connect-social-icons">
                    <a href="http://instagram.com/gnana_2498/" target="_blank" rel="noopener noreferrer" className="social-circle-btn instagram" title="Instagram: @gnana_2498" aria-label="Instagram">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                    </a>
                    <a href="https://www.youtube.com/@gnanasudha_18" target="_blank" rel="noopener noreferrer" className="social-circle-btn youtube" title="YouTube: @gnanasudha_18" aria-label="YouTube">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                    </a>
                    <a href="https://www.facebook.com/people/Gnana-Sudha/pfbid02hc9Tdi2zjN5ATQGEHiNaBbkvHrUEmUDMHx84JAWXzjYC8UUjbgmd5cLVxm51KEgAl/" target="_blank" rel="noopener noreferrer" className="social-circle-btn facebook" title="Facebook: Gnana Sudha" aria-label="Facebook">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                    <a href="https://www.linkedin.com/in/gnanasudha-gnana-9ab9b541b/" target="_blank" rel="noopener noreferrer" className="social-circle-btn linkedin" title="LinkedIn: Gnana Sudha" aria-label="LinkedIn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                    <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer" className="social-circle-btn whatsapp" title="WhatsApp: +91 92818 67001" aria-label="WhatsApp">
                      <MessageCircle size={20} />
                    </a>
                    <a href="tel:+919281867002" className="social-circle-btn phone" title="Helpline: +91 92818 67002" aria-label="Helpline">
                      <PhoneCall size={20} />
                    </a>
                  </div>

                  <div className="connect-social-pills">
                    <a href="http://instagram.com/gnana_2498/" target="_blank" rel="noopener noreferrer" className="connect-social-pill">
                      <span className="pill-dot instagram"></span>
                      <span className="pill-platform">Instagram</span>
                      <span className="pill-handle">@gnana_2498</span>
                    </a>
                    <a href="https://www.youtube.com/@gnanasudha_18" target="_blank" rel="noopener noreferrer" className="connect-social-pill">
                      <span className="pill-dot youtube"></span>
                      <span className="pill-platform">YouTube</span>
                      <span className="pill-handle">@gnanasudha_18</span>
                    </a>
                    <a href="https://www.facebook.com/people/Gnana-Sudha/pfbid02hc9Tdi2zjN5ATQGEHiNaBbkvHrUEmUDMHx84JAWXzjYC8UUjbgmd5cLVxm51KEgAl/" target="_blank" rel="noopener noreferrer" className="connect-social-pill">
                      <span className="pill-dot facebook"></span>
                      <span className="pill-platform">Facebook</span>
                      <span className="pill-handle">Gnana Sudha</span>
                    </a>
                    <a href="https://www.linkedin.com/in/gnanasudha-gnana-9ab9b541b/" target="_blank" rel="noopener noreferrer" className="connect-social-pill">
                      <span className="pill-dot linkedin"></span>
                      <span className="pill-platform">LinkedIn</span>
                      <span className="pill-handle">Gnana Sudha</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
