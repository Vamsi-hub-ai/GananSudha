import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationsAvailable from '../components/ConsultationsAvailable';
import { ChevronDown, CalendarDays, MapPin, ArrowRight, User, FileText, CheckCircle2, ShieldCheck, Home, Globe, Star, Clock, Users, Calendar, Eye, Shield, ThumbsUp, Headset, BookOpen, Sun, Flame, TrendingUp, FileEdit, Languages, IndianRupee } from 'lucide-react';
import { DataContext } from '../context/DataContext';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import '../App.css';
import '../PanditCards.css';

const heroBg = '/assets/pandit_registration_hero_1782493200962.png'; 
const iconPandit = '/assets/pandit_icon_1782464629488.png';

export default function Pandit() {
  const navigate = useNavigate();
  const { pandits, addToCart, placeOrder, poojas, homams, currentCustomer } = useContext(DataContext);
  
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [heroForm, setHeroForm] = useState({ ritual: '', date: '', location: '', language: '' });

  const handleHeroSubmit = () => {
    if (!heroForm.ritual || !heroForm.date || !heroForm.location || !heroForm.language) {
      alert("Please fill in all options before booking.");
      return;
    }
    if (!currentCustomer) {
      alert("Please login to book a pandit.");
      navigate('/login');
      return;
    }
    // Randomly assign a pandit for the quick booking if none selected
    const randomPandit = pandits[Math.floor(Math.random() * pandits.length)];
    const bookingItem = {
      id: Date.now(),
      name: `${heroForm.ritual} (${heroForm.language})`,
      type: 'pandit',
      price: 2500,
      variant: `Scheduled: ${heroForm.date} at ${heroForm.location}`,
      date: heroForm.date,
      time: '09:00', // Default morning time
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
    setHeroForm({ ritual: '', date: '', location: '', language: '' });
  };
  const [serviceSearch, setServiceSearch] = useState('');

  const handleBookPandit = (pandit) => {
    if (!currentCustomer) {
      alert("Please login to book a pandit.");
      navigate('/login');
      return;
    }
    setSelectedPandit(pandit);
    setBookingStep(1);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setSelectedService(null);
    setBookingModalOpen(true);
  };

  const handleFinalizeBooking = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) return;
    
    addToCart({
      ...selectedService,
      price: selectedService.price || 1500, // Demo price
      variant: `Scheduled: ${selectedDate} at ${selectedTimeSlot}`,
      date: selectedDate,
      time: selectedTimeSlot,
      pandit: selectedPandit
    });
    
    setBookingModalOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="pandit-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroBg} alt="Pandit performing rituals" className="hero-bg" />
        <div className="hero-overlay"></div>
        
        <div className="container-box hero-content">
          <div className="hero-text-area">
            <div className="pandit-hero-eyebrow">BOOK A VERIFIED PANDIT</div>
            <h1 className="hero-title">Connect with<br/><span>Experienced Vedic Priests</span><br/>for Every Sacred Occasion</h1>
            
            <p className="hero-desc" style={{fontWeight: '500'}}>
              Every ritual deserves to be performed with authenticity and devotion.<br/>
              At Gnana Sudha, we help you <strong>book experienced, verified, and knowledgeable Vedic priests</strong> for all types of poojas, homams, weddings, housewarming ceremonies, and ancestral rituals.
            </p>
            <p className="hero-desc">
              Whether you're celebrating a joyful occasion or performing an important spiritual ceremony, our qualified pandits ensure every ritual is conducted according to traditional Vedic scriptures with complete dedication.
            </p>
            
            <div className="hero-cta-group" style={{marginTop: '32px', display: 'flex', alignItems: 'center', gap: '24px'}}>
              <button className="btn-primary pill-btn gradient-red">
                Book a Pandit <ArrowRight size={16} />
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
              </div>
            </div>
          </div>


        </div>
      </section>

      {/* Our Expert Pandits */}
      <section className="pandit-specializations" style={{padding: '60px 0'}}>
        <div className="section-header" style={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
           <div className="decorative-icon" style={{marginBottom: '10px'}}><img src="/lotus.svg" style={{width: 24, filter: 'sepia(1) hue-rotate(340deg) saturate(5)'}} alt="Lotus" /></div>
           <h2 className="section-title" style={{color: '#2B1D14', fontSize: '32px', marginBottom: '10px'}}>Our Expert Pandits</h2>
           <p style={{color: '#4A3525', fontSize: '15px', textAlign: 'center'}}>Choose from experienced priests specializing in different Vedic rituals and traditions.</p>
        </div>
        
        <div className="container-box pandits-directory-grid">
          {pandits.filter(p => p.status === 'Approved' || !p.status).map((pandit, idx) => {
            // Mock data for new UI fields
            const events = Math.floor(Math.random() * 100) + 50;
            const desc = `Expert in ${pandit.specialization}, Poojas, and Traditional ceremonies with ${pandit.experience} of experience.`;
            const loc = 'Hyderabad, Telangana';
            const areas = 'Hyderabad, Secunderabad, Ranga Reddy, Medchal';
            
            return (
            <div className="pandit-card-v2" key={idx}>
              <div className="pandit-card-badges">
                <div className="pandit-badge-rating">
                  <Star size={12} fill="#FACC15" color="#D97706" /> {pandit.rating}
                </div>
                <div className="pandit-badge-verified">
                  <ShieldCheck size={12} color="#16A34A" /> Verified
                </div>
              </div>
              
              <div className="pandit-card-avatar">
                <img 
                  src={pandit.img || (pandit.gender === 'female' ? "/assets/female_pandit.png" : "/assets/male_pandit.png")} 
                  alt={pandit.name} 
                  onError={(e)=>{e.target.src="https://via.placeholder.com/100?text=Pandit"}} 
                />
              </div>
              
              <h4 className="pandit-card-name">{pandit.name}</h4>
              <p className="pandit-card-spec">{pandit.specialization} {pandit.specialization.includes('Specialist') || pandit.specialization.includes('Expert') ? '' : 'Specialist'}</p>
              
              <p className="pandit-card-desc">{desc}</p>
              
              <div className="pandit-card-stats">
                <div className="stat-item">
                  <div className="stat-icon"><User size={16} color="#E04E15" /></div>
                  <div className="stat-value">{pandit.experience}</div>
                  <div className="stat-label">Years Exp.</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon"><Calendar size={16} color="#E04E15" /></div>
                  <div className="stat-value">{events}+</div>
                  <div className="stat-label">Events</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <div className="stat-icon"><Star size={16} color="#E04E15" /></div>
                  <div className="stat-value">{pandit.rating}</div>
                  <div className="stat-label">({pandit.reviews} Reviews)</div>
                </div>
              </div>
              
              <div className="pandit-card-location">
                <div className="loc-row">
                  <MapPin size={14} color="#E04E15" className="loc-icon" />
                  <span>{loc}</span>
                </div>
                <div className="loc-row">
                  <Users size={14} color="#E04E15" className="loc-icon" />
                  <span><strong>Areas:</strong> {areas}</span>
                </div>
              </div>
              
              <div className="pandit-card-actions">
                <button className="btn-primary" onClick={() => handleBookPandit(pandit)} style={{flex: 1, padding: '10px', fontSize: '14px', borderRadius: '8px'}}>Book Pandit</button>
                <button className="btn-outline-action" style={{flex: 1, padding: '10px', fontSize: '14px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', border: '1px solid #ddd', background: '#fff', color: '#333', cursor: 'pointer', fontWeight: '500'}}>
                  <Eye size={16} /> View Profile
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
              <div className="trust-badge-text">Verified & Background<br/>Checked</div>
            </div>
            <div className="trust-badge-item">
              <Users size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">Experienced & Skilled<br/>Pandits</div>
            </div>
            <div className="trust-badge-item">
              <BookOpen size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">Authentic Rituals<br/>& Mantras</div>
            </div>
            <div className="trust-badge-item">
              <Headset size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">Support<br/>Available</div>
            </div>
            <div className="trust-badge-item">
              <ThumbsUp size={24} color="#E04E15" strokeWidth={1.5} />
              <div className="trust-badge-text">100% Satisfaction<br/>Guaranteed</div>
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
          <h2 className="section-title" style={{color: '#2B1D14', fontSize: '32px', marginBottom: '10px'}}>How Pandit Booking Works</h2>
        </div>
        <div className="container-box steps-container" style={{alignItems: 'stretch'}}>
          <div className="step-card">
            <div className="step-number-badge">1</div>
            <div className="step-card-icon"><CalendarDays size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">Select Your Ritual</h4>
            <p className="step-card-desc">Choose the pooja, homam, or ceremony you wish to perform.</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">2</div>
            <div className="step-card-icon"><MapPin size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">Share Event Details</h4>
            <p className="step-card-desc">Provide your preferred date, location, language, and any special requirements.</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">3</div>
            <div className="step-card-icon"><Users size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">Get Matched with a Qualified Pandit</h4>
            <p className="step-card-desc">We'll assign the most suitable priest based on your ritual, location, and language preference.</p>
          </div>
          <div className="step-card-arrow" style={{display: 'flex', alignItems: 'center'}}><ArrowRight size={20} color="#D1B098" /></div>
          
          <div className="step-card">
            <div className="step-number-badge">4</div>
            <div className="step-card-icon"><Star size={32} color="#E04E15" strokeWidth={1.5} /></div>
            <h4 className="step-card-title">Perform Your Ritual with Peace of Mind</h4>
            <p className="step-card-desc">Our priest arrives on time, conducts the ceremony authentically and guides your family throughout the ritual.</p>
          </div>
        </div>
        

      </section>

      {/* Registration Banner */}
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
      {bookingModalOpen && selectedPandit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Book {selectedPandit.name}</h2>
              <button onClick={() => setBookingModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              {bookingStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 1: Select Date & Time</h3>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '16px', fontWeight: '500' }}>Available Dates</label>
                    <AvailabilityCalendar 
                      workingDays={selectedPandit.availability?.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                      addedDates={selectedPandit.availability?.addedDates || []}
                      workHours={selectedPandit.availability?.workHours || {from: '08:00', to: '18:00'}}
                      bookings={orders.flatMap(o => o.items.filter(i => i.pandit?.id === selectedPandit.id).map(i => ({ date: i.date || o.date.split('T')[0], time: i.time, service: i })))}
                      onDateSelect={(date) => setSelectedDate(date)}
                      selectedDate={selectedDate}
                      hideBookingDetails={true}
                    />
                  </div>
                  
                  {selectedDate && (
                    <div className="form-group">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Available Time Slots for {selectedDate}</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                        {/* We could dynamically generate these based on workHours, but hardcoded standard slots are fine for now */}
                        {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map(slot => (
                          <div 
                            key={slot} 
                            onClick={() => setSelectedTimeSlot(slot)}
                            style={{ 
                              padding: '12px', 
                              border: '1px solid',
                              borderColor: selectedTimeSlot === slot ? '#E95221' : '#ddd',
                              background: selectedTimeSlot === slot ? '#fff8f6' : '#fff',
                              color: selectedTimeSlot === slot ? '#E95221' : '#333',
                              borderRadius: '8px', 
                              textAlign: 'center', 
                              cursor: 'pointer',
                              fontWeight: selectedTimeSlot === slot ? '600' : '400'
                            }}
                          >
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '12px 24px', opacity: (selectedDate && selectedTimeSlot) ? 1 : 0.5, pointerEvents: (selectedDate && selectedTimeSlot) ? 'auto' : 'none' }}
                      onClick={() => setBookingStep(2)}
                    >
                      Next Step <ArrowRight size={16} style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                    </button>
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Step 2: Select Service</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <Calendar size={20} color="#E95221" />
                    <div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Selected Schedule</div>
                      <div style={{ fontWeight: '500' }}>{selectedDate} at {selectedTimeSlot}</div>
                    </div>
                    <button onClick={() => setBookingStep(1)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#E95221', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}>Edit</button>
                  </div>
                  
                  <input 
                    type="text" 
                    placeholder="Search Poojas & Homams..." 
                    className="form-control" 
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '16px' }}
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                  />
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
                    {[...(poojas || []), ...(homams || [])].filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase())).map((service, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedService(service)}
                        style={{ 
                          padding: '16px', 
                          borderBottom: '1px solid #eee', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center',
                          background: selectedService?.name === service.name ? '#fff8f6' : '#fff'
                        }}
                      >
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          border: '2px solid',
                          borderColor: selectedService?.name === service.name ? '#E95221' : '#ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '16px'
                        }}>
                          {selectedService?.name === service.name && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#E95221' }}></div>}
                        </div>
                        <img src={service.img || '/assets/pooja_placeholder.png'} alt={service.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', marginRight: '16px' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500' }}>{service.name}</div>
                          <div style={{ fontSize: '13px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>{service.desc}</div>
                        </div>
                        <div style={{ fontWeight: '600', color: '#E95221' }}>₹{service.price || 1500}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '12px 24px', opacity: selectedService ? 1 : 0.5, pointerEvents: selectedService ? 'auto' : 'none' }}
                      onClick={handleFinalizeBooking}
                    >
                      Proceed to Payment <ArrowRight size={16} style={{ marginLeft: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="booking-section-bottom" style={{ padding: '60px 0' }}>
        <div className="container-box">
          {/* Pandit Specific Booking UI */}
          <div className="premium-booking-wrapper" style={{ padding: 0, margin: '0 auto' }}>
            
            <div className="pandit-booking-left">

              
              <h2 className="pandit-title-main">
                Find the <span className="pandit-title-highlight">Perfect Pandit</span>
              </h2>
              
              <p className="pandit-desc">
                Connect with verified and experienced pandits for poojas, rituals, homams and spiritual guidance.
              </p>
              
              <div className="pandit-badges-grid">
                <div className="pandit-left-badge">
                  <div className="pandit-left-badge-icon"><ShieldCheck size={20} /></div>
                  <div className="pandit-left-badge-text">
                    <h5>Verified Pandits</h5>
                    <p>Trusted & Experienced</p>
                  </div>
                </div>
                <div className="pandit-left-badge">
                  <div className="pandit-left-badge-icon"><CalendarDays size={20} /></div>
                  <div className="pandit-left-badge-text">
                    <h5>Easy Booking</h5>
                    <p>Quick & Hassle Free</p>
                  </div>
                </div>
                <div className="pandit-left-badge">
                  <div className="pandit-left-badge-icon"><Headset size={20} /></div>
                  <div className="pandit-left-badge-text">
                    <h5>24/7 Support</h5>
                    <p>Always here to help</p>
                  </div>
                </div>
                <div className="pandit-left-badge">
                  <div className="pandit-left-badge-icon"><IndianRupee size={20} /></div>
                  <div className="pandit-left-badge-text">
                    <h5>Transparent Pricing</h5>
                    <p>No Hidden Charges</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-booking-right">
              <h3 className="form-title" style={{ fontSize: '22px' }}>FIND THE PERFECT PANDIT</h3>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                  <img src="/lotus.svg" width="16" alt="divider" style={{ opacity: 0.5, filter: 'sepia(1) hue-rotate(340deg) saturate(5)' }}/>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><Flame size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Select Ritual</label>
                  <input type="text" placeholder="Type your ritual" value={heroForm.ritual} onChange={(e) => setHeroForm({...heroForm, ritual: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><CalendarDays size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Preferred Date</label>
                  <input type="date" value={heroForm.date} onChange={(e) => setHeroForm({...heroForm, date: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><MapPin size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Location</label>
                  <input type="text" placeholder="Enter your location" value={heroForm.location} onChange={(e) => setHeroForm({...heroForm, location: e.target.value})} />
                </div>
              </div>
              
              <div className="premium-form-group">
                <div className="premium-form-icon"><Languages size={20} color="#E04E15" /></div>
                <div className="premium-form-content">
                  <label>Language</label>
                  <input type="text" placeholder="Type language" value={heroForm.language} onChange={(e) => setHeroForm({...heroForm, language: e.target.value})} />
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 15, padding: '16px', borderRadius: '50px' }} onClick={handleHeroSubmit}>
                Find Pandit <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

