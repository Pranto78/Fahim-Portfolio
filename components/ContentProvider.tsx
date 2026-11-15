"use client";
import { createContext, useContext, type ReactNode } from "react";
import { applyTheme } from "@/config/theme.config";
import type { PublicContent, SkillItem } from "@/lib/content/types";

const ContentContext = createContext<PublicContent | null>(null);

export function ContentProvider({ content, children }: { content: PublicContent; children: ReactNode }) {
  // Runs before any child renders (server and client), so every THEME read below sees the DB colors.
  applyTheme(content.theme);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent(): PublicContent {
  const c = useContext(ContentContext);
  if (!c) throw new Error("useContent must be used inside <ContentProvider>");
  return c;
}

/** Replaces {name} {role} {company} {location} {year} tokens with profile values. */
export function fillTokens(text: string, c: PublicContent): string {
  return text
    .replace(/\{name\}/g, c.profile.name)
    .replace(/\{role\}/g, c.profile.role)
    .replace(/\{company\}/g, c.profile.company)
    .replace(/\{location\}/g, c.profile.location)
    .replace(/\{year\}/g, String(new Date().getFullYear()));
}

export function skillById(c: PublicContent): Map<string, SkillItem> {
  return new Map(c.skills.map((s) => [s.id, s]));
}
