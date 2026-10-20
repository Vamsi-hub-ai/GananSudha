import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CreditCard, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

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
              {t('footer.about_text')}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a href="http://instagram.com/gnana_2498/" target="_blank" rel="noopener noreferrer" title="Instagram: @gnana_2498" aria-label="Instagram" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.borderColor = '#E1306C'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@gnanasudha_18" target="_blank" rel="noopener noreferrer" title="YouTube: @gnanasudha_18" aria-label="YouTube" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.borderColor = '#FF0000'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="https://www.facebook.com/people/Gnana-Sudha/pfbid02hc9Tdi2zjN5ATQGEHiNaBbkvHrUEmUDMHx84JAWXzjYC8UUjbgmd5cLVxm51KEgAl/" target="_blank" rel="noopener noreferrer" title="Facebook: Gnana Sudha" aria-label="Facebook" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#1877F2'; e.currentTarget.style.borderColor = '#1877F2'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/gnanasudha-gnana-9ab9b541b/" target="_blank" rel="noopener noreferrer" title="LinkedIn: Gnana Sudha" aria-label="LinkedIn" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#0A66C2'; e.currentTarget.style.borderColor = '#0A66C2'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer" title="WhatsApp: +91 92818 67001" aria-label="WhatsApp" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FDFBF7', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.borderColor = '#25D366'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}>
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>{t('footer.quick_links')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.about_us')}</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.book_pooja')}</Link></li>
              <li><Link to="/pandit" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.hire_pandit')}</Link></li>
              <li><Link to="/register-pandit" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.register_pandit')}</Link></li>
              <li><Link to="/shop" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.sacred_shop')}</Link></li>
              <li><Link to="/videos" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.devotional_videos', 'Sacred Videos')}</Link></li>
              <li><Link to="/contact" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.contact_us')}</Link></li>
            </ul>
          </div>

          {/* Services & Products Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>{t('footer.our_offerings')}</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.homams')}</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.gruhapravesham')}</Link></li>
              <li><Link to="/poojas" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.wedding')}</Link></li>
              <li><Link to="/shop" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.pooja_kits')}</Link></li>
              <li><Link to="/shop" style={{ color: '#D4C6BD', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#F5A623'} onMouseOut={(e) => e.currentTarget.style.color = '#D4C6BD'}>{t('footer.spiritual_items')}</Link></li>
            </ul>
          </div>

          {/* Contact Information Column */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px', fontFamily: 'var(--font-serif)', letterSpacing: '0.5px' }}>{t('footer.get_in_touch')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Direct Helpline */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px' }}>
                <Phone size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    {t('footer.direct_helpline') || 'Direct Helpline'}
                  </div>
                  <a href="tel:+919281867002" style={{ color: '#FDFBF7', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>+91 92818 67002</a>
                  <div style={{ fontSize: '12px', opacity: 0.75 }}>{t('footer.timings')}</div>
                </div>
              </div>

              {/* WhatsApp Support */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px' }}>
                <MessageCircle size={18} color="#25D366" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '11px', color: '#25D366', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>
                    {t('footer.whatsapp_support') || 'WhatsApp Support'}
                  </div>
                  <a href="https://wa.me/919281867001" target="_blank" rel="noopener noreferrer" style={{ color: '#FDFBF7', textDecoration: 'none', fontWeight: '700', fontSize: '15px' }}>+91 92818 67001</a>
                  <div style={{ fontSize: '12px', opacity: 0.75 }}>Quick Assistance & Photos</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px' }}>
                <Mail size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><a href="mailto:support@gnanasudha.com" style={{ color: 'inherit', textDecoration: 'none' }}>support@gnanasudha.com</a></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#D4C6BD', fontSize: '14px', lineHeight: '1.5' }}>
                <MapPin size={18} color="#C53018" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{t('footer.address_line1')}<br/>{t('footer.address_line2')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingTop: '16px' }}>
          <div style={{ fontSize: '13px', color: '#887B75' }}>
            © {new Date().getFullYear()} Gnana Sudha. {t('footer.rights_reserved').replace(/^© \d+ Gnana Sudha\. /, '')} | <Link to="/" style={{ color: '#887B75', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#D4C6BD'} onMouseOut={(e) => e.currentTarget.style.color = '#887B75'}>{t('footer.privacy_policy')}</Link> | <Link to="/" style={{ color: '#887B75', textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.color = '#D4C6BD'} onMouseOut={(e) => e.currentTarget.style.color = '#887B75'}>{t('footer.terms')}</Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: '#887B75', fontWeight: '500' }}>{t('footer.secure_payments')}</span>
            <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: '20px' }}>
              <CreditCard size={18} color="#D4C6BD" />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
