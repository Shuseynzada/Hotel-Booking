"use client";

import { formatDateLabel } from "../lib/dateHelpers";

type DayConfig = {
  date: string;
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
};

type DayTotal = {
  hotelPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  total: number;
};

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
  return (
    <>
      <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">
          Step 3 – Configuration Summary
        </h2>
        {isInitialConfigComplete ? (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Citizenship</dt>
              <dd className="font-medium">{citizenship}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Destination</dt>
              <dd className="font-medium">{destination}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Start Date</dt>
              <dd className="font-medium">
                {startDate
                  ? new Date(startDate).toLocaleDateString()
                  : "Not set"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Number of Days</dt>
              <dd className="font-medium">{daysCount}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Board Type</dt>
              <dd className="font-medium">
                {
                  boardTypes.find((b) => b.code === boardType)?.name ??
                  boardType
                }
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-slate-500">
            Fill in the configuration to see a summary.
          </p>
        )}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">Daily Selections</h2>
        {days.length === 0 ? (
          <p className="text-sm text-slate-500">
            No days configured yet. Set a start date and number of days.
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {days.map((day, index) => {
              const hotel = destinationHotels.find(
                (h) => h.id === day.hotelId
              );
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
                  className="rounded-lg border border-slate-200 p-3"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      Day {index + 1} –{" "}
                      {formatDateLabel(day.date).replace(",", "")}
                    </span>
                    <span className="text-xs text-slate-500">
                      ${dayTotals[index].total.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-1 space-y-1 text-xs text-slate-600">
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

      <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-1">
        <h2 className="text-lg font-semibold mb-4">Total Price</h2>
        {days.length === 0 ? (
          <p className="text-sm text-slate-500">
            Once you configure days, total price will appear here.
          </p>
        ) : (
          <div className="flex h-full flex-col justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">
                Grand total for all days:
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                ${grandTotal.toFixed(2)}
              </p>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              <p>
                Formula: Total = Σ (Hotel Price + Selected Meal Prices) for
                each day.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
