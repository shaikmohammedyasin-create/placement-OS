import React from 'react';
import { getPriorityTheme } from './designTokens';

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm' }) => {
  const theme = getPriorityTheme(priority);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} ${
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dotBg}`} />
      <span>{theme.label}</span>
    </span>
  );
};
