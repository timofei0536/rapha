import fs from 'node:fs';
import path from 'node:path';
import { debounce } from './debounce.mjs';
import { THEME_SYNC_REMOTE_DIR, THEME_SYNC_SSH_KEY } from './config.mjs';
import { runRsyncPushAsync } from './rsync-push.mjs';
import { watchThemeDir } from './watch-dirs.mjs';

const REPO_ROOT = path.resolve(process.cwd());
const THEME_DIR = path.resolve(REPO_ROOT, 'wp-theme');
const BUNDLE_ONLY = process.argv.includes('--bundle');
const ONCE_WITH_REMOTE = process.argv.includes('--once');

function fullSync() {
  console.log('[theme-sync] rsync theme → remote');
  runRsyncPushAsync(THEME_DIR);
}

if (!fs.existsSync(THEME_DIR)) {
  throw new Error(`Theme folder not found: ${THEME_DIR}`);
}

if (BUNDLE_ONLY || ONCE_WITH_REMOTE) {
  console.error(
    '[theme-sync] --bundle and --once are disabled in this project.'
  );
  process.exit(1);
}

if (!fs.existsSync(THEME_SYNC_SSH_KEY)) {
  console.error(`[theme-sync] SSH key not found: ${THEME_SYNC_SSH_KEY}`);
  console.error('[theme-sync] Fill scripts/sync/config.mjs before watching.');
  process.exit(1);
}

console.log('[theme-sync] watching wp-theme');
console.log(`[theme-sync] syncing to ${THEME_SYNC_REMOTE_DIR}`);

const sync = debounce(fullSync, 400);
fullSync();
watchThemeDir(THEME_DIR, () => sync());
