const fs = require("fs");
const path = require("path");

const dir = "C:/Users/WIN0065/.gemini/antigravity-ide/brain/aa11ac5f-fb9c-4395-8652-69c783722c35/.user_uploaded";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".png"));

for (const f of files) {
  const full = path.join(dir, f);
  const buf = fs.readFileSync(full);
  // PNG dimensions: width at offset 16 (4 bytes BE), height at offset 20 (4 bytes BE)
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`${f}: ${width}x${height}, size: ${buf.length}`);
}
