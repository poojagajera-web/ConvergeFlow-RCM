const fs = require('fs');
const content = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/fedfabeb-43cb-44a0-8bae-033d0c692c8f/.system_generated/steps/109/content.md', 'utf8');

// Look for data-track full container
const trackIndex = content.indexOf('data-track="true"');
if (trackIndex !== -1) {
  console.log('--- TRACK CONTAINER ---');
  console.log(content.substring(trackIndex - 100, trackIndex + 2000));
}

// Look for data-pin container
const pinIndex = content.indexOf('data-pin="true"');
if (pinIndex !== -1) {
  console.log('\n--- PIN CONTAINER ---');
  console.log(content.substring(pinIndex - 100, pinIndex + 2000));
}
