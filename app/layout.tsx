import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MD. Fahim Shahriyar Pranto — Software Engineer",
  description:
    "Junior Software Engineer at Octopi Digital. Web & mobile products in React, React Native and Node. Ask the AI assistant anything.",
  openGraph: {
    title: "MD. Fahim Shahriyar Pranto",
    description: "Software Engineer · React · React Native · Node",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
