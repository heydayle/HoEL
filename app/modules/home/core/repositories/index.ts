import type { IFeatureCard, ILearningStat } from "../models";

/**
 * Repository interface defining the contract for fetching Home page data.
 */
export interface IHomeRepository {
  /**
   * Retrieves the list of feature cards for the home page.
   * @returns A promise resolving to an array of feature cards
   */
  getFeatures: () => Promise<IFeatureCard[]>;

  /**
   * Retrieves the list of learning statistics for the home page.
   * @returns A promise resolving to an array of learning stats
   */
  getStats: () => Promise<ILearningStat[]>;
}
