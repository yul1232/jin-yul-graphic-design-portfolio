const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
function verify(cover, detail = false) {
  const handlers = {}, arcs = [], layer = { style: {} }, untouchedCanvas = { style: { transform: 'translateX(-45px)' } };
  let queue = [], now = 0, reduced = false;
  const context = {
    innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1,
    document: { querySelector: s => s === '.star-pointer' ? layer : (cover && s === '[data-cover-stars]') || (detail && s === '[data-detail-stars]') ? canvas : null,
      documentElement: { addEventListener(name, fn) { handlers[name] = fn; } } },
    matchMedia: () => ({ get matches() { return reduced; }, addEventListener(name, fn) { handlers.motion = fn; } }),
    requestAnimationFrame: fn => (queue.push(fn), queue.length),
    window: { addEventListener(name, fn) { handlers[name] = fn; } },
  };
  const canvas = { getContext: () => ({ setTransform() {}, beginPath() {}, arc: (...args) => arcs.push(args), fill() {} }) };
  vm.createContext(context); vm.runInContext(fs.readFileSync(`${__dirname}/star-motion.js`, 'utf8'), context);
  function settle() { let count = 0; while (queue.length) { const batch = queue; queue = []; now += 16; batch.forEach(fn => fn(now)); assert.ok(++count < 300, 'Animation should settle and stop'); } }
  settle();
  handlers.pointermove({ pointerType: 'mouse', clientX: 1200, clientY: 800 }); settle();
  assert.equal(layer.style.transform, 'translate3d(14px, 14px, 0)');
  handlers.pointermove({ pointerType: 'mouse', clientX: 0, clientY: 0 }); settle();
  assert.equal(layer.style.transform, 'translate3d(-14px, -14px, 0)');
  handlers.pointermove({ pointerType: 'touch', clientX: 1200, clientY: 800 }); settle();
  assert.equal(layer.style.transform, 'translate3d(-14px, -14px, 0)');
  assert.equal(untouchedCanvas.style.transform, 'translateX(-45px)');
  reduced = true; handlers.motion(); settle(); assert.equal(layer.style.transform, 'translate3d(0px, 0px, 0)');
  if (cover || detail) {
    assert.equal(arcs.length, Math.floor(1200 * 800 / 3500));
    let seed = 718; const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
    for (const arc of arcs) {
      assert.equal(arc[0], random() * 1200 * 1.1);
      assert.equal(arc[1], random() * 800 * 1.1);
      assert.equal(arc[2], .25 + random() * .65); random();
    }
  }
}
verify(false); verify(true); verify(false, true);
console.log('PASS: same-direction layer motion, smooth settling, unchanged project transform, star coordinates/count/radii, touch and reduced motion');
