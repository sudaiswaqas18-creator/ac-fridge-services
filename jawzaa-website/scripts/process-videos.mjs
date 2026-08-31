import ffmpegPath from 'ffmpeg-static';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SRC = path.resolve(process.cwd(), '../Public');
const OUT = path.join(process.cwd(), 'public', 'videos');
const ff = ffmpegPath;

const vids = fs.readdirSync(SRC).filter(f => f.endsWith('.mp4')).sort();
let i = 0;
for (const v of vids) {
  i++;
  const src = path.join(SRC, v);
  const out = path.join(OUT, `jawzaa-work-${String(i).padStart(2, '0')}.mp4`);
  // Probe duration/resolution
  const probe = execSync(`"${ff}" -i "${src}" 2>&1 | findstr /C:"Duration" /C:"Stream"`).toString();
  console.log('---', v, '\n', probe.trim());
  // Scale to max 720 height, H.264, no audio (muted autoplay), faststart
  execSync(`"${ff}" -y -i "${src}" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 25 -preset medium -movflags +faststart -an "${out}"`);
}
const sizes = fs.readdirSync(OUT).map(f => `${f} ${(fs.statSync(path.join(OUT, f)).size / 1024).toFixed(0)}KB`);
console.log(sizes.join('\n'));
console.log('VIDEOS DONE');
