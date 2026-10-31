const fs = require('fs');
const path = require('path');

const dir = 'E:/blog/hexo/source/_posts';
const coverMap = {
  'frontend-interview.md': 2,
  'hexo-guide.md': 7,
  'java.md': 1,
  'markdown-syntax.md': 3,
  'math-modeling.md': 6,
  'react.md': 4,
  'algorithm.md': 5
};

fs.readdirSync(dir).filter((f) => f.endsWith('.md')).forEach((f) => {
  const n = coverMap[f];
  if (!n) return;
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (/^cover:\s*/m.test(content)) return;
  const coverLine = 'cover: /img/cover/cover' + n + '.webp';
  content = content.replace(/^(---\n[\s\S]*?\n)(---)/, '$1' + coverLine + '\n$2');
  fs.writeFileSync(p, content, 'utf8');
  console.log(f, '->', coverLine);
});
