const { getDailyPanchang } = require('panchang-ts');
const pool = require('./db');

// Standard coordinates for Hyderabad, Telangana, India
const DEFAULT_LOCATION = {
  city: 'Hyderabad',
  state: 'Telangana',
  latitude: 17.3850,
  longitude: 78.4867,
  elevation: 505, // Elevation in meters for Hyderabad
  timezone: 'Asia/Kolkata'
};

// 60-year Jovian Samvatsara cycle in Telugu
const SAMVATSARA_NAMES_TE = [
  'ప్రభవ', 'విభవ', 'శుక్ల', 'ప్రమోదూత', 'ప్రజోత్పత్తి',
  'ఆంగీరస', 'శ్రీముఖ', 'భావ', 'యువ', 'ధాత',
  'ఈశ్వర', 'బహుధాన్య', 'ప్రమాది', 'విక్రమ', 'వృష',
  'చిత్రభాను', 'స్వభాను', 'తారణ', 'పార్థివ', 'వ్యయ',
  'సర్వజిత్తు', 'సర్వధారి', 'విరోధి', 'వికృతి', 'ఖర',
  'నందన', 'విజయ', 'జయ', 'మన్మథ', 'దుర్ముఖి',
  'హేవళంబి', 'విళంబి', 'వికారి', 'శార్వరి', 'ప్లవ',
  'శుభకృతు', 'శోభకృతు', 'క్రోధి', 'విశ్వావసు', 'పరాభవ',
  'ప్లవంగ', 'కీలక', 'సౌమ్య', 'సాధారణ', 'విరోధికృతు',
  'పరీధావి', 'ప్రమాదీచ', 'ఆనంద', 'రాక్షస', 'నల',
  'పింగళ', 'కాళయుక్తి', 'సిద్ధార్థి', 'రౌద్రి', 'దుర్మతి',
  'దుందుభి', 'రుధిరోద్గారి', 'రక్తాక్షి', 'క్రోధన', 'అక్షయ'
];

// Telugu & English Tithi names
const TITHI_NAMES_TE = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి',
  'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి',
  'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పౌర్ణమి',
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి',
  'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి',
  'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య'
];

const TITHI_NAMES_EN = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const NAKSHATRA_NAMES_TE = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర',
  'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర',
  'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ',
  'మూల', 'పూర్వాషాడ', 'ఉత్తరాషాడ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం',
  'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'
];

const YOGA_NAMES_TE = [
  'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన',
  'అతిగండ', 'సుకర్మ', 'ధృతి', 'శూల', 'గండ',
  'వృద్ధి', 'ధృవ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర',
  'సిద్ధి', 'వ్యతీపాత', 'వరియాన్', 'పరిఘ', 'శివ',
  'సిద్ధ', 'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ',
  'ఐంద్ర', 'వైధృతి'
];

const KARANA_MAP_TE = {
  'Bava': 'బవ', 'Balava': 'బాలవ', 'Kaulava': 'కౌలవ', 'Taitila': 'తైతుల',
  'Gara': 'గరజ', 'Vanija': 'వణిజ', 'Vishti': 'విష్టి (భద్ర)',
  'Shakuni': 'శకుని', 'Chatushpada': 'చతుష్పాద', 'Naga': 'నాగ', 'Kimstughna': 'కింస్తుఘ్న'
};

const VARAM_NAMES_TE = [
  'ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'
];

const VARAM_NAMES_EN = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const PAKSHAM_MAP_TE = {
  'Shukla': 'శుక్ల పక్షం',
  'Krishna': 'కృష్ణ పక్షం'
};

const MASA_NAMES_TE = [
  'చైత్ర మాసము', 'వైశాఖ మాసము', 'జ్యేష్ఠ మాసము', 'ఆషాఢ మాసము',
  'శ్రావణ మాసము', 'భాద్రపద మాసము', 'ఆశ్వయుజ మాసము', 'కార్తీక మాసము',
  'మార్గశిర మాసము', 'పుష్య మాసము', 'మాఘ మాసము', 'ఫాల్గుణ మాసము'
];

const MASA_NAMES_EN = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha',
  'Shravana', 'Bhadrapada', 'Ashwina (Ashwayuja)', 'Kartika',
  'Margashirsha', 'Pushya', 'Magha', 'Phalguna'
];

const RUTU_NAMES_TE = [
  'వసంత ఋతువు', 'గ్రీష్మ ఋతువు', 'వర్ష ఋతువు',
  'శరద్ ఋతువు', 'హేమంత ఋతువు', 'శిశిర ఋతువు'
];

// Classical Ekadashi names mapped by (MasaIndex * 2 + PakshaIndex: 0=Shukla, 1=Krishna)
const EKADASHI_MAP = {
  '0_0': { te: 'కామదా ఏకాదశి', en: 'Kamada Ekadashi' },
  '0_1': { te: 'వరూధినీ ఏకాదశి', en: 'Varuthini Ekadashi' },
  '1_0': { te: 'మోహినీ ఏకాదశి', en: 'Mohini Ekadashi' },
  '1_1': { te: 'అపరా ఏకాదశి', en: 'Apara Ekadashi' },
  '2_0': { te: 'నిర్జల ఏకాదశి', en: 'Nirjala Ekadashi' },
  '2_1': { te: 'యోగినీ ఏకాదశి', en: 'Yogini Ekadashi' },
  '3_0': { te: 'తొలి ఏకాదశి (శయన ఏకాదశి)', en: 'Toli Ekadashi (Sayana Ekadashi)' },
  '3_1': { te: 'కామికా ఏకాదశి', en: 'Kamika Ekadashi' },
  '4_0': { te: 'పుత్రదా ఏకాదశి', en: 'Putrada Ekadashi' },
  '4_1': { te: 'అజా ఏకాదశి', en: 'Aja Ekadashi' },
  '5_0': { te: 'పరివర్తినీ ఏకాదశి', en: 'Parivartini Ekadashi' },
  '5_1': { te: 'ఇందిరా ఏకాదశి', en: 'Indira Ekadashi' },
  '6_0': { te: 'పాశాంకుశ ఏకాదశి', en: 'Pashankusha Ekadashi' },
  '6_1': { te: 'రమా ఏకాదశి', en: 'Rama Ekadashi' },
  '7_0': { te: 'ప్రబోధినీ ఏకాదశి (ఉత్థాన ఏకాదశి)', en: 'Prabodhini Ekadashi (Utthana Ekadashi)' },
  '7_1': { te: 'ఉత్పన్న ఏకాదశి', en: 'Utpanna Ekadashi' },
  '8_0': { te: 'మోక్షద ఏకాదశి (గీతా జయంతి)', en: 'Mokshada Ekadashi (Gita Jayanti)' },
  '8_1': { te: 'సఫలా ఏకాదశి', en: 'Saphala Ekadashi' },
  '9_0': { te: 'వైకుంఠ ఏకాదశి (ముక్కోటి ఏకాదశి)', en: 'Vaikuntha Ekadashi (Mukkoti Ekadashi)' },
  '9_1': { te: 'షట్తిలా ఏకాదశి', en: 'Shattila Ekadashi' },
  '10_0': { te: 'భీష్మ ఏకాదశి (జయ ఏకాదశి)', en: 'Bhishma Ekadashi (Jaya Ekadashi)' },
  '10_1': { te: 'విజయా ఏకాదశి', en: 'Vijaya Ekadashi' },
  '11_0': { te: 'ఆమలకీ ఏకాదశి', en: 'Amalaki Ekadashi' },
  '11_1': { te: 'పాపవిమోచన ఏకాదశి', en: 'Papamochani Ekadashi' }
};

/**
 * Format time returned by panchang-ts without double-conversion (+5:30) errors.
 * panchang-ts stores IST local hours/minutes in its UTC fields.
 */
