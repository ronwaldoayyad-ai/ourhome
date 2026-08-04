import * as THREE from 'three';

// Cheap procedural noise textures generated on a <canvas>, so "realistic" mode
// needs no external asset downloads and works fully offline.
function noiseTexture({ base, colors, size = 256, density = 0.6, repeat = 1 }) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  const count = Math.floor(size * size * density * 0.06);
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
    const x = Math.random() * size;
    const y = Math.random() * size;
    const s = 1 + Math.random() * 2.2;
    ctx.fillRect(x, y, s, s);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.anisotropy = 4;
  return t;
}

export function makeTextures() {
  return {
    grass: noiseTexture({
      base: '#5f8a46',
      colors: ['#4a7a37', '#6f9a53', '#547f40', '#3f6a2d', '#79a45e'],
      repeat: 26,
      density: 1.1,
    }),
    stucco: noiseTexture({
      base: '#efe9df',
      colors: ['#e8e1d5', '#f5f0e8', '#e2dccf', '#eee7db'],
      repeat: 3,
      density: 0.5,
    }),
    roof: noiseTexture({
      base: '#3d4149',
      colors: ['#33373e', '#454a53', '#2c2f36', '#3a3e46'],
      repeat: 5,
      density: 0.6,
    }),
    floor: noiseTexture({
      base: '#d8d2c7',
      colors: ['#d0c9bd', '#e0dacf', '#cbc4b6'],
      repeat: 6,
      density: 0.4,
    }),
  };
}
