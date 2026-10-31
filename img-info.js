const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dirs = ['E:/blog/old-site/assets', 'E:/blog/old-site/img'];
(async () => {
  for (const d of dirs) {
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name);
      const st = fs.statSync(p);
      if (st.isDirectory()) continue;
      try {
        const meta = await sharp(p).metadata();
        console.log(
          name.padEnd(18),
          (meta.format || '').padEnd(5),
          (meta.width + 'x' + meta.height).padEnd(12),
          (Math.round(st.size / 1024) + ' KB')
        );
      } catch (e) {
        console.log(name, '读取失败', e.message);
      }
    }
  }
})();
