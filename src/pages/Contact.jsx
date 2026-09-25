import React, { useState } from 'react';
import { MapPin, Phone, Mail, ArrowRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import '../App.css';

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      question: "How do I book a pooja?",
      answer: "Choose your preferred pooja, select your date and location, and we'll connect you with a verified priest."
    },
    {
      question: "Can I choose a specific pandit?",
      answer: "Yes. Subject to availability, you can request a preferred priest during the booking process."
    },
    {
      question: "Do you provide pooja materials?",
      answer: "Yes. We offer complete pooja kits and individual pooja essentials that can be delivered to your location."
    },
    {
      question: "Which cities do you serve?",
      answer: "We are continuously expanding our network of verified priests and currently serve multiple cities across India."
    }
  ];

  return (
    <div className="contact-page page-bg">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-bg">
          <div className="contact-hero-overlay"></div>
        </div>
        <div className="container-box">
          <div className="contact-hero-content">
            <div className="contact-hero-left">
              <h1 className="contact-hero-title">Contact Us</h1>
              <h2 className="contact-hero-subtitle">We'd Love to Hear From You</h2>
              <p className="contact-hero-desc">
                Whether you need help booking a pooja, finding the right pandit,
                purchasing pooja essentials, or have any questions about our services,
                the Gnana Sudha team is here to assist you.
              </p>
              <p className="contact-hero-desc">
                We're committed to providing a smooth, reliable, and spiritually fulfilling experience for every devotee.
              </p>
            </div>
            <div className="contact-hero-right">
              {/* If they provided an image it goes here. Using a placeholder or illustration. */}
              <img src="/assets/hero_illustration_1782464564369.png" alt="Lamps and flowers" className="contact-hero-img" />
            </div>
          </div>
        </div>
      </section>

      <div className="container-box">
        {/* Get in Touch Section */}
        <section className="get-in-touch-section">
          <div className="section-header center">
            <h2 className="section-title">Get in Touch</h2>
          </div>

          <div className="contact-cards-layout">
            <div className="contact-cards-left">
              {/* Address Card */}
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <MapPin size={24} color="#C53018" />
                </div>
                <h3>Office Address</h3>
                <p>Gnana Sudha<br/>Hyderabad,<br/>Telangana, India</p>
              </div>

              {/* Phone Card */}
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Phone size={24} color="#C53018" />
                </div>
                <h3>Phone</h3>
                <p>+91 92818 67001</p>
                <div className="mt-16">
                  <span className="contact-label">Available:</span>
                  <p>Monday - Sunday<br/>8:00 AM - 9:00 PM</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="contact-card">
                <div className="contact-icon-wrapper">
                  <Mail size={24} color="#C53018" />
                </div>
                <h3>Email</h3>
                <p>support@gnanasudha.com</p>
                <div className="mt-16">
                  <span className="contact-label">For partnerships:</span>
                  <p>business@gnanasudha.com</p>
                </div>
                <div className="mt-16">
                  <span className="contact-label">For pandit registration:</span>
                  <p>pandits@gnanasudha.com</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="whatsapp-card">
              <div className="whatsapp-header">
                <img src="/assets/pooja_icon_1782464580440.png" alt="WhatsApp" className="whatsapp-icon" />
                <div>
                  <h3>WhatsApp Support</h3>
                  <p className="whatsapp-sub">Need immediate assistance?<br/>Chat with our support team for:</p>
                </div>
              </div>
              <ul className="whatsapp-features">
                <li><CheckCircle2 size={16} color="#22C55E" /> Pooja Booking Assistance</li>
                <li><CheckCircle2 size={16} color="#22C55E" /> Pandit Availability</li>
                <li><CheckCircle2 size={16} color="#22C55E" /> Order Support</li>
                <li><CheckCircle2 size={16} color="#22C55E" /> Festival Bookings</li>
                <li><CheckCircle2 size={16} color="#22C55E" /> General Queries</li>
              </ul>
              <button className="whatsapp-btn" onClick={() => window.open('https://wa.me/919281867002', '_blank')}>
                Chat on WhatsApp <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Form and FAQ Section */}
        <section className="form-faq-section">
          <div className="form-faq-grid">
            {/* Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <h2 className="section-title">Send Us a Message</h2>
                <div className="decorative-line"></div>
              </div>
              <p className="form-desc">
                Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Enter your full name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" placeholder="Enter your phone number" />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" placeholder="Enter subject" />
                  </div>
                  <div className="form-group">
                    <label>Select Service</label>
                    <select>
                      <option>Choose a service</option>
                      <option>Pooja Booking</option>
                      <option>Pandit Services</option>
                      <option>Store Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea placeholder="Type your message here..." rows="4"></textarea>
                </div>

                <button type="button" className="pill-btn gradient-red full-width">
                  Send Message <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* FAQ */}
            <div className="faq-container">
              <div className="form-header">
                <h2 className="section-title">Frequently Asked Questions</h2>
                <div className="decorative-line"></div>
              </div>
              
              <div className="faq-accordion">
                {faqs.map((faq, idx) => (
                  <div className={`faq-item ${openFaq === idx ? 'open' : ''}`} key={idx} onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                    <div className="faq-icon">
                      <img src="/lotus.svg" alt="Lotus" />
                    </div>
                    <div className="faq-content">
                      <h4 className="faq-question">{faq.question}</h4>
                      {openFaq === idx && (
                        <p className="faq-answer">{faq.answer}</p>
                      )}
                    </div>
                    <ChevronDown size={20} color="#C53018" className={`faq-chevron ${openFaq === idx ? 'rotated' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Gnana Sudha */}
        <section className="contact-usps-section">
          <div className="section-header center">
            <h2 className="section-title">Why Choose Gnana Sudha?</h2>
          </div>
          
          <div className="why-choose-flex">
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Verified &<br/>Experienced<br/>Vedic Priests</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Authentic<br/>Rituals</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Transparent<br/>Pricing</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Easy Online<br/>Booking</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Secure<br/>Payments</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Dedicated<br/>Customer Support</span>
             </div>
             <div className="usp-box">
                <img src="/lotus.svg" alt="icon" style={{height:'32px'}}/>
                <span>Trusted by<br/>Thousands of<br/>Families</span>
             </div>
          </div>
        </section>

        {/* Deep Red CTA Banner */}
        <div className="cta-banner">
          <div className="cta-content">
            <h2>Let's Make Every Sacred Occasion Memorable</h2>
            <p>
              Whether you're planning a housewarming ceremony, wedding, homam, or festival pooja, 
              Gnana Sudha is here to make your spiritual journey simple, authentic, and worry-free.
            </p>
            <button className="pill-btn white-btn mt-24">
              Contact Us Today <ArrowRight size={18} />
            </button>
          </div>
          <div className="cta-right">
             <div style={{color: 'white', display: 'flex', flexDirection: 'column', gap: '16px'}}>
               <h3 style={{fontSize: '24px', fontWeight: '600'}}>Stay Connected</h3>
               <p style={{fontSize: '14px', lineHeight: '1.5', opacity: 0.9}}>Follow us for festival updates, spiritual insights, exclusive offers, and new services.</p>
               <div style={{display: 'flex', gap: '12px'}}>
                 {/* Social Icons Placeholders */}
                 <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><span style={{color:'#B4230D', fontWeight:'bold'}}>f</span></div>
                 <div style={{width:'36px', height:'36px', borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center'}}><span style={{color:'#B4230D', fontWeight:'bold'}}>in</span></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
