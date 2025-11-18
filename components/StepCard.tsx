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
};

export default function StepCard({
    currentStep,
    totalSteps,
    title,
    subtitle,
    children,
    onNext,
    onBack,
    disableBack,
    disableNext,
    nextTooltip
}: StepCardProps) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center gap-4">

            {/* --- Top Dots --- */}
            <div className="flex items-center gap-2 mt-2">
                {steps.map((step) => (
                    <div
                        key={step}
                        className={[
                            "flex h-2.5 w-2.5 items-center justify-center rounded-full border transition",
                            step === currentStep
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-300 bg-slate-100"
                        ].join(" ")}
                    />
                ))}
            </div>

            {/* Title + subtitle */}
            <div className="text-center">
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle && (
                    <p className="text-xs text-slate-500">{subtitle}</p>
                )}
            </div>

            {/* Content */}
            <div className="w-full">{children}</div>

            {/* Navigation Buttons */}
            <div className="mt-2 flex w-full justify-between">
                {onBack ? (
                    <button
                        onClick={onBack}
                        disabled={disableBack}
                        className="px-3 py-2 border rounded-md text-sm disabled:opacity-40"
                    >
                        Back
                    </button>
                ) : (
                    <div />
                )}

                {onNext && (
                    <div className="relative group">
                        <button
                            onClick={onNext}
                            disabled={disableNext}
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm disabled:opacity-40"
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

            {/* --- Bottom Dots --- */}
            <div className="mt-4 flex items-center gap-2">
                {steps.map((step) => (
                    <div
                        key={step}
                        className={[
                            "flex h-2.5 w-2.5 items-center justify-center rounded-full border transition",
                            step === currentStep
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-300 bg-slate-100"
                        ].join(" ")}
                    />
                ))}
            </div>

            {/* Step label */}
            <span className="text-xs text-slate-500 mt-1 mb-1">
                Step {currentStep} of {totalSteps}
            </span>
        </div>
    );
}
