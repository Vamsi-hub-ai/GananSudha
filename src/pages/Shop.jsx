import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, PackageOpen, Truck, RefreshCcw, 
  ChevronRight, Heart, ShoppingCart, Star,
  Box, Sparkles, User, LayoutGrid, Book, Shirt, Grid, Tag, Flame
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import '../Shop.css';

const iconMap = {
  Box: Box,
  Sparkles: Sparkles,
  User: User,
  LayoutGrid: LayoutGrid,
  Book: Book,
  Shirt: Shirt,
  Grid: Grid,
  Tag: Tag,
  Flame: Flame
};

const renderStars = (rating) => {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star 
      key={i} 
      size={14} 
      fill={i < Math.floor(rating) ? '#fbbf24' : 'transparent'} 
      color={i < Math.floor(rating) ? '#fbbf24' : '#d1d5db'} 
    />
  ));
};

const ProductCard = ({ product }) => {
  const { addToCart, currentCustomer } = useContext(DataContext);
  const navigate = useNavigate();
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const currentPrice = hasVariants ? product.variants[selectedVariantIndex].price : product.price;
  const currentVariantLabel = hasVariants ? product.variants[selectedVariantIndex].attribute : null;

  const handleAddToCart = () => {
    if (!currentCustomer) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }
    addToCart({
      ...product,
      price: currentPrice,
      variant: currentVariantLabel
    });
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!currentCustomer) {
      alert("Please login to purchase items.");
      navigate('/login');
      return;
    }
    addToCart({
      ...product,
      price: currentPrice,
      variant: currentVariantLabel
    });
    navigate('/checkout');
  };

  return (
    <div className="product-card">
      {product.badge && (
        <span className={`product-badge badge-${product.badge.type}`}>
          {product.badge.text}
        </span>
      )}
      
      <div className="product-image-container" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
        <img src={(product.images && product.images.length > 0) ? product.images[0] : product.image} alt={product.name} />
      </div>
      
      <div className="product-info">
        <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        
        {hasVariants && (
          <div style={{ marginBottom: '12px' }}>
            <select 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
            >
              {product.variants.map((v, i) => (
                <option key={i} value={i}>{v.attribute}</option>
              ))}
            </select>
          </div>
        )}

        <div className="product-price-row">
          <span className="product-price">₹{currentPrice}</span>
          {product.oldPrice && !hasVariants && (
            <span className="product-old-price">₹{product.oldPrice}</span>
          )}
        </div>
        
        <div className="product-rating">
          <div className="stars">
            {renderStars(product.rating)}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>
        
        <div className="product-actions" style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-add-cart" onClick={handleAddToCart} style={{ padding: '8px' }} title="Add to Cart">
            <ShoppingCart size={16} />
          </button>
          <button className="btn-primary" onClick={handleBuyNow} style={{ flex: 1, padding: '8px 12px', fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Buy Now
          </button>
          <button className="btn-wishlist" style={{ padding: '8px', cursor: 'pointer' }} onClick={() => alert('Added to Wishlist!')}>
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Shop() {
  const { categories, products } = useContext(DataContext);
  const [activeCategory, setActiveCategory] = useState(null);
  
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);
  
  const activeCategoryName = categories.find(c => c.id === activeCategory)?.name || 'Products';
  const filteredProducts = products.filter(p => p.categoryid === activeCategory);

  return (
    <div className="shop-page">
      {/* Hero Section */}
      <div className="shop-hero">
        <img src="/assets/shop_hero_bg.png" alt="Pooja Essentials Background" className="shop-hero-bg" />
        <div className="shop-hero-content">
          <h1 className="shop-hero-title">
            Pooja Essentials,
            <span>Delivered with Devotion</span>
          </h1>
          <p className="shop-hero-subtitle">
            Everything you need for your sacred rituals.
            Pure. Authentic. Delivered to your doorstep.
          </p>
          
          <div className="shop-hero-features">
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <ShieldCheck size={24} />
              </div>
              <span className="hero-feature-text">100% Authentic Products</span>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <PackageOpen size={24} />
              </div>
              <span className="hero-feature-text">Secure Packaging</span>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <Truck size={24} />
              </div>
              <span className="hero-feature-text">Fast & Reliable Delivery</span>
            </div>
            <div className="hero-feature-item">
              <div className="hero-feature-icon">
                <RefreshCcw size={24} />
              </div>
              <span className="hero-feature-text">Easy Returns & Refunds</span>
            </div>
          </div>
        </div>
      </div>


      {/* Main Layout */}
      <div className="shop-main-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <h2 className="shop-sidebar-title">Shop by Category</h2>
          <div className="shop-sidebar-menu">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`shop-sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="shop-sidebar-item-left">
                  {(() => {
                    const IconComponent = iconMap[category.iconname] || Box;
                    return <IconComponent size={20} className="shop-sidebar-icon" />;
                  })()}
                  <span>{category.name}</span>
                </div>
                <ChevronRight size={16} color="#d1d5db" />
              </div>
            ))}
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="shop-content-area">
          <div className="shop-content-header">
            <h2 className="shop-section-title">{activeCategoryName}</h2>
          </div>
          
          <div className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div style={{ padding: '40px 0', color: '#888', gridColumn: '1 / -1', textAlign: 'center' }}>
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
