"use client";
import { useState } from "react";
import { Sparkles, Hand, ArrowUpRight, Briefcase } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiExpo,
  SiExpress,
  SiFirebase,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiRedux,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { THEME, GRAD } from "@/config/theme.config";
import { PROJECTS, Project, ProjectTech } from "@/data/projects";
import { Section, Eyebrow, Heading } from "./ui";
import { Orb } from "./Orb";
import ChatPanel from "./ChatPanel";
import SnakeBorder from "./SnakeBorder";

type TechVisual = {
  label: string;
  icon: IconType;
  color: string;
};

const TECH_VISUALS: Record<ProjectTech, TechVisual> = {
  react: { label: "React", icon: SiReact, color: "#61DAFB" },
  "react-native": { label: "React Native", icon: SiReact, color: "#61DAFB" },
  typescript: { label: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  vite: { label: "Vite", icon: SiVite, color: "#A855F7" },
  expo: { label: "Expo", icon: SiExpo, color: "#F2F2F2" },
  node: { label: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  express: { label: "Express", icon: SiExpress, color: "#F2F2F2" },
  redux: { label: "Redux Toolkit", icon: SiRedux, color: "#764ABC" },
  mongodb: { label: "MongoDB", icon: SiMongodb, color: "#47A248" },
  firebase: { label: "Firebase", icon: SiFirebase, color: "#FFCA28" },
};

function ProjectStackLogos({
  stack,
  active,
  compact = false,
}: {
  stack: ProjectTech[];
  active: boolean;
  compact?: boolean;
}) {
  const size = compact ? 29 : 34;
  const iconSize = compact ? 15 : 18;

  return (
    <div
      aria-label="Technology stack"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: compact ? 7 : 8,
        marginTop: compact ? 11 : "auto",
        paddingTop: compact ? 0 : 16,
      }}
    >
      {stack.map((tech, index) => {
        const visual = TECH_VISUALS[tech];
        const Icon = visual.icon;

        return (
          <span
            key={tech}
            title={visual.label}
            aria-label={visual.label}
            style={{
              width: size,
              height: size,
              display: "grid",
              placeItems: "center",
              flex: "0 0 auto",
              borderRadius: 9,
              color: active ? visual.color : THEME.muted,
              background: active ? `${visual.color}0D` : "transparent",
              border: `1px solid ${active ? `${visual.color}55` : THEME.border}`,
              boxShadow: active ? `0 0 16px ${visual.color}38, inset 0 0 10px ${visual.color}12` : "none",
              transform: active ? "translateY(-2px) scale(1.04)" : "translateY(0) scale(1)",
              transition:
                "color .3s ease, background-color .3s ease, border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(0.16,1,0.3,1)",
              transitionDelay: active ? `${index * 45}ms` : "0ms",
            }}
          >
            <Icon size={iconSize} aria-hidden />
          </span>
        );
      })}
    </div>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: 22,
        borderRadius: 16,
        height: "100%",
        background: THEME.bgSoft,
        border: `1px solid ${THEME.border}`,
        boxShadow: hover ? `0 0 34px ${THEME.violet}22` : "none",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        transition: "transform .45s cubic-bezier(0.16,1,0.3,1), box-shadow .45s ease",
        outline: "none",
      }}
    >
      <SnakeBorder active={hover} radius={16} duration={1.5} />
      <div style={{ fontSize: 12, color: THEME.cyan, fontFamily: THEME.fontMono, marginBottom: 8 }}>{p.tag}</div>
      <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, color: THEME.heading, fontSize: 18 }}>{p.name}</div>
      <p style={{ fontSize: 13.5, color: THEME.muted, marginTop: 10, lineHeight: 1.6 }}>{p.blurb}</p>
      <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {p.highlights.map((h) => (
          <li key={h} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 12.5, color: THEME.text, lineHeight: 1.5 }}>
            <ArrowUpRight
              size={14}
              aria-hidden
              style={{ color: THEME.violet, flex: "0 0 auto", marginTop: 2, opacity: hover ? 1 : 0.75, transition: "opacity .3s ease" }}
            />
            <span>{h}</span>
          </li>
        ))}
      </ul>
      <ProjectStackLogos stack={p.visualStack} active={hover} />
    </div>
  );
}

