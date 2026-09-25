import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { 
  Star, Leaf, ShieldCheck, Heart, Users, Tag, 
  MapPin, Shield, RotateCcw, Truck, Zap, ShoppingCart
} from 'lucide-react';
import '../ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, currentCustomer } = useContext(DataContext);
  
  const product = products.find(p => p.id === Number(id));
  
  const [selectedService, setSelectedService] = useState('Hawan Samagri Kit (350g)');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return <div className="product-not-found">Product not found. <button onClick={() => navigate('/shop')}>Go back to shop</button></div>;
  }

  // Create the dynamic gallery array from product images
  const galleryImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || '/assets/product_pooja_kit.png'];

  const handleAddToCart = () => {
    if (!currentCustomer) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    const cartItem = {
      ...product,
      price: product.price,
      variant: selectedService,
      quantity: quantity
    };
    for(let i = 0; i < quantity; i++) {
        addToCart(cartItem);
    }
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!currentCustomer) {
      alert("Please login to purchase items.");
      navigate('/login');
      return;
    }
    const cartItem = {
      ...product,
      price: product.price,
      variant: selectedService,
      quantity: quantity
    };
    for(let i = 0; i < quantity; i++) {
        addToCart(cartItem);
    }
    navigate('/checkout');
  };

  return (
    <div className="pd-container">
      {/* 1. Image Gallery Column */}
      <div className="pd-image-section">
        <div className="pd-thumbnails">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`pd-thumb ${activeImage === idx ? 'active' : ''}`}
              onMouseEnter={() => setActiveImage(idx)}
            >
              <img src={img} alt="thumbnail" />
            </div>
          ))}
        </div>
        <div className="pd-main-image">
          <img src={galleryImages[activeImage]} alt={product.name} />
          <button className="pd-expand-btn">⤢</button>
        </div>
      </div>

      {/* 2. Product Details Column */}
      <div className="pd-details-section">
        {product.badge && <span className="pd-badge">{product.badge.text}</span>}
        <h1 className="pd-title">{product.name} | Natural Samagri</h1>
        
        <div className="pd-seller">
          By <span className="pd-seller-name">Ritualistic Store <ShieldCheck size={14} className="verified-icon" /></span>
        </div>

        <div className="pd-rating-row">
          <span className="pd-rating-score">{product.rating}</span>
          <div className="pd-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(product.rating) ? '#f59e0b' : 'transparent'} 
                color={i < Math.floor(product.rating) ? '#f59e0b' : '#d1d5db'} 
              />
            ))}
          </div>
          <a href="#" className="pd-review-count">({product.reviews} reviews)</a>
        </div>

        <div className="pd-price-section">
          <div className="pd-price-row">
            <span className="pd-current-price">₹{product.price}<span className="cents">00</span></span>
            {product.oldPrice && <span className="pd-old-price">₹{product.oldPrice}</span>}
            {product.oldPrice && <span className="pd-discount-badge">- {Math.round((product.oldPrice - product.price) / product.oldPrice * 100)}%</span>}
          </div>
          <div className="pd-tax-info">Inclusive of all taxes</div>
        </div>

        <div className="pd-features-icons">
          <div className="pd-f-icon">
            <Leaf size={24} className="icon-color" />
            <span>100% Natural<br/>Ingredients</span>
          </div>
          <div className="pd-f-icon">
            <Shield size={24} className="icon-color" />
            <span>Vedic Approved<br/>Ritual Items</span>
          </div>
          <div className="pd-f-icon">
            <Heart size={24} className="icon-color" />
            <span>Made for Devotion<br/>Pure & Sacred</span>
          </div>
          <div className="pd-f-icon">
            <Users size={24} className="icon-color" />
            <span>Trusted by<br/>Thousands</span>
          </div>
        </div>

        <div className="pd-offers-container">
          <div className="pd-offer-card">
            <div className="pd-offer-header"><Tag size={16} /> Cashback</div>
            <div className="pd-offer-desc">Upto ₹14.00 cashback as Amazon Pay Balance</div>
            <a href="#" className="pd-offer-link">1 offer &gt;</a>
          </div>
          <div className="pd-offer-card">
            <div className="pd-offer-header"><Tag size={16} /> Bank Offer</div>
            <div className="pd-offer-desc">Upto ₹1,000.00 discount on select Credit Cards</div>
            <a href="#" className="pd-offer-link">36 offers &gt;</a>
          </div>
          <div className="pd-offer-card">
            <div className="pd-offer-header"><Tag size={16} /> Partner Offer</div>
            <div className="pd-offer-desc">Buy 2 or more and get 5% off on Qualifying Items</div>
            <a href="#" className="pd-offer-link">2 offers &gt;</a>
          </div>
        </div>

        <div className="pd-delivery-icons">
          <div className="pd-d-icon">
             <img src="/assets/pay_on_delivery.png" alt="" onError={(e) => { e.target.onerror = null; e.target.src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='2' y='5' width='20' height='14' rx='2'></rect><line x1='2' y1='10' x2='22' y2='10'></line></svg>" }} />
             <span>Pay on Delivery</span>
          </div>
          <div className="pd-d-icon">
             <RotateCcw size={24} className="d-icon-svg" />
             <span>10 Days<br/>Returnable</span>
          </div>
          <div className="pd-d-icon">
             <Truck size={24} className="d-icon-svg" />
             <span>Gnana Sudha<br/>Delivered</span>
          </div>
          <div className="pd-d-icon">
             <Truck size={24} className="d-icon-svg" />
             <span>Free Delivery<br/>above ₹499</span>
          </div>
          <div className="pd-d-icon">
             <ShieldCheck size={24} className="d-icon-svg" />
             <span>Secure<br/>Transaction</span>
          </div>
        </div>
      </div>

      {/* 3. Action / Right Sidebar Column */}
      <div className="pd-action-sidebar">
        <h3 className="pd-stock-status">In stock</h3>
        
        <div className="pd-delivery-info">
           <div className="pd-d-row">
             <span className="pd-d-icon-s"><Truck size={16}/></span>
             <span>FREE delivery <strong>Tuesday, 30 June</strong> on your first order. <a href="#">Details</a></span>
           </div>
           <div className="pd-d-row">
             <span className="pd-d-icon-s"><Truck size={16}/></span>
             <span>Or fastest delivery <strong>Tomorrow 8 am - 12 pm</strong>. Order within <span className="pd-green-text">7 hrs 44 mins</span>. <a href="#">Details</a></span>
           </div>
           <div className="pd-d-row pd-location">
             <span className="pd-d-icon-s"><MapPin size={16}/></span>
             <a href="#">Delivering to Hyderabad 500036 - Update location</a>
           </div>
        </div>

        <div className="pd-service-selector">
          <h4>Select Service Type</h4>
          <label className={`pd-service-option ${selectedService === 'Hawan Samagri Kit (350g)' ? 'selected' : ''}`}>
            <input type="radio" name="serviceType" 
              checked={selectedService === 'Hawan Samagri Kit (350g)'} 
              onChange={() => setSelectedService('Hawan Samagri Kit (350g)')} />
            <div className="pd-so-details">
              <span className="pd-so-title">Hawan Samagri Kit (350g)</span>
              <span className="pd-so-desc">Complete samagri for ritual</span>
            </div>
          </label>
          <label className={`pd-service-option ${selectedService === 'Hawan with Pandit (At Home)' ? 'selected' : ''}`}>
            <input type="radio" name="serviceType" 
              checked={selectedService === 'Hawan with Pandit (At Home)'} 
              onChange={() => setSelectedService('Hawan with Pandit (At Home)')} />
            <div className="pd-so-details">
              <span className="pd-so-title">Hawan with Pandit (At Home)</span>
              <span className="pd-so-desc">Pandit will perform Hawan at your place</span>
            </div>
          </label>
          <label className={`pd-service-option ${selectedService === 'Online Consultation' ? 'selected' : ''}`}>
            <input type="radio" name="serviceType" 
              checked={selectedService === 'Online Consultation'} 
              onChange={() => setSelectedService('Online Consultation')} />
            <div className="pd-so-details">
              <span className="pd-so-title">Online Consultation</span>
              <span className="pd-so-desc">Pandit guidance via call</span>
            </div>
          </label>
        </div>

        <div className="pd-quantity-row">
          <span className="pd-q-label">Quantity</span>
          <div className="pd-q-selector">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
        </div>

        <button className="pd-add-to-cart-btn" onClick={handleAddToCart}>
          <ShoppingCart size={18} /> Add to Cart
        </button>
        
        <button className="pd-buy-now-btn" onClick={handleBuyNow}>
          <Zap size={18} fill="#e55b13" /> Buy Now
        </button>

        <table className="pd-meta-table">
          <tbody>
            <tr>
              <td>Ships from</td>
              <td>Gnana Sudha</td>
            </tr>
            <tr>
              <td>Sold by</td>
              <td><a href="#">Ritualistic Store</a></td>
            </tr>
            <tr>
              <td>Packaging</td>
              <td>Secure & Premium Packaging</td>
            </tr>
            <tr>
              <td>Payment</td>
              <td><a href="#">Secure Transaction</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
