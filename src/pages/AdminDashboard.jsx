import React, { useState, useContext, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Box, Grid, Archive, Star, Flame,
  UserSquare2, CalendarDays, Users, CreditCard, Ticket, MessageSquare,
  Bell, FileText, BarChart3, Settings, LogOut, Menu,
  Search, Moon, Sun, Globe, MoreHorizontal, Calendar,
  Plus, CheckCircle2, BoxSelect, UserPlus, Save, Trash2, Key, Check,
  Download, Clock, ChevronRight, ChevronDown, Flower2, CalendarClock,
  Image as ImageIcon, RefreshCw, IndianRupee, Truck,
  Eye, Printer, X, ExternalLink, Send, CheckCheck, AlertTriangle,
  Phone, MapPin, Loader2, Film
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import AdminBannerManager from '../components/AdminBannerManager';
import AdminFestivalManager from '../components/AdminFestivalManager';
import AdminYouTubeManager from '../components/AdminYouTubeManager';
import '../Admin.css';

// Mock data removed as per request for real-time data

const resizeImage = (file, callback) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 500;
      const MAX_HEIGHT = 500;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.7)); // Compress to jpeg 70% quality
    };
    img.onerror = () => callback(e.target.result); // Fallback
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};
function AdminDashboard() {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(() => {
    if (location.pathname.includes('/banners')) return 'Banners';
    if (location.pathname.includes('/youtube') || location.pathname.includes('/videos')) return 'YouTube Videos';
    return 'Dashboard';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('/banners')) {
      setActiveMenu('Banners');
    } else if (location.pathname.includes('/youtube') || location.pathname.includes('/videos')) {
      setActiveMenu('YouTube Videos');
    }
  }, [location.pathname]);

  // Global Context State
  const {
    poojas, addPooja, deletePooja, updatePooja,
    homams, addHomam, deleteHomam, updateHomam,
    pandits, addPandit, approvePandit, updatePandit, deletePandit,
    products, addProduct, deleteProduct, updateProduct, updateProductStock,
    categories, addCategory, deleteCategory,
    paymentSettings, updatePaymentSettings,
    adminUsers, addAdminUser, deleteAdminUser, updateAdminUser, currentAdmin, setCurrentAdmin, currentCustomer, logout,
    orders, updateOrderStatus, updateOrderTracking,
    customers, coupons, addCoupon, deleteCoupon,
    consultations, setConsultations, updateConsultation,
    reviews, fetchReviews, deleteReview,
    dashboardStats, fetchDashboardStats, fetchAdminCustomers, fetchAdminReports,
    bookings, fetchBookings, updateBooking, deleteBooking
  } = useContext(DataContext);
  const { language, setLanguage } = useLanguage();
  const currentAdminUser = currentAdmin;
  const setCurrentAdminUser = setCurrentAdmin;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [courierInput, setCourierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [estimatedDeliveryInput, setEstimatedDeliveryInput] = useState('');
  const [trackingFeedback, setTrackingFeedback] = useState('');
  
  // Real-time Data Sync State
  const [adminCustomersList, setAdminCustomersList] = useState([]);
  const [adminReportsData, setAdminReportsData] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('7d');
  const [settingsActiveTab, setSettingsActiveTab] = useState('gateway');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [consultationSaveStatus, setConsultationSaveStatus] = useState({});
  const [isRefreshingStats, setIsRefreshingStats] = useState(false);
  const [reviewActionMsg, setReviewActionMsg] = useState('');
  const [lastSyncTime, setLastSyncTime] = useState(() => new Date());
  const [syncStatus, setSyncStatus] = useState('active');

  // Dedicated Spiritual Bookings State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingStatusInput, setBookingStatusInput] = useState('Pending Review');
  const [bookingPanditIdInput, setBookingPanditIdInput] = useState('');
  const [bookingDateInput, setBookingDateInput] = useState('');
  const [bookingTimeInput, setBookingTimeInput] = useState('');
  const [bookingAdminNotesInput, setBookingAdminNotesInput] = useState('');
  const [bookingCancelReasonInput, setBookingCancelReasonInput] = useState('');
  const [bookingActionFeedback, setBookingActionFeedback] = useState('');
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [bookingFilterStartDate, setBookingFilterStartDate] = useState('');
  const [bookingFilterEndDate, setBookingFilterEndDate] = useState('');

  // Pandit Task Assignment & Scheduling State
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [assignTaskForm, setAssignTaskForm] = useState({
    pandit_id: '',
    ritual_name: 'Sri Satyanarayana Swamy Vratam',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    service_location: 'Home',
    service_address: '',
    city: 'Hyderabad',
    scheduled_date: '',
    start_time: '09:00 AM',
    duration_minutes: 150,
    special_instructions: '',
    booking_id: null
  });
  const [assignTaskConflict, setAssignTaskConflict] = useState(null);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [assignTaskFeedback, setAssignTaskFeedback] = useState('');

  // Task Reschedule State
  const [reschedulingTask, setReschedulingTask] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('09:00 AM');
  const [rescheduleReason, setRescheduleReason] = useState('');
  const [rescheduleConflict, setRescheduleConflict] = useState(null);
  const [isSubmittingReschedule, setIsSubmittingReschedule] = useState(false);
  const [rescheduleFeedback, setRescheduleFeedback] = useState('');

  // Task Cancel State
  const [cancellingTask, setCancellingTask] = useState(null);
  const [cancelTaskReason, setCancelTaskReason] = useState('');
  const [isSubmittingCancelTask, setIsSubmittingCancelTask] = useState(false);
  const [cancelTaskFeedback, setCancelTaskFeedback] = useState('');

  // WhatsApp Configuration & Notifications Outbox State
  const [whatsappStatus, setWhatsappStatus] = useState(null);
  const [whatsappNotifications, setWhatsappNotifications] = useState([]);
  const [isLoadingWhatsapp, setIsLoadingWhatsapp] = useState(false);
  const [whatsappRetryFeedback, setWhatsappRetryFeedback] = useState('');
  const [whatsappStatusFilter, setWhatsappStatusFilter] = useState('All');
  const [testPhoneInput, setTestPhoneInput] = useState('+91 92818 67002');
  const [testMessageFeedback, setTestMessageFeedback] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [isProcessingOutbox, setIsProcessingOutbox] = useState(false);

  // Top Header State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keep Admin portal strictly in English so customer storefront Telugu does not leak into Admin
  useEffect(() => {
    if (language !== 'en' && typeof window !== 'undefined') {
      try {
        localStorage.setItem('gs_language', 'en');
        if (setLanguage) setLanguage('en');
      } catch {
        // ignore
      }
    }
  }, [language, setLanguage]);

  // Initial and reactive data fetching with 12s controlled polling
  useEffect(() => {
    fetchDashboardStats();
    fetchBookings();
    fetchReviews();
    fetchAdminCustomers().then(data => setAdminCustomersList(data || []));
    fetchAdminReports().then(data => setAdminReportsData(data || null));

    const pollInterval = setInterval(async () => {
      try {
        await Promise.all([
          fetchDashboardStats(),
          fetchBookings()
        ]);
        setLastSyncTime(new Date());
        setSyncStatus('active');
      } catch {
        setSyncStatus('error');
      }
    }, 12000);

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    if (activeMenu === 'Dashboard') {
      fetchDashboardStats();
      fetchBookings();
    } else if (activeMenu === 'Bookings') {
      fetchBookings();
    } else if (activeMenu === 'Reviews') {
      fetchReviews();
    } else if (activeMenu === 'Customers') {
      fetchAdminCustomers().then(data => setAdminCustomersList(data || []));
    } else if (activeMenu === 'Reports') {
      fetchAdminReports().then(data => setAdminReportsData(data || null));
    }
  }, [activeMenu]);

  const handleRefreshAll = async () => {
    setIsRefreshingStats(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchBookings(),
        fetchReviews(),
        fetchAdminCustomers().then(data => setAdminCustomersList(data || [])),
        fetchAdminReports().then(data => setAdminReportsData(data || null))
      ]);
      setLastSyncTime(new Date());
      setSyncStatus('active');
    } catch {
      setSyncStatus('error');
    } finally {
      setIsRefreshingStats(false);
    }
  };

  const openBookingDetails = (b) => {
    setSelectedBooking(b);
    setBookingStatusInput(b.status || 'Pending Review');
    setBookingPanditIdInput(b.assigned_pandit_id ? String(b.assigned_pandit_id) : '');
    setBookingDateInput(b.preferred_date ? b.preferred_date.split('T')[0] : '');
    setBookingTimeInput(b.preferred_time || '');
    setBookingAdminNotesInput(b.admin_notes || '');
    setBookingCancelReasonInput(b.cancellation_reason || '');
    setBookingActionFeedback('');
  };

  const handleSaveBooking = async () => {
    if (!selectedBooking) return;
    setBookingActionFeedback('Updating booking...');
    try {
      const selectedPanditObj = pandits.find(p => String(p.id) === String(bookingPanditIdInput));
      const updates = {
        status: bookingStatusInput,
        assigned_pandit_id: bookingPanditIdInput ? Number(bookingPanditIdInput) : null,
        assigned_pandit_name: selectedPanditObj ? selectedPanditObj.name : null,
        preferred_date: bookingDateInput || selectedBooking.preferred_date,
        preferred_time: bookingTimeInput || selectedBooking.preferred_time,
        admin_notes: bookingAdminNotesInput,
        cancellation_reason: bookingCancelReasonInput
      };
      const res = await updateBooking(selectedBooking.id, updates);
      if (res && res.success) {
        setBookingActionFeedback('Booking updated successfully! Notification queued for assigned Pandit.');
        setSelectedBooking(res.booking || { ...selectedBooking, ...updates });
        await fetchDashboardStats();
        await fetchBookings();
        setTimeout(() => setBookingActionFeedback(''), 3500);
      } else {
        setBookingActionFeedback((res && (res.message || res.error)) || 'Failed to update booking.');
      }
    } catch {
      setBookingActionFeedback('Network error updating booking.');
    }
  };

  const fetchWhatsappData = async () => {
    setIsLoadingWhatsapp(true);
    try {
      const [statusRes, notifsRes] = await Promise.all([
        fetch('/api/scheduling/whatsapp/status'),
        fetch('/api/scheduling/notifications?limit=100')
      ]);
      const statusData = await statusRes.json();
      const notifsData = await notifsRes.json();
      if (statusData && statusData.success) {
        setWhatsappStatus(statusData);
      }
      if (notifsData && notifsData.success) {
        setWhatsappNotifications(notifsData.notifications || notifsData.data || []);
      }
    } catch (err) {
      console.warn('Failed to fetch WhatsApp logs:', err);
    } finally {
      setIsLoadingWhatsapp(false);
    }
  };

  useEffect(() => {
    if (settingsActiveTab === 'whatsapp' || activeMenu === 'Bookings') {
      fetchWhatsappData();
    }
  }, [settingsActiveTab, activeMenu]);

  const handleCreateTaskAssignment = async (e) => {
    if (e) e.preventDefault();
    setAssignTaskConflict(null);
    setAssignTaskFeedback('');

    if (!assignTaskForm.pandit_id) {
      alert('Please select a verified Vedic Pandit.');
      return;
    }
    if (!assignTaskForm.ritual_name.trim()) {
      alert('Please enter or select a ritual name.');
      return;
    }
    if (!assignTaskForm.customer_name.trim()) {
      alert('Please enter the devotee/customer name.');
      return;
    }
    if (!assignTaskForm.customer_phone.trim()) {
      alert('Please enter the devotee/customer phone number.');
      return;
    }
    if (!assignTaskForm.scheduled_date) {
      alert('Please select the scheduled ritual date.');
      return;
    }

    setIsSubmittingTask(true);
    try {
      const res = await fetch('/api/scheduling/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignTaskForm)
      });
      const data = await res.json();
      if (res.status === 409 || data.conflict) {
        setAssignTaskConflict(data);
      } else if (data.success) {
        setAssignTaskFeedback(`Task ${data.task?.task_reference || ''} assigned successfully! WhatsApp notification dispatched.`);
        await fetchBookings();
        await fetchWhatsappData();
        setTimeout(() => {
          setIsAssignTaskModalOpen(false);
          setAssignTaskFeedback('');
          setAssignTaskConflict(null);
        }, 1800);
      } else {
        alert(data.message || 'Failed to assign task');
      }
    } catch (err) {
      console.error('Task assignment error:', err);
      alert('Network error while assigning task.');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleConfirmCancelTask = async () => {
    if (!cancellingTask) return;
    if (!cancelTaskReason.trim()) {
      alert('Please provide a reason for cancelling this ritual task.');
      return;
    }
    setIsSubmittingCancelTask(true);
    setCancelTaskFeedback('');
    try {
      const res = await fetch(`/api/scheduling/tasks/${cancellingTask.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelTaskReason.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setCancelTaskFeedback('Task cancelled. Reserved slot released and cancellation WhatsApp notification dispatched.');
        await fetchBookings();
        await fetchWhatsappData();
        setTimeout(() => {
          setCancellingTask(null);
          setCancelTaskFeedback('');
          setCancelTaskReason('');
        }, 1800);
      } else {
        alert(data.message || 'Failed to cancel task');
      }
    } catch (err) {
      alert('Network error cancelling task');
    } finally {
      setIsSubmittingCancelTask(false);
    }
  };

  const handleConfirmRescheduleTask = async () => {
    if (!reschedulingTask) return;
    if (!rescheduleDate) {
      alert('Please pick a new scheduled date.');
      return;
    }
    setIsSubmittingReschedule(true);
    setRescheduleConflict(null);
    setRescheduleFeedback('');
    try {
      const res = await fetch(`/api/scheduling/tasks/${reschedulingTask.id}/reschedule`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheduled_date: rescheduleDate,
          start_time: rescheduleTime,
          reason: rescheduleReason.trim()
        })
      });
      const data = await res.json();
      if (res.status === 409 || data.conflict) {
        setRescheduleConflict(data);
      } else if (data.success) {
        setRescheduleFeedback('Task successfully rescheduled and pandit updated via WhatsApp!');
        await fetchBookings();
        await fetchWhatsappData();
        setTimeout(() => {
          setReschedulingTask(null);
          setRescheduleFeedback('');
          setRescheduleConflict(null);
        }, 1800);
      } else {
        alert(data.message || 'Failed to reschedule task');
      }
    } catch (err) {
      alert('Network error rescheduling task');
    } finally {
      setIsSubmittingReschedule(false);
    }
  };

  const handleRetryWhatsappNotification = async (notificationId) => {
    try {
      setWhatsappRetryFeedback(`Retrying notification #${notificationId}...`);
      const res = await fetch(`/api/scheduling/notifications/${notificationId}/retry`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setWhatsappRetryFeedback(`Notification #${notificationId} processed: ${data.notification?.delivery_status || 'Success'}`);
        await fetchWhatsappData();
      } else {
        setWhatsappRetryFeedback(`Failed: ${data.message}`);
      }
      setTimeout(() => setWhatsappRetryFeedback(''), 4000);
    } catch (err) {
      setWhatsappRetryFeedback('Network error retrying notification.');
      setTimeout(() => setWhatsappRetryFeedback(''), 4000);
    }
  };

  const handleProcessOutboxNow = async () => {
    setIsProcessingOutbox(true);
    setWhatsappRetryFeedback('Processing pending outbox messages via background worker...');
    try {
      const res = await fetch('/api/scheduling/whatsapp/process-outbox', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setWhatsappRetryFeedback(`Outbox processed: ${data.processed || 0} evaluated (${data.sent || 0} accepted by Meta API, ${data.failed || 0} failed).`);
      } else {
        setWhatsappRetryFeedback(data.reason === 'NOT_CONFIGURED' ? 'Outbox paused: Meta credentials not configured yet.' : `Worker note: ${data.error || 'Done'}`);
      }
      await fetchWhatsappData();
      setTimeout(() => setWhatsappRetryFeedback(''), 5000);
    } catch {
      setWhatsappRetryFeedback('Network error triggering outbox processor.');
      setTimeout(() => setWhatsappRetryFeedback(''), 4000);
    } finally {
      setIsProcessingOutbox(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testPhoneInput || !testPhoneInput.trim()) {
      alert('Please enter an authorized test recipient mobile number.');
      return;
    }
    setIsSendingTest(true);
    setTestMessageFeedback('');
    try {
      const res = await fetch('/api/scheduling/whatsapp/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientPhone: testPhoneInput.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTestMessageFeedback(`Test message successfully queued for ${data.recipient || testPhoneInput}!`);
        await fetchWhatsappData();
      } else {
        setTestMessageFeedback(`Failed: ${data.message || data.error}`);
      }
      setTimeout(() => setTestMessageFeedback(''), 5000);
    } catch {
      setTestMessageFeedback('Network error dispatching test notification.');
      setTimeout(() => setTestMessageFeedback(''), 5000);
    } finally {
      setIsSendingTest(false);
    }
  };

  const downloadBookingsCSV = () => {
    let displayList = bookings || [];
    if (bookingSearchQuery) {
      const q = bookingSearchQuery.toLowerCase();
      displayList = displayList.filter(b => 
        (b.booking_id && b.booking_id.toLowerCase().includes(q)) ||
        (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
        (b.customer_phone && b.customer_phone.toLowerCase().includes(q)) ||
        (b.service_name && b.service_name.toLowerCase().includes(q)) ||
        (b.city && b.city.toLowerCase().includes(q))
      );
    }
    if (bookingFilterStartDate) displayList = displayList.filter(b => new Date(b.preferred_date) >= new Date(bookingFilterStartDate));
    if (bookingFilterEndDate) {
      const end = new Date(bookingFilterEndDate);
      end.setHours(23, 59, 59, 999);
      displayList = displayList.filter(b => new Date(b.preferred_date) <= end);
    }
    if (bookingStatusFilter !== 'All') displayList = displayList.filter(b => b.status === bookingStatusFilter);

    if (displayList.length === 0) return alert('No spiritual bookings to export!');

    const headers = ['Booking Reference', 'Customer Name', 'Phone', 'Email', 'Service Name', 'Service Type', 'Date', 'Time', 'Location', 'City', 'Address', 'Language', 'Status', 'Assigned Pandit', 'Created Date'];
    const rows = displayList.map(b => [
      `"${b.booking_id || ''}"`,
      `"${b.customer_name || ''}"`,
      `"${b.customer_phone || ''}"`,
      `"${b.customer_email || ''}"`,
      `"${b.service_name || ''}"`,
      `"${b.service_type || ''}"`,
      `"${b.preferred_date || ''}"`,
      `"${b.preferred_time || ''}"`,
      `"${b.service_location || ''}"`,
      `"${b.city || ''}"`,
      `"${(b.address || '').replace(/"/g, '""')}"`,
      `"${b.preferred_language || ''}"`,
      `"${b.status || ''}"`,
      `"${b.assigned_pandit_name || ''}"`,
      `"${new Date(b.created_at || Date.now()).toLocaleDateString()}"`
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Gnana_Sudha_Spiritual_Bookings_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Filter State
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [newPoojaName, setNewPoojaName] = useState('');
  const [newPoojaNameTe, setNewPoojaNameTe] = useState('');
  const [newPoojaDesc, setNewPoojaDesc] = useState('');
  const [newPoojaDescTe, setNewPoojaDescTe] = useState('');
  const [newPoojaImg, setNewPoojaImg] = useState('');
  const [newPoojaPrice, setNewPoojaPrice] = useState('');
  const [newPoojaDiscountPrice, setNewPoojaDiscountPrice] = useState('');
  const [editingPoojaId, setEditingPoojaId] = useState(null);
  
  const [newPanditName, setNewPanditName] = useState('');
  const [newPanditSpec, setNewPanditSpec] = useState('Vedic Rituals');
  const [newPanditExp, setNewPanditExp] = useState('0-2 Years');
  const [newPanditImg, setNewPanditImg] = useState('');
  const [editingPanditId, setEditingPanditId] = useState(null);

  // Homams Management State
  const [newHomamName, setNewHomamName] = useState('');
  const [newHomamNameTe, setNewHomamNameTe] = useState('');
  const [newHomamDesc, setNewHomamDesc] = useState('');
  const [newHomamDescTe, setNewHomamDescTe] = useState('');
  const [newHomamImg, setNewHomamImg] = useState('');
  const [newHomamPrice, setNewHomamPrice] = useState('');
  const [newHomamDiscountPrice, setNewHomamDiscountPrice] = useState('');
  const [editingHomamId, setEditingHomamId] = useState(null);
  const [homamSearchQuery, setHomamSearchQuery] = useState('');
  const [homamFeedback, setHomamFeedback] = useState('');

  const [newProductName, setNewProductName] = useState('');
  const [newProductNameTe, setNewProductNameTe] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductDescTe, setNewProductDescTe] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductOldPrice, setNewProductOldPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories?.[0]?.id || 1);

  // Comprehensive Category Management State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryNameTe, setNewCategoryNameTe] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryDescTe, setNewCategoryDescTe] = useState('');
  const [newCategoryDisplayOrder, setNewCategoryDisplayOrder] = useState('1');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [newCategoryStatus, setNewCategoryStatus] = useState('active');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isUploadingCategoryImg, setIsUploadingCategoryImg] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [categoryFeedback, setCategoryFeedback] = useState('');

  // Enhanced Product Search, Filters & Pagination State
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [productStatusFilter, setProductStatusFilter] = useState('All');
  const [productStockFilter, setProductStockFilter] = useState('All');
  const [productCurrentPage, setProductCurrentPage] = useState(1);
  const [viewingProductModal, setViewingProductModal] = useState(null);

  // Invoice & Internal Pandit Assignment State
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [assignedPanditId, setAssignedPanditId] = useState('');
  const [panditAssignFeedback, setPanditAssignFeedback] = useState('');

  // Store General Settings State
  const [storeName, setStoreName] = useState(() => { try { return localStorage.getItem('gs_store_name') || 'Gnana Sudha'; } catch { return 'Gnana Sudha'; } });
  const [storeEmail, setStoreEmail] = useState(() => { try { return localStorage.getItem('gs_store_email') || 'gnanasudha18@gmail.com'; } catch { return 'gnanasudha18@gmail.com'; } });
  const [storePhone, setStorePhone] = useState(() => { try { return localStorage.getItem('gs_store_phone') || '+91 9281867002'; } catch { return '+91 9281867002'; } });
  const [storeAddress, setStoreAddress] = useState(() => { try { return localStorage.getItem('gs_store_address') || 'Temple Road, Hyderabad, Telangana - 500036'; } catch { return 'Temple Road, Hyderabad, Telangana - 500036'; } });
  const [storeTaxRate, setStoreTaxRate] = useState(() => { try { return localStorage.getItem('gs_store_tax_rate') || '18'; } catch { return '18'; } });
  const [storeFreeShippingThreshold, setStoreFreeShippingThreshold] = useState(() => { try { return localStorage.getItem('gs_store_free_shipping') || '499'; } catch { return '499'; } });
  const [storeShippingFee, setStoreShippingFee] = useState(() => { try { return localStorage.getItem('gs_store_shipping_fee') || '50'; } catch { return '50'; } });
  const [storeSettingsFeedback, setStoreSettingsFeedback] = useState('');

  // Variant Builder State
  const [newProductVariants, setNewProductVariants] = useState([]);
  const [currentVariantUnit, setCurrentVariantUnit] = useState('gm');
  const [currentVariantValue, setCurrentVariantValue] = useState('');
  const [currentVariantPrice, setCurrentVariantPrice] = useState('');

  // Editing and Images
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductStock, setNewProductStock] = useState('50');
  const [newProductBadgeText, setNewProductBadgeText] = useState('');
  const [newProductFeatured, setNewProductFeatured] = useState(false);
  const [newProductBestseller, setNewProductBestseller] = useState(false);
  const [newProductImages, setNewProductImages] = useState([]);
  const [currentImageInput, setCurrentImageInput] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Inventory Management State
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [stockAdjustmentValues, setStockAdjustmentValues] = useState({});
  const [stockAdjustmentReasons, setStockAdjustmentReasons] = useState({});
  const [inventoryFeedback, setInventoryFeedback] = useState('');

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name || '');
    setNewProductNameTe(product.name_te || '');
    setNewProductDesc(product.desc || '');
    setNewProductDescTe(product.desc_te || product.description_te || '');
    setNewProductPrice(product.price);
    setNewProductOldPrice(product.oldPrice || '');
    setNewProductCategory(product.categoryid);
    setNewProductSku(product.sku || '');
    setNewProductStock(product.stock !== undefined ? product.stock : 50);
    setNewProductBadgeText(product.badge?.text || product.badge_text || '');
    setNewProductFeatured(Boolean(product.featured));
    setNewProductBestseller(Boolean(product.bestseller));
    setNewProductVariants(product.variants || []);
    setNewProductImages(product.images || (product.image ? [product.image] : []));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddImage = async () => {
    if (selectedImageFile && newProductImages.length < 6) {
      setIsUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedImageFile);
        const res = await fetch('/api/upload/product-image', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setNewProductImages([...newProductImages, data.url]);
            setSelectedImageFile(null);
            const fileInput = document.getElementById('image-upload-input');
            if (fileInput) fileInput.value = '';
            setIsUploadingImage(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Storage upload fallback triggered:', err);
      }
      resizeImage(selectedImageFile, (resizedData) => {
        setNewProductImages([...newProductImages, resizedData]);
        setSelectedImageFile(null);
        const fileInput = document.getElementById('image-upload-input');
        if (fileInput) fileInput.value = '';
        setIsUploadingImage(false);
      });
    } else if (currentImageInput && newProductImages.length < 6) {
      setNewProductImages([...newProductImages, currentImageInput]);
      setCurrentImageInput('');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
    } else {
      setSelectedImageFile(null);
    }
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setNewProductName('');
    setNewProductNameTe('');
    setNewProductDesc('');
    setNewProductDescTe('');
    setNewProductPrice('');
    setNewProductOldPrice('');
    setNewProductSku('');
    setNewProductStock('50');
    setNewProductBadgeText('');
    setNewProductFeatured(false);
    setNewProductBestseller(false);
    setNewProductVariants([]);
    setNewProductImages([]);
    setCurrentImageInput('');
    setSelectedImageFile(null);
    setIsUploadingImage(false);
  };

  const handleAddVariant = () => {
    if (currentVariantValue && currentVariantPrice) {
      setNewProductVariants([
        ...newProductVariants,
        { attribute: `${currentVariantValue}${currentVariantUnit}`, price: Number(currentVariantPrice) }
      ]);
      setCurrentVariantValue('');
      setCurrentVariantPrice('');
    }
  };

  // Payment Settings Form State
  const [gatewayProvider, setGatewayProvider] = useState('Razorpay');
  const [gatewayKey, setGatewayKey] = useState('');
  const [gatewaySecret, setGatewaySecret] = useState('');
  const [gatewayMode, setGatewayMode] = useState('test');
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (paymentSettings) {
      setGatewayProvider(paymentSettings.provider || 'Razorpay');
      setGatewayKey(paymentSettings.apiKey || '');
      setGatewaySecret(paymentSettings.apiSecret || '');
      setGatewayMode(paymentSettings.mode || 'test');
    }
  }, [paymentSettings]);

  const handleSaveSettings = () => {
    updatePaymentSettings({
      provider: gatewayProvider,
      apiKey: gatewayKey,
      apiSecret: gatewaySecret,
      mode: gatewayMode
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [viewingSchedulePandit, setViewingSchedulePandit] = useState(null);

  // Coupons State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');

  const handleLogout = () => {
    logout();
  };

  const menuSections = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Orders', icon: <ShoppingBag size={18} /> },
        { name: 'Customers', icon: <Users size={18} /> },
        { name: 'Analytics', icon: <BarChart3 size={18} /> },
      ]
    },
    {
      title: 'Content Management',
      items: [
        { name: 'YouTube Videos', icon: <Film size={18} /> },
        { name: 'Banners', icon: <ImageIcon size={18} /> },
      ]
    },
    {
      title: 'Store',
      items: [
        { name: 'Products', icon: <Box size={18} /> },
        { name: 'Categories', icon: <Grid size={18} /> },
        { name: 'Inventory', icon: <Archive size={18} /> },
        { name: 'Coupons', icon: <Ticket size={18} /> },
      ]
    },
    {
      title: 'Services',
      items: [
        { name: 'Bookings', icon: <CalendarDays size={18} /> },
        { name: 'Poojas', icon: <Star size={18} /> },
        { name: 'Homams', icon: <Flame size={18} /> },
        { name: 'Pandits', icon: <UserSquare2 size={18} /> },
        { name: 'Consultations', icon: <CalendarClock size={18} /> },
        { name: 'Calendar & Festivals', icon: <CalendarDays size={18} /> },
      ]
    },
    {
      title: 'Operations',
      items: [
        { name: 'Payments', icon: <CreditCard size={18} /> },
        { name: 'Reports', icon: <FileText size={18} /> },
        { name: 'Reviews', icon: <MessageSquare size={18} /> },
        { name: 'Settings', icon: <Settings size={18} /> },
      ]
    }
  ];

  if (!currentAdmin) {
    return <Navigate to={currentCustomer ? "/profile" : "/login"} replace />;
  }
  const parseOrderItems = (o) => {
    if (!o) return [];
    const raw = o.items !== undefined ? o.items : o;
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const p = JSON.parse(raw);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const downloadCSV = () => {
    let displayOrders = activeMenu === 'Bookings' 
      ? orders.filter(o => parseOrderItems(o).some(i => i.type === 'pooja' || i.type === 'pandit' || i.categoryid === 2))
      : orders;

    if (filterStartDate) displayOrders = displayOrders.filter(o => new Date(o.date) >= new Date(filterStartDate));
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      displayOrders = displayOrders.filter(o => new Date(o.date) <= end);
    }
    if (filterStatus !== 'All') displayOrders = displayOrders.filter(o => (o.status || 'Confirmed') === filterStatus);
    if (filterPayment !== 'All') displayOrders = displayOrders.filter(o => (o.paymentMethod || 'Credit Card') === filterPayment);

    if (displayOrders.length === 0) return alert('No orders to export!');

    const headers = ['Order ID', 'Date', 'Customer ID', 'Customer Name', 'Phone', 'Items', 'Total Amount', 'Payment Method', 'Status'];
    const rows = displayOrders.map(o => {
      const oItems = parseOrderItems(o);
      const itemNames = oItems.map(i => `${i.name} (Qty: ${i.quantity || 1})`).join('; ');
      const shipping = typeof o.shippingDetails === 'string' ? JSON.parse(o.shippingDetails || '{}') : (o.shippingDetails || {});
      return [
        o.order_number || o.id,
        new Date(o.date || o.created_at || Date.now()).toLocaleString(),
        o.customerid || 'Guest',
        `"${shipping.name || shipping.fullName || ''}"`,
        `"${shipping.phone || ''}"`,
        `"${itemNames}"`,
        o.totalAmount,
        o.paymentMethod || 'Credit Card',
        o.status || 'Confirmed'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Gnana_Sudha_${activeMenu}_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const renderAnalytics = () => {
    const dailyRevenue = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyRevenue[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
    }
    
    orders.forEach(order => {
      const date = new Date(order.date || order.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyRevenue[date] !== undefined) {
         dailyRevenue[date] += (Number(order.totalAmount) || 0);
      } else {
         dailyRevenue[date] = (Number(order.totalAmount) || 0);
      }
    });
    
    const chartData = Object.keys(dailyRevenue).map(date => ({
      name: date,
      revenue: dailyRevenue[date]
    }));
    
    const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
    const totalOrders = orders.length;
    
    let productSales = 0;
    let serviceSales = 0;
    orders.forEach(o => {
      const oItems = parseOrderItems(o);
      oItems.forEach(item => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = item.quantity || 1;
        if (item.type === 'product' || item.categoryid) {
          productSales += (itemPrice * itemQty);
        } else {
          serviceSales += (itemPrice * itemQty);
        }
      });
    });

    return (
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <div className="metric-card" style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Total Revenue</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A' }}>₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="metric-card" style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Total Orders</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1A1A1A' }}>{totalOrders}</div>
          </div>
          <div className="metric-card" style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Product Sales</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1890FF' }}>₹{productSales.toLocaleString()}</div>
          </div>
          <div className="metric-card" style={{ padding: '24px' }}>
            <div style={{ color: '#888', fontSize: '14px', marginBottom: '8px' }}>Service Bookings</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FA8C16' }}>₹{serviceSales.toLocaleString()}</div>
          </div>
        </div>

        <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
          <h3 style={{ marginBottom: '24px' }}>Revenue Overview (Last 7 Days)</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#E04E15" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  // Category Handlers
  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setNewCategoryName(cat.name || '');
    setNewCategoryNameTe(cat.name_te || '');
    setNewCategorySlug(cat.slug || '');
    setNewCategoryDesc(cat.desc || '');
    setNewCategoryDescTe(cat.desc_te || '');
    setNewCategoryDisplayOrder(String(cat.display_order ?? 1));
    setNewCategoryImage(cat.image || '');
    setNewCategoryStatus(cat.status || 'active');
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setNewCategoryName('');
    setNewCategoryNameTe('');
    setNewCategorySlug('');
    setNewCategoryDesc('');
    setNewCategoryDescTe('');
    setNewCategoryDisplayOrder('1');
    setNewCategoryImage('');
    setNewCategoryStatus('active');
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name.');
      return;
    }
    const catData = {
      name: newCategoryName.trim(),
      name_te: newCategoryNameTe.trim() || undefined,
      slug: (newCategorySlug.trim() || newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
      desc: newCategoryDesc.trim() || null,
      desc_te: newCategoryDescTe.trim() || null,
      display_order: parseInt(newCategoryDisplayOrder, 10) || 1,
      image: newCategoryImage || '/assets/product_pooja_kit.png',
      status: newCategoryStatus || 'active'
    };

    if (editingCategoryId) {
      await updateCategory(editingCategoryId, catData);
      setCategoryFeedback(`Category "${catData.name}" updated successfully!`);
    } else {
      await addCategory(catData);
      setCategoryFeedback(`New category "${catData.name}" published!`);
    }
    cancelEditCategory();
    setTimeout(() => setCategoryFeedback(''), 4000);
  };

  const handleToggleCategoryStatus = async (cat) => {
    const nextStatus = cat.status === 'inactive' ? 'active' : 'inactive';
    await updateCategory(cat.id, { ...cat, status: nextStatus });
    setCategoryFeedback(`Category "${cat.name}" is now ${nextStatus}.`);
    setTimeout(() => setCategoryFeedback(''), 3000);
  };

  const handleUploadCategoryImg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingCategoryImg(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload/category-image', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setNewCategoryImage(data.url);
          setIsUploadingCategoryImg(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Category upload fallback triggered:', err);
    }
    resizeImage(file, (resized) => {
      setNewCategoryImage(resized);
      setIsUploadingCategoryImg(false);
    });
  };

  // Internal Pandit Assignment Handler
  const handleAssignPanditToOrder = async (orderId) => {
    if (!assignedPanditId) {
      alert('Please select a verified Pandit to assign.');
      return;
    }
    const selectedPanditObj = pandits.find(p => String(p.id) === String(assignedPanditId));
    if (!selectedPanditObj) return;

    const assignmentNote = `Assigned Pandit: ${selectedPanditObj.name} (${selectedPanditObj.specialization || 'Vedic Smartha'}, Ph: ${selectedPanditObj.phone || 'Verified'})`;
    
    await updateOrder(orderId, {
      notes: assignmentNote,
      status: selectedOrder.status === 'Confirmed' ? 'Processing' : selectedOrder.status
    });

    setSelectedOrder(prev => ({
      ...prev,
      notes: assignmentNote,
      status: selectedOrder.status === 'Confirmed' ? 'Processing' : selectedOrder.status
    }));

    setPanditAssignFeedback(`Pandit ${selectedPanditObj.name} assigned to order successfully!`);
    setTimeout(() => setPanditAssignFeedback(''), 4000);
  };

  // Store General Settings Save Handler
  const handleSaveStoreSettings = () => {
    try {
      localStorage.setItem('gs_store_name', storeName);
      localStorage.setItem('gs_store_email', storeEmail);
      localStorage.setItem('gs_store_phone', storePhone);
      localStorage.setItem('gs_store_address', storeAddress);
      localStorage.setItem('gs_store_tax_rate', storeTaxRate);
      localStorage.setItem('gs_store_free_shipping', storeFreeShippingThreshold);
      localStorage.setItem('gs_store_shipping_fee', storeShippingFee);
      setStoreSettingsFeedback('Store settings saved successfully and active across all customer checkout calculations!');
      setTimeout(() => setStoreSettingsFeedback(''), 4000);
    } catch {
      alert('Failed to save store settings.');
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header" style={{ padding: '32px 20px 24px', position: 'relative' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <img src="/assets/logo.jpeg" alt="Logo" width="48" style={{ objectFit: 'contain', marginBottom: '12px' }} />
            <div className="sidebar-logo-text" style={{ fontSize: '20px', color: '#3b2413', marginBottom: '4px' }}>Gnana Sudha</div>
            <div className="sidebar-logo-sub" style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', color: '#E04E15', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '1px', background: '#e8c9b8' }}></span>
              DIVINE SERVICES
              <span style={{ width: '12px', height: '1px', background: '#e8c9b8' }}></span>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          {menuSections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '8px', marginTop: section.title === 'System' ? 'auto' : '0' }}>
              <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {section.title}
                <Flower2 size={12} style={{ opacity: 0.6, color: '#E04E15' }} />
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #F0F0F0, transparent)' }}></div>
              </div>
              {section.items.map(item => (
                <div
                  key={item.name}
                  className={`sidebar-item ${activeMenu === item.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setIsSidebarOpen(false); // Close on mobile after selection
                  }}
                >
                  <div className="sidebar-item-icon">
                    {item.icon}
                  </div>
                  <span style={{ flex: 1, textAlign: 'left', marginLeft: '4px' }}>{item.name}</span>
                  {item.badge && <span className="sidebar-badge">{item.badge}</span>}
                  <div className="sidebar-item-chevron">
                    <ChevronRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          <div className="sidebar-logout-pill" onClick={handleLogout}>
            <div className="sidebar-item-icon logout-icon-box">
              <LogOut size={18} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'left', marginLeft: '4px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#3b2413' }}>Logout</span>
              <span style={{ fontSize: '10px', color: '#888' }}>See you again</span>
            </div>
            <ChevronRight size={16} color="#888" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
              title="Open Sidebar Navigation"
              aria-label="Open Sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumbs */}
            <div className="header-breadcrumbs">
              <span className="breadcrumb-root">Gnana Sudha</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{activeMenu}</span>
            </div>

            {/* Global Search Bar */}
            <div className="header-search">
              <Search size={15} className="header-search-icon" />
              <input
                type="text"
                placeholder="Search orders, products, poojas... (⌘K)"
                value={globalSearchInput}
                onChange={(e) => setGlobalSearchInput(e.target.value)}
              />
              <span className="header-shortcut">⌘K</span>
            </div>
          </div>

          <div className="header-actions">
            {/* View Live Store */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="header-view-store"
              title="Open Public Storefront in new tab"
            >
              <ExternalLink size={13} />
              <span>Live Store</span>
            </a>

            {/* Notification Bell with Dropdown */}
            {(() => {
              const lowStockAlerts = (products || []).filter(p => Number(p.stock) <= 5);
              const realtimeNotifications = [
                ...(orders || []).slice(0, 3).map(o => ({
                  id: `ord-${o.id}`,
                  title: `New Order #${o.order_number || o.id}`,
                  desc: `Total: ₹${o.totalAmount || 0} • ${o.paymentMethod || 'Online'}`,
                  time: 'Live Order',
                  menu: 'Orders'
                })),
                ...(bookings || []).slice(0, 3).map(b => ({
                  id: `bkg-${b.id}`,
                  title: `New Pooja Booking`,
                  desc: `${b.service_name || 'Ritual Service'} for ${b.preferred_date || 'Upcoming'}`,
                  time: 'Live Booking',
                  menu: 'Bookings'
                })),
                ...lowStockAlerts.slice(0, 2).map(p => ({
                  id: `prod-${p.id}`,
                  title: `Low Stock Alert`,
                  desc: `${p.name} reached threshold (${p.stock} units left)`,
                  time: 'Inventory Alert',
                  menu: 'Inventory'
                }))
              ];

              return (
                <div className="header-dropdown-wrap" ref={notificationsRef}>
                  <button
                    className={`header-icon-btn ${isNotificationsOpen ? 'active' : ''}`}
                    onClick={() => {
                      setIsNotificationsOpen(!isNotificationsOpen);
                      setIsProfileMenuOpen(false);
                    }}
                    title="Notifications"
                    aria-label="Notifications"
                  >
                    <Bell size={17} />
                    {realtimeNotifications.length > 0 && (
                      <span className="header-badge-count">{realtimeNotifications.length}</span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="header-dropdown-menu notifications-menu">
                      <div className="notifications-header">
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#34251F' }}>Notifications</h4>
                          <p style={{ margin: '2px 0 0', fontSize: '11.5px', color: '#756A64' }}>Live platform activity</p>
                        </div>
                        {realtimeNotifications.length > 0 ? (
                          <span className="status-pill status-pill-active" style={{ fontSize: '11px', padding: '2px 8px' }}>
                            {realtimeNotifications.length} Active
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', padding: '2px 8px', color: '#16A34A', background: '#F0FDF4', borderRadius: '10px', fontWeight: '600' }}>
                            0 New
                          </span>
                        )}
                      </div>
                      <div className="notifications-list">
                        {realtimeNotifications.length > 0 ? (
                          realtimeNotifications.map((n) => (
                            <div
                              key={n.id}
                              className="notification-item unread"
                              onClick={() => { setActiveMenu(n.menu); setIsNotificationsOpen(false); }}
                            >
                              <div className="notification-status-dot" />
                              <div className="notification-body">
                                <p className="notification-title">{n.title}</p>
                                <p className="notification-desc">{n.desc}</p>
                                <span className="notification-time">{n.time}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '28px 16px', textAlign: 'center', color: '#8C8077', fontSize: '12.5px' }}>
                            <CheckCircle2 size={24} color="#16A34A" style={{ margin: '0 auto 8px', display: 'block' }} />
                            All caught up! Real-time alerts will appear here as orders & bookings arrive.
                          </div>
                        )}
                      </div>
                      <div 
                        className="notifications-footer" 
                        onClick={() => { setActiveMenu('Orders'); setIsNotificationsOpen(false); }}
                      >
                        View All Orders & Bookings →
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Language Pill Badge */}
            <div
              className="language-selector-btn"
              style={{ cursor: 'default', userSelect: 'none' }}
              title="Admin Portal Language: English"
              aria-label="Admin Portal Language: English"
            >
              <Globe size={15} className="lang-globe-icon" />
              <span className="lang-code-text">English</span>
            </div>

            {/* Admin Profile Dropdown */}
            <div className="header-dropdown-wrap" ref={profileMenuRef}>
              <div
                className={`header-profile-card ${isProfileMenuOpen ? 'active' : ''}`}
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                title="Admin Account Menu"
              >
                <div className="header-avatar-wrap">
                  <img
                    src={currentAdminUser?.avatar || "/assets/pandit_icon_1782464629488.png"}
                    className="header-avatar-img"
                    alt="Profile Avatar"
                  />
                  <span className="header-online-indicator" />
                </div>
                <div className="header-profile-text">
                  <span className="header-profile-name">{currentAdminUser?.name || 'Gnana Sudha Admin'}</span>
                  <span className="header-profile-role">Super Admin</span>
                </div>
                <ChevronDown size={14} className="header-profile-chevron" />
              </div>

              {isProfileMenuOpen && (
                <div className="header-dropdown-menu profile-menu">
                  <div className="profile-menu-header">
                    <p className="profile-menu-name">{currentAdminUser?.name || 'Gnana Sudha Admin'}</p>
                    <p className="profile-menu-email">{currentAdminUser?.username || 'gnanasudha18@gmail.com'}</p>
                    <span className="profile-menu-role-tag">Super Administrator</span>
                  </div>
                  <div className="profile-menu-divider" />
                  <div className="profile-menu-items">
                    <button
                      className="profile-menu-item"
                      onClick={() => { setActiveMenu('Settings'); setSettingsActiveTab('admins'); setIsProfileMenuOpen(false); }}
                    >
                      <Key size={15} />
                      <span>Admin Staff Accounts</span>
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => { setActiveMenu('Settings'); setSettingsActiveTab('gateway'); setIsProfileMenuOpen(false); }}
                    >
                      <Settings size={15} />
                      <span>System & Gateway Settings</span>
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => { setActiveMenu('Reports'); setIsProfileMenuOpen(false); }}
                    >
                      <FileText size={15} />
                      <span>Analytics & Reports</span>
                    </button>
                  </div>
                  <div className="profile-menu-divider" />
                  <button className="profile-menu-logout" onClick={handleLogout}>
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>

          {activeMenu === 'YouTube Videos' && (
            <AdminYouTubeManager />
          )}

          {activeMenu === 'Banners' && (
            <AdminBannerManager />
          )}

          {activeMenu === 'Calendar & Festivals' && (
            <AdminFestivalManager />
          )}

          {activeMenu === 'Dashboard' && (
            <>
              <div className="dashboard-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div className="welcome-text">
                  <h1>Welcome back, {currentAdminUser?.name ? currentAdminUser.name.split(' ')[0] : 'Vamsi'}! 🙏</h1>
                  <p>Here's a real-time authoritative overview of your platform's live data from MySQL & Hostinger storage.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={handleRefreshAll}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: '#fff', border: '1px solid #e0e0e0' }}
                    title="Refresh live metrics from backend"
                  >
                    <RefreshCw size={15} className={isRefreshingStats ? 'spin-anim' : ''} />
                    {isRefreshingStats ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                  <span style={{ 
                    fontSize: '12px', 
                    color: syncStatus === 'error' ? '#DC2626' : '#15803D', 
                    background: syncStatus === 'error' ? '#FEE2E2' : '#F0FDF4', 
                    border: `1px solid ${syncStatus === 'error' ? '#FCA5A5' : '#86EFAC'}`, 
                    padding: '6px 12px', 
                    borderRadius: '20px', 
                    fontWeight: '600', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: syncStatus === 'error' ? '#DC2626' : '#22C55E', 
                      display: 'inline-block' 
                    }}></span>
                    {syncStatus === 'error' ? 'Sync Disconnected' : `Live Polling (Every 12s) • ${lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
                  </span>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* Left Column Area */}
                <div className="main-left" style={{ width: '100%', paddingRight: 0 }}>
                  {/* Real-time Metrics Grid */}
                  <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                    
                    {/* Spiritual Bookings Card */}
                    <div className="metric-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveMenu('Bookings')}>
                      <div className="metric-icon" style={{ background: '#FFF1F0', color: '#E04E15' }}><CalendarDays size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Spiritual Bookings</span>
                        <span className="metric-value">{dashboardStats?.totalBookings ?? bookings.length}</span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#FFF7E6', color: '#D46B08', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            {dashboardStats?.pendingBookings ?? bookings.filter(b => b.status === 'Pending Review').length} Pending
                          </span>
                          <span style={{ background: '#F6FFED', color: '#389E0D', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                            {dashboardStats?.confirmedBookings ?? bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pandit Assigned').length} Confirmed
                          </span>
                          <span style={{ background: '#F0F5FF', color: '#1D39C4', padding: '2px 6px', borderRadius: '4px' }}>
                            {dashboardStats?.todayBookings ?? 0} Today
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Card (Store E-Commerce) */}
                    <div className="metric-card" style={{ padding: '20px' }}>
                      <div className="metric-icon" style={{ background: '#FFF7E6', color: '#FA8C16' }}><IndianRupee size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Store Revenue</span>
                        <span className="metric-value">₹{(dashboardStats?.grossRevenue ?? orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)).toLocaleString()}</span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span>Today: <strong style={{ color: '#16A34A' }}>₹{(dashboardStats?.todayRevenue ?? 0).toLocaleString()}</strong></span>
                          <span>This Month: <strong>₹{(dashboardStats?.monthlyRevenue ?? 0).toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Orders Card */}
                    <div className="metric-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveMenu('Orders')}>
                      <div className="metric-icon bg-green-light"><ShoppingBag size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Store Orders</span>
                        <span className="metric-value">{dashboardStats?.totalOrders ?? orders.length}</span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ background: '#E6F7FF', color: '#1890FF', padding: '2px 6px', borderRadius: '4px' }}>
                            {dashboardStats?.ordersByStatus?.Confirmed ?? orders.filter(o => !o.status || o.status === 'Confirmed').length} Confirmed
                          </span>
                          <span style={{ background: '#FFF0F6', color: '#EB2F96', padding: '2px 6px', borderRadius: '4px' }}>
                            {dashboardStats?.ordersByStatus?.Shipped ?? orders.filter(o => o.status === 'Shipped').length} Shipped
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products Card */}
                    <div className="metric-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveMenu('Products')}>
                      <div className="metric-icon bg-blue-light"><Box size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Store Products</span>
                        <span className="metric-value">{dashboardStats?.totalProducts ?? products.length}</span>
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#52C41A', fontWeight: '500' }}>
                            {dashboardStats?.activeProducts ?? products.filter(p => p.status !== 'inactive').length} Active
                          </span>
                          {(dashboardStats?.lowStockCount > 0 || dashboardStats?.outOfStockCount > 0) && (
                            <span 
                              onClick={(e) => { e.stopPropagation(); setActiveMenu('Inventory'); }} 
                              style={{ color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              {dashboardStats.lowStockCount + dashboardStats.outOfStockCount} Stock Alerts
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Categories & Customers Card */}
                    <div className="metric-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveMenu('Customers')}>
                      <div className="metric-icon bg-purple-light"><Grid size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Categories & Users</span>
                        <span className="metric-value">{dashboardStats?.totalCategories ?? categories.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>
                          {dashboardStats?.totalCustomers ?? customers.length} Registered Customers
                        </span>
                      </div>
                    </div>

                    {/* Poojas & Homams Card */}
                    <div className="metric-card" style={{ padding: '20px', cursor: 'pointer' }} onClick={() => setActiveMenu('Poojas')}>
                      <div className="metric-icon bg-orange-light"><Star size={20} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Spiritual Services</span>
                        <span className="metric-value">{(dashboardStats?.totalPoojas ?? poojas.length) + (dashboardStats?.totalHomams ?? homams.length)}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>
                          {dashboardStats?.totalPoojas ?? poojas.length} Poojas & {dashboardStats?.totalHomams ?? homams.length} Homams
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="dash-card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                      <div className="card-title">Quick Actions</div>
                    </div>
                    <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Products')} style={{ cursor: 'pointer' }}><div style={{ color: '#F5222D' }}><Plus size={16} /></div> Manage Products</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Categories')} style={{ cursor: 'pointer' }}><div style={{ color: '#1890FF' }}><Grid size={16} /></div> Manage Categories</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Inventory')} style={{ cursor: 'pointer' }}><div style={{ color: '#FA8C16' }}><Archive size={16} /></div> Manage Inventory</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Banners')} style={{ cursor: 'pointer' }}><div style={{ color: '#722ED1' }}><ImageIcon size={16} /></div> Manage Banners</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Orders')} style={{ cursor: 'pointer' }}><div style={{ color: '#52C41A' }}><ShoppingBag size={16} /></div> Manage Orders</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Poojas')} style={{ cursor: 'pointer' }}><div style={{ color: '#FA8C16' }}><Star size={16} /></div> Manage Services</div>
                    </div>
                  </div>

                  {/* Revenue Overview & Timeframe Chart */}
                  <div className="metric-card" style={{ display: 'block', padding: '24px', marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '18px', color: '#1A1A1A' }}>Revenue Analytics Trend</h3>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#888' }}>Authoritative daily revenue calculated from MySQL verified orders</p>
                      </div>
                      <div style={{ display: 'flex', background: '#F5F5F5', padding: '3px', borderRadius: '8px' }}>
                        <button
                          onClick={() => setChartTimeframe('7d')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: chartTimeframe === '7d' ? '#E04E15' : 'transparent',
                            color: chartTimeframe === '7d' ? '#ffffff' : '#666'
                          }}
                        >
                          Last 7 Days
                        </button>
                        <button
                          onClick={() => setChartTimeframe('30d')}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            background: chartTimeframe === '30d' ? '#E04E15' : 'transparent',
                            color: chartTimeframe === '30d' ? '#ffffff' : '#666'
                          }}
                        >
                          Last 30 Days
                        </button>
                      </div>
                    </div>

                    <div style={{ height: '300px', width: '100%' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartTimeframe === '7d' ? (dashboardStats?.chart7Days || []) : (dashboardStats?.chart30Days || [])} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#E04E15" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Two Column Grid: Top Selling Products & Recent Orders */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginTop: '24px' }}>
                    
                    {/* Top Selling Products */}
                    <div className="dash-card">
                      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="card-title">Top Selling Pooja Items</div>
                        <span style={{ fontSize: '12px', color: '#888' }}>By Units Sold</span>
                      </div>
                      <div style={{ padding: '8px 0' }}>
                        {(dashboardStats?.topSelling && dashboardStats.topSelling.length > 0) ? (
                          dashboardStats.topSelling.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < dashboardStats.topSelling.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img
                                  src={item.image || '/assets/product_pooja_kit.png'}
                                  alt={item.name}
                                  style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                                  onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }}
                                />
                                <div>
                                  <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '13px' }}>{item.name}</div>
                                  <div style={{ fontSize: '12px', color: '#888' }}>{item.totalSold} units sold</div>
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 'bold', color: '#E04E15', fontSize: '14px' }}>₹{Number(item.revenue).toLocaleString()}</div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                            No sales recorded yet. Orders placed in the shop will rank here.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="dash-card">
                      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="card-title">Recent Orders</div>
                        <span onClick={() => setActiveMenu('Orders')} style={{ fontSize: '12px', color: '#1890FF', cursor: 'pointer', fontWeight: '500' }}>View All →</span>
                      </div>
                      <div style={{ padding: '8px 0' }}>
                        {(dashboardStats?.recentOrders && dashboardStats.recentOrders.length > 0) ? (
                          dashboardStats.recentOrders.map((ord, idx) => {
                            const shipInfo = typeof ord.shippingDetails === 'string' ? JSON.parse(ord.shippingDetails || '{}') : (ord.shippingDetails || {});
                            return (
                              <div key={ord.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: idx < dashboardStats.recentOrders.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                <div>
                                  <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '13px' }}>
                                    #{ord.order_number || ord.id}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#888' }}>
                                    {shipInfo.name || shipInfo.fullName || 'Guest Customer'} • {new Date(ord.date || ord.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '13px' }}>₹{Number(ord.totalAmount).toLocaleString()}</div>
                                  <span style={{
                                    fontSize: '11px',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontWeight: '600',
                                    display: 'inline-block',
                                    marginTop: '2px',
                                    background: ord.status === 'Shipped' ? '#FFF0F6' : (ord.status === 'Delivered' ? '#F6FFED' : '#E6F7FF'),
                                    color: ord.status === 'Shipped' ? '#EB2F96' : (ord.status === 'Delivered' ? '#52C41A' : '#1890FF')
                                  }}>
                                    {ord.status || 'Confirmed'}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                            No orders placed yet.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </>
          )}

          {activeMenu === 'Consultations' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Consultations</h1>
                <p>Update pricing for the consultation services displayed on the homepage. Changes persist directly to the database.</p>
              </div>

              <div className="dash-card">
                <div className="card-header">
                  <div className="card-title">Consultation Services</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left', background: '#fafafa' }}>
                        <th style={{ padding: '16px' }}>Service Name</th>
                        <th style={{ padding: '16px' }}>Original Price (₹)</th>
                        <th style={{ padding: '16px' }}>Discount Price (₹)</th>
                        <th style={{ padding: '16px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations?.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '16px', fontWeight: '500' }}>{c.title}</td>
                          <td style={{ padding: '16px' }}>
                            <input 
                              type="number" 
                              value={c.price || ''} 
                              onChange={(e) => {
                                const newConsultations = [...consultations];
                                const item = newConsultations.find(item => item.id === c.id);
                                if (item) item.price = Number(e.target.value);
                                setConsultations(newConsultations);
                              }}
                              style={{ width: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
                              placeholder="e.g. 1000"
                            />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <input 
                              type="number" 
                              value={c.discountPrice || ''} 
                              onChange={(e) => {
                                const newConsultations = [...consultations];
                                const item = newConsultations.find(item => item.id === c.id);
                                if (item) item.discountPrice = Number(e.target.value);
                                setConsultations(newConsultations);
                              }}
                              style={{ width: '120px', padding: '8px', border: '1px solid #ccc', borderRadius: '6px' }}
                              placeholder="e.g. 900"
                            />
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <button
                                onClick={async () => {
                                  await updateConsultation(c.id, { price: Number(c.price), discountPrice: Number(c.discountPrice) });
                                  setConsultationSaveStatus(prev => ({ ...prev, [c.id]: true }));
                                  setTimeout(() => {
                                    setConsultationSaveStatus(prev => ({ ...prev, [c.id]: false }));
                                  }, 3000);
                                }}
                                style={{
                                  padding: '8px 16px',
                                  background: '#E04E15',
                                  color: '#ffffff',
                                  border: 'none',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <Save size={14} /> Save Pricing
                              </button>
                              {consultationSaveStatus[c.id] && (
                                <span style={{ color: '#52C41A', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <CheckCircle2 size={16} /> Saved!
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          {activeMenu === 'Poojas' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1 className="admin-page-title">Manage Poojas & Homams</h1>
                <p className="admin-page-subtitle">Add or remove divine pooja services available on the public platform.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{editingPoojaId ? '✏️ Edit Pooja Service' : '✨ Add New Pooja Service'}</div>
                      <div className="card-subtitle">Changes reflect in real-time on the public poojas catalog and booking checkout.</div>
                    </div>
                    {editingPoojaId && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          setEditingPoojaId(null);
                          setNewPoojaName(''); setNewPoojaNameTe(''); setNewPoojaDesc(''); setNewPoojaDescTe(''); setNewPoojaImg(''); setNewPoojaPrice(''); setNewPoojaDiscountPrice('');
                        }}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Pooja Name (English) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Sri Satyanarayana Swamy Vratham" 
                        className="login-input" 
                        value={newPoojaName} 
                        onChange={e => setNewPoojaName(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Pooja Name (Telugu / తెలుగు)</label>
                      <input 
                        type="text" 
                        placeholder="ఉదా: శ్రీ సత్యనారాయణ స్వామి వ్రతం" 
                        className="login-input" 
                        value={newPoojaNameTe} 
                        onChange={e => setNewPoojaNameTe(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Original Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 1000" 
                        className="login-input" 
                        value={newPoojaPrice} 
                        onChange={e => setNewPoojaPrice(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Discount Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 900" 
                        className="login-input" 
                        value={newPoojaDiscountPrice} 
                        onChange={e => setNewPoojaDiscountPrice(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Description (English) <span className="required">*</span></label>
                      <textarea 
                        placeholder="Auspicious ritual dedicated to Lord Vishnu for peace, prosperity, removing obstacles..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '80px' }}
                        value={newPoojaDesc} 
                        onChange={e => setNewPoojaDesc(e.target.value)} 
                        maxLength="500" 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Description (Telugu / తెలుగు)</label>
                      <textarea 
                        placeholder="సుఖసంతోషాలు, అష్టైశ్వర్యాలు మరియు విఘ్న నివారణ కొరకు పవిత్ర వ్రతం..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '80px' }}
                        value={newPoojaDescTe} 
                        onChange={e => setNewPoojaDescTe(e.target.value)} 
                        maxLength="500" 
                      />
                    </div>
                  </div>

                  {/* Pooja Image Upload & Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '14px 18px', background: '#FAF7F4', borderRadius: '12px', border: '1px solid #F0E4DC', marginBottom: '20px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={newPoojaImg || '/assets/product_pooja_kit.png'} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <label className="admin-form-label" style={{ marginBottom: '2px' }}>Pooja Photo / Thumbnail</label>
                      <input 
                        id="poojaPhotoUpload" 
                        type="file" 
                        accept="image/*" 
                        style={{ fontSize: '12px' }} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) resizeImage(e.target.files[0], setNewPoojaImg);
                        }} 
                      />
                      <div className="admin-form-hint">Compressed automatically & synchronized to Hostinger storage</div>
                    </div>
                    {newPoojaImg && (
                      <button 
                        onClick={() => setNewPoojaImg('')} 
                        style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      if (newPoojaName && newPoojaDesc) {
                        const poojaData = { 
                          name: newPoojaName, 
                          name_te: newPoojaNameTe || undefined,
                          desc: newPoojaDesc, 
                          desc_te: newPoojaDescTe || undefined,
                          img: newPoojaImg || null, 
                          price: newPoojaPrice || null, 
                          discountPrice: newPoojaDiscountPrice || null 
                        };
                        if (editingPoojaId) {
                          updatePooja(editingPoojaId, poojaData);
                          setEditingPoojaId(null);
                        } else {
                          addPooja(poojaData);
                        }
                        setNewPoojaName(''); setNewPoojaNameTe(''); setNewPoojaDesc(''); setNewPoojaDescTe(''); setNewPoojaImg(''); setNewPoojaPrice(''); setNewPoojaDiscountPrice('');
                      } else {
                        alert('Please fill in Pooja Name and Description.');
                      }
                    }}
                  >
                    <Save size={16} /> {editingPoojaId ? 'Update Pooja' : 'Add Pooja'}
                  </button>
                </div>

                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Active Poojas on Website ({poojas.length})</div>
                      <div className="card-subtitle">Real-time MySQL active services displayed on the frontend website.</div>
                    </div>
                  </div>
                  <div className="admin-table-wrapper" style={{ margin: 0 }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Service Details</th>
                          <th>Description</th>
                          <th>Price</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poojas.map(p => (
                          <tr key={p.id}>
                            <td style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>#{p.id}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img 
                                  src={p.img || '/assets/product_pooja_kit.png'} 
                                  alt={p.name} 
                                  style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                                  onError={e => { e.target.onerror = null; e.target.src = '/assets/product_pooja_kit.png'; }}
                                />
                                <div>
                                  <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                                  <span className="status-badge active" style={{ fontSize: '10px', padding: '1px 8px', marginTop: '2px' }}>Active</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: '#6B7280', maxWidth: '320px' }}>{p.desc}</td>
                            <td>
                              {p.discountPrice ? (
                                <div>
                                  <strong style={{ color: '#D92F18' }}>₹{p.discountPrice}</strong>
                                  <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#9CA3AF', marginLeft: '6px' }}>₹{p.price}</span>
                                </div>
                              ) : p.price ? (
                                <strong>₹{p.price}</strong>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Custom Quote</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => {
                                    setEditingPoojaId(p.id);
                                    setNewPoojaName(p.name || '');
                                    setNewPoojaNameTe(p.name_te || '');
                                    setNewPoojaDesc(p.desc || '');
                                    setNewPoojaDescTe(p.desc_te || '');
                                    setNewPoojaImg(p.img || '');
                                    setNewPoojaPrice(p.price || '');
                                    setNewPoojaDiscountPrice(p.discountPrice || '');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }} 
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete pooja "${p.name}"?`)) {
                                      deletePooja(p.id);
                                    }
                                  }} 
                                  className="btn-danger"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Pandits' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1 className="admin-page-title">Manage Pandits</h1>
                <p className="admin-page-subtitle">Internal Pandit directory, scheduling, and pooja allocation management.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{editingPanditId ? '✏️ Edit Pandit Details' : '🪔 Register New Pandit'}</div>
                      <div className="card-subtitle">{editingPanditId ? 'Update details for the selected pandit profile.' : 'Add a verified pandit for backend booking assignment.'}</div>
                    </div>
                    {editingPanditId && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          setEditingPanditId(null);
                          setNewPanditName(''); setNewPanditSpec('Vedic Rituals'); setNewPanditExp('0-2 Years'); setNewPanditImg('');
                        }}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '20px', alignItems: 'center', marginBottom: '20px', padding: '16px', background: '#FAF7F4', borderRadius: '12px', border: '1px solid #F0E4DC' }}>
                    <div>
                      {newPanditImg ? (
                        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                          <img src={newPanditImg} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #D92F18' }} />
                          <button onClick={() => setNewPanditImg('')} style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }} title="Remove photo">&times;</button>
                        </div>
                      ) : (
                        <label htmlFor="panditPhotoUpload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', border: '2px dashed #D1D5DB', borderRadius: '50%', cursor: 'pointer', background: '#FFFFFF', color: '#6B7280', transition: 'all 0.2s' }} title="Upload Pandit Photo">
                          <UserPlus size={20} color="#D92F18" />
                          <span style={{ fontSize: '9px', fontWeight: 600, marginTop: '2px' }}>Photo</span>
                          <input id="panditPhotoUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              resizeImage(file, (resizedData) => {
                                setNewPanditImg(resizedData);
                              });
                            }
                          }} />
                        </label>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: '#111827' }}>Pandit Profile Picture</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Upload a passport-style portrait photograph. Auto-compressed & stored securely.</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label className="admin-form-label">Full Name <span className="required">*</span></label>
                      <input type="text" placeholder="e.g. Pt. Ravi Sharma" className="login-input" value={newPanditName} onChange={e => setNewPanditName(e.target.value)} />
                    </div>
                    <div>
                      <label className="admin-form-label">Specialization <span className="required">*</span></label>
                      <select className="login-input" value={newPanditSpec} onChange={e => setNewPanditSpec(e.target.value)}>
                        <option value="Vedic Rituals">Vedic Rituals</option>
                        <option value="Homams & Havan">Homams & Havan</option>
                        <option value="Astrology">Astrology</option>
                        <option value="Wedding & Marriages">Wedding & Marriages</option>
                        <option value="Daily Poojas">Daily Poojas</option>
                      </select>
                    </div>
                    <div>
                      <label className="admin-form-label">Experience <span className="required">*</span></label>
                      <select className="login-input" value={newPanditExp} onChange={e => setNewPanditExp(e.target.value)}>
                        <option value="0-2 Years">0-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5-10 Years">5-10 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button className="btn-primary" onClick={() => {
                      if (newPanditName && newPanditSpec && newPanditExp) {
                        const fallbackImg = '/assets/male_pandit.png';
                        const assignedImg = newPanditImg && newPanditImg !== '/assets/avatar_placeholder.png' ? newPanditImg : fallbackImg;
                        if (editingPanditId) {
                          updatePandit(editingPanditId, { name: newPanditName, specialization: newPanditSpec, experience: newPanditExp, img: assignedImg });
                          setEditingPanditId(null);
                        } else {
                          addPandit({ name: newPanditName, specialization: newPanditSpec, experience: newPanditExp, status: 'Approved', img: assignedImg });
                        }
                        setNewPanditName(''); setNewPanditSpec('Vedic Rituals'); setNewPanditExp('0-2 Years'); setNewPanditImg('');
                      } else {
                        alert('Please fill out all required pandit fields.');
                      }
                    }}>
                      <Save size={16} /> {editingPanditId ? 'Update Pandit Details' : 'Register Pandit'}
                    </button>
                  </div>
                </div>

                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">Registered Pandits ({pandits.length})</div>
                      <div className="card-subtitle">Verified priests eligible for assignment to pooja bookings.</div>
                    </div>
                  </div>
                  <div className="admin-table-wrapper" style={{ margin: 0 }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Priest Details</th>
                          <th>Specialization</th>
                          <th>Experience</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pandits.map(p => (
                          <tr key={p.id}>
                            <td style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>#{p.id}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img 
                                  src={p.img && p.img !== '/assets/avatar_placeholder.png' ? p.img : (p.gender === 'female' ? '/assets/female_pandit.png' : '/assets/male_pandit.png')} 
                                  alt={p.name} 
                                  style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                                  onError={(e) => { 
                                    e.target.onerror = null;
                                    e.target.src = p.gender === 'female' ? '/assets/female_pandit.png' : '/assets/male_pandit.png'; 
                                  }} 
                                />
                                <div>
                                  <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                                  <div style={{ fontSize: '11px', color: '#6B7280' }}>ID: GS-PND-{p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ color: '#D92F18', fontWeight: 600, fontSize: '13px' }}>{p.specialization}</span>
                            </td>
                            <td>
                              <span style={{ color: '#4B5563', fontWeight: 500 }}>{p.experience}</span>
                            </td>
                            <td>
                              <span className={`status-badge ${p.status === 'Approved' ? 'approved' : 'pending'}`}>
                                {p.status || 'Pending'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => {
                                    setEditingPanditId(p.id);
                                    setNewPanditName(p.name);
                                    setNewPanditSpec(p.specialization);
                                    setNewPanditExp(p.experience);
                                    setNewPanditImg(p.img && p.img !== '/assets/avatar_placeholder.png' ? p.img : '');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }} 
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => setViewingSchedulePandit(p)} 
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px', color: '#7C3AED' }}
                                >
                                  Schedule
                                </button>
                                {(p.status === 'Pending' || !p.status) && (
                                  <button 
                                    onClick={() => approvePandit(p.id)} 
                                    className="btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '12px', color: '#16803D' }}
                                  >
                                    Approve
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to remove pandit "${p.name}"?`)) {
                                      deletePandit(p.id);
                                    }
                                  }} 
                                  className="btn-danger"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Homams' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="admin-page-title">Manage Homams & Havans</h1>
                  <p className="admin-page-subtitle">Configure sacred fire rituals, pricing, and live public website booking options.</p>
                </div>
                {homamFeedback && (
                  <div className="status-pill status-pill-active" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> {homamFeedback}
                  </div>
                )}
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                {/* Add / Edit Homam Form Card */}
                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{editingHomamId ? '✏️ Edit Homam Ceremony' : '🔥 Add New Homam Ceremony'}</div>
                      <div className="card-subtitle">Sacred fire rituals synchronized with live frontend booking checkout and MySQL database.</div>
                    </div>
                    {editingHomamId && (
                      <button 
                        className="btn-secondary" 
                        onClick={() => {
                          setEditingHomamId(null);
                          setNewHomamName('');
                          setNewHomamNameTe('');
                          setNewHomamDesc('');
                          setNewHomamDescTe('');
                          setNewHomamPrice('');
                          setNewHomamDiscountPrice('');
                          setNewHomamImg('');
                        }}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Homam Name (English) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g. Maha Ganapati Homam" 
                        className="login-input" 
                        value={newHomamName}
                        onChange={e => setNewHomamName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Homam Name (Telugu / తెలుగు)</label>
                      <input 
                        type="text" 
                        placeholder="ఉదా: మహా గణపతి హోమం" 
                        className="login-input" 
                        value={newHomamNameTe}
                        onChange={e => setNewHomamNameTe(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Original Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 5000" 
                        className="login-input" 
                        value={newHomamPrice}
                        onChange={e => setNewHomamPrice(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Discount Price (₹)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 4500" 
                        className="login-input" 
                        value={newHomamDiscountPrice}
                        onChange={e => setNewHomamDiscountPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Detailed Description (English) <span className="required">*</span></label>
                      <textarea 
                        placeholder="Sacred havan ceremony performed strictly according to Vedic Shastras by scholarly priests to remove obstacles and invoke divine prosperity..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '84px' }}
                        value={newHomamDesc}
                        onChange={e => setNewHomamDesc(e.target.value)}
                        maxLength="1000" 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Detailed Description (Telugu / తెలుగు)</label>
                      <textarea 
                        placeholder="విఘ్న నివారణ మరియు సర్వ శుభాల ప్రాప్తి కొరకు వేద పండితులచే శాస్త్రోక్తంగా నిర్వహించబడు హోమం..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '84px' }}
                        value={newHomamDescTe}
                        onChange={e => setNewHomamDescTe(e.target.value)}
                        maxLength="1000" 
                      />
                    </div>
                  </div>

                  {/* Homam Image Upload & Preview */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '14px 18px', background: '#FAF7F4', borderRadius: '12px', border: '1px solid #F0E4DC', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img 
                        src={newHomamImg || '/assets/product_pooja_kit.png'} 
                        alt="Homam Thumbnail" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label className="admin-form-label" style={{ marginBottom: '2px' }}>Homam Photo / Ritual Image</label>
                      <input 
                        id="homamPhotoUploadInput" 
                        type="file" 
                        accept="image/*" 
                        style={{ fontSize: '12px' }} 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) resizeImage(e.target.files[0], setNewHomamImg);
                        }} 
                      />
                      <div className="admin-form-hint">Supported: PNG, JPG, WebP (synchronized to Hostinger storage)</div>
                    </div>
                    {newHomamImg && (
                      <button 
                        type="button"
                        onClick={() => setNewHomamImg('')} 
                        style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button 
                      className="btn-primary" 
                      onClick={async () => {
                        if (!newHomamName.trim() || !newHomamDesc.trim()) {
                          alert('Please enter both Homam Name and Description.');
                          return;
                        }
                        const homamData = { 
                          name: newHomamName.trim(), 
                          name_te: newHomamNameTe.trim() || undefined,
                          desc: newHomamDesc.trim(), 
                          desc_te: newHomamDescTe.trim() || undefined,
                          img: newHomamImg || null, 
                          price: newHomamPrice ? parseFloat(newHomamPrice) : null, 
                          discountPrice: newHomamDiscountPrice ? parseFloat(newHomamDiscountPrice) : null 
                        };
                        if (editingHomamId) {
                          await updateHomam(editingHomamId, homamData);
                          setHomamFeedback(`Homam "${homamData.name}" updated successfully!`);
                        } else {
                          await addHomam(homamData);
                          setHomamFeedback(`New Homam "${homamData.name}" published!`);
                        }
                        setEditingHomamId(null);
                        setNewHomamName('');
                        setNewHomamNameTe('');
                        setNewHomamDesc('');
                        setNewHomamDescTe('');
                        setNewHomamPrice('');
                        setNewHomamDiscountPrice('');
                        setNewHomamImg('');
                        setTimeout(() => setHomamFeedback(''), 4000);
                      }}
                    >
                      <Save size={16} /> {editingHomamId ? 'Update Homam Service' : 'Save & Publish Homam'}
                    </button>
                    {editingHomamId && (
                      <button 
                        className="btn-secondary"
                        onClick={() => {
                          setEditingHomamId(null);
                          setNewHomamName('');
                          setNewHomamNameTe('');
                          setNewHomamDesc('');
                          setNewHomamDescTe('');
                          setNewHomamPrice('');
                          setNewHomamDiscountPrice('');
                          setNewHomamImg('');
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>

                {/* Homams Directory Table Card */}
                <div className="dash-card">
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div className="card-title">Active Homam Ceremonies ({homams.length})</div>
                      <div className="card-subtitle">Real-time rituals displayed on the public website booking checkout.</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px' }}>
                      <input 
                        type="text" 
                        placeholder="Search homams..." 
                        className="login-input" 
                        style={{ padding: '6px 12px', fontSize: '13px', width: '100%' }}
                        value={homamSearchQuery}
                        onChange={e => setHomamSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="admin-table-wrapper" style={{ margin: 0 }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Service Details</th>
                          <th>Description</th>
                          <th>Pricing</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {homams
                          .filter(h => {
                            if (!homamSearchQuery.trim()) return true;
                            const q = homamSearchQuery.toLowerCase();
                            return h.name.toLowerCase().includes(q) || (h.desc && h.desc.toLowerCase().includes(q));
                          })
                          .map(h => (
                          <tr key={h.id}>
                            <td style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>#{h.id}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img 
                                  src={h.img || '/assets/product_pooja_kit.png'} 
                                  alt={h.name} 
                                  style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E5E7EB' }} 
                                  onError={e => { e.target.onerror = null; e.target.src = '/assets/homam_specialist_1782492829402.png'; }}
                                />
                                <div>
                                  <div style={{ fontWeight: 600, color: '#111827' }}>{h.name}</div>
                                  <span className="status-badge active" style={{ fontSize: '10px', padding: '1px 8px', marginTop: '2px' }}>Active</span>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: '#6B7280', maxWidth: '340px' }}>{h.desc}</td>
                            <td>
                              {h.discountPrice ? (
                                <div>
                                  <strong style={{ color: '#D92F18', fontSize: '14px' }}>₹{h.discountPrice}</strong>
                                  <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#9CA3AF', marginLeft: '6px' }}>₹{h.price}</span>
                                </div>
                              ) : h.price ? (
                                <strong style={{ fontSize: '14px' }}>₹{h.price}</strong>
                              ) : (
                                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Custom Quote</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <button 
                                  onClick={() => {
                                    setEditingHomamId(h.id);
                                    setNewHomamName(h.name || '');
                                    setNewHomamNameTe(h.name_te || '');
                                    setNewHomamDesc(h.desc || '');
                                    setNewHomamDescTe(h.desc_te || '');
                                    setNewHomamPrice(h.price || '');
                                    setNewHomamDiscountPrice(h.discountPrice || '');
                                    setNewHomamImg(h.img || '');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }} 
                                  className="btn-secondary"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete homam ceremony "${h.name}"?`)) {
                                      deleteHomam(h.id);
                                    }
                                  }} 
                                  className="btn-danger"
                                  style={{ padding: '6px 12px', fontSize: '12px' }}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Orders' && (
            <>
              <div className="section-header">
                <div>
                  <h2 className="section-title" style={{ fontFamily: 'var(--font-sans)', fontSize: 24, marginBottom: 8 }}>
                    Order Management
                  </h2>
                  <p style={{ color: '#888', margin: 0, fontSize: 14 }}>
                    View and manage all customer e-commerce store orders and shipments.
                  </p>
                </div>
              </div>

              {!selectedOrder && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
                  padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Search Orders</label>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                      <Search size={15} style={{ position: 'absolute', left: '10px', color: '#888' }} />
                      <input 
                        type="text" 
                        placeholder="Order #, name, phone..." 
                        value={categorySearchQuery} 
                        onChange={e => setCategorySearchQuery(e.target.value)} 
                        style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} 
                      />
                    </div>
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Start Date</label>
                    <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>End Date</label>
                    <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Status</label>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <option value="All">All Statuses</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div style={{ flex: '1 1 140px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Payment</label>
                    <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <option value="All">All Payments</option>
                      <option value="Credit Card">Online / Credit Card</option>
                      <option value="COD">Cash on Delivery (COD)</option>
                    </select>
                  </div>
                  <div style={{ flex: '0 0 auto' }}>
                    <button className="btn-primary" onClick={downloadCSV} style={{ padding: '0 20px', height: '42px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Download size={18} /> Export CSV
                    </button>
                  </div>
                </div>
              )}

              {selectedOrder ? (
                <div className="dash-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '15px', fontWeight: 600 }}>
                        ← Back to Orders
                      </button>
                      <span style={{ color: '#C53018' }}>Order {selectedOrder.order_number || `#GS-${selectedOrder.id}`}</span>
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setInvoiceOrder(selectedOrder)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #d9d9d9',
                          background: '#fff',
                          color: '#333',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px'
                        }}
                      >
                        <Printer size={15} color="#C53018" /> Print Invoice
                      </button>
                      <span style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>Status:</span>
                      <select
                        value={selectedOrder.status || 'Confirmed'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          await updateOrderStatus(selectedOrder.id, newStatus);
                          setSelectedOrder({ ...selectedOrder, status: newStatus });
                        }}
                        style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', background: '#fff', fontWeight: 600 }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)', gap: '24px' }}>
                    {/* Left: Items in Order */}
                    <div>
                      <h4 style={{ marginBottom: '16px', color: '#333' }}>Items in Order</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {parseOrderItems(selectedOrder).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #eee', borderRadius: '10px', background: '#fff' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <img 
                                src={item.image || item.img || '/assets/product_pooja_kit.png'} 
                                alt={item.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
                              />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '600', color: '#2A1C15', fontSize: '14px' }}>{item.name}</div>
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {item.type === 'pooja' ? 'Pandit Booking' : item.type === 'product' ? 'Product' : 'Item'}
                                {item.variant && ` • Variant: ${item.variant}`}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '700', color: '#C53018', fontSize: '15px' }}>₹{(Number(item.price) || 0) * (item.quantity || 1)}</div>
                              <div style={{ fontSize: '12px', color: '#888' }}>Qty: {item.quantity || 1} x ₹{item.price}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipment & Tracking Manager */}
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px' }}>
                        <h4 style={{ margin: '0 0 14px 0', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Truck size={18} color="#0284c7" /> Shipping & Tracking Management
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>Courier Partner</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Blue Dart, Delhivery, DTDC" 
                              value={courierInput || selectedOrder.courier_name || ''} 
                              onChange={(e) => setCourierInput(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>Tracking Number / AWB</label>
                            <input 
                              type="text" 
                              placeholder="e.g. BLD123456789IN" 
                              value={trackingNumberInput || selectedOrder.tracking_number || ''} 
                              onChange={(e) => setTrackingNumberInput(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', fontFamily: 'monospace' }}
                            />
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#64748B', fontWeight: 600, marginBottom: '4px' }}>Estimated Delivery</label>
                            <input 
                              type="text" 
                              placeholder="e.g. 3-5 Days / 18 Oct 2026" 
                              value={estimatedDeliveryInput || selectedOrder.estimated_delivery || ''} 
                              onChange={(e) => setEstimatedDeliveryInput(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                            />
                          </div>
                        </div>

                        {trackingFeedback && (
                          <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>{trackingFeedback}</p>
                        )}

                        <button 
                          onClick={async () => {
                            const courier = courierInput || selectedOrder.courier_name || 'Express Logistics';
                            const trackNum = trackingNumberInput || selectedOrder.tracking_number || '';
                            const est = estimatedDeliveryInput || selectedOrder.estimated_delivery || '3-5 Business Days';
                            if (!trackNum) {
                              alert('Please enter a tracking number.');
                              return;
                            }
                            await updateOrderTracking(selectedOrder.id, {
                              courier_name: courier,
                              tracking_number: trackNum,
                              estimated_delivery: est
                            });
                            setSelectedOrder({
                              ...selectedOrder,
                              status: 'Shipped',
                              courier_name: courier,
                              tracking_number: trackNum,
                              estimated_delivery: est
                            });
                            setTrackingFeedback('Shipment details saved & order marked as Shipped!');
                            setTimeout(() => setTrackingFeedback(''), 4000);
                          }}
                          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Save size={15} /> Save & Mark as Shipped
                        </button>
                      </div>

                      {/* Internal Pandit Assignment for Pooja / Service Orders */}
                      <div style={{ background: '#FFF8F2', border: '1px solid #FFD8BF', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, color: '#D4380D', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                            <UserSquare2 size={18} color="#D4380D" /> Internal Pandit Assignment (Operational)
                          </h4>
                          <span style={{ fontSize: '11px', background: '#FFF1F0', color: '#CF1322', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                            Business Coordination
                          </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 14px 0', lineHeight: '1.5' }}>
                          Customers book poojas and services directly; assign an authorized verified Vedic priest from your operational roster to fulfill this order.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <select
                            value={assignedPanditId}
                            onChange={(e) => setAssignedPanditId(e.target.value)}
                            style={{ flex: '1 1 240px', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                          >
                            <option value="">-- Choose Verified Pandit to Assign --</option>
                            {pandits.map(p => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.specialization || 'Vedic Smartha'}) {p.phone ? `• ${p.phone}` : ''}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignPanditToOrder(selectedOrder.id)}
                            style={{
                              background: '#D4380D',
                              color: '#fff',
                              border: 'none',
                              padding: '9px 18px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <CheckCircle2 size={15} /> Confirm Assignment
                          </button>
                        </div>

                        {panditAssignFeedback && (
                          <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#16a34a', fontWeight: 'bold' }}>
                            {panditAssignFeedback}
                          </p>
                        )}

                        {selectedOrder.notes && (
                          <div style={{ marginTop: '12px', padding: '10px', background: '#fff', borderRadius: '6px', border: '1px dashed #d9d9d9', fontSize: '12px' }}>
                            <strong>Current Assignment / Notes:</strong> {selectedOrder.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Order Summary & Address */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ background: '#fff', border: '1px solid #eee', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 14px 0', color: '#333' }}>Order Breakdown</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '13px' }}>
                          <span>Order Date:</span>
                          <strong>{new Date(selectedOrder.date || selectedOrder.created_at || Date.now()).toLocaleDateString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '13px' }}>
                          <span>Subtotal:</span>
                          <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#16a34a', fontSize: '13px' }}>
                            <span>Discount:</span>
                            <span>-₹{selectedOrder.discount}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '13px' }}>
                          <span>GST (18%):</span>
                          <span>₹{selectedOrder.tax || 0}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#666', fontSize: '13px' }}>
                          <span>Shipping:</span>
                          <span>{selectedOrder.shipping_fee === 0 ? 'FREE' : `₹${selectedOrder.shipping_fee || 0}`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '2px solid #2A1C15', fontWeight: '700', fontSize: '16px', color: '#C53018' }}>
                          <span>Total Amount:</span>
                          <span>₹{selectedOrder.totalAmount}</span>
                        </div>
                        <div style={{ marginTop: '10px', fontSize: '12px', color: '#888' }}>
                          Payment: <strong>{selectedOrder.paymentMethod || 'COD'}</strong> ({selectedOrder.paymentStatus || 'Pending'})
                        </div>
                      </div>

                      {/* Customer & Shipping info */}
                      {(() => {
                        const shipping = typeof selectedOrder.shippingDetails === 'string'
                          ? JSON.parse(selectedOrder.shippingDetails || '{}')
                          : (selectedOrder.shippingDetails || {});
                        return (
                          <div style={{ background: '#FFFDF9', border: '1px solid #f0e6dd', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#2A1C15' }}>Shipping & Customer Info</h4>
                            <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
                              <div><strong>Recipient:</strong> {shipping.name || shipping.fullName || 'Customer'}</div>
                              <div><strong>Phone:</strong> {shipping.phone || 'N/A'}</div>
                              <div><strong>Email:</strong> {shipping.email || 'N/A'}</div>
                              <div><strong>Address:</strong> {shipping.address || 'Address provided at checkout'}</div>
                              <div><strong>Location:</strong> {shipping.city || 'Hyderabad'}, {shipping.state || 'Telangana'} - {shipping.pincode || '500036'}</div>
                              {selectedOrder.notes && (
                                <div style={{ marginTop: '8px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px dashed #ddd', fontSize: '12px' }}>
                                  <strong>Customer Note:</strong> {selectedOrder.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order Ref</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let displayOrders = orders;

                        if (filterStartDate) displayOrders = displayOrders.filter(o => new Date(o.date) >= new Date(filterStartDate));
                        if (filterEndDate) {
                          const end = new Date(filterEndDate);
                          end.setHours(23, 59, 59, 999);
                          displayOrders = displayOrders.filter(o => new Date(o.date) <= end);
                        }
                        if (filterStatus !== 'All') displayOrders = displayOrders.filter(o => (o.status || 'Confirmed') === filterStatus);
                        if (filterPayment !== 'All') displayOrders = displayOrders.filter(o => (o.paymentMethod || 'Credit Card') === filterPayment);

                        return displayOrders.length === 0 ? (
                          <tr><td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#999', fontStyle: 'italic' }}>No orders found.</td></tr>
                        ) : (
                          displayOrders.map(order => {
                            const oItems = parseOrderItems(order);
                            const shipping = typeof order.shippingDetails === 'string' ? JSON.parse(order.shippingDetails || '{}') : (order.shippingDetails || {});
                            const customerName = shipping.name || shipping.fullName || (order.customerid ? `Customer #${order.customerid}` : 'Guest');
                            const statusClass = order.status === 'Delivered' ? 'delivered' : order.status === 'Cancelled' ? 'cancelled' : 'confirmed';

                            return (
                              <tr key={order.id}>
                                <td><strong>{order.order_number || `#${order.id}`}</strong></td>
                                <td>{new Date(order.date || order.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td>
                                  <div style={{ fontWeight: 600, color: '#333' }}>{customerName}</div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>{shipping.phone || ''}</div>
                                </td>
                                <td>
                                  <span style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                                    {oItems.length} item{oItems.length !== 1 ? 's' : ''}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 700, color: '#C53018' }}>₹{order.totalAmount}</td>
                                <td>
                                  <span style={{ fontSize: '12px', color: '#555' }}>{order.paymentMethod || 'COD'}</span>
                                </td>
                                <td>
                                  <span className={`status-badge ${statusClass}`}>
                                    {order.status || 'Confirmed'}
                                  </span>
                                </td>
                                <td>
                                  <button className="btn-outline-action" onClick={() => setSelectedOrder(order)}>
                                    View / Fulfill
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeMenu === 'Products' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Products</h1>
                <p>Add or remove products from the shop.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0 }}>{editingProductId ? 'Edit Product' : 'Add New Product'}</h3>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {editingProductId && (
                        <button className="btn-secondary" style={{ padding: '10px 24px', borderRadius: '8px' }} onClick={cancelEditProduct}>Cancel</button>
                      )}
                      <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => {
                        if (newProductName && (newProductPrice || newProductVariants.length > 0)) {
                          const productData = {
                            name: newProductName,
                            name_te: newProductNameTe || undefined,
                            desc: newProductDesc,
                            desc_te: newProductDescTe || undefined,
                            price: newProductVariants.length > 0 ? newProductVariants[0].price : Number(newProductPrice),
                            oldPrice: newProductOldPrice ? Number(newProductOldPrice) : null,
                            variants: newProductVariants.length > 0 ? newProductVariants : undefined,
                            categoryid: newProductCategory,
                            sku: newProductSku || undefined,
                            stock: Number(newProductStock) || 50,
                            featured: newProductFeatured ? 1 : 0,
                            bestseller: newProductBestseller ? 1 : 0,
                            rating: 5,
                            reviews: 0,
                            image: newProductImages.length > 0 ? newProductImages[0] : '/assets/product_pooja_kit.png',
                            images: newProductImages,
                            badge: newProductBadgeText ? { text: newProductBadgeText, type: 'primary' } : (editingProductId ? undefined : { text: 'New Arrival', type: 'new' })
                          };
                          if (editingProductId) {
                            updateProduct(editingProductId, productData);
                          } else {
                            addProduct(productData);
                          }
                          cancelEditProduct();
                        }
                      }}>
                        <Save size={18} /> {editingProductId ? 'Save Changes' : 'Publish Product'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
                    {/* Left Column - Main Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      <div className="dash-card">
                        <div className="card-header">
                          <div className="card-title">General Information</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="admin-form-label">Product Title (English) <span className="required">*</span></label>
                            <input type="text" placeholder="e.g., Premium Pooja Thali Set" className="login-input" value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                          </div>
                          <div>
                            <label className="admin-form-label">Product Title (Telugu / తెలుగు)</label>
                            <input type="text" placeholder="ఉదా: సంపూర్ణ పూజా సామగ్రి కిట్" className="login-input" value={newProductNameTe} onChange={e => setNewProductNameTe(e.target.value)} />
                          </div>
                          <div>
                            <label className="admin-form-label">Description (English)</label>
                            <textarea placeholder="Provide detailed information about the product..." className="login-input admin-textarea" style={{ minHeight: '100px' }} value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} maxLength="1000" />
                          </div>
                          <div>
                            <label className="admin-form-label">Description (Telugu / తెలుగు)</label>
                            <textarea placeholder="ఉత్పత్తి గురించిన సమగ్ర సమాచారాన్ని తెలుగులో నమోదు చేయండి..." className="login-input admin-textarea" style={{ minHeight: '100px' }} value={newProductDescTe} onChange={e => setNewProductDescTe(e.target.value)} maxLength="1000" />
                          </div>
                        </div>
                      </div>

                      <div className="dash-card">
                        <div className="card-header">
                          <div className="card-title">Media (Up to 6 images - Hostinger Storage)</div>
                        </div>
                        
                        <div className="admin-dropzone" style={{ marginBottom: '16px' }}>
                          <input id="image-upload-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={newProductImages.length >= 6 || isUploadingImage} />
                          <label htmlFor="image-upload-input" style={{ cursor: newProductImages.length >= 6 || isUploadingImage ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div className="admin-dropzone-icon">
                              <BoxSelect size={24} />
                            </div>
                            <div>
                              <span style={{ fontWeight: 600, color: 'var(--admin-primary)' }}>Click to upload</span> or drag and drop
                              <div className="admin-form-hint">PNG, JPG, WebP (Stored in persistent Hostinger storage)</div>
                            </div>
                          </label>
                          {selectedImageFile && (
                            <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '13px', color: '#4B5563', fontWeight: 500 }}>{selectedImageFile.name} ({(selectedImageFile.size / 1024).toFixed(1)} KB)</span>
                              <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }} onClick={handleAddImage} disabled={!selectedImageFile || newProductImages.length >= 6 || isUploadingImage}>
                                {isUploadingImage ? 'Uploading...' : 'Add Image'}
                              </button>
                            </div>
                          )}
                        </div>

                        {newProductImages.length > 0 && (
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {newProductImages.map((img, i) => (
                              <div key={i} style={{ position: 'relative', width: '80px', height: '80px', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden', boxShadow: 'var(--admin-shadow-sm)' }}>
                                <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} />
                                <button onClick={() => setNewProductImages(newProductImages.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.92)', color: '#DC2626', border: 'none', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}><Trash2 size={12} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="dash-card">
                        <div className="card-header">
                          <div className="card-title">Variants (Sizes / Weights)</div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px', flexWrap: 'wrap' }}>
                          <div style={{ flex: '1 1 90px' }}>
                            <label className="admin-form-label">Unit</label>
                            <select className="login-input" value={currentVariantUnit} onChange={e => setCurrentVariantUnit(e.target.value)}>
                              <option value="gm">gm</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value=" Liter">Liter</option>
                              <option value=" Pcs">Pcs</option>
                            </select>
                          </div>
                          <div style={{ flex: '2 1 120px' }}>
                            <label className="admin-form-label">Value</label>
                            <input type="number" placeholder="e.g. 50" className="login-input" value={currentVariantValue} onChange={e => setCurrentVariantValue(e.target.value)} />
                          </div>
                          <div style={{ flex: '2 1 120px' }}>
                            <label className="admin-form-label">Price (₹)</label>
                            <input type="number" placeholder="e.g. 199" className="login-input" value={currentVariantPrice} onChange={e => setCurrentVariantPrice(e.target.value)} />
                          </div>
                          <div style={{ flex: '0 0 auto' }}>
                            <button className="btn-secondary" style={{ height: '42px', padding: '0 18px' }} onClick={handleAddVariant}>Add</button>
                          </div>
                        </div>

                        {newProductVariants.length > 0 && (
                          <div className="admin-table-wrapper" style={{ margin: 0 }}>
                            <table className="admin-table" style={{ fontSize: '13px' }}>
                              <thead>
                                <tr>
                                  <th>Variant</th>
                                  <th>Price</th>
                                  <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {newProductVariants.map((v, i) => (
                                  <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{v.attribute}</td>
                                    <td style={{ color: 'var(--admin-primary)', fontWeight: 700 }}>₹{v.price}</td>
                                    <td style={{ textAlign: 'right' }}>
                                      <button onClick={() => setNewProductVariants(newProductVariants.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 4 }}><Trash2 size={16} /></button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column - Organization & Pricing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div className="dash-card">
                        <div className="card-header">
                          <div className="card-title">Pricing</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="admin-form-label">Base Price (₹) <span className="required">*</span></label>
                            <input type="number" placeholder="0.00" className="login-input" value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
                            <div className="admin-form-hint">Leave blank if variants dictate the price.</div>
                          </div>
                          <div>
                            <label className="admin-form-label">Compare-at Price (₹)</label>
                            <input type="number" placeholder="0.00" className="login-input" value={newProductOldPrice} onChange={e => setNewProductOldPrice(e.target.value)} />
                            <div className="admin-form-hint">To show a discount, enter higher than base price.</div>
                          </div>
                        </div>
                      </div>

                      <div className="dash-card">
                        <div className="card-header">
                          <div className="card-title">Organization & Stock</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label className="admin-form-label">Category</label>
                            <select className="login-input" value={newProductCategory} onChange={e => setNewProductCategory(Number(e.target.value))}>
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="admin-form-label">SKU (Stock Keeping Unit)</label>
                            <input type="text" placeholder="e.g. GS-THALI-01" className="login-input" value={newProductSku} onChange={e => setNewProductSku(e.target.value)} />
                          </div>
                          <div>
                            <label className="admin-form-label">Initial Stock Level</label>
                            <input type="number" min="0" placeholder="50" className="login-input" value={newProductStock} onChange={e => setNewProductStock(e.target.value)} />
                          </div>
                          <div>
                            <label className="admin-form-label">Badge Label</label>
                            <input type="text" placeholder="e.g. Pure Brass, Best Seller" className="login-input" value={newProductBadgeText} onChange={e => setNewProductBadgeText(e.target.value)} />
                          </div>
                          <div style={{ display: 'flex', gap: '16px', paddingTop: '4px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                              <input type="checkbox" checked={newProductFeatured} onChange={e => setNewProductFeatured(e.target.checked)} />
                              Featured
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
                              <input type="checkbox" checked={newProductBestseller} onChange={e => setNewProductBestseller(e.target.checked)} />
                              Best Seller
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <h3 style={{ margin: 0 }}>Product Catalog & Inventory ({products.length})</h3>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      Real-time sync to public shop & search
                    </span>
                  </div>

                  {/* Filter and Search Bar for Products */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', background: '#F9FAFB', padding: '14px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                    <div style={{ flex: '1 1 220px', position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#9CA3AF' }} />
                      <input
                        type="text"
                        placeholder="Search product name or SKU..."
                        value={productSearchQuery}
                        onChange={e => { setProductSearchQuery(e.target.value); setProductCurrentPage(1); }}
                        style={{ width: '100%', padding: '9px 10px 9px 34px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                      />
                    </div>

                    <div style={{ flex: '0 0 160px' }}>
                      <select
                        value={productCategoryFilter}
                        onChange={e => { setProductCategoryFilter(e.target.value); setProductCurrentPage(1); }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                      >
                        <option value="All">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    <div style={{ flex: '0 0 130px' }}>
                      <select
                        value={productStatusFilter}
                        onChange={e => { setProductStatusFilter(e.target.value); setProductCurrentPage(1); }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>
                    </div>

                    <div style={{ flex: '0 0 140px' }}>
                      <select
                        value={productStockFilter}
                        onChange={e => { setProductStockFilter(e.target.value); setProductCurrentPage(1); }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                      >
                        <option value="All">All Stock Levels</option>
                        <option value="in_stock">In Stock (&gt;0)</option>
                        <option value="low_stock">Low Stock (1-10)</option>
                        <option value="out_of_stock">Out of Stock (0)</option>
                      </select>
                    </div>

                    {(productSearchQuery || productCategoryFilter !== 'All' || productStatusFilter !== 'All' || productStockFilter !== 'All') && (
                      <button
                        onClick={() => {
                          setProductSearchQuery('');
                          setProductCategoryFilter('All');
                          setProductStatusFilter('All');
                          setProductStockFilter('All');
                          setProductCurrentPage(1);
                        }}
                        style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: '#DC2626', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>

                  {/* Filtered Products Table */}
                  {(() => {
                    let filtered = products.filter(p => {
                      if (productSearchQuery.trim()) {
                        const q = productSearchQuery.toLowerCase().trim();
                        const matchName = p.name && p.name.toLowerCase().includes(q);
                        const matchSku = p.sku && p.sku.toLowerCase().includes(q);
                        if (!matchName && !matchSku) return false;
                      }
                      if (productCategoryFilter !== 'All' && String(p.categoryid) !== String(productCategoryFilter)) {
                        return false;
                      }
                      if (productStatusFilter !== 'All') {
                        const currentStatus = p.status || 'active';
                        if (currentStatus !== productStatusFilter) return false;
                      }
                      if (productStockFilter !== 'All') {
                        const s = p.stock !== undefined ? Number(p.stock) : 50;
                        if (productStockFilter === 'in_stock' && s <= 0) return false;
                        if (productStockFilter === 'low_stock' && (s <= 0 || s > 10)) return false;
                        if (productStockFilter === 'out_of_stock' && s !== 0) return false;
                      }
                      return true;
                    });

                    const pageSize = 10;
                    const totalPages = Math.ceil(filtered.length / pageSize) || 1;
                    const currentPageClamped = Math.min(productCurrentPage, totalPages);
                    const paginated = filtered.slice((currentPageClamped - 1) * pageSize, currentPageClamped * pageSize);

                    return (
                      <>
                        <div className="admin-table-wrapper" style={{ margin: 0 }}>
                          <table className="admin-table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>SKU</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginated.map(p => {
                                const s = p.stock !== undefined ? Number(p.stock) : 50;
                                const isActive = (p.status || 'active') === 'active';
                                const cat = categories.find(c => c.id === p.categoryid);
                                return (
                                  <tr key={p.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '12px 14px', color: '#9CA3AF', fontFamily: 'monospace' }}>#{p.id}</td>
                                    <td style={{ padding: '12px 14px', fontWeight: '500' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img 
                                          src={p.image || '/assets/product_pooja_kit.png'} 
                                          alt={p.name} 
                                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #E5E7EB' }} 
                                          onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} 
                                        />
                                        <div>
                                          <div style={{ color: '#111827', fontWeight: 600 }}>{p.name}</div>
                                          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                                            {p.featured ? <span style={{ fontSize: '10px', color: '#D97706', background: '#FEF3C7', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>⭐ Featured</span> : null}
                                            {p.bestseller ? <span style={{ fontSize: '10px', color: '#DC2626', background: '#FEE2E2', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>🔥 Best Seller</span> : null}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td style={{ padding: '12px 14px', color: '#4B5563' }}>{cat ? cat.name : 'Pooja Kits'}</td>
                                    <td style={{ padding: '12px 14px', color: '#6B7280', fontFamily: 'monospace' }}>{p.sku || `GS-P${p.id}`}</td>
                                    <td style={{ padding: '12px 14px', color: '#111827', fontWeight: 600 }}>
                                      ₹{Number(p.price).toLocaleString()}
                                      {p.oldPrice && <span style={{ textDecoration: 'line-through', color: '#9CA3AF', marginLeft: '6px', fontSize: '11px' }}>₹{p.oldPrice}</span>}
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                      <span style={{
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        background: s === 0 ? '#FEE2E2' : (s <= 10 ? '#FFEDD5' : '#DCFCE7'),
                                        color: s === 0 ? '#DC2626' : (s <= 10 ? '#EA580C' : '#16A34A')
                                      }}>
                                        {s === 0 ? 'Out of Stock' : `${s} in stock`}
                                      </span>
                                    </td>
                                    <td style={{ padding: '12px 14px' }}>
                                      <button
                                        onClick={async () => {
                                          const nextStatus = isActive ? 'inactive' : 'active';
                                          await updateProduct(p.id, { status: nextStatus });
                                        }}
                                        style={{
                                          padding: '4px 10px',
                                          borderRadius: '14px',
                                          border: '1px solid',
                                          cursor: 'pointer',
                                          fontSize: '11px',
                                          fontWeight: 'bold',
                                          background: isActive ? '#F0FDF4' : '#F3F4F6',
                                          color: isActive ? '#16A34A' : '#6B7280',
                                          borderColor: isActive ? '#BBF7D0' : '#E5E7EB'
                                        }}
                                        title="Click to toggle Active / Inactive on Website"
                                      >
                                        {isActive ? '● Published' : '○ Inactive'}
                                      </button>
                                    </td>
                                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                                        <button
                                          onClick={() => setViewingProductModal(p)}
                                          style={{ color: '#4F46E5', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                          title="View Product Details"
                                        >
                                          <Eye size={14} /> View
                                        </button>
                                        <button
                                          onClick={() => handleEditProduct(p)}
                                          style={{ color: '#0284C7', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 6px' }}
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={async () => {
                                            if (window.confirm(`Are you sure you want to delete product "${p.name}"? Historical orders referencing this product will be preserved.`)) {
                                              await deleteProduct(p.id);
                                            }
                                          }}
                                          style={{ color: '#DC2626', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: '4px 6px' }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                              {paginated.length === 0 && (
                                <tr>
                                  <td colSpan="8" style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF', fontStyle: 'italic' }}>
                                    No products matching your search and filter criteria.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination Controls */}
                        {filtered.length > pageSize && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                            <div style={{ fontSize: '12px', color: '#6B7280' }}>
                              Showing {((currentPageClamped - 1) * pageSize) + 1} to {Math.min(currentPageClamped * pageSize, filtered.length)} of {filtered.length} products
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                disabled={currentPageClamped <= 1}
                                onClick={() => setProductCurrentPage(p => Math.max(1, p - 1))}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #D1D5DB',
                                  background: currentPageClamped <= 1 ? '#F3F4F6' : '#FFFFFF',
                                  color: currentPageClamped <= 1 ? '#9CA3AF' : '#374151',
                                  cursor: currentPageClamped <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 500
                                }}
                              >
                                ← Previous
                              </button>
                              <span style={{ padding: '6px 12px', fontSize: '12px', color: '#374151', fontWeight: 600 }}>
                                Page {currentPageClamped} of {totalPages}
                              </span>
                              <button
                                disabled={currentPageClamped >= totalPages}
                                onClick={() => setProductCurrentPage(p => Math.min(totalPages, p + 1))}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  border: '1px solid #D1D5DB',
                                  background: currentPageClamped >= totalPages ? '#F3F4F6' : '#FFFFFF',
                                  color: currentPageClamped >= totalPages ? '#9CA3AF' : '#374151',
                                  cursor: currentPageClamped >= totalPages ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 500
                                }}
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Categories' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="admin-page-title">Manage Categories</h1>
                  <p className="admin-page-subtitle">Create and organize store product categories with custom slugs, images, and display order.</p>
                </div>
                {categoryFeedback && (
                  <div style={{ padding: '8px 16px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#047857', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
                    {categoryFeedback}
                  </div>
                )}
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                {/* Category Add/Edit Card */}
                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">{editingCategoryId ? '✏️ Edit Category' : '➕ Add New Category'}</div>
                      <div className="card-subtitle">Categories categorize store essentials and sync directly with the public store navigation.</div>
                    </div>
                    {editingCategoryId && (
                      <button 
                        className="btn-secondary" 
                        onClick={cancelEditCategory}
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Category Name (English) <span className="required">*</span></label>
                      <input 
                        type="text" 
                        placeholder="e.g., Rudraksha & Sacred Beads" 
                        className="login-input" 
                        value={newCategoryName} 
                        onChange={e => {
                          const val = e.target.value;
                          setNewCategoryName(val);
                          if (!editingCategoryId && (!newCategorySlug || newCategorySlug === newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))) {
                            setNewCategorySlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                          }
                        }} 
                      />
                    </div>

                    <div>
                      <label className="admin-form-label">Category Name (Telugu / తెలుగు)</label>
                      <input 
                        type="text" 
                        placeholder="ఉదా: రుద్రాక్ష & జపమాలలు" 
                        className="login-input" 
                        value={newCategoryNameTe} 
                        onChange={e => setNewCategoryNameTe(e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="admin-form-label">URL Slug</label>
                      <input 
                        type="text" 
                        placeholder="e.g., rudraksha-sacred-beads" 
                        className="login-input" 
                        style={{ fontFamily: 'monospace' }} 
                        value={newCategorySlug} 
                        onChange={e => setNewCategorySlug(e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="admin-form-label">Display Order</label>
                      <input 
                        type="number" 
                        min="1" 
                        placeholder="1" 
                        className="login-input" 
                        value={newCategoryDisplayOrder} 
                        onChange={e => setNewCategoryDisplayOrder(e.target.value)} 
                      />
                    </div>

                    <div>
                      <label className="admin-form-label">Status</label>
                      <select 
                        className="login-input" 
                        value={newCategoryStatus} 
                        onChange={e => setNewCategoryStatus(e.target.value)}
                      >
                        <option value="active">Active (Visible on public store)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label className="admin-form-label">Description (English)</label>
                      <textarea 
                        placeholder="Briefly describe the pooja/samagri items in this category..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '75px' }} 
                        value={newCategoryDesc} 
                        onChange={e => setNewCategoryDesc(e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="admin-form-label">Description (Telugu / తెలుగు)</label>
                      <textarea 
                        placeholder="ఈ వర్గంలో గల పూజా ద్రవ్యాల గురించిన సంక్షిప్త వివరణ..." 
                        className="login-input admin-textarea" 
                        style={{ minHeight: '75px' }} 
                        value={newCategoryDescTe} 
                        onChange={e => setNewCategoryDescTe(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Image Upload for Category */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', padding: '14px 18px', background: '#FAF7F4', borderRadius: '12px', border: '1px solid #F0E4DC' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img 
                        src={newCategoryImage || '/assets/product_pooja_kit.png'} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} 
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label className="admin-form-label" style={{ marginBottom: '2px' }}>Category Icon / Image</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleUploadCategoryImg} 
                        disabled={isUploadingCategoryImg}
                        style={{ fontSize: '12px' }} 
                      />
                      <div className="admin-form-hint">
                        {isUploadingCategoryImg ? 'Uploading to Hostinger Storage...' : 'Supported: PNG, JPG, WebP. Persisted in backend.'}
                      </div>
                    </div>
                    {newCategoryImage && (
                      <button 
                        onClick={() => setNewCategoryImage('')} 
                        style={{ padding: '6px 12px', background: '#FEE2E2', border: 'none', color: '#DC2626', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Reset Image
                      </button>
                    )}
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleSaveCategory}
                  >
                    <Save size={16} /> {editingCategoryId ? 'Update Category' : 'Save & Publish Category'}
                  </button>
                </div>

                {/* Categories List Table */}
                <div className="dash-card">
                  <div className="card-header">
                    <div>
                      <div className="card-title">All Categories ({categories.length})</div>
                      <div className="card-subtitle">Active and inactive store categories.</div>
                    </div>
                    <div style={{ position: 'relative', width: '220px' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#9CA3AF' }} />
                      <input
                        type="text"
                        placeholder="Filter categories..."
                        value={categorySearchQuery}
                        onChange={e => setCategorySearchQuery(e.target.value)}
                        className="login-input"
                        style={{ height: '34px', paddingLeft: '32px', fontSize: '12.5px' }}
                      />
                    </div>
                  </div>

                  <div className="admin-table-wrapper" style={{ margin: 0 }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Slug</th>
                          <th>Products</th>
                          <th>Order</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories
                          .filter(c => {
                            if (!categorySearchQuery.trim()) return true;
                            const q = categorySearchQuery.toLowerCase();
                            return (c.name && c.name.toLowerCase().includes(q)) || (c.slug && c.slug.toLowerCase().includes(q));
                          })
                          .map(c => {
                            const prodsCount = products.filter(p => p.categoryid === c.id).length;
                            const isActive = (c.status || 'active') === 'active';
                            return (
                              <tr key={c.id}>
                                <td style={{ color: '#9CA3AF', fontFamily: 'monospace' }}>#{c.id}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <img 
                                      src={c.image || '/assets/product_pooja_kit.png'} 
                                      alt={c.name} 
                                      style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }} 
                                      onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }} 
                                    />
                                    <div>
                                      <div style={{ fontWeight: 600, color: '#111827' }}>{c.name}</div>
                                      {c.desc && <div style={{ fontSize: '11px', color: '#6B7280', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.desc}</div>}
                                    </div>
                                  </div>
                                </td>
                                <td style={{ color: '#6B7280', fontFamily: 'monospace', fontSize: '12px' }}>
                                  {c.slug || '-'}
                                </td>
                                <td>
                                  <span style={{ background: '#F3F4F6', color: '#4B5563', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600 }}>
                                    {prodsCount} item{prodsCount !== 1 ? 's' : ''}
                                  </span>
                                </td>
                                <td style={{ color: '#6B7280', fontWeight: 500 }}>
                                  {c.display_order || 1}
                                </td>
                                <td>
                                  <button
                                    onClick={() => handleToggleCategoryStatus(c)}
                                    className={`status-badge ${isActive ? 'active' : 'inactive'}`}
                                    style={{ cursor: 'pointer', border: 'none' }}
                                    title="Click to toggle Active / Inactive"
                                  >
                                    {isActive ? '● Active' : '○ Inactive'}
                                  </button>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <div style={{ display: 'inline-flex', gap: '8px' }}>
                                    <button
                                      onClick={() => handleEditCategory(c)}
                                      className="btn-secondary"
                                      style={{ padding: '5px 12px', fontSize: '12px' }}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={async () => {
                                        if (window.confirm(`Are you sure you want to delete category "${c.name}"? Products in this category will safely become unassigned without breaking historical orders.`)) {
                                          await deleteCategory(c.id);
                                        }
                                      }}
                                      className="btn-danger"
                                      style={{ padding: '5px 12px', fontSize: '12px' }}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {categories.length === 0 && (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
                              No categories found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Inventory' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 className="admin-page-title">Inventory & Stock Management</h1>
                  <p className="admin-page-subtitle">Track real-time stock levels, record restock movements, and protect against overselling.</p>
                </div>
                {inventoryFeedback && (
                  <div className="status-pill status-pill-active" style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> {inventoryFeedback}
                  </div>
                )}
              </div>

              {/* 4 Summary KPI Cards */}
              <div className="metrics-grid" style={{ marginBottom: '24px' }}>
                <div className="dash-card">
                  <div className="metric-header">
                    <span className="metric-title">Total Catalog SKUs</span>
                    <div className="metric-icon-box" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      <Box size={20} />
                    </div>
                  </div>
                  <div className="metric-value">{products.length}</div>
                  <div className="metric-footer">
                    <span className="metric-subtext">Active store catalog products</span>
                  </div>
                </div>

                <div className="dash-card">
                  <div className="metric-header">
                    <span className="metric-title">Healthy Stock (&gt;10)</span>
                    <div className="metric-icon-box" style={{ background: '#DCFCE7', color: '#15803D' }}>
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                  <div className="metric-value" style={{ color: '#15803D' }}>
                    {products.filter(p => (p.stock !== undefined ? p.stock : 50) > 10).length}
                  </div>
                  <div className="metric-footer">
                    <span className="status-pill status-pill-active" style={{ fontSize: '11px', padding: '2px 8px' }}>Optimal Level</span>
                  </div>
                </div>

                <div className="dash-card">
                  <div className="metric-header">
                    <span className="metric-title">Low Stock Alert (1-10)</span>
                    <div className="metric-icon-box" style={{ background: '#FEF3C7', color: '#D97706' }}>
                      <Clock size={20} />
                    </div>
                  </div>
                  <div className="metric-value" style={{ color: '#D97706' }}>
                    {products.filter(p => {
                      const s = p.stock !== undefined ? p.stock : 50;
                      return s > 0 && s <= 10;
                    }).length}
                  </div>
                  <div className="metric-footer">
                    <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 600 }}>Reorder Recommended</span>
                  </div>
                </div>

                <div className="dash-card">
                  <div className="metric-header">
                    <span className="metric-title">Out of Stock (0)</span>
                    <div className="metric-icon-box" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                      <Archive size={20} />
                    </div>
                  </div>
                  <div className="metric-value" style={{ color: '#DC2626' }}>
                    {products.filter(p => (p.stock !== undefined ? p.stock : 50) === 0).length}
                  </div>
                  <div className="metric-footer">
                    <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>Immediate Restock Required</span>
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar Card */}
              <div className="dash-card" style={{ marginBottom: '24px', padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: '1 1 320px' }}>
                  <div className="header-search" style={{ maxWidth: '100%', width: '100%' }}>
                    <Search size={16} className="header-search-icon" />
                    <input
                      type="text"
                      placeholder="Search inventory by product name, SKU, or category..."
                      value={inventorySearch}
                      onChange={e => setInventorySearch(e.target.value)}
                    />
                    {inventorySearch && (
                      <button 
                        type="button" 
                        onClick={() => setInventorySearch('')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: `All Products (${products.length})`, value: 'All' },
                    { label: `Healthy (>10)`, value: 'healthy' },
                    { label: `Low Stock (≤10)`, value: 'low' },
                    { label: `Out of Stock (0)`, value: 'out' }
                  ].map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => setInventoryFilter(tab.value)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid',
                        borderColor: inventoryFilter === tab.value ? 'var(--admin-primary)' : 'var(--admin-border)',
                        background: inventoryFilter === tab.value ? '#FFF5F2' : '#FFFFFF',
                        color: inventoryFilter === tab.value ? 'var(--admin-primary)' : '#5C4D44',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inventory Table Card */}
              <div className="dash-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">Live Inventory Status & Stock Adjustments</div>
                    <div className="card-subtitle">Real-time database sync — restocks update public product availability immediately.</div>
                  </div>
                </div>

                <div className="admin-table-wrapper" style={{ margin: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>SKU</th>
                        <th>Unit Price</th>
                        <th>Stock Level</th>
                        <th>Status</th>
                        <th style={{ minWidth: '280px' }}>Adjust Inventory Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products
                        .filter(p => {
                          const stock = p.stock !== undefined ? p.stock : 50;
                          if (inventoryFilter === 'healthy') return stock > 10;
                          if (inventoryFilter === 'low') return stock > 0 && stock <= 10;
                          if (inventoryFilter === 'out') return stock === 0;
                          return true;
                        })
                        .filter(p => {
                          if (!inventorySearch.trim()) return true;
                          const q = inventorySearch.toLowerCase();
                          const catName = categories.find(c => c.id === p.categoryid)?.name?.toLowerCase() || '';
                          return (
                            p.name.toLowerCase().includes(q) ||
                            (p.sku && p.sku.toLowerCase().includes(q)) ||
                            catName.includes(q)
                          );
                        })
                        .map(p => {
                          const currentStock = p.stock !== undefined ? p.stock : 50;
                          const adjValue = stockAdjustmentValues[p.id] !== undefined ? stockAdjustmentValues[p.id] : currentStock;
                          const adjReason = stockAdjustmentReasons[p.id] || 'Restocked';
                          const isLow = currentStock > 0 && currentStock <= 10;
                          const isOut = currentStock === 0;

                          return (
                            <tr key={p.id}>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <img
                                    src={p.image || (p.images && p.images[0]) || '/assets/product_pooja_kit.png'}
                                    alt={p.name}
                                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #E5E7EB' }}
                                    onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }}
                                  />
                                  <div>
                                    <div style={{ fontWeight: '600', color: '#111827', fontSize: '13.5px' }}>{p.name}</div>
                                    <div style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'monospace' }}>ID: #{p.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="status-badge" style={{ background: '#F3F4F6', color: '#4B5563', fontSize: '11.5px', padding: '3px 8px' }}>
                                  {categories.find(c => c.id === p.categoryid)?.name || 'General'}
                                </span>
                              </td>
                              <td>
                                <span style={{ color: '#4B5563', fontSize: '12px', fontFamily: 'monospace', background: '#FAF7F5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #EBE4DE' }}>
                                  {p.sku || `GS-SKU-${p.id}`}
                                </span>
                              </td>
                              <td>
                                <strong style={{ color: '#111827', fontSize: '13.5px' }}>₹{p.price}</strong>
                              </td>
                              <td>
                                <span style={{
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  color: isOut ? '#DC2626' : (isLow ? '#EA580C' : '#16A34A')
                                }}>
                                  {currentStock} units
                                </span>
                              </td>
                              <td>
                                {isOut ? (
                                  <span className="status-badge cancelled" style={{ fontSize: '11px', padding: '3px 10px' }}>• Out of Stock</span>
                                ) : isLow ? (
                                  <span className="status-badge pending" style={{ fontSize: '11px', padding: '3px 10px', background: '#FEF3C7', color: '#D97706' }}>• Low Stock</span>
                                ) : (
                                  <span className="status-badge active" style={{ fontSize: '11px', padding: '3px 10px' }}>• In Stock</span>
                                )}
                              </td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <input
                                    type="number"
                                    min="0"
                                    className="login-input"
                                    style={{ width: '75px', padding: '6px 8px', fontSize: '13px', fontWeight: '600', textAlign: 'center' }}
                                    value={adjValue}
                                    onChange={e => {
                                      const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                                      setStockAdjustmentValues({ ...stockAdjustmentValues, [p.id]: val });
                                    }}
                                  />
                                  <select
                                    className="login-input"
                                    style={{ width: '110px', padding: '6px 8px', fontSize: '12px' }}
                                    value={adjReason}
                                    onChange={e => {
                                      setStockAdjustmentReasons({ ...stockAdjustmentReasons, [p.id]: e.target.value });
                                    }}
                                  >
                                    <option value="Restocked">Restocked</option>
                                    <option value="Store Sale">Store Sale</option>
                                    <option value="Damaged">Damaged</option>
                                    <option value="Audit Count">Audit Count</option>
                                  </select>
                                  <button
                                    onClick={async () => {
                                      await updateProductStock(p.id, adjValue, adjReason);
                                      setInventoryFeedback(`Stock updated for "${p.name}" to ${adjValue} units (${adjReason}).`);
                                      setTimeout(() => setInventoryFeedback(''), 4000);
                                    }}
                                    className="btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                                  >
                                    <Save size={13} /> Update
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#9CA3AF' }}>
                            No products found matching the selected filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Bookings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CalendarDays size={26} color="#E04E15" />
                    Spiritual Bookings & Pandit Coordination
                  </h1>
                  <p>Review customer pooja requests, coordinate preferred dates, assign qualified Vedic Pandits, and record updates.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setAssignTaskForm({
                        pandit_id: pandits[0] ? String(pandits[0].id) : '',
                        ritual_name: 'Sri Satyanarayana Swamy Vratam',
                        customer_name: '',
                        customer_phone: '',
                        customer_email: '',
                        service_location: 'Home',
                        service_address: '',
                        city: 'Hyderabad',
                        scheduled_date: new Date().toISOString().split('T')[0],
                        start_time: '09:00 AM',
                        duration_minutes: 150,
                        special_instructions: '',
                        booking_id: null
                      });
                      setAssignTaskConflict(null);
                      setAssignTaskFeedback('');
                      setIsAssignTaskModalOpen(true);
                    }}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: '#E04E15' }}
                  >
                    <Plus size={16} /> + Assign Task to Pandit
                  </button>
                  <button
                    onClick={downloadBookingsCSV}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: '#fff', border: '1px solid #d9d9d9' }}
                  >
                    <Download size={16} /> Export Bookings CSV
                  </button>
                  <button
                    onClick={() => { fetchBookings(); fetchDashboardStats(); fetchWhatsappData(); }}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: '#fff', border: '1px solid #d9d9d9' }}
                  >
                    <RefreshCw size={15} /> Refresh
                  </button>
                </div>
              </div>

              {/* Status KPI Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => setBookingStatusFilter('All')}>
                  <div style={{ color: '#888', fontSize: '12px', fontWeight: 600 }}>Total Bookings</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A', marginTop: '4px' }}>{bookings.length}</div>
                </div>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer', borderLeft: '4px solid #D97706' }} onClick={() => setBookingStatusFilter('Pending Review')}>
                  <div style={{ color: '#D97706', fontSize: '12px', fontWeight: 600 }}>Pending Review</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#D97706', marginTop: '4px' }}>
                    {bookings.filter(b => b.status === 'Pending Review').length}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer', borderLeft: '4px solid #2563EB' }} onClick={() => setBookingStatusFilter('Pandit Assigned')}>
                  <div style={{ color: '#2563EB', fontSize: '12px', fontWeight: 600 }}>Pandit Assigned</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563EB', marginTop: '4px' }}>
                    {bookings.filter(b => b.status === 'Pandit Assigned').length}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer', borderLeft: '4px solid #059669' }} onClick={() => setBookingStatusFilter('Confirmed')}>
                  <div style={{ color: '#059669', fontSize: '12px', fontWeight: 600 }}>Confirmed</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669', marginTop: '4px' }}>
                    {bookings.filter(b => b.status === 'Confirmed').length}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer', borderLeft: '4px solid #16A34A' }} onClick={() => setBookingStatusFilter('Completed')}>
                  <div style={{ color: '#16A34A', fontSize: '12px', fontWeight: 600 }}>Completed</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16A34A', marginTop: '4px' }}>
                    {bookings.filter(b => b.status === 'Completed').length}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '16px', cursor: 'pointer', borderLeft: '4px solid #DC2626' }} onClick={() => setBookingStatusFilter('Cancelled')}>
                  <div style={{ color: '#DC2626', fontSize: '12px', fontWeight: 600 }}>Cancelled / Rejected</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#DC2626', marginTop: '4px' }}>
                    {bookings.filter(b => b.status === 'Cancelled' || b.status === 'Rejected').length}
                  </div>
                </div>
              </div>

              {/* Filter and Search Bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)',
                padding: '16px 20px', borderRadius: '14px', border: '1px solid #eee',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '24px',
                display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end'
              }}>
                <div style={{ flex: '2 1 240px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Search Bookings</label>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '10px', color: '#888' }} />
                    <input 
                      type="text" 
                      placeholder="Ref #, devotee name, phone, service, city..." 
                      value={bookingSearchQuery} 
                      onChange={e => setBookingSearchQuery(e.target.value)} 
                      style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} 
                    />
                  </div>
                </div>
                <div style={{ flex: '1 1 170px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Lifecycle Status</label>
                  <select 
                    value={bookingStatusFilter} 
                    onChange={e => setBookingStatusFilter(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                  >
                    <option value="All">All Statuses ({bookings.length})</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Awaiting Customer Confirmation">Awaiting Customer Confirmation</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pandit Assigned">Pandit Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Start Date</label>
                  <input 
                    type="date" 
                    value={bookingFilterStartDate} 
                    onChange={e => setBookingFilterStartDate(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} 
                  />
                </div>
                <div style={{ flex: '1 1 140px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>End Date</label>
                  <input 
                    type="date" 
                    value={bookingFilterEndDate} 
                    onChange={e => setBookingFilterEndDate(e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }} 
                  />
                </div>
                {(bookingSearchQuery || bookingStatusFilter !== 'All' || bookingFilterStartDate || bookingFilterEndDate) && (
                  <button 
                    onClick={() => {
                      setBookingSearchQuery('');
                      setBookingStatusFilter('All');
                      setBookingFilterStartDate('');
                      setBookingFilterEndDate('');
                    }}
                    style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#666', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {/* Bookings Table */}
              <div className="admin-table-wrapper" style={{ margin: 0 }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Devotee Details</th>
                      <th>Spiritual Service</th>
                      <th>Preferred Schedule</th>
                      <th>Location / City</th>
                      <th>Status</th>
                      <th>Assigned Pandit</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let displayList = bookings || [];
                      if (bookingSearchQuery) {
                        const q = bookingSearchQuery.toLowerCase();
                        displayList = displayList.filter(b => 
                          (b.booking_id && b.booking_id.toLowerCase().includes(q)) ||
                          (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
                          (b.customer_phone && b.customer_phone.toLowerCase().includes(q)) ||
                          (b.service_name && b.service_name.toLowerCase().includes(q)) ||
                          (b.city && b.city.toLowerCase().includes(q))
                        );
                      }
                      if (bookingFilterStartDate) {
                        displayList = displayList.filter(b => new Date(b.preferred_date) >= new Date(bookingFilterStartDate));
                      }
                      if (bookingFilterEndDate) {
                        const end = new Date(bookingFilterEndDate);
                        end.setHours(23, 59, 59, 999);
                        displayList = displayList.filter(b => new Date(b.preferred_date) <= end);
                      }
                      if (bookingStatusFilter !== 'All') {
                        displayList = displayList.filter(b => b.status === bookingStatusFilter);
                      }

                      if (displayList.length === 0) {
                        return (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '48px', color: '#999', fontStyle: 'italic' }}>
                              No spiritual bookings found matching current filters.
                            </td>
                          </tr>
                        );
                      }

                      return displayList.map(b => {
                        const statusColors = {
                          'Pending Review': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
                          'Awaiting Customer Confirmation': { bg: '#E0E7FF', color: '#3730A3', border: '#C7D2FE' },
                          'Confirmed': { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0' },
                          'Pandit Assigned': { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE' },
                          'In Progress': { bg: '#FCE7F3', color: '#9D174D', border: '#FBCFE8' },
                          'Completed': { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0' },
                          'Cancelled': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' },
                          'Rejected': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA' }
                        };
                        const sc = statusColors[b.status] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' };

                        return (
                          <tr key={b.id}>
                            <td>
                              <strong style={{ color: '#E04E15', fontFamily: 'monospace', fontSize: '13px' }}>
                                {b.booking_id || `#GS-BKG-${b.id}`}
                              </strong>
                              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                                {new Date(b.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#1A1A1A' }}>{b.customer_name}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>{b.customer_phone}</div>
                              {b.customer_email && <div style={{ fontSize: '11px', color: '#888' }}>{b.customer_email}</div>}
                            </td>
                            <td>
                              <div style={{ fontWeight: 600, color: '#2A1C15' }}>{b.service_name}</div>
                              <span style={{ fontSize: '11px', background: '#FFF1F0', color: '#E04E15', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, textTransform: 'capitalize' }}>
                                {b.service_type || 'pooja'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
                                <Calendar size={13} color="#E04E15" />
                                {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                              </div>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#666', fontSize: '12px', marginTop: '2px' }}>
                                <Clock size={13} />
                                {b.preferred_time || 'Morning Muhurat'}
                              </div>
                            </td>
                            <td>
                              <div style={{ fontWeight: 500, color: '#333' }}>{b.city}</div>
                              <div style={{ fontSize: '11px', color: '#888', textTransform: 'capitalize' }}>
                                Location: {b.service_location || 'home'}
                              </div>
                            </td>
                            <td>
                              <span style={{
                                background: sc.bg,
                                color: sc.color,
                                border: `1px solid ${sc.border}`,
                                padding: '4px 10px',
                                borderRadius: '14px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'inline-block'
                              }}>
                                {b.status || 'Pending Review'}
                              </span>
                            </td>
                            <td>
                              {b.assigned_pandit_name ? (
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ffedd5', color: '#E85C0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                      {b.assigned_pandit_name.charAt(0)}
                                    </div>
                                    <span style={{ fontWeight: 600, fontSize: '13px' }}>{b.assigned_pandit_name}</span>
                                  </div>
                                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '11px', color: '#059669', fontWeight: 600, background: '#ECFDF5', padding: '1px 6px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                                    <CheckCheck size={12} color="#059669" /> WhatsApp: {b.whatsapp_status || 'QUEUED'}
                                  </div>
                                </div>
                              ) : (
                                <span style={{ color: '#D97706', fontSize: '12px', background: '#FEF3C7', padding: '3px 8px', borderRadius: '8px', fontWeight: 500 }}>
                                  Unassigned
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button 
                                className="btn-outline-action"
                                onClick={() => openBookingDetails(b)}
                                style={{ padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Review & Coordinate
                              </button>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              {/* Review & Coordinate Modal */}
              {selectedBooking && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 9999, padding: '20px'
                }}>
                  <div style={{
                    background: '#fff', borderRadius: '16px', maxWidth: '750px', width: '100%',
                    maxHeight: '90vh', overflowY: 'auto', padding: '28px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid #eee'
                  }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Spiritual Booking Review</div>
                        <h2 style={{ fontSize: '20px', color: '#1A1A1A', margin: '4px 0 0 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#E04E15', fontFamily: 'monospace' }}>{selectedBooking.booking_id || `#GS-BKG-${selectedBooking.id}`}</span>
                          <span style={{ fontSize: '13px', background: '#FFF1F0', color: '#E04E15', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                            {selectedBooking.service_name}
                          </span>
                        </h2>
                      </div>
                      <button 
                        onClick={() => setSelectedBooking(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px' }}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {bookingActionFeedback && (
                      <div style={{
                        padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                        background: bookingActionFeedback.includes('successfully') ? '#F0FDF4' : '#FEF2F2',
                        color: bookingActionFeedback.includes('successfully') ? '#15803D' : '#DC2626',
                        border: `1px solid ${bookingActionFeedback.includes('successfully') ? '#BBF7D0' : '#FECACA'}`,
                        fontSize: '13px', fontWeight: 600
                      }}>
                        {bookingActionFeedback}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      {/* Devotee & Service Details */}
                      <div style={{ background: '#FAF7F2', padding: '18px', borderRadius: '12px', border: '1px solid #EAE4D9' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#8C3B1E', fontWeight: 700, textTransform: 'uppercase' }}>
                          Devotee & Ritual Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                          <div><strong>Name:</strong> {selectedBooking.customer_name}</div>
                          <div>
                            <strong>Phone:</strong>{' '}
                            <a href={`tel:${selectedBooking.customer_phone}`} style={{ color: '#E04E15', textDecoration: 'none', fontWeight: 600 }}>
                              {selectedBooking.customer_phone}
                            </a>
                          </div>
                          {selectedBooking.customer_email && (
                            <div>
                              <strong>Email:</strong>{' '}
                              <a href={`mailto:${selectedBooking.customer_email}`} style={{ color: '#E04E15', textDecoration: 'none' }}>
                                {selectedBooking.customer_email}
                              </a>
                            </div>
                          )}
                          <div><strong>Location Type:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedBooking.service_location || 'home'}</span></div>
                          <div><strong>City:</strong> {selectedBooking.city}</div>
                          <div><strong>Address:</strong> {selectedBooking.address}</div>
                          <div><strong>Preferred Language:</strong> {selectedBooking.preferred_language || 'Telugu / Sanskrit'}</div>
                          {selectedBooking.additional_requirements && (
                            <div style={{ marginTop: '6px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #eee' }}>
                              <strong>Requirements / Gotram:</strong> {selectedBooking.additional_requirements}
                            </div>
                          )}
                          {selectedBooking.special_instructions && (
                            <div style={{ marginTop: '4px', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #eee' }}>
                              <strong>Special Instructions:</strong> {selectedBooking.special_instructions}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Admin Coordination & Pandit Assignment Form */}
                      <div style={{ background: '#FFF', padding: '18px', borderRadius: '12px', border: '1px solid #eee' }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#1A1A1A', fontWeight: 700, textTransform: 'uppercase' }}>
                          Team Coordination & Pandit Assignment
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {/* Lifecycle Status */}
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '4px' }}>
                              Booking Lifecycle Status
                            </label>
                            <select 
                              value={bookingStatusInput} 
                              onChange={e => setBookingStatusInput(e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                            >
                              <option value="Pending Review">Pending Review</option>
                              <option value="Awaiting Customer Confirmation">Awaiting Customer Confirmation</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Pandit Assigned">Pandit Assigned</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          {/* Pandit Assignment */}
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '4px' }}>
                              Assign Qualified Vedic Pandit
                            </label>
                            <select 
                              value={bookingPanditIdInput} 
                              onChange={e => setBookingPanditIdInput(e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                            >
                              <option value="">-- Unassigned (Gnana Sudha Coordinating) --</option>
                              {pandits.map(p => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({p.experience || 'Vedic Scholar'}) - {p.specialization || 'Rituals'}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Date & Time Coordination */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '4px' }}>
                                Coordinated Date
                              </label>
                              <input 
                                type="date" 
                                value={bookingDateInput} 
                                onChange={e => setBookingDateInput(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '4px' }}>
                                Muhurat / Time
                              </label>
                              <input 
                                type="text" 
                                placeholder="e.g. 08:30 AM (Brahma Muhurat)"
                                value={bookingTimeInput} 
                                onChange={e => setBookingTimeInput(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px' }}
                              />
                            </div>
                          </div>

                          {/* Cancellation Reason if cancelled */}
                          {(bookingStatusInput === 'Cancelled' || bookingStatusInput === 'Rejected') && (
                            <div>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '4px' }}>
                                Reason for Cancellation / Rejection *
                              </label>
                              <input 
                                type="text"
                                placeholder="State reason (e.g. Devotee postponed, Pandit unavailable, etc.)"
                                value={bookingCancelReasonInput}
                                onChange={e => setBookingCancelReasonInput(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '13px', background: '#FEF2F2' }}
                              />
                            </div>
                          )}

                          {/* Admin Notes */}
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#444', marginBottom: '4px' }}>
                              Internal Admin / Coordination Notes
                            </label>
                            <textarea 
                              rows="3"
                              placeholder="Notes on communication with devotee, samagri readiness, dakshina instructions..."
                              value={bookingAdminNotesInput}
                              onChange={e => setBookingAdminNotesInput(e.target.value)}
                              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', resize: 'vertical' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedBooking(null)}
                        style={{ padding: '10px 20px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: '#fff', border: '1px solid #ddd' }}
                      >
                        Close
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={handleSaveBooking}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                      >
                        <Save size={16} /> Save Coordination Updates
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMenu === 'Coupons' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Coupons & Promotional Offers</h1>
                <p>Create and manage discount coupons validated securely by the backend during checkout.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Create New Coupon</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Coupon Code (e.g. DIWALI20)" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} />
                    <input type="number" placeholder="Discount Percentage (%)" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} />
                    <input type="date" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponExpiry} onChange={e => setNewCouponExpiry(e.target.value)} />
                    <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px' }} onClick={() => {
                      if (newCouponCode && newCouponDiscount && newCouponExpiry) {
                        addCoupon({ code: newCouponCode.toUpperCase().trim(), discount: Number(newCouponDiscount), expiry: newCouponExpiry });
                        setNewCouponCode('');
                        setNewCouponDiscount('');
                        setNewCouponExpiry('');
                      }
                    }}>
                      + Add Coupon
                    </button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Coupons ({coupons.length})</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>Code</th>
                        <th>Discount</th>
                        <th>Expiry Date</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(coupon => (
                        <tr key={coupon.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', fontWeight: 'bold', color: '#1A1A1A' }}>{coupon.code}</td>
                          <td style={{ color: '#E04E15', fontWeight: '600' }}>{coupon.discount}% Off</td>
                          <td style={{ color: '#666' }}>{coupon.expiry}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => deleteCoupon(coupon.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No active coupons available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Payments' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1>Payments & Transactions</h1>
                  <p>Real-time log of customer transactions, payment methods, and gateway settlements.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveMenu('Settings');
                    setSettingsActiveTab('gateway');
                  }}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}
                >
                  <CreditCard size={16} color="#E04E15" /> Configure Gateway Keys
                </button>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Total Transactions</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1A1A1A' }}>{orders.length}</div>
                </div>
                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Collected Revenue</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16A34A' }}>
                    ₹{(dashboardStats?.grossRevenue || orders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)).toLocaleString()}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Cash on Delivery</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FA8C16' }}>
                    {orders.filter(o => o.paymentMethod === 'Cash on Delivery' || !o.paymentMethod).length}
                  </div>
                </div>
                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Online / UPI Payments</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890FF' }}>
                    {orders.filter(o => o.paymentMethod && o.paymentMethod !== 'Cash on Delivery').length}
                  </div>
                </div>
              </div>

              <div className="dash-card">
                <div className="card-header">
                  <div className="card-title">Transaction History</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '13px' }}>
                        <th style={{ padding: '14px 16px' }}>Order Reference</th>
                        <th style={{ padding: '14px 16px' }}>Customer</th>
                        <th style={{ padding: '14px 16px' }}>Payment Method</th>
                        <th style={{ padding: '14px 16px' }}>Amount</th>
                        <th style={{ padding: '14px 16px' }}>Date</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => {
                        const ship = typeof o.shippingDetails === 'string' ? JSON.parse(o.shippingDetails || '{}') : (o.shippingDetails || {});
                        const isCOD = !o.paymentMethod || o.paymentMethod === 'Cash on Delivery';
                        const isPaid = o.paymentStatus === 'Paid' || o.status === 'Delivered';
                        return (
                          <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1A1A1A' }}>
                              #{o.order_number || o.id}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: '500', color: '#1A1A1A' }}>{ship.name || ship.fullName || 'Guest Customer'}</div>
                              <div style={{ fontSize: '12px', color: '#888' }}>{ship.phone || ''}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: isCOD ? '#FFF7E6' : '#E6F7FF',
                                color: isCOD ? '#D46B08' : '#096DD9',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                <CreditCard size={12} /> {o.paymentMethod || 'Cash on Delivery'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#1A1A1A' }}>
                              ₹{Number(o.totalAmount || 0).toLocaleString()}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#666', fontSize: '13px' }}>
                              {new Date(o.date || o.created_at || Date.now()).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: isPaid ? '#F6FFED' : (o.paymentStatus === 'Failed' ? '#FFF1F0' : '#FFFBE6'),
                                color: isPaid ? '#52C41A' : (o.paymentStatus === 'Failed' ? '#F5222D' : '#FA8C16')
                              }}>
                                {isPaid ? 'Paid' : (o.paymentStatus || 'Pending')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#888' }}>
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Reports' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1>Sales & Performance Reports</h1>
                  <p>Comprehensive store performance, category analytics, and CSV exports.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={downloadCSV}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                  >
                    <Download size={16} /> Export Orders CSV
                  </button>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Total Sales Revenue</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#E04E15' }}>
                    ₹{(adminReportsData?.totalRevenue ?? orders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0)).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Excludes cancelled orders</div>
                </div>

                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Completed Orders</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1A1A1A' }}>
                    {adminReportsData?.totalOrders ?? orders.length}
                  </div>
                  <div style={{ fontSize: '11px', color: '#52C41A', marginTop: '4px' }}>100% verified in MySQL</div>
                </div>

                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Total Items Sold</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1890FF' }}>
                    {adminReportsData?.totalItemsSold ?? 0} units
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Across all product categories</div>
                </div>

                <div className="metric-card" style={{ padding: '20px' }}>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '6px' }}>Average Order Value</div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#722ED1' }}>
                    ₹{(adminReportsData?.averageOrderValue ?? 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Revenue per customer order</div>
                </div>
              </div>

              {/* Category Breakdown Table */}
              <div className="dash-card">
                <div className="card-header">
                  <div className="card-title">Category Sales Breakdown</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '13px' }}>
                        <th style={{ padding: '14px 16px' }}>Category</th>
                        <th style={{ padding: '14px 16px' }}>Revenue Generated</th>
                        <th style={{ padding: '14px 16px' }}>Share of Sales</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminReportsData?.categoryBreakdown?.map((cat, idx) => {
                        const totalRev = adminReportsData.totalRevenue || 1;
                        const pct = Math.round((cat.sales / totalRev) * 100);
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1A1A1A' }}>
                              {cat.category}
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#E04E15' }}>
                              ₹{Number(cat.sales).toLocaleString()}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, maxWidth: '200px', height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: '#E04E15', borderRadius: '4px' }}></div>
                                </div>
                                <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {(!adminReportsData?.categoryBreakdown || adminReportsData.categoryBreakdown.length === 0) && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
                            No category sales recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Reviews' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1>Product Reviews Moderation</h1>
                  <p>Moderate customer reviews submitted on the public website products.</p>
                </div>
                <button
                  onClick={() => fetchReviews()}
                  className="btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', background: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}
                >
                  <RefreshCw size={14} /> Refresh Reviews
                </button>
              </div>

              {reviewActionMsg && (
                <div style={{ background: '#F6FFED', border: '1px solid #B7EB8F', color: '#52C41A', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', fontWeight: '500' }}>
                  {reviewActionMsg}
                </div>
              )}

              <div className="dash-card">
                <div className="card-header">
                  <div className="card-title">All Customer Reviews ({reviews.length})</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '13px' }}>
                        <th style={{ padding: '14px 16px' }}>Product</th>
                        <th style={{ padding: '14px 16px' }}>Customer</th>
                        <th style={{ padding: '14px 16px' }}>Rating</th>
                        <th style={{ padding: '14px 16px' }}>Review Text</th>
                        <th style={{ padding: '14px 16px' }}>Date</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map(rev => (
                        <tr key={rev.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={rev.product_image || '/assets/product_pooja_kit.png'}
                                alt=""
                                style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                                onError={e => { e.target.src = '/assets/product_pooja_kit.png'; }}
                              />
                              <div style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '13px', maxWidth: '180px' }}>
                                {rev.product_name || `Product #${rev.product_id}`}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '500', color: '#1A1A1A' }}>{rev.customer_name}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{rev.customer_email || 'Verified Buyer'}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FA8C16' }}>
                              {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                <Star key={i} size={14} fill="#FA8C16" />
                              ))}
                              <span style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '4px', color: '#666' }}>({rev.rating}/5)</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                            {rev.review_title && <div style={{ fontWeight: '600', fontSize: '13px', color: '#1A1A1A', marginBottom: '2px' }}>{rev.review_title}</div>}
                            <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.4 }}>{rev.comment}</div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#888', fontSize: '12px' }}>
                            {new Date(rev.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              onClick={async () => {
                                if (window.confirm('Are you sure you want to delete this customer review?')) {
                                  await deleteReview(rev.id);
                                  setReviewActionMsg('Review deleted successfully.');
                                  setTimeout(() => setReviewActionMsg(''), 3000);
                                }
                              }}
                              style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid #ffccc7',
                                color: '#f5222d',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {reviews.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: '#888', fontStyle: 'italic' }}>
                            No customer reviews submitted yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Customers' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1>Customers Management</h1>
                  <p>View registered customer accounts, order frequency, and lifetime spend.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={customerSearchQuery}
                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d9d9d9', fontSize: '13px', width: '220px' }}
                  />
                  <button
                    onClick={() => fetchAdminCustomers().then(d => setAdminCustomersList(d || []))}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '13px', background: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              <div className="dash-card">
                <div className="card-header">
                  <div className="card-title">Registered Customers Directory</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '16px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', background: '#fafafa', color: '#666', fontSize: '13px' }}>
                        <th style={{ padding: '14px 16px' }}>Customer ID</th>
                        <th style={{ padding: '14px 16px' }}>Customer Details</th>
                        <th style={{ padding: '14px 16px' }}>Total Orders</th>
                        <th style={{ padding: '14px 16px' }}>Total Spent</th>
                        <th style={{ padding: '14px 16px' }}>Last Order Date</th>
                        <th style={{ padding: '14px 16px' }}>Registered On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const list = adminCustomersList.length > 0 ? adminCustomersList : customers.map(c => ({
                          ...c,
                          ordersCount: orders.filter(o => String(o.customerid) === String(c.id)).length,
                          totalSpent: orders.filter(o => String(o.customerid) === String(c.id) && o.status !== 'Cancelled').reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0),
                          lastOrderDate: orders.filter(o => String(o.customerid) === String(c.id)).sort((a,b)=>new Date(b.date||b.created_at)-new Date(a.date||a.created_at))[0]?.date
                        }));
                        const filtered = list.filter(c => {
                          if (!customerSearchQuery) return true;
                          const q = customerSearchQuery.toLowerCase();
                          return (c.name && c.name.toLowerCase().includes(q)) || (c.email && c.email.toLowerCase().includes(q));
                        });

                        return filtered.map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '14px 16px', color: '#888', fontWeight: '500' }}>#{c.id}</td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: '600', color: '#1A1A1A' }}>{c.name}</div>
                              <div style={{ fontSize: '12px', color: '#888' }}>{c.email}</div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <span style={{ background: '#E6F7FF', color: '#1890FF', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                                {c.ordersCount || 0} orders
                              </span>
                            </td>
                            <td style={{ padding: '14px 16px', fontWeight: 'bold', color: '#E04E15' }}>
                              ₹{Number(c.totalSpent || 0).toLocaleString()}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#666', fontSize: '13px' }}>
                              {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No orders yet'}
                            </td>
                            <td style={{ padding: '14px 16px', color: '#888', fontSize: '13px' }}>
                              {c.created_at ? new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified'}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Analytics' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Real-Time Analytics</h1>
                <p>Track your platform's performance, revenue, and order trends.</p>
              </div>
              {renderAnalytics()}
            </div>
          )}

          {activeMenu === 'Settings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Store & Platform Settings</h1>
                <p>Configure payment gateway integrations, manage staff admin accounts, and update store profile.</p>
              </div>

              {/* Sub Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e0e0e0', marginBottom: '24px' }}>
                <button
                  onClick={() => setSettingsActiveTab('gateway')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: settingsActiveTab === 'gateway' ? '3px solid #E04E15' : '3px solid transparent',
                    color: settingsActiveTab === 'gateway' ? '#E04E15' : '#666',
                    fontWeight: settingsActiveTab === 'gateway' ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CreditCard size={16} /> Payment Gateway
                </button>
                <button
                  onClick={() => setSettingsActiveTab('admins')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: settingsActiveTab === 'admins' ? '3px solid #E04E15' : '3px solid transparent',
                    color: settingsActiveTab === 'admins' ? '#E04E15' : '#666',
                    fontWeight: settingsActiveTab === 'admins' ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Key size={16} /> Admin Staff & Roles
                </button>
                <button
                  onClick={() => setSettingsActiveTab('profile')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: settingsActiveTab === 'profile' ? '3px solid #E04E15' : '3px solid transparent',
                    color: settingsActiveTab === 'profile' ? '#E04E15' : '#666',
                    fontWeight: settingsActiveTab === 'profile' ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <UserSquare2 size={16} /> Profile & Security
                </button>
                <button
                  onClick={() => setSettingsActiveTab('store')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: settingsActiveTab === 'store' ? '3px solid #E04E15' : '3px solid transparent',
                    color: settingsActiveTab === 'store' ? '#E04E15' : '#666',
                    fontWeight: settingsActiveTab === 'store' ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Settings size={16} /> Store Configuration & Taxes
                </button>
                <button
                  onClick={() => setSettingsActiveTab('whatsapp')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: settingsActiveTab === 'whatsapp' ? '3px solid #E04E15' : '3px solid transparent',
                    color: settingsActiveTab === 'whatsapp' ? '#E04E15' : '#666',
                    fontWeight: settingsActiveTab === 'whatsapp' ? '600' : '400',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <MessageSquare size={16} /> WhatsApp API & Notifications
                </button>
              </div>

              {/* Tab 1: Payment Gateway */}
              {settingsActiveTab === 'gateway' && (
                <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
                  <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Payment Gateway Configuration</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>Set up your payment provider API keys to accept online payments securely.</p>
                      </div>
                      <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '8px', color: '#1890FF' }}>
                        <CreditCard size={24} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>Gateway Provider</label>
                          <select
                            className="login-input"
                            style={{ width: '100%', background: '#F8F9FB', border: '1px solid #E5E7EB' }}
                            value={gatewayProvider}
                            onChange={(e) => setGatewayProvider(e.target.value)}
                          >
                            <option value="Razorpay">Razorpay</option>
                            <option value="Stripe">Stripe</option>
                            <option value="Cashfree">Cashfree</option>
                            <option value="PhonePe">PhonePe</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>Environment</label>
                          <div style={{ display: 'flex', background: '#F8F9FB', borderRadius: '8px', padding: '4px', border: '1px solid #E5E7EB' }}>
                            <div
                              style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: gatewayMode === 'test' ? '600' : '400', background: gatewayMode === 'test' ? '#FFF' : 'transparent', color: gatewayMode === 'test' ? '#FA8C16' : '#888', boxShadow: gatewayMode === 'test' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                              onClick={() => setGatewayMode('test')}
                            >
                              Test / Sandbox
                            </div>
                            <div
                              style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: gatewayMode === 'live' ? '600' : '400', background: gatewayMode === 'live' ? '#FFF' : 'transparent', color: gatewayMode === 'live' ? '#52C41A' : '#888', boxShadow: gatewayMode === 'live' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
                              onClick={() => setGatewayMode('live')}
                            >
                              Live / Production
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>API Key / Client ID</label>
                        <input
                          type="text"
                          placeholder={`e.g. rzp_${gatewayMode}_1234567890`}
                          className="login-input"
                          style={{ width: '100%' }}
                          value={gatewayKey}
                          onChange={(e) => setGatewayKey(e.target.value)}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500', fontSize: '14px' }}>API Secret</label>
                        <input
                          type="password"
                          placeholder="••••••••••••••••••••"
                          className="login-input"
                          style={{ width: '100%' }}
                          value={gatewaySecret}
                          onChange={(e) => setGatewaySecret(e.target.value)}
                        />
                      </div>

                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                          className="btn-primary"
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px' }}
                          onClick={handleSaveSettings}
                        >
                          <Save size={18} />
                          Save Gateway Settings
                        </button>

                        {settingsSaved && (
                          <span style={{ color: '#52C41A', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
                            <CheckCircle2 size={16} /> Saved Successfully
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Admin Staff */}
              {settingsActiveTab === 'admins' && (
                <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
                  <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Admin Users Management</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>Create and manage dashboard access accounts for your staff.</p>
                      </div>
                      <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '8px', color: '#FA8C16' }}>
                        <Key size={24} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div>
                        <h4 style={{ marginBottom: '12px', color: '#333' }}>Add New Admin Account</h4>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <input
                            type="text"
                            placeholder="Username"
                            className="login-input"
                            style={{ flex: '1 1 200px' }}
                            value={newAdminUsername}
                            onChange={(e) => setNewAdminUsername(e.target.value)}
                          />
                          <input
                            type="password"
                            placeholder="Password"
                            className="login-input"
                            style={{ flex: '1 1 200px' }}
                            value={newAdminPassword}
                            onChange={(e) => setNewAdminPassword(e.target.value)}
                          />
                          <button
                            className="btn-primary"
                            style={{ padding: '0 24px', borderRadius: '8px' }}
                            onClick={() => {
                              if (newAdminUsername && newAdminPassword) {
                                addAdminUser({ username: newAdminUsername, password: newAdminPassword });
                                setNewAdminUsername('');
                                setNewAdminPassword('');
                              }
                            }}
                          >
                            <UserPlus size={16} style={{ marginRight: '8px' }} />
                            Create User
                          </button>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <h4 style={{ marginBottom: '12px', color: '#333' }}>Active Administrators</h4>
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                              <th style={{ padding: '12px' }}>Username</th>
                              <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers.map(admin => (
                              <tr key={admin.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px', fontWeight: '500', color: '#1A1A1A' }}>
                                  {admin.username}
                                  {admin.id === 1 && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#e6f7ff', color: '#1890ff', padding: '2px 8px', borderRadius: '12px' }}>Primary Super Admin</span>}
                                </td>
                                <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                                  {admin.id !== 1 && (
                                    <button
                                      onClick={() => deleteAdminUser(admin.id)}
                                      style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <Trash2 size={16} /> Delete
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Profile & Security */}
              {settingsActiveTab === 'profile' && (
                <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserSquare2 size={20} /> My Profile Details
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#f5f5f5', overflow: 'hidden', border: '1px solid #eee' }}>
                        <img src={currentAdminUser?.avatar || "/assets/pandit_icon_1782464629488.png"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      
                      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Full Name</label>
                          <input type="text" className="login-input" defaultValue={currentAdminUser?.name || 'Vamsi Pallela'} id="adminNameInput" />
                        </div>
                        
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Login Username</label>
                          <input type="text" className="login-input" defaultValue={currentAdminUser?.username} id="adminUsernameInput" />
                        </div>
                        
                        <div>
                          <button className="btn-primary" onClick={() => {
                            const newName = document.getElementById('adminNameInput').value;
                            const newUsername = document.getElementById('adminUsernameInput').value;
                            if (currentAdminUser && newUsername) {
                              updateAdminUser(currentAdminUser.id, { name: newName, username: newUsername });
                              setCurrentAdminUser({ ...currentAdminUser, name: newName, username: newUsername });
                              alert('Profile updated successfully!');
                            }
                          }}>
                            Update Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Key size={20} /> Security & Password
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Current Password</label>
                        <input type="password" className="login-input" id="adminOldPassword" />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>New Password</label>
                        <input type="password" className="login-input" id="adminNewPassword" />
                      </div>

                      <div>
                        <button className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }} onClick={() => {
                          const oldP = document.getElementById('adminOldPassword').value;
                          const newP = document.getElementById('adminNewPassword').value;
                          if (oldP !== currentAdminUser?.password) {
                            alert('Incorrect current password.');
                            return;
                          }
                          if (newP.length < 4) {
                            alert('New password must be at least 4 characters.');
                            return;
                          }
                          updateAdminUser(currentAdminUser.id, { password: newP });
                          setCurrentAdminUser({ ...currentAdminUser, password: newP });
                          document.getElementById('adminOldPassword').value = '';
                          document.getElementById('adminNewPassword').value = '';
                          alert('Password updated successfully!');
                        }}>
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Store Configuration & Taxes */}
              {settingsActiveTab === 'store' && (
                <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px', maxWidth: '850px' }}>
                  {storeSettingsFeedback && (
                    <div style={{ padding: '12px 18px', background: '#F6FFED', border: '1px solid #B7EB8F', color: '#52C41A', borderRadius: '8px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> {storeSettingsFeedback}
                    </div>
                  )}

                  <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Store & Organization Details</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>Configure your store name, official customer support channels, and address printed on invoices.</p>
                      </div>
                      <div style={{ background: '#FFF7E6', padding: '12px', borderRadius: '8px', color: '#FA8C16' }}>
                        <Settings size={24} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Store / Organization Name</label>
                        <input
                          type="text"
                          className="login-input"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Gnana Sudha"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Support Email Address</label>
                        <input
                          type="email"
                          className="login-input"
                          value={storeEmail}
                          onChange={(e) => setStoreEmail(e.target.value)}
                          placeholder="gnanasudha18@gmail.com"
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Customer Support Phone</label>
                        <input
                          type="tel"
                          className="login-input"
                          value={storePhone}
                          onChange={(e) => setStorePhone(e.target.value)}
                          placeholder="+91 9281867002"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Physical Temple / Headquarters Address</label>
                        <input
                          type="text"
                          className="login-input"
                          value={storeAddress}
                          onChange={(e) => setStoreAddress(e.target.value)}
                          placeholder="Temple Road, Hyderabad, Telangana - 500036"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Taxes & Shipping Thresholds</h3>
                        <p style={{ color: '#666', fontSize: '14px' }}>Configure default GST calculation, free shipping thresholds, and delivery rates for orders.</p>
                      </div>
                      <div style={{ background: '#F6FFED', padding: '12px', borderRadius: '8px', color: '#52C41A' }}>
                        <Truck size={24} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Default Tax / GST Rate (%)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            className="login-input"
                            value={storeTaxRate}
                            onChange={(e) => setStoreTaxRate(e.target.value)}
                            placeholder="18"
                            min="0"
                            max="100"
                          />
                          <span style={{ position: 'absolute', right: '12px', top: '10px', color: '#999', fontSize: '13px' }}>%</span>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Free Shipping Threshold (₹)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            className="login-input"
                            value={storeFreeShippingThreshold}
                            onChange={(e) => setStoreFreeShippingThreshold(e.target.value)}
                            placeholder="499"
                            min="0"
                          />
                          <span style={{ position: 'absolute', right: '12px', top: '10px', color: '#999', fontSize: '13px' }}>₹</span>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Standard Shipping Fee (₹)</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            className="login-input"
                            value={storeShippingFee}
                            onChange={(e) => setStoreShippingFee(e.target.value)}
                            placeholder="50"
                            min="0"
                          />
                          <span style={{ position: 'absolute', right: '12px', top: '10px', color: '#999', fontSize: '13px' }}>₹</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        className="btn-primary"
                        onClick={handleSaveStoreSettings}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Save size={18} /> Save Store Configuration
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Official WhatsApp Business Platform & Notifications Outbox */}
              {settingsActiveTab === 'whatsapp' && (
                <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                  {whatsappRetryFeedback && (
                    <div style={{ padding: '12px 18px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', borderRadius: '8px', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={18} /> {whatsappRetryFeedback}
                    </div>
                  )}

                  {/* WhatsApp Integration Status Card */}
                  <div className="metric-card" style={{ display: 'block', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '18px', color: '#1A1A1A', margin: 0 }}>Official WhatsApp Business Platform (Cloud API)</h3>
                          
                          {/* Credential Status */}
                          {(whatsappStatus?.config?.isConfigured || whatsappStatus?.isConfigured) ? (
                            <span style={{ background: '#DCFCE7', color: '#166534', border: '1px solid #BBF7D0', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={13} /> Active & Configured
                            </span>
                          ) : (
                            <span style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={13} /> Outbox Queue Mode (Credentials Pending)
                            </span>
                          )}

                          {/* Connectivity Status */}
                          {whatsappStatus?.connectivity?.status === 'CONNECTED' && (
                            <span style={{ background: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              ● Meta Graph API Online ({whatsappStatus.connectivity.qualityRating || 'Verified'})
                            </span>
                          )}
                          {whatsappStatus?.connectivity?.status === 'AUTH_ERROR' && (
                            <span style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FCA5A5', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertTriangle size={13} /> Meta Auth Failed: {whatsappStatus.connectivity.message}
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#666', fontSize: '13.5px', margin: '6px 0 0 0' }}>
                          Official Meta Graph API ({whatsappStatus?.config?.apiVersion || 'v21.0'}) utility template messaging for ritual task assignments, reschedules, and cancellations.
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button 
                          onClick={handleProcessOutboxNow}
                          disabled={isProcessingOutbox}
                          className="btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', borderRadius: '6px', background: '#F8FAFC', border: '1px solid #CBD5E1', cursor: 'pointer' }}
                        >
                          <Send size={14} className={isProcessingOutbox ? 'animate-spin' : ''} /> {isProcessingOutbox ? 'Processing...' : 'Process Outbox Now'}
                        </button>
                        <button 
                          onClick={fetchWhatsappData}
                          disabled={isLoadingWhatsapp}
                          className="btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <RefreshCw size={14} className={isLoadingWhatsapp ? 'animate-spin' : ''} /> Refresh Status
                        </button>
                      </div>
                    </div>

                    {/* Environment status details */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                      <div style={{ background: '#FAF7F2', padding: '14px 16px', borderRadius: '8px', border: '1px solid #EAE4D9' }}>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>PHONE NUMBER ID</div>
                        <div style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 600, color: '#1A1A1A', marginTop: '3px' }}>
                          {whatsappStatus?.config?.maskedPhoneNumberId || 'Not Set in .env'}
                        </div>
                      </div>
                      <div style={{ background: '#FAF7F2', padding: '14px 16px', borderRadius: '8px', border: '1px solid #EAE4D9' }}>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>BUSINESS ACCOUNT ID</div>
                        <div style={{ fontSize: '13.5px', fontFamily: 'monospace', fontWeight: 600, color: '#1A1A1A', marginTop: '3px' }}>
                          {whatsappStatus?.config?.maskedBusinessAccountId || 'Not Set in .env'}
                        </div>
                      </div>
                      <div style={{ background: '#FAF7F2', padding: '14px 16px', borderRadius: '8px', border: '1px solid #EAE4D9' }}>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>APP SECRET (HMAC)</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A', marginTop: '3px' }}>
                          {whatsappStatus?.config?.appSecretSet ? 'Configured (Active)' : 'Not Set in .env'}
                        </div>
                      </div>
                      <div style={{ background: '#FAF7F2', padding: '14px 16px', borderRadius: '8px', border: '1px solid #EAE4D9' }}>
                        <div style={{ fontSize: '11px', color: '#888', fontWeight: 700, textTransform: 'uppercase' }}>WEBHOOK VERIFICATION</div>
                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#1A1A1A', marginTop: '3px' }}>
                          {whatsappStatus?.config?.verifyTokenSet ? 'Token Active' : 'Default Token'}
                        </div>
                      </div>
                    </div>

                    {/* Live Outbox Queue Metrics Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>
                          {whatsappStatus?.queueCounts?.TOTAL ?? whatsappNotifications.length}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', marginTop: '2px' }}>Total Logged</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#92400E' }}>
                          {((whatsappStatus?.queueCounts?.QUEUED || 0) + (whatsappStatus?.queueCounts?.PENDING || 0) + (whatsappStatus?.queueCounts?.NOT_CONFIGURED || 0))}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#92400E', textTransform: 'uppercase', marginTop: '2px' }}>In Outbox</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: '#EFF6FF', borderRadius: '8px', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#1E40AF' }}>
                          {((whatsappStatus?.queueCounts?.ACCEPTED || 0) + (whatsappStatus?.queueCounts?.SENT || 0))}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1E40AF', textTransform: 'uppercase', marginTop: '2px' }}>API Accepted</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: '#F0FDF4', borderRadius: '8px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#166534' }}>
                          {whatsappStatus?.queueCounts?.DELIVERED || 0}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#166534', textTransform: 'uppercase', marginTop: '2px' }}>Delivered</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: '#ECFDF5', borderRadius: '8px', border: '1px solid #A7F3D0', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#065F46' }}>
                          {whatsappStatus?.queueCounts?.READ || 0}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#065F46', textTransform: 'uppercase', marginTop: '2px' }}>Read</div>
                      </div>
                      <div style={{ padding: '12px 14px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#991B1B' }}>
                          {whatsappStatus?.queueCounts?.FAILED || 0}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#991B1B', textTransform: 'uppercase', marginTop: '2px' }}>Failed / Retry</div>
                      </div>
                    </div>

                    {/* Confirmed Delivery Banner */}
                    {whatsappStatus?.lastDelivery && (
                      <div style={{ padding: '10px 16px', background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '6px', fontSize: '12.5px', color: '#166534', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCheck size={16} color="#166534" />
                        <span><strong>Last Confirmed Delivery:</strong> Task {whatsappStatus.lastDelivery.task_reference} to {whatsappStatus.lastDelivery.recipient_phone} at {new Date(whatsappStatus.lastDelivery.delivered_at).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Latest Error Banner */}
                    {whatsappStatus?.latestError && (
                      <div style={{ padding: '10px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', fontSize: '12.5px', color: '#991B1B', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={16} color="#991B1B" />
                        <span><strong>Latest Error Alert:</strong> [{whatsappStatus.latestError.error_code || 'ERROR'}] {whatsappStatus.latestError.last_error} (Task: {whatsappStatus.latestError.task_reference || 'N/A'})</span>
                      </div>
                    )}

                    {!whatsappStatus?.config?.isConfigured && !whatsappStatus?.isConfigured && (
                      <div style={{ padding: '14px 18px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', fontSize: '13px', color: '#92400E', lineHeight: 1.5 }}>
                        <strong>Durable Outbox Queue Pattern Active:</strong> Task assignment and cancellation events are logged reliably in the MySQL <code>whatsapp_notifications</code> table. Once you add your official Meta credentials (<code>WHATSAPP_ACCESS_TOKEN</code>, <code>WHATSAPP_PHONE_NUMBER_ID</code>, <code>WHATSAPP_BUSINESS_ACCOUNT_ID</code>) to your server environment, the background worker will automatically dispatch all queued notifications.
                      </div>
                    )}
                  </div>

                  {/* Protected Test Message Dispatcher Card */}
                  <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1A1A1A', marginBottom: '6px' }}>Send Protected Test WhatsApp Notification</h3>
                    <p style={{ color: '#666', fontSize: '13px', marginBottom: '14px' }}>
                      Verify live Meta WhatsApp Cloud API delivery safely. Test messages are sent exclusively to your specified authorized test number and will never be broadcast to registered pandits.
                    </p>

                    {testMessageFeedback && (
                      <div style={{ padding: '10px 14px', marginBottom: '14px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, background: testMessageFeedback.includes('Failed') ? '#FEF2F2' : '#F0FDF4', color: testMessageFeedback.includes('Failed') ? '#991B1B' : '#166534', border: testMessageFeedback.includes('Failed') ? '1px solid #FECACA' : '1px solid #BBF7D0' }}>
                        {testMessageFeedback}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ flex: '1', minWidth: '240px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '4px' }}>Authorized Test Mobile Number (with country code):</label>
                        <input
                          type="text"
                          value={testPhoneInput}
                          onChange={(e) => setTestPhoneInput(e.target.value)}
                          placeholder="e.g. +91 9281867002 or 9281867002"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '13.5px', border: '1px solid #CBD5E1', borderRadius: '6px', fontFamily: 'monospace' }}
                        />
                      </div>
                      <div style={{ paddingTop: '18px' }}>
                        <button
                          onClick={handleSendTestMessage}
                          disabled={isSendingTest}
                          style={{
                            padding: '10px 20px',
                            background: '#166534',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '13.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Send size={15} className={isSendingTest ? 'animate-spin' : ''} /> {isSendingTest ? 'Sending...' : 'Send Test Notification'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Approved Templates Reference Card */}
                  <div className="metric-card" style={{ display: 'block', padding: '28px' }}>
                    <h3 style={{ fontSize: '16px', color: '#1A1A1A', marginBottom: '8px' }}>Approved WhatsApp Notification Templates</h3>
                    <p style={{ color: '#666', fontSize: '13px', marginBottom: '16px' }}>
                      These pre-approved utility templates comply with Meta WhatsApp Business policies for sending notifications outside the 24-hour service window.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCheck size={14} color="#059669" /> pandit_task_assignment
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Dispatched immediately when an admin assigns a task. Body variables: [1: Pandit Name, 2: Task ID, 3: Ritual, 4: Date, 5: Time, 6: Address].
                        </div>
                      </div>
                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCheck size={14} color="#059669" /> pandit_task_cancellation
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Dispatched upon task cancellation. Releases pandit schedule and transmits official cancellation reason.
                        </div>
                      </div>
                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCheck size={14} color="#059669" /> pandit_task_reschedule
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Dispatched when ritual date, time slot, or location is updated after conflict detection.
                        </div>
                      </div>
                      <div style={{ padding: '14px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCheck size={14} color="#059669" /> pandit_task_reassignment
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                          Dispatched to both the previous pandit (releasing their slot) and the newly assigned Vedic scholar.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery History & Outbox Table */}
                  <div className="metric-card" style={{ display: 'block', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '16px', color: '#1A1A1A', margin: 0 }}>
                          Notification Outbox & Delivery Log ({whatsappNotifications.length})
                        </h3>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          Real-time delivery status synced with Meta Webhook receipts
                        </div>
                      </div>

                      {/* Status Filter */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>Filter Status:</label>
                        <select
                          value={whatsappStatusFilter}
                          onChange={(e) => setWhatsappStatusFilter(e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                        >
                          <option value="All">All Statuses</option>
                          <option value="QUEUED">Queued / Pending</option>
                          <option value="ACCEPTED">API Accepted</option>
                          <option value="SENT">Sent</option>
                          <option value="DELIVERED">Delivered (Confirmed)</option>
                          <option value="READ">Read</option>
                          <option value="FAILED">Failed</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #eee', background: '#FAF7F2', color: '#666' }}>
                            <th style={{ padding: '12px 14px' }}>Log ID</th>
                            <th style={{ padding: '12px 14px' }}>Task Ref</th>
                            <th style={{ padding: '12px 14px' }}>Event Type</th>
                            <th style={{ padding: '12px 14px' }}>Recipient Pandit</th>
                            <th style={{ padding: '12px 14px' }}>Phone</th>
                            <th style={{ padding: '12px 14px' }}>Template</th>
                            <th style={{ padding: '12px 14px' }}>Delivery Status</th>
                            <th style={{ padding: '12px 14px' }}>Attempts</th>
                            <th style={{ padding: '12px 14px' }}>Timestamp</th>
                            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const filteredNotifs = whatsappStatusFilter === 'All' 
                              ? whatsappNotifications 
                              : whatsappNotifications.filter(n => n.delivery_status === whatsappStatusFilter);

                            if (filteredNotifs.length === 0) {
                              return (
                                <tr>
                                  <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#888', fontStyle: 'italic' }}>
                                    No WhatsApp notifications matching filter "{whatsappStatusFilter}".
                                  </td>
                                </tr>
                              );
                            }

                            return filteredNotifs.map(n => {
                              const statusStyles = {
                                'DELIVERED': { bg: '#DCFCE7', color: '#166534', border: '#BBF7D0', label: 'Delivered ✓' },
                                'READ': { bg: '#D1FAE5', color: '#065F46', border: '#A7F3D0', label: 'Read ✓✓' },
                                'ACCEPTED': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE', label: 'API Accepted' },
                                'SENT': { bg: '#DBEAFE', color: '#1E40AF', border: '#BFDBFE', label: 'Sent' },
                                'PROCESSING': { bg: '#F3E8FF', color: '#6B21A8', border: '#E9D5FF', label: 'Processing' },
                                'QUEUED': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', label: 'Queued' },
                                'PENDING': { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A', label: 'Pending' },
                                'NOT_CONFIGURED': { bg: '#FEF2F2', color: '#991B1B', border: '#FECACA', label: 'Missing Creds' },
                                'FAILED': { bg: '#FEE2E2', color: '#991B1B', border: '#FECACA', label: 'Failed' }
                              };
                              const ss = statusStyles[n.delivery_status] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB', label: n.delivery_status };

                              return (
                                <tr key={n.id} style={{ borderBottom: '1px solid #eee' }}>
                                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#888' }}>#{n.id}</td>
                                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#E04E15', fontFamily: 'monospace' }}>
                                    {n.task_reference || 'N/A'}
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                      {n.event_type}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>
                                    {n.pandit_name || `Pandit #${n.recipient_pandit_id || 'N/A'}`}
                                  </td>
                                  <td style={{ padding: '12px 14px', color: '#555', fontFamily: 'monospace' }}>{n.recipient_phone}</td>
                                  <td style={{ padding: '12px 14px', color: '#666', fontSize: '12px' }}>
                                    {n.template_name || 'Standard'}
                                  </td>
                                  <td style={{ padding: '12px 14px' }}>
                                    <span style={{
                                      background: ss.bg,
                                      color: ss.color,
                                      border: `1px solid ${ss.border}`,
                                      padding: '3px 8px',
                                      borderRadius: '10px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      display: 'inline-block'
                                    }}>
                                      {ss.label}
                                    </span>
                                    {n.last_error && n.delivery_status === 'FAILED' && (
                                      <div style={{ fontSize: '10.5px', color: '#DC2626', marginTop: '2px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={n.last_error}>
                                        {n.last_error}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>{n.attempt_count || 0}</td>
                                  <td style={{ padding: '12px 14px', color: '#666', fontSize: '12px' }}>
                                    <div>{new Date(n.created_at || Date.now()).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                    <div style={{ fontSize: '11px', color: '#999' }}>{new Date(n.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                  </td>
                                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                                    <button
                                      onClick={() => handleRetryWhatsappNotification(n.id)}
                                      style={{
                                        padding: '4px 10px',
                                        background: '#EFF6FF',
                                        border: '1px solid #BFDBFE',
                                        color: '#1D4ED8',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Retry
                                    </button>
                                  </td>
                                </tr>
                              );
                            });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeMenu !== 'Dashboard' && activeMenu !== 'Bookings' && activeMenu !== 'Orders' && activeMenu !== 'Poojas' && activeMenu !== 'Pandits' && activeMenu !== 'Homams' && activeMenu !== 'Products' && activeMenu !== 'Categories' && activeMenu !== 'Inventory' && activeMenu !== 'Settings' && activeMenu !== 'Reports' && activeMenu !== 'Coupons' && activeMenu !== 'Customers' && activeMenu !== 'Analytics' && activeMenu !== 'Payments' && activeMenu !== 'Reviews' && activeMenu !== 'Banners' && activeMenu !== 'Consultations' && activeMenu !== 'Calendar & Festivals' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>{activeMenu} Management</h1>
                <p>Manage your e-commerce {activeMenu.toLowerCase()} and configure settings.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FFFBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Box size={24} color="#E04E15" />
                  </div>
                  <h3 style={{ marginBottom: '8px', color: '#2B1D14', fontSize: '20px' }}>No {activeMenu} Found</h3>
                  <p style={{ color: '#6C5D53', fontSize: 14, marginBottom: 24, maxWidth: '400px' }}>
                    You haven't added any {activeMenu.toLowerCase()} to the platform yet. Click the button below to create your first entry.
                  </p>
                  <button className="btn-primary" style={{ padding: '10px 24px', borderRadius: '8px' }}>
                    + Add New {activeMenu.endsWith('s') ? activeMenu.slice(0, -1) : activeMenu}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Pandit Schedule Modal */}
      {viewingSchedulePandit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '880px', maxHeight: '92vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 45px rgba(0,0,0,0.2)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#1A1A1A' }}>Schedule: {viewingSchedulePandit.name}</h2>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                  {viewingSchedulePandit.specialization || 'Vedic Smartha Scholar'} • Registered Phone: {viewingSchedulePandit.phone || 'N/A'}
                </div>
              </div>
              <button onClick={() => setViewingSchedulePandit(null)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: 1, color: '#888' }}>&times;</button>
            </div>
            
            <div style={{ padding: '24px' }}>
              <AvailabilityCalendar 
                panditId={viewingSchedulePandit.id}
                pandit={viewingSchedulePandit}
                workingDays={viewingSchedulePandit.availability?.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                addedDates={viewingSchedulePandit.availability?.addedDates || []}
                workHours={viewingSchedulePandit.availability?.workHours || {from: '06:00', to: '20:00'}}
                onAssignTask={(date) => {
                  setAssignTaskForm({
                    pandit_id: String(viewingSchedulePandit.id),
                    ritual_name: 'Sri Satyanarayana Swamy Vratam',
                    customer_name: '',
                    customer_phone: '',
                    customer_email: '',
                    service_location: 'Home',
                    service_address: '',
                    city: 'Hyderabad',
                    scheduled_date: date,
                    start_time: '09:00 AM',
                    duration_minutes: 150,
                    special_instructions: '',
                    booking_id: null
                  });
                  setAssignTaskConflict(null);
                  setAssignTaskFeedback('');
                  setIsAssignTaskModalOpen(true);
                }}
                onCancelTask={(task) => {
                  setCancellingTask(task);
                  setCancelTaskReason('');
                  setCancelTaskFeedback('');
                }}
                onRescheduleTask={(task) => {
                  setReschedulingTask(task);
                  setRescheduleDate(task.scheduled_date ? String(task.scheduled_date).split('T')[0] : '');
                  setRescheduleTime(task.start_time || '09:00 AM');
                  setRescheduleReason('');
                  setRescheduleConflict(null);
                  setRescheduleFeedback('');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {isAssignTaskModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#E04E15', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Task Scheduling</span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '20px', color: '#1A1A1A' }}>Assign Ritual Task to Pandit</h2>
              </div>
              <button onClick={() => setIsAssignTaskModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            {assignTaskFeedback && (
              <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
                {assignTaskFeedback}
              </div>
            )}

            {assignTaskConflict && (
              <div style={{ padding: '14px 16px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '4px' }}>
                  <AlertTriangle size={16} color="#DC2626" /> Schedule Conflict Detected
                </div>
                <div>{assignTaskConflict.reason || assignTaskConflict.message}</div>
                {assignTaskConflict.conflictingTask && (
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#B91C1C' }}>
                    Existing: <strong>{assignTaskConflict.conflictingTask.ritual_name}</strong> ({assignTaskConflict.conflictingTask.start_time} - {assignTaskConflict.conflictingTask.end_time})
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleCreateTaskAssignment}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Pandit Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Select Vedic Pandit *
                  </label>
                  <select
                    className="login-input"
                    value={assignTaskForm.pandit_id}
                    onChange={e => setAssignTaskForm({ ...assignTaskForm, pandit_id: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Pandit --</option>
                    {pandits.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.specialization || 'Vedic Scholar'}) {p.phone ? `• Ph: ${p.phone}` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ritual Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Ritual / Service Name *
                  </label>
                  <input
                    type="text"
                    className="login-input"
                    value={assignTaskForm.ritual_name}
                    onChange={e => setAssignTaskForm({ ...assignTaskForm, ritual_name: e.target.value })}
                    placeholder="e.g. Sri Satyanarayana Swamy Vratam"
                    required
                  />
                </div>

                {/* Customer Name & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Devotee / Customer Name *
                    </label>
                    <input
                      type="text"
                      className="login-input"
                      value={assignTaskForm.customer_name}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, customer_name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Devotee Mobile Number *
                    </label>
                    <input
                      type="tel"
                      className="login-input"
                      value={assignTaskForm.customer_phone}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, customer_phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      required
                    />
                  </div>
                </div>

                {/* Date & Start Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Scheduled Date *
                    </label>
                    <input
                      type="date"
                      className="login-input"
                      value={assignTaskForm.scheduled_date}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, scheduled_date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Start Time (e.g. 08:30 AM) *
                    </label>
                    <input
                      type="text"
                      className="login-input"
                      value={assignTaskForm.start_time}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, start_time: e.target.value })}
                      placeholder="e.g. 09:00 AM"
                      required
                    />
                  </div>
                </div>

                {/* Service Location Type & City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      Location Type
                    </label>
                    <select
                      className="login-input"
                      value={assignTaskForm.service_location}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, service_location: e.target.value })}
                    >
                      <option value="Home">Home</option>
                      <option value="Temple">Temple / Mandapam</option>
                      <option value="Function Hall">Function Hall</option>
                      <option value="Online">Online / E-Pooja</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      className="login-input"
                      value={assignTaskForm.city}
                      onChange={e => setAssignTaskForm({ ...assignTaskForm, city: e.target.value })}
                      placeholder="Hyderabad"
                    />
                  </div>
                </div>

                {/* Full Service Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Complete Service Address
                  </label>
                  <textarea
                    rows="2"
                    className="login-input"
                    value={assignTaskForm.service_address}
                    onChange={e => setAssignTaskForm({ ...assignTaskForm, service_address: e.target.value })}
                    placeholder="Full street address, landmark, flat no..."
                  />
                </div>

                {/* Special Instructions */}
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Special Instructions / Notes for Pandit
                  </label>
                  <textarea
                    rows="2"
                    className="login-input"
                    value={assignTaskForm.special_instructions}
                    onChange={e => setAssignTaskForm({ ...assignTaskForm, special_instructions: e.target.value })}
                    placeholder="E.g. Devotee requested Telugu pandit, bringing homam wood..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsAssignTaskModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmittingTask}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '8px', background: '#E04E15' }}
                >
                  {isSubmittingTask ? (
                    <><Loader2 size={16} className="animate-spin" /> Verifying Conflict & Assigning...</>
                  ) : (
                    <><Send size={15} /> Confirm & Send WhatsApp</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Task Modal */}
      {cancellingTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, textTransform: 'uppercase' }}>Cancel Ritual Assignment</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#1A1A1A' }}>{cancellingTask.task_reference}</h3>
              </div>
              <button onClick={() => setCancellingTask(null)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            {cancelTaskFeedback && (
              <div style={{ padding: '12px', background: '#F0FDF4', color: '#15803D', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 600 }}>
                {cancelTaskFeedback}
              </div>
            )}

            <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
              <div><strong>Ritual:</strong> {cancellingTask.ritual_name}</div>
              <div><strong>Devotee:</strong> {cancellingTask.customer_name} ({cancellingTask.customer_phone})</div>
              <div><strong>Schedule:</strong> {cancellingTask.scheduled_date} ({cancellingTask.start_time} – {cancellingTask.end_time || ''})</div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Cancellation Reason * (Will be notified to Pandit)
              </label>
              <textarea
                rows="3"
                className="login-input"
                value={cancelTaskReason}
                onChange={e => setCancelTaskReason(e.target.value)}
                placeholder="State the reason (e.g. Devotee requested postponement, Pandit emergency, etc.)..."
                required
              />
            </div>

            <div style={{ padding: '10px 14px', background: '#FFF1F2', borderRadius: '8px', fontSize: '12px', color: '#9F1239', marginBottom: '20px' }}>
              ⚠️ Cancelling will immediately free the Pandit's calendar slot for other assignments and send an official cancellation notice via WhatsApp.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setCancellingTask(null)} style={{ padding: '10px 18px', borderRadius: '8px' }}>
                Keep Task
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmCancelTask}
                disabled={isSubmittingCancelTask || !cancelTaskReason.trim()}
                style={{ background: '#DC2626', borderColor: '#DC2626', padding: '10px 22px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSubmittingCancelTask ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={15} />}
                Confirm Cancel & Send WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Task Modal */}
      {reschedulingTask && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10001, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '28px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase' }}>Reschedule Ritual Task</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', color: '#1A1A1A' }}>{reschedulingTask.task_reference}</h3>
              </div>
              <button onClick={() => setReschedulingTask(null)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#888' }}>&times;</button>
            </div>

            {rescheduleFeedback && (
              <div style={{ padding: '12px', background: '#F0FDF4', color: '#15803D', borderRadius: '8px', marginBottom: '14px', fontSize: '13px', fontWeight: 600 }}>
                {rescheduleFeedback}
              </div>
            )}

            {rescheduleConflict && (
              <div style={{ padding: '12px 14px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <AlertTriangle size={15} /> Conflict Detected
                </div>
                <div>{rescheduleConflict.reason || rescheduleConflict.message}</div>
              </div>
            )}

            <div style={{ background: '#FAF7F2', padding: '14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>
              <div><strong>Ritual:</strong> {reschedulingTask.ritual_name}</div>
              <div><strong>Devotee:</strong> {reschedulingTask.customer_name} ({reschedulingTask.customer_phone})</div>
              <div><strong>Current Slot:</strong> {reschedulingTask.scheduled_date} at {reschedulingTask.start_time}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  New Date *
                </label>
                <input
                  type="date"
                  className="login-input"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  New Start Time *
                </label>
                <input
                  type="text"
                  className="login-input"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Reason for Rescheduling
              </label>
              <input
                type="text"
                className="login-input"
                value={rescheduleReason}
                onChange={e => setRescheduleReason(e.target.value)}
                placeholder="e.g. Customer requested morning muhurat"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-secondary" onClick={() => setReschedulingTask(null)} style={{ padding: '10px 18px', borderRadius: '8px' }}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmRescheduleTask}
                disabled={isSubmittingReschedule || !rescheduleDate}
                style={{ background: '#2563EB', borderColor: '#2563EB', padding: '10px 22px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSubmittingReschedule ? <Loader2 size={16} className="animate-spin" /> : <CalendarClock size={15} />}
                Confirm Reschedule & Send WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Printable GST Tax Invoice Modal */}
      {invoiceOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '820px', maxHeight: '92vh', overflowY: 'auto', padding: '36px', boxShadow: '0 20px 45px rgba(0,0,0,0.25)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E04E15', paddingBottom: '18px', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#E04E15', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flower2 size={26} /> Gnana Sudha
                </h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#666' }}>Vedic Rituals, Authentic Poojas & Spiritual E-Commerce</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888' }}>{storeAddress} | Support: {storePhone}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'inline-block', background: '#FFF1F0', color: '#CF1322', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                  Official Tax Invoice
                </span>
                <h2 style={{ fontSize: '18px', margin: 0, color: '#333' }}>Invoice #{invoiceOrder.id}</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>Date: {invoiceOrder.date ? new Date(invoiceOrder.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</p>
              </div>
            </div>

            {/* Customer & Order Metadata */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: '#F8F9FA', padding: '18px', borderRadius: '8px', marginBottom: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billed To</h4>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#222' }}>{invoiceOrder.customerName || invoiceOrder.customer || 'Valued Devotee'}</div>
                <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>{invoiceOrder.email || 'No email provided'}</div>
                <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>{invoiceOrder.phone || 'No phone provided'}</div>
                {invoiceOrder.address && (
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>Address: {invoiceOrder.address}</div>
                )}
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Payment & Status</h4>
                <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}>
                  Payment Method: <strong>{invoiceOrder.paymentMethod || 'Online Razorpay'}</strong>
                </div>
                <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}>
                  Payment Status: <span style={{ fontWeight: '600', color: invoiceOrder.paymentStatus === 'Paid' ? '#52C41A' : '#FA8C16' }}>{invoiceOrder.paymentStatus || 'Paid'}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#444', marginBottom: '4px' }}>
                  Fulfillment Status: <span style={{ fontWeight: '600', color: '#1890FF' }}>{invoiceOrder.status || 'Confirmed'}</span>
                </div>
                {invoiceOrder.courier && (
                  <div style={{ fontSize: '13px', color: '#444' }}>
                    Courier: <strong>{invoiceOrder.courier}</strong> ({invoiceOrder.trackingNumber || 'Tracking active'})
                  </div>
                )}
              </div>
            </div>

            {/* Line items table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
              <thead>
                <tr style={{ background: '#FFF7E6', borderBottom: '2px solid #FFE7BA' }}>
                  <th style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px', color: '#873800' }}>Item Description</th>
                  <th style={{ textAlign: 'center', padding: '10px 14px', fontSize: '13px', color: '#873800' }}>Type</th>
                  <th style={{ textAlign: 'center', padding: '10px 14px', fontSize: '13px', color: '#873800' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#873800' }}>Unit Price</th>
                  <th style={{ textAlign: 'right', padding: '10px 14px', fontSize: '13px', color: '#873800' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {parseOrderItems(invoiceOrder).map((item, idx) => {
                  const qty = item.quantity || item.qty || 1;
                  const price = Number(item.price) || 0;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px 14px', fontSize: '14px', fontWeight: '500', color: '#222' }}>
                        {item.name || item.title || 'Divine Product / Ritual'}
                        {item.pandit && (
                          <div style={{ fontSize: '12px', color: '#E04E15', marginTop: '2px' }}>Assigned Pandit: {item.pandit.name || item.pandit}</div>
                        )}
                        {item.date && (
                          <div style={{ fontSize: '12px', color: '#666' }}>Ritual Date: {item.date} {item.time ? `at ${item.time}` : ''}</div>
                        )}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 14px', fontSize: '13px', color: '#666', textTransform: 'capitalize' }}>
                        {item.type || 'Product'}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px 14px', fontSize: '13px', color: '#444' }}>
                        {qty}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 14px', fontSize: '13px', color: '#444' }}>
                        ₹{price.toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px 14px', fontSize: '14px', fontWeight: '600', color: '#222' }}>
                        ₹{(qty * price).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>Subtotal:</span>
                  <span>₹{Number(invoiceOrder.subtotal || invoiceOrder.total || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>Shipping & Delivery:</span>
                  <span>₹{Number(invoiceOrder.shippingFee || 0).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>GST / Tax ({storeTaxRate}% incl.):</span>
                  <span>₹{Math.round((Number(invoiceOrder.total || 0) * Number(storeTaxRate)) / (100 + Number(storeTaxRate))).toLocaleString()}</span>
                </div>
                {invoiceOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#52C41A' }}>
                    <span>Coupon Discount:</span>
                    <span>-₹{Number(invoiceOrder.discount).toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', color: '#E04E15', borderTop: '2px solid #f0f0f0', paddingTop: '10px' }}>
                  <span>Grand Total:</span>
                  <span>₹{Number(invoiceOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer notes & Actions */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#888' }}>
                * This is a computer generated tax invoice and does not require a physical signature.
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Printer size={16} /> Print / Save Invoice
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product View Details Modal */}
      {viewingProductModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 45px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  SKU: {viewingProductModal.sku || `GS-PROD-${viewingProductModal.id}`}
                </span>
                <h2 style={{ fontSize: '20px', margin: '4px 0 0 0', color: '#1A1A1A' }}>{viewingProductModal.name}</h2>
              </div>
              <button
                onClick={() => setViewingProductModal(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888' }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <img
                  src={viewingProductModal.image || (Array.isArray(viewingProductModal.images) ? viewingProductModal.images[0] : '/placeholder.jpg')}
                  alt={viewingProductModal.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400'; }}
                />
                {Array.isArray(viewingProductModal.images) && viewingProductModal.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto' }}>
                    {viewingProductModal.images.map((img, idx) => (
                      <img key={idx} src={img} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: viewingProductModal.status === 'inactive' ? '#FFF1F0' : '#F6FFED', color: viewingProductModal.status === 'inactive' ? '#CF1322' : '#52C41A' }}>
                    {viewingProductModal.status === 'inactive' ? 'Inactive (Hidden)' : 'Active (Public)'}
                  </span>
                  <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: '#E6F7FF', color: '#1890FF' }}>
                    Category: {categories.find(c => c.id === viewingProductModal.category_id || c.id === viewingProductModal.categoryid)?.name || 'Spiritual Essentials'}
                  </span>
                  {Number(viewingProductModal.stock) <= 5 ? (
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: '#FFF2E8', color: '#FA541C' }}>
                      Low Stock ({viewingProductModal.stock} left)
                    </span>
                  ) : (
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', background: '#F9F0FF', color: '#722ED1' }}>
                      Stock: {viewingProductModal.stock} units
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#E04E15' }}>₹{Number(viewingProductModal.price).toLocaleString()}</span>
                  {viewingProductModal.old_price && (
                    <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through' }}>₹{Number(viewingProductModal.old_price).toLocaleString()}</span>
                  )}
                </div>

                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '16px' }}>
                  {viewingProductModal.description || 'No description provided.'}
                </p>

                {Array.isArray(viewingProductModal.variants) && viewingProductModal.variants.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#666' }}>Available Variants:</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {viewingProductModal.variants.map((v, i) => (
                        <span key={i} style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                          {v.value} {v.unit} — ₹{v.price}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <a
                href={`/product/${viewingProductModal.id}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1890FF', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
              >
                <ExternalLink size={16} /> Open Public Store Page
              </a>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    handleEditProduct(viewingProductModal);
                    setViewingProductModal(null);
                  }}
                  className="btn-primary"
                  style={{ padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setViewingProductModal(null)}
                  style={{ background: '#f5f5f5', border: '1px solid #ddd', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
