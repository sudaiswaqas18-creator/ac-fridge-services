import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import { localizedValue } from '../localizedValue.js';

const INDUSTRIES_DETAILS = {
  residential: {
    id: 'residential',
    icon: 'home',
    titleAr: 'حلول صيانة التكييف والأجهزة للفلل والمجمعات السكنية',
    titleEn: 'Residential Villa & Compound HVAC Solutions',
    subtitleAr: 'صيانة منزلية شاملة سريعة في نفس اليوم لكافة أحياء الرياض مع حماية كاملة لأثاث ومفروشات المنزل.',
    subtitleEn: 'Comprehensive same-day on-site maintenance across all Riyadh districts with 100% furniture & floor protection.',
    overviewAr: `توفر مؤسسة جوزاء للتبريد والتكييف خدمات صيانة منزلية راقية مصممة خصيصاً للفلل والقصور والشقق والمجمعات السكنية في الرياض. ندرك أهمية الراحة والخصوصية للعائلة، ولذلك يعمل فنيونا وفق أعلى معايير النظافة والاحترافية والأمانة.

تشمل خدماتنا السكنية: الغسيل والتعقيم العميق لكافة مكيفات السبليت والكونسيلد والشباك، شحن الفريون الأصلي، كشف وإصلاح تسريبات المياه، تصليح الثلاجات والفريزرات فورياً بالمنزل دون الحاجة لنقلها، وصيانة الغسالات والنشافات الأوتوماتيكية مع منحك سند ضمان خطي معتمد على كافة أعمال الصيانة وقطع الغيار.`,
    overviewEn: `Jawzaa Refrigeration & AC delivers premium residential maintenance services tailored for luxury villas, private residences, and residential compounds across Riyadh. We understand the paramount importance of family privacy and home cleanliness, ensuring our technicians adhere to the highest standards of etiquette and precision.

Our residential capabilities include: high-pressure deep cleaning and sanitization for split, ducted, and window ACs, genuine freon charging, water leak elimination, immediate on-site refrigerator and freezer repair without offsite transportation, and automatic washer/dryer servicing backed by written warranties on parts and labor.`,
    stats: [
      { labelAr: 'فيلا ومنزل تم خدمتها', labelEn: 'Villas & Homes Serviced', value: '4,800+' },
      { labelAr: 'سرعة الوصول بالرياض', labelEn: 'Rapid Arrival', value: '30 - 45 دقيقة' },
      { labelAr: 'ضمان خطي معتمد', labelEn: 'Official Warranty', value: '100% مضمون' },
      { labelAr: 'نسبة رضا العائلات', labelEn: 'Family Satisfaction', value: '99.4%' },
    ],
    featuresAr: [
      'استجابة سريعة في نفس اليوم في كافة أحياء الرياض (شمال، شرق، غرب، وجنوب)',
      'فنيون مؤهلون ومعتمدون ومجهزون بأحدث أجهزة الفحص الرقمية وأغطية حماية الأثاث',
      'صيانة 95% من أعطال الثلاجات والمكيفات والغسالات فورياً داخل المنزل',
      'عقود صيانة سنوية دورية مخفضة تضمن عمل الأجهزة بكفاءة قصوى طوال العام',
    ],
    featuresEn: [
      'Same-day rapid dispatch covering all North, South, East, and West Riyadh districts',
      'Certified, background-checked technicians equipped with digital diagnostic tools and protective gear',
      'Over 95% of appliance and AC repairs completed immediately on-site during a single visit',
      'Discounted annual maintenance agreements ensuring peak cooling and energy efficiency all year round',
    ],
    checklistAr: [
      'صيانة وتنظيف مكيفات غرف النوم والمجالس والصالات',
      'شحن فريون أصلي R410A / R22 مع كشف التنسيم',
      'تصليح ثلاجات وفريزرات المطبخ وحل مشكلة ضعف التبريد',
      'صيانة غسالات الملابس وحل مشاكل الاهتزاز وعدم التصريف',
      'لف وإصلاح مضخات مياه الخزانات ومحركات التهوية',
    ],
    checklistEn: [
      'Bedroom, living room, and majlis AC servicing and pressure washing',
      'Genuine R410A / R22 freon recharge with electronic leak sniffing',
      'Kitchen refrigerator and freezer troubleshooting & cooling restoration',
      'Washing machine vibration elimination and drain pump overhaul',
      'Rooftop water booster pump and ventilation motor rewinding',
    ],
  },
  restaurants: {
    id: 'restaurants',
    icon: 'bolt',
    titleAr: 'حلول التبريد والتكييف للمطاعم والمقاهي وسلاسل الأغذية',
    titleEn: 'Commercial Refrigeration & HVAC for Restaurants & Cafes',
    subtitleAr: 'صيانة طارئة 24/7 لغرف التبريد والتجميد وصانعات الثلج ومكيفات صالات الضيوف لمنع تلف المخزون الغذائي.',
    subtitleEn: '24/7 emergency dispatch for walk-in freezers, ice makers, and dining area HVAC to protect food inventory and guest comfort.',
    overviewAr: `يعتمد نجاح المطاعم والمقاهي على استمرارية عمل غرف التبريد وثلاجات التخزين دون أي توقف مفاجئ قد يتسبب في خسائر مالية جسيمة في المخزون الغذائي. توفر مؤسسة جوزاء فرق طوارئ متخصصة في التبريد التجاري مجهزة بأحدث قطع الغيار ومعدات الفحص لخدمة قطاع الضيافة والأغذية بالرياض.

نقدم عقود صيانة وقائية وخدمة طوارئ سريعة تشمل: صيانة وإعادة بناء كمبروسرات غرف التجميد (Walk-in Freezers) وغرف التبريد، شحن غازات التبريد المعتمدة، صيانة ثلاجات العرض، صانعات الثلج، وأنظمة شفط ودكت مطابخ المطاعم، مع تقديم تقارير فنية دورية تفي باشتراطات سلامة الغذاء وبلدية الرياض.`,
    overviewEn: `The success and operational continuity of restaurants and cafes depend on zero downtime in cold storage systems. A failure in a walk-in freezer can spoil tens of thousands of riyals in perishable inventory within hours. Jawzaa provides specialized 24/7 commercial refrigeration emergency squads across Riyadh.

Our commercial solutions include: repairing and rebuilding walk-in chiller and freezer compressors, charging factory refrigerants, servicing display cases, commercial ice machines, and kitchen HVAC ductwork, while providing certified compliance logs for municipal and food-safety hygiene standards.`,
    stats: [
      { labelAr: 'مطعم ومقهى نخدمهم بالرياض', labelEn: 'Food Venues Served', value: '180+' },
      { labelAr: 'زمن الاستجابة للطوارئ', labelEn: 'Emergency Response SLA', value: 'أقل من ساعة' },
      { labelAr: 'حماية المخزون من التلف', labelEn: 'Inventory Protection', value: '100%' },
      { labelAr: 'جاهزية دعم الطوارئ', labelEn: 'Support Availability', value: '24/7' },
    ],
    featuresAr: [
      'خط ساخن مخصص لدعم وبلاغات الطوارئ 24 ساعة طوال أيام الأسبوع',
      'فنيون متخصصون في دورات التبريد التجاري المعقدة وغرف التجميد الكبيرة',
      'توفر فوري لقطع الغيار الأصلية والكمبروسرات التجارية والريليهات والمراوح',
      'تقارير فنية معتمدة تفي باشتراطات الرقابة البلدية وسلامة الغذاء',
    ],
    featuresEn: [
      'Dedicated 24/7 direct hotline for commercial emergency breakdowns',
      'Specialized engineering technicians trained in commercial refrigeration and walk-in cold rooms',
      'Immediate stock of commercial compressors, expansion valves, defrost timers, and fan motors',
      'Official service documentation and compliance logs for municipal food safety inspections',
    ],
    checklistAr: [
      'صيانة غرف التجميد الرئيسية (Walk-in Freezers) وضبط الحرارة عند -18°C',
      'صيانة غرف التبريد (Cold Rooms) وثلاجات حفظ الخضار واللحوم',
      'إصلاح صانعات الثلج الأوتوماتيكية وماكينات الآيس كريم',
      'صيانة مكيفات صالات استقبال الضيوف لضمان راحة الزبائن',
      'عقود صيانة وقائية شهرية مع زيارات فحص مجدولة',
    ],
    checklistEn: [
      'Walk-in freezer maintenance and temperature stabilization at -18°C',
      'Walk-in meat and produce chiller troubleshooting and defrost repair',
      'Commercial automatic ice maker and gelato machine service',
      'Dining room customer area HVAC optimization and odor elimination',
      'Monthly preventative maintenance contracts with scheduled audits',
    ],
  },
  corporate: {
    id: 'corporate',
    icon: 'contract',
    titleAr: 'حلول التكييف للمكاتب والشركات والمباني الإدارية',
    titleEn: 'Corporate Offices & Commercial Facility HVAC Solutions',
    subtitleAr: 'برامج صيانة وقائية للمكيفات المركزية ووحدات البكج والدكت تضمن بيئة عمل مريحة وتخفض تكاليف التشغيل.',
    subtitleEn: 'Preventative maintenance for central rooftop package and ducted systems ensuring productive, quiet workplaces.',
    overviewAr: `تعتبر بيئة العمل المريحة والمكيفة بدرجة حرارة معتدلة وهواء نقي عنصراً أساسياً لإنتاجية الموظفين ورضا العملاء في المكاتب والمقرات الإدارية بالرياض. تقدم جوزاء عقود صيانة دورية مرنة ومخصصة للشركات والمباني التجارية، تضمن استمرارية تشغيل أنظمة التكييف المركزي بكفاءة عالية طوال ساعات الدوام.

تشمل خدماتنا: موازنة تدفق الهواء (Air Balancing CFM)، تنظيف فلاتر ومجاري الدكت، فحص اللوحات الكهربائية والكمبروسرات، وصيانة سيور ومحركات البلاور، مع إمكانية جدولة الزيارات الفنية خارج ساعات العمل الرسمية لتجنب أي إزعاج للموظفين والزوار.`,
    overviewEn: `A well-regulated, quiet, and clean indoor climate is fundamental for workforce productivity and client comfort in corporate headquarters across Riyadh. Jawzaa delivers tailored preventative HVAC maintenance contracts for business towers, corporate campuses, and administrative offices.

Our corporate scope includes: airflow balancing across individual offices and conference rooms, duct register sanitization, electrical control panel diagnostics, blower motor and belt maintenance, with flexible service scheduling outside standard business operating hours.`,
    stats: [
      { labelAr: 'مقر إداري ومبنى نخدمه', labelEn: 'Corporate Facilities', value: '95+' },
      { labelAr: 'انخفاض في استهلاك الطاقة', labelEn: 'Energy Consumption Drop', value: '25%' },
      { labelAr: 'مرونة المواعيد الفنية', labelEn: 'Flexible Scheduling', value: 'خارج الدوام' },
      { labelAr: 'فواتير ضريبية معتمدة', labelEn: 'ZATCA E-Invoicing', value: '100% معتمدة' },
    ],
    featuresAr: [
      'جدولة زيارات الصيانة في عطلات نهاية الأسبوع أو المساء خارج أوقات العمل',
      'فواتير ضريبية إلكترونية معتمدة مطابقة لمتطلبات هيئة الزكاة والضريبة والجمارك',
      'تقارير فنية دورية توضح كفاءة كل وحدة تكييف وتوصيات تحسين استهلاك الطاقة',
      'مدير حسابات فني مخصص للتنسيق والمتابعة الفورية مع إدارة المنشأة',
    ],
    featuresEn: [
      'Flexible scheduling during weekends or evenings to prevent business disruption',
      'Fully compliant electronic tax invoices (ZATCA compliant) for corporate accounts',
      'Detailed unit-by-unit engineering reports with energy-saving recommendations',
      'Dedicated technical account manager for streamlined coordination and reporting',
    ],
    checklistAr: [
      'صيانة وحدات التكييف المركزي والباكج (Rooftop Package Units)',
      'موازنة ضغط وسرعة الهواء في غرف الاجتماعات والمكاتب الفردية',
      'تنظيف وتعقيم فلاتر الهواء للحد من انتشار الغبار ومسببات الحساسية',
      'صيانة دورية لمحركات ومضخات التبريد المركزية ولف المحركات',
      'عقود صيانة سنوية شاملة قطع الغيار وأجور اليد الفنية',
    ],
    checklistEn: [
      'Rooftop commercial package unit servicing and coil cleaning',
      'Airflow CFM velocity calibration for meeting rooms and executive suites',
      'High-efficiency particulate air filter replacement and coil sanitization',
      'Central water pump and electric motor rewind and overhaul',
      'Comprehensive annual contracts covering preventative visits and repairs',
    ],
  },
  retail: {
    id: 'retail',
    icon: 'fridge',
    titleAr: 'حلول التبريد للسوبرماركت ومحلات التجزئة الغذائية',
    titleEn: 'Supermarket & Food Retail Cold Chain Solutions',
    subtitleAr: 'صيانة متخصصة لثلاجات العرض المفتوحة، فريزرات الآيس كريم واللحوم، وأنظمة التبريد المركزي للمتاجر.',
    subtitleEn: 'Specialized maintenance for multi-deck open display chillers, commercial meat freezers, and supermarket racks.',
    overviewAr: `تعتمد متاجر السوبرماركت ومحلات التجزئة ومحلات المواد الغذائية في الرياض على شبكة واسعة من ثلاجات العرض المفتوحة وفريزرات التجميد السريع لعرض المنتجات للزبائن. توفر جوزاء حلول صيانة متكاملة وسريعة لضمان بقاء البضائع في درجة التبريد المحددة بدقة وحمايتها من التلف.

يقوم خبراؤنا بفحص وصيانة شبكات الفريون المركزية، موازنة صمامات التمدد الحراري، تنظيف مكثفات التبريد المليئة بالغبار، استبدال مراوح المبخرات، ومعالجة التسريبات بدقة متناهية لتقليل تكاليف استهلاك الكهرباء وضمان أطول عمر تشغيلي لمعدات المتجر.`,
    overviewEn: `Supermarkets, grocery stores, and hypermarkets in Riyadh rely on extensive multi-deck open display chillers, glass-door island freezers, and cold rooms to showcase products. Jawzaa provides specialized maintenance solutions to ensure strict temperature compliance and prevent product loss.

Our technicians service central refrigeration rack systems, balance thermostatic expansion valves, clean dust-laden condenser banks, replace evaporator fan motors, and braze refrigerant leaks to lower operating power bills and maximize equipment longevity.`,
    stats: [
      { labelAr: 'سوبرماركت ومتجر نخدمه', labelEn: 'Retail Stores Supported', value: '110+' },
      { labelAr: 'استجابة فورية للأعطال', labelEn: 'Rapid Repair Dispatch', value: 'أقل من 45 د' },
      { labelAr: 'دقة ضبط درجات الحرارة', labelEn: 'Temp Precision', value: '±0.5°C' },
      { labelAr: 'ضمان استمرارية التبريد', labelEn: 'Uptime Guarantee', value: '99.9%' },
    ],
    featuresAr: [
      'كشف سريع ودقيق لتسريبات الفريون بالأجهزة الإلكترونية دون إيقاف العمل بالمتجر',
      'صيانة وتجديد مراوح المبخرات ومحركات المكثفات الكبيرة بنحاس نقي',
      'توفر دائم لكافة مقاسات غازات الفريون المعتمدة والزيوت والقطع الأصلية',
      'عقود صيانة وقائية دورية تقلل من فواتير الكهرباء وتمنع الأعطال المفاجئة',
    ],
    featuresEn: [
      'Non-disruptive electronic refrigerant leak detection during active store hours',
      'Evaporator fan motor and condenser motor rewinding with pure copper wire',
      'Continuous supply of virgin refrigerants, compressor oils, and OEM spare parts',
      'Preventative service programs designed to slash commercial electric utility bills',
    ],
    checklistAr: [
      'صيانة ثلاجات العرض المفتوحة للألبان والعصائر (Multi-Deck Chillers)',
      'صيانة فريزرات اللحوم والدواجن والآيس كريم وضبط التجميد العميق',
      'تنظيف وغسيل المكثفات الخارجية بضغط الهواء والماء',
      'فحص وموازنة حساسات الحرارة ولوحات التحكم الرقمية',
      'دعم فني طارئ وسريع على مدار 24 ساعة للمتاجر المتعاقدة',
    ],
    checklistEn: [
      'Multi-deck open dairy and beverage chiller airflow & coil servicing',
      'Commercial meat, poultry and ice cream chest freezer maintenance',
      'Outdoor condenser bank pressure washing and debris clearing',
      'Digital thermostat calibration and defrost cycle scheduling',
      '24/7 priority emergency dispatch for contracted supermarket chains',
    ],
  },
};

