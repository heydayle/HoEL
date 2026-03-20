'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/Styled';
import type { Locale } from '@/shared/types';
import styled from 'styled-components';

const SelectContainer = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Props for the LocaleSwitcher atom component.
 */
interface ILocaleSwitcherProps {
  /** The currently active locale */
  locale: Locale;
  /** Callback to change the locale */
  onLocaleChange: (locale: Locale) => void;
}

/**
 * Locale switcher atom that toggles between English and Vietnamese.
 * Displays language options in a dropdown.
 * @param props - LocaleSwitcher props including locale and change callback
 * @returns The rendered LocaleSwitcher element
 */
export default function LocaleSwitcher({
  locale,
  onLocaleChange,
}: ILocaleSwitcherProps): React.JSX.Element {
  return (
    <SelectContainer id="locale-switcher">
      <Select
        value={locale}
        onValueChange={(value) => {
          onLocaleChange(value as Locale);
        }}
      >
        <SelectTrigger className="flex border-surface-border bg-surface-hover text-foreground-secondary px-3!">
          <SelectValue placeholder="Language" className="">
            {locale === 'en' ? 'English' : 'Tiếng Việt'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="border-surface-border p-2!">
          <SelectItem value="en" className="cursor-pointer p-2!">
            English
          </SelectItem>
          <SelectItem value="vi" className="cursor-pointer p-2!">
            Tiếng Việt
          </SelectItem>
        </SelectContent>
      </Select>
    </SelectContainer>
  );
}
