import { getHomeFeatures, getHomeStats, HOME_FEATURES, HOME_STATS } from './index';

describe('Home Usecases', () => {
  describe('getHomeFeatures', () => {
    it('should return the predefined home features list', () => {
      const result = getHomeFeatures();
      expect(result).toEqual(HOME_FEATURES);
      expect(result.length).toBeGreaterThan(0);
      
      // Check the structure of the first item
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('titleKey');
      expect(result[0]).toHaveProperty('descriptionKey');
      expect(result[0]).toHaveProperty('icon');
      expect(result[0]).toHaveProperty('accentColor');
    });
  });

  describe('getHomeStats', () => {
    it('should return the predefined home stats list', () => {
      const result = getHomeStats();
      expect(result).toEqual(HOME_STATS);
      expect(result.length).toBeGreaterThan(0);
      
      // Check the structure of the first item
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('labelKey');
      expect(result[0]).toHaveProperty('value');
      expect(result[0]).toHaveProperty('icon');
    });
  });
});
