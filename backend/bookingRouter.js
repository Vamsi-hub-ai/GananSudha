const express = require('express');
const pool = require('./db');
const { 
  checkPanditConflict, 
  getRitualDurationMinutes, 
  calculateEndTimeString 
} = require('./panditSchedulingRouter');
const {
  formatAssignmentMessage,
  formatCancellationMessage,
  queueNotification
} = require('./whatsappService');

const router = express.Router();

// Helper: Generate Unique Human-Readable Booking Reference
function generateBookingReference() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePart = `${year}${month}${day}`;
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GS-BKG-${datePart}-${randomChars}`;
}

// -------------------------------------------------------------
// 1. GET /api/bookings - Fetch bookings with search & status filters
// -------------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { status, search, customerId, customerPhone, limit } = req.query;

    let query = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (customerId) {
      query += ' AND customer_id = ?';
      params.push(customerId);
    }

    if (customerPhone) {
      query += ' AND customer_phone LIKE ?';
      params.push(`%${customerPhone.trim()}%`);
    }

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ` AND (
        booking_id LIKE ? 
        OR customer_name LIKE ? 
        OR customer_phone LIKE ? 
        OR service_name LIKE ? 
        OR city LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY id DESC';

    if (limit && parseInt(limit, 10) > 0) {
      query += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      data: rows || []
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: err.message });
  }
});

// -------------------------------------------------------------
// 2. GET /api/bookings/:id - Single booking lookup (by ID or booking_id)
// -------------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ? OR booking_id = ?', [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch booking details', error: err.message });
  }
});

