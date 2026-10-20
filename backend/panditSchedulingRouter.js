const express = require('express');
const pool = require('./db');
const {
  formatAssignmentMessage,
  formatCancellationMessage,
  formatRescheduleMessage,
  queueNotification,
  dispatchSingleNotification,
  processOutbox,
  getHealthAndConfigStatus,
  handleWebhookStatus,
  verifyWebhook,
  sendTestNotification,
  WORKER_API_KEY
} = require('./whatsappService');

const router = express.Router();

// ---------------------------------------------------------------------------
// 1. RITUAL DURATION & TIME HELPER UTILITIES
// ---------------------------------------------------------------------------

const RITUAL_DURATIONS = {
  'Sri Satyanarayana Swamy Vratam': 150, // 2.5 hrs
  'Satyanarayana Swamy Vratam': 150,
  'Sri Maha Ganapathi Homam': 150,
  'Ganapathi Homam': 150,
  'Griha Pravesham Pooja & Vastu Homam': 210, // 3.5 hrs
  'Griha Pravesham Pooja': 210,
  'Navagraha Shanti Homam': 150,
  'Navagraha Homam': 150,
  'Maha Mrityunjaya Homam (Ayushya & Aarogya)': 180, // 3 hrs
  'Maha Mrityunjaya Homam': 180,
  'Sri Lakshmi Kubera Pooja & Homam': 120, // 2 hrs
  'Lakshmi Kubera Pooja': 120,
  'Ekadasa Rudrabhishekam': 150,
  'Rudrabhishekam': 150,
  'Sri Maha Sudarshana Homam': 180,
  'Sudarshana Homam': 180,
  'Sri Maha Chandi Homam': 240, // 4 hrs
  'Chandi Homam': 240,
  'Ayushya Homam (Child Health / Longevity)': 120,
  'Ayushya Homam': 120,
  'Vedic Vivaha (Marriage / Engagement Ceremony)': 300, // 5 hrs
  'Vivaha Rituals': 300,
  'Namakaranam (Naming / Cradle Ceremony)': 120,
  'Namakaranam & Cradle Ceremony': 120,
  'Shashti Poorthi (60th Birthday Shanti)': 180,
  'Shashti Poorthi': 180,
  'Other Special Pooja / Custom Homam': 150,
  'Custom Vedic Ritual': 150
};

function getRitualDurationMinutes(ritualName) {
  if (!ritualName) return 150;
  for (const [key, duration] of Object.entries(RITUAL_DURATIONS)) {
    if (ritualName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(ritualName.toLowerCase())) {
      return duration;
    }
  }
  if (ritualName.toLowerCase().includes('homam') || ritualName.toLowerCase().includes('havan')) return 180;
  if (ritualName.toLowerCase().includes('vivaha') || ritualName.toLowerCase().includes('marriage')) return 300;
  return 150;
}

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const str = String(timeStr).trim();

  // Handle 12-hour AM/PM: e.g. "08:30 AM" or "8:30 AM" or "08:30:00 AM"
  const match12 = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const mins = parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  }

  // Handle 24-hour: e.g. "08:30" or "08:30:00"
  const match24 = str.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    return parseInt(match24[1], 10) * 60 + parseInt(match24[2], 10);
  }

  // Handle slot strings like "Morning Muhurat (06:00 AM - 09:00 AM)"
  const slotMatch = str.match(/\((\d{1,2}:\d{2}\s*(?:AM|PM))/i);
  if (slotMatch) {
    return parseTimeToMinutes(slotMatch[1]);
  }

  return 0;
}

function minutesToTimeString12h(totalMins) {
  let hrs = Math.floor(totalMins / 60) % 24;
  const mins = totalMins % 60;
  const ampm = hrs >= 12 ? 'PM' : 'AM';
  hrs = hrs % 12;
  if (hrs === 0) hrs = 12;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${ampm}`;
}

function minutesToTimeString24h(totalMins) {
  const hrs = Math.floor(totalMins / 60) % 24;
  const mins = totalMins % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`;
}

function calculateEndTimeString(startTimeStr, durationMinutes) {
  const startMins = parseTimeToMinutes(startTimeStr);
  const endMins = startMins + durationMinutes;
  return minutesToTimeString12h(endMins);
}

