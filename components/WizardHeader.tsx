"use client";

export type SavedBookingOption = {
  id: string;
  name: string;
};

type WizardHeaderProps = {
  resetAll: () => void;
};

export default function WizardHeader({
  resetAll,
}: WizardHeaderProps) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          Hotel Booking Wizard
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Configure your trip in three simple steps.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={resetAll}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Reset all data
        </button>
      </div>
    </header>
  );
}