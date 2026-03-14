import type { IFeatureHighlight, IModeCard, UserMode } from "../models";

/**
 * Repository interface defining the contract for the Home onboarding page data.
 */
export interface IHomeRepository {
  /**
   * Retrieves the list of user mode cards for the onboarding screen.
   * @returns A promise resolving to an array of mode cards
   */
  getModeCards: () => Promise<IModeCard[]>;

  /**
   * Retrieves the list of feature highlights for the onboarding screen.
   * @returns A promise resolving to an array of feature highlights
   */
  getFeatureHighlights: () => Promise<IFeatureHighlight[]>;

  /**
   * Persists the selected user mode to localStorage.
   * @param mode - The user mode selected by the user
   */
  saveUserMode: (mode: UserMode) => void;

  /**
   * Reads the persisted user mode from localStorage.
   * @returns The stored UserMode or null if not set
   */
  getUserMode: () => UserMode | null;
}
