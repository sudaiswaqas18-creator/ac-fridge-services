import fs from 'fs';
import path from 'path';
import { DETAILED_SERVICES, CASE_STUDIES, BLOG_POSTS } from '../../frontend/src/content/siteData.js';
import { TESTIMONIALS_DATA, FAQS_DATA } from '../../frontend/src/data.js';

async function main() {
  const services = Object.values(DETAILED_SERVICES);
  const reviews = TESTIMONIALS_DATA;
  const cases = CASE_STUDIES;
  const posts = BLOG_POSTS;
  const faqs = FAQS_DATA;

  const inquiries = [
    {
      id: 'inq-1',
      name: 'عبدالله المطيري',
      phone: '0551234567',
      area: 'حي الياسمين',
      service: 'صيانة مكيفات سبليت وشحن فريون',
      notes: 'المكيف في غرفة المعيشة يخرج هواء حار وصوت خفيف في الوحدة الخارجية',
      date: '2026-03-30 14:20',
      status: 'new',
    },
    {
      id: 'inq-2',
      name: 'أم فهد العتيبي',
      phone: '0509876543',
      area: 'حي النرجس',
      service: 'إصلاح ثلاجة منزلية (تسريب ماء)',
      notes: 'الثلاجة تنزل ماء تحت الأدراج والتبريد ضعيف في الفريزر',
      date: '2026-03-30 11:15',
      status: 'contacted',
    },
    {
      id: 'inq-3',
      name: 'م. خالد الدوسري',
      phone: '0567788990',
      area: 'حي الروضة',
      service: 'لف محرك مروحة مكيف مركزي',
      notes: 'موتور البلاور للمكيف البكج احترق ويحتاج إعادة لف نحاس نقي',
      date: '2026-03-29 18:45',
      status: 'completed',
    },
  ];

  const industries = [
    {
      id: 'residential',
      icon: 'home',
      titleAr: 'الفلل والقصور والمجمعات السكنية',
      titleEn: 'Residential Villas & Luxury Compounds',
      descAr: 'خدمة صيانة منزلية فورية لجميع مكيفات وثلاجات وغسالات المنزل مع المحافظة التامة على نظافة الأثاث والمفروشات.',
      descEn: 'Same-day on-site maintenance for home ACs, refrigerators, and washers with 100% floor and furniture protection.',
      featuresAr: ['استجابة سريعة في نفس اليوم في كافة أحياء الرياض', 'فنيون مؤهلون ومعتمدون بأعلى درجات الأمانة', 'عقود صيانة سنوية مخصصة للعائلات مع خصومات'],
      featuresEn: ['Same-day arrival across all Riyadh neighborhoods', 'Certified technicians with strict professionalism', 'Customized annual family maintenance plans with discounts'],
    },
    {
      id: 'restaurants',
      icon: 'bolt',
      titleAr: 'المطاعم والمقاهي وسلاسل الأغذية',
      titleEn: 'Restaurants, Cafes & Food Chains',
      descAr: 'صيانة طارئة لغرف التبريد والتجميد (Walk-in Freezers) وصانعات الثلج ومكيفات صالات الضيوف لضمان استمرارية التشغيل.',
      descEn: 'Emergency service for walk-in freezers, ice machines, and dining hall HVAC to prevent food inventory loss.',
      featuresAr: ['خط ساخن للطوارئ 24/7 للمطاعم المتعاقدة', 'صيانة متخصصة لغرف التجميد والتبريد التجاري', 'تقارير فنية معتمدة تفي باشتراطات البلدية والسلامة'],
      featuresEn: ['24/7 emergency dispatch line for contracted restaurants', 'Specialized commercial refrigeration care', 'Official municipal and food-safety compliance logs'],
    },
    {
      id: 'corporate',
      icon: 'contract',
      titleAr: 'المكاتب والشركات والمباني الإدارية',
      titleEn: 'Corporate Offices & Business Towers',
      descAr: 'برامج صيانة دورية للمكيفات المركزية ووحدات البكج لضمان بيئة عمل مريحة وهادئة للموظفين طوال ساعات العمل.',
      descEn: 'Preventative HVAC maintenance for ducted package systems ensuring clean, quiet, productive working environments.',
      featuresAr: ['جدولة الزيارات في أوقات مرنة خارج ساعات الدوام', 'موازنة تدفق الهواء CFM في كافة المكاتب والاجتماعات', 'فواتير ضريبية إلكترونية معتمدة للمنشآت'],
      featuresEn: ['Flexible scheduling outside business operating hours', 'CFM airflow balancing across all meeting rooms', 'Official ZATCA-compliant electronic tax invoicing'],
    },
    {
      id: 'retail',
      icon: 'fridge',
      titleAr: 'السوبرماركت ومحلات التجزئة الغذائية',
      titleEn: 'Supermarkets & Retail Grocery Stores',
      descAr: 'صيانة وإصلاح ثلاجات العرض المفتوحة، فريزرات الآيس كريم واللحوم، وأنظمة التبريد المركزي للمتاجر.',
      descEn: 'Repairing multi-deck open display chillers, commercial chest freezers, and supermarket central racks.',
      featuresAr: ['كشف سريع لتسريبات الفريون وضبط درجات الحرارة', 'صيانة مراوح المبخر ومكثفات التبريد الكبيرة', 'قطع غيار أصلية متوفرة لتسريع الإصلاح'],
      featuresEn: ['Fast freon leak detection and digital temperature tuning', 'Heavy-duty evaporator fan and condenser overhauls', 'Immediate stock of commercial refrigeration spare parts'],
    },
  ];

  const storeData = {
    services,
    reviews,
    cases,
    posts,
    industries,
    faqs,
    inquiries,
    settings: {
      phonePrimary: '0544786559',
      phoneSecondary: '0599757554',
      email: 'info@jawzaa-hvac.sa',
      workingHours: '8:00 AM - 12:00 Midnight',
    },
  };

  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dataDir, 'store.json'), JSON.stringify(storeData, null, 2), 'utf8');
  console.log(`[Store Initializer] Created data/store.json successfully:`);
  console.log(`- Services: ${services.length}`);
  console.log(`- Reviews: ${reviews.length}`);
  console.log(`- Cases: ${cases.length}`);
  console.log(`- Posts: ${posts.length}`);
  console.log(`- Industries: ${industries.length}`);
  console.log(`- FAQs: ${faqs.length}`);
  console.log(`- Inquiries: ${inquiries.length}`);
}

main().catch(err => {
  console.error('Failed to create store.json:', err);
  process.exit(1);
});
