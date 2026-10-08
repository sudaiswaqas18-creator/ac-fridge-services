import { useEffect } from 'react'
import { BRAND } from '../data.js'
import { I } from '../Icons.jsx'

export default function Home() {
  useEffect(() => {
    document.title = `${BRAND.name} | صيانة مكيفات وثلاجات وفريزرات بالرياض`
  }, [])

  return (
    <section className="hero">
      <h1>جوزاء للتبريد والتكييف</h1>
      <p>صيانة مكيفات، ثلاجات، وفريزرات في الرياض — خدمة منزلية سريعة</p>
      <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <a className="btn btn-wa" href="https://wa.me/966544786559" target="_blank">{I.whatsapp} راسلنا واتساب</a>
        <a className="btn btn-gold" href={`tel:${BRAND.phonePrimaryIntl}`}>{I.phone} اتصل الآن {BRAND.phonePrimary}</a>
      </div>
    </section>
  )
}
