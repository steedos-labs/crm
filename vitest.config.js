import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/e2e/specs/**/*.spec.mjs'],
    setupFiles: ['./tests/e2e/setup-fork.mjs'],
    pool: 'forks',
    poolOptions: { forks: { singleFork: true, isolate: false } },
    fileParallelism: false,
    sequence: { concurrent: false, shuffle: false },
    testTimeout: 120_000,
    hookTimeout: 360_000,
    teardownTimeout: 60_000,
    reporters: ['default'],
  },
});
