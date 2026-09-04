// Placement OS - Semantic Design Tokens & Color System
// Strict adherence to UX redesign specifications:
// - Brand Indigo (#5856D6): Primary interaction, CTAs, selected navigation
// - Success Green (#34C759): Completed, success, positive progress
// - Warning Amber (#FF9F0A): Upcoming deadline, needs attention, Aptitude
// - Urgent Red (#FF3B30): Exams, interview today, deadline today, overdue
// - Info Blue (#007AFF): DSA, study, applications
// - Purple (#AF52DE): AI, intelligence, interviews, Google prep
// - Teal (#14B8A6): Backend, projects, technical building
// - Slate / Cyan (#06B6D4): CS Fundamentals / Core CS

export const COLOR_TOKENS = {
  brand: '#5856D6',
  brandLight: '#6E6CD8',
  brandDark: '#4745B8',
  success: '#34C759',
  warning: '#FF9F0A',
  urgent: '#FF3B30',
  info: '#007AFF',
  purple: '#AF52DE',
  teal: '#14B8A6',
  cyan: '#06B6D4',
  slate: '#64748B',
  
  // Surfaces
  dark: {
    bg: '#0B0B0F',
    surface: '#151519',
    secondarySurface: '#1D1D22',
    elevated: '#25252D',
    border: '#282830',
    borderSubtle: '#1E1E24',
    text: '#F5F5F7',
    textMuted: '#8E8E93',
  },
  light: {
    bg: '#F7F7FA',
    surface: '#FFFFFF',
    secondarySurface: '#F0F0F5',
    elevated: '#FFFFFF',
    border: '#E5E5EA',
    borderSubtle: '#F0F0F5',
    text: '#1C1C1E',
    textMuted: '#8E8E93',
  }
} as const;

export interface CategoryStyle {
  label: string;
  color: string;
  dotBg: string;
  borderLeft: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconText: string;
}

