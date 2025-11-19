"use client";

import { formatDateLabel } from "../lib/dateHelpers";
import type { DayConfig, DayTotal } from "../lib/types";

type DailyConfigTableProps = {
  isInitialConfigComplete: boolean;
  days: DayConfig[];
  dayTotals: DayTotal[];
  boardType: string;
  destinationHotels: readonly { id: number; name: string; price: number }[];
  destinationMeals?:
    | {
        lunch: readonly { id: number; name: string; price: number }[];
        dinner: readonly { id: number; name: string; price: number }[];
      }
    | undefined;
  onHotelChange: (index: number, hotelId: string) => void;
  onLunchChange: (index: number, mealId: string) => void;
  onDinnerChange: (index: number, mealId: string) => void;
};

export default function DailyConfigTable({
  isInitialConfigComplete,
  days,
  dayTotals,
  boardType,
  destinationHotels,
  destinationMeals,
  onHotelChange,
  onLunchChange,
  onDinnerChange,
}: DailyConfigTableProps) {
  if (!isInitialConfigComplete) {
    return (
      <div className="w-full rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        Complete the initial configuration in Step 1 to configure daily hotels and
        meals.
      </div>
    );
  }

  if (days.length === 0) {
    return (
      <div className="w-full rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        No days configured yet. Set a start date and number of days in Step 1.
      </div>
    );
  }

  const mealsDisabled = boardType === "NB";

  return (
    <div className="w-full space-y-4">
      {/* Layout for Mobile */}
      <div className="space-y-3 md:hidden">
        {days.map((day, index) => {
          const totals = dayTotals[index];
          const lunchOptions = destinationMeals?.lunch ?? [];
          const dinnerOptions = destinationMeals?.dinner ?? [];

          return (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
            >
              <div className="mb-2 flex items-baseline justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Day {index + 1}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {formatDateLabel(day.date)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  ${totals.total.toFixed(2)}
                </p>
              </div>

              <div className="space-y-3">
                {/* Hotel */}
                <div className="flex flex-col gap-1">
                  <label className="form-field-label">Hotel</label>
                  <div className="relative">
                    <select
                      value={day.hotelId ?? ""}
                      onChange={(e) => onHotelChange(index, e.target.value)}
                      className="form-field-input px-2 py-1 text-xs appearance-none pr-7"
                    >
                      <option value="" disabled>Select hotel</option>
                      {destinationHotels.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} (${h.price})
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Lunch */}
                <div className="flex flex-col gap-1">
                  <label className="form-field-label">Lunch</label>
                  <div className="relative">
                    <select
                      value={day.lunchId ?? ""}
                      onChange={(e) => onLunchChange(index, e.target.value)}
                      disabled={mealsDisabled}
                      className="form-field-input px-2 py-1 text-xs appearance-none pr-7 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600"
                    >
                      <option value="" disabled>
                        {mealsDisabled ? "Not available" : "Select lunch"}
                      </option>
                      {lunchOptions.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (${m.price})
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Dinner */}
                <div className="flex flex-col gap-1">
                  <label className="form-field-label">Dinner</label>
                  <div className="relative">
                    <select
                      value={day.dinnerId ?? ""}
                      onChange={(e) => onDinnerChange(index, e.target.value)}
                      disabled={mealsDisabled}
                      className="form-field-input px-2 py-1 text-xs appearance-none pr-7 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600"
                    >
                      <option value="" disabled>
                        {mealsDisabled ? "Not available" : "Select dinner"}
                      </option>
                      {dinnerOptions.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (${m.price})
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                      ▼
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop layout (table) */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs sm:text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300 rounded-l-lg">
                  Day
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Hotel
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Lunch
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Dinner
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-right text-slate-600 dark:text-slate-300 rounded-r-lg">
                  Day Total
                </th>
              </tr>
            </thead>

            <tbody>
              {days.map((day, index) => {
                const totals = dayTotals[index];
                const lunchOptions = destinationMeals?.lunch ?? [];
                const dinnerOptions = destinationMeals?.dinner ?? [];

                return (
                  <tr
                    key={index}
                    className="bg-slate-50 dark:bg-slate-900/70 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Day + date */}
                    <td className="px-3 py-2 align-top rounded-l-lg">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Day {index + 1}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {formatDateLabel(day.date)}
                        </span>
                      </div>
                    </td>

                    {/* Hotel */}
                    <td className="px-3 py-2 align-top">
                      <div className="relative">
                        <select
                          value={day.hotelId ?? ""}
                          onChange={(e) => onHotelChange(index, e.target.value)}
                          className="form-field-input px-2 py-1 text-xs appearance-none pr-7"
                        >
                          <option value="" disabled>Select hotel</option>
                          {destinationHotels.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} (${h.price})
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                          ▼
                        </span>
                      </div>
                    </td>

                    {/* Lunch */}
                    <td className="px-3 py-2 align-top">
                      <div className="relative">
                        <select
                          value={day.lunchId ?? ""}
                          onChange={(e) => onLunchChange(index, e.target.value)}
                          disabled={mealsDisabled}
                          className="form-field-input px-2 py-1 text-xs appearance-none pr-7 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600"
                        >
                          <option value="" disabled>
                            {mealsDisabled ? "Not available" : "Select lunch"}
                          </option>
                          {lunchOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (${m.price})
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                          ▼
                        </span>
                      </div>
                    </td>

                    {/* Dinner */}
                    <td className="px-3 py-2 align-top">
                      <div className="relative">
                        <select
                          value={day.dinnerId ?? ""}
                          onChange={(e) => onDinnerChange(index, e.target.value)}
                          disabled={mealsDisabled}
                          className="form-field-input px-2 py-1 text-xs appearance-none pr-7 disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-600"
                        >
                          <option value="" disabled>
                            {mealsDisabled ? "Not available" : "Select dinner"}
                          </option>
                          {dinnerOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (${m.price})
                            </option>
                          ))}
                        </select>
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 dark:text-slate-500">
                          ▼
                        </span>
                      </div>
                    </td>

                    {/* Day total */}
                    <td className="px-3 py-2 align-top text-right rounded-r-lg">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        ${totals.total.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="form-field-helper">
        Meal rules: Full Board = lunch &amp; dinner allowed, Half Board = lunch or
        dinner (mutually exclusive), No Board = no meals.
      </p>
    </div>
  );
}
