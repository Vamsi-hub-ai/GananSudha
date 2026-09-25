import React, { useState, useEffect } from 'react';
import './TeluguCalendar.css';
import { Calendar, Moon, Star, Clock, Sun, ChevronRight, BookOpen } from 'lucide-react';
import { getDailyPanchang, getFestivalsInRange } from 'panchang-ts';

const getIconForFestival = (name) => {
  const n = name.toLowerCase();
  if (n.includes('ekadashi')) return '🌱';
  if (n.includes('chaturthi')) return '🐘';
  if (n.includes('purnima') || n.includes('paurnami')) return '🌕';
  if (n.includes('amavasya')) return '🌑';
  if (n.includes('shivaratri')) return '🛕';
  if (n.includes('sankranti')) return '🌞';
  if (n.includes('karthigai')) return '🪔';
  if (n.includes('bonalu')) return '🌺';
  if (n.includes('rath yatra')) return '🛕';
  if (n.includes('pradosha')) return '🙏';
  return '🕉️';
};

const festivalNameMap = {
  'Masik Karthigai': 'మాస కార్తీక',
  'Masik Shivaratri': 'మాస శివరాత్రి',
  'Pradosha Vrata': 'ప్రదోష వ్రతం',
  'Sankashti Chaturthi': 'సంకష్టహర చతుర్థి',
  'Vinayaka Chaturthi': 'వినాయక చవితి',
  'Ekadashi': 'ఏకాదశి',
  'Smarta Ekadashi': 'స్మార్త ఏకాదశి',
  'Vaishnava Ekadashi': 'వైష్ణవ ఏకాదశి',
  'Guru Purnima': 'గురు పౌర్ణమి',
  'Sankranti': 'సంక్రాంతి',
  'Dakshinayana': 'దక్షిణాయనం',
  'Vat Savitri (Amavasya)': 'వట సావిత్రి (అమావాస్య)',
  'Bonalu': 'బోనాలు',
  'Jagannath Rath Yatra': 'జగన్నాథ రథయాత్ర',
  'Pahili Raja': 'పహిలి రాజా',
  'Basi Raja': 'బాసి రాజా',
  'Raja Sankranti': 'రాజా సంక్రాంతి',
  'Harela': 'హరేలా'
};

const thidhiNames = ['పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'పౌర్ణమి', 'పాడ్యమి', 'విదియ', 'తదియ', 'చవితి', 'పంచమి', 'షష్ఠి', 'సప్తమి', 'అష్టమి', 'నవమి', 'దశమి', 'ఏకాదశి', 'ద్వాదశి', 'త్రయోదశి', 'చతుర్దశి', 'అమావాస్య'];
const nakshatramNames = ['అశ్విని', 'భరణి', 'కృత్తిక', 'రోహిణి', 'మృగశిర', 'ఆరుద్ర', 'పునర్వసు', 'పుష్యమి', 'ఆశ్లేష', 'మఖ', 'పుబ్బ', 'ఉత్తర', 'హస్త', 'చిత్త', 'స్వాతి', 'విశాఖ', 'అనూరాధ', 'జ్యేష్ఠ', 'మూల', 'పూర్వాషాడ', 'ఉత్తరాషాడ', 'శ్రవణం', 'ధనిష్ఠ', 'శతభిషం', 'పూర్వాభాద్ర', 'ఉత్తరాభాద్ర', 'రేవతి'];
const yogamNames = ['విష్కంభ', 'ప్రీతి', 'ఆయుష్మాన్', 'సౌభాగ్య', 'శోభన', 'అతిగండ', 'సుకర్మ', 'ధృతి', 'శూల', 'గండ', 'వృద్ధి', 'ధృవ', 'వ్యాఘాత', 'హర్షణ', 'వజ్ర', 'సిద్ధి', 'వ్యతీపాత', 'వరియాన్', 'పరిఘ', 'శివ', 'సిద్ధ', 'సాధ్య', 'శుభ', 'శుక్ల', 'బ్రహ్మ', 'ఐంద్ర', 'వైధృతి'];
const karanaMap = { 'Bava': 'బవ', 'Balava': 'బాలవ', 'Kaulava': 'కౌలవ', 'Taitila': 'తైతుల', 'Gara': 'గరజ', 'Vanija': 'వణిజ', 'Vishti': 'విష్టి', 'Shakuni': 'శకుని', 'Chatushpada': 'చతుష్పాద', 'Naga': 'నాగ', 'Kimstughna': 'కింస్తుఘ్న' };
const pakshamNames = {'Shukla': 'శుక్ల పక్షం', 'Krishna': 'కృష్ణ పక్షం'};
const varamNames = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

const formatTime = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleTimeString('te-IN', { hour: '2-digit', minute: '2-digit' });
};

