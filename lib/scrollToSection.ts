// Scrolls so a section's heading lands ~`gap`px from the top, skipping the
// section's large top padding (read live so it's not hardcoded). Shared by the
// navbar, the FSP logo and the Hero button so navigation behaves identically.
export function scrollToSection(id: string, gap = 72) {
  if (id === "hero") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const pt = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY + pt - gap;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
