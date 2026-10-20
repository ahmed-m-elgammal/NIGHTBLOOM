import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_FILES = new Set([
  path.normalize('src/content/theme/tokens.ts'),
  path.normalize('src/styles/tokens.css'),
]);

const COLOR_REGEX = /(?:#(?:[0-9a-fA-F]{3,4}){1,2}\b|rgba?\([^)]+\)|hsla?\([^)]+\))/g;

function scanDir(dir, violations = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.normalize(path.relative(process.cwd(), fullPath));

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(fullPath, violations);
      }
    } else if (entry.isFile()) {
      if (ALLOWED_FILES.has(relPath)) {
        continue;
      }
      // Check .ts, .tsx, .css files
      if (/\.(tsx?|css)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          // Ignore comments
          const trimmed = line.trim();
          if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            return;
          }
          const matches = line.match(COLOR_REGEX);
          if (matches) {
            violations.push({
              file: relPath,
              line: index + 1,
              content: line.trim(),
              matches,
            });
          }
        });
      }
    }
  }
  return violations;
}

const srcDir = path.resolve('src');
const violations = scanDir(srcDir);

if (violations.length > 0) {
  console.error(`\n❌ Found ${violations.length} hardcoded color(s) outside token definitions:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> ${v.content} (matched: ${v.matches.join(', ')})`);
  }
  console.error('\nFix: Import and use ThemeTokens from src/content/theme/tokens.ts or CSS variables from tokens.css.\n');
  process.exit(1);
} else {
  console.log('✓ Zero hardcoded colors detected. All colors use ThemeTokens or CSS variables.');
  process.exit(0);
}
