import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { stat } from 'node:fs/promises';
const names = ['hero-hvac-english', 'hero-hvac-arabic', 'poster-before-after-ac', 'poster-ac-jet-cleaning', 'poster-commercial-hvac-maintenance', 'poster-before-after-fridge', 'poster-before-after-washer'];
let before = 0, after = 0;
for (const name of names) {
 const src = fileURLToPath(new URL(`../src/assets/media/${name}.jpg`, import.meta.url)), out = fileURLToPath(new URL(`../src/assets/media/${name}.webp`, import.meta.url));
 await sharp(src).webp({quality: 84}).toFile(out);
 before += (await stat(src)).size; after += (await stat(out)).size;
}
console.log({before, after, savedPercent: Math.round((1-after/before)*100)});
