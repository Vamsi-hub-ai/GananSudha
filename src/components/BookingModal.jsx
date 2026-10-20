import React, { useState, useContext } from 'react';
import { 
  X, User, Calendar, MapPin, Clock, Phone, Mail, 
  Sparkles, CheckCircle2, ShieldCheck, Flame, Languages, 
  Building2, Copy, Check, ArrowRight, Flower2 
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import './BookingModal.css';

export default function BookingModal({ selectedService, onClose, onBookingSuccess }) {
  const { currentCustomer, createBooking } = useContext(DataContext);
  const { t, isTelugu } = useLanguage();

  // Determine service name and type
  const rawServiceName = selectedService?.name || selectedService?.title || 'Vedic Ritual';
  const serviceType = selectedService?.type || (
    rawServiceName.toLowerCase().includes('homam') || rawServiceName.toLowerCase().includes('havan')
      ? 'homam'
      : (selectedService?.theme ? 'consultation' : 'pooja')
  );

  const [formData, setFormData] = useState({
    customer_name: currentCustomer?.name || '',
    customer_phone: currentCustomer?.phone || '',
    customer_email: currentCustomer?.email || '',
    preferred_date: '',
    preferred_time: 'Morning (08:00 AM - 10:30 AM)',
    service_location: 'Home',
    city: 'Hyderabad',
    address: '',
    preferred_language: isTelugu ? 'Telugu' : 'Telugu',
    additional_requirements: '',
    special_instructions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedService) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleCopyReference = (refText) => {
    if (!refText) return;
    navigator.clipboard.writeText(refText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict validation
    if (!formData.customer_name.trim()) {
      setErrorMsg(isTelugu ? 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.' : 'Please enter your full name.');
      return;
    }

    const cleanPhone = formData.customer_phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(isTelugu ? 'దయచేసి 10 అంకెల చెల్లుబాటు అయ్యే మొబైల్ నంబర్ నమోదు చేయండి.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!formData.preferred_date) {
      setErrorMsg(isTelugu ? 'దయచేసి పూజా తేదీని ఎంచుకోండి.' : 'Please select your preferred ritual date.');
      return;
    }

    // Ensure date is not in the past
    const selectedD = new Date(formData.preferred_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedD < today) {
      setErrorMsg(isTelugu ? 'తేదీ ఈరోజు లేదా భవిష్యత్తు తేదీగా ఉండాలి.' : 'Preferred date must be today or a future date.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg(isTelugu ? 'దయచేసి మీ నగరాన్ని ఎంచుకోండి.' : 'Please select or enter your city.');
      return;
    }

    if (!formData.address.trim()) {
      setErrorMsg(isTelugu ? 'దయచేసి సంపూర్ణ సేవ చిరునామాను నమోదు చేయండి.' : 'Please enter the complete service address where ritual should be performed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        service_id: typeof selectedService.id === 'number' ? selectedService.id : null,
        service_type: serviceType,
        service_name: rawServiceName,
        customer_id: currentCustomer?.id || null,
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        customer_email: formData.customer_email.trim() || null,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        service_location: formData.service_location,
        address: formData.address.trim(),
        city: formData.city.trim(),
        preferred_language: formData.preferred_language,
        additional_requirements: formData.additional_requirements.trim() || null,
        special_instructions: formData.special_instructions.trim() || null
      };

      const result = await createBooking(payload);

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        if (onBookingSuccess) onBookingSuccess(result.booking);
      } else {
        setErrorMsg(result.message || (isTelugu ? 'బుకింగ్ సమర్పించడంలో లోపం ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి.' : 'Failed to submit booking. Please try again.'));
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date formatted as YYYY-MM-DD for min date
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content booking-modal-container" style={{ maxWidth: confirmedBooking ? '560px' : '620px' }}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        {confirmedBooking ? (
          /* ==============================================================
             CONFIRMATION VIEW (Displayed only after successful MySQL save)
             ============================================================== */
          <div className="booking-confirmation-view" style={{ textAlign: 'center', padding: '12px 6px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(22, 163, 74, 0.25)'
            }}>
              <CheckCircle2 size={36} strokeWidth={2.2} />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E04E15', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Flower2 size={14} />
              <span>{isTelugu ? 'బుకింగ్ అభ్యర్థన విజయవంతం' : 'Sacred Booking Confirmed'}</span>
              <Flower2 size={14} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#2B1D14', margin: '0 0 8px', fontFamily: 'var(--font-serif, serif)' }}>
              {isTelugu ? 'మీ పూజా అభ్యర్థన నమోదైంది' : 'Ritual Request Received'}
            </h2>

            <p style={{ color: '#666', fontSize: '13.5px', maxWidth: '440px', margin: '0 auto 20px', lineHeight: '1.5' }}>
              {isTelugu 
                ? 'మీ బుకింగ్ విజయవంతంగా భద్రపరచబడింది. మా సీనియర్ వేద సమన్వయకర్త మీతో సంప్రదించి, శుభ ముహూర్తాన్ని ఖరారు చేసి, విద్వాంసులైన పండితులను కేటాయిస్తారు.'
                : 'Your booking has been saved. Our senior Vedic coordination team will review your requirements, coordinate with you directly to finalize auspicious timings, and assign a qualified scholar pandit.'}
            </p>

            {/* Booking Reference Card */}
            <div style={{
              background: '#FFFDF9',
              border: '2px dashed #E04E15',
              borderRadius: '12px',
              padding: '16px 20px',
              margin: '0 auto 20px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#756A64', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {isTelugu ? 'బుకింగ్ రిఫరెన్స్ నంబర్' : 'Official Booking Reference'}
                </span>
                <span style={{
                  background: '#FEF3C7',
                  color: '#92400E',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  {confirmedBooking.status || 'Pending Review'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#E04E15', letterSpacing: '1px', fontFamily: 'monospace' }}>
                  {confirmedBooking.booking_id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyReference(confirmedBooking.booking_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isCopied ? '#16A34A' : '#FAF4EE',
                    color: isCopied ? '#fff' : '#C53018',
                    border: '1px solid',
                    borderColor: isCopied ? '#16A34A' : '#E8C9B8',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  title="Copy reference code"
                >
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopied ? (isTelugu ? 'కాపీ చేయబడింది' : 'Copied!') : (isTelugu ? 'కాపీ చేయండి' : 'Copy')}</span>
                </button>
              </div>
            </div>

            {/* Summary Details */}
            <div style={{
              background: '#F9F6F0',
              borderRadius: '10px',
              padding: '14px 18px',
              textAlign: 'left',
              fontSize: '13px',
              color: '#44342F',
              marginBottom: '24px',
              lineHeight: '1.7'
            }}>
              <div><strong>{isTelugu ? 'సేవ:' : 'Service:'}</strong> {confirmedBooking.service_name}</div>
              <div><strong>{isTelugu ? 'తేదీ & సమయం:' : 'Scheduled Date & Time:'}</strong> {confirmedBooking.preferred_date} • {confirmedBooking.preferred_time || 'Morning Muhurat'}</div>
              <div><strong>{isTelugu ? 'యజమాని / భక్తుడు:' : 'Customer Name:'}</strong> {confirmedBooking.customer_name} ({confirmedBooking.customer_phone})</div>
              <div><strong>{isTelugu ? 'ప్రదేశం & నగరం:' : 'Location & City:'}</strong> {confirmedBooking.service_location} • {confirmedBooking.city}</div>
              <div><strong>{isTelugu ? 'ప్రాధాన్య భాష:' : 'Preferred Language:'}</strong> {confirmedBooking.preferred_language || 'Telugu'}</div>
            </div>

            {/* Next Steps Card */}
            <div style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '12.5px',
              color: '#1E40AF',
              marginBottom: '24px',
              display: 'flex',
              gap: '10px'
            }}>
              <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#2563EB' }} />
              <div>
                <strong>{isTelugu ? 'తదుపరి కార్యాచరణ:' : 'Next Steps:'}</strong> {isTelugu 
                  ? 'మా పండిత సమన్వయ విభాగం మీ ఫోన్ నంబర్‌కు నేరుగా కాల్ చేసి పూజా సామాగ్రి, గోత్రం, నక్షత్ర వివరాలు సేకరిస్తుంది. మీరు ఎటువంటి ముందస్తు రుసుము చెల్లించాల్సిన అవసరం లేదు.' 
                  : 'Our coordinator will call your phone to verify gotram, ritual requirements, and samagri list. No upfront payment is required at this stage.'}
              </div>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #E04E15 0%, #C53018 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isTelugu ? 'ముగించు' : 'Done'}
            </button>
          </div>
        ) : (
          /* ==============================================================
             CUSTOMER BOOKING FORM (Clear, price-free, scripture-guided)
             ============================================================== */
          <div>
            {/* Header */}
            <div className="modal-header" style={{ textAlign: 'left', marginBottom: '16px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E04E15', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                <Flame size={14} />
                <span>{isTelugu ? 'పవిత్ర సేవ బుకింగ్' : 'Vedic Ritual Booking'}</span>
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#2B1D14', margin: '0 0 4px', fontFamily: 'var(--font-serif, serif)' }}>
                {isTelugu ? 'పూజా వివరాలను నమోదు చేయండి' : 'Schedule Your Sacred Pooja'}
              </h2>
              <p style={{ color: '#756A64', fontSize: '12.5px', margin: 0 }}>
                {isTelugu 
                  ? 'మీ అవసరాలకు అనుగుణంగా శాస్త్రోక్తంగా అర్హత కలిగిన వేద పండితులను మా బృందం ఏర్పాటు చేస్తుంది.'
                  : 'Our senior team coordinates the ritual and arranges a scholarly Vedic priest at your convenience.'}
              </p>
            </div>

            {/* Selected Service Badge (Read-only, Price-free) */}
            <div style={{
              background: '#FFF9F5',
              border: '1px solid #F5D5C6',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {selectedService.img && (
                <img 
                  src={selectedService.img} 
                  alt={rawServiceName} 
                  style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} 
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#E04E15', fontWeight: 700, textTransform: 'uppercase' }}>
                  {serviceType === 'homam' ? (isTelugu ? 'హోమం / హవనం' : 'Homam / Havan') : (isTelugu ? 'దివ్య పూజ' : 'Divine Pooja')}
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#2B1D14' }}>
                  {rawServiceName}
                </div>
              </div>
              <span style={{ fontSize: '11.5px', background: '#F0ECE6', color: '#5C4E46', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                {isTelugu ? 'ధర రహిత బుకింగ్' : 'Assisted Booking'}
              </span>
            </div>

            {errorMsg && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                color: '#991B1B',
                borderRadius: '6px',
                padding: '10px 14px',
                marginBottom: '14px',
                fontSize: '13px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Customer Name & Phone */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} color="#E04E15" />
                    <span>{isTelugu ? 'పూర్తి పేరు' : 'Full Name'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder={isTelugu ? 'మీ పేరు' : 'e.g. Ramesh Sharma'}
                    value={formData.customer_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={13} color="#E04E15" />
                    <span>{isTelugu ? 'మొబైల్ నంబర్' : 'Mobile Number'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    required
                    maxLength={15}
                    placeholder={isTelugu ? '10 అంకెల మొబైల్' : 'e.g. 98480 12345'}
                    value={formData.customer_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email (Optional) & Preferred Language */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={13} color="#756A64" />
                    <span>{isTelugu ? 'ఈమెయిల్ (ఐచ్ఛికం)' : 'Email (Optional)'}</span>
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    placeholder="name@example.com"
                    value={formData.customer_email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Languages size={13} color="#E04E15" />
                    <span>{isTelugu ? 'ప్రాధాన్య భాష' : 'Preferred Language'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <select name="preferred_language" value={formData.preferred_language} onChange={handleChange}>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="English">English</option>
                    <option value="Sanskrit">సంస్కృతం (Sanskrit)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>
              </div>

              {/* Date & Preferred Time */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#E04E15" />
                    <span>{isTelugu ? 'కోరుకున్న తేదీ' : 'Preferred Date'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    required
                    min={todayStr}
                    value={formData.preferred_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#E04E15" />
                    <span>{isTelugu ? 'ముహూర్తం / సమయం' : 'Preferred Time Slot'}</span>
                  </label>
                  <select name="preferred_time" value={formData.preferred_time} onChange={handleChange}>
                    <option value="Morning (06:00 AM - 08:30 AM)">Early Morning (06:00 AM - 08:30 AM)</option>
                    <option value="Morning (08:30 AM - 11:30 AM)">Morning (08:30 AM - 11:30 AM)</option>
                    <option value="Brahma Muhurtam (04:30 AM - 06:00 AM)">Brahma Muhurtam (04:30 AM - 06:00 AM)</option>
                    <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                    <option value="Evening (05:00 PM - 08:30 PM)">Evening (05:00 PM - 08:30 PM)</option>
                    <option value="Coordinate Auspicious Muhurat with Pandit">Coordinate Auspicious Muhurat with Team</option>
                  </select>
                </div>
              </div>

              {/* Location Type & City */}
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={13} color="#E04E15" />
                    <span>{isTelugu ? 'సేవా స్థలం' : 'Service Location'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <select name="service_location" value={formData.service_location} onChange={handleChange}>
                    <option value="Home">{isTelugu ? 'ఇల్లు (Home)' : 'Home'}</option>
                    <option value="Temple">{isTelugu ? 'దేవాలయం (Temple)' : 'Temple'}</option>
                    <option value="Function Hall">{isTelugu ? 'ఫంక్షన్ హాల్ (Function Hall)' : 'Function Hall'}</option>
                    <option value="Office / Business">{isTelugu ? 'కార్యాలయం (Office / Shop)' : 'Office / Business'}</option>
                    <option value="Other">{isTelugu ? 'ఇతర ప్రాంతం (Other)' : 'Other'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="#E04E15" />
                    <span>{isTelugu ? 'నగరం' : 'City'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                  </label>
                  <select name="city" value={formData.city} onChange={handleChange}>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Secunderabad">Secunderabad</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Visakhapatnam">Visakhapatnam</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Tirupati">Tirupati</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Warangal">Warangal</option>
                    <option value="Other">Other (Specify in Address)</option>
                  </select>
                </div>
              </div>

              {/* Complete Address */}
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="#E04E15" />
                  <span>{isTelugu ? 'పూర్తి చిరునామా' : 'Complete Service Address & Landmark'} <strong style={{ color: '#E04E15' }}>*</strong></span>
                </label>
                <textarea
                  name="address"
                  required
                  rows={2}
                  placeholder={isTelugu ? 'ఫ్లాట్ నం, వీధి, ల్యాండ్‌మార్క్, పిన్‌కోడ్' : 'House/Flat No, Apartment/Street, Landmark, Area, Pincode'}
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Optional: Gotram / Additional Requirements */}
              <div className="form-group">
                <label style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#756A64" />
                  <span>{isTelugu ? 'గోత్రం / ప్రత్యేక కోరికలు (ఐచ్ఛికం)' : 'Gotram / Specific Ritual Requirements (Optional)'}</span>
                </label>
                <input
                  type="text"
                  name="additional_requirements"
                  placeholder={isTelugu ? 'గోత్రం, నక్షత్రం లేదా పూజా సామగ్రి అవసరాలు' : 'e.g. Koushika Gotram, Need complete samagri kit, etc.'}
                  value={formData.additional_requirements}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 700,
                    background: isSubmitting ? '#9CA3AF' : 'linear-gradient(135deg, #E04E15 0%, #C53018 100%)',
                    color: '#fff',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(224, 78, 21, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span>
                    {isSubmitting 
                      ? (isTelugu ? 'బుకింగ్ నమోదు చేయబడుతోంది...' : 'Submitting Sacred Booking...') 
                      : (isTelugu ? 'బుకింగ్ అభ్యర్థన సమర్పించండి' : 'Submit Sacred Booking')}
                  </span>
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </div>

              {/* Assurance note */}
              <p style={{ margin: '4px 0 0', textAlign: 'center', fontSize: '11.5px', color: '#888' }}>
                {isTelugu 
                  ? '🔒 మీ వ్యక్తిగత సమాచారం పూర్తిగా సురక్షితం. మా సమన్వయకర్త మాత్రమే సంప్రదిస్తారు.' 
                  : '🔒 100% Verified Vedic Pandits • Shastra Compliant • Dedicated Coordinator Assigned'}
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
