(() => {
  'use strict';
  const title = document.querySelector('.cover-title');
  const cover = title?.closest('.cover');
  if (!title || !cover || !window.TitleParticlePhysics || !window.sampleTitleDots) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.className = 'title-particle-canvas'; canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d');
  const mask = document.createElement('canvas'), ink = mask.getContext('2d', { willReadFrequently: true });
  if (!context || !ink) return;
  cover.append(canvas);
  let simulation = null, frame = 0, buildFrame = 0, lastTime = 0, clock = 0;
  let needsBuild = true;
  let color = '#F5F5F5', dotRadius = .7, influence = 32, bounds, dpr = 1;
  const pointer = { active: false, x: 0, y: 0 };
  let touchPointerId = null;
  let resumeIdleAt = 0;
  function visible() { return !document.hidden && !cover.hidden && !cover.classList.contains('page-leaving') && !document.querySelector('#making-dialog[open]'); }
  function draw() {
    context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    context.fillStyle = color;
    const scrollTop = cover.scrollTop;
    context.beginPath();
    for (const p of simulation.points) {
      const y = p.y - scrollTop;
      context.moveTo(p.x + dotRadius, y);
      context.arc(p.x, y, dotRadius, 0, Math.PI * 2);
    }
    context.fill();
  }
  function tick(now) {
    frame = 0;
    if (!simulation || !visible()) { lastTime = 0; return; }
    const dt = lastTime ? Math.min(1 / 30, (now - lastTime) / 1000) : 1 / 60;
    lastTime = now; clock += dt;
    if (!reduced.matches) {
      const idle = now >= resumeIdleAt ? {
        x: bounds.left + bounds.width * (.5 + .43 * Math.sin(clock * .32)),
        y: bounds.top + bounds.height * (.5 + .35 * Math.sin(clock * .47 + .8)),
      } : null;
      simulation.step(dt, pointer, idle, influence);
    }
    draw();
    if (!reduced.matches) frame = requestAnimationFrame(tick);
  }
  function schedule() { if (!frame && simulation && visible()) frame = requestAnimationFrame(tick); }
  function build() {
    buildFrame = 0;
    if (cover.hidden) return;
    needsBuild = false;
    title.classList.remove('particles-ready');
    const glyphs = [...title.querySelectorAll('.title-ink')];
    if (!glyphs.length) return;
    const titleRect = title.getBoundingClientRect();
    const scrollTop = cover.scrollTop;
    bounds = { left: titleRect.left, top: titleRect.top + scrollTop, width: titleRect.width, height: titleRect.height };
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    const raster = 2;
    const top = Math.max(0, Math.floor(bounds.top - 2));
    const height = Math.ceil(bounds.height + 4);
    mask.width = Math.ceil(innerWidth * raster); mask.height = Math.ceil(height * raster);
    ink.setTransform(raster, 0, 0, raster, 0, 0);
    ink.textBaseline = 'alphabetic'; ink.fillStyle = '#ffffff';
    for (const glyph of glyphs) {
      let baseline = glyph.querySelector('[data-particle-baseline]');
      if (!baseline) {
        baseline = document.createElement('span'); baseline.dataset.particleBaseline = '';
        baseline.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline;';
        glyph.append(baseline);
      }
      const style = getComputedStyle(glyph), rect = glyph.getBoundingClientRect();
      ink.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ink.fontKerning = 'none';
      ink.fillText(glyph.textContent, rect.left, baseline.getBoundingClientRect().top + scrollTop - top);
    }
    const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
    const target = innerWidth <= 600 ? 11000 : 16000;
    const sampled = window.sampleTitleDots(pixels, mask.width, mask.height, raster, target, top);
    if (!sampled?.points.length) { canvas.hidden = true; return; }
    const points = sampled.points, count = points.length;
    dotRadius = sampled.radius;
    canvas.dataset.particleDiameter = String(dotRadius * 2);
    canvas.dataset.particleGap = String(sampled.gap);
    simulation = new window.TitleParticlePhysics(points);
    const style = getComputedStyle(title);
    color = style.color;
    influence = Math.min(85, Math.max(18, parseFloat(style.fontSize) * .48));
    pointer.active = false; lastTime = 0;
    canvas.dataset.particleCount = String(count); canvas.hidden = false;
    title.classList.add('particles-ready'); draw(); schedule();
  }
  function queueBuild() {
    needsBuild = true;
    if (!cover.hidden && !buildFrame) buildFrame = requestAnimationFrame(build);
  }
  function trackPointer(event) {
    const rect = title.getBoundingClientRect();
    const active = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (pointer.active && !active) resumeIdleAt = performance.now() + 2600;
    pointer.active = active; pointer.x = event.clientX; pointer.y = event.clientY + cover.scrollTop;
    schedule();
  }
  window.addEventListener('pointermove', event => {
    if (reduced.matches || !visible()) return;
    if (event.pointerType === 'touch' && event.pointerId !== touchPointerId) return;
    if (event.pointerType !== 'touch' && touchPointerId !== null) return;
    trackPointer(event);
  }, { passive: true });
  function leave() { touchPointerId = null; pointer.active = false; resumeIdleAt = performance.now() + 2600; schedule(); }
  document.documentElement.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
  title.addEventListener('pointerdown', event => {
    if (event.button !== 0 || reduced.matches || !simulation || !visible()) return;
    if (event.pointerType === 'touch') {
      if (touchPointerId !== null) return;
      touchPointerId = event.pointerId;
      title.setPointerCapture(event.pointerId);
      trackPointer(event);
    }
    simulation.burst(event.clientX, event.clientY + cover.scrollTop); resumeIdleAt = performance.now() + 2600; schedule();
  });
  function endTouch(event) {
    if (event.pointerId !== touchPointerId) return;
    leave();
  }
  window.addEventListener('pointerup', endTouch);
  window.addEventListener('pointercancel', endTouch);
  title.addEventListener('lostpointercapture', endTouch);
  document.addEventListener('portfolio:title-layout', queueBuild);
  window.addEventListener('resize', queueBuild);
  cover.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  document.addEventListener('portfolio:modalchange', schedule);
  new MutationObserver(() => {
    if (!visible()) return;
    if (needsBuild) queueBuild();
    else schedule();
  }).observe(cover, { attributes: true, attributeFilter: ['hidden', 'class'] });
  reduced.addEventListener('change', queueBuild);
  document.fonts.ready.then(queueBuild);
})();
