import React, { useState, useContext } from 'react';
import { CalendarClock, Home, MoonStar, Flame, Calendar, CheckCircle2 } from 'lucide-react';
import BookingModal from './BookingModal';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import './ConsultationsAvailable.css';

const ConsultationsAvailable = () => {
  const [selectedService, setSelectedService] = useState(null);
  const { currentCustomer, consultations } = useContext(DataContext);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleBookClick = (card) => {
    if (currentCustomer) {
      setSelectedService(card);
    } else {
      alert(language === 'te' ? 'సేవను బుక్ చేయడానికి దయచేసి లాగిన్ అవ్వండి.' : 'Please log in to book a service.');
      navigate('/login');
    }
  };

  const cards = [
    {
      id: 'muhurtam',
      theme: 'yellow',
      icon: <CalendarClock size={32} strokeWidth={1.5} />,
      title: t('consultations.muhurtam_title'),
      desc: t('consultations.muhurtam_desc'),
      features: language === 'te' 
        ? ['వివాహ ముహూర్తం', 'గృహప్రవేశ ముహూర్తం', 'వ్యాపార ప్రారంభ ముహూర్తం', 'ప్రయాణ ముహూర్తం']
        : ['Marriage Muhurat', 'Griha Pravesh Muhurat', 'Business Muhurat', 'Travel Muhurat'],
      buttonText: t('consultations.book_now_btn'),
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'vaastu',
      theme: 'orange',
      icon: <Home size={32} strokeWidth={1.5} />,
      title: t('consultations.vaastu_title'),
      desc: t('consultations.vaastu_desc'),
      features: language === 'te'
        ? ['గృహ వాస్తు పరిశీలన', 'ఆఫీస్ & వాణిజ్య వాస్తు', 'స్థల / భూమి వాస్తు', 'వాస్తు దోష నివారణలు']
        : ['Home Vaastu', 'Office Vaastu', 'Plot Vaastu', 'Vaastu Remedies'],
      buttonText: t('consultations.book_now_btn'),
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'horoscope',
      theme: 'purple',
      icon: <MoonStar size={32} strokeWidth={1.5} />,
      title: t('consultations.horoscope_title'),
      desc: t('consultations.horoscope_desc'),
      features: language === 'te'
        ? ['జన్మకుండలి విశ్లేషణ', 'ఉద్యోగ & వ్యాపార భవిష్యత్తు', 'వివాహ పొంతనలు', 'శాంతి హోమాలు & పరిహారాలు']
        : ['Birth Chart Analysis', 'Career Guidance', 'Relationship Insights', 'Future Predictions'],
      buttonText: t('consultations.book_now_btn'),
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'pooja',
      theme: 'green',
      icon: <Flame size={32} strokeWidth={1.5} />,
      title: t('consultations.book_pandit_title'),
      desc: t('consultations.book_pandit_desc'),
      features: language === 'te'
        ? ['శాస్త్రోక్త పూజా విధానం', 'దివ్య హోమాలు & హవనాలు', 'ప్రత్యక్ష & ఆన్‌లైన్ పూజలు', 'మీ సంప్రదాయానుసారం']
        : ['Pooja Booking', 'Homam & Havan', 'Online & Offline Pooja', 'Customized Rituals'],
      buttonText: t('consultations.book_now_btn'),
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    }
  ];

  return (
    <section className="consultations-section">
      <div className="consultations-header">
        <div className="lotus-icon">
          <img src="/lotus.svg" alt="Lotus" style={{ width: 32, filter: 'sepia(1) hue-rotate(340deg) saturate(5)', opacity: 0.8 }} />
        </div>
        <h2 className="consultations-title">
          {t('consultations.title')} <span className="highlight-text">{t('consultations.highlight')}</span>
        </h2>
        <p className="consultations-subtitle">
          {t('consultations.subtitle')}
        </p>
      </div>

      <div className="consultations-grid">
        {cards.map((card) => (
          <div key={card.id} className={`consultation-card theme-${card.theme}`}>
            <div className="card-icon-wrapper">
              <div className="card-icon">{card.icon}</div>
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-desc">{card.desc}</p>
            
            <div className="card-divider">
              <div className="divider-line"></div>
              <div className="divider-diamond"></div>
              <div className="divider-line"></div>
            </div>

            <ul className="card-features">
              {card.features.map((feature, idx) => (
                <li key={idx}>
                  <CheckCircle2 size={16} className="feature-check" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              className={`card-action-btn btn-${card.buttonVariant}`}
              onClick={() => handleBookClick(card)}
            >
              {card.buttonText} {card.buttonIcon}
            </button>
          </div>
        ))}
      </div>
      {selectedService && (
        <BookingModal 
          selectedService={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
    </section>
  );
};

export default ConsultationsAvailable;
