import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, BookOpen, FileText, CheckCircle2, 
  MapPin, Clock, ShieldCheck, Award, 
  Headset, Sun, Calendar, ArrowRight, AlertCircle,
  Users, Flame, TrendingUp, UserPlus
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import '../App.css';

export default function RegisterPandit() {
  const { registerPandit } = useContext(DataContext);
  const { isTelugu } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
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
    homeRituals: 'Yes',
    serviceAreas: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!formData.name || !formData.phone || !formData.email) {
      setSubmitError(
        isTelugu 
          ? "దయచేసి మీ పేరు, ఫోన్ నంబర్ మరియు ఈమెయిల్ చిరునామా నమోదు చేయండి." 
          : "Please fill in your name, phone number, and email address."
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.email.trim(),
        phone: formData.phone.trim(),
        specialization: formData.primarySpecialization || (formData.typesOfPoojas.length > 0 ? formData.typesOfPoojas.join(', ') : 'Vedic Rituals'),
        gender: formData.gender || 'Male',
        experience: formData.experience || '2+ Years',
        city: formData.city || 'Hyderabad',
        address: `${formData.address || ''}, ${formData.city || ''}, ${formData.state || ''} - ${formData.pincode || ''}`.trim(),
        password: 'Pandit@' + Math.floor(100 + Math.random() * 900),
        status: 'Pending'
      };

      const res = await registerPandit(payload);
      if (res.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/pandit');
        }, 2500);
      } else {
        setSubmitError(
          res.message || (isTelugu ? "రిజిస్ట్రేషన్ విఫలమైంది. దయచేసి వివరాలను సరిచూసి మళ్లీ ప్రయత్నించండి." : "Registration failed. Please check your details and try again.")
        );
      }
    } catch (err) {
      console.error('Registration error:', err);
      setSubmitError(err.message || (isTelugu ? "ఊహించని లోపం ఏర్పడింది. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి." : "An unexpected error occurred during registration."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`pandit-reg-page ${isTelugu ? 'lang-te' : 'lang-en'}`}>
      {/* Header Section — Premium Vedic Pandit Registration Hero UI */}
      <section className="pandit-reg-hero-v2">
        <div className="pandit-reg-hero-card">
          {/* Subtle Golden Mandala & Corner Ornaments */}
          <div className="prh-mandala-bg" aria-hidden="true"></div>
          <div className="prh-corner-accent top-left" aria-hidden="true">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45">
              <path d="M4,4 L36,4 C20,12 12,20 4,36 Z" />
              <circle cx="8" cy="8" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,16 C16,16 16,4 28,4" />
              <path d="M4,28 C20,20 20,20 28,4" />
            </svg>
          </div>
          <div className="prh-corner-accent bottom-left" aria-hidden="true">
            <svg viewBox="0 0 80 80" width="60" height="60" fill="none" stroke="#D4AF37" strokeWidth="1.2" opacity="0.45">
              <path d="M4,76 L36,76 C20,68 12,60 4,44 Z" />
              <circle cx="8" cy="72" r="3" fill="#D4AF37" opacity="0.6" />
              <path d="M4,64 C16,64 16,76 28,76" />
            </svg>
          </div>

          <div className="prh-inner-grid">
            {/* Left Column: Typography, Feature Badges & CTA */}
            <div className="prh-content-col">
              <div className="prh-eyebrow">
                <span className="prh-lotus-icon">🪷</span>
                <span className="prh-eyebrow-text">
                  {isTelugu ? 'మా పవిత్ర వేద సంప్రదాయంలో భాగస్వాములు కండి' : 'JOIN OUR SACRED TRADITION'}
                </span>
                <span className="prh-lotus-icon">🪷</span>
              </div>

              <h1 className="prh-title">
                {isTelugu ? (
                  <>
                    వేద పండితులుగా <br />
                    <span className="prh-title-gradient">రిజిస్టర్ చేసుకోండి</span>
                  </>
                ) : (
                  <>
                    REGISTER AS A <br />
                    <span className="prh-title-gradient">PANDIT</span>
                  </>
                )}
              </h1>

              <p className="prh-subtitle">
                {isTelugu 
                  ? 'జ్ఞాన సుధతో చేరి భారతదేశం అంతటా ఉన్న వేలాది మంది భక్తులతో అనుసంధానం అవ్వండి. మీ వేద జ్ఞానాన్ని పంచుకోండి, సనాతన సంప్రదాయాలను కాపాడండి మరియు మాతో కలిసి ఉన్నతిని సాధించండి.'
                  : 'Join Gnana Sudha and connect with devotees across India. Share your Vedic knowledge, preserve timeless traditions, and grow with us.'}
              </p>

              {/* 4 Feature Badges Grid */}
              <div className="prh-features-grid">
                <div className="prh-feature-item">
                  <div className="prh-feature-icon-circle icon-orange">
                    <Users size={20} strokeWidth={2.2} />
                  </div>
                  <span className="prh-feature-label">
                    {isTelugu ? 'దేశవ్యాప్తంగా భక్తులతో అనుసంధానం' : 'Reach Devotees Across India'}
                  </span>
                </div>

                <div className="prh-feature-item">
                  <div className="prh-feature-icon-circle icon-gold">
                    <BookOpen size={20} strokeWidth={2.2} />
                  </div>
                  <span className="prh-feature-label">
                    {isTelugu ? 'మీ వేద జ్ఞానాన్ని పంచుకోండి' : 'Share Your Knowledge'}
                  </span>
                </div>

                <div className="prh-feature-item">
                  <div className="prh-feature-icon-circle icon-red">
                    <Flame size={20} strokeWidth={2.2} />
                  </div>
                  <span className="prh-feature-label">
                    {isTelugu ? 'సనాతన సంప్రదాయ పరిరక్షణ' : 'Preserve Traditions'}
                  </span>
                </div>

                <div className="prh-feature-item">
                  <div className="prh-feature-icon-circle icon-saffron">
                    <TrendingUp size={20} strokeWidth={2.2} />
                  </div>
                  <span className="prh-feature-label">
                    {isTelugu ? 'జ్ఞాన సుధతో కలిసి అభివృద్ధి' : 'Grow with Gnana Sudha'}
                  </span>
                </div>
              </div>

              {/* Interactive Register Now CTA Button */}
              <div className="prh-cta-wrap">
                <button
                  type="button"
                  className="prh-register-cta-btn"
                  onClick={() => {
                    const el = document.querySelector('.reg-main-form-card') || document.querySelector('.reg-progress-tracker');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <UserPlus size={19} className="prh-btn-icon" />
                  <span>{isTelugu ? 'ఇప్పుడే రిజిస్టర్ చేసుకోండి' : 'Register Now'}</span>
                  <ArrowRight size={18} className="prh-btn-arrow" />
                </button>
                <div className="prh-trust-tagline">
                  <ShieldCheck size={16} color="#16A34A" />
                  <span>
                    {isTelugu 
                      ? '100% శాస్త్రోక్తం & పారదర్శక పారితోషిక చెల్లింపులు' 
                      : '100% Shastra Verified & Transparent Payouts'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Arched Temple Window with Vedic Priest */}
            <div className="prh-visual-col">
              <div className="prh-arch-frame">
                <div className="prh-arch-inner">
                  <img
                    src="/assets/pandit_scripture_reading.png"
                    alt="Vedic Pandit performing sacred rituals and writing scripture"
                    className="prh-pandit-img"
                  />
                  <div className="prh-arch-overlay-vignette"></div>
                </div>
                <div className="prh-arch-floating-badge">
                  <span className="prh-badge-pulse"></span>
                  <span className="prh-badge-text">
                    {isTelugu ? '🕉️ వేద ఆచార్యులు' : '🕉️ Vedic Acharyas'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracker */}
      <div className="reg-progress-tracker">
        <div className="tracker-step active">
          <div className="tracker-icon"><User size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">1</span>
            <span className="step-label">{isTelugu ? 'వ్యక్తిగత వివరాలు' : 'Personal Details'}</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><BookOpen size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">2</span>
            <span className="step-label">{isTelugu ? 'అనుభవం & నైపుణ్యం' : 'Experience & Expertise'}</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><FileText size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">3</span>
            <span className="step-label">{isTelugu ? 'ధృవీకరణ పత్రాలు' : 'Documents'}</span>
          </div>
        </div>
        <div className="tracker-divider"></div>
        <div className="tracker-step">
          <div className="tracker-icon"><CheckCircle2 size={20} /></div>
          <div className="tracker-text">
            <span className="step-num">4</span>
            <span className="step-label">{isTelugu ? 'సమీక్ష & సమర్పణ' : 'Review & Submit'}</span>
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
                <h3>{isTelugu ? 'వ్యక్తిగత వివరాలు' : 'Personal Details'}</h3>
                <p>{isTelugu ? 'దయచేసి మీ ప్రాథమిక వ్యక్తిగత సమాచారాన్ని నమోదు చేయండి' : 'Please provide your personal information'}</p>
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'పూర్తి పేరు' : 'Full Name'} <span className="req">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'మీ పూర్తి పేరు నమోదు చేయండి' : 'Enter your full name'} 
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'పుట్టిన తేదీ' : 'Date of Birth'} <span className="req">*</span></label>
              <div className="input-with-icon">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={isTelugu ? 'తేదీ / నెల / సంవత్సరం' : 'DD / MM / YYYY'} 
                  value={formData.dob}
                  onChange={e => handleInputChange('dob', e.target.value)}
                  required 
                />
                <Calendar size={18} className="input-icon-right" />
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'లింగం' : 'Gender'} <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Male" 
                    checked={formData.gender === 'Male'}
                    onChange={() => handleInputChange('gender', 'Male')}
                  /> {isTelugu ? 'పురుషుడు' : 'Male'}
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Female" 
                    checked={formData.gender === 'Female'}
                    onChange={() => handleInputChange('gender', 'Female')}
                  /> {isTelugu ? 'స్త్రీ' : 'Female'}
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="Other" 
                    checked={formData.gender === 'Other'}
                    onChange={() => handleInputChange('gender', 'Other')}
                  /> {isTelugu ? 'ఇతర' : 'Other'}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'ఫోన్ నంబర్' : 'Phone Number'} <span className="req">*</span></label>
              <div className="phone-input-group">
                <div className="phone-prefix">
                  <span>🇮🇳</span> +91
                </div>
                <input 
                  type="tel" 
                  className="form-control phone-input" 
                  placeholder={isTelugu ? 'మీ మొబైల్ నంబర్ నమోదు చేయండి' : 'Enter your mobile number'} 
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} <span className="req">*</span></label>
              <input 
                type="email" 
                className="form-control" 
                placeholder={isTelugu ? 'మీ ఈమెయిల్ చిరునామా నమోదు చేయండి' : 'Enter your email address'} 
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'పూర్తి చిరునామా' : 'Address'} <span className="req">*</span></label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder={isTelugu ? 'ఇంటి నంబర్, వీధి, ప్రాంతం మొదలైనవి' : 'Enter your complete address'} 
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>{isTelugu ? 'నగరం / పట్టణం' : 'City'} <span className="req">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder={isTelugu ? 'మీ నగరం పేరు' : 'Enter your city'} 
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>{isTelugu ? 'రాష్ట్రం' : 'State'} <span className="req">*</span></label>
                <select 
                  className="form-control" 
                  value={formData.state}
                  onChange={e => handleInputChange('state', e.target.value)}
                  required
                >
                  <option value="">{isTelugu ? 'రాష్ట్రాన్ని ఎంచుకోండి' : 'Select state'}</option>
                  <option value="Andhra Pradesh">{isTelugu ? 'ఆంధ్రప్రదేశ్' : 'Andhra Pradesh'}</option>
                  <option value="Telangana">{isTelugu ? 'తెలంగాణ' : 'Telangana'}</option>
                  <option value="Karnataka">{isTelugu ? 'కర్ణాటక' : 'Karnataka'}</option>
                  <option value="Tamil Nadu">{isTelugu ? 'తమిళనాడు' : 'Tamil Nadu'}</option>
                  <option value="Maharashtra">{isTelugu ? 'మహారాష్ట్ర' : 'Maharashtra'}</option>
                  <option value="Other">{isTelugu ? 'ఇతర రాష్ట్రాలు' : 'Other'}</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{maxWidth: '50%'}}>
              <label>{isTelugu ? 'పిన్ కోడ్' : 'PIN Code'} <span className="req">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'పిన్ కోడ్ నమోదు చేయండి' : 'Enter PIN code'} 
                value={formData.pincode}
                onChange={e => handleInputChange('pincode', e.target.value)}
                required 
              />
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'మీకు తెలిసిన భాషలు' : 'Languages Known'} <span className="req">*</span></label>
              <div className="checkbox-grid">
                {[
                  { id: 'Telugu', label: isTelugu ? 'తెలుగు' : 'Telugu' },
                  { id: 'Sanskrit', label: isTelugu ? 'సంస్కృతం' : 'Sanskrit' },
                  { id: 'Hindi', label: isTelugu ? 'హిందీ' : 'Hindi' },
                  { id: 'Tamil', label: isTelugu ? 'తమిళం' : 'Tamil' },
                  { id: 'Kannada', label: isTelugu ? 'కన్నడ' : 'Kannada' },
                  { id: 'English', label: isTelugu ? 'ఇంగ్లీష్' : 'English' },
                  { id: 'Other', label: isTelugu ? 'ఇతర భాషలు' : 'Other' }
                ].map(item => (
                  <label key={item.id} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.languages.includes(item.id)}
                      onChange={() => handleCheckboxChange('languages', item.id)} 
                    /> {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="req-info-box">
              <Sun size={16} color="#E04E15" /> 
              <span>{isTelugu ? '* గుర్తు ఉన్న అన్ని వివరాలు తప్పనిసరిగా పూరించాలి' : 'All fields marked with * are required'}</span>
            </div>
          </div>


          {/* RIGHT COLUMN: Experience & Expertise */}
          <div className="reg-form-right">
            <div className="form-section-header">
              <img src="/lotus.svg" alt="Lotus" className="section-lotus-icon" />
              <div>
                <h3>{isTelugu ? 'అనుభవం & నైపుణ్యం' : 'Experience & Expertise'}</h3>
                <p>{isTelugu ? 'మీ పౌరోహిత్య అనుభవం మరియు ప్రత్యేకతల గురించి తెలపండి' : 'Tell us about your priestly experience and specializations'}</p>
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'పౌరోహిత్యంలో అనుభవం' : 'Years of Experience'} <span className="req">*</span></label>
              <select 
                className="form-control" 
                value={formData.experience}
                onChange={e => handleInputChange('experience', e.target.value)}
                required
              >
                <option value="">{isTelugu ? 'అనుభవాన్ని ఎంచుకోండి' : 'Select experience'}</option>
                <option value="0-5">{isTelugu ? '0-5 సంవత్సరాలు' : '0-5 Years'}</option>
                <option value="5-10">{isTelugu ? '5-10 సంవత్సరాలు' : '5-10 Years'}</option>
                <option value="10-20">{isTelugu ? '10-20 సంవత్సరాలు' : '10-20 Years'}</option>
                <option value="20+">{isTelugu ? '20+ సంవత్సరాలు (సీనియర్ ఆచార్యులు)' : '20+ Years'}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'ప్రధాన నైపుణ్యం' : 'Primary Specialization'} <span className="req">*</span></label>
              <select 
                className="form-control" 
                value={formData.primarySpecialization}
                onChange={e => handleInputChange('primarySpecialization', e.target.value)}
                required
              >
                <option value="">{isTelugu ? 'నైపుణ్యాన్ని ఎంచుకోండి' : 'Select specialization'}</option>
                <option value="Vedic Rituals">{isTelugu ? 'స్మార్త / వైదిక క్రతువులు' : 'Vedic Rituals'}</option>
                <option value="Homams">{isTelugu ? 'శాంతి హోమాలు & హవనాలు' : 'Homams'}</option>
                <option value="Temple Archakatvam">{isTelugu ? 'ఆలయ అర్చకత్వం' : 'Temple Archakatvam'}</option>
                <option value="Astrology">{isTelugu ? 'జ్యోతిష్యం & వాస్తు' : 'Astrology'}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'ఇతర ప్రత్యేకతలు' : 'Other Specializations'}</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'ఉదా: హోమాలు, ఆలయ పూజలు, జ్యోతిష్యం మొదలైనవి' : 'e.g., Homams, Temple Rituals, etc.'} 
                value={formData.otherSpecializations}
                onChange={e => handleInputChange('otherSpecializations', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'మీరు నిర్వహించే పూజలు & వ్రతాలు' : 'Types of Poojas You Perform'} <span className="req">*</span></label>
              <div className="checkbox-grid-2col">
                {[
                  { id: 'Gruhapravesham', label: isTelugu ? 'గృహప్రవేశం' : 'Gruhapravesham' },
                  { id: 'Upanayanam', label: isTelugu ? 'ఉపనయనం' : 'Upanayanam' },
                  { id: 'Satyanarayana Vratham', label: isTelugu ? 'సత్యనారాయణ స్వామి వ్రతం' : 'Satyanarayana Vratham' },
                  { id: 'Annaprasana', label: isTelugu ? 'అన్నప్రాశన' : 'Annaprasana' },
                  { id: 'Vivaham', label: isTelugu ? 'వివాహం (కళ్యాణ క్రతువులు)' : 'Vivaham (Wedding Rituals)' },
                  { id: 'Naming Ceremony', label: isTelugu ? 'నామకరణం' : 'Naming Ceremony' },
                  { id: 'Homams & Havan', label: isTelugu ? 'హోమాలు & హవనాలు' : 'Homams & Havan' },
                  { id: 'Daily Poojas', label: isTelugu ? 'నిత్య పూజలు & అభిషేకాలు' : 'Daily Poojas' },
                  { id: 'Shraddha & Pitru Karmas', label: isTelugu ? 'శ్రాద్ధ & పితృ కార్యాలు' : 'Shraddha & Pitru Karmas' },
                  { id: 'Other Poojas', label: isTelugu ? 'ఇతర విశేష పూజలు' : 'Other Poojas' }
                ].map(item => (
                  <label key={item.id} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={formData.typesOfPoojas.includes(item.id)}
                      onChange={() => handleCheckboxChange('typesOfPoojas', item.id)} 
                    /> {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? "భక్తుల గృహాల వద్దకు వెళ్లి పూజలు నిర్వహిస్తారా?" : "Do you perform rituals at devotee's home?"} <span className="req">*</span></label>
              <div className="radio-group">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="homeRituals" 
                    value="Yes" 
                    checked={formData.homeRituals === 'Yes'}
                    onChange={() => handleInputChange('homeRituals', 'Yes')}
                  /> {isTelugu ? 'అవును (Yes)' : 'Yes'}
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="homeRituals" 
                    value="No" 
                    checked={formData.homeRituals === 'No'}
                    onChange={() => handleInputChange('homeRituals', 'No')}
                  /> {isTelugu ? 'కాదు (No)' : 'No'}
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>{isTelugu ? 'మీరు సేవలు అందించే నగరాలు / ప్రాంతాలు' : 'Service Areas / Cities You Serve'} <span className="req">*</span></label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'ఉదా: హైదరాబాద్, విజయవాడ, విశాఖపట్నం (కామాలతో వేరు చేయండి)' : 'Enter city names separated by commas'} 
                value={formData.serviceAreas}
                onChange={e => handleInputChange('serviceAreas', e.target.value)}
                required 
              />
            </div>

            {/* Documents Section inside Right Column */}
            <div className="form-section-header mt-32">
              <img src="/lotus.svg" alt="Lotus" className="section-lotus-icon" />
              <div>
                <h3>{isTelugu ? 'ధృవీకరణ పత్రాల అప్‌లోడ్' : 'Upload Documents'}</h3>
                <p>{isTelugu ? 'దయచేసి క్రింది పత్రాల స్పష్టమైన కాపీలను అప్‌లోడ్ చేయండి' : 'Please upload clear copies of the documents below'}</p>
              </div>
            </div>

            <div className="upload-docs-grid">
              <div className="upload-box">
                <FileText size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">
                  {isTelugu ? 'ఆధార్ కార్డు / గుర్తింపు పత్రం' : 'Aadhaar Card / Government ID'} <span className="req">*</span>
                </div>
                <button type="button" className="upload-btn">{isTelugu ? 'అప్‌లోడ్' : 'Upload'}</button>
              </div>
              <div className="upload-box">
                <User size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">
                  {isTelugu ? 'పాస్‌పోర్ట్ సైజు తాజా ఫోటో' : 'Passport Size Photo'} <span className="req">*</span>
                </div>
                <button type="button" className="upload-btn">{isTelugu ? 'అప్‌లోడ్' : 'Upload'}</button>
              </div>
              <div className="upload-box">
                <MapPin size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">
                  {isTelugu ? 'నివాస ధృవీకరణ పత్రం' : 'Address Proof'} <span className="req">*</span>
                </div>
                <button type="button" className="upload-btn">{isTelugu ? 'అప్‌లోడ్' : 'Upload'}</button>
              </div>
              <div className="upload-box">
                <Award size={24} color="#E04E15" className="mb-8" />
                <div className="upload-title">
                  {isTelugu ? 'వేద పాఠశాల / అనుభవ పత్రం' : 'Experience Proof (Optional)'}
                </div>
                <button type="button" className="upload-btn">{isTelugu ? 'అప్‌లోడ్' : 'Upload'}</button>
              </div>
            </div>
            <p className="upload-formats-text">
              {isTelugu 
                ? 'అనుమతించబడిన ఫార్మాట్లు: JPG, PNG, PDF (గరిష్ట పరిమాణం: ఒక్కొక్కటి 5MB)' 
                : 'Allowed formats: JPG, PNG, PDF (Max size: 5MB each)'}
            </p>

          </div>
        </div>

        {/* Why Join Gnana Sudha Section */}
        <div className="why-join-section">
          <h3>{isTelugu ? 'జ్ఞాన సుధలో ఎందుకు చేరాలి?' : 'Why Join Gnana Sudha?'}</h3>
          <div className="why-join-grid">
            <div className="why-join-item">
              <div className="why-icon"><FileText size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>నిజమైన భక్తుల నుండి<br/>నిరంతర బుకింగ్‌లు</> : <>Receive Genuine<br/>Booking Requests</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><MapPin size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>వివిధ నగరాల్లో మీ<br/>సేవా పరిధి విస్తరణ</> : <>Expand Your Reach<br/>Across Cities</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Clock size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>మీకు నచ్చిన సమయాల్లో<br/>పనిచేసే వెసులుబాటు</> : <>Flexible Working<br/>Schedule</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><ShieldCheck size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>భద్రమైన & పారదర్శక<br/>పారితోషిక చెల్లింపులు</> : <>Secure & Transparent<br/>Payments</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Award size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>సమాజంలో మీ గౌరవం,<br/>గుర్తింపు పెంపు</> : <>Build Your Professional<br/>Reputation</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Headset size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>నిరంతరాయ సహాయ<br/>సహకారాల బృందం</> : <>Dedicated<br/>Support</>}
              </span>
            </div>
            <div className="why-join-item">
              <div className="why-icon"><Sun size={20} color="#E04E15" /></div>
              <span>
                {isTelugu ? <>పండుగ సమయాల్లో<br/>అధిక అవకాశాలు</> : <>More Opportunities<br/>During Festivals</>}
              </span>
            </div>
          </div>
        </div>

        {submitError && (
          <div style={{ margin: '20px 0', padding: '16px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '8px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#DC2626" />
            <span>{submitError}</span>
          </div>
        )}

        {submitSuccess && (
          <div style={{ margin: '20px 0', padding: '20px', background: '#F0FDF4', border: '1px solid #22C55E', borderRadius: '8px', color: '#166534', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🕉️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#15803D' }}>
              {isTelugu ? 'దరఖాస్తు విజయవంతంగా సమర్పించబడింది!' : 'Application Submitted Successfully!'}
            </h3>
            <p style={{ margin: 0, fontSize: '14px' }}>
              {isTelugu 
                ? 'మా వేద విద్వత్ కమిటీ మీ దరఖాస్తును సమీక్షిస్తుంది. కొద్దిసేపట్లో పురోహితుల జాబితాకు తరలించబడుతుంది...' 
                : 'Our Vedic advisory committee will review your application. Redirecting to Pandits directory...'}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="form-footer-actions">
          <div className="action-buttons">
            <button type="button" className="btn-cancel" onClick={() => navigate('/pandit')}>
              {isTelugu ? 'రద్దు చేయండి' : 'Cancel'}
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={submitting} 
              style={{ padding: '12px 32px', opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting 
                ? (isTelugu ? 'దరఖాస్తు సమర్పించబడుతోంది...' : 'Submitting Application...') 
                : (isTelugu ? 'సమీక్షించి సమర్పించండి' : 'Review & Submit')} 
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
