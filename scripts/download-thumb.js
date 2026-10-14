const https = require('https');
const fs = require('fs');

const url = 'https://i.vimeocdn.com/video/2205607225-0eb9c71a740dc8e8b2d163a8d2e462649391390d9bbf586f739474de3d24a021-d_640?region=us';
const file = fs.createWriteStream('scripts/vimeo-thumb.jpg');

https.get(url, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded vimeo thumbnail successfully');
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
