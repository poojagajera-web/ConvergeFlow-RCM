const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('public/assets/logos/convergeflow-light.png');
let offset = 8, idatChunks = [], width = 0, height = 0;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.subarray(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
}

const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const bpp = 4, stride = width * bpp + 1;
const colors = {};

// Find bounding box of non-transparent / non-white pixels
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  const row = y * stride + 1;
  for (let x = 0; x < width; x++) {
    const px = row + x * bpp;
    const a = raw[px + 3];
    const r = raw[px], g = raw[px + 1], b = raw[px + 2];
    if (a > 50 && !(r > 240 && g > 240 && b > 240)) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Logo bounds: X: ${minX}..${maxX}, Y: ${minY}..${maxY}, total width: ${width}`);

// 'w' is in the last 15% of the logo width
const wStartX = Math.floor(maxX - (maxX - minX) * 0.15);

for (let y = minY; y <= maxY; y++) {
  const row = y * stride + 1;
  for (let x = wStartX; x <= maxX; x++) {
    const px = row + x * bpp;
    const r = raw[px], g = raw[px + 1], b = raw[px + 2], a = raw[px + 3];
    if (a > 150 && !(r > 240 && g > 240 && b > 240)) {
      const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      colors[hex] = (colors[hex] || 0) + 1;
    }
  }
}

console.log('Top colors in letter "w":');
const sorted = Object.entries(colors).sort((a, b) => b[1] - a[1]);
sorted.slice(0, 15).forEach(([hex, count]) => {
  console.log(`${hex}: count ${count}`);
});
