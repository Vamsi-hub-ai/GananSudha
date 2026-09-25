import React, { useState } from 'react';
import { X, User, Calendar, MapPin, Clock, Phone, Mail, Sparkles, Lock, Compass, ShieldCheck, Send } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ selectedService, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    poojaType: selectedService?.title || '',
    date: '',
    message: '',
    dob: '',
    pob: '',
    tobHH: '12',
    tobMM: '00',
    tobAMPM: 'AM',
    placeOfVastu: ''
  });

  if (!selectedService) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking submitted:', formData);
    // In a real app, you would send this to an API
    alert('Booking request submitted successfully! We will contact you soon.');
    onClose();
  };

  const isHoroscope = selectedService.title === 'Horoscope Reading';
  const isVaastu = selectedService.title === 'Vaastu Consultation';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        {isVaastu ? (
          <div className="vastu-modal">
            <div className="vastu-header">
              <div className="vastu-icon-circle">
                <Compass size={24} color="#e55d14" strokeWidth={1.5} />
              </div>
              <div className="vastu-header-text">
                <h2>Request Vastu Consultation</h2>
                <div className="vastu-divider">
                  <span></span><div className="vastu-lotus"><img src="/lotus.svg" alt="lotus" style={{ width: 14, filter: 'invert(52%) sepia(87%) saturate(3015%) hue-rotate(349deg) brightness(101%) contrast(97%)' }} /></div><span></span>
                </div>
                <p>Fill in the details below and our Vastu experts<br/>will get back to you.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="vastu-form">
              <div className="vastu-field">
                <label><User size={16} /> Full Name <span className="req">*</span></label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
              </div>

              <div className="vastu-field">
                <label><MapPin size={16} /> Place of Vastu <span className="req">*</span></label>
                <input type="text" name="placeOfVastu" required value={formData.placeOfVastu} onChange={handleChange} placeholder="Enter your place (Home / Office / Shop / Factory etc.)" />
                <span className="vastu-hint">Please specify the type of property for better guidance.</span>
              </div>

              <div className="vastu-field">
                <label><Phone size={16} /> Mobile Number <span className="req">*</span></label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Enter your mobile number" />
              </div>

              <div className="vastu-field">
                <label><Mail size={16} /> Email ID <span className="req">*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
              </div>

              <button type="submit" className="vastu-submit-btn">
                <Send size={20} /> Request Consultation
              </button>

              <div className="vastu-footer">
                <Lock size={14} /> Your information is secure and will not be shared.
              </div>
            </form>
          </div>
        ) : isHoroscope ? (
          <div className="horoscope-modal">
            <div className="horoscope-header">
              <div className="horoscope-icon-circle">
                <img src="/lotus.svg" alt="Astrology" style={{ width: 32, filter: 'invert(1)' }} />
              </div>
              <div className="horoscope-header-text">
                <h2>Request Horoscope Consultation</h2>
                <div className="horoscope-divider">
                  <span></span><div className="horoscope-diamond"></div><span></span>
                </div>
                <p>Fill in your details below and our astrologers<br/>will provide you with accurate guidance.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="horoscope-form">
              <div className="horoscope-field">
                <label><User size={16} /> Full Name <span className="req">*</span></label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
              </div>

              <div className="horoscope-field">
                <label><Calendar size={16} /> Date of Birth <span className="req">*</span></label>
                <input type="date" name="dob" required value={formData.dob} onChange={handleChange} />
              </div>

              <div className="horoscope-field">
                <label><MapPin size={16} /> Place of Birth <span className="req">*</span></label>
                <input type="text" name="pob" required value={formData.pob} onChange={handleChange} placeholder="Enter your place of birth" />
              </div>

              <div className="horoscope-field">
                <label><Clock size={16} /> Time of Birth <span className="req">*</span></label>
                <div className="time-inputs">
                  <select name="tobHH" value={formData.tobHH} onChange={handleChange}>
                    {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                      <option key={h} value={h < 10 ? `0${h}` : h}>{h < 10 ? `0${h}` : h}</option>
                    ))}
                  </select>
                  <select name="tobMM" value={formData.tobMM} onChange={handleChange}>
                    {Array.from({length: 60}, (_, i) => i).map(m => (
                      <option key={m} value={m < 10 ? `0${m}` : m}>{m < 10 ? `0${m}` : m}</option>
                    ))}
                  </select>
                  <select name="tobAMPM" value={formData.tobAMPM} onChange={handleChange}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="horoscope-field">
                <label><Phone size={16} /> Mobile Number <span className="req">*</span></label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Enter your mobile number" />
              </div>

              <div className="horoscope-field">
                <label><Mail size={16} /> Email ID <span className="req">*</span></label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email address" />
              </div>

              <button type="submit" className="horoscope-submit-btn">
                <Sparkles size={20} /> Get My Horoscope
              </button>

              <div className="horoscope-footer">
                <Lock size={14} /> Your information is safe with us and will never be shared.
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>Book {selectedService.title}</h2>
              <p>Fill out the form below and our team will get back to you shortly.</p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name" 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your contact number" 
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email" 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="poojaType">Service Type *</label>
                  <select 
                    id="poojaType" 
                    name="poojaType" 
                    required
                    value={formData.poojaType}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select a service</option>
                    <option value="Muhurtam">Muhurtam</option>
                    <option value="Vaastu Consultation">Vaastu Consultation</option>
                    <option value="Horoscope Reading">Horoscope Reading</option>
                    <option value="Book Pandit & Pooja">Book Pandit & Pooja</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="date">Preferred Date *</label>
                  <input 
                    type="date" 
                    id="date" 
                    name="date" 
                    required 
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Any Specific Requirements?</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="2" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about any specific details or questions..."
                ></textarea>
              </div>

              <button type="submit" className="submit-booking-btn">
                Submit Booking Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
