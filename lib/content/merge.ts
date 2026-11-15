// Shared with remoteControl (same file there). Arrays replace, objects merge.
type Plain = Record<string, unknown>;

const isPlain = (v: unknown): v is Plain =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** Deep-merge `override` onto `base`. Arrays and primitives in `override` replace; unknown keys are ignored. */
export function mergeOver<T>(base: T, override: unknown): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base)) return (Array.isArray(override) ? override : base) as T;
  if (isPlain(base)) {
    if (!isPlain(override)) return base;
    const out: Plain = { ...base };
    for (const key of Object.keys(base)) {
      if (key in override) out[key] = mergeOver((base as Plain)[key], override[key]);
    }
    return out as T;
  }
  return (typeof override === typeof base ? override : base) as T;
}
