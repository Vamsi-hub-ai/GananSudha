import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Star, Leaf, ShieldCheck, Heart, Users, 
  Shield, Zap, ShoppingCart,
  CheckCircle2, MessageSquare
} from 'lucide-react';
import '../ProductDetail.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, currentCustomer, toggleWishlist, isInWishlist } = useContext(DataContext);
  const { t, translateDynamic, language } = useLanguage();
  
  const product = products.find(p => String(p.id) === String(id) && (p.status || 'active') !== 'inactive');
  const inWishlist = product ? isInWishlist(product.id) : false;
  
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewName, setReviewName] = useState(currentCustomer ? currentCustomer.name : '');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
    setSelectedVariantIndex(0);
    setQuantity(1);
    setPincodeStatus(null);
  }, [id]);

  // Fetch reviews for this product
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}/reviews`);
        if (res.ok) {
          const data = await res.json();
          setReviewsList(data.data || []);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  // Dynamic Product SEO & Open Graph Tags
  useEffect(() => {
    if (product) {
      document.title = `${product.name} — Divine Pooja Essentials | Gnana Sudha`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && product.desc) metaDesc.setAttribute('content', product.desc);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', `${product.name} | Gnana Sudha`);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && product.desc) ogDesc.setAttribute('content', product.desc);
      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg && product.image) {
        ogImg.setAttribute('content', product.image.startsWith('http') ? product.image : `https://gnanasudha.com${product.image}`);
      }
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://gnanasudha.com/product/${product.id}`);
    }
  }, [product]);

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', color: '#2A1C15', marginBottom: '16px' }}>
          {language === 'te' ? 'ఉత్పత్తి కనుగొనబడలేదు' : 'Product Not Found'}
        </h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          {language === 'te' ? 'మీరు వెతుకుతున్న వస్తువు ప్రస్తుతం అందుబాటులో లేదు.' : 'The item you are looking for is unavailable or has been relocated.'}
        </p>
        <button className="btn-primary" onClick={() => navigate('/shop')}>
          {language === 'te' ? 'అన్ని ఉత్పత్తులను చూడండి' : 'Browse All Products'}
        </button>
      </div>
    );
  }

  // Parse variants and images safely
  const variants = Array.isArray(product.variants) 
    ? product.variants 
    : (typeof product.variants === 'string' ? JSON.parse(product.variants || '[]') : []);
  
  const hasVariants = variants.length > 0;
  const currentVariant = hasVariants ? variants[selectedVariantIndex] : null;

  const currentPrice = currentVariant ? Number(currentVariant.price) : Number(product.price);
  const currentStock = currentVariant?.stock !== undefined ? Number(currentVariant.stock) : (product.stock !== undefined ? Number(product.stock) : 50);
  const isOutOfStock = currentStock <= 0;

  // Gallery Images
  let galleryImages = [];
  if (Array.isArray(product.images) && product.images.length > 0) {
    galleryImages = product.images;
  } else if (typeof product.images === 'string') {
    try {
      galleryImages = JSON.parse(product.images);
    } catch {}
  }
  if (!galleryImages || galleryImages.length === 0) {
    galleryImages = [product.image || '/assets/product_pooja_kit.png'];
  }

  // Parse Highlights & Specifications
  const highlights = product.highlights 
    ? product.highlights.split(/;|\n/).map(h => h.trim()).filter(Boolean)
    : [
        '100% Shastra compliant and authentic',
        'Directly sourced from sacred origins across India',
        'Pure, untampered, and packed with devotion'
      ];

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus({ valid: false, msg: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    const days = Math.floor(Math.random() * 2) + 2;
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dateStr = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    setPincodeStatus({
      valid: true,
      msg: `Delivery available! Estimated delivery by ${dateStr}. Free delivery on orders over ₹499.`
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, currentVariant);
    showToast(language === 'te' ? `${quantity} x "${translateDynamic(product, 'name')}" కార్ట్‌కు జోడించబడింది!` : `Added ${quantity} x "${product.name}" to cart!`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, currentVariant);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewFeedback(language === 'te' ? 'దయచేసి మీ పేరు మరియు సమీక్షను నమోదు చేయండి.' : 'Please provide your name and review feedback.');
      return;
    }
    setSubmittingReview(true);
    setReviewFeedback('');

    try {
      const res = await fetch(`${API_URL}/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: reviewName,
          customer_email: currentCustomer?.email || 'customer@gnanasudha.com',
          rating: reviewRating,
          review_title: reviewTitle || (language === 'te' ? 'ప్రామాణిక పూజా ద్రవ్యం' : 'Authentic and blessed item'),
          comment: reviewComment
        })
      });

      if (res.ok) {
        const result = await res.json();
        setReviewsList(prev => [result.data, ...prev]);
        setReviewTitle('');
        setReviewComment('');
        setReviewFeedback(language === 'te' ? 'ధన్యవాదాలు! మీ సమీక్ష విజయవంతంగా నమోదైంది.' : 'Thank you! Your review has been submitted.');
      } else {
        const err = await res.json();
        setReviewFeedback(err.message || (language === 'te' ? 'సమీక్ష సమర్పణలో లోపం ఏర్పడింది.' : 'Failed to submit review.'));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewFeedback(language === 'te' ? 'సమీక్ష సమర్పణలో లోపం ఏర్పడింది.' : 'Error submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.categoryid === product.categoryid || p.featured))
    .slice(0, 4);

  const productName = translateDynamic(product, 'name');
  const productDesc = translateDynamic(product, 'desc');

  const productLdJson = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://gnanasudha.com/product/${product.id}#product`,
        "name": product.name,
        "image": galleryImages.map(img => img.startsWith('http') ? img : `https://gnanasudha.com${img}`),
        "description": product.desc || product.name,
        "sku": product.sku || `GS-PRD-${product.id}`,
        "brand": {
          "@type": "Brand",
          "name": "Gnana Sudha"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://gnanasudha.com/product/${product.id}`,
          "priceCurrency": "INR",
          "price": currentPrice,
          "priceValidUntil": "2027-12-31",
          "availability": isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "Organization",
            "name": "Gnana Sudha"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": Number(product.rating) || 5.0,
          "reviewCount": Number(product.reviews) || 1
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://gnanasudha.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Pooja Shop",
            "item": "https://gnanasudha.com/shop"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": product.name,
            "item": `https://gnanasudha.com/product/${product.id}`
          }
        ]
      }
    ]
  };

  return (
    <div style={{ background: '#FFFDFB', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Schema.org Product Rich Snippet */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLdJson) }} />

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', fontSize: '13px', color: '#888', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>{t('nav.home')}</Link>
        <span>/</span>
        <Link to="/shop" style={{ color: '#666', textDecoration: 'none' }}>{t('nav.shop')}</Link>
        <span>/</span>
        <span style={{ color: '#C53018', fontWeight: 500 }}>{productName}</span>
      </div>

      <div className="pd-container">
        {/* 1. Image Gallery Column */}
        <div className="pd-image-section">
          {galleryImages.length > 1 && (
            <div className="pd-thumbnails">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`pd-thumb ${activeImage === idx ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                  onMouseEnter={() => setActiveImage(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }} />
                </div>
              ))}
            </div>
          )}
          
          <div className="pd-main-image" style={{ background: '#fff', border: '1px solid #f0e6dd' }}>
            <img 
              src={galleryImages[activeImage] || '/assets/product_pooja_kit.png'} 
              alt={productName} 
              style={{ maxHeight: '460px', width: '100%', objectFit: 'contain', padding: '16px' }}
              onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
            />
            {product.badge_text && (
              <span className={`pd-badge badge-${product.badge_type || 'primary'}`} style={{ position: 'absolute', top: '16px', left: '16px' }}>
                {product.badge_text}
              </span>
            )}
          </div>
        </div>

        {/* 2. Product Details Column */}
        <div className="pd-details-section">
          <h1 className="pd-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '26px' }}>
            {productName}
          </h1>
          
          <div className="pd-seller">
            {language === 'te' ? 'ప్రామాణిక ఆధ్యాత్మిక పూజా సామాగ్రి | విక్రేత:' : 'Authentic Spiritual Samagri | Sold by'}{' '}
            <span className="pd-seller-name" style={{ color: '#C53018', fontWeight: 600 }}>
              {language === 'te' ? 'జ్ఞాన సుధ దివ్య స్టోర్' : 'Gnana Sudha Divine Store'} <ShieldCheck size={14} className="verified-icon" color="#C53018" />
            </span>
          </div>

          <div className="pd-rating-row">
            <span className="pd-rating-score" style={{ fontWeight: 700 }}>{product.rating || '4.8'}</span>
            <div className="pd-stars" style={{ display: 'flex', gap: '2px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  fill={i < Math.floor(product.rating || 4.8) ? '#f59e0b' : 'transparent'} 
                  color="#f59e0b" 
                />
              ))}
            </div>
            <span className="pd-review-count" style={{ color: '#C53018' }}>
              ({product.reviews || reviewsList.length || 0} {language === 'te' ? 'సమీక్షలు' : 'reviews'})
            </span>
            {product.sku && (
              <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#999' }}>SKU: {product.sku}</span>
            )}
          </div>

          <div className="pd-price-section">
            <div className="pd-price-row">
              <span className="pd-current-price">₹{currentPrice * quantity}</span>
              {quantity > 1 && (
                <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                  (₹{currentPrice} × {quantity})
                </span>
              )}
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="pd-old-price">₹{product.oldPrice * quantity}</span>
              )}
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="pd-discount-badge">
                  {Math.round(((product.oldPrice - currentPrice) / product.oldPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <div className="pd-tax-info" style={{ color: '#2e7d32', fontWeight: 500 }}>
              {language === 'te' ? 'సమస్త పన్నులు (18% జీఎస్టీ) కలిపి. ₹499 పైబడిన ఆర్డర్లపై ఉచిత డెలివరీ.' : 'Inclusive of all taxes (18% GST). Free shipping on orders over ₹499.'}
            </div>
          </div>

          {/* Value props */}
          <div className="pd-features-icons">
            <div className="pd-f-icon">
              <Leaf size={22} color="#C53018" />
              <span>{language === 'te' ? <>100% శాస్త్రోక్తం<br/>ప్రామాణికమైనది</> : <>100% Shastra<br/>Compliant</>}</span>
            </div>
            <div className="pd-f-icon">
              <Shield size={22} color="#C53018" />
              <span>{language === 'te' ? <>భద్రమైన సీల్డ్<br/>ప్యాకింగ్</> : <>Tamper-Proof<br/>Sealed Box</>}</span>
            </div>
            <div className="pd-f-icon">
              <Heart size={22} color="#C53018" />
              <span>{language === 'te' ? <>దివ్య పూజార్హం<br/>పవిత్ర మూలాలు</> : <>Blessed & Pure<br/>Vedic Sourced</>}</span>
            </div>
            <div className="pd-f-icon">
              <Users size={22} color="#C53018" />
              <span>{language === 'te' ? <>పవిత్రమైన వేద<br/>విశ్వాసం</> : <>Sacred Vedic<br/>Devotee Trust</>}</span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ fontSize: '15px', color: '#2A1C15', marginBottom: '8px', fontWeight: 600 }}>
              {language === 'te' ? 'ఉత్పత్తి వివరాలు' : 'Description'}
            </h4>
            <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {productDesc}
            </p>
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ fontSize: '15px', color: '#2A1C15', marginBottom: '8px', fontWeight: 600 }}>
                {language === 'te' ? 'ముఖ్య విశేషాలు' : 'Key Highlights'}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '14px', lineHeight: '1.6' }}>
                {highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Usage instructions */}
          {product.usage_instructions && (
            <div style={{ marginTop: '16px', background: '#FFF9F5', padding: '14px 18px', borderRadius: '10px', border: '1px solid #FADED7' }}>
              <h4 style={{ fontSize: '14px', color: '#C53018', margin: '0 0 6px 0', fontWeight: 600 }}>
                {language === 'te' ? 'పూజా విధానం & ఉపయోగించే సూచనలు' : 'Pooja Vidhi & Usage Instructions'}
              </h4>
              <p style={{ color: '#555', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                {product.usage_instructions}
              </p>
            </div>
          )}

          {/* Delivery & Pincode Checker */}
          <div style={{ marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <h4 style={{ fontSize: '14px', color: '#2A1C15', margin: '0 0 10px 0', fontWeight: 600 }}>
              {language === 'te' ? 'మీ ప్రాంతానికి డెలివరీని తనిఖీ చేయండి' : 'Check Delivery to Your Area'}
            </h4>
            <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '8px', maxWidth: '340px' }}>
              <input 
                type="text" 
                maxLength="6"
                placeholder={language === 'te' ? '6 అంకెల పిన్‌కోడ్ నమోదు చేయండి' : 'Enter 6-digit Pincode'}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
              />
              <button 
                type="submit"
                style={{ padding: '9px 18px', background: '#2A1C15', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                {language === 'te' ? 'తనిఖీ చేయి' : 'Check'}
              </button>
            </form>
            {pincodeStatus && (
              <p style={{ fontSize: '13px', marginTop: '8px', color: pincodeStatus.valid ? '#2e7d32' : '#d32f2f', fontWeight: 500 }}>
                {pincodeStatus.msg}
              </p>
            )}
          </div>
        </div>

        {/* 3. Action / Right Sidebar Column */}
        <div className="pd-action-sidebar" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e6dd', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#C53018' }}>
                  ₹{currentPrice * quantity}
                </span>
                {quantity > 1 && (
                  <span style={{ fontSize: '13px', color: '#777', fontWeight: 500 }}>
                    (₹{currentPrice} each)
                  </span>
                )}
              </div>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <div style={{ fontSize: '13px', color: '#999', textDecoration: 'line-through', marginTop: '2px' }}>
                  MRP: ₹{product.oldPrice * quantity}
                </div>
              )}
            </div>
            <span className={`pd-stock-status ${isOutOfStock ? 'out-of-stock' : ''}`} style={{ color: isOutOfStock ? '#d32f2f' : '#2e7d32', fontWeight: 600, fontSize: '14px', marginTop: '4px' }}>
              {isOutOfStock ? t('common.out_of_stock') : (currentStock <= 5 ? (language === 'te' ? `కేవలం ${currentStock} మాత్రమే మిగిలి ఉన్నాయి!` : `Only ${currentStock} Left!`) : t('common.in_stock'))}
            </span>
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px' }}>
                {language === 'te' ? 'ప్యాక్ / పరిమాణం ఎంచుకోండి:' : 'Select Pack / Size:'}
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {variants.map((v, i) => (
                  <label 
                    key={i} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: selectedVariantIndex === i ? '2px solid #C53018' : '1px solid #ddd',
                      background: selectedVariantIndex === i ? '#FFF5F0' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="radio" 
                        name="productVariant" 
                        checked={selectedVariantIndex === i}
                        onChange={() => setSelectedVariantIndex(i)}
                        style={{ accentColor: '#C53018' }}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 500, color: '#333' }}>{v.attribute}</span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#C53018' }}>₹{v.price}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="pd-quantity-row" style={{ marginBottom: '20px' }}>
            <span className="pd-q-label" style={{ fontWeight: 600 }}>{language === 'te' ? 'పరిమాణం' : 'Quantity'}</span>
            <div className="pd-q-selector">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock}
              >
                -
              </button>
              <span>{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(currentStock || 99, quantity + 1))}
                disabled={isOutOfStock || quantity >= currentStock}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <button 
            className="pd-add-to-cart-btn" 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
          >
            <ShoppingCart size={18} /> {isOutOfStock ? t('common.out_of_stock') : (quantity > 1 ? `${t('common.add_to_cart')} (${quantity})` : t('common.add_to_cart'))}
          </button>
          
          {/* Buy Now button */}
          <button 
            className="pd-buy-now-btn" 
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            style={{ opacity: isOutOfStock ? 0.5 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
          >
            <Zap size={18} fill="#e55b13" /> {t('common.buy_now')}
          </button>

          {/* Wishlist button */}
          <button
            onClick={() => {
              toggleWishlist(product);
              showToast(inWishlist 
                ? (language === 'te' ? `విష్‌లిస్ట్ నుండి "${productName}" తొలగించబడింది` : `Removed "${product.name}" from Wishlist`)
                : (language === 'te' ? `విష్‌లిస్ట్‌లో "${productName}" భద్రపరచబడింది!` : `Saved "${product.name}" to your Wishlist!`));
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px',
              borderRadius: '8px',
              border: inWishlist ? '1px solid #C53018' : '1px solid #ddd',
              background: inWishlist ? '#FFF5F2' : '#fff',
              color: inWishlist ? '#C53018' : '#555',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'all 0.2s'
            }}
          >
            <Heart size={18} color="#C53018" fill={inWishlist ? "#C53018" : "transparent"} />
            {inWishlist ? (language === 'te' ? 'విష్‌లిస్ట్‌లో భద్రపరచబడింది' : 'Saved in Wishlist') : (language === 'te' ? 'విష్‌లిస్ట్‌కు జోడించు' : 'Add to Wishlist')}
          </button>

          {/* Meta Table */}
          <table className="pd-meta-table" style={{ marginTop: '24px' }}>
            <tbody>
              <tr>
                <td>{language === 'te' ? 'డెలివరీ' : 'Delivery'}</td>
                <td>{language === 'te' ? '2 - 4 పని దినాలు' : '2 - 4 Business Days'}</td>
              </tr>
              <tr>
                <td>{language === 'te' ? 'రవాణా కేంద్రం' : 'Ships from'}</td>
                <td>{language === 'te' ? 'జ్ఞాన సుధ హబ్' : 'Gnana Sudha Hub'}</td>
              </tr>
              <tr>
                <td>{language === 'te' ? 'మార్పిడి' : 'Returns'}</td>
                <td>{language === 'te' ? '7 రోజుల రీప్లేస్‌మెంట్' : '7 Days Replacement'}</td>
              </tr>
              <tr>
                <td>{language === 'te' ? 'చెల్లింపు' : 'Payment'}</td>
                <td>{language === 'te' ? 'యూపీఐ, కార్డులు, నెట్ బ్యాంకింగ్, సీఓడీ' : 'UPI, Cards, NetBanking, COD'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <div style={{ maxWidth: '1400px', margin: '40px auto 0', padding: '0 24px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f0e6dd', padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#2A1C15', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={22} color="#C53018" /> {language === 'te' ? 'భక్తుల అభిప్రాయాలు & రేటింగ్‌లు' : 'Customer Reviews & Ratings'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {/* Reviews List */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#333', marginBottom: '16px' }}>
                {language === 'te' ? `భక్తుల స్పందనలు (${reviewsList.length})` : `Customer Feedback (${reviewsList.length})`}
              </h3>

              {reviewsList.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', background: '#fafafa', borderRadius: '12px', border: '1px dashed #ddd', color: '#888' }}>
                  {language === 'te' ? 'ఇంకా సమీక్షలు లేవు. ఈ పవిత్ర వస్తువును సమీక్షించిన మొదటి వ్యక్తి మీరే అవ్వండి!' : 'No customer reviews yet. Be the first to review this blessed item!'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {reviewsList.map((rev, idx) => (
                    <div key={rev.id || idx} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < rev.rating ? '#f59e0b' : 'transparent'} color="#f59e0b" />
                          ))}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#2A1C15' }}>{rev.review_title || (language === 'te' ? 'ప్రామాణిక వస్తువు' : 'Authentic Item')}</span>
                      </div>
                      <p style={{ margin: '0 0 6px 0', color: '#555', fontSize: '13px', lineHeight: '1.5' }}>{rev.comment}</p>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        By {rev.customer_name} • {rev.created_at ? new Date(rev.created_at).toLocaleDateString() : (language === 'te' ? 'ధృవీకరించబడిన కొనుగోలుదారు' : 'Verified Buyer')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div style={{ background: '#FFFDFB', border: '1px solid #f0e6dd', padding: '24px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#2A1C15', marginBottom: '16px' }}>
                {language === 'te' ? 'మీ సమీక్షను వ్రాయండి' : 'Write a Review'}
              </h3>
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                    {language === 'te' ? 'రేటింగ్' : 'Rating'}
                  </label>
                  <div style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={22} 
                        fill={star <= reviewRating ? '#f59e0b' : 'transparent'} 
                        color="#f59e0b"
                        onClick={() => setReviewRating(star)} 
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                    {language === 'te' ? 'మీ పూర్తి పేరు' : 'Your Name'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                    {language === 'te' ? 'సమీక్ష శీర్షిక' : 'Review Headline'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === 'te' ? 'ఉదా. అత్యంత నాణ్యమైన, సుగంధభరిత పవిత్ర సామాగ్రి' : "e.g. Pure, aromatic, and excellent quality"}
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#555', marginBottom: '6px' }}>
                    {language === 'te' ? 'సమీక్ష వివరాలు' : 'Review Details'}
                  </label>
                  <textarea 
                    rows="3"
                    required
                    placeholder={language === 'te' ? 'ఈ పూజా ద్రవ్యం గురించిన మీ అనుభవాన్ని వివరించండి...' : "Describe your experience with this item..."}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {reviewFeedback && (
                  <p style={{ margin: 0, fontSize: '13px', color: reviewFeedback.includes('Thank') || reviewFeedback.includes('ధన్యవాదాలు') ? '#2e7d32' : '#d32f2f', fontWeight: 500 }}>
                    {reviewFeedback}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={submittingReview}
                  style={{
                    background: '#C53018',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: submittingReview ? 'not-allowed' : 'pointer',
                    alignSelf: 'flex-start'
                  }}
                >
                  {submittingReview ? (language === 'te' ? 'సమర్పిస్తున్నాము...' : 'Submitting...') : (language === 'te' ? 'సమీక్షను సమర్పించండి' : 'Submit Review')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ maxWidth: '1400px', margin: '40px auto 0', padding: '0 24px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#2A1C15', marginBottom: '20px' }}>
            {language === 'te' ? 'కలిసి కొనుగోలు చేసే సంబంధిత పూజా వస్తువులు' : 'Frequently Bought Together & Related Essentials'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {relatedProducts.map(rp => (
              <div 
                key={rp.id}
                onClick={() => navigate(`/product/${rp.id}`)}
                style={{
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '14px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#C53018'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
              >
                <div style={{ width: '70px', height: '70px', background: '#fafafa', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={rp.image || (rp.images && rp.images[0]) || '/assets/product_pooja_kit.png'} alt={translateDynamic(rp, 'name')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#2A1C15', fontWeight: 600, lineHeight: '1.3' }}>
                    {translateDynamic(rp, 'name')}
                  </h4>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#C53018' }}>₹{rp.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#2A1C15',
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999
        }}>
          <CheckCircle2 size={18} color="#4ade80" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
