import { Globe, LayoutDashboard, Utensils, Workflow, Bot, MessageCircle, Check, ArrowRight } from "lucide-react";

export function Instagram({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
    </svg>
  );
}

const map = {
  globe: Globe,
  "layout-dashboard": LayoutDashboard,
  utensils: Utensils,
  workflow: Workflow,
  bot: Bot,
  "message-circle": MessageCircle,
  check: Check,
  "arrow-right": ArrowRight,
} as const;

export type IconName = keyof typeof map;

export default function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const C = map[name];
  return <C size={size} strokeWidth={2} aria-hidden="true" />;
}
