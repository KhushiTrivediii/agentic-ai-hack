export interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
  team: string;
}

export interface Decision {
  id: string;
  meetingId: string;
  meetingTitle?: string;
  meetingDate?: string;
  title: string;
  description: string;
  category: 'architecture' | 'scope' | 'timeline' | 'security' | 'pricing' | 'go_to_market';
  status: 'active' | 'superseded' | 'disputed' | 'deprecated';
  timestamp?: string;
  ownerId: string;
  confidenceScore: number;
  supersededBy?: string; // id of newer decision
}

export interface ActionItem {
  id: string;
  meetingId: string;
  title: string;
  description: string;
  assigneeId: string;
  deadline: string; // YYYY-MM-DD
  priority: 'P0' | 'P1' | 'P2';
  status: 'pending_confirmation' | 'approved' | 'synced_to_tracker' | 'rejected';
  targetTracker: 'linear' | 'jira' | 'slack' | 'github';
  trackerTicketKey?: string;
  estimatedHours?: number;
  tags: string[];
}

export interface Conflict {
  id: string;
  meetingId: string;
  currentStatement: string;
  conflictingDecisionId: string;
  conflictingMeetingTitle: string;
  conflictingMeetingDate: string;
  conflictingHistoricalStatement: string;
  type: 'decision_contradiction' | 'deadline_drift' | 'scope_creep' | 'ownership_clash';
  severity: 'critical' | 'high' | 'medium';
  analysisRationale: string;
  resolutionState: 'unresolved' | 'override_past' | 'revert_to_past' | 'compromise_accepted';
  resolutionNotes?: string;
}

export interface Utterance {
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  sprint: string;
  source: 'audio_upload' | 'live_wispr_flow' | 'transcript_paste' | 'zoom_sync';
  durationMinutes: number;
  participants: string[]; // speaker ids
  rawTranscript: string;
  utterances: Utterance[];
  extractedDecisions: Decision[];
  extractedActionItems: ActionItem[];
  detectedConflicts: Conflict[];
  summary: string;
  status: 'draft' | 'analyzed' | 'confirmed' | 'synced';
}

export interface Reminder {
  id: string;
  actionItemId: string;
  actionItemTitle: string;
  recipientId: string;
  recipientName: string;
  deadline: string;
  hoursUntilDeadline: number;
  urgency: 'gentle' | 'warning' | 'critical';
  scheduledTime: string;
  messageText: string;
  status: 'scheduled' | 'sent' | 'dismissed';
}

export interface WeeklyDigest {
  memberId: string;
  memberName: string;
  memberRole: string;
  weekLabel: string;
  committedTasks: ActionItem[];
  relevantDecisions: Decision[];
  impendingDeadlines: ActionItem[];
  potentialRisks: string[];
  executiveSummary: string;
}

export interface WisprSpeechTrace {
  rawVoiceInput: string;
  cleanedStructuredInput: string;
  detectedFillers: string[];
  selfCorrectionsResolved: Array<{ original: string; corrected: string }>;
  intentRecognized: string;
  confidence: number;
}
