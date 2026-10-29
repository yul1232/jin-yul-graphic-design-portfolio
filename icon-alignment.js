// 글꼴의 줄 상자가 아닌 실제 글자 윤곽의 중심에 아이콘을 맞춥니다.
(() => {
  const pairs = [['#home .back-label', '#home .back-icon'], ['#back .back-label', '#back .back-icon'], ['.intro-label', '#sign']];
  const context = document.createElement('canvas').getContext('2d');
  const entries = pairs.map(([text, icon]) => {
    const label = document.querySelector(text), symbol = document.querySelector(icon);
    if (!label || !symbol) return null;
    const baseline = document.createElement('span');
    baseline.setAttribute('aria-hidden', 'true');
    baseline.style.cssText = 'display:inline-block;width:0;height:0;padding:0;margin:0;vertical-align:baseline;';
    label.append(baseline);
    return { label, symbol, baseline };
  }).filter(Boolean);
  function align() {
    entries.forEach(({ label, symbol, baseline }) => {
      const style = getComputedStyle(label);
      context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const metric = context.measureText(label.textContent);
      if (!Number.isFinite(metric.actualBoundingBoxAscent)) return;
      symbol.style.transform = 'none';
      const bounds = symbol.getBoundingClientRect();
      const center = baseline.getBoundingClientRect().top + (metric.actualBoundingBoxDescent - metric.actualBoundingBoxAscent) / 2;
      symbol.style.transform = `translateY(${center - bounds.top - bounds.height / 2}px)`;
    });
  }
  let frame;
  const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(align); };
  document.fonts.ready.then(update);
  window.addEventListener('resize', update);
})();
