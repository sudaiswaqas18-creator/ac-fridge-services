import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes for high-tech HVAC cooling & energy constellation
    const particleCount = Math.min(width > 768 ? 65 : 35, 80);
    const particles = [];

    const colors = [
      'rgba(245, 158, 11, ',   // Gold
      'rgba(56, 189, 248, ',   // Cyan frost
      'rgba(16, 185, 129, ',   // Emerald
      'rgba(252, 211, 77, ',   // Light gold
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        colorPrefix: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }

    // Cooling wave curves simulating airflow & freon cycle
    let waveOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing wave currents (Airflow lines)
      waveOffset += 0.008;
      ctx.lineWidth = 1.5;

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, `rgba(56, 189, 248, ${0.04 + j * 0.02})`);
        grad.addColorStop(0.5, `rgba(245, 158, 11, ${0.06 + j * 0.02})`);
        grad.addColorStop(1, `rgba(16, 185, 129, ${0.03 + j * 0.02})`);
        ctx.strokeStyle = grad;

        const yBase = height * (0.35 + j * 0.25);
        ctx.moveTo(0, yBase + Math.sin(waveOffset + j) * 40);

        for (let x = 0; x < width; x += 15) {
          const y = yBase + Math.sin(x * 0.003 + waveOffset + j * 1.5) * 35 + Math.cos(x * 0.002 + waveOffset) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 2. Connect nearby particles with glowing lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const lineAlpha = (1 - dist / 130) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Render and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.85, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorPrefix}${currentAlpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.colorPrefix + '0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-cinematic-canvas" aria-hidden="true" />;
}
