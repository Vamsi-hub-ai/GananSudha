const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, 'local_store.json');

const DEFAULT_STORE = {
  admin_users: [
    { id: 1, username: 'admin', password: 'password', name: 'Admin User', created_at: new Date().toISOString() },
    { id: 2, username: 'Gnanasudha18@gmail.com', password: 'GnanaSudha@336', name: 'Gnana Sudha Admin', created_at: new Date().toISOString() }
  ],
  customers: [
    { id: 1, name: 'Vamsi', email: 'Vamsipallela31@gmail.com', password: 'Vamsi@123', created_at: new Date().toISOString() }
  ],
  categories: [
    { id: 1, name: 'Pooja Samagri', slug: 'pooja-samagri', desc: 'Curated pure samagri for daily and festive poojas.', image: '/assets/product_kalash.png', iconname: 'Box', display_order: 1, status: 'active' },
    { id: 2, name: 'Diyas & Lamps', slug: 'diyas-lamps', desc: 'Traditional brass akhand diyas, deepams and decorative brass lamps.', image: '/assets/product_diya.png', iconname: 'Flame', display_order: 2, status: 'active' },
    { id: 3, name: 'Idols & Murtis', slug: 'idols-murtis', desc: 'Spiritual brass, panchaloha murthis, yantras and altar decor.', image: '/assets/ganesha_popup_clean.jpg', iconname: 'LayoutGrid', display_order: 3, status: 'active' },
    { id: 4, name: 'Rudraksha & Malas', slug: 'rudraksha-malas', desc: 'Lab-tested genuine Nepal & Java Rudraksha beads and japa malas.', image: '/assets/product_rudraksha.png', iconname: 'Grid', display_order: 4, status: 'active' },
    { id: 5, name: 'Pooja Kits', slug: 'pooja-kits', desc: 'Complete, curated pooja kits for every sacred ritual and deity ceremony.', image: '/assets/product_pooja_kit.png', iconname: 'Box', display_order: 5, status: 'active' },
    { id: 6, name: 'Homam Samagri', slug: 'homam-samagri', desc: '108 pure shastra-compliant herbs, woods and offerings for holy havans.', image: '/assets/sacred_pooja_ritual.jpg', iconname: 'Flame', display_order: 6, status: 'active' },
    { id: 7, name: 'Incense & Dhoop', slug: 'incense-dhoop', desc: 'Hand-rolled, temple-grade natural incense sticks and organic dhoop cups.', image: '/assets/product_pooja_kit.png', iconname: 'Sparkles', display_order: 7, status: 'active' },
    { id: 8, name: 'Festival Essentials', slug: 'festival-essentials', desc: 'Special festive hampers and seasonal ritual essentials for all celebrations.', image: '/assets/product_pooja_kit.png', iconname: 'Book', display_order: 8, status: 'active' }
  ],
  products: [
    {
      id: 1,
      name: 'Sampoorna Satyanarayana Swamy Pooja Kit',
      slug: 'sampoorna-satyanarayana-pooja-kit',
      desc: 'Complete authentic ritual box containing 32+ essential items including pure turmeric, kumkum, sacred yellow cloth, panchamrut samagri, batti, and vrat katha book.',
      price: 999,
      oldPrice: 1299,
      categoryid: 1,
      sku: 'PK-SATYA-01',
      stock: 45,
      rating: 4.9,
      reviews: 128,
      badge_text: 'Best Seller',
      badge_type: 'bestseller',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png', '/assets/product_pooja_kit.png'],
      variants: [
        { attribute: 'Standard Kit (32 items)', price: 999, stock: 30, sku: 'PK-SAT-STD' },
        { attribute: 'Deluxe Brass Thali Kit', price: 1699, stock: 15, sku: 'PK-SAT-DLX' }
      ],
      highlights: '100% Shastra Compliant; Sealed tamper-proof packaging; Includes authentic Vrat Katha; Sourced directly from holy temples',
      usage_instructions: 'Unbox on a clean sacred chowki; Follow the step-by-step checklist provided in the box.',
      specifications: 'Weight: 1.5 kg; Shelf Life: 12 months; Country of Origin: India',
      featured: 1,
      bestseller: 1,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Pure Vedic Cow Ghee Diya Wicks (Pack of 100)',
      slug: 'pure-cow-ghee-diya-wicks-100',
      desc: 'Pre-soaked pure indigenous cow ghee cotton wicks infused with gentle camphor and sandalwood fragrance for effortless daily altar lighting.',
      price: 299,
      oldPrice: 399,
      categoryid: 4,
      sku: 'DY-GHEE-100',
      stock: 85,
      rating: 4.8,
      reviews: 94,
      badge_text: 'Popular',
      badge_type: 'popular',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png'],
      variants: [
        { attribute: 'Pack of 100', price: 299, stock: 50, sku: 'DY-GH-100' },
        { attribute: 'Pack of 200 (Value Saver)', price: 549, stock: 35, sku: 'DY-GH-200' }
      ],
      highlights: 'No wax or paraffin; Burns cleanly for 30+ minutes; Releases divine aroma; Suitable for Akhand deepam',
      usage_instructions: 'Place one wick directly in a diya lamp and light with matchstick. No extra ghee required.',
      specifications: 'Quantity: 100 wicks; Storage: Cool dry place; Base: 100% Desi Cow Ghee',
      featured: 1,
      bestseller: 0,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Authentic Ashtagandha Chandan & Roli Kumkum Set',
      slug: 'authentic-ashtagandha-chandan-kumkum-set',
      desc: 'Traditional temple-grade fragrance paste set made from 8 sacred herbs combined with natural turmeric roli kumkum for daily tilak.',
      price: 199,
      oldPrice: 249,
      categoryid: 5,
      sku: 'KC-ASHTA-01',
      stock: 120,
      rating: 4.9,
      reviews: 83,
      badge_text: 'Natural',
      badge_type: 'natural',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png'],
      variants: [
        { attribute: '50g Combo Jar', price: 199, stock: 70, sku: 'KC-ASH-50' },
        { attribute: '100g Combo Jar', price: 349, stock: 50, sku: 'KC-ASH-100' }
      ],
      highlights: '100% skin safe; Non-allergic natural herbs; Traditional fragrance; Long lasting tilak brightness',
      usage_instructions: 'Mix with a drop of Ganga jal or rose water and apply to the forehead/deity.',
      specifications: 'Pack Includes: 1x Chandan Paste (50g), 1x Kumkum (50g)',
      featured: 0,
      bestseller: 1,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Sacred Hawan Samagri with 108 Rare Vedic Herbs',
      slug: 'sacred-hawan-samagri-108-herbs',
      desc: 'Premium shastra-formulated hawan mixture containing Guggal, Jatamansi, Nagarmotha, Kamal Gatta, Agar-Tagar, and organic dry fruits.',
      price: 349,
      oldPrice: 449,
      categoryid: 2,
      sku: 'HW-SAM-350',
      stock: 65,
      rating: 4.9,
      reviews: 67,
      badge_text: '108 Herbs',
      badge_type: 'special',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png'],
      variants: [
        { attribute: '350g Pouch', price: 349, stock: 35, sku: 'HW-350' },
        { attribute: '700g Eco Box', price: 649, stock: 20, sku: 'HW-700' },
        { attribute: '1 kg Bulk Pack', price: 899, stock: 10, sku: 'HW-1000' }
      ],
      highlights: 'Contains zero saw-dust; 108 authentic Ayurvedic herbs; Pure air purifying properties; Creates sacred positive energy',
      usage_instructions: 'Offer into the consecrated agni kund during mantra chanting.',
      specifications: 'Net Weight: 350g / 700g / 1kg; Ingredients: 108 Ayurvedic medicinal woods & herbs',
      featured: 1,
      bestseller: 1,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Handcrafted Pure Brass Panchawala Diya',
      slug: 'handcrafted-pure-brass-panchawala-diya',
      desc: 'Master artisan crafted five-face traditional brass diya with peacock finial and sturdy weighted base, ideal for daily Aarti and Lakshmi pooja.',
      price: 699,
      oldPrice: 899,
      categoryid: 4,
      sku: 'DY-BRASS-5F',
      stock: 32,
      rating: 4.8,
      reviews: 41,
      badge_text: 'Handmade',
      badge_type: 'handcrafted',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png'],
      variants: [
        { attribute: 'Medium (6 inch)', price: 699, stock: 20, sku: 'DY-BR-M' },
        { attribute: 'Large (8.5 inch)', price: 1099, stock: 12, sku: 'DY-BR-L' }
      ],
      highlights: 'Virgin heavy-gauge brass; Golden glossy lacquer polish; 5 wick notches for Pancha Aarti; Easy to clean',
      usage_instructions: 'Wash with mild tamarind/lemon paste or brass polish to retain gleam.',
      specifications: 'Material: 100% Solid Brass; Weight: 420g; Height: 6 inches',
      featured: 1,
      bestseller: 0,
      status: 'active',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: 'Certified 5-Mukhi Indonesian Rudraksha Japa Mala',
      slug: 'certified-5-mukhi-rudraksha-japa-mala',
      desc: 'Natural 5-mukhi small 7mm Rudraksha beads strung in traditional knotting with tassel for Lord Shiva japa chanting and personal protection.',
      price: 1299,
      oldPrice: 1799,
      categoryid: 7,
      sku: 'RD-5M-MALA',
      stock: 28,
      rating: 4.9,
      reviews: 52,
      badge_text: 'Lab Certified',
      badge_type: 'certified',
      image: '/assets/product_pooja_kit.png',
      images: ['/assets/product_pooja_kit.png'],
      variants: [
        { attribute: '7mm Beads (108+1)', price: 1299, stock: 18, sku: 'RD-7MM' },
        { attribute: '8mm Beads with Silver Capping', price: 2499, stock: 10, sku: 'RD-8MM-SILVER' }
      ],
      highlights: 'Comes with X-Ray authenticity certificate; Purified & energized with Shiva mantras; Ideal for Gayatri and Mahamrityunjaya japa',
      usage_instructions: 'Wear after morning bath or hold between thumb and ring finger while chanting.',
      specifications: 'Bead Count: 108+1 Guru Bead; Bead Size: ~7mm; Origin: Indonesia',
      featured: 1,
      bestseller: 1,
      status: 'active',
      created_at: new Date().toISOString()
    }
  ],
  poojas: [
    {
      id: 1,
      name: 'Sri Satyanarayana Swamy Vratham',
      desc: 'Auspicious ritual dedicated to Lord Vishnu for peace, prosperity, removing obstacles, and family harmony.',
      price: 3500,
      discountPrice: 2999,
      img: '/assets/satyanarayana_vratham_1782492802363.png',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Gruhapravesham Pooja',
      desc: 'Sacred housewarming ceremony with Vastu Shanti and Navagraha blessings before entering your new home.',
      price: 5500,
      discountPrice: 4800,
      img: '/assets/gruhapravesham_pandit_1782492787455.png',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Vivaham (Vedic Wedding Rituals)',
      desc: 'Complete traditional wedding ceremonies performed strictly as per Vedic Shastras by senior scholarly priests.',
      price: 15000,
      discountPrice: 12500,
      img: '/assets/vivaham_priest_1782492816322.png',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Nitya Devatha Archana & Daily Pooja',
      desc: 'Daily devotional pooja performed at your home or office for divine positive vibrations and abundance.',
      price: 1500,
      discountPrice: 1200,
      img: '/assets/daily_pooja_1782492845891.png',
      created_at: new Date().toISOString()
    }
  ],
  homams: [
    {
      id: 1,
      name: 'Sri Maha Ganapathi Homam',
      desc: 'Powerful Vedic fire ritual invoking Lord Ganesha to eliminate hurdles, bring auspicious beginnings, and ensure success.',
      price: 4500,
      discountPrice: 3800,
      img: '/assets/homam_specialist_1782492829402.png',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Sudarshana Homam',
      desc: 'Vedic fire ritual dedicated to Lord Sudarshana for protection against negative energies, health restoration, and victory.',
      price: 5000,
      discountPrice: 4200,
      img: '/assets/homam_specialist_1782492829402.png',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Navagraha Homam',
      desc: 'Homam performed to appease all nine planetary deities, pacifying graha doshas and blessing you with prosperity and health.',
      price: 5500,
      discountPrice: 4600,
      img: '/assets/homam_specialist_1782492829402.png',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Maha Mrityunjaya Homam',
      desc: 'Sacred havan dedicated to Lord Shiva for health recovery, longevity, rejuvenation, and freedom from fear.',
      price: 6000,
      discountPrice: 5100,
      img: '/assets/homam_specialist_1782492829402.png',
      created_at: new Date().toISOString()
    }
  ],
  pandits: [
    {
      id: 1,
      username: 'pandit.sharma@gnanasudha.com',
      password: 'password123',
      name: 'Vidwan Rama Sharma',
      phone: '+91 98480 12345',
      specialization: 'Satyanarayana Vratham & Gruhapravesham',
      rating: '4.9',
      reviews: '124',
      status: 'Approved',
      gender: 'male',
      experience: '18+ years',
      img: '/assets/gruhapravesham_pandit_1782492787455.png',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      username: 'pandit.shastry@gnanasudha.com',
      password: 'password123',
      name: 'Acharya Venkata Shastry',
      phone: '+91 98480 23456',
      specialization: 'Homams, Havans & Vedic Vivaham',
      rating: '5.0',
      reviews: '98',
      status: 'Approved',
      gender: 'male',
      experience: '22+ years',
      img: '/assets/homam_specialist_1782492829402.png',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      username: 'pandita.gayatri@gnanasudha.com',
      password: 'password123',
      name: 'Manju',
      phone: '+91 98480 34567',
      specialization: 'Devi Poojas, Lalitha Sahasranamam & Chanting',
      rating: '4.9',
      reviews: '84',
      status: 'Approved',
      gender: 'female',
      experience: '15+ years',
      img: '/assets/female_pandit.png',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      username: 'pandit.vamsi@gnanasudha.com',
      password: 'password123',
      name: 'vamsi',
      phone: '+91 98480 45678',
      specialization: 'Vedic Rituals',
      rating: '5.0',
      reviews: '12',
      status: 'Approved',
      gender: 'male',
      experience: '0-2 Years',
      img: '/assets/male_pandit.png',
      created_at: new Date().toISOString()
    }
  ],
  coupons: [
    { id: 1, code: 'DIVINE10', discount: 10, expiry: '2027-12-31' },
    { id: 2, code: 'FESTIVE20', discount: 20, expiry: '2027-12-31' }
  ],
  consultations: [
    { id: 'muhurtam', title: 'Muhurtam', price: 1000, discountPrice: 900 },
    { id: 'vaastu', title: 'Vaastu Consultation', price: 1000, discountPrice: 900 },
    { id: 'horoscope', title: 'Horoscope Reading', price: 1000, discountPrice: 900 },
    { id: 'pooja', title: 'Book Pandit & Pooja', price: 1000, discountPrice: 900 }
  ],
  orders: [],
  banners: [
    {
      id: 1,
      title: 'Authentic Vedic Poojas & Homams',
      subtitle: 'Experience traditional rituals performed by verified Vedic priests in the comfort of your home.',
      image_path: '/assets/hero_illustration_1782464564369.png',
      mobile_image_path: null,
      alt_text: 'Vedic Poojas & Homams Banner',
      cta_text: 'Book a Pooja',
      cta_url: '/poojas',
      display_order: 1,
      status: 'active',
      start_at: null,
      end_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Premium Spiritual Store & Samagri',
      subtitle: 'Handpicked, 100% pure and shastra-compliant items delivered directly to your doorstep.',
      image_path: '/assets/product_pooja_kit.png',
      mobile_image_path: null,
      alt_text: 'Spiritual Store Banner',
      cta_text: 'Explore Shop',
      cta_url: '/shop',
      display_order: 2,
      status: 'active',
      start_at: null,
      end_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  product_reviews: [
    {
      id: 1,
      product_id: 1,
      customer_name: 'Suresh Iyer',
      customer_email: 'suresh@example.com',
      rating: 5,
      review_title: 'Extremely Complete and Pure',
      comment: 'Every single samagri item mentioned in the shastra was present in airtight packing. Saved so much time during our Satyanarayana Vratham.',
      verified_purchase: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      product_id: 1,
      customer_name: 'Ananya Sharma',
      customer_email: 'ananya@example.com',
      rating: 5,
      review_title: 'Authentic temple aroma',
      comment: 'The quality of the cow ghee, pure kumkum, and chandan was divine. Highly recommend Gnana Sudha.',
      verified_purchase: 1,
      created_at: new Date().toISOString()
    }
  ],
  bookings: [],
  pandit_availability: [],
  task_assignments: [],
  whatsapp_notifications: [],
  task_history: [],
  youtube_videos: [
    {
      id: 1,
      title: 'Sri Maha Ganapathi Homam & Sankalpam Rituals',
      title_te: 'శ్రీ మహా గణపతి హోమం & సంకల్ప పూజా విధానం',
      youtube_url: 'https://www.youtube.com/watch?v=V1bFr2SWP1I',
      youtube_video_id: 'V1bFr2SWP1I',
      description: 'Witness the sacred invocation of Lord Ganesha by scholarly Vedic pandits for removing obstacles and bringing prosperity.',
      description_te: 'విఘ్నాలు తొలగి సర్వకార్యాలలో విజయం, ఐశ్వర్యం సిద్ధించుటకై వేద పండితులు నిర్వహించే శ్రీ మహాగణపతి హోమ క్రతువు.',
      category: 'Homam',
      thumbnail_url: '',
      display_order: 1,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Sri Satyanarayana Swamy Vratam Complete Katha & Pooja',
      title_te: 'శ్రీ సత్యనారాయణ స్వామి వ్రతం సంపూర్ణ కథ & పూజ',
      youtube_url: 'https://www.youtube.com/watch?v=Ydd0cSY3I8s',
      youtube_video_id: 'Ydd0cSY3I8s',
      description: 'Step-by-step sacred Satyanarayana Swamy Pooja recitation, Kalasha sthapana, and prasadam offerings.',
      description_te: 'కలశ స్థాపన, పంచామృత అభిషేకం, వ్రత కథా శ్రవణం మరియు ప్రసాద వితరణతో కూడిన సంపూర్ణ సత్యనారాయణ పూజ.',
      category: 'Pooja',
      thumbnail_url: '',
      display_order: 2,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Maha Mrityunjaya Homam for Health, Healing & Longevity',
      title_te: 'మహా మృత్యుంజయ హోమం - ఆయురారోగ్య రక్ష',
      youtube_url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
      youtube_video_id: 'L_LUpnjgPso',
      description: 'Vedic recitation of the sacred Tryambakam mantra with 108 ahutis of amrita valli and sesame oblations.',
      description_te: 'ఆయురారోగ్య ప్రాప్తికి, అపమృత్యు దోష నివారణకు 108 అమృతవల్లి ఆహుతులతో సమర్పించే మహా మృత్యుంజయ హోమ విధానం.',
      category: 'Homam',
      thumbnail_url: '',
      display_order: 3,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Sacred Shiva Linga Rudrabhishekam with Namakam & Chamakam',
      title_te: 'శ్రీ శివలింగ రుద్రాభిషేకం - నమకం & చమకం',
      youtube_url: 'https://www.youtube.com/watch?v=-rKAOaS7Q3I',
      youtube_video_id: '-rKAOaS7Q3I',
      description: 'Holy abhishekam with milk, honey, sugarcane juice, and sacred vibhooti performed by senior purohits.',
      description_te: 'నమక చమక సహితంగా పాలు, తేనె, చెరకురసం మరియు విభూతితో సీనియర్ పురోహితులు నిర్వహించే పరమ పవిత్ర శివార్చన.',
      category: 'Pooja',
      thumbnail_url: '',
      display_order: 4,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Navagraha Shanti Homam & Dosha Nivarana Vidhanam',
      title_te: 'నవగ్రహ శాంతి హోమం & గ్రహ దోష నివారణ',
      youtube_url: 'https://www.youtube.com/watch?v=8SO4EzQuPv4',
      youtube_video_id: '8SO4EzQuPv4',
      description: 'Harmonizing the planetary influences through nine sacred grains and dedicated Vedic graha suktams.',
      description_te: 'నవధాన్యాలు, సమిధలు మరియు వేద సూక్తాలతో గ్రహ పీడలను నివారించే సంపూర్ణ నవగ్రహ శాంతి హోమం.',
      category: 'Spiritual Guidance',
      thumbnail_url: '',
      display_order: 5,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Sri Lakshmi Kubera Pooja for Abundance & Financial Harmony',
      title_te: 'శ్రీ లక్ష్మీ కుబేర పూజ - ధన ధాన్య సమృద్ధి',
      youtube_url: 'https://www.youtube.com/watch?v=u31qwQUeGuM',
      youtube_video_id: 'u31qwQUeGuM',
      description: 'Divine worship of Goddess Maha Lakshmi and Lord Kubera with lotus flowers and kumkum archana.',
      description_te: 'తామర పూలు, కుంకుమార్చనలతో అష్టైశ్వర్యాలు మరియు వ్యాపార అభివృద్ధిని ప్రసాదించే లక్ష్మీ కుబేర పూజ.',
      category: 'Festivals',
      thumbnail_url: '',
      display_order: 6,
      is_homepage_featured: 1,
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};


function loadStore() {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_STORE, null, 2), 'utf8');
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
    const data = fs.readFileSync(STORE_PATH, 'utf8');
    const parsed = JSON.parse(data);
    // Ensure all tables exist with initial defaults if empty
    for (const key of Object.keys(DEFAULT_STORE)) {
      if (!parsed[key] || (Array.isArray(parsed[key]) && parsed[key].length === 0 && DEFAULT_STORE[key] && DEFAULT_STORE[key].length > 0)) {
        parsed[key] = JSON.parse(JSON.stringify(DEFAULT_STORE[key]));
      }
    }
    return parsed;
  } catch (e) {
    console.error('Error loading local store:', e);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
}

function saveStore(store) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving local store:', e);
  }
}

