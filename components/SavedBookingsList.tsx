"use client";

type SavedBooking = {
  id: string;
  name: string;
  createdAt: string;
};

type SavedBookingsListProps = {
  savedBookings: SavedBooking[];
  onSave: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function SavedBookingsList({
  savedBookings,
  onSave,
  onLoad,
  onDelete,
}: SavedBookingsListProps) {
  return (
    <section className="mt-6 w-full rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Saved bookings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Save your current configuration and reload it later.
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          Save current
        </button>
      </div>

      {savedBookings.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No saved bookings yet. Configure the wizard and click{" "}
          <span className="font-semibold">Save current</span>.
        </p>
      ) : (
        <ul className="space-y-2">
          {savedBookings.map((booking) => (
            <li
              key={booking.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/80"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {booking.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {new Date(booking.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onLoad(booking.id)}
                  className="rounded-md border border-indigo-500 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-200 dark:hover:bg-indigo-950/40"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(booking.id)}
                  className="rounded-md border border-rose-400 px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-500 dark:text-rose-200 dark:hover:bg-rose-950/40"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
