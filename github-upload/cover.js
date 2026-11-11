(() => {
  'use strict';
  const config = window.coverData || {};
  const setText = (selector, value) => { if (value !== undefined) document.querySelector(selector).textContent = String(value); };
  if (Array.isArray(config.title)) {
    setText('#title-first', config.title[0]); setText('#title-second', config.title[1]);
    document.title = config.title.join(' ');
  }
  for (const key of ['name', 'school', 'department', 'year']) setText(`#${key}`, config[key]);
  setText('#start', config.startText);
  const title = document.querySelector('.cover-title');
  const lines = [...title.children];
  const text = lines.map(line => line.textContent);
  title.setAttribute('aria-label', text.join(' '));
  const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
  function spaceTitle() {
    const style = getComputedStyle(title);
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    context.fontKerning = 'normal';
    const d = context.measureText('D'), e = context.measureText('E');
    if (!Number.isFinite(d.actualBoundingBoxRight)) return;
    const tracking = parseFloat(style.letterSpacing) || 0;
    const kerning = context.measureText('DE').width - d.width - e.width;
    const gap = Math.max(0, d.width - d.actualBoundingBoxRight - e.actualBoundingBoxLeft + kerning + tracking);
    const wordGap = context.measureText(' ').width;
    title.style.setProperty('--glyph-gap', `${gap}px`);
    title.style.setProperty('--word-gap', `${wordGap}px`);
    lines.forEach((line, index) => {
      line.replaceChildren(); line.setAttribute('aria-hidden', 'true');
      text[index].split(/\s+/).filter(Boolean).forEach(word => {
        const group = document.createElement('span'); group.className = 'title-word';
        for (const char of word) {
          const metric = context.measureText(char);
          const glyph = document.createElement('span'); glyph.className = 'title-glyph';
          glyph.style.width = `${metric.actualBoundingBoxLeft + metric.actualBoundingBoxRight}px`;
          const ink = document.createElement('span'); ink.className = 'title-ink'; ink.textContent = char;
          ink.style.left = `${metric.actualBoundingBoxLeft}px`;
          glyph.append(ink); group.append(glyph);
        }
        line.append(group);
      });
    });
    document.dispatchEvent(new CustomEvent('portfolio:title-layout'));
  }
  let frame;
  const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(spaceTitle); };
  document.fonts.ready.then(update); window.addEventListener('resize', update);
})();