function formatTimeDetails(d, refDateString) {
  if (!d) return null;
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const time12 = `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
  const time24 = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  let dayIndicatorTe = '';
  let dayIndicatorEn = '';

  if (refDateString) {
    const parts = refDateString.split('-');
    const refDay = parseInt(parts[2], 10);
    const eventDay = d.getUTCDate();
    if (eventDay !== refDay) {
      dayIndicatorTe = ' (మరుసటి రోజు)';
      dayIndicatorEn = ' (Next day)';
    }
  }

  let teluguPrefix = '';
  if (hours >= 0 && hours < 6) {
    teluguPrefix = 'తెల్లవారుజామున ';
  } else if (hours >= 6 && hours < 12) {
    teluguPrefix = 'ఉదయం ';
  } else if (hours >= 12 && hours < 16) {
    teluguPrefix = 'మధ్యాహ్నం ';
  } else if (hours >= 16 && hours < 20) {
    teluguPrefix = 'సాయంత్రం ';
  } else {
    teluguPrefix = 'రాత్రి ';
  }

  const teluguDisplay = `${teluguPrefix}${time12}${dayIndicatorTe} వరకు`;
  const englishDisplay = `${time12}${dayIndicatorEn}`;

  return {
    time12,
    time24,
    teluguDisplay,
    englishDisplay,
    hours,
    minutes
  };
}

// In-memory cache for daily panchang calculations
const panchangCache = new Map();
const MAX_CACHE_SIZE = 365;

function getCacheKey(dateStr, lat, lon) {
  return `${dateStr}_${lat.toFixed(4)}_${lon.toFixed(4)}`;
}

/**
 * Calculates complete, accurate Vedic Panchangam for a given calendar date and location.
 */
function calculateDailyPanchang(dateString, customLocation = {}) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error('Invalid date format. Expected YYYY-MM-DD');
  }

  const location = {
    ...DEFAULT_LOCATION,
    ...customLocation
  };

  const cacheKey = getCacheKey(dateString, location.latitude, location.longitude);
  if (panchangCache.has(cacheKey)) {
    return panchangCache.get(cacheKey);
  }

  const dateObj = new Date(`${dateString}T00:00:00Z`);
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid calendar date provided');
  }

  const p = getDailyPanchang(dateObj, {
    latitude: location.latitude,
    longitude: location.longitude,
    elevation: location.elevation || 0
  }, {
    timezone: location.timezone || 'Asia/Kolkata',
    ayanamsa: 'lahiri',
    masaSystem: 'amanta'
  });

  const [y, m, d] = dateString.split('-').map(Number);
  const targetDateLocal = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = targetDateLocal.getUTCDay();
  const varamTe = VARAM_NAMES_TE[dayOfWeek];
  const varamEn = VARAM_NAMES_EN[dayOfWeek];

  const shakaYear = p.samvat?.shakaSamvat || (y - 78);
  const samvatIndex = (shakaYear + 11) % 60;
  const samvatsaraNameTe = `శ్రీ ${SAMVATSARA_NAMES_TE[samvatIndex]} నామ సంవత్సరం`;

  const masaIndex = p.chandramasa?.amantaIndex ?? p.chandramasa?.index ?? 0;
  const masaNameTe = MASA_NAMES_TE[masaIndex % 12] || 'చైత్ర మాసము';
  const masaNameEn = MASA_NAMES_EN[masaIndex % 12] || 'Chaitra';

  const rutuIndex = Math.floor(masaIndex / 2) % 6;
  const rutuNameTe = RUTU_NAMES_TE[rutuIndex];

  const solarRashi = p.masa?.index ?? 0;
  const isUttarayana = (solarRashi >= 9 || solarRashi <= 2);
  const ayanaTe = isUttarayana ? 'ఉత్తరాయణం' : 'దక్షిణాయనం';

  const sunriseInfo = formatTimeDetails(p.sunrise, dateString);
  const sunsetInfo = formatTimeDetails(p.sunset, dateString);

  const primaryTithi = p.tithis[0] || {};
  const tithiIndex = primaryTithi.index ?? 0;
  const tithiNameTe = TITHI_NAMES_TE[tithiIndex] || primaryTithi.name;
  const tithiNameEn = TITHI_NAMES_EN[tithiIndex] || primaryTithi.name;
  const tithiEndTime = formatTimeDetails(primaryTithi.endTime, dateString);
  const pakshamTe = PAKSHAM_MAP_TE[primaryTithi.paksha] || primaryTithi.paksha || 'శుక్ల పక్షం';

  let secondaryTithi = null;
  if (p.tithis.length > 1 && p.tithis[1]) {
    const nextT = p.tithis[1];
    const nextIdx = nextT.index ?? ((tithiIndex + 1) % 30);
    secondaryTithi = {
      nameTe: TITHI_NAMES_TE[nextIdx] || nextT.name,
      nameEn: TITHI_NAMES_EN[nextIdx] || nextT.name,
      endTime: formatTimeDetails(nextT.endTime, dateString)
    };
  }

  const primaryNakshatra = p.nakshatras[0] || {};
  const nakshatraIndex = primaryNakshatra.index ?? 0;
  const nakshatraNameTe = NAKSHATRA_NAMES_TE[nakshatraIndex] || primaryNakshatra.name;
  const nakshatraEndTime = formatTimeDetails(primaryNakshatra.endTime, dateString);

  let secondaryNakshatra = null;
  if (p.nakshatras.length > 1 && p.nakshatras[1]) {
    const nextN = p.nakshatras[1];
    const nextNIdx = nextN.index ?? ((nakshatraIndex + 1) % 27);
    secondaryNakshatra = {
      nameTe: NAKSHATRA_NAMES_TE[nextNIdx] || nextN.name,
      nameEn: nextN.name,
      endTime: formatTimeDetails(nextN.endTime, dateString)
    };
  }

  const primaryYoga = p.yogas[0] || {};
  const yogaIndex = primaryYoga.index ?? 0;
  const yogaNameTe = YOGA_NAMES_TE[yogaIndex] || primaryYoga.name;
  const yogaEndTime = formatTimeDetails(primaryYoga.endTime, dateString);

  const primaryKarana = p.karanas[0] || {};
  const karanaNameTe = KARANA_MAP_TE[primaryKarana.name] || primaryKarana.name;
  const karanaEndTime = formatTimeDetails(primaryKarana.endTime, dateString);

  const rahuKalam = p.rahuKalam ? {
    start: formatTimeDetails(p.rahuKalam.start, dateString),
    end: formatTimeDetails(p.rahuKalam.end, dateString)
  } : null;

  const yamaganda = p.yamaganda ? {
    start: formatTimeDetails(p.yamaganda.start, dateString),
    end: formatTimeDetails(p.yamaganda.end, dateString)
  } : null;

  const gulikaKalam = p.gulikaKalam ? {
    start: formatTimeDetails(p.gulikaKalam.start, dateString),
    end: formatTimeDetails(p.gulikaKalam.end, dateString)
  } : null;

  const abhijitMuhurta = p.abhijitMuhurta ? {
    start: formatTimeDetails(p.abhijitMuhurta.start, dateString),
    end: formatTimeDetails(p.abhijitMuhurta.end, dateString)
  } : null;

  const amritKala = p.amritKala ? {
    start: formatTimeDetails(p.amritKala.start, dateString),
    end: formatTimeDetails(p.amritKala.end, dateString)
  } : null;

  const varjyam = p.varjyam ? {
    start: formatTimeDetails(p.varjyam.start, dateString),
    end: formatTimeDetails(p.varjyam.end, dateString)
  } : null;

  const teluguMonths = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
  const englishMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dateDisplay = `${d} ${teluguMonths[m - 1]} ${y}`;
  const dateDisplayEn = `${d} ${englishMonths[m - 1]} ${y}`;

  const result = {
    date: dateString,
    dateDisplay,
    dateDisplayEn,
    varam: varamTe,
    varamEnglish: varamEn,
    yearName: samvatsaraNameTe,
    ayana: ayanaTe,
    rutu: rutuNameTe,
    masa: masaNameTe,
    masaEnglish: masaNameEn,
    paksham: pakshamTe,
    
    tithi: {
      name: tithiNameTe,
      nameEnglish: tithiNameEn,
      paksha: primaryTithi.paksha,
      displayText: `${pakshamTe} ${tithiNameTe}${tithiEndTime ? ' (' + tithiEndTime.teluguDisplay + ')' : ''}`,
      endTime: tithiEndTime,
      nextTithi: secondaryTithi
    },

    nakshatram: {
      name: nakshatraNameTe,
      nameEnglish: primaryNakshatra.name,
      displayText: `${nakshatraNameTe}${nakshatraEndTime ? ' (' + nakshatraEndTime.teluguDisplay + ')' : ''}`,
      endTime: nakshatraEndTime,
      nextNakshatra: secondaryNakshatra
    },

    yogam: {
      name: yogaNameTe,
      nameEnglish: primaryYoga.name,
      displayText: `${yogaNameTe}${yogaEndTime ? ' (' + yogaEndTime.teluguDisplay + ')' : ''}`,
      endTime: yogaEndTime
    },

    karanam: {
      name: karanaNameTe,
      nameEnglish: primaryKarana.name,
      displayText: `${karanaNameTe}${karanaEndTime ? ' (' + karanaEndTime.teluguDisplay + ')' : ''}`,
      endTime: karanaEndTime
    },

    sunrise: sunriseInfo ? sunriseInfo.time12 : '06:08 AM',
    sunset: sunsetInfo ? sunsetInfo.time12 : '05:56 PM',
    sunriseTime: sunriseInfo,
    sunsetTime: sunsetInfo,

    muhurtas: {
      rahuKalam: rahuKalam ? `${rahuKalam.start.time12} - ${rahuKalam.end.time12}` : null,
      yamaganda: yamaganda ? `${yamaganda.start.time12} - ${yamaganda.end.time12}` : null,
      gulikaKalam: gulikaKalam ? `${gulikaKalam.start.time12} - ${gulikaKalam.end.time12}` : null,
      abhijitMuhurta: abhijitMuhurta ? `${abhijitMuhurta.start.time12} - ${abhijitMuhurta.end.time12}` : null,
      amritKala: amritKala ? `${amritKala.start.time12} - ${amritKala.end.time12}` : null,
      varjyam: varjyam ? `${varjyam.start.time12} - ${varjyam.end.time12}` : null
    },

    thidhi: `${tithiNameTe}${tithiEndTime ? ' ' + tithiEndTime.teluguDisplay : ''}`,
    nakshatramStr: `${nakshatraNameTe}${nakshatraEndTime ? ' ' + nakshatraEndTime.teluguDisplay : ''}`,
    yogamStr: `${yogaNameTe}${yogaEndTime ? ' ' + yogaEndTime.teluguDisplay : ''}`,
    karanamStr: `${karanaNameTe}${karanaEndTime ? ' ' + karanaEndTime.teluguDisplay : ''}`,

    metadata: {
      location: {
        city: location.city,
        state: location.state,
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: location.timezone
      },
      calculationEngine: 'Astronomical Planetary Ephemeris (Drik Ganita / panchang-ts)',
      ayanamsa: 'Lahiri (Chitrapaksha)',
      tradition: 'Telugu Amanta Panchangam',
      calculatedAt: new Date().toISOString()
    }
  };

  if (panchangCache.size >= MAX_CACHE_SIZE) {
    const firstKey = panchangCache.keys().next().value;
    panchangCache.delete(firstKey);
  }
  panchangCache.set(cacheKey, result);

  return result;
}

/**
 * Astronomical rules engine to generate authentic Hindu festivals for any month.
 * Specifically honors Andhra Pradesh & Telangana Telugu Amanta Shastric tradition.
 */
/**
 * Astronomical rules engine to generate authentic Hindu festivals for any month.
 * Specifically honors Andhra Pradesh & Telangana Telugu Amanta Shastric tradition.
 */
function calculateAstronomicalFestivalsForMonth(year, month, customLocation = {}) {
  const location = { ...DEFAULT_LOCATION, ...customLocation };
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();

  // 1. Precalculate daily panchang for each day of the month
  const days = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
    const p = getDailyPanchang(dt, {
      latitude: location.latitude,
      longitude: location.longitude,
      elevation: location.elevation || 0
    }, {
      timezone: location.timezone || 'Asia/Kolkata',
      ayanamsa: 'lahiri',
      masaSystem: 'amanta'
    });

    const targetDateLocal = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const dayOfWeek = targetDateLocal.getUTCDay();
    const tithis = p.tithis || [];
    const t0 = tithis[0] || {};
    const t1 = tithis[1] || null;

    const masaIdx = p.chandramasa?.amantaIndex ?? 0;
    // Masa attribution for t0 and t1:
    // If t0 is Krishna Amavasya (29) and t1 is Shukla Pratipada (0), t1 belongs to the next month!
    const t0Masa = masaIdx;
    const t1Masa = (t0.index >= 15 && t0.index <= 29 && t1 && t1.index <= 14) ? (masaIdx + 1) % 12 : masaIdx;

    days.push({
      d,
      dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      dayOfWeek,
      dayTe: VARAM_NAMES_TE[dayOfWeek],
      dayEn: VARAM_NAMES_EN[dayOfWeek],
      p,
      t0,
      t1,
      t0Masa,
      t1Masa
    });
  }

  const festivals = [];
  const addedKeys = new Set();
  const addFest = (f) => {
    if (!addedKeys.has(f.festival_key)) {
      addedKeys.add(f.festival_key);
      festivals.push({
        ...f,
        year: y,
        month: m,
        tradition: 'Telugu Amanta (Andhra & Telangana)',
        source: 'Astronomical Ephemeris (Drik Ganita)'
      });
    }
  };

  // Helper to determine if targetMasa & targetTithi is observed on this day:
  // 1. Tithi is present at sunrise (Udaya Tithi) and matches masa.
  // 2. OR Kshaya Tithi: begins today (t1), matches t1Masa, and tomorrow's sunrise is past this tithi.
  const isObservance = (day, targetMasa, targetTithi) => {
    if (day.t0.index === targetTithi && day.t0Masa === targetMasa) {
      return true;
    }
    if (day.t1 && day.t1.index === targetTithi && day.t1Masa === targetMasa) {
      const nextDay = days.find(x => x.d === day.d + 1);
      if (!nextDay || nextDay.t0.index !== targetTithi) {
        return true;
      }
    }
    return false;
  };

  // Udaya tithi check for monthly vratas
  const hasUdayaTithi = (day, tIdx) => {
    if (day.t0.index === tIdx) return true;
    if (day.t1 && day.t1.index === tIdx) {
      const nextDay = days.find(x => x.d === day.d + 1);
      if (!nextDay || nextDay.t0.index !== tIdx) {
        return true;
      }
    }
    return false;
  };

  // Iterate over each day of the month
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    const { d, dateStr, dayOfWeek, dayTe, dayEn, t0, t1, t0Masa } = day;

    // =============================================================
    // 1. Annual Telugu Luni-Solar Festivals
    // =============================================================

    // CHAITRA (Masa 0)
    if (isObservance(day, 0, 0)) {
      addFest({
        festival_key: `ugadi-${y}`,
        title_te: 'ఉగాది (తెలుగు నూతన సంవత్సరం)',
        title_en: 'Ugadi (Telugu New Year)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌿',
        description_te: 'చైత్ర శుద్ధ పాడ్యమి — వసంత నవరాత్రులు ప్రారంభం, పంచాంగ శ్రవణం మరియు ఉగాది పచ్చడి స్వీకరణ.',
        description_en: 'Chaitra Shukla Pratipada — Marks the Telugu New Year with Panchanga Sravanam and sacred Ugadi Pachadi.'
      });
    }
    if (isObservance(day, 0, 8)) {
      addFest({
        festival_key: `sri-rama-navami-${y}`,
        title_te: 'శ్రీరామ నవమి (సీతారాముల కళ్యాణం)',
        title_en: 'Sri Rama Navami',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🏹',
        description_te: 'చైత్ర శుద్ధ నవమి — భద్రాచల క్షేత్ర సీతారాముల దివ్య తిరుకళ్యాణోత్సవం, వడపప్పు మరియు పానకం సమర్పణ.',
        description_en: 'Chaitra Shukla Navami — Auspicious divine wedding ceremony of Sri Sita Rama with Panakam and Vadapappu.'
      });
    }
    if (isObservance(day, 0, 14)) {
      addFest({
        festival_key: `hanuman-jayanti-${y}`,
        title_te: 'హనుమాన్ జయంతి / చిత్ర పౌర్ణమి',
        title_en: 'Hanuman Jayanti (Chaitra Purnima)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🚩',
        description_te: 'శ్రీ ఆంజనేయ స్వామి దివ్య జయంతి మరియు చిత్రగుప్త పూజ.',
        description_en: 'Appearance day of Lord Hanuman and Chitragupta worship on Chaitra full moon.'
      });
    }

    // VAISHAKHA (Masa 1)
    if (isObservance(day, 1, 2)) {
      addFest({
        festival_key: `akshaya-tritiya-${y}`,
        title_te: 'అక్షయ తృతీయ (బంగారు కొనుగోలు శుభదినం)',
        title_en: 'Akshaya Tritiya',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪙',
        description_te: 'వైశాఖ శుద్ధ తదియ — అక్షయమైన పుణ్యఫలాలు ప్రసాదించే దివ్య దినం. దానధర్మాలు మరియు స్వర్ణ కొనుగోలు శుభప్రదం.',
        description_en: 'Vaishakha Shukla Tritiya — Highly auspicious day for charities, eternal blessings, and acquiring wealth.'
      });
    }
    if (isObservance(day, 1, 13)) {
      addFest({
        festival_key: `narasimha-jayanti-${y}`,
        title_te: 'శ్రీ నృసింహ జయంతి',
        title_en: 'Sri Narasimha Jayanti',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🦁',
        description_te: 'వైశాఖ శుద్ధ చతుర్దశి సాయంసంధ్య వేళ భక్త ప్రహ్లాదుని రక్షించుటకు ఉద్భవించిన శ్రీ లక్ష్మీనరసింహ స్వామి జయంతి.',
        description_en: 'Appearance day of Lord Narasimha protecting devotee Prahlada at dusk.'
      });
    }
    if (isObservance(day, 1, 14)) {
      addFest({
        festival_key: `buddha-purnima-${y}`,
        title_te: 'బుద్ధ పూర్ణిమ / కూర్మ జయంతి',
        title_en: 'Buddha Purnima / Kurma Jayanti',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '☸️',
        description_te: 'గౌతమ బుద్ధుని అవతరణ దినం మరియు శ్రీ మహావిష్ణువు కూర్మావతార జయంతి.',
        description_en: 'Appearance day of Gautama Buddha and Lord Kurma on Vaishakha Purnima.'
      });
    }

    // JYESHTHA (Masa 2)
    if (isObservance(day, 2, 14)) {
      addFest({
        festival_key: `vat-purnima-${y}`,
        title_te: 'వట సావిత్రి వ్రతం (జ్యేష్ఠ పౌర్ణమి)',
        title_en: 'Vat Purnima Vratam',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🌳',
        description_te: 'సుమంగళి స్త్రీలు దీర్ఘాయుష్షు మరియు సౌభాగ్యం కొరకు వటవృక్షాన్ని (మర్రిచెట్టును) పూజించే వ్రతం.',
        description_en: 'Married women worship the sacred Banyan tree for family health and longevity.'
      });
    }

    // ASHADHA (Masa 3)
    if (isObservance(day, 3, 10)) {
      addFest({
        festival_key: `toli-ekadashi-${y}`,
        title_te: 'తొలి ఏకాదశి (శయన ఏకాదశి)',
        title_en: 'Toli Ekadashi (Sayana Ekadashi)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪷',
        description_te: 'చాతుర్మాస్య వ్రత ప్రారంభం. శ్రీమహావిష్ణువు క్షీరసాగరంలో శేషతల్పంపై శయనించే పవిత్ర దినం.',
        description_en: 'Marks the start of the sacred four-month Chaturmasya period.'
      });
    }
    if (isObservance(day, 3, 14)) {
      addFest({
        festival_key: `guru-purnima-${y}`,
        title_te: 'గురు పౌర్ణమి (వ్యాస పూర్ణిమ)',
        title_en: 'Guru Purnima (Vyasa Purnima)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🧘',
        description_te: 'మహాభారత కర్త వేదవ్యాస మహర్షి జయంతి. సద్గురువులకు పాదపూజ చేసే పుణ్యదినం.',
        description_en: 'Appearance day of Sage Veda Vyasa honoring spiritual teachers and gurus.'
      });
    }

    // SHRAVANA (Masa 4)
    if (isObservance(day, 4, 4)) {
      addFest({
        festival_key: `nag-panchami-${y}`,
        title_te: 'నాగ పంచమి',
        title_en: 'Nag Panchami',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🐍',
        description_te: 'శ్రావణ శుద్ధ పంచమి — నాగ దేవతలకు పాలు సమర్పించి కుటుంబ రక్షణ కోరే పండుగ.',
        description_en: 'Worship of serpent deities with milk offerings for protection and peace.'
      });
    }
    // Varalakshmi Vratam: Friday occurring immediately before Shravana Purnima
    if (dayOfWeek === 5 && (day.t0Masa === 4 || day.t1Masa === 4)) {
      const nextPurnima = days.find(x => x.d > d && x.d <= d + 7 && isObservance(x, 4, 14));
      if (nextPurnima) {
        addFest({
          festival_key: `varalakshmi-vratam-${y}`,
          title_te: 'వరలక్ష్మీ వ్రతం (శ్రావణ శుక్రవారం)',
          title_en: 'Varalakshmi Vratam',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌺',
          description_te: 'శ్రావణ పౌర్ణమికి ముందు వచ్చే శుక్రవారం — సుమంగళి స్త్రీలు అష్టైశ్వర్యాల కొరకు ఆచరించే వరలక్ష్మీ దేవి పూజ.',
          description_en: 'Friday preceding Shravana Purnima — Auspicious Lakshmi worship for prosperity and family well-being.'
        });
      }
    }
    if (isObservance(day, 4, 14)) {
      addFest({
        festival_key: `rakhi-${y}`,
        title_te: 'రాఖీ పౌర్ణమి / రక్షాబంధన్ / జంద్యాల పూర్ణిమ',
        title_en: 'Raksha Bandhan / Shravana Purnima',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🧵',
        description_te: 'శ్రావణ పౌర్ణమి — తోబుట్టువుల రక్షాబంధనం, బ్రాహ్మణుల యజ్ఞోపవీత ధారణ మరియు హయగ్రీవ జయంతి.',
        description_en: 'Shravana Purnima — Sibling bond celebration of Raksha Bandhan and Upakarma rituals.'
      });
    }
    // Sri Krishna Janmashtami: Shravana Krishna Ashtami (tithi 22)
    if (isObservance(day, 4, 22) || (day.t0Masa === 4 && day.t1 && day.t1.index === 22)) {
      addFest({
        festival_key: `janmashtami-${y}`,
        title_te: 'శ్రీ కృష్ణాష్టమి (గోకులాష్టమి / జన్మాష్టమి)',
        title_en: 'Sri Krishna Janmashtami (Gokulashtami)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🦚',
        description_te: 'శ్రావణ బహుళ అష్టమి అర్ధరాత్రి వేళ శ్రీకృష్ణ పరమాత్మ అవతరణ — ఉట్లోత్సవం మరియు బాలగోపాలుని పూజ.',
        description_en: 'Midnight divine birth celebration of Bhagavan Sri Krishna with festive rituals and butter offerings.'
      });
    }

    // BHADRAPADA (Masa 5)
    // VINAYAKA CHAVITHI (Ganesh Chaturthi): Exclusively on Bhadrapada Shukla Chaturthi (tithi 3) at Madhyahna!
    if (isObservance(day, 5, 3) || (day.t0Masa === 5 && day.t0.index === 2 && day.t1 && day.t1.index === 3)) {
      addFest({
        festival_key: `vinayaka-chavithi-${y}`,
        title_te: 'వినాయక చవితి (గణేష్ చతుర్థి)',
        title_en: 'Vinayaka Chavithi (Ganesh Chaturthi)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🐘',
        description_te: 'భాద్రపద శుద్ధ చవితి — విఘ్నాధిపతి శ్రీ గణపతి నవరాత్రుల ప్రారంభం, మధ్యాహ్న వరసిద్ధి వినాయక వ్రత కల్పం.',
        description_en: 'Bhadrapada Shukla Chaturthi — Grand commencement of Ganesh festival with 21-patra sacred pooja.'
      });
    }
    if (isObservance(day, 5, 4)) {
      addFest({
        festival_key: `rishi-panchami-${y}`,
        title_te: 'ఋషి పంచమి',
        title_en: 'Rishi Panchami',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '📜',
        description_te: 'సప్తర్షులను భక్తితో పూజించి దోష నివారణ పొందే పవిత్ర భాద్రపద పంచమి వ్రతం.',
        description_en: 'Reverence of the Seven Sages (Saptarshis) for inner purification and spiritual upliftment.'
      });
    }
    if (isObservance(day, 5, 13)) {
      addFest({
        festival_key: `anantha-vratam-${y}`,
        title_te: 'అనంత పద్మనాభ వ్రతం',
        title_en: 'Anantha Padmanabha Vratam',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪷',
        description_te: 'భాద్రపద శుద్ధ చతుర్దశి నాడు శ్రీ మహావిష్ణువును 14 ముడుల రక్షాతో ఆరాధించే దివ్య వ్రతం.',
        description_en: 'Bhadrapada Shukla Chaturdashi dedicated to Lord Anantha Padmanabha with sacred 14-knot thread.'
      });
    }
    if (isObservance(day, 5, 29)) {
      addFest({
        festival_key: `mahalaya-amavasya-${y}`,
        title_te: 'మహాలయ అమావాస్య / ఎంగిలిపూల బతుకమ్మ',
        title_en: 'Mahalaya Amavasya / Engili Pula Bathukamma',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌑',
        description_te: 'భాద్రపద బహుళ అమావాస్య — సర్వ పితృ తర్పణ పుణ్యదినం మరియు తెలంగాణ సంస్కృతిలో ఎంగిలిపూల బతుకమ్మ ప్రారంభం.',
        description_en: 'Sarva Pitru Amavasya concluding Pitru Paksha and inception of floral Bathukamma celebrations.'
      });
    }

    // ASHWAYUJA (Masa 6)
    if (isObservance(day, 6, 0)) {
      addFest({
        festival_key: `sharad-navaratri-start-${y}`,
        title_te: 'శరన్నవరాత్రులు ప్రారంభం (కలశస్థాపన)',
        title_en: 'Sharad Navaratri Begins (Kalasha Sthapana)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🛕',
        description_te: 'ఆశ్వయుజ శుద్ధ పాడ్యమి — దేవి శరన్నవరాత్రి ఉత్సవాల ప్రారంభం, అమ్మవారి దివ్య అలంకార పూజలు.',
        description_en: 'Ashwina Shukla Pratipada — Beginning of the grand 9-day autumn Devi Navaratri festival.'
      });
    }
    if (isObservance(day, 6, 7)) {
      addFest({
        festival_key: `durgashtami-${y}`,
        title_te: 'దుర్గాష్టమి (మహాష్టమి)',
        title_en: 'Durga Ashtami (Maha Ashtami)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🔱',
        description_te: 'మహాశక్తి స్వరూపిణి దుర్గాదేవి ఆరాధన, కన్యాపూజ మరియు విశేష చండీ హవనాలు.',
        description_en: 'Eighth day of Navaratri worshipping Goddess Durga in heroic form.'
      });
    }
    if (isObservance(day, 6, 8)) {
      addFest({
        festival_key: `mahanavami-${y}`,
        title_te: 'మహార్నవమి / సద్దుల బతుకమ్మ / ఆయుధ పూజ',
        title_en: 'Maha Navami / Saddula Bathukamma / Ayudha Pooja',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌺',
        description_te: 'ఆయుధ, వాహన, పుస్తక పూజలు మరియు తెలంగాణ అంతటా వైభవోపేతంగా సద్దుల బతుకమ్మ నిమజ్జనం.',
        description_en: 'Ninth day of Navaratri with sacred Ayudha Pooja and grand Saddula Bathukamma flower festival finale.'
      });
    }
    if (isObservance(day, 6, 9)) {
      addFest({
        festival_key: `vijayadashami-${y}`,
        title_te: 'విజయదశమి (దసరా / శమీ పూజ)',
        title_en: 'Vijaya Dashami (Dussehra / Dasara)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🏹',
        description_te: 'చెడుపై మంచి సాధించిన విజయ ప్రతీక. జమ్మి చెట్టు (శమీ వృక్ష) పూజ, పాలపిట్ట దర్శనం మరియు అపరాజిత పూజ.',
        description_en: 'Auspicious culmination of Dasara celebrating victory of righteousness, Shami Pooja and Indian Roller sighting.'
      });
    }
    if (isObservance(day, 6, 14)) {
      addFest({
        festival_key: `sharad-purnima-${y}`,
        title_te: 'శరద్ పౌర్ణమి / కోజాగరి లక్ష్మీ పూజ',
        title_en: 'Sharad Purnima / Kojagari Lakshmi Puja',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌕',
        description_te: 'వెన్నెల రాత్రి లక్ష్మీదేవి కటాక్షం. పాలు-అటుకుల నైవేద్యం సమర్పించి కోజాగరి లక్ష్మీ పూజ ఆచరిస్తారు.',
        description_en: 'Luminous moonlight night invoking Goddess Lakshmi blessings with sweet milk offerings.'
      });
    }
    if (isObservance(day, 6, 17)) {
      addFest({
        festival_key: `atla-tadde-${y}`,
        title_te: 'అట్ల తద్దె (కార్వా చౌత్)',
        title_en: 'Atla Tadde (Telugu Women Fast)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌙',
        description_te: 'తెలుగు స్త్రీలు, కన్యలు సౌభాగ్యం కొరకు ఆచరించే విశిష్ట వ్రతం — ఉయ్యాలలూగుట, గోరింటాకు, అట్ల నైవేద్యం.',
        description_en: 'Traditional Telugu fasting festival for marital bliss with dosa offerings, henna, and swings.'
      });
    }
    if (isObservance(day, 6, 27) || (day.t0Masa === 6 && day.t1 && day.t1.index === 27)) {
      addFest({
        festival_key: `dhanteras-${y}`,
        title_te: 'ధనత్రయోదశి (ధన్వంతరి జయంతి / ధన్‌తేరాస్)',
        title_en: 'Dhanatrayodashi (Dhanteras / Dhanvantari Jayanti)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪙',
        description_te: 'ఆయుర్వేద మూలపురుషుడు ధన్వంతరి జయంతి. లక్ష్మీ కుబేర పూజ మరియు నూతన పాత్రలు, బంగారు కొనుగోలు.',
        description_en: 'Celebration of Lord Dhanvantari with Lakshmi-Kubera prayers and auspicious utensil/gold purchases.'
      });
    }
    if (isObservance(day, 6, 28)) {
      addFest({
        festival_key: `naraka-chaturdashi-${y}`,
        title_te: 'నరక చతుర్దశి',
        title_en: 'Naraka Chaturdashi',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪔',
        description_te: 'సత్యభామా-శ్రీకృష్ణుల నరకాసుర వధ స్మరణార్థం తెల్లవారుజామున తలంటు స్నానం, యమ దీపదానం.',
        description_en: 'Early morning auspicious oil bath commemorating victory over Narakasura and lighting Yama lamps.'
      });
    }
    if (isObservance(day, 6, 29) || (day.t0Masa === 6 && day.t1 && day.t1.index === 29)) {
      addFest({
        festival_key: `deepavali-${y}`,
        title_te: 'దీపావళి (శ్రీ మహాలక్ష్మీ పూజ / కేదారేశ్వర వ్రతం)',
        title_en: 'Deepavali (Diwali Lakshmi Puja / Kedareswara Vratam)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪔',
        description_te: 'ఆశ్వయుజ అమావాస్య ప్రదోష వేళ శ్రీ మహాలక్ష్మీ-గణపతి పూజ, కాంతులీనే దీపోత్సవం మరియు బాణసంచా వేడుక.',
        description_en: 'Grand festival of lights on Amavasya evening with Sri Mahalakshmi worship and festive crackers.'
      });
    }

    // KARTHIKA (Masa 7)
    if (isObservance(day, 7, 0)) {
      addFest({
        festival_key: `bali-padyami-${y}`,
        title_te: 'బలి పాడ్యమి / కార్తీక మాస ప్రారంభం',
        title_en: 'Bali Padyami / Karthika Masam Begins',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪔',
        description_te: 'బలి చక్రవర్తి పూజ, గోవర్ధన పూజ మరియు పరమ పవిత్ర కార్తీక దామోదర దీపారాధన ప్రారంభం.',
        description_en: 'Celebration of King Bali, Govardhan Pooja and inception of sacred Karthika daily lamps.'
      });
    }
    if (isObservance(day, 7, 1)) {
      addFest({
        festival_key: `bhagini-hastha-bhojanam-${y}`,
        title_te: 'భగినీ హస్త భోజనం (యమ ద్వితీయ / భ్రాతృ ద్వితీయ)',
        title_en: 'Bhagini Hastha Bhojanam (Yama Dwitiya / Bhai Dooj)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🍽️',
        description_te: 'సోదరులు సోదరి నివాసంలో ప్రేమపూర్వక భోజనం చేసి ఆయురారోగ్య దీవెనలు పొందే విశిష్ట సాంప్రదాయం.',
        description_en: 'Brothers dine at their sister home receiving prayers for protection and long life.'
      });
    }
    if (isObservance(day, 7, 3)) {
      addFest({
        festival_key: `nagula-chavithi-${y}`,
        title_te: 'నాగుల చవితి (పుట్టలో పాలు పోసే పండుగ)',
        title_en: 'Nagula Chavithi (Sacred Serpent Festival)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🐍',
        description_te: 'కార్తీక శుద్ధ చవితి — తెలుగునాట అత్యంత ప్రసిద్ధ నాగ దేవత పూజ, పుట్టలో పాలు, నువ్వుల చిమ్మిలి సమర్పణ.',
        description_en: 'Karthika Shukla Chaturthi — Highly celebrated Telugu festival offering milk and sesame sweets at sacred anthills.'
      });
    }
    if (isObservance(day, 7, 5)) {
      addFest({
        festival_key: `subrahmanya-sashti-${y}`,
        title_te: 'సుబ్రహ్మణ్య షష్ఠి (స్కంద షష్ఠి)',
        title_en: 'Subrahmanya Sashti (Skanda Sashti)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🦚',
        description_te: 'కార్తీక శుద్ధ షష్ఠి — శ్రీ సుబ్రహ్మణ్య స్వామి శూరసంహార విజయోత్సవం మరియు విశేష కావడి పూజ.',
        description_en: 'Karthika Shukla Shashthi honoring Lord Kartikeya divine victory over evil forces.'
      });
    }
    if (isObservance(day, 7, 11)) {
      addFest({
        festival_key: `ksheerabdhi-dwadashi-${y}`,
        title_te: 'క్షీరాబ్ధి ద్వాదశి / చిలుక ద్వాదశి / తులసీ కళ్యాణం',
        title_en: 'Ksheerabdhi Dwadashi / Tulasi Kalyanam',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪴',
        description_te: 'కార్తీక శుద్ధ ద్వాదశి సాయంత్రం తులసి-దామోదరుల దివ్య కళ్యాణం, ఉసిరి దీపాలు వెలిగించే పుణ్యదినం.',
        description_en: 'Holy divine wedding of Tulasi Devi and Lord Damodara with Amla fruit lamps at dusk.'
      });
    }
    if (isObservance(day, 7, 14)) {
      addFest({
        festival_key: `karthika-pournami-${y}`,
        title_te: 'కార్తీక పూర్ణిమ (జ్వాలాతోరణం / కార్తీక దీపోత్సవం)',
        title_en: 'Karthika Pournami (Jwala Thoranam / Festival of Lamps)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪔',
        description_te: 'శివాలయాలలో జ్వాలాతోరణ దర్శనం, 365 వత్తుల దీపారాధన, సత్యనారాయణ వ్రతం మరియు కోటి సోమవార పుణ్యఫలం.',
        description_en: 'Spectacular Jwala Thoranam bonfire, 365 wicks offering, and grand lamp lighting in Shiva temples.'
      });
    }

    // MARGASHIRSHA (Masa 8)
    if (isObservance(day, 8, 10)) {
      addFest({
        festival_key: `gita-jayanti-${y}`,
        title_te: 'మోక్షదా ఏకాదశి / గీతా జయంతి / వైకుంఠ ఏకాదశి',
        title_en: 'Mokshada Ekadashi / Gita Jayanti',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '📖',
        description_te: 'కురుక్షేత్రంలో శ్రీకృష్ణుడు అర్జునునికి భగవద్గీతను ఉపదేశించిన పవిత్ర దినం మరియు వైకుంఠ ద్వార దర్శనం.',
        description_en: 'Divine advent day of Srimad Bhagavad Gita and Vaikuntha Dwara opening.'
      });
    }
    if (isObservance(day, 8, 14)) {
      addFest({
        festival_key: `dattatreya-jayanti-${y}`,
        title_te: 'దత్తాత్రేయ జయంతి',
        title_en: 'Dattatreya Jayanti',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🕉️',
        description_te: 'త్రిమూర్తి స్వరూపుడైన శ్రీ దత్తాత్రేయ భగవానుని అవతరణ దినం.',
        description_en: 'Appearance day of Lord Dattatreya, embodiment of the Holy Trinity (Brahma, Vishnu, Shiva).'
      });
    }

    // PUSHYA (Masa 9)
    if (isObservance(day, 9, 7)) {
      addFest({
        festival_key: `bhishma-ashtami-${y}`,
        title_te: 'భీష్మాష్టమి (పితృ తర్పణ దినం)',
        title_en: 'Bhishma Ashtami',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌊',
        description_te: 'గంగాపుత్రుడైన భీష్మ పితామహుడు మోక్షం పొందిన పవిత్ర అష్టమి తర్పణ దినం.',
        description_en: 'Auspicious day honoring Grandsire Bhishma with sacred water oblations (Tarpana).'
      });
    }

    // MAGHA (Masa 10)
    if (isObservance(day, 10, 4)) {
      addFest({
        festival_key: `vasanta-panchami-${y}`,
        title_te: 'వసంత పంచమి (సరస్వతీ జయంతి / శ్రీపంచమి)',
        title_en: 'Vasanta Panchami (Saraswati Jayanti)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪕',
        description_te: 'మాఘ శుద్ధ పంచమి — విద్యాధినేత్రి శ్రీ సరస్వతీ దేవి జయంతి, అక్షరాభ్యాసాలకు అత్యంత శుభదినం.',
        description_en: 'Magha Shukla Panchami — Sacred day of Goddess Saraswati, ideal for Aksharabhyasam and music initiates.'
      });
    }
    if (isObservance(day, 10, 6)) {
      addFest({
        festival_key: `ratha-saptami-${y}`,
        title_te: 'రథ సప్తమి (సూర్య జయంతి)',
        title_en: 'Ratha Saptami (Surya Jayanti)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '☀️',
        description_te: 'సూర్య భగవానుని దివ్య జయంతి. జిల్లేడు ఆకులు తలపై ధరించి నదీ స్నానం, చిక్కుడు ఆకులపై పరమాన్నం వండటం.',
        description_en: 'Sun God Jayanti — Sacred bath with Arka leaves and cooking sweet milk payasam on broad bean leaves.'
      });
    }
    if (isObservance(day, 10, 10)) {
      addFest({
        festival_key: `bhishma-ekadashi-${y}`,
        title_te: 'భీష్మ ఏకాదశి (శ్రీ విష్ణు సహస్రనామ స్తోత్ర జయంతి)',
        title_en: 'Bhishma Ekadashi',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🪷',
        description_te: 'భీష్ముడు యుధిష్ఠిరునికి శ్రీ విష్ణు సహస్రనామ స్తోత్రం బోధించిన అతి పవిత్ర ఏకాదశి.',
        description_en: 'Appearance day of Sri Vishnu Sahasranama Stotram imparted by Bhishma Pitamaha.'
      });
    }
    // Maha Shivaratri: Magha Krishna Chaturdashi (tithi 28)
    if (isObservance(day, 10, 28) || (day.t0Masa === 10 && day.t1 && day.t1.index === 28)) {
      addFest({
        festival_key: `maha-shivaratri-${y}`,
        title_te: 'మహా శివరాత్రి (లింగోద్భవ కాలం / జాగరణ)',
        title_en: 'Maha Shivaratri',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🔱',
        description_te: 'మాఘ బహుళ చతుర్దశి నాడు పరమశివుని లింగోద్భవ కాలం. రాత్రంతా ఉపవాసం, రుద్రాభిషేకం మరియు మహా జాగరణ.',
        description_en: 'Holy night of Lord Shiva divine Lingodbhava with midnight prayers, Rudrabhishekam, and all-night vigil.'
      });
    }

    // PHALGUNA (Masa 11)
    if (isObservance(day, 11, 14)) {
      addFest({
        festival_key: `holi-${y}`,
        title_te: 'కామదహనం / హోలీ (వసంతోత్సవం)',
        title_en: 'Holi (Kamadahana / Spring Festival)',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🎨',
        description_te: 'ఫాల్గుణ పౌర్ణమి — కామదహనోత్సవం మరియు వసంతోత్సవ రంగుల పండుగ.',
        description_en: 'Phalguna Purnima — Holy bonfire of Kamadahana and joyous spring festival of colors.'
      });
    }

    // Fixed Solar festivals around Makara Sankranti in January
    if (m === 1) {
      if (d === 14) {
        addFest({
          festival_key: `bhogi-${y}`,
          title_te: 'భోగి పండుగ',
          title_en: 'Bhogi Festival',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🔥',
          description_te: 'సంక్రాంతి వేడుకల ప్రారంభ దినం. భోగి మంటలు, రంగవల్లులు మరియు పవిత్ర గోదా దేవి కళ్యాణం.',
          description_en: 'First day of Sankranti celebrations with sacred bonfires, rangoli, and Goda Kalyanam.'
        });
      }
      if (d === 15) {
        addFest({
          festival_key: `makara-sankranti-${y}`,
          title_te: 'మకర సంక్రాంతి (పెద్ద పండుగ)',
          title_en: 'Makara Sankranti',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌞',
          description_te: 'సూర్యుడు మకర రాశిలోకి ప్రవేశించే పుణ్యకాలం. తెలుగు వారి పెద్ద పండుగ, తిల తర్పణం, సంక్రాంతి పిండివంటలు.',
          description_en: 'Holy solar transit into Capricorn. Grand festival of harvest, sesame offerings, and festive sweets in Telugu states.'
        });
      }
      if (d === 16) {
        addFest({
          festival_key: `kanuma-${y}`,
          title_te: 'కనుమ (పశువుల పండుగ)',
          title_en: 'Kanuma Festival',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'major', icon: '🌾',
          description_te: 'రైతుల జీవనాధారమైన గోవులు, పశువులను పూజించే సాంప్రదాయ పండుగ.',
          description_en: 'Traditional cattle worship festival thanking cows, bulls, and nature for harvest bounty.'
        });
      }
    }

    // =============================================================
    // 2. Regular Monthly Observances (Strictly 1 entry per month)
    // =============================================================

    // Shukla Ekadashi (tithi 10 at sunrise)
    if (hasUdayaTithi(day, 10)) {
      const ekInfo = EKADASHI_MAP[`${t0Masa}_0`] || { te: 'శుక్ల ఏకాదశి', en: 'Shukla Ekadashi' };
      if (!festivals.some(f => f.date === dateStr && f.title_en.includes('Ekadashi'))) {
        addFest({
          festival_key: `ekadashi-shukla-${t0Masa}-${y}`,
          title_te: ekInfo.te,
          title_en: ekInfo.en,
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🌱',
          description_te: 'హరివాసర ఉపవాసం మరియు శ్రీమహావిష్ణువు విశేష పూజ.',
          description_en: 'Auspicious Vishnu fasting day purifying body and mind.'
        });
      }
    }

    // Krishna Ekadashi (tithi 25 at sunrise)
    if (hasUdayaTithi(day, 25)) {
      const ekInfo = EKADASHI_MAP[`${t0Masa}_1`] || { te: 'కృష్ణ ఏకాదశి', en: 'Krishna Ekadashi' };
      if (!festivals.some(f => f.date === dateStr && f.title_en.includes('Ekadashi'))) {
        addFest({
          festival_key: `ekadashi-krishna-${t0Masa}-${y}`,
          title_te: ekInfo.te,
          title_en: ekInfo.en,
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🌱',
          description_te: 'బహుళ ఏకాదశి ఉపవాస వ్రతం మరియు హరి నామస్మరణ.',
          description_en: 'Krishna Paksha Ekadashi fasting and devotional chanting.'
        });
      }
    }

    // Shukla Pradosham (tithi 12 at sunrise or sunset)
    if (hasUdayaTithi(day, 12)) {
      addFest({
        festival_key: `pradosham-shukla-${t0Masa}-${y}`,
        title_te: 'శుక్ల ప్రదోష వ్రతం',
        title_en: 'Shukla Pradosha Vratam',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🙏',
        description_te: 'సంధ్యా సమయంలో పరమశివునికి ప్రదోష కాల అభిషేకం మరియు నంది పూజ.',
        description_en: 'Twilight worship of Lord Shiva and Nandi Bhagavan on Trayodashi.'
      });
    }

    // Krishna Pradosham (tithi 27 at sunrise or sunset)
    if (hasUdayaTithi(day, 27) && !festivals.some(f => f.date === dateStr && f.festival_key.includes('dhanteras'))) {
      addFest({
        festival_key: `pradosham-krishna-${t0Masa}-${y}`,
        title_te: 'కృష్ణ ప్రదోష వ్రతం',
        title_en: 'Krishna Pradosha Vratam',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🙏',
        description_te: 'సాయంత్రం ప్రదోష వేళ శివారాధన మరియు బిల్వార్చన.',
        description_en: 'Evening Shiva worship with Bilva leaves on Krishna Trayodashi.'
      });
    }

    // Masik Shivaratri (tithi 28 at sunrise or night, except Magha which is Maha Shivaratri)
    if (hasUdayaTithi(day, 28) && t0Masa !== 10 && !festivals.some(f => f.date === dateStr && (f.festival_key.includes('naraka') || f.festival_key.includes('maha-shivaratri')))) {
      addFest({
        festival_key: `masik-shivaratri-${t0Masa}-${y}`,
        title_te: 'మాస శివరాత్రి',
        title_en: 'Masik Shivaratri',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'tithi', icon: '🛕',
        description_te: 'ప్రతినెల కృష్ణ చతుర్దశి నాడు పరమశివునికి రుద్రాభిషేకం చేసే పవిత్ర రాత్రి.',
        description_en: 'Monthly Krishna Chaturdashi night devoted to Lord Shiva worship.'
      });
    }

    // Sankashti Chaturthi (tithi 18 at sunrise or night)
    if (hasUdayaTithi(day, 18)) {
      addFest({
        festival_key: `sankashti-chaturthi-${t0Masa}-${y}`,
        title_te: 'సంకష్టహర చతుర్థి',
        title_en: 'Sankashti Chaturthi',
        date: dateStr, day_te: dayTe, day_en: dayEn, category: 'vrata', icon: '🐘',
        description_te: 'కష్టాలు తొలగించే సంకటహర గణపతి వ్రతం — చంద్రోదయ దర్శనం తర్వాత ఉపవాస విరమణ.',
        description_en: 'Fasting dedicated to Lord Ganesha concluding after moonrise sighting.'
      });
    }

    // Generic Pournami if no specific named Purnima festival
    if (hasUdayaTithi(day, 14)) {
      if (!festivals.some(f => f.date === dateStr && (f.festival_key.includes('purnima') || f.festival_key.includes('pournami') || f.festival_key.includes('rakhi') || f.festival_key.includes('holi')))) {
        addFest({
          festival_key: `pournami-${t0Masa}-${y}`,
          title_te: 'పౌర్ణమి (శ్రీ సత్యనారాయణ స్వామి వ్రతం)',
          title_en: 'Pournami (Satyanarayana Swamy Vratam)',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'tithi', icon: '🌕',
          description_te: 'సత్యనారాయణ స్వామి వ్రతం, దీపారాధన మరియు పుణ్యతీర్థ స్నానాలకు అత్యంత శుభప్రద దినం.',
          description_en: 'Full moon day ideal for Sri Satyanarayana Swamy Pooja and sacred rituals.'
        });
      }
    }

    // Generic Amavasya if no specific named Amavasya festival
    if (hasUdayaTithi(day, 29)) {
      if (!festivals.some(f => f.date === dateStr && (f.festival_key.includes('deepavali') || f.festival_key.includes('mahalaya')))) {
        addFest({
          festival_key: `amavasya-${t0Masa}-${y}`,
          title_te: 'అమావాస్య (పితృ తర్పణ దినం)',
          title_en: 'Amavasya (Pitru Tarpana Day)',
          date: dateStr, day_te: dayTe, day_en: dayEn, category: 'tithi', icon: '🌑',
          description_te: 'పితృదేవతల ప్రీత్యర్థం తిలతర్పణం మరియు దానధర్మాలు ఆచరించవలసిన అమావాస్య దినం.',
          description_en: 'New moon day dedicated to ancestral prayers and charitable deeds.'
        });
      }
    }
  }

  // Sort chronologically by date
  festivals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return festivals;
}

let festivalsTableChecked = false;

/**
 * Ensure festivals table exists in the connected database
 */
async function ensureFestivalsTable() {
  if (festivalsTableChecked) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS festivals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        festival_key VARCHAR(100) UNIQUE NOT NULL,
        title_en VARCHAR(255) NOT NULL,
        title_te VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        day_te VARCHAR(50) DEFAULT '',
        day_en VARCHAR(50) DEFAULT '',
        category VARCHAR(50) DEFAULT 'major',
        tradition VARCHAR(100) DEFAULT 'Telugu Amanta (Andhra & Telangana)',
        description_en TEXT NULL,
        description_te TEXT NULL,
        puja_muhurat_en VARCHAR(255) NULL,
        puja_muhurat_te VARCHAR(255) NULL,
        icon VARCHAR(50) DEFAULT '🕉️',
        is_active BOOLEAN DEFAULT 1,
        is_custom BOOLEAN DEFAULT 0,
        source VARCHAR(100) DEFAULT 'Astronomical Ephemeris (Drik Ganita)',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_year_month (year, month),
        INDEX idx_date (date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    festivalsTableChecked = true;
  } catch (err) {
    console.warn('[PanchangService] ensureFestivalsTable warning:', err.message);
  }
}

/**
 * Retrieve verified festivals for a specific Gregorian month (1-indexed).
 * Tries the database cache first; if empty or uninitialized, calculates astronomically.
 */
async function getMonthlyFestivals(year, month, customLocation = {}) {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);

  await ensureFestivalsTable();

  try {
    const [dbRows] = await pool.query(
      'SELECT * FROM festivals WHERE year = ? AND month = ? AND is_active = 1 ORDER BY date ASC',
      [y, m]
    );

    if (Array.isArray(dbRows) && dbRows.length > 0) {
      return dbRows.map(f => {
        let dStr = '';
        if (f.date instanceof Date) {
          const dYear = f.date.getFullYear();
          const dMonth = String(f.date.getMonth() + 1).padStart(2, '0');
          const dDate = String(f.date.getDate()).padStart(2, '0');
          dStr = `${dYear}-${dMonth}-${dDate}`;
        } else if (typeof f.date === 'string') {
          dStr = f.date.split('T')[0];
        }
        const parts = dStr ? dStr.split('-') : [y, String(m).padStart(2, '0'), '01'];
        const dayNum = parts[2] || '01';
        const monthNum = parts[1] || String(m).padStart(2, '0');
        const yearNum = parts[0] || y;

        return {
          id: f.id,
          festival_key: f.festival_key,
          date: `${dayNum}-${monthNum}-${yearNum}`,
          dateIso: `${yearNum}-${monthNum}-${dayNum}`,
          day: f.day_te || '',
          dayEnglish: f.day_en || '',
          title: f.title_te || f.title_en,
          titleEnglish: f.title_en || f.title_te,
          category: f.category || 'major',
          desc: f.description_te || '',
          descEnglish: f.description_en || '',
          pujaMuhurat: f.puja_muhurat_te || '',
          pujaMuhuratEnglish: f.puja_muhurat_en || '',
          icon: f.icon || '🕉️',
          tradition: f.tradition || 'Telugu Amanta (Andhra & Telangana)',
          source: f.source || 'Astronomical Ephemeris (Drik Ganita)',
          isCustom: Boolean(f.is_custom)
        };
      });
    }
  } catch (err) {
    console.warn('[PanchangService] Database query for festivals failed, using dynamic astronomical computation:', err.message);
  }

  // Calculate dynamically using astronomical engine
  const calculated = calculateAstronomicalFestivalsForMonth(y, m, customLocation);

  // Attempt to cache calculated records in database asynchronously for future admin management
  try {
    for (const f of calculated) {
      await pool.query(
        `INSERT IGNORE INTO festivals 
         (festival_key, title_en, title_te, date, year, month, day_te, day_en, category, tradition, description_en, description_te, icon, is_active, is_custom, source) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'Astronomical Ephemeris (Drik Ganita)')`,
        [
          f.festival_key, f.title_en, f.title_te, f.date, f.year, f.month,
          f.day_te || '', f.day_en || '', f.category || 'major', 'Telugu Amanta (Andhra & Telangana)',
          f.description_en || '', f.description_te || '', f.icon || '🕉️'
        ]
      );
    }
  } catch (saveErr) {
    // Non-fatal if DB write fails, calculations are already in memory
  }

  return calculated.map(f => {
    const parts = (f.date || '').split('-');
    const dayNum = parts[2] || '01';
    const monthNum = parts[1] || String(m).padStart(2, '0');
    const yearNum = parts[0] || y;

    return {
      festival_key: f.festival_key,
      date: `${dayNum}-${monthNum}-${yearNum}`,
      dateIso: `${yearNum}-${monthNum}-${dayNum}`,
      day: f.day_te || '',
      dayEnglish: f.day_en || '',
      title: f.title_te,
      titleEnglish: f.title_en,
      category: f.category || 'major',
      desc: f.description_te || '',
      descEnglish: f.description_en || '',
      icon: f.icon || '🕉️',
      tradition: 'Telugu Amanta (Andhra & Telangana)',
      source: 'Astronomical Ephemeris (Drik Ganita)'
    };
  });
}

/**
 * Recalculate and synchronize an entire year of festivals in the database.
 */
async function recalculateYearlyFestivals(year) {
  const y = parseInt(year, 10);
  await ensureFestivalsTable();
  let totalAdded = 0;

  for (let m = 1; m <= 12; m++) {
    const fests = calculateAstronomicalFestivalsForMonth(y, m);
    for (const f of fests) {
      try {
        await pool.query(
          `INSERT INTO festivals 
           (festival_key, title_en, title_te, date, year, month, day_te, day_en, category, tradition, description_en, description_te, icon, is_active, is_custom, source) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 'Astronomical Ephemeris (Drik Ganita)')
           ON DUPLICATE KEY UPDATE 
           title_en = VALUES(title_en),
           title_te = VALUES(title_te),
           date = VALUES(date),
           day_te = VALUES(day_te),
           day_en = VALUES(day_en),
           category = VALUES(category),
           description_en = VALUES(description_en),
           description_te = VALUES(description_te),
           icon = VALUES(icon)`,
          [
            f.festival_key, f.title_en, f.title_te, f.date, f.year, f.month,
            f.day_te || '', f.day_en || '', f.category || 'major', 'Telugu Amanta (Andhra & Telangana)',
            f.description_en || '', f.description_te || '', f.icon || '🕉️'
          ]
        );
        totalAdded++;
      } catch (err) {
        console.warn(`Error storing festival ${f.festival_key}:`, err.message);
      }
    }
  }

  return { success: true, count: totalAdded, year: y };
}

module.exports = {
  calculateDailyPanchang,
  getMonthlyFestivals,
  calculateAstronomicalFestivalsForMonth,
  recalculateYearlyFestivals,
  ensureFestivalsTable,
  DEFAULT_LOCATION
};
