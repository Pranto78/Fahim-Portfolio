import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getContent } from "@/lib/content/server";
import { themeCssVars } from "@/lib/content/themeCss";

// Title, description and favicon come from remoteControl (Branding). Defaults live in
// lib/content/defaults.ts; the default favicon files are public/icon.png + public/apple-icon.png.
export async function generateMetadata(): Promise<Metadata> {
  const { branding, profile } = await getContent();
  const icon = branding.faviconUrl || "/icon.png";
  return {
    title: branding.siteTitle,
    description: branding.siteDescription,
    openGraph: {
      title: profile.name,
      description: `${profile.role} · React · React Native · Node`,
      type: "website",
    },
    icons: {
      icon,
      apple: branding.faviconUrl || "/apple-icon.png",
    },
  };
}

// viewport-fit=cover exposes env(safe-area-inset-*) for the mobile tab bar.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = await getContent();
  return (
    <html lang="en">
      <body>
        {/* Theme colors from remoteControl → CSS variables used by globals.css (hex-validated). */}
        <style id="theme-vars" dangerouslySetInnerHTML={{ __html: themeCssVars(theme) }} />
        {children}
      </body>
    </html>
  );
}
