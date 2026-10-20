import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './TeluguCalendar.css';
import { useLanguage } from '../context/LanguageContext';
import { 
  Calendar, 
  Moon, 
  Star, 
  Clock, 
  Sun, 
  ChevronRight, 
  ChevronLeft,
  BookOpen, 
  Sunrise, 
  Sunset, 
  Compass, 
  MapPin,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { getDailyPanchang } from 'panchang-ts';

// Hyderabad Coordinates
const HYDERABAD_LOCATION = {
  city: 'Hyderabad',
  state: 'Telangana',
  latitude: 17.3850,
  longitude: 78.4867,
  timezone: 'Asia/Kolkata'
};

const TELUGU_MONTHS = [
  { id: 1, te: 'జనవరి', en: 'January' },
  { id: 2, te: 'ఫిబ్రవరి', en: 'February' },
  { id: 3, te: 'మార్చి', en: 'March' },
  { id: 4, te: 'ఏప్రిల్', en: 'April' },
  { id: 5, te: 'మే', en: 'May' },
  { id: 6, te: 'జూన్', en: 'June' },
  { id: 7, te: 'జులై', en: 'July' },
  { id: 8, te: 'ఆగస్టు', en: 'August' },
  { id: 9, te: 'సెప్టెంబర్', en: 'September' },
  { id: 10, te: 'అక్టోబర్', en: 'October' },
  { id: 11, te: 'నవంబర్', en: 'November' },
  { id: 12, te: 'డిసెంబర్', en: 'December' }
];

const thidhiNames = [
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 
  'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 
  'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పౌర్ణమి', 
  'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 
  'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 
  'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య'
];

const thidhiNamesEn = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const nakshatramNames = [
  'అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 
  'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర', 
  'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 
  'మూల', 'పూర్వాషాడ', 'ఉత్తరాషాడ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 
  'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'
];

const yogamNames = [
  'విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 
  'అతిగండ', 'సుకర్మ', 'ధృతి', 'శూల', 'గండ', 
  'వృద్ధి', 'ధృవ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర', 
  'సిద్ధి', 'వ్యతీపాత', 'వరియాన్', 'పరిఘ', 'శివ', 
  'సిద్ధ', 'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ', 
  'ఐంద్ర', 'వైధృతి'
];

const karanaMap = { 
  'Bava': 'బవ', 'Balava': 'బాలవ', 'Kaulava': 'కౌలవ', 'Taitila': 'తైతుల', 
  'Gara': 'గరజ', 'Vanija': 'వణిజ', 'Vishti': 'విష్టి (భద్ర)', 
  'Shakuni': 'శకుని', 'Chatushpada': 'చతుష్పాద', 'Naga': 'నాగ', 'Kimstughna': 'కింస్తుఘ్న' 
};

const pakshamNames = { 'Shukla': 'శుక్ల పక్షం', 'Krishna': 'కృష్ణ పక్షం' };
const varamNames = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const varamNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const samvatsaraNames = [
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

const getTodayISTString = () => {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

const formatTimeWithoutDoubleConversion = (d, refDateString) => {
  if (!d) return null;
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  const time12 = `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;

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

  let prefix = '';
  if (hours >= 0 && hours < 6) prefix = 'తెల్లవారుజామున ';
  else if (hours >= 6 && hours < 12) prefix = 'ఉదయం ';
  else if (hours >= 12 && hours < 16) prefix = 'మధ్యాహ్నం ';
  else if (hours >= 16 && hours < 20) prefix = 'సాయంత్రం ';
  else prefix = 'రాత్రి ';

  return {
    time12,
    teluguDisplay: `${prefix}${time12}${dayIndicatorTe} వరకు`,
    englishDisplay: `up to ${time12}${dayIndicatorEn}`
  };
};

const calculateClientFallbackPanchang = (dateString) => {
  const [y, m, d] = dateString.split('-').map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  
  const teluguMonths = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
  const dateDisplay = `${d} ${teluguMonths[m - 1]} ${y}`;

  const targetDateNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const dayOfWeek = targetDateNoon.getUTCDay();
  const varamTe = varamNames[dayOfWeek];
  const varamEn = varamNamesEn[dayOfWeek];

  try {
    const p = getDailyPanchang(dateObj, { 
      latitude: HYDERABAD_LOCATION.latitude, 
      longitude: HYDERABAD_LOCATION.longitude 
    }, {
      timezone: 'Asia/Kolkata',
      ayanamsa: 'lahiri',
      masaSystem: 'amanta'
    });

    const shakaYear = p.samvat?.shakaSamvat || (y - 78);
    const samvatIndex = (shakaYear + 11) % 60;
    const yearName = `శ్రీ ${samvatsaraNames[samvatIndex]} నామ సంవత్సరం`;

    const sunriseInfo = formatTimeWithoutDoubleConversion(p.sunrise, dateString);
    const sunsetInfo = formatTimeWithoutDoubleConversion(p.sunset, dateString);

    const primaryTithi = p.tithis[0] || {};
    const tithiNameTe = thidhiNames[primaryTithi.index] || primaryTithi.name || 'పాడ్యమి';
    const tithiNameEn = thidhiNamesEn[primaryTithi.index] || primaryTithi.name || 'Pratipada';
    const tithiEndTime = formatTimeWithoutDoubleConversion(primaryTithi.endTime, dateString);
    const pakshamTe = pakshamNames[primaryTithi.paksha] || primaryTithi.paksha || 'శుక్ల పక్షం';

    let secondaryTithi = null;
    if (p.tithis && p.tithis[1]) {
      secondaryTithi = {
        nameTe: thidhiNames[p.tithis[1].index] || p.tithis[1].name,
        nameEn: thidhiNamesEn[p.tithis[1].index] || p.tithis[1].name
      };
    }

    const primaryNakshatra = p.nakshatras[0] || {};
    const nakshatraNameTe = nakshatramNames[primaryNakshatra.index] || primaryNakshatra.name || 'అశ్విని';
    const nakshatraEndTime = formatTimeWithoutDoubleConversion(primaryNakshatra.endTime, dateString);

    let secondaryNakshatra = null;
    if (p.nakshatras && p.nakshatras[1]) {
      secondaryNakshatra = {
        nameTe: nakshatramNames[p.nakshatras[1].index] || p.nakshatras[1].name
      };
    }

    const primaryYoga = p.yogas[0] || {};
    const yogaNameTe = yogamNames[primaryYoga.index] || primaryYoga.name || 'విష్కంభ';
    const yogaEndTime = formatTimeWithoutDoubleConversion(primaryYoga.endTime, dateString);

    const primaryKarana = p.karanas[0] || {};
    const karanaNameTe = karanaMap[primaryKarana.name] || primaryKarana.name || 'బవ';
    const karanaEndTime = formatTimeWithoutDoubleConversion(primaryKarana.endTime, dateString);

    const formatRange = (rangeObj) => {
      if (!rangeObj?.start || !rangeObj?.end) return null;
      const s = formatTimeWithoutDoubleConversion(rangeObj.start, dateString);
      const e = formatTimeWithoutDoubleConversion(rangeObj.end, dateString);
      return `${s.time12} - ${e.time12}`;
    };

    return {
      dateDisplay,
      varam: varamTe,
      varamEnglish: varamEn,
      yearName,
      paksham: pakshamTe,
      sunrise: sunriseInfo ? sunriseInfo.time12 : '06:08 AM',
      sunset: sunsetInfo ? sunsetInfo.time12 : '05:56 PM',
      tithiName: tithiNameTe,
      tithiNameEnglish: tithiNameEn,
      tithiEndDisplay: tithiEndTime ? `(${tithiEndTime.teluguDisplay})` : '',
      tithiEndDisplayEn: tithiEndTime ? `(${tithiEndTime.englishDisplay})` : '',
      secondaryTithi,
      nakshatraName: nakshatraNameTe,
      nakshatraEndDisplay: nakshatraEndTime ? `(${nakshatraEndTime.teluguDisplay})` : '',
      secondaryNakshatra,
      yogaName: yogaNameTe,
      yogaEndDisplay: yogaEndTime ? `(${yogaEndTime.teluguDisplay})` : '',
      karanaName: karanaNameTe,
      karanaEndDisplay: karanaEndTime ? `(${karanaEndTime.teluguDisplay})` : '',
      rahuKalam: formatRange(p.rahuKalam) || '03:00 PM - 04:30 PM',
      yamaganda: formatRange(p.yamaganda) || '09:00 AM - 10:30 AM',
      abhijitMuhurta: formatRange(p.abhijitMuhurta) || '11:45 AM - 12:35 PM'
    };
  } catch (err) {
    console.error("Client fallback calculation error:", err);
    return {
      dateDisplay,
      varam: varamTe,
      varamEnglish: varamEn,
      yearName: 'శ్రీ పరాభవ నామ సంవత్సరం',
      paksham: 'శుక్ల పక్షం',
      sunrise: '06:08 AM',
      sunset: '05:56 PM',
      tithiName: 'తదియ',
      tithiNameEnglish: 'Tritiya',
      tithiEndDisplay: '',
      secondaryTithi: null,
      nakshatraName: 'విశాఖ',
      nakshatraEndDisplay: '',
      secondaryNakshatra: null,
      yogaName: 'సౌభాగ్య',
      yogaEndDisplay: '',
      karanaName: 'తైతుల',
      karanaEndDisplay: '',
      rahuKalam: '03:00 PM - 04:30 PM',
      yamaganda: '09:00 AM - 10:30 AM',
      abhijitMuhurta: '11:45 AM - 12:35 PM'
    };
  }
};

const TeluguCalendar = () => {
  const { isTelugu } = useLanguage();
  
  // Today's date reference in IST
  const todayIST = useMemo(() => getTodayISTString(), []);
  const [todayYear, todayMonth] = useMemo(() => {
    const [y, m] = todayIST.split('-').map(Number);
    return [y, m];
  }, [todayIST]);

  // Selected date for Daily Panchangam (Right Column)
  const [selectedDate, setSelectedDate] = useState(() => todayIST);
  const [panchangam, setPanchangam] = useState(() => calculateClientFallbackPanchang(todayIST));
  
  // Current Month & Year for Festival Calendar Navigation (Left Column)
  const [navYear, setNavYear] = useState(() => todayYear);
  const [navMonth, setNavMonth] = useState(() => todayMonth);

  const [importantDates, setImportantDates] = useState([]);
  const [showAllImportantDates, setShowAllImportantDates] = useState(false);
  const [isLoadingPanchang, setIsLoadingPanchang] = useState(false);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);

  // Load Daily Panchangam
  const loadPanchangData = useCallback(async (dateStr) => {
    setIsLoadingPanchang(true);
    try {
      const res = await fetch(`/api/panchang?date=${dateStr}&city=Hyderabad&lat=17.3850&lon=78.4867`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setPanchangam({
            dateDisplay: d.dateDisplay,
            varam: d.varam,
            varamEnglish: d.varamEnglish,
            yearName: d.yearName,
            paksham: d.paksham,
            sunrise: d.sunrise,
            sunset: d.sunset,
            tithiName: d.tithi?.name,
            tithiNameEnglish: d.tithi?.nameEnglish || d.tithi?.name,
            tithiEndDisplay: d.tithi?.endTime ? `(${d.tithi.endTime.teluguDisplay})` : '',
            tithiEndDisplayEn: d.tithi?.endTime ? `(${d.tithi.endTime.englishDisplay})` : '',
            secondaryTithi: d.tithi?.nextTithi,
            nakshatraName: d.nakshatram?.name,
            nakshatraEndDisplay: d.nakshatram?.endTime ? `(${d.nakshatram.endTime.teluguDisplay})` : '',
            secondaryNakshatra: d.nakshatram?.nextNakshatra,
            yogaName: d.yogam?.name,
            yogaEndDisplay: d.yogam?.endTime ? `(${d.yogam.endTime.teluguDisplay})` : '',
            karanaName: d.karanam?.name,
            karanaEndDisplay: d.karanam?.endTime ? `(${d.karanam.endTime.teluguDisplay})` : '',
            rahuKalam: d.muhurtas?.rahuKalam,
            yamaganda: d.muhurtas?.yamaganda,
            abhijitMuhurta: d.muhurtas?.abhijitMuhurta
          });
          setIsLoadingPanchang(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend Panchang API unavailable, using local calculation:", e);
    }

    const fallbackData = calculateClientFallbackPanchang(dateStr);
    setPanchangam(fallbackData);
    setIsLoadingPanchang(false);
  }, []);

  // Client-side fallback festival calculation
  const calculateClientFallbackFestivals = useCallback((y, m) => {
    const fests = [];
    const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
    
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
      try {
        const p = getDailyPanchang(dt, {
          latitude: HYDERABAD_LOCATION.latitude,
          longitude: HYDERABAD_LOCATION.longitude,
          elevation: 505
        }, {
          timezone: 'Asia/Kolkata',
          ayanamsa: 'lahiri',
          masaSystem: 'amanta'
        });

        const dayOfWeek = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
        const dayTe = varamNames[dayOfWeek] || '';
        const dayEn = varamNamesEn[dayOfWeek] || '';
        const dayNum = String(d).padStart(2, '0');
        const monthNum = String(m).padStart(2, '0');
        const dateStr = `${dayNum}-${monthNum}-${y}`;
        const dateIso = `${y}-${monthNum}-${dayNum}`;

        const t0 = (p.tithis && p.tithis[0]) ? p.tithis[0].index : -1;
        const masaIdx = p.chandramasa?.amantaIndex ?? 0;

        // Vratas & Observances
        if (t0 === 10) {
          fests.push({
            festival_key: `ekadashi-shukla-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'శుక్ల ఏకాదశి వ్రతం',
            titleEnglish: 'Shukla Paksha Ekadashi',
            category: 'vrata', icon: '🪷',
            desc: 'సర్వపాప హరణమైన శుక్ల పక్ష ఏకాదశి ఉపవాస వ్రతం మరియు శ్రీమహావిష్ణు పూజ.',
            descEnglish: 'Auspicious Ekadashi fast dedicated to Lord Maha Vishnu for spiritual purity.'
          });
        } else if (t0 === 25) {
          fests.push({
            festival_key: `ekadashi-krishna-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: m === 10 ? 'ఇందిరా ఏకాదశి' : 'బహుళ ఏకాదశి వ్రతం',
            titleEnglish: m === 10 ? 'Indira Ekadashi' : 'Krishna Paksha Ekadashi',
            category: 'vrata', icon: '🌱',
            desc: 'బహుళ ఏకాదశి ఉపవాస వ్రతం మరియు హరి నామస్మరణ.',
            descEnglish: 'Krishna Paksha Ekadashi fasting and devotional chanting.'
          });
        } else if (t0 === 12) {
          fests.push({
            festival_key: `pradosham-shukla-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'శుక్ల ప్రదోష వ్రతం',
            titleEnglish: 'Shukla Pradosha Vratam',
            category: 'vrata', icon: '🔱',
            desc: 'సాయంసంధ్య వేళ పరమశివునికి రుద్రాభిషేకం మరియు బిల్వార్చన.',
            descEnglish: 'Evening twilight worship and sacred Bilva archana for Lord Shiva.'
          });
        } else if (t0 === 27) {
          fests.push({
            festival_key: `pradosham-krishna-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'కృష్ణ ప్రదోష వ్రతం',
            titleEnglish: 'Krishna Pradosha Vratam',
            category: 'vrata', icon: '🔱',
            desc: 'దోష నివారణ ప్రదోష కాల రుద్రారాధన.',
            descEnglish: 'Sacred Pradosha dusk worship of Lord Shiva.'
          });
        } else if (t0 === 28) {
          fests.push({
            festival_key: `shivaratri-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'మాస శివరాత్రి',
            titleEnglish: 'Masik Shivaratri',
            category: 'vrata', icon: '🕉️',
            desc: 'శివనామ స్మరణ, లింగార్చన మరియు జాగరణ నిష్ట.',
            descEnglish: 'Monthly vigil and holy linga abhishekam dedicated to Lord Shiva.'
          });
        } else if (t0 === 14) {
          fests.push({
            festival_key: `purnima-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'పౌర్ణమి (శ్రీ సత్యనారాయణ వ్రతం)',
            titleEnglish: 'Purnima (Pournami Vratam)',
            category: 'major', icon: '🌕',
            desc: 'శ్రీ సత్యనారాయణ స్వామి దివ్య వ్రతాచరణకు పరమ పవిత్రమైన పున్నమి తిథి.',
            descEnglish: 'Full moon day, most auspicious for Sri Satyanarayana Swamy Pooja and spiritual merit.'
          });
        } else if (t0 === 29) {
          fests.push({
            festival_key: `amavasya-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: m === 10 ? 'మహాలయ అమావాస్య / ఎంగిలిపూల బతుకమ్మ' : 'అమావాస్య (పితృ తర్పణ పుణ్యదినం)',
            titleEnglish: m === 10 ? 'Mahalaya Amavasya / Engili Pula Bathukamma' : 'Amavasya (New Moon)',
            category: 'major', icon: '🌑',
            desc: 'పితృదేవతల ఆరాధన, దానధర్మాలు మరియు పుణ్యస్నానాలకు శ్రేష్ఠమైన దినం.',
            descEnglish: 'Sacred new moon day for ancestral offerings, charitable donations, and peace.'
          });
        } else if (t0 === 18) {
          fests.push({
            festival_key: `sankashti-${d}-${m}-${y}`,
            date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
            title: 'సంకష్టహర చతుర్థి',
            titleEnglish: 'Sankashti Chaturthi',
            category: 'vrata', icon: '🐘',
            desc: 'సంకటాల నివారణకు శ్రీ వినాయక వ్రతం మరియు చంద్ర దర్శన పూజ.',
            descEnglish: 'Lord Ganesha fasting for removing distress and evening moonrise prayers.'
          });
        }

        // Special October / Navaratri & Dussehra check (Ashwayuja Masa = 6 in Amanta)
        if (masaIdx === 6 || m === 10) {
          if (t0 === 0 && d >= 10 && d <= 15) {
            fests.push({
              festival_key: `navaratri-begins-${d}-${m}-${y}`,
              date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
              title: 'శరన్నవరాత్రులు ప్రారంభం (కలశస్థాపన)',
              titleEnglish: 'Sharad Navaratri Begins (Kalasha Sthapana)',
              category: 'major', icon: '🪔',
              desc: 'ఆశ్వయుజ శుద్ధ పాడ్యమి — దేవీ నవరాత్రుల ప్రారంభం, ఘటస్థాపన.',
              descEnglish: 'First day of Durga Navaratri with sacred Kalasha installation.'
            });
          } else if (t0 === 7 && d >= 15 && d <= 22) {
            fests.push({
              festival_key: `durga-ashtami-${d}-${m}-${y}`,
              date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
              title: 'దుర్గాష్టమి (మహాష్టమి)',
              titleEnglish: 'Durga Ashtami (Maha Ashtami)',
              category: 'major', icon: '⚔️',
              desc: 'మహిషాసురమర్దిని దుర్గాదేవి విశేష పూజ.',
              descEnglish: 'Auspicious 8th day honoring Goddess Durga Mahishasuramardini.'
            });
          } else if (t0 === 8 && d >= 16 && d <= 23) {
            fests.push({
              festival_key: `maha-navami-${d}-${m}-${y}`,
              date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
              title: 'మహార్నవమి / సద్దుల బతుకమ్మ / ఆయుధ పూజ',
              titleEnglish: 'Maha Navami / Saddula Bathukamma / Ayudha Pooja',
              category: 'major', icon: '🌸',
              desc: 'ఆశ్వయుజ శుద్ధ నవమి — ఆయుధ పూజ, తెలంగాణ సద్దుల బతుకమ్మ సంబరాలు.',
              descEnglish: 'Great Ninth day honoring weapons, books, and Saddula Bathukamma grand finale.'
            });
          } else if (t0 === 9 && d >= 17 && d <= 24) {
            fests.push({
              festival_key: `vijaya-dashami-${d}-${m}-${y}`,
              date: dateStr, dateIso, day: dayTe, dayEnglish: dayEn,
              title: 'విజయదశమి (దసరా / శమీ పూజ)',
              titleEnglish: 'Vijaya Dashami (Dussehra / Dasara)',
              category: 'major', icon: '🏹',
              desc: 'చెడుపై మంచి సాధించిన విజయోత్సవం, జమ్మి చెట్టు (శమీ) పూజ, పాలపిట్ట దర్శనం.',
              descEnglish: 'Grand victory of Dharma over evil, Shami tree worship, and auspicious beginnings.'
            });
          }
        }
      } catch {}
    }
    // Remove duplicate dates if any and sort chronologically
    const seenDates = new Set();
    const unique = [];
    for (const f of fests) {
      const key = `${f.dateIso}-${f.titleEnglish}`;
      if (!seenDates.has(key)) {
        seenDates.add(key);
        unique.push(f);
      }
    }
    unique.sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime());
    return unique;
  }, []);

  // Load Monthly Festivals for navYear and navMonth
  const loadFestivals = useCallback(async (y, m) => {
    setIsLoadingFestivals(true);
    try {
      const res = await fetch(`/api/panchang/festivals?year=${y}&month=${m}&city=Hyderabad&lat=17.3850&lon=78.4867`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setImportantDates(json.data);
          setIsLoadingFestivals(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Backend festivals API unavailable, calculating fallback:", e);
    }
    
    // Fallback to local client computation so users always see festivals
    const fallbackList = calculateClientFallbackFestivals(y, m);
    setImportantDates(fallbackList);
    setIsLoadingFestivals(false);
  }, [calculateClientFallbackFestivals]);

  // Sync panchang whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      loadPanchangData(selectedDate);
    }
  }, [selectedDate, loadPanchangData]);

  // Sync festivals whenever navYear or navMonth changes
  useEffect(() => {
    loadFestivals(navYear, navMonth);
  }, [navYear, navMonth, loadFestivals]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (navMonth === 1) {
      setNavMonth(12);
      setNavYear(prev => prev - 1);
    } else {
      setNavMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (navMonth === 12) {
      setNavMonth(1);
      setNavYear(prev => prev + 1);
    } else {
      setNavMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setNavYear(todayYear);
    setNavMonth(todayMonth);
    setSelectedDate(todayIST);
  };

  // When a user clicks on a festival card, view its daily panchang!
  const handleFestivalClick = (item) => {
    if (item.dateIso) {
      setSelectedDate(item.dateIso);
    }
  };

  const currentMonthObj = TELUGU_MONTHS.find(m => m.id === navMonth) || TELUGU_MONTHS[0];
  const displayedImportantDates = showAllImportantDates ? importantDates : importantDates.slice(0, 5);

  return (
    <div className="telugu-calendar-section" id="daily-calendar">
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15', marginTop: '0', marginBottom: '0' }}>
          {isTelugu ? 'నిత్య పంచాంగం & మాస పండుగలు' : 'Daily Panchangam & Monthly Festivals'}
        </h2>
        <div className="floral-divider" style={{ margin: '12px auto' }}>
          <img src="/lotus.svg" alt="divider" style={{ width: 24, opacity: 0.5 }} />
        </div>
      </div>
      
      <div className="tc-container">
        
        {/* Left Column: Monthly Festival Calendar */}
        <div className="tc-left-col tc-card">
          <div className="tc-header">
            <div className="tc-header-icon">📜</div>
            <div style={{ flex: 1 }}>
              <h2>{isTelugu ? 'ముఖ్యమైన పండుగలు & శుభ దినాలు' : 'Important Festivals & Auspicious Days'}</h2>
              <p>{isTelugu ? 'ఆంధ్రప్రదేశ్ & తెలంగాణ సంప్రదాయ దృక్సిద్ధాంత పంచాంగం' : 'Andhra Pradesh & Telangana Telugu Amanta Shastric Tradition'}</p>
            </div>
            <div className="tc-bg-mandala"></div>
          </div>

          {/* Month & Year Navigation Bar */}
          <div className="tc-month-nav-bar">
            <button 
              type="button" 
              className="tc-nav-btn" 
              onClick={handlePrevMonth}
              title={isTelugu ? 'గత నెల' : 'Previous Month'}
              aria-label="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="tc-nav-selectors">
              <select 
                value={navMonth} 
                onChange={(e) => setNavMonth(parseInt(e.target.value, 10))}
                className="tc-nav-select"
                aria-label="Select Month"
              >
                {TELUGU_MONTHS.map(m => (
                  <option key={m.id} value={m.id}>
                    {isTelugu ? `${m.te} (${m.en})` : `${m.en} (${m.te})`}
                  </option>
                ))}
              </select>

              <select 
                value={navYear} 
                onChange={(e) => setNavYear(parseInt(e.target.value, 10))}
                className="tc-nav-select"
                aria-label="Select Year"
              >
                {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

              <button 
                type="button" 
                className={`tc-today-badge-btn ${(navYear === todayYear && navMonth === todayMonth) ? 'active' : ''}`}
                onClick={handleJumpToToday}
                title={isTelugu ? 'ప్రస్తుత నెల మరియు నేటి తేదీకి వెళ్లండి' : 'Jump to Today'}
              >
                <RotateCcw size={13} /> {isTelugu ? 'ఈ రోజు' : 'Today'}
              </button>
            </div>

            <button 
              type="button" 
              className="tc-nav-btn" 
              onClick={handleNextMonth}
              title={isTelugu ? 'తరువాతి నెల' : 'Next Month'}
              aria-label="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="tc-month-heading-banner">
            <span>
              {isTelugu ? `${currentMonthObj.te} ${navYear}` : `${currentMonthObj.en} ${navYear}`}
            </span>
            <small>
              {isTelugu ? `(${importantDates.length} పర్వదినాలు & తిథులు)` : `(${importantDates.length} observances)`}
            </small>
          </div>

          {/* Festival List / Timeline */}
          {isLoadingFestivals ? (
            <div className="tc-loading-box">
              <Sparkles size={24} className="tc-spin-icon" />
              <p>{isTelugu ? 'పంచాంగ గణన జరుగుతోంది...' : 'Calculating festival calendar...'}</p>
            </div>
          ) : importantDates.length === 0 ? (
            <div className="tc-empty-state">
              <div className="tc-empty-icon">🕉️</div>
              <h4>{isTelugu ? 'ఈ నెలలో ప్రత్యేక పండుగలు నమోదు కాలేదు' : 'No major festivals recorded for this month'}</h4>
              <p>{isTelugu ? 'మరొక నెల లేదా సంవత్సరాన్ని ఎంచుకోండి.' : 'Please select another month or year above.'}</p>
            </div>
          ) : (
            <div className={`tc-timeline ${showAllImportantDates ? 'expanded' : ''}`}>
              {displayedImportantDates.map((item, idx) => {
                const isSelected = selectedDate === item.dateIso;
                const isTodayFestival = todayIST === item.dateIso;
                const primaryTitle = isTelugu ? item.title : (item.titleEnglish || item.title);
                const secondaryTitle = isTelugu ? item.titleEnglish : item.title;
                const primaryDay = isTelugu ? item.day : (item.dayEnglish || item.day);

                return (
                  <div 
                    key={item.festival_key || idx} 
                    className={`tc-timeline-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleFestivalClick(item)}
                    title={isTelugu ? 'ఈ రోజు పంచాంగం చూడటానికి క్లిక్ చేయండి' : "Click to view this day's Panchangam"}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="tc-timeline-dot"></div>
                    <div className="tc-timeline-date">
                      <strong>{item.date}</strong>
                      <span>{primaryDay}</span>
                      {isTodayFestival && (
                        <span className="tc-today-chip">{isTelugu ? 'నేడు' : 'Today'}</span>
                      )}
                    </div>
                    <div className="tc-timeline-content">
                      <div className="tc-festival-title-row">
                        <h4>{primaryTitle}</h4>
                        {item.category && (
                          <span className={`tc-category-tag ${item.category}`}>
                            {item.category === 'major' ? (isTelugu ? 'ప్రధాన పండుగ' : 'Major Festival') : 
                             item.category === 'vrata' ? (isTelugu ? 'వ్రతం / ఉపవాసం' : 'Vratam / Fast') : 
                             (isTelugu ? 'ముఖ్య తిథి' : 'Key Tithi')}
                          </span>
                        )}
                      </div>
                      {secondaryTitle && secondaryTitle !== primaryTitle && (
                        <div className="tc-secondary-title">{secondaryTitle}</div>
                      )}
                      {(item.desc || item.descEnglish) && (
                        <p className="tc-fest-desc">
                          {isTelugu ? (item.desc || item.descEnglish) : (item.descEnglish || item.desc)}
                        </p>
                      )}
                    </div>
                    <div className="tc-timeline-icon">{item.icon || '🕉️'}</div>
                  </div>
                );
              })}
            </div>
          )}

          {importantDates.length > 5 && (
            <button 
              type="button"
              className="tc-more-btn" 
              onClick={() => setShowAllImportantDates(!showAllImportantDates)}
            >
              <Calendar size={16} /> 
              {showAllImportantDates 
                ? (isTelugu ? 'తక్కువ రోజులు చూడండి' : 'Show Fewer Days') 
                : (isTelugu ? `అన్ని పండుగలు చూడండి (${importantDates.length})` : `View All Festivals (${importantDates.length})`)} 
              <ChevronRight size={16} style={{ transform: showAllImportantDates ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          )}
        </div>

        {/* Right Column: Daily Panchangam */}
        <div className="tc-right-col tc-card">
          <div className="tc-header center">
            <div className="tc-header-icon-small">🧑‍🦲</div>
            <h2>{isTelugu ? 'నిత్య పంచాంగం' : "Today's Panchangam"}</h2>
            <div className="tc-location-badge">
              <MapPin size={13} /> {isTelugu ? 'హైదరాబాద్ (IST • దృక్సిద్ధాంతం)' : 'Hyderabad (IST • Drik Ganita)'}
            </div>
          </div>
          
          <div className="tc-date-picker-wrap">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="tc-date-picker"
              aria-label="Select Panchang date"
            />
            {selectedDate !== todayIST && (
              <button 
                type="button" 
                onClick={() => setSelectedDate(todayIST)}
                className="tc-today-picker-btn"
                title={isTelugu ? 'నేటి తేదీని ఎంచుకోండి' : 'Reset to Today'}
              >
                {isTelugu ? 'నేడు' : 'Today'}
              </button>
            )}
          </div>

          <div className="tc-selected-date-display">
            <h3>{panchangam.dateDisplay}, {isTelugu ? panchangam.varam : panchangam.varamEnglish}</h3>
            <p className="tc-samvat-info">{panchangam.yearName}</p>
          </div>

          {/* Sunrise and Sunset Bar */}
          <div className="tc-sun-grid">
            <div className="tc-sun-box sunrise">
              <Sunrise size={22} className="tc-sun-icon" />
              <div>
                <span className="tc-sun-label">{isTelugu ? 'సూర్యోదయం' : 'Sunrise'}</span>
                <strong className="tc-sun-time">{panchangam.sunrise}</strong>
              </div>
            </div>
            <div className="tc-sun-box sunset">
              <Sunset size={22} className="tc-sun-icon" />
              <div>
                <span className="tc-sun-label">{isTelugu ? 'సూర్యాస్తమయం' : 'Sunset'}</span>
                <strong className="tc-sun-time">{panchangam.sunset}</strong>
              </div>
            </div>
          </div>

          {/* Panchang Details List */}
          <div className={`tc-panchangam-list ${isLoadingPanchang ? 'tc-loading' : ''}`}>
            {/* Tithi Row */}
            <div className="tc-p-row">
              <div className="tc-p-label"><Moon size={18} color="#F5A623" /> {isTelugu ? 'తిథి' : 'Tithi'}</div>
              <div className="tc-p-value">
                : {panchangam.paksham} {isTelugu ? panchangam.tithiName : panchangam.tithiNameEnglish} {isTelugu ? panchangam.tithiEndDisplay : panchangam.tithiEndDisplayEn}
                {panchangam.secondaryTithi && (
                  <div className="tc-sub-transition">
                    {isTelugu ? 'తరువాత' : 'Followed by'} {isTelugu ? panchangam.secondaryTithi.nameTe : (panchangam.secondaryTithi.nameEn || panchangam.secondaryTithi.nameTe)}
                  </div>
                )}
              </div>
            </div>

            {/* Varam Row */}
            <div className="tc-p-row">
              <div className="tc-p-label"><BookOpen size={18} color="#D2B48C" /> {isTelugu ? 'వారం' : 'Varam'}</div>
              <div className="tc-p-value">: {isTelugu ? panchangam.varam : panchangam.varamEnglish} ({isTelugu ? panchangam.varamEnglish : panchangam.varam})</div>
            </div>

            {/* Nakshatram Row */}
            <div className="tc-p-row">
              <div className="tc-p-label"><Star size={18} color="#F8E71C" /> {isTelugu ? 'నక్షత్రం' : 'Nakshatram'}</div>
              <div className="tc-p-value">
                : {panchangam.nakshatraName} {panchangam.nakshatraEndDisplay}
                {panchangam.secondaryNakshatra && (
                  <div className="tc-sub-transition">
                    {isTelugu ? 'తరువాత' : 'Followed by'} {panchangam.secondaryNakshatra.nameTe}
                  </div>
                )}
              </div>
            </div>

            {/* Yogam Row */}
            <div className="tc-p-row">
              <div className="tc-p-label"><Clock size={18} color="#7ED321" /> {isTelugu ? 'యోగం' : 'Yogam'}</div>
              <div className="tc-p-value">: {panchangam.yogaName} {panchangam.yogaEndDisplay}</div>
            </div>

            {/* Karanam Row */}
            <div className="tc-p-row">
              <div className="tc-p-label"><Compass size={18} color="#E04E15" /> {isTelugu ? 'కరణం' : 'Karanam'}</div>
              <div className="tc-p-value">: {panchangam.karanaName} {panchangam.karanaEndDisplay}</div>
            </div>

            {/* Rahu Kalam Row */}
            {panchangam.rahuKalam && (
              <div className="tc-p-row">
                <div className="tc-p-label"><Clock size={18} color="#D0021B" /> {isTelugu ? 'రాహుకాలం' : 'Rahu Kalam'}</div>
                <div className="tc-p-value">: {panchangam.rahuKalam}</div>
              </div>
            )}

            {/* Yamagandam Row */}
            {panchangam.yamaganda && (
              <div className="tc-p-row">
                <div className="tc-p-label"><Clock size={18} color="#9013FE" /> {isTelugu ? 'యమగండం' : 'Yamagandam'}</div>
                <div className="tc-p-value">: {panchangam.yamaganda}</div>
              </div>
            )}

            {/* Abhijit Muhurtham Row */}
            {panchangam.abhijitMuhurta && (
              <div className="tc-p-row">
                <div className="tc-p-label"><Sun size={18} color="#F5A623" /> {isTelugu ? 'అభిజిత్ ముహూర్తం' : 'Abhijit Muhurtham'}</div>
                <div className="tc-p-value">: {panchangam.abhijitMuhurta}</div>
              </div>
            )}
          </div>

          <div className="tc-footer-blessing">
            <div className="tc-line"></div>
            <div className="tc-bless-text">
              {isTelugu ? '🕉️ శుభం భవతు' : '🕉️ May It Be Auspicious • Shubham Bhavatu'}
            </div>
            <div className="tc-line"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeluguCalendar;
