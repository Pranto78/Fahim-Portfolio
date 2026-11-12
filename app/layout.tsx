import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MD. Fahim Shahriyar Pranto — Software Engineer",
  description:
    "Software Engineer at Octopi Digital. Web & mobile products in React, React Native and Node. Ask the AI assistant anything.",
  openGraph: {
    title: "MD. Fahim Shahriyar Pranto",
    description: "Software Engineer · React · React Native · Node",
    type: "website",
  },
  // Favicon + Apple touch icon come from app/icon.png and app/apple-icon.png (Next file conventions).
};

// viewport-fit=cover exposes env(safe-area-inset-*) for the mobile tab bar.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
