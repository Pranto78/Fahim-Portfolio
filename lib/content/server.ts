import "server-only";
import { unstable_cache } from "next/cache";
import { getDb, isDbConfigured } from "@/lib/db";
import { DEFAULT_CONTENT } from "./defaults";
import { mergeOver } from "./merge";
import type { Content, PublicContent, SectionKey } from "./types";
import { SECTION_KEYS } from "./types";

export const CONTENT_TAG = "portfolio-content";
export const CONTENT_COLLECTION = "content";

type SectionDoc = { _id: SectionKey; data: unknown; updatedAt: Date };

/** Reads every section from MongoDB and merges it over the hardcoded defaults. Never throws. */
export async function loadContentUncached(): Promise<Content> {
  if (!isDbConfigured()) return DEFAULT_CONTENT;
  try {
    const db = await getDb();
    const docs = await db
      .collection<SectionDoc>(CONTENT_COLLECTION)
      .find({ _id: { $in: SECTION_KEYS } })
      .toArray();
    const content: Content = { ...DEFAULT_CONTENT };
    for (const doc of docs) {
      (content as Record<SectionKey, unknown>)[doc._id] = mergeOver(
        DEFAULT_CONTENT[doc._id],
        doc.data
      );
    }
    return content;
  } catch (err) {
    console.error("[content] DB read failed — using hardcoded defaults:", err);
    return DEFAULT_CONTENT;
  }
}

/**
 * Cached content. remoteControl calls /api/revalidate after every save, which
 * expires this tag immediately; the 5-minute window is only a safety net.
 */
export const getContent = unstable_cache(loadContentUncached, ["portfolio-content-v1"], {
  tags: [CONTENT_TAG],
  revalidate: 300,
});

/** Strips everything the browser must not receive (AI context, hidden schooling, GPAs, employee ID). */
export function toPublicContent(c: Content): PublicContent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ai, profile, education, ...rest } = c;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { empId, ...publicProfile } = profile;
  return {
    ...rest,
    profile: publicProfile,
    education: education.filter((e) => e.showOnSite).map((e) => ({ ...e, result: "" })),
  };
}
