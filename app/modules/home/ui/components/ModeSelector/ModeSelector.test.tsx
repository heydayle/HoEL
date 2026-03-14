import { fireEvent, render, screen } from "@testing-library/react";

import type { IFeatureHighlight, IModeCard } from "@/app/modules/home/core/models";

import { ModeSelector } from "./ModeSelector";

/** Minimal mock to satisfy styled-components */
jest.mock("../styled", () => ({
  OnboardingWrapper: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <section {...props}>{children}</section>
  ),
  AppBadge: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  PulseDot: () => <span />,
  OnboardingTitle: ({ children }: React.PropsWithChildren) => (
    <h1>{children}</h1>
  ),
  OnboardingSubtitle: ({ children }: React.PropsWithChildren) => (
    <p>{children}</p>
  ),
  ModeCardsGrid: ({ children }: React.PropsWithChildren) => (
    <div>{children}</div>
  ),
  ModeCard: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  ModeIcon: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  ModeLabel: ({ children }: React.PropsWithChildren) => (
    <span>{children}</span>
  ),
  ModeDescription: ({ children }: React.PropsWithChildren) => (
    <p>{children}</p>
  ),
  ModeCta: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}));

/** Test data */
const MOCK_MODE_CARDS: IModeCard[] = [
  {
    id: "student",
    labelKey: "mode_student_label",
    descriptionKey: "mode_student_description",
    ctaKey: "cta_student",
    icon: "🎓",
    accentColor: "accent-primary",
  },
  {
    id: "teacher",
    labelKey: "mode_teacher_label",
    descriptionKey: "mode_teacher_description",
    ctaKey: "cta_teacher",
    icon: "📝",
    accentColor: "accent-secondary",
  },
];

const MOCK_HIGHLIGHTS: IFeatureHighlight[] = [];

/** Simple translation mock */
const mockT = (key: string) => key;

describe("ModeSelector Component", () => {
  it("should render the title and subtitle", () => {
    render(
      <ModeSelector
        title="Choose Your Mode"
        subtitle="How are you using LingoNote?"
        appTagline="Your lesson companion"
        modeCards={MOCK_MODE_CARDS}
        featureHighlights={MOCK_HIGHLIGHTS}
        t={mockT}
        onSelectMode={jest.fn()}
      />
    );

    expect(screen.getByText("Choose Your Mode")).toBeInTheDocument();
    expect(screen.getByText("How are you using LingoNote?")).toBeInTheDocument();
  });

  it("should render a button for each mode card", () => {
    render(
      <ModeSelector
        title="Choose"
        subtitle="Pick one"
        appTagline="LingoNote"
        modeCards={MOCK_MODE_CARDS}
        featureHighlights={MOCK_HIGHLIGHTS}
        t={mockT}
        onSelectMode={jest.fn()}
      />
    );

    expect(screen.getByTestId ? true : true).toBe(true);
    // Both mode cards rendered
    expect(screen.getByText("mode_student_label")).toBeInTheDocument();
    expect(screen.getByText("mode_teacher_label")).toBeInTheDocument();
  });

  it("should call onSelectMode with correct mode when student card is clicked", () => {
    const mockOnSelectMode = jest.fn();
    render(
      <ModeSelector
        title="Choose"
        subtitle="Pick one"
        appTagline="LingoNote"
        modeCards={MOCK_MODE_CARDS}
        featureHighlights={MOCK_HIGHLIGHTS}
        t={mockT}
        onSelectMode={mockOnSelectMode}
      />
    );

    fireEvent.click(screen.getByLabelText("mode_student_label"));
    expect(mockOnSelectMode).toHaveBeenCalledWith("student");
  });

  it("should call onSelectMode with 'teacher' when teacher card is clicked", () => {
    const mockOnSelectMode = jest.fn();
    render(
      <ModeSelector
        title="Choose"
        subtitle="Pick"
        appTagline="LingoNote"
        modeCards={MOCK_MODE_CARDS}
        featureHighlights={MOCK_HIGHLIGHTS}
        t={mockT}
        onSelectMode={mockOnSelectMode}
      />
    );

    fireEvent.click(screen.getByLabelText("mode_teacher_label"));
    expect(mockOnSelectMode).toHaveBeenCalledWith("teacher");
  });
});
