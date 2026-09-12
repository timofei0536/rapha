import fs from 'node:fs';
import path from 'node:path';

/** Watch the whole theme so PHP rsyncs together. */
export function watchThemeDir(themeDir, onChange) {
  fs.watch(themeDir, { recursive: true }, onChange);
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
