"use client";

type InitialConfigErrors = {
  citizenship?: string;
  destination?: string;
  boardType?: string;
  startDate?: string;
  daysCount?: string;
};

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
  errors?: InitialConfigErrors;
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
  errors,
}: InitialConfigFormProps) {
  return (
    <div className="w-full space-y-6">

      {/* -------------------- ROW 1 -------------------- */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Citizenship */}
        <div className="flex flex-col gap-1">
          <label className="form-field-label">Citizenship</label>
          <div className="relative">
            <select
              value={citizenship}
              onChange={(e) => onCitizenshipChange(e.target.value)}
              className="form-field-input appearance-none pr-9"
            >
              <option value="" disabled>Select citizenship</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Turkey">Turkey</option>
              <option value="UAE">UAE</option>
              <option value="Italy">Italy</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
              ▼
            </span>
          </div>

          {errors?.citizenship && (
            <p className="form-field-helper text-amber-600">{errors.citizenship}</p>
          )}
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-1">
          <label className="form-field-label">Destination Country</label>
          <div className="relative">
            <select
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="form-field-input appearance-none pr-9"
            >
              <option value="" disabled>Select destination</option>
              {countries.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
              ▼
            </span>
          </div>

          {errors?.destination && (
            <p className="form-field-helper text-amber-600">{errors.destination}</p>
          )}
        </div>
      </div>

      {/* -------------------- ROW 2 -------------------- */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <label className="form-field-label">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="form-field-input cursor-pointer"
            min={new Date().toISOString().slice(0, 10)}
            onKeyDown={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
          />
          {errors?.startDate && (
            <p className="form-field-helper text-amber-600">{errors.startDate}</p>
          )}
        </div>

        {/* Number of Days */}
        <div className="flex flex-col gap-1">
          <label className="form-field-label">Number of Days</label>

          <div className="relative">
            <input
              type="number"
              min={1}
              value={daysCount}
              onChange={(e) =>
                onDaysCountChange(Math.max(1, Number(e.target.value) || 1))
              }
              className="form-number-input form-field-input pr-12"
            />

            <div className="absolute inset-y-0 right-2 flex flex-col items-center justify-center space-y-1">
              <button
                type="button"
                className="text-xs text-slate-600 dark:text-slate-300 hover:text-black"
                onClick={() => onDaysCountChange(daysCount + 1)}
              >
                ▲
              </button>
              <button
                type="button"
                className="text-xs text-slate-600 dark:text-slate-300 hover:text-black"
                onClick={() => onDaysCountChange(Math.max(1, daysCount - 1))}
              >
                ▼
              </button>
            </div>
          </div>

          {errors?.daysCount && (
            <p className="form-field-helper text-amber-600">{errors.daysCount}</p>
          )}
        </div>
      </div>

      {/* -------------------- ROW 3 (FULL WIDTH) -------------------- */}
      <div className="flex flex-col gap-2">
        <label className="form-field-label">Board Type</label>

        <div className="form-radio-group">
          {boardTypes.map((b) => (
            <label key={b.code} className="form-radio-label">
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

        {errors?.boardType && (
          <p className="form-field-helper text-amber-600">{errors.boardType}</p>
        )}
      </div>
    </div>
  );
}
