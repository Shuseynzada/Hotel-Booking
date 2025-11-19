"use client";

import { useMemo, useState } from "react";

export type InitialConfigErrors = {
  citizenship?: string;
  startDate?: string;
  daysCount?: string;
  destination?: string;
  boardType?: string;
};

type UseInitialStepValidationParams = {
  step: number;
  citizenship: string;
  destination: string;
  boardType: string;
  startDate: string;
  daysCount: number;
  isStartDateValid: boolean;
  goNext: () => void;
};

export function useInitialStepValidation({
  step,
  citizenship,
  destination,
  boardType,
  startDate,
  daysCount,
  isStartDateValid,
  goNext,
}: UseInitialStepValidationParams) {
  const [showErrors, setShowErrors] = useState(false);

  const errors: InitialConfigErrors = useMemo(
    () => ({
      citizenship: !citizenship ? "Please select your citizenship." : undefined,
      startDate: !startDate
        ? "Please choose a start date."
        : !isStartDateValid
          ? "Start date cannot be in the past."
          : undefined,
      daysCount:
        !daysCount || daysCount <= 0
          ? "Number of days must be at least 1."
          : undefined,
      destination: !destination
        ? "Please choose a destination country."
        : undefined,
      boardType: !boardType ? "Please choose a board type." : undefined,
    }),
    [citizenship, destination, boardType, startDate, daysCount]
  );

  const isValid = useMemo(
    () => !Object.values(errors).some(Boolean),
    [errors]
  );

  const missingLabels = useMemo(() => {
    const labels: string[] = [];
    if (errors.citizenship) labels.push("citizenship");
    if (errors.startDate) labels.push("start date");
    if (errors.daysCount) labels.push("number of days");
    if (errors.destination) labels.push("destination");
    if (errors.boardType) labels.push("board type");
    return labels;
  }, [errors]);

  const nextTooltipText =
    !isValid && missingLabels.length
      ? `Please fill: ${missingLabels.join(", ")}.`
      : undefined;

  const handleNext = () => {
    if (step === 1 && !isValid) {
      setShowErrors(true);
      return;
    }
    goNext();
  };

  return {
    errors,
    isValid,
    showErrors,
    nextTooltipText,
    handleNext,
  };
}
