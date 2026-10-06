import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), 'Public-Raw');
const OUT = path.resolve(process.cwd(), 'scripts/tmp');
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
const THUMB_W = 360, LABEL_H = 34, COLS = 4;

async function makeSheet(batch, name) {
  const metas = [];
  for (const f of batch) {
    const p = path.join(SRC, f);
    const thumb = await sharp(p).resize({ width: THUMB_W }).jpeg({ quality: 70 }).toBuffer();
    const m = await sharp(thumb).metadata();
    const short = f.replace('WhatsApp Image 2026-08-23 at ', '').replace('.jpeg', '');
    const labelSvg = Buffer.from(
      `<svg width="${THUMB_W}" height="${LABEL_H}"><rect width="100%" height="100%" fill="#111"/><text x="6" y="23" font-size="17" font-family="Consolas" fill="#0f0">${short}</text></svg>`
    );
    const cell = await sharp({ create: { width: THUMB_W, height: m.height + LABEL_H, channels: 3, background: '#222' } })
      .composite([{ input: thumb, top: LABEL_H, left: 0 }, { input: labelSvg, top: 0, left: 0 }])
      .jpeg().toBuffer();
    metas.push({ buf: cell, h: m.height + LABEL_H });
  }
  const rows = Math.ceil(metas.length / COLS);
  const colH = Array(COLS).fill(0);
  const pos = metas.map((m, i) => {
    const c = i % COLS;
    const top = colH[c]; colH[c] += m.h + 8;
    return { input: m.buf, left: c * (THUMB_W + 8), top };
  });
  await sharp({ create: { width: COLS * (THUMB_W + 8), height: Math.max(...colH), channels: 3, background: '#000' } })
    .composite(pos).jpeg({ quality: 72 }).toFile(path.join(OUT, name));
  console.log(name, 'done');
}

const half = Math.ceil(files.length / 2);
await makeSheet(files.slice(0, half), 'sheet-a.jpg');
await makeSheet(files.slice(half), 'sheet-b.jpg');
