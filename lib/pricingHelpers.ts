export function getHotelPrice(
    hotelId: number | null,
    destinationHotels: readonly { id: number; name: string; price: number }[]
): number {
    if (!hotelId) return 0;
    const hotel = destinationHotels.find((h) => h.id === hotelId);
    return hotel?.price ?? 0;
}

export function getMealPrice(
    mealId: number | null,
    type: "lunch" | "dinner",
    destinationMeals?:
        | {
            lunch: readonly { id: number; name: string; price: number }[];
            dinner: readonly { id: number; name: string; price: number }[];
        }
        | undefined
): number {
    if (!mealId || !destinationMeals) return 0;
    const list = destinationMeals[type];
    const meal = list.find((m) => m.id === mealId);
    return meal?.price ?? 0;
}
