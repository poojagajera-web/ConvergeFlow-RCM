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
const image = Buffer.alloc(width * height * 4);

// Unfilter
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
    if (filter === 1) val = (byte + left) & 0xFF;
    else if (filter === 2) val = (byte + up) & 0xFF;
    else if (filter === 3) val = (byte + Math.floor((left + up) / 2)) & 0xFF;
    else if (filter === 4) {
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

// Convert navy pixels to crisp white for dark theme
// Navy #17324D: R in [15, 30], G in [40, 60], B in [65, 90]
// Teal pixels have G much higher (G > 120, B > 100, R < 20)
const darkImg = Buffer.from(image);

for (let i = 0; i < width * height; i++) {
  const r = darkImg[i * 4];
  const g = darkImg[i * 4 + 1];
  const b = darkImg[i * 4 + 2];
  const a = darkImg[i * 4 + 3];

  if (a > 10) {
    // If it's the dark navy color (not the teal/green)
    // In teal: g is high and r is low, but g is substantially higher than in navy
    // Navy: r ≈ 23 (0x17), g ≈ 50 (0x32), b ≈ 77 (0x4D)
    // Teal: g > 110
    if (g < 95 && b > 40) {
      // It's navy or anti-aliased navy!
      // Invert intensity to white
      darkImg[i * 4] = 255;
      darkImg[i * 4 + 1] = 255;
      darkImg[i * 4 + 2] = 255;
    }
  }
}

// Encode as uncompressed / filtered PNG scanlines (Filter 0 = None)
const outRaw = Buffer.alloc(height * (width * 4 + 1));
for (let y = 0; y < height; y++) {
  outRaw[y * stride] = 0; // Filter 0
  darkImg.copy(outRaw, y * stride + 1, y * width * 4, (y + 1) * width * 4);
}

const outDeflated = zlib.deflateSync(outRaw);

// Build PNG
function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  
  // Calculate CRC32
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// Simple CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // bit depth
ihdrData[9] = 6; // color type RGBA
ihdrData[10] = 0; // compression
ihdrData[11] = 0; // filter
ihdrData[12] = 0; // interlace

const ihdrChunk = makeChunk('IHDR', ihdrData);
const idatChunk = makeChunk('IDAT', outDeflated);
const iendChunk = makeChunk('IEND', Buffer.alloc(0));

const finalDarkPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync('public/assets/logos/convergeflow-dark.png', finalDarkPng);
fs.writeFileSync('public/assets/logos/convergeflow-light.png', buf); // copy original light
console.log('Successfully generated public/assets/logos/convergeflow-dark.png and light.png');
