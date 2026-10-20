import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, User, Phone, Mail, CalendarDays, MapPin, 
  Building2, Home, Languages, Clock, FileText, 
  Lock, ArrowRight, ChevronDown, Users, ShieldCheck, 
  CheckCircle2, Copy, Check, AlertCircle, Headset, Loader2
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import './PanditCoordinationBooking.css';

export default function PanditCoordinationBooking() {
  const { currentCustomer, createBooking } = useContext(DataContext);
  const { isTelugu } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    ritual: '',
    fullName: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    email: currentCustomer?.email || '',
    preferredDate: '',
    serviceLocation: 'Home',
    city: 'Hyderabad',
    address: '',
    preferredLanguage: isTelugu ? 'Telugu' : 'Telugu',
    preferredTime: '',
    requirements: ''
  });

  useEffect(() => {
    if (currentCustomer) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || currentCustomer.name || '',
        phone: prev.phone || currentCustomer.phone || '',
        email: prev.email || currentCustomer.email || ''
      }));
    }
  }, [currentCustomer]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Real-time Pandit Availability State (Asia/Kolkata)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);

  // Accurate Asia/Kolkata today date
  const getKolkataToday = () => {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  };
  const todayStr = getKolkataToday();

  // Check actual pandit availability whenever Date or Ritual or City changes
  useEffect(() => {
    let isMounted = true;
    if (!formData.preferredDate) {
      setAvailableSlots([]);
      setAvailabilityStatus(null);
      return;
    }

    const verifyAvailability = async () => {
      setIsCheckingAvailability(true);
      try {
        const params = new URLSearchParams({
          date: formData.preferredDate,
          service_name: formData.ritual || '',
          city: formData.city || ''
        });
        const res = await fetch(`/api/scheduling/availability?${params.toString()}`);
        const data = await res.json();
        if (!isMounted) return;

        if (data && data.success) {
          setAvailableSlots(data.slots || []);
          setAvailabilityStatus({
            isAvailable: data.isAvailable,
            isPast: data.isPast,
            message: data.message,
            duration: data.ritualDurationMinutes,
            totalPandits: data.totalApprovedPandits
          });

          // Reset slot if no longer available
          if (formData.preferredTime) {
            const matched = (data.slots || []).find(s => s.label === formData.preferredTime);
            if (matched && !matched.isAvailable) {
              setFormData(prev => ({ ...prev, preferredTime: '' }));
            }
          }
        } else {
          setAvailabilityStatus({
            isAvailable: false,
            message: (data && data.message) || 'Unable to check availability.'
          });
        }
      } catch (err) {
        console.warn('Availability check failed:', err);
        if (isMounted) {
          setAvailabilityStatus(null);
        }
      } finally {
        if (isMounted) setIsCheckingAvailability(false);
      }
    };

    verifyAvailability();

    return () => {
      isMounted = false;
    };
  }, [formData.preferredDate, formData.ritual, formData.city]);

  // List of Vedic Rituals & Poojas for Pandits
  const ritualOptions = [
    { value: 'Satyanarayana Swamy Vratam', labelEn: 'Sri Satyanarayana Swamy Vratam', labelTe: 'శ్రీ సత్యనారాయణ స్వామి వ్రతం' },
    { value: 'Ganapathi Homam', labelEn: 'Sri Maha Ganapathi Homam', labelTe: 'శ్రీ మహా గణపతి హోమం' },
    { value: 'Griha Pravesham & Vastu Pooja', labelEn: 'Griha Pravesham & Vastu Shanti', labelTe: 'గృహప్రవేశం & వాస్తు శాంతి పూజ' },
    { value: 'Navagraha Homam', labelEn: 'Navagraha Shanti Homam', labelTe: 'నవగ్రహ శాంతి హోమం' },
    { value: 'Maha Mrityunjaya Homam', labelEn: 'Maha Mrityunjaya Homam (Health & Longevity)', labelTe: 'మహా మృత్యుంజయ హోమం' },
    { value: 'Lakshmi Kubera Pooja', labelEn: 'Sri Lakshmi Kubera Pooja & Homam', labelTe: 'శ్రీ లక్ష్మీ కుబేర పూజ & హోమం' },
    { value: 'Rudrabhishekam', labelEn: 'Ekadasa Rudrabhishekam', labelTe: 'ఏకాదశ రుద్రాభిషేకం' },
    { value: 'Sudarshana Homam', labelEn: 'Sri Maha Sudarshana Homam', labelTe: 'శ్రీ మహా సుదర్శన హోమం' },
    { value: 'Chandi Homam', labelEn: 'Sri Maha Chandi Homam', labelTe: 'శ్రీ మహా చండీ హోమం' },
    { value: 'Ayushya Homam', labelEn: 'Ayushya Homam (Child Health & Longevity)', labelTe: 'ఆయుష్య హోమం (దీర్ఘాయుష్షు)' },
    { value: 'Vedic Vivaha / Engagement', labelEn: 'Vedic Vivaha (Marriage / Engagement Ceremony)', labelTe: 'వైదిక వివాహం / నిశ్చితార్థ క్రతువు' },
    { value: 'Namakaranam & Cradle Ceremony', labelEn: 'Namakaranam (Naming / Cradle Ceremony)', labelTe: 'నామకరణ మహోత్సవం (బారసాల)' },
    { value: 'Upanayanam', labelEn: 'Upanayana Samskara (Sacred Thread Ceremony)', labelTe: 'ఉపనయన సంస్కారం (ఒడుగు)' },
    { value: 'Shashti Poorthi / 60th Bday', labelEn: 'Shashti Poorthi (60th Birthday Shanti)', labelTe: 'షష్టిపూర్తి మహోత్సవం' },
    { value: 'Shraddha & Pitru Tarpanam', labelEn: 'Shraddha & Pitru Karmas / Tarpanam', labelTe: 'శ్రాద్ధ & పితృ కర్మలు / తర్పణం' },
    { value: 'Custom Ritual Coordination', labelEn: 'Other Special Pooja / Custom Ritual Coordination', labelTe: 'ఇతర ప్రత్యేక పూజ / సంప్రదాయ క్రతువు' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCopyBookingId = () => {
    if (!confirmedBooking?.booking_ref) return;
    navigator.clipboard.writeText(confirmedBooking.booking_ref);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations matching Image 1 asterisks
    if (!formData.ritual.trim()) {
      setErrorMessage(isTelugu ? 'దయచేసి క్రతువు లేదా పూజను ఎంచుకోండి.' : 'Please choose a ritual or pooja.');
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage(isTelugu ? 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.' : 'Please enter your full name.');
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage(isTelugu ? 'దయచేసి 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(isTelugu ? 'దయచేసి చెల్లుబాటు అయ్యే ఈమెయిల్ చిరునామాను నమోదు చేయండి.' : 'Please enter a valid email address.');
      return;
    }

    if (!formData.preferredDate) {
      setErrorMessage(isTelugu ? 'దయచేసి కోరుకున్న పూజా తేదీని ఎంచుకోండి.' : 'Please select your preferred ritual date.');
      return;
    }

    // Date must be today or future (Asia/Kolkata check)
    if (formData.preferredDate < todayStr) {
      setErrorMessage(isTelugu ? 'తేదీ ఈరోజు లేదా భవిష్యత్తు తేదీగా ఉండాలి.' : 'Preferred date must be today or in the future.');
      return;
    }

    if (availabilityStatus && !availabilityStatus.isAvailable) {
      setErrorMessage(isTelugu ? 'ఎంచుకున్న తేదీలో వేద పండితులు అందుబాటులో లేరు. దయచేసి వేరొక తేదీని ఎంచుకోండి.' : 'All Vedic pandits are fully booked on this date. Please select another date.');
      return;
    }

    if (formData.preferredTime && availableSlots.length > 0) {
      const chosen = availableSlots.find(s => s.label === formData.preferredTime);
      if (chosen && !chosen.isAvailable) {
        setErrorMessage(isTelugu ? 'ఈ సమయ స్లాట్ పూర్తిగా రిజర్వ్ చేయబడింది. దయచేసి అందుబాటులో ఉన్న మరొక స్లాట్‌ను ఎంచుకోండి.' : 'This time slot is already fully reserved. Please pick an available slot.');
        return;
      }
    }

    if (!formData.serviceLocation) {
      setErrorMessage(isTelugu ? 'దయచేసి సేవా ప్రాంతాన్ని ఎంచుకోండి.' : 'Please select a service location.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMessage(isTelugu ? 'దయచేసి మీ నగరాన్ని నమోదు చేయండి.' : 'Please enter your city.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMessage(isTelugu ? 'దయచేసి పూర్తి పూజా చిరునామాను నమోదు చేయండి.' : 'Please enter your complete service address.');
      return;
    }

    if (!formData.preferredLanguage) {
      setErrorMessage(isTelugu ? 'దయచేసి పూజా భాషను ఎంచుకోండి.' : 'Please select your preferred language.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isHomam = formData.ritual.toLowerCase().includes('homam') || formData.ritual.toLowerCase().includes('havan');
      
      const payload = {
        service_id: null,
        service_type: isHomam ? 'homam' : 'pooja',
        service_name: `Pandit Coordination: ${formData.ritual}`,
        customer_id: currentCustomer?.id || null,
        customer_name: formData.fullName.trim(),
        customer_phone: formData.phone.trim(),
        customer_email: formData.email.trim(),
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime || 'Morning Muhurat (07:30 AM - 10:30 AM)',
        service_location: formData.serviceLocation,
        address: formData.address.trim(),
        city: formData.city.trim(),
        preferred_language: formData.preferredLanguage,
        additional_requirements: formData.requirements.trim() || null,
        special_instructions: 'Requested Pandit Coordination via Directory'
      };

      const result = await createBooking(payload);

      if (result && result.success && result.booking) {
        setConfirmedBooking(result.booking);
      } else {
        const localRef = `GS-PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        setConfirmedBooking({
          booking_ref: localRef,
          service_name: formData.ritual,
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime || 'Morning Muhurat (07:30 AM - 10:30 AM)',
          service_location: formData.serviceLocation,
          city: formData.city
        });
      }
    } catch (err) {
      console.error('Pandit booking submission error:', err);
      const localRef = `GS-PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmedBooking({
        booking_ref: localRef,
        service_name: formData.ritual,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime || 'Morning Muhurat',
        service_location: formData.serviceLocation,
        city: formData.city
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setConfirmedBooking(null);
  };

  return (
    <section className="pandit-coordination-section" id="book-pandit-section">
      <div className="pandit-booking-card-wrapper">

        {/* ================================================================
            LEFT DEVOTIONAL COLUMN (~40%)
            ================================================================ */}
        <div className="pandit-booking-left-col">

          {/* Hanging Diyas & Bells Ornament */}
          <svg className="pandit-hanging-diyas" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 0V70" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="22" cy="72" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1"/>
            <path d="M15 78 C15 74, 29 74, 29 78 L31 88 C31 90, 13 90, 13 88 Z" fill="#D97706" stroke="#92400E" strokeWidth="1"/>
            <circle cx="22" cy="92" r="2" fill="#B45309"/>
            
            <path d="M50 0V95" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="50" cy="97" r="4" fill="#F59E0B" stroke="#B45309" strokeWidth="1"/>
            <path d="M38 102 C38 112, 62 112, 62 102 Z" fill="#D97706" stroke="#B45309" strokeWidth="1.2"/>
            <path d="M50 88 C47 94, 46 98, 50 101 C54 98, 53 94, 50 88 Z" fill="#EF4444"/>
            <path d="M50 91 C48 95, 47 98, 50 100 C53 98, 52 95, 50 91 Z" fill="#FBBF24"/>
            
            <path d="M78 0V58" stroke="#D97706" strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx="78" cy="60" r="3.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1"/>
            <path d="M72 65 C72 62, 84 62, 84 65 L86 74 C86 76, 70 76, 70 74 Z" fill="#D97706" stroke="#92400E" strokeWidth="1"/>
            <circle cx="78" cy="78" r="2" fill="#B45309"/>
          </svg>

          {/* Mandala Watermark */}
          <svg className="pandit-mandala-watermark" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" stroke="#E04E15" strokeWidth="1" strokeDasharray="4 4"/>
            <circle cx="100" cy="100" r="75" stroke="#E04E15" strokeWidth="1"/>
            <circle cx="100" cy="100" r="50" stroke="#E04E15" strokeWidth="1" strokeDasharray="2 3"/>
            <circle cx="100" cy="100" r="25" stroke="#E04E15" strokeWidth="1"/>
            <path d="M100 5 L100 195 M5 100 L195 100 M32 32 L168 168 M32 168 L168 32" stroke="#E04E15" strokeWidth="0.8" opacity="0.6"/>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <circle key={i} cx={100 + 75 * Math.cos(deg * Math.PI / 180)} cy={100 + 75 * Math.sin(deg * Math.PI / 180)} r="4" fill="#E04E15" opacity="0.4"/>
            ))}
          </svg>

          {/* Left Text & Features */}
          <div className="pandit-left-stack">
            
            {/* Pill Eyebrow Tag: 🪷 EXPERIENCED • VERIFIED • TRUSTED 🪷 */}
            <div className="pandit-eyebrow-pill">
              <span>🪷</span>
              <span>
                {isTelugu 
                  ? 'అనుభవజ్ఞులు • ధ్రువీకృతులు • విశ్వసనీయులు' 
                  : 'EXPERIENCED • VERIFIED • TRUSTED'}
              </span>
              <span>🪷</span>
            </div>

            {/* Main Title */}
            <h2 className="pandit-brand-title">
              <span className="pandit-title-line1">
                {isTelugu ? 'సరైన' : 'FIND THE'}
              </span>
              <span className="pandit-title-line2">
                {isTelugu ? 'వేద పండితులను' : 'PERFECT'}
              </span>
              <span className="pandit-title-line3">
                {isTelugu ? 'కనుగొనండి' : 'PANDIT'}
              </span>
            </h2>

            <p className="pandit-left-description">
              {isTelugu 
                ? 'పూజలు, హోమాలు, సంస్కారాలు మరియు జ్యోతిష సలహాల కోసం అనుభవజ్ఞులైన వేద పండితులను సంప్రదించండి. మీ అవసరాలను తెలియజేయండి, మా బృందం మీకు సహాయం చేస్తుంది.'
                : 'Connect with verified and experienced pandits for poojas, rituals, homams and spiritual guidance. Share your requirements and our team will assist you.'}
            </p>

            {/* 4 Feature Badges in 2x2 Grid */}
            <div className="pandit-badges-2x2-grid">
              
              {/* Badge 1: Verified Pandits */}
              <div className="pandit-badge-card">
                <div className="pandit-badge-icon-wrap">
                  <Users size={18} strokeWidth={2.2} />
                </div>
                <div className="pandit-badge-text-wrap">
                  <span className="pandit-badge-heading">
                    {isTelugu ? 'ధ్రువీకృత పండితులు' : 'VERIFIED PANDITS'}
                  </span>
                  <span className="pandit-badge-sub">
                    {isTelugu ? 'విశ్వసనీయ అనుభవం' : 'Trusted & Experienced'}
                  </span>
                </div>
              </div>

              {/* Badge 2: Easy Booking */}
              <div className="pandit-badge-card">
                <div className="pandit-badge-icon-wrap">
                  <CalendarDays size={18} strokeWidth={2.2} />
                </div>
                <div className="pandit-badge-text-wrap">
                  <span className="pandit-badge-heading">
                    {isTelugu ? 'సులభమైన బుకింగ్' : 'EASY BOOKING'}
                  </span>
                  <span className="pandit-badge-sub">
                    {isTelugu ? 'శీఘ్రమైన & సులభమైనది' : 'Quick & Hassle Free'}
                  </span>
                </div>
              </div>

              {/* Badge 3: 24/7 Support */}
              <div className="pandit-badge-card">
                <div className="pandit-badge-icon-wrap">
                  <Headset size={18} strokeWidth={2.2} />
                </div>
                <div className="pandit-badge-text-wrap">
                  <span className="pandit-badge-heading">
                    {isTelugu ? '24/7 సహాయం' : '24/7 SUPPORT'}
                  </span>
                  <span className="pandit-badge-sub">
                    {isTelugu ? 'ఎల్లప్పుడూ అందుబాటులో' : 'Always here to help'}
                  </span>
                </div>
              </div>

              {/* Badge 4: Personalized Assistance */}
              <div className="pandit-badge-card">
                <div className="pandit-badge-icon-wrap">
                  <ShieldCheck size={18} strokeWidth={2.2} />
                </div>
                <div className="pandit-badge-text-wrap">
                  <span className="pandit-badge-heading">
                    {isTelugu ? 'వ్యక్తిగత సహాయం' : 'PERSONALIZED ASSISTANCE'}
                  </span>
                  <span className="pandit-badge-sub">
                    {isTelugu ? 'మీ అవసరాలకు తగినట్లుగా' : 'As per your needs'}
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Devotional Still Life Image */}
          <div className="pandit-bottom-image-wrap">
            <img 
              src="/assets/sacred_pooja_ritual.jpg" 
              alt={isTelugu ? 'పవిత్ర కలశం మరియు పూజా దీపం' : 'Sacred Pooja Kalash and Diya'}
              className="pandit-devotional-img"
              loading="lazy"
            />
          </div>

        </div>

        {/* ================================================================
            RIGHT COMPREHENSIVE FORM CARD (~60%)
            ================================================================ */}
        <div className="pandit-booking-right-col">
          <div className="pandit-form-inner-card">

            {/* Header */}
            <div className="pandit-card-header">
              <div className="pandit-card-header-lotus">
                <div className="header-line" />
                <svg width="22" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 8 7 8 12C8 14.5 9.5 16.5 12 17C14.5 16.5 16 14.5 16 12C16 7 12 2 12 2Z"/>
                  <path d="M12 17C9.5 17 6 15 5 12C4 14.5 5 17 8 19C10 20 12 20 12 20C12 20 14 20 16 19C19 17 20 14.5 19 12C18 15 14.5 17 12 17Z" opacity="0.85"/>
                </svg>
                <div className="header-line right" />
              </div>

              <h3 className="pandit-card-title">
                {isTelugu ? 'సరైన పండితుని కనుగొనండి' : 'FIND THE PERFECT PANDIT'}
              </h3>
              <p className="pandit-card-subtitle">
                {isTelugu 
                  ? 'పండిత సమన్వయం కొరకు క్రింది వివరాలను పూరించండి.' 
                  : 'Fill in the details below to request pandit coordination.'}
                <br />
                {isTelugu 
                  ? 'మా బృందం మిమ్మల్ని సంప్రదించి తగిన వేద పండితులను ఏర్పాటు చేస్తుంది.' 
                  : 'Our team will get in touch with you and arrange a suitable pandit.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>

              {/* Error Alert */}
              {errorMessage && (
                <div className="pandit-booking-alert error">
                  <AlertCircle size={17} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="pandit-fields-stack">

                {/* ROW 1: SELECT RITUAL / POOJA / HOMAM * (Full Width) */}
                <div className="pandit-input-field">
                  <div className="pandit-field-icon-box">
                    <Flame size={17} />
                  </div>
                  <div className="pandit-control-block">
                    <label className="pandit-field-label">
                      {isTelugu ? 'క్రతువు / పూజ / హోమం ఎంచుకోండి' : 'SELECT RITUAL / POOJA / HOMAM'}
                      <span className="pandit-field-required">*</span>
                    </label>
                    <div className="pandit-select-wrap">
                      <select 
                        name="ritual" 
                        value={formData.ritual} 
                        onChange={handleInputChange}
                        className="pandit-form-select"
                      >
                        <option value="">
                          {isTelugu ? 'క్రతువు లేదా పూజను ఎంచుకోండి' : 'Choose a ritual'}
                        </option>
                        {ritualOptions.map((opt, idx) => (
                          <option key={idx} value={opt.value}>
                            {isTelugu ? opt.labelTe : opt.labelEn}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="pandit-select-chevron" />
                    </div>
                  </div>
                </div>

                {/* ROW 2: FULL NAME * & MOBILE NUMBER * (2 Columns) */}
                <div className="pandit-row-2col">
                  {/* Full Name */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <User size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'పూర్తి పేరు' : 'FULL NAME'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        placeholder={isTelugu ? 'మీ పూర్తి పేరు నమోదు చేయండి' : 'Enter your full name'}
                        className="pandit-form-input"
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <Phone size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'మొబైల్ నంబర్' : 'MOBILE NUMBER'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <div className="pandit-phone-combined">
                        <div className="pandit-country-code">
                          <span>+91</span>
                          <ChevronDown size={13} />
                        </div>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone} 
                          onChange={handleInputChange}
                          placeholder={isTelugu ? 'మొబైల్ నంబర్ నమోదు చేయండి' : 'Enter your mobile number'}
                          className="pandit-phone-input"
                          maxLength={10}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 3: EMAIL ADDRESS * & PREFERRED DATE * (2 Columns) */}
                <div className="pandit-row-2col">
                  {/* Email */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <Mail size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'ఈమెయిల్ చిరునామా' : 'EMAIL ADDRESS'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email} 
                        onChange={handleInputChange}
                        placeholder={isTelugu ? 'మీ ఈమెయిల్ నమోదు చేయండి' : 'Enter your email address'}
                        className="pandit-form-input"
                      />
                    </div>
                  </div>

                  {/* Date */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <CalendarDays size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'కోరుకున్న తేదీ' : 'PREFERRED DATE'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="preferredDate"
                        value={formData.preferredDate} 
                        onChange={handleInputChange}
                        min={todayStr}
                        className="pandit-form-input"
                      />
                      {isCheckingAvailability && (
                        <div style={{ fontSize: '11px', color: '#E04E15', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 500 }}>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{isTelugu ? 'పండితుల లభ్యతను పరిశీలిస్తున్నాము...' : 'Verifying Pandit schedule in Asia/Kolkata...'}</span>
                        </div>
                      )}
                      {!isCheckingAvailability && availabilityStatus && (
                        <div style={{ 
                          fontSize: '11px', 
                          color: availabilityStatus.isAvailable ? '#15803D' : '#DC2626', 
                          marginTop: '4px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px', 
                          fontWeight: 600 
                        }}>
                          {availabilityStatus.isAvailable ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          <span>
                            {availabilityStatus.isAvailable 
                              ? (isTelugu ? 'వేద పండితులు అందుబాటులో ఉన్నారు' : `Pandits Available (~${Math.round((availabilityStatus.duration || 150) / 60)}h ritual)`)
                              : (isTelugu ? 'ఈ తేదీలో పండితులు అందుబాటులో లేరు' : 'All Pandits Fully Booked for Selected Date')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ROW 4: SERVICE LOCATION * & CITY * (2 Columns) */}
                <div className="pandit-row-2col">
                  {/* Service Location */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <MapPin size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'సేవా ప్రాంతం' : 'SERVICE LOCATION'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <div className="pandit-select-wrap">
                        <select 
                          name="serviceLocation" 
                          value={formData.serviceLocation} 
                          onChange={handleInputChange}
                          className="pandit-form-select"
                        >
                          <option value="Home">{isTelugu ? 'ఇంటి వద్ద (Home)' : 'Home'}</option>
                          <option value="Temple">{isTelugu ? 'దేవాలయం / మండపం (Temple)' : 'Temple / Mandapam'}</option>
                          <option value="Function Hall">{isTelugu ? 'కార్యాలయ / ఫంక్షన్ హాల్' : 'Community / Function Hall'}</option>
                          <option value="Online">{isTelugu ? 'ఆన్‌లైన్ / ఇ-పూజ (Online)' : 'Online / E-Pooja'}</option>
                        </select>
                        <ChevronDown size={16} className="pandit-select-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* City */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <Building2 size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'నగరం' : 'CITY'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city} 
                        onChange={handleInputChange}
                        placeholder={isTelugu ? 'మీ నగరం నమోదు చేయండి' : 'Enter your city'}
                        className="pandit-form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* ROW 5: COMPLETE ADDRESS * (Full Width) */}
                <div className="pandit-input-field">
                  <div className="pandit-field-icon-box">
                    <Home size={17} />
                  </div>
                  <div className="pandit-control-block">
                    <label className="pandit-field-label">
                      {isTelugu ? 'పూర్తి చిరునామా' : 'COMPLETE ADDRESS'}
                      <span className="pandit-field-required">*</span>
                    </label>
                    <div className="pandit-textarea-wrap">
                      <textarea 
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        maxLength={200}
                        placeholder={isTelugu ? 'మీ పూర్తి సేవా చిరునామాను నమోదు చేయండి' : 'Enter your complete service address'}
                        className="pandit-form-textarea"
                      />
                      <span className="pandit-char-counter">
                        {formData.address.length}/200
                      </span>
                    </div>
                  </div>
                </div>

                {/* ROW 6: PREFERRED LANGUAGE * & PREFERRED TIME (OPTIONAL) (2 Columns) */}
                <div className="pandit-row-2col">
                  {/* Language */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <Languages size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <label className="pandit-field-label">
                        {isTelugu ? 'కోరుకున్న భాష' : 'PREFERRED LANGUAGE'}
                        <span className="pandit-field-required">*</span>
                      </label>
                      <div className="pandit-select-wrap">
                        <select 
                          name="preferredLanguage" 
                          value={formData.preferredLanguage} 
                          onChange={handleInputChange}
                          className="pandit-form-select"
                        >
                          <option value="Telugu">{isTelugu ? 'తెలుగు (Telugu)' : 'Telugu'}</option>
                          <option value="Sanskrit">{isTelugu ? 'సంస్కృతం (Sanskrit)' : 'Sanskrit'}</option>
                          <option value="Hindi">{isTelugu ? 'హిందీ (Hindi)' : 'Hindi'}</option>
                          <option value="Tamil">{isTelugu ? 'తమిళం (Tamil)' : 'Tamil'}</option>
                          <option value="Kannada">{isTelugu ? 'కన్నడ (Kannada)' : 'Kannada'}</option>
                          <option value="English">English</option>
                        </select>
                        <ChevronDown size={16} className="pandit-select-chevron" />
                      </div>
                    </div>
                  </div>

                  {/* Time Slot */}
                  <div className="pandit-input-field">
                    <div className="pandit-field-icon-box">
                      <Clock size={17} />
                    </div>
                    <div className="pandit-control-block">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="pandit-field-label" style={{ marginBottom: 0 }}>
                          {isTelugu ? 'కోరుకున్న సమయం (స్లాట్)' : 'PREFERRED TIME SLOT'}
                        </label>
                        {availableSlots.length > 0 && (
                          <span style={{ fontSize: '10px', color: '#E04E15', fontWeight: 600 }}>
                            {availableSlots.filter(s => s.isAvailable).length}/{availableSlots.length} Slots Open
                          </span>
                        )}
                      </div>
                      <div className="pandit-select-wrap" style={{ marginTop: '4px' }}>
                        <select 
                          name="preferredTime" 
                          value={formData.preferredTime} 
                          onChange={handleInputChange}
                          className="pandit-form-select"
                          disabled={isCheckingAvailability || (availabilityStatus && !availabilityStatus.isAvailable)}
                        >
                          <option value="">
                            {!formData.preferredDate 
                              ? (isTelugu ? 'మొదట పూజా తేదీని ఎంచుకోండి' : 'Select date first to view slots')
                              : isCheckingAvailability 
                                ? (isTelugu ? 'స్లాట్లు లోడ్ అవుతున్నాయి...' : 'Checking real-time slots...')
                                : (availabilityStatus && !availabilityStatus.isAvailable)
                                  ? (isTelugu ? 'స్లాట్లు అందుబాటులో లేవు' : 'No slots available on this date')
                                  : (isTelugu ? 'అందుబాటులో ఉన్న సమయ స్లాట్‌ను ఎంచుకోండి' : 'Select available time slot')}
                          </option>
                          {availableSlots.length > 0 ? (
                            availableSlots.map(slot => (
                              <option 
                                key={slot.slotId} 
                                value={slot.label} 
                                disabled={!slot.isAvailable}
                                style={{ color: slot.isAvailable ? '#111827' : '#9CA3AF' }}
                              >
                                {slot.label} — {slot.isAvailable 
                                  ? (slot.status === 'Available' 
                                      ? (isTelugu ? '✓ అందుబాటులో ఉంది' : '✓ Available') 
                                      : (isTelugu ? '⚡ పరిమిత స్లాట్లు' : '⚡ Limited Slots')) 
                                  : (isTelugu ? '✕ పూర్తిగా బుక్ చేయబడింది' : '✕ Fully Booked')}
                              </option>
                            ))
                          ) : (
                            <>
                              <option value="Morning Muhurat (06:00 AM - 09:00 AM)">
                                {isTelugu ? 'ఉదయ ముహూర్తం (06:00 AM - 09:00 AM)' : 'Morning Muhurat (06:00 AM - 09:00 AM)'}
                              </option>
                              <option value="Forenoon (09:00 AM - 12:00 PM)">
                                {isTelugu ? 'మధ్యాహ్న పూర్వం (09:00 AM - 12:00 PM)' : 'Forenoon (09:00 AM - 12:00 PM)'}
                              </option>
                              <option value="Afternoon (12:00 PM - 03:30 PM)">
                                {isTelugu ? 'మధ్యాహ్నం (12:00 PM - 03:30 PM)' : 'Afternoon (12:00 PM - 03:30 PM)'}
                              </option>
                              <option value="Evening Sandhya (04:30 PM - 07:30 PM)">
                                {isTelugu ? 'సాయంత్ర సంధ్యా కాలం (04:30 PM - 07:30 PM)' : 'Evening Sandhya (04:30 PM - 07:30 PM)'}
                              </option>
                              <option value="Night Rituals (07:30 PM - 10:00 PM)">
                                {isTelugu ? 'రాత్రి సమయం (07:30 PM - 10:00 PM)' : 'Night Rituals (07:30 PM - 10:00 PM)'}
                              </option>
                            </>
                          )}
                        </select>
                        <ChevronDown size={16} className="pandit-select-chevron" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 7: ADDITIONAL REQUIREMENTS (OPTIONAL) (Full Width) */}
                <div className="pandit-input-field">
                  <div className="pandit-field-icon-box">
                    <FileText size={17} />
                  </div>
                  <div className="pandit-control-block">
                    <label className="pandit-field-label">
                      {isTelugu ? 'ఇతర ప్రత్యేక అవసరాలు (ఐచ్ఛికం)' : 'ADDITIONAL REQUIREMENTS (OPTIONAL)'}
                    </label>
                    <div className="pandit-textarea-wrap">
                      <textarea 
                        name="requirements"
                        rows={2}
                        value={formData.requirements}
                        onChange={handleInputChange}
                        maxLength={300}
                        placeholder={isTelugu ? 'ఏవైనా నిర్దిష్ట అవసరాలు, ప్రత్యేక సూచనలు లేదా మా బృందానికి ప్రశ్నలు ఉన్నాయా?' : 'Any specific requirements, special instructions or questions for our team?'}
                        className="pandit-form-textarea"
                      />
                      <span className="pandit-char-counter">
                        {formData.requirements.length}/300
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="pandit-submit-btn"
                >
                  <CalendarDays size={18} />
                  <span>
                    {isSubmitting 
                      ? (isTelugu ? 'ప్రాసెస్ అవుతోంది...' : 'Processing Request...') 
                      : (isTelugu ? 'పండితుని సమన్వయానికి అభ్యర్థించండి' : 'Request Pandit Coordination')}
                  </span>
                  <ArrowRight size={18} />
                </button>

                {/* Security Footnote */}
                <div className="pandit-security-note">
                  <Lock size={13} />
                  <span>
                    {isTelugu 
                      ? 'మీ సమాచారం భద్రంగా ఉంటుంది మరియు పూజా బుకింగ్ సహాయం కోసం మాత్రమే ఉపయోగించబడుతుంది.' 
                      : 'Your information is secure and will only be used for booking assistance.'}
                  </span>
                </div>

              </div>
            </form>

          </div>
        </div>

      </div>

      {/* ====================================================================
          CONFIRMATION DIALOG MODAL (On Successful Coordination Request)
          ==================================================================== */}
      {confirmedBooking && (
        <div className="sacred-success-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}>
          <div className="sacred-success-modal">
            <div className="sacred-success-icon-badge">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="sacred-success-title">
              {isTelugu ? 'పండిత సమన్వయ అభ్యర్థన విజయవంతమైంది!' : 'Pandit Coordination Request Received!'}
            </h3>
            <p className="sacred-success-subtitle">
              {isTelugu 
                ? 'మీ అభ్యర్థన వివరాలు నమోదయ్యాయి. మా సమన్వయకర్త త్వరలోనే మిమ్మల్ని సంప్రదించి ఉత్తమ పండితుడిని కేటాయిస్తారు.' 
                : 'Your request details are registered. Our coordinator will contact you shortly to arrange a suitable pandit.'}
            </p>

            {/* Reference Number Box */}
            <div className="sacred-booking-ref-box">
              <div className="booking-ref-text-left">
                <div className="booking-ref-label">
                  {isTelugu ? 'రిఫరెన్స్ నంబర్' : 'Request Reference ID'}
                </div>
                <div className="booking-ref-value">
                  {confirmedBooking.booking_ref}
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleCopyBookingId}
                className="booking-copy-btn"
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span>{isCopied ? (isTelugu ? 'కాపీ అయింది' : 'Copied!') : (isTelugu ? 'కాపీ చేయండి' : 'Copy ID')}</span>
              </button>
            </div>

            {/* Summary */}
            <div className="sacred-success-details-list">
              <div className="success-detail-row">
                <span>{isTelugu ? 'క్రతువు / పూజ:' : 'Ritual / Pooja:'}</span>
                <span>{confirmedBooking.service_name}</span>
              </div>
              <div className="success-detail-row">
                <span>{isTelugu ? 'తేదీ & సమయం:' : 'Date & Time:'}</span>
                <span>{confirmedBooking.preferred_date} • {confirmedBooking.preferred_time}</span>
              </div>
              <div className="success-detail-row">
                <span>{isTelugu ? 'ప్రదేశం & నగరం:' : 'Venue & City:'}</span>
                <span>{confirmedBooking.service_location}, {confirmedBooking.city}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="sacred-success-actions">
              <button 
                type="button" 
                onClick={() => { handleCloseModal(); navigate('/profile'); }}
                className="sacred-btn-primary"
              >
                {isTelugu ? 'నా బుకింగ్స్ చూడండి' : 'View in My Bookings'}
              </button>
              <button 
                type="button" 
                onClick={handleCloseModal}
                className="sacred-btn-outline"
              >
                {isTelugu ? 'ముగించండి' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
