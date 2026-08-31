const fs = require('fs');
const content = fs.readFileSync('C:/Users/johan/.gemini/antigravity/brain/2f2c54be-9495-44f6-a096-9fe5c5a8e327/.system_generated/logs/transcript_full.jsonl', 'utf-8');
const lines = content.split('\n').filter(Boolean);

let tsxMatches = [];
let jsonMatches = [];

lines.forEach(line => {
  try {
    const data = JSON.parse(line);
    if (data.type === 'GENERIC' || data.type === 'USER_INPUT' || data.type === 'SYSTEM_MESSAGE' || !data.type) {
      // The content might be inside a SYSTEM_MESSAGE
      const text = data.content || (data.message && data.message.content) || "";
      if (text.includes('```tsx')) {
        const m = [...text.matchAll(/```tsx\n([\s\S]*?)\n```/g)];
        tsxMatches.push(...m);
      }
      if (text.includes('```json')) {
        const m = [...text.matchAll(/```json\n([\s\S]*?)\n```/g)];
        jsonMatches.push(...m);
      }
    }
  } catch(e){}
});

const recentTsx = tsxMatches.slice(-5);
const recentJson = jsonMatches.slice(-5);

for (let i = 0; i < 5; i++) {
  if (!recentTsx[i] || !recentJson[i]) {
    console.log('Missing match at index', i);
    continue;
  }
  const tsxStr = recentTsx[i][1];
  const jsonStr = recentJson[i][1];
  try {
    const j = JSON.parse(jsonStr);
    fs.writeFileSync('e:/general workspace/kalkulators.my.id/src/components/calculators/' + j.slug + '-calculator.tsx', tsxStr);
    fs.writeFileSync('e:/general workspace/kalkulators.my.id/scratch/' + j.slug + '-seo.json', jsonStr);
    console.log('Saved', j.slug);
  } catch(e) {
    console.log('Error at index', i, e.message);
  }
}