function DraggableProjectCard({ p, selected, onSelect }: { p: Project; selected: boolean; onSelect: () => void }) {
  const [hover, setHover] = useState(false);
  const active = hover || selected;

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onDragStart={(e) => e.dataTransfer.setData("pid", p.id)}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      style={{
        padding: 16,
        borderRadius: 14,
        cursor: "grab",
        background: THEME.bgSoft,
        border: `1px solid ${active ? THEME.cyan + "88" : THEME.border}`,
        boxShadow: active ? `0 0 24px ${THEME.cyan}22` : "none",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "border-color .25s ease, box-shadow .25s ease, transform .25s ease",
        outline: "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 15 }}>{p.name}</div>
        <Hand size={15} style={{ color: active ? THEME.cyan : THEME.muted, transition: "color .25s ease" }} />
      </div>
      <div style={{ fontSize: 12, color: THEME.cyan, fontFamily: THEME.fontMono, marginTop: 4 }}>{p.tag}</div>
      <p style={{ fontSize: 13, color: THEME.muted, marginTop: 8, lineHeight: 1.5 }}>{p.blurb}</p>
      <ProjectStackLogos stack={p.visualStack} active={active} compact />
    </div>
  );
}

export default function Projects() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const id = e.dataTransfer.getData("pid");
    const p = PROJECTS.find((x) => x.id === id);
    if (p) setSelected(p);
  };

  return (
    <Section id="projects" variant="right">
      <Eyebrow icon={Briefcase}>Work</Eyebrow>
      <Heading>Projects I contributed at Octopi</Heading>

      {!expanded && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px,1fr))", gap: 18 }}>
            {PROJECTS.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </div>
          <button
            onClick={() => setExpanded(true)}
            style={{
              marginTop: 28,
              padding: "13px 24px",
              borderRadius: 12,
              cursor: "pointer",
              background: GRAD,
              color: "#06080C",
              fontWeight: 600,
              fontSize: 15,
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: THEME.fontBody,
            }}
          >
            <Sparkles size={18} /> Want to know about a project? Ask the AI
          </button>
        </>
      )}

      {expanded && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontFamily: THEME.fontMono, fontSize: 13, color: THEME.muted }}>
              <Hand size={14} style={{ display: "inline", marginRight: 6, color: THEME.cyan }} />
              Drag a project card into the chat to talk about it
            </div>
            <button
              onClick={() => {
                setExpanded(false);
                setSelected(null);
              }}
              style={{
                background: "none",
                border: `1px solid ${THEME.border}`,
                color: THEME.muted,
                padding: "7px 14px",
                borderRadius: 10,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Close
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {/* LEFT — chat / drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                flex: "1 1 380px",
                height: "clamp(460px, 70vh, 640px)",
                minHeight: 0,
                borderRadius: 18,
                padding: 16,
                background: THEME.glass,
                backdropFilter: "blur(14px)",
                border: `1.5px ${dragOver ? "dashed" : "solid"} ${dragOver ? THEME.cyan : THEME.border}`,
                transition: "border-color .2s",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {!selected ? (
                <div style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", color: THEME.muted }}>
                  <div>
                    <div style={{ width: 60, margin: "0 auto 16px" }}>
                      <Orb size={60} />
                    </div>
                    <div style={{ fontFamily: THEME.fontDisplay, color: THEME.heading, fontSize: 17, marginBottom: 6 }}>
                      Drop a project here
                    </div>
                    <div style={{ fontSize: 13.5, maxWidth: 260 }}>
                      Drag any card from the right, then ask me anything about that project.
                    </div>
                  </div>
                </div>
              ) : (
                <ChatPanel
                  key={selected.id}
                  mode="project"
                  projectId={selected.id}
                  intro={`Great pick — ${selected.name} is a strong one. ${selected.unique} What do you want to know?`}
                  suggestions={[
                    { label: "Brief overview", q: "Give me a brief — what type of project is it?" },
                    { label: "Tech stack", q: "What's the tech stack?" },
                    { label: "Libraries used", q: "Which key libraries does it use?" },
                    { label: "State management", q: "What state management does it use?" },
                  ]}
                />
              )}
            </div>

            {/* RIGHT — draggable cards */}
            <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 12 }}>
              {PROJECTS.map((p) => (
                <DraggableProjectCard
                  key={p.id}
                  p={p}
                  selected={selected?.id === p.id}
                  onSelect={() => setSelected(p)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
