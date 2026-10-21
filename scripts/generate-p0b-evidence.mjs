import { execSync, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = 'docs/evidence/v3/p0b';
mkdirSync(outDir, { recursive: true });

const gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' }).trim() || 'CLEAN';

const tasks = [
  { name: 'typecheck.log', cmd: 'npm run typecheck' },
  { name: 'lint.log', cmd: 'npm run lint' },
  { name: 'unit-tests.log', cmd: 'npm test' },
  { name: 'facts-check.log', cmd: 'npm run check:facts' },
  { name: 'duplication.log', cmd: 'npm run check:duplication' },
  { name: 'build.log', cmd: 'npm run build' },
  { name: 'e2e.log', cmd: 'npm run test:e2e' },
];

for (const t of tasks) {
  if (t.name === 'e2e.log') {
    try {
      execSync('powershell -Command "Get-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force"', { stdio: 'ignore' });
    } catch {}
  }
  console.log(`[RUNNING] ${t.cmd}...`);
  const res = spawnSync(t.cmd, { shell: true, encoding: 'utf8' });
  const output = (res.stdout || '') + (res.stderr || '');
  const exitCode = res.status !== null ? res.status : 1;

  const content = [
    `# Command: ${t.cmd}`,
    `# Exit Code: ${exitCode}`,
    `# Git Commit: ${gitCommit}`,
    `# Git Status: ${gitStatus}`,
    '',
    output.trim(),
    '',
  ].join('\n');

  const filePath = join(outDir, t.name);
  writeFileSync(filePath, content, 'utf8');
  console.log(`[DONE] Wrote ${filePath} (Exit Code: ${exitCode})`);
}

// Live URL check
console.log('[RUNNING] Live URL check...');
const curlRes = spawnSync('curl -I -s https://rsi-islam-surabaya.vercel.app', { shell: true, encoding: 'utf8' });
const curlOut = (curlRes.stdout || '') + (curlRes.stderr || '');
const liveLog = [
  '# Command: curl -I -s https://rsi-islam-surabaya.vercel.app',
  `# Exit Code: ${curlRes.status !== null ? curlRes.status : 0}`,
  `# Git Commit: ${gitCommit}`,
  `# Git Status: ${gitStatus}`,
  '',
  curlOut.trim(),
  '',
  'STATUS: LIVE URL: BELUM ADA (deployment manual user belum dikonfigurasi)',
  '',
].join('\n');
writeFileSync(join(outDir, 'live-health.log'), liveLog, 'utf8');
console.log(`[DONE] Wrote ${join(outDir, 'live-health.log')}`);
