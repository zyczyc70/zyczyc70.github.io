const cheerio = require('cheerio');
const TurndownService = require('turndown');

const src = '<figure class="highlight java"><table><tbody><tr><td class="code"><pre><span class="line">x=1</span></pre></td></tr></tbody></table></figure>';
const $ = cheerio.load(src);
$('figure.highlight').each((i, el) => {
  const cl = ($(el).attr('class') || '').split(/\s+/);
  const lang = cl.find((c) => c !== 'highlight') || '';
  $(el).replaceWith($('<pre class="codeblock"></pre>').attr('data-lang', lang).text('x=1'));
});
const html = $('#codeblock, .codeblock').parent().html() || $.html();
console.log('cheerio 生成 HTML:', $.html());

const td = new TurndownService({ codeBlockStyle: 'fenced' });
td.addRule('codeblock', {
  filter: (node) => node.nodeName === 'PRE' && (node.className || '').indexOf('codeblock') >= 0,
  replacement: (content, node) => {
    console.log('规则命中, data-lang =', JSON.stringify(node.getAttribute('data-lang')), ' className =', node.className);
    const lang = node.getAttribute('data-lang') || '';
    return '\n```' + lang + '\n' + node.textContent + '\n```\n';
  }
});
console.log('turndown 结果:\n' + td.turndown($.html()));
