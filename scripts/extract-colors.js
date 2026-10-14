const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/8b9ceda6-414c-4264-a2f0-045ab80eaca4/.user_uploaded/media_1791352252646.png');

// Find IDAT chunks
let offset = 8;
const idatChunks = [];
let width = 0, height = 0;

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

const compressed = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(compressed);

// bytes per pixel (RGBA = 4)
const bpp = 4;
const stride = width * bpp + 1; // +1 for filter byte

const colorCounts = {};

for (let y = 0; y < height; y++) {
  const rowStart = y * stride + 1;
  for (let x = 0; x < width; x++) {
    const px = rowStart + x * bpp;
    const r = raw[px];
    const g = raw[px + 1];
    const b = raw[px + 2];
    const a = raw[px + 3];
    if (a > 128 && !(r > 240 && g > 240 && b > 240)) {
      const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }
  }
}

const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
console.log('Top colors:');
sorted.slice(0, 25).forEach(([hex, count]) => console.log(hex, count));
