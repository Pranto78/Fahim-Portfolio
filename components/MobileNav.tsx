"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Home, User, Cpu, FolderKanban, GraduationCap, Send, type LucideIcon } from "lucide-react";
import logo from "@/asset/logo-f-sky-silver.png";

const EASE = [0.16, 1, 0.3, 1] as const;

// Bottom tab bar items (Contact lives in the top bar as the primary CTA).
const TABS: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: "hero", label: "Home", Icon: Home },
  { id: "about", label: "About", Icon: User },
  { id: "skills", label: "Skills", Icon: Cpu },
  { id: "projects", label: "Projects", Icon: FolderKanban },
  { id: "education", label: "Education", Icon: GraduationCap },
];

/**
 * Mobile + tablet navigation (≤1024px): glassy top bar (logo + Contact CTA)
 * and a floating glass tab bar at the bottom with a raised active bubble.
 */
export default function MobileNav({
  active,
  scrolled,
  go,
}: {
  active: string;
  scrolled: boolean;
  go: (id: string) => void;
}) {
  const reduced = useReducedMotion();
  const contactActive = active === "contact";

  return (
    <>
      {/* ---------- TOP BAR ---------- */}
      <motion.header
        className={`m-topbar${scrolled ? " is-scrolled" : ""}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.button
          onClick={() => go("hero")}
          aria-label="Go to home"
          whileTap={reduced ? undefined : { scale: 0.95 }}
          className="m-topbar-logo"
        >
          <Image
            src={logo}
            alt="Fahim logo"
            fill
            priority
            sizes="44px"
            quality={90}
            style={{ objectFit: "contain", padding: 4 }}
          />
        </motion.button>

        <button
          onClick={() => go("contact")}
          className={`btn btn-primary m-topbar-cta${contactActive ? " is-active" : ""}`}
          aria-current={contactActive ? "page" : undefined}
        >
          <Send size={15} />
          Contact
        </button>
      </motion.header>

      {/* ---------- BOTTOM TAB BAR ---------- */}
      <motion.nav
        aria-label="Sections"
        className="m-tabbar"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.05 }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const on = active === id;
          return (
            <button
              key={id}
              onClick={() => go(id)}
              aria-label={label}
              aria-current={on ? "page" : undefined}
              className={`m-tab${on ? " is-active" : ""}`}
            >
              <span className="m-tab-icon-wrap">
                {on && (
                  <motion.span
                    layoutId="m-tab-bubble"
                    className="m-tab-bubble"
                    transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <motion.span
                  className="m-tab-icon"
                  animate={{ y: on ? -14 : 0, scale: on ? 1.05 : 1 }}
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 30 }}
                >
                  <Icon size={20} strokeWidth={on ? 2.2 : 1.8} />
                </motion.span>
              </span>
              <motion.span
                className="m-tab-label"
                animate={{ opacity: on ? 1 : 0.75, y: on ? 0 : 1 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                {label}
              </motion.span>
            </button>
          );
        })}
      </motion.nav>
    </>
  );
}

// Mobile + tablet breakpoint. Keep in sync with the `.m-*` media query in globals.css.
export const MOBILE_QUERY = "(max-width: 1024px)";
