"use client";
import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { THEME, GRAD } from "@/config/theme.config";
import { askAI } from "@/lib/askAI";
import { TypingDots } from "./Orb";

type Msg = { role: "user" | "assistant"; content: string };
type Suggestion = { label: string; q: string };

export default function ChatPanel({
  mode,
  projectId,
  intro,
  suggestions,
}: {
  mode: "general" | "project";
  projectId?: string;
  intro: string;
  suggestions?: Suggestion[];
}) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: intro }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMsgs([{ role: "assistant", content: intro }]);
  }, [intro, projectId]);

  useEffect(() => {
    // Scroll only the chat's own list to the bottom — never the window/page.
    const el = listRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput("");
    const history = msgs.map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    const reply = await askAI(mode, history, q, projectId);
    setLoading(false);
    setMsgs((m) => [...m, { role: "assistant", content: reply }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "4px 2px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: 14,
                fontSize: 14,
                lineHeight: 1.5,
                background: m.role === "user" ? GRAD : THEME.bgSoft,
                color: m.role === "user" ? "#06080C" : THEME.text,
                border: m.role === "user" ? "none" : `1px solid ${THEME.border}`,
                fontWeight: m.role === "user" ? 600 : 400,
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: THEME.bgSoft, borderRadius: 14, border: `1px solid ${THEME.border}` }}>
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {suggestions && suggestions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "10px 0 6px" }}>
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => send(s.q)}
              style={{
                fontSize: 12,
                padding: "6px 12px",
                borderRadius: 20,
                cursor: "pointer",
                background: "transparent",
                color: THEME.cyan,
                border: `1px solid ${THEME.cyan}55`,
                fontFamily: THEME.fontMono,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8, paddingTop: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask something…"
          style={{
            flex: 1,
            padding: "11px 14px",
            borderRadius: 12,
            outline: "none",
            background: THEME.bg,
            color: THEME.text,
            border: `1px solid ${THEME.border}`,
            fontSize: 14,
            fontFamily: THEME.fontBody,
          }}
        />
        <button
          onClick={() => send()}
          disabled={loading}
          style={{
            width: 44,
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            background: GRAD,
            color: "#06080C",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
