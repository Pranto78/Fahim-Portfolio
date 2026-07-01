"use client";
import { useState } from "react";
import { Sparkles, Hand, ArrowUpRight } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { PROJECTS, Project } from "@/data/projects";
import { Section, Eyebrow, Heading } from "./ui";
import { Orb } from "./Orb";
import ChatPanel from "./ChatPanel";
import TiltCard from "./TiltCard";

function ProjectCard({ p }: { p: Project }) {
  const [hover, setHover] = useState(false);
  return (
    <TiltCard max={9} scale={1.03} style={{ borderRadius: 16 }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          padding: 22,
          borderRadius: 16,
          height: "100%",
          background: THEME.bgSoft,
          border: `1px solid ${hover ? THEME.violet + "88" : THEME.border}`,
          boxShadow: hover ? `0 0 30px ${THEME.violet}22` : "none",
          transition: "border-color .25s, box-shadow .25s",
        }}
      >
        <div style={{ fontSize: 12, color: THEME.cyan, fontFamily: THEME.fontMono, marginBottom: 8, transform: "translateZ(20px)" }}>{p.tag}</div>
        <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 700, color: THEME.heading, fontSize: 18, transform: "translateZ(28px)" }}>{p.name}</div>
        <p style={{ fontSize: 13.5, color: THEME.muted, marginTop: 10, lineHeight: 1.6 }}>{p.blurb}</p>
        <div style={{ marginTop: 14, fontSize: 12.5, color: THEME.text, display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowUpRight size={15} style={{ color: THEME.violet }} /> {p.role.split(".")[0]}.
        </div>
      </div>
    </TiltCard>
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
      <Eyebrow>Work</Eyebrow>
      <Heading>Projects I build at Octopi</Heading>

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
                minHeight: 460,
                borderRadius: 18,
                padding: 16,
                background: THEME.glass,
                backdropFilter: "blur(14px)",
                border: `1.5px ${dragOver ? "dashed" : "solid"} ${dragOver ? THEME.cyan : THEME.border}`,
                transition: "border-color .2s",
                display: "flex",
                flexDirection: "column",
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
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("pid", p.id)}
                  onClick={() => setSelected(p)}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    cursor: "grab",
                    background: THEME.bgSoft,
                    border: `1px solid ${selected?.id === p.id ? THEME.cyan + "88" : THEME.border}`,
                    boxShadow: selected?.id === p.id ? `0 0 24px ${THEME.cyan}22` : "none",
                    transition: "all .2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: THEME.fontDisplay, fontWeight: 600, color: THEME.heading, fontSize: 15 }}>
                      {p.name}
                    </div>
                    <Hand size={15} style={{ color: THEME.muted }} />
                  </div>
                  <div style={{ fontSize: 12, color: THEME.cyan, fontFamily: THEME.fontMono, marginTop: 4 }}>{p.tag}</div>
                  <p style={{ fontSize: 13, color: THEME.muted, marginTop: 8, lineHeight: 1.5 }}>{p.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