export function getCategoryTheme(category: string = ''): CategoryStyle {
  const norm = category.toLowerCase().trim();

  // Aptitude -> Orange
  if (norm.includes('aptitude') || norm.includes('quant') || norm.includes('logical') || norm.includes('verbal')) {
    return {
      label: 'Aptitude',
      color: '#FF9F0A',
      dotBg: 'bg-[#FF9F0A]',
      borderLeft: 'border-l-[#FF9F0A]',
      badgeBg: 'bg-[#FF9F0A]/10 dark:bg-[#FF9F0A]/15',
      badgeText: 'text-[#FF9F0A] dark:text-[#FFAE33]',
      badgeBorder: 'border-[#FF9F0A]/30',
      iconBg: 'bg-[#FF9F0A]/15',
      iconText: 'text-[#FF9F0A]'
    };
  }

  // DSA / Coding -> Blue
  if (norm.includes('dsa') || norm.includes('algo') || norm.includes('coding') || norm.includes('problem solving') || norm.includes('leetcode')) {
    return {
      label: 'DSA & Code',
      color: '#007AFF',
      dotBg: 'bg-[#007AFF]',
      borderLeft: 'border-l-[#007AFF]',
      badgeBg: 'bg-[#007AFF]/10 dark:bg-[#007AFF]/15',
      badgeText: 'text-[#007AFF] dark:text-[#3395FF]',
      badgeBorder: 'border-[#007AFF]/30',
      iconBg: 'bg-[#007AFF]/15',
      iconText: 'text-[#007AFF]'
    };
  }

  // Java / Programming -> Indigo
  if (norm.includes('java') || norm.includes('programming') || norm.includes('language') || norm.includes('foundation')) {
    return {
      label: 'Programming',
      color: '#5856D6',
      dotBg: 'bg-[#5856D6]',
      borderLeft: 'border-l-[#5856D6]',
      badgeBg: 'bg-[#5856D6]/10 dark:bg-[#5856D6]/15',
      badgeText: 'text-[#5856D6] dark:text-[#7A79E0]',
      badgeBorder: 'border-[#5856D6]/30',
      iconBg: 'bg-[#5856D6]/15',
      iconText: 'text-[#5856D6]'
    };
  }

  // CS Fundamentals / Core CS -> Cyan / Slate
  if (norm.includes('cs') || norm.includes('dbms') || norm.includes('os') || norm.includes('network') || norm.includes('sql') || norm.includes('theory')) {
    return {
      label: 'CS Core',
      color: '#06B6D4',
      dotBg: 'bg-[#06B6D4]',
      borderLeft: 'border-l-[#06B6D4]',
      badgeBg: 'bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15',
      badgeText: 'text-[#06B6D4] dark:text-[#22D3EE]',
      badgeBorder: 'border-[#06B6D4]/30',
      iconBg: 'bg-[#06B6D4]/15',
      iconText: 'text-[#06B6D4]'
    };
  }

  // Backend & Projects -> Teal
  if (norm.includes('backend') || norm.includes('project') || norm.includes('spring') || norm.includes('api') || norm.includes('devops') || norm.includes('system design')) {
    return {
      label: 'System & Project',
      color: '#14B8A6',
      dotBg: 'bg-[#14B8A6]',
      borderLeft: 'border-l-[#14B8A6]',
      badgeBg: 'bg-[#14B8A6]/10 dark:bg-[#14B8A6]/15',
      badgeText: 'text-[#14B8A6] dark:text-[#2DD4BF]',
      badgeBorder: 'border-[#14B8A6]/30',
      iconBg: 'bg-[#14B8A6]/15',
      iconText: 'text-[#14B8A6]'
    };
  }

  // Interviews / Mocks -> Purple
  if (norm.includes('interview') || norm.includes('mock') || norm.includes('hr') || norm.includes('debrief')) {
    return {
      label: 'Interview',
      color: '#AF52DE',
      dotBg: 'bg-[#AF52DE]',
      borderLeft: 'border-l-[#AF52DE]',
      badgeBg: 'bg-[#AF52DE]/10 dark:bg-[#AF52DE]/15',
      badgeText: 'text-[#AF52DE] dark:text-[#BF6EE6]',
      badgeBorder: 'border-[#AF52DE]/30',
      iconBg: 'bg-[#AF52DE]/15',
      iconText: 'text-[#AF52DE]'
    };
  }

  // Exams -> Red
  if (norm.includes('exam') || norm.includes('semester') || norm.includes('college') || norm.includes('midterm')) {
    return {
      label: 'Exam',
      color: '#FF3B30',
      dotBg: 'bg-[#FF3B30]',
      borderLeft: 'border-l-[#FF3B30]',
      badgeBg: 'bg-[#FF3B30]/10 dark:bg-[#FF3B30]/15',
      badgeText: 'text-[#FF3B30] dark:text-[#FF665C]',
      badgeBorder: 'border-[#FF3B30]/30',
      iconBg: 'bg-[#FF3B30]/15',
      iconText: 'text-[#FF3B30]'
    };
  }

  // Applications -> Blue
  if (norm.includes('application') || norm.includes('referral') || norm.includes('drive') || norm.includes('portal')) {
    return {
      label: 'Application',
      color: '#007AFF',
      dotBg: 'bg-[#007AFF]',
      borderLeft: 'border-l-[#007AFF]',
      badgeBg: 'bg-[#007AFF]/10 dark:bg-[#007AFF]/15',
      badgeText: 'text-[#007AFF] dark:text-[#3395FF]',
      badgeBorder: 'border-[#007AFF]/30',
      iconBg: 'bg-[#007AFF]/15',
      iconText: 'text-[#007AFF]'
    };
  }

  // AI Intelligence -> Purple
  if (norm.includes('ai') || norm.includes('mentor') || norm.includes('intelligence')) {
    return {
      label: 'AI Layer',
      color: '#AF52DE',
      dotBg: 'bg-[#AF52DE]',
      borderLeft: 'border-l-[#AF52DE]',
      badgeBg: 'bg-[#AF52DE]/10 dark:bg-[#AF52DE]/15',
      badgeText: 'text-[#AF52DE] dark:text-[#BF6EE6]',
      badgeBorder: 'border-[#AF52DE]/30',
      iconBg: 'bg-[#AF52DE]/15',
      iconText: 'text-[#AF52DE]'
    };
  }

  // Default Study / General
  return {
    label: category || 'Study Drill',
    color: '#5856D6',
    dotBg: 'bg-[#5856D6]',
    borderLeft: 'border-l-[#5856D6]',
    badgeBg: 'bg-[#5856D6]/10 dark:bg-[#5856D6]/15',
    badgeText: 'text-[#5856D6] dark:text-[#7A79E0]',
    badgeBorder: 'border-[#5856D6]/30',
    iconBg: 'bg-[#5856D6]/15',
    iconText: 'text-[#5856D6]'
  };
}

