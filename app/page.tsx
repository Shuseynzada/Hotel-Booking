// app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { countries, hotels, boardTypes, meals } from "../data";
import InitialConfigForm from "../components/InitialConfigForm";
import DailyConfigTable from "../components/DailyConfigTable";
import SummaryPanels from "../components/SummaryPanels";
import { addDays } from "../lib/dateHelpers";
import { getHotelPrice, getMealPrice } from "../lib/pricingHelpers";
import StepCard from "../components/StepCard";

type Destination = keyof typeof hotels;
type BoardCode = (typeof boardTypes)[number]["code"];

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

export default function Page() {
  const [step, setStep] = useState(1);

  const [citizenship, setCitizenship] = useState("");
  const [destination, setDestination] = useState<Destination | "">("");
  const [boardType, setBoardType] = useState<BoardCode>("NB");
  const [startDate, setStartDate] = useState("");
  const [daysCount, setDaysCount] = useState(3);
  const [days, setDays] = useState<DayConfig[]>([]);

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const destinationHotels = useMemo(
    () => (destination ? hotels[destination] : []),
    [destination]
  );

  const destinationMeals = useMemo(
    () => (destination ? meals[destination] : undefined),
    [destination]
  );

  const isInitialConfigComplete =
    Boolean(citizenship && destination && startDate && daysCount > 0);

  useEffect(() => {
    if (!startDate || daysCount <= 0) {
      setDays([]);
      return;
    }

    setDays((prev) => {
      const next: DayConfig[] = [];

      for (let i = 0; i < daysCount; i++) {
        const dateIso = addDays(startDate, i);
        const existing = prev[i];

        next.push(
          existing
            ? { ...existing, date: dateIso }
            : { date: dateIso, hotelId: null, lunchId: null, dinnerId: null }
        );
      }

      return next;
    });
  }, [startDate, daysCount]);

  useEffect(() => {
    setDays((prev) =>
      prev.map((d) => {
        let lunchId = d.lunchId;
        let dinnerId = d.dinnerId;

        if (boardType === "NB") {
          lunchId = null;
          dinnerId = null;
        } else if (boardType === "HB" && lunchId && dinnerId) {
          dinnerId = null;
        }

        return { ...d, lunchId, dinnerId };
      })
    );
  }, [boardType]);

  const handleDayHotelChange = (index: number, hotelId: string) => {
    const id = hotelId ? Number(hotelId) : null;
    setDays((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], hotelId: id };
      return copy;
    });
  };

  const handleLunchChange = (index: number, mealId: string) => {
    const id = mealId ? Number(mealId) : null;
    setDays((prev) => {
      const copy = [...prev];
      let lunchId = id;
      let dinnerId = copy[index].dinnerId;

      if (boardType === "HB" && id !== null) {
        dinnerId = null;
      }

      copy[index] = { ...copy[index], lunchId, dinnerId };
      return copy;
    });
  };

  const handleDinnerChange = (index: number, mealId: string) => {
    const id = mealId ? Number(mealId) : null;
    setDays((prev) => {
      const copy = [...prev];
      let dinnerId = id;
      let lunchId = copy[index].lunchId;

      if (boardType === "HB" && id !== null) {
        lunchId = null;
      }

      copy[index] = { ...copy[index], lunchId, dinnerId };
      return copy;
    });
  };

  const dayTotals: DayTotal[] = useMemo(
    () =>
      days.map((day) => {
        const hotelPrice = getHotelPrice(day.hotelId, destinationHotels);
        const lunchPrice =
          boardType === "NB" ? 0 : getMealPrice(day.lunchId, "lunch");
        const dinnerPrice =
          boardType === "NB" ? 0 : getMealPrice(day.dinnerId, "dinner");
        const total = hotelPrice + lunchPrice + dinnerPrice;
        return { hotelPrice, lunchPrice, dinnerPrice, total };
      }),
    [days, boardType, destinationHotels, destinationMeals]
  );

  const grandTotal = useMemo(
    () => dayTotals.reduce((sum, d) => sum + d.total, 0),
    [dayTotals]
  );

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Hotel Booking System
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure destinations, hotels and meals with dynamic pricing.
          </p>
        </header>

        <StepCard
          currentStep={step}
          totalSteps={3}
          title={
            step === 1
              ? "Trip Setup"
              : step === 2
                ? "Day-by-Day Selection"
                : "Summary & Total"
          }
          subtitle="Fill the details and move to the next step"
          onNext={goNext}
          onBack={goBack}
          disableBack={step == 1 && !isInitialConfigComplete}
          disableNext={step === 1 && !isInitialConfigComplete}
          nextTooltip={
            step === 1 && !isInitialConfigComplete
              ? "Fill in citizenship, dates, destination and board type to continue."
              : undefined
          }

        >
          {step === 1 && <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <InitialConfigForm
              citizenship={citizenship}
              destination={destination}
              boardType={boardType}
              startDate={startDate}
              daysCount={daysCount}
              countries={countries}
              boardTypes={boardTypes}
              onCitizenshipChange={setCitizenship}
              onDestinationChange={(val) => setDestination(val as Destination)}
              onBoardTypeChange={setBoardType}
              onStartDateChange={setStartDate}
              onDaysCountChange={setDaysCount}
              isInitialConfigComplete={isInitialConfigComplete}
            />
          </section>
          }
          {step === 2 && <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <DailyConfigTable
              isInitialConfigComplete={isInitialConfigComplete}
              days={days}
              dayTotals={dayTotals}
              boardType={boardType}
              destinationHotels={destinationHotels}
              destinationMeals={destinationMeals}
              onHotelChange={handleDayHotelChange}
              onLunchChange={handleLunchChange}
              onDinnerChange={handleDinnerChange}
            />
          </section>
          }
          {step === 3 && <section className="mb-8 grid gap-6 lg:grid-cols-3">
            <SummaryPanels
              citizenship={citizenship}
              destination={destination}
              boardType={boardType}
              startDate={startDate}
              daysCount={daysCount}
              boardTypes={boardTypes}
              isInitialConfigComplete={isInitialConfigComplete}
              days={days}
              dayTotals={dayTotals}
              destinationHotels={destinationHotels}
              destinationMeals={destinationMeals}
              grandTotal={grandTotal}
            />
          </section>}
        </StepCard>
      </div>
    </main>
  );
}
