#!/usr/bin/env node
/**
 * Pack quality smoke (mjs entry). Prefer:
 *   npx tsx src/lib/personas/source-pack/smoke.ts
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(here, '../src/lib/personas/source-pack/smoke.ts');
const r = spawnSync('npx', ['tsx', target], { stdio: 'inherit', shell: process.platform === 'win32' });
process.exit(r.status ?? 1);
