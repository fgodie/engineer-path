import { copyFile, readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outputDir = fileURLToPath(new URL('../dist/client/', import.meta.url));
const basePath = '/engineer-path';
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.rsc']);

async function rewriteDirectory(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewriteDirectory(path);
      return;
    }

    if (!textExtensions.has(extname(entry.name))) return;
    const source = await readFile(path, 'utf8');
    const rewritten = source
      .replace(/([`"'])_next\//g, `$1${basePath}/_next/`)
      .replaceAll('/_next', `${basePath}/_next`);
    if (rewritten !== source) await writeFile(path, rewritten);
  }));
}

await rewriteDirectory(outputDir);
await copyFile(join(outputDir, 'index.html'), join(outputDir, '404.html'));
await writeFile(join(outputDir, '.nojekyll'), '');
