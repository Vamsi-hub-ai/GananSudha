import React, { useState, useContext } from 'react';
import { CalendarClock, Home, MoonStar, Flame, MessageCircle, Calendar, CheckCircle2 } from 'lucide-react';
import BookingModal from './BookingModal';
import { DataContext } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import './ConsultationsAvailable.css';

const ConsultationsAvailable = () => {
  const [selectedService, setSelectedService] = useState(null);
  const { currentCustomer, consultations } = useContext(DataContext);
  const navigate = useNavigate();

  const handleBookClick = (card) => {
    if (currentCustomer) {
      setSelectedService(card);
    } else {
      alert('Please log in to book a service.');
      navigate('/login');
    }
  };

  const cards = [
    {
      id: 'muhurtam',
      theme: 'yellow',
      icon: <CalendarClock size={32} strokeWidth={1.5} />,
      title: 'Muhurtam',
      desc: 'Find the most auspicious date and time for your important events',
      features: ['Marriage Muhurat', 'Griha Pravesh Muhurat', 'Business Muhurat', 'Travel Muhurat'],
      buttonText: 'Book Now',
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'vaastu',
      theme: 'orange',
      icon: <Home size={32} strokeWidth={1.5} />,
      title: 'Vaastu Consultation',
      desc: 'Align your living and working spaces with cosmic energies',
      features: ['Home Vaastu', 'Office Vaastu', 'Plot Vaastu', 'Vaastu Remedies'],
      buttonText: 'Book Now',
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'horoscope',
      theme: 'purple',
      icon: <MoonStar size={32} strokeWidth={1.5} />,
      title: 'Horoscope Reading',
      desc: 'Detailed analysis of your birth chart for life guidance',
      features: ['Birth Chart Analysis', 'Career Guidance', 'Relationship Insights', 'Future Predictions'],
      buttonText: 'Book Now',
      buttonIcon: <Calendar size={16} />,
      buttonVariant: 'book'
    },
    {
      id: 'pooja',
      theme: 'green',
      icon: <Flame size={32} strokeWidth={1.5} />,
      title: 'Book Pandit & Pooja',
      desc: 'Book experienced pandits for poojas, homams & rituals',
      features: ['Pooja Booking', 'Homam & Havan', 'Online & Offline Pooja', 'Customized Rituals'],
      buttonText: 'Book Now',
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
          Consultations <span className="highlight-text">Available</span>
        </h2>
        <p className="consultations-subtitle">
          Personalized spiritual guidance for your life journey
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

            {(() => {
              const consultationData = consultations?.find(c => c.id === card.id);
              if (consultationData && (consultationData.price || consultationData.discountPrice)) {
                return (
                  <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'center' }}>
                    {consultationData.discountPrice ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '14px' }}>₹{consultationData.price}</span>
                        <span style={{ color: '#E04E15', fontSize: '18px', fontWeight: 'bold' }}>₹{consultationData.discountPrice}</span>
                      </div>
                    ) : (
                      <div style={{ color: '#E04E15', fontSize: '18px', fontWeight: 'bold' }}>₹{consultationData.price}</div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

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
