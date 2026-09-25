import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { Package, User, MapPin, CreditCard, Wallet, Heart, Bell, Settings, LogOut, ShieldCheck, Headphones, CheckCircle2, ChevronRight, Star, Clock, IndianRupee, Edit3, Plus, Camera, Trash2, Check } from 'lucide-react';
import '../App.css';

export default function CustomerProfile() {
  const { currentCustomer, orders, logout, updateCustomer } = useContext(DataContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Local state for interactive features
  const [profilePhoto, setProfilePhoto] = useState('/lotus.svg');
  const fileInputRef = useRef(null);

  const [walletBalance, setWalletBalance] = useState(0);

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: currentCustomer ? currentCustomer.name : 'Vamsi Customer',
      details: '123, Jubilee Hills, Road No 36, Hyderabad, Telangana 500033',
      phone: '+91 9876543210',
      isDefault: true
    }
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ details: '', phone: '' });

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'VISA', name: 'HDFC Bank Credit Card', number: '**** **** **** 4242' }
  ]);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardForm, setNewCardForm] = useState({ name: '', number: '', expiry: '', cvv: '' });

  if (!currentCustomer) {
    navigate('/login');
    return null;
  }

  const customerOrders = orders.filter(o => o.customerid === currentCustomer.id);

  // Handlers
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imgUrl = URL.createObjectURL(file);
      setProfilePhoto(imgUrl);
    }
  };

  const handleAddAddress = () => {
    if (newAddressForm.details.trim()) {
      setAddresses([...addresses, {
        id: Date.now(),
        name: currentCustomer.name,
        details: newAddressForm.details,
        phone: newAddressForm.phone || '+91 0000000000',
        isDefault: addresses.length === 0
      }]);
      setNewAddressForm({ details: '', phone: '' });
      setIsAddingAddress(false);
    }
  };

  const handleAddCard = () => {
    if (newCardForm.number.trim()) {
      setPaymentMethods([...paymentMethods, {
        id: Date.now(),
        type: 'CARD',
        name: newCardForm.name || 'New Credit Card',
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
    const amount = prompt("Enter amount to add to your wallet (in ₹):");
    const num = parseFloat(amount);
    if (!isNaN(num) && num > 0) {
      setWalletBalance(prev => prev + num);
      alert(`Successfully added ₹${num} to your wallet!`);
    } else if (amount !== null) {
      alert("Please enter a valid amount.");
    }
  };

  return (
    <div className="section-padding" style={{ minHeight: '100vh' }}>
      <div className="profile-container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
        
        {/* Left Sidebar */}
        <div className="profile-sidebar" style={{ width: '280px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: 'fit-content', alignSelf: 'flex-start' }}>
          <div className="profile-sidebar-header" style={{ textAlign: 'center', borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px' }}>
            <div className="profile-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#FFF0ED', margin: '0 auto 12px auto', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 10px rgba(197, 48, 24, 0.1)' }}>
              <img src={profilePhoto} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="profile-name" style={{ fontSize: '18px', fontWeight: '700', color: '#2A1C15', marginBottom: '4px' }}>{currentCustomer.name}</div>
            <div className="profile-subtitle" style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>{currentCustomer.email}</div>
            <div className="profile-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0F9F4', color: '#1B8049', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
              <ShieldCheck size={14} /> Member Since 2025
            </div>
          </div>
          
          <div className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { id: 'profile', icon: User, label: 'Profile Information' },
              { id: 'orders', icon: Package, label: 'My Orders & Bookings' },
              { id: 'addresses', icon: MapPin, label: 'Saved Addresses' },
              { id: 'payment', icon: CreditCard, label: 'Payment Methods' },
              { id: 'wallet', icon: Wallet, label: 'Wallet & Rewards' },
              { id: 'pandits', icon: Heart, label: 'My Favourite Pandits' },
              { id: 'notifications', icon: Bell, label: 'Notifications' },
              { id: 'settings', icon: Settings, label: 'Settings' }
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
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-main" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            
            {activeTab === 'profile' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <User size={24} color="#C53018" /> Profile Information
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                  {/* Photo Upload Area */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#FFF0ED', overflow: 'hidden', border: '2px solid #C53018', position: 'relative' }}>
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
                        <Camera size={16} /> Upload New Photo
                      </button>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#888' }}>JPG, GIF or PNG. Max size of 2MB</p>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0' }} />

                  {/* Form Fields */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>Full Name</label>
                      <input type="text" id="customerNameInput" defaultValue={currentCustomer.name} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '15px', color: '#333', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>Email Address</label>
                      <input type="email" id="customerEmailInput" defaultValue={currentCustomer.email} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', background: '#fff', fontSize: '15px', color: '#333', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>Phone Number</label>
                      <input type="tel" id="customerPhoneInput" defaultValue={currentCustomer.phone || "+91 9876543210"} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>Date of Birth</label>
                      <input type="date" id="customerDobInput" defaultValue={currentCustomer.dob || ""} style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                  </div>
                  
                  <button onClick={() => {
                    const name = document.getElementById('customerNameInput').value;
                    const email = document.getElementById('customerEmailInput').value;
                    const phone = document.getElementById('customerPhoneInput').value;
                    const dob = document.getElementById('customerDobInput').value;
                    updateCustomer(currentCustomer.id, { name, email, phone, dob });
                    alert('Profile Details Updated!');
                  }} style={{ alignSelf: 'flex-start', background: '#C53018', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: 'background 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = '#A32511'} onMouseOut={(e) => e.currentTarget.style.background = '#C53018'}>
                    Save Changes
                  </button>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '20px 0' }} />

                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', margin: '0 0 24px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    Security Settings
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>Current Password</label>
                      <input type="password" id="customerOldPassword" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#444' }}>New Password</label>
                      <input type="password" id="customerNewPassword" style={{ width: '100%', padding: '14px 16px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }} onFocus={(e) => e.target.style.borderColor = '#C53018'} onBlur={(e) => e.target.style.borderColor = '#ccc'} />
                    </div>
                  </div>
                  <button onClick={() => {
                    const oldP = document.getElementById('customerOldPassword').value;
                    const newP = document.getElementById('customerNewPassword').value;
                    if (oldP !== currentCustomer.password) {
                      alert('Incorrect current password.');
                      return;
                    }
                    if (newP.length < 4) {
                      alert('New password must be at least 4 characters.');
                      return;
                    }
                    updateCustomer(currentCustomer.id, { password: newP });
                    document.getElementById('customerOldPassword').value = '';
                    document.getElementById('customerNewPassword').value = '';
                    alert('Password updated successfully!');
                  }} style={{ alignSelf: 'flex-start', background: '#fff', color: '#C53018', border: '2px solid #C53018', padding: '12px 30px', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '10px', transition: 'all 0.3s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#C53018'; e.currentTarget.style.color = '#fff'; }} onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#C53018'; }}>
                    Change Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: 0, color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                    <MapPin size={24} color="#C53018" /> Saved Addresses
                  </h2>
                  {!isAddingAddress && (
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      style={{ background: '#C53018', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Plus size={16} /> Add New
                    </button>
                  )}
                </div>

                {isAddingAddress ? (
                  <div style={{ background: '#FFF9F8', border: '1px solid #FADED7', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#C53018' }}>Add New Address</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      <textarea 
                        placeholder="Full Address (House No, Street, City, State, Pincode)" 
                        rows="3"
                        value={newAddressForm.details}
                        onChange={(e) => setNewAddressForm({...newAddressForm, details: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Phone Number (e.g. +91 9876543210)" 
                        value={newAddressForm.phone}
                        onChange={(e) => setNewAddressForm({...newAddressForm, phone: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                      />
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button onClick={handleAddAddress} style={{ background: '#C53018', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save Address</button>
                        <button onClick={() => setIsAddingAddress(false)} style={{ background: '#fff', color: '#666', border: '1px solid #ccc', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {addresses.map(addr => (
                    <div key={addr.id} style={{ border: addr.isDefault ? '1px solid #C53018' : '1px solid #eee', borderRadius: '16px', padding: '24px', background: addr.isDefault ? '#FFF9F8' : '#fff', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        {addr.isDefault ? (
                          <span style={{ background: '#C53018', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Home (Default)</span>
                        ) : (
                          <span style={{ background: '#f0f0f0', color: '#666', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>Other</span>
                        )}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><Edit3 size={18} /></button>
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>{addr.name}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px', lineHeight: '1.6' }}>{addr.details}</p>
                      <p style={{ margin: 0, color: '#333', fontSize: '14px', fontWeight: '500' }}>{addr.phone}</p>
                    </div>
                  ))}
                  
                  {!isAddingAddress && (
                    <div 
                      onClick={() => setIsAddingAddress(true)}
                      style={{ border: '1px dashed #ccc', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', minHeight: '180px', transition: 'all 0.2s', background: '#fafafa' }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = '#C53018'; e.currentTarget.style.color = '#C53018'; e.currentTarget.style.background = '#FFF9F8'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = '#ccc'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#fafafa'; }}
                    >
                      <Plus size={32} style={{ marginBottom: '12px' }} />
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>Add New Address</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <CreditCard size={24} color="#C53018" /> Payment Methods
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
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {isAddingCard ? (
                  <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#333' }}>Add New Card</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <input 
                        type="text" 
                        placeholder="Name on Card" 
                        value={newCardForm.name}
                        onChange={(e) => setNewCardForm({...newCardForm, name: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                      />
                      <input 
                        type="text" 
                        placeholder="Card Number (16 digits)" 
                        value={newCardForm.number}
                        onChange={(e) => setNewCardForm({...newCardForm, number: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="16"
                      />
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={newCardForm.expiry}
                        onChange={(e) => setNewCardForm({...newCardForm, expiry: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="5"
                      />
                      <input 
                        type="password" 
                        placeholder="CVV" 
                        value={newCardForm.cvv}
                        onChange={(e) => setNewCardForm({...newCardForm, cvv: e.target.value})}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
                        maxLength="4"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button onClick={handleAddCard} style={{ background: '#C53018', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Save Card</button>
                      <button onClick={() => setIsAddingCard(false)} style={{ background: '#fff', color: '#666', border: '1px solid #ccc', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsAddingCard(true)}
                    style={{ background: '#fff', color: '#333', border: '1px solid #ccc', padding: '12px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Plus size={16} /> Add Payment Method
                  </button>
                )}
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <Wallet size={24} color="#C53018" /> Wallet & Rewards
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #E95221 0%, #C53018 100%)', padding: '32px', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 30px rgba(197, 48, 24, 0.2)' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1, transform: 'scale(2)' }}>
                      <Wallet size={120} />
                    </div>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '500', opacity: 0.9, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Available Balance</h3>
                    <div style={{ fontSize: '48px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '24px' }}>
                      <IndianRupee size={36} strokeWidth={2.5} /> {walletBalance.toFixed(2)}
                    </div>
                    <button 
                      onClick={handleAddMoney}
                      style={{ background: '#fff', color: '#C53018', border: 'none', padding: '12px 24px', borderRadius: '30px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    >
                      <Plus size={18} strokeWidth={3} /> Add Money
                    </button>
                  </div>
                  
                  <div style={{ background: '#fff', border: '1px solid #eee', padding: '32px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Gnana Sudha Coins</h3>
                    <div style={{ fontSize: '42px', fontWeight: '800', color: '#2A1C15', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#FFF9E6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star fill="#F5A623" color="#F5A623" size={28} />
                      </div>
                      250
                    </div>
                    <p style={{ margin: '20px 0 0 0', fontSize: '14px', color: '#888', lineHeight: '1.5' }}>
                      <strong style={{ color: '#444' }}>Earn coins on every booking!</strong><br/>
                      100 Coins = ₹10 value in store.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs (Orders, Pandits, Notifications, Settings) remain functionally similar but with updated styling wrappers if needed */}
            {activeTab === 'orders' && (
              <div className="tab-fade-in">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', margin: '0 0 30px 0', color: '#2A1C15', fontFamily: 'var(--font-serif)' }}>
                  <Package size={24} color="#C53018" /> My Orders & Bookings
                </h2>
                {customerOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: '16px', border: '1px dashed #ddd' }}>
                    <Package size={64} color="#ccc" style={{ marginBottom: '20px' }} />
                    <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '12px' }}>No Orders Yet</h3>
                    <p style={{ color: '#666', marginBottom: '24px' }}>Start your spiritual journey with us today.</p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn-primary" onClick={() => navigate('/poojas')}>Book a Pooja</button>
                      <button className="btn-secondary" onClick={() => navigate('/pandit')}>Book a Pandit</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {customerOrders.map(order => (
                      <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '16px' }}>
                          <div><span style={{ color: '#888', fontSize: '13px' }}>Order ID</span><div style={{ fontWeight: '600' }}>{order.id}</div></div>
                          <div><span style={{ color: '#888', fontSize: '13px' }}>Date</span><div style={{ fontWeight: '600' }}>{new Date(order.date).toLocaleDateString()}</div></div>
                          <div><span style={{ color: '#888', fontSize: '13px' }}>Total</span><div style={{ fontWeight: '600', color: '#C53018' }}>₹{order.totalAmount}</div></div>
                        </div>
                        <div>
                          {order.items.map(item => (
                            <div key={item.cartId} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '8px 0' }}>
                              <div style={{ width: '48px', height: '48px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={item.img || item.image || '/assets/product_pooja_kit.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '600' }}>{item.name}</div>
                                <div style={{ fontSize: '13px', color: '#666' }}>Qty: {item.quantity || 1}</div>
                              </div>
                              <div style={{ fontWeight: '600' }}>₹{item.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {(activeTab === 'pandits' || activeTab === 'notifications' || activeTab === 'settings') && (
              <div className="tab-fade-in" style={{ textAlign: 'center', padding: '80px 20px', background: '#fafafa', borderRadius: '16px', border: '1px dashed #ddd' }}>
                 {activeTab === 'pandits' && <Heart size={64} color="#ccc" style={{ marginBottom: '20px' }} />}
                 {activeTab === 'notifications' && <Bell size={64} color="#ccc" style={{ marginBottom: '20px' }} />}
                 {activeTab === 'settings' && <Settings size={64} color="#ccc" style={{ marginBottom: '20px' }} />}
                 <h3 style={{ fontSize: '20px', color: '#333', marginBottom: '12px' }}>
                   {activeTab === 'pandits' ? 'No Favourite Pandits' : activeTab === 'notifications' ? 'No New Notifications' : 'Account Settings'}
                 </h3>
                 <p style={{ color: '#666' }}>
                   {activeTab === 'settings' ? 'Manage your account preferences and security settings here.' : 'Nothing to show here right now.'}
                 </p>
              </div>
            )}

          </div>

          {/* Bottom Value Props */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '20px' }}>
            {[
              { icon: ShieldCheck, title: 'Verified Pandits' },
              { icon: Check, title: 'Authentic Rituals' },
              { icon: Clock, title: 'On-Time Service' },
              { icon: IndianRupee, title: 'Transparent Pricing' }
            ].map((prop, i) => (
              <div key={i} style={{ background: '#fff', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF0ED', color: '#C53018', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <prop.icon size={20} />
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#333', lineHeight: '1.2' }}>{prop.title}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
