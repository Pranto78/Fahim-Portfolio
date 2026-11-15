import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_CONTENT } from "@/lib/content/defaults";
import { isControlRequest } from "@/lib/controlAuth";

// remoteControl reads the hardcoded defaults from here, so they only live in this repo.
export async function GET(req: NextRequest) {
  if (!isControlRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(DEFAULT_CONTENT, { headers: { "Cache-Control": "no-store" } });
}
