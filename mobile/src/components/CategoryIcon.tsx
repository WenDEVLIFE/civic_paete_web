import {
  Construction,
  Droplets,
  Lightbulb,
  ShieldAlert,
  Trash2,
  type LucideIcon,
} from 'lucide-react-native';

import type { ReportCategory } from '@/types';

const ICONS: Record<ReportCategory, LucideIcon> = {
  waste: Trash2,
  lighting: Lightbulb,
  road: Construction,
  drainage: Droplets,
  safety: ShieldAlert,
};

export function CategoryIcon({
  category,
  size = 14,
  color,
  strokeWidth = 2,
}: {
  category: ReportCategory;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[category];
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
