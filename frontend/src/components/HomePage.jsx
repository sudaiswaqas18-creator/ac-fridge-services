import { useEffect } from 'react'
import { BRAND } from '../data.js'
import { I } from '../Icons.jsx'

export default function HomePage() {
  useEffect(() => {
    document.title = `${BRAND.name} | صيانة مكيفات وثلاجات وفريزرات بالرياض`
  }, [])

  return (
    <section>
      <div className="hero">
        <h1>جوزاء للتبريد والتكييف</h1>
        <p>صيانة مكيفات، ثلاجات، وفريزرات في الرياض — خدمة منزلية سريعة</p>
        <a className="btn btn-wa" href="https://wa.me/966544786559" target="_blank">
          {I.whatsapp} راسلنا واتساب
        </a>
        <a className="btn btn-gold" href={`tel:${BRAND.phonePrimaryIntl}`}>
          {I.phone} اتصل الآن {BRAND.phonePrimary}
        </a>
      </div>
      <section className="services" id="services">
        <div className="container">
          <h2 className="sec-title">خدماتنا</h2>
          <div className="services-grid">
            {/* Services cards from data.js */}
          </div>
        </div>
      </section>
    </section>
  )
}
