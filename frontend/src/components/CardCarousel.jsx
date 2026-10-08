import React, { Children, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function CardCarousel({ children, className = '', label }) {
  const { isRTL } = useLanguage();
  const cards = Children.toArray(children);
  const count = cards.length;
  const viewport = useRef(null);
  const tween = useRef(null);
  const current = useRef(count);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const offset = index => {
    const el = viewport.current;
    const card = el?.children[index];
    return card ? card.offsetLeft - (el.clientWidth - card.clientWidth) / 2 : 0;
  };
  const go = index => {
    const el = viewport.current;
    if (!el || !count) return;
    tween.current?.kill();
    current.current = index;
    setActive(((index % count) + count) % count);
    tween.current = gsap.to(el, { scrollLeft: offset(index), duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1.5, ease: 'power2.inOut', onComplete: () => {
      const normalized = count + ((index % count) + count) % count;
      current.current = normalized;
      el.scrollLeft = offset(normalized);
    } });
  };
  useLayoutEffect(() => {
    const el = viewport.current;
    if (!el || !count) return;
    current.current = count;
    el.scrollLeft = offset(count);
    const resize = new ResizeObserver(() => { tween.current?.kill(); el.scrollLeft = offset(current.current); });
    resize.observe(el);
    return () => { resize.disconnect(); tween.current?.kill(); };
  }, [count]);
  useEffect(() => {
    if (paused || count < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => { if (!document.hidden) go(current.current - 1); }, 2200);
    return () => clearInterval(timer);
  }, [paused, count]);
  const onScroll = () => {
    if (tween.current?.isActive()) return;
    const el = viewport.current;
    const distances = [...el.children].map((_, i) => Math.abs(offset(i) - el.scrollLeft));
    const index = distances.indexOf(Math.min(...distances));
    current.current = index;
    setActive(index % count);
  };
  return <div className={`card-carousel ${className}`} role="region" aria-roledescription="carousel" aria-label={label}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
    <div className="carousel-edge-frame">
      <div className="card-carousel-viewport" ref={viewport} onScroll={onScroll} onPointerDown={() => { tween.current?.kill(); setPaused(true); }} onPointerUp={() => setPaused(false)} onPointerCancel={() => setPaused(false)}>
        {[0, 1, 2].flatMap(copy => cards.map((card, index) => <div className="card-carousel-slide" key={`${copy}-${card.key ?? index}`} dir={isRTL ? 'rtl' : 'ltr'} role="group" aria-label={`${index + 1} / ${count}`} aria-hidden={copy !== 1 || undefined} inert={copy !== 1 || undefined}>{card}</div>))}
      </div>
    </div>
    <div className="carousel-controls" dir="ltr"><div className="carousel-dots">{cards.map((_, index) => <button key={index} type="button" className={active === index ? 'active' : ''} aria-label={`${isRTL ? 'بطاقة' : 'Card'} ${index + 1}`} aria-pressed={active === index} onClick={() => go(count + index)} />)}</div></div>
  </div>;
}
