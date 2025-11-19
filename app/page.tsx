"use client";

import WizardHeader from "@/components/WizardHeader";
import { useState } from "react";
import { countries, boardTypes } from "../data";
import InitialConfigForm from "../components/InitialConfigForm";
import DailyConfigTable from "../components/DailyConfigTable";
import SummaryPanels from "../components/SummaryPanels";
import StepCard from "../components/StepCard";
import { useHotelWizard } from "../lib/useHotelWizard";
import { useInitialStepValidation } from "../lib/useInitialStepValidation";
import type { Destination } from "../lib/types";
import SavedBookingsList from "../components/SavedBookingsList";


export default function Page() {
  const {
    // state
    step,
    citizenship,
    destination,
    boardType,
    startDate,
    daysCount,
    days,

    // derived
    destinationHotels,
    destinationMeals,
    isInitialConfigComplete,
    dayTotals,
    grandTotal,

    // navigation
    goNext,
    goBack,
    resetAll,

    // setters
    setCitizenship,
    setDestination,
    setBoardType,
    setStartDate,
    setDaysCount,

    // handlers
    handleDayHotelChange,
    handleLunchChange,
    handleDinnerChange,

    // Save/Load
    savedBookings,
    saveCurrentBooking,
    loadBooking,
    deleteBooking,
  } = useHotelWizard();

  const handleSaveBooking = () => {
    const name = window.prompt("Name this booking configuration:");
    if (!name) return;
    saveCurrentBooking(name);
  };


  const {
    errors: initialConfigErrors,
    isValid: isInitialConfigValid,
    showErrors,
    nextTooltipText,
    handleNext,
  } = useInitialStepValidation({
    step,
    citizenship,
    destination,
    boardType,
    startDate,
    daysCount,
    goNext,
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8">
        <WizardHeader
          resetAll={resetAll}
        />

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
          onNext={handleNext}
          onBack={goBack}
          disableBack={step === 1}
          disableNext={
            step === 3 || (step === 1 && showErrors && !isInitialConfigValid)
          }
          nextTooltip={
            step === 1 && showErrors ? nextTooltipText : undefined
          }
        >
          {step === 1 && (
            <InitialConfigForm
              citizenship={citizenship}
              destination={destination}
              boardType={boardType}
              startDate={startDate}
              daysCount={daysCount}
              countries={countries}
              boardTypes={boardTypes}
              onCitizenshipChange={setCitizenship}
              onDestinationChange={(val) =>
                setDestination(val as Destination | "")
              }
              onBoardTypeChange={setBoardType}
              onStartDateChange={setStartDate}
              onDaysCountChange={setDaysCount}
              errors={
                showErrors && step === 1 ? initialConfigErrors : undefined
              }
            />
          )}

          {step === 2 && (
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
          )}

          {step === 3 && (
            <div className="grid gap-6 lg:grid-cols-3">
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
            </div>
          )}
        </StepCard>

        <SavedBookingsList
          savedBookings={savedBookings}
          onSave={handleSaveBooking}
          onLoad={loadBooking}
          onDelete={deleteBooking}
        />
      </div>
    </main>
  );
}
