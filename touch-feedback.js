// 모바일 브라우저의 :active 처리와 관계없이 터치 중인 상태를 표시합니다.
(() => {
  const selector = '#start, #home, #back';
  let pressed = null;
  let originX = 0;
  let originY = 0;
  const clear = () => {
    if (pressed) pressed.classList.remove('is-touch-pressed');
    pressed = null;
  };
  const begin = (target, x, y) => {
    clear();
    pressed = target.closest?.(selector) || null;
    if (!pressed) return;
    originX = x;
    originY = y;
    pressed.classList.add('is-touch-pressed');
  };
  const move = (x, y) => {
    if (!pressed) return;
    const rect = pressed.getBoundingClientRect();
    if (Math.hypot(x - originX, y - originY) > 10 ||
        x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) clear();
  };
  if ('PointerEvent' in window) {
    document.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        begin(event.target, event.clientX, event.clientY);
      }
    }, { passive: true });
    document.addEventListener('pointermove', event => move(event.clientX, event.clientY), { passive: true });
    document.addEventListener('pointerup', clear, true);
    document.addEventListener('pointercancel', clear, true);
  } else {
    document.addEventListener('touchstart', event => {
      const touch = event.touches[0];
      if (touch) begin(event.target, touch.clientX, touch.clientY);
    }, { passive: true });
    document.addEventListener('touchmove', event => {
      const touch = event.touches[0];
      if (touch) move(touch.clientX, touch.clientY);
    }, { passive: true });
    document.addEventListener('touchend', clear, true);
    document.addEventListener('touchcancel', clear, true);
  }
  window.addEventListener('blur', clear);
  window.addEventListener('pagehide', clear);
  document.addEventListener('visibilitychange', clear);
})();
