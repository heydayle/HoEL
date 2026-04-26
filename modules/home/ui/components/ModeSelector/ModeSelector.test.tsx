import { vi } from 'vitest'
import { fireEvent, render, screen } from "@testing-library/react";

import type { IFeatureHighlight, IModeCard } from "@/modules/home/core/models";

import { ModeSelector } from "./ModeSelector";


/** Test data */
const MOCK_MODE_CARDS: IModeCard[] = [
  {
    id: "student",
    labelKey: "mode_student_label",
    descriptionKey: "mode_student_description",
    ctaKey: "cta_student",
    icon: "🎓",
    accentColor: "accent-primary",
    active: true,
  },
  {
    id: "teacher",
    labelKey: "mode_teacher_label",
    descriptionKey: "mode_teacher_description",
    ctaKey: "cta_teacher",
    icon: "📝",
    accentColor: "accent-secondary",
    active: true,
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
        onSelectMode={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Choose.*Your.*Mode/);
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
        onSelectMode={vi.fn()}
      />
    );


    // Both mode cards rendered
    expect(screen.getByText("mode_student_label")).toBeInTheDocument();
    expect(screen.getByText("mode_teacher_label")).toBeInTheDocument();
  });

  it("should call onSelectMode with correct mode when student card is clicked", () => {
    const mockOnSelectMode = vi.fn();
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

    const studentButton = screen.getByRole("button", { name: /mode_student_label/ });
    fireEvent.click(studentButton);
    expect(mockOnSelectMode).toHaveBeenCalledWith("student");
  });

  it("should call onSelectMode with 'teacher' when teacher card is clicked", () => {
    const mockOnSelectMode = vi.fn();
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

    const teacherButton = screen.getByRole("button", { name: /mode_teacher_label/ });
    fireEvent.click(teacherButton);
    expect(mockOnSelectMode).toHaveBeenCalledWith("teacher");
  });
});
