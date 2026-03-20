import { render, screen } from '@testing-library/react';
import FeatureGrid from './FeatureGrid';
import type { IFeatureCard } from '@/modules/home/core/models';

describe('FeatureGrid component', () => {
  const mockFeatures: IFeatureCard[] = [
    {
      id: 'f1',
      titleKey: 'feature_1_title',
      descriptionKey: 'feature_1_desc',
      icon: '📚',
      accentColor: 'accent-primary',
    },
    {
      id: 'f2',
      titleKey: 'feature_2_title',
      descriptionKey: 'feature_2_desc',
      icon: '🏛️',
      accentColor: 'unknown-accent', // tests fallback
    },
  ];

  const mockT = jest.fn((key: string) => `Translated_${key}`);

  const defaultProps = {
    features: mockFeatures,
    t: mockT,
    sectionTitle: 'Section Title',
    sectionSubtitle: 'Section Subtitle',
  };

  it('should render section title and subtitle', () => {
    render(<FeatureGrid {...defaultProps} />);
    
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Section Subtitle')).toBeInTheDocument();
  });

  it('should render all features correctly with translations', () => {
    render(<FeatureGrid {...defaultProps} />);

    expect(screen.getByText('Translated_feature_1_title')).toBeInTheDocument();
    expect(screen.getByText('Translated_feature_1_desc')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();

    expect(screen.getByText('Translated_feature_2_title')).toBeInTheDocument();
    expect(screen.getByText('Translated_feature_2_desc')).toBeInTheDocument();
    expect(screen.getByText('🏛️')).toBeInTheDocument();
  });

  it('should render falling back colors correctly if invalid accent is provided', () => {
    render(<FeatureGrid {...defaultProps} />);
    
    // Check elements for fallback classes ("bg-accent-primary-light") if not found in map
    const feature2Heading = screen.getByText('Translated_feature_2_title');
    expect(feature2Heading).toHaveClass('text-accent-primary');
  });

  it('should render correct class for other accent colors', () => {
    const extraProps = {
      ...defaultProps,
      features: [
        { id: 'sec', titleKey: 'sec', descriptionKey: 'sec_desc', icon: '', accentColor: 'accent-secondary' },
        { id: 'warm', titleKey: 'warm', descriptionKey: 'warm_desc', icon: '', accentColor: 'accent-warm' },
        { id: 'gold', titleKey: 'gold', descriptionKey: 'gold_desc', icon: '', accentColor: 'accent-gold' }
      ]
    };
    render(<FeatureGrid {...extraProps} />);
    expect(screen.getByText('Translated_sec')).toHaveClass('text-accent-secondary');
    expect(screen.getByText('Translated_warm')).toHaveClass('text-accent-warm');
    expect(screen.getByText('Translated_gold')).toHaveClass('text-accent-gold');
  });
});
