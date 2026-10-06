// Metric values are shared by services, sectors, and case studies.  Older
// records stored a single Arabic value, which leaked Arabic into English pages.
// Prefer explicit bilingual values and translate the legacy values centrally.
const ENGLISH_LEGACY_VALUES = {
  '3 - 6 أشهر': '3–6 Months',
  '45 دقيقة': '45 Minutes',
  '60 دقيقة': '60 Minutes',
  '40 دقيقة': '40 Minutes',
  '100% نقي': '100% Pure',
  '100% معتمدة': '100% Certified',
  'حقيقي 100%': '100% Genuine',
  'سند رسمي': 'Official Certificate',
  'معتمد': 'Certified',
  'شامل': 'Comprehensive',
  'مضمون': 'Guaranteed',
  'ساعتين فقط': '2 Hours Only',
  'يومين فقط': '2 Days Only',
  'سنة كاملة': '1 Full Year',
};

export function localizedValue(item, isRTL) {
  if (isRTL) return item.valueAr || item.value || '';
  return item.valueEn || ENGLISH_LEGACY_VALUES[item.value] || item.value || '';
}
