const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

const map = [
  { key: '第一篇文章', file: 'hexo-guide',          title: 'hexo 操作指南',   date: '2023-08-23', tags: ['hexo文章'], cats: ['hexo'] },
  { key: '第二篇文章', file: 'frontend-interview',  title: '前端八股文',      date: '2023-08-23', tags: ['前端面试'], cats: ['前端面试'] },
  { key: 'markdown语法详解', file: 'markdown-syntax', title: 'markdown语法详解', date: '2023-08-28', tags: ['markdown'], cats: ['markdown'] },
  { key: '数学建模', file: 'math-modeling',         title: '数学建模',        date: '2023-08-28', tags: ['matlab'], cats: ['数学建模'] },
  { key: '8-29-算法', file: 'algorithm',            title: '算法',            date: '2023-08-29', tags: ['算法'], cats: ['算法'] },
  { key: '8-30-react', file: 'react',               title: 'react',           date: '2023-08-29', tags: ['react'], cats: ['react'] },
  { key: '8-31-java', file: 'java',                 title: 'java',            date: '2023-08-31', tags: ['java'], cats: ['java'] }
];

const outDir = 'E:/blog/hexo/source/_posts';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function findFile(dir, key) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      const r = findFile(p, key);
      if (r) return r;
    } else if (name === 'index.html' && p.includes(key)) {
      return p;
    }
  }
  return null;
}

const removeSelectors = [
  '.headerlink', '.post-copyright', '.post-reward', '.relatedPosts', '.related-post',
  '.post-share', '.tag_share', '.post-widget', '.post-tools', '.comment', '#post-comment',
  '.post-pagination', '.anzhiyu', '.wjx', '.aplayer', '.no-tag'
];

map.forEach((m) => {
  const file = findFile('E:/blog/old-site/2023', m.key);
  if (!file) { console.log('未找到文件:', m.key); return; }
  const $ = cheerio.load(fs.readFileSync(file, 'utf8'));
  const container = $('#article-container');

  removeSelectors.forEach((s) => container.find(s).remove());

  // figure.highlight -> 规范化 pre.codeblock
  container.find('figure.highlight').each((i, el) => {
    const classes = ($(el).attr('class') || '').split(/\s+/);
    const lang = classes.find((c) => c !== 'highlight') || '';
    const lines = [];
    $(el).find('td.code .line').each((j, ln) => lines.push($(ln).text()));
    let code = lines.join('\n');
    if (!code) code = $(el).find('td.code').text();
    $(el).replaceWith($('<pre class="codeblock"></pre>').attr('data-lang', lang).text(code));
  });

  // 普通 pre
  container.find('pre').each((i, el) => {
    if ($(el).hasClass('codeblock')) return;
    if ($(el).closest('figure.highlight').length) return;
    const lines = [];
    $(el).find('.line').each((j, ln) => lines.push($(ln).text()));
    const code = lines.length ? lines.join('\n') : $(el).text();
    $(el).replaceWith($('<pre class="codeblock"></pre>').attr('data-lang', '').text(code));
  });

  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*'
  });
  td.addRule('codeblock', {
    filter: (node) => node.nodeName === 'PRE' && (node.className || '').indexOf('codeblock') >= 0,
    replacement: (content, node) => {
      const lang = node.getAttribute('data-lang') || '';
      const code = node.textContent.replace(/\n$/, '');
      return '\n\n```' + lang + '\n' + code + '\n```\n\n';
    }
  });

  let body = td.turndown(container.html());
  body = body.replace(/\n{3,}/g, '\n\n').trim();

  const fm = [
    '---',
    'title: ' + m.title,
    'date: ' + m.date,
    'tags:',
    ...m.tags.map((t) => '  - ' + t),
    'categories:',
    ...m.cats.map((c) => '  - ' + c),
    '---',
    ''
  ].join('\n');

  const outPath = path.join(outDir, m.file + '.md');
  fs.writeFileSync(outPath, fm + body + '\n', 'utf8');
  console.log('已生成:', outPath, ' 正文长度:', body.length);
});
