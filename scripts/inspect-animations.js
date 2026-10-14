const fs = require('fs');
const content = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/fedfabeb-43cb-44a0-8bae-033d0c692c8f/.system_generated/steps/109/content.md', 'utf8');

// Look for data- attributes and their context
const dataRegex = /<[^>]+data-([a-z0-9_-]+)[^>]*>/g;
let match;
const tags = [];
while ((match = dataRegex.exec(content)) !== null) {
  if (tags.length < 30) tags.push(match[0].substring(0, 120));
}
console.log('Sample data- tags:');
tags.forEach(t => console.log(t));

// Let's see how sticky or pinning or scroll progress works in features or how
const pinMatch = content.match(/data-pin[^>]*>[\s\S]*?<\/div>/);
if (pinMatch) console.log('\ndata-pin snippet:\n', pinMatch[0].substring(0, 500));

const trackMatch = content.match(/data-track[^>]*>[\s\S]*?<\/div>/);
if (trackMatch) console.log('\ndata-track snippet:\n', trackMatch[0].substring(0, 500));
