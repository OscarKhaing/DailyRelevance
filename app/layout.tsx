import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaFeed — your bio, your news",
  description:
    "Paste your bio. Get a live, AI-curated news briefing tailored to exactly what you do.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative z-0">{children}</body>
    </html>
  );
}
