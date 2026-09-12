/**
 * Pull theme from CMS → local wp-theme/ (reverse of theme watch push).
 * Does not delete local-only files (no --delete). Overwrites matching paths.
 *
 * Usage: node scripts/sync/theme-pull-sync.mjs [--dry-run]
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  THEME_SYNC_REMOTE_DIR,
  THEME_SYNC_SSH_KEY,
  THEME_SYNC_SSH_USER_HOST,
  themeSyncRsyncSshFlag,
} from './config.mjs';

const REPO_ROOT = path.resolve(process.cwd());
const THEME_DIR = path.resolve(REPO_ROOT, 'wp-theme');
const DRY_RUN = process.argv.includes('--dry-run');

function buildPullArgs() {
  const args = ['-az'];
  if (DRY_RUN) args.push('--dry-run', '--itemize-changes');
  args.push(
    '-e',
    themeSyncRsyncSshFlag(),
    `${THEME_SYNC_SSH_USER_HOST}:${THEME_SYNC_REMOTE_DIR}`,
    `${THEME_DIR}/`
  );
  return args;
}

if (!fs.existsSync(THEME_DIR)) {
  throw new Error(`Theme folder not found: ${THEME_DIR}`);
}
if (!fs.existsSync(THEME_SYNC_SSH_KEY)) {
  console.error(`[theme-pull] SSH key not found: ${THEME_SYNC_SSH_KEY}`);
  process.exit(1);
}

console.log(`[theme-pull] ${DRY_RUN ? 'DRY RUN — ' : ''}${THEME_SYNC_REMOTE_DIR}`);
console.log(`[theme-pull] → ${THEME_DIR}/`);

const r = spawnSync('rsync', buildPullArgs(), { stdio: 'inherit' });
process.exit(r.status === 0 ? 0 : r.status ?? 1);
