import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const REVEAL = [
  '.section-header', '.subpage-hero-content', '.service-hero-text',
  '.service-card', '.service-case-card', '.feature-card', '.v-pillar-card',
  '.showcase-4card-item', '.stat-card', '.review-card', '.testimonial-card',
  '.gallery-card-item', '.video-card', '.video-card-item', '.case-study-card',
  '.blog-card-item', '.content-hub-card', '.industry-sector-card',
  '.team-card', '.value-card', '.timeline-card', '.step-card', '.process-card',
  '.pricing-package-card', '.faq-item', '.faq-row-item', '.area-pill',
  '.contact-info-card', '.contact-form-card', '.contact-map-wrapper',
  '.solution-card', '.ba-slider-wrapper', '.ba-details-card',
  '.service-ba-visual-card', '.service-ba-metrics-card', '.dedicated-dispatch-box',
  '.sidebar-cta-card', '.sidebar-links-card', '.job-listing-card', '.career-apply-card',
  '.story-text-col', '.about-cta-inner', '.faq-bottom-cta-card', '.footer-column',
  '.blog-content-body > *', '.legal-text-container > *', '.case-content-card',
  '.metric-strip-card', '.benefit-card',
  '.admin-stat-card', '.admin-item-card', '.admin-dashboard-hero',
].join(',');
const IMAGE = [
  '.card-top-image-wrap img', '.service-case-image-wrap img', '.gallery-card-img-wrap img',
  '.case-card-img-wrap img', '.blog-card-img-wrap img', '.service-hero-img',
  '.story-img-frame img', '.blog-featured-img', '.case-featured-img',
].join(',');

// One scoped controller for every route, including newly filtered/API-loaded cards.
export function initGsapAnimations(root) {
  if (!root || typeof window === 'undefined') return () => {};
  const media = gsap.matchMedia();
  media.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 900px)' }, context => {
    if (!context.conditions.motion) return;
    const seen = new WeakSet();
    const animations = new Map();
    let frame = 0;
    let disposed = false;
    const scheduleRefresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };
    const ctx = gsap.context(() => {
      const progress = root.querySelector('.site-scroll-progress');
      if (progress) gsap.fromTo(progress, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      });
    }, root);
    const scan = () => ctx.add(() => {
      // Release triggers belonging to cards removed by filtering or admin tabs.
      for (const [element, tween] of animations) {
        if (!root.contains(element)) {
          tween.scrollTrigger?.kill();
          tween.kill();
          animations.delete(element);
        }
      }
      root.querySelectorAll(`${REVEAL},${IMAGE}`).forEach(element => {
        if (seen.has(element)) return;
        seen.add(element);
        // Avoid stacking reveal transforms on nested content cards.
        if (element.matches(REVEAL) && element.parentElement?.closest(REVEAL)) return;
        const isImage = element.matches(IMAGE);
        const siblings = [...element.parentElement.children].filter(child => child.matches(isImage ? IMAGE : REVEAL));
        const index = Math.max(0, siblings.indexOf(element));
        animations.set(element, gsap.from(element, {
          opacity: isImage ? 0.65 : 0.15,
          y: isImage ? (context.conditions.desktop ? 16 : 8) : context.conditions.desktop ? 26 : 14,
          // Keep text-bearing photographs fully visible; no crop/zoom animation.
          duration: isImage ? 1 : 0.65,
          delay: isImage ? 0 : Math.min(index % 4, 3) * 0.055,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: element, start: 'top 94%', once: true },
        }));
      });
    });
    scan();
    const observer = new MutationObserver(records => {
      if (records.some(record => [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1))) {
        scan();
        scheduleRefresh();
      }
    });
    observer.observe(root, { childList: true, subtree: true });
    root.addEventListener('load', scheduleRefresh, true);
    document.fonts?.ready.then(() => { if (!disposed) scheduleRefresh(); });
    scheduleRefresh();
    return () => {
      disposed = true;
      observer.disconnect();
      root.removeEventListener('load', scheduleRefresh, true);
      cancelAnimationFrame(frame);
      ctx.revert();
      animations.clear();
    };
  });
  return () => media.revert();
}
