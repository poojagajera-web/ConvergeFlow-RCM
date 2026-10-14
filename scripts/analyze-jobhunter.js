const fs = require('fs');
const content = fs.readFileSync('C:/Users/WIN0065/.gemini/antigravity-ide/brain/fedfabeb-43cb-44a0-8bae-033d0c692c8f/.system_generated/steps/109/content.md', 'utf8');

// Find sections
const sectionMatches = content.match(/<section[^>]*>/g) || [];
console.log('--- SECTIONS (' + sectionMatches.length + ') ---');
sectionMatches.forEach(s => console.log(s.substring(0, 150)));

// Find headings
const headings = content.match(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/g) || [];
console.log('\n--- HEADINGS (' + headings.length + ') ---');
headings.slice(0, 15).forEach(h => {
  const clean = h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(clean);
});

// Find data attributes (framer-motion or gsap or custom)
const dataAttrs = [...new Set(content.match(/data-[a-z0-9_-]+/g) || [])];
console.log('\n--- DATA ATTRS ---', dataAttrs);

// Look for scroll or sticky or canvas or svg or bento
console.log('\nHas sticky:', content.includes('sticky'));
console.log('Has Lenis:', content.includes('lenis'));
console.log('Has GSAP:', content.includes('gsap') || content.includes('ScrollTrigger'));
console.log('Has Framer Motion:', content.includes('framer') || content.includes('motion'));
console.log('Has Lucide or svg:', (content.match(/<svg/g) || []).length);