// -------------------------------------------------------------
// 3. POST /api/bookings - Create Real Customer Booking
// -------------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    const {
      service_id,
      service_type = 'pooja',
      service_name,
      customer_id,
      customer_name,
      customer_phone,
      customer_email,
      preferred_date,
      preferred_time,
      service_location = 'Home',
      address,
      city,
      preferred_language = 'Telugu',
      additional_requirements,
      special_instructions
    } = body;

    // Strict validation
    if (!service_name || !String(service_name).trim()) {
      return res.status(400).json({ success: false, message: 'Selected ritual or service is required.' });
    }
    if (!customer_name || !String(customer_name).trim()) {
      return res.status(400).json({ success: false, message: 'Customer full name is required.' });
    }
    if (!customer_phone || !String(customer_phone).trim()) {
      return res.status(400).json({ success: false, message: 'Valid mobile number is required.' });
    }
    const cleanPhone = String(customer_phone).replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Mobile number must be at least 10 digits.' });
    }
    if (!preferred_date || !String(preferred_date).trim()) {
      return res.status(400).json({ success: false, message: 'Preferred date for ritual is required.' });
    }

    const targetDate = String(preferred_date).split('T')[0];
    const kolkataToday = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    if (targetDate < kolkataToday) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date cannot be in the past. Please select today or a future date.'
      });
    }

    if (!city || !String(city).trim()) {
      return res.status(400).json({ success: false, message: 'City is required.' });
    }
    if (!address || !String(address).trim()) {
      return res.status(400).json({ success: false, message: 'Complete service address is required.' });
    }

    const bookingRef = generateBookingReference();
    const initialStatus = 'Pending Review';

    const insertSql = `
      INSERT INTO bookings (
        booking_id,
        service_id,
        service_type,
        service_name,
        customer_id,
        customer_name,
        customer_phone,
        customer_email,
        preferred_date,
        preferred_time,
        service_location,
        address,
        city,
        preferred_language,
        additional_requirements,
        special_instructions,
        status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      bookingRef,
      service_id || null,
      service_type,
      service_name.trim(),
      customer_id || null,
      customer_name.trim(),
      customer_phone.trim(),
      customer_email ? customer_email.trim() : null,
      preferred_date,
      preferred_time ? preferred_time.trim() : 'Morning Muhurat (09:00 AM)',
      service_location,
      address.trim(),
      city.trim(),
      preferred_language,
      additional_requirements ? additional_requirements.trim() : null,
      special_instructions ? special_instructions.trim() : null,
      initialStatus
    ];

    const [result] = await pool.query(insertSql, values);
    const newId = result.insertId;

    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [newId]);
    const createdBooking = rows[0] || {
      id: newId,
      booking_id: bookingRef,
      service_name,
      customer_name,
      preferred_date,
      status: initialStatus
    };

    console.log(`[Bookings] Created real booking ${bookingRef} for ${customer_name} (${service_name})`);

    res.status(201).json({
      success: true,
      message: 'Your booking has been received and scheduled for administrative review.',
      data: createdBooking
    });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, message: 'Failed to create booking in database', error: err.message });
  }
});

// -------------------------------------------------------------
// 4. PATCH /api/bookings/:id - Admin Pandit Assignment & Status Transitions
// -------------------------------------------------------------
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const {
      status,
      assigned_pandit_id,
      assigned_pandit_name,
      preferred_date,
      preferred_time,
      admin_notes,
      cancellation_reason
    } = body;

    const [existing] = await pool.query('SELECT * FROM bookings WHERE id = ? OR booking_id = ?', [id, id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    const current = existing[0];
    const updates = [];
    const params = [];

    const validStatuses = [
      'Pending Review',
      'Awaiting Customer Confirmation',
      'Confirmed',
      'Pandit Assigned',
      'In Progress',
      'Completed',
      'Cancelled',
      'Rejected'
    ];

    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
      }
      updates.push('`status` = ?');
      params.push(status);
    }

    if (assigned_pandit_id !== undefined) {
      updates.push('`assigned_pandit_id` = ?');
      params.push(assigned_pandit_id || null);
    }

    if (assigned_pandit_name !== undefined) {
      updates.push('`assigned_pandit_name` = ?');
      params.push(assigned_pandit_name || null);
    }

    if (preferred_date !== undefined) {
      updates.push('`preferred_date` = ?');
      params.push(preferred_date);
    }

    if (preferred_time !== undefined) {
      updates.push('`preferred_time` = ?');
      params.push(preferred_time);
    }

    if (admin_notes !== undefined) {
      updates.push('`admin_notes` = ?');
      params.push(admin_notes);
    }

    if (cancellation_reason !== undefined) {
      updates.push('`cancellation_reason` = ?');
      params.push(cancellation_reason);
    }

    // 1. Conflict checking when assigning a pandit
    if (assigned_pandit_id && assigned_pandit_id !== current.assigned_pandit_id) {
      const targetDate = preferred_date || current.preferred_date;
      const targetTime = preferred_time || current.preferred_time || '08:30 AM';
      const duration = getRitualDurationMinutes(current.service_name);
      const calculatedEnd = calculateEndTimeString(targetTime, duration);

      const conflict = await checkPanditConflict({
        panditId: assigned_pandit_id,
        date: targetDate,
        startTime: targetTime,
        endTime: calculatedEnd,
        bufferMinutes: 45
      });

      if (conflict.hasConflict && !body.override_conflict) {
        return res.status(409).json({
          success: false,
          hasConflict: true,
          message: conflict.reason,
          conflictDetails: conflict
        });
      }
    }

    if (updates.length === 0) {
      return res.json({ success: true, data: current });
    }

    const updateSql = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ?`;
    params.push(current.id);

    await pool.query(updateSql, params);

    const [updatedRows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [current.id]);
    const updatedBooking = updatedRows[0];

    // 2. Synchronize with task_assignments and WhatsApp
    let notificationStatus = null;

    if (assigned_pandit_id && assigned_pandit_id !== current.assigned_pandit_id) {
      // Find pandit details
      const [pRows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [assigned_pandit_id]);
      const assignedPandit = pRows[0];

      if (assignedPandit) {
        const now = new Date();
        const datePart = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
        const taskRef = `GS-TSK-${datePart}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const duration = getRitualDurationMinutes(updatedBooking.service_name);
        const startTime = updatedBooking.preferred_time || '08:30 AM';
        const endTime = calculateEndTimeString(startTime, duration);

        await pool.query(
          `INSERT INTO task_assignments (
            task_reference, booking_id, pandit_id, ritual_name, service_type,
            customer_name, customer_phone, customer_email, scheduled_date,
            start_time, end_time, duration_minutes, buffer_minutes,
            service_location, address, city, preferred_language, status,
            special_instructions, assigned_by
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 45, ?, ?, ?, ?, 'Assigned', ?, 'Gnana Sudha Admin')`,
          [
            taskRef, updatedBooking.id, assignedPandit.id, updatedBooking.service_name,
            updatedBooking.service_type || 'pooja', updatedBooking.customer_name,
            updatedBooking.customer_phone, updatedBooking.customer_email || null,
            updatedBooking.preferred_date, startTime, endTime, duration,
            updatedBooking.service_location || 'Home', updatedBooking.address,
            updatedBooking.city, updatedBooking.preferred_language || 'Telugu',
            updatedBooking.special_instructions || null
          ]
        );

        // Record Task History
        await pool.query(
          `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason)
           VALUES (?, NULL, 'Assigned', 'Gnana Sudha Admin', 'Assigned from booking review coordination')`,
          [taskRef]
        );

        // Queue WhatsApp Message
        const msg = formatAssignmentMessage({
          task_reference: taskRef,
          pooja_name: updatedBooking.service_name,
          ritual_date: updatedBooking.preferred_date,
          start_time: startTime,
          end_time: endTime,
          service_address: updatedBooking.address,
          city: updatedBooking.city,
          customer_name: updatedBooking.customer_name,
          customer_phone: updatedBooking.customer_phone,
          special_instructions: updatedBooking.special_instructions
        });

        const notifResult = await queueNotification({
          task_reference: taskRef,
          recipient_pandit_id: assignedPandit.id,
          recipient_phone: assignedPandit.phone,
          event_type: 'TASK_ASSIGNED',
          message_body: msg
        });
        notificationStatus = notifResult.status;
      }
    } else if (status === 'Cancelled' && current.assigned_pandit_id) {
      // Find linked tasks
      const [tasks] = await pool.query('SELECT * FROM task_assignments WHERE booking_id = ? AND status != "Cancelled"', [current.id]);
      for (const t of (tasks || [])) {
        await pool.query(
          `UPDATE task_assignments 
           SET status = 'Cancelled', cancellation_reason = ?, cancelled_at = NOW(), cancelled_by = 'Gnana Sudha Admin' 
           WHERE id = ?`,
          [cancellation_reason || 'Booking cancelled by admin', t.id]
        );

        // Record history
        await pool.query(
          `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason)
           VALUES (?, ?, 'Cancelled', 'Gnana Sudha Admin', ?)`,
          [t.task_reference, t.status, cancellation_reason || 'Booking cancelled']
        );

        const [pRows] = await pool.query('SELECT phone FROM pandits WHERE id = ?', [t.pandit_id]);
        if (pRows[0]?.phone) {
          const cancelMsg = formatCancellationMessage({
            task_reference: t.task_reference,
            pooja_name: t.ritual_name,
            ritual_date: t.scheduled_date,
            start_time: t.start_time,
            end_time: t.end_time,
            cancellation_reason: cancellation_reason || 'Booking cancelled by customer or admin'
          });

          await queueNotification({
            task_reference: t.task_reference,
            recipient_pandit_id: t.pandit_id,
            recipient_phone: pRows[0].phone,
            event_type: 'TASK_CANCELLED',
            message_body: cancelMsg
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking,
      notificationStatus
    });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ success: false, message: 'Failed to update booking', error: err.message });
  }
});

// -------------------------------------------------------------
// 5. DELETE /api/bookings/:id - Admin Booking Deletion
// -------------------------------------------------------------
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM bookings WHERE id = ? OR booking_id = ?', [id, id]);
    res.json({ success: true, message: 'Booking removed successfully' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ success: false, message: 'Failed to delete booking', error: err.message });
  }
});

module.exports = { bookingRouter: router };
