import { NextRequest, NextResponse } from "next/server";
import { generalPrompt, projectPrompt } from "@/lib/prompts";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { mode, projectId, history, message } = (await req.json()) as {
      mode: "general" | "project";
      projectId?: string;
      history: Msg[];
      message: string;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    // Build the system prompt server-side (knowledge never leaks to client)
    let system: string | null = null;
    if (mode === "project" && projectId) system = projectPrompt(projectId);
    else system = generalPrompt();

    if (!system) {
      return NextResponse.json({ error: "Unknown project" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "AI is not configured yet. Add GROQ_API_KEY in .env.local." },
        { status: 200 }
      );
    }

    const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

    // Keep only the last 10 turns to stay light
    const trimmed = (history || []).slice(-10);

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 400,
        temperature: 0.6,
        messages: [
          { role: "system", content: system },
          ...trimmed,
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq error:", err);
      return NextResponse.json(
        { reply: "AI service had a hiccup — try again in a moment." },
        { status: 200 }
      );
    }

    const data = await res.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Hmm, I didn't catch that — ask me again?";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { reply: "Something went wrong — please try again." },
      { status: 200 }
    );
  }
}
