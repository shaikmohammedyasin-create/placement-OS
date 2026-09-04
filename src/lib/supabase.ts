import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  PlannerEvent,
  JobApplication,
  UserProject,
  PlacementTest,
  PlacementInterview,
  ManifestationProfile,
  DailyFocusState,
  NetworkContact,
  FailureLog,
  BingoItem
} from '../types';

// Read env variables (supporting VITE_ prefix)
const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper CRUD operations with automatic Supabase & LocalStorage dual sync

/**
 * 1. EVENTS (ONE general table for study sessions, tests, interviews, exams, deadlines, milestones, etc.)
 */
export async function dbFetchEvents(): Promise<PlannerEvent[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.warn('Supabase fetch events error:', error.message);
      return null;
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      eventType: row.event_type,
      date: row.date,
      startTime: row.start_time,
      endTime: row.end_time,
      durationMinutes: row.duration_minutes || 60,
      company: row.company,
      role: row.role,
      category: row.category || 'General',
      status: row.status || 'scheduled',
      priority: row.priority,
      link: row.link,
      location: row.location,
      notes: row.notes,
      roadmapNodeId: row.roadmap_node_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (e) {
    console.warn('Supabase fetch events exception:', e);
    return null;
  }
}

export async function dbSaveEvent(event: PlannerEvent): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: event.id,
      title: event.title,
      event_type: event.eventType,
      date: event.date,
      start_time: event.startTime || null,
      end_time: event.endTime || null,
      duration_minutes: event.durationMinutes || 60,
      company: event.company || null,
      role: event.role || null,
      category: event.category,
      status: event.status,
      priority: event.priority || null,
      link: event.link || null,
      location: event.location || null,
      notes: event.notes || null,
      roadmap_node_id: event.roadmapNodeId || null,
      created_at: event.createdAt || new Date().toISOString()
    };

    const { error } = await supabase
      .from('events')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save event error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase save event exception:', e);
    return false;
  }
}

export async function dbDeleteEvent(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) console.warn('Supabase delete event error:', error.message);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 2. APPLICATIONS
 */
export async function dbFetchApplications(): Promise<JobApplication[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('application_date', { ascending: false });

    if (error) return null;

    return (data || []).map((row: any) => ({
      id: row.id,
      company: row.company,
      role: row.role,
      channel: row.channel || 'Campus',
      applicationDate: row.application_date,
      deadline: row.deadline,
      resumeVersion: row.resume_version,
      status: row.status,
      jobLink: row.job_link,
      packageLPA: row.package_lpa ? Number(row.package_lpa) : 15,
      referral: row.referral,
      oaDate: row.oa_date,
      interviewDate: row.interview_date,
      currentStage: row.current_stage,
      nextAction: row.next_action,
      followUpDate: row.follow_up_date,
      isInternship: Boolean(row.is_internship),
      notes: row.notes,
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function dbSaveApplication(app: JobApplication): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: app.id,
      company: app.company,
      role: app.role,
      channel: app.channel || 'Campus',
      application_date: app.applicationDate,
      deadline: app.deadline || null,
      resume_version: app.resumeVersion || null,
      status: app.status,
      job_link: app.jobLink || null,
      package_lpa: app.packageLPA || 15,
      referral: app.referral || null,
      oa_date: app.oaDate || null,
      interview_date: app.interviewDate || null,
      current_stage: app.currentStage || null,
      next_action: app.nextAction || null,
      follow_up_date: app.followUpDate || null,
      is_internship: Boolean(app.isInternship),
      notes: app.notes || null,
      created_at: app.createdAt || new Date().toISOString()
    };

    const { error } = await supabase
      .from('applications')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}

export async function dbDeleteApplication(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('applications').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 3. PROJECTS
 */
export async function dbFetchProjects(): Promise<UserProject[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      tier: row.tier,
      tierLabel: row.tier_label,
      isFlagship: Boolean(row.is_flagship),
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      status: row.status,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      features: Array.isArray(row.features) ? row.features : [],
      deployment: row.deployment,
      hasReadme: row.has_readme !== false,
      hasTests: Boolean(row.has_tests),
      defensibility: row.defensibility || {
        canExplainIn5Min: true,
        canExplainEveryTechChoice: true,
        canExplainArchitecture: true,
        canExplainTradeoffs: true,
        canExplainFailureHandling: false,
        canExplainDeployment: false,
        canExplainScaling: false
      },
      resumeStatus: row.resume_status,
      notes: row.notes,
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function dbSaveProject(proj: UserProject): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: proj.id,
      title: proj.title,
      tier: proj.tier,
      tier_label: proj.tierLabel || null,
      is_flagship: Boolean(proj.isFlagship),
      technologies: proj.technologies || [],
      status: proj.status,
      github_url: proj.githubUrl || null,
      live_url: proj.liveUrl || null,
      features: proj.features || [],
      deployment: proj.deployment || null,
      has_readme: proj.hasReadme !== false,
      has_tests: Boolean(proj.hasTests),
      defensibility: proj.defensibility || {},
      resume_status: proj.resumeStatus || null,
      notes: proj.notes || null,
      created_at: proj.createdAt || new Date().toISOString()
    };

    const { error } = await supabase
      .from('projects')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}

export async function dbDeleteProject(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 4. NETWORK CONTACTS
 */
export async function dbFetchNetworkContacts(): Promise<NetworkContact[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('network_contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return null;

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      company: row.company,
      role: row.role,
      connectionType: row.connection_type,
      dateContacted: row.date_contacted,
      lastContact: row.last_contact,
      nextAction: row.next_action,
      followUpDate: row.follow_up_date,
      status: row.status,
      notes: row.notes,
      linkedInUrl: row.linkedin_url,
      email: row.email,
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function dbSaveNetworkContact(contact: NetworkContact): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: contact.id,
      name: contact.name,
      company: contact.company,
      role: contact.role,
      connection_type: contact.connectionType,
      date_contacted: contact.dateContacted || null,
      last_contact: contact.lastContact || null,
      next_action: contact.nextAction || null,
      follow_up_date: contact.followUpDate || null,
      status: contact.status,
      notes: contact.notes || null,
      linkedin_url: contact.linkedInUrl || null,
      email: contact.email || null,
      created_at: contact.createdAt || new Date().toISOString()
    };

    const { error } = await supabase
      .from('network_contacts')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}

export async function dbDeleteNetworkContact(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('network_contacts').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 5. FAILURE LOGS
 */
export async function dbFetchFailureLogs(): Promise<FailureLog[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('failure_logs')
      .select('*')
      .order('logged_date', { ascending: false });

    if (error) return null;

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      sourceType: row.source_type,
      sourceId: row.source_id,
      companyOrContext: row.company_or_context,
      rootCause: row.root_cause,
      nextFixAction: row.next_fix_action,
      status: row.status,
      loggedDate: row.logged_date,
      resolvedDate: row.resolved_date,
      createdAt: row.created_at
    }));
  } catch {
    return null;
  }
}

