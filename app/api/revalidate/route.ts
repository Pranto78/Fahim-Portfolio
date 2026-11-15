import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content/server";
import { isControlRequest } from "@/lib/controlAuth";

// Called by remoteControl after every save → the next visit gets fresh content.
export async function POST(req: NextRequest) {
  if (!isControlRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
