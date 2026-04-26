import { vi } from 'vitest'
import { createBrowserClient } from '@supabase/ssr';
import { createClient } from './client';

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(),
}));

describe('Supabase Client - createClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'test-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should call createBrowserClient with environment variables', () => {
    createClient();
    expect(createBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-key'
    );
  });
});
