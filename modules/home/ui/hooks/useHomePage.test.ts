import { act, renderHook } from "@testing-library/react";

import * as sharedHooks from "@/shared/hooks";

import { useHomePage } from "./useHomePage";

// Mock next/navigation router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock the shared hooks to isolate useHomePage testing
jest.mock("@/app/shared/hooks", () => ({
  useTheme: jest.fn(() => ({
    mode: "system",
    resolvedTheme: "dark",
    setThemeMode: jest.fn(),
  })),
  useLocale: jest.fn(() => ({
    locale: "en",
    setLocale: jest.fn(),
    t: jest.fn((key: string) => `mockT_${key}`),
  })),
}));

describe("useHomePage hook", () => {
  it("should expose resolvedTheme and locale from shared hooks", () => {
    const { result } = renderHook(() => useHomePage());

    expect(result.current).toHaveProperty("resolvedTheme", "dark");
    expect(result.current).toHaveProperty("locale", "en");
    expect(typeof result.current.toggleTheme).toBe("function");
    expect(typeof result.current.setLocale).toBe("function");
  });

  it("should provide localized translation function t", () => {
    const { result } = renderHook(() => useHomePage());
    expect(result.current.t("hello")).toBe("mockT_hello");
  });

  it("should provide modeCards array from usecases", () => {
    const { result } = renderHook(() => useHomePage());
    expect(Array.isArray(result.current.modeCards)).toBe(true);
    expect(result.current.modeCards.length).toBeGreaterThan(0);
  });

  it("should provide featureHighlights array from usecases", () => {
    const { result } = renderHook(() => useHomePage());
    expect(Array.isArray(result.current.featureHighlights)).toBe(true);
    expect(result.current.featureHighlights.length).toBeGreaterThan(0);
  });

  it("should expose handleSelectMode function", () => {
    const { result } = renderHook(() => useHomePage());
    expect(typeof result.current.handleSelectMode).toBe("function");
  });

  it("toggleTheme should call setThemeMode('dark') when resolvedTheme is light (system mode)", () => {
    const mockSetThemeMode = jest.fn();
    jest.spyOn(sharedHooks, "useTheme").mockImplementationOnce(() => ({
      mode: "system",
      resolvedTheme: "light",
      setThemeMode: mockSetThemeMode,
    }));

    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith("dark");
  });

  it("toggleTheme should call setThemeMode('light') when resolvedTheme is dark (system mode)", () => {
    const mockSetThemeMode = jest.fn();
    jest.spyOn(sharedHooks, "useTheme").mockImplementationOnce(() => ({
      mode: "system",
      resolvedTheme: "dark",
      setThemeMode: mockSetThemeMode,
    }));

    const { result } = renderHook(() => useHomePage());
    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith("light");
  });
});
