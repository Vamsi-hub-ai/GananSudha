import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CheckCircle, Truck, CreditCard, ArrowRight, AlertCircle, MapPin
} from 'lucide-react';
import '../App.css';

export default function Checkout() {
  const { 
    cart, 
    currentCustomer, 
    placeOrder, 
    appliedCoupon, 
    calculateCartTotals
  } = useContext(DataContext);
  const { t, translateDynamic, isTelugu } = useLanguage();

  const navigate = useNavigate();

  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '',
    notes: ''
  });

  // Server-calculated totals
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    tax: 0,
    shippingFee: 0,
    totalAmount: 0
  });

  useEffect(() => {
    if (currentCustomer) {
      setFormData(prev => ({
        ...prev,
        name: currentCustomer.name || '',
        email: currentCustomer.email || '',
        phone: currentCustomer.phone || ''
      }));
    }
  }, [currentCustomer]);

  useEffect(() => {
    if (cart.length === 0 && !placedOrder) {
      navigate('/cart');
      return;
    }

    const loadTotals = async () => {
      try {
        const res = await calculateCartTotals(cart, appliedCoupon?.code);
        if (res) setTotals(res);
      } catch (err) {
        console.error('Error fetching checkout totals:', err);
      }
    };
    loadTotals();
  }, [cart, appliedCoupon, placedOrder, navigate, calculateCartTotals]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setErrorMsg('');
    setSubmitting(true);

    try {
      const orderPayload = {
        shippingDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        paymentMethod,
        notes: formData.notes
      };

      const result = await placeOrder(orderPayload);
      setPlacedOrder(result);
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please check inventory and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If order successfully confirmed
  if (placedOrder) {
    return (
      <div className="section-padding container-box" style={{ maxWidth: '750px', margin: '40px auto', minHeight: '60vh' }}>
        <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid #f0e6dd', padding: '48px 32px', textAlign: 'center', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F0F9F4', color: '#1B8049', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <CheckCircle size={48} />
          </div>

          <span style={{ color: '#E04E15', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {isTelugu ? 'హర హర మహాదేవ' : 'Har Har Mahadev'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: '#2A1C15', fontSize: '32px', margin: '8px 0 12px 0' }}>
            {isTelugu ? 'ఆర్డర్ విజయవంతంగా నమోదైంది! 🙏' : 'Order Confirmed!'}
          </h1>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '500px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
            {isTelugu ? (
              <>జ్ఞాన సుధలో కొనుగోలు చేసినందుకు ధన్యవాదాలు. మీ పవిత్ర పూజా ద్రవ్యాలు శాస్త్రోక్తంగా సిద్ధం చేయబడుతున్నాయి.</>
            ) : (
              <>Thank you for shopping with <strong>Gnana Sudha</strong>. Your sacred pooja essentials are being prepared according to Shastra guidelines.</>
            )}
          </p>

          <div style={{ background: '#FFFDF9', border: '1px solid #f0e6dd', borderRadius: '16px', padding: '20px', maxWidth: '480px', margin: '0 auto 32px auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>{isTelugu ? 'ఆర్డర్ రిఫరెన్స్:' : 'Order Reference:'}</span>
              <strong style={{ color: '#C53018', fontSize: '15px' }}>{placedOrder.order_number || `#GS-${placedOrder.id}`}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>{isTelugu ? 'చెల్లింపు విధానం:' : 'Payment Method:'}</span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{placedOrder.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>{isTelugu ? 'మొత్తం చెల్లించినది:' : 'Total Amount:'}</span>
              <strong style={{ fontSize: '16px', color: '#2A1C15' }}>₹{placedOrder.totalAmount}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888', fontSize: '14px' }}>{isTelugu ? 'అంచనా డెలివరీ సమయం:' : 'Estimated Delivery:'}</span>
              <span style={{ color: '#2e7d32', fontWeight: 600, fontSize: '14px' }}>{isTelugu ? '3 - 5 పనిదినాలు' : '3 - 5 Business Days'}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/profile')}
              style={{ padding: '12px 28px', borderRadius: '30px' }}
            >
              {isTelugu ? 'ప్రొఫైల్‌లో ఆర్డర్ చూడండి' : 'View Order in Profile'}
            </button>
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/shop')}
              style={{ padding: '12px 28px', borderRadius: '30px' }}
            >
              {isTelugu ? 'షాపింగ్ కొనసాగించండి' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding container-box" style={{ minHeight: '80vh' }}>
      <h1 className="section-title" style={{ fontFamily: 'var(--font-serif)', color: '#2A1C15', marginBottom: '32px' }}>
        {isTelugu ? 'చెక్‌అవుట్ & షిప్పింగ్ వివరాలు' : 'Checkout & Shipping'}
      </h1>
      
      <div className="checkout-grid-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Form & Payment */}
        <div className="card checkout-card" style={{ padding: '32px', borderRadius: '16px', background: '#fff', border: '1px solid #f0e6dd' }}>
          
          <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#2A1C15', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#C53018" /> {isTelugu ? 'డెలివరీ చిరునామా' : 'Delivery Address'}
          </h2>

          <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                {isTelugu ? 'పూర్తి పేరు' : 'Full Name'} <span style={{ color: '#C53018' }}>*</span>
              </label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'భక్తుని / కస్టమర్ పూర్తి పేరు' : 'Devotee / Customer Full Name'}
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>

            <div className="checkout-form-row-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  {isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address'} <span style={{ color: '#C53018' }}>*</span>
                </label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="order-updates@example.com"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  {isTelugu ? 'మొబైల్ ఫోన్ నంబర్' : 'Mobile Phone Number'} <span style={{ color: '#C53018' }}>*</span>
                </label>
                <input 
                  type="tel" 
                  className="form-control" 
                  placeholder="+91 9876543210"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                {isTelugu ? 'ఇంటి నంబర్, వీధి & ల్యాండ్‌మార్క్' : 'Street Address & Landmark'} <span style={{ color: '#C53018' }}>*</span>
              </label>
              <textarea 
                className="form-control" 
                rows="3" 
                placeholder={isTelugu ? 'ఇంటి నం., అపార్ట్‌మెంట్, వీధి, ల్యాండ్‌మార్క్ వివరాలు' : 'House No, Apartment / Building, Street, Landmark'}
                value={formData.address} 
                onChange={e => setFormData({...formData, address: e.target.value})} 
                required
              />
            </div>

            <div className="checkout-form-row-2" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  {isTelugu ? 'నగరం' : 'City'} <span style={{ color: '#C53018' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  {isTelugu ? 'రాష్ట్రం' : 'State'} <span style={{ color: '#C53018' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.state} 
                  onChange={e => setFormData({...formData, state: e.target.value})} 
                  required 
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                  {isTelugu ? 'పిన్ కోడ్' : 'PIN Code'} <span style={{ color: '#C53018' }}>*</span>
                </label>
                <input 
                  type="text" 
                  maxLength="6"
                  className="form-control" 
                  placeholder="500036"
                  value={formData.pincode} 
                  onChange={e => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '6px' }}>
                {isTelugu ? 'ఆర్డర్ సూచనలు / పూజా వివరాలు (ఐచ్ఛికం)' : 'Order Notes / Pooja Preferences (Optional)'}
              </label>
              <input 
                type="text" 
                className="form-control" 
                placeholder={isTelugu ? 'ఉదా: శుక్రవారం పూజ కోసం పసుపు మరియు పవిత్ర సామగ్రి తాజాగా ఉండాలి' : 'e.g. Please ensure yellow haldi is fresh for Friday pooja'}
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
              />
            </div>

            {/* Payment Method Selection */}
            <h2 style={{ fontSize: '20px', fontFamily: 'var(--font-serif)', color: '#2A1C15', marginTop: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#C53018" /> {isTelugu ? 'చెల్లింపు విధానాన్ని ఎంచుకోండి' : 'Select Payment Method'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { 
                  id: 'Cash on Delivery', 
                  title: isTelugu ? 'క్యాష్ ఆన్ డెలివరీ (COD)' : 'Cash on Delivery (COD)', 
                  desc: isTelugu ? 'డెలివరీ సమయంలో పార్శిల్ అందుకున్న తర్వాత నగదు చెల్లించండి' : 'Pay with cash upon package receipt' 
                },
                { 
                  id: 'UPI', 
                  title: isTelugu ? 'యూపీఐ తక్షణ చెల్లింపు (GPay, PhonePe, Paytm)' : 'UPI Instant Payment (GPay, PhonePe, Paytm)', 
                  desc: isTelugu ? 'వేగవంతమైన, అత్యంత సురక్షితమైన యూపీఐ చెల్లింపు' : 'Fast, secure UPI QR or VPA payment' 
                },
                { 
                  id: 'Credit/Debit Card', 
                  title: isTelugu ? 'క్రెడిట్ లేదా డెబిట్ కార్డు' : 'Credit or Debit Card', 
                  desc: 'Visa, Mastercard, RuPay, Maestro' 
                },
                { 
                  id: 'Net Banking', 
                  title: isTelugu ? 'నెట్ బ్యాంకింగ్' : 'Net Banking', 
                  desc: isTelugu ? 'అన్ని ప్రముఖ భారతీయ బ్యాంకులు' : 'All major Indian banks supported' 
                }
              ].map(method => (
                <label 
                  key={method.id} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    padding: '16px', 
                    border: '1px solid #eee', 
                    borderRadius: '12px', 
                    cursor: 'pointer', 
                    background: paymentMethod === method.id ? '#FFF5F0' : 'white', 
                    borderColor: paymentMethod === method.id ? '#C53018' : '#eee',
                    transition: 'all 0.2s'
                  }}
                >
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value={method.id} 
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ accentColor: '#C53018', marginTop: '3px' }}
                  />
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '14px', color: '#2A1C15', display: 'block' }}>
                      {method.title}
                    </span>
                    <span style={{ fontSize: '12px', color: '#777' }}>
                      {method.desc}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {errorMsg && (
              <div style={{ background: '#FDECEA', color: '#d32f2f', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={submitting}
              className="btn-primary" 
              style={{ 
                marginTop: '16px', 
                padding: '16px', 
                borderRadius: '30px', 
                fontSize: '16px', 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? (isTelugu ? 'ఆర్డర్ నమోదు చేయబడుతోంది...' : 'Placing Divine Order...') : (isTelugu ? `ఆర్డర్ సమర్పించండి (₹${totals.totalAmount})` : `Place Order (₹${totals.totalAmount})`)} <ArrowRight size={18} />
            </button>
          </form>
        </div>
        
        {/* Right Column: Order Summary */}
        <div className="cart-summary card" style={{ padding: '24px', borderRadius: '16px', background: '#fff', border: '1px solid #f0e6dd', position: 'sticky', top: '90px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontFamily: 'var(--font-serif)', fontSize: '20px', color: '#2A1C15' }}>
            {isTelugu ? `ఆర్డర్ చేసిన వస్తువులు (${cart.length})` : `Items in Order (${cart.length})`}
          </h3>

          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
            {cart.map(item => {
              const itemName = translateDynamic(item, 'name');
              return (
                <div key={item.cartId} style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#FFFDF9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0e6dd', flexShrink: 0 }}>
                    <img src={item.image || item.img || '/assets/product_pooja_kit.png'} alt={itemName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {itemName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {isTelugu ? 'పరిమాణం:' : 'Qty:'} {item.quantity || 1} {item.variant ? `• ${item.variant}` : ''}
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#2A1C15' }}>
                    ₹{(Number(item.price) || 0) * (item.quantity || 1)}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'వస్తువుల మొత్తం' : 'Subtotal'}</span>
              <span style={{ fontWeight: 500 }}>₹{totals.subtotal}</span>
            </div>
            
            {totals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: '#2e7d32' }}>{isTelugu ? 'కూపన్ తగ్గింపు' : 'Coupon Discount'} ({appliedCoupon?.code})</span>
                <span style={{ color: '#2e7d32', fontWeight: 600 }}>-₹{totals.discount}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'జీఎస్టీ (18% శాస్త్రోక్త ద్రవ్యాలు)' : 'GST (18% Shastra Goods)'}</span>
              <span>₹{totals.tax}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '18px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
              <span style={{ color: '#666' }}>{isTelugu ? 'డెలివరీ' : 'Delivery'}</span>
              <span style={{ color: totals.shippingFee === 0 ? '#2e7d32' : '#333', fontWeight: 600 }}>
                {totals.shippingFee === 0 ? (isTelugu ? 'ఉచితం' : 'FREE') : `₹${totals.shippingFee}`}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontWeight: 'bold', fontSize: '20px', color: '#2A1C15' }}>
              <span>{isTelugu ? 'మొత్తం చెల్లించవలసినది' : 'Payable Total'}</span>
              <span style={{ color: '#C53018' }}>₹{totals.totalAmount}</span>
            </div>

            <div style={{ background: '#FFFDF9', border: '1px solid #f0e6dd', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={18} color="#C53018" />
              <div style={{ fontSize: '12px', color: '#666' }}>
                {isTelugu ? '24 గంటల్లో పవిత్ర కేంద్రాల నుండి సురక్షితమైన సీల్డ్ ప్యాకింగ్‌తో పంపబడుతుంది.' : 'Safe dispatch within 24 hours. Sealed packaging directly from sacred centers.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
