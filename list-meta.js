const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const root = 'E:/blog/old-site/2023';
function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) out = out.concat(walk(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

const files = walk(root);
files.forEach((f) => {
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));
  const title = $('meta[property="og:title"]').attr('content') || $('title').text().split('|')[0].trim();
  const date = $('meta[property="article:published_time"]').attr('content');
  const tags = [];
  $('meta[property="article:tag"]').each((i, el) => tags.push($(el).attr('content')));
  const cats = [];
  $('a[href*="/categories/"]').each((i, el) => {
    const t = $(el).text().trim();
    if (t && t !== '分类') cats.push(t);
  });
  const uniqCats = [...new Set(cats)];
  console.log('FILE:', f);
  console.log('  title:', title);
  console.log('  date:', date);
  console.log('  tags:', JSON.stringify(tags));
  console.log('  categories:', JSON.stringify(uniqCats));
});
