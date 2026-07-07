"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Phone,
  RotateCcw,
  Send,
  Sparkles,
  WandSparkles,
  X,
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
type DraftSnapshot = Pick<ContactFields, "subject" | "message">;
type Tone = "professional" | "friendly" | "confident" | "concise";
type EmailLength = "short" | "medium" | "detailed";
type HiringSuggestion = {
  id: string;
  text: string;
  chip: string;
  insert: string;
};

const EMPTY_FORM: ContactFields = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

function hasHiringIntent(value: string) {
  return /\b(hr|recruiter|recruiting|recruitment|hire|hiring|job|role|position|opportunity|interview|candidate)\b/i.test(
    value
  );
}

function hasCompanyName(value: string) {
  return (
    /\bcompany(?:\s+name)?\s*:\s*\S+/i.test(value) ||
    /\b(?:from|at|with|for)\s+[A-Z][A-Za-z0-9&.'-]*(?:\s+[A-Z][A-Za-z0-9&.'-]*){0,4}\b/.test(value) ||
    /\b[A-Z][A-Za-z0-9&.'-]*(?:\s+[A-Z][A-Za-z0-9&.'-]*){0,3}\s+(?:Inc|LLC|Ltd|Limited|Corp|Corporation|Company|Technologies|Tech|Labs|Studio|Solutions|Systems|Group)\b/.test(
      value
    )
  );
}

function hasSpecificRole(value: string) {
  return (
    /\brole(?:\s+title)?\s*:\s*\S+/i.test(value) ||
    /\b(full[-\s]?stack|front[-\s]?end|back[-\s]?end|software|web|mobile|react|next\.?js|node\.?js|ui\/ux|product|wordpress|shopify|developer|engineer|designer|architect|intern)\b/i.test(
      value
    )
  );
}

function hasNextStep(value: string) {
  return /\b(call|interview|meeting|schedule|available|availability|reply|respond|discuss|next week|this week)\b/i.test(
    value
  );
}

function getHiringSuggestions(value: string): HiringSuggestion[] {
  if (!hasHiringIntent(value)) return [];

  const suggestions: HiringSuggestion[] = [];

  if (!hasCompanyName(value)) {
    suggestions.push({
      id: "company",
      text: "Add the company name so the hiring email feels specific.",
      chip: "Add company name",
      insert: "Company name: ",
    });
  }

  if (!hasSpecificRole(value)) {
    suggestions.push({
      id: "role",
      text: "Add the role title for a stronger outreach email.",
      chip: "Add role title",
      insert: "Role title: ",
    });
  }

  if (!hasNextStep(value)) {
    suggestions.push({
      id: "next-step",
      text: "Mention whether you want an interview, call, or reply.",
      chip: "Add next step",
      insert: "Next step: invite Fahim to a short interview call. ",
    });
  }

  return suggestions;
}

