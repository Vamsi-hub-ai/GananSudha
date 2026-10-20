import React, { createContext, useState, useEffect } from 'react';

const iconPooja = '/assets/pooja_icon_1782464580440.png';
const iconHomam = '/assets/homam_icon_1782464611688.png';
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const DEFAULT_PANDITS = [
  { id: 1, name: 'Vidwan Rama Sharma', specialization: 'Satyanarayana Vratham & Gruhapravesham Specialist', experience: '18+ years', rating: '4.9', reviews: '124', status: 'Approved', gender: 'male', img: '/assets/gruhapravesham_pandit_1782492787455.png', languages: 'Telugu, Sanskrit, Hindi', city: 'Hyderabad, Telangana' },
  { id: 2, name: 'Acharya Venkata Shastry', specialization: 'Homams, Havans & Vedic Vivaham', experience: '22+ years', rating: '5.0', reviews: '98', status: 'Approved', gender: 'male', img: '/assets/homam_specialist_1782492829402.png', languages: 'Telugu, Sanskrit', city: 'Hyderabad, Telangana' },
  { id: 3, name: 'Manju', specialization: 'Devi Poojas, Lalitha Sahasranamam & Chanting', experience: '15+ years', rating: '4.9', reviews: '84', status: 'Approved', gender: 'female', img: '/assets/female_pandit.png', languages: 'Telugu, Sanskrit, Kannada', city: 'Hyderabad, Telangana' },
  { id: 4, name: 'vamsi', specialization: 'Vedic Rituals', experience: '0-2 Years', rating: '5.0', reviews: '12', status: 'Approved', gender: 'male', img: '/assets/male_pandit.png', languages: 'Telugu, English', city: 'Hyderabad, Telangana' }
];

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [poojas, setPoojas] = useState([]);
  const [homams, setHomams] = useState([]);
  const [pandits, setPandits] = useState(DEFAULT_PANDITS);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_payment_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { provider: 'Razorpay', apiKey: 'rzp_test_GS994821', apiSecret: '••••••••••••••••', webhookSecret: '••••••••••••••••', mode: 'test' };
  });
  const [adminUsers, setAdminUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_current_customer');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [currentPandit, setCurrentPandit] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_current_pandit');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [currentAdmin, setCurrentAdmin] = useState(() => {
    try {
      const custSaved = localStorage.getItem('gs_current_customer');
      const panditSaved = localStorage.getItem('gs_current_pandit');
      if (custSaved || panditSaved) {
        localStorage.removeItem('gs_current_admin');
        return null;
      }
      const saved = localStorage.getItem('gs_current_admin');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('gs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Fetch data on mount from Node.js backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poojasRes, homamsRes, panditsRes, catRes, prodRes, custRes, adminRes, coupRes, ordRes, consultRes, bkgRes] = await Promise.all([
          fetch(`${API_URL}/poojas`), fetch(`${API_URL}/homams`), fetch(`${API_URL}/pandits`),
          fetch(`${API_URL}/categories`), fetch(`${API_URL}/products`), fetch(`${API_URL}/customers`),
          fetch(`${API_URL}/admin_users`), fetch(`${API_URL}/coupons`), fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/consultations`), fetch(`${API_URL}/bookings`)
        ]);
        
        if(poojasRes.ok) setPoojas(await poojasRes.json());
        if(homamsRes.ok) setHomams(await homamsRes.json());
        if(panditsRes.ok) {
          const pData = await panditsRes.json();
          setPandits(Array.isArray(pData) && pData.length > 0 ? pData : DEFAULT_PANDITS);
        } else {
          setPandits(DEFAULT_PANDITS);
        }
        if(catRes.ok) {
          const cData = await catRes.json();
          setCategories(Array.isArray(cData) ? cData : (cData.data || []));
        }
        if(prodRes.ok) {
          const pData = await prodRes.json();
          setProducts(Array.isArray(pData) ? pData : (pData.data || []));
        }
        if(custRes.ok) setCustomers(await custRes.json());
        if(adminRes.ok) setAdminUsers(await adminRes.json());
        if(coupRes.ok) setCoupons(await coupRes.json());
        if(ordRes.ok) {
          const oData = await ordRes.json();
          setOrders(Array.isArray(oData) ? oData : (oData.data || []));
        }
        if(consultRes.ok) setConsultations(await consultRes.json());
        if(bkgRes && bkgRes.ok) {
          const bData = await bkgRes.json();
          setBookings(Array.isArray(bData) ? bData : (bData.data || []));
        }
      } catch (err) {
        console.error("Error fetching from API:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('gs_current_customer', JSON.stringify(currentCustomer));
      setCurrentAdmin(null);
      localStorage.removeItem('gs_current_admin');
    } else {
      localStorage.removeItem('gs_current_customer');
    }
  }, [currentCustomer]);

  useEffect(() => {
    if (currentPandit) {
      localStorage.setItem('gs_current_pandit', JSON.stringify(currentPandit));
      setCurrentAdmin(null);
      localStorage.removeItem('gs_current_admin');
    } else {
      localStorage.removeItem('gs_current_pandit');
    }
  }, [currentPandit]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('gs_current_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('gs_current_admin');
    }
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('gs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('gs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Actions
  const addPooja = async (newPooja) => {
    const res = await fetch(`${API_URL}/poojas`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newPooja, img: newPooja.img || iconPooja}) });
    if(res.ok) { const data = await res.json(); setPoojas([...poojas, data]); }
  };

  const updatePooja = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/poojas/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { const data = await res.json(); setPoojas(poojas.map(p => p.id === id ? data : p)); }
  };

  const deletePooja = async (id) => {
    await fetch(`${API_URL}/poojas/${id}`, { method: 'DELETE' });
    setPoojas(poojas.filter(p => p.id !== id));
  };

  const addHomam = async (newHomam) => {
    const res = await fetch(`${API_URL}/homams`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newHomam, img: newHomam.img || iconHomam}) });
    if(res.ok) { const data = await res.json(); setHomams([...homams, data]); }
  };

  const updateHomam = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/homams/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { const data = await res.json(); setHomams(homams.map(h => h.id === id ? data : h)); }
  };

  const deleteHomam = async (id) => {
    await fetch(`${API_URL}/homams/${id}`, { method: 'DELETE' });
    setHomams(homams.filter(h => h.id !== id));
  };
  
  const addPandit = async (newPandit) => {
    try {
      const res = await fetch(`${API_URL}/pandits`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({...newPandit, rating: '5.0', reviews: '0', status: newPandit.status || 'Approved'}) 
      });
      if(res.ok) { 
        const data = await res.json(); 
        setPandits(prev => [...prev, data]); 
        return { success: true, data };
      }
    } catch (err) {
      console.error('Error adding pandit to backend:', err);
    }
    // Optimistic fallback so pandit always appears immediately
    const fallbackPandit = {
      id: Date.now(),
      ...newPandit,
      rating: '5.0',
      reviews: '0',
      status: newPandit.status || 'Approved'
    };
    setPandits(prev => [...prev, fallbackPandit]);
    return { success: true, data: fallbackPandit };
  };

  const approvePandit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/pandits/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'Approved'}) });
      if(res.ok) { const data = await res.json(); setPandits(prev => prev.map(p => p.id === id ? data : p)); return; }
    } catch {}
    setPandits(prev => prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p));
  };

  const updatePandit = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/pandits/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
      if(res.ok) { 
          const data = await res.json(); 
          setPandits(prev => prev.map(p => p.id === id ? data : p)); 
          if (currentPandit && currentPandit.id === id) setCurrentPandit(data);
          return;
      }
    } catch (e) {
      console.warn('Update pandit error:', e);
    }
    setPandits(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
  };

  const deletePandit = async (id) => {
    try {
      await fetch(`${API_URL}/pandits/${id}`, { method: 'DELETE' });
    } catch {}
    setPandits(prev => prev.filter(p => p.id !== id));
  };

  const addCategory = async (newCategory) => {
    const isFormData = newCategory instanceof FormData;
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? newCategory : JSON.stringify(newCategory)
    });
    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;
      setCategories(prev => [...prev, item]);
      return item;
    }
  };

  const updateCategory = async (id, updatedData) => {
    const isFormData = updatedData instanceof FormData;
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? updatedData : JSON.stringify(updatedData)
    });
    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;
      setCategories(prev => prev.map(c => c.id === id ? item : c));
      return item;
    }
  };

  const deleteCategory = async (id) => {
    await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    setCategories(categories.filter(c => c.id !== id));
  };

  const addProduct = async (newProduct) => {
    const isFormData = newProduct instanceof FormData;
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? newProduct : JSON.stringify(newProduct)
    });
    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;
      setProducts(prev => [item, ...prev]);
      return item;
    }
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = async (id, updatedData) => {
    const isFormData = updatedData instanceof FormData;
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: isFormData ? {} : { 'Content-Type': 'application/json' },
      body: isFormData ? updatedData : JSON.stringify(updatedData)
    });
    if (res.ok) {
      const data = await res.json();
      const item = data.data || data;
      setProducts(prev => prev.map(p => p.id === id ? item : p));
      return item;
    }
  };

  const updateProductStock = async (id, newStock, reason) => {
    const res = await fetch(`${API_URL}/products/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: newStock, reason })
    });
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
    }
  };

  const updatePaymentSettings = (newSettings) => {
    setPaymentSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try { localStorage.setItem('gs_payment_settings', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const addAdminUser = async (newUser) => {
    const res = await fetch(`${API_URL}/admin_users`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newUser) });
    if(res.ok) { const data = await res.json(); setAdminUsers([...adminUsers, data]); }
  };

  const deleteAdminUser = async (id) => {
    await fetch(`${API_URL}/admin_users/${id}`, { method: 'DELETE' });
    setAdminUsers(adminUsers.filter(u => u.id !== id));
  };

  const updateAdminUser = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/admin_users/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { const data = await res.json(); setAdminUsers(adminUsers.map(u => u.id === id ? data : u)); }
  };

  // Auth Actions
  const registerCustomer = async (newCustomer) => {
    const res = await fetch(`${API_URL}/customers/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newCustomer) });
    const data = await res.json();
    if(data.success) {
      setCustomers([...customers, data.user]);
      setCurrentAdmin(null);
      setCurrentPandit(null);
      localStorage.removeItem('gs_current_admin');
      localStorage.removeItem('gs_current_pandit');
      setCurrentCustomer(data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const updateCustomer = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/customers/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { 
        const data = await res.json(); 
        setCustomers(customers.map(c => c.id === id ? data : c)); 
        if (currentCustomer && currentCustomer.id === id) setCurrentCustomer(data);
    }
  };

  const registerPandit = async (newPandit) => {
    try {
      const res = await fetch(`${API_URL}/pandits/register`, { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(newPandit) 
      });
      const data = await res.json();
      if (data.success) {
        setPandits(prev => [...prev, data.user]);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      console.error('Error registering pandit:', err);
      return { success: false, message: err.message || 'Server error' };
    }
  };

  const unifiedLogin = async (loginId, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({loginId, password}) });
      if (res.ok) {
          const data = await res.json();
          if (data.type === 'customer') {
            setCurrentAdmin(null);
            setCurrentPandit(null);
            localStorage.removeItem('gs_current_admin');
            localStorage.removeItem('gs_current_pandit');
            setCurrentCustomer(data.user);
          }
          if (data.type === 'pandit') {
            setCurrentCustomer(null);
            setCurrentAdmin(null);
            localStorage.removeItem('gs_current_customer');
            localStorage.removeItem('gs_current_admin');
            setCurrentPandit(data.user);
          }
          if (data.type === 'admin') {
            setCurrentCustomer(null);
            setCurrentPandit(null);
            localStorage.removeItem('gs_current_customer');
            localStorage.removeItem('gs_current_pandit');
            setCurrentAdmin(data.user);
          }
          return data;
      }
    } catch (e) {
      console.error('Login failed', e);
    }
    return null;
  };

  const loginWithGoogle = async () => {
    // Mock login since real OAuth needs backend integration
    const specialCustomer = { id: 'special-google', name: 'Google User', email: 'user@google.com' };
    setCurrentAdmin(null);
    setCurrentPandit(null);
    localStorage.removeItem('gs_current_admin');
    localStorage.removeItem('gs_current_pandit');
    setCurrentCustomer(specialCustomer);
  };

  const logout = async () => {
    setCurrentCustomer(null);
    setCurrentPandit(null);
    setCurrentAdmin(null);
    localStorage.removeItem('gs_current_customer');
    localStorage.removeItem('gs_current_pandit');
    localStorage.removeItem('gs_current_admin');
  };

  const updateConsultation = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/consultations/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) {
        const data = await res.json();
        setConsultations(consultations.map(c => c.id === id ? data : c));
    }
  };
  
  const customSetConsultations = (newArray) => {
      setConsultations(newArray);
  };

  // E-com Actions
  const addToCart = (product, quantity = 1, variant = null) => {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const variantLabel = variant ? (typeof variant === 'object' ? variant.attribute : variant) : null;
    const variantPrice = (variant && typeof variant === 'object' && variant.price !== undefined) 
      ? Number(variant.price) 
      : Number(product.price);

    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        String(item.id) === String(product.id) && 
        (item.variant || null) === (variantLabel || null)
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: (next[existingIdx].quantity || 1) + qty
        };
        return next;
      }

      return [
        ...prev,
        {
          cartId: Date.now() + Math.random(),
          id: product.id,
          name: product.name,
          price: variantPrice,
          oldPrice: product.oldPrice,
          image: product.image || (product.images && product.images[0]) || '/assets/product_pooja_kit.png',
          variant: variantLabel,
          sku: product.sku || null,
          stock: variant?.stock !== undefined ? variant.stock : product.stock,
          quantity: qty,
          categoryid: product.categoryid,
          date: product.date,
          time: product.time,
          pandit: product.pandit,
          desc: product.desc
        }
      ];
    });
  };

  const updateCartQuantity = (cartId, quantity) => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity: qty } : item));
  };
  
  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };
  
  const clearCart = () => setCart([]);

  // Wishlist Functions
  const addToWishlist = (product) => {
    if (!product) return;
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId));
  };

  const toggleWishlist = (product) => {
    if (!product) return;
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId);

  const calculateCartTotals = async (items = cart, couponCode = appliedCoupon?.code) => {
    try {
      const res = await fetch(`${API_URL}/cart/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, couponCode })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.error('Failed to calculate cart totals via API:', e);
    }
    // Safe client-side fallback
    const subtotal = items.reduce((acc, i) => acc + (Number(i.price) || 0) * (i.quantity || 1), 0);
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.discount_type === 'fixed'
        ? Math.min(subtotal, Number(appliedCoupon.discount))
        : Math.round(subtotal * (Number(appliedCoupon.discount) / 100));
    }
    const taxable = Math.max(0, subtotal - discount);
    const tax = Math.round(taxable * 0.18);
    const shippingFee = (subtotal === 0 || taxable >= 499) ? 0 : 50;
    return {
      success: true,
      subtotal,
      discount,
      taxableAmount: taxable,
      tax,
      shippingFee,
      freeShippingThreshold: 499,
      totalAmount: taxable + tax + shippingFee,
      items
    };
  };

  const validateCoupon = async (code, subtotal) => {
    try {
      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });
      return await res.json();
    } catch (e) {
      return { valid: false, message: e.message };
    }
  };
  
  const placeOrder = async (orderData) => {
    const orderRecord = {
      customerid: currentCustomer ? currentCustomer.id : null,
      items: cart,
      couponApplied: appliedCoupon ? appliedCoupon.code : null,
      ...orderData
    };
    const res = await fetch(`${API_URL}/orders`, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(orderRecord) 
    });
    if (res.ok) {
      const data = await res.json();
      const placed = data.data || data;
      setOrders(prev => [placed, ...prev]);
      clearCart();
      setAppliedCoupon(null);
      // Refresh products to show updated stock
      try {
        const prodRes = await fetch(`${API_URL}/products`);
        if (prodRes.ok) {
          const pData = await prodRes.json();
          setProducts(Array.isArray(pData) ? pData : (pData.data || []));
        }
      } catch {}
      return placed;
    }
    const err = await res.json();
    throw new Error(err.message || 'Failed to place order');
  };

  const updateOrder = async (orderId, updates) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`, { 
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(updates) 
    });
    if (res.ok) { 
      const data = await res.json(); 
      setOrders(orders.map(order => order.id === orderId ? data : order)); 
      return data;
    }
  };

  const updateOrderStatus = async (orderId, status, cancelReason = '') => {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, cancelReason })
    });
    if (res.ok) {
      const data = await res.json();
      const updated = data.data || data;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status } : o));
      // If cancelled, refresh stock
      if (status === 'Cancelled') {
        const prodRes = await fetch(`${API_URL}/products`);
        if (prodRes.ok) {
          const pData = await prodRes.json();
          setProducts(Array.isArray(pData) ? pData : (pData.data || []));
        }
      }
      return updated;
    }
  };

  const updateOrderTracking = async (orderId, trackingData) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackingData)
    });
    if (res.ok) {
      const data = await res.json();
      const updated = data.data || data;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...trackingData, status: 'Shipped' } : o));
      return updated;
    }
  };

  const addCoupon = async (coupon) => {
    const res = await fetch(`${API_URL}/coupons`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(coupon) });
    if(res.ok) { const data = await res.json(); setCoupons([data, ...coupons]); }
  };

  const deleteCoupon = async (couponId) => {
    await fetch(`${API_URL}/coupons/${couponId}`, { method: 'DELETE' });
    setCoupons(coupons.filter(c => c.id !== couponId));
  };

  const [reviews, setReviews] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.data || []);
        return data.data || [];
      }
    } catch (e) {
      console.error('Failed to fetch reviews:', e);
    }
  };

  const deleteReview = async (id) => {
    const res = await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard-stats`);
      if (res.ok) {
        const data = await res.json();
        setDashboardStats(data.data || null);
        return data.data || null;
      }
    } catch (e) {
      console.error('Failed to fetch dashboard stats:', e);
    }
  };

  const fetchAdminCustomers = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/customers`);
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.error('Failed to fetch admin customers:', e);
    }
    return [];
  };

  const fetchAdminReports = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/reports`);
      if (res.ok) {
        const data = await res.json();
        return data.data || null;
      }
    } catch (e) {
      console.error('Failed to fetch admin reports:', e);
    }
    return null;
  };

  const fetchBookings = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.customerId) params.append('customerId', filters.customerId);
      if (filters.customerPhone) params.append('customerPhone', filters.customerPhone);
      const url = `${API_URL}/bookings${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : (json.data || []);
        setBookings(list);
        return list;
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
    return [];
  };

  const createBooking = async (bookingData) => {
    try {
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBookings(prev => [data.data, ...prev]);
        fetchDashboardStats();
        return { success: true, booking: data.data };
      }
      return { success: false, message: data.message || 'Booking failed' };
    } catch (err) {
      console.error('Error creating booking:', err);
      return { success: false, message: err.message };
    }
  };

  const updateBooking = async (id, updateData) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setBookings(prev => prev.map(b => (b.id === data.data.id || b.booking_id === data.data.booking_id) ? data.data : b));
        fetchDashboardStats();
        return { success: true, booking: data.data };
      }
      return { success: false, message: data.message || 'Update failed' };
    } catch (err) {
      console.error('Error updating booking:', err);
      return { success: false, message: err.message };
    }
  };

  const deleteBooking = async (id) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id && b.booking_id !== id));
        fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
    }
    return false;
  };

  return (
    <DataContext.Provider value={{
      poojas, addPooja, deletePooja, updatePooja,
      homams, addHomam, deleteHomam, updateHomam,
      pandits, addPandit, approvePandit, updatePandit, deletePandit, registerPandit, currentPandit, setCurrentPandit,
      categories, addCategory, updateCategory, deleteCategory,
      products, addProduct, deleteProduct, updateProduct, updateProductStock,
      paymentSettings, updatePaymentSettings,
      adminUsers, addAdminUser, deleteAdminUser, updateAdminUser, currentAdmin, setCurrentAdmin,
      customers, registerCustomer, updateCustomer, currentCustomer, setCurrentCustomer,
      cart, orders, unifiedLogin, loginWithGoogle, logout,
      addToCart, removeFromCart, clearCart, updateCartQuantity, calculateCartTotals, validateCoupon,
      placeOrder, updateOrder, updateOrderStatus, updateOrderTracking,
      coupons, addCoupon, deleteCoupon, appliedCoupon, setAppliedCoupon,
      wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist,
      consultations, setConsultations: customSetConsultations, updateConsultation,
      reviews, fetchReviews, deleteReview,
      dashboardStats, fetchDashboardStats, fetchAdminCustomers, fetchAdminReports,
      bookings, fetchBookings, createBooking, updateBooking, deleteBooking
    }}>
      {children}
    </DataContext.Provider>
  );
};
