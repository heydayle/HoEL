import { vi, type Mock } from 'vitest'
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from './middleware';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('next/server', () => {
  return {
    NextResponse: {
      next: vi.fn(),
      redirect: vi.fn(),
    },
  };
});

describe('Supabase Middleware - updateSession', () => {
  const originalEnv = process.env;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to bypass NextRequest typing for mock objects
  let mockRequest: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for mocked Supabase client with overloaded types
  let mockSupabase: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to bypass NextResponse typing for mock objects
  let mockResponse: any;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: 'test-key',
    };

    mockRequest = {
      cookies: {
        getAll: vi.fn().mockReturnValue([{ name: 'req-cookie', value: 'req-val' }]),
        set: vi.fn(),
      },
      nextUrl: {
        pathname: '/test-route',
        clone: vi.fn().mockReturnThis(),
      },
      url: 'http://localhost/test-route',
    } as unknown as NextRequest;

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test' } } }),
      },
    };

    (createServerClient as Mock).mockReturnValue(mockSupabase);

    mockResponse = {
      cookies: {
        set: vi.fn(),
      },
    } as unknown as NextResponse;

    (NextResponse.next as Mock).mockReturnValue(mockResponse);
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('initializes supabase client and updates cookies correctly', async () => {
    const response = await updateSession(mockRequest);
    expect(createServerClient).toHaveBeenCalled();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(response).toBe(mockResponse);
  });

  it('updates both request and response cookies when setAll is called in client options', async () => {
    await updateSession(mockRequest);
    const options = (createServerClient as Mock).mock.calls[0][2];
    
    expect(options.cookies.getAll()).toEqual([{ name: 'req-cookie', value: 'req-val' }]);

    options.cookies.setAll([{ name: 'new-cookie', value: 'new-val', options: { secure: true } }]);
    
    // Updates request cookies explicitly
    expect(mockRequest.cookies.set).toHaveBeenCalledWith('new-cookie', 'new-val');
    // Also updates response cookies explicitly through NextResponse.next again
    expect(mockResponse.cookies.set).toHaveBeenCalledWith('new-cookie', 'new-val', { secure: true });
  });
});
