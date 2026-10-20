import fs from 'node:fs';
import path from 'node:path';

const MAX_FILE_LINES = 300;

// Patterns prohibited by AGENTS.md §4 Anti-AI Slop Mandates
const PROHIBITED_PATTERNS = [
  {
    regex: /@ts-(?:ignore|nocheck)/g,
    name: 'Type escape suppression (@ts-ignore / @ts-nocheck)',
  },
  {
    regex: /as\s+unknown\s+as\b/g,
    name: 'Unsafe double cast (as unknown as)',
  },
  {
    regex: /(?::\s*any\b|<any>|as\s+any\b)/g,
    name: 'Explicit any type escape',
  },
  {
    regex: /\/\/\s*TODO:\s*implement later\b/gi,
    name: 'Unimplemented placeholder comment',
  },
  {
    regex: /\/\/\s*Placeholder\b/gi,
    name: 'Placeholder comment',
  },
];

// Pure simulation boundaries (AGENTS.md §4 Rule 4)
const SIMULATION_DISALLOWED_IMPORTS = [
  'react',
  'react-dom',
  'window',
  'document',
  'CanvasRenderingContext2D',
  'AudioContext',
];

const SIMULATION_NON_DETERMINISTIC_CALLS = [
  /Math\.random\s*\(/g,
  /Date\.now\s*\(/g,
  /performance\.now\s*\(/g,
];

let totalFilesChecked = 0;
const violations = [];

function checkFile(fullPath) {
  const relPath = path.normalize(path.relative(process.cwd(), fullPath));
  if (!/\.(tsx?|jsx?|css)$/.test(fullPath)) return;

  totalFilesChecked++;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  // Rule 3: Max ~300 lines limit per source file
  if (lines.length > MAX_FILE_LINES) {
    violations.push({
      file: relPath,
      line: lines.length,
      rule: `File length exceeds ${MAX_FILE_LINES} lines (God file mandate)`,
      snippet: `Total lines: ${lines.length}`,
    });
  }

  const isSimulationFile = relPath.startsWith(path.normalize('src/game/simulation/'));

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();

    // Check anti-slop patterns (skip pure comment lines if inspecting code-only rules)
    for (const pat of PROHIBITED_PATTERNS) {
      if (pat.regex.test(line)) {
        violations.push({
          file: relPath,
          line: lineNum,
          rule: pat.name,
          snippet: trimmed,
        });
      }
    }

    // Simulation purity checks (AGENTS.md §4 Rule 4 & 6)
    if (isSimulationFile) {
      for (const disallowed of SIMULATION_DISALLOWED_IMPORTS) {
        if (line.includes(`from '${disallowed}'`) || line.includes(`from "${disallowed}"`)) {
          violations.push({
            file: relPath,
            line: lineNum,
            rule: `Simulation impurity: disallowed import '${disallowed}' in simulation layer`,
            snippet: trimmed,
          });
        }
      }
      for (const nonDet of SIMULATION_NON_DETERMINISTIC_CALLS) {
        if (nonDet.test(line)) {
          violations.push({
            file: relPath,
            line: lineNum,
            rule: 'Simulation impurity: non-deterministic call (use seeded PRNG mulberry32 instead)',
            snippet: trimmed,
          });
        }
      }
    }
  });
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      checkFile(fullPath);
    }
  }
}

const srcDir = path.resolve('src');
walkDir(srcDir);

console.log(`Linting codebase (${totalFilesChecked} files scanned)...`);

if (violations.length > 0) {
  console.error(`\n❌ Found ${violations.length} architectural lint violation(s):\n`);
  for (const v of violations) {
    console.error(`  [${v.rule}] ${v.file}:${v.line} -> ${v.snippet}`);
  }
  process.exit(1);
} else {
  console.log(`✓ Codebase clean: 0 architectural violations across all ${totalFilesChecked} source files.`);
  console.log('✓ Strict simulation purity, zero type escapes, and file line budgets satisfied.');
  process.exit(0);
}
