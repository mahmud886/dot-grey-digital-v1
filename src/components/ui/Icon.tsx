import {
  Accessibility, ClipboardCheck, Code, Code2, Component, Crosshair, Database, Edit3,
  FileText, FolderOpen, Gauge, GitBranch, Globe, Layout, Mail, Maximize2, Monitor,
  MousePointerClick, Music, Play, Plug, Presentation, Search, ShieldCheck, Smartphone,
  UserCheck, Video, Zap, type LucideIcon,
} from "lucide-react";

/**
 * Content stores icons as names so they stay editable from the CMS. This map is the
 * allow-list — an unknown name falls back rather than crashing the page.
 */
const ICONS: Record<string, LucideIcon> = {
  Accessibility, ClipboardCheck, Code, Code2, Component, Crosshair, Database, Edit3,
  FileText, FolderOpen, Gauge, GitBranch, Globe, Layout, Mail, Maximize2, Monitor,
  MousePointerClick, Music, Play, Plug, Presentation, Search, ShieldCheck, Smartphone,
  UserCheck, Video, Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({
  name,
  className,
  strokeWidth = 1.5,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = ICONS[name] ?? Layout;
  return <Component aria-hidden className={className} strokeWidth={strokeWidth} />;
}
