import { render, screen } from "@testing-library/react";
import StepCard from "@/components/StepCard";

describe("StepCard", () => {
  it("renders title", () => {
    render(
      <StepCard
        currentStep={1}
        totalSteps={3}
        title="Test Title"
        onNext={() => {}}
      >
        <div>Content</div>
      </StepCard>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });
});
