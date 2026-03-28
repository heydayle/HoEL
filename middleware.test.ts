import { NextRequest } from 'next/server';
import { middleware } from './middleware';
import { updateSession } from './shared/utils/supabase/middleware';

jest.mock('./shared/utils/supabase/middleware', () => ({
  updateSession: jest.fn().mockResolvedValue('mock-response'),
}));

describe('Root Middleware', () => {
  it('calls updateSession with the request', async () => {
    const mockRequest = {} as NextRequest;
    const response = await middleware(mockRequest);
    expect(updateSession).toHaveBeenCalledWith(mockRequest);
    expect(response).toBe('mock-response');
  });
});
