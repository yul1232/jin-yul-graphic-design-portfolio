// 일정한 미세 간격을 보장하는 육각 격자. 점의 중심과 원 둘레 모두 글자 내부에 둡니다.
((root) => {
  function sampleTitleDots(pixels, width, height, raster, target, offsetY = 0) {
    let area = 0;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] >= 200) area++;
    if (!area) return null;
    const pitch = Math.sqrt(area / (raster * raster * target * Math.sqrt(3) / 2));
    const radius = pitch * .43;
    const rowHeight = pitch * Math.sqrt(3) / 2;
    const at = (x, y) => {
      const px = Math.round(x * raster), py = Math.round(y * raster);
      return px >= 0 && px < width && py >= 0 && py < height && pixels[(py * width + px) * 4 + 3] >= 160;
    };
    const points = [];
    for (let row = 0, y = radius; y < height / raster; row++, y += rowHeight) {
      for (let x = radius + (row % 2) * pitch / 2; x < width / raster; x += pitch) {
        if (!at(x, y)) continue;
        let inside = true;
        for (let a = 0; a < 12; a++) {
          const angle = a * Math.PI / 6;
          if (!at(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius)) { inside = false; break; }
        }
        if (inside) points.push([x, y + offsetY]);
      }
    }
    return { points, radius, pitch, gap: pitch - radius * 2 };
  }
  if (typeof module === 'object' && module.exports) module.exports = sampleTitleDots;
  else root.sampleTitleDots = sampleTitleDots;
})(typeof window === 'object' ? window : globalThis);
