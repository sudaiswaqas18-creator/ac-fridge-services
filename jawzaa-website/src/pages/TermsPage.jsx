import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function TermsPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="legal-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title">{isRTL ? 'شروط وأحكام الخدمة والضمان' : 'Terms of Service & Warranty Policy'}</h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'الشروط المنظمة لخدمات صيانة المكيفات والأجهزة والتزامات الضمان الصادرة من مؤسسة جوزاء للتبريد والتكييف.'
              : 'Terms governing appliance & HVAC repair services and warranty commitments issued by Jawzaa.'}
          </p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container legal-text-container">
          <h2>{isRTL ? '1. التسعير والموافقة المسبقة' : '1. Transparent Pricing & Prior Approval'}</h2>
          <p>
            {isRTL
              ? 'يقوم الفني بفحص الجهاز وتقديم بيان تكلفة الإصلاح كاملاً للعميل. لا يبدأ أي عمل ولا تُستبدل أي قطعة إلا بعد الموافقة الصريحة من العميل على السعر.'
              : 'Our technician inspects the appliance and provides a fixed comprehensive quote. No repair work begins and no parts are replaced without explicit customer consent.'}
          </p>

          <h2>{isRTL ? '2. شروط الضمان المعتمد' : '2. Certified Warranty Coverage'}</h2>
          <p>
            {isRTL
              ? 'يغطي الضمان الخطي المعتمد العطل نفسه وقطع الغيار المستبدلة لمدة تبدأ من شهر إلى 6 أشهر حسب طبيعة الخدمة. في حال تكرار نفس العطل خلال فترة الضمان، يتم إصلاحه مجاناً دون أي تكلفة إضافية.'
              : 'Our official written warranty covers the specific repair and replaced parts from 1 to 6 months depending on service scope. If the exact same issue reoccurs within the warranty window, it is repaired free of charge.'}
          </p>

          <h2>{isRTL ? '3. قطع الغيار الأصلية' : '3. 100% Genuine Spare Parts'}</h2>
          <p>
            {isRTL
              ? 'تلتزم المؤسسة بتركيب قطع غيار أصلية ومطابقة لمواصفات الشركة المصنعة، ويحق للعميل معاينة القطعة القديمة المستبدلة.'
              : 'Jawzaa is committed to installing certified manufacturer-spec OEM parts. Clients are entitled to inspect replaced old components.'}
          </p>
        </div>
      </section>
    </div>
  );
}