export function getPriorityTheme(priority: string = 'MEDIUM') {
  const norm = priority.toUpperCase().trim();
  if (norm === 'CRITICAL' || norm === 'P1') {
    return {
      level: 'P1',
      label: 'P1 CRITICAL',
      badgeBg: 'bg-[#FF3B30]/15 dark:bg-[#FF3B30]/20',
      badgeText: 'text-[#FF3B30] dark:text-[#FF665C]',
      badgeBorder: 'border-[#FF3B30]/40',
      dotBg: 'bg-[#FF3B30]'
    };
  }
  if (norm === 'HIGH' || norm === 'P2') {
    return {
      level: 'P2',
      label: 'P2 IMPORTANT',
      badgeBg: 'bg-[#FF9F0A]/15 dark:bg-[#FF9F0A]/20',
      badgeText: 'text-[#FF9F0A] dark:text-[#FFAE33]',
      badgeBorder: 'border-[#FF9F0A]/40',
      dotBg: 'bg-[#FF9F0A]'
    };
  }
  return {
    level: 'P3',
    label: 'P3 OPTIONAL',
    badgeBg: 'bg-gray-500/15 dark:bg-gray-500/20',
    badgeText: 'text-gray-600 dark:text-gray-400',
    badgeBorder: 'border-gray-500/30',
    dotBg: 'bg-gray-400'
  };
}

export function getStatusTheme(status: string = '', date?: string) {
  const norm = status.toLowerCase();
  const todayStr = new Date().toISOString().split('T')[0];

  if (norm === 'completed' || norm === 'done' || norm === 'offer' || norm === 'passed') {
    return {
      label: 'COMPLETED',
      color: '#34C759',
      badgeBg: 'bg-[#34C759]/15',
      badgeText: 'text-[#34C759] dark:text-[#4CD964]',
      badgeBorder: 'border-[#34C759]/30',
      dot: 'bg-[#34C759]'
    };
  }

  if (norm === 'rejected' || norm === 'missed' || norm === 'cancelled') {
    return {
      label: 'MISSED',
      color: '#FF3B30',
      badgeBg: 'bg-[#FF3B30]/15',
      badgeText: 'text-[#FF3B30]',
      badgeBorder: 'border-[#FF3B30]/30',
      dot: 'bg-[#FF3B30]'
    };
  }

  if (date === todayStr || norm.includes('today')) {
    return {
      label: 'TODAY',
      color: '#FF3B30',
      badgeBg: 'bg-[#FF3B30]/15',
      badgeText: 'text-[#FF3B30] font-bold',
      badgeBorder: 'border-[#FF3B30]/40',
      dot: 'bg-[#FF3B30]'
    };
  }

  if (norm.includes('in progress') || norm === 'in_progress' || norm === 'scheduled' || norm === 'oa_scheduled') {
    return {
      label: 'IN PROGRESS',
      color: '#5856D6',
      badgeBg: 'bg-[#5856D6]/15',
      badgeText: 'text-[#5856D6] dark:text-[#7A79E0]',
      badgeBorder: 'border-[#5856D6]/30',
      dot: 'bg-[#5856D6]'
    };
  }

  return {
    label: 'UPCOMING',
    color: '#FF9F0A',
    badgeBg: 'bg-[#FF9F0A]/15',
    badgeText: 'text-[#FF9F0A] dark:text-[#FFAE33]',
    badgeBorder: 'border-[#FF9F0A]/30',
    dot: 'bg-[#FF9F0A]'
  };
}
