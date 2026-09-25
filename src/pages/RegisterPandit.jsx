import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, BookOpen, FileText, CheckCircle2, 
  MapPin, Clock, ShieldCheck, Award, 
  Headset, Sun, Calendar, ArrowRight
} from 'lucide-react';
import '../App.css';

export default function RegisterPandit() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    languages: [],
    experience: '',
    primarySpecialization: '',
    otherSpecializations: '',
    typesOfPoojas: [],
    homeRituals: '',
    serviceAreas: '',
    agreeTerms: false
  });
  const navigate = useNavigate();

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please confirm the information provided is true.");
      return;
    }
    alert("Application Submitted Successfully!");
    navigate('/');
  };

  return (
    <div className="pandit-reg-page">
      {/* Header Section */}
      <div className="reg-hero-section">
        <div className="reg-hero-content">
          <h1 className="reg-hero-title">
            REGISTER AS A <br/><span className="text-orange">PANDIT</span>
          </h1>
          <p className="reg-hero-desc">
            Join Gnana Sudha and connect with devotees across India. 
            Share your knowledge, preserve traditions, and grow with us.
          </p>
          <div className="reg-hero-divider">
            <Sun size={24} color="#FA8C16" />
          </div>
        </div>
        <div className="reg-hero-image-wrap" style={{ position: 'relative' }}>
          {/* Premium 3D Sacred Om Animation */}
          <div className="premium-3d-scene">
            <div className="p3d-background"></div>
            
            {/* Layer 5: Floating Particles */}
            <div className="p3d-particles">
              {[...Array(24)].map((_, i) => {
                const colorClass = `color-${(i % 3) + 1}`;
                const delay = `${(i * 0.4).toFixed(1)}s`;
                const duration = `${6 + (i % 4)}s`;
                const leftPos = `${5 + (i * 4)}%`;
                const size = `${2 + (i % 4)}px`;
                return (
                  <div 
                    key={i} 
                    className={`p3d-particle ${colorClass}`}
                    style={{ 
                      left: leftPos, 
                      '--delay': delay, 
                      '--duration': duration,
                      '--size': size
                    }}
                  ></div>
                );
              })}
            </div>

            <div className="p3d-scene-wrapper">
              {/* Layer 3: Mandala Ring */}
              <div className="p3d-layer p3d-mandala"></div>

              {/* Layer 4: Sacred Geometry */}
              <div className="p3d-layer p3d-geo-hex">
                <svg viewBox="0 0 100 100" className="hex-svg">
                  <polygon points="50,2 98,26 98,74 50,98 2,74 2,26" />
                </svg>
              </div>
              <div className="p3d-layer p3d-geo-square"></div>
              <div className="p3d-layer p3d-geo-circle"></div>

              {/* Layer 2: Sacred Halo */}
              <div className="p3d-layer p3d-halo"></div>

              {/* Layer 1: Central Om */}
              <div className="p3d-layer p3d-om-wrapper">
                <div className="p3d-om">ॐ</div>
              </div>

              {/* Layer 6: Sacred Elements */}
              <div className="p3d-layer p3d-icons-ring">
                <div className="p3d-icon-wrap iw-1"><span className="p3d-icon">🪔</span></div>
                <div className="p3d-icon-wrap iw-2"><span className="p3d-icon">🔔</span></div>
                <div className="p3d-icon-wrap iw-3"><span className="p3d-icon">🌸</span></div>
                <div className="p3d-icon-wrap iw-4"><span className="p3d-icon">📿</span></div>
                <div className="p3d-icon-wrap iw-5"><span className="p3d-icon">🔥</span></div>
                <div className="p3d-icon-wrap iw-6"><span className="p3d-icon">🛕</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="reg-progress-tracker">
        <div className="tracker-step active">
          <div className="tracker-icon"><User size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">1</span>
            <span className="step-label">Personal Details</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><BookOpen size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">2</span>
            <span className="step-label">Experience & Expertise</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><FileText size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">3</span>
            <span className="step-label">Documents</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><CheckCircle2 size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">4</span>
            <span className="step-label">Review & Submit</span>
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <form className="reg-main-form-card" onSubmit={handleSubmit}>
        <div className="reg-form-columns">
          
          {/* LEFT COLUMN: Personal Details */}
          <div className="reg-form-left">
            <div className="form-section-header">
              <img src="/lotus.svg" alt="Lotus" className="section-lotus-icon" />
              <div>
                <h3>Personal Details</h3>
                <p>Please provide your personal information</p>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name <span className="req">*</span></label>
              <input type="text" className="form-control" placeholder="Enter your full name" required />
            </div>

            <div className="form-group">
              <label>Date of Birth <span className="req">*</span></label>
              <div className="input-with-icon">
                <input type="text" className="form-control" placeholder="DD / MM / YYYY" required />
                <Calendar size={18} className="input-icon-right" />
              </div>
            </div>

            <div className="form-group">
              <label>Gender <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="gender" value="Male" /> Male</label>
                <label className="radio-label"><input type="radio" name="gender" value="Female" /> Female</label>
                <label className="radio-label"><input type="radio" name="gender" value="Other" /> Other</label>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number <span className="req">*</span></label>
              <div className="phone-input-group">
                <div className="phone-prefix">
                  <span>🇮🇳</span> +91
                </div>
                <input type="tel" className="form-control phone-input" placeholder="Enter your mobile number" required />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address <span className="req">*</span></label>
              <input type="email" className="form-control" placeholder="Enter your email address" required />
            </div>

            <div className="form-group">
              <label>Address <span className="req">*</span></label>
              <textarea className="form-control" rows="3" placeholder="Enter your complete address" required></textarea>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>City <span className="req">*</span></label>
                <input type="text" className="form-control" placeholder="Enter your city" required />
              </div>
              <div className="form-group">
                <label>State <span className="req">*</span></label>
                <select className="form-control" required>
                  <option value="">Select state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{maxWidth: '50%'}}>
              <label>PIN Code <span className="req">*</span></label>
              <input type="text" className="form-control" placeholder="Enter PIN code" required />
            </div>

            <div className="form-group">
              <label>Languages Known <span className="req">*</span></label>
              <div className="checkbox-grid">
                {['Telugu', 'Tamil', 'Kannada', 'Hindi', 'Sanskrit', 'Other'].map(lang => (
                  <label key={lang} className="checkbox-label">
                    <input type="checkbox" onChange={() => handleCheckboxChange('languages', lang)} /> {lang}
                  </label>
                ))}
              </div>
            </div>

            <div className="req-info-box">
              <Sun size={16} color="#E04E15" /> All fields marked with <span className="req">*</span> are required
            </div>
          </div>


          {/* RIGHT COLUMN: Experience & Expertise */}
          <div className="reg-form-right">
            <div className="form-section-header">
              <img src="/lotus.svg" alt="Lotus" className="section-lotus-icon" />
              <div>
                <h3>Experience & Expertise</h3>
                <p>Tell us about your priestly experience and specializations</p>
              </div>
            </div>

            <div className="form-group">
              <label>Years of Experience <span className="req">*</span></label>
              <select className="form-control" required>
                <option value="">Select experience</option>
                <option value="0-5">0-5 Years</option>
                <option value="5-10">5-10 Years</option>
                <option value="10-20">10-20 Years</option>
                <option value="20+">20+ Years</option>
              </select>
            </div>

            <div className="form-group">
              <label>Primary Specialization <span className="req">*</span></label>
              <select className="form-control" required>
                <option value="">Select specialization</option>
                <option value="Vedic Rituals">Vedic Rituals</option>
                <option value="Homams">Homams</option>
                <option value="Temple Archakatvam">Temple Archakatvam</option>
                <option value="Astrology">Astrology</option>
              </select>
            </div>

            <div className="form-group">
              <label>Other Specializations</label>
              <input type="text" className="form-control" placeholder="e.g., Homams, Temple Rituals, etc." />
            </div>

            <div className="form-group">
              <label>Types of Poojas You Perform <span className="req">*</span></label>
              <div className="checkbox-grid-2col">
                {[
                  'Gruhapravesham', 'Upanayanam', 
                  'Satyanarayana Vratham', 'Annaprasana',
                  'Vivaham (Wedding Rituals)', 'Naming Ceremony',
                  'Homams & Havan', 'Daily Poojas',
                  'Shraddha & Pitru Karmas', 'Other Poojas'
                ].map(pooja => (
                  <label key={pooja} className="checkbox-label">
                    <input type="checkbox" onChange={() => handleCheckboxChange('typesOfPoojas', pooja)} /> {pooja}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Do you perform rituals at devotee's home? <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label"><input type="radio" name="homeRituals" value="Yes" /> Yes</label>
                <label className="radio-label"><input type="radio" name="homeRituals" value="No" /> No</label>
              </div>
            </div>

            <div className="form-group">
              <label>Service Areas / Cities You Serve <span className="req">*</span></label>
              <input type="text" className="form-control" placeholder="Enter city names separated by commas" required />
            </div>

            {/* Documents Section inside Right Column */}
            <div className="form-section-header mt-32">
              <img src="/lotus.svg" alt="Lotus" className="section-lotus-icon" />
              <div>
                <h3>Upload Documents</h3>
                <p>Please upload clear copies of the documents below</p>
              </div>
            </div>

            <div className="upload-docs-grid">
              <div className="upload-box">
                <FileText size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">Aadhaar Card / Government ID <span className="req">*</span></div>
                <button type="button" className="upload-btn">Upload</button>
              </div>
              <div className="upload-box">
                <User size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">Passport Size Photo <span className="req">*</span></div>
                <button type="button" className="upload-btn">Upload</button>
              </div>
              <div className="upload-box">
                <MapPin size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">Address Proof <span className="req">*</span></div>
                <button type="button" className="upload-btn">Upload</button>
              </div>
              <div className="upload-box">
                <Award size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">Experience Proof (Optional)</div>
                <button type="button" className="upload-btn">Upload</button>
              </div>
            </div>
            <p className="upload-formats-text">Allowed formats: JPG, PNG, PDF (Max size: 5MB each)</p>

          </div>
        </div>

        {/* Why Join Gnana Sudha Section */}
        <div className="why-join-section">
          <h3>Why Join Gnana Sudha?</h3>
          <div className="why-join-grid">
            <div className="why-join-item">
              <div className="why-icon"><FileText size={20} color="#E04E15" /></div>
              <span>Receive Genuine<br/>Booking Requests</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><MapPin size={20} color="#E04E15" /></div>
              <span>Expand Your Reach<br/>Across Cities</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Clock size={20} color="#E04E15" /></div>
              <span>Flexible Working<br/>Schedule</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><ShieldCheck size={20} color="#E04E15" /></div>
              <span>Secure & Transparent<br/>Payments</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Award size={20} color="#E04E15" /></div>
              <span>Build Your Professional<br/>Reputation</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Headset size={20} color="#E04E15" /></div>
              <span>Dedicated<br/>Support</span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Sun size={20} color="#E04E15" /></div>
              <span>More Opportunities<br/>During Festivals</span>
            </div>
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div className="terms-conditions-container" style={{ marginTop: '40px', padding: '24px', background: '#fff', border: '1px solid #ddd', borderRadius: '12px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#333', marginBottom: '16px' }}>Pandit Terms & Conditions – Gnana Sudha</h3>
          
          <div className="terms-scroll-box" style={{ maxHeight: '200px', overflowY: 'auto', padding: '16px', background: '#FAFAFA', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
            <p>By registering as a Pandit on <strong>Gnana Sudha</strong>, you agree to the following Terms & Conditions.</p>
            
            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>1. Eligibility</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>You must be at least 18 years of age.</li>
              <li>You must have adequate knowledge and experience in performing Hindu Vedic rituals, poojas, homams, and related ceremonies.</li>
              <li>All information submitted during registration must be accurate and genuine.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>2. Profile Verification</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Registration is subject to document verification and approval by Gnana Sudha.</li>
              <li>Gnana Sudha reserves the right to approve, reject, suspend, or terminate any registration without prior notice if false or misleading information is provided.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>3. Professional Conduct</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Pandits must perform rituals with sincerity, discipline, and according to Vedic traditions.</li>
              <li>Appropriate traditional attire and respectful behavior are mandatory during all services.</li>
              <li>Pandits must maintain professionalism with every customer.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>4. Booking Acceptance</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Booking requests should be accepted or declined promptly.</li>
              <li>Once a booking is accepted, the Pandit is responsible for completing the service unless there is a genuine emergency.</li>
              <li>Repeated cancellations or no-shows may result in suspension or permanent removal from the platform.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>5. Platform Commission</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li><strong>Gnana Sudha charges a 15% service commission on every confirmed booking.</strong></li>
              <li>The remaining amount will be paid to the Pandit according to the platform's payout schedule.</li>
              <li>Commission rates may be revised with prior notification.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>6. No Direct Interaction for Business</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li><strong>Pandits shall not directly contact customers to solicit future bookings outside the Gnana Sudha platform.</strong></li>
              <li><strong>Sharing personal phone numbers, WhatsApp numbers, email addresses, social media accounts, or any other contact details for the purpose of bypassing the platform is strictly prohibited.</strong></li>
              <li><strong>Accepting direct bookings from customers introduced through Gnana Sudha without using the platform is not permitted.</strong></li>
              <li>Any attempt to bypass the platform or avoid the applicable service commission may result in immediate account suspension or permanent termination.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>7. Payments</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>All customer payments must be processed through the Gnana Sudha platform unless otherwise authorized.</li>
              <li>Pandits must not request additional charges from customers beyond the agreed booking amount without prior approval.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>8. Customer Ratings & Reviews</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Customers may rate and review the services provided.</li>
              <li>Consistently poor ratings, verified complaints, or misconduct may affect profile visibility or result in suspension.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>9. Confidentiality</h4>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Customer information must remain confidential.</li>
              <li>Personal details obtained through Gnana Sudha may only be used to provide the booked service and must not be shared with third parties.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>10. Code of Conduct</h4>
            <p>Pandits must not:</p>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Provide false qualifications or misleading information.</li>
              <li>Use abusive, offensive, or inappropriate language.</li>
              <li>Arrive under the influence of alcohol or drugs.</li>
              <li>Demand unauthorized payments or tips.</li>
              <li>Engage in fraudulent or unethical activities.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>11. Account Suspension</h4>
            <p>Gnana Sudha reserves the right to suspend or permanently terminate a Pandit's account for:</p>
            <ul style={{ paddingLeft: '20px', margin: '0 0 12px 0' }}>
              <li>Providing false documents or information.</li>
              <li>Repeated booking cancellations or no-shows.</li>
              <li>Customer complaints verified by the platform.</li>
              <li>Misconduct or unprofessional behavior.</li>
              <li>Violation of these Terms & Conditions.</li>
              <li>Attempting to bypass the platform or avoid the 15% service commission.</li>
            </ul>

            <h4 style={{ margin: '12px 0 8px 0', color: '#333' }}>12. Changes to Terms</h4>
            <p>Gnana Sudha may update these Terms & Conditions from time to time. Continued use of the platform after such updates constitutes acceptance of the revised terms.</p>
          </div>

          <div className="terms-declaration" style={{ background: '#FFF7F0', padding: '20px', borderRadius: '8px', border: '1px solid rgba(224, 78, 21, 0.2)' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#C53018', fontSize: '15px' }}>Declaration</h4>
            <p style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>By registering as a Pandit, I confirm that:</p>
            <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0', fontSize: '13px', color: '#444', lineHeight: '1.6' }}>
              <li>I have read and understood the <strong>Pandit Terms & Conditions of Gnana Sudha</strong>.</li>
              <li>I agree to the <strong>15% platform service commission</strong> on confirmed bookings.</li>
              <li>I will not contact or solicit customers outside the Gnana Sudha platform for direct bookings.</li>
              <li>I agree to comply with all platform policies and maintain the highest standards of professionalism and ethical conduct.</li>
            </ul>
            
            <label className="agree-checkbox-label" style={{ fontWeight: '600', color: '#333', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" required checked={formData.agreeTerms} onChange={e => setFormData({...formData, agreeTerms: e.target.checked})} style={{ width: '18px', height: '18px' }} /> 
              I have read and agree to the Pandit Terms & Conditions of Gnana Sudha.
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="form-footer-actions">
          <div className="action-buttons">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary" style={{padding: '12px 32px'}}>Review & Submit <ArrowRight size={18} style={{marginLeft: '8px'}} /></button>
          </div>
        </div>
      </form>
    </div>
  );
}
