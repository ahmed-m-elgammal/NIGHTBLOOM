import fs from 'node:fs';
import path from 'node:path';

// 1. Read tokens.css and collect all defined CSS variable names
const tokensCssPath = path.resolve('src/styles/tokens.css');
const tokensCssContent = fs.readFileSync(tokensCssPath, 'utf8');
const definedVars = new Set();
const defRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
let defMatch;
while ((defMatch = defRegex.exec(tokensCssContent)) !== null) {
  definedVars.add(defMatch[1]);
}

// 2. Scan src/ for any var(--...) usages
const srcDir = path.resolve('src');
const varUsageRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
const violations = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.normalize(path.relative(process.cwd(), fullPath));

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile() && /\.(tsx?|css)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
          return;
        }

        let match;
        while ((match = varUsageRegex.exec(line)) !== null) {
          const varName = match[1];
          // Allow dynamic/settings variables like --setting-crt-opacity
          if (varName.startsWith('--setting-')) {
            continue;
          }
          if (!definedVars.has(varName)) {
            violations.push({
              file: relPath,
              line: idx + 1,
              varName,
              snippet: trimmed,
            });
          }
        }
      });
    }
  }
}

scanDirectory(srcDir);

console.log(`Checking CSS token references across src/ (${definedVars.size} tokens defined in tokens.css)...`);

if (violations.length > 0) {
  console.error(`\n❌ Found ${violations.length} undefined CSS token reference(s):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} -> var(${v.varName}) is not defined in tokens.css!\n    Snippet: ${v.snippet}`);
  }
  process.exit(1);
} else {
  console.log('✓ All CSS token references are valid and defined in tokens.css.');
  process.exit(0);
}
