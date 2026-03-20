import { render, screen } from '@testing-library/react';
import HeroSection from './HeroSection';

describe('HeroSection component', () => {
  const defaultProps = {
    greeting: 'Welcome Test Greeting',
    subtitle: 'This is a test subtitle',
    ctaStart: 'Start Here',
    ctaExplore: 'Explore Now',
  };

  it('should render all text properties passed to it', () => {
    render(<HeroSection {...defaultProps} />);

    expect(screen.getByText('Welcome Test Greeting')).toBeInTheDocument();
    expect(screen.getByText('This is a test subtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start here/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore now/i })).toBeInTheDocument();
  });

  it('should render the badge text', () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText('Learn English Through History')).toBeInTheDocument();
  });
  
  it('should have background styling elements hidden from screen readers', () => {
    const { container } = render(<HeroSection {...defaultProps} />);
    
    // Elements with aria-hidden="true"
    const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
    // Glow overlay + 2 orbs = 3 elements
    expect(hiddenElements.length).toBe(3);
  });
});
