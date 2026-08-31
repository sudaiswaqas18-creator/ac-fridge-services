import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function PrivacyPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="legal-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title">{isRTL ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy & Data Protection'}</h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'نلتزم بحماية خصوصية بيانات عملائنا وسريتها التامة وفقاً للأنظمة واللوائح المعمول بها في المملكة العربية السعودية.'
              : 'We are strictly committed to safeguarding our clients privacy in accordance with Saudi data protection regulations.'}
          </p>
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container legal-text-container">
          <h2>{isRTL ? '1. جمع واستخدام البيانات' : '1. Information Collection & Usage'}</h2>
          <p>
            {isRTL
              ? 'نقوم بجمع البيانات الأساسية التي تقدمها طواعية عند طلب الصيانة (مثل: الاسم، رقم الجوال، وعنوان الحي في الرياض) فقط لغرض تنسيق زيارة الفني وإصدار سند الضمان.'
              : 'We only collect essential contact information voluntarily provided during service booking (such as name, phone number, and district in Riyadh) strictly to coordinate technician visits and issue warranty records.'}
          </p>

          <h2>{isRTL ? '2. سرية المعلومات وعدم مشاركتها' : '2. Confidentiality & Third Parties'}</h2>
          <p>
            {isRTL
              ? 'تتعهد مؤسسة جوزاء بعدم بيع أو تأجير أو مشاركة أي من بيانات العملاء مع أي طرف ثالث لأغراض تسويقية تحت أي ظرف من الظروف.'
              : 'Jawzaa guarantees that client personal details will never be sold, rented, or disclosed to third-party marketers under any circumstances.'}
          </p>

          <h2>{isRTL ? '3. أمن البيانات وسندات الضمان' : '3. Warranty Records & Data Security'}</h2>
          <p>
            {isRTL
              ? 'يتم تخزين سجلات الصيانة وسندات الضمان في أنظمة مشفرة وآمنة لتمكين العميل من الاستفادة من حقوق الضمان والصيانة المجانية في حال تكرار العطل.'
              : 'Repair records and warranty certificates are securely archived to enable clients to claim warranty service seamlessly.'}
          </p>
        </div>
      </section>
    </div>
  );
}
