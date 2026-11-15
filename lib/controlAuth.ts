import "server-only";
import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

/** True when the request carries the shared CONTROL_SECRET (sent only by remoteControl's server). */
export function isControlRequest(req: NextRequest): boolean {
  const expected = process.env.CONTROL_SECRET;
  const got = req.headers.get("x-control-secret");
  if (!expected || expected.length < 16 || !got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}
