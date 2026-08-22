import type { Metadata } from "next";
import "./globals.css";
import { PERSON } from "@/data/person";

export const metadata: Metadata = {
  title: "MD. Fahim Shahriyar Pranto — Software Engineer",
  description:
    "Junior Software Engineer at Octopi Digital. Web & mobile products in React, React Native and Node. Ask the AI assistant anything.",
  openGraph: {
    title: "MD. Fahim Shahriyar Pranto",
    description: "Software Engineer · React · React Native · Node",
    type: "website",
  },
  icons: {
    icon: PERSON.logo,
    apple: PERSON.logo,
  },
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
