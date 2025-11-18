"use client";

type InitialConfigFormProps = {
  citizenship: string;
  destination: string;
  boardType: string;
  startDate: string;
  daysCount: number;
  countries: readonly { id: number; name: string }[];
  boardTypes: readonly { code: string; name: string }[];
  onCitizenshipChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onBoardTypeChange: (value: any) => void;
  onStartDateChange: (value: string) => void;
  onDaysCountChange: (value: number) => void;
  isInitialConfigComplete: boolean;
};

export default function InitialConfigForm({
  citizenship,
  destination,
  boardType,
  startDate,
  daysCount,
  countries,
  boardTypes,
  onCitizenshipChange,
  onDestinationChange,
  onBoardTypeChange,
  onStartDateChange,
  onDaysCountChange,
  isInitialConfigComplete,
}: InitialConfigFormProps) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Step 1 – Initial Configuration
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Citizenship</label>
          <select
            value={citizenship}
            onChange={(e) => onCitizenshipChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">Select citizenship</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Turkey">Turkey</option>
            <option value="UAE">UAE</option>
            <option value="Italy">Italy</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Number of Days</label>
          <input
            type="number"
            min={1}
            value={daysCount}
            onChange={(e) =>
              onDaysCountChange(Math.max(1, Number(e.target.value) || 1))
            }
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Destination Country</label>
          <select
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            <option value="">Select destination</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Board Type</span>
          <div className="mt-1 flex flex-wrap gap-3">
            {boardTypes.map((b) => (
              <label
                key={b.code}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="boardType"
                  value={b.code}
                  checked={boardType === b.code}
                  onChange={() => onBoardTypeChange(b.code)}
                />
                <span>
                  {b.name}{" "}
                  {b.code === "FB"
                    ? "(Lunch & Dinner)"
                    : b.code === "HB"
                      ? "(Lunch or Dinner)"
                      : "(No meals)"}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
