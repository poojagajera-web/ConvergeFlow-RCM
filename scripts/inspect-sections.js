const fs = require('fs');
const content = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/fedfabeb-43cb-44a0-8bae-033d0c692c8f/.system_generated/steps/109/content.md', 'utf8');

// Check features section
const featuresMatch = content.match(/<section id="features"[\s\S]*?<\/section>/);
if (featuresMatch) {
  console.log('--- FEATURES SECTION LENGTH ---', featuresMatch[0].length);
  // print first 1500 chars
  console.log(featuresMatch[0].substring(0, 1500));
}

// Check how section
const howMatch = content.match(/<section id="how"[\s\S]*?<\/section>/);
if (howMatch) {
  console.log('\n--- HOW SECTION LENGTH ---', howMatch[0].length);
  console.log(howMatch[0].substring(0, 1500));
}

// Check demo section
const demoMatch = content.match(/<section id="demo"[\s\S]*?<\/section>/);
if (demoMatch) {
  console.log('\n--- DEMO SECTION LENGTH ---', demoMatch[0].length);
  console.log(demoMatch[0].substring(0, 1500));
}
