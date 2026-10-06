import fs from 'fs';
import path from 'path';

const storeFilePath = path.resolve('data/store.json');

function readStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const data = fs.readFileSync(storeFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[Store Error] Failed to read store.json:', err.message);
  }
  return {
    services: [],
    reviews: [],
    cases: [],
    posts: [],
    industries: [],
    faqs: [],
    inquiries: [],
    settings: {},
  };
}

function writeStore(data) {
  try {
    const dir = path.dirname(storeFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Store Error] Failed to write store.json:', err.message);
  }
}

// SERVICES
export function getStoredServices() {
  const store = readStore();
  return store.services || [];
}

export function saveStoredService(svc) {
  const store = readStore();
  store.services = store.services || [];
  const idx = store.services.findIndex(s => s.slug === svc.slug || (s.id && s.id === svc.id));
  if (idx >= 0) {
    store.services[idx] = { ...store.services[idx], ...svc };
  } else {
    store.services.push({ ...svc, id: svc.id || `svc-${Date.now()}` });
  }
  writeStore(store);
  return svc;
}

export function deleteStoredService(slugOrId) {
  const store = readStore();
  store.services = (store.services || []).filter(s => s.slug !== slugOrId && String(s.id) !== String(slugOrId));
  writeStore(store);
}

// REVIEWS
export function getStoredReviews() {
  const store = readStore();
  return store.reviews || [];
}

export function saveStoredReview(rev) {
  const store = readStore();
  store.reviews = store.reviews || [];
  const idx = store.reviews.findIndex(r => String(r.id) === String(rev.id));
  if (idx >= 0) {
    store.reviews[idx] = { ...store.reviews[idx], ...rev };
  } else {
    store.reviews.unshift({ ...rev, id: rev.id || Date.now() });
  }
  writeStore(store);
  return rev;
}

export function deleteStoredReview(id) {
  const store = readStore();
  store.reviews = (store.reviews || []).filter(r => String(r.id) !== String(id));
  writeStore(store);
}

// INQUIRIES
export function getStoredInquiries() {
  const store = readStore();
  return store.inquiries || [];
}

export function saveStoredInquiry(inq) {
  const store = readStore();
  store.inquiries = store.inquiries || [];
  const newInq = {
    id: inq.id || `inq-${Date.now()}`,
    name: inq.name || '',
    phone: inq.phone || '',
    area: inq.area || 'الرياض',
    service: inq.service || '',
    notes: inq.notes || '',
    date: inq.date || new Date().toLocaleString('ar-SA'),
    status: inq.status || 'new',
  };
  store.inquiries.unshift(newInq);
  writeStore(store);
  return newInq;
}

export function updateStoredInquiryStatus(id, status) {
  const store = readStore();
  store.inquiries = store.inquiries || [];
  const item = store.inquiries.find(i => String(i.id) === String(id));
  if (item) {
    item.status = status;
    writeStore(store);
    return item;
  }
  return null;
}

export function deleteStoredInquiry(id) {
  const store = readStore();
  store.inquiries = (store.inquiries || []).filter(i => String(i.id) !== String(id));
  writeStore(store);
}

// CASES
export function getStoredCases() {
  const store = readStore();
  return store.cases || [];
}

export function saveStoredCase(caseItem) {
  const store = readStore();
  store.cases = store.cases || [];
  const idx = store.cases.findIndex(c => String(c.id) === String(caseItem.id));
  if (idx >= 0) {
    store.cases[idx] = { ...store.cases[idx], ...caseItem };
  } else {
    store.cases.push({ ...caseItem, id: caseItem.id || `case-${Date.now()}` });
  }
  writeStore(store);
  return caseItem;
}

export function deleteStoredCase(id) {
  const store = readStore();
  store.cases = (store.cases || []).filter(c => String(c.id) !== String(id));
  writeStore(store);
}

// POSTS
export function getStoredPosts() {
  const store = readStore();
  return store.posts || [];
}

export function saveStoredPost(post) {
  const store = readStore();
  store.posts = store.posts || [];
  const idx = store.posts.findIndex(p => String(p.id) === String(post.id) || p.slug === post.slug);
  if (idx >= 0) {
    store.posts[idx] = { ...store.posts[idx], ...post };
  } else {
    store.posts.push({ ...post, id: post.id || `post-${Date.now()}` });
  }
  writeStore(store);
  return post;
}

export function deleteStoredPost(id) {
  const store = readStore();
  store.posts = (store.posts || []).filter(p => String(p.id) !== String(id) && p.slug !== id);
  writeStore(store);
}

// INDUSTRIES
export function getStoredIndustries() {
  const store = readStore();
  return store.industries || [];
}

export function saveStoredIndustry(ind) {
  const store = readStore();
  store.industries = store.industries || [];
  const idx = store.industries.findIndex(i => String(i.id) === String(ind.id));
  if (idx >= 0) {
    store.industries[idx] = { ...store.industries[idx], ...ind };
  } else {
    store.industries.push({ ...ind, id: ind.id || `ind-${Date.now()}` });
  }
  writeStore(store);
  return ind;
}

export function deleteStoredIndustry(id) {
  const store = readStore();
  store.industries = (store.industries || []).filter(i => String(i.id) !== String(id));
  writeStore(store);
}

// FAQS
export function getStoredFaqs() {
  const store = readStore();
  return store.faqs || [];
}

export function saveStoredFaq(faq) {
  const store = readStore();
  store.faqs = store.faqs || [];
  const idx = store.faqs.findIndex(f => String(f.id) === String(faq.id));
  if (idx >= 0) {
    store.faqs[idx] = { ...store.faqs[idx], ...faq };
  } else {
    store.faqs.push({ ...faq, id: faq.id || Date.now() });
  }
  writeStore(store);
  return faq;
}

export function deleteStoredFaq(id) {
  const store = readStore();
  store.faqs = (store.faqs || []).filter(f => String(f.id) !== String(id));
  writeStore(store);
}

// SETTINGS
export function getStoredSettings() {
  const store = readStore();
  return store.settings || {};
}

export function saveStoredSettings(settings) {
  const store = readStore();
  store.settings = { ...store.settings, ...settings };
  writeStore(store);
  return store.settings;
}
