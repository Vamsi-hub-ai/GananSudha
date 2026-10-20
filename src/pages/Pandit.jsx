import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import BookingModal from '../components/BookingModal';
import PanditCoordinationBooking from '../components/PanditCoordinationBooking';
import { 
  CalendarDays, MapPin, ArrowRight, User, FileText, 
  CheckCircle2, ShieldCheck, Star, Users, Calendar, Eye, 
  ThumbsUp, Headset, BookOpen, Flame, Languages, IndianRupee,
  X, Award, Phone, MessageCircle, Clock, Sparkles
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';
import '../PanditCards.css';

export default function Pandit() {
  const navigate = useNavigate();
  const { pandits = [], poojas = [], homams = [] } = useContext(DataContext);
  const { t, translateDynamic, isTelugu, language } = useLanguage();
  
  const [bookingModalService, setBookingModalService] = useState(null);
  const [selectedProfilePandit, setSelectedProfilePandit] = useState(null);

  const parseItems = (items) => {
    if (Array.isArray(items)) return items;
    if (typeof items === 'string') {
      try { return JSON.parse(items); } catch { return []; }
    }
    return [];
  };

  const handleBookPandit = (pandit) => {
    setBookingModalService({
      name: `${isTelugu ? 'వేద పూజ & పండిత సేవ' : 'Vedic Ritual with'} ${pandit.name}`,
      title: `${isTelugu ? 'వేద పూజ & పండిత సేవ' : 'Vedic Ritual with'} ${pandit.name}`,
      type: 'pooja',
      img: pandit.img || '/assets/pandit_icon_1782464629488.png',
      specialInstructions: `Assisted coordination requested for Pandit ${pandit.name} (${pandit.specialization})`
    });
  };

  return (
    <div className={`pandit-page ${isTelugu ? 'lang-te' : ''}`}>
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
                  <span>{isTelugu ? 'గురుకుల ధృవీకృత వేద పండితులు' : 'VERIFIED GURUKULA VEDIC SCHOLARS'}</span>
                  <span>🪷</span>
                </div>
              </div>

              <h1 className="vedic-hero-title">
                {isTelugu ? (
                  <>
                    ప్రతి పవిత్ర కార్యానికి <br />
                    <span className="vedic-title-gradient">అనుభవజ్ఞులైన వేద పండితులు</span> <br />
                    మీ ముంగిట
                  </>
                ) : (
                  <>
                    CONNECT WITH <br />
                    <span className="vedic-title-gradient">EXPERIENCED SCHOLARS</span> <br />
                    FOR SACRED OCCASIONS
                  </>
                )}
              </h1>

              <p className="vedic-hero-subtitle">
                {isTelugu 
                  ? 'వేద పాఠశాలల్లో శిక్షణ పొందిన పండితులు, నిష్ఠాగరిష్ఠులు మరియు సంస్కృత మంత్రోచ్ఛారణలో నిష్ణాతులైన పురోహితులతో మీ ఇంట పూజలు, హోమాలు మరియు శుభకార్యాలు జరిపించుకోండి.'
                  : 'Every sacred ritual deserves authenticity, Vedic discipline, and pure devotion. Connect with vetted Vedic scholars from traditional Gurukulas who conduct ceremonies with flawless Sanskrit mantra diction.'}
              </p>

              {/* 4 Sacred Pillars Grid */}
              <div className="vedic-hero-pillars">
                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <BookOpen size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {isTelugu ? 'దశాబ్దాల వేదానుభవం' : '10+ Yrs Gurukul Experience'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <Languages size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {isTelugu ? 'బహుభాషా పాండిత్యం (తెలుగు, సంస్కృతం)' : 'Telugu, Sanskrit & Hindi Fluent'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <ShieldCheck size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {isTelugu ? '100% ధృవీకరించబడిన నేపథ్యం' : '100% Background Verified'}
                  </span>
                </div>

                <div className="vedic-pillar-item">
                  <div className="vedic-pillar-icon">
                    <Flame size={15} />
                  </div>
                  <span className="vedic-pillar-text">
                    {isTelugu ? 'పారదర్శక దక్షిణ విధానం' : 'Transparent Dakshina System'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="vedic-hero-actions">
                <button 
                  className="vedic-btn-primary"
                  onClick={() => {
                    const el = document.querySelector('.pandit-specializations') || document.querySelector('.pandits-directory-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>{isTelugu ? 'పండితులను ఎంచుకోండి' : 'Browse Verified Pandits'}</span>
                  <ArrowRight size={16} />
                </button>

                <a 
                  href="tel:+919281867002"
                  className="vedic-btn-secondary"
                  title="Direct Helpline"
                >
                  <Phone size={15} />
                  <span>{isTelugu ? 'హెల్ప్‌లైన్: +91 92818 67002' : 'Helpline: +91 92818 67002'}</span>
                </a>

                <a 
                  href="https://wa.me/919281867001?text=Namaste%20Gnana%20Sudha,%20I%20need%20assistance%20to%20book%20a%20Vedic%20Pandit."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vedic-btn-whatsapp"
                >
                  <MessageCircle size={15} />
                  <span>{isTelugu ? 'వాట్సాప్' : 'WhatsApp'}</span>
                </a>
              </div>

              {/* Social Proof Strip */}
              <div className="vedic-hero-trust">
                <div className="vedic-avatar-group">
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar"><User size={16} /></div>
                  <div className="vedic-trust-avatar" style={{ background: '#FEF3C7', color: '#B45309' }}>
                    <Award size={16} />
                  </div>
                </div>
                <div className="vedic-trust-info">
                  <div className="vedic-trust-rating">
                    <span>★ ★ ★ ★ ★</span>
                    <span>4.95 / 5.0</span>
                  </div>
                  <div className="vedic-trust-label">
                    {isTelugu ? '500+ రిజిస్టర్డ్ వేద విద్వాంసులు • 1,200+ శుభకార్యాలు' : '500+ Verified Purohits • 1,200+ Ceremonies'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Temple Arch Frame */}
            <div className="vedic-hero-right">
              <div className="vedic-arch-frame">
                {/* Floating Chips */}
                <div className="vedic-floating-chip top-right">
                  <div className="vedic-chip-icon gold">
                    <Star size={15} />
                  </div>
                  <div className="vedic-chip-texts">
                    <span className="vedic-chip-title">4.95 ★ Rating</span>
                    <span className="vedic-chip-sub">{isTelugu ? 'రిగ్ & యజుర్వేద పండితులు' : 'Rig & Yajur Lineage'}</span>
                  </div>
                </div>

                <div className="vedic-floating-chip bottom-left">
                  <div className="vedic-chip-icon emerald">
                    <ShieldCheck size={15} />
                  </div>
                  <div className="vedic-chip-texts">
                    <span className="vedic-chip-title">{isTelugu ? 'ధృవీకృతం' : 'Verified'}</span>
                    <span className="vedic-chip-sub">{isTelugu ? 'గురుకుల విద్యా నిష్ణాతులు' : 'Gurukula Certified'}</span>
                  </div>
                </div>

                <div className="vedic-arch-inner">
                  <img 
                    src="/assets/pandit_registration_hero_1782493200962.png" 
                    alt="Revered Vedic Scholar at Temple" 
                    className="vedic-arch-img"
                  />
                  <div className="vedic-arch-vignette"></div>
                </div>

                <div className="vedic-arch-floating-badge">
                  <span className="vedic-badge-pulse"></span>
                  <span>{isTelugu ? '🟢 పండితుల సంప్రదింపులు తక్షణమే అందుబాటులో ఉన్నాయి' : '🟢 Pandits Available for Consultation'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Expert Pandits */}
      <section className="pandit-specializations" style={{padding: '60px 0'}}>
        <div className="section-header" style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
           <div className="decorative-icon" style={{marginBottom: '10px'}}><img src="/lotus.svg" style={{width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)'}} alt="Lotus" /></div>
           <h2 className="section-title" style={{color: '#2B1D14', fontSize: '32px', marginBottom: '10px'}}>
             {isTelugu ? 'మా ప్రముఖ వేద పండితులు' : 'Our Expert Pandits'}
           </h2>
           <p style={{color: '#4A3525', fontSize: '15px', textAlign: 'center'}}>
             {isTelugu ? 'వివిధ వేద సంప్రదాయాలు, పూజలు మరియు హోమాలలో ప్రావీణ్యం గల పండితులను ఎంచుకోండి.' : 'Choose from experienced priests specializing in different Vedic rituals and traditions.'}
           </p>
        </div>
        
        <div className="container-box pandits-directory-grid">
          {pandits.filter(p => p.status === 'Approved' || !p.status).map((pandit, idx) => {
            const desc = isTelugu
              ? `${pandit.experience} అనుభవంతో ${pandit.specialization}, పూజలు మరియు సంప్రదాయ క్రతువులలో నిపుణులు.`
              : `Expert in ${pandit.specialization}, Poojas, and Traditional ceremonies with ${pandit.experience} of experience.`;
            const loc = isTelugu ? 'హైదరాబాద్, తెలంగాణ' : 'Hyderabad, Telangana';
            const areas = isTelugu ? 'హైదరాబాద్, సికింద్రాబాద్, రంగారెడ్డి, మేడ్చల్' : 'Hyderabad, Secunderabad, Ranga Reddy, Medchal';
            
            return (
            <div className="pandit-card-v2" key={`pandit-card-${pandit.id || idx}`}>
              <div className="pandit-card-badges">
                <div className="pandit-badge-rating">
                  <Star size={12} fill="#FACC15" color="#D97706" /> {pandit.rating}
                </div>
                <div className="pandit-badge-verified">
                  <ShieldCheck size={12} color="#16A34A" /> {isTelugu ? 'ధ్రువీకరించబడినవారు' : 'Verified'}
                </div>
              </div>
              
              <div className="pandit-card-avatar">
                <img 
                  src={pandit.img || (pandit.gender === 'female' ? "/assets/female_pandit.png" : "/assets/male_pandit.png")} 
                  alt={pandit.name} 
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = pandit.gender === 'female' ? "/assets/female_pandit.png" : "/assets/male_pandit.png"; 
                  }} 
                />
              </div>
              
              <h4 className="pandit-card-name">{pandit.name}</h4>
              <p className="pandit-card-spec">{pandit.specialization} {pandit.specialization.includes('Specialist') || pandit.specialization.includes('Expert') ? '' : (isTelugu ? 'నిపుణులు' : 'Specialist')}</p>
              
              <p className="pandit-card-desc">{desc}</p>
              
              <div className="pandit-card-stats">
                <div className="stat-item">
                  <div className="stat-icon"><User size={16} color="#E04E15" /></div>
                  <div className="stat-value">{pandit.experience}</div>
                  <div className="stat-label">{isTelugu ? 'అనుభవం' : 'Years Exp.'}</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon"><ShieldCheck size={16} color="#16A34A" /></div>
                  <div className="stat-value">{isTelugu ? 'ధృవీకృతం' : 'Verified'}</div>
                  <div className="stat-label">{isTelugu ? 'వేద పండితులు' : 'Scholar'}</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon"><Star size={16} color="#E04E15" /></div>
                  <div className="stat-value">{pandit.rating}</div>
                  <div className="stat-label">({pandit.reviews} {isTelugu ? 'సమీక్షలు' : 'Reviews'})</div>
                </div>
              </div>
              
              <div className="pandit-card-location">
                <div className="loc-row">
                  <MapPin size={14} color="#E04E15" className="loc-icon" />
                  <span>{loc}</span>
                </div>
                <div className="loc-row">
                  <Users size={14} color="#E04E15" className="loc-icon" />
                  <span><strong>{isTelugu ? 'ప్రాంతాలు:' : 'Areas:'}</strong> {areas}</span>
                </div>
              </div>
              
              <div className="pandit-card-actions">
                <button 
                  type="button" 
                  className="btn-view-pandit-profile"
                  onClick={() => setSelectedProfilePandit(pandit)}
                  title={isTelugu ? 'పూర్తి ప్రొఫైల్ వివరాలు' : 'View Profile'}
                >
                  <Eye size={16} /> <span>{isTelugu ? 'ప్రొఫైల్ చూడండి' : 'View Profile'}</span>
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </section>

      {/* Trust Badges Banner */}
      <section style={{padding: '0 0 60px 0'}}>
        <div className="container-box">
          <div className="trust-badges-banner">
            <div className="trust-badge-item">
              <ShieldCheck size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">
                {isTelugu ? <>పూర్తిగా పరిశీలించిన<br/>ధ్రువీకృత పండితులు</> : <>Verified & Background<br/>Checked</>}
              </div>
            </div>
            <div className="trust-badge-item">
              <Users size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">
                {isTelugu ? <>వేదాధ్యయనం చేసిన<br/>నిష్ణాతులైన పురోహితులు</> : <>Experienced & Skilled<br/>Pandits</>}
              </div>
            </div>
            <div className="trust-badge-item">
              <BookOpen size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">
                {isTelugu ? <>శాస్త్రోక్త మంత్రాలు<br/>& ప్రామాణిక పద్ధతి</> : <>Authentic Rituals<br/>& Mantras</>}
              </div>
            </div>
            <div className="trust-badge-item">
              <Headset size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">
                {isTelugu ? <>ఎల్లవేళలా భక్తుల<br/>సహాయ కేంద్రం</> : <>Support<br/>Available</>}
              </div>
            </div>
            <div className="trust-badge-item">
              <ThumbsUp size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">
                {isTelugu ? <>100% భక్తిపూర్వక<br/>ఆధ్యాత్మిక సంతృప్తి</> : <>100% Satisfaction<br/>Guaranteed</>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultations Available */}
      <ConsultationsAvailable />

      {/* How Pandit Booking Works */}
      <section className="pandit-how-it-works" style={{padding: '60px 0'}}>
        <div className="section-header" style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
          <div className="decorative-icon" style={{marginBottom: '10px'}}><img src="/lotus.svg" style={{width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)'}} alt="Lotus" /></div>
          <h2 className="section-title" style={{color: '#2B1D14', fontSize: '32px', marginBottom: '10px'}}>
            {isTelugu ? 'పండిత బుకింగ్ విధానం' : 'How Pandit Booking Works'}
          </h2>
        </div>
        <div className="container-box steps-container" style={{alignItems: 'stretch'}}>
          <div className="step-card">
            <div className="step-number-badge">1</div>
            <div className="step-card-icon"><CalendarDays size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">{isTelugu ? 'పూజ లేదా హోమం ఎంచుకోండి' : 'Select Your Ritual'}</h4>
            <p className="step-card-desc">{isTelugu ? 'మీరు నిర్వహించాలనుకుంటున్న పూజ, హోమం లేదా విశేష క్రతువును ఎంచుకోండి.' : 'Choose the pooja, homam, or ceremony you wish to perform.'}</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">2</div>
            <div className="step-card-icon"><MapPin size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">{isTelugu ? 'వివరాలను తెలియజేయండి' : 'Share Event Details'}</h4>
            <p className="step-card-desc">{isTelugu ? 'మీకు అనుకూలమైన శుభ ముహూర్తం తేదీ, సమయం, స్థలం మరియు భాషను తెలియజేయండి.' : 'Provide your preferred date, location, language, and any special requirements.'}</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">3</div>
            <div className="step-card-icon"><Users size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">{isTelugu ? 'ఉత్తమ పండితుని కేటాయింపు' : 'Get Matched with a Qualified Pandit'}</h4>
            <p className="step-card-desc">{isTelugu ? 'మీ సంప్రదాయం, భాష మరియు స్థలానికి అనుగుణంగా అర్హులైన వేద పండితుడిని కేటాయిస్తాము.' : "We'll assign the most suitable priest based on your ritual, location, and language preference."}</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">4</div>
            <div className="step-card-icon"><Star size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">{isTelugu ? 'ప్రశాంతంగా క్రతువును నిర్వహించుకోండి' : 'Perform Your Ritual with Peace of Mind'}</h4>
            <p className="step-card-desc">{isTelugu ? 'మా పురోహితులు నిర్ణీత సమయానికి చేరుకుని, సంపూర్ణ శాస్త్రోక్తంగా పూజను నిర్వహించి ఆశీర్వదిస్తారు.' : 'Our priest arrives on time, conducts the ceremony authentically and guides your family throughout the ritual.'}</p>
          </div>
        </div>
      </section>

      {/* Registration Banner */}
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
            <div className="pandit-reg-subtitle">
              {isTelugu ? 'జ్ఞాన సుధ పురోహితులుగా చేరండి' : 'BECOME A GNANA SUDHA PANDIT'}
            </div>
            <h2 className="pandit-reg-title">
              {isTelugu ? (
                <>ధ్రువీకృత <span className="text-orange">వేద పండితులుగా</span> నమోదు చేసుకోండి</>
              ) : (
                <>Register as a <span className="text-orange">Verified Pandit</span></>
              )}
            </h2>
            <p className="pandit-reg-desc">
              {isTelugu ? (
                'మీరు అనుభవజ్ఞులైన వేద పండితులా? జ్ఞాన సుధ విశ్వసనీయ వేదికలో చేరడం ద్వారా భారతదేశవ్యాప్తంగా ప్రామాణిక ఆధ్యాత్మిక సేవలను కోరుకునే భక్తుల కుటుంబాలతో అనుసంధానం అవ్వండి.'
              ) : (
                'Are you an experienced Vedic priest looking to reach more devotees? Join Gnana Sudha and become part of a trusted platform that connects qualified pandits with families seeking authentic spiritual services across India.'
              )}
            </p>
            
            <h4 className="pandit-reg-subheading">{isTelugu ? 'చేరడం వల్ల కలిగే ప్రయోజనాలు' : 'BENEFITS OF JOINING'}</h4>
            <div className="benefits-grid">
              {(isTelugu ? [
                "నిజమైన భక్తుల నుండి నేరుగా బుకింగ్‌లు",
                "ప్రత్యేక కస్టమర్ సహాయం",
                "వివిధ నగరాల్లో మీ సేవల విస్తరణ",
                "సులభమైన బుకింగ్ నిర్వహణ",
                "సౌకర్యవంతమైన పని వేళలు",
                "పండుగలు మరియు శుభ సమయాల్లో విశేష అవకాశాలు",
                "సురక్షితమైన మరియు పారదర్శక చెల్లింపులు",
                "మీ గౌరవప్రదమైన వృత్తిపరమైన గుర్తింపు"
              ] : [
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
              {isTelugu ? 'పురోహితులుగా నమోదు అవ్వండి' : 'Register as a Pandit'} <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="pandit-reg-right">
            <h4 className="pandit-reg-subheading-dark">{isTelugu ? 'ఎవరు నమోదు చేసుకోవచ్చు?' : 'WHO CAN REGISTER?'}</h4>
            <p className="pandit-reg-small-text">{isTelugu ? 'కింది క్రతువులలో అనుభవం ఉన్న పురోహితులను స్వాగతిస్తున్నాము:' : 'We welcome experienced priests specializing in:'}</p>
            
            <div className="specializations-grid">
              {(isTelugu ? [
                "గృహప్రవేశం", "అన్నప్రాశన", 
                "సత్యనారాయణ వ్రతం", "ఉపనయనం",
                "వివాహ మహోత్సవాలు", "శ్రాద్ధ & పితృ కర్మలు",
                "హోమాలు & హవనాలు", "ఆలయ విశేష పూజలు",
                "నామకరణం", "నిత్య పూజలు"
              ] : [
                "Gruhapravesham", "Annaprasana", 
                "Satyanarayana Vratham", "Upanayanam",
                "Wedding Ceremonies", "Shraddha & Pitru Karmas",
                "Homams & Havans", "Temple Rituals",
                "Naming Ceremonies", "Daily Poojas"
              ]).map((spec, i) => (
                <div key={i} className="spec-tag">
                  <CheckCircle2 size={16} className="text-orange" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
            
            <h4 className="pandit-reg-subheading-dark border-top-mt">{isTelugu ? 'అవసరమైన పత్రాలు' : 'DOCUMENTS REQUIRED'}</h4>
            <div className="docs-grid">
              <div className="doc-card">
                <FileText size={28} className="text-orange" />
                <span>{isTelugu ? 'ఆధార్ కార్డ్ / గుర్తింపు పత్రం' : 'Aadhaar Card / Government ID'}</span>
              </div>
              <div className="doc-card">
                <User size={28} className="text-orange" />
                <span>{isTelugu ? 'పాస్‌పోర్ట్ సైజు ఫోటో' : 'Passport-size Photograph'}</span>
              </div>
              <div className="doc-card">
                <MapPin size={28} className="text-orange" />
                <span>{isTelugu ? 'చిరునామా ధ్రువీకరణ పత్రం' : 'Address Proof'}</span>
              </div>
            </div>
            
            <div className="optional-docs-list">
              {(isTelugu ? [
                "అనుభవ వివరాలు",
                "ప్రత్యేక ప్రావీణ్య సమాచారం",
                "తెలిసిన భాషలు",
                "వేద పాఠశాల లేదా ఆలయ సిఫార్సు (ఐచ్ఛికం)"
              ] : [
                "Experience Details",
                "Specialization Information",
                "Languages Spoken",
                "Optional Certification or Temple Recommendation"
              ]).map((doc, i) => (
                <div key={i} className="opt-doc-item">
                  <CheckCircle2 size={16} className="text-orange" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Pandit Coordination Booking Section — New UI */}
      <div className="container-box" style={{ padding: '20px 0 60px' }}>
        <PanditCoordinationBooking />
      </div>

      {/* Customer Booking Modal */}
      {bookingModalService && (
        <BookingModal
          selectedService={bookingModalService}
          onClose={() => setBookingModalService(null)}
        />
      )}

      {/* Pandit Profile Details Modal */}
      {selectedProfilePandit && (
        <div className="pandit-modal-backdrop" onClick={() => setSelectedProfilePandit(null)}>
          <div className="pandit-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="pandit-modal-close-btn"
              onClick={() => setSelectedProfilePandit(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="pandit-modal-header">
              <div className="pandit-modal-avatar">
                <img
                  src={selectedProfilePandit.img || (selectedProfilePandit.gender === 'female' ? "/assets/female_pandit.png" : "/assets/male_pandit.png")}
                  alt={selectedProfilePandit.name}
                  onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = selectedProfilePandit.gender === 'female' ? "/assets/female_pandit.png" : "/assets/male_pandit.png"; 
                  }}
                />
              </div>
              <h3 className="pandit-modal-name">{selectedProfilePandit.name}</h3>
              <p className="pandit-modal-spec">
                {selectedProfilePandit.specialization} {selectedProfilePandit.specialization?.includes('Specialist') || selectedProfilePandit.specialization?.includes('Expert') ? '' : (isTelugu ? 'నిపుణులు' : 'Specialist')}
              </p>
              <div className="pandit-modal-pills">
                <div className="pandit-badge-rating">
                  <Star size={13} fill="#FACC15" color="#D97706" /> {selectedProfilePandit.rating || '4.9'}
                </div>
                <div className="pandit-badge-verified">
                  <ShieldCheck size={13} color="#16A34A" /> {isTelugu ? 'ధ్రువీకృత వేద పండితులు' : 'Verified Vedic Scholar'}
                </div>
              </div>
            </div>

            <div className="pandit-modal-body">
              <div className="pandit-modal-bio">
                {isTelugu
                  ? `${selectedProfilePandit.name} గారు ${selectedProfilePandit.experience || '15+ సంవత్సరాలు'} పైగా సమగ్ర వేద సంప్రదాయం, శాస్త్రోక్త పూజలు, హోమాలు మరియు కుటుంబ శుభకార్యాలను భక్తిశ్రద్ధలతో నడిపిస్తున్న గౌరవనీయ పురోహితులు.`
                  : `${selectedProfilePandit.name} is a revered, senior Vedic priest with over ${selectedProfilePandit.experience || '15+ years'} of sacred service, specializing in traditional Hindu scriptures, homams, and sacred ceremonies.`}
              </div>

              <div className="pandit-modal-info-grid">
                <div className="pandit-modal-info-box">
                  <div className="icon-wrap"><User size={16} /></div>
                  <div>
                    <div className="info-label">{isTelugu ? 'అనుభవం' : 'Experience'}</div>
                    <div className="info-val">{selectedProfilePandit.experience || '15+ Years'}</div>
                  </div>
                </div>

                <div className="pandit-modal-info-box">
                  <div className="icon-wrap"><Languages size={16} /></div>
                  <div>
                    <div className="info-label">{isTelugu ? 'మాట్లాడే భాషలు' : 'Languages'}</div>
                    <div className="info-val">{isTelugu ? 'తెలుగు, సంస్కృతం, హిందీ' : 'Telugu, Sanskrit, Hindi'}</div>
                  </div>
                </div>

                <div className="pandit-modal-info-box">
                  <div className="icon-wrap"><MapPin size={16} /></div>
                  <div>
                    <div className="info-label">{isTelugu ? 'ప్రాంతం' : 'Service Location'}</div>
                    <div className="info-val">{isTelugu ? 'హైదరాబాద్ & పరిసరాలు' : 'Hyderabad & Surrounding'}</div>
                  </div>
                </div>

                <div className="pandit-modal-info-box">
                  <div className="icon-wrap"><Award size={16} /></div>
                  <div>
                    <div className="info-label">{isTelugu ? 'ధ్రువీకరణ' : 'Certification'}</div>
                    <div className="info-val">{isTelugu ? 'వేద పాఠశాల సర్టిఫైడ్' : 'Veda Pathashala Certified'}</div>
                  </div>
                </div>
              </div>

              <div className="pandit-modal-section-title">
                <Flame size={15} color="#C53018" />
                <span>{isTelugu ? 'నిర్వహించే ముఖ్యమైన క్రతువులు' : 'Rituals Handled'}</span>
              </div>
              <div className="pandit-modal-tags">
                {(isTelugu ? [
                  'గణపతి హోమం',
                  'సత్యనారాయణ వ్రతం',
                  'గృహప్రవేశం',
                  'రుద్రాభిషేకం',
                  'నవగ్రహ శాంతి',
                  'వివాహ మహోత్సవం',
                  'నామకరణం & అన్నప్రాశన'
                ] : [
                  'Ganapathi Homam',
                  'Satyanarayana Vratham',
                  'Gruhapravesham',
                  'Rudrabhishekam',
                  'Navagraha Shanti',
                  'Vedic Vivaham',
                  'Namakaranam & Annaprasana'
                ]).map((ritual, rIdx) => (
                  <span key={rIdx} className="pandit-modal-tag">
                    <CheckCircle2 size={12} /> {ritual}
                  </span>
                ))}
              </div>

              <div className="pandit-modal-footer-note">
                {isTelugu ? (
                  <>మా పండితుల సమన్వయ సేవల ద్వారా పూజ తేదీ మరియు వేదికను నిశ్చయించుకోవడానికి క్రింది <strong>పండిత సమన్వయ ఫారమ్</strong>ను ఉపయోగించండి.</>
                ) : (
                  <>To coordinate and schedule ceremonies with our certified priests, please use our <strong>Pandit Coordination & Booking service</strong> below.</>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

