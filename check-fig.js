const fs = require('fs');
const cheerio = require('cheerio');

const file = 'E:/blog/old-site/2023/08/31/2023-8-31-java/index.html';
const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
console.log('figure.highlight 数量:', $('#article-container figure.highlight').length);
$('#article-container figure.highlight').each((i, el) => {
  const raw = $(el).attr('class');
  const classes = (raw || '').split(/\s+/);
  const lang = classes.find((c) => c !== 'highlight') || '';
  console.log(i, '原始class=', JSON.stringify(raw), ' 解析lang=', JSON.stringify(lang));
});
console.log('\n普通 pre 数量:', $('#article-container pre').not('#article-container figure pre').length);
