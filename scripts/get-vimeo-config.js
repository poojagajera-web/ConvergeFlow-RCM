const https = require('https');

const url = 'https://player.vimeo.com/video/1230658346/config';
https.get(url, { headers: { 'Referer': 'https://vimeo.com' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Title:', json.video?.title);
      console.log('Thumbs:', json.video?.thumbs);
      const files = json.request?.files?.progressive;
      if (files && files.length > 0) {
        console.log('Progressive MP4 URL:', files[0].url);
      } else {
        console.log('HLS / Dash:', json.request?.files?.hls?.cdns);
      }
    } catch (e) {
      console.log('Error/Status:', res.statusCode, data.slice(0, 300));
    }
  });
});
