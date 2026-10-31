const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = 'E:/blog/old-site/assets';
const IMG = 'E:/blog/old-site/img';
const OUT = 'E:/blog/hexo/source/img';

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

async function toWebp(src, dest, width, quality) {
  ensureDir(path.dirname(dest));
  const input = sharp(src).rotate();
  if (width) input.resize({ width, withoutEnlargement: true });
  await input.webp({ quality, effort: 5 }).toFile(dest);
}

(async () => {
  let before = 0;
  let after = 0;
  const jobs = [];

  // 封面图
  for (let i = 1; i <= 7; i++) {
    jobs.push([`cover${i}.jpg`, `cover/cover${i}.webp`, 1200, 78]);
  }
  // 置顶/轮播大图
  for (let i = 1; i <= 4; i++) {
    jobs.push([`zhidingtu${i}.jpg`, `banner/banner${i}.webp`, 1920, 78]);
  }
  // 其他 [名称, 输出, 宽, 质量, 源目录(默认assets)]
  const extras = [
    ['bizhi.jpg', 'background.webp', 1920, 75, 'assets'],
    ['touxiang.jpg', 'avatar.webp', 200, 82, 'assets'],
    ['erweima.jpg', 'erweima.webp', 600, 88, 'assets'],
    ['404.jpg', '404.webp', 660, 80, 'img'],
    ['wangyetubiao.jpg', 'wangyetubiao.webp', 228, 85, 'assets'],
    ['java.jpg', 'java.webp', 757, 85, 'assets']
  ];
  extras.forEach((e) => jobs.push([e[0], e[1], e[2], e[3], e[4]]));

  for (const job of jobs) {
    const name = job[0], rel = job[1], w = job[2], q = job[3];
    const srcBase = job[4] === 'img' ? IMG : SRC;
    const src = path.join(srcBase, name);
    const dest = path.join(OUT, rel);
    const srcSize = fs.statSync(src).size;
    await toWebp(src, dest, w, q);
    const destSize = fs.statSync(dest).size;
    before += srcSize;
    after += destSize;
    console.log(
      name.padEnd(16), '->', rel.padEnd(22),
      Math.round(srcSize / 1024) + 'KB', '=>', Math.round(destSize / 1024) + 'KB'
    );
  }

  // favicon 直接复制（png 保留）
  fs.copyFileSync(path.join(IMG, 'favicon.png'), path.join(OUT, 'favicon.png'));
  console.log('\nfavicon.png 已复制');

  console.log('\n==== 汇总（不含 favicon） ====');
  console.log('优化前:', (before / 1024 / 1024).toFixed(2), 'MB');
  console.log('优化后:', (after / 1024 / 1024).toFixed(2), 'MB');
  console.log('减少:', ((1 - after / before) * 100).toFixed(1) + '%');
})();
