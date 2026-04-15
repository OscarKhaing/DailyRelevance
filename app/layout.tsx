import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonaFeed — your bio, your news",
  description:
    "Paste your bio. Get a live, AI-curated news briefing tailored to exactly what you do.",
};

// Runs before first paint. Reads the saved theme from localStorage and applies
// it to <html> so the initial render matches the user's preference (no FOUC).
const themeInit = `(function(){try{var t=localStorage.getItem('personafeed_theme');if(t!=='neon'&&t!=='reading')t='neon';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','neon');}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="neon" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="relative z-0">{children}</body>
    </html>
  );
}
