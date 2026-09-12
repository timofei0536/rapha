/**
 * Theme rsync (Hostinger). Key: ~/.ssh/hostinger_rapha_ed25519 (not in repo).
 */
import path from 'node:path';

/** Absolute path to SSH private key. */
export const THEME_SYNC_SSH_KEY = path.join(
  process.env.HOME ?? '',
  '.ssh',
  'hostinger_rapha_ed25519'
);

export const THEME_SYNC_SSH_PORT = '65002';

export const THEME_SYNC_SSH_USER_HOST = 'u538382032@77.37.37.21';

/** Remote theme directory (trailing slash for rsync). */
export const THEME_SYNC_REMOTE_DIR =
  '/home/u538382032/domains/rapha.tim-work.com/public_html/wp-content/themes/theme/';

/**
 * rsync -e "…" string (single shell command for rsync).
 *
 * @returns {string}
 */
export function themeSyncRsyncSshFlag() {
  return `ssh -i "${THEME_SYNC_SSH_KEY}" -p ${THEME_SYNC_SSH_PORT} -o IdentitiesOnly=yes`;
}