export default function IndustryDetailPage() {
  const { industryId } = useParams();
  const { isRTL } = useLanguage();

  const industry = INDUSTRIES_DETAILS[industryId] || INDUSTRIES_DETAILS.residential;

  if (!INDUSTRIES_DETAILS[industryId]) {
    return <Navigate to="/industries" replace />;
  }

  const otherIndustries = Object.values(INDUSTRIES_DETAILS).filter(item => item.id !== industry.id);

  return (
    <div className="industry-detail-view page-enter">
      {/* Subpage Hero Banner */}
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <div className="service-breadcrumbs">
            <Link to="/">{isRTL ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <Link to="/industries">{isRTL ? 'القطاعات والحلول' : 'Industries'}</Link>
            <span>/</span>
            <span className="current-crumb">{isRTL ? industry.titleAr : industry.titleEn}</span>
          </div>

          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.bolt}</span>
            {isRTL ? 'حلول هندسية متخصصة' : 'Specialized Engineering Sector'}
          </span>
          <h1 className="subpage-hero-title">{isRTL ? industry.titleAr : industry.titleEn}</h1>
          <p className="subpage-hero-desc">{isRTL ? industry.subtitleAr : industry.subtitleEn}</p>

          <div style={{ marginTop: '24px', display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              className="btn btn-wa"
              href={waLink(
                isRTL
                  ? `السلام عليكم، أرغب بطلب خدمة صيانة متخصصة لقطاع: ${industry.titleAr} بالرياض`
                  : `Hello, I would like to request specialized service for: ${industry.titleEn} in Riyadh`
              )}
              target="_blank"
              rel="noopener"
            >
              {I.whatsapp} {isRTL ? 'طلب استشارة أو فني فوري' : 'Request On-Site Service'}
            </a>
            <a className="btn btn-gold-outline" href={`tel:${BRAND.phonePrimaryIntl}`}>
              {I.phone} <span dir="ltr">{BRAND.phonePrimary}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="service-stats-strip">
        <div className="container stats-strip-grid">
          {industry.stats.map((stat, i) => (
            <div className="stat-strip-box" key={i}>
              <div className="stat-strip-val">{localizedValue(stat, isRTL)}</div>
              <div className="stat-strip-lbl">{isRTL ? stat.labelAr : stat.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="service-main-content-section">
        <div className="container service-layout-split">
          <div className="service-article-column">
            {/* Overview */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'نظرة عامة وشرح تفصيلي للحلول' : 'Comprehensive Sector Overview'}</h2>
              <div className="overview-paragraphs">
                {(isRTL ? industry.overviewAr : industry.overviewEn).split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Core Features */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'أبرز مزايا الخدمة المخصصة لهذا القطاع' : 'Sector-Specific Service Advantages'}</h2>
              <div className="symptoms-checklist-grid">
                {(isRTL ? industry.featuresAr : industry.featuresEn).map((feat, idx) => (
                  <div className="symptom-check-item" key={idx}>
                    <span className="check-bullet">{I.check}</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist of Services */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'قائمة الخدمات والأعمال المشمولة' : 'Scope of Work & Services Provided'}</h2>
              <div className="service-steps-list">
                {(isRTL ? industry.checklistAr : industry.checklistEn).map((item, idx) => (
                  <div className="service-step-row" key={idx}>
                    <div className="step-num-pill">0{idx + 1}</div>
                    <div className="step-text-content">
                      <h4 className="step-row-title">{item}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="service-sidebar-column">
            <div className="sidebar-booking-card">
              <h3 className="sb-title">{isRTL ? 'طلب فني متخصص' : 'Book Specialized Team'}</h3>
              <p className="sb-desc">
                {isRTL
                  ? 'فريقنا الهندسي جاهز للوصول فوراً لموقع منشأتك أو منزلك بالرياض.'
                  : 'Our certified engineering team is ready for rapid same-day dispatch.'}
              </p>
              <a
                className="btn btn-wa btn-sb-book"
                href={waLink(
                  isRTL
                    ? `السلام عليكم، أرغب بطلب صيانة لقطاع: ${industry.titleAr}`
                    : `Hello, I need maintenance for sector: ${industry.titleEn}`
                )}
                target="_blank"
                rel="noopener"
              >
                {I.whatsapp} {isRTL ? 'حجز فوري عبر واتساب' : 'Instant WhatsApp Booking'}
              </a>
              <a className="btn btn-gold-outline btn-sb-call" href={`tel:${BRAND.phonePrimaryIntl}`}>
                {I.phone} {isRTL ? 'اتصال مباشر' : 'Direct Call'}: <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>

              <div className="sb-guarantees">
                <div className="sb-g-item">
                  <span className="g-icon">{I.shield}</span>
                  <span>{isRTL ? 'ضمان خطي معتمد على العمل والقطع' : 'Certified written warranty'}</span>
                </div>
                <div className="sb-g-item">
                  <span className="g-icon">{I.clock}</span>
                  <span>{isRTL ? 'خدمة يومية 8:00 ص - 11:30 مساءً' : 'Daily 8:00 AM - 11:30 PM'}</span>
                </div>
                <div className="sb-g-item">
                  <span className="g-icon">{I.wallet}</span>
                  <span>{isRTL ? 'أسعار شفافة وفواتير ضريبية معتمدة' : 'ZATCA compliant transparent quotes'}</span>
                </div>
              </div>
            </div>

            {/* Other Industries */}
            <div className="sidebar-links-card">
              <h4 className="sb-links-heading">{isRTL ? 'قطاعات وحلول أخرى' : 'Other Industry Sectors'}</h4>
              <ul className="sb-links-list">
                {otherIndustries.map(item => (
                  <li key={item.id}>
                    <Link to={`/industries/${item.id}`} className="sb-service-link">
                      <span>{isRTL ? item.titleAr : item.titleEn}</span>
                      <span className="sb-link-arrow">{isRTL ? I.arrowL : I.arrowR}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
