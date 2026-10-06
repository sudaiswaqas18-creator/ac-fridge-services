/**
 * Turns the raw wordmark screenshots in /brand (solid black / solid white
 * backgrounds) into clean, tightly-trimmed, transparent PNG wordmarks in /public.
 *
 * Source (brand/)                      -> output (public/)
 *   Max_a_is_iamge_ko_enhanced.png       EN, white ink on black  -> logo-en-dark.png
 *   Max_a_is_iamge_ko_enhanced (1).png   AR, white ink on black  -> logo-ar-dark.png
 *   Max_a_is_iamge_ko_enhanced (2).png   AR, black ink on white  -> logo-ar-light.png
 *   Max_a_is_iamge_ko_enhanced (3).png   EN, black ink on white  -> logo-en-light.png
 *
 * "dark"  = for dark surfaces (white ink)
 * "light" = for light surfaces (near-black ink)
 *
 * Run: npm run logo
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), 'brand');
const PUB = path.resolve(process.cwd(), 'public');

const MAP = [
  ['Max_a_is_iamge_ko_enhanced.png', 'logo-en-dark', 'onBlack', [255, 255, 255]],
  ['Max_a_is_iamge_ko_enhanced (1).png', 'logo-ar-dark', 'onBlack', [255, 255, 255]],
  ['Max_a_is_iamge_ko_enhanced (2).png', 'logo-ar-light', 'onWhite', [8, 43, 76]],
  ['Max_a_is_iamge_ko_enhanced (3).png', 'logo-en-light', 'onWhite', [8, 43, 76]],
];

// Levels applied to the ink mask so the background goes fully transparent
// while anti-aliased glyph edges stay smooth.
const LO = 0.14;
const HI = 0.74;
const BBOX_THRESHOLD = 26; // alpha value that counts as "ink" when trimming
const OUT_WIDTH = 760; // ~3.5x the largest on-screen size
const PAD_RATIO = 0.04; // breathing room around the glyphs, relative to ink height

const report = [];

for (const [file, name, mode, ink] of MAP) {
  const src = path.join(SRC, file);
  if (!fs.existsSync(src)) {
    report.push(`MISSING  ${file}`);
    continue;
  }

  const { data, info } = await sharp(src)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const alpha = Buffer.alloc(w * h);

  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let i = 0; i < w * h; i++) {
    const o = i * channels;
    const lum = (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
    let v = mode === 'onBlack' ? lum : 1 - lum;
    v = (v - LO) / (HI - LO);
    v = v < 0 ? 0 : v > 1 ? 1 : v;
    const a = Math.round(v * 255);
    alpha[i] = a;

    if (a > BBOX_THRESHOLD) {
      const x = i % w;
      const y = (i - x) / w;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) {
    report.push(`EMPTY    ${file} (no ink detected)`);
    continue;
  }

  const inkH = maxY - minY + 1;
  const pad = Math.max(2, Math.round(inkH * PAD_RATIO));
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(w - 1, maxX + pad);
  const bottom = Math.min(h - 1, maxY + pad);
  const cropW = right - left + 1;
  const cropH = bottom - top + 1;

  // Solid ink colour + computed alpha
  const rgba = Buffer.alloc(cropW * cropH * 4);
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const s = (top + y) * w + (left + x);
      const d = (y * cropW + x) * 4;
      rgba[d] = ink[0];
      rgba[d + 1] = ink[1];
      rgba[d + 2] = ink[2];
      rgba[d + 3] = alpha[s];
    }
  }

  const out = path.join(PUB, `${name}.png`);
  const written = await sharp(rgba, { raw: { width: cropW, height: cropH, channels: 4 } })
    .resize({ width: Math.min(OUT_WIDTH, cropW), withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: false })
    .toFile(out);

  report.push(
    `${name}.png  src ${w}x${h}  ink ${cropW}x${cropH}  -> ${written.width}x${written.height}  ${(written.size / 1024).toFixed(0)}KB`
  );
}

console.log(report.join('\n'));
console.log('DONE');
