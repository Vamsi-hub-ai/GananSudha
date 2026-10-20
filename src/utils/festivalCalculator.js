import { getDailyPanchang } from 'panchang-ts';

const HYDERABAD_LOCATION = {
  city: 'Hyderabad',
  state: 'Telangana',
  latitude: 17.3850,
  longitude: 78.4867,
  elevation: 505
};

const VARAM_NAMES_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const VARAM_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Calculates authoritative Telugu Amanta festivals for a given Gregorian year and month.
 * Used as high-reliability fallback when backend database is uninitialized or unreachable.
 */
export function calculateClientFestivals(year, month) {
  const y = parseInt(year, 10);
  const m = parseInt(month, 10);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const fests = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dt = new Date(Date.UTC(y, m - 1, d, 6, 0, 0));
    try {
      const p = getDailyPanchang(dt, {
        latitude: HYDERABAD_LOCATION.latitude,
        longitude: HYDERABAD_LOCATION.longitude,
        elevation: HYDERABAD_LOCATION.elevation
      }, {
        timezone: 'Asia/Kolkata',
        ayanamsa: 'lahiri',
        masaSystem: 'amanta'
      });

      const dayOfWeek = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
      const dayTe = VARAM_NAMES_TE[dayOfWeek] || '';
      const dayEn = VARAM_NAMES_EN[dayOfWeek] || '';
      const dayNum = String(d).padStart(2, '0');
      const monthNum = String(m).padStart(2, '0');
      const dateIso = `${y}-${monthNum}-${dayNum}`;
      const dateDisplay = `${dayNum}-${monthNum}-${y}`;

      const t0 = (p.tithis && p.tithis[0]) ? p.tithis[0].index : -1;
      const masaIdx = p.chandramasa?.amantaIndex ?? 0;

      // Shukla Ekadashi (Tithi 10)
      if (t0 === 10) {
        fests.push({
          id: fests.length + 1,
          festival_key: `ekadashi-shukla-${d}-${m}-${y}`,
          title_en: 'Shukla Paksha Ekadashi',
          title_te: 'శుక్ల ఏకాదశి వ్రతం',
          title: 'శుక్ల ఏకాదశి వ్రతం',
          titleEnglish: 'Shukla Paksha Ekadashi',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Auspicious Ekadashi fast dedicated to Lord Maha Vishnu for spiritual purity.',
          description_te: 'సర్వపాప హరణమైన శుక్ల పక్ష ఏకాదశి ఉపవాస వ్రతం మరియు శ్రీమహావిష్ణు పూజ.',
          desc: 'సర్వపాప హరణమైన శుక్ల పక్ష ఏకాదశి ఉపవాస వ్రతం మరియు శ్రీమహావిష్ణు పూజ.',
          descEnglish: 'Auspicious Ekadashi fast dedicated to Lord Maha Vishnu for spiritual purity.',
          icon: '🪷',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Krishna Ekadashi (Tithi 25)
      else if (t0 === 25) {
        const titleEn = (m === 10) ? 'Indira Ekadashi' : 'Krishna Paksha Ekadashi';
        const titleTe = (m === 10) ? 'ఇందిరా ఏకాదశి' : 'బహుళ ఏకాదశి వ్రతం';
        fests.push({
          id: fests.length + 1,
          festival_key: `ekadashi-krishna-${d}-${m}-${y}`,
          title_en: titleEn,
          title_te: titleTe,
          title: titleTe,
          titleEnglish: titleEn,
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Krishna Paksha Ekadashi fasting and devotional chanting.',
          description_te: 'బహుళ ఏకాదశి ఉపవాస వ్రతం మరియు హరి నామస్మరణ.',
          desc: 'బహుళ ఏకాదశి ఉపవాస వ్రతం మరియు హరి నామస్మరణ.',
          descEnglish: 'Krishna Paksha Ekadashi fasting and devotional chanting.',
          icon: '🌱',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Shukla Pradosham (Tithi 12)
      else if (t0 === 12) {
        fests.push({
          id: fests.length + 1,
          festival_key: `pradosham-shukla-${d}-${m}-${y}`,
          title_en: 'Shukla Pradosha Vratam',
          title_te: 'శుక్ల ప్రదోష వ్రతం',
          title: 'శుక్ల ప్రదోష వ్రతం',
          titleEnglish: 'Shukla Pradosha Vratam',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Evening twilight worship and sacred Bilva archana for Lord Shiva.',
          description_te: 'సాయంసంధ్య వేళ పరమశివునికి రుద్రాభిషేకం మరియు బిల్వార్చన.',
          desc: 'సాయంసంధ్య వేళ పరమశివునికి రుద్రాభిషేకం మరియు బిల్వార్చన.',
          descEnglish: 'Evening twilight worship and sacred Bilva archana for Lord Shiva.',
          icon: '🔱',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Krishna Pradosham (Tithi 27)
      else if (t0 === 27) {
        fests.push({
          id: fests.length + 1,
          festival_key: `pradosham-krishna-${d}-${m}-${y}`,
          title_en: 'Krishna Pradosha Vratam',
          title_te: 'కృష్ణ ప్రదోష వ్రతం',
          title: 'కృష్ణ ప్రదోష వ్రతం',
          titleEnglish: 'Krishna Pradosha Vratam',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Sacred Pradosha dusk worship of Lord Shiva.',
          description_te: 'దోష నివారణ ప్రదోష కాల రుద్రారాధన.',
          desc: 'దోష నివారణ ప్రదోష కాల రుద్రారాధన.',
          descEnglish: 'Sacred Pradosha dusk worship of Lord Shiva.',
          icon: '🔱',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Masik Shivaratri (Tithi 28)
      else if (t0 === 28) {
        fests.push({
          id: fests.length + 1,
          festival_key: `shivaratri-${d}-${m}-${y}`,
          title_en: 'Masik Shivaratri',
          title_te: 'మాస శివరాత్రి',
          title: 'మాస శివరాత్రి',
          titleEnglish: 'Masik Shivaratri',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Monthly vigil and holy linga abhishekam dedicated to Lord Shiva.',
          description_te: 'శివనామ స్మరణ, లింగార్చన మరియు జాగరణ నిష్ట.',
          desc: 'శివనామ స్మరణ, లింగార్చన మరియు జాగరణ నిష్ట.',
          descEnglish: 'Monthly vigil and holy linga abhishekam dedicated to Lord Shiva.',
          icon: '🕉️',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Purnima (Tithi 14)
      else if (t0 === 14) {
        fests.push({
          id: fests.length + 1,
          festival_key: `purnima-${d}-${m}-${y}`,
          title_en: (m === 10) ? 'Sharad Purnima / Kojagari Lakshmi Puja' : 'Purnima (Pournami Vratam)',
          title_te: (m === 10) ? 'శరద్ పౌర్ణమి / కోజాగరి లక్ష్మీ పూజ' : 'పౌర్ణమి (శ్రీ సత్యనారాయణ వ్రతం)',
          title: (m === 10) ? 'శరద్ పౌర్ణమి / కోజాగరి లక్ష్మీ పూజ' : 'పౌర్ణమి (శ్రీ సత్యనారాయణ వ్రతం)',
          titleEnglish: (m === 10) ? 'Sharad Purnima / Kojagari Lakshmi Puja' : 'Purnima (Pournami Vratam)',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'major',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Full moon day, most auspicious for Sri Satyanarayana Swamy Pooja and spiritual merit.',
          description_te: 'శ్రీ సత్యనారాయణ స్వామి దివ్య వ్రతాచరణకు పరమ పవిత్రమైన పున్నమి తిథి.',
          desc: 'శ్రీ సత్యనారాయణ స్వామి దివ్య వ్రతాచరణకు పరమ పవిత్రమైన పున్నమి తిథి.',
          descEnglish: 'Full moon day, most auspicious for Sri Satyanarayana Swamy Pooja and spiritual merit.',
          icon: '🌕',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Amavasya (Tithi 29)
      else if (t0 === 29) {
        const titleEn = (m === 10) ? 'Mahalaya Amavasya / Engili Pula Bathukamma' : 'Amavasya (New Moon)';
        const titleTe = (m === 10) ? 'మహాలయ అమావాస్య / ఎంగిలిపూల బతుకమ్మ' : 'అమావాస్య (పితృ తర్పణ పుణ్యదినం)';
        fests.push({
          id: fests.length + 1,
          festival_key: `amavasya-${d}-${m}-${y}`,
          title_en: titleEn,
          title_te: titleTe,
          title: titleTe,
          titleEnglish: titleEn,
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'major',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Sacred new moon day for ancestral offerings, charitable donations, and peace.',
          description_te: 'పితృదేవతల ఆరాధన, దానధర్మాలు మరియు పుణ్యస్నానాలకు శ్రేష్ఠమైన దినం.',
          desc: 'పితృదేవతల ఆరాధన, దానధర్మాలు మరియు పుణ్యస్నానాలకు శ్రేష్ఠమైన దినం.',
          descEnglish: 'Sacred new moon day for ancestral offerings, charitable donations, and peace.',
          icon: '🌑',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }
      // Sankashti Chaturthi (Tithi 18)
      else if (t0 === 18) {
        fests.push({
          id: fests.length + 1,
          festival_key: `sankashti-${d}-${m}-${y}`,
          title_en: 'Sankashti Chaturthi',
          title_te: 'సంకష్టహర చతుర్థి',
          title: 'సంకష్టహర చతుర్థి',
          titleEnglish: 'Sankashti Chaturthi',
          date: dateIso,
          dateIso,
          dateDisplay,
          year: y,
          month: m,
          day_te: dayTe,
          day_en: dayEn,
          day: dayTe,
          dayEnglish: dayEn,
          category: 'vrata',
          tradition: 'Telugu Amanta (Andhra & Telangana)',
          description_en: 'Lord Ganesha fasting for removing distress and evening moonrise prayers.',
          description_te: 'సంకటాల నివారణకు శ్రీ వినాయక వ్రతం మరియు చంద్ర దర్శన పూజ.',
          desc: 'సంకటాల నివారణకు శ్రీ వినాయక వ్రతం మరియు చంద్ర దర్శన పూజ.',
          descEnglish: 'Lord Ganesha fasting for removing distress and evening moonrise prayers.',
          icon: '🐘',
          is_active: 1,
          is_custom: 0,
          source: 'Astronomical Ephemeris (Drik Ganita)'
        });
      }

      // Navaratri & Dussehra in Ashwayuja Masa
      if (masaIdx === 6 || m === 10) {
        if (t0 === 0 && d >= 10 && d <= 15) {
          fests.push({
            id: fests.length + 1,
            festival_key: `navaratri-begins-${d}-${m}-${y}`,
            title_en: 'Sharad Navaratri Begins (Kalasha Sthapana)',
            title_te: 'శరన్నవరాత్రులు ప్రారంభం (కలశస్థాపన)',
            title: 'శరన్నవరాత్రులు ప్రారంభం (కలశస్థాపన)',
            titleEnglish: 'Sharad Navaratri Begins (Kalasha Sthapana)',
            date: dateIso,
            dateIso,
            dateDisplay,
            year: y,
            month: m,
            day_te: dayTe,
            day_en: dayEn,
            day: dayTe,
            dayEnglish: dayEn,
            category: 'major',
            tradition: 'Telugu Amanta (Andhra & Telangana)',
            description_en: 'First day of Durga Navaratri with sacred Kalasha installation.',
            description_te: 'ఆశ్వయుజ శుద్ధ పాడ్యమి — దేవీ నవరాత్రుల ప్రారంభం, ఘటస్థాపన.',
            desc: 'ఆశ్వయుజ శుద్ధ పాడ్యమి — దేవీ నవరాత్రుల ప్రారంభం, ఘటస్థాపన.',
            descEnglish: 'First day of Durga Navaratri with sacred Kalasha installation.',
            icon: '🪔',
            is_active: 1,
            is_custom: 0,
            source: 'Astronomical Ephemeris (Drik Ganita)'
          });
        } else if (t0 === 7 && d >= 15 && d <= 22) {
          fests.push({
            id: fests.length + 1,
            festival_key: `durga-ashtami-${d}-${m}-${y}`,
            title_en: 'Durga Ashtami (Maha Ashtami)',
            title_te: 'దుర్గాష్టమి (మహాష్టమి)',
            title: 'దుర్గాష్టమి (మహాష్టమి)',
            titleEnglish: 'Durga Ashtami (Maha Ashtami)',
            date: dateIso,
            dateIso,
            dateDisplay,
            year: y,
            month: m,
            day_te: dayTe,
            day_en: dayEn,
            day: dayTe,
            dayEnglish: dayEn,
            category: 'major',
            tradition: 'Telugu Amanta (Andhra & Telangana)',
            description_en: 'Auspicious 8th day honoring Goddess Durga Mahishasuramardini.',
            description_te: 'మహిషాసురమర్దిని దుర్గాదేవి విశేష పూజ.',
            desc: 'మహిషాసురమర్దిని దుర్గాదేవి విశేష పూజ.',
            descEnglish: 'Auspicious 8th day honoring Goddess Durga Mahishasuramardini.',
            icon: '⚔️',
            is_active: 1,
            is_custom: 0,
            source: 'Astronomical Ephemeris (Drik Ganita)'
          });
        } else if (t0 === 8 && d >= 16 && d <= 23) {
          fests.push({
            id: fests.length + 1,
            festival_key: `maha-navami-${d}-${m}-${y}`,
            title_en: 'Maha Navami / Saddula Bathukamma / Ayudha Pooja',
            title_te: 'మహార్నవమి / సద్దుల బతుకమ్మ / ఆయుధ పూజ',
            title: 'మహార్నవమి / సద్దుల బతుకమ్మ / ఆయుధ పూజ',
            titleEnglish: 'Maha Navami / Saddula Bathukamma / Ayudha Pooja',
            date: dateIso,
            dateIso,
            dateDisplay,
            year: y,
            month: m,
            day_te: dayTe,
            day_en: dayEn,
            day: dayTe,
            dayEnglish: dayEn,
            category: 'major',
            tradition: 'Telugu Amanta (Andhra & Telangana)',
            description_en: 'Great Ninth day honoring weapons, books, and Saddula Bathukamma grand finale.',
            description_te: 'ఆశ్వయుజ శుద్ధ నవమి — ఆయుధ పూజ, తెలంగాణ సద్దుల బతుకమ్మ సంబరాలు.',
            desc: 'ఆశ్వయుజ శుద్ధ నవమి — ఆయుధ పూజ, తెలంగాణ సద్దుల బతుకమ్మ సంబరాలు.',
            descEnglish: 'Great Ninth day honoring weapons, books, and Saddula Bathukamma grand finale.',
            icon: '🌸',
            is_active: 1,
            is_custom: 0,
            source: 'Astronomical Ephemeris (Drik Ganita)'
          });
        } else if (t0 === 9 && d >= 17 && d <= 24) {
          fests.push({
            id: fests.length + 1,
            festival_key: `vijaya-dashami-${d}-${m}-${y}`,
            title_en: 'Vijaya Dashami (Dussehra / Dasara)',
            title_te: 'విజయదశమి (దసరా / శమీ పూజ)',
            title: 'విజయదశమి (దసరా / శమీ పూజ)',
            titleEnglish: 'Vijaya Dashami (Dussehra / Dasara)',
            date: dateIso,
            dateIso,
            dateDisplay,
            year: y,
            month: m,
            day_te: dayTe,
            day_en: dayEn,
            day: dayTe,
            dayEnglish: dayEn,
            category: 'major',
            tradition: 'Telugu Amanta (Andhra & Telangana)',
            description_en: 'Grand victory of Dharma over evil, Shami tree worship, and auspicious beginnings.',
            description_te: 'చెడుపై మంచి సాధించిన విజయోత్సవం, జమ్మి చెట్టు (శమీ) పూజ, పాలపిట్ట దర్శనం.',
            desc: 'చెడుపై మంచి సాధించిన విజయోత్సవం, జమ్మి చెట్టు (శమీ) పూజ, పాలపిట్ట దర్శనం.',
            descEnglish: 'Grand victory of Dharma over evil, Shami tree worship, and auspicious beginnings.',
            icon: '🏹',
            is_active: 1,
            is_custom: 0,
            source: 'Astronomical Ephemeris (Drik Ganita)'
          });
        }
      }
    } catch {}
  }

  // Remove duplicates and sort chronologically
  const seenKeys = new Set();
  const result = [];
  for (const f of fests) {
    if (!seenKeys.has(f.festival_key)) {
      seenKeys.add(f.festival_key);
      result.push(f);
    }
  }
  result.sort((a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime());
  return result;
}
