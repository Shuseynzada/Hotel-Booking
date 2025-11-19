"use client";

import { formatDateLabel } from "../lib/dateHelpers";
import type { DayConfig, DayTotal } from "../lib/types";

type SummaryPanelsProps = {
  citizenship: string;
  destination: string | "";
  boardType: string;
  startDate: string;
  daysCount: number;
  boardTypes: readonly { code: string; name: string }[];
  isInitialConfigComplete: boolean;
  days: DayConfig[];
  dayTotals: DayTotal[];
  destinationHotels: readonly { id: number; name: string; price: number }[];
  destinationMeals?:
  | {
    lunch: readonly { id: number; name: string; price: number }[];
    dinner: readonly { id: number; name: string; price: number }[];
  }
  | undefined;
  grandTotal: number;
};

export default function SummaryPanels({
  citizenship,
  destination,
  boardType,
  startDate,
  daysCount,
  boardTypes,
  isInitialConfigComplete,
  days,
  dayTotals,
  destinationHotels,
  destinationMeals,
  grandTotal,
}: SummaryPanelsProps) {
  const boardLabel =
    boardTypes.find((b) => b.code === boardType)?.name ?? boardType;

  return (
    <>
      {/* Trip configuration summary */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 shadow-sm lg:col-span-1 dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Trip Configuration
        </h2>

        {isInitialConfigComplete ? (
          <dl className="space-y-2 text-xs sm:text-sm">
            <Row label="Citizenship" value={citizenship || "Not set"} />
            <Row label="Destination" value={destination || "Not set"} />
            <Row
              label="Start Date"
              value={
                startDate
                  ? new Date(startDate).toLocaleDateString()
                  : "Not set"
              }
            />
            <Row
              label="Number of Days"
              value={daysCount > 0 ? String(daysCount) : "Not set"}
            />
            <Row label="Board Type" value={boardLabel} />
          </dl>
        ) : (
          <p className="form-field-helper">
            Fill in the initial configuration to see trip details here.
          </p>
        )}
      </div>

      {/* Per-day selections */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 shadow-sm lg:col-span-1 dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Daily Selections
        </h2>

        {days.length === 0 ? (
          <p className="form-field-helper">
            No days configured yet. Set a start date and number of days in Step 1.
          </p>
        ) : (
          <ul className="space-y-3 text-xs sm:text-sm">
            {days.map((day, index) => {
              const totals = dayTotals[index];
              const hotel = destinationHotels.find((h) => h.id === day.hotelId);

              const lunch =
                day.lunchId && destinationMeals
                  ? destinationMeals.lunch.find((m) => m.id === day.lunchId)
                  : undefined;

              const dinner =
                day.dinnerId && destinationMeals
                  ? destinationMeals.dinner.find((m) => m.id === day.dinnerId)
                  : undefined;

              return (
                <li
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      Day {index + 1} –{" "}
                      {formatDateLabel(day.date).replace(",", "")}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ${totals.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
                    <p>
                      <span className="font-semibold">Hotel:</span>{" "}
                      {hotel
                        ? `${hotel.name} ($${hotel.price})`
                        : "Not selected"}
                    </p>
                    <p>
                      <span className="font-semibold">Lunch:</span>{" "}
                      {boardType === "NB"
                        ? "Not available"
                        : lunch
                          ? `${lunch.name} ($${lunch.price})`
                          : "Not selected"}
                    </p>
                    <p>
                      <span className="font-semibold">Dinner:</span>{" "}
                      {boardType === "NB"
                        ? "Not available"
                        : dinner
                          ? `${dinner.name} ($${dinner.price})`
                          : "Not selected"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Total price panel */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 sm:p-5 shadow-sm lg:col-span-1 dark:border-slate-700 dark:bg-slate-900/70">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          Total Price
        </h2>

        {days.length === 0 ? (
          <p className="form-field-helper">
            Once you configure days, the total price will appear here.
          </p>
        ) : (
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Grand total for all days:
              </p>
              <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                ${grandTotal.toFixed(2)}
              </p>
            </div>

            <div className="text-[11px] mb-6 sm:text-xs text-slate-500 dark:text-slate-400">
              <p>
                Formula: Total = Σ (Hotel price + selected meal prices) for each
                day. Board rules: Full Board = lunch &amp; dinner, Half Board = lunch
                or dinner, No Board = meals disabled.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-900 dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}
