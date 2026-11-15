// =========================================================================
// DEFAULT CONTENT — built from the original hardcoded data files.
// data/person.ts, data/skills.ts and data/projects.ts are NOT deleted: they are
// the fallback whenever the database is empty, unreachable or not configured.
// Server-only: never import this from a client component.
// =========================================================================
import "server-only";
import { PERSON, PERSONAL } from "@/data/person";
import { PROJECTS, type ProjectTech } from "@/data/projects";
import { SKILLS } from "@/data/skills";
import type { Content, SkillItem } from "./types";

// Original skill → icon registry key (see lib/icons.ts).
const SKILL_META: Record<string, { id: string; icon: string }> = {
  JavaScript: { id: "javascript", icon: "SiJavascript" },
  TypeScript: { id: "typescript", icon: "SiTypescript" },
  "React.js": { id: "react", icon: "SiReact" },
  "Next.js": { id: "nextjs", icon: "SiNextdotjs" },
  "React Native": { id: "react-native", icon: "SiReact" },
  Expo: { id: "expo", icon: "SiExpo" },
  "Tailwind CSS": { id: "tailwind", icon: "SiTailwindcss" },
  NativeWind: { id: "nativewind", icon: "" },
  HTML: { id: "html", icon: "SiHtml5" },
  CSS: { id: "css", icon: "SiCss" },
  "Node.js": { id: "node", icon: "SiNodedotjs" },
  NestJS: { id: "nestjs", icon: "SiNestjs" },
  Express: { id: "express", icon: "SiExpress" },
  MongoDB: { id: "mongodb", icon: "SiMongodb" },
  PostgreSQL: { id: "postgresql", icon: "SiPostgresql" },
  MySQL: { id: "mysql", icon: "SiMysql" },
  "Redux Toolkit": { id: "redux", icon: "SiRedux" },
  "RTK Query": { id: "rtk-query", icon: "SiRedux" },
  Docker: { id: "docker", icon: "SiDocker" },
  Git: { id: "git", icon: "SiGit" },
  "C#": { id: "csharp", icon: "TbBrandCSharp" },
  Java: { id: "java", icon: "FaJava" },
  "C++": { id: "cpp", icon: "SiCplusplus" },
};

const skills: SkillItem[] = [
  ...SKILLS.map((s) => {
    const meta = SKILL_META[s.name] ?? {
      id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      icon: "",
    };
    return {
      id: meta.id,
      name: s.name,
      icon: meta.icon,
      iconUrl: "",
      mono: s.mono ?? "",
      color: s.color,
      note: s.note,
      showInSkills: true,
    };
  }),
  // Used only as project logos (they were project-only before, not in the Skills marquee).
  { id: "vite", name: "Vite", icon: "SiVite", iconUrl: "", mono: "", color: "#A855F7", note: "Fast frontend build tool.", showInSkills: false },
  { id: "firebase", name: "Firebase", icon: "SiFirebase", iconUrl: "", mono: "", color: "#FFCA28", note: "Google's app platform — auth, hosting and realtime data.", showInSkills: false },
];

