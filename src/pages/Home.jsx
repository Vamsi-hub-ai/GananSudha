import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import TeluguCalendar from '../components/TeluguCalendar';
import BannerSlider from '../components/BannerSlider';
import {
  Search, Heart, ShoppingCart, ChevronDown, CalendarDays, MapPin, Globe,
  ArrowRight, Star, Plus, ShieldCheck, CheckCircle2, DollarSign, MousePointerClick, Truck,
  ChevronLeft, ChevronRight, Phone, Mail, MessageSquare, Flame, CreditCard, User, Award, Clock, Tag, Headset, FileCheck, FileText,
  Users, Shield, X, Home as HomeIcon
} from 'lucide-react';
import '../App.css';
import './Hero.css';

// Using the assets previously generated for the application
const heroBg = '/assets/hero_illustration_1782464564369.png';
const iconPandit = '/assets/pandit_icon_1782464629488.png';
const iconPooja = '/assets/pooja_icon_1782464580440.png';
const iconHomam = '/assets/homam_icon_1782464611688.png';
const iconStore = '/assets/store_icon_1782464646688.png';

// Static data replaced by DataContext

const testimonials = [
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

function Home() {
  const navigate = useNavigate();
  const { addToCart, currentCustomer, poojas, products, pandits, homams } = useContext(DataContext);
  
  const [heroPooja, setHeroPooja] = useState('Satyanarayana Pooja');
  const [heroDate, setHeroDate] = useState('');
  const [heroLocation, setHeroLocation] = useState('Hyderabad, Telangana');
  const [heroLanguage, setHeroLanguage] = useState('Telugu');



  const handleHeroBookNow = () => {
    if (!currentCustomer) {
      alert("Please login to book a ritual.");
      navigate('/login');
      return;
    }
    if (!heroDate) {
      alert("Please select a date.");
      return;
    }
    addToCart({
      id: `hero-booking-${Date.now()}`,
      name: heroPooja,
      desc: `Location: ${heroLocation} | Language: ${heroLanguage} | Date: ${heroDate}`,
      price: 2500
    });
    navigate('/checkout');
  };

  const handleQuickBook = (item) => {
    if (!currentCustomer) {
      alert("Please login to purchase items.");
      navigate('/login');
      return;
    }
    addToCart({
      ...item,
      id: item.name + Date.now(),
      price: parseInt(item.price.replace(/[^0-9]/g, ''))
    });
    navigate('/checkout');
  };

  const handleQuickAddCart = (item) => {
    if (!currentCustomer) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart({
      ...item,
      id: item.name + Date.now(),
      price: parseInt(item.price.replace(/[^0-9]/g, ''))
    });
    alert(`${item.name} added to cart!`);
  };

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
              TRUSTED. AUTHENTIC. DIVINE.
            </div>
            
            <h1 className="hero-title-new">
              Experience <br />
              <span>Divine Rituals</span><br /> 
              with Trusted <br />
              Vedic Pandits
            </h1>

            <p className="hero-desc-new">
              Book authentic poojas, homams & rituals for all occasions with experienced pandits. We bring devotion to your doorstep.
            </p>

            <div className="hero-features-boxes">
              <div className="hero-feature-box">
                <div className="hero-feature-box-icon"><ShieldCheck size={22} /></div>
                <div className="hero-feature-box-text">
                  <h4>Verified Pandits</h4>
                  <p>100% Background Checked</p>
                </div>
              </div>
              <div className="hero-feature-box">
                <div className="hero-feature-box-icon"><Users size={22} /></div>
                <div className="hero-feature-box-text">
                  <h4>Customized Poojas</h4>
                  <p>As per Your Needs</p>
                </div>
              </div>
            </div>

            <div className="hero-cta-new">
              <button className="btn-primary-new" onClick={() => navigate('/pandit')}>
                <img src="/assets/calendar_icon.svg" alt="calendar" style={{ width: '18px', filter: 'brightness(0) invert(1)' }} onError={(e) => e.target.style.display = 'none'} />
                Book a Pandit <ArrowRight size={18} />
              </button>
              <button className="btn-secondary-new" onClick={() => navigate('/poojas')}>
                <img src="/lotus.svg" alt="lotus" style={{ width: '18px', filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }} />
                Explore Poojas <ArrowRight size={18} />
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
              <h4 className="feature-title">Book Pandit</h4>
              <p className="feature-desc">Hire verified pandits</p>
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
              <h4 className="feature-title">Poojas</h4>
              <p className="feature-desc">10+ types of poojas</p>
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
              <h4 className="feature-title">Homams</h4>
              <p className="feature-desc">Sacred homams</p>
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
              <h4 className="feature-title">Pooja Store</h4>
              <p className="feature-desc">Premium pooja items</p>
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
          <span className="section-subtitle" style={{ color: '#666', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Our Services</span>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15', marginTop: '8px', marginBottom: '0' }}>Services & Products</h2>
          <div className="floral-divider" style={{ margin: '12px auto' }}><img src="/lotus.svg" alt="divider" style={{ width: 24, opacity: 0.5 }} /></div>
          <p style={{ color: '#666', fontSize: '14px', maxWidth: '600px', margin: '0 auto' }}>Explore our extensive range of spiritual services and premium products.</p>
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
            <h4>Pooja Booking</h4>
            <p>Book verified priests for all your rituals and ceremonies at your convenience.</p>
            <button className="btn-outline-orange">Explore Poojas</button>
          </div>

          <div className="modern-service-card" onClick={() => navigate('/pandit')} style={{ cursor: 'pointer' }}>
            <div className="service-icon-ring">
              <lord-icon
                  src="https://cdn.lordicon.com/dxjqoygy.json"
                  trigger="hover"
                  colors="primary:#e55d14,secondary:#2a1c15"
                  style={{ width: '64px', height: '64px' }}>
              </lord-icon>
            </div>
            <h4>Pandit Booking</h4>
            <p>Find and book experienced Pandits for specific homams and sacred pujas.</p>
            <button className="btn-outline-orange">Book Pandit</button>
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
            <h4>Pooja Shop</h4>
            <p>Buy premium quality pooja samagri and spiritual products online.</p>
            <button className="btn-outline-orange">Shop Now</button>
          </div>

        </div>


        {/* ---------- Telugu Calendar Section ---------- */}
        <TeluguCalendar />

        {/* ---------- Consultations Available ---------- */}
        <ConsultationsAvailable />

        {/* ---------- Why Choose Gnana Sudha ---------- */}
        <div className="why-choose-modern-section" style={{ textAlign: 'center', marginBottom: '80px', marginTop: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15' }}>Why Choose Gnana Sudha?</h2>
          <div className="floral-divider" style={{ margin: '12px auto 40px auto' }}><img src="/lotus.svg" alt="divider" style={{ width: 24, opacity: 0.5 }} /></div>
          
          <div className="why-features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '30px' }}>
            <div className="why-feature-item">
              <div className="why-icon-wrap"><ShieldCheck size={24} /></div>
              <h4>Verified & Experienced Pandits</h4>
              <p>Background verified and highly experienced.</p>
            </div>
            
            <div className="why-feature-item">
              <div className="why-icon-wrap"><Flame size={24} /></div>
              <h4>Customised Rituals</h4>
              <p>Poojas performed as per your tradition & needs.</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><MapPin size={24} /></div>
              <h4>Doorstep Pooja Service</h4>
              <p>Pandits arrive on time at your location.</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><DollarSign size={24} /></div>
              <h4>Transparent Pricing</h4>
              <p>No hidden charges, 100% transparency.</p>
            </div>

            <div className="why-feature-item">
              <div className="why-icon-wrap"><Heart size={24} /></div>
              <h4>Devotion & Authenticity</h4>
              <p>Rituals performed with complete devotion.</p>
            </div>
          </div>
        </div>

        {/* ---------- How It Works ---------- */}
        <div className="how-it-works-section" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15' }}>How It Works</h2>
          <div className="floral-divider" style={{ margin: '12px auto 50px auto' }}><img src="/lotus.svg" alt="divider" style={{ width: 24, opacity: 0.5 }} /></div>
          
          <div className="how-timeline-modern">
            <div className="how-line"></div>
            
            <div className="how-step">
              <div className="how-icon-wrap">
                <CalendarDays size={28} />
                <div className="how-step-num">1</div>
              </div>
              <h4>Choose Your Pooja</h4>
              <p>Select the pooja or ritual you want to perform.</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <Clock size={28} />
                <div className="how-step-num">2</div>
              </div>
              <h4>Select Date & Time</h4>
              <p>Pick your preferred date, time and location.</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <User size={28} />
                <div className="how-step-num">3</div>
              </div>
              <h4>Choose Your Pandit</h4>
              <p>We assign the best suited pandit for you.</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <Flame size={28} />
                <div className="how-step-num">4</div>
              </div>
              <h4>Pooja at Your Place</h4>
              <p>Pandit performs the ritual with devotion.</p>
            </div>

            <div className="how-step">
              <div className="how-icon-wrap">
                <CheckCircle2 size={28} />
                <div className="how-step-num">5</div>
              </div>
              <h4>Receive Blessings</h4>
              <p>Get prasad and blessings for you & your family.</p>
            </div>
          </div>
        </div>

        {/* ---------- Testimonials ---------- */}
        <div className="testimonials-section">
          <h2>What Our Devotees Say</h2>
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

        {/* ---------- Become a Pandit Section ---------- */}
        <div className="become-pandit-section">
          <div className="pandit-reg-container">
            <div className="pandit-reg-left">
              <div className="pandit-reg-subtitle">BECOME A GNANA SUDHA PANDIT</div>
              <h2 className="pandit-reg-title">
                Register as a <span className="text-orange">Verified Pandit</span>
              </h2>
              <div className="pandit-reg-divider">
                <img src="/lotus.svg" alt="Lotus Divider" className="lotus-divider" style={{ filter: 'invert(52%) sepia(87%) saturate(3015%) hue-rotate(349deg) brightness(101%) contrast(97%)' }} />
              </div>
              <p className="pandit-reg-desc">
                Are you an experienced Vedic priest looking to reach more devotees? 
                Join Gnana Sudha and become part of a trusted platform that connects 
                qualified pandits with families seeking authentic spiritual services 
                across India.
              </p>
              
              <h4 className="pandit-reg-subheading">BENEFITS OF JOINING</h4>
              <div className="benefits-grid">
                {[
                  "Receive Genuine Booking Requests",
                  "Dedicated Customer Support",
                  "Expand Your Reach Across Cities",
                  "Easy Booking Management",
                  "Flexible Working Schedule",
                  "More Opportunities During Festivals & Auspicious Seasons",
                  "Secure & Transparent Payments",
                  "Build Your Professional Reputation"
                ].map((benefit, i) => (
                  <div key={i} className="benefit-item">
                    <CheckCircle2 size={18} className="text-orange check-icon" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-primary pill-btn gradient-red register-btn" onClick={() => navigate('/register-pandit')}>
                Register as a Pandit <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="pandit-reg-right">
              <h4 className="pandit-reg-subheading-dark">WHO CAN REGISTER?</h4>
              <p className="pandit-reg-small-text">We welcome experienced priests specializing in:</p>
              
              <div className="specializations-grid">
                {[
                  "Gruhapravesham", "Annaprasana", 
                  "Satyanarayana Vratham", "Upanayanam",
                  "Wedding Ceremonies", "Shraddha & Pitru Karmas",
                  "Homams & Havans", "Temple Rituals",
                  "Naming Ceremonies", "Daily Poojas"
                ].map((spec, i) => (
                  <div key={i} className="spec-tag">
                    <CheckCircle2 size={16} className="text-orange" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
              
              <h4 className="pandit-reg-subheading-dark border-top-mt">DOCUMENTS REQUIRED</h4>
              <div className="docs-grid">
                <div className="doc-card">
                  <FileText size={28} className="text-orange" />
                  <span>Aadhaar Card / Government ID</span>
                </div>
                <div className="doc-card">
                  <User size={28} className="text-orange" />
                  <span>Passport-size Photograph</span>
                </div>
                <div className="doc-card">
                  <MapPin size={28} className="text-orange" />
                  <span>Address Proof</span>
                </div>
              </div>
              
              <div className="optional-docs-list">
                {[
                  "Experience Details",
                  "Specialization Information",
                  "Languages Spoken",
                  "Optional Certification or Temple Recommendation"
                ].map((doc, i) => (
                  <div key={i} className="opt-doc-item">
                    <CheckCircle2 size={16} className="text-orange" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CTA & Trust Badges ---------- */}
        <div className="home-bottom-cta">
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
              <h2>Let Divinity Enter Your Life</h2>
              <p>Book authentic rituals and invite blessings, peace and prosperity.</p>
            </div>
            <div className="cta-right" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <button className="btn-primary" onClick={() => navigate('/poojas')}>
                Book Your Pooja Now <ArrowRight size={16} />
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
              <img src="/lotus.svg" alt="Lotus" className="trust-icon" style={{ filter: 'invert(52%) sepia(87%) saturate(3015%) hue-rotate(349deg) brightness(101%) contrast(97%)' }} />
              <div>
                <h5>100% Satisfaction</h5>
                <p>Guaranteed</p>
              </div>
            </div>
            <div className="trust-divider"></div>
            
            <div className="trust-badge">
              <FileCheck size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>Secure Payments</h5>
                <p>100% Safe & Secure</p>
              </div>
            </div>
            <div className="trust-divider"></div>
            
            <div className="trust-badge">
              <Headset size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>24/7 Support</h5>
                <p>We are here to help</p>
              </div>
            </div>
            <div className="trust-divider"></div>

            <div className="trust-badge">
              <Clock size={28} className="trust-icon" color="#D46B2C" />
              <div>
                <h5>On-time Service</h5>
                <p>Punctual & Reliable</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
