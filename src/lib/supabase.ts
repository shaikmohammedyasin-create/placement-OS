import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  PlannerEvent,
  JobApplication,
  UserProject,
  PlacementTest,
  PlacementInterview,
  ManifestationProfile,
  DailyFocusState
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
      durationMinutes: row.duration_minutes || 60,
      category: row.category || 'General',
      status: row.status || 'scheduled',
      link: row.link,
      location: row.location,
      notes: row.notes,
      roadmapNodeId: row.roadmap_node_id,
      createdAt: row.created_at
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
      duration_minutes: event.durationMinutes || 60,
      category: event.category,
      status: event.status,
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
      applicationDate: row.application_date,
      deadline: row.deadline,
      status: row.status,
      jobLink: row.job_link,
      packageLPA: row.package_lpa ? Number(row.package_lpa) : 23.3,
      referral: row.referral,
      oaDate: row.oa_date,
      interviewDate: row.interview_date,
      currentStage: row.current_stage,
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
      application_date: app.applicationDate,
      deadline: app.deadline || null,
      status: app.status,
      job_link: app.jobLink || null,
      package_lpa: app.packageLPA || 23.3,
      referral: app.referral || null,
      oa_date: app.oaDate || null,
      interview_date: app.interviewDate || null,
      current_stage: app.currentStage || null,
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
      technologies: Array.isArray(row.technologies) ? row.technologies : [],
      status: row.status,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      features: Array.isArray(row.features) ? row.features : [],
      deployment: row.deployment,
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
      technologies: proj.technologies || [],
      status: proj.status,
      github_url: proj.githubUrl || null,
      live_url: proj.liveUrl || null,
      features: proj.features || [],
      deployment: proj.deployment || null,
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
 * 4. TEST RESULTS (Structured post-test scores linked to events)
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
      score: testResult.score ?? null,
      max_score: testResult.maxScore ?? null,
      percentage: testResult.percentage ?? null,
      questions_count: testResult.questionsCount ?? null,
      correct_count: testResult.correctCount ?? null,
      incorrect_count: testResult.incorrectCount ?? null,
      skipped_count: testResult.skippedCount ?? null,
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
 * 5. INTERVIEW NOTES (Structured interview feedback linked to events)
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
      created_at: interviewNote.createdAt || new Date().toISOString()
    };
    const { error } = await supabase.from('interview_notes').upsert(payload, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

/**
 * 6. USER SETTINGS (Profile, targets, progress, daily focus, manifestation)
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

    const { error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
}
