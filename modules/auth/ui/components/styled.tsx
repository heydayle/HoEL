import styled from 'styled-components';

import { Card } from '@/shared/components/Styled';

/**
 * No custom components needed here yet.
 * Reserved for auth sub-components (e.g., social login buttons).
 */

/**
 * A styled container for future social login buttons or similar auth sub-components.
 */
export const SocialAuthContainer = styled(Card)`
  padding: 1rem;
  text-align: center;
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: calc(var(--radius) * 1.2);
`;
