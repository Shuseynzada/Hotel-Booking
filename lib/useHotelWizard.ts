"use client";

import { useCallback, useEffect, useMemo } from "react";
import { hotels, meals } from "../data";
import { useLocalStorage } from "./useLocalStorage";
import { addDays, isTodayOrFuture } from "./dateHelpers";
import { getHotelPrice, getMealPrice } from "./pricingHelpers";
import type { BoardCode, Destination, DayConfig, DayTotal } from "./types";

type WizardState = {
    step: number;
    citizenship: string;
    destination: Destination | "";
    boardType: BoardCode;
    startDate: string;
    daysCount: number;
    days: DayConfig[];
};

const DEFAULT_WIZARD_STATE: WizardState = {
    step: 1,
    citizenship: "",
    destination: "",
    boardType: "NB",
    startDate: "",
    daysCount: 3,
    days: [],
};

const STORAGE_KEY = "hotelWizardState";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type SavedBooking = {
    id: string;
    name: string;
    createdAt: string;
    state: WizardState;
};

const SAVED_BOOKINGS_KEY = "hotelWizardSavedBookings";



export function useHotelWizard() {
    const [state, setState] = useLocalStorage<WizardState>(
        STORAGE_KEY,
        DEFAULT_WIZARD_STATE,
        ONE_DAY_MS
    );

    const [savedBookings, setSavedBookings] = useLocalStorage<
        SavedBooking[]
    >(SAVED_BOOKINGS_KEY, [], ONE_DAY_MS * 7);

    const {
        step,
        citizenship,
        destination,
        boardType,
        startDate,
        daysCount,
        days,
    } = state;

    const isStartDateValid = useMemo(
        () => isTodayOrFuture(startDate),
        [startDate]
    );


    const updateState = useCallback(
        (patch: Partial<WizardState>) => {
            setState((prev: any) => {
                const nextStepRaw = patch.step ?? prev.step;
                const nextStep = Math.min(3, Math.max(1, nextStepRaw));

                return {
                    ...prev,
                    ...patch,
                    step: nextStep,
                };
            });
        },
        [setState]
    );

    const goNext = useCallback(
        () => updateState({ step: step + 1 }),
        [step, updateState]
    );

    const goBack = useCallback(
        () => updateState({ step: step - 1 }),
        [step, updateState]
    );

    const resetAll = useCallback(() => {
        setState(DEFAULT_WIZARD_STATE);
        if (typeof window !== "undefined") {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, [setState]);

    const destinationHotels = useMemo(
        () => (destination ? hotels[destination] : []),
        [destination]
    );

    const destinationMeals = useMemo(
        () => (destination ? meals[destination] : undefined),
        [destination]
    );

    const isInitialConfigComplete = useMemo(
        () => Boolean(citizenship && destination && isStartDateValid && daysCount > 0),
        [citizenship, destination, isStartDateValid, daysCount]
    );

    // Sync days[] when startDate or daysCount change
    useEffect(() => {
        setState((prev: any) => {
            if (!prev.startDate || prev.daysCount <= 0) {
                return { ...prev, days: [] };
            }

            const nextDays: DayConfig[] = [];

            for (let i = 0; i < prev.daysCount; i++) {
                const dateIso = addDays(prev.startDate, i);
                const existing = prev.days[i];

                nextDays.push(
                    existing
                        ? { ...existing, date: dateIso }
                        : { date: dateIso, hotelId: null, lunchId: null, dinnerId: null }
                );
            }

            return { ...prev, days: nextDays };
        });
    }, [setState, startDate, daysCount]);

    // Enforce boardType rules (NB/HB/FB)
    useEffect(() => {
        setState((prev: any) => {
            const nextDays = prev.days.map((d: any) => {
                let lunchId = d.lunchId;
                let dinnerId = d.dinnerId;

                if (prev.boardType === "NB") {
                    lunchId = null;
                    dinnerId = null;
                } else if (prev.boardType === "HB" && lunchId && dinnerId) {
                    dinnerId = null;
                }

                return { ...d, lunchId, dinnerId };
            });

            return { ...prev, days: nextDays };
        });
    }, [setState, boardType]);

    const handleDayHotelChange = useCallback(
        (index: number, hotelId: string) => {
            const id = hotelId ? Number(hotelId) : null;
            setState((prev: any) => {
                const copy = [...prev.days];
                copy[index] = { ...copy[index], hotelId: id };
                return { ...prev, days: copy };
            });
        },
        [setState]
    );

    const handleLunchChange = useCallback(
        (index: number, mealId: string) => {
            const id = mealId ? Number(mealId) : null;
            setState((prev: any) => {
                const copy = [...prev.days];
                let lunchId = id;
                let dinnerId = copy[index].dinnerId;

                if (prev.boardType === "HB" && id !== null) {
                    dinnerId = null;
                }

                copy[index] = { ...copy[index], lunchId, dinnerId };
                return { ...prev, days: copy };
            });
        },
        [setState]
    );

    const handleDinnerChange = useCallback(
        (index: number, mealId: string) => {
            const id = mealId ? Number(mealId) : null;
            setState((prev: any) => {
                const copy = [...prev.days];
                let dinnerId = id;
                let lunchId = copy[index].lunchId;

                if (prev.boardType === "HB" && id !== null) {
                    lunchId = null;
                }

                copy[index] = { ...copy[index], lunchId, dinnerId };
                return { ...prev, days: copy };
            });
        },
        [setState]
    );

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


    // Save functions
    const saveCurrentBooking = (name: string) => {
        if (!name.trim()) return;

        const newItem: SavedBooking = {
            id: crypto.randomUUID(),
            name: name.trim(),
            createdAt: new Date().toISOString(),
            state,
        };

        setSavedBookings((prev) => [...prev, newItem]);
    };

    const loadBooking = (id: string) => {
        const found = savedBookings.find((s) => s.id === id);
        if (!found) return;
        setState(found.state);
    };

    const deleteBooking = (id: string) => {
        setSavedBookings((prev) => prev.filter((s) => s.id !== id));
    };
    

    return {
        // state
        step,
        citizenship,
        destination,
        boardType,
        startDate,
        daysCount,
        days,

        // derived data
        destinationHotels,
        destinationMeals,
        isInitialConfigComplete,
        isStartDateValid,
        dayTotals,
        grandTotal,

        // navigation
        goNext,
        goBack,
        resetAll,

        // setters (for Step 1)
        setCitizenship: (v: string) => updateState({ citizenship: v }),
        setDestination: (v: Destination | "") =>
            updateState({ destination: v }),
        setBoardType: (v: BoardCode) => updateState({ boardType: v }),
        setStartDate: (v: string) => updateState({ startDate: v }),
        setDaysCount: (v: number) => updateState({ daysCount: v }),

        // handlers for Step 2
        handleDayHotelChange,
        handleLunchChange,
        handleDinnerChange,

        // Save/Load
        savedBookings,
        saveCurrentBooking,
        loadBooking,
        deleteBooking,
    };
}
