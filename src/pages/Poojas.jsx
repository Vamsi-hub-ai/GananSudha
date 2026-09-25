import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import { ChevronDown, CalendarDays, MapPin, ArrowRight, User, FileText, CheckCircle2, Calendar, ShieldCheck, Home, Globe, PackageOpen, Flame, Languages, Shield, Headset, IndianRupee } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import '../App.css';

// Reusing assets from Home
const heroBg = '/assets/hero_bg.png';
const iconPooja = '/assets/pooja_icon_1782464580440.png';
const iconHomam = '/assets/homam_icon_1782464611688.png';

export default function Poojas() {
  const { poojas, homams, addToCart, placeOrder, currentCustomer, pandits } = useContext(DataContext);
  const navigate = useNavigate();
  const topPoojas = poojas;
  const topHomams = homams;

  const [heroForm, setHeroForm] = useState({ pooja: '', date: '', location: '', language: '' });

  const handleHeroSubmit = () => {
    if (!heroForm.pooja || !heroForm.date || !heroForm.location || !heroForm.language) {
      alert("Please fill in all options before booking.");
      return;
    }
    if (!currentCustomer) {
      alert("Please login to book services.");
      navigate('/login');
      return;
    }
    const randomPandit = pandits && pandits.length > 0 ? pandits[Math.floor(Math.random() * pandits.length)] : null;
    const bookingItem = {
      id: Date.now(),
      name: `${heroForm.pooja} (${heroForm.language})`,
      type: 'pooja',
      price: 2500,
      variant: `Scheduled: ${heroForm.date} at ${heroForm.location}`,
      date: heroForm.date,
      time: '09:00',
      location: heroForm.location,
      pandit: randomPandit
    };

    placeOrder({
      shippingDetails: { fullName: currentCustomer.name || 'Guest', address: heroForm.location, phone: currentCustomer.phone || '' },
      paymentMethod: 'Direct Booking',
      totalAmount: 2500,
      items: [bookingItem]
    });

    alert("Booking confirmed! You can view it in the Admin dashboard.");
    setHeroForm({ pooja: '', date: '', location: '', language: '' });
  };

  const handleBookService = (service) => {
    if (!currentCustomer) {
      alert("Please login to book services.");
      navigate('/login');
      return;
    }
    addToCart({
      ...service,
      price: service.price || 1500 // Demo price for Poojas/Homams
    });
    alert(`${service.name} added to cart!`);
  };

  const handleBuyNow = (service) => {
    if (!currentCustomer) {
      alert("Please login to book services.");
      navigate('/login');
      return;
    }
    addToCart({
      ...service,
      price: service.price || 1500
    });
    navigate('/checkout');
  };


  return (
    <div className="poojas-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroBg} alt="Priest performing homam" className="hero-bg" />
        <div className="hero-overlay"></div>
        
        <div className="container-box hero-content">
          <div className="hero-text-area">
            <h1 className="hero-title">Book Your<br/><span>Pooja</span></h1>
            <h3 style={{color: '#C53018', fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Celebrate Every Sacred Occasion with Authentic Vedic Rituals</h3>
            <p className="hero-desc">Whether you're moving into a new home, celebrating a milestone, or seeking divine blessings, Gnana Sudha makes booking traditional poojas simple, reliable and stress-free.</p>
            <p className="hero-desc">We connect you with experienced and verified Vedic priests who perform every ritual according to authentic scriptures, ensuring a spiritually enriching experience for you and your family.</p>
            
            <div className="hero-cta-group" style={{marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px'}}>
              <button className="btn-primary pill-btn gradient-red">
                Book Now <ArrowRight size={16} />
              </button>
              
              <div className="pandit-hero-stats">
                 <div className="avatars-group">
                   <img src="/lotus.svg" alt="User" className="avatar" />
                   <img src="/lotus.svg" alt="User" className="avatar" />
                   <img src="/lotus.svg" alt="User" className="avatar" />
                   <img src="/lotus.svg" alt="User" className="avatar" />
                 </div>
                 <div className="stat-text-box">
                   <div className="stat-number">15,000+</div>
                   <div className="stat-text">Happy Families</div>
                 </div>
                 <div className="stat-stars" style={{color: '#FBBF24', fontSize: '14px'}}>
                   ★ ★ ★ ★ ★
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
            <h2 className="section-title">TOP 10 POOJA SERVICES</h2>
            <p className="section-subtitle" style={{ fontSize: '13px', color: '#6C5D53', marginTop: '8px' }}>Sacred rituals performed by experienced priests for every important occasion in your life.</p>
          </div>
          
          <div className="services-10-grid theme-pooja">
            {topPoojas.map((service, idx) => (
              <div className="top-service-card" key={`pooja-${idx}`}>
                <div className="card-badge">{idx + 1}</div>
                <img src={service.img} alt={service.name} className="top-service-img" />
                <h4 className="top-service-title">{service.name}</h4>
                <p className="top-service-desc">{service.desc}</p>
                <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', padding: '12px', gap: '8px', alignItems: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2B1D14', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {(service.discountPrice || 900) ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#888', fontWeight: 'normal', fontSize: '12px' }}>₹{service.price || 1000}</span>
                        <span style={{ color: '#E04E15' }}>₹{service.discountPrice || 900}</span>
                      </>
                    ) : (
                      <span>₹{service.price || 1000}</span>
                    )}
                  </div>
                  <button className="top-service-btn" onClick={() => handleBookService(service)} style={{ width: '100%', cursor: 'pointer', border: 'none', background: '#E95221', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>
                    Book Now
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
              <h2 className="section-title">TOP 10 HOMAM SERVICES</h2>
              <p className="section-subtitle" style={{ fontSize: '13px', color: '#6C5D53', marginTop: '8px' }}>Powerful fire rituals for protection, prosperity, health, and spiritual well-being.</p>
            </div>
            
            <div className="services-10-grid theme-homam">
              {topHomams.map((service, idx) => (
                <div className="top-service-card" key={`homam-${idx}`}>
                  <div className="card-badge">{idx + 1}</div>
                  <img src={service.img} alt={service.name} className="top-service-img" />
                  <h4 className="top-service-title">{service.name}</h4>
                  <p className="top-service-desc">{service.desc}</p>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', padding: '12px', gap: '8px', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2B1D14', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {(service.discountPrice || 900) ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: '#888', fontWeight: 'normal', fontSize: '12px' }}>₹{service.price || 1000}</span>
                          <span style={{ color: '#E04E15' }}>₹{service.discountPrice || 900}</span>
                        </>
                      ) : (
                        <span>₹{service.price || 1000}</span>
                      )}
                    </div>
                    <button className="top-service-btn" onClick={() => handleBookService(service)} style={{ width: '100%', cursor: 'pointer', border: 'none', background: '#E95221', color: 'white', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>
                      Book Now
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
      <section className="poojas-usp-section" style={{padding: '60px 0'}}>
        <div className="section-header center">
           <div className="decorative-icon" style={{marginBottom: '10px'}}><img src="/lotus.svg" style={{width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)'}} alt="Lotus" /></div>
           <h2 className="section-title" style={{color: '#2B1D14', fontSize: '32px', marginBottom: '10px'}}>Why Choose Gnana Sudha?</h2>
           <div className="decorative-icon"><img src="/lotus.svg" style={{width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)'}} alt="Lotus" /></div>
        </div>
        <div className="container-box why-choose-flex">
          <div className="usp-box">
             <User size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Verified &<br/>Experienced<br/>Vedic Priests</span>
          </div>
          <div className="usp-box">
             <FileText size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Authentic<br/>Rituals as Per<br/>Scriptures</span>
          </div>
          <div className="usp-box">
             <CheckCircle2 size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Easy<br/>Online<br/>Booking</span>
          </div>
          <div className="usp-box">
             <CalendarDays size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Flexible Date<br/>& Time<br/>Selection</span>
          </div>
          <div className="usp-box">
             <ShieldCheck size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Transparent<br/>Pricing</span>
          </div>
          <div className="usp-box">
             <Home size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Doorstep<br/>Pooja<br/>Services</span>
          </div>
          <div className="usp-box">
             <Globe size={36} strokeWidth={1.5} color="#1E3A8A" style={{marginBottom: '10px'}} />
             <span>Support in<br/>Multiple<br/>Languages</span>
          </div>
          <div className="usp-box">
             <PackageOpen size={36} strokeWidth={1.5} color="#E04E15" style={{marginBottom: '10px'}} />
             <span>Pooja Samagri<br/>Available on<br/>Request</span>
          </div>
        </div>
        

      </section>

      {/* How It Works */}
      <section className="how-it-works-section">
        <div className="section-header center">
          <div className="decorative-icon">🕉️</div>
          <h2 className="section-title">How It Works</h2>
        </div>
        <div className="container-box steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-icon"><CalendarDays size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">Choose Your Pooja</h4>
            <p className="step-desc">Browse our collection of poojas and select the ritual that best suits your occasion.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>
          
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-icon"><MapPin size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">Select Date & Location</h4>
            <p className="step-desc">Pick your preferred date, time, and location for the ceremony.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>
          
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-icon"><User size={40} color="#C53018" strokeWidth={1} /></div>
            <h4 className="step-title">Get Matched with a Priest</h4>
            <p className="step-desc">We assign a qualified priest based on your language preference, location, and ritual requirements.</p>
          </div>
          <div className="step-arrow"><ArrowRight size={24} color="#D1B098" /></div>
          
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-icon"><div style={{fontSize:40}}>🪔</div></div>
            <h4 className="step-title">Relax & Receive Blessings</h4>
            <p className="step-desc">Our priest arrives on time, performs the ceremony with complete devotion, and guides you through.</p>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="poojas-banner-section">
        <div className="container-box">
          <div className="poojas-banner">
            <div className="banner-content">
              <h2>Experience Spirituality with Confidence</h2>
              <p>At Gnana Sudha, every ritual is performed with authenticity, care, and devotion. From intimate family ceremonies to grand celebrations, we're committed to making every spiritual journey meaningful and memorable.</p>
              <button className="btn-secondary" style={{color: '#C53018', marginTop: 20, background: 'white', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold', border: 'none', cursor: 'pointer'}} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Book Now</button>
            </div>
          </div>
        </div>
      </section>
      <section className="booking-section-bottom" style={{ padding: '60px 0' }}>
        <div className="container-box">
          {/* Premium Booking Form */}
          <div className="premium-booking-wrapper" style={{ margin: '0 auto' }}>
            <div className="premium-booking-left">
              <div className="sacred-emblem">
                <h4>Sacred rituals</h4>
                <p>Divine blessings</p>
              </div>
              <p className="booking-desc">
                Book a pooja with verified pandits and receive divine blessings for you and your family.
              </p>
            </div>

            <div className="premium-booking-right">
              <h3 className="form-title">BOOK YOUR POOJA</h3>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><Flame size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Select Pooja</label>
                  <input type="text" placeholder="Type your pooja" value={heroForm.pooja} onChange={(e) => setHeroForm({...heroForm, pooja: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><CalendarDays size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Select Date</label>
                  <input type="date" value={heroForm.date} onChange={(e) => setHeroForm({...heroForm, date: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><MapPin size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Select Location</label>
                  <input type="text" placeholder="Enter your location" value={heroForm.location} onChange={(e) => setHeroForm({...heroForm, location: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><Languages size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Preferred Language</label>
                  <input type="text" placeholder="Type language" value={heroForm.language} onChange={(e) => setHeroForm({...heroForm, language: e.target.value})} />
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10, padding: '16px' }} onClick={handleHeroSubmit}>
                Continue Booking <ArrowRight size={16} />
              </button>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
