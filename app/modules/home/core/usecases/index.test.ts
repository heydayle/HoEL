import {
  getFeatureHighlights,
  getModeCards,
  getUserMode,
  HOME_FEATURE_HIGHLIGHTS,
  HOME_MODE_CARDS,
  saveUserMode,
} from "./index";

describe("Home Usecases", () => {
  describe("getModeCards", () => {
    it("should return the predefined mode cards list", () => {
      const result = getModeCards();
      expect(result).toEqual(HOME_MODE_CARDS);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include student and teacher modes", () => {
      const result = getModeCards();
      const ids = result.map((c) => c.id);
      expect(ids).toContain("student");
      expect(ids).toContain("teacher");
    });

    it("each mode card should have required fields", () => {
      const result = getModeCards();
      result.forEach((card) => {
        expect(card).toHaveProperty("id");
        expect(card).toHaveProperty("labelKey");
        expect(card).toHaveProperty("descriptionKey");
        expect(card).toHaveProperty("ctaKey");
        expect(card).toHaveProperty("icon");
        expect(card).toHaveProperty("accentColor");
      });
    });
  });

  describe("getFeatureHighlights", () => {
    it("should return the predefined feature highlights list", () => {
      const result = getFeatureHighlights();
      expect(result).toEqual(HOME_FEATURE_HIGHLIGHTS);
      expect(result.length).toBeGreaterThan(0);
    });

    it("each highlight should have required fields", () => {
      const result = getFeatureHighlights();
      result.forEach((item) => {
        expect(item).toHaveProperty("id");
        expect(item).toHaveProperty("titleKey");
        expect(item).toHaveProperty("descriptionKey");
        expect(item).toHaveProperty("icon");
      });
    });
  });

  describe("saveUserMode and getUserMode", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should save and retrieve 'student' mode", () => {
      saveUserMode("student");
      expect(getUserMode()).toBe("student");
    });

    it("should save and retrieve 'teacher' mode", () => {
      saveUserMode("teacher");
      expect(getUserMode()).toBe("teacher");
    });

    it("should return null when no mode has been saved", () => {
      expect(getUserMode()).toBeNull();
    });
  });
});
