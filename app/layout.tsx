import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Instrument_Sans, Nunito } from "next/font/google";
import "./globals.css";

// Recommended fonts for study/learning apps:

// 1. Inter - Clean, modern, highly readable (most popular)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 2. Plus Jakarta Sans - Friendly, modern, great for SaaS
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

// 3. Instrument Sans - Clean with slight personality
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

// 4. Nunito - Rounded, friendly, approachable
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// Choose one font (I recommend Inter or Plus Jakarta Sans)
export const metadata: Metadata = {
  title: "StudyTrack - Track Your Learning Journey",
  description: "Build better study habits and track your progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}