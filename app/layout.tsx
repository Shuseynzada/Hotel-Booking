// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel Booking Wizard",
  description: "A multi-step hotel booking price calculator.",
  applicationName: "Hotel Booking Wizard",
  keywords: ["Next.js", "Booking Wizard", "Travel", "Hotels"],
  authors: [{ name: "Shamkhal Huseynzade" }],
  creator: "Shamkhal Huseynzade",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  openGraph: {
    title: "Hotel Booking Wizard",
    description: "A clean and simple travel configuration wizard.",
    url: "https://your-app-url.com",
    siteName: "Hotel Booking Wizard",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-slate-950">
        {children}
      </body>
    </html>
  );
}
