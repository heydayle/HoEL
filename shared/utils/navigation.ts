/**
 * Performs a full-page navigation to the given URL.
 * Extracted as a utility so it can be mocked in jsdom test environments
 * where `window.location` is read-only.
 * @param url - The URL to navigate to
 */
export const navigateTo = (url: string): void => {
  window.location.assign(url);
};
