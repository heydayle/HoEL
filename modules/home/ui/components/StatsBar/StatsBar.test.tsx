import { render, screen } from '@testing-library/react';
import StatsBar from './StatsBar';
import type { ILearningStat } from '@/modules/home/core/models';

describe('StatsBar component', () => {
  const mockStats: ILearningStat[] = [
    { id: 'stat1', labelKey: 'stat_1', value: '100', icon: '📝' },
    { id: 'stat2', labelKey: 'stat_2', value: '500', icon: '✅' },
  ];

  const mockT = jest.fn((key: string) => `Translated_${key}`);

  it('should render all stats correctly', () => {
    render(<StatsBar stats={mockStats} t={mockT} />);

    expect(mockT).toHaveBeenCalledWith('stat_1');
    expect(mockT).toHaveBeenCalledWith('stat_2');

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    
    expect(screen.getByText('Translated_stat_1')).toBeInTheDocument();
    expect(screen.getByText('Translated_stat_2')).toBeInTheDocument();
    
    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('should render safely with no stats', () => {
    const { container } = render(<StatsBar stats={[]} t={mockT} />);
    
    // Just verify it doesn't crash and renders the section container
    expect(container.querySelector('section#stats-bar')).toBeInTheDocument();
  });
});
