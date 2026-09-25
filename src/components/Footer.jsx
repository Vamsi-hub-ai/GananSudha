import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#2A1C15', color: '#FDFBF7', paddingTop: '32px', paddingBottom: '16px', fontFamily: 'var(--font-sans)', borderTop: '4px solid #C53018' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Main Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          
          {/* Brand Column */}
          <div style={{ paddingRight: '20px' }}>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px', background: '#FDFBF7', padding: '8px 12px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
              <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
            </Link>
            <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#D4C6BD', marginBottom: '16px' }}>
              Your trusted spiritual partner for authentic poojas, homams, experienced pandit services, and premium pooja essentials delivered to your doorstep.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="http://instagram.com/gnana_2498/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#C53018'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.facebook.com/people/Gnana-Sudha/pfbid02hc9Tdi2zjN5ATQGEHiNaBbkvHrUEmUDMHx84JAWXzjYC8UUjbgmd5cLVxm51KEgAl/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#C53018'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.youtube.com/@gnanasudha_18" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#C53018'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/gnanasudha-gnana-9ab9b541b/" target="_blank" rel="noopener noreferrer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#C53018'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>About Us</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Book a Pooja</Link></li>
              <li><Link to="/pandit" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Hire a Pandit</Link></li>
              <li><Link to="/register-pandit" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Register as Pandit</Link></li>
              <li><Link to="/contact" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Services & Products Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>Our Offerings</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Homams & Havans</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Gruha Pravesham</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Wedding Services</Link></li>
              <li><Link to="/" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Premium Pooja Kits</Link></li>
              <li><Link to="/" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>Spiritual Items</Link></li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>Get in Touch</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px' }}>
                <Phone size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>+91 92818 67001 (Phone)<br/>+91 92818 67002 (WhatsApp)<br/><span style={{ fontSize: '12px', opacity: 0.7 }}>(Mon-Sun, 9AM to 8PM)</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px' }}>
                <Mail size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>support@gnanasudha.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px', lineHeight: '1.5' }}>
                <MapPin size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>123 Spiritual Center, Jubilee Hills,<br/>Hyderabad, Telangana, 500033</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', color: '#887B75' }}>
            © {new Date().getFullYear()} Gnana Sudha. All Rights Reserved. | <Link to="/" style={{ color: '#887B75', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#D4C6BD'} onMouseOut={(e) => e.currentTarget.style.color = '#887B75'}>Privacy Policy</Link> | <Link to="/" style={{ color: '#887B75', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#D4C6BD'} onMouseOut={(e) => e.currentTarget.style.color = '#887B75'}>Terms & Conditions</Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#887B75', fontWeight: '500' }}>Secure Payments</span>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px' }}>
              <CreditCard size={18} color="#D4C6BD" />
              {/* Replace with payment brand icons if needed */}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
