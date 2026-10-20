import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Package, User, MapPin, CreditCard, Wallet, Heart, Bell, 
  Settings, LogOut, ShieldCheck, 
  Star, Clock, IndianRupee, Edit3, Plus, Camera, 
  Check, FileText, Printer, Truck, X, CalendarDays, Flame, Sparkles, Trash2
} from 'lucide-react';
import '../App.css';

export default function CustomerProfile() {
  const { currentCustomer, orders, bookings = [], logout, updateCustomer, wishlist = [], removeFromWishlist, addToCart } = useContext(DataContext);
  const { isTelugu, language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'profile');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Local state for interactive features
  const [profilePhoto, setProfilePhoto] = useState('/lotus.svg');
  const fileInputRef = useRef(null);

  const [walletBalance, setWalletBalance] = useState(0);

  const getInitialAddresses = () => {
    try {
      const stored = localStorage.getItem(`gs_addresses_${currentCustomer?.id || 'guest'}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading saved addresses:', e);
    }
    return [
      {
        id: 1,
        name: currentCustomer ? currentCustomer.name : 'Vamsi Pallela',
        phone: currentCustomer?.phone || '+91 9876543210',
        altPhone: '',
        type: 'Home',
        houseNo: 'Plot No. 42, Sri Rama Nilayam',
        street: 'Road No. 36, Jubilee Hills',
        landmark: 'Near Peddamma Temple',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        isDefault: true
      }
    ];
  };

  const [addresses, setAddresses] = useState(getInitialAddresses);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormError, setAddressFormError] = useState('');
  const [addressSuccessMsg, setAddressSuccessMsg] = useState('');

  const emptyAddressForm = {
    name: currentCustomer?.name || '',
    phone: currentCustomer?.phone || '',
    altPhone: '',
    type: 'Home',
    houseNo: '',
    street: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    isDefault: false
  };

  const [addressForm, setAddressForm] = useState(emptyAddressForm);

  const saveAddressesToStorage = (updatedList) => {
    setAddresses(updatedList);
    try {
      localStorage.setItem(`gs_addresses_${currentCustomer?.id || 'guest'}`, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Error saving addresses:', e);
    }
  };

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'VISA', name: 'HDFC Bank Credit Card', number: '**** **** **** 4242' }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardForm, setNewCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });

  // Account Settings state
  const [prefLang, setPrefLang] = useState(() => {
    try { return localStorage.getItem('gs_user_lang') || 'Telugu'; } catch { return 'Telugu'; }
  });
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [panchangamAlerts, setPanchangamAlerts] = useState(true);
  const [gothram, setGothram] = useState(() => currentCustomer?.gothram || '');
  const [nakshatram, setNakshatram] = useState(() => currentCustomer?.nakshatram || 'Rohini');
  const [rashi, setRashi] = useState(() => currentCustomer?.rashi || 'Vrishabha (Taurus)');
  const [ishtaDevata, setIshtaDevata] = useState(() => currentCustomer?.ishtaDevata || 'Sri Venkateswara Swamy');
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Notifications state
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      title: 'Auspicious Ekadashi Panchangam & Muhurat',
      message: 'Today is Shukla Paksha Ekadashi. Auspicious Brahma Muhurat is between 04:45 AM - 05:35 AM.',
      time: 'Today, 06:00 AM',
      read: false,
      type: 'panchangam'
    },
    {
      id: 2,
      title: 'Spiritual Booking Coordination Active',
      message: 'Our Vedic coordination team is reviewing incoming pooja and homam requests. You will be contacted shortly for scheduling.',
      time: 'Yesterday',
      read: true,
      type: 'booking'
    },
    {
      id: 3,
      title: 'Monthly Festival Calendar Updated',
      message: 'Upcoming Hindu festivals for Andhra Pradesh and Telangana are updated in the Daily Calendar.',
      time: '3 days ago',
      read: true,
      type: 'calendar'
    }
  ]);

  const handleSaveSettings = () => {
    if (updateCustomer && currentCustomer?.id) {
      updateCustomer(currentCustomer.id, {
        ...currentCustomer,
        gothram,
        nakshatram,
        rashi,
        ishtaDevata,
        prefLang
      });
    }
    try { localStorage.setItem('gs_user_lang', prefLang); } catch {}
    setSettingsSavedMessage(isTelugu ? 'ఖాతా ప్రాధాన్యతలు మరియు వేద సంకల్ప వివరాలు భద్రపరచబడ్డాయి! 🙏' : 'Account preferences and Vedic Sankalpam details saved successfully!');
    setTimeout(() => setSettingsSavedMessage(''), 3500);
  };

  if (!currentCustomer) {
    navigate('/login');
    return null;
  }

  const customerOrders = orders.filter(o => o.customerid === currentCustomer.id);
  const customerBookings = (bookings || []).filter(b => 
    (currentCustomer.id && b.customer_id === currentCustomer.id) ||
    (currentCustomer.phone && b.customer_phone === currentCustomer.phone) ||
    (currentCustomer.email && b.customer_email && b.customer_email.toLowerCase() === currentCustomer.email.toLowerCase())
  );

  // Handlers
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imgUrl = URL.createObjectURL(file);
      setProfilePhoto(imgUrl);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      ...emptyAddressForm,
      name: currentCustomer?.name || '',
      phone: currentCustomer?.phone || '',
      isDefault: addresses.length === 0
    });
    setAddressFormError('');
    setIsAddingAddress(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      name: addr.name || '',
      phone: addr.phone || '',
      altPhone: addr.altPhone || '',
      type: addr.type || 'Home',
      houseNo: addr.houseNo || (addr.details ? addr.details.split(',')[0]?.trim() || '' : ''),
      street: addr.street || (addr.details ? addr.details.split(',')[1]?.trim() || '' : ''),
      landmark: addr.landmark || '',
      city: addr.city || 'Hyderabad',
      state: addr.state || 'Telangana',
      pincode: addr.pincode || '',
      isDefault: !!addr.isDefault
    });
    setAddressFormError('');
    setIsAddingAddress(true);
  };

  const handleSaveAddress = () => {
    if (!addressForm.name.trim()) {
      setAddressFormError(isTelugu ? 'దయచేసి భక్తుని / స్వీకర్త పూర్తి పేరు నమోదు చేయండి' : 'Please enter Devotee / Recipient Full Name');
      return;
    }
    const cleanPhone = addressForm.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setAddressFormError(isTelugu ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!addressForm.houseNo.trim()) {
      setAddressFormError(isTelugu ? 'దయచేసి ఫ్లాట్ / ఇంటి నంబర్ / అపార్ట్‌మెంట్ పేరు నమోదు చేయండి' : 'Please enter Flat / House No / Building Name');
      return;
    }
    if (!addressForm.street.trim()) {
      setAddressFormError(isTelugu ? 'దయచేసి వీధి, రోడ్డు లేదా కాలనీ వివరాలు నమోదు చేయండి' : 'Please enter Street, Road, or Locality');
      return;
    }
    if (!addressForm.city.trim()) {
      setAddressFormError(isTelugu ? 'దయచేసి నగరం / పట్టణం నమోదు చేయండి' : 'Please enter City / Town');
      return;
    }
    const cleanPin = addressForm.pincode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      setAddressFormError(isTelugu ? 'దయచేసి సరైన 6 అంకెల పిన్‌కోడ్ నమోదు చేయండి' : 'Please enter a valid 6-digit Pincode');
      return;
    }

    setAddressFormError('');
    const shouldBeDefault = addressForm.isDefault || addresses.length === 0;

    if (editingAddressId) {
      const updated = addresses.map(addr => {
        if (addr.id === editingAddressId) {
          return {
            ...addr,
            ...addressForm,
            id: editingAddressId,
            isDefault: shouldBeDefault
          };
        }
        return shouldBeDefault ? { ...addr, isDefault: false } : addr;
      });
      saveAddressesToStorage(updated);
      setAddressSuccessMsg(isTelugu ? 'చిరునామా విజయవంతంగా అప్‌డేట్ చేయబడింది! 🙏' : 'Address updated successfully! 🙏');
    } else {
      const newAddr = {
        ...addressForm,
        id: Date.now(),
        isDefault: shouldBeDefault
      };
      const updated = shouldBeDefault 
        ? [...addresses.map(a => ({ ...a, isDefault: false })), newAddr]
        : [...addresses, newAddr];
      saveAddressesToStorage(updated);
      setAddressSuccessMsg(isTelugu ? 'కొత్త డెలివరీ చిరునామా విజయవంతంగా జోడించబడింది! 🙏' : 'New delivery address added successfully! 🙏');
    }

    setIsAddingAddress(false);
    setEditingAddressId(null);
    setTimeout(() => setAddressSuccessMsg(''), 3500);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm(isTelugu ? 'ఈ డెలివరీ చిరునామాను ఖచ్చితంగా తొలగించాలనుకుంటున్నారా?' : 'Are you sure you want to remove this delivery address?')) {
      const remaining = addresses.filter(a => a.id !== id);
      if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      saveAddressesToStorage(remaining);
      setAddressSuccessMsg(isTelugu ? 'చిరునామా తొలగించబడింది.' : 'Address removed.');
      setTimeout(() => setAddressSuccessMsg(''), 3000);
    }
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    saveAddressesToStorage(updated);
    setAddressSuccessMsg(isTelugu ? 'ప్రాథమిక డెలివరీ చిరునామా అప్‌డేట్ చేయబడింది.' : 'Default delivery address updated.');
    setTimeout(() => setAddressSuccessMsg(''), 3000);
  };

  const formatAddressLine = (addr) => {
    if (addr.houseNo || addr.street) {
      const parts = [
        addr.houseNo,
        addr.street,
        addr.landmark ? (isTelugu ? `(గుర్తు: ${addr.landmark})` : `(Landmark: ${addr.landmark})`) : null,
        `${addr.city || 'Hyderabad'}, ${addr.state || 'Telangana'} - ${addr.pincode || ''}`
      ].filter(Boolean);
      return parts.join(', ');
    }
    return addr.details || (isTelugu ? 'చిరునామా వివరాలు పేర్కొనబడలేదు' : 'Address details not specified');
  };

  const handleAddCard = () => {
    if (newCardForm.number.trim()) {
      setPaymentMethods([...paymentMethods, {
        id: Date.now(),
        type: 'CARD',
        name: newCardForm.name || (isTelugu ? 'కొత్త క్రెడిట్/డెబిట్ కార్డ్' : 'New Credit Card'),
        number: `**** **** **** ${newCardForm.number.slice(-4) || '1234'}`
      }]);
      setNewCardForm({ name: '', number: '', expiry: '', cvv: '' });
      setIsAddingCard(false);
    }
  };

  const handleRemoveCard = (id) => {
    setPaymentMethods(paymentMethods.filter(card => card.id !== id));
  };

  const handleAddMoney = () => {
    const amount = prompt(isTelugu ? "మీ వాలెట్‌కు జోడించాల్సిన మొత్తాన్ని నమోదు చేయండి (₹లలో):" : "Enter amount to add to your wallet (in ₹):");
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      setWalletBalance(prev => prev + num);
      alert(isTelugu ? `మీ వాలెట్‌కు ₹${num} విజయవంతంగా జోడించబడింది!` : `Successfully added ₹${num} to your wallet!`);
    } else if (amount !== null) {
      alert(isTelugu ? "దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి." : "Please enter a valid amount.");
    }
  };

  // Helper translations for statuses, notifications & badges
  const getBookingStatusText = (st) => {
    if (!isTelugu) return st;
    switch (st) {
      case 'Completed': return 'పూర్తయింది';
      case 'Confirmed': return 'ఖరారైంది';
      case 'Pandit Assigned': return 'పండితులు కేటాయించబడ్డారు';
      case 'In Progress': return 'కొనసాగుతోంది';
      case 'Pending Review': return 'పరిశీలనలో ఉంది';
      case 'Cancelled': return 'రద్దు చేయబడింది';
      case 'Rejected': return 'తిరస్కరించబడింది';
      default: return st;
    }
  };

  const getOrderStatusText = (st) => {
    if (!isTelugu) return st;
    switch (st) {
      case 'Delivered': return 'డెలివరీ అయింది';
      case 'Shipped': return 'రవాణాలో ఉంది';
      case 'Confirmed': return 'ఖరారైంది';
      case 'Processing': return 'ప్రాసెస్ అవుతోంది';
      case 'Cancelled': return 'రద్దు చేయబడింది';
      default: return st;
    }
  };

  const getAddressTypeBadge = (type) => {
    if (!isTelugu) return type || 'Home';
    if (type === 'Home') return '🏠 ఇల్లు';
    if (type === 'Temple / Mandapam') return '🛕 దేవాలయం / మండపం';
    if (type === 'Work / Office' || type === 'Work') return '🏢 కార్యాలయం';
    if (type === 'Other') return '📍 ఇతరములు';
    return type || '🏠 ఇల్లు';
  };

  const getNotifTitle = (n) => {
    if (!isTelugu) return n.title;
    if (n.id === 1) return 'శుభ ఏకాదశి పంచాంగం & ముహూర్తం';
    if (n.id === 2) return 'ఆధ్యాత్మిక పూజా సమన్వయం ప్రారంభమైంది';
    if (n.id === 3) return 'నెలవారీ పండుగల క్యాలెండర్ నవీకరించబడింది';
    return n.title;
  };

  const getNotifMessage = (n) => {
    if (!isTelugu) return n.message;
    if (n.id === 1) return 'నేడు శుక్ల పక్ష ఏకాదశి. శుభ బ్రహ్మ ముహూర్తం ఉదయం 04:45 నుండి 05:35 వరకు కలదు.';
    if (n.id === 2) return 'మా వేద సమన్వయ బృందం మీ పూజ మరియు హోమ అభ్యర్థనలను సమీక్షిస్తోంది. సమయపాలన కోసం త్వరలో సంప్రదిస్తాము.';
    if (n.id === 3) return 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ప్రాంతాలకు సంబంధించిన రాబోయే పండుగల వివరాలు రోజువారీ క్యాలెండర్‌లో నవీకరించబడ్డాయి.';
    return n.message;
  };

  const getNotifTime = (n) => {
    if (!isTelugu) return n.time;
    if (n.id === 1) return 'నేడు, ఉదయం 06:00';
    if (n.id === 2) return 'నిన్న';
    if (n.id === 3) return '3 రోజుల క్రితం';
    return n.time;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '36px 20px 80px 20px', background: 'transparent' }}>
      <div className="profile-container" style={{ margin: '0 auto', maxWidth: '1240px' }}>
        
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-sidebar-header" style={{ textAlign: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FFF0ED', margin: '0 auto 12px auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(197, 48, 24, 0.1)' }}>
              <img src={profilePhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="profile-name" style={{ fontSize: '18px', fontWeight: '700', color: '#2A1C15', marginBottom: '4px' }}>{currentCustomer.name}</div>
            <div className="profile-subtitle" style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>{currentCustomer.email}</div>
            <div className="profile-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0F9F4', color: '#1B8049', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
              <ShieldCheck size={14} /> {isTelugu ? '2025 నుండి భక్త సభ్యులు' : 'Member Since 2025'}
            </div>
          </div>
          
          <div className="sidebar-nav profile-nav-list">
            {[
              { id: 'profile', icon: User, label: isTelugu ? 'వ్యక్తిగత సమాచారం' : 'Profile Information' },
              { id: 'bookings', icon: Flame, label: isTelugu ? `ఆధ్యాత్మిక పూజా బుకింగ్స్ (${customerBookings.length})` : `Spiritual Bookings (${customerBookings.length})` },
              { id: 'orders', icon: Package, label: isTelugu ? `ఆర్డర్లు (${customerOrders.length})` : `Store Orders (${customerOrders.length})` },
              { id: 'wishlist', icon: Heart, label: isTelugu ? `కోరికల జాబితా (${wishlist.length})` : `Saved Wishlist (${wishlist.length})` },
              { id: 'addresses', icon: MapPin, label: isTelugu ? 'చిరునామాలు' : 'Saved Addresses' },
              { id: 'payment', icon: CreditCard, label: isTelugu ? 'చెల్లింపు పద్ధతులు' : 'Payment Methods' },
              { id: 'wallet', icon: Wallet, label: isTelugu ? 'వాలెట్ & రివార్డులు' : 'Wallet & Rewards' },
              { id: 'notifications', icon: Bell, label: isTelugu ? 'నోటిఫికేషన్లు' : 'Notifications' },
              { id: 'settings', icon: Settings, label: isTelugu ? 'సెట్టింగ్స్ & సంకల్పం' : 'Settings' }
            ].map(item => (
              <button 
                key={item.id}
                className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`} 
                onClick={() => setActiveTab(item.id)}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
                  borderRadius: '10px', border: 'none', background: activeTab === item.id ? '#FFF0ED' : 'transparent',
                  color: activeTab === item.id ? '#C53018' : '#5E4C44',
                  fontWeight: activeTab === item.id ? '600' : '500',
                  cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left',
                  fontSize: '14px'
                }}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f0f0f0' }}>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #FFD8D0',
                  background: 'transparent', color: '#C53018', fontWeight: '600', cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#FFF0ED'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <LogOut size={16} /> {isTelugu ? 'లాగ్ అవుట్' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-main">
          
          <div className="profile-card-pad">
            
            {activeTab === 'profile' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <User size={24} color="#C53018" /> {isTelugu ? 'వ్యక్తిగత సమాచారం' : 'Profile Information'}
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Photo Upload Area */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#FFF0ED', overflow: 'hidden', border: '2px solid #C53018', position: 'relative', flexShrink: 0 }}>
                       <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handlePhotoUpload}
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ background: '#fff', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.borderColor = '#C53018'}
                        onMouseOut={(e) => e.currentTarget.style.borderColor = '#ddd'}
                      >
                        <Camera size={16} /> {isTelugu ? 'కొత్త ఫోటో అప్‌లోడ్ చేయండి' : 'Upload New Photo'}
                      </button>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#888' }}>{isTelugu ? 'JPG, GIF లేదా PNG. గరిష్ట పరిమాణం 2MB' : 'JPG, GIF or PNG. Max size of 2MB'}</p>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Form Fields */}
                  <div className="profile-form-grid">
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'పూర్తి పేరు' : 'Full Name'}</label>
                      <input type="text" id="customerNameInput" defaultValue={currentCustomer.name} placeholder={isTelugu ? 'మీ పూర్తి పేరు' : 'Full Name'} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '15px', color: '#333', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}</label>
                      <input type="email" id="customerEmailInput" defaultValue={currentCustomer.email} placeholder={isTelugu ? 'మీ ఈమెయిల్' : 'Email Address'} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '15px', color: '#333', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'మొబైల్ నంబర్' : 'Phone Number'}</label>
                      <input type="tel" id="customerPhoneInput" defaultValue={currentCustomer.phone || "+91 9876543210"} placeholder={isTelugu ? 'మొబైల్ నంబర్' : 'Phone Number'} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'పుట్టిన తేదీ' : 'Date of Birth'}</label>
                      <input type="date" id="customerDobInput" defaultValue={currentCustomer.dob || ""} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                  </div>
                  
                  <button onClick={() => {
                    const name = document.getElementById('customerNameInput').value;
                    const email = document.getElementById('customerEmailInput').value;
                    const phone = document.getElementById('customerPhoneInput').value;
                    const dob = document.getElementById('customerDobInput').value;
                    updateCustomer(currentCustomer.id, { name, email, phone, dob });
                    alert(isTelugu ? 'ప్రొఫైల్ వివరాలు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి! 🙏' : 'Profile Details Updated!');
                  }} style={{ alignSelf: 'flex-start', background: '#C53018', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#A32511'} onMouseOut={(e) => e.currentTarget.style.background = '#C53018'}>
                    {isTelugu ? 'మార్పులను సేవ్ చేయండి' : 'Save Changes'}
                  </button>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />

                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', margin: '0 0 24px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    {isTelugu ? 'భద్రతా సెట్టింగ్స్' : 'Security Settings'}
                  </h2>
                  <div className="profile-form-grid">
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'ప్రస్తుత పాస్‌వర్డ్' : 'Current Password'}</label>
                      <input type="password" id="customerOldPassword" placeholder={isTelugu ? 'ప్రస్తుత పాస్‌వర్డ్ నమోదు చేయండి' : 'Enter current password'} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>{isTelugu ? 'కొత్త పాస్‌వర్డ్' : 'New Password'}</label>
                      <input type="password" id="customerNewPassword" placeholder={isTelugu ? 'కనీసం 4 అక్షరాలు' : 'Min 4 characters'} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                  </div>
                  <button onClick={() => {
                    const oldP = document.getElementById('customerOldPassword').value;
                    const newP = document.getElementById('customerNewPassword').value;
                    if (oldP !== currentCustomer.password) {
                      alert(isTelugu ? 'ప్రస్తుత పాస్‌వర్డ్ సరైనది కాదు.' : 'Incorrect current password.');
                      return;
                    }
                    if (newP.length < 4) {
                      alert(isTelugu ? 'కొత్త పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.' : 'New password must be at least 4 characters.');
                      return;
                    }
                    updateCustomer(currentCustomer.id, { password: newP });
                    document.getElementById('customerOldPassword').value = '';
                    document.getElementById('customerNewPassword').value = '';
                    alert(isTelugu ? 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది! 🙏' : 'Password updated successfully!');
                  }} style={{ alignSelf: 'flex-start', background: '#fff', color: '#C53018', border: '2px solid #C53018', padding: '12px 30px', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#C53018'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#C53018'; }}>
                    {isTelugu ? 'పాస్‌వర్డ్ మార్చండి' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: 0, color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    <MapPin size={24} color="#C53018" /> {isTelugu ? 'సేవ్ చేసిన చిరునామాలు' : 'Saved Addresses'}
                  </h2>
                  {!isAddingAddress && (
                    <button 
                      onClick={handleOpenAddAddress}
                      style={{ 
                        background: '#C53018', color: '#fff', border: 'none', padding: '10px 22px', 
                        borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 12px rgba(197, 48, 24, 0.2)', transition: 'background 0.2s' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#A32511'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#C53018'}
                    >
                      <Plus size={16} /> {isTelugu ? 'కొత్త చిరునామా జోడించండి' : 'Add New Address'}
                    </button>
                  )}
                </div>

                {addressSuccessMsg && (
                  <div style={{ padding: '12px 18px', borderRadius: '10px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>
                    {addressSuccessMsg}
                  </div>
                )}

                {isAddingAddress ? (
                  <div style={{ 
                    background: '#FFFDF9', 
                    border: '1px solid #F0E6DD', 
                    borderRadius: '16px', 
                    padding: '28px', 
                    marginBottom: '28px',
                    boxShadow: '0 4px 20px rgba(197, 48, 24, 0.05)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F3ECE5', paddingBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', color: '#2A1C15', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                        <MapPin size={20} color="#C53018" /> {editingAddressId ? (isTelugu ? 'డెలివరీ చిరునామా సవరించండి' : 'Edit Delivery Address') : (isTelugu ? 'కొత్త డెలివరీ చిరునామా జోడించండి' : 'Add New Delivery Address')}
                      </h3>
                      <span style={{ fontSize: '12px', color: '#888' }}>{isTelugu ? '* తప్పనిసరి వివరాలు' : '* Required fields'}</span>
                    </div>

                    {addressFormError && (
                      <div style={{ padding: '10px 16px', borderRadius: '8px', background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', marginBottom: '18px', fontSize: '13px', fontWeight: 600 }}>
                        {addressFormError}
                      </div>
                    )}

                    {/* Form Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'భక్తుని / స్వీకర్త పూర్తి పేరు *' : 'Devotee / Recipient Full Name *'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: వంశీ పల్లెల' : 'e.g. Vamsi Pallela'}
                          value={addressForm.name}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'సంప్రదింపు మొబైల్ నంబర్ *' : 'Contact Mobile Number *'}
                        </label>
                        <input 
                          type="tel" 
                          placeholder={isTelugu ? '10 అంకెల మొబైల్ నంబర్' : '10-digit mobile number'}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'ప్రత్యామ్నాయ మొబైల్ / వాట్సాప్ (ఐచ్ఛికం)' : 'Alternate Mobile / WhatsApp (Optional)'}
                        </label>
                        <input 
                          type="tel" 
                          placeholder={isTelugu ? 'ఐచ్ఛిక ప్రత్యామ్నాయ నంబర్' : 'Optional alternate number'}
                          value={addressForm.altPhone}
                          onChange={(e) => setAddressForm({ ...addressForm, altPhone: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'చిరునామా రకం / ప్రదేశం' : 'Address Type / Location'}
                        </label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {[
                            { id: 'Home', label: isTelugu ? '🏠 ఇల్లు' : '🏠 Home' },
                            { id: 'Temple / Mandapam', label: isTelugu ? '🛕 దేవాలయం / మండపం' : '🛕 Temple / Mandapam' },
                            { id: 'Work / Office', label: isTelugu ? '🏢 కార్యాలయం' : '🏢 Work' },
                            { id: 'Other', label: isTelugu ? '📍 ఇతరములు' : '📍 Other' }
                          ].map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setAddressForm({ ...addressForm, type: t.id })}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '20px',
                                border: addressForm.type === t.id ? '2px solid #C53018' : '1px solid #D9CEBF',
                                background: addressForm.type === t.id ? '#FFF0ED' : '#fff',
                                color: addressForm.type === t.id ? '#C53018' : '#555',
                                fontWeight: addressForm.type === t.id ? 700 : 500,
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'ఫ్లాట్ / ఇంటి నంబర్ / అపార్ట్‌మెంట్ *' : 'Flat / House No. / Apartment / Floor *'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: ఫ్లాట్ 402, శ్రీ రామ నిలయం, ప్లాట్ 12' : 'e.g. Flat 402, Sri Rama Nilayam, Plot 12'}
                          value={addressForm.houseNo}
                          onChange={(e) => setAddressForm({ ...addressForm, houseNo: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'వీధి, రోడ్డు, కాలనీ / ప్రాంతం *' : 'Street, Road, Colony / Locality *'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: రోడ్ నం. 36, జూబ్లీహిల్స్ / SBI పక్కన' : 'e.g. Road No. 36, Jubilee Hills / Beside SBI'}
                          value={addressForm.street}
                          onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'గుర్తు / ల్యాండ్‌మార్క్ (ఐచ్ఛికం)' : 'Landmark (Optional)'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: శివాలయం దగ్గర, వాటర్ ట్యాంక్ ఎదురుగా' : 'e.g. Near Shiva Temple, Opposite Water Tank'}
                          value={addressForm.landmark}
                          onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'నగరం / పట్టణం *' : 'City / Town *'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: హైదరాబాద్' : 'e.g. Hyderabad'}
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'రాష్ట్రం *' : 'State *'}
                        </label>
                        <select 
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        >
                          {['Telangana', 'Andhra Pradesh', 'Karnataka', 'Tamil Nadu', 'Maharashtra', 'Kerala', 'Odisha', 'Gujarat', 'Delhi', 'Madhya Pradesh', 'Uttar Pradesh', 'Rajasthan', 'West Bengal', 'Other'].map(s => {
                            const teluguStateMap = {
                              'Telangana': 'తెలంగాణ (Telangana)',
                              'Andhra Pradesh': 'ఆంధ్రప్రదేశ్ (Andhra Pradesh)',
                              'Karnataka': 'కర్ణాటక (Karnataka)',
                              'Tamil Nadu': 'తమిళనాడు (Tamil Nadu)',
                              'Maharashtra': 'మహారాష్ట్ర (Maharashtra)',
                              'Kerala': 'కేరళ (Kerala)',
                              'Odisha': 'ఒడిశా (Odisha)',
                              'Gujarat': 'గుజరాత్ (Gujarat)',
                              'Delhi': 'ఢిల్లీ (Delhi)',
                              'Madhya Pradesh': 'మధ్యప్రదేశ్ (Madhya Pradesh)',
                              'Uttar Pradesh': 'ఉత్తరప్రదేశ్ (Uttar Pradesh)',
                              'Rajasthan': 'రాజస్థాన్ (Rajasthan)',
                              'West Bengal': 'పశ్చిమ బెంగాల్ (West Bengal)',
                              'Other': 'ఇతర రాష్ట్రం (Other)'
                            };
                            return <option key={s} value={s}>{isTelugu ? (teluguStateMap[s] || s) : s}</option>;
                          })}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'పిన్‌కోడ్ *' : 'Pincode *'}
                        </label>
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder={isTelugu ? '6 అంకెల పిన్‌కోడ్' : '6-digit pincode'}
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, '') })}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #D9CEBF', background: '#fff', fontSize: '14px', color: '#2A1C15', outline: 'none' }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1', marginTop: '4px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                            style={{ width: '18px', height: '18px', accentColor: '#C53018', cursor: 'pointer' }}
                          />
                          <span>{isTelugu ? 'దీనిని నా ప్రాథమిక / డిఫాల్ట్ డెలివరీ చిరునామాగా ఉంచండి' : 'Make this my primary / default delivery address'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <button 
                        type="button"
                        onClick={handleSaveAddress}
                        style={{ 
                          background: '#C53018', color: '#fff', border: 'none', padding: '12px 30px', 
                          borderRadius: '30px', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(197, 48, 24, 0.25)', transition: 'background 0.2s' 
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#A32511'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#C53018'}
                      >
                        {editingAddressId ? (isTelugu ? 'చిరునామా అప్‌డేట్ చేయండి' : 'Update Address') : (isTelugu ? 'చిరునామా సేవ్ చేయండి' : 'Save Address')}
                      </button>
                      <button 
                        type="button"
                        onClick={() => { setIsAddingAddress(false); setEditingAddressId(null); setAddressFormError(''); }}
                        style={{ 
                          background: '#fff', color: '#666', border: '1px solid #D9CEBF', padding: '12px 24px', 
                          borderRadius: '30px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' 
                        }}
                      >
                        {isTelugu ? 'రద్దు చేయి' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      style={{ 
                        border: addr.isDefault ? '2px solid #C53018' : '1px solid #EAE4D9', 
                        borderRadius: '16px', 
                        padding: '24px', 
                        background: addr.isDefault ? '#FFFDF9' : '#fff', 
                        position: 'relative',
                        boxShadow: addr.isDefault ? '0 4px 15px rgba(197, 48, 24, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              background: addr.isDefault ? '#C53018' : '#F5EBE1', 
                              color: addr.isDefault ? 'white' : '#7A5B44', 
                              padding: '4px 12px', 
                              borderRadius: '20px', 
                              fontSize: '11px', 
                              fontWeight: '700',
                              letterSpacing: '0.5px'
                            }}>
                              {getAddressTypeBadge(addr.type)} {addr.isDefault && (isTelugu ? '★ ప్రాథమికం' : '★ Default')}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              onClick={() => handleOpenEditAddress(addr)}
                              title={isTelugu ? 'చిరునామా సవరించండి' : 'Edit Address'}
                              style={{ background: '#FFF0ED', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#C53018', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                            >
                              <Edit3 size={14} /> {isTelugu ? 'సవరించు' : 'Edit'}
                            </button>
                            <button 
                              onClick={() => handleDeleteAddress(addr.id)}
                              title={isTelugu ? 'చిరునామా తొలగించండి' : 'Delete Address'}
                              style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2A1C15', fontWeight: 700 }}>
                          {addr.name}
                        </h4>
                        <p style={{ margin: '0 0 12px 0', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                          {formatAddressLine(addr)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#444', fontSize: '13px', fontWeight: '500' }}>
                          <span>📞 {addr.phone}</span>
                          {addr.altPhone && <span style={{ color: '#888' }}>| {isTelugu ? 'ఇతర' : 'Alt'}: {addr.altPhone}</span>}
                        </div>
                      </div>

                      {!addr.isDefault && (
                        <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #EAE4D9' }}>
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            style={{ background: 'none', border: 'none', padding: 0, color: '#C53018', fontSize: '12px', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                          >
                            {isTelugu ? 'ప్రాథమిక డెలివరీ చిరునామాగా ఎంచుకోండి' : 'Set as Default Delivery Address'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {!isAddingAddress && (
                    <div 
                      onClick={handleOpenAddAddress}
                      style={{ 
                        border: '2px dashed #D9CEBF', 
                        borderRadius: '16px', 
                        padding: '30px 20px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#7E6B5A', 
                        cursor: 'pointer', 
                        minHeight: '190px', 
                        transition: 'all 0.2s', 
                        background: '#FAF7F2' 
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#C53018'; e.currentTarget.style.color = '#C53018'; e.currentTarget.style.background = '#FFF0ED'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#D9CEBF'; e.currentTarget.style.color = '#7E6B5A'; e.currentTarget.style.background = '#FAF7F2'; }}
                    >
                      <Plus size={32} style={{ marginBottom: '10px' }} />
                      <span style={{ fontWeight: '700', fontSize: '15px' }}>{isTelugu ? '+ కొత్త డెలివరీ చిరునామా జోడించండి' : '+ Add New Delivery Address'}</span>
                      <span style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{isTelugu ? 'గృహ పూజలు మరియు సామాగ్రి ఆర్డర్ల కోసం' : 'For home poojas & samagri orders'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <CreditCard size={24} color="#C53018" /> {isTelugu ? 'చెల్లింపు పద్ధతులు' : 'Payment Methods'}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                  {paymentMethods.map(card => (
                    <div key={card.id} style={{ padding: '20px', background: '#fff', borderRadius: '16px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                      <div style={{ width: '56px', height: '36px', background: '#1a1f36', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', fontStyle: 'italic' }}>
                        {card.type}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#333' }}>{card.name}</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '15px', fontFamily: 'monospace' }}>{card.number}</p>
                      </div>
                      <button 
                        onClick={() => handleRemoveCard(card.id)}
                        style={{ background: '#FFF0ED', color: '#C53018', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#FADED7'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#FFF0ED'}
                      >
                        {isTelugu ? 'తొలగించు' : 'Remove'}
                      </button>
                    </div>
                  ))}
                </div>

                {isAddingCard ? (
                  <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#333' }}>{isTelugu ? 'కొత్త కార్డ్ జోడించండి' : 'Add New Card'}</h3>
                    <div className="profile-form-grid" style={{ marginBottom: '16px' }}>
                      <input 
                        type="text" 
                        placeholder={isTelugu ? 'కార్డ్‌పై ఉన్న పేరు' : 'Name on Card'} 
                        value={newCardForm.name}
                        onChange={(e) => setNewCardForm({...newCardForm, name: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                      />
                      <input 
                        type="text" 
                        placeholder={isTelugu ? 'కార్డ్ నంబర్ (16 అంకెలు)' : 'Card Number (16 digits)'} 
                        value={newCardForm.number}
                        onChange={(e) => setNewCardForm({...newCardForm, number: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="16"
                      />
                      <input 
                        type="text" 
                        placeholder={isTelugu ? 'నెల/సంవత్సరం (MM/YY)' : 'MM/YY'} 
                        value={newCardForm.expiry}
                        onChange={(e) => setNewCardForm({...newCardForm, expiry: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="5"
                      />
                      <input 
                        type="password" 
                        placeholder={isTelugu ? 'సివివి (CVV)' : 'CVV'} 
                        value={newCardForm.cvv}
                        onChange={(e) => setNewCardForm({...newCardForm, cvv: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="4"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={handleAddCard} style={{ background: '#C53018', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{isTelugu ? 'కార్డ్ సేవ్ చేయండి' : 'Save Card'}</button>
                      <button onClick={() => setIsAddingCard(false)} style={{ background: '#fff', color: '#666', border: '1px solid #ccc', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>{isTelugu ? 'రద్దు చేయి' : 'Cancel'}</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingCard(true)}
                    style={{ background: '#fff', color: '#333', border: '1px solid #ccc', padding: '12px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={16} /> {isTelugu ? 'చెల్లింపు పద్ధతిని జోడించండి' : 'Add Payment Method'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <Wallet size={24} color="#C53018" /> {isTelugu ? 'వాలెట్ & రివార్డులు' : 'Wallet & Rewards'}
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #E95221 0%, #C53018 100%)', padding: '32px', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(197, 48, 24, 0.2)' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, transform: 'scale(2)' }}>
                      <Wallet size={120} />
                    </div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{isTelugu ? 'అందుబాటులో ఉన్న నిల్వ' : 'Available Balance'}</h3>
                    <div style={{ fontSize: '48px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
                      <IndianRupee size={36} strokeWidth={2.5} /> {walletBalance.toFixed(2)}
                    </div>
                    <button 
                      onClick={handleAddMoney}
                      style={{ background: '#fff', color: '#C53018', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                      <Plus size={18} strokeWidth={3} /> {isTelugu ? 'డబ్బులు జోడించండి' : 'Add Money'}
                    </button>
                  </div>
                  
                  <div style={{ background: '#fff', border: '1px solid #eee', padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isTelugu ? 'జ్ఞాన సుధ కాయిన్స్' : 'Gnana Sudha Coins'}</h3>
                    <div style={{ fontSize: '42px', fontWeight: '800', color: '#2A1C15', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#FFF9E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star fill="#F5A623" color="#F5A623" size={28} />
                      </div>
                      250
                    </div>
                    <p style={{ margin: '20px 0 0 0', fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
                      <strong style={{ color: '#444' }}>{isTelugu ? 'ప్రతి పూజా బుకింగ్‌పై కాయిన్స్ పొందండి!' : 'Earn coins on every booking!'}</strong><br/>
                      {isTelugu ? '100 కాయిన్స్ = ₹10 స్టోర్ విలువ.' : '100 Coins = ₹10 value in store.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Spiritual Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="tab-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 24px 0', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: 0, color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    <Flame size={24} color="#E04E15" /> {isTelugu ? 'నా ఆధ్యాత్మిక పూజా బుకింగ్స్' : 'My Spiritual Bookings'}
                  </h2>
                  <button 
                    className="btn-primary" 
                    onClick={() => navigate('/poojas')}
                    style={{ padding: '8px 18px', fontSize: '13px', borderRadius: '30px' }}
                  >
                    {isTelugu ? '+ మరొక పూజను బుక్ చేయండి' : '+ Book Another Pooja'}
                  </button>
                </div>

                {customerBookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFDF9', borderRadius: '16px', border: '1px dashed #E8C9B8' }}>
                    <Flame size={60} color="#E04E15" style={{ opacity: 0.6, marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '19px', color: '#333', marginBottom: '8px', fontWeight: 700 }}>{isTelugu ? 'ఇంకా ఎలాంటి పూజా బుకింగ్స్ లేవు' : 'No Ritual Bookings Yet'}</h3>
                    <p style={{ color: '#666', marginBottom: '20px', maxWidth: '420px', margin: '0 auto 20px' }}>
                      {isTelugu ? 'మీ ఇంట్లో లేదా దేవాలయంలో అనుభవజ్ఞులైన వేద పండితులతో శాస్త్రోక్త పూజలు మరియు హోమాలు జరిపించండి.' : 'Schedule traditional poojas and homams performed by scholarly Vedic priests at your home or chosen venue.'}
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/poojas')}>
                      {isTelugu ? 'పూజలను పరిశీలించి బుక్ చేయండి' : 'Explore & Book Poojas'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {customerBookings.map(bkg => {
                      const st = bkg.status || 'Pending Review';
                      const badgeStyle = 
                        st === 'Completed' ? { bg: '#DCFCE7', text: '#15803D' } :
                        st === 'Confirmed' || st === 'Pandit Assigned' ? { bg: '#DBEAFE', text: '#1D4ED8' } :
                        st === 'In Progress' ? { bg: '#EDE9FE', text: '#6D28D9' } :
                        st === 'Cancelled' || st === 'Rejected' ? { bg: '#FEE2E2', text: '#B91C1C' } :
                        { bg: '#FEF3C7', text: '#92400E' };

                      return (
                        <div key={bkg.id || bkg.booking_id} style={{
                          border: '1px solid #F0ECE6',
                          borderRadius: '14px',
                          padding: '20px',
                          background: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f5ede6', paddingBottom: '14px', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#756A64', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                  {isTelugu ? 'రిఫరెన్స్ సంఖ్య' : 'Reference ID'}
                                </span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '14px', color: '#E04E15' }}>
                                  {bkg.booking_id}
                                </span>
                              </div>
                              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2B1D14', margin: '0 0 4px' }}>
                                {bkg.service_name}
                              </h3>
                              <div style={{ fontSize: '12px', color: '#888' }}>
                                {isTelugu ? 'నమోదు తేదీ' : 'Submitted on'} {new Date(bkg.created_at || Date.now()).toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>

                            <span style={{
                              background: badgeStyle.bg,
                              color: badgeStyle.text,
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: badgeStyle.text }}></span>
                              {getBookingStatusText(st)}
                            </span>
                          </div>

                          {/* Ritual Timing & Location Details */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', background: '#FFFDF9', padding: '14px', borderRadius: '10px', border: '1px solid #FAF0E6', fontSize: '13px', color: '#44342F', marginBottom: '12px' }}>
                            <div>
                              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{isTelugu ? 'నిర్ణయించిన తేదీ & సమయం' : 'SCHEDULED DATE & TIME'}</div>
                              <div style={{ fontWeight: 700, color: '#2A1C15', marginTop: '2px' }}>
                                {bkg.preferred_date} • {bkg.preferred_time || (isTelugu ? 'ఉదయ ముహూర్తం' : 'Morning Muhurat')}
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{isTelugu ? 'పూజా వేదిక / ప్రదేశం' : 'SERVICE VENUE'}</div>
                              <div style={{ fontWeight: 600, color: '#2A1C15', marginTop: '2px' }}>
                                {bkg.service_location} ({bkg.city})
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '11px', color: '#888', fontWeight: 600 }}>{isTelugu ? 'కోరుకున్న భాష' : 'PREFERRED LANGUAGE'}</div>
                              <div style={{ fontWeight: 600, color: '#2A1C15', marginTop: '2px' }}>
                                {bkg.preferred_language || 'Telugu'}
                              </div>
                            </div>
                          </div>

                          {/* Assigned Pandit Card if assigned */}
                          {bkg.assigned_pandit_name && (
                            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#166534' }}>
                              <ShieldCheck size={18} color="#16A34A" />
                              <div>
                                <strong>{isTelugu ? 'కేటాయించబడిన వేద పండితులు:' : 'Assigned Scholarly Pandit:'}</strong> {bkg.assigned_pandit_name}
                              </div>
                            </div>
                          )}

                          {/* Admin Notes / Updates */}
                          {bkg.admin_notes && (
                            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '12.5px', color: '#1E40AF' }}>
                              <strong>{isTelugu ? 'సమన్వయ సమాచారం:' : 'Team Coordination Update:'}</strong> {bkg.admin_notes}
                            </div>
                          )}

                          {/* Cancellation Reason if cancelled */}
                          {bkg.cancellation_reason && (
                            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '12.5px', color: '#991B1B' }}>
                              <strong>{isTelugu ? 'రద్దు కారణం:' : 'Cancellation Reason:'}</strong> {bkg.cancellation_reason}
                            </div>
                          )}

                          <div style={{ fontSize: '12px', color: '#777', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f5ede6', paddingTop: '10px' }}>
                            <span>{isTelugu ? 'చిరునామా:' : 'Address:'} {bkg.address}</span>
                            <span style={{ color: '#E04E15', fontWeight: 600 }}>{isTelugu ? 'జ్ఞాన సుధ ద్వారా ప్రత్యక్ష సహాయం & సమన్వయం' : 'Assisted Coordination by Gnana Sudha'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Other Tabs (Orders, Pandits, Notifications, Settings) remain functionally similar but with updated styling wrappers if needed */}
            {activeTab === 'orders' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <Package size={24} color="#C53018" /> {isTelugu ? 'ఆర్డర్లు' : 'Store Orders'}
                </h2>
                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: '16px', border: '1px dashed #ddd' }}>
                    <Package size={64} color="#ccc" style={{ marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '12px' }}>{isTelugu ? 'ఇంకా ఆర్డర్లు లేవు' : 'No Orders Yet'}</h3>
                    <p style={{ color: '#666', marginBottom: '24px' }}>{isTelugu ? 'ఈరోజే మీ ఆధ్యాత్మిక సేవలు & పూజా సామాగ్రిని ఆర్డర్ చేయండి.' : 'Start your spiritual journey with us today.'}</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn-primary" onClick={() => navigate('/poojas')}>{isTelugu ? 'పూజను బుక్ చేయండి' : 'Book a Pooja'}</button>
                      <button className="btn-secondary" onClick={() => navigate('/shop')}>{isTelugu ? 'పూజా షాప్ చూడండి' : 'Explore Store'}</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {customerOrders.map(order => {
                      const items = typeof order.items === 'string' 
                        ? JSON.parse(order.items || '[]') 
                        : (order.items || []);
                      const shipping = typeof order.shippingDetails === 'string' 
                        ? JSON.parse(order.shippingDetails || '{}') 
                        : (order.shippingDetails || {});

                      const statusColor = 
                        order.status === 'Delivered' ? '#2e7d32' :
                        order.status === 'Shipped' ? '#1565c0' :
                        order.status === 'Cancelled' ? '#c62828' : '#e65100';

                      return (
                        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '16px', padding: '24px', background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f0f0f0', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <span style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{isTelugu ? 'ఆర్డర్ సంఖ్య' : 'Order Number'}</span>
                              <div style={{ fontWeight: '700', fontSize: '16px', color: '#2A1C15' }}>
                                {order.order_number || `#GS-${order.id}`}
                              </div>
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                                {isTelugu ? 'ఆర్డర్ చేసిన తేదీ' : 'Placed on'} {new Date(order.date || order.created_at || Date.now()).toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ 
                                background: `${statusColor}15`, 
                                color: statusColor, 
                                padding: '6px 14px', 
                                borderRadius: '20px', 
                                fontSize: '13px', 
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px'
                              }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColor }}></span>
                                {getOrderStatusText(order.status || 'Confirmed')}
                              </span>

                              <button 
                                onClick={() => setSelectedInvoice(order)}
                                style={{ 
                                  background: '#FFF5F0', 
                                  color: '#C53018', 
                                  border: '1px solid #FADED7', 
                                  padding: '6px 14px', 
                                  borderRadius: '8px', 
                                  fontSize: '13px', 
                                  fontWeight: 600, 
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                              >
                                <FileText size={15} /> {isTelugu ? 'రసీదు / ఇన్వాయిస్' : 'Invoice'}
                              </button>
                            </div>
                          </div>

                          {/* Shipment Tracking Box if shipped */}
                          {order.tracking_number && (
                            <div style={{ background: '#F0F7FF', border: '1px solid #CBE2FF', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <Truck size={20} color="#1565c0" />
                              <div style={{ fontSize: '13px', color: '#1565c0', flex: 1 }}>
                                <strong>{isTelugu ? 'ద్వారా రవాణా చేయబడింది:' : 'Dispatched via'} {order.courier_name || (isTelugu ? 'ఎక్స్‌ప్రెస్ కొరియర్' : 'Express Courier')}</strong> • {isTelugu ? 'ట్రాకింగ్ ఐడీ:' : 'Tracking ID:'} <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{order.tracking_number}</span>
                                {order.estimated_delivery && (
                                  <div>{isTelugu ? 'అంచనా డెలివరీ:' : 'Estimated Delivery:'} <strong>{order.estimated_delivery}</strong></div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Order Items */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                            {items.map((item, idx) => (
                              <div key={item.cartId || idx} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '8px 0', borderBottom: idx < items.length - 1 ? '1px dashed #f5f5f5' : 'none' }}>
                                <div style={{ width: '52px', height: '52px', background: '#FFFDF9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0e6dd', flexShrink: 0 }}>
                                  <img 
                                    src={item.image || item.img || '/assets/product_pooja_kit.png'} 
                                    alt={item.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} 
                                    onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
                                  />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#2A1C15' }}>{item.name}</div>
                                  <div style={{ fontSize: '12px', color: '#777' }}>
                                    {isTelugu ? 'పరిమాణం:' : 'Qty:'} <strong>{item.quantity || 1}</strong> {item.variant ? `• ${isTelugu ? 'రకం' : 'Variant'}: ${item.variant}` : ''}
                                  </div>
                                </div>
                                <div style={{ fontWeight: '700', fontSize: '15px', color: '#C53018' }}>
                                  ₹{(Number(item.price) || 0) * (item.quantity || 1)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Footer with totals & delivery destination */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ color: '#666' }}>
                              {isTelugu ? 'డెలివరీ చిరునామా:' : 'Delivery to:'} <strong>{shipping.name || currentCustomer.name}</strong>, {shipping.city || 'Hyderabad'} ({shipping.pincode || '500036'})
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <span style={{ color: '#888' }}>{isTelugu ? 'చెల్లింపు:' : 'Payment:'} <strong>{order.paymentMethod || 'COD'}</strong></span>
                              <span style={{ fontSize: '16px', fontWeight: 800, color: '#C53018' }}>{isTelugu ? 'మొత్తం:' : 'Total:'} ₹{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'wishlist' && (
              <div className="tab-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', color: '#2A1C15', margin: '0 0 4px 0', fontFamily: 'var(--font-serif)' }}>
                      {isTelugu ? 'నా పవిత్ర కోరికల జాబితా' : 'My Sacred Wishlist'}
                    </h2>
                    <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>
                      {isTelugu ? 'రాబోయే పూజలు మరియు పర్వదినాల కోసం మీరు భద్రపరిచిన పవిత్ర వస్తువులు.' : "Products you've saved for upcoming rituals and sacred ceremonies."}
                    </p>
                  </div>
                  <span style={{ fontSize: '13px', color: '#C53018', fontWeight: 600 }}>
                    {isTelugu ? `${wishlist.length} వస్తువులు` : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'}`}
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFDF9', borderRadius: '16px', border: '1px dashed #E8D7CA' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF0ED', color: '#C53018', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                      <Heart size={28} />
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#2A1C15', marginBottom: '8px' }}>{isTelugu ? 'కోరికల జాబితా ఖాళీగా ఉంది' : 'Your Wishlist is Empty'}</h3>
                    <p style={{ color: '#666', fontSize: '14px', maxWidth: '360px', margin: '0 auto 20px auto' }}>
                      {isTelugu ? 'మా ప్రామాణిక పూజా కిట్లు, హోమ ద్రవ్యాలు, ఇత్తడి దీపాలు మరియు సుగంధ ధూపాలను పరిశీలించండి.' : 'Explore our authentic pooja kits, homam samagri, brass diyas, and pure incense.'}
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => navigate('/shop')}
                      style={{ padding: '10px 24px', borderRadius: '30px', cursor: 'pointer' }}
                    >
                      {isTelugu ? 'పూజా షాప్ బ్రౌజ్ చేయండి' : 'Browse Sacred Shop'}
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {wishlist.map((prod) => (
                      <div
                        key={prod.id}
                        style={{
                          background: '#fff',
                          borderRadius: '12px',
                          border: '1px solid #eee',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          position: 'relative'
                        }}
                      >
                        <div
                          onClick={() => navigate(`/product/${prod.id}`)}
                          style={{ height: '160px', background: '#FFFDF9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '12px' }}
                        >
                          <img
                            src={prod.image || (prod.images && prod.images[0]) || '/assets/product_pooja_kit.png'}
                            alt={prod.name}
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
                          />
                        </div>

                        <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                          <h4
                            onClick={() => navigate(`/product/${prod.id}`)}
                            style={{ fontSize: '14px', fontWeight: 600, color: '#2A1C15', margin: '0 0 8px 0', cursor: 'pointer', lineHeight: '1.4' }}
                          >
                            {prod.name}
                          </h4>

                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: '#C53018' }}>₹{prod.price}</span>
                            {prod.oldPrice && (
                              <span style={{ fontSize: '12px', color: '#999', textDecoration: 'line-through' }}>₹{prod.oldPrice}</span>
                            )}
                          </div>

                          <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                addToCart(prod, 1);
                                alert(isTelugu ? `"${prod.name}" మీ కార్ట్‌కు జోడించబడింది!` : `Added "${prod.name}" to your cart!`);
                              }}
                              className="btn-primary"
                              style={{ flex: 1, padding: '8px 12px', fontSize: '13px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            >
                              <Package size={14} /> {isTelugu ? 'కార్ట్‌కు జోడించండి' : 'Add to Cart'}
                            </button>
                            <button
                              onClick={() => removeFromWishlist(prod.id)}
                              style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer', color: '#666' }}
                              title={isTelugu ? 'కోరికల జాబితా నుండి తొలగించు' : 'Remove from wishlist'}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div className="tab-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: 0, color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    <Bell size={24} color="#C53018" /> {isTelugu ? 'నోటిఫికేషన్లు & హెచ్చరికలు' : 'Notifications & Alerts'}
                  </h2>
                  {notificationsList.some(n => !n.read) && (
                    <button 
                      onClick={() => setNotificationsList(notificationsList.map(n => ({ ...n, read: true })))}
                      style={{ background: '#FFF0ED', color: '#C53018', border: '1px solid #FFD8D0', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      {isTelugu ? 'అన్నీ చదివినట్లు గుర్తించు' : 'Mark All as Read'}
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {notificationsList.map((notif) => (
                    <div 
                      key={notif.id}
                      style={{ 
                        display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 20px', 
                        background: notif.read ? '#fff' : '#FFFDF9', 
                        border: `1px solid ${notif.read ? '#eee' : '#FFD8D0'}`,
                        borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF0ED', color: '#C53018', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        {notif.type === 'booking' ? <Flame size={18} /> : notif.type === 'calendar' ? <CalendarDays size={18} /> : <Sparkles size={18} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: '#2A1C15', fontWeight: 600 }}>{getNotifTitle(notif)}</h4>
                          <span style={{ fontSize: '12px', color: '#999' }}>{getNotifTime(notif)}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5' }}>{getNotifMessage(notif)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 24px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <Settings size={24} color="#C53018" /> {isTelugu ? 'ఖాతా & పూజా ప్రాధాన్యతలు' : 'Account & Ritual Preferences'}
                </h2>

                {settingsSavedMessage && (
                  <div style={{ padding: '12px 18px', borderRadius: '10px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', marginBottom: '24px', fontSize: '14px', fontWeight: 600 }}>
                    {settingsSavedMessage}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {/* Vedic Sankalpam Profile */}
                  <div style={{ background: '#FAF7F2', padding: '22px', borderRadius: '14px', border: '1px solid #EAE4D9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <Sparkles size={18} color="#C53018" />
                      <h3 style={{ margin: 0, fontSize: '16px', color: '#8C3B1E', fontWeight: 700 }}>
                        {isTelugu ? 'వేద సంకల్పం & గోత్ర నామాల వివరాలు' : 'Vedic Sankalpam & Ritual Details'}
                      </h3>
                    </div>
                    <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#665' }}>
                      {isTelugu ? 'ఈ పవిత్ర వివరాలను మా వేద పండితులు మీ గృహ మరియు దేవాలయ పూజల సమయంలో శాస్త్రోక్త గోత్ర-నామ సంకల్పం కోసం ఉపయోగిస్తారు.' : 'These sacred details are used by our verified Vedic Pandits to recite authentic Gotra-Nama sankalpam during your home and temple rituals.'}
                    </p>

                    <div className="profile-form-grid">
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'గోత్రం (Gothram)' : 'Gothram (గోత్రం)'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: కాశ్యప, భరద్వాజ, వశిష్ట, హరితస...' : 'e.g. Kasyapa, Bharadwaja, Vasishta, Harithasa...'}
                          value={gothram} 
                          onChange={(e) => setGothram(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '14px', color: '#333', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'జన్మ నక్షత్రం (Nakshatram)' : 'Janma Nakshatram (జన్మ నక్షత్రం)'}
                        </label>
                        <select 
                          value={nakshatram} 
                          onChange={(e) => setNakshatram(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '14px', color: '#333', outline: 'none' }}
                        >
                          {[
                            { val: 'Ashwini', label: isTelugu ? 'అశ్విని (Ashwini)' : 'Ashwini' },
                            { val: 'Bharani', label: isTelugu ? 'భరణి (Bharani)' : 'Bharani' },
                            { val: 'Krittika', label: isTelugu ? 'కృత్తిక (Krittika)' : 'Krittika' },
                            { val: 'Rohini', label: isTelugu ? 'రోహిణి (Rohini)' : 'Rohini' },
                            { val: 'Mrigashira', label: isTelugu ? 'మృగశిర (Mrigashira)' : 'Mrigashira' },
                            { val: 'Ardra', label: isTelugu ? 'ఆర్ద్ర (Ardra)' : 'Ardra' },
                            { val: 'Punarvasu', label: isTelugu ? 'పునర్వసు (Punarvasu)' : 'Punarvasu' },
                            { val: 'Pushya', label: isTelugu ? 'పుష్యమి (Pushya)' : 'Pushya' },
                            { val: 'Ashlesha', label: isTelugu ? 'ఆశ్లేష (Ashlesha)' : 'Ashlesha' },
                            { val: 'Magha', label: isTelugu ? 'మఖ (Magha)' : 'Magha' },
                            { val: 'Purva Phalguni', label: isTelugu ? 'పూర్వఫల్గుణి / పుబ్బ (Purva Phalguni)' : 'Purva Phalguni' },
                            { val: 'Uttara Phalguni', label: isTelugu ? 'ఉత్తరఫల్గుణి / ఉత్తర (Uttara Phalguni)' : 'Uttara Phalguni' },
                            { val: 'Hasta', label: isTelugu ? 'హస్త (Hasta)' : 'Hasta' },
                            { val: 'Chitra', label: isTelugu ? 'చిత్త (Chitra)' : 'Chitra' },
                            { val: 'Swati', label: isTelugu ? 'స్వాతి (Swati)' : 'Swati' },
                            { val: 'Vishakha', label: isTelugu ? 'విశాఖ (Vishakha)' : 'Vishakha' },
                            { val: 'Anuradha', label: isTelugu ? 'అనూరాధ (Anuradha)' : 'Anuradha' },
                            { val: 'Jyeshtha', label: isTelugu ? 'జ్యేష్ఠ (Jyeshtha)' : 'Jyeshtha' },
                            { val: 'Mula', label: isTelugu ? 'మూల (Mula)' : 'Mula' },
                            { val: 'Purva Ashadha', label: isTelugu ? 'పూర్వాషాఢ (Purva Ashadha)' : 'Purva Ashadha' },
                            { val: 'Uttara Ashadha', label: isTelugu ? 'ఉత్తరాషాఢ (Uttara Ashadha)' : 'Uttara Ashadha' },
                            { val: 'Shravana', label: isTelugu ? 'శ్రవణం (Shravana)' : 'Shravana' },
                            { val: 'Dhanishta', label: isTelugu ? 'ధనిష్ట (Dhanishta)' : 'Dhanishta' },
                            { val: 'Shatabhisha', label: isTelugu ? 'శతభిషం (Shatabhisha)' : 'Shatabhisha' },
                            { val: 'Purva Bhadrapada', label: isTelugu ? 'పూర్వాభాద్ర (Purva Bhadrapada)' : 'Purva Bhadrapada' },
                            { val: 'Uttara Bhadrapada', label: isTelugu ? 'ఉత్తరాభాద్ర (Uttara Bhadrapada)' : 'Uttara Bhadrapada' },
                            { val: 'Revati', label: isTelugu ? 'రేవతి (Revati)' : 'Revati' }
                          ].map(n => (
                            <option key={n.val} value={n.val}>{n.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'రాశి (Rashi)' : 'Rashi (రాశి)'}
                        </label>
                        <select 
                          value={rashi} 
                          onChange={(e) => setRashi(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '14px', color: '#333', outline: 'none' }}
                        >
                          {[
                            { val: 'Mesha (Aries)', label: isTelugu ? 'మేష రాశి (Mesha / Aries)' : 'Mesha (Aries)' },
                            { val: 'Vrishabha (Taurus)', label: isTelugu ? 'వృషభ రాశి (Vrishabha / Taurus)' : 'Vrishabha (Taurus)' },
                            { val: 'Mithuna (Gemini)', label: isTelugu ? 'మిథున రాశి (Mithuna / Gemini)' : 'Mithuna (Gemini)' },
                            { val: 'Karka (Cancer)', label: isTelugu ? 'కర్కాటక రాశి (Karka / Cancer)' : 'Karka (Cancer)' },
                            { val: 'Simha (Leo)', label: isTelugu ? 'సింహ రాశి (Simha / Leo)' : 'Simha (Leo)' },
                            { val: 'Kanya (Virgo)', label: isTelugu ? 'కన్యా రాశి (Kanya / Virgo)' : 'Kanya (Virgo)' },
                            { val: 'Tula (Libra)', label: isTelugu ? 'తులా రాశి (Tula / Libra)' : 'Tula (Libra)' },
                            { val: 'Vrischika (Scorpio)', label: isTelugu ? 'వృశ్చిక రాశి (Vrischika / Scorpio)' : 'Vrischika (Scorpio)' },
                            { val: 'Dhanu (Sagittarius)', label: isTelugu ? 'ధనుస్సు రాశి (Dhanu / Sagittarius)' : 'Dhanu (Sagittarius)' },
                            { val: 'Makara (Capricorn)', label: isTelugu ? 'మకర రాశి (Makara / Capricorn)' : 'Makara (Capricorn)' },
                            { val: 'Kumbha (Aquarius)', label: isTelugu ? 'కుంభ రాశి (Kumbha / Aquarius)' : 'Kumbha (Aquarius)' },
                            { val: 'Meena (Pisces)', label: isTelugu ? 'మీన రాశి (Meena / Pisces)' : 'Meena (Pisces)' }
                          ].map(r => (
                            <option key={r.val} value={r.val}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'ఇష్ట దైవం / కుల దైవం (Ishta Devata)' : 'Ishta Devata / Kula Devata (ఇష్ట దైవం)'}
                        </label>
                        <input 
                          type="text" 
                          placeholder={isTelugu ? 'ఉదా: శ్రీ వేంకటేశ్వర స్వామి, శివుడు, లక్ష్మీదేవి...' : 'e.g. Sri Venkateswara, Lord Shiva, Goddess Lakshmi...'}
                          value={ishtaDevata} 
                          onChange={(e) => setIshtaDevata(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '14px', color: '#333', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Language & Communication Preferences */}
                  <div style={{ background: '#FFF', padding: '22px', borderRadius: '14px', border: '1px solid #eee' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#2A1C15', fontWeight: 700 }}>
                      {isTelugu ? 'కమ్యూనికేషన్ & పూజా సమాచార హెచ్చరికలు' : 'Communication & Ritual Coordination Alerts'}
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#444' }}>
                          {isTelugu ? 'కోరుకున్న సంభాషణ భాష' : 'Preferred Communication Language'}
                        </label>
                        <select 
                          value={prefLang} 
                          onChange={(e) => setPrefLang(e.target.value)}
                          style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '14px', color: '#333', outline: 'none' }}
                        >
                          <option value="Telugu">తెలుగు (Telugu)</option>
                          <option value="English">English</option>
                          <option value="Sanskrit">संस्कृतम् (Sanskrit)</option>
                          <option value="Hindi">हिन्दी (Hindi)</option>
                          <option value="Tamil">தமிழ் (Tamil)</option>
                          <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={whatsappAlerts} 
                            onChange={(e) => setWhatsappAlerts(e.target.checked)} 
                            style={{ width: '18px', height: '18px', accentColor: '#C53018', cursor: 'pointer' }}
                          />
                          <span>{isTelugu ? 'పండితుల సమన్వయం & ముహూర్తాల కోసం వాట్సాప్ అప్‌డేట్లు పొందండి' : 'Receive WhatsApp updates for Pandit coordination & Muhurats'}</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={smsAlerts} 
                            onChange={(e) => setSmsAlerts(e.target.checked)} 
                            style={{ width: '18px', height: '18px', accentColor: '#C53018', cursor: 'pointer' }}
                          />
                          <span>{isTelugu ? 'పూజా స్థితి నిర్ధారణల కోసం SMS నోటిఫికేషన్లు పొందండి' : 'Receive SMS notifications for ritual status confirmations'}</span>
                        </label>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#333', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={panchangamAlerts} 
                            onChange={(e) => setPanchangamAlerts(e.target.checked)} 
                            style={{ width: '18px', height: '18px', accentColor: '#C53018', cursor: 'pointer' }}
                          />
                          <span>{isTelugu ? 'రోజువారీ శుభ తిథి, నక్షత్రం & పండుగల రిమైండర్లు పొందండి' : 'Daily Auspicious Tithi, Nakshatram & Festival reminders'}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div>
                    <button 
                      onClick={handleSaveSettings}
                      style={{ 
                        background: '#C53018', color: '#fff', border: 'none', padding: '14px 36px', 
                        borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', 
                        boxShadow: '0 4px 15px rgba(197, 48, 24, 0.25)', transition: 'background 0.2s' 
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#A32511'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#C53018'}
                    >
                      {isTelugu ? 'ప్రాధాన్యతలను సేవ్ చేయండి' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Value Props */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '36px', marginBottom: '24px' }}>
            {[
              { icon: ShieldCheck, title: isTelugu ? 'ధృవీకరించబడిన వేద పండితులు' : 'Verified Pandits' },
              { icon: Check, title: isTelugu ? 'ప్రామాణిక శాస్త్రోక్త క్రతువులు' : 'Authentic Rituals' },
              { icon: Clock, title: isTelugu ? 'సమయపాలనతో కూడిన సేవ' : 'On-Time Service' },
              { icon: Sparkles, title: isTelugu ? 'వేద శాస్త్ర సంప్రదాయం' : 'Shastra Compliant' }
            ].map((prop, i) => (
              <div key={i} style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f0eae4' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF0ED', color: '#C53018', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <prop.icon size={20} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', lineHeight: '1.2' }}>{prop.title}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '36px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => setSelectedInvoice(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>

            {/* Invoice Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #C53018', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', color: '#C53018', margin: '0 0 4px 0', fontSize: '28px' }}>
                  GNANA SUDHA
                </h1>
                <p style={{ margin: 0, fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                  {isTelugu ? 'ఆధ్యాత్మిక సేవలు & పవిత్ర పూజా ద్రవ్యాలు' : 'Spiritual Services & Divine Pooja Essentials'}<br/>
                  GSTIN: 36AAACG1234F1Z8 • Hyderabad, Telangana<br/>
                  support@gnanasudha.com • Helpline: +91 92818 67002 • WhatsApp: +91 92818 67001
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#2A1C15', display: 'block' }}>{isTelugu ? 'పన్ను రసీదు (TAX INVOICE)' : 'TAX INVOICE'}</span>
                <span style={{ fontSize: '13px', color: '#666' }}>{isTelugu ? 'ఇన్వాయిస్ సంఖ్య:' : 'Invoice No:'} <strong>{selectedInvoice.order_number || `#GS-${selectedInvoice.id}`}</strong></span>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {isTelugu ? 'తేదీ:' : 'Date:'} {new Date(selectedInvoice.date || selectedInvoice.created_at || Date.now()).toLocaleDateString(isTelugu ? 'te-IN' : 'en-IN')}
                </div>
              </div>
            </div>

            {/* Bill To Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', background: '#FFFDF9', padding: '16px', borderRadius: '10px', border: '1px solid #f0e6dd' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#2A1C15', display: 'block', marginBottom: '4px' }}>{isTelugu ? 'బిల్లు చిరునామా:' : 'Billed To:'}</strong>
                {(() => {
                  const s = typeof selectedInvoice.shippingDetails === 'string' ? JSON.parse(selectedInvoice.shippingDetails || '{}') : (selectedInvoice.shippingDetails || {});
                  return (
                    <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                      <strong>{s.name || currentCustomer.name}</strong><br/>
                      {s.address || (isTelugu ? 'ఆర్డర్ సమయంలో ఇచ్చిన చిరునామా' : 'Address provided at checkout')}<br/>
                      {s.city || 'Hyderabad'}, {s.state || 'Telangana'} - {s.pincode || '500036'}<br/>
                      {isTelugu ? 'ఫోన్:' : 'Phone:'} {s.phone || currentCustomer.phone || 'N/A'}
                    </div>
                  );
                })()}
              </div>

              <div>
                <strong style={{ fontSize: '13px', color: '#2A1C15', display: 'block', marginBottom: '4px' }}>{isTelugu ? 'ఆర్డర్ వివరాలు:' : 'Order Details:'}</strong>
                <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
                  {isTelugu ? 'స్థితి:' : 'Status:'} <strong>{getOrderStatusText(selectedInvoice.status || 'Confirmed')}</strong><br/>
                  {isTelugu ? 'చెల్లింపు విధానం:' : 'Payment Method:'} <strong>{selectedInvoice.paymentMethod || 'COD'}</strong><br/>
                  {isTelugu ? 'చెల్లింపు స్థితి:' : 'Payment Status:'} <strong>{selectedInvoice.paymentStatus === 'Paid' ? (isTelugu ? 'చెల్లించబడింది' : 'Paid') : (selectedInvoice.paymentStatus || (isTelugu ? 'పెండింగ్' : 'Pending'))}</strong>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#2A1C15', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>{isTelugu ? 'వస్తువు వివరాలు' : 'Item Description'}</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>{isTelugu ? 'పరిమాణం' : 'Qty'}</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isTelugu ? 'ధర' : 'Price'}</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>{isTelugu ? 'మొత్తం' : 'Total'}</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const items = typeof selectedInvoice.items === 'string' ? JSON.parse(selectedInvoice.items || '[]') : (selectedInvoice.items || []);
                  return items.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <strong>{it.name}</strong>
                        {it.variant && <span style={{ color: '#888', display: 'block', fontSize: '11px' }}>{isTelugu ? 'రకం:' : 'Variant:'} {it.variant}</span>}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>{it.quantity || 1}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>₹{it.price}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>₹{(Number(it.price) || 0) * (it.quantity || 1)}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div style={{ marginLeft: 'auto', width: '280px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>{isTelugu ? 'ఉప మొత్తం:' : 'Subtotal:'}</span>
                <span>₹{selectedInvoice.subtotal || selectedInvoice.totalAmount}</span>
              </div>
              {selectedInvoice.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#2e7d32' }}>
                  <span>{isTelugu ? 'రాయితీ:' : 'Discount:'}</span>
                  <span>-₹{selectedInvoice.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>GST (18%):</span>
                <span>₹{selectedInvoice.tax || Math.round((selectedInvoice.totalAmount || 0) * 0.18 / 1.18)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>{isTelugu ? 'రవాణా ఛార్జీలు:' : 'Shipping Charges:'}</span>
                <span>{selectedInvoice.shipping_fee === 0 ? (isTelugu ? 'ఉచితం' : 'FREE') : `₹${selectedInvoice.shipping_fee || 0}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #2A1C15', paddingTop: '10px', fontSize: '18px', fontWeight: 800, color: '#C53018' }}>
                <span>{isTelugu ? 'మొత్తం చెల్లించవలసినది:' : 'Final Payable:'}</span>
                <span>₹{selectedInvoice.totalAmount}</span>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '20px' }}>
              <button 
                onClick={() => window.print()}
                style={{ background: '#C53018', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Printer size={16} /> {isTelugu ? 'రసీదు ప్రింట్ / సేవ్ చేయండి' : 'Print / Save Invoice'}
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                style={{ background: '#f5f5f5', color: '#333', border: '1px solid #ddd', padding: '12px 24px', borderRadius: '30px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
              >
                {isTelugu ? 'మూసివేయి' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