function generateTaskReference() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GS-TSK-${year}${month}${day}-${rand}`;
}

function getTodayKolkataDate() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(new Date());
}

// ---------------------------------------------------------------------------
// 2. CONFLICT DETECTION ENGINE
// ---------------------------------------------------------------------------

async function checkPanditConflict({
  panditId,
  date,
  startTime,
  endTime,
  bufferMinutes = 45,
  excludeTaskId = null
}) {
  const targetDate = String(date).split('T')[0];
  const newStartMins = parseTimeToMinutes(startTime);
  const newEndMins = parseTimeToMinutes(endTime);

  // 1. Check if Pandit is on leave or unavailable
  const [leaveRows] = await pool.query(
    `SELECT * FROM pandit_availability 
     WHERE pandit_id = ? AND available_date = ? AND status IN ('unavailable', 'leave')`,
    [panditId, targetDate]
  );

  if (leaveRows && leaveRows.length > 0) {
    const leave = leaveRows[0];
    return {
      hasConflict: true,
      conflictType: 'LEAVE',
      reason: `Pandit is on ${leave.status}: ${leave.reason || 'Personal unavailability'} on ${targetDate}.`,
      details: leave
    };
  }

  // 2. Check overlapping active task assignments for this pandit on this date
  let taskQuery = `
    SELECT * FROM task_assignments 
    WHERE pandit_id = ? 
      AND scheduled_date = ? 
      AND status NOT IN ('Cancelled')
  `;
  const taskParams = [panditId, targetDate];

  if (excludeTaskId) {
    taskQuery += ` AND id != ? AND task_reference != ?`;
    taskParams.push(excludeTaskId, excludeTaskId);
  }

  const [existingTasks] = await pool.query(taskQuery, taskParams);

  for (const task of (existingTasks || [])) {
    const taskStartMins = parseTimeToMinutes(task.start_time);
    const taskEndMins = parseTimeToMinutes(task.end_time);
    const taskBuffer = task.buffer_minutes || bufferMinutes;

    // Expand interval with buffer for travel/preparation:
    // Window occupied by existing task: [taskStartMins - taskBuffer, taskEndMins + taskBuffer]
    const existingOccupiedStart = Math.max(0, taskStartMins - taskBuffer);
    const existingOccupiedEnd = taskEndMins + taskBuffer;

    // Check overlap: max(A_start, B_start) < min(A_end, B_end)
    const overlapStart = Math.max(existingOccupiedStart, newStartMins);
    const overlapEnd = Math.min(existingOccupiedEnd, newEndMins);

    if (overlapStart < overlapEnd) {
      return {
        hasConflict: true,
        conflictType: 'TASK_CONFLICT',
        reason: `Schedule conflict: Pandit is already assigned to "${task.ritual_name}" (${task.start_time} - ${task.end_time}) with a ${taskBuffer}-minute travel buffer.`,
        conflictingTask: {
          task_reference: task.task_reference,
          ritual_name: task.ritual_name,
          start_time: task.start_time,
          end_time: task.end_time,
          customer_name: task.customer_name,
          city: task.city
        }
      };
    }
  }

  return { hasConflict: false };
}

// ---------------------------------------------------------------------------
// 3. CUSTOMER BOOKING CALENDAR AVAILABILITY ENDPOINTS
// ---------------------------------------------------------------------------

const STANDARD_BOOKING_SLOTS = [
  { id: 'morning_muhurat', label: 'Morning Muhurat (06:00 AM - 09:00 AM)', start: '06:00 AM', end: '09:00 AM' },
  { id: 'forenoon', label: 'Forenoon (09:00 AM - 12:00 PM)', start: '09:00 AM', end: '12:00 PM' },
  { id: 'afternoon', label: 'Afternoon (12:00 PM - 03:30 PM)', start: '12:00 PM', end: '03:30 PM' },
  { id: 'evening_sandhya', label: 'Evening Sandhya (04:30 PM - 07:30 PM)', start: '04:30 PM', end: '07:30 PM' },
  { id: 'night_rituals', label: 'Night Rituals (07:30 PM - 10:00 PM)', start: '07:30 PM', end: '10:00 PM' }
];

/**
 * GET /api/scheduling/availability
 * Checks real pandit availability for customer booking form
 */
router.get('/availability', async (req, res) => {
  try {
    const { date, service_name, city, language } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter is required (YYYY-MM-DD).' });
    }

    const targetDate = String(date).split('T')[0];
    const todayKolkata = getTodayKolkataDate();

    const isPast = targetDate < todayKolkata;
    if (isPast) {
      return res.json({
        success: true,
        date: targetDate,
        isPast: true,
        isAvailable: false,
        message: 'Selected date is in the past. Please select today or a future date.',
        slots: []
      });
    }

    // Fetch approved pandits
    const [allPandits] = await pool.query(
      `SELECT id, name, phone, specialization, status FROM pandits WHERE status = 'Approved' OR status IS NULL`
    );

    const panditList = allPandits || [];
    const totalPandits = panditList.length;

    if (totalPandits === 0) {
      // Fallback if DB has pending pandits
      const [anyPandits] = await pool.query('SELECT id, name, phone, specialization FROM pandits');
      panditList.push(...(anyPandits || []));
    }

    const duration = getRitualDurationMinutes(service_name);

    // Evaluate each standard slot
    const evaluatedSlots = [];

    for (const slot of STANDARD_BOOKING_SLOTS) {
      const slotStartTime = slot.start;
      const slotEndTime = calculateEndTimeString(slotStartTime, duration);

      let availablePanditsCount = 0;
      const availablePanditIds = [];

      for (const p of panditList) {
        const conflictCheck = await checkPanditConflict({
          panditId: p.id,
          date: targetDate,
          startTime: slotStartTime,
          endTime: slotEndTime,
          bufferMinutes: 45
        });

        if (!conflictCheck.hasConflict) {
          availablePanditsCount++;
          availablePanditIds.push(p.id);
        }
      }

      const isSlotAvailable = availablePanditsCount > 0;

      evaluatedSlots.push({
        slotId: slot.id,
        label: slot.label,
        startTime: slotStartTime,
        endTime: slotEndTime,
        durationMinutes: duration,
        isAvailable: isSlotAvailable,
        availablePanditsCount,
        status: isSlotAvailable ? (availablePanditsCount >= 2 ? 'Available' : 'Limited Slots') : 'Fully Booked'
      });
    }

    const hasAnyAvailableSlot = evaluatedSlots.some(s => s.isAvailable);

    res.json({
      success: true,
      date: targetDate,
      isPast: false,
      isAvailable: hasAnyAvailableSlot,
      ritualDurationMinutes: duration,
      totalApprovedPandits: totalPandits,
      slots: evaluatedSlots,
      message: hasAnyAvailableSlot 
        ? 'Verified pandits are available for this date.' 
        : 'All Vedic pandits are fully booked for this date. Please select another date.'
    });
  } catch (err) {
    console.error('[Scheduling API Error]', err);
    res.status(500).json({ success: false, message: 'Failed to verify slot availability', error: err.message });
  }
});

/**
 * GET /api/scheduling/month-summary
 * Returns day-by-day availability for monthly calendar picker
 */
router.get('/month-summary', async (req, res) => {
  try {
    const { year, month } = req.query;
    const now = new Date();
    const y = parseInt(year, 10) || now.getFullYear();
    const m = parseInt(month, 10) || (now.getMonth() + 1);

    const daysInMonth = new Date(y, m, 0).getDate();
    const todayKolkata = getTodayKolkataDate();

    // Fetch all active assignments in this month
    const monthStart = `${y}-${String(m).padStart(2, '0')}-01`;
    const monthEnd = `${y}-${String(m).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

    const [assignments] = await pool.query(
      `SELECT scheduled_date, count(*) as count 
       FROM task_assignments 
       WHERE scheduled_date BETWEEN ? AND ? AND status != 'Cancelled'
       GROUP BY scheduled_date`,
      [monthStart, monthEnd]
    );

    const assignmentCountsByDate = {};
    (assignments || []).forEach(row => {
      const dStr = String(row.scheduled_date).split('T')[0];
      assignmentCountsByDate[dStr] = row.count;
    });

    const [pandits] = await pool.query('SELECT count(*) as count FROM pandits');
    const totalPandits = pandits && pandits[0] ? pandits[0].count : 3;

    const daysSummary = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayKolkata;
      const bookedCount = assignmentCountsByDate[dateStr] || 0;
      
      let status = 'available';
      if (isPast) {
        status = 'past';
      } else if (bookedCount >= totalPandits * 2) {
        status = 'fully_booked';
      } else if (bookedCount > 0) {
        status = 'limited';
      }

      daysSummary.push({
        date: dateStr,
        day,
        isPast,
        status,
        bookedTasksCount: bookedCount
      });
    }

    res.json({
      success: true,
      year: y,
      month: m,
      days: daysSummary
    });
  } catch (err) {
    console.error('[Month Summary Error]', err);
    res.status(500).json({ success: false, message: 'Failed to compute monthly availability', error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 4. PANDIT SCHEDULE & LEAVE MANAGEMENT
// ---------------------------------------------------------------------------

/**
 * GET /api/scheduling/pandits/:id/schedule
 * Full calendar & assignments for a specific pandit
 */
router.get('/pandits/:id/schedule', async (req, res) => {
  try {
    const { id } = req.params;
    const { year, month } = req.query;

    const [panditRows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [id]);
    if (!panditRows || panditRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pandit not found' });
    }

    const pandit = panditRows[0];

    // Assignments
    let query = `
      SELECT * FROM task_assignments 
      WHERE pandit_id = ? AND status != 'Cancelled'
    `;
    const params = [id];

    if (year && month) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const days = new Date(y, m, 0).getDate();
      query += ` AND scheduled_date BETWEEN ? AND ?`;
      params.push(`${y}-${String(m).padStart(2, '0')}-01`, `${y}-${String(m).padStart(2, '0')}-${String(days).padStart(2, '0')}`);
    }

    query += ' ORDER BY scheduled_date ASC, start_time ASC';
    const [tasks] = await pool.query(query, params);

    // Leaves / Unavailability
    const [leaves] = await pool.query(
      `SELECT * FROM pandit_availability WHERE pandit_id = ? ORDER BY available_date ASC`,
      [id]
    );

    res.json({
      success: true,
      pandit: {
        id: pandit.id,
        name: pandit.name,
        phone: pandit.phone,
        specialization: pandit.specialization
      },
      tasks: tasks || [],
      leaves: leaves || []
    });
  } catch (err) {
    console.error('[Pandit Schedule Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pandit schedule', error: err.message });
  }
});

/**
 * POST /api/scheduling/pandits/:id/leave
 * Add leave or marked unavailability for a pandit
 */
router.post('/pandits/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const { available_date, status = 'leave', reason } = req.body;

    if (!available_date) {
      return res.status(400).json({ success: false, message: 'available_date is required (YYYY-MM-DD)' });
    }

    const targetDate = String(available_date).split('T')[0];

    // Check if pandit already has assigned active tasks on that date
    const [activeTasks] = await pool.query(
      `SELECT * FROM task_assignments WHERE pandit_id = ? AND scheduled_date = ? AND status != 'Cancelled'`,
      [id, targetDate]
    );

    if (activeTasks && activeTasks.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot mark leave: Pandit has ${activeTasks.length} assigned ritual task(s) on ${targetDate}. Reassign or cancel the tasks first.`
      });
    }

    const [result] = await pool.query(
      `INSERT INTO pandit_availability (pandit_id, available_date, status, reason)
       VALUES (?, ?, ?, ?)`,
      [id, targetDate, status, reason || 'Leave / Unavailable']
    );

    res.status(201).json({
      success: true,
      message: 'Pandit leave / unavailability recorded successfully',
      data: { id: result.insertId, pandit_id: id, available_date: targetDate, status, reason }
    });
  } catch (err) {
    console.error('[Add Leave Error]', err);
    res.status(500).json({ success: false, message: 'Failed to record leave', error: err.message });
  }
});

/**
 * DELETE /api/scheduling/pandits/:id/leave/:leaveId
 * Remove leave
 */
router.delete('/pandits/:id/leave/:leaveId', async (req, res) => {
  try {
    const { leaveId } = req.params;
    await pool.query('DELETE FROM pandit_availability WHERE id = ?', [leaveId]);
    res.json({ success: true, message: 'Leave removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---------------------------------------------------------------------------
// 5. ADMIN TASK ASSIGNMENT WORKFLOW WITH WHATSAPP NOTIFICATIONS
// ---------------------------------------------------------------------------

/**
 * POST /api/scheduling/tasks
 * Admin assigns a task to a pandit
 */
router.post('/tasks', async (req, res) => {
  try {
    const body = req.body || {};
    const {
      booking_id,
      pandit_id,
      ritual_name,
      service_type = 'pooja',
      customer_name,
      customer_phone,
      customer_email,
      scheduled_date,
      start_time,
      end_time,
      duration_minutes,
      buffer_minutes = 45,
      service_location = 'Home',
      address,
      city,
      preferred_language = 'Telugu',
      special_instructions,
      assigned_by = 'Gnana Sudha Admin',
      override_conflict = false
    } = body;

    // Strict Validations
    if (!pandit_id) {
      return res.status(400).json({ success: false, message: 'Please select a qualified Pandit.' });
    }
    if (!ritual_name || !String(ritual_name).trim()) {
      return res.status(400).json({ success: false, message: 'Ritual / Pooja name is required.' });
    }
    if (!customer_name || !String(customer_name).trim()) {
      return res.status(400).json({ success: false, message: 'Customer name is required.' });
    }
    if (!customer_phone || !String(customer_phone).trim()) {
      return res.status(400).json({ success: false, message: 'Customer contact phone is required.' });
    }
    if (!scheduled_date) {
      return res.status(400).json({ success: false, message: 'Scheduled date is required.' });
    }
    if (!start_time) {
      return res.status(400).json({ success: false, message: 'Ritual start time is required.' });
    }
    if (!address || !String(address).trim()) {
      return res.status(400).json({ success: false, message: 'Full ritual address is required.' });
    }

    const [panditRows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [pandit_id]);
    if (!panditRows || panditRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Selected Pandit record does not exist.' });
    }
    const pandit = panditRows[0];

    const targetDate = String(scheduled_date).split('T')[0];
    const duration = parseInt(duration_minutes, 10) || getRitualDurationMinutes(ritual_name);
    const calculatedEndTime = end_time || calculateEndTimeString(start_time, duration);

    // Conflict Check
    if (!override_conflict) {
      const conflict = await checkPanditConflict({
        panditId: pandit_id,
        date: targetDate,
        startTime: start_time,
        endTime: calculatedEndTime,
        bufferMinutes: parseInt(buffer_minutes, 10) || 45
      });

      if (conflict.hasConflict) {
        return res.status(409).json({
          success: false,
          hasConflict: true,
          message: conflict.reason,
          conflictDetails: conflict
        });
      }
    }

    const taskRef = generateTaskReference();

    // 1. Insert Task Assignment
    const insertSql = `
      INSERT INTO task_assignments (
        task_reference,
        booking_id,
        pandit_id,
        ritual_name,
        service_type,
        customer_name,
        customer_phone,
        customer_email,
        scheduled_date,
        start_time,
        end_time,
        duration_minutes,
        buffer_minutes,
        service_location,
        address,
        city,
        preferred_language,
        status,
        special_instructions,
        assigned_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Assigned', ?, ?)
    `;

    const values = [
      taskRef,
      booking_id || null,
      pandit_id,
      ritual_name.trim(),
      service_type,
      customer_name.trim(),
      customer_phone.trim(),
      customer_email ? customer_email.trim() : null,
      targetDate,
      start_time,
      calculatedEndTime,
      duration,
      parseInt(buffer_minutes, 10) || 45,
      service_location,
      address.trim(),
      city ? city.trim() : 'Hyderabad',
      preferred_language,
      special_instructions ? special_instructions.trim() : null,
      assigned_by
    ];

    const [insertResult] = await pool.query(insertSql, values);
    const newTaskId = insertResult.insertId;

    // 2. Update linked Booking if applicable
    if (booking_id) {
      await pool.query(
        `UPDATE bookings 
         SET status = 'Pandit Assigned', 
             assigned_pandit_id = ?, 
             assigned_pandit_name = ? 
         WHERE id = ? OR booking_id = ?`,
        [pandit.id, pandit.name, booking_id, booking_id]
      );
    }

    // 3. Record in Task History
    await pool.query(
      `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason, metadata)
       VALUES (?, NULL, 'Assigned', ?, 'Initial task assignment by administrator', ?)`,
      [taskRef, assigned_by, JSON.stringify({ pandit_id, pandit_name: pandit.name, scheduled_date: targetDate, start_time })]
    );

    // 4. Queue WhatsApp Notification
    const messageBody = formatAssignmentMessage({
      task_reference: taskRef,
      pooja_name: ritual_name,
      ritual_date: targetDate,
      start_time,
      end_time: calculatedEndTime,
      service_address: address,
      city: city || 'Hyderabad',
      customer_name,
      customer_phone,
      special_instructions
    });

    const notifResult = await queueNotification({
      task_reference: taskRef,
      task_id: newTaskId,
      recipient_pandit_id: pandit.id,
      recipient_phone: pandit.phone,
      event_type: 'TASK_ASSIGNED',
      template_parameters: [
        pandit.name || 'Pandit Ji',
        taskRef,
        ritual_name.trim(),
        targetDate,
        `${start_time} - ${calculatedEndTime}`,
        `${address.trim()}, ${city ? city.trim() : 'Hyderabad'}`
      ],
      message_body: messageBody,
      idempotency_key: `${taskRef}_ASSIGN_${pandit.id}`
    });

    console.log(`[Task Assigned] Created task ${taskRef} for Pandit ${pandit.name}. WhatsApp status: ${notifResult.status}`);

    const [createdRows] = await pool.query('SELECT * FROM task_assignments WHERE id = ?', [newTaskId]);

    res.status(201).json({
      success: true,
      message: `Task assigned successfully to ${pandit.name}. WhatsApp notification is ${notifResult.status}.`,
      task: createdRows[0],
      notificationStatus: notifResult.status
    });
  } catch (err) {
    console.error('[Assign Task Error]', err);
    res.status(500).json({ success: false, message: 'Failed to assign ritual task', error: err.message });
  }
});

/**
 * PATCH /api/scheduling/tasks/:id/reschedule
 * Admin edits or reschedules task date, time, or location
 */
router.patch('/tasks/:id/reschedule', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const {
      scheduled_date,
      start_time,
      end_time,
      service_location,
      address,
      city,
      special_instructions,
      rescheduled_by = 'Gnana Sudha Admin',
      override_conflict = false
    } = body;

    const [rows] = await pool.query('SELECT * FROM task_assignments WHERE id = ? OR task_reference = ?', [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task assignment not found.' });
    }
    const currentTask = rows[0];

    const targetDate = scheduled_date ? String(scheduled_date).split('T')[0] : currentTask.scheduled_date;
    const newStart = start_time || currentTask.start_time;
    const newEnd = end_time || calculateEndTimeString(newStart, currentTask.duration_minutes || 150);

    // Conflict Check
    if (!override_conflict && (scheduled_date || start_time || end_time)) {
      const conflict = await checkPanditConflict({
        panditId: currentTask.pandit_id,
        date: targetDate,
        startTime: newStart,
        endTime: newEnd,
        bufferMinutes: currentTask.buffer_minutes || 45,
        excludeTaskId: currentTask.id
      });

      if (conflict.hasConflict) {
        return res.status(409).json({
          success: false,
          hasConflict: true,
          message: conflict.reason,
          conflictDetails: conflict
        });
      }
    }

    const updates = [
      '`scheduled_date` = ?',
      '`start_time` = ?',
      '`end_time` = ?',
      '`status` = "Rescheduled"'
    ];
    const params = [targetDate, newStart, newEnd];

    if (service_location) { updates.push('`service_location` = ?'); params.push(service_location); }
    if (address) { updates.push('`address` = ?'); params.push(address.trim()); }
    if (city) { updates.push('`city` = ?'); params.push(city.trim()); }
    if (special_instructions !== undefined) { updates.push('`special_instructions` = ?'); params.push(special_instructions); }

    params.push(currentTask.id);
    await pool.query(`UPDATE task_assignments SET ${updates.join(', ')} WHERE id = ?`, params);

    // Record in Task History
    await pool.query(
      `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason, metadata)
       VALUES (?, ?, 'Rescheduled', ?, 'Schedule details updated by admin', ?)`,
      [currentTask.task_reference, currentTask.status, rescheduled_by, JSON.stringify({ new_date: targetDate, new_start: newStart, new_end: newEnd })]
    );

    // Fetch Pandit info
    const [pRows] = await pool.query('SELECT phone FROM pandits WHERE id = ?', [currentTask.pandit_id]);
    const panditPhone = pRows[0]?.phone;

    // Queue WhatsApp Reschedule Notification
    const messageBody = formatRescheduleMessage({
      task_reference: currentTask.task_reference,
      pooja_name: currentTask.ritual_name,
      ritual_date: targetDate,
      start_time: newStart,
      end_time: newEnd,
      service_address: address || currentTask.address,
      city: city || currentTask.city
    });

    let notifResult = { status: 'NOT_SENT' };
    if (panditPhone) {
      notifResult = await queueNotification({
        task_reference: currentTask.task_reference,
        task_id: currentTask.id,
        recipient_pandit_id: currentTask.pandit_id,
        recipient_phone: panditPhone,
        event_type: 'TASK_RESCHEDULED',
        template_parameters: [
          currentTask.pandit_name || 'Pandit Ji',
          currentTask.task_reference,
          currentTask.ritual_name,
          targetDate,
          `${newStart} - ${newEnd}`,
          `${address || currentTask.address}, ${city || currentTask.city || 'Hyderabad'}`
        ],
        message_body: messageBody,
        idempotency_key: `${currentTask.task_reference}_RESCHEDULE_${targetDate}_${newStart.replace(/\s+/g, '')}`
      });
    }

    const [updatedRows] = await pool.query('SELECT * FROM task_assignments WHERE id = ?', [currentTask.id]);

    res.json({
      success: true,
      message: `Task rescheduled successfully. WhatsApp notification: ${notifResult.status}`,
      task: updatedRows[0]
    });
  } catch (err) {
    console.error('[Reschedule Error]', err);
    res.status(500).json({ success: false, message: 'Failed to reschedule task', error: err.message });
  }
});

/**
 * POST /api/scheduling/tasks/:id/cancel
 * Admin cancels an assigned task with a required cancellation reason
 */
router.post('/tasks/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellation_reason, cancelled_by = 'Gnana Sudha Admin' } = req.body;

    if (!cancellation_reason || !String(cancellation_reason).trim()) {
      return res.status(400).json({ success: false, message: 'Cancellation reason is required to cancel an assigned task.' });
    }

    const [rows] = await pool.query('SELECT * FROM task_assignments WHERE id = ? OR task_reference = ?', [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task assignment not found.' });
    }
    const task = rows[0];

    if (task.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Task has already been cancelled.' });
    }

    const now = new Date();
    await pool.query(
      `UPDATE task_assignments 
       SET status = 'Cancelled',
           cancellation_reason = ?,
           cancelled_at = ?,
           cancelled_by = ?
       WHERE id = ?`,
      [cancellation_reason.trim(), now, cancelled_by, task.id]
    );

    // Update linked booking status if applicable
    if (task.booking_id) {
      await pool.query(
        `UPDATE bookings 
         SET status = 'Pending Review',
             assigned_pandit_id = NULL,
             assigned_pandit_name = NULL,
             admin_notes = CONCAT(IFNULL(admin_notes, ''), '\n[Admin Cancellation] Task was cancelled. Reason: ', ?)
         WHERE id = ? OR booking_id = ?`,
        [cancellation_reason.trim(), task.booking_id, task.booking_id]
      );
    }

    // Record in Task History
    await pool.query(
      `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason)
       VALUES (?, ?, 'Cancelled', ?, ?)`,
      [task.task_reference, task.status, cancelled_by, cancellation_reason.trim()]
    );

    // Fetch Pandit info
    const [pRows] = await pool.query('SELECT phone FROM pandits WHERE id = ?', [task.pandit_id]);
    const panditPhone = pRows[0]?.phone;

    // Queue WhatsApp Cancellation Notice
    const messageBody = formatCancellationMessage({
      task_reference: task.task_reference,
      pooja_name: task.ritual_name,
      ritual_date: task.scheduled_date,
      start_time: task.start_time,
      end_time: task.end_time,
      cancellation_reason: cancellation_reason.trim()
    });

    let notifResult = { status: 'NOT_SENT' };
    if (panditPhone) {
      notifResult = await queueNotification({
        task_reference: task.task_reference,
        task_id: task.id,
        recipient_pandit_id: task.pandit_id,
        recipient_phone: panditPhone,
        event_type: 'TASK_CANCELLED',
        template_parameters: [
          task.pandit_name || 'Pandit Ji',
          task.task_reference,
          task.ritual_name,
          task.scheduled_date,
          `${task.start_time} - ${task.end_time || ''}`,
          cancellation_reason.trim()
        ],
        message_body: messageBody,
        idempotency_key: `${task.task_reference}_CANCEL_${task.pandit_id}`
      });
    }

    res.json({
      success: true,
      message: `Task ${task.task_reference} has been cancelled and slot released. WhatsApp notification: ${notifResult.status}`,
      notificationStatus: notifResult.status
    });
  } catch (err) {
    console.error('[Cancel Task Error]', err);
    res.status(500).json({ success: false, message: 'Failed to cancel task', error: err.message });
  }
});

/**
 * POST /api/scheduling/tasks/:id/reassign
 * Reassign task from current pandit to a new pandit
 */
router.post('/tasks/:id/reassign', async (req, res) => {
  try {
    const { id } = req.params;
    const { new_pandit_id, reassigned_by = 'Gnana Sudha Admin', override_conflict = false } = req.body;

    if (!new_pandit_id) {
      return res.status(400).json({ success: false, message: 'New pandit selection is required.' });
    }

    const [rows] = await pool.query('SELECT * FROM task_assignments WHERE id = ? OR task_reference = ?', [id, id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task assignment not found.' });
    }
    const task = rows[0];

    const [newPanditRows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [new_pandit_id]);
    if (!newPanditRows || newPanditRows.length === 0) {
      return res.status(404).json({ success: false, message: 'New pandit not found.' });
    }
    const newPandit = newPanditRows[0];

    // Conflict Check for new pandit
    if (!override_conflict) {
      const conflict = await checkPanditConflict({
        panditId: new_pandit_id,
        date: task.scheduled_date,
        startTime: task.start_time,
        endTime: task.end_time,
        bufferMinutes: task.buffer_minutes || 45
      });

      if (conflict.hasConflict) {
        return res.status(409).json({
          success: false,
          hasConflict: true,
          message: `New pandit has a conflict: ${conflict.reason}`,
          conflictDetails: conflict
        });
      }
    }

    // Previous pandit notification
    const [prevPanditRows] = await pool.query('SELECT * FROM pandits WHERE id = ?', [task.pandit_id]);
    const prevPandit = prevPanditRows[0];

    await pool.query(
      `UPDATE task_assignments 
       SET pandit_id = ? 
       WHERE id = ?`,
      [new_pandit_id, task.id]
    );

    if (task.booking_id) {
      await pool.query(
        `UPDATE bookings 
         SET assigned_pandit_id = ?, assigned_pandit_name = ? 
         WHERE id = ? OR booking_id = ?`,
        [newPandit.id, newPandit.name, task.booking_id, task.booking_id]
      );
    }

    // Record History
    await pool.query(
      `INSERT INTO task_history (task_reference, previous_status, new_status, changed_by, change_reason, metadata)
       VALUES (?, 'Assigned', 'Reassigned', ?, 'Reassigned by admin', ?)`,
      [task.task_reference, reassigned_by, JSON.stringify({ from_pandit_id: task.pandit_id, to_pandit_id: new_pandit_id })]
    );

    // 1. Notify previous pandit of reassignment (release)
    if (prevPandit && prevPandit.phone) {
      const prevMessage = `🙏 *Gnana Sudha — Schedule Update*

Namaste, Pandit Ji.
Ritual task \`${task.task_reference}\` (${task.ritual_name} on ${task.scheduled_date}) has been reassigned to another Vedic scholar.

Your calendar has been updated. Thank you.`;
      await queueNotification({
        task_reference: task.task_reference,
        task_id: task.id,
        recipient_pandit_id: prevPandit.id,
        recipient_phone: prevPandit.phone,
        event_type: 'TASK_REASSIGNED',
        template_parameters: [
          prevPandit.name || 'Pandit Ji',
          task.task_reference,
          task.ritual_name,
          task.scheduled_date
        ],
        message_body: prevMessage,
        idempotency_key: `${task.task_reference}_REASSIGN_PREV_${prevPandit.id}`
      });
    }

    // 2. Notify new pandit of new assignment
    const newPanditMessage = formatAssignmentMessage({
      task_reference: task.task_reference,
      pooja_name: task.ritual_name,
      ritual_date: task.scheduled_date,
      start_time: task.start_time,
      end_time: task.end_time,
      service_address: task.address,
      city: task.city,
      customer_name: task.customer_name,
      customer_phone: task.customer_phone,
      special_instructions: task.special_instructions
    });

    await queueNotification({
      task_reference: task.task_reference,
      task_id: task.id,
      recipient_pandit_id: newPandit.id,
      recipient_phone: newPandit.phone,
      event_type: 'TASK_ASSIGNED',
      template_parameters: [
        newPandit.name || 'Pandit Ji',
        task.task_reference,
        task.ritual_name,
        task.scheduled_date,
        `${task.start_time} - ${task.end_time || ''}`,
        `${task.address}, ${task.city || 'Hyderabad'}`
      ],
      message_body: newPanditMessage,
      idempotency_key: `${task.task_reference}_REASSIGN_NEW_${newPandit.id}`
    });

    res.json({
      success: true,
      message: `Task successfully reassigned to ${newPandit.name}. Both pandits notified via WhatsApp.`
    });
  } catch (err) {
    console.error('[Reassign Error]', err);
    res.status(500).json({ success: false, message: 'Failed to reassign task', error: err.message });
  }
});

