import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyBit",
  description: "Collaborative Study Gamification Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to Font Servers */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Load all 4 required fonts in a single combined network request at runtime */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..700&family=Inter:wght@100..900&family=Nunito:wght@200..1000&family=Plus+Jakarta+Sans:wght@200..800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}