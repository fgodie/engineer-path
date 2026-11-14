import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../node_modules/vinext/dist/cli.js', import.meta.url));
const result = spawnSync(process.execPath, [cli, 'build'], {
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: '/engineer-path' },
  stdio: 'inherit',
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await import('./prepare-github-pages.mjs');
