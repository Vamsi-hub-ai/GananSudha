import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Clock, User, Phone, MapPin, 
  Plus, CheckCircle2, AlertCircle, RefreshCw, X, MessageSquare, 
  Send, AlertTriangle, ArrowRight, CheckCheck, Loader2
} from 'lucide-react';
import '../App.css';

export default function AvailabilityCalendar({ 
  panditId = null,
  pandit = null,
  workingDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 
  addedDates = [], 
  workHours = { from: '06:00', to: '20:00' }, 
  bookings = [], 
  onDateSelect, 
  selectedDate: propSelectedDate, 
  hideBookingDetails = false,
  onAssignTask,
  onCancelTask,
  onRescheduleTask
}) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(propSelectedDate || '');
  
  // Real schedule from API
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [scheduleLeaves, setScheduleLeaves] = useState([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState('');

  // Fetch real schedule from backend whenever panditId or month changes
  const fetchSchedule = async () => {
    if (!panditId) return;
    setIsLoadingSchedule(true);
    setScheduleError('');
    try {
      const year = currentMonthDate.getFullYear();
      const month = currentMonthDate.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const res = await fetch(`/api/scheduling/pandits/${panditId}/schedule?start_date=${startDate}&end_date=${endDate}`);
      const data = await res.json();
      if (data && data.success) {
        setScheduleTasks(data.tasks || []);
        setScheduleLeaves(data.leaves || []);
      } else {
        setScheduleError((data && data.message) || 'Failed to load schedule');
      }
    } catch (err) {
      console.warn('Schedule fetch error:', err);
      setScheduleError('Network error loading schedule');
    } finally {
      setIsLoadingSchedule(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [panditId, currentMonthDate]);

  useEffect(() => {
    if (propSelectedDate) {
      setSelectedDate(propSelectedDate);
    }
  }, [propSelectedDate]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Combine tasks from API with any passed legacy bookings
  const getTasksForDate = (dateStr) => {
    const apiTasks = scheduleTasks.filter(t => t.scheduled_date && String(t.scheduled_date).split('T')[0] === dateStr);
    const legacyBookings = bookings.filter(b => b.date && b.date.startsWith(dateStr)).map(b => ({
      id: b.id || Math.random(),
      task_reference: b.task_reference || `GS-ORD-${b.id || 'N/A'}`,
      ritual_name: b.service?.name || 'Ritual Task',
      start_time: b.time || workHours.from,
      end_time: workHours.to,
      customer_name: b.customer_name || 'Gnana Sudha Devotee',
      service_location: b.location || 'Home',
      status: 'Booked'
    }));
    
    // Avoid duplicates if API tasks already exist
    return apiTasks.length > 0 ? apiTasks : legacyBookings;
  };

  const getLeavesForDate = (dateStr) => {
    return scheduleLeaves.filter(l => l.available_date && String(l.available_date).split('T')[0] === dateStr);
  };

  const handleCellClick = (dateStr) => {
    setSelectedDate(dateStr);
    if (onDateSelect) {
      onDateSelect(dateStr);
    }
  };

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
      const dayTasks = getTasksForDate(dateStr);
      const dayLeaves = getLeavesForDate(dateStr);
      const isLeave = dayLeaves.length > 0;
      const isBooked = dayTasks.length > 0;
      
      const isSelected = selectedDate === dateStr;

      let cellClass = 'calendar-day';
      if (isLeave) {
        cellClass += ' leave';
      } else if (isBooked) {
        cellClass += ' booked';
      } else if (isAvailableDay) {
        cellClass += ' available';
      }

      days.push(
        <div 
          key={`day-${i}`} 
          className={cellClass}
          style={{ 
            cursor: 'pointer',
            border: isSelected ? '2px solid #E04E15' : undefined,
            boxShadow: isSelected ? '0 0 0 3px rgba(224, 78, 21, 0.2)' : undefined,
            position: 'relative'
          }}
          onClick={() => handleCellClick(dateStr)}
          title={`Click to view schedule for ${dateStr}`}
        >
          <div className="day-number" style={{ color: isSelected ? '#E04E15' : undefined }}>{i}</div>

          {/* Leave indicator */}
          {dayLeaves.map((l, idx) => (
            <div key={`leave-${idx}`} className="calendar-leave-badge" title={`Leave: ${l.reason || 'Personal unavailability'}`}>
              Leave
            </div>
          ))}

          {/* Task badges */}
          {dayTasks.slice(0, 2).map((task, idx) => (
            <div 
              key={`task-${idx}`} 
              className="calendar-booking-badge" 
              title={hideBookingDetails ? "Slot Booked" : `${task.ritual_name} (${task.start_time || ''} - ${task.end_time || ''})`}
            >
              {hideBookingDetails ? "Booked" : `${task.start_time ? task.start_time.split(' ')[0] : ''} ${task.ritual_name}`}
            </div>
          ))}

          {dayTasks.length > 2 && (
            <div style={{ fontSize: '10px', color: '#1E40AF', fontWeight: 'bold', textAlign: 'center' }}>
              +{dayTasks.length - 2} more
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedDateLeaves = selectedDate ? getLeavesForDate(selectedDate) : [];

  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%' }}>
      {/* Calendar Header with Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#2B1D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Monthly Availability Calendar</span>
            {isLoadingSchedule && <Loader2 size={15} className="animate-spin" color="#E04E15" />}
          </h3>
          {pandit && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
              {pandit.name} {pandit.specialization ? `• ${pandit.specialization}` : ''} {pandit.phone ? `(Ph: ${pandit.phone})` : ''}
            </div>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            className="btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)); 
            }}
          >
            &lt; Prev
          </button>
          
          <span style={{ fontWeight: 'bold', minWidth: '120px', textAlign: 'center', fontSize: '14px', color: '#1A1A1A' }}>
            {currentMonthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          
          <button 
            className="btn-secondary" 
            style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '6px' }} 
            onClick={(e) => { 
              e.preventDefault(); 
              setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)); 
            }}
          >
            Next &gt;
          </button>

          {panditId && (
            <button
              onClick={fetchSchedule}
              title="Refresh Schedule"
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '12px', borderRadius: '6px', marginLeft: '4px' }}
            >
              <RefreshCw size={13} className={isLoadingSchedule ? 'animate-spin' : ''} />
            </button>
          )}
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={`header-${day}`} className="calendar-header-day">{day}</div>
        ))}
        {renderCalendar()}
      </div>
      
      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '12.5px', color: '#555', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '15px', height: '15px', background: '#FFF0ED', border: '1px solid #E04E15', borderRadius: '4px' }}></div>
          Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '15px', height: '15px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }}></div>
          Unavailable
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '15px', height: '15px', background: '#e3f2fd', border: '1px solid #2196f3', borderRadius: '4px' }}></div>
          Booked Slot
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '15px', height: '15px', background: '#FEE2E2', border: '1px solid #EF4444', borderRadius: '4px' }}></div>
          Leave / Blocked
        </div>
      </div>

      {/* Selected Date Detail Drawer & Task Management */}
      {selectedDate && (
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '15px', color: '#2B1D14', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={16} color="#E04E15" />
                Schedule for {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#666' }}>
                {selectedDateTasks.length} assigned ritual{selectedDateTasks.length !== 1 ? 's' : ''} • {selectedDateLeaves.length > 0 ? 'Pandit on leave' : 'Pandit available'}
              </p>
            </div>

            {onAssignTask && (
              <button 
                onClick={() => onAssignTask(selectedDate)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '12.5px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={15} /> Assign Ritual on This Date
              </button>
            )}
          </div>

          {/* Leave Banner if on leave */}
          {selectedDateLeaves.length > 0 && (
            <div style={{ padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '8px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={18} color="#DC2626" />
              <div>
                <strong style={{ color: '#991B1B', fontSize: '13px' }}>Marked as Leave / Unavailable:</strong>
                <span style={{ color: '#B91C1C', fontSize: '13px', marginLeft: '6px' }}>
                  {selectedDateLeaves[0].reason || 'Personal leave recorded'}
                </span>
              </div>
            </div>
          )}

          {/* Assigned Tasks List */}
          {selectedDateTasks.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedDateTasks.map(task => (
                <div 
                  key={task.id || task.task_reference} 
                  style={{ 
                    padding: '14px 16px', 
                    background: '#F8FAFC', 
                    borderRadius: '8px', 
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px', color: '#1E293B' }}>{task.ritual_name}</strong>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px', color: '#475569' }}>
                        {task.task_reference}
                      </span>
                      {task.status && (
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: 600, 
                          padding: '2px 8px', 
                          borderRadius: '10px',
                          background: task.status === 'Cancelled' ? '#FEE2E2' : '#DCFCE7',
                          color: task.status === 'Cancelled' ? '#991B1B' : '#166534'
                        }}>
                          {task.status}
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="#E04E15" /> {task.start_time} – {task.end_time || 'Finish'}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} /> {task.customer_name || 'Customer'}
                      </span>
                      {task.customer_phone && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={13} /> {task.customer_phone}
                        </span>
                      )}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} /> {task.city || 'Hyderabad'}
                      </span>
                    </div>

                    {/* WhatsApp Notification Delivery Status */}
                    {task.whatsapp_status && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCheck size={13} /> WhatsApp: {task.whatsapp_status}
                        </span>
                        {task.whatsapp_time && (
                          <span style={{ color: '#94A3B8' }}>• {new Date(task.whatsapp_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions for this task */}
                  {task.status !== 'Cancelled' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {onRescheduleTask && (
                        <button
                          onClick={() => onRescheduleTask(task)}
                          style={{
                            padding: '6px 12px',
                            background: '#EFF6FF',
                            border: '1px solid #BFDBFE',
                            color: '#1D4ED8',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Reschedule
                        </button>
                      )}
                      {onCancelTask && (
                        <button
                          onClick={() => onCancelTask(task)}
                          style={{
                            padding: '6px 12px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#DC2626',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', fontSize: '13px' }}>
              No tasks assigned on this date. Pandit is free and available for booking assignments.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
