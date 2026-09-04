import React from 'react';
import { getStatusTheme } from './designTokens';

interface StatusPillProps {
  status: string;
  date?: string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, date, size = 'sm' }) => {
  const theme = getStatusTheme(status, date);

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} ${
        size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[11px]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
      <span>{theme.label}</span>
    </span>
  );
};
