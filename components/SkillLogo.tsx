"use client";
import { THEME } from "@/config/theme.config";
import { resolveIcon } from "@/lib/icons";
import type { SkillItem } from "@/lib/content/types";

type LogoSource = Pick<SkillItem, "icon" | "iconUrl" | "mono" | "color" | "name">;

/** Skill / project-stack logo: registry icon → uploaded image → monogram. */
export default function SkillLogo({ skill, size, color }: { skill: LogoSource; size: number; color?: string }) {
  const Icon = resolveIcon(skill.icon);
  if (Icon) return <Icon size={size} color={color ?? skill.color} />;
  if (skill.iconUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={skill.iconUrl} alt="" width={size} height={size} style={{ objectFit: "contain" }} />;
  }
  return (
    <span
      style={{
        fontFamily: THEME.fontMono,
        fontWeight: 700,
        fontSize: size * 0.5,
        color: color ?? skill.color,
      }}
    >
      {skill.mono || skill.name.slice(0, 2).toUpperCase()}
    </span>
  );
}
