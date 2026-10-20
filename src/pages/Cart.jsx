import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, 
  Truck, CheckCircle2
} from 'lucide-react';
import '../App.css';

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    coupons, 
    appliedCoupon, 
    setAppliedCoupon,
    calculateCartTotals,
    validateCoupon 
  } = useContext(DataContext);
  const { t, translateDynamic, isTelugu } = useLanguage();

  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  
  // Authoritative server-calculated totals
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shippingFee: 0,
    freeShippingThreshold: 499,
    totalAmount: 0
  });

  // Calculate totals via server on cart or coupon changes
  useEffect(() => {
    let isMounted = true;
    const fetchTotals = async () => {
      if (cart.length === 0) {
        setCartTotals({ subtotal: 0, discount: 0, tax: 0, shippingFee: 0, totalAmount: 0 });
        return;
      }
      try {
        const res = await calculateCartTotals(cart, appliedCoupon?.code);
        if (isMounted && res) {
          setCartTotals(res);
        }
      } catch (err) {
        console.error('Error fetching calculated totals:', err);
      }
    };

    fetchTotals();
    return () => { isMounted = false; };
  }, [cart, appliedCoupon, calculateCartTotals]);

  const handleApplyCoupon = async (codeToApply = couponInput) => {
    setCouponError('');
    setCouponSuccess('');
    
    const code = (codeToApply || '').trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const res = await validateCoupon(code, cartTotals.subtotal);
    if (res && res.valid) {
      setAppliedCoupon(res.data);
      setCouponSuccess(res.message || `Coupon '${res.data.code}' applied successfully!`);
      setCouponInput('');
    } else {
      setCouponError(res.message || 'Invalid or ineligible coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const freeShippingThreshold = cartTotals.freeShippingThreshold || 499;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - (cartTotals.subtotal - cartTotals.discount));

  return (
    <div className="section-padding container-box" style={{ minHeight: '80vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 className="section-title" style={{ margin: 0, fontFamily: 'var(--font-serif)', color: '#2A1C15' }}>
          {isTelugu ? `మీ పవిత్ర కార్ట్ (${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} వస్తువులు)` : `Your Sacred Cart (${cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)`}
        </h1>
        {cart.length > 0 && (
          <button 
            onClick={() => navigate('/shop')}
            style={{ background: 'none', border: 'none', color: '#C53018', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isTelugu ? '+ షాపింగ్ కొనసాగించండి' : '+ Continue Shopping'}
          </button>
        )}
      </div>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #f0e6dd' }}>
          <ShoppingBag size={56} style={{ color: '#E04E15', marginBottom: '16px', opacity: 0.6 }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: '#2A1C15', marginBottom: '8px' }}>
            {isTelugu ? 'మీ కార్ట్ ఖాళీగా ఉంది' : 'Your Cart is Empty'}
          </h2>
          <p style={{ color: '#666', marginBottom: '28px', maxWidth: '420px', margin: '0 auto 28px' }}>
            {isTelugu
              ? 'మీ ఇంటికి పవిత్రత మరియు దైవిక అనుగ్రహాన్ని ఆహ్వానించండి. మా స్వచ్ఛమైన పూజా సామాగ్రి, ఇత్తడి విగ్రహాలు మరియు హవన ద్రవ్యాల సమాహారాన్ని వీక్షించండి.'
              : 'Bring sanctity and divine blessings into your home. Explore our collection of pure pooja samagri, brass idols, and hawan essentials.'}
          </p>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/shop')}
            style={{ padding: '14px 32px', borderRadius: '30px' }}
          >
            {isTelugu ? 'పూజా షాప్‌ను వీక్షించండి' : 'Explore Pooja Store'}
          </button>
        </div>
      ) : (
        <div className="cart-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'start' }}>
          
          {/* Cart Items List */}
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Free shipping progress bar */}
            <div style={{ background: '#FFFDF9', border: '1px solid #f0e6dd', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Truck size={22} color="#C53018" />
              <div style={{ flex: 1 }}>
                {amountToFreeShipping > 0 ? (
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    {isTelugu ? (
                      <>ఉచిత డెలివరీ కోసం ఇంకా <strong>₹{amountToFreeShipping}</strong> విలువైన వస్తువులను జోడించండి!</>
                    ) : (
                      <>Add <strong>₹{amountToFreeShipping}</strong> more to qualify for <strong>FREE Delivery</strong>!</>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={16} /> {isTelugu ? 'మీరు ఉచిత డెలివరీని పొందారు!' : 'You have unlocked FREE Delivery!'}
                  </div>
                )}
                <div style={{ width: '100%', height: '6px', background: '#eee', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${Math.min(100, ((cartTotals.subtotal - cartTotals.discount) / freeShippingThreshold) * 100)}%`, 
                      height: '100%', 
                      background: amountToFreeShipping > 0 ? '#C53018' : '#2e7d32', 
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }} 
                  />
                </div>
              </div>
            </div>

            {cart.map((item) => {
              const itemTotal = (Number(item.price) || 0) * (item.quantity || 1);
              const itemName = translateDynamic(item, 'name');
              return (
                <div 
                  key={item.cartId} 
                  className="card cart-item-card" 
                  style={{ 
                    padding: '18px', 
                    borderRadius: '14px', 
                    border: '1px solid #eee', 
                    display: 'flex', 
                    gap: '16px', 
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div 
                    style={{ 
                      width: '90px', 
                      height: '90px', 
                      background: '#FFFDF9', 
                      borderRadius: '10px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      overflow: 'hidden', 
                      flexShrink: 0,
                      border: '1px solid #f0e6dd'
                    }}
                  >
                    <img 
                      src={item.image || item.img || '/assets/product_pooja_kit.png'} 
                      alt={itemName} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                      onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
                    />
                  </div>

                  <div className="cart-item-details" style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#2A1C15', fontWeight: 600 }}>
                      {itemName}
                    </h3>

                    {item.variant && (
                      <div style={{ display: 'inline-block', background: '#FFF5F0', color: '#C53018', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px', marginBottom: '8px' }}>
                        {isTelugu ? `రకం: ${item.variant}` : `Variant: ${item.variant}`}
                      </div>
                    )}

                    {item.pandit && (
                      <div style={{ color: '#E95221', fontSize: '13px', marginTop: '2px' }}>
                        {isTelugu ? `కేటాయించిన పండితులు: ${item.pandit.name} (${item.date || 'నిర్ణయించబడింది'})` : `Assigned Pandit: ${item.pandit.name} (${item.date || 'Scheduled'})`}
                      </div>
                    )}

                    <div style={{ fontSize: '14px', color: '#888' }}>
                      {isTelugu ? 'యూనిట్ ధర: ' : 'Unit Price: '}<span style={{ color: '#333', fontWeight: 600 }}>₹{item.price}</span>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, (item.quantity || 1) - 1)}
                          style={{ padding: '6px 12px', border: 'none', background: '#fafafa', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 600, minWidth: '36px', textAlign: 'center' }}>
                          {item.quantity || 1}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, (item.quantity || 1) + 1)}
                          style={{ padding: '6px 12px', border: 'none', background: '#fafafa', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.cartId)} 
                        style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={15} /> {isTelugu ? 'తొలగించు' : 'Remove'}
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: '700', fontSize: '18px', color: '#C53018' }}>
                      ₹{itemTotal}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Cart Summary & Coupon Sidebar */}
          <div className="cart-summary card" style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #f0e6dd', position: 'sticky', top: '90px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#2A1C15' }}>
              {isTelugu ? 'ఆర్డర్ సారాంశం' : 'Order Summary'}
            </h3>

            {/* Coupon Code Input */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
                {isTelugu ? 'కూపన్ కోడ్ ఉందా?' : 'Have a Promo or Divine Coupon?'}
              </label>

              {!appliedCoupon ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder={isTelugu ? 'కోడ్ నమోదు చేయండి (ఉదా: DIVINE10)' : 'Enter Code (e.g. DIVINE10)'} 
                    style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', textTransform: 'uppercase', outline: 'none' }} 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '10px 18px', borderRadius: '8px', fontWeight: 600 }} 
                    onClick={() => handleApplyCoupon()}
                  >
                    {isTelugu ? 'వర్తింపజేయి' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6ffed', border: '1px solid #b7eb8f', padding: '12px 14px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: '#52c41a', fontWeight: 'bold', display: 'block' }}>{appliedCoupon.code}</span>
                    <span style={{ color: '#52c41a', fontSize: '12px' }}>
                      {appliedCoupon.discount_type === 'fixed' ? `₹${appliedCoupon.discount} OFF` : `${appliedCoupon.discount}% OFF`} {isTelugu ? 'వర్తించింది' : 'Applied'}
                    </span>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                  >
                    {isTelugu ? 'తొలగించు' : 'Remove'}
                  </button>
                </div>
              )}

              {couponError && <p style={{ color: '#d32f2f', fontSize: '12px', margin: '8px 0 0 0' }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#2e7d32', fontSize: '12px', margin: '8px 0 0 0' }}>{couponSuccess}</p>}

              {/* Quick coupons pills */}
              {!appliedCoupon && coupons && coupons.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {coupons.slice(0, 3).map(c => (
                    <button 
                      key={c.id || c.code}
                      onClick={() => handleApplyCoupon(c.code)}
                      style={{ background: '#FFF5F0', border: '1px dashed #C53018', color: '#C53018', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Calculations breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'వస్తువుల మొత్తం' : 'Items Subtotal'}</span>
              <span style={{ fontWeight: 600 }}>₹{cartTotals.subtotal}</span>
            </div>

            {cartTotals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
                <span style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={14} /> {isTelugu ? 'కూపన్ తగ్గింపు' : 'Coupon Discount'}
                </span>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>-₹{cartTotals.discount}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'జీఎస్టీ (18% శాస్త్రోక్త ద్రవ్యాలు)' : 'GST (18% Shastra Goods)'}</span>
              <span>₹{cartTotals.tax}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'డెలివరీ రుసుము' : 'Delivery Charges'}</span>
              <span>
                {cartTotals.shippingFee === 0 ? (
                  <span style={{ color: '#2e7d32', fontWeight: 600 }}>{isTelugu ? 'ఉచితం' : 'FREE'}</span>
                ) : (
                  `₹${cartTotals.shippingFee}`
                )}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: 'bold', fontSize: '20px', color: '#2A1C15' }}>
              <span>{isTelugu ? 'మొత్తం చెల్లించవలసినది' : 'Total Payable'}</span>
              <span style={{ color: '#C53018' }}>₹{cartTotals.totalAmount}</span>
            </div>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '16px', borderRadius: '30px', fontSize: '15px', fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} 
              onClick={() => navigate('/checkout')}
            >
              {isTelugu ? 'చెక్‌అవుట్‌కు కొనసాగించండి' : 'Proceed to Checkout'} <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: '#888', fontSize: '12px' }}>
              <ShieldCheck size={16} color="#2e7d32" /> {isTelugu ? '100% సురక్షితమైన చెల్లింపు విధానం' : '100% Safe & Secure Checkout'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
