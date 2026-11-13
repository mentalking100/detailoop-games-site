import {stat, writeFile} from 'node:fs/promises';

const source = new URL('../public/media/intro.mp4', import.meta.url);
const {size} = await stat(source);
if (size === 0 || size > 25 * 1024 * 1024) {
  throw new Error('intro.mp4 must be non-empty and within the 25 MiB static asset limit.');
}
// Generate from the exact file Astro copies to dist; no manually maintained size.
await writeFile(new URL('./intro-meta.json', import.meta.url), JSON.stringify({byteLength: size}) + '\n');
console.log(`Video metadata: ${size} bytes.`);
