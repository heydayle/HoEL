import { render, screen } from "@testing-library/react";

import type { IFeatureHighlight } from "@/modules/home/core/models";

import { FeatureHighlights } from "./FeatureHighlights";

/** Minimal styled mock */
jest.mock("../styled", () => ({
  FeaturesSection: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <section {...props}>{children}</section>
  ),
  FeaturesRow: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
  FeaturePill: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
}));

const MOCK_HIGHLIGHTS: IFeatureHighlight[] = [
  {
    id: "offline",
    titleKey: "feature_offline_title",
    descriptionKey: "feature_offline_desc",
    icon: "🔒",
  },
  {
    id: "vocab",
    titleKey: "feature_vocab_title",
    descriptionKey: "feature_vocab_desc",
    icon: "📚",
  },
];

const mockT = (key: string) => key;

describe("FeatureHighlights Component", () => {
  it("should render all highlight pills", () => {
    render(<FeatureHighlights highlights={MOCK_HIGHLIGHTS} t={mockT} />);

    expect(screen.getByText("feature_offline_title")).toBeInTheDocument();
    expect(screen.getByText("feature_vocab_title")).toBeInTheDocument();
  });

  it("should render icons for each highlight", () => {
    render(<FeatureHighlights highlights={MOCK_HIGHLIGHTS} t={mockT} />);

    expect(screen.getByText("🔒")).toBeInTheDocument();
    expect(screen.getByText("📚")).toBeInTheDocument();
  });

  it("should render empty list without errors when highlights is empty", () => {
    const { container } = render(
      <FeatureHighlights highlights={[]} t={mockT} />
    );
    expect(container).toBeInTheDocument();
  });
});
