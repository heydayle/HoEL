import path from 'path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    /** Use jsdom to simulate a browser environment for component tests */
    environment: 'jsdom',

    /** Enable global test APIs (describe, it, expect, vi) without explicit imports */
    globals: true,

    /** Setup file to run before each test suite — polyfills and global mocks */
    setupFiles: ['./vitest.setup.ts'],

    /** Match all .test.ts(x) and .spec.ts(x) files */
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next'],

    /** V8 code-coverage settings — mirrors previous Jest thresholds */
    coverage: {
      provider: 'v8',
      include: ['modules/**/*.{ts,tsx}', 'shared/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/styled.tsx',
        '**/index.ts',
        '**/node_modules/**',
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
  resolve: {
    alias: {
      /** Mirrors tsconfig paths: "@/*" → project root */
      '@': path.resolve(__dirname, '.'),
    },
  },
})
