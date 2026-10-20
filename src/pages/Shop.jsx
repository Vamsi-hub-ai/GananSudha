import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, PackageOpen, Truck, RefreshCcw, 
  Heart, ShoppingCart, Star,
  Box, Sparkles, User, LayoutGrid, Book, Shirt, Grid, Tag, Flame,
  Search, Check, X, ShoppingBag, ArrowRight
} from 'lucide-react';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
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
  const r = Number(rating) || 4.8;
  return Array.from({ length: 5 }).map((_, i) => (
    <Star 
      key={i} 
      size={13} 
      fill={i < Math.floor(r) ? '#f59e0b' : 'transparent'} 
      color={i < Math.floor(r) ? '#f59e0b' : '#d1d5db'} 
    />
  ));
};

const ProductCard = ({ product, onShowToast }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useContext(DataContext);
  const { t, translateDynamic, language } = useLanguage();
  const navigate = useNavigate();
  const hasVariants = product.variants && product.variants.length > 0;
  const inWishlist = isInWishlist(product.id);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = hasVariants ? product.variants[selectedVariantIndex] : null;
  const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.price);
  const currentStock = selectedVariant?.stock !== undefined ? Number(selectedVariant.stock) : (product.stock !== undefined ? Number(product.stock) : 50);
  const isOutOfStock = currentStock <= 0;

  const discountPercent = product.oldPrice && product.oldPrice > currentPrice
    ? Math.round(((product.oldPrice - currentPrice) / product.oldPrice) * 100)
    : null;

  const productName = translateDynamic(product, 'name');
  const productDesc = translateDynamic(product, 'desc');

  const badgeTranslations = {
    'Best Seller': language === 'te' ? 'అత్యధిక ప్రజాదరణ' : 'Best Seller',
    'Popular': language === 'te' ? 'ప్రసిద్ధమైనది' : 'Popular',
    'Natural': language === 'te' ? 'సహజసిద్ధం' : 'Natural',
    'Handmade': language === 'te' ? 'హస్తకళ' : 'Handmade',
    'Lab Certified': language === 'te' ? 'ల్యాబ్ సర్టిఫైడ్' : 'Lab Certified',
    '108 Herbs': language === 'te' ? '108 మూలికలు' : '108 Herbs',
    'New Arrival': language === 'te' ? 'కొత్తది' : 'New Arrival'
  };
  const badgeText = product.badge_text ? (badgeTranslations[product.badge_text] || translateDynamic(product.badge_text)) : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariant);
    if (onShowToast) onShowToast(language === 'te' ? `"${productName}" మీ కార్ట్‌కు జోడించబడింది!` : `Added "${product.name}" to your cart!`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariant);
    navigate('/checkout');
  };

  const productImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : (product.image || '/assets/product_pooja_kit.png');

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock-card' : ''}`}>
      {/* Badge */}
      {badgeText ? (
        <span className={`product-badge badge-${product.badge_type || 'primary'}`}>
          {badgeText}
        </span>
      ) : isOutOfStock ? (
        <span className="product-badge" style={{ background: '#777' }}>
          {t('common.out_of_stock')}
        </span>
      ) : discountPercent ? (
        <span className="product-badge badge-sale">
          {discountPercent}% OFF
        </span>
      ) : null}
      
      <div 
        className="product-image-container" 
        onClick={() => navigate(`/product/${product.id}`)} 
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={productImage} 
          alt={productName} 
          onError={(e) => { e.target.src = '/assets/product_pooja_kit.png'; }}
        />
      </div>
      
      <div className="product-info">
        <h3 
          className="product-title" 
          onClick={() => navigate(`/product/${product.id}`)} 
          style={{ cursor: 'pointer' }}
        >
          {productName}
        </h3>
        
        <p className="product-desc">{productDesc}</p>
        
        {/* Variant selector */}
        {hasVariants && (
          <div style={{ marginBottom: '10px' }}>
            <select 
              style={{ 
                width: '100%', 
                padding: '6px 10px', 
                borderRadius: '6px', 
                border: '1px solid #ddd', 
                fontSize: '13px', 
                outline: 'none',
                background: '#fff',
                cursor: 'pointer'
              }}
              value={selectedVariantIndex}
              onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
            >
              {product.variants.map((v, i) => (
                <option key={i} value={i}>
                  {translateDynamic(v.attribute)} - ₹{v.price} {v.stock !== undefined && v.stock <= 0 ? (language === 'te' ? '(స్టాక్ లేదు)' : '(Out of stock)') : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="product-price-row">
          <span className="product-price">₹{currentPrice}</span>
          {product.oldPrice && product.oldPrice > currentPrice && (
            <span className="product-old-price">₹{product.oldPrice}</span>
          )}
        </div>
        
        <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <div className="stars" style={{ display: 'flex' }}>
            {renderStars(product.rating)}
          </div>
          <span className="review-count" style={{ fontSize: '12px', color: '#888' }}>({product.reviews || 0})</span>
          {currentStock > 0 && currentStock <= 5 && (
            <span style={{ fontSize: '11px', color: '#e65100', fontWeight: 600, marginLeft: 'auto' }}>
              {language === 'te' ? `కేవలం ${currentStock} మాత్రమే!` : `Only ${currentStock} left!`}
            </span>
          )}
        </div>
        
        <div className="product-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button 
            className="btn-add-cart" 
            onClick={handleAddToCart} 
            disabled={isOutOfStock}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '8px',
              border: '1px solid #C53018',
              background: '#fff',
              color: '#C53018',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              opacity: isOutOfStock ? 0.5 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            title={isOutOfStock ? t('common.out_of_stock') : t('common.add_to_cart')}
          >
            <ShoppingCart size={16} />
          </button>
          
          <button 
            className="btn-primary" 
            onClick={handleBuyNow} 
            disabled={isOutOfStock}
            style={{ 
              flex: 1, 
              padding: '8px 14px', 
              fontSize: '13px', 
              fontWeight: 600,
              borderRadius: '8px',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              opacity: isOutOfStock ? 0.5 : 1,
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {isOutOfStock ? (language === 'te' ? 'అమ్ముడైపోయింది' : 'Sold Out') : t('common.buy_now')}
          </button>
          
          <button 
            className="btn-wishlist" 
            style={{ 
              padding: '8px', 
              cursor: 'pointer',
              borderRadius: '8px',
              border: '1px solid #eee',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
              if (onShowToast) {
                onShowToast(inWishlist 
                  ? (language === 'te' ? `విష్‌లిస్ట్ నుండి "${productName}" తొలగించబడింది` : `Removed "${product.name}" from Wishlist`)
                  : (language === 'te' ? `విష్‌లిస్ట్‌లో "${productName}" భద్రపరచబడింది!` : `Saved "${product.name}" to Wishlist!`));
              }
            }} 
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart size={16} color="#C53018" fill={inWishlist ? "#C53018" : "transparent"} />
          </button>
        </div>
      </div>
    </div>
  );
};

const altarHotspots = [
  {
    id: 'diya',
    x: 22,
    y: 40,
    icon: '🪔',
    shortEn: 'Akhand Diya',
    shortTe: 'అఖండ దీపం',
    titleEn: 'Handcrafted Brass Akhanda Diya',
    titleTe: 'ఇత్తడి అఖండ దీపం & జ్యోతి',
    descEn: 'Traditional pure brass deepam with steady sacred flame for enduring positive energy.',
    descTe: 'నిత్య గృహ శాంతి మరియు దివ్య తేజస్సు కొరకు శ్రేష్టమైన సాంప్రదాయ ఇత్తడి దీపం.',
    priceEn: 'From ₹699',
    priceTe: '₹699 నుండి',
    catId: 4,
    catLabelEn: 'Browse Brass Diyas',
    catLabelTe: 'ఇత్తడి దీపాలు చూడండి'
  },
  {
    id: 'kalash',
    x: 52,
    y: 35,
    icon: '🪷',
    shortEn: 'Sacred Kalash',
    shortTe: 'పూర్ణకుంభం',
    titleEn: 'Consecrated Kalash & Narikela',
    titleTe: 'పవిత్ర పూర్ణకుంభం & కలశం',
    descEn: 'Consecrated copper-brass kumbha with 5 mango leaves, sacred moli & sacred coconut.',
    descTe: 'పంచ పల్లవాలు, రక్షా సూత్రం మరియు మంత్రపూత కొబ్బరికాయతో కూడిన పవిత్ర కలశం.',
    priceEn: 'From ₹899',
    priceTe: '₹899 నుండి',
    catId: 1,
    catLabelEn: 'View Full Kits',
    catLabelTe: 'పూజా కిట్లు చూడండి'
  },
  {
    id: 'thali',
    x: 44,
    y: 66,
    icon: '✨',
    shortEn: 'Kumkum & Chandan',
    shortTe: 'కుంకుమ-చందనం',
    titleEn: 'Ashtagandha, Kumkum & Pushpam Thali',
    titleTe: 'కుంకుమ, చందనం & పుష్ప తాంబూలం',
    descEn: '100% pure turmeric roli, Malayagiri sandalwood paste, fresh pushpam & sacred grains.',
    descTe: 'స్వచ్ఛమైన పసుపు కుంకుమ, మలయగిరి చందనం, పుష్పాలు & మంగళకర అక్షతలు.',
    priceEn: 'From ₹199',
    priceTe: '₹199 నుండి',
    catId: 5,
    catLabelEn: 'View Tilak Essentials',
    catLabelTe: 'చందన ద్రవ్యాలు చూడండి'
  },
  {
    id: 'box',
    x: 80,
    y: 54,
    icon: '📦',
    shortEn: 'Pooja Samagri Kit',
    shortTe: 'పూజా కిట్',
    titleEn: 'Sealed 32+ Ritual Samagri Kit Box',
    titleTe: 'సీల్డ్ 32+ పూజా సామాగ్రి కిట్',
    descEn: 'Hermetically packaged tamper-proof box with complete Vedic samagri and vrat katha.',
    descTe: 'సంకల్ప క్షణం వరకు పవిత్రతను భద్రపరిచే 32+ వస్తువుల సంపూర్ణ రక్షిత పూజా కిట్.',
    priceEn: 'From ₹999',
    priceTe: '₹999 నుండి',
    catId: 1,
    catLabelEn: 'Explore Full Kits',
    catLabelTe: 'సంపూర్ణ కిట్లు చూడండి'
  }
];

const quickRitualIntents = [
  { id: 'all', icon: '🪷', labelEn: 'All Essentials', labelTe: 'సమస్త సామాగ్రి' },
  { id: 1, icon: '📦', labelEn: 'Pooja Kits', labelTe: 'పూజా కిట్లు' },
  { id: 2, icon: '🔥', labelEn: 'Homam Dravya', labelTe: 'హవన ద్రవ్యాలు' },
  { id: 4, icon: '🪔', labelEn: 'Brass Diyas', labelTe: 'ఇత్తడి దీపాలు' },
  { id: 3, icon: '✨', labelEn: 'Dhoop & Incense', labelTe: 'సుగంధ ధూపం' },
  { id: 5, icon: '🌸', labelEn: 'Kumkum & Chandan', labelTe: 'కుంకుమ & చందనం' }
];

export default function Shop() {
  const { categories, products } = useContext(DataContext);
  const { t, translateDynamic, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params or default
  const paramCat = searchParams.get('cat');
  const paramSearch = searchParams.get('search');

  const [activeCategory, setActiveCategory] = useState(paramCat ? (paramCat === 'all' ? 'all' : Number(paramCat)) : 'all');
  const [searchQuery, setSearchQuery] = useState(paramSearch || '');
  const [priceRange, setPriceRange] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [toastMessage, setToastMessage] = useState('');
  const [activeHotspot, setActiveHotspot] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sync category with URL query param if it changes externally
  useEffect(() => {
    if (paramCat) {
      setActiveCategory(paramCat === 'all' ? 'all' : Number(paramCat));
    }
  }, [paramCat]);

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      searchParams.set('search', val);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => (p.status || 'active') !== 'inactive');

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(p => Number(p.categoryid) === Number(activeCategory));
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.desc && p.desc.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.highlights && p.highlights.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (priceRange === 'under500') {
      result = result.filter(p => Number(p.price) < 500);
    } else if (priceRange === '500-1000') {
      result = result.filter(p => Number(p.price) >= 500 && Number(p.price) <= 1000);
    } else if (priceRange === '1000-2500') {
      result = result.filter(p => Number(p.price) >= 1000 && Number(p.price) <= 2500);
    } else if (priceRange === 'above2500') {
      result = result.filter(p => Number(p.price) > 2500);
    }

    // 4. In Stock Filter
    if (inStockOnly) {
      result = result.filter(p => p.stock === undefined || Number(p.stock) > 0);
    }

    // 5. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    } else {
      // Featured / default: put featured & bestsellers first
      result.sort((a, b) => (b.featured || b.bestseller ? 1 : 0) - (a.featured || a.bestseller ? 1 : 0));
    }

    return result;
  }, [products, activeCategory, searchQuery, priceRange, inStockOnly, sortBy]);

  const activeCategoryObj = categories.find(c => c.id === activeCategory);
  const activeCategoryName = activeCategory === 'all' 
    ? (language === 'te' ? 'సమస్త పూజా సామాగ్రి' : 'All Pooja Essentials') 
    : (activeCategoryObj ? translateDynamic(activeCategoryObj, 'name') : (language === 'te' ? 'ఉత్పత్తులు' : 'Products'));

  return (
    <div className="shop-page">
      {/* Flagship Panoramic Sacred Altar Sanctuary Hero */}
      <section className="shop-flagship-hero">
        <div className="shop-flagship-stage">
          
          <div className="shop-stage-grid">
            {/* Left Editorial Sanctum Column */}
            <div className="shop-editorial-col">
              {/* Live Sanctity Status Badge */}
              <div className="shop-flagship-live-badge">
                <span className="shop-pulse-dot"></span>
                <span className="shop-live-text">
                  {language === 'te' 
                    ? 'శ్రీ వేద సంప్రదాయం · నిత్యం మంత్రపూత స్వచ్ఛత' 
                    : 'VEDIC SANCTITY ASSURED · MANTRA CONSECRATED'}
                </span>
              </div>

              {/* Grand Typographic Heading */}
              <h1 className="shop-flagship-title">
                {language === 'te' ? (
                  <>
                    పవిత్ర పూజా ద్రవ్యాలు, <br />
                    <span className="shop-gold-gradient-text">భక్తి శ్రద్ధలతో మీ చెంతకు</span>
                  </>
                ) : (
                  <>
                    POOJA ESSENTIALS, <br />
                    <span className="shop-gold-gradient-text">DELIVERED WITH DEVOTION</span>
                  </>
                )}
              </h1>

              <p className="shop-flagship-sub">
                {language === 'te'
                  ? 'మీ పవిత్ర క్రతువులు, హోమాలు మరియు నిత్య దైవారాధనకు అవసరమైన సమస్త సామాగ్రి. 100% శాస్త్రోక్తమైనది, రసాయన రహితమైనది మరియు సురక్షిత సీల్డ్ ప్యాకింగ్‌తో మీ గడపకే చేరుతుంది.'
                  : 'Everything you need for your sacred rituals, homams, and daily poojas. 100% pure, lab-tested, shastra-compliant, and securely delivered directly to your doorstep.'}
              </p>

              {/* Integrated Hero Quick-Search Bar */}
              <div className="shop-hero-search-wrapper">
                <div className="shop-hero-search-bar">
                  <Search size={18} className="shop-hero-search-icon" />
                  <input 
                    type="text" 
                    placeholder={language === 'te' ? 'పూజా సామాగ్రిని వెతకండి (ఉదా: సత్యనారాయణ కిట్, ఇత్తడి దీపాలు, కుంకుమ)...' : 'Search sacred essentials (e.g., Satyanarayana kit, Brass Diya, Pure Camphor)...'}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="shop-hero-search-input"
                  />
                  {searchQuery ? (
                    <button 
                      type="button" 
                      className="shop-hero-search-clear-btn" 
                      onClick={() => handleSearchChange({ target: { value: '' } })}
                      title="Clear Search"
                    >
                      <X size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="shop-hero-search-action-btn"
                      onClick={() => {
                        const el = document.querySelector('.shop-main-layout');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {language === 'te' ? 'శోధించండి' : 'Search'}
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive Ritual Intent Pills (Unique Quick Category Switcher) */}
              <div className="shop-intent-nav-wrap">
                <div className="shop-intent-nav-label">
                  <Sparkles size={13} color="#D4AF37" />
                  <span>{language === 'te' ? 'శీఘ్ర వర్గాలు:' : 'Quick Ritual Select:'}</span>
                </div>
                <div className="shop-intent-pills-row">
                  {quickRitualIntents.map(intent => {
                    const isActive = activeCategory === intent.id;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        className={`shop-intent-pill ${isActive ? 'active' : ''}`}
                        onClick={() => {
                          handleCategorySelect(intent.id);
                          const el = document.querySelector('.shop-main-layout');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        <span className="shop-intent-emoji">{intent.icon}</span>
                        <span className="shop-intent-title">
                          {language === 'te' ? intent.labelTe : intent.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Devotee Verification Row */}
              <div className="shop-flagship-metrics">
                <div className="shop-metric-item">
                  <span className="shop-metric-val">4.98 ★</span>
                  <span className="shop-metric-lbl">{language === 'te' ? 'భక్తజన విశ్వాసం' : 'Devotee Rating'}</span>
                </div>
                <div className="shop-metric-sep"></div>
                <div className="shop-metric-item">
                  <span className="shop-metric-val">12,500+</span>
                  <span className="shop-metric-lbl">{language === 'te' ? 'సంకల్ప పూజలు' : 'Rituals Blessed'}</span>
                </div>
                <div className="shop-metric-sep"></div>
                <div className="shop-metric-item">
                  <span className="shop-metric-val">100%</span>
                  <span className="shop-metric-lbl">{language === 'te' ? 'శాస్త్రోక్త స్వచ్ఛత' : 'Shastric Purity'}</span>
                </div>
              </div>
            </div>

            {/* Right Altar Showcase Card with Interactive Explorer */}
            <div className="shop-altar-canvas-col">
              <div className="shop-altar-card">
                {/* Ornate Gold Filigree Corner Accents */}
                <div className="shop-altar-corner top-left"></div>
                <div className="shop-altar-corner top-right"></div>
                <div className="shop-altar-corner bottom-left"></div>
                <div className="shop-altar-corner bottom-right"></div>

                {/* Card Top Header Strip */}
                <div className="shop-altar-header-strip">
                  <div className="shop-altar-badge-live">
                    <span className="shop-altar-flame-icon">🪔</span>
                    <span className="shop-altar-badge-title">
                      {language === 'te' ? 'దివ్య నిత్య పూజా వేదిక' : 'SACRED DAILY ALTAR SETUP'}
                    </span>
                  </div>
                  <div className="shop-altar-consecrated-tag">
                    <ShieldCheck size={13} color="#2E7D32" />
                    <span>{language === 'te' ? '100% శాస్త్రోక్తం' : 'VEDIC ASSURED'}</span>
                  </div>
                </div>

                {/* Image Stage Container */}
                <div className="shop-altar-scene">
                  <img 
                    src="/assets/sacred_pooja_altar_cropped.jpg" 
                    alt="Master Sacred Altar with Kalash, Diya, and Consecrated Samagri" 
                    className="shop-altar-main-img" 
                  />
                  <div className="shop-altar-glow-aura"></div>
                  <div className="shop-altar-vignette"></div>

                  {/* Luminous Pulsing Hotspots */}
                  {altarHotspots.map(spot => {
                    const isOpened = activeHotspot === spot.id;
                    return (
                      <div 
                        key={spot.id} 
                        className={`shop-hotspot-anchor ${isOpened ? 'is-active' : ''}`}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        onMouseEnter={() => setActiveHotspot(spot.id)}
                        onMouseLeave={() => setActiveHotspot(null)}
                        onClick={() => setActiveHotspot(isOpened ? null : spot.id)}
                      >
                        <div className="shop-hotspot-pin">
                          <span className="shop-hotspot-pulse"></span>
                          <span className="shop-hotspot-center">{spot.icon}</span>
                        </div>

                        {/* Hotspot Floating Tooltip Card */}
                        <div className={`shop-hotspot-tooltip ${isOpened ? 'show' : ''}`}>
                          <div className="shop-tooltip-header">
                            <span className="shop-tooltip-icon">{spot.icon}</span>
                            <div className="shop-tooltip-titles">
                              <strong className="shop-tooltip-title">
                                {language === 'te' ? spot.titleTe : spot.titleEn}
                              </strong>
                              {spot.priceTe && (
                                <span className="shop-tooltip-price">
                                  {language === 'te' ? spot.priceTe : spot.priceEn}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="shop-tooltip-desc">
                            {language === 'te' ? spot.descTe : spot.descEn}
                          </p>
                          <button
                            type="button"
                            className="shop-tooltip-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect(spot.catId);
                              const el = document.querySelector('.shop-main-layout');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            <span>{language === 'te' ? spot.catLabelTe : spot.catLabelEn}</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Interactive Altar Item Quick-Nav Selector Strip */}
                <div className="shop-altar-quick-nav">
                  <div className="shop-altar-quick-nav-header">
                    <Sparkles size={13} className="shop-hint-sparkle" />
                    <span>{language === 'te' ? 'వేదిక ద్రవ్యాలు (స్పర్శించి చూడండి):' : 'Altar Essentials (Tap to explore):'}</span>
                  </div>
                  <div className="shop-altar-chips-grid">
                    {altarHotspots.map(spot => {
                      const isSelected = activeHotspot === spot.id;
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          className={`shop-altar-chip ${isSelected ? 'active' : ''}`}
                          onClick={() => setActiveHotspot(isSelected ? null : spot.id)}
                          onMouseEnter={() => setActiveHotspot(spot.id)}
                        >
                          <span className="shop-chip-icon">{spot.icon}</span>
                          <span className="shop-chip-label">
                            {language === 'te' ? spot.shortTe : spot.shortEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Floating Frosted Glass Dock across the bottom */}
          <div className="shop-luxury-dock">
            <div className="shop-dock-pillar">
              <span className="shop-dock-num">01</span>
              <div className="shop-dock-icon-wrap icon-amber">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
              <div className="shop-dock-content">
                <strong className="shop-dock-title">
                  {language === 'te' ? '100% ప్రామాణిక సామాగ్రి' : '100% Authentic Samagri'}
                </strong>
                <span className="shop-dock-sub">
                  {language === 'te' ? 'ప్రయోగశాల పరీక్షిత స్వచ్ఛత' : 'Lab-tested & shastra-compliant'}
                </span>
              </div>
            </div>

            <div className="shop-dock-divider"></div>

            <div className="shop-dock-pillar">
              <span className="shop-dock-num">02</span>
              <div className="shop-dock-icon-wrap icon-emerald">
                <PackageOpen size={22} strokeWidth={2.2} />
              </div>
              <div className="shop-dock-content">
                <strong className="shop-dock-title">
                  {language === 'te' ? 'సురక్షిత సీల్డ్ ప్యాకింగ్' : 'Tamper-Proof Packaging'}
                </strong>
                <span className="shop-dock-sub">
                  {language === 'te' ? 'పవిత్రతా సంరక్షణ' : 'Sealed to preserve sanctity'}
                </span>
              </div>
            </div>

            <div className="shop-dock-divider"></div>

            <div className="shop-dock-pillar">
              <span className="shop-dock-num">03</span>
              <div className="shop-dock-icon-wrap icon-gold">
                <Truck size={22} strokeWidth={2.2} />
              </div>
              <div className="shop-dock-content">
                <strong className="shop-dock-title">
                  {language === 'te' ? '₹499 పైన ఉచిత డెలివరీ' : 'Free Delivery Over ₹499'}
                </strong>
                <span className="shop-dock-sub">
                  {language === 'te' ? 'భారతదేశమంతటా త్వరిత రవాణా' : 'Swift express doorstep dispatch'}
                </span>
              </div>
            </div>

            <div className="shop-dock-divider"></div>

            <div className="shop-dock-pillar">
              <span className="shop-dock-num">04</span>
              <div className="shop-dock-icon-wrap icon-saffron">
                <RefreshCcw size={22} strokeWidth={2.2} />
              </div>
              <div className="shop-dock-content">
                <strong className="shop-dock-title">
                  {language === 'te' ? 'సులభమైన సహాయం & రిటర్న్స్' : 'Easy Returns & Support'}
                </strong>
                <span className="shop-dock-sub">
                  {language === 'te' ? '24/7 భక్తజన మార్గదర్శనం' : '24/7 dedicated assistance'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Layout */}
      <div className="shop-main-layout">
        {/* Desktop Sidebar Filters */}
        <aside className="shop-sidebar">
          {/* Categories Filter */}
          <div style={{ marginBottom: '28px' }}>
            <h2 className="shop-sidebar-title">{t('shop.categories', language === 'te' ? 'విభాగాలు' : 'Categories')}</h2>
            <div className="shop-sidebar-menu">
              <div 
                className={`shop-sidebar-item ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategorySelect('all')}
              >
                <div className="shop-sidebar-item-left">
                  <LayoutGrid size={18} className="shop-sidebar-icon" />
                  <span>{t('shop.all_products', language === 'te' ? 'సమస్త పూజా సామాగ్రి' : 'All Pooja Essentials')}</span>
                </div>
                <span style={{ fontSize: '12px', color: '#999' }}>{products.length}</span>
              </div>

              {categories.map(category => (
                <div 
                  key={category.id} 
                  className={`shop-sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="shop-sidebar-item-left">
                    {(() => {
                      const IconComponent = iconMap[category.iconname] || Box;
                      return <IconComponent size={18} className="shop-sidebar-icon" />;
                    })()}
                    <span>{translateDynamic(category, 'name')}</span>
                  </div>
                  {category.product_count !== undefined && (
                    <span style={{ fontSize: '12px', color: '#999' }}>{category.product_count}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2A1C15', marginBottom: '14px' }}>
              {t('shop.price_range', language === 'te' ? 'ధర పరిధి' : 'Price Range')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'all', label: language === 'te' ? 'అన్ని ధరలు' : 'All Prices' },
                { id: 'under500', label: language === 'te' ? '₹500 లోపు' : 'Under ₹500' },
                { id: '500-1000', label: '₹500 - ₹1,000' },
                { id: '1000-2500', label: '₹1,000 - ₹2,500' },
                { id: 'above2500', label: language === 'te' ? '₹2,500 పైన' : 'Above ₹2,500' }
              ].map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
                  <input 
                    type="radio" 
                    name="priceFilter" 
                    value={opt.id} 
                    checked={priceRange === opt.id}
                    onChange={(e) => setPriceRange(e.target.value)}
                    style={{ accentColor: '#C53018' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div style={{ marginBottom: '28px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#2A1C15', marginBottom: '14px' }}>
              {t('shop.availability', language === 'te' ? 'లభ్యత' : 'Availability')}
            </h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
              <input 
                type="checkbox" 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)}
                style={{ accentColor: '#C53018' }}
              />
              <span>{t('shop.in_stock_only', language === 'te' ? 'స్టాక్ ఉన్నవి మాత్రమే' : 'In Stock Only')}</span>
            </label>
          </div>

          {/* Reset Filters */}
          <button 
            onClick={clearAllFilters}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: '#fff',
              color: '#666',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <RefreshCcw size={14} /> {t('shop.reset_filters', language === 'te' ? 'ఫిల్టర్లు రీసెట్ చేయండి' : 'Reset All Filters')}
          </button>
        </aside>

        {/* Product Grid Area */}
        <div className="shop-content-area">
          {/* Top Search & Filter Bar */}
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #eee',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={18} color="#888" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                placeholder={t('shop.search_placeholder')}
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 38px',
                  borderRadius: '24px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  outline: 'none',
                  background: '#fafafa'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#C53018'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#ddd'; e.target.style.background = '#fafafa'; }}
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); searchParams.delete('search'); setSearchParams(searchParams); }}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#777', whiteSpace: 'nowrap' }}>{t('shop.sort_by')}:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '9px 14px',
                  borderRadius: '20px',
                  border: '1px solid #ddd',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#333',
                  background: '#fff',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="featured">{language === 'te' ? 'ప్రత్యేకమైనవి' : 'Featured'}</option>
                <option value="price-low">{language === 'te' ? 'ధర: తక్కువ నుండి ఎక్కువ' : 'Price: Low to High'}</option>
                <option value="price-high">{language === 'te' ? 'ధర: ఎక్కువ నుండి తక్కువ' : 'Price: High to Low'}</option>
                <option value="rating">{language === 'te' ? 'భక్తుల రేటింగ్' : 'Customer Rating'}</option>
                <option value="newest">{language === 'te' ? 'కొత్తగా వచ్చినవి' : 'Newest Arrivals'}</option>
              </select>
            </div>
          </div>

          {/* Mobile Category Pills Strip */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '14px',
            marginBottom: '16px',
            scrollbarWidth: 'none'
          }}>
            <button
              onClick={() => handleCategorySelect('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: activeCategory === 'all' ? '1px solid #C53018' : '1px solid #ddd',
                background: activeCategory === 'all' ? '#FFF5F0' : '#fff',
                color: activeCategory === 'all' ? '#C53018' : '#555',
                fontWeight: activeCategory === 'all' ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {language === 'te' ? 'అన్ని వస్తువులు' : 'All Items'} ({products.length})
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: activeCategory === c.id ? '1px solid #C53018' : '1px solid #ddd',
                  background: activeCategory === c.id ? '#FFF5F0' : '#fff',
                  color: activeCategory === c.id ? '#C53018' : '#555',
                  fontWeight: activeCategory === c.id ? 600 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {translateDynamic(c, 'name')} {c.product_count !== undefined && `(${c.product_count})`}
              </button>
            ))}
          </div>

          {/* Header with Title and Result Count */}
          <div className="shop-content-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="shop-section-title" style={{ margin: 0 }}>{activeCategoryName}</h2>
              <span style={{ fontSize: '13px', color: '#888' }}>
                {language === 'te'
                  ? `మొత్తం ${products.length} వస్తువులలో ${filteredProducts.length} చూపిస్తున్నాము`
                  : `Showing ${filteredProducts.length} of ${products.length} products`}
              </span>
            </div>

            {/* Active Filters Summary */}
            {(activeCategory !== 'all' || searchQuery || priceRange !== 'all' || inStockOnly) && (
              <button 
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: '#C53018', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                {language === 'te' ? 'ఫిల్టర్లు తొలగించండి' : 'Clear Filters'}
              </button>
            )}
          </div>
          
          {/* Product Grid or Empty State */}
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onShowToast={showToast}
                />
              ))}
            </div>
          ) : (
            <div className="shop-empty-state">
              <div className="empty-state-icon-halo">
                <PackageOpen size={36} />
              </div>
              <h3 className="empty-state-title">
                {activeCategoryName !== 'All Products' && activeCategoryName !== 'All Items' && activeCategoryName !== 'సమస్త పూజా సామాగ్రి'
                  ? (language === 'te' ? `"${activeCategoryName}" విభాగంలో ప్రస్తుతం ఉత్పత్తులు లేవు` : `No Products in "${activeCategoryName}" Yet`)
                  : (language === 'te' ? 'మీ శోధనకు తగిన ఉత్పత్తులు లభించలేదు' : 'No Products Match Your Criteria')}
              </h3>
              <p className="empty-state-desc">
                {searchQuery
                  ? (language === 'te' ? `"${searchQuery}" పదానికి సరిపోలిన ఉత్పత్తులు కనుగొనబడలేదు. మరొక పదాన్ని ప్రయత్నించండి.` : `We couldn't find any products matching "${searchQuery}". Try a different keyword or reset your filters.`)
                  : (language === 'te' ? 'దయచేసి మరొక విభాగాన్ని ఎంచుకోండి లేదా మీ ఫిల్టర్లను సర్దుబాటు చేయండి.' : 'Try selecting a different category or adjusting your price and availability filters.')}
              </p>
              <div className="empty-state-actions">
                <button 
                  className="empty-state-btn-primary" 
                  onClick={clearAllFilters}
                >
                  <Sparkles size={16} /> {language === 'te' ? `అన్ని ఉత్పత్తులను చూడండి (${products.length})` : `View All Products (${products.length})`}
                </button>
                <button 
                  className="empty-state-btn-secondary"
                  onClick={() => navigate('/poojas')}
                >
                  <Flame size={16} /> {language === 'te' ? 'పూజలు & హోమాలను చూడండి' : 'Explore Poojas & Havans'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

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
          <Check size={18} color="#4ade80" />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
