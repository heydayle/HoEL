import { vi } from 'vitest'
import { render, screen } from "@testing-library/react";

import HomePage from "./index";


// Mock child components since we test page composition only
vi.mock("@/modules/home/ui/components", () => ({
  HomeHeader: () => <header data-testid="mock-home-header">Header</header>,
  ModeSelector: () => (
    <section data-testid="mock-mode-selector">ModeSelector</section>
  ),
  FeatureHighlights: () => (
    <section data-testid="mock-feature-highlights">FeatureHighlights</section>
  ),
  HomeFooter: () => <footer data-testid="mock-home-footer">Footer</footer>,
}));

// Mock the facade hook with new shape
vi.mock("@/modules/home/ui/hooks", () => ({
  useHomePage: vi.fn(() => ({
    resolvedTheme: "light" as const,
    toggleTheme: vi.fn(),
    locale: "en",
    setLocale: vi.fn(),
    t: (key: string) => key,
    modeCards: [],
    featureHighlights: [],
    handleSelectMode: vi.fn(),
  })),
}));

describe("HomePage Component", () => {
  it("should render all child sections composing the home module", () => {
    render(<HomePage />);

    expect(screen.getByTestId("mock-home-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-mode-selector")).toBeInTheDocument();
    expect(
      screen.getByTestId("mock-feature-highlights")
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-home-footer")).toBeInTheDocument();
  });

  it("should render a footer element in the DOM", () => {
    const { container } = render(<HomePage />);
    const footer = container.querySelector("footer");
    expect(footer).toBeInTheDocument();
  });

  it("should render a header element in the DOM", () => {
    const { container } = render(<HomePage />);
    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });
});