// Old fixed project tech keys → skill ids.
const LEGACY_TECH: Record<ProjectTech, string> = {
  react: "react",
  "react-native": "react-native",
  typescript: "typescript",
  vite: "vite",
  expo: "expo",
  node: "node",
  express: "express",
  redux: "redux",
  mongodb: "mongodb",
  firebase: "firebase",
};

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const DEFAULT_CONTENT: Content = {
  branding: {
    siteTitle: `${PERSON.name} — ${PERSON.role}`,
    siteDescription:
      "Software Engineer at Octopi Digital. Web & mobile products in React, React Native and Node. Ask the AI assistant anything.",
    logoUrl: "",
    faviconUrl: "",
    heroImageUrl: "",
    aboutImageUrl: "",
  },

  // Mirrors config/theme.config.ts. The space background (bg, stars, nebula) is NOT part of this.
  theme: {
    cyan: "#00F0FF",
    violet: "#B14EFF",
    green: "#39FF88",
    text: "#E8EAED",
    muted: "#7B8794",
    heading: "#FFFFFF",
    bgSoft: "#10141C",
    navy: "#0A1931",
    deep: "#1A3D63",
    steel: "#4A7FA7",
    ice: "#B3CFE5",
    snow: "#F6FAFD",
    gradMid: "#7FA8C9",
    fillMid: "#2F5F88",
  },

  profile: {
    name: PERSON.name,
    role: PERSON.role,
    team: PERSON.team,
    empId: PERSON.empId,
    company: PERSON.company,
    companyUrl: PERSON.companyUrl,
    location: PERSON.location,
    email: PERSON.email,
    emailAlt: PERSON.emailAlt,
    phone: PERSON.phone,
    linkedin: PERSON.linkedin,
    github: PERSON.github,
    instagram: PERSON.instagram,
    facebook: PERSON.facebook,
    cv: PERSON.cv,
    oldPortfolio: PERSON.oldPortfolio,
    languages: PERSON.languages,
    interests: PERSON.interests,
    personality: PERSON.personality,
    bucketList: [...PERSON.bucketList],
    hobbies: [
      { label: "Traveling & exploring", icon: "LuPlaneTakeoff", color: "cyan" },
      { label: "Building side projects", icon: "LuCodeXml", color: "violet" },
      { label: "Exploring new web/AI tech", icon: "LuBrainCircuit", color: "green" },
      { label: "Football", icon: "FaFutbol", color: "#4ADE80" },
      { label: "Gaming", icon: "LuGamepad2", color: "#A78BFA" },
      { label: "Movies", icon: "LuClapperboard", color: "#FB7185" },
      { label: "TV Series", icon: "LuTv", color: "#60A5FA" },
      { label: "Anime", icon: "SiCrunchyroll", color: "#F47521" },
    ],
  },

  text: {
    nav: [
      { id: "hero", label: "Home" },
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "education", label: "Education" },
      { id: "contact", label: "Contact" },
    ],
    hero: {
      statusLabel: "Available",
      introWithGreeting: ["Hello, I'm Fahim", "Nice to meet you", "Welcome to my web"],
      introDirect: ["I'm Fahim", "Nice to meet you", "Welcome to my web"],
      tagline:
        "I build web & mobile products end-to-end — React, React Native and Node — from CRM platforms to telehealth and AI wellness apps.",
      primaryCta: "View Projects",
      secondaryCta: "View CV",
      stats: [
        { value: "1+", label: "year experience" },
        { value: "5+", label: "products shipped" },
        { value: "Web + Mobile", label: "full stack" },
      ],
    },
    about: {
      eyebrow: "About",
      heading: "Who I am",
      bio: "My name is {name}. I'm a {role} on the Technology Team at {company}, building production web and mobile apps. My day-to-day spans React/Next on the web, React Native on mobile, and Node/Express APIs — with a current focus on secure, role-based backend systems.",
      infoRows: [
        { icon: "LuBriefcase", label: "Octopi Digital —  Software Engineer" },
        { icon: "LuMapPin", label: "{location}" },
        { icon: "LuGraduationCap", label: "BSc in CSE, AIUB (expected 2026)" },
      ],
      hobbiesTitle: "Hobbies",
      personalProjectsTitle: "Personal Projects",
    },
    skills: { eyebrow: "Stack", heading: "Skills & Tools" },
    projects: {
      eyebrow: "Work",
      heading: "Projects I contributed at Octopi",
      askAiCta: "Want to know about a project? Ask the AI",
      dragHint: "Drag a project card into the chat to talk about it",
    },
    education: { eyebrow: "Background", heading: "Education & Learning" },
    contact: { eyebrow: "Contact", heading: "Let's build something" },
    footer: { tagline: "Let's build something.", copyright: "© {year} {name}. Built with Next.js." },
  },

  skills,

  projects: PROJECTS.map((p) => ({
    id: p.id,
    name: p.name,
    tag: p.tag,
    blurb: p.blurb,
    highlights: [...p.highlights],
    stack: p.visualStack.map((t) => LEGACY_TECH[t]),
    unique: p.unique,
    stackDetails: p.stack,
    state: p.state,
    auth: p.auth,
    db: p.db,
    extra: p.extra,
    role: p.role,
  })),

  personal: PERSONAL.map((p) => ({
    id: slug(p.name),
    name: p.name,
    desc: p.desc,
    github: p.github ?? "",
    live: p.live ?? "",
  })),

  education: [
    {
      id: "aiub-bsc",
      title: "BSc in Computer Science & Engineering",
      institution: "American International University-Bangladesh (AIUB)",
      date: "Expected 2026",
      note: "Coursework: DSA, DBMS, OOP, Web Engineering, Software Engineering.",
      level: "university",
      showOnSite: true,
      result: "",
    },
    {
      id: "programming-hero",
      title: "Complete Web Development Course",
      institution: "Programming Hero",
      date: "Jun 2025 – Feb 2026",
      note: "Full-stack: HTML, CSS, JS, React, Node, MongoDB. 10+ projects.",
      level: "certification",
      showOnSite: true,
      result: "",
    },
    {
      id: "hsc",
      title: PERSON.schooling.college.degree,
      institution: PERSON.schooling.college.name,
      date: "",
      note: "",
      level: "college",
      showOnSite: false,
      result: PERSON.schooling.college.gpa,
    },
    ...PERSON.schooling.highSchool.degrees.map((d) => ({
      id: slug(d.name.split(" ")[0]),
      title: d.name,
      institution: PERSON.schooling.highSchool.name,
      date: "",
      note: "",
      level: "high-school" as const,
      showOnSite: false,
      result: d.gpa,
    })),
    {
      id: "psc",
      title: PERSON.schooling.elementary.degree,
      institution: PERSON.schooling.elementary.name,
      date: "",
      note: PERSON.schooling.elementary.note,
      level: "elementary",
      showOnSite: false,
      result: PERSON.schooling.elementary.gpa,
    },
  ],

  ai: { toneNotes: "", context: [] },
};
