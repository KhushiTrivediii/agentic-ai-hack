import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MeetingIngestion } from './components/MeetingIngestion';
import { CrossMeetingMemoryGraph } from './components/CrossMeetingMemoryGraph';
import { ConflictAlertCenter } from './components/ConflictAlertCenter';
import { ExecutionStaging } from './components/ExecutionStaging';
import { WeeklyDigestView } from './components/WeeklyDigestView';
import { RemindersTimeline } from './components/RemindersTimeline';
import { VoiceWisprInputModal } from './components/VoiceWisprInputModal';
import { LinkedInSubmissionModal } from './components/LinkedInSubmissionModal';
import { CommandPalette } from './components/CommandPalette';
import { SEED_MEETINGS, SEED_SPEAKERS, SEED_REMINDERS } from './data/seedData';
import { Meeting, ActionItem, Conflict, Decision, Reminder } from './types';
import { AiAgentService } from './services/aiAgent';
import { sfx } from './utils/audio';

export function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(SEED_MEETINGS);
  const [currentMeetingId] = useState<string>('meet_sprint_16');
  const [speakers] = useState(SEED_SPEAKERS);
  const [reminders, setReminders] = useState<Reminder[]>(SEED_REMINDERS);
  const [activeTab, setActiveTab] = useState<string>('ingestion');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsVoiceModalOpen(true);
      } else if (e.key === 'c' || e.key === 'C') {
        setActiveTab('conflicts');
      } else if (e.key === 'm' || e.key === 'M') {
        setActiveTab('memory');
      } else if (e.key === 's' || e.key === 'S') {
        setActiveTab('staging');
      } else if (e.key === 'd' || e.key === 'D') {
        setActiveTab('digest');
      } else if (e.key === 'r' || e.key === 'R') {
        setActiveTab('reminders');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentMeeting = meetings.find((m) => m.id === currentMeetingId) || meetings[2];

  const allActionItems: ActionItem[] = [];
  meetings.forEach((m) => {
    m.extractedActionItems.forEach((a) => allActionItems.push(a));
  });

  const allConflicts: Conflict[] = [];
  meetings.forEach((m) => {
    m.detectedConflicts.forEach((c) => allConflicts.push(c));
  });

  const unresolvedConflictCount = allConflicts.filter((c) => c.resolutionState === 'unresolved').length;
  const pendingTaskCount = allActionItems.filter((a) => a.status === 'pending_confirmation').length;

  const handleAnalyzeMeeting = (transcript: string, title: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const pastMeetings = meetings.filter((m) => m.id !== currentMeeting.id);
      const utterancesLines = transcript.split('\n').filter((l) => l.trim().length > 0);

      const detectedConflicts = AiAgentService.detectCrossMeetingConflicts(
        title,
        utterancesLines,
        pastMeetings
      );

      const { decisions, actionItems, summary } = AiAgentService.extractEntitiesFromTranscript(
        transcript,
        speakers
      );

      setMeetings((prev) =>
        prev.map((m) =>
          m.id === currentMeeting.id
            ? {
                ...m,
                title,
                rawTranscript: transcript,
                extractedDecisions: decisions.length > 0 ? decisions : m.extractedDecisions,
                extractedActionItems: actionItems.length > 0 ? actionItems : m.extractedActionItems,
                detectedConflicts,
                summary,
                status: 'analyzed',
              }
            : m
        )
      );

      setIsAnalyzing(false);
      sfx.playSuccess();
      if (detectedConflicts.length > 0) {
        setActiveTab('conflicts');
      } else {
        setActiveTab('staging');
      }
    }, 900);
  };

  const handleIngestVoiceNote = (cleanedText: string, rawText: string) => {
    const newDecision: Decision = {
      id: `dec_voice_${Date.now()}`,
      meetingId: currentMeeting.id,
      meetingTitle: currentMeeting.title,
      meetingDate: '2026-10-31',
      title: cleanedText.slice(0, 60),
      description: cleanedText,
      category: 'architecture',
      status: 'active',
      ownerId: speakers[0].id,
      confidenceScore: 0.98,
    };

    const newActionItem: ActionItem = {
      id: `act_voice_${Date.now()}`,
      meetingId: currentMeeting.id,
      title: `Execute: ${cleanedText.slice(0, 50)}...`,
      description: cleanedText,
      assigneeId: speakers[1].id,
      deadline: '2026-11-04',
      priority: 'P0',
      status: 'pending_confirmation',
      targetTracker: 'linear',
      estimatedHours: 8,
      tags: ['voice-dictated', 'wispr-flow', 'priority-p0'],
    };

    setMeetings((prev) =>
      prev.map((m) =>
        m.id === currentMeeting.id
          ? {
              ...m,
              rawTranscript: `${m.rawTranscript}\n\n[Wispr Voice Note by Priya Sharma]: ${rawText}`,
              extractedDecisions: [newDecision, ...m.extractedDecisions],
              extractedActionItems: [newActionItem, ...m.extractedActionItems],
            }
          : m
      )
    );

    setActiveTab('staging');
  };

  const handleResolveConflict = (
    conflictId: string,
    resolutionState: Conflict['resolutionState'],
    notes: string
  ) => {
    setMeetings((prev) =>
      prev.map((m) => ({
        ...m,
        detectedConflicts: m.detectedConflicts.map((c) =>
          c.id === conflictId ? { ...c, resolutionState, resolutionNotes: notes } : c
        ),
        extractedDecisions: m.extractedDecisions.map((d) => {
          if (resolutionState === 'override_past' && d.status === 'disputed') {
            return { ...d, status: 'active' };
          }
          if (resolutionState === 'revert_to_past' && d.status === 'disputed') {
            return { ...d, status: 'deprecated' };
          }
          return d;
        }),
      }))
    );
  };

  const handleConfirmTasks = (taskIds: string[]) => {
    setMeetings((prev) =>
      prev.map((m) => ({
        ...m,
        extractedActionItems: m.extractedActionItems.map((a) =>
          taskIds.includes(a.id)
            ? {
                ...a,
                status: 'synced_to_tracker',
                trackerTicketKey:
                  a.targetTracker === 'linear'
                    ? `LIN-${Math.floor(Math.random() * 800) + 100}`
                    : a.targetTracker === 'jira'
                    ? `JIR-${Math.floor(Math.random() * 800) + 100}`
                    : `#slack-${Math.floor(Math.random() * 90) + 10}`,
              }
            : a
        ),
      }))
    );
  };

  const handleTriggerReminder = (reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, status: 'sent' } : r))
    );
  };

  const handleResetDemo = () => {
    setMeetings(SEED_MEETINGS);
    setReminders(SEED_REMINDERS);
    setActiveTab('ingestion');
  };

  const handleCommandPaletteSelect = (actionId: string) => {
    if (actionId === 'voice_modal') {
      setIsVoiceModalOpen(true);
    } else if (actionId === 'linkedin_modal') {
      setIsLinkedInModalOpen(true);
    } else if (actionId.startsWith('tab_')) {
      setActiveTab(actionId.replace('tab_', ''));
    }
  };

  const handleToggleSound = () => {
    const newState = sfx.toggleSound();
    setIsSoundEnabled(newState);
    if (newState) sfx.playClick();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openVoiceModal={() => setIsVoiceModalOpen(true)}
        openLinkedInModal={() => setIsLinkedInModalOpen(true)}
        openCommandPalette={() => setIsCommandPaletteOpen(true)}
        unresolvedConflictCount={unresolvedConflictCount}
        pendingTaskCount={pendingTaskCount}
        onResetDemo={handleResetDemo}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'ingestion' && (
          <MeetingIngestion
            currentMeeting={currentMeeting}
            speakers={speakers}
            onAnalyzeMeeting={handleAnalyzeMeeting}
            openVoiceModal={() => setIsVoiceModalOpen(true)}
            goToConflicts={() => setActiveTab('conflicts')}
            goToStaging={() => setActiveTab('staging')}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'memory' && (
          <CrossMeetingMemoryGraph
            meetings={meetings}
            speakers={speakers}
            onSelectConflict={() => setActiveTab('conflicts')}
          />
        )}

        {activeTab === 'conflicts' && (
          <ConflictAlertCenter
            conflicts={allConflicts}
            onResolveConflict={handleResolveConflict}
            goToStaging={() => setActiveTab('staging')}
          />
        )}

        {activeTab === 'staging' && (
          <ExecutionStaging
            actionItems={allActionItems}
            speakers={speakers}
            onConfirmTasks={handleConfirmTasks}
          />
        )}

        {activeTab === 'digest' && (
          <WeeklyDigestView
            speakers={speakers}
            meetings={meetings}
            actionItems={allActionItems}
          />
        )}

        {activeTab === 'reminders' && (
          <RemindersTimeline
            reminders={reminders}
            onTriggerReminder={handleTriggerReminder}
          />
        )}
      </main>

      {/* Modals & Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandPaletteSelect}
      />

      <VoiceWisprInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onIngestVoiceNote={handleIngestVoiceNote}
      />

      <LinkedInSubmissionModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-300">SyncPulse AI</span>
            <span>• Built for Product Space Agentic AI Hackathon with Wispr Flow</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="text-violet-400 hover:text-violet-300 transition-colors cursor-pointer font-medium"
            >
              Wispr Voice Studio
            </button>
            <button
              onClick={() => setIsLinkedInModalOpen(true)}
              className="text-sky-400 hover:text-sky-300 transition-colors cursor-pointer font-medium"
            >
              LinkedIn Bonus Templates (+10)
            </button>
            <a
              href="https://theproductspace.in/ai-hackathon-details"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              Hackathon Details
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
