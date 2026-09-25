import React, { useState } from 'react';
import '../App.css'; // Make sure the calendar CSS is loaded

export default function AvailabilityCalendar({ workingDays = [], addedDates = [], workHours = {from: '06:00', to: '18:00'}, bookings = [], onDateSelect, selectedDate, hideBookingDetails = false }) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Empty cells for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Fill days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayOfWeek = dayNames[new Date(year, month, i).getDay()];
      
      const isAvailableDay = workingDays.includes(dayOfWeek) || addedDates.includes(dateStr);
      const bookingsForDay = bookings.filter(b => b.date && b.date.startsWith(dateStr));
      
      const isSelected = selectedDate === dateStr;
      
      const isSelectable = onDateSelect && isAvailableDay;

      days.push(
        <div 
          key={`day-${i}`} 
          className={`calendar-day ${isAvailableDay ? 'available' : ''} ${bookingsForDay.length > 0 ? 'booked' : ''}`}
          style={{ 
             cursor: isSelectable ? 'pointer' : 'default',
             border: isSelected ? '2px solid #E04E15' : ''
          }}
          onClick={() => {
            if (isSelectable) {
              onDateSelect(dateStr);
            }
          }}
        >
          <div className="day-number">{i}</div>
          {bookingsForDay.map((booking, idx) => (
            <div key={idx} className="calendar-booking-badge" title={hideBookingDetails ? "Slot Booked" : `${booking.service?.name || 'Booking'} at ${booking.time || workHours.from}`}>
              {hideBookingDetails ? "Unavailable" : (booking.time || workHours.from)}
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Monthly Availability Calendar</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={(e) => { e.preventDefault(); setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)); }}>&lt; Prev</button>
          <span style={{ fontWeight: 'bold', minWidth: '100px', textAlign: 'center', fontSize: '14px' }}>
            {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={(e) => { e.preventDefault(); setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)); }}>Next &gt;</button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={`header-${day}`} className="calendar-header-day">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      
      <div style={{ display: 'flex', gap: '24px', marginTop: '16px', fontSize: '13px', color: '#666' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: '#FFF0ED', border: '1px solid var(--primary-red)', borderRadius: '4px' }}></div>
          Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }}></div>
          Unavailable
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '16px', height: '16px', background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px' }}></div>
          Booked Slot
        </div>
      </div>
    </div>
  );
}
