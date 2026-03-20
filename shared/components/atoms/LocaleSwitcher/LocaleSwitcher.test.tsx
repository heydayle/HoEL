import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocaleSwitcher from './LocaleSwitcher';

// Mock matchMedia and ResizeObserver and PointerEvent since Radix Select uses them
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  if (!global.PointerEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required to mock PointerEvent for Radix UI
    (global.PointerEvent as any) = class PointerEvent extends MouseEvent {
      pointerId: number;
      pointerType: string;
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId || 0;
        this.pointerType = params.pointerType || '';
      }
    };
  }
});

describe('LocaleSwitcher atom', () => {
  it('should render the select component', () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="en" onLocaleChange={handleLocaleChange} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should call onLocaleChange when an option is selected', async () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="en" onLocaleChange={handleLocaleChange} />);
    
    const trigger = screen.getByRole('combobox');
    
    // Open dropdown
    await userEvent.click(trigger);
    
    // Select Vietnamese
    const viOption = await screen.findByRole('option', { name: /tiếng việt/i });
    expect(viOption).toBeInTheDocument();
    
    await userEvent.click(viOption);
    expect(handleLocaleChange).toHaveBeenCalledWith('vi');

    // Select English
    // Open dropdown again because it closes after selection
    await userEvent.click(trigger);
    const enOption = await screen.findByRole('option', { name: /english/i });
    await userEvent.click(enOption);
    expect(handleLocaleChange).toHaveBeenCalledWith('en');
  });
});
