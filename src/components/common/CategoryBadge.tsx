import React from 'react';
import { getCategoryTheme } from './designTokens';
import {
  Calculator,
  Code2,
  Terminal,
  Cpu,
  Server,
  Users,
  GraduationCap,
  Briefcase,
  Bot,
  BookOpen
} from 'lucide-react';

interface CategoryBadgeProps {
  category: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
  showIcon = true
}) => {
  const theme = getCategoryTheme(category);

  const getIcon = () => {
    const c = category.toLowerCase();
    if (c.includes('aptitude')) return <Calculator className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('dsa') || c.includes('code')) return <Code2 className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('java') || c.includes('programming')) return <Terminal className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('cs') || c.includes('dbms') || c.includes('os')) return <Cpu className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('backend') || c.includes('project')) return <Server className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('interview') || c.includes('mock')) return <Users className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('exam') || c.includes('semester')) return <GraduationCap className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('application')) return <Briefcase className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (c.includes('ai')) return <Bot className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    return <BookOpen className={size === 'sm' ? "w-3 h-3" : "w-3.5 h-3.5"} />;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium uppercase tracking-wider rounded-md border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      {showIcon && getIcon()}
      <span>{theme.label}</span>
    </span>
  );
};
