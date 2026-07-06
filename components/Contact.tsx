"use client";

import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { THEME } from "@/config/theme.config";
import { PERSON } from "@/data/person";
import { Eyebrow, Heading, Section } from "./ui";

const EASE = [0.16, 1, 0.3, 1] as const;

type ContactFields = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
};

type Notice = { kind: "success" | "error"; text: string } | null;

const EMPTY_FORM: ContactFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

export default function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<ContactFields>(EMPTY_FORM);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [improving, setImproving] = useState(false);
  const [originalMessage, setOriginalMessage] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  function updateField(field: keyof ContactFields, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (notice) setNotice(null);
  }

  async function improveMessage() {
    const draft = form.message.trim();
    if (draft.length < 5 || improving) return;

    setImproving(true);
    setNotice(null);

    try {
      const response = await fetch("/api/contact/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: draft, subject: form.subject }),
      });
      const data = await response.json();

      if (!response.ok || !data.improved) {
        throw new Error(data.error || "AI could not improve the message.");
      }

      setOriginalMessage(form.message);
      setForm((current) => ({ ...current, message: data.improved }));
      setNotice({ kind: "success", text: "Message polished. You can edit it before sending." });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "AI could not improve the message.",
      });
    } finally {
      setImproving(false);
    }
  }

  function undoImprove() {
    if (originalMessage === null) return;
    setForm((current) => ({ ...current, message: originalMessage }));
    setOriginalMessage(null);
    setNotice(null);
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setNotice(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startedAt }),
      });
      const data = await response.json();

      if (!response.ok || !data.sent) {
        throw new Error(data.error || "Your message could not be sent.");
      }

      setForm(EMPTY_FORM);
      setOriginalMessage(null);
      setStartedAt(Date.now());
      setNotice({ kind: "success", text: "Message sent — thank you. I’ll get back to you soon." });
    } catch (error) {
      setNotice({
        kind: "error",
        text: error instanceof Error ? error.message : "Your message could not be sent.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const motionProps = reduced
    ? {}
    : {
        whileHover: { y: -2, scale: 1.015 },
        whileTap: { scale: 0.99 },
      };

  return (
    <Section id="contact" variant="fade">
      <Eyebrow icon={MessageSquareText}>Contact</Eyebrow>
      <Heading>Let&apos;s build something</Heading>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "stretch" }}>
        <div
          style={{
            flex: "1 1 270px",
            padding: 24,
            borderRadius: 18,
            background: THEME.glass,
            border: `1px solid ${THEME.border}`,
            backdropFilter: "blur(14px)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: THEME.fontDisplay,
              color: THEME.heading,
              fontSize: 21,
            }}
          >
            Start a conversation
          </h3>
          <p style={{ color: THEME.muted, lineHeight: 1.7, fontSize: 14, margin: "10px 0 24px" }}>
            Have a project, role, or idea in mind? Send the details and I&apos;ll reply as soon as I can.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <motion.a
              {...motionProps}
              transition={{ type: "tween", duration: 0.4, ease: EASE }}
              href={`mailto:${PERSON.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                borderRadius: 14,
                textDecoration: "none",
                color: THEME.text,
                background: THEME.bgSoft,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <span className="contact-icon"><Mail size={18} /></span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", color: THEME.muted, fontSize: 12, marginBottom: 3 }}>Email</span>
                <span style={{ display: "block", fontSize: 13.5, overflowWrap: "anywhere" }}>{PERSON.email}</span>
              </span>
            </motion.a>

            <motion.a
              {...motionProps}
              transition={{ type: "tween", duration: 0.4, ease: EASE }}
              href={`tel:${PERSON.phone}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                borderRadius: 14,
                textDecoration: "none",
                color: THEME.text,
                background: THEME.bgSoft,
                border: `1px solid ${THEME.border}`,
              }}
            >
              <span className="contact-icon"><Phone size={18} /></span>
              <span>
                <span style={{ display: "block", color: THEME.muted, fontSize: 12, marginBottom: 3 }}>Phone</span>
                <span style={{ display: "block", fontSize: 13.5 }}>{PERSON.phone}</span>
              </span>
            </motion.a>
          </div>
        </div>

        <form
          onSubmit={submitContact}
          style={{
            flex: "1.6 1 480px",
            padding: 24,
            borderRadius: 18,
            background: THEME.glass,
            border: `1px solid ${THEME.border}`,
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
            <label className="contact-label">
              Name
              <input
                className="contact-field"
                name="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                maxLength={80}
                required
              />
            </label>
            <label className="contact-label">
              Email
              <input
                className="contact-field"
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                maxLength={160}
                required
              />
            </label>
            <label className="contact-label">
              Phone <span style={{ color: THEME.muted, fontWeight: 400 }}>(optional)</span>
              <input
                className="contact-field"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="Your phone number"
                autoComplete="tel"
                maxLength={40}
              />
            </label>
            <label className="contact-label">
              Subject
              <input
                className="contact-field"
                name="subject"
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                placeholder="What would you like to discuss?"
                maxLength={120}
                required
              />
            </label>
          </div>

          <label className="contact-label" style={{ marginTop: 16 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              Message
              <span style={{ color: THEME.muted, fontFamily: THEME.fontMono, fontSize: 11, fontWeight: 400 }}>
                {form.message.length}/5000
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
              <motion.button
                type="button"
                onClick={improveMessage}
                disabled={form.message.trim().length < 5 || improving || submitting}
                {...motionProps}
                transition={{ type: "tween", duration: 0.35, ease: EASE }}
                className="contact-ai-button"
              >
                <Sparkles size={14} />
                {improving ? "Improving…" : "AI Improve"}
              </motion.button>
              {originalMessage !== null && (
                <button type="button" onClick={undoImprove} className="contact-undo-button">
                  <RotateCcw size={13} /> Undo
                </button>
              )}
            </span>
            <textarea
              className="contact-field contact-message"
              name="message"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Write your message here, then use AI Improve if you want a polished version."
              rows={7}
              minLength={10}
              maxLength={5000}
              required
            />
          </label>

          <input
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            name="website"
            value={form.website}
            onChange={(event) => updateField("website", event.target.value)}
            style={{ position: "absolute", left: -10000, width: 1, height: 1, opacity: 0 }}
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginTop: 18 }}>
            <motion.button
              type="submit"
              disabled={submitting || improving}
              {...motionProps}
              transition={{ type: "tween", duration: 0.35, ease: EASE }}
              className="contact-submit-button"
            >
              <Send size={16} />
              {submitting ? "Sending…" : "Send message"}
            </motion.button>

            <div aria-live="polite" style={{ flex: "1 1 240px", minHeight: 20 }}>
              {notice && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    color: notice.kind === "success" ? THEME.green : "#FB7185",
                    fontSize: 13,
                  }}
                >
                  {notice.kind === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  {notice.text}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}
