import React, { createContext, useState, useEffect } from 'react';

const iconPooja = '/assets/pooja_icon_1782464580440.png';
const iconHomam = '/assets/homam_icon_1782464611688.png';
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [poojas, setPoojas] = useState([]);
  const [homams, setHomams] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState({ provider: 'Razorpay', apiKey: '', apiSecret: '', mode: 'test' });
  const [adminUsers, setAdminUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentPandit, setCurrentPandit] = useState(null);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [consultations, setConsultations] = useState([]);

  // Fetch data on mount from Node.js backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poojasRes, homamsRes, panditsRes, catRes, prodRes, custRes, adminRes, coupRes, ordRes, consultRes] = await Promise.all([
          fetch(`${API_URL}/poojas`), fetch(`${API_URL}/homams`), fetch(`${API_URL}/pandits`),
          fetch(`${API_URL}/categories`), fetch(`${API_URL}/products`), fetch(`${API_URL}/customers`),
          fetch(`${API_URL}/admin_users`), fetch(`${API_URL}/coupons`), fetch(`${API_URL}/orders`),
          fetch(`${API_URL}/consultations`)
        ]);
        
        if(poojasRes.ok) setPoojas(await poojasRes.json());
        if(homamsRes.ok) setHomams(await homamsRes.json());
        if(panditsRes.ok) setPandits(await panditsRes.json());
        if(catRes.ok) setCategories(await catRes.json());
        if(prodRes.ok) setProducts(await prodRes.json());
        if(custRes.ok) setCustomers(await custRes.json());
        if(adminRes.ok) setAdminUsers(await adminRes.json());
        if(coupRes.ok) setCoupons(await coupRes.json());
        if(ordRes.ok) setOrders(await ordRes.json());
        if(consultRes.ok) setConsultations(await consultRes.json());
      } catch (err) {
        console.error("Error fetching from API:", err);
      }
      
      const savedCustomer = localStorage.getItem('gs_current_customer');
      if (savedCustomer) setCurrentCustomer(JSON.parse(savedCustomer));
      
      const savedPandit = localStorage.getItem('gs_current_pandit');
      if (savedPandit) setCurrentPandit(JSON.parse(savedPandit));

      const savedAdmin = localStorage.getItem('gs_current_admin');
      if (savedAdmin) setCurrentAdmin(JSON.parse(savedAdmin));
      
      const savedCart = localStorage.getItem('gs_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (currentCustomer) localStorage.setItem('gs_current_customer', JSON.stringify(currentCustomer));
    else localStorage.removeItem('gs_current_customer');
  }, [currentCustomer]);

  useEffect(() => {
    if (currentPandit) localStorage.setItem('gs_current_pandit', JSON.stringify(currentPandit));
    else localStorage.removeItem('gs_current_pandit');
  }, [currentPandit]);

  useEffect(() => {
    if (currentAdmin) localStorage.setItem('gs_current_admin', JSON.stringify(currentAdmin));
    else localStorage.removeItem('gs_current_admin');
  }, [currentAdmin]);

  useEffect(() => {
    localStorage.setItem('gs_cart', JSON.stringify(cart));
  }, [cart]);

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
    const res = await fetch(`${API_URL}/pandits`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({...newPandit, rating: '5.0', reviews: '0', status: newPandit.status || 'Approved'}) });
    if(res.ok) { const data = await res.json(); setPandits([...pandits, data]); }
  };

  const approvePandit = async (id) => {
    const res = await fetch(`${API_URL}/pandits/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: 'Approved'}) });
    if(res.ok) { const data = await res.json(); setPandits(pandits.map(p => p.id === id ? data : p)); }
  };

  const updatePandit = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/pandits/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { 
        const data = await res.json(); 
        setPandits(pandits.map(p => p.id === id ? data : p)); 
        if (currentPandit && currentPandit.id === id) setCurrentPandit(data);
    }
  };

  const deletePandit = async (id) => {
    await fetch(`${API_URL}/pandits/${id}`, { method: 'DELETE' });
    setPandits(pandits.filter(p => p.id !== id));
  };

  const addCategory = async (newCategory) => {
    const res = await fetch(`${API_URL}/categories`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newCategory) });
    if(res.ok) { const data = await res.json(); setCategories([...categories, data]); }
  };

  const deleteCategory = async (id) => {
    await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
    setCategories(categories.filter(c => c.id !== id));
  };

  const addProduct = async (newProduct) => {
    const res = await fetch(`${API_URL}/products`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newProduct) });
    if(res.ok) { const data = await res.json(); setProducts([...products, data]); }
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = async (id, updatedData) => {
    const res = await fetch(`${API_URL}/products/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updatedData) });
    if(res.ok) { const data = await res.json(); setProducts(products.map(p => p.id === id ? data : p)); }
  };

  const updatePaymentSettings = (newSettings) => {
    setPaymentSettings({ ...paymentSettings, ...newSettings });
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
    const res = await fetch(`${API_URL}/pandits/register`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newPandit) });
    const data = await res.json();
    if(data.success) {
      setPandits([...pandits, data.user]);
      setCurrentPandit(data.user);
      return { success: true };
    }
    return { success: false, message: data.message };
  };
  
  const unifiedLogin = async (loginId, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({loginId, password}) });
      if (res.ok) {
          const data = await res.json();
          if (data.type === 'customer') setCurrentCustomer(data.user);
          if (data.type === 'pandit') setCurrentPandit(data.user);
          if (data.type === 'admin') setCurrentAdmin(data.user);
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
    setCurrentCustomer(specialCustomer);
  };

  const logout = async () => {
    setCurrentCustomer(null);
    setCurrentPandit(null);
    setCurrentAdmin(null);
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
  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() + Math.random() }]);
  };
  
  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };
  
  const clearCart = () => setCart([]);
  
  const placeOrder = async (orderData) => {
    const orderRecord = {
      customerid: currentCustomer ? currentCustomer.id : null,
      status: 'Confirmed',
      items: cart,
      ...orderData
    };
    const res = await fetch(`${API_URL}/orders`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(orderRecord) });
    if (res.ok) {
        const data = await res.json();
        setOrders([data, ...orders]);
        clearCart();
        return data;
    }
    return null;
  };

  const updateOrder = async (orderId, updates) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(updates) });
    if(res.ok) { const data = await res.json(); setOrders(orders.map(order => order.id === orderId ? data : order)); }
  };

  const addCoupon = async (coupon) => {
    const res = await fetch(`${API_URL}/coupons`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(coupon) });
    if(res.ok) { const data = await res.json(); setCoupons([data, ...coupons]); }
  };

  const deleteCoupon = async (couponId) => {
    await fetch(`${API_URL}/coupons/${couponId}`, { method: 'DELETE' });
    setCoupons(coupons.filter(c => c.id !== couponId));
  };

  return (
    <DataContext.Provider value={{
      poojas, addPooja, deletePooja, updatePooja,
      homams, addHomam, deleteHomam, updateHomam,
      pandits, addPandit, approvePandit, updatePandit, deletePandit, registerPandit, currentPandit, setCurrentPandit,
      categories, addCategory, deleteCategory,
      products, addProduct, deleteProduct, updateProduct,
      paymentSettings, updatePaymentSettings,
      adminUsers, addAdminUser, deleteAdminUser, updateAdminUser, currentAdmin, setCurrentAdmin,
      customers, registerCustomer, updateCustomer, currentCustomer, setCurrentCustomer,
      cart, orders, unifiedLogin, loginWithGoogle, logout,
      addToCart, removeFromCart, clearCart, placeOrder, updateOrder,
      coupons, addCoupon, deleteCoupon, appliedCoupon, setAppliedCoupon,
      consultations, setConsultations: customSetConsultations, updateConsultation
    }}>
      {children}
    </DataContext.Provider>
  );
};