export async function dbSaveFailureLog(log: FailureLog): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: log.id,
      title: log.title,
      category: log.category,
      source_type: log.sourceType,
      source_id: log.sourceId || null,
      company_or_context: log.companyOrContext || null,
      root_cause: log.rootCause,
      next_fix_action: log.nextFixAction,
      status: log.status,
      logged_date: log.loggedDate,
      resolved_date: log.resolvedDate || null,
      created_at: log.createdAt || new Date().toISOString()
    };

    const { error } = await supabase
      .from('failure_logs')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}

export async function dbDeleteFailureLog(id: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('failure_logs').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * 6. TEST RESULTS
 */
export async function dbSaveTestResult(testResult: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: testResult.id,
      event_id: testResult.eventId || null,
      test_name: testResult.testName,
      company: testResult.company || null,
      test_type: testResult.testType,
      score: testResult.score || null,
      max_score: testResult.maxScore || null,
      percentage: testResult.percentage || null,
      questions_count: testResult.questionsCount || null,
      correct_count: testResult.correctCount || null,
      incorrect_count: testResult.incorrectCount || null,
      skipped_count: testResult.skippedCount || null,
      weak_topics: testResult.weakTopics || [],
      test_mistakes_notes: testResult.testMistakesNotes || null,
      created_at: testResult.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('test_results').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * 7. INTERVIEW NOTES
 */
export async function dbSaveInterviewNotes(interviewNote: any): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = {
      id: interviewNote.id,
      event_id: interviewNote.eventId || null,
      company: interviewNote.company,
      role: interviewNote.role || null,
      round: interviewNote.round,
      interviewer: interviewNote.interviewer || null,
      questions_asked: interviewNote.questionsAsked || [],
      what_went_well: interviewNote.whatWentWell || null,
      what_went_badly: interviewNote.whatWentBadly || null,
      topics_tested: interviewNote.topicsTested || [],
      mistakes: interviewNote.mistakes || null,
      lessons: interviewNote.lessons || null,
      next_action: interviewNote.nextAction || null,
      verdict: interviewNote.verdict || 'Pending',
      mock_score: interviewNote.mockScore || null,
      created_at: interviewNote.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('interview_notes').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * 8. USER SETTINGS
 */
export async function dbFetchUserSettings(): Promise<any | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', 'default_user')
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function dbSaveUserSettings(settings: {
  userName?: string;
  targetPackage?: string;
  targetDream?: string;
  targetYear?: string;
  manifestation?: ManifestationProfile;
  nodeProgress?: any;
  dailyFocus?: DailyFocusState;
  bingoProgress?: any;
}): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload: any = {
      id: 'default_user',
      updated_at: new Date().toISOString()
    };

    if (settings.userName !== undefined) payload.user_name = settings.userName;
    if (settings.targetPackage !== undefined) payload.target_package = settings.targetPackage;
    if (settings.targetDream !== undefined) payload.target_dream = settings.targetDream;
    if (settings.targetYear !== undefined) payload.target_year = settings.targetYear;
    if (settings.manifestation !== undefined) payload.manifestation = settings.manifestation;
    if (settings.nodeProgress !== undefined) payload.node_progress = settings.nodeProgress;
    if (settings.dailyFocus !== undefined) payload.daily_focus = settings.dailyFocus;
    if (settings.bingoProgress !== undefined) payload.bingo_progress = settings.bingoProgress;

    const { error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}
