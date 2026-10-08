import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardCarousel from './CardCarousel.jsx';
import { SERVICE_BA_CONFIGS } from './ServiceBeforeAfter.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const RESULT_CONFIGS = {
  ...SERVICE_BA_CONFIGS,
  'diagnostic-results': { ...SERVICE_BA_CONFIGS['ac-repair-riyadh'], tagEn: 'Fault Diagnostics', tagAr: 'تشخيص الأعطال', titleEn: 'From Fault Finding to Restored Cooling', titleAr: 'من تشخيص العطل إلى استعادة التبريد', descEn: 'Diagnostic checks guide the repair, followed by cooling and electrical performance verification.', descAr: 'فحص دقيق يحدد الإصلاح المطلوب، يليه التحقق من التبريد والأداء الكهربائي.' },
  'maintenance-results': { ...SERVICE_BA_CONFIGS['ac-cleaning-installation'], tagEn: 'Preventive Maintenance', tagAr: 'الصيانة الوقائية', titleEn: 'Cleaner Coils. More Reliable Performance.', titleAr: 'ملفات أنظف وأداء أكثر استقراراً', descEn: 'Coil cleaning and performance checks are part of scheduled preventive care.', descAr: 'تنظيف الملفات وفحص الأداء ضمن برنامج العناية الوقائية الدورية.' },
};
const RESULTS = [
  ['motor-rewinding-welding', 'motor-rewinding'],
  ['ac-repair-riyadh', 'ac-repair'],
  ['refrigerator-freezer-repair', 'refrigerator-repair'],
  ['ac-cleaning-installation', 'ac-cleaning'],
  ['central-hvac', 'central-hvac'],
  ['diagnostic-results', 'fault-diagnostics'],
  ['maintenance-results', 'maintenance-contracts'],
];
export function ResultCard({ config, path }) {
  const { isRTL } = useLanguage();
  const [position, setPosition] = useState(50);
  return <article className="result-story">
    <div className="result-comparison">
      <div className="result-images">
        <img src={config.beforeImg} alt={isRTL ? 'قبل الصيانة' : 'Before repair'} loading="lazy" draggable="false" />
        <img src={config.afterImg} alt={isRTL ? 'بعد الصيانة' : 'After repair'} loading="lazy" draggable="false" style={{ clipPath: `inset(0 0 0 ${position}%)` }} />
        <span className="result-label before">{isRTL ? 'قبل' : 'Before'}</span>
        <span className="result-label after">{isRTL ? 'بعد' : 'After'}</span>
        <span className="result-handle" style={{ left: `${position}%` }} aria-hidden="true"><span>↔</span></span>
        <input type="range" min="4" max="96" value={position} onChange={e => setPosition(Number(e.target.value))} aria-label={isRTL ? 'مقارنة قبل وبعد الصيانة' : 'Compare before and after repair'} />
      </div>
      <p className="result-hint">{isRTL ? 'اسحب للمقارنة قبل وبعد' : 'Drag to compare before and after'}</p>
    </div>
    <div className="result-copy">
      <span className="result-eyebrow">{isRTL ? config.tagAr : config.tagEn}</span>
      <h3>{isRTL ? config.titleAr : config.titleEn}</h3>
      <p>{isRTL ? config.descAr : config.descEn}</p>
      <dl>{config.afterSpecs.map((spec, i) => <div key={i}><dt>{isRTL ? spec.labelAr : spec.labelEn}</dt><dd>{isRTL ? spec.valAr : spec.valEn}</dd></div>)}</dl>
      <Link className="btn btn-gold" to={`/services/${path}`}>{isRTL ? 'تفاصيل الخدمة' : 'Explore This Service'} <span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
export default function BeforeAfter({ expanded = false }) {
  const { isRTL } = useLanguage();
  if (expanded) return <div className="work-results-sections">{RESULTS.map(([key,path], index) => <section className="work-result-section" key={key} id={path}><div className="container"><div className="work-result-heading"><span>{String(index + 1).padStart(2, '0')}</span><h2>{isRTL ? RESULT_CONFIGS[key].tagAr : RESULT_CONFIGS[key].tagEn}</h2></div><ResultCard config={RESULT_CONFIGS[key]} path={path} /></div></section>)}</div>;
  return <section className="ba-section results-section">
    <div className="container">
      <div className="section-header">
        <span className="section-tag light-tag">{isRTL ? 'نتائج أعمالنا' : 'See the Difference'}</span>
        <h2 className="section-title">{isRTL ? 'عناية دقيقة. نتائج واضحة.' : 'Expert Care. Visible Results.'}</h2>
        <p className="section-subtitle">{isRTL ? 'اكتشف نتائج صيانة المكيفات والثلاجات ولف المحركات.' : 'Explore before-and-after results across AC care, refrigeration and motor rewinding.'}</p>
        <div className="section-divider" />
      </div>
    </div>
    <CardCarousel className="results-carousel" label={isRTL ? 'نتائج قبل وبعد' : 'Before and after results'}>
      {RESULTS.map(([key,path]) => <ResultCard key={key} config={RESULT_CONFIGS[key]} path={path} />)}
    </CardCarousel>
  </section>;
}
