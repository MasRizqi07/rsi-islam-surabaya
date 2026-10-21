import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [filename, ...cmdParts] = process.argv.slice(2);
if (!filename || cmdParts.length === 0) {
  console.error('Usage: node scripts/capture-evidence.mjs <NN-filename.txt> <command...>');
  process.exit(1);
}

const command = cmdParts.join(' ');
const outDir = join(process.cwd(), 'docs', 'evidence', 'raw');
mkdirSync(outDir, { recursive: true });

const env = { ...process.env };
if (process.platform === 'win32') {
  const gitUsrBin = 'C:\\Program Files\\Git\\usr\\bin';
  if (!env.PATH.includes(gitUsrBin)) {
    env.PATH = `${gitUsrBin};${env.PATH}`;
  }
}

// Eksekusi perintah di shell
const res = spawnSync(command, { shell: true, encoding: 'utf8', env });
const stdout = res.stdout || '';
const stderr = res.stderr || '';
const output = stdout + stderr;
const exitCode = res.status !== null ? res.status : (res.error ? 1 : 0);

// Format file:
// Baris 1: perintah yang dijalankan
// Tengah: output asli
// Baris terakhir: EXIT CODE: <angka>
let content = `${command}\n`;
if (output.length > 0) {
  content += output;
  if (!output.endsWith('\n')) {
    content += '\n';
  }
}
content += `EXIT CODE: ${exitCode}\n`;

const targetFile = join(outDir, filename);
writeFileSync(targetFile, content, 'utf8');
console.log(`[CAPTURE-EVIDENCE] Wrote ${targetFile} (Exit Code: ${exitCode})`);

process.exit(exitCode);
