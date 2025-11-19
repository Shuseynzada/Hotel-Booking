export type Destination = "Turkey" | "UAE" | "Italy";

export type BoardCode = "FB" | "HB" | "NB";

export type DayConfig = {
  date: string;
  hotelId: number | null;
  lunchId: number | null;
  dinnerId: number | null;
};

export type DayTotal = {
  hotelPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  total: number;
};