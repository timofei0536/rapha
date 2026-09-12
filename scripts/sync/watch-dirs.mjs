import fs from 'node:fs';
import path from 'node:path';

/** Watch the whole theme (including nextwp) so PHP + schema rsync together. */
export function watchThemeDir(themeDir, onChange) {
  fs.watch(themeDir, { recursive: true }, onChange);
}

export function watchZephirosExceptNextwp(themeDir, onChange) {
  for (const ent of fs.readdirSync(themeDir, { withFileTypes: true })) {
    if (ent.name === 'nextwp') continue;
    const p = path.join(themeDir, ent.name);
    if (ent.isDirectory()) fs.watch(p, { recursive: true }, onChange);
    else if (ent.isFile()) fs.watch(p, onChange);
  }
}

export function watchRepoBundleDirs(repoRoot, onChange) {
  const dirs = [
    path.join(repoRoot, 'src', 'app'),
    path.join(repoRoot, 'src', 'components'),
    path.join(repoRoot, 'public'),
  ];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    fs.watch(dir, { recursive: true }, onChange);
  }
}
