import { render, screen } from '@testing-library/react';
import { HomeFooter } from './HomeFooter';

describe('HomeFooter component', () => {
  const defaultProps = {
    footerText: 'Test footer context',
    copyright: '© 2026 Test Co.',
  };

  it('should render footer text clearly', () => {
    render(<HomeFooter {...defaultProps} />);
    expect(screen.getByText('Test footer context')).toBeInTheDocument();
  });

  it('should render the copyright text', () => {
    render(<HomeFooter {...defaultProps} />);
    expect(screen.getByText('© 2026 Test Co.')).toBeInTheDocument();
  });

  it('should handle missing text gracefully avoiding errors', () => {
    const { container } = render(<HomeFooter footerText="" copyright="" />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
