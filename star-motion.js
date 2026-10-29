// 마우스 이동은 부모 레이어에만 적용합니다.
// 프로젝트 탐색 시 #stars의 기존 transform/애니메이션은 그대로 보존합니다.
(() => {
  'use strict';
  const layer = document.querySelector('.star-pointer');
  if (!layer) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, previousTime = 0;
  function tick(now) {
    frame = 0;
    const dt = previousTime ? Math.min(64, now - previousTime) : 16;
    previousTime = now;
    const blend = 1 - Math.exp(-dt / 130);
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    const settled = Math.abs(targetX - x) < .01 && Math.abs(targetY - y) < .01;
    if (settled) { x = targetX; y = targetY; }
    layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (!settled) frame = requestAnimationFrame(tick);
    else previousTime = 0;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(tick); }
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || motion.matches) return;
    // 화면 끝에서도 기존 5% 여유 영역 안에서만 작게 이동합니다.
    const limitX = Math.min(14, innerWidth * .025);
    const limitY = Math.min(14, innerHeight * .025);
    targetX = Math.max(-1, Math.min(1, event.clientX / innerWidth * 2 - 1)) * limitX;
    targetY = Math.max(-1, Math.min(1, event.clientY / innerHeight * 2 - 1)) * limitY;
    schedule();
  }, { passive: true });
  function reset() { targetX = 0; targetY = 0; schedule(); }
  document.documentElement.addEventListener('pointerleave', reset);
  window.addEventListener('blur', reset);
  motion.addEventListener('change', () => {
    if (motion.matches) { x = y = targetX = targetY = 0; }
    schedule();
  });
  // 첫 화면은 기존 프로젝트와 같은 난수·밝기·크기·밀도의 별을 사용합니다.
  // 프로젝트의 canvas는 기존 script.js가 계속 그리므로 변경하지 않습니다.
  const canvas = document.querySelector('[data-cover-stars]') || document.querySelector('[data-detail-stars]');
  if (canvas) {
    const context = canvas.getContext('2d');
    function draw() {
      const width = innerWidth, height = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * 1.1 * dpr);
      canvas.height = Math.round(height * 1.1 * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      let seed = 718;
      const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
      for (let i = 0; i < Math.floor(width * height / 3500); i++) {
        const starX = random() * width * 1.1, starY = random() * height * 1.1, radius = .25 + random() * .65;
        random();
        context.beginPath(); context.arc(starX, starY, radius, 0, Math.PI * 2);
        context.fillStyle = '#F5F5F5'; context.fill();
      }
      reset();
    }
    window.addEventListener('resize', draw);
    draw();
  } else window.addEventListener('resize', reset);
})();
