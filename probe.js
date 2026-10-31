const fs = require('fs');
const cheerio = require('cheerio');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(html);

console.log('==== <title> ====');
console.log($('title').text().trim());

console.log('\n==== meta 信息 ====');
$('meta').each((i, el) => {
  const n = $(el).attr('name') || $(el).attr('property');
  if (n && /date|published|category|tag|title|author|description/i.test(n)) {
    console.log(n, '=>', $(el).attr('content'));
  }
});

console.log('\n==== post-info / post-meta 文本 ====');
$('.post-info, .post-meta').first().find('a, span, time').each((i, el) => {
  const t = $(el).text().trim();
  if (t) console.log($(el).get(0).tagName, ':', t);
});

console.log('\n==== article-container 直接子元素 ====');
$('#article-container').children().each((i, el) => {
  console.log(i, $(el).get(0).tagName, 'class=', $(el).attr('class') || '', '文本前40:', $(el).text().trim().slice(0, 40).replace(/\n/g, ' '));
});

console.log('\n==== 代码块结构（前2个） ====');
$('#article-container figure.highlight, #article-container pre').slice(0, 2).each((i, el) => {
  console.log('--- 代码块', i, 'tag=', $(el).get(0).tagName, 'class=', $(el).attr('class'));
  console.log($.html(el).slice(0, 400));
});