/**
 * GET /api/scheduling/tasks
 * List task assignments with filtering
 */
router.get('/tasks', async (req, res) => {
  try {
    const { pandit_id, date, status, search } = req.query;

    let query = `
      SELECT t.*, p.name as pandit_name, p.phone as pandit_phone
      FROM task_assignments t
      LEFT JOIN pandits p ON t.pandit_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (pandit_id) { query += ' AND t.pandit_id = ?'; params.push(pandit_id); }
    if (date) { query += ' AND t.scheduled_date = ?'; params.push(String(date).split('T')[0]); }
    if (status && status !== 'All') { query += ' AND t.status = ?'; params.push(status); }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ` AND (
        t.task_reference LIKE ? OR 
        t.customer_name LIKE ? OR 
        t.customer_phone LIKE ? OR 
        t.ritual_name LIKE ? OR 
        p.name LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY t.id DESC';
    const [rows] = await pool.query(query, params);

    res.json({
      success: true,
      data: rows || []
    });
  } catch (err) {
    console.error('[Fetch Tasks Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: err.message });
  }
});

/**
 * GET /api/scheduling/notifications
 * List WhatsApp notification log with status and reference filters
 */
router.get('/notifications', async (req, res) => {
  try {
    const { task_reference, status, limit = 50 } = req.query;
    let query = `
      SELECT n.*, p.name as pandit_name
      FROM whatsapp_notifications n
      LEFT JOIN pandits p ON n.recipient_pandit_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (task_reference) {
      query += ' AND n.task_reference = ?';
      params.push(task_reference);
    }

    if (status && status !== 'All') {
      query += ' AND n.delivery_status = ?';
      params.push(status);
    }

    query += ' ORDER BY n.id DESC LIMIT ?';
    params.push(parseInt(limit, 10) || 50);

    const [rows] = await pool.query(query, params);
    res.json({
      success: true,
      data: rows || [],
      notifications: rows || []
    });
  } catch (err) {
    console.error('[Fetch Notifications Error]', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: err.message });
  }
});

/**
 * POST /api/scheduling/notifications/:id/retry
 * Manually retry sending a WhatsApp notification
 */
router.post('/notifications/:id/retry', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await dispatchSingleNotification(id);
    const [updatedRows] = await pool.query('SELECT * FROM whatsapp_notifications WHERE id = ?', [id]);
    res.json({
      success: result.success,
      message: result.success ? 'Notification accepted by Meta Graph API.' : `Dispatch result: ${result.error || result.status}`,
      notification: updatedRows[0] || null,
      details: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retry notification', error: err.message });
  }
});

/**
 * GET /api/scheduling/whatsapp/status
 * Health check & configuration status page for WhatsApp API integration
 */
router.get('/whatsapp/status', async (req, res) => {
  try {
    const statusData = await getHealthAndConfigStatus();
    res.json(statusData);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/scheduling/whatsapp/process-outbox
 * POST /api/scheduling/whatsapp/worker/tick
 * Trigger outbox processing batch (used by admin dashboard or Hostinger Cron Job)
 */
router.post(['/whatsapp/process-outbox', '/whatsapp/worker/tick'], async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || req.body?.limit || 15, 10);
    const result = await processOutbox({ limit });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/scheduling/whatsapp/test-message
 * Send a controlled test message to an authorized test recipient
 */
router.post('/whatsapp/test-message', async (req, res) => {
  try {
    const { recipientPhone, message } = req.body || {};
    if (!recipientPhone) {
      return res.status(400).json({
        success: false,
        message: 'Recipient mobile number is required (e.g. 9848012345 or +919848012345).'
      });
    }

    const result = await sendTestNotification({
      recipientPhone,
      customText: message
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Webhook endpoints (challenge handshake & delivery receipts)
router.get('/whatsapp/webhook', verifyWebhook);
router.post('/whatsapp/webhook', handleWebhookStatus);

module.exports = {
  panditSchedulingRouter: router,
  checkPanditConflict,
  getRitualDurationMinutes,
  calculateEndTimeString
};
