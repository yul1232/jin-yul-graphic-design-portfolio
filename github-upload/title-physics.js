// 화면 렌더링과 분리된 타이틀 전용 스프링 시뮬레이션.
((root) => {
  'use strict';
  class TitleParticlePhysics {
    constructor(points) {
      this.points = points.map(([x, y]) => ({ x, y, homeX: x, homeY: y, vx: 0, vy: 0 }));
      this.waves = [];
    }
    burst(x, y) {
      this.waves.push({ x, y, radius: 0, previous: 0, age: 0 });
      if (this.waves.length > 6) this.waves.shift();
    }
    step(dt, pointer, idle, radius) {
      dt = Math.min(1 / 30, Math.max(0, dt));
      for (const wave of this.waves) {
        wave.previous = wave.radius;
        wave.age += dt;
        wave.radius += dt * 430;
      }
      for (const p of this.points) {
        let fx = (p.homeX - p.x) * 76, fy = (p.homeY - p.y) * 76;
        if (pointer?.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius) {
            const nx = distance > .001 ? dx / distance : 1;
            const ny = distance > .001 ? dy / distance : 0;
            const push = (radius - distance) * 230;
            const swirl = push * .18;
            fx += nx * push - ny * swirl;
            fy += ny * push + nx * swirl;
          }
        } else if (idle) {
          const dx = p.homeX - idle.x, dy = p.homeY - idle.y;
          const distance = Math.hypot(dx, dy), reach = radius * .75;
          if (distance > .001 && distance < reach) {
            const strength = Math.pow(1 - distance / reach, 2) * 30;
            fx += dx / distance * strength;
            fy += dy / distance * strength;
          }
        }
        for (const wave of this.waves) {
          const dx = p.homeX - wave.x, dy = p.homeY - wave.y;
          const distance = Math.hypot(dx, dy);
          if (distance >= wave.previous && distance < wave.radius) {
            const impulse = 105 * Math.max(.2, 1 - wave.age / 3);
            p.vx += (distance > .001 ? dx / distance : 1) * impulse;
            p.vy += (distance > .001 ? dy / distance : 0) * impulse;
          }
        }
        // 약한 감쇠를 적용해 복귀할 때 가벼운 탄성 움직임을 남깁니다.
        const damping = Math.exp(-7.5 * dt);
        p.vx = (p.vx + fx * dt) * damping;
        p.vy = (p.vy + fy * dt) * damping;
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (!pointer?.active && !idle && !this.waves.length && Math.hypot(p.x - p.homeX, p.y - p.homeY) < .01 && Math.hypot(p.vx, p.vy) < .03) {
          p.x = p.homeX; p.y = p.homeY; p.vx = p.vy = 0;
        }
      }
      this.waves = this.waves.filter(wave => wave.age < 5);
    }
  }
  if (typeof module === 'object' && module.exports) module.exports = TitleParticlePhysics;
  else root.TitleParticlePhysics = TitleParticlePhysics;
})(typeof window === 'object' ? window : globalThis);
