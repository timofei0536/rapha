import { spawn, spawnSync } from 'node:child_process';
import {
  THEME_SYNC_REMOTE_DIR,
  THEME_SYNC_SSH_USER_HOST,
  themeSyncRsyncSshFlag,
} from './config.mjs';

let currentChild = null;

function rsyncPushArgs(themeDir) {
  return [
    '-az',
    '-e',
    themeSyncRsyncSshFlag(),
    `${themeDir}/`,
    `${THEME_SYNC_SSH_USER_HOST}:${THEME_SYNC_REMOTE_DIR}`,
  ];
}

export function runRsyncPushAsync(themeDir) {
  if (currentChild && currentChild.exitCode === null) {
    currentChild.kill('SIGTERM');
    currentChild = null;
  }
  const child = spawn('rsync', rsyncPushArgs(themeDir), { stdio: 'inherit' });
  currentChild = child;
  child.on('exit', (code) => {
    if (code !== 0) process.exitCode = code ?? 1;
    if (currentChild === child) currentChild = null;
  });
}

export function runRsyncPushWait(themeDir) {
  const r = spawnSync('rsync', rsyncPushArgs(themeDir), { stdio: 'inherit' });
  return r.status === 0 ? 0 : r.status ?? 1;
}
