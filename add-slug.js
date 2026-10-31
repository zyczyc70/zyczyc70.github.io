const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'source', '_posts');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
  const slug = file.replace(/\.md$/, '');
  const full = path.join(dir, file);
  let content = fs.readFileSync(full, 'utf8');

  if (/^slug:/m.test(content)) {
    console.log('skip (already has slug):', file);
    return;
  }

  // 在第一个 --- 之后插入 slug 字段
  content = content.replace(/^---\r?\n/, `---\nslug: ${slug}\n`);
  fs.writeFileSync(full, content, 'utf8');
  console.log('added slug:', slug, '->', file);
});
