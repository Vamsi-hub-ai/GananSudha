import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { CheckCircle } from 'lucide-react';
import '../App.css';

export default function Checkout() {
  const { cart, currentCustomer, placeOrder, appliedCoupon, setAppliedCoupon } = useContext(DataContext);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', pincode: ''
  });

  useEffect(() => {
    if (!currentCustomer) {
      alert("Please login to proceed to checkout.");
      navigate('/login');
    } else {
      setFormData(prev => ({
        ...prev,
        name: currentCustomer.name || '',
        email: currentCustomer.email || ''
      }));
    }
  }, [currentCustomer, navigate]);

  const subtotal = cart.reduce((total, item) => total + (item.price || 0), 0);
  const discountAmt = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const taxableAmount = subtotal - discountAmt;
  const taxes = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + taxes;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Simulate Dummy Checkout
    placeOrder({
      shippingDetails: formData,
      paymentMethod,
      totalAmount: total,
      couponApplied: appliedCoupon ? appliedCoupon.code : null
    });
    
    setAppliedCoupon(null); // Reset coupon after successful checkout
    setSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 3000);
  };

  if (success) {
    return (
      <div className="section-padding container-box" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={64} style={{ color: '#4CAF50', marginBottom: '24px' }} />
        <h1>Order Confirmed!</h1>
        <p style={{ color: '#666', fontSize: '18px' }}>Thank you for your purchase. Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="section-padding container-box">
      <h1 className="section-title">Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Shipping Details</h2>
          <form id="checkout-form" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label>Full Address</label>
              <textarea className="form-control" rows="3" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>City</label>
                <input type="text" className="form-control" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" className="form-control" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} required />
              </div>
            </div>
          </form>

          <h2 style={{ marginTop: '32px', marginBottom: '24px' }}>Payment Method</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['Credit Card', 'Debit Card', 'UPI', 'COD'].map(method => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', cursor: 'pointer', background: paymentMethod === method ? '#fff8f6' : 'white', borderColor: paymentMethod === method ? '#E95221' : '#eee' }}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value={method} 
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ accentColor: '#E95221' }}
                />
                <span style={{ fontWeight: 500 }}>{method === 'COD' ? 'Cash on Delivery (COD)' : method}</span>
              </label>
            ))}
            
            {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
              <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Card Number" className="form-control" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="text" placeholder="MM/YY" className="form-control" />
                  <input type="text" placeholder="CVV" className="form-control" />
                </div>
              </div>
            )}
            
            {paymentMethod === 'UPI' && (
              <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', marginTop: '4px' }}>
                <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" className="form-control" />
              </div>
            )}
          </div>
        </div>
        
        <div className="cart-summary card" style={{ padding: '24px', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 24px 0' }}>Order Summary</h3>
          <div style={{ marginBottom: '24px' }}>
            {cart.map(item => (
              <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#666', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '16px' }}>{item.name}</span>
                <span>₹{item.price}</span>
              </div>
            ))}
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            
            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#666' }}>Discount ({appliedCoupon.discount}%)</span>
                <span style={{ color: '#E04E15' }}>-₹{discountAmt}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Taxes (18%)</span>
              <span>₹{taxes}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold', fontSize: '20px' }}>
              <span>Total Amount</span>
              <span>₹{total}</span>
            </div>
            
            <button type="submit" form="checkout-form" className="btn-primary" style={{ width: '100%', padding: '16px' }}>
              Confirm & Pay (Dummy)
            </button>
            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '12px' }}>
              This is a demo checkout. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
