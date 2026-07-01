import type { IconType } from "react-icons";
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiExpo, SiTailwindcss,
  SiHtml5, SiCss, SiNodedotjs, SiNestjs, SiExpress, SiMongodb, SiPostgresql,
  SiMysql, SiRedux, SiDocker, SiGit, SiCplusplus,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";
import { FaJava } from "react-icons/fa6";

export type Skill = {
  name: string;
  icon: IconType | null; // null → render `mono` monogram fallback
  mono?: string;
  color: string;
  note: string;
};

export const SKILLS: Skill[] = [
  { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E", note: "The language of the web — powers everything I build on the client and server." },
  { name: "TypeScript", icon: SiTypescript, color: "#3178C6", note: "Typed JavaScript I use across every project for safer, self-documenting code." },
  { name: "React.js", icon: SiReact, color: "#61DAFB", note: "My primary UI library for building fast, component-driven web apps." },
  { name: "Next.js", icon: SiNextdotjs, color: "#E8EAED", note: "React framework I reach for — SSR, routing and API routes out of the box." },
  { name: "React Native", icon: SiReact, color: "#61DAFB", note: "Ships my React skills to native iOS & Android from a single codebase." },
  { name: "Expo", icon: SiExpo, color: "#E8EAED", note: "Tooling and EAS builds that speed up React Native app delivery." },
  { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4", note: "Utility-first CSS for styling UIs quickly without leaving the markup." },
  { name: "NativeWind", icon: null, mono: "NW", color: "#38BDF8", note: "Tailwind's utility classes brought to React Native styling." },
  { name: "HTML", icon: SiHtml5, color: "#E34F26", note: "The semantic backbone of every page I build." },
  { name: "CSS", icon: SiCss, color: "#1572B6", note: "Layouts, animation and responsive design fundamentals." },
  { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E", note: "JavaScript runtime powering my Express/Nest backend services." },
  { name: "NestJS", icon: SiNestjs, color: "#E0234E", note: "Opinionated Node framework I use for structured, scalable APIs." },
  { name: "Express", icon: SiExpress, color: "#E8EAED", note: "Minimal Node framework behind most of my REST APIs." },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", note: "Document database I use with Mongoose for flexible data models." },
  { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1", note: "Relational database for structured, query-heavy workloads." },
  { name: "MySQL", icon: SiMysql, color: "#4479A1", note: "Relational database I've used for transactional app data." },
  { name: "Redux Toolkit", icon: SiRedux, color: "#764ABC", note: "My standard for predictable global state management." },
  { name: "RTK Query", icon: SiRedux, color: "#764ABC", note: "Data-fetching & caching layer built on Redux Toolkit." },
  { name: "Docker", icon: SiDocker, color: "#2496ED", note: "Containerizes apps for consistent dev and deployment." },
  { name: "Git", icon: SiGit, color: "#F05032", note: "Version control for everything — branches, reviews and CI." },
  { name: "C#", icon: TbBrandCSharp, color: "#8B5CF6", note: "Object-oriented programming and .NET coursework." },
  { name: "Java", icon: FaJava, color: "#E76F00", note: "OOP foundation from coursework and backend fundamentals." },
  { name: "C++", icon: SiCplusplus, color: "#00599C", note: "Systems-level programming and data-structures work." },
];

// Split the skills into `n` roughly-even sequential rows for the marquee,
// keeping related tech grouped (frontend → backend → tooling).
export function chunkSkills(n: number): Skill[][] {
  const per = Math.ceil(SKILLS.length / n);
  return Array.from({ length: n }, (_, i) => SKILLS.slice(i * per, i * per + per));
}

export const NAV = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
];
