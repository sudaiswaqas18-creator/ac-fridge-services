import React, { useState, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import { waLink } from '../translations.js';

import baAcBefore from '../assets/media/ba-ac-before.jpg';
import baAcAfter from '../assets/media/ba-ac-after.jpg';
import baCleaningBefore from '../assets/media/ba-cleaning-before.jpg';
import baCleaningAfter from '../assets/media/ba-cleaning-after.jpg';
import baFridgeBefore from '../assets/media/ba-fridge-before.jpg';
import baFridgeAfter from '../assets/media/ba-fridge-after.jpg';
import baWasherBefore from '../assets/media/ba-washer-before.jpg';
import baWasherAfter from '../assets/media/ba-washer-after.jpg';
import baMotorBefore from '../assets/media/ba-before.webp';
import baMotorAfter from '../assets/media/ba-after.webp';
import baHvacBefore from '../assets/media/ba-hvac-before.jpg';
import baHvacAfter from '../assets/media/ba-hvac-after.jpg';

const SERVICE_BA_CONFIGS = {
  'ac-repair-riyadh': {
    beforeImg: baAcBefore,
    afterImg: baAcAfter,
    tagAr: 'نتائج صيانة التكييف الميدانية',
    tagEn: 'AC Field Repair Results',
    titleAr: 'مقارنة فحص وإصلاح المكيف قبل وبعد الصيانة',
    titleEn: 'AC Diagnosis: Before vs After Repair',
    descAr: 'شاهد الفارق الملموس في كفاءة التبريد واستهلاك الكهرباء بعد غسيل الملفات وشحن الفريون الأصلي.',
    descEn: 'Experience the tangible cooling boost and reduced power draw after coil restoration and OEM refrigerant recharge.',
    beforeSpecs: [
      { labelAr: 'ضغط الفريون', labelEn: 'Freon PSI', valAr: '32 PSI (منخفض وغير كافٍ)', valEn: '32 PSI (Low & Deficient)' },
      { labelAr: 'حرارة التبريد', labelEn: 'Discharge Temp', valAr: '22°C (تبريد ضعيف)', valEn: '22°C (Weak Cooling)' },
      { labelAr: 'مستوى الضجيج', labelEn: 'Noise Level', valAr: '72 dB (اهتزاز واحتكاك)', valEn: '72 dB (Loud Vibration)' },
      { labelAr: 'سحب التيار', labelEn: 'Amp Draw', valAr: '12.8A (مرتفع ومستهلك)', valEn: '12.8A (High Power Draw)' },
    ],
    afterSpecs: [
      { labelAr: 'ضغط الفريون', labelEn: 'Freon PSI', valAr: '65 PSI (مثالي ومستقر)', valEn: '65 PSI (Optimal & Stable)' },
      { labelAr: 'حرارة التبريد', labelEn: 'Discharge Temp', valAr: '11°C (تبريد ثلجي منعش)', valEn: '11°C (Ice-Cold Output)' },
      { labelAr: 'مستوى الضجيج', labelEn: 'Noise Level', valAr: '38 dB (همس هادئ ومريح)', valEn: '38 dB (Whisper Quiet)' },
      { labelAr: 'سحب التيار', labelEn: 'Amp Draw', valAr: '7.9A (موفر واقتصادي)', valEn: '7.9A (Energy Efficient)' },
    ],
  },
  'ac-cleaning-installation': {
    beforeImg: baCleaningBefore,
    afterImg: baCleaningAfter,
    tagAr: 'غسيل ماكينات التكييف بالضغط',
    tagEn: 'AC Pressure Jet Cleaning',
    titleAr: 'نتائج التنظيف والتعقيم بمضخة الضغط العالي',
    titleEn: 'Deep Pressure Jet Coil Sanitization',
    descAr: 'إزالة كاملة للغبار المتراكم والعفن داخل الفلاتر والكويل الداخلي والخارجي مع غلاف واقي للمنزل.',
    descEn: 'Complete elimination of caked dust, mildew, and allergens with indoor protective wash covers.',
    beforeSpecs: [
      { labelAr: 'انسداد الفلاتر', labelEn: 'Filter Airflow', valAr: '85% مسدود بالغبار', valEn: '85% Clogged with Dust' },
      { labelAr: 'رائحة الهواء', labelEn: 'Air Quality', valAr: 'رائحة رطوبة وعفن', valEn: 'Musty Mildew Odor' },
      { labelAr: 'تدفق الهواء', labelEn: 'CFM Air Flow', valAr: 'ضعيف ومكتوم جداً', valEn: 'Severely Restricted Flow' },
      { labelAr: 'تسريب ماء', labelEn: 'Drain Leak', valAr: 'انسداد مجرى الصرف الداخلي', valEn: 'Blocked Condensate Drain' },
    ],
    afterSpecs: [
      { labelAr: 'انسداد الفلاتر', labelEn: 'Filter Airflow', valAr: '100% نظيف ومعقم تماماً', valEn: '100% Clean & Sanitized' },
      { labelAr: 'رائحة الهواء', labelEn: 'Air Quality', valAr: 'هواء نقي ومنعش', valEn: 'Fresh & Odorless Air' },
      { labelAr: 'تدفق الهواء', labelEn: 'CFM Air Flow', valAr: 'أقصى اندفاع طبيعي', valEn: 'Maximum Factory CFM' },
      { labelAr: 'تسريب ماء', labelEn: 'Drain Leak', valAr: 'مجاري تصريف سالكة بنسبة 100%', valEn: 'Free Flowing Clear Drain' },
    ],
  },
  'refrigerator-freezer-repair': {
    beforeImg: baFridgeBefore,
    afterImg: baFridgeAfter,
    tagAr: 'صيانة الثلاجات والفريزرات',
    tagEn: 'Refrigerator & Freezer Overhaul',
    titleAr: 'إصلاح التبريد واستبدال الكمبروسر والديفروست',
    titleEn: 'Cooling Restoration & Defrost System Repair',
    descAr: 'استعادة درجة التجميد العمیقة وحل مشكلة تراكم الثلج وتسريب المياه خلف الأدراج نهائياً.',
    descEn: 'Restoring optimal sub-zero freezer temps and resolving drain ice blockage permanently.',
    beforeSpecs: [
      { labelAr: 'حرارة الفريزر', labelEn: 'Freezer Temp', valAr: '-2°C (ذوبان الأطعمة وتلفها)', valEn: '-2°C (Food Thawing)' },
      { labelAr: 'تراكم الثلج', labelEn: 'Frost Build-up', valAr: 'انسداد فتحات التبريد بالجليد', valEn: 'Heavy Ice Blockage' },
      { labelAr: 'عمل الكمبروسر', labelEn: 'Compressor Run', valAr: 'تشغيل دائم وسخونة مفرطة', valEn: 'Continuous Overheating' },
      { labelAr: 'كاوتش الباب', labelEn: 'Door Gasket', valAr: 'تسريب برودة واهتراء الإطار', valEn: 'Worn Seal Leaking Cold' },
    ],
    afterSpecs: [
      { labelAr: 'حرارة الفريزر', labelEn: 'Freezer Temp', valAr: '-19°C (تجميد عميق وصحي)', valEn: '-19°C (Deep Sub-Zero Freeze)' },
      { labelAr: 'تراكم الثلج', labelEn: 'Frost Build-up', valAr: 'نظام نوفروست أوتوماتيكي', valEn: 'Zero-Frost Auto Defrost' },
      { labelAr: 'عمل الكمبروسر', labelEn: 'Compressor Run', valAr: 'دورة فصل وتبريد متوازنة', valEn: 'Balanced Thermostat Cycling' },
      { labelAr: 'كاوتش الباب', labelEn: 'Door Gasket', valAr: 'إغلاق مغناطيسي محكم 100%', valEn: '100% Airtight Magnetic Seal' },
    ],
  },
  'washing-machine-dryer': {
    beforeImg: baWasherBefore,
    afterImg: baWasherAfter,
    tagAr: 'صيانة الغسالات والنشافات',
    tagEn: 'Washer & Dryer Mechanics',
    titleAr: 'تجديد رمان البلي ومساعدات الحلة وبرمجة الكارتة',
    titleEn: 'Tub Bearing Overhaul & Control Board Repair',
    descAr: 'القضاء على الاهتزاز العنيف أثناء العصر وإصلاح مشاكل عدم تصريف الماء أو دوران الحلة.',
    descEn: 'Eliminating excessive spin vibrations and repairing pump drains and inverter control boards.',
    beforeSpecs: [
      { labelAr: 'صوت العصر', labelEn: 'Spin Sound', valAr: 'ضجيج رمان بلي تالف واحتكاك', valEn: 'Loud Grinding Bearing Noise' },
      { labelAr: 'حركة الغسالة', labelEn: 'Vibration', valAr: 'اهتزاز عنيف وتحرك من المكان', valEn: 'Violent Shaking & Moving' },
      { labelAr: 'عصر الملابس', labelEn: 'Water Spin', valAr: 'ملابس تخرج مبللة بالكامل', valEn: 'Clothes Soaked & Undrained' },
      { labelAr: 'رموز الأعطال', labelEn: 'Error Codes', valAr: 'أخطاء OE / UE / LE متكررة', valEn: 'Frequent OE / UE / LE Errors' },
    ],
    afterSpecs: [
      { labelAr: 'صوت العصر', labelEn: 'Spin Sound', valAr: 'دوران فائق الهدوء والنعومة', valEn: 'Ultra-Smooth Silent Spin' },
      { labelAr: 'حركة الغسالة', labelEn: 'Vibration', valAr: 'ثبات تام بمساعدات أصلية', valEn: 'Rock-Solid Stability' },
      { labelAr: 'عصر الملابس', labelEn: 'Water Spin', valAr: 'تجفيف فعال وسحب كامل للماء', valEn: 'High-Efficiency Full Spin' },
      { labelAr: 'رموز الأعطال', labelEn: 'Error Codes', valAr: 'برمجة دقيقة بدون أي أخطاء', valEn: 'Zero Errors & Calibrated' },
    ],
  },
  'motor-rewinding-welding': {
    beforeImg: baMotorBefore,
    afterImg: baMotorAfter,
    tagAr: 'إعادة لف المحركات الكهربائية',
    tagEn: 'Electric Motor Rewinding',
    titleAr: 'لف الستاتور بالنحاس النقي وعزل حراري Class H',
    titleEn: 'Stator Rewinding with Pure Copper & Class H',
    descAr: 'تجديد المحركات المحترقة وإعادتها لكفاءة المصنع مع عزل حراري فائق وموازنة ديناميكية.',
    descEn: 'Rebuilding burnt motor windings back to factory standards with high thermal resistance and balancing.',
    beforeSpecs: [
      { labelAr: 'حالة الملفات', labelEn: 'Coil Status', valAr: 'محترقة وشورت كهربائي كامل', valEn: 'Burned Out & Shorted Coils' },
      { labelAr: 'مقاومة العزل', labelEn: 'Insulation MΩ', valAr: '0.2 MΩ (انهيار تام للعازل)', valEn: '0.2 MΩ (Total Breakdown)' },
      { labelAr: 'حرارة التشغيل', labelEn: 'Operating Temp', valAr: 'سخونة مفرطة تفصل فوراً', valEn: 'Severe Overheating Trips' },
      { labelAr: 'سحب الأمبير', labelEn: 'Amperage', valAr: 'ضعف السحب الطبيعي مع دخان', valEn: 'Abnormal High Amps & Smoke' },
    ],
    afterSpecs: [
      { labelAr: 'حالة الملفات', labelEn: 'Coil Status', valAr: 'نحاس كهرومغناطيسي نقي 100%', valEn: '100% Pure OEM Copper Coils' },
      { labelAr: 'مقاومة العزل', labelEn: 'Insulation MΩ', valAr: '> 150 MΩ (عزل Class H معتمد)', valEn: '> 150 MΩ (Certified Class H)' },
      { labelAr: 'حرارة التشغيل', labelEn: 'Operating Temp', valAr: 'حرارة مستقرة تحت أقصى حمل', valEn: 'Cool & Steady Under Load' },
      { labelAr: 'سحب الأمبير', labelEn: 'Amperage', valAr: 'مطابق تماماً لمواصفات المصنع', valEn: 'Exact Factory Amp Specs' },
    ],
  },
  'central-hvac': {
    beforeImg: baHvacBefore,
    afterImg: baHvacAfter,
    tagAr: 'صيانة التكييف المركزي والتجاري',
    tagEn: 'Commercial & Central HVAC Overhaul',
    titleAr: 'مقارنة فحص وغسيل التكييف المركزي قبل وبعد الصيانة',
    titleEn: 'Central HVAC: Before vs After Maintenance',
    descAr: 'شاهد الفارق الملموس بعد إزالة الأتربة الصحراوية المتراكمة عن مكثفات التكييف المركزي وضبط ضغوط الفريون بدقة.',
    descEn: 'Experience the tangible cooling restoration and efficiency surge after deep coil washing and digital manifold calibration.',
    beforeSpecs: [
      { labelAr: 'انسداد المكثف بالأتربة', labelEn: 'Condenser Dirt', valAr: '90% مسدود بالغبار والرمال', valEn: '90% Clogged Desert Sand' },
      { labelAr: 'ضغط رأس الكمبروسر', labelEn: 'Head Pressure', valAr: 'مرتفع وسخونة مفرطة بالسطح', valEn: 'High Head Pressure & Heat' },
      { labelAr: 'سحب تيار الكمبروسر', labelEn: 'Compressor Amps', valAr: 'سحب زائد ومهدد بالفصل', valEn: 'Over-Current Amperage' },
      { labelAr: 'تدفق التبريد للمبنى', labelEn: 'Airflow CFM', valAr: 'تبريد ضعيف واستهلاك مرتفع', valEn: 'Weak Cooling & High Bills' },
    ],
    afterSpecs: [
      { labelAr: 'انسداد المكثف بالأتربة', labelEn: 'Condenser Dirt', valAr: '100% نظيف ومعقم بالكامل', valEn: '100% Gleaming Clean Fins' },
      { labelAr: 'ضغط رأس الكمبروسر', labelEn: 'Head Pressure', valAr: 'ضغط مثالي وتبادل حراري مستقر', valEn: 'Optimal Stable Pressures' },
      { labelAr: 'سحب تيار الكمبروسر', labelEn: 'Compressor Amps', valAr: 'مطابق لمواصفات المصنع الأصلية', valEn: 'Balanced OEM Factory Amps' },
      { labelAr: 'تدفق التبريد للمبنى', labelEn: 'Airflow CFM', valAr: 'أقصى كفاءة تدفق وهواء منعش', valEn: 'Maximum Building Airflow' },
    ],
  },
  default: {
    beforeImg: baHvacBefore,
    afterImg: baHvacAfter,
    tagAr: 'معايير الجودة المعتمدة',
    tagEn: 'Certified Quality Standards',
    titleAr: 'مقارنة دقة الصيانة والفحص الهندسي',
    titleEn: 'Engineering Precision Before vs After Service',
    descAr: 'خدمات هندسية متكاملة تضمن أعلى معايير الأمان والأداء الممتد لجميع المعدات بالرياض.',
    descEn: 'Comprehensive electromechanical services ensuring top safety and peak longevity across Riyadh.',
    beforeSpecs: [
      { labelAr: 'استهلاك الطاقة', labelEn: 'Power Draw', valAr: 'مرتفع وغير اقتصادي', valEn: 'Excessive Power Waste' },
      { labelAr: 'معدل الأعطال', labelEn: 'Failure Rate', valAr: 'توقفات متكررة ومفاجئة', valEn: 'Frequent Sudden Breakdowns' },
      { labelAr: 'أجهزة الفحص', labelEn: 'Diagnostics', valAr: 'تخمين تقليدي غير دقيق', valEn: 'Inaccurate Manual Guesswork' },
      { labelAr: 'الضمان', labelEn: 'Warranty', valAr: 'بدون أي ضمان رسمي', valEn: 'Zero Warranty Protection' },
    ],
    afterSpecs: [
      { labelAr: 'استهلاك الطاقة', labelEn: 'Power Draw', valAr: 'توفير حتى 30% بالطاقة', valEn: 'Up to 30% Power Savings' },
      { labelAr: 'معدل الأعطال', labelEn: 'Failure Rate', valAr: 'استقرار تشغيلي ممتد', valEn: 'Long-Term Reliable Operation' },
      { labelAr: 'أجهزة الفحص', labelEn: 'Diagnostics', valAr: 'فحص رقمي وحراري دقيق', valEn: 'Digital & Thermal Precision' },
      { labelAr: 'الضمان', labelEn: 'Warranty', valAr: 'سند ضمان خطي معتمد 6 أشهر', valEn: 'Official 6-Month Written Warranty' },
    ],
  },
};

const getConfig = (slug) => {
  if (!slug) return SERVICE_BA_CONFIGS.default;
  if (slug.includes('ac-repair') || slug === 'ac-repair') return SERVICE_BA_CONFIGS['ac-repair-riyadh'];
  if (slug.includes('cleaning') || slug === 'ac-cleaning') return SERVICE_BA_CONFIGS['ac-cleaning-installation'];
  if (slug.includes('central') || slug.includes('hvac') || slug === 'central-hvac') return SERVICE_BA_CONFIGS['central-hvac'];
  if (slug.includes('fridge') || slug.includes('refrigerator')) return SERVICE_BA_CONFIGS['refrigerator-freezer-repair'];
  if (slug.includes('washer') || slug.includes('washing')) return SERVICE_BA_CONFIGS['washing-machine-dryer'];
  if (slug.includes('motor') || slug.includes('rewinding')) return SERVICE_BA_CONFIGS['motor-rewinding-welding'];
  if (slug.includes('contract')) return SERVICE_BA_CONFIGS.default;
  return SERVICE_BA_CONFIGS[slug] || SERVICE_BA_CONFIGS.default;
};

export default function ServiceBeforeAfter({ serviceSlug, serviceTitle }) {
  const { isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('after'); // 'before' or 'after'
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const cfg = getConfig(serviceSlug);

  const handleMove = useCallback(clientX => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.min(96, Math.max(4, percent));
    setSliderPos(percent);
  }, []);

  const onMouseDown = e => {
    isDragging.current = true;
    handleMove(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onMouseMove = e => {
    if (!isDragging.current) return;
    handleMove(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section className="service-before-after-section" aria-label="Transformation Showcase">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.bolt}</span>
            {isRTL ? cfg.tagAr : cfg.tagEn}
          </span>
          <h2 className="section-title">
            {isRTL ? cfg.titleAr : cfg.titleEn}
          </h2>
          <p className="section-subtitle">
            {isRTL ? cfg.descAr : cfg.descEn}
          </p>
          <div className="section-divider" />
        </div>

        <div className="service-ba-layout-grid">
          {/* Interactive Drag Comparison Slider Card */}
          <div className="service-ba-visual-card">
            <div
              className="service-ba-interactive-wrapper"
              ref={containerRef}
              style={{ '--ba-slider-pos': `${sliderPos}%` }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onMouseDown}
              onTouchMove={onMouseMove}
              onTouchEnd={onMouseUp}
              role="slider"
              aria-label="Before and After Transformation"
              aria-valuenow={Math.round(sliderPos)}
              tabIndex={0}
            >
              {/* Dual Before / After Images with Clip-Path (Identical to Motor Rewinding Slider) */}
              <img
                src={cfg.beforeImg}
                alt={isRTL ? 'قبل الصيانة' : 'Before Service'}
                className="service-ba-img service-ba-before-img"
                draggable="false"
              />
              <img
                src={cfg.afterImg}
                alt={isRTL ? 'بعد الصيانة' : 'After Service'}
                className="service-ba-img service-ba-after-img"
                draggable="false"
              />

              {/* Dynamic Badges */}
              <div className="service-ba-badge service-ba-badge-before">
                {isRTL ? 'قبل الصيانة (تالف)' : 'Before (Damaged)'}
              </div>
              <div className="service-ba-badge service-ba-badge-after">
                {isRTL ? 'بعد الصيانة (إصلاح جوزاء)' : 'After (Restored)'}
              </div>

              {/* Slider Divider Handle with Custom Grip Knob */}
              <div className="service-ba-divider-line" style={{ left: `${sliderPos}%` }}>
                <div className="service-ba-knob">
                  <span className="knob-drag-icon">{I.sliderKnob}</span>
                </div>
              </div>
            </div>

            <p className="service-ba-slider-hint">
              <span className="hint-icon">{I.sliderKnob}</span>
              <span>
                {isRTL
                  ? 'اسحب المقبض يميناً ويساراً لمقارنة العمل الفعلي قبل وبعد'
                  : 'Drag handle left and right to inspect real before vs after overhaul'}
              </span>
            </p>
          </div>

          {/* Technical Specs Comparison Card */}
          <div className="service-ba-metrics-card">
            <div className="service-ba-tabs-toggle">
              <button
                type="button"
                className={`ba-toggle-btn btn-before ${activeTab === 'before' ? 'active' : ''}`}
                onClick={() => setActiveTab('before')}
              >
                <span className="state-badge-danger">{I.close}</span>
                <span>{isRTL ? 'حالة الجهاز قبل الصيانة' : 'State Before Repair'}</span>
              </button>
              <button
                type="button"
                className={`ba-toggle-btn btn-after ${activeTab === 'after' ? 'active' : ''}`}
                onClick={() => setActiveTab('after')}
              >
                <span className="state-badge-success">{I.check}</span>
                <span>{isRTL ? 'النتيجة بعد صيانة جوزاء' : 'After Jawzaa Service'}</span>
              </button>
            </div>

            <div className="service-ba-specs-body">
              <div className={`specs-list-animated ${activeTab}`}>
                {(activeTab === 'before' ? cfg.beforeSpecs : cfg.afterSpecs).map((spec, i) => (
                  <div className={`spec-metric-row ${activeTab}`} key={i}>
                    <span className="spec-metric-name">
                      {isRTL ? spec.labelAr : spec.labelEn}
                    </span>
                    <span className={`spec-metric-val ${activeTab}`}>
                      {isRTL ? spec.valAr : spec.valEn}
                    </span>
                  </div>
                ))}
              </div>

              <div className="service-ba-guarantee-box">
                <span className="guarantee-icon">{I.shield}</span>
                <p>
                  {isRTL
                    ? 'جميع الإصلاحات تشمل شهادة ضمان خطية معتمدة من مؤسسة جوزاء تصل إلى 6 أشهر مع فحص مجاني.'
                    : 'All repairs include an official written warranty up to 6 months from Jawzaa with complimentary re-checks.'}
                </p>
              </div>

              <a
                href={waLink(isRTL ? `طلب حجز خدمة: ${serviceTitle || cfg.titleAr}` : `Book Service: ${serviceTitle || cfg.titleEn}`)}
                target="_blank"
                rel="noopener"
                className="btn btn-gold-solid btn-block-cta hover-lift"
              >
                <span className="btn-icon">{I.bolt}</span>
                <span>{isRTL ? 'احجز فحصاً مماثلاً لجهازك الآن' : 'Book Immediate Service for Your Unit'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
