"use client";

import { ReactNode } from "react";

type StepCardProps = {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  disableBack?: boolean;
  disableNext?: boolean;
  nextTooltip?: string;
  isLoading: boolean;
};

export default function StepCard({
  currentStep,
  totalSteps,
  title,
  subtitle,
  children,
  onNext,
  onBack,
  disableBack = false,
  disableNext = false,
  nextTooltip,
  isLoading,
}: StepCardProps) {
  const showBack = Boolean(onBack);
  const showNext = Boolean(onNext);

  console.log(isLoading)

  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm flex flex-col gap-6 px-5 py-6 sm:px-7 sm:py-7 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-900/40 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-500" />
        </div>
      )}

      {/* Header: top dots + step label */}
      <div className="flex flex-col items-center gap-1">
        <Dots currentStep={currentStep} totalSteps={totalSteps} />
        <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Title / Subtitle */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Main content */}
      <div className="w-full">{children}</div>

      {/* Bottom: navigation + dots */}
      <div className="mt-2 flex flex-col gap-4">
        {/* Navigation */}
        <div className="flex w-full items-center justify-between gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={disableBack}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-transparent px-3 py-2 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {showNext && (
            <div className="relative group">
              <button
                type="button"
                onClick={onNext}
                disabled={disableNext}
                className="inline-flex items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-xs sm:text-sm font-medium text-white shadow transition-colors hover:bg-indigo-400 disabled:opacity-40 disabled:hover:bg-indigo-500"
              >
                Next
              </button>

              {disableNext && nextTooltip && (
                <div className="pointer-events-none absolute right-0 top-full mt-2 w-64 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 shadow-sm opacity-0 group-hover:opacity-100">
                  {nextTooltip}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center">
          <Dots currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </div>
    </div>
  );
}

function Dots(props: { currentStep: number; totalSteps: number }) {
  const { currentStep, totalSteps } = props;
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {steps.map((step) => {
        const isActive = step === currentStep;
        return (
          <div
            key={step}
            className={
              "flex items-center justify-center rounded-full border transition-all " +
              (isActive
                ? "h-3.5 w-3.5 border-indigo-400 bg-indigo-500 shadow-[0_0_0_3px_rgba(79,70,229,0.35)]"
                : "h-2.5 w-2.5 border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700")
            }
          />
        );
      })}
    </div>
  );
}
