// =========================================================================
// CONTENT SCHEMA — shared contract between the portfolio and remoteControl.
// remoteControl/lib/content/types.ts is a copy of this file: keep them in sync.
//
// Every section is stored in MongoDB as { _id: <SectionKey>, data, updatedAt }
// and merged over the hardcoded defaults (lib/content/defaults.ts), so a
// missing or partial section always falls back to what's in the code.
// =========================================================================

/** All values are 6-digit hex (#rrggbb) — components append alpha suffixes like `${THEME.cyan}55`. */
export type ThemeColors = {
  cyan: string;
  violet: string;
  green: string;
  text: string;
  muted: string;
  heading: string;
  bgSoft: string;
  navy: string;
  deep: string;
  steel: string;
  ice: string;
  snow: string;
  /** Middle stop of the accent gradient (ice → gradMid → steel). */
  gradMid: string;
  /** Middle stop of the filled button gradient (steel → fillMid → deep). */
  fillMid: string;
};

export type Branding = {
  siteTitle: string;
  siteDescription: string;
  /** Empty string = use the image bundled in the code. */
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
};

export type Hobby = { label: string; icon: string; color: string };

export type Profile = {
  name: string;
  role: string;
  team: string;
  empId: string;
  company: string;
  companyUrl: string;
  location: string;
  email: string;
  emailAlt: string;
  phone: string;
  linkedin: string;
  github: string;
  instagram: string;
  facebook: string;
  cv: string;
  oldPortfolio: string;
  languages: string;
  interests: string;
  personality: string;
  bucketList: string[];
  hobbies: Hobby[];
};

export type NavItem = { id: string; label: string };
export type Stat = { value: string; label: string };
export type InfoRow = { icon: string; label: string };

export type SiteText = {
  nav: NavItem[];
  hero: {
    statusLabel: string;
    /** Typed after a time-of-day greeting ("Good morning,"). "Hello, I'm X" → X gets the gradient. */
    introWithGreeting: string[];
    /** Typed when there is no greeting (late night). */
    introDirect: string[];
    tagline: string;
    primaryCta: string;
    secondaryCta: string;
    stats: Stat[];
  };
  about: {
    eyebrow: string;
    heading: string;
    /** Tokens: {name} {role} {company} — {company} renders as the company link. */
    bio: string;
    infoRows: InfoRow[];
    hobbiesTitle: string;
    personalProjectsTitle: string;
  };
  skills: { eyebrow: string; heading: string };
  projects: { eyebrow: string; heading: string; askAiCta: string; dragHint: string };
  education: { eyebrow: string; heading: string };
  contact: { eyebrow: string; heading: string };
  footer: { tagline: string; copyright: string };
};

export type SkillItem = {
  id: string;
  name: string;
  /** Key from the shared icon registry (lib/icons.ts). Empty → iconUrl or monogram. */
  icon: string;
  /** Uploaded / pasted logo image. Used when `icon` is empty. */
  iconUrl: string;
  /** 1–3 letter fallback when there is no icon. */
  mono: string;
  color: string;
  note: string;
  /** false → hidden from the Skills marquee but still selectable as a project logo. */
  showInSkills: boolean;
};

export type ProjectItem = {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  highlights: string[];
  /** Skill ids — their logos render on the card. */
  stack: string[];
  unique: string;
  stackDetails: string;
  state: string;
  auth: string;
  db: string;
  extra: string;
  role: string;
};

export type PersonalProject = {
  id: string;
  name: string;
  desc: string;
  github: string;
  live: string;
};

export type EducationLevel =
  | "university"
  | "certification"
  | "college"
  | "high-school"
  | "elementary"
  | "other";

export type EducationItem = {
  id: string;
  title: string;
  institution: string;
  date: string;
  note: string;
  level: EducationLevel;
  /** false → AI-only (not shown on the timeline). */
  showOnSite: boolean;
  /** GPA / grade. Never sent to the browser; the AI reveals it only when explicitly asked. */
  result: string;
};

export type AiContextItem = {
  id: string;
  title: string;
  content: string;
  /** "general" or a project id. */
  scope: string;
  enabled: boolean;
};

export type AiSettings = {
  /** Extra tone/persona guidance appended to the built-in rules (rules themselves stay in code). */
  toneNotes: string;
  context: AiContextItem[];
};

export type Content = {
  branding: Branding;
  theme: ThemeColors;
  profile: Profile;
  text: SiteText;
  skills: SkillItem[];
  projects: ProjectItem[];
  personal: PersonalProject[];
  education: EducationItem[];
  ai: AiSettings;
};

export type SectionKey = keyof Content;

export const SECTION_KEYS: SectionKey[] = [
  "branding",
  "theme",
  "profile",
  "text",
  "skills",
  "projects",
  "personal",
  "education",
  "ai",
];

/** What the browser receives — AI context, hidden education and results stay on the server. */
export type PublicContent = Omit<Content, "ai" | "profile"> & {
  profile: Omit<Profile, "empId">;
};
