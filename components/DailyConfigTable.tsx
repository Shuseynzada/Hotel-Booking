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
      <>
        <h2 className="text-lg font-semibold mb-4">
          Step 2 – Daily Configuration
        </h2>
        <p className="text-sm text-slate-500">
          Complete the initial configuration to see daily options.
        </p>
      </>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Step 2 – Daily Configuration
      </h2>
      {days.length === 0 ? (
        <p className="text-sm text-slate-500">
          No days configured yet. Set a start date and number of days.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-3 py-2 font-medium">Day</th>
                  <th className="px-3 py-2 font-medium">Hotel</th>
                  <th className="px-3 py-2 font-medium">Lunch</th>
                  <th className="px-3 py-2 font-medium">Dinner</th>
                  <th className="px-3 py-2 font-medium text-right">
                    Day Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day, index) => {
                  const totals = dayTotals[index];
                  const mealsDisabled = boardType === "NB";
                  const lunchOptions = destinationMeals?.lunch ?? [];
                  const dinnerOptions = destinationMeals?.dinner ?? [];

                  return (
                    <tr
                      key={index}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-2 align-top">
                        <div className="flex flex-col">
                          <span className="font-medium">Day {index + 1}</span>
                          <span className="text-xs text-slate-500">
                            {formatDateLabel(day.date)}
                          </span>
                        </div>
                      </td>

                      <td className="px-3 py-2 align-top">
                        <select
                          value={day.hotelId ?? ""}
                          onChange={(e) => onHotelChange(index, e.target.value)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        >
                          <option value="">Select hotel</option>
                          {destinationHotels.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} (${h.price})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-2 align-top">
                        <select
                          value={day.lunchId ?? ""}
                          onChange={(e) =>
                            onLunchChange(index, e.target.value)
                          }
                          disabled={mealsDisabled}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs disabled:bg-slate-100 disabled:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        >
                          <option value="">
                            {mealsDisabled
                              ? "Not available"
                              : "Select lunch"}
                          </option>
                          {lunchOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (${m.price})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-2 align-top">
                        <select
                          value={day.dinnerId ?? ""}
                          onChange={(e) =>
                            onDinnerChange(index, e.target.value)
                          }
                          disabled={mealsDisabled}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs disabled:bg-slate-100 disabled:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                        >
                          <option value="">
                            {mealsDisabled
                              ? "Not available"
                              : "Select dinner"}
                          </option>
                          {dinnerOptions.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} (${m.price})
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-2 align-top text-right text-sm font-semibold">
                        ${totals.total.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Meal rules: Full Board = lunch &amp; dinner allowed, Half Board =
            lunch or dinner (mutually exclusive), No Board = no meals.
          </p>
        </>
      )}
    </>
  );
}
