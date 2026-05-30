/* eslint-disable no-console */
// Generate WebP (and responsive variants) from PNG assets using sharp
// Usage: npm run gen:webp
// Requires: npm i -D sharp

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Please install sharp: npm i -D sharp');
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'src', 'Assets');
const outputDir = path.join(projectRoot, 'public', 'optimized');

const targets = [
  'Desktop - 16.png',
  'Rectangle 492.png',
  'Rectangle 489.png',
  'image 16 (2).png',
  'Subtract (4).png',
  'image 22.png',
  'image 19.png',
  'image 23 (1).png',
];

const widthsByFile = {
  'Desktop - 16.png': [1280, 1920, 2560],
  default: [640, 1280, 1920],
};

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function convertOne(file) {
  const srcPath = path.join(assetsDir, file);
  const baseName = file.replace(/\.(png|jpg|jpeg)$/i, '');
  const outBase = path.join(outputDir, baseName);
  const widths = widthsByFile[file] || widthsByFile.default;

  await ensureDir(outputDir);
  await ensureDir(outBase);

  const buf = await fs.promises.readFile(srcPath);

  // master webp (original size, q=85)
  await sharp(buf).webp({ quality: 85 }).toFile(path.join(outBase, `${baseName}.webp`));

  // responsive sizes
  await Promise.all(
    widths.map(async (w) => {
      await sharp(buf).resize({ width: w }).webp({ quality: 85 }).toFile(path.join(outBase, `${baseName}-${w}.webp`));
      await sharp(buf).resize({ width: w }).png({ compressionLevel: 9 }).toFile(path.join(outBase, `${baseName}-${w}.png`));
    })
  );

  // original PNG copy for fallback
  await fs.promises.copyFile(srcPath, path.join(outBase, `${baseName}.png`));
  console.log(`✓ ${file} → ${outBase}/...`);
}

(async () => {
  try {
    for (const f of targets) {
      await convertOne(f);
    }
    console.log('All done. Files in /public/optimized/*');
    console.log('Next: wire <picture> + srcset to use /optimized versions.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();


