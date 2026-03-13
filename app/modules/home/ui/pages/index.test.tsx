import { render, screen } from '@testing-library/react';
import HomePage from './index';

// We mock the child components since we are testing page composition
jest.mock('@/app/modules/home/ui/components', () => ({
  HomeHeader: () => <header data-testid="mock-home-header">Header</header>,
  HeroSection: () => <section data-testid="mock-hero-section">Hero</section>,
  StatsBar: () => <section data-testid="mock-stats-bar">Stats</section>,
  FeatureGrid: () => <section data-testid="mock-feature-grid">Features</section>,
  HomeFooter: () => <footer data-testid="mock-home-footer">Footer</footer>,
}));

// Mock the facade hook to provide static predictably logic
jest.mock('@/app/modules/home/ui/hooks', () => ({
  useHomePage: jest.fn(() => ({
    resolvedTheme: 'light',
    toggleTheme: jest.fn(),
    locale: 'en',
    setLocale: jest.fn(),
    t: (key: string) => key,
    features: [],
    stats: [],
  })),
}));

describe('HomePage Component', () => {
  it('should render all child sections composing the home module', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('mock-home-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('mock-stats-bar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-feature-grid')).toBeInTheDocument();
    expect(screen.getByTestId('mock-home-footer')).toBeInTheDocument();
  });
  
  it('should wrap everything in a main div struct with proper layout classes', () => {
    const { container } = render(<HomePage />);
    // Check main container
    const outerDiv = container.firstChild as HTMLDivElement;
    expect(outerDiv).toHaveClass('flex', 'min-h-screen', 'flex-col', 'bg-background');
    
    // Main element exists
    const mainElement = container.querySelector('main');
    expect(mainElement).toHaveClass('flex', 'flex-1', 'flex-col');
  });
});
