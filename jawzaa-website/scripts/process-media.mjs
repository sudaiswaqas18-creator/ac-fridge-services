import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), '../Public');
const OUT = path.resolve(process.cwd(), 'src/assets/media');
const PUB = path.resolve(process.cwd(), 'public');
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(PUB, 'videos'), { recursive: true });

// [sourceFile, outputName, type]  type: photo | poster | logo
const MAP = [
  ['WhatsApp Image 2026-08-23 at 2.35.02 AM.jpeg', 'jawzaa-logo', 'logo'],

  ['WhatsApp Image 2026-08-23 at 2.31.28 AM.jpeg', 'jawzaa-storefront-day', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.31 AM.jpeg', 'workshop-technician-wide', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.32 AM.jpeg', 'jawzaa-storefront-open', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.33 AM (1).jpeg', 'jawzaa-storefront-signage', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.33 AM (2).jpeg', 'jawzaa-storefront-street', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.29 AM (1).jpeg', 'ac-units-wall', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.29 AM (2).jpeg', 'window-ac-repair', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.29 AM.jpeg', 'hvac-display-wall', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.32 AM (1).jpeg', 'ac-outdoor-units-stack', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.32 AM (2).jpeg', 'fridge-ac-service-bay', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.32 AM (3).jpeg', 'fridge-repair-bay', 'photo'],
  ['WhatsApp Image 2026-08-23 at 2.31.33 AM.jpeg', 'workshop-interior', 'photo'],

  ['WhatsApp Image 2026-08-23 at 2.35.03 AM.jpeg', 'poster-one-stop-solutions', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.04 AM.jpeg', 'poster-services-cards', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.07 AM (1).jpeg', 'poster-ac-repair-riyadh', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.07 AM.jpeg', 'poster-ac-not-cooling', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.08 AM (1).jpeg', 'poster-summer-maintenance', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.08 AM.jpeg', 'poster-clean-filter', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.09 AM.jpeg', 'poster-unit-not-cooling', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.10 AM (1).jpeg', 'poster-fridge-door-seal', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.10 AM.jpeg', 'poster-4-warning-signs', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.11 AM.jpeg', 'poster-motor-rewinding', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.12 AM.jpeg', 'poster-motor-overheating', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.14 AM (1).jpeg', 'poster-inside-workshop', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.14 AM.jpeg', 'poster-correct-diagnosis', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.16 AM (1).jpeg', 'poster-serve-riyadh-map', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.16 AM (2).jpeg', 'poster-riyadh-city', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.16 AM.jpeg', 'poster-before-after-motor', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.17 AM.jpeg', 'poster-riyadh-technician', 'poster'],
  ['WhatsApp Image 2026-08-23 at 2.35.18 AM.jpeg', 'poster-services-list', 'poster'],
];

const report = [];

for (const [file, name, type] of MAP) {
  const src = path.join(SRC, file);
  if (!fs.existsSync(src)) { report.push(`MISSING ${file}`); continue; }
  const img = sharp(src).rotate();
  const meta = await img.metadata();

  let pipe;
  if (type === 'logo') {
    pipe = img.resize({ width: 1400, withoutEnlargement: true })
      .modulate({ saturation: 1.05 })
      .sharpen({ sigma: 0.6 });
  } else if (type === 'photo') {
    // Real workshop/storefront photos: gentle contrast lift, dehaze-ish curve, color pop, sharpen
    pipe = img.resize({ width: 1600, withoutEnlargement: true })
      .linear(1.09, -10)
      .gamma(1.03)
      .modulate({ saturation: 1.14, brightness: 1.02 })
      .sharpen({ sigma: 0.9, m1: 0.6, m2: 2.2 });
  } else {
    // Posters are clean renders; just optimize hard
    pipe = img.resize({ width: 1080, withoutEnlargement: true }).sharpen({ sigma: 0.5 });
  }

  const info = await pipe.webp({ quality: type === 'photo' ? 80 : 82, effort: 4 })
    .toFile(path.join(OUT, `${name}.webp`));
  report.push(`${name}.webp  ${meta.width}x${meta.height} -> ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
}

// OG image 1200x630 from storefront day photo
await sharp(path.join(SRC, MAP[1][0]))
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .linear(1.08, -9).modulate({ saturation: 1.12 })
  .jpeg({ quality: 82 })
  .toFile(path.join(PUB, 'og-image.jpg'));

console.log(report.join('\n'));
console.log('DONE');
