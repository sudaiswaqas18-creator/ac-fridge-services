import { DETAILED_SERVICES, CASE_STUDIES, BLOG_POSTS } from './content/siteData.js';
import { FAQS_DATA, TESTIMONIALS_DATA } from './data.js';
import { API_BASE } from './config.js';

const API_URL = API_BASE;

/**
 * Fetch services from backend API with fallback to static site data
 */
export async function fetchServices() {
  try {
    const res = await fetch(`${API_URL}/services`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {
    // Graceful fallback to static data
  }
  return Object.values(DETAILED_SERVICES);
}

/**
 * Fetch single service by slug with fallback
 */
export async function fetchServiceBySlug(slug) {
  try {
    const res = await fetch(`${API_URL}/services/${slug}`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {
    // Graceful fallback
  }
  return DETAILED_SERVICES[slug] || null;
}

/**
 * Fetch reviews with fallback
 */
export async function fetchReviews() {
  try {
    const res = await fetch(`${API_URL}/reviews`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {}
  return TESTIMONIALS_DATA;
}

/**
 * Fetch blog posts with fallback
 */
export async function fetchBlogPosts() {
  try {
    const res = await fetch(`${API_URL}/blog`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {}
  return BLOG_POSTS;
}

/**
 * Fetch portfolio case studies with fallback
 */
export async function fetchCaseStudies() {
  try {
    const res = await fetch(`${API_URL}/portfolio`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {}
  return CASE_STUDIES;
}

/**
 * Fetch FAQs with fallback
 */
export async function fetchFaqs() {
  try {
    const res = await fetch(`${API_URL}/faqs`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data && json.data.length > 0) {
      return json.data;
    }
  } catch (err) {}
  return FAQS_DATA;
}

/**
 * Fetch site settings with fallback
 */
export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, { cache: 'no-store' });
    const json = await res.json();
    if (json.success && json.data) {
      return json.data;
    }
  } catch (err) {}
  return null;
}

export default {
  fetchServices,
  fetchServiceBySlug,
  fetchReviews,
  fetchBlogPosts,
  fetchCaseStudies,
  fetchFaqs,
  fetchSiteSettings,
};
