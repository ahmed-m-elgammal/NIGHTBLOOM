import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const MAX_BUDGET_BYTES = 350 * 1024; // 350 KB gzipped budget per PRD & AGENTS.md
const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

let totalRawBytes = 0;
let totalGzipBytes = 0;
const fileReports = [];

function checkDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirectory(fullPath);
    } else if (entry.isFile()) {
      const buffer = fs.readFileSync(fullPath);
      const rawBytes = buffer.length;
      const gzipBytes = zlib.gzipSync(buffer).length;
      totalRawBytes += rawBytes;
      totalGzipBytes += gzipBytes;

      const relPath = path.relative(distDir, fullPath).replace(/\\/g, '/');
      fileReports.push({
        file: relPath,
        rawKb: (rawBytes / 1024).toFixed(2),
        gzipKb: (gzipBytes / 1024).toFixed(2),
      });
    }
  }
}

checkDirectory(distDir);

console.log('\nProduction Bundle Gzip Budget Audit:');
console.table(fileReports);

const totalGzipKb = (totalGzipBytes / 1024).toFixed(2);
const maxBudgetKb = (MAX_BUDGET_BYTES / 1024).toFixed(0);

console.log(`Total production bundle: ${totalGzipKb} KB gzipped (Budget: <= ${maxBudgetKb} KB)`);

if (totalGzipBytes > MAX_BUDGET_BYTES) {
  console.error(`\n❌ Budget Exceeded! ${totalGzipKb} KB > ${maxBudgetKb} KB`);
  process.exit(1);
} else {
  const remainingKb = ((MAX_BUDGET_BYTES - totalGzipBytes) / 1024).toFixed(2);
  console.log(`✓ Production bundle budget satisfied! Remaining headroom: ${remainingKb} KB (${((totalGzipBytes / MAX_BUDGET_BYTES) * 100).toFixed(1)}% of budget used).\n`);
  process.exit(0);
}
