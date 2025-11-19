# Hotel Booking Wizard — Client App

A clean, modern multi-step hotel booking wizard built with **Next.js + Tailwind CSS**.
Supports saving/loading booking configurations and automatically persists progress.

---

## ✅ **Requirements**

Before running the app, make sure you have:

* **Node.js ≥ 18**
* **npm**, **yarn**, or **pnpm**
* **Git** (optional)

---

## ▶️ **How to Run the Project**

### **1. Install dependencies**

```bash
npm install
```

or

```bash
yarn install
```

### **2. Start development server**

```bash
npm run dev
```

or

```bash
yarn dev
```

### **3. Open the application**

Navigate to:

```
http://localhost:3000
```

---

## 🧩 **How the App Works (Client-Side Only)**

### **1. Multi-Step Wizard**

The wizard includes **3 steps**:

1. **Trip Setup** — basic trip information
2. **Daily Configuration** — select hotels & meals per day
3. **Summary** — final overview and price breakdown

Navigation uses **Next/Back** buttons and shows the current step visually.

---

### **2. Local Storage Persistence**

The app automatically stores:

* step number
* citizenship, destination, board type
* start date, number of days
* daily configuration
* calculated totals

You can close the browser and return later — all data is restored.

---

### **3. Saving and Loading Bookings**

You can store multiple booking profiles:

* Click **Save current**
* Enter a name for your saved booking
* Saved bookings appear under the card
* Each saved booking has:

  * **Load** (restore saved data)
  * **Delete**

---

### **4. Reset Function**

A **Reset all data** button clears:

* all form fields
* wizard state
* local storage data

---

### **5. Responsive UI**

* Tailwind CSS components
* Mobile-optimized table view
* Dark/light mode support

---

## 📂 Project Structure

```
app/
│── page.tsx                  → main wizard container
│── globals.css               → global + Tailwind component styles
components/
│── StepCard.tsx              → layout wrapper for each step
│── InitialConfigForm.tsx     → step 1 form
│── DailyConfigTable.tsx      → step 2 daily hotel/meal config
│── SummaryPanels.tsx         → step 3 summary
│── WizardHeader.tsx          → reset + save/load UI
│── SavedBookingList.tsx      → list of saved bookings
lib/
│── useHotelWizard.ts         → all business logic + persistence
│── pricingHelpers.ts         → hotel/meal price utilities
│── dateHelpers.ts            → helpers for date operations
data.ts                  → static countries, hotels, meals
```

---