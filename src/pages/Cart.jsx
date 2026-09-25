import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import '../App.css';

export default function Cart() {
  const { cart, removeFromCart, coupons, appliedCoupon, setAppliedCoupon } = useContext(DataContext);
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponInput) return;
    
    const coupon = coupons.find(c => c.code === couponInput.toUpperCase());
    
    if (!coupon) {
      setCouponError('Invalid coupon code.');
      return;
    }
    
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      setCouponError('This coupon has expired.');
      return;
    }
    
    setAppliedCoupon(coupon);
    setCouponSuccess(`Coupon applied successfully! ${coupon.discount}% off.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponSuccess('');
  };

  const subtotal = cart.reduce((total, item) => total + (item.price || 0), 0);
  const discountAmt = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const taxableAmount = subtotal - discountAmt;
  const taxes = Math.round(taxableAmount * 0.18);
  const total = taxableAmount + taxes;

  return (
    <div className="section-padding container-box">
      <h1 className="section-title">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
          <ShoppingBag size={48} style={{ color: '#ccc', marginBottom: '16px' }} />
          <h2>Your cart is empty</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Looks like you haven't added anything to your cart yet.</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.map((item) => (
              <div key={item.cartId} className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px' }}>
                <div style={{ width: '80px', height: '80px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <img src={item.img || item.image || '/assets/product_pooja_kit.png'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.name}</h3>
                  <div style={{ color: '#666', fontSize: '14px' }}>
                    {item.variant ? `Variant: ${item.variant}` : (item.desc || '')}
                  </div>
                  {item.pandit && (
                    <div style={{ color: '#E95221', fontSize: '14px', marginTop: '4px' }}>
                      Assigned Pandit: {item.pandit.name}
                    </div>
                  )}
                </div>
                <div style={{ fontWeight: '600', fontSize: '18px' }}>
                  ₹{item.price}
                </div>
                <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', padding: '8px' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary card" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 24px 0' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#666' }}>Subtotal ({cart.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            
            {/* Coupon Code Section */}
            <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
              {!appliedCoupon ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Coupon Code" 
                    className="login-input" 
                    style={{ flex: 1, padding: '10px' }} 
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button className="btn-secondary" style={{ padding: '10px 16px', borderRadius: '8px' }} onClick={handleApplyCoupon}>Apply</button>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6ffed', border: '1px solid #b7eb8f', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <span style={{ color: '#52c41a', fontWeight: 'bold', display: 'block' }}>{appliedCoupon.code}</span>
                    <span style={{ color: '#52c41a', fontSize: '12px' }}>{appliedCoupon.discount}% Off Applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                </div>
              )}
              {couponError && <p style={{ color: '#ff4d4f', fontSize: '13px', margin: '8px 0 0 0' }}>{couponError}</p>}
              {couponSuccess && <p style={{ color: '#52c41a', fontSize: '13px', margin: '8px 0 0 0' }}>{couponSuccess}</p>}
            </div>

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ color: '#666' }}>Discount ({appliedCoupon.discount}%)</span>
                <span style={{ color: '#E04E15' }}>-₹{discountAmt}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ color: '#666' }}>Taxes (18%)</span>
              <span>₹{taxes}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #eee' }}>
              <span style={{ color: '#666' }}>Shipping</span>
              <span style={{ color: '#4CAF50' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: 'bold', fontSize: '20px' }}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', padding: '16px' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
