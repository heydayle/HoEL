import { vi, type Mock } from 'vitest'
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from './server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}));

describe('Supabase Server - createClient', () => {
  const originalEnv = process.env;
  let mockCookies: any;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'test-key',
    };

    mockCookies = {
      getAll: vi.fn().mockReturnValue([{ name: 'test-cookie', value: 'test-val' }]),
      set: vi.fn(),
    };

    (cookies as Mock).mockResolvedValue(mockCookies);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should call createServerClient with environment variables and options', async () => {
    await createClient();

    expect(createServerClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-key',
      expect.objectContaining({
        cookies: expect.any(Object)
      })
    );
  });

  it('should forward getAll call to cookieStore', async () => {
    await createClient();
    
    // get the cookies option that was passed
    const options = (createServerClient as Mock).mock.calls[0][2];
    const retrievedCookies = options.cookies.getAll();
    
    expect(mockCookies.getAll).toHaveBeenCalled();
    expect(retrievedCookies).toEqual([{ name: 'test-cookie', value: 'test-val' }]);
  });

  it('should forward setAll calls to cookieStore.set', async () => {
    await createClient();
    
    const options = (createServerClient as Mock).mock.calls[0][2];
    options.cookies.setAll([
      { name: 'cookie1', value: 'val1', options: { secure: true } },
      { name: 'cookie2', value: 'val2', options: { httpOnly: true } }
    ]);
    
    expect(mockCookies.set).toHaveBeenCalledTimes(2);
    expect(mockCookies.set).toHaveBeenCalledWith('cookie1', 'val1', { secure: true });
    expect(mockCookies.set).toHaveBeenCalledWith('cookie2', 'val2', { httpOnly: true });
  });

  it('should ignore errors in setAll if called from a server component context', async () => {
    mockCookies.set.mockImplementation(() => {
      throw new Error('Server component context does not allow setting cookies');
    });

    await createClient();
    const options = (createServerClient as Mock).mock.calls[0][2];
    
    // should not throw
    expect(() => {
      options.cookies.setAll([{ name: 'cookie1', value: 'val1', options: { secure: true } }]);
    }).not.toThrow();
  });
});
