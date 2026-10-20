import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_SEO = {
  '/': {
    title: 'Gnana Sudha — Divine Services, Verified Vedic Pandits & Pure Essentials',
    description: 'Book verified scholarly Vedic pandits for authentic poojas, homams, and rituals at home or temples. Explore pure, Shastra-certified pooja essentials across Hyderabad, Telangana, and Andhra Pradesh.'
  },
  '/poojas': {
    title: 'Vedic Poojas & Homams Booking | Gnana Sudha',
    description: 'Book traditional Vedic poojas, homams, havans, and vrathams performed by experienced purohits following authentic Vedic scriptures.'
  },
  '/pandit': {
    title: 'Book Verified Scholarly Pandits & Purohits | Gnana Sudha',
    description: 'Find qualified and verified Vedic priests for Grihapravesham, marriages, naming ceremonies, and all Hindu ritual traditions.'
  },
  '/shop': {
    title: 'Divine Pooja Essentials & Samagri Shop | Gnana Sudha',
    description: 'Order 100% authentic, Shastra-pure pooja kits, brass idols, dhoop, agarbatti, havan samagri and spiritual products with home delivery.'
  },
  '/contact': {
    title: 'Contact Us — Vedic Support & Inquiries | Gnana Sudha',
    description: 'Get in touch with our ritual coordination team for personalized pooja scheduling, pandit allocation, and divine service assistance.'
  },
  '/login': {
    title: 'Devotee Login | Gnana Sudha',
    description: 'Login to access your bookings, order history, saved addresses, and Vedic Sankalpam preferences on Gnana Sudha.'
  },
  '/register': {
    title: 'Devotee Registration | Gnana Sudha',
    description: 'Create your Gnana Sudha devotee account to schedule sacred poojas and receive auspicious panchangam updates.'
  },
  '/register-pandit': {
    title: 'Pandit Registration Portal | Gnana Sudha',
    description: 'Join Gnana Sudha as a verified Vedic scholar and priest to serve devotees with authentic Sanatana Dharma rituals.'
  },
  '/cart': {
    title: 'Shopping Cart | Gnana Sudha Sacred Essentials',
    description: 'Review your selected pooja kits, samagri essentials, and sacred items before secure checkout.'
  },
  '/checkout': {
    title: 'Secure Checkout | Gnana Sudha Divine Store',
    description: 'Complete your sacred order delivery details and payment on Gnana Sudha.'
  },
  '/profile': {
    title: 'Customer Profile & Spiritual Bookings | Gnana Sudha',
    description: 'Manage your profile, Vedic Sankalpam details, orders, and ritual bookings.'
  },
  '/videos': {
    title: 'Watch Sacred Devotional Videos & Vedic Rituals | Gnana Sudha',
    description: 'Explore poojas, homams, spiritual guidance, temple traditions, and devotional videos from Gnana Sudha.'
  }
};

export default function PageSEO() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    
    let seoData = ROUTE_SEO[pathname];
    
    if (!seoData) {
      if (pathname.startsWith('/product/')) {
        seoData = {
          title: 'Sacred Pooja Essential Details | Gnana Sudha',
          description: 'Explore authentic Shastra-pure pooja items and divine essentials from Gnana Sudha.'
        };
      } else if (pathname.startsWith('/admin')) {
        seoData = {
          title: 'Admin Management Portal | Gnana Sudha',
          description: 'Gnana Sudha administrative dashboard.'
        };
      } else {
        seoData = ROUTE_SEO['/'];
      }
    }

    if (seoData) {
      document.title = seoData.title;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', seoData.description);
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', seoData.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', seoData.description);

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', `https://gnanasudha.com${pathname === '/' ? '' : pathname}`);

      // Google Analytics 4 Route Navigation Tracking
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('config', 'G-PMD70ZVL46', {
          page_path: pathname + location.search,
          page_title: seoData.title,
          page_location: window.location.href
        });
      }
    }
  }, [location.pathname, location.search]);

  return null;
}
