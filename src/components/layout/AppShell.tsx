import React, { useState, useEffect } from 'react';
import {
  Home,
  Map,
  Calendar,
  BarChart3,
  Bot,
  Briefcase,
  Users,
  Award,
  FolderGit2,
  Sparkles,
  Plus,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Target,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { FloatingQuickAction } from '../common/FloatingQuickAction';
import { useOnlineStatus } from '../../lib/offlineStore';

interface AppShellProps {
  activeTab?: string;
  currentTab?: string;
  onTabChange: (tab: string, extra?: any) => void;
  onOpenAddModal: (defaultType?: string) => void;
  onOpenCommandPalette?: () => void;
  onOpenSearch?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  currentTab,
  onTabChange,
  onOpenAddModal,
  onOpenCommandPalette,
  onOpenSearch,
  children
}) => {
  const effectiveTab = activeTab || currentTab || 'home';
  const handleSearchClick = onOpenCommandPalette || onOpenSearch || (() => {});

  const { userName, currentPhaseName, overallReadinessScore, targetPackage } = usePlacement();
  const { isOnline, syncState } = useOnlineStatus();

  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('pos_theme');
    return saved ? saved === 'dark' : true;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('pos_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('pos_theme', 'light');
    }
  }, [isDark]);

  // Keyboard shortcut Cmd/Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleSearchClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSearchClick]);

  // Primary 5 Navigation Items for Mobile Bottom Bar & Core Navigation
  const primaryNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'ai', label: 'AI', icon: Bot },
  ];

  // Secondary Navigation Items (Trackers & Modules)
  const secondaryNavItems = [
    { id: 'interviews', label: 'Interviews & Debriefs', icon: Users, badge: 'Next 2d' },
    { id: 'tests', label: 'Tests & OAs', icon: Award },
    { id: 'applications', label: 'Job Applications', icon: Briefcase },
    { id: 'projects', label: 'Project Tiers', icon: FolderGit2 },
    { id: 'manifestation', label: 'Vision & Goals', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden flex flex-col bg-[#F7F7FA] text-[#1C1C1E] dark:bg-[#0B0B0F] dark:text-[#F5F5F7] font-sans antialiased selection:bg-[#5856D6] selection:text-white transition-colors duration-200">
      {/* Top Mobile/Desktop Compact Header */}
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#0B0B0F]/95 backdrop-blur-xl border-b border-gray-200 dark:border-[#282830] px-3 sm:px-6 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => onTabChange('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer min-w-0"
            >
              <img
                src="/LOGO.png"
                alt="Placement OS Logo"
                className="w-8 h-8 rounded-lg object-contain bg-gray-900 border border-gray-200 dark:border-[#282830] p-0.5 shadow-sm shadow-[#5856D6]/30 group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-sm sm:text-base text-gray-900 dark:text-white truncate">
                    Placement <span className="text-[#5856D6]">OS</span>
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[140px] sm:max-w-xs font-mono">
                  {currentPhaseName}
                </p>
              </div>
            </button>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sync & Offline Status Indicator Pill */}
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono border transition-all ${
                !isOnline
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : syncState === 'syncing'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
              title={isOnline ? 'All data synchronized locally & online' : 'Operating offline. Changes saved locally.'}
            >
              {!isOnline ? (
                <>
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : syncState === 'syncing' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
                  <span className="hidden sm:inline">Syncing</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span className="hidden sm:inline">Synced</span>
                </>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-[#151519] dark:hover:bg-[#1D1D22] border border-gray-200 dark:border-[#282830] text-gray-600 dark:text-gray-300 text-xs transition-all cursor-pointer"
              title="Search Roadmap & Events (Cmd+K)"
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="hidden sm:inline ml-1.5 text-[11px] font-medium">Search</span>
            </button>

            {/* Readiness Score Pill */}
            <button
              onClick={() => onTabChange('progress')}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#151519] border border-gray-200 dark:border-[#282830] hover:border-[#5856D6]/50 text-xs font-mono transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-[#34C759]" />
              <span className="text-gray-500">Readiness:</span>
              <span className="font-bold text-gray-900 dark:text-white">{overallReadinessScore}%</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg border border-gray-200 dark:border-[#282830] bg-white dark:bg-[#151519] text-gray-600 dark:text-gray-400 transition-colors cursor-pointer"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FF9F0A]" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Direct Log CTA (Desktop) */}
            <button
              onClick={() => onOpenAddModal('study')}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#5856D6] hover:bg-[#4745B8] active:scale-95 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log Action</span>
            </button>

            {/* Mobile Drawer Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg border border-gray-200 dark:border-[#282830] bg-white dark:bg-[#151519] text-gray-700 dark:text-gray-300 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex min-w-0 overflow-x-hidden">
        {/* Desktop Sidebar (Only visible on lg screens >= 1024px) */}
        <aside className="hidden lg:flex flex-col w-64 p-5 border-r border-gray-200 dark:border-[#282830] bg-white/50 dark:bg-[#0B0B0F]/50 shrink-0 select-none">
          <div className="space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Core Workspace
            </div>
            {primaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#5856D6]/10 text-[#5856D6] dark:bg-[#5856D6]/15 dark:text-[#7A79E0] font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#151519]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#5856D6] stroke-[2.2]' : 'text-gray-400 stroke-[1.8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#5856D6]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Trackers & Modules
            </div>
            {secondaryNavItems.map(item => {
              const Icon = item.icon;
              const isActive = effectiveTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#5856D6]/10 text-[#5856D6] dark:bg-[#5856D6]/15 dark:text-[#7A79E0] font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#151519]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#5856D6] stroke-[2.2]' : 'text-gray-400 stroke-[1.8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-[#AF52DE]/15 text-[#AF52DE]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Placement Target Banner */}
          <div className="mt-auto pt-6">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#151519] border border-gray-200 dark:border-[#282830]">
              <div className="flex items-center justify-between text-gray-500 mb-1 text-[10px] uppercase font-mono tracking-wider">
                <span>Target Package</span>
                <span className="text-[#5856D6] font-bold">2027</span>
              </div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">
                ₹23.3 LPA • Google L3
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Over Flyout Drawer (<1024px) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#0B0B0F] border-l border-gray-200 dark:border-[#282830] p-5 shadow-2xl overflow-y-auto flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#282830]">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#5856D6]" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">All Modules</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1 flex-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Core OS</div>
                {primaryNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = effectiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium min-h-[44px] ${
                        isActive
                          ? 'bg-[#5856D6]/10 text-[#5856D6] font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#151519]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-60" />
                    </button>
                  );
                })}

                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">Trackers</div>
                {secondaryNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = effectiveTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium min-h-[44px] ${
                        isActive
                          ? 'bg-[#5856D6]/10 text-[#5856D6] font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#151519]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 opacity-60" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-[#282830] text-[11px] font-mono text-gray-400">
                Placement OS • Target ₹23.3 LPA
              </div>
            </div>
          </div>
        )}

        {/* Viewport Content Area (Reserves safe bottom padding on mobile for bottom navigation) */}
        <main className="flex-1 min-w-0 px-3 sm:px-6 md:px-8 py-4 sm:py-6 pb-[calc(76px+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Floating Quick Action Button (+) */}
      <FloatingQuickAction onOpenAddModal={onOpenAddModal} />

      {/* Mobile Bottom Navigation Bar (Fixed 5 Items in Brand Indigo, <1024px) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0B0B0F]/95 backdrop-blur-2xl border-t border-gray-200 dark:border-[#282830] px-1 py-1 pb-[max(6px,env(safe-area-inset-bottom))] transition-colors overflow-hidden select-none">
        <div className="flex items-center justify-between max-w-md mx-auto w-full">
          {primaryNavItems.map(item => {
            const Icon = item.icon;
            const isActive = effectiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 min-h-[48px] rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'text-[#5856D6] dark:text-[#7A79E0] font-semibold bg-[#5856D6]/10 dark:bg-[#5856D6]/15'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
