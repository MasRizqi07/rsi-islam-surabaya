import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

describe('Duplication Scanner Script (scripts/check-duplication.mjs)', () => {
  it('harus exit non-zero (code 1) saat mendeteksi duplikasi data literal sengaja', () => {
    const testDir = join(tmpdir(), `rsi-dup-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });

    try {
      // Buat file dummy dengan duplikasi sengaja dari HOSPITAL_FACTS
      const dummyFile = join(testDir, 'DummyComponent.tsx');
      writeFileSync(
        dummyFile,
        `
        export function DummyComponent() {
          return <div>RS Islam Surabaya A. Yani</div>;
        }
        `,
        'utf8'
      );

      // Jalankan skrip check-duplication dengan flag --fixture
      const result = spawnSync(process.execPath, ['scripts/check-duplication.mjs', '--fixture', testDir], {
        encoding: 'utf8',
        shell: false,
      });

      expect(result.status).toBe(1);
      expect(result.stderr || result.stdout).toContain('RS Islam Surabaya A. Yani');
    } finally {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it('harus exit 0 saat tidak ada duplikasi data literal', () => {
    const testDir = join(tmpdir(), `rsi-clean-test-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });

    try {
      // Buat file dummy yang hanya mengimpor data
      const dummyFile = join(testDir, 'CleanComponent.tsx');
      writeFileSync(
        dummyFile,
        `
        import { HOSPITAL_FACTS } from '@/data/facts';
        export function CleanComponent() {
          return <div>{HOSPITAL_FACTS.name}</div>;
        }
        `,
        'utf8'
      );

      const result = spawnSync(process.execPath, ['scripts/check-duplication.mjs', '--fixture', testDir], {
        encoding: 'utf8',
        shell: false,
      });

      expect(result.status).toBe(0);
      expect(result.stdout).toContain('0 duplikasi string literal terdeteksi');
    } finally {
      rmSync(testDir, { recursive: true, force: true });
    }
  });
});
