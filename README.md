# Fahim's AI Portfolio — Next.js

An AI-themed portfolio with two chatbots:
- A **floating general assistant** that answers questions about you.
- An **AI-driven Projects section** — drag a project card into the chat to talk about that project only.

Built with Next.js (App Router) + TypeScript. The AI runs on **Groq (free)** via a server-side API route, so your key stays secret.

---

## 1. Setup

```bash
npm install
```

Create your env file:

```bash
cp .env.local.example .env.local
```

Get a **free** Groq API key at https://console.groq.com (no credit card), then put it in `.env.local`:

```
GROQ_API_KEY=gsk_your_real_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

Run it:

```bash
npm run dev
```

Open http://localhost:3000

---

## 2. Where to change things

| What | File |
|------|------|
| **Colors / fonts** | `config/theme.config.ts` — change once, updates everywhere |
| **Your info** (name, role, contact, hobbies) | `data/person.ts` |
| **Personal projects** (About section cards) | `data/person.ts` → `PERSONAL` |
| **Office projects** (AI project chat) | `data/projects.ts` |
| **Skills** | `data/skills.ts` |
| **Chatbot behavior / rules** | `lib/prompts.ts` |
| **AI model / provider** | `app/api/chat/route.ts` |

---

## 3. Add your photo

In `components/Hero.tsx`, find the block marked `Replace this block with your photo later`.
Drop your image in `/public` (e.g. `/public/me.png`) and swap the placeholder for:

```tsx
import Image from "next/image";
// ...
<Image src="/me.png" alt="Fahim" width={260} height={260}
  style={{ borderRadius: "50%", objectFit: "cover" }} />
```

---

## 4. Deploy (free)

Push to GitHub, then import the repo on **Vercel**.
In the Vercel project settings → Environment Variables, add:

```
GROQ_API_KEY = your key
GROQ_MODEL   = llama-3.3-70b-versatile
```

Deploy. Done.

---

## 5. The RAG path (future)

Right now each chat injects the full relevant data block into the system prompt (in `lib/prompts.ts`). When your knowledge grows, swap that for embedding-based retrieval:

1. Convert `data/*.ts` blocks into embeddings.
2. Store in Supabase + pgvector (free tier).
3. In `app/api/chat/route.ts`, retrieve top-matching chunks and inject only those.

The components and chat UI don't change — only the prompt-building step does.

---

## Switching AI provider

The only file that talks to the AI is `app/api/chat/route.ts`. To use OpenAI or Anthropic instead of Groq, change the fetch URL, headers, and body shape there. Everything else stays the same.
