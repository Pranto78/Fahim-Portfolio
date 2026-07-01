// Client helper — talks to our own /api/chat route (Groq runs server-side).
type Msg = { role: "user" | "assistant"; content: string };

export async function askAI(
  mode: "general" | "project",
  history: Msg[],
  message: string,
  projectId?: string
): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, projectId, history, message }),
    });
    const data = await res.json();
    return data.reply ?? "No response — try again.";
  } catch {
    return "Connection hiccup — try asking that again in a sec.";
  }
}
