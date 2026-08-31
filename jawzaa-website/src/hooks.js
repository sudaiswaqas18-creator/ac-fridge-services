import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Elements that should fade/slide up as a single block when scrolled into view.
const AUTO_REVEAL = [
  '.section-header',
  '.areas-footer-note',
  '.about-lead',
  '.subpage-hero-inner',
]
// Grids whose direct children should reveal with a staggered cascade.
const AUTO_REVEAL_GROUP = [
  '.stats-container',
  '.services-grid-container',
  '.features-grid-container',
  '.showcase-4cards-grid',
  '.reviews-cards-grid',
  '.process-steps-grid',
  '.hero-video-pillars-grid',
  '.gallery-cards-grid',
  '.videos-cards-grid',
  '.posters-grid-container',
  '.areas-chips-cloud',
  '.faq-accordion-container',
]

export function useReveal() {
  const location = useLocation()
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    // Auto-tag common section building blocks so animations apply site-wide
    // without every component having to opt in by hand.
    const tag = () => {
      AUTO_REVEAL.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => {
          if (!el.classList.contains('reveal') && !el.classList.contains('reveal-group')) {
            el.classList.add('reveal')
          }
        })
      )
      AUTO_REVEAL_GROUP.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => {
          if (!el.classList.contains('reveal') && !el.classList.contains('reveal-group')) {
            el.classList.add('reveal-group')
          }
        })
      )
    }

    const scan = () => {
      tag()
      document
        .querySelectorAll('.reveal:not(.visible), .reveal-group:not(.visible)')
        .forEach(el => io.observe(el))
    }

    scan()
    // Re-scan when async content (lists, images, route sub-views) mounts.
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })

    // Safety net: never leave above-the-fold content stuck at opacity 0 if the
    // observer is throttled (background tab, reduced-capability browser).
    const revealInView = () => {
      document.querySelectorAll('.reveal:not(.visible), .reveal-group:not(.visible)').forEach(el => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible')
      })
    }
    const t1 = setTimeout(revealInView, 900)
    const t2 = setTimeout(revealInView, 2500)

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(t1); clearTimeout(t2) }
  }, [location.pathname])
}

export function useCountUp(target, duration = 1600) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    started.current = false
    setVal(0)
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const tick = now => {
          const p = Math.min((now - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(target * eased))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        io.disconnect()
      }
    }, { threshold: 0.4 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target, duration])
  return [ref, val]
}

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}
