import React, { useState } from 'react';
import { PlacementProvider } from './context/PlacementContext';
import { AppShell } from './components/layout/AppShell';
import { HomeView } from './components/views/HomeView';
import { RoadmapView } from './components/views/RoadmapView';
import { PlannerView } from './components/views/PlannerView';
import { ProgressView } from './components/views/ProgressView';
import { AIMentorView } from './components/views/AIMentorView';
import { TestsView } from './components/views/TestsView';
import { InterviewsView } from './components/views/InterviewsView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { ProjectsView } from './components/views/ProjectsView';
import { ManifestationView } from './components/views/ManifestationView';
import { CommandPalette } from './components/common/CommandPalette';
import { AddEntityModal } from './components/modals/AddEntityModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addModalDefaultType, setAddModalDefaultType] = useState<string>('study');
  const [selectedRoadmapNodeId, setSelectedRoadmapNodeId] = useState<string | undefined>(undefined);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, extra?: any) => {
    setActiveTab(tab);
    if (tab === 'roadmap' && extra?.selectedNodeId) {
      setSelectedRoadmapNodeId(extra.selectedNodeId);
    }
    if (tab === 'ai' && extra?.initialQuery) {
      setAiInitialQuery(extra.initialQuery);
    }
  };

  const handleOpenAddModal = (type: string = 'study') => {
    setAddModalDefaultType(type);
    setIsAddModalOpen(true);
  };

  return (
    <PlacementProvider>
      <AppShell
        activeTab={activeTab}
        onTabChange={handleNavigate}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenAddModal={() => handleOpenAddModal('study')}
      >
        {activeTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            initialSelectedNodeId={selectedRoadmapNodeId}
            onOpenAddModal={handleOpenAddModal}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView onOpenAddModal={handleOpenAddModal} />
        )}

        {activeTab === 'progress' && (
          <ProgressView onNavigate={handleNavigate} />
        )}

        {activeTab === 'ai' && (
          <AIMentorView initialQuery={aiInitialQuery} />
        )}

        {activeTab === 'tests' && (
          <TestsView onOpenAddModal={handleOpenAddModal} />
        )}

        {activeTab === 'interviews' && (
          <InterviewsView
            onOpenAddModal={handleOpenAddModal}
            onNavigate={handleNavigate}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsView onOpenAddModal={handleOpenAddModal} />
        )}

        {activeTab === 'projects' && (
          <ProjectsView onOpenAddModal={handleOpenAddModal} />
        )}

        {activeTab === 'manifestation' && (
          <ManifestationView />
        )}

        {/* Global Overlays */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          onNavigate={handleNavigate}
          onOpenAddModal={handleOpenAddModal}
        />

        <AddEntityModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          defaultType={addModalDefaultType}
        />
      </AppShell>
    </PlacementProvider>
  );
}
