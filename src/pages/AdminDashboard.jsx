import React, { useState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Box, Grid, Archive, Star, Flame,
  UserSquare2, CalendarDays, Users, CreditCard, Ticket, MessageSquare,
  Bell, FileText, BarChart3, Settings, LogOut, Menu,
  Search, Moon, Globe, MoreHorizontal, Calendar, ArrowUpRight, ArrowDownRight,
  Plus, Tag, CheckCircle2, AlertCircle, BoxSelect, FlameKindling, Droplet, UserPlus, FileEdit, HelpCircle, Save, Trash2, Key,
  LifeBuoy, Smartphone, RotateCcw, Terminal, Database, Receipt, Download, Clock, ChevronRight, Flower2, CalendarClock
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { DataContext } from '../context/DataContext';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
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
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global Context State
  const {
    poojas, addPooja, deletePooja, updatePooja,
    homams, addHomam, deleteHomam, updateHomam,
    pandits, addPandit, approvePandit, updatePandit, deletePandit,
    products, addProduct, deleteProduct, updateProduct,
    categories, addCategory, deleteCategory,
    paymentSettings, updatePaymentSettings,
    adminUsers, addAdminUser, deleteAdminUser, currentAdmin, setCurrentAdmin, logout,
    orders, updateOrder,
    customers, coupons, addCoupon, deleteCoupon,
    consultations, setConsultations
  } = useContext(DataContext);
  const currentAdminUser = currentAdmin;
  const setCurrentAdminUser = setCurrentAdmin;
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Filter State
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');
  const [newPoojaName, setNewPoojaName] = useState('');
  const [newPoojaDesc, setNewPoojaDesc] = useState('');
  const [newPoojaImg, setNewPoojaImg] = useState('');
  const [newPoojaPrice, setNewPoojaPrice] = useState('');
  const [newPoojaDiscountPrice, setNewPoojaDiscountPrice] = useState('');
  const [editingPoojaId, setEditingPoojaId] = useState(null);
  
  const [newHomamName, setNewHomamName] = useState('');
  const [newHomamDesc, setNewHomamDesc] = useState('');
  const [newHomamImg, setNewHomamImg] = useState('');
  const [newHomamPrice, setNewHomamPrice] = useState('');
  const [newHomamDiscountPrice, setNewHomamDiscountPrice] = useState('');
  const [editingHomamId, setEditingHomamId] = useState(null);

  const [newPanditName, setNewPanditName] = useState('');
  const [newPanditSpec, setNewPanditSpec] = useState('Vedic Rituals');
  const [newPanditExp, setNewPanditExp] = useState('0-2 Years');
  const [newPanditImg, setNewPanditImg] = useState('');
  const [editingPanditId, setEditingPanditId] = useState(null);

  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductOldPrice, setNewProductOldPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories?.[0]?.id || 1);

  const [newCategoryName, setNewCategoryName] = useState('');

  // Variant Builder State
  const [newProductVariants, setNewProductVariants] = useState([]);
  const [currentVariantUnit, setCurrentVariantUnit] = useState('gm');
  const [currentVariantValue, setCurrentVariantValue] = useState('');
  const [currentVariantPrice, setCurrentVariantPrice] = useState('');

  // Editing and Images
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProductImages, setNewProductImages] = useState([]);
  const [currentImageInput, setCurrentImageInput] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name);
    setNewProductDesc(product.desc);
    setNewProductPrice(product.price);
    setNewProductOldPrice(product.oldPrice || '');
    setNewProductCategory(product.categoryid);
    setNewProductVariants(product.variants || []);
    setNewProductImages(product.images || (product.image ? [product.image] : []));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddImage = () => {
    if (selectedImageFile && newProductImages.length < 6) {
      resizeImage(selectedImageFile, (resizedData) => {
        setNewProductImages([...newProductImages, resizedData]);
        setSelectedImageFile(null);
        const fileInput = document.getElementById('image-upload-input');
        if (fileInput) fileInput.value = '';
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
    setNewProductDesc('');
    setNewProductPrice('');
    setNewProductOldPrice('');
    setNewProductVariants([]);
    setNewProductImages([]);
    setCurrentImageInput('');
    setSelectedImageFile(null);
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
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Settings', icon: <Settings size={18} /> },
        { name: 'Payments', icon: <CreditCard size={18} /> },
        { name: 'Reports', icon: <FileText size={18} /> },
        { name: 'Reviews', icon: <MessageSquare size={18} /> },
        { name: 'Notifications', icon: <Bell size={18} />, badge: 12 },
        { name: 'Support Tickets', icon: <LifeBuoy size={18} />, badge: 3 },
        { name: 'App Settings', icon: <Smartphone size={18} /> },
        { name: 'Returns', icon: <RotateCcw size={18} /> },
        { name: 'Tax Rules', icon: <Receipt size={18} /> },
        { name: 'System Logs', icon: <Terminal size={18} /> },
        { name: 'Backups', icon: <Database size={18} /> },
      ]
    }
  ];

  if (!currentAdmin) {
    return <Navigate to="/login" replace />;
  }
  const downloadCSV = () => {
    let displayOrders = activeMenu === 'Bookings' 
      ? orders.filter(o => o.items.some(i => i.type === 'pooja' || i.type === 'pandit' || i.categoryid === 2))
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
      const itemNames = o.items.map(i => `${i.name} (Qty: ${i.quantity})`).join('; ');
      return [
        o.id,
        new Date(o.date).toLocaleString(),
        o.customerid || 'Guest',
        `"${o.shippingDetails?.fullName || ''}"`,
        `"${o.shippingDetails?.phone || ''}"`,
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
    // Default to last 7 days empty if no orders
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyRevenue[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
    }
    
    orders.forEach(order => {
      const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dailyRevenue[date] !== undefined) {
         dailyRevenue[date] += (order.totalAmount || 0);
      } else {
         dailyRevenue[date] = (order.totalAmount || 0);
      }
    });
    
    const chartData = Object.keys(dailyRevenue).map(date => ({
      name: date,
      revenue: dailyRevenue[date]
    }));
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    
    let productSales = 0;
    let serviceSales = 0;
    orders.forEach(o => {
      o.items.forEach(item => {
        if (item.type === 'product' || item.categoryid) {
          productSales += (item.price * (item.quantity || 1));
        } else {
          serviceSales += (item.price * (item.quantity || 1));
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
            <Menu
              size={20}
              color="#8C8C8C"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsSidebarOpen(true)}
              className="mobile-menu-btn"
            />
            <div className="header-search">
              <Search size={16} color="#8C8C8C" />
              <input type="text" placeholder="Search anything..." />
              <span className="shortcut-key">⌘ K</span>
            </div>
          </div>

          <div className="header-actions">
            <button className="header-btn">
              <Bell size={18} />
              <span className="notification-dot">8</span>
            </button>
            <button className="header-btn">
              <Moon size={18} />
            </button>
            <button className="header-btn" style={{ fontSize: 13, gap: 4 }}>
              <Globe size={18} /> English <MoreHorizontal size={14} />
            </button>
            <div className="admin-profile" onClick={() => setActiveMenu('Settings')} style={{ cursor: 'pointer' }}>
              <img src={currentAdminUser?.avatar || "/assets/pandit_icon_1782464629488.png"} className="profile-img" alt="Profile" />
              <div className="profile-info">
                <span className="profile-name">{currentAdminUser?.name || 'Vamsi Pallela'}</span>
                <span className="profile-role">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content" style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>

          {activeMenu === 'Dashboard' && (
            <>
              <div className="dashboard-top-bar">
                <div className="welcome-text">
                  <h1>Welcome back, {currentAdminUser?.name ? currentAdminUser.name.split(' ')[0] : 'Vamsi'}! 🙏</h1>
                  <p>Here's a real-time overview of your platform's data.</p>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* Left Column Area */}
                <div className="main-left" style={{ width: '100%', paddingRight: 0 }}>
                  {/* Real-time Metrics Grid */}
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon bg-blue-light"><Box size={18} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Total Products</span>
                        <span className="metric-value">{products.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>Active in shop</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon bg-purple-light"><Grid size={18} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Total Categories</span>
                        <span className="metric-value">{categories.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>Active in shop</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon bg-green-light"><UserSquare2 size={18} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Registered Pandits</span>
                        <span className="metric-value">{pandits.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>{pandits.filter(p => p.status === 'Approved').length} Approved</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon bg-orange-light"><Star size={18} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Active Poojas</span>
                        <span className="metric-value">{poojas.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>Available for booking</span>
                      </div>
                    </div>

                    <div className="metric-card">
                      <div className="metric-icon bg-red-light"><Flame size={18} /></div>
                      <div className="metric-content">
                        <span className="metric-label">Active Homams</span>
                        <span className="metric-value">{homams.length}</span>
                        <span className="metric-trend" style={{ color: '#888' }}>Available for booking</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions (Moved from right column) */}
                  <div className="dash-card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                      <div className="card-title">Quick Actions</div>
                    </div>
                    <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Products')} style={{ cursor: 'pointer' }}><div style={{ color: '#F5222D' }}><Plus size={16} /></div> Manage Products</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Categories')} style={{ cursor: 'pointer' }}><div style={{ color: '#1890FF' }}><Grid size={16} /></div> Manage Categories</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Pandits')} style={{ cursor: 'pointer' }}><div style={{ color: '#FA8C16' }}><UserPlus size={16} /></div> Manage Pandits</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Poojas')} style={{ cursor: 'pointer' }}><div style={{ color: '#722ED1' }}><Star size={16} /></div> Manage Poojas</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Homams')} style={{ cursor: 'pointer' }}><div style={{ color: '#FA8C16' }}><Flame size={16} /></div> Manage Homams</div>
                      <div className="quick-action-btn" onClick={() => setActiveMenu('Consultations')} style={{ cursor: 'pointer' }}><div style={{ color: '#1890FF' }}><CalendarClock size={16} /></div> Manage Consultations</div>
                    </div>
                  </div>

                  {renderAnalytics()}

                </div>
              </div>
            </>
          )}

          {activeMenu === 'Consultations' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Consultations</h1>
                <p>Update pricing for the consultation services displayed on the homepage.</p>
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
                        <th style={{ padding: '16px' }}>Original Price</th>
                        <th style={{ padding: '16px' }}>Discount Price</th>
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
                                item.price = Number(e.target.value);
                                setConsultations(newConsultations);
                              }}
                              style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
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
                                item.discountPrice = Number(e.target.value);
                                setConsultations(newConsultations);
                              }}
                              style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                              placeholder="e.g. 900"
                            />
                          </td>
                          <td style={{ padding: '16px', color: '#888', fontSize: '13px' }}>
                            Changes saved automatically
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
                <h1>Manage Poojas & Homams</h1>
                <p>Add or remove services from the frontend website.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Add New Pooja</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      {newPoojaImg ? (
                        <>
                          <img src={newPoojaImg} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }} />
                          <button onClick={() => setNewPoojaImg('')} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', padding: 0 }} title="Remove photo">&times;</button>
                        </>
                      ) : (
                        <label htmlFor="poojaPhotoUpload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', background: '#fafafa', color: '#888', fontSize: '10px' }} title="Upload Photo">
                          +Img
                          <input id="poojaPhotoUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            if (e.target.files && e.target.files[0]) resizeImage(e.target.files[0], setNewPoojaImg);
                          }} />
                        </label>
                      )}
                    </div>
                    <input type="text" placeholder="Pooja Name" className="login-input" style={{ flex: '1 1 150px' }} value={newPoojaName} onChange={e => setNewPoojaName(e.target.value)} />
                    <input type="text" placeholder="Short Description" className="login-input" style={{ flex: '2 1 200px' }} value={newPoojaDesc} onChange={e => setNewPoojaDesc(e.target.value)} maxLength="100" />
                    <input type="number" placeholder="Original Price (e.g. 1000)" className="login-input" style={{ flex: '1 1 100px' }} value={newPoojaPrice} onChange={e => setNewPoojaPrice(e.target.value)} />
                    <input type="number" placeholder="Discount Price (e.g. 900)" className="login-input" style={{ flex: '1 1 100px' }} value={newPoojaDiscountPrice} onChange={e => setNewPoojaDiscountPrice(e.target.value)} />
                    <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px', height: '40px' }} onClick={() => {
                      if (newPoojaName && newPoojaDesc) {
                        const poojaData = { name: newPoojaName, desc: newPoojaDesc, img: newPoojaImg || null, price: newPoojaPrice || null, discountPrice: newPoojaDiscountPrice || null };
                        if (editingPoojaId) {
                          updatePooja(editingPoojaId, poojaData);
                          setEditingPoojaId(null);
                        } else {
                          addPooja(poojaData);
                        }
                        setNewPoojaName(''); setNewPoojaDesc(''); setNewPoojaImg(''); setNewPoojaPrice(''); setNewPoojaDiscountPrice('');
                      }
                    }}>{editingPoojaId ? 'Update Pooja' : 'Add Pooja'}</button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Poojas on Website</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poojas.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{p.id}</td>
                          <td style={{ fontWeight: '500' }}>{p.name}</td>
                          <td style={{ fontSize: '13px', color: '#666' }}>{p.desc}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => {
                              setEditingPoojaId(p.id);
                              setNewPoojaName(p.name);
                              setNewPoojaDesc(p.desc);
                              setNewPoojaImg(p.img || '');
                              setNewPoojaPrice(p.price || '');
                              setNewPoojaDiscountPrice(p.discountPrice || '');
                            }} style={{ color: '#1890FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '16px' }}>Edit</button>
                            <button onClick={() => deletePooja(p.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Pandits' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Pandits</h1>
                <p>Register new pandits to the platform.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '20px', color: '#2B1D14' }}>{editingPanditId ? 'Edit Pandit' : 'Register New Pandit'}</h3>
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#666' }}>{editingPanditId ? 'Update the details for the selected pandit.' : 'Fill out the details below to add a new pandit directly to the platform.'}</p>
                    </div>
                    {newPanditImg ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative' }}>
                          <img src={newPanditImg} alt="Preview" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E04E15' }} />
                          <button onClick={() => setNewPanditImg('')} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', padding: 0 }} title="Remove photo">&times;</button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="panditPhotoUpload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', border: '1px dashed #ccc', borderRadius: '50%', cursor: 'pointer', background: '#fafafa', color: '#888', transition: 'all 0.2s', padding: '4px', textAlign: 'center' }} title="Upload Photo">
                        <span style={{ fontSize: '24px', lineHeight: 1 }}>+</span>
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#444' }}>Full Name *</label>
                      <input type="text" placeholder="e.g. Pt. Ravi Sharma" className="login-input" style={{ width: '100%', padding: '10px 14px' }} value={newPanditName} onChange={e => setNewPanditName(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#444' }}>Specialization *</label>
                      <select className="login-input" style={{ width: '100%', padding: '10px 14px' }} value={newPanditSpec} onChange={e => setNewPanditSpec(e.target.value)}>
                        <option value="Vedic Rituals">Vedic Rituals</option>
                        <option value="Homams & Havan">Homams & Havan</option>
                        <option value="Astrology">Astrology</option>
                        <option value="Wedding & Marriages">Wedding & Marriages</option>
                        <option value="Daily Poojas">Daily Poojas</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#444' }}>Experience *</label>
                      <select className="login-input" style={{ width: '100%', padding: '10px 14px' }} value={newPanditExp} onChange={e => setNewPanditExp(e.target.value)}>
                        <option value="0-2 Years">0-2 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5-10 Years">5-10 Years</option>
                        <option value="10+ Years">10+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '12px' }}>
                    {editingPanditId && (
                      <button className="btn-secondary" style={{ padding: '12px 24px', borderRadius: '8px', fontSize: '15px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }} onClick={() => {
                        setEditingPanditId(null);
                        setNewPanditName(''); setNewPanditSpec('Vedic Rituals'); setNewPanditExp('0-2 Years'); setNewPanditImg('');
                      }}>Cancel</button>
                    )}
                    <button className="btn-primary" style={{ padding: '12px 32px', borderRadius: '8px', fontSize: '15px' }} onClick={() => {
                      if (newPanditName && newPanditSpec && newPanditExp) {
                        if (editingPanditId) {
                          updatePandit(editingPanditId, { name: newPanditName, specialization: newPanditSpec, experience: newPanditExp, img: newPanditImg || null });
                          setEditingPanditId(null);
                        } else {
                          addPandit({ name: newPanditName, specialization: newPanditSpec, experience: newPanditExp, status: 'Approved', img: newPanditImg || null });
                        }
                        setNewPanditName(''); setNewPanditSpec('Vedic Rituals'); setNewPanditExp('0-2 Years'); setNewPanditImg('');
                      }
                    }}>{editingPanditId ? 'Update Pandit' : 'Register Pandit'}</button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Registered Pandits</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>Experience</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pandits.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{p.id}</td>
                          <td style={{ fontWeight: '500' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={p.img || '/assets/avatar_placeholder.png'} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #eee' }} onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Pandit" }} />
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ color: '#E04E15', fontWeight: '500' }}>{p.specialization}</td>
                          <td>{p.experience}</td>
                          <td>
                            <span className={`pill ${p.status === 'Approved' ? 'pill-green-bg' : 'pill-orange-bg'}`}>
                              {p.status || 'Pending'}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => {
                              setEditingPanditId(p.id);
                              setNewPanditName(p.name);
                              setNewPanditSpec(p.specialization);
                              setNewPanditExp(p.experience);
                              setNewPanditImg(p.img && p.img !== '/assets/avatar_placeholder.png' ? p.img : '');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} style={{ color: '#1890ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '16px' }}>Edit</button>
                            <button onClick={() => setViewingSchedulePandit(p)} style={{ color: '#722ed1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '16px' }}>View Schedule</button>
                            {(p.status === 'Pending' || !p.status) && (
                              <button onClick={() => approvePandit(p.id)} style={{ color: '#52C41A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '16px' }}>Approve</button>
                            )}
                            <button onClick={() => deletePandit(p.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Homams' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Homams</h1>
                <p>Add or remove homam services from the frontend website.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Add New Homam</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                      {newHomamImg ? (
                        <>
                          <img src={newHomamImg} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #ddd' }} />
                          <button onClick={() => setNewHomamImg('')} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '16px', height: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', padding: 0 }} title="Remove photo">&times;</button>
                        </>
                      ) : (
                        <label htmlFor="homamPhotoUpload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', border: '1px dashed #ccc', borderRadius: '8px', cursor: 'pointer', background: '#fafafa', color: '#888', fontSize: '10px' }} title="Upload Photo">
                          +Img
                          <input id="homamPhotoUpload" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
                            if (e.target.files && e.target.files[0]) resizeImage(e.target.files[0], setNewHomamImg);
                          }} />
                        </label>
                      )}
                    </div>
                    <input type="text" placeholder="Homam Name" className="login-input" style={{ flex: '1 1 150px' }} id="newHomamName" />
                    <input type="text" placeholder="Short Description" className="login-input" style={{ flex: '2 1 200px' }} id="newHomamDesc" maxLength="100" />
                    <input type="number" placeholder="Original Price" className="login-input" style={{ flex: '1 1 100px' }} id="newHomamPrice" />
                    <input type="number" placeholder="Discount Price" className="login-input" style={{ flex: '1 1 100px' }} id="newHomamDiscountPrice" />
                    <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px', height: '40px' }} onClick={() => {
                      const name = document.getElementById('newHomamName').value;
                      const desc = document.getElementById('newHomamDesc').value;
                      const price = document.getElementById('newHomamPrice').value;
                      const discountPrice = document.getElementById('newHomamDiscountPrice').value;
                      if (name && desc) {
                        const homamData = { name, desc, img: newHomamImg || null, price: price || null, discountPrice: discountPrice || null };
                        if (editingHomamId) {
                          updateHomam(editingHomamId, homamData);
                          setEditingHomamId(null);
                        } else {
                          addHomam(homamData);
                        }
                        document.getElementById('newHomamName').value = '';
                        document.getElementById('newHomamDesc').value = '';
                        document.getElementById('newHomamPrice').value = '';
                        document.getElementById('newHomamDiscountPrice').value = '';
                        setNewHomamImg('');
                      }
                    }}>{editingHomamId ? 'Update Homam' : 'Add Homam'}</button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Homams on Website</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {homams.map(h => (
                        <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{h.id}</td>
                          <td style={{ fontWeight: '500' }}>{h.name}</td>
                          <td style={{ fontSize: '13px', color: '#666' }}>{h.desc}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => {
                              setEditingHomamId(h.id);
                              document.getElementById('newHomamName').value = h.name;
                              document.getElementById('newHomamDesc').value = h.desc;
                              document.getElementById('newHomamPrice').value = h.price || '';
                              document.getElementById('newHomamDiscountPrice').value = h.discountPrice || '';
                              setNewHomamImg(h.img || '');
                            }} style={{ color: '#1890FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '16px' }}>Edit</button>
                            <button onClick={() => deleteHomam(h.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {(activeMenu === 'Orders' || activeMenu === 'Bookings') && (
            <>
              <div className="section-header">
                <div>
                  <h2 className="section-title" style={{ fontFamily: 'var(--font-sans)', fontSize: 24, marginBottom: 8 }}>
                    {activeMenu === 'Bookings' ? 'Bookings Management' : 'Order Management'}
                  </h2>
                  <p style={{ color: '#888', margin: 0, fontSize: 14 }}>
                    {activeMenu === 'Bookings' ? 'View and manage pandit and pooja bookings.' : 'View and manage all customer orders and pandit bookings.'}
                  </p>
                </div>
              </div>

              {!selectedOrder && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
                  padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end'
                }}>
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Start Date</label>
                    <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ flex: '1 1 150px' }}>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>End Date</label>
                    <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  </div>
                  <div style={{ flex: '1 1 150px' }}>
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
                  <div style={{ flex: '1 1 150px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                        ← Back
                      </button>
                      Order #{selectedOrder.id}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>Status:</span>
                      <select
                        value={selectedOrder.status || 'Confirmed'}
                        onChange={(e) => {
                          updateOrder(selectedOrder.id, { status: e.target.value });
                          setSelectedOrder({ ...selectedOrder, status: e.target.value });
                        }}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none', background: '#fff' }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 60%' }}>
                      <h4 style={{ marginBottom: '16px', color: '#333' }}>Items in Order</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
                            <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {item.image ? (
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Box size={24} color="#ccc" />
                              )}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '500', color: '#333' }}>{item.name}</div>
                              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {item.type === 'pooja' ? 'Pandit Booking' : item.type === 'product' ? 'Product' : 'Item'}
                                {item.variant && ` • ${item.variant}`}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: '600' }}>₹{item.price}</div>
                              <div style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ flex: '1 1 30%', background: '#f9f9f9', padding: '24px', borderRadius: '12px', height: 'fit-content' }}>
                      <h4 style={{ margin: '0 0 16px 0', color: '#333' }}>Order Summary</h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666', fontSize: '14px' }}>
                        <span>Date</span>
                        <span>{new Date(selectedOrder.date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: '#666', fontSize: '14px' }}>
                        <span>Customer ID</span>
                        <span>{selectedOrder.customerid || 'Guest'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee', fontWeight: '600', color: '#333' }}>
                        <span>Total Amount</span>
                        <span style={{ color: '#E95221' }}>₹{selectedOrder.totalAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let displayOrders = activeMenu === 'Bookings'
                          ? orders.filter(o => o.items.some(i => i.type === 'pooja' || i.type === 'pandit' || i.categoryid === 2))
                          : orders;

                        if (filterStartDate) displayOrders = displayOrders.filter(o => new Date(o.date) >= new Date(filterStartDate));
                        if (filterEndDate) {
                          const end = new Date(filterEndDate);
                          end.setHours(23, 59, 59, 999);
                          displayOrders = displayOrders.filter(o => new Date(o.date) <= end);
                        }
                        if (filterStatus !== 'All') displayOrders = displayOrders.filter(o => (o.status || 'Confirmed') === filterStatus);
                        if (filterPayment !== 'All') displayOrders = displayOrders.filter(o => (o.paymentMethod || 'Credit Card') === filterPayment);


                        return displayOrders.length === 0 ? (
                          <tr><td colSpan="7" style={{ textAlign: 'center', padding: '48px', color: '#999', fontStyle: 'italic' }}>No {activeMenu.toLowerCase()} found.</td></tr>
                        ) : (
                          displayOrders.map(order => {
                            const statusClass = order.status === 'Delivered' ? 'delivered' : order.status === 'Cancelled' ? 'cancelled' : 'confirmed';
                            return (
                              <tr key={order.id}>
                                <td><strong>#{order.id}</strong></td>
                                <td>{new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                <td>{order.customerid ? `Customer #${order.customerid.toString().slice(0, 4)}` : 'Guest User'}</td>
                                <td>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ background: '#f5f5f5', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: '#666', width: 'fit-content' }}>
                                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </span>
                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '4px' }}>
                                      {Array.from(new Set(order.items.map(i => {
                                        if (i.type === 'pooja') return 'Pooja';
                                        if (i.type === 'pandit') return 'Pandit';
                                        if (i.type === 'homam' || (i.name && i.name.toLowerCase().includes('homam'))) return 'Homam';
                                        return 'Product';
                                      }))).map((type, idx) => (
                                        <span key={idx} style={{ 
                                          fontSize: '10px', 
                                          padding: '2px 6px', 
                                          borderRadius: '4px', 
                                          background: type === 'Product' ? '#f6ffed' : '#e6f7ff', 
                                          color: type === 'Product' ? '#52c41a' : '#1890ff',
                                          border: `1px solid ${type === 'Product' ? '#b7eb8f' : '#91d5ff'}`
                                        }}>
                                          {type}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                                <td style={{ fontWeight: 700, color: '#111' }}>₹{order.totalAmount}</td>
                                <td>
                                  <span className={`status-badge ${statusClass}`}>
                                    {order.status || 'Confirmed'}
                                  </span>
                                </td>
                                <td>
                                  <button className="btn-outline-action" onClick={() => setSelectedOrder(order)}>
                                    View Details
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
                            desc: newProductDesc,
                            price: newProductVariants.length > 0 ? newProductVariants[0].price : Number(newProductPrice),
                            oldPrice: newProductOldPrice ? Number(newProductOldPrice) : null,
                            variants: newProductVariants.length > 0 ? newProductVariants : undefined,
                            categoryid: newProductCategory,
                            rating: 5,
                            reviews: 0,
                            image: newProductImages.length > 0 ? newProductImages[0] : '/assets/product_pooja_kit.png',
                            images: newProductImages,
                            badge: editingProductId ? undefined : { text: 'New Arrival', type: 'new' }
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

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
                    {/* Left Column - Main Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      <div className="dash-card">
                        <h4 style={{ marginBottom: '16px', color: '#333' }}>General Information</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Product Title</label>
                            <input type="text" placeholder="e.g., Premium Pooja Thali Set" className="login-input" style={{ width: '100%' }} value={newProductName} onChange={e => setNewProductName(e.target.value)} />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Description</label>
                            <textarea placeholder="Provide detailed information about the product..." className="login-input" style={{ width: '100%', minHeight: '120px', resize: 'vertical', padding: '12px', fontFamily: 'inherit' }} value={newProductDesc} onChange={e => setNewProductDesc(e.target.value)} maxLength="1000" />
                          </div>
                        </div>
                      </div>

                      <div className="dash-card">
                        <h4 style={{ marginBottom: '16px', color: '#333' }}>Media (Up to 6 images)</h4>
                        
                        <div style={{ padding: '24px', border: '2px dashed #ddd', borderRadius: '12px', background: '#fafafa', textAlign: 'center', marginBottom: '16px' }}>
                          <input id="image-upload-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={newProductImages.length >= 6} />
                          <label htmlFor="image-upload-input" style={{ cursor: newProductImages.length >= 6 ? 'not-allowed' : 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <BoxSelect size={24} />
                            </div>
                            <div>
                              <span style={{ fontWeight: '600', color: '#4f46e5' }}>Click to upload</span> or drag and drop
                              <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>SVG, PNG, JPG or GIF (max. 800x400px)</div>
                            </div>
                          </label>
                          {selectedImageFile && (
                            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '13px', color: '#555', fontWeight: '500' }}>{selectedImageFile.name} ({(selectedImageFile.size / 1024).toFixed(1)} KB)</span>
                              <button className="btn-secondary" style={{ padding: '6px 16px', borderRadius: '8px' }} onClick={handleAddImage} disabled={!selectedImageFile || newProductImages.length >= 6}>Add Image</button>
                            </div>
                          )}
                        </div>

                        {newProductImages.length > 0 && (
                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            {newProductImages.map((img, i) => (
                              <div key={i} style={{ position: 'relative', width: '80px', height: '80px', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button onClick={() => setNewProductImages(newProductImages.filter((_, idx) => idx !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.9)', color: '#d32f2f', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}><Trash2 size={12} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="dash-card">
                        <h4 style={{ marginBottom: '16px', color: '#333' }}>Variants (Sizes / Weights)</h4>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '16px' }}>
                          <div style={{ flex: '1 1 100px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>Unit</label>
                            <select className="login-input" style={{ width: '100%' }} value={currentVariantUnit} onChange={e => setCurrentVariantUnit(e.target.value)}>
                              <option value="gm">gm</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value=" Liter">Liter</option>
                              <option value=" Pcs">Pcs</option>
                            </select>
                          </div>
                          <div style={{ flex: '2 1 150px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>Value</label>
                            <input type="number" placeholder="e.g. 50" className="login-input" style={{ width: '100%' }} value={currentVariantValue} onChange={e => setCurrentVariantValue(e.target.value)} />
                          </div>
                          <div style={{ flex: '2 1 150px' }}>
                            <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '6px' }}>Price (₹)</label>
                            <input type="number" placeholder="e.g. 199" className="login-input" style={{ width: '100%' }} value={currentVariantPrice} onChange={e => setCurrentVariantPrice(e.target.value)} />
                          </div>
                          <div style={{ flex: '0 0 auto' }}>
                            <button className="btn-secondary" style={{ padding: '0 20px', height: '42px', borderRadius: '8px' }} onClick={handleAddVariant}>Add</button>
                          </div>
                        </div>

                        {newProductVariants.length > 0 && (
                          <div className="admin-table-wrapper" style={{ margin: 0, boxShadow: 'none', border: '1px solid #eee' }}>
                            <table className="admin-table" style={{ fontSize: '13px' }}>
                              <thead>
                                <tr>
                                  <th style={{ padding: '12px' }}>Variant</th>
                                  <th style={{ padding: '12px' }}>Price</th>
                                  <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {newProductVariants.map((v, i) => (
                                  <tr key={i}>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{v.attribute}</td>
                                    <td style={{ padding: '12px', color: '#E85C0D', fontWeight: 'bold' }}>₹{v.price}</td>
                                    <td style={{ padding: '12px', textAlign: 'right' }}>
                                      <button onClick={() => setNewProductVariants(newProductVariants.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', padding: 0 }}><Trash2 size={16} /></button>
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
                        <h4 style={{ marginBottom: '16px', color: '#333' }}>Pricing</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Base Price (₹)</label>
                            <input type="number" placeholder="0.00" className="login-input" style={{ width: '100%', fontSize: '16px' }} value={newProductPrice} onChange={e => setNewProductPrice(e.target.value)} />
                            <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>Leave blank if variants dictate the price.</p>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Compare-at Price (₹)</label>
                            <input type="number" placeholder="0.00" className="login-input" style={{ width: '100%' }} value={newProductOldPrice} onChange={e => setNewProductOldPrice(e.target.value)} />
                            <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>To show a reduced price, enter a value higher than base price.</p>
                          </div>
                        </div>
                      </div>

                      <div className="dash-card">
                        <h4 style={{ marginBottom: '16px', color: '#333' }}>Organization</h4>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', color: '#666', marginBottom: '6px', fontWeight: 'bold' }}>Category</label>
                          <select className="login-input" style={{ width: '100%' }} value={newProductCategory} onChange={e => setNewProductCategory(Number(e.target.value))}>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Products</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{p.id}</td>
                          <td style={{ fontWeight: '500' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <img src={p.image} alt={p.name} style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} />
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td style={{ color: '#666' }}>{categories.find(c => c.id === p.categoryid)?.name || 'Unknown'}</td>
                          <td style={{ color: '#1A1A1A', fontWeight: '500' }}>₹{p.price}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => handleEditProduct(p)} style={{ color: '#1890ff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '12px' }}>Edit</button>
                            <button onClick={() => deleteProduct(p.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Categories' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Manage Categories</h1>
                <p>Add or remove product categories.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Add New Category</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="text" placeholder="Category Name" className="login-input" style={{ width: '30%' }} value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                    <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px' }} onClick={() => {
                      if (newCategoryName) {
                        addCategory({
                          name: newCategoryName,
                          iconname: 'Box', // default
                          image: '/assets/product_pooja_kit.png' // default
                        });
                        setNewCategoryName('');
                      }
                    }}>Add Category</button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Categories</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Name</th>
                        <th style={{ textAlign: 'right', paddingRight: '12px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{c.id}</td>
                          <td style={{ fontWeight: '500' }}>{c.name}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => deleteCategory(c.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Settings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Settings</h1>
                <p>Configure platform settings and integrations.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px', maxWidth: '800px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Payment Gateway Configuration</h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>Set up your payment provider API keys to accept online payments.</p>
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

                {/* Admin Users Management */}
                <div className="metric-card" style={{ display: 'block', padding: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#1A1A1A', marginBottom: '4px' }}>Admin Users</h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>Create and manage dashboard access for your staff.</p>
                    </div>
                    <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '8px', color: '#FA8C16' }}>
                      <Key size={24} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h4 style={{ marginBottom: '12px', color: '#333' }}>Add New Admin</h4>
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
                      <h4 style={{ marginBottom: '12px', color: '#333' }}>Active Admins</h4>
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
                                {admin.id === 1 && <span style={{ marginLeft: '8px', fontSize: '11px', background: '#e6f7ff', color: '#1890ff', padding: '2px 8px', borderRadius: '12px' }}>Primary</span>}
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
            </div>
          )}

          {activeMenu === 'Bookings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Pandit Bookings</h1>
                <p>Track all scheduled appointments and assigned Pandits.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="admin-table-wrapper" style={{ margin: 0 }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Service</th>
                        <th>Pandit</th>
                        <th>Date & Time</th>
                        <th>Customer</th>
                        <th style={{ textAlign: 'right' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        let filteredPanditOrders = orders.filter(o => o.items.some(i => i.pandit));
                        if (filterStartDate) filteredPanditOrders = filteredPanditOrders.filter(o => new Date(o.date) >= new Date(filterStartDate));
                        if (filterEndDate) {
                          const end = new Date(filterEndDate);
                          end.setHours(23, 59, 59, 999);
                          filteredPanditOrders = filteredPanditOrders.filter(o => new Date(o.date) <= end);
                        }
                        if (filterStatus !== 'All') filteredPanditOrders = filteredPanditOrders.filter(o => (o.status || 'Confirmed') === filterStatus);
                        if (filterPayment !== 'All') filteredPanditOrders = filteredPanditOrders.filter(o => (o.paymentMethod || 'Credit Card') === filterPayment);

                        return filteredPanditOrders.length > 0 ? (
                          filteredPanditOrders.flatMap(order => 
                            order.items.filter(item => item.pandit).map((item, idx) => (
                            <tr key={`${order.id}-${idx}`}>
                              <td><strong>#{order.id}</strong></td>
                              <td style={{ fontWeight: '600', color: '#111' }}>{item.name}</td>
                              <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffedd5', color: '#E85C0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                    {item.pandit.name.charAt(0)}
                                  </div>
                                  <span style={{ fontWeight: '500' }}>{item.pandit.name}</span>
                                </div>
                              </td>
                              <td>
                                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500'}}><Calendar size={14} color="#E85C0D"/> {item.date || order.date.split('T')[0]}</span><br/>
                                <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#888', marginTop: '4px'}}><Clock size={14}/> {item.time || 'TBD'}</span>
                              </td>
                              <td>{order.shippingDetails?.fullName || 'Guest'}</td>
                              <td style={{ textAlign: 'right' }}>
                                <span className="status-badge confirmed">
                                  {order.status || 'Confirmed'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '48px', color: '#999', fontStyle: 'italic' }}>No Pandit bookings found for selected filters.</td>
                        </tr>
                      );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Reports' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Customer List (Reports)</h1>
                <p>View all registered customers and their details.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Registered Customers</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>Customer ID</th>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>{c.id}</td>
                          <td style={{ fontWeight: '500' }}>{c.name}</td>
                          <td>{c.email}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No customers found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Coupons' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Coupons Management</h1>
                <p>Create and manage discount coupons for your store.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Create New Coupon</h3>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Coupon Code (e.g., DIWALI20)" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} />
                    <input type="number" placeholder="Discount Percentage (%)" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponDiscount} onChange={e => setNewCouponDiscount(e.target.value)} />
                    <input type="date" className="login-input" style={{ flex: '1 1 200px' }} value={newCouponExpiry} onChange={e => setNewCouponExpiry(e.target.value)} />
                    <button className="btn-primary" style={{ padding: '0 24px', borderRadius: '8px' }} onClick={() => {
                      if (newCouponCode && newCouponDiscount && newCouponExpiry) {
                        addCoupon({ code: newCouponCode.toUpperCase(), discount: Number(newCouponDiscount), expiry: newCouponExpiry });
                        setNewCouponCode('');
                        setNewCouponDiscount('');
                        setNewCouponExpiry('');
                      }
                    }}>
                      Add Coupon
                    </button>
                  </div>
                </div>

                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Active Coupons</h3>
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
                          <td style={{ color: '#E04E15', fontWeight: '500' }}>{coupon.discount}% Off</td>
                          <td>{coupon.expiry}</td>
                          <td style={{ textAlign: 'right', paddingRight: '12px' }}>
                            <button onClick={() => deleteCoupon(coupon.id)} style={{ color: '#E04E15', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No active coupons.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Settings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Admin Settings & Profile</h1>
                <p>Manage your account settings and platform configuration.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                
                {/* Profile Edit Section */}
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserSquare2 size={20} /> My Profile
                  </h3>
                  
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f5f5f5', overflow: 'hidden', border: '1px solid #eee' }}>
                      <img src={currentAdminUser?.avatar || "/assets/pandit_icon_1782464629488.png"} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Full Name</label>
                        <input type="text" className="login-input" defaultValue={currentAdminUser?.name || 'Vamsi Pallela'} id="adminNameInput" />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Login Username</label>
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

                {/* Password Reset Section */}
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Key size={20} /> Change Password
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#666' }}>Current Password</label>
                      <input type="password" className="login-input" id="adminOldPassword" />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '500', color: '#666' }}>New Password</label>
                      <input type="password" className="login-input" id="adminNewPassword" />
                    </div>

                    <div>
                      <button className="btn-secondary" style={{ padding: '10px 24px', borderRadius: '8px' }} onClick={() => {
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
            </div>
          )}

          {activeMenu === 'Customers' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>Customers Management</h1>
                <p>View and manage registered customers on the platform.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Registered Customers</h3>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #eee', color: '#888' }}>
                        <th style={{ padding: '12px' }}>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px', color: '#888' }}>#{c.id}</td>
                          <td style={{ fontWeight: '500' }}>{c.name}</td>
                          <td style={{ color: '#666' }}>{c.email}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: '#888' }}>No customers found.</td>
                        </tr>
                      )}
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

          {activeMenu === 'App Settings' && (
            <div>
              <div className="welcome-text" style={{ marginBottom: '24px' }}>
                <h1>App Settings</h1>
                <p>Configure global application settings and homepage banners.</p>
              </div>

              <div className="metrics-grid" style={{ gridTemplateColumns: '1fr', gap: '24px' }}>
                <div className="metric-card" style={{ display: 'block', padding: '24px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Homepage Banner Slider</h3>
                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Upload up to 3 banners to display on the public homepage. (Mock functionality - saved locally to browser).</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {[1, 2, 3].map(num => (
                      <div key={num} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ margin: 0 }}>Banner {num}</h4>
                        <div style={{ width: '100%', aspectRatio: '16/5', background: '#f9f9f9', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', position: 'relative' }}>
                          <img id={`banner-preview-${num}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'none' }} />
                          <span id={`banner-placeholder-${num}`} style={{ color: '#888', fontSize: '14px' }}>Upload Image</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            
                            // Show preview
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              document.getElementById(`banner-preview-${num}`).src = ev.target.result;
                              document.getElementById(`banner-preview-${num}`).style.display = 'block';
                              document.getElementById(`banner-placeholder-${num}`).style.display = 'none';
                            };
                            reader.readAsDataURL(file);

                            // Mock Upload
                            alert(`Banner ${num} uploaded successfully (Mock)!`);
                          }}
                          style={{ fontSize: '14px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu !== 'Dashboard' && activeMenu !== 'Bookings' && activeMenu !== 'Orders' && activeMenu !== 'Poojas' && activeMenu !== 'Pandits' && activeMenu !== 'Homams' && activeMenu !== 'Products' && activeMenu !== 'Categories' && activeMenu !== 'Settings' && activeMenu !== 'Reports' && activeMenu !== 'Coupons' && activeMenu !== 'Customers' && activeMenu !== 'Analytics' && activeMenu !== 'App Settings' && (
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Schedule: {viewingSchedulePandit.name}</h2>
              <button onClick={() => setViewingSchedulePandit(null)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
            </div>
            
            <div style={{ padding: '20px' }}>
              <AvailabilityCalendar 
                workingDays={viewingSchedulePandit.availability?.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
                addedDates={viewingSchedulePandit.availability?.addedDates || []}
                workHours={viewingSchedulePandit.availability?.workHours || {from: '08:00', to: '18:00'}}
                bookings={orders.flatMap(o => o.items.filter(i => i.pandit?.id === viewingSchedulePandit.id).map(i => ({ date: i.date || o.date.split('T')[0], time: i.time, service: i })))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