// Local SQL query emulator
async function executeLocalQuery(sql, values = []) {
  const store = loadStore();
  const trimmed = sql.trim().replace(/\s+/g, ' ');

  // 1b. SELECT * FROM banners WHERE status = 'active'
  if (/SELECT \* FROM `?banners`? WHERE status = 'active'/i.test(trimmed)) {
    const now = new Date();
    let rows = (store.banners || []).filter(b => {
      if (b.status !== 'active') return false;
      if (b.start_at && new Date(b.start_at) > now) return false;
      if (b.end_at && new Date(b.end_at) < now) return false;
      return true;
    });
    rows.sort((a, b) => ((a.display_order ?? 0) - (b.display_order ?? 0)) || ((a.id ?? 0) - (b.id ?? 0)));
    return [rows, []];
  }

  // E-COMMERCE: Products query with JOIN
  if (/FROM products p LEFT JOIN categories c/i.test(trimmed)) {
    let prods = [...(store.products || [])];
    const catMap = {};
    (store.categories || []).forEach(c => { catMap[c.id] = c.name; });

    let valIdx = 0;
    if (/p\.categoryid = \?/i.test(trimmed)) {
      const catId = values[valIdx++];
      prods = prods.filter(p => Number(p.categoryid) === Number(catId));
    }
    if (/p\.name LIKE \?/i.test(trimmed)) {
      const searchRaw = values[valIdx++] || '';
      const cleanTerm = searchRaw.replace(/%/g, '').toLowerCase();
      valIdx += 2;
      prods = prods.filter(p => 
        (p.name && p.name.toLowerCase().includes(cleanTerm)) ||
        (p.desc && p.desc.toLowerCase().includes(cleanTerm)) ||
        (p.sku && p.sku.toLowerCase().includes(cleanTerm))
      );
    }
    if (/p\.price >= \?/i.test(trimmed)) {
      const minP = values[valIdx++];
      prods = prods.filter(p => Number(p.price) >= Number(minP));
    }
    if (/p\.price <= \?/i.test(trimmed)) {
      const maxP = values[valIdx++];
      prods = prods.filter(p => Number(p.price) <= Number(maxP));
    }
    if (/p\.stock > 0/i.test(trimmed)) {
      prods = prods.filter(p => (p.stock ?? 50) > 0);
    }
    if (/p\.featured = 1/i.test(trimmed)) {
      prods = prods.filter(p => p.featured === 1 || p.featured === true);
    }
    if (/p\.bestseller = 1/i.test(trimmed)) {
      prods = prods.filter(p => p.bestseller === 1 || p.bestseller === true);
    }
    if (/p\.id = \?/i.test(trimmed)) {
      const pId = values[valIdx++];
      prods = prods.filter(p => String(p.id) === String(pId));
    }

    if (/ORDER BY p\.price ASC/i.test(trimmed)) {
      prods.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (/ORDER BY p\.price DESC/i.test(trimmed)) {
      prods.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (/ORDER BY p\.rating DESC/i.test(trimmed)) {
      prods.sort((a, b) => (Number(b.rating) - Number(a.rating)) || (Number(b.reviews) - Number(a.reviews)));
    } else if (/ORDER BY p\.id DESC/i.test(trimmed)) {
      prods.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return [prods.map(p => ({ ...p, category_name: catMap[p.categoryid] || null })), []];
  }

  // E-COMMERCE: Categories with product count
  if (/FROM categories c LEFT JOIN products p/i.test(trimmed)) {
    const cats = [...(store.categories || [])];
    const prods = store.products || [];
    const formatted = cats.map(c => {
      const count = prods.filter(p => Number(p.categoryid) === Number(c.id)).length;
      return { ...c, product_count: count };
    });
    formatted.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    return [formatted, []];
  }

  // E-COMMERCE: Coupon lookup
  if (/FROM coupons WHERE UPPER\(code\) = \?/i.test(trimmed)) {
    const code = String(values[0]).toUpperCase();
    const rows = (store.coupons || []).filter(c => String(c.code).toUpperCase() === code);
    return [rows, []];
  }

  // E-COMMERCE: Product reviews lookup
  if (/FROM product_reviews WHERE product_id = \?/i.test(trimmed)) {
    const pid = values[0];
    const rows = (store.product_reviews || []).filter(r => String(r.product_id) === String(pid));
    rows.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [rows, []];
  }
  if (/FROM product_reviews r LEFT JOIN products p/i.test(trimmed)) {
    const rows = (store.product_reviews || []).map(r => {
      const prod = (store.products || []).find(p => String(p.id) === String(r.product_id));
      return {
        ...r,
        product_name: prod ? prod.name : 'Unknown Product',
        product_image: prod ? prod.image : '/assets/product_pooja_kit.png'
      };
    });
    rows.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [rows, []];
  }

  // E-COMMERCE: Stock updates
  if (/UPDATE products SET stock = GREATEST\(0, stock - \?\) WHERE id = \?/i.test(trimmed)) {
    const [qty, id] = values;
    if (store.products) {
      const p = store.products.find(x => String(x.id) === String(id));
      if (p) {
        p.stock = Math.max(0, (p.stock ?? 50) - Number(qty));
        saveStore(store);
      }
    }
    return [{ affectedRows: 1 }, []];
  }
  if (/UPDATE products SET stock = \? WHERE id = \?/i.test(trimmed)) {
    const [newStock, id] = values;
    if (store.products) {
      const p = store.products.find(x => String(x.id) === String(id));
      if (p) {
        p.stock = Number(newStock);
        saveStore(store);
      }
    }
    return [{ affectedRows: 1 }, []];
  }

  // E-COMMERCE: Orders queries
  if (/FROM orders WHERE/i.test(trimmed)) {
    let ords = [...(store.orders || [])];
    let vIdx = 0;
    if (/customerid = \?/i.test(trimmed)) {
      const cid = values[vIdx++];
      ords = ords.filter(o => String(o.customerid) === String(cid));
    }
    if (/status = \?/i.test(trimmed)) {
      const st = values[vIdx++];
      ords = ords.filter(o => o.status === st);
    }
    if (/order_number LIKE \?|id LIKE \?/i.test(trimmed)) {
      const s = String(values[vIdx++] || '').replace(/%/g, '').toLowerCase();
      vIdx += 2;
      ords = ords.filter(o => 
        (o.order_number && o.order_number.toLowerCase().includes(s)) ||
        String(o.id).includes(s) ||
        (JSON.stringify(o.shippingDetails || '').toLowerCase().includes(s))
      );
    }
    if (/id = \? OR order_number = \?/i.test(trimmed)) {
      const target = values[0];
      ords = ords.filter(o => String(o.id) === String(target) || o.order_number === String(target));
    }
    ords.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [ords, []];
  }

  // BOOKINGS queries
  if (/FROM bookings/i.test(trimmed)) {
    let bkgs = [...(store.bookings || [])];
    let vIdx = 0;

    if (/COUNT\(\*\)/i.test(trimmed)) {
      if (/status = \?/i.test(trimmed)) {
        const st = values[vIdx++];
        bkgs = bkgs.filter(b => b.status === st);
      }
      return [[{ count: bkgs.length }], []];
    }

    if (/id = \? OR booking_id = \?/i.test(trimmed)) {
      const target = values[0];
      bkgs = bkgs.filter(b => String(b.id) === String(target) || b.booking_id === String(target));
      return [bkgs, []];
    }
    if (/WHERE id = \?/i.test(trimmed)) {
      const target = values[0];
      bkgs = bkgs.filter(b => String(b.id) === String(target));
      return [bkgs, []];
    }
    if (/booking_id = \?/i.test(trimmed)) {
      const bId = values[0];
      bkgs = bkgs.filter(b => b.booking_id === String(bId));
      return [bkgs, []];
    }
    if (/customer_id = \? OR customer_phone = \?/i.test(trimmed)) {
      const cId = values[0];
      const cPhone = values[1] || values[0];
      bkgs = bkgs.filter(b => String(b.customer_id) === String(cId) || (b.customer_phone && b.customer_phone.includes(String(cPhone))));
      return [bkgs, []];
    }
    if (/status = \?/i.test(trimmed)) {
      const st = values[vIdx++];
      bkgs = bkgs.filter(b => b.status === st);
    }
    if (/service_type = \?/i.test(trimmed)) {
      const stype = values[vIdx++];
      bkgs = bkgs.filter(b => b.service_type === stype);
    }
    if (/booking_id LIKE \?|customer_name LIKE \?|customer_phone LIKE \?|service_name LIKE \?/i.test(trimmed)) {
      const term = String(values[vIdx++] || '').replace(/%/g, '').toLowerCase();
      vIdx += 3;
      bkgs = bkgs.filter(b => 
        (b.booking_id && b.booking_id.toLowerCase().includes(term)) ||
        (b.customer_name && b.customer_name.toLowerCase().includes(term)) ||
        (b.customer_phone && b.customer_phone.toLowerCase().includes(term)) ||
        (b.service_name && b.service_name.toLowerCase().includes(term)) ||
        (b.city && b.city.toLowerCase().includes(term))
      );
    }

    bkgs.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [bkgs, []];
  }

  // TASK_ASSIGNMENTS queries
  if (/FROM task_assignments/i.test(trimmed)) {
    let tasks = [...(store.task_assignments || [])];
    const pandits = store.pandits || [];
    
    // Attach pandit details for LEFT JOIN queries
    tasks = tasks.map(t => {
      const p = pandits.find(pandit => String(pandit.id) === String(t.pandit_id)) || {};
      return {
        ...t,
        pandit_name: p.name || 'Assigned Pandit',
        pandit_phone: p.phone || ''
      };
    });

    if (/GROUP BY scheduled_date/i.test(trimmed)) {
      const startD = values[0];
      const endD = values[1];
      const filtered = tasks.filter(t => t.scheduled_date >= startD && t.scheduled_date <= endD && t.status !== 'Cancelled');
      const counts = {};
      filtered.forEach(t => {
        counts[t.scheduled_date] = (counts[t.scheduled_date] || 0) + 1;
      });
      const rows = Object.entries(counts).map(([scheduled_date, count]) => ({ scheduled_date, count }));
      return [rows, []];
    }

    if (/id = \? OR task_reference = \?/i.test(trimmed)) {
      const val = values[0];
      tasks = tasks.filter(t => String(t.id) === String(val) || t.task_reference === String(val));
      return [tasks, []];
    }

    if (/WHERE id = \?/i.test(trimmed)) {
      const val = values[0];
      tasks = tasks.filter(t => String(t.id) === String(val));
      return [tasks, []];
    }

    if (/pandit_id = \?/i.test(trimmed)) {
      const pId = values[0];
      tasks = tasks.filter(t => String(t.pandit_id) === String(pId));
      if (/scheduled_date = \?/i.test(trimmed)) {
        const d = values[1];
        tasks = tasks.filter(t => String(t.scheduled_date).split('T')[0] === String(d).split('T')[0]);
      }
      if (/scheduled_date BETWEEN \? AND \?/i.test(trimmed)) {
        const start = values[1];
        const end = values[2];
        tasks = tasks.filter(t => t.scheduled_date >= start && t.scheduled_date <= end);
      }
      if (/status NOT IN \('Cancelled'\)|status != 'Cancelled'/i.test(trimmed)) {
        tasks = tasks.filter(t => t.status !== 'Cancelled');
      }
      if (/id != \? AND task_reference != \?/i.test(trimmed)) {
        const exc = values[values.length - 2];
        tasks = tasks.filter(t => String(t.id) !== String(exc) && t.task_reference !== String(exc));
      }
      return [tasks, []];
    }

    if (/scheduled_date = \?/i.test(trimmed)) {
      const d = values[0];
      tasks = tasks.filter(t => String(t.scheduled_date).split('T')[0] === String(d).split('T')[0]);
    }

    if (/status NOT IN \('Cancelled'\)|status != 'Cancelled'/i.test(trimmed)) {
      tasks = tasks.filter(t => t.status !== 'Cancelled');
    }

    if (/status = \?/i.test(trimmed)) {
      const s = values[0];
      tasks = tasks.filter(t => t.status === s);
    }

    tasks.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [tasks, []];
  }

  // PANDIT_AVAILABILITY queries
  if (/FROM pandit_availability/i.test(trimmed)) {
    let leaves = [...(store.pandit_availability || [])];
    if (/pandit_id = \? AND available_date = \?/i.test(trimmed)) {
      const pId = values[0];
      const d = values[1];
      leaves = leaves.filter(l => String(l.pandit_id) === String(pId) && String(l.available_date).split('T')[0] === String(d).split('T')[0]);
      if (/status IN \('unavailable', 'leave'\)/i.test(trimmed)) {
        leaves = leaves.filter(l => l.status === 'unavailable' || l.status === 'leave');
      }
      return [leaves, []];
    }
    if (/pandit_id = \?/i.test(trimmed)) {
      const pId = values[0];
      leaves = leaves.filter(l => String(l.pandit_id) === String(pId));
      leaves.sort((a, b) => new Date(a.available_date).getTime() - new Date(b.available_date).getTime());
      return [leaves, []];
    }
    return [leaves, []];
  }

  // WHATSAPP_NOTIFICATIONS queries
  if (/FROM whatsapp_notifications/i.test(trimmed)) {
    // Aggregation query: SELECT delivery_status, COUNT(*) as count FROM whatsapp_notifications GROUP BY delivery_status
    if (/GROUP BY delivery_status/i.test(trimmed)) {
      const counts = {};
      (store.whatsapp_notifications || []).forEach(n => {
        const st = (n.delivery_status || 'QUEUED').toUpperCase();
        counts[st] = (counts[st] || 0) + 1;
      });
      const rows = Object.entries(counts).map(([delivery_status, count]) => ({
        delivery_status,
        count
      }));
      return [rows, []];
    }

    let notifs = [...(store.whatsapp_notifications || [])];
    const pandits = store.pandits || [];
    notifs = notifs.map(n => {
      const p = pandits.find(pandit => String(pandit.id) === String(n.recipient_pandit_id)) || {};
      return {
        ...n,
        pandit_name: p.name || 'Pandit'
      };
    });

    if (/WHERE id = \?/i.test(trimmed)) {
      const nId = values[0];
      return [notifs.filter(n => String(n.id) === String(nId)), []];
    }
    if (/idempotency_key = \?/i.test(trimmed)) {
      const ikey = values[0];
      return [notifs.filter(n => n.idempotency_key === ikey), []];
    }
    if (/api_message_id = \?/i.test(trimmed)) {
      const mid = values[0];
      return [notifs.filter(n => n.api_message_id === mid), []];
    }
    if (/delivery_status = 'QUEUED'/i.test(trimmed) || /delivery_status IN \('QUEUED', 'PENDING'\)/i.test(trimmed)) {
      const now = new Date();
      return [notifs.filter(n => {
        const st = (n.delivery_status || '').toUpperCase();
        if (st === 'QUEUED' || st === 'PENDING') return true;
        if (st === 'FAILED' && (n.attempt_count || 0) < (n.max_attempts || 5)) {
          if (!n.next_retry_at) return true;
          return new Date(n.next_retry_at) <= now;
        }
        return false;
      }), []];
    }
    if (/task_reference = \?/i.test(trimmed)) {
      const tRef = values[0];
      notifs = notifs.filter(n => n.task_reference === tRef);
    }
    notifs.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [notifs, []];
  }

  // TASK_HISTORY queries
  if (/FROM task_history/i.test(trimmed)) {
    let history = [...(store.task_history || [])];
    if (/task_reference = \?/i.test(trimmed)) {
      const tRef = values[0];
      history = history.filter(h => h.task_reference === tRef);
    }
    history.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    return [history, []];
  }

  // COUNT queries emulator
  const countMatch = trimmed.match(/^SELECT COUNT\(\*\)(?:\s+AS\s+(\w+))?\s+FROM\s+`?(\w+)`?(?:\s+WHERE\s+(.*?))?$/i);
  if (countMatch) {
    const alias = countMatch[1] || 'count';
    const table = countMatch[2];
    const where = countMatch[3];
    let rows = store[table] || [];
    if (where) {
      if (/status\s*=\s*['"](\w+)['"]/i.test(where)) {
        const match = where.match(/status\s*=\s*['"](\w+)['"]/i);
        rows = rows.filter(r => r.status === match[1]);
      } else if (/status\s*=\s*\?/i.test(where) && values.length > 0) {
        rows = rows.filter(r => r.status === values[0]);
      }
      if (/is_homepage_featured\s*=\s*1/i.test(where)) {
        rows = rows.filter(r => r.is_homepage_featured === 1 || r.is_homepage_featured === true || r.is_homepage_featured === '1');
      }
    }
    return [[{ [alias]: rows.length }], []];
  }

  // Festivals queries
  if (/FROM festivals/i.test(trimmed)) {
    let fests = [...(store.festivals || [])];
    if (/year = \? AND month = \?/i.test(trimmed)) {
      const [y, m] = values;
      fests = fests.filter(f => Number(f.year) === Number(y) && Number(f.month) === Number(m));
    } else if (/year = \?/i.test(trimmed)) {
      const y = values[0];
      fests = fests.filter(f => Number(f.year) === Number(y));
    } else if (/festival_key = \?/i.test(trimmed)) {
      const k = values[0];
      fests = fests.filter(f => f.festival_key === k);
    }
    fests.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return [fests, []];
  }

  // YOUTUBE_VIDEOS queries (SELECT only)
  if (/^SELECT .*? FROM `?youtube_videos`?/i.test(trimmed)) {
    let videos = [...(store.youtube_videos || [])];

    // Status filter
    if (/status = 'published'/i.test(trimmed)) {
      videos = videos.filter(v => v.status === 'published');
    } else if (/status = 'draft'/i.test(trimmed)) {
      videos = videos.filter(v => v.status === 'draft');
    } else if (/status = \?/i.test(trimmed)) {
      const targetStatus = values.find(v => v === 'published' || v === 'draft');
      if (targetStatus) videos = videos.filter(v => v.status === targetStatus);
    }

    // By ID filter (whether alone or combined with status)
    if (/id = \?/i.test(trimmed)) {
      const vidId = values.find(v => typeof v === 'number' || (typeof v === 'string' && /^\d+$/.test(v) && !v.includes('%')));
      if (vidId !== undefined) {
        videos = videos.filter(v => String(v.id) === String(vidId));
      }
    }

    // Homepage featured filter
    if (/is_homepage_featured = 1/i.test(trimmed) || /is_homepage_featured = TRUE/i.test(trimmed)) {
      videos = videos.filter(v => v.is_homepage_featured === 1 || v.is_homepage_featured === true || v.is_homepage_featured === '1');
    } else if (/is_homepage_featured = 0/i.test(trimmed)) {
      videos = videos.filter(v => v.is_homepage_featured === 0 || v.is_homepage_featured === false || v.is_homepage_featured === '0');
    }

    // Category filter
    if (/category = \?/i.test(trimmed)) {
      const catVal = values.find(v => typeof v === 'string' && !v.includes('%') && v !== 'published' && v !== 'draft');
      if (catVal && catVal !== 'All') {
        videos = videos.filter(v => (v.category || '').toLowerCase() === catVal.toLowerCase());
      }
    }

    // Search filter
    if (/title LIKE \?/i.test(trimmed) || /description LIKE \?/i.test(trimmed)) {
      const searchPattern = values.find(v => typeof v === 'string' && v.startsWith('%'));
      if (searchPattern) {
        const cleanTerm = searchPattern.replace(/%/g, '').toLowerCase();
        videos = videos.filter(v => 
          (v.title && v.title.toLowerCase().includes(cleanTerm)) ||
          (v.description && v.description.toLowerCase().includes(cleanTerm)) ||
          (v.category && v.category.toLowerCase().includes(cleanTerm))
        );
      }
    }

    // Count query
    if (/COUNT\(\*\)/i.test(trimmed)) {
      return [[{ total: videos.length, count: videos.length }], []];
    }

    // Ordering
    if (/ORDER BY display_order ASC/i.test(trimmed)) {
      videos.sort((a, b) => ((a.display_order ?? 0) - (b.display_order ?? 0)) || (new Date(b.created_at) - new Date(a.created_at)));
    } else if (/ORDER BY created_at DESC/i.test(trimmed)) {
      videos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      videos.sort((a, b) => ((a.display_order ?? 0) - (b.display_order ?? 0)) || ((b.id ?? 0) - (a.id ?? 0)));
    }

    // LIMIT and OFFSET
    const limitMatch = trimmed.match(/LIMIT\s+(\d+|\?)(?:\s+OFFSET\s+(\d+|\?))?/i);
    if (limitMatch) {
      let limit = limitMatch[1] === '?' ? Number(values[values.length - (limitMatch[2] ? 2 : 1)]) : Number(limitMatch[1]);
      let offset = limitMatch[2] ? (limitMatch[2] === '?' ? Number(values[values.length - 1]) : Number(limitMatch[2])) : 0;
      if (!isNaN(limit) && limit > 0) {
        videos = videos.slice(offset || 0, (offset || 0) + limit);
      }
    }

    return [videos, []];
  }

  // 1. SELECT <columns> FROM <table> (with optional ORDER BY ...)
  const selectAllMatch = trimmed.match(/^SELECT (?:.*?) FROM `?(\w+)`?(?: ORDER BY .*)?$/i);
  if (selectAllMatch && !/ WHERE /i.test(trimmed)) {
    const table = selectAllMatch[1];
    let rows = [...(store[table] || [])];
    if (/ORDER BY display_order/i.test(trimmed)) {
      rows.sort((a, b) => ((a.display_order ?? 0) - (b.display_order ?? 0)) || ((a.id ?? 0) - (b.id ?? 0)));
    } else if (/ORDER BY id DESC/i.test(trimmed)) {
      rows.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }
    return [rows, []];
  }

  // 1c. SELECT id FROM banners WHERE image_path = ? OR mobile_image_path = ?
  if (/SELECT id FROM `?banners`? WHERE image_path = \? OR mobile_image_path = \?/i.test(trimmed)) {
    const targetPath = values[0];
    const rows = (store.banners || []).filter(b => b.image_path === targetPath || b.mobile_image_path === targetPath);
    return [rows.map(r => ({ id: r.id })), []];
  }

  // 2. SELECT <columns> FROM <table> WHERE id = ?
  const selectByIdMatch = trimmed.match(/^SELECT (?:.*?) FROM `?(\w+)`? WHERE id = \?$/i);
  if (selectByIdMatch) {
    const table = selectByIdMatch[1];
    const id = values[0];
    const rows = (store[table] || []).filter(r => String(r.id) === String(id));
    return [rows, []];
  }

  // 3. SELECT * FROM customers WHERE email = ?
  const selectCustomerByEmail = trimmed.match(/^SELECT \* FROM customers WHERE email = \?$/i);
  if (selectCustomerByEmail) {
    const email = values[0];
    const rows = (store.customers || []).filter(c => c.email && c.email.toLowerCase() === String(email).toLowerCase());
    return [rows, []];
  }

  // 4. SELECT * FROM pandits WHERE username = ?
  const selectPanditByUsername = trimmed.match(/^SELECT \* FROM pandits WHERE username = \?$/i);
  if (selectPanditByUsername) {
    const username = values[0];
    const rows = (store.pandits || []).filter(p => p.username && p.username.toLowerCase() === String(username).toLowerCase());
    return [rows, []];
  }

  // 5. Auth Login queries: SELECT * FROM <admin_users|customers|pandits> WHERE LOWER(<field>) = LOWER(?) AND password = ?
  const authMatch = trimmed.match(/^SELECT \* FROM `?(\w+)`? WHERE LOWER\((\w+)\) = LOWER\(\?\) AND password = \?$/i);
  if (authMatch) {
    const [, table, field] = authMatch;
    const [loginId, pwd] = values;
    const rows = (store[table] || []).filter(u => {
      const val = u[field];
      return val && val.toLowerCase() === String(loginId).toLowerCase() && u.password === pwd;
    });
    return [rows, []];
  }

  // 6. INSERT INTO <table> (...) VALUES (...)
  const insertMatch = trimmed.match(/^INSERT INTO `?(\w+)`? \((.*?)\) VALUES \((.*?)\)$/i);
  if (insertMatch) {
    const table = insertMatch[1];
    const colNames = insertMatch[2].split(',').map(c => c.replace(/[`'"]/g, '').trim());
    if (!store[table]) store[table] = [];

    const newRecord = {};
    colNames.forEach((col, idx) => {
      newRecord[col] = values[idx] !== undefined ? values[idx] : null;
    });

    const maxId = store[table].reduce((max, r) => (typeof r.id === 'number' && r.id > max ? r.id : max), 0);
    newRecord.id = newRecord.id || (maxId + 1);
    if (!newRecord.created_at) newRecord.created_at = new Date().toISOString();

    store[table].push(newRecord);
    saveStore(store);
    return [{ insertId: newRecord.id, affectedRows: 1 }, []];
  }

  // 7. UPDATE <table> SET ... WHERE <column> = ?
  const updateMatch = trimmed.match(/^UPDATE `?(\w+)`? SET (.*?) WHERE `?(\w+)`? = \?$/i);
  if (updateMatch) {
    const table = updateMatch[1];
    const setClause = updateMatch[2];
    const whereCol = updateMatch[3];
    const targetVal = values[values.length - 1];

    if (!store[table]) store[table] = [];
    const index = store[table].findIndex(r => String(r[whereCol]) === String(targetVal));

    if (index !== -1) {
      let vIdx = 0;
      const parts = setClause.split(',').map(s => s.trim());
      parts.forEach(part => {
        const eqIdx = part.indexOf('=');
        if (eqIdx !== -1) {
          const col = part.slice(0, eqIdx).replace(/[`'"]/g, '').trim();
          const rhs = part.slice(eqIdx + 1).trim();
          if (rhs === '?') {
            store[table][index][col] = values[vIdx++];
          } else if (/^['"].*['"]$/.test(rhs)) {
            store[table][index][col] = rhs.slice(1, -1);
          } else if (/^NOW\(\)$/i.test(rhs)) {
            store[table][index][col] = new Date().toISOString();
          } else if (/^NULL$/i.test(rhs)) {
            store[table][index][col] = null;
          } else {
            store[table][index][col] = rhs;
          }
        }
      });
      saveStore(store);
      return [{ affectedRows: 1 }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 8. DELETE FROM <table> WHERE id = ? or WHERE id = <number>
  const deleteMatch = trimmed.match(/^DELETE FROM `?(\w+)`? WHERE id = (\?|\d+)$/i);
  if (deleteMatch) {
    const table = deleteMatch[1];
    const id = deleteMatch[2] === '?' ? values[0] : deleteMatch[2];
    if (store[table]) {
      const before = store[table].length;
      store[table] = store[table].filter(r => String(r.id) !== String(id));
      saveStore(store);
      return [{ affectedRows: before - store[table].length }, []];
    }
    return [{ affectedRows: 0 }, []];
  }

  // 9. DDL / Schema queries (CREATE TABLE, INSERT IGNORE, SHOW TABLES) - safely handled in fallback
  if (/SHOW TABLES/i.test(trimmed)) {
    const tableRows = Object.keys(store).map(tableName => ({ Tables_in_database: tableName }));
    return [tableRows, []];
  }
  if (/CREATE TABLE|INSERT IGNORE|ALTER TABLE|DROP TABLE|DESCRIBE/i.test(trimmed)) {
    return [[], []];
  }

  console.warn('Unhandled local query:', sql, values);
  return [[], []];
}

module.exports = {
  loadStore,
  saveStore,
  executeLocalQuery,
  DEFAULT_STORE
};
