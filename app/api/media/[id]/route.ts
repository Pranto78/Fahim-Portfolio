import { NextResponse } from "next/server";
import { ObjectId, type Binary } from "mongodb";
import { getDb, isDbConfigured } from "@/lib/db";

type MediaDoc = { _id: ObjectId; contentType: string; data: Binary };

// Serves images uploaded from remoteControl (stored in MongoDB). Ids never change,
// so the response is cached forever by browsers and the Vercel CDN.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id) || !isDbConfigured()) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    const db = await getDb();
    const doc = await db.collection<MediaDoc>("media").findOne({ _id: new ObjectId(id) });
    if (!doc) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(Buffer.from(doc.data.buffer), {
      headers: {
        "Content-Type": doc.contentType,
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[media] read failed:", err);
    return new NextResponse("Unavailable", { status: 503 });
  }
}
