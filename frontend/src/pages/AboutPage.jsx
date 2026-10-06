import React from 'react';
import CompanySectionNav from '../components/CompanySectionNav.jsx';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import storefrontImg from '../assets/media/jawzaa-storefront-open.webp';
import workshopImg from '../assets/media/workshop-interior.webp';

export default function AboutPage() {
  const { isRTL } = useLanguage();

  const timeline = [
    {
      year: '2014',
      titleAr: 'تأسيس المؤسسة بالرياض',
      titleEn: 'Foundation in Riyadh',
      descAr: 'انطلاق أول ورشة متخصصة في صيانة المكيفات ولف المحركات الكهربائية بحي الروضة.',
      descEn: 'Launch of our first specialized HVAC and motor rewinding workshop in Al-Rawdah.',
    },
    {
      year: '2018',
      titleAr: 'إطلاق أسطول الصيانة المتنقل',
      titleEn: 'Mobile On-Site Fleet Launch',
      descAr: 'تجهيز 6 سيارات صيانة متنقلة لتقديم خدمات الإصلاح الفوري في منازل العملاء بمعدات متقدمة.',
      descEn: 'Equipping 6 fully stocked mobile service vans for rapid same-day residential repairs.',
    },
    {
      year: '2022',
      titleAr: 'توسعة قسم لف الموتورات والباكج',
      titleEn: 'Central HVAC & Motor Bay Expansion',
      descAr: 'إدخال أجهزة الفحص الرقمية وأفران تجفيف العزل الحراري المتطورة للمحركات الكبيرة.',
      descEn: 'Upgrading to digital diagnostic analyzers and thermal baking ovens for heavy-duty industrial motors.',
    },
    {
      year: '2026',
      titleAr: 'الريادة والاعتماد الشامل',
      titleEn: 'Market Leadership & Certification',
      descAr: 'خدمة أكثر من 5,500 عميل سنوي في جميع أحياء الرياض مع نسبة رضا معتمدة تتجاوز 99%.',
      descEn: 'Serving over 5,500 clients annually across all Riyadh districts with 99%+ customer satisfaction.',
    },
  ];

  const teamMembers = [
    {
      nameAr: 'م. راشد القحطاني',
      nameEn: 'Eng. Rashed Al-Qahtani',
      roleAr: 'المشرف الهندسي العام (خبير تكييف مركزي)',
      roleEn: 'Lead Mechanical Engineer (HVAC Specialist)',
      icon: I.ac,
      expAr: '15 عاماً من الخبرة في أنظمة التبريد والتكييف المركزي والباكج في المملكة',
      expEn: '15+ years experience in central HVAC & chiller systems across KSA',
      cert: isRTL ? 'معتمد هندسياً' : 'Licensed Engineer',
    },
    {
      nameAr: 'فني أول / سليم خان',
      nameEn: 'Master Tech / Saleem Khan',
      roleAr: 'كبير أخصائيي لف الموتورات والمحركات',
      roleEn: 'Master Motor Rewinding Specialist',
      icon: I.motor,
      expAr: '12 عاماً في لف محركات الضغط العالي ومضخات المياه بالنحاس النقي عزل Class H',
      expEn: '12+ years expertise in precision motor rewinding and Class H insulation',
      cert: isRTL ? 'فني لف رئيسي' : 'Master Rewinder',
    },
    {
      nameAr: 'فني أول / كمال الدين',
      nameEn: 'Senior Tech / Kamal Al-Deen',
      roleAr: 'أخصائي صيانة الثلاجات والغسالات الذكية',
      roleEn: 'Smart Refrigerator & Washer Diagnostics',
      icon: I.fridge,
      expAr: '10 أعوام في صيانة كروت التحكم ودورات النوفروست لسامسونج وإل جي وهيتاشي',
      expEn: '10+ years in inverter PCB diagnostics and no-frost refrigeration circuits',
      cert: isRTL ? 'أخصائي إلكترونيات' : 'Electronics Specialist',
    },
  ];

  const values = [
    {
      icon: I.shield,
      titleAr: 'النزاهة والأمانة المهنية',
      titleEn: 'Integrity & Transparency',
      descAr: 'تشخيص دقيق للعطل الحقيقي دون مبالغة، وتسعير واضح قبل بدء أي عمل.',
      descEn: 'Accurate diagnosis of the root cause with upfront pricing and zero hidden fees.',
    },
    {
      icon: I.bolt,
      titleAr: 'السرعة والوصول الفوري',
      titleEn: 'Punctuality & Fast Dispatch',
      descAr: 'نصل إلى باب منزلك في الموعد المحدد بنفس اليوم في كافة أحياء الرياض خلال 30 دقيقة.',
      descEn: 'Same-day technician arrival at your scheduled appointment time across Riyadh.',
    },
    {
      icon: I.parts,
      titleAr: 'الجودة وقطع الغيار الأصلية',
      titleEn: '100% Genuine OEM Quality',
      descAr: 'استخدام القطع المعتمدة وأسلاك النحاس النقي لضمان ديمومة الجهاز لسنوات طويلة.',
      descEn: 'Strict usage of original certified components and pure copper to ensure longevity.',
    },
    {
      icon: I.star,
      titleAr: 'الضمان الحقيقي المعتمد',
      titleEn: 'Guaranteed Peace of Mind',
      descAr: 'سند ضمان خطي على كافة الإصلاحات مع استعداد تام للمتابعة المجانية بدون تردد.',
      descEn: 'Official written warranty certificates covering both labor and replacement parts.',
    },
  ];

  return (
    <div className="about-page-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.shield}</span>
            {isRTL ? 'عن مؤسسة جوزاء للتبريد والتكييف' : 'About Jawzaa HVAC & Appliance Specialists'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'أكثر من عقد من الخبرة والريادة في صيانة الأجهزة بالرياض' : 'Over a Decade of HVAC & Appliance Leadership in Riyadh'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'مؤسسة سعودية متخصصة تجمع بين الخبرة الميدانية العميقة، أحدث المعدات الرقمية، والكوادر الفنية المؤهلة لتقديم أرقى خدمات الصيانة المنزلية والتجارية.'
              : 'A specialized Saudi technical enterprise combining deep field experience, precision diagnostic analyzers, and certified technicians to deliver premier on-site repair.'}
          </p>
        </div>
      </section>

      <CompanySectionNav />

      {/* Story & Facility Showcase Section */}
      <section className="about-story-section">
        <div className="container about-story-grid">
          <div className="story-text-col">
            <span className="section-tag">
              <span className="tag-icon">{I.sparkle}</span>
              {isRTL ? 'قصتنا ورؤيتنا' : 'Our Story & Vision'}
            </span>
            <h2 className="story-title">
              {isRTL ? 'نبني ثقة عملائنا بالشفافية والعمل المتقن' : 'Building Trust Through Precision & Engineering Integrity'}
            </h2>
            <p className="story-p">
              {isRTL
                ? 'تأسست مؤسسة جوزاء للتبريد والتكييف في مدينة الرياض استجابةً لحاجة السوق المحلي لخدمات صيانة موثوقة وعالية الجودة. لاحظنا معاناة الكثير من العملاء من تكرار الأعطال، سوء التشخيص، والأسعار المبالغ فيها، فكان هدفنا تقديم تجربة صيانة راقية تعتمد على الفحص العلمي الدقيق، قطع الغيار الأصلية، والضمان الحقيقي.'
                : 'Jawzaa was established in Riyadh to address the critical need for transparent, dependable appliance and HVAC services. Recognizing common homeowner frustrations with recurring breakdowns and guesswork repairs, we set out to build an engineering-backed service grounded in digital diagnostics, original OEM parts, and written warranties.'}
            </p>
            <p className="story-p">
              {isRTL
                ? 'اليوم، نفخر بامتلاك ورشة مركزية مجهزة بأحدث أدوات لف المحركات وصيانة الكمبروسرات، إلى جانب أسطول من سيارات الصيانة المتنقلة التي تجوب كافة أحياء العاصمة الرياض لتقديم حلول سريعة في نفس اليوم.'
                : 'Today, we proudly operate a specialized electromechanical workshop equipped for high-precision motor rewinding and compressor overhauls, supported by a fleet of mobile technical units serving every district in the capital.'}
            </p>

            <div className="story-stats-row">
              <div className="story-stat-item">
                <span className="ss-num">12+</span>
                <span className="ss-lbl">{isRTL ? 'سنوات خبرة معتمدة' : 'Years Experience'}</span>
              </div>
              <div className="story-stat-item">
                <span className="ss-num">5,500+</span>
                <span className="ss-lbl">{isRTL ? 'جهاز تم إصلاحه بنجاح' : 'Fixed Appliances'}</span>
              </div>
              <div className="story-stat-item">
                <span className="ss-num">99.4%</span>
                <span className="ss-lbl">{isRTL ? 'نسبة رضا العملاء' : 'Customer Rating'}</span>
              </div>
            </div>
          </div>

          <div className="story-image-col">
            <div className="story-img-frame">
              <img src={storefrontImg} alt="مقر وورشة جوزاء بالرياض" className="story-main-img" />
              <div className="story-badge-float">
                <span className="sbf-icon">{I.check}</span>
                <div>
                  <strong>{isRTL ? 'مؤسسة جوزاء للتبريد والتكييف' : 'Jawzaa Engineering Workshop'}</strong>
                  <p>{isRTL ? 'الرياض — ورشة متخصصة وأسطول متنقل' : 'Riyadh Facility & Mobile Technical Units'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="about-timeline-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.clock}</span>
              {isRTL ? 'مسيرة الإنجازات' : 'Our Journey & Milestones'}
            </span>
            <h2 className="section-title">{isRTL ? 'محطات مضيئة في مسيرة جوزاء' : 'Key Milestones Over the Years'}</h2>
            <div className="section-divider" />
          </div>

          <div className="timeline-grid">
            {timeline.map((item, idx) => (
              <div className="timeline-card" key={idx}>
                <div className="timeline-year-bubble">{item.year}</div>
                <h3 className="timeline-card-title">{isRTL ? item.titleAr : item.titleEn}</h3>
                <p className="timeline-card-desc">{isRTL ? item.descAr : item.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.star}</span>
              {isRTL ? 'قيمنا ومبادئنا' : 'Core Values & Principles'}
            </span>
            <h2 className="section-title">{isRTL ? 'المبادئ التي تقود كل خطوة في عملنا' : 'Principles That Drive Our Craft'}</h2>
            <div className="section-divider" />
          </div>

          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon-box">{v.icon}</div>
                <h3 className="value-title">{isRTL ? v.titleAr : v.titleEn}</h3>
                <p className="value-desc">{isRTL ? v.descAr : v.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Technical Team */}
      <section className="about-team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.userCheck}</span>
              {isRTL ? 'فريق العمل والخبراء' : 'Senior Engineering & Tech Crew'}
            </span>
            <h2 className="section-title">{isRTL ? 'نخبة من أمهر المهندسين والفنيين' : 'Meet Our Certified Technical Leaders'}</h2>
            <div className="section-divider" />
          </div>

          <div className="team-grid">
            {teamMembers.map((member, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar-box">
                  {member.icon}
                </div>
                <span className="team-cert-badge">{member.cert}</span>
                <h3 className="team-name">{isRTL ? member.nameAr : member.nameEn}</h3>
                <span className="team-role">{isRTL ? member.roleAr : member.roleEn}</span>
                <p className="team-exp">{isRTL ? member.expAr : member.expEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="about-cta-banner">
        <div className="container about-cta-inner">
          <div className="cta-text-side">
            <h2 className="cta-banner-title">
              {isRTL ? 'هل تحتاج إلى استشارة فنية أو فحص منزلي عاجل؟' : 'Need Technical Advice or Immediate On-Site Dispatch?'}
            </h2>
            <p className="cta-banner-sub">
              {isRTL ? 'فريقنا جاهز للرد على استفساراتك وتنسيق موعد في أقرب وقت.' : 'Our technical team is on standby to assist you and book same-day service.'}
            </p>
          </div>
          <div className="cta-btn-side">
            <a className="btn btn-wa btn-cta-large" href={waLink()} target="_blank" rel="noopener">
              {I.whatsapp} {isRTL ? 'تواصل معنا واتساب' : 'Chat on WhatsApp'}
            </a>
            <a className="btn btn-gold-outline btn-cta-large" href={`tel:${BRAND.phonePrimaryIntl}`}>
              {I.phone} {isRTL ? 'اتصال مباشر' : 'Direct Call'}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