export default function Contact() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState<ContactFields>(EMPTY_FORM);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [improving, setImproving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationOpen, setGenerationOpen] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState("");
  const [generationError, setGenerationError] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [emailLength, setEmailLength] = useState<EmailLength>("medium");
  const [originalDraft, setOriginalDraft] = useState<DraftSnapshot | null>(null);
  const [notice, setNotice] = useState<Notice>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const generatingRef = useRef(false);

  useEffect(() => {
    generatingRef.current = generating;
  }, [generating]);

  useEffect(() => {
    if (!generationOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    promptRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !generatingRef.current) {
        setGenerationOpen(false);
        setGenerationError("");
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), textarea:not([disabled]), select:not([disabled])'
        )
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.setTimeout(() => generateButtonRef.current?.focus(), 0);
    };
  }, [generationOpen]);

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

      setOriginalDraft({ subject: form.subject, message: form.message });
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

  async function generateEmail() {
    const instructions = generationPrompt.trim();
    if (instructions.length < 10 || generating) return;

    setGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/contact/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions, tone, length: emailLength }),
      });
      const data = await response.json();

      if (!response.ok || !data.subject || !data.message) {
        throw new Error(data.error || "AI could not generate the email.");
      }

      setOriginalDraft({ subject: form.subject, message: form.message });
      setForm((current) => ({ ...current, subject: data.subject, message: data.message }));
      setGenerationOpen(false);
      setGenerationPrompt("");
      setNotice({ kind: "success", text: "Email generated. Review or edit it before sending." });
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "AI could not generate the email."
      );
    } finally {
      setGenerating(false);
    }
  }

  function undoAIChange() {
    if (!originalDraft) return;
    setForm((current) => ({ ...current, ...originalDraft }));
    setOriginalDraft(null);
    setNotice(null);
  }

  function closeGenerationModal() {
    if (generating) return;
    setGenerationOpen(false);
    setGenerationError("");
  }

  function addPromptSuggestion(suggestion: HiringSuggestion) {
    setGenerationPrompt((current) => {
      const separator = current.trim().length ? "\n" : "";
      return `${current}${separator}${suggestion.insert}`;
    });
    window.setTimeout(() => promptRef.current?.focus(), 0);
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
      setOriginalDraft(null);
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
  const hiringSuggestions = getHiringSuggestions(generationPrompt);

  return (
    <Section id="contact" variant="fade" style={{ padding: "48px 5vw" }}>
      <Eyebrow icon={MessageSquareText}>Contact</Eyebrow>
      <div className="contact-heading">
        <Heading>Let&apos;s build something</Heading>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-start" }}>
        <div
          style={{
            flex: "1 1 270px",
            padding: 18,
            borderRadius: 16,
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
              fontSize: 19,
            }}
          >
            Start a conversation
          </h3>
          <p style={{ color: THEME.muted, lineHeight: 1.55, fontSize: 13.5, margin: "7px 0 16px" }}>
            Have a project, role, or idea in mind? Send the details and I&apos;ll reply as soon as I can.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <motion.a
              {...motionProps}
              transition={{ type: "tween", duration: 0.4, ease: EASE }}
              href={`mailto:${PERSON.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 11,
                borderRadius: 12,
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
                gap: 10,
                padding: 11,
                borderRadius: 12,
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
            padding: 18,
            borderRadius: 16,
            background: THEME.glass,
            border: `1px solid ${THEME.border}`,
            backdropFilter: "blur(14px)",
          }}
        >
          <div className="contact-form-grid">
            <label className="contact-label">
              <span className="contact-label-text">Name</span>
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
              <span className="contact-label-text">Email</span>
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
              <span className="contact-label-text">
                Phone <span style={{ color: THEME.muted, fontWeight: 400 }}>(optional)</span>
              </span>
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
              <span className="contact-label-text">Subject</span>
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

          <label className="contact-label" style={{ marginTop: 12 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              Message
              <span style={{ color: THEME.muted, fontFamily: THEME.fontMono, fontSize: 11, fontWeight: 400 }}>
                {form.message.length}/5000
              </span>
            </span>
            <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 7, margin: "6px 0" }}>
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
              <motion.button
                ref={generateButtonRef}
                type="button"
                onClick={() => {
                  setGenerationError("");
                  setGenerationOpen(true);
                }}
                disabled={improving || submitting}
                {...motionProps}
                transition={{ type: "tween", duration: 0.35, ease: EASE }}
                className="contact-generate-button"
              >
                <WandSparkles size={14} /> AI Generate
              </motion.button>
              {originalDraft !== null && (
                <button type="button" onClick={undoAIChange} className="contact-undo-button">
                  <RotateCcw size={13} /> Undo AI
                </button>
              )}
            </span>
            <textarea
              className="contact-field contact-message"
              name="message"
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Write your message here, then use AI Improve if you want a polished version."
              rows={5}
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

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginTop: 12 }}>
            <motion.button
              type="submit"
              disabled={submitting || improving || generating}
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

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {generationOpen && (
              <motion.div
                className="contact-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.25 }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeGenerationModal();
                }}
              >
                <motion.div
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="generate-email-title"
                  className="contact-modal"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
                >
                  <div className="contact-modal-header">
                    <div>
                      <div className="contact-modal-kicker"><WandSparkles size={14} /> AI email composer</div>
                      <h3 id="generate-email-title">Describe the email you need</h3>
                    </div>
                    <button
                      type="button"
                      onClick={closeGenerationModal}
                      disabled={generating}
                      className="contact-modal-close"
                      aria-label="Close email generator"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="contact-modal-copy">
                    Tell the AI who you are contacting, why, and any details it must include. It will create a polished subject and message without changing your contact information.
                  </p>

                  <label className="contact-label">
                    Instructions
                    <textarea
                      ref={promptRef}
                      className="contact-field contact-generation-prompt"
                      value={generationPrompt}
                      onChange={(event) => {
                        setGenerationPrompt(event.target.value);
                        if (generationError) setGenerationError("");
                      }}
                      placeholder="Example: Write a friendly email asking Fahim about building a React Native app. Mention a six-week timeline and ask for a short call next week."
                      rows={5}
                      minLength={10}
                      maxLength={2000}
                    />
                    <span className="contact-modal-count">{generationPrompt.length}/2000</span>
                  </label>

                  {hiringSuggestions.length > 0 && (
                    <div className="contact-suggestions" aria-label="Hiring email suggestions">
                      {hiringSuggestions.map((suggestion) => (
                        <div className="contact-suggestion" key={suggestion.id}>
                          <span><AlertCircle size={13} /> {suggestion.text}</span>
                          <button
                            type="button"
                            onClick={() => addPromptSuggestion(suggestion)}
                            disabled={generating}
                          >
                            {suggestion.chip}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="contact-modal-options">
                    <label className="contact-label">
                      Tone
                      <select
                        className="contact-field"
                        value={tone}
                        onChange={(event) => setTone(event.target.value as Tone)}
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="confident">Confident</option>
                        <option value="concise">Concise</option>
                      </select>
                    </label>
                    <label className="contact-label">
                      Length
                      <select
                        className="contact-field"
                        value={emailLength}
                        onChange={(event) => setEmailLength(event.target.value as EmailLength)}
                      >
                        <option value="short">Short</option>
                        <option value="medium">Medium</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </label>
                  </div>

                  <div aria-live="polite" className="contact-modal-error">
                    {generationError && <><AlertCircle size={14} /> {generationError}</>}
                  </div>

                  <div className="contact-modal-actions">
                    <button
                      type="button"
                      onClick={closeGenerationModal}
                      disabled={generating}
                      className="contact-modal-cancel"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="button"
                      onClick={generateEmail}
                      disabled={generationPrompt.trim().length < 10 || generating}
                      whileHover={reduced ? undefined : { y: -1, scale: 1.01 }}
                      whileTap={reduced ? undefined : { scale: 0.99 }}
                      transition={{ type: "tween", duration: 0.3, ease: EASE }}
                      className="contact-submit-button contact-modal-generate"
                    >
                      <WandSparkles size={15} />
                      {generating ? "Generating…" : "Generate & fill form"}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </Section>
  );
}
