const assert = require('node:assert/strict');
const sample = require('./title-sampling.js');
const Physics = require('./title-physics.js');
const width = 400, height = 200, raster = 2;
const pixels = new Uint8ClampedArray(width * height * 4);
for (let y = 4; y < height - 4; y++) for (let x = 4; x < width - 4; x++) pixels[(y * width + x) * 4 + 3] = 255;
const dots = sample(pixels, width, height, raster, 16000);
assert.ok(dots.points.length > 12000, 'Density should substantially exceed 4000');
assert.ok(dots.gap > 0 && dots.radius * 2 < dots.pitch);
const cells = new Map();
let closest = Infinity;
for (const [x, y] of dots.points) {
  const cx = Math.floor(x / dots.pitch), cy = Math.floor(y / dots.pitch);
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
    for (const p of cells.get(`${cx + dx},${cy + dy}`) || []) {
      const distance = Math.hypot(x - p[0], y - p[1]);
      assert.ok(distance >= dots.pitch - 1e-8, 'Home circles cannot touch or overlap');
      closest = Math.min(closest, distance);
    }
  }
  const key = `${cx},${cy}`; if (!cells.has(key)) cells.set(key, []); cells.get(key).push([x, y]);
}
assert.ok(Math.abs(closest - dots.pitch) < 1e-8);
const physics = new Physics(dots.points);
for (let i = 0; i < 90; i++) physics.step(1 / 60, { active: true, x: 100, y: 50 }, null, 25);
assert.ok(physics.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
assert.equal(sample(new Uint8ClampedArray(16), 2, 2, 2, 16000), null);
console.log(`PASS: ${dots.points.length} uniform dots, positive micro-gap, non-overlap, glyph-mask containment and dense physics`);
