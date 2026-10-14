const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/8b9ceda6-414c-4264-a2f0-045ab80eaca4/.user_uploaded/media_1791352252646.png');

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

const bpp = 4;
const stride = width * bpp + 1;

// Unfilter PNG (Scanlines)
const image = Buffer.alloc(width * height * 4);

function unfilter() {
  for (let y = 0; y < height; y++) {
    const filter = raw[y * stride];
    const prevRow = y > 0 ? (y - 1) * width * 4 : null;
    const currRow = y * width * 4;
    const rawRow = y * stride + 1;

    for (let x = 0; x < width * 4; x++) {
      const byte = raw[rawRow + x];
      const left = x >= 4 ? image[currRow + x - 4] : 0;
      const up = prevRow !== null ? image[prevRow + x] : 0;
      const upLeft = (prevRow !== null && x >= 4) ? image[prevRow + x - 4] : 0;

      let val = byte;
      if (filter === 1) { // Sub
        val = (byte + left) & 0xFF;
      } else if (filter === 2) { // Up
        val = (byte + up) & 0xFF;
      } else if (filter === 3) { // Average
        val = (byte + Math.floor((left + up) / 2)) & 0xFF;
      } else if (filter === 4) { // Paeth
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        let pr;
        if (pa <= pb && pa <= pc) pr = left;
        else if (pb <= pc) pr = up;
        else pr = upLeft;
        val = (byte + pr) & 0xFF;
      }
      image[currRow + x] = val;
    }
  }
}

unfilter();

// Check corner pixel alpha
console.log('Top-left pixel [0,0]:', image[0], image[1], image[2], 'Alpha:', image[3]);
console.log('Pixel at [50, 50]:', image[(50*width+50)*4], image[(50*width+50)*4+1], image[(50*width+50)*4+2], 'Alpha:', image[(50*width+50)*4+3]);

// Collect non-white, non-transparent colors
const colorCounts = {};
for (let i = 0; i < width * height; i++) {
  const r = image[i * 4];
  const g = image[i * 4 + 1];
  const b = image[i * 4 + 2];
  const a = image[i * 4 + 3];
  if (a > 200 && !(r > 240 && g > 240 && b > 240)) {
    const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }
}

const top = Object.entries(colorCounts).sort((a,b) => b[1] - a[1]).slice(0, 15);
console.log('Dominant logo colors:');
console.log(top);