const getPanchangamForDate = (dateString) => {
  const dateObj = new Date(dateString);
  
  try {
    const p = getDailyPanchang(dateObj, { latitude: 17.3850, longitude: 78.4867 }, {});
    
    const tithi = p.tithis[0];
    const nakshatra = p.nakshatras[0];
    const yoga = p.yogas[0];
    const karana = p.karanas[0];

    const thidhiTe = thidhiNames[tithi.index] || tithi.name;
    const nakshatraTe = nakshatramNames[nakshatra.index] || nakshatra.name;
    const yogaTe = yogamNames[yoga.index] || yoga.name;
    const karanaTe = karanaMap[karana.name] || karana.name;
    const getSamvatsaraName = (year) => {
      // 2026 is Parabhava (పరాభవ)
      if (year === 2026) return 'శ్రీ పరాభవ నామ సంవత్సరం';
      if (year === 2025) return 'శ్రీ విశ్వావసు నామ సంవత్సరం';
      if (year === 2024) return 'శ్రీ క్రోధి నామ సంవత్సరం';
      if (year === 2027) return 'శ్రీ ప్లవంగ నామ సంవత్సరం';
      return 'శ్రీ శోభకృతు నామ సంవత్సరం';
    };
    const yearName = getSamvatsaraName(dateObj.getFullYear());

    return {
      thidhi: `${thidhiTe} ${tithi.endTime ? formatTime(tithi.endTime) + ' వరకు' : ''}`,
      nakshatram: `${nakshatraTe} ${nakshatra.endTime ? formatTime(nakshatra.endTime) + ' వరకు' : ''}`,
      yogam: `${yogaTe} ${yoga.endTime ? formatTime(yoga.endTime) + ' వరకు' : ''}`,
      karanam: `${karanaTe} ${karana.endTime ? formatTime(karana.endTime) + ' వరకు' : ''}`,
      paksham: pakshamNames[tithi.paksha] || tithi.paksha,
      varam: varamNames[dateObj.getDay()],
      dateDisplay: `${dateObj.getDate()} ${dateObj.toLocaleString('te-IN', { month: 'long' })} ${dateObj.getFullYear()}`,
      yearName: yearName
    };
  } catch (e) {
    console.error("Panchangam calculation failed", e);
    // Fallback to static display if API fails
    return {
      thidhi: '-', nakshatram: '-', yogam: '-', karanam: '-', paksham: '-',
      varam: varamNames[dateObj.getDay()],
      dateDisplay: `${dateObj.getDate()} ${dateObj.toLocaleString('te-IN', { month: 'long' })} ${dateObj.getFullYear()}`,
      yearName: ''
    };
  }
};

const TeluguCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [panchangam, setPanchangam] = useState(getPanchangamForDate(new Date().toISOString().split('T')[0]));
  const [importantDates, setImportantDates] = useState([]);
  const [showAllImportantDates, setShowAllImportantDates] = useState(false);

  useEffect(() => {
    if(selectedDate) {
      setPanchangam(getPanchangamForDate(selectedDate));
      
      try {
        const start = new Date(selectedDate);
        start.setDate(1); // First day of the selected month
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        end.setDate(0); // Last day of the selected month
        
        const fests = getFestivalsInRange(start, end, { latitude: 17.3850, longitude: 78.4867 }, {});
        const uniqueFests = [];
        const seenDates = new Set();
        
        for (const f of fests) {
          const dObj = new Date(f.date);
          const dStr = dObj.toISOString().split('T')[0];
          
          if (!seenDates.has(dStr) && uniqueFests.length < 15) {
            seenDates.add(dStr);
            const teTitle = festivalNameMap[f.festival.name] || f.festival.name;
            uniqueFests.push({
              date: `${String(dObj.getDate()).padStart(2, '0')}-${String(dObj.getMonth()+1).padStart(2, '0')}-${dObj.getFullYear()}`,
              day: varamNames[dObj.getDay()],
              title: teTitle,
              desc: f.festival.description || '',
              icon: getIconForFestival(f.festival.name)
            });
          }
        }
        
        if (uniqueFests.length === 0) {
           uniqueFests.push({
              date: '-',
              day: '-',
              title: 'ఈ నెలలో పండుగలు లేవు',
              desc: '',
              icon: '🕉️'
           });
        }
        setImportantDates(uniqueFests);
      } catch (e) {
        console.error("Festival calculation failed", e);
      }
    }
  }, [selectedDate]);

  // Automatically update to today's date exactly at midnight
  useEffect(() => {
    let timeoutId;
    const scheduleMidnightUpdate = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1, 0);
      const msToMidnight = nextMidnight.getTime() - now.getTime();
      
      timeoutId = setTimeout(() => {
        setSelectedDate(new Date().toISOString().split('T')[0]);
        scheduleMidnightUpdate(); // Schedule again for the next day
      }, msToMidnight);
    };

    scheduleMidnightUpdate();
    return () => clearTimeout(timeoutId);
  }, []);

  const displayedImportantDates = showAllImportantDates ? importantDates : importantDates.slice(0, 5);

  return (
    <div className="telugu-calendar-section">
      <div style={{ textAlign: 'center', marginBottom: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A1C15', marginTop: '0', marginBottom: '0' }}>Nitya Calender</h2>
        <div className="floral-divider" style={{ margin: '12px auto' }}><img src="/lotus.svg" alt="divider" style={{ width: 24, opacity: 0.5 }} /></div>
      </div>
      
      <div className="tc-container">
        
        {/* Left Column: Important Days */}
        <div className="tc-left-col tc-card">
          <div className="tc-header">
            <div className="tc-header-icon">📜</div>
            <div>
              <h2>ఈ నెలలోని ప్రధాన రోజులు</h2>
              <p>పూజలు, వ్రతాలు మరియు ముఖ్యమైన తిథులు</p>
            </div>
            <div className="tc-bg-mandala"></div>
          </div>

          <div className={`tc-timeline ${showAllImportantDates ? 'expanded' : ''}`}>
            {displayedImportantDates.map((item, idx) => (
              <div key={idx} className="tc-timeline-item">
                <div className="tc-timeline-dot"></div>
                <div className="tc-timeline-date">
                  <strong>{item.date}</strong>
                  <span>{item.day}</span>
                </div>
                <div className="tc-timeline-content">
                  <h4>{item.title}</h4>
                  {item.desc && <p>{item.desc}</p>}
                </div>
                <div className="tc-timeline-icon">{item.icon}</div>
              </div>
            ))}
          </div>

          {importantDates.length > 5 && (
            <button className="tc-more-btn" onClick={() => setShowAllImportantDates(!showAllImportantDates)}>
              <Calendar size={16} /> {showAllImportantDates ? 'తక్కువ రోజులు చూడండి' : 'మరిన్ని రోజులు చూడండి'} <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Right Column: Daily Panchangam */}
        <div className="tc-right-col tc-card">
          <div className="tc-header center">
            <div className="tc-header-icon-small">🧑‍🦲</div>
            <h2>నిత్య పంచాంగం</h2>
          </div>
          
          <div className="tc-date-picker-wrap">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="tc-date-picker"
            />
          </div>

          <div className="tc-selected-date-display">
            <h3>{panchangam.dateDisplay}, {panchangam.varam}</h3>
            <p>{panchangam.yearName}</p>
          </div>

          <div className="tc-panchangam-list">
            <div className="tc-p-row">
              <div className="tc-p-label"><Calendar size={18} color="#4A90E2" /> తేదీ</div>
              <div className="tc-p-value">: {panchangam.paksham}</div>
            </div>
            <div className="tc-p-row">
              <div className="tc-p-label"><BookOpen size={18} color="#D2B48C" /> వారం</div>
              <div className="tc-p-value">: {panchangam.varam}</div>
            </div>
            <div className="tc-p-row">
              <div className="tc-p-label"><Moon size={18} color="#F5A623" /> తిథి</div>
              <div className="tc-p-value">: {panchangam.thidhi}</div>
            </div>
            <div className="tc-p-row">
              <div className="tc-p-label"><Star size={18} color="#F8E71C" /> నక్షత్రం</div>
              <div className="tc-p-value">: {panchangam.nakshatram}</div>
            </div>
            <div className="tc-p-row">
              <div className="tc-p-label"><Clock size={18} color="#7ED321" /> యోగం</div>
              <div className="tc-p-value">: {panchangam.yogam}</div>
            </div>
            <div className="tc-p-row">
              <div className="tc-p-label"><Sun size={18} color="#F5A623" /> కరణం</div>
              <div className="tc-p-value">: {panchangam.karanam}</div>
            </div>
          </div>

          <div className="tc-footer-blessing">
            <div className="tc-line"></div>
            <div className="tc-bless-text">🕉️ శుభం భవతు</div>
            <div className="tc-line"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeluguCalendar;
