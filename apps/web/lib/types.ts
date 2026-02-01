// TypeScript type definitions

export interface Course {
  id: string;
  user_id?: string;
  topic: string;
  skill_level: string;
  goal: string;
  time_available: string;
  content: CourseContent;
  paid: boolean;
  created_at: string;
}

export interface CourseContent {
  title: string;
  estimated_time?: string;
  modules: Module[];
  next_steps?: string[];
}

export interface Module {
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface Lesson {
  title: string;
  content: string;
  quiz?: Quiz;
}

export interface Quiz {
  question: string;
  answer?: string;
}

export interface EmailSignup {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

export interface CourseFeedback {
  id: string;
  course_id: string;
  rating: number;
  feedback?: string;
  email?: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_name: string;
  properties: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface Stats {
  totalCourses: number;
  paidCourses: number;
  emailSignups: number;
  coursesToday: number;
  revenue: number;
  topTopics: TopTopic[];
  lastUpdated: string;
}

export interface TopTopic {
  topic: string;
  count: number;
}

export interface HealthCheck {
  timestamp: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    [key: string]: {
      status: 'ok' | 'error' | 'unknown';
      message: string;
    };
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CourseGenerationRequest {
  topic: string;
  skillLevel: string;
  goal: string;
  timeAvailable: string;
}

export interface CourseGenerationResponse {
  success: boolean;
  course: CourseContent;
  courseId?: string;
}

export interface FeedbackRequest {
  courseId: string;
  rating: number;
  feedback?: string;
  email?: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentFeedback: CourseFeedback[];
}

export type SituationValue = 'visiting_factory' | 'job_interview' | 'career_switch' | 'curious';
export type TimelineValue = 'tomorrow' | 'this_week' | 'no_rush';
export type GoalValue = 'sound_smart' | 'ask_questions' | 'understand';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface OnboardingState {
  topic: string;
  situation: SituationValue | '';
  timeline: TimelineValue | '';
  goal: GoalValue | '';
}

export type ConversationStep = 'topic' | 'situation' | 'timeline' | 'goal' | 'generating' | 'complete';

// LEARNER FINGERPRINT MODEL
export interface LearnerFingerprint {
  // Core Demographics
  topic: string;
  
  // Learning Style (how they absorb information)
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'mixed';
  
  // Prior Knowledge (foundation level)
  priorKnowledge: 'none' | 'beginner' | 'some_exposure' | 'intermediate' | 'advanced';
  
  // Learning Goal (what they want to achieve)
  learningGoal: 'career' | 'job_interview' | 'hobby' | 'academic' | 'teach_others' | 'sound_smart';
  
  // Time Commitment (how much time they have)
  timeCommitment: '30_min' | '1_hour' | '2_hours' | '1_week' | 'no_rush';
  
  // Content Format (preferred delivery method)
  contentFormat: 'text_heavy' | 'visual_diagrams' | 'examples_first' | 'theory_first' | 'mixed';
  
  // Challenge Preference (difficulty progression)
  challengePreference: 'easy_to_hard' | 'adaptive' | 'deep_dive' | 'practical_only';
  
  // Context (why learning this NOW)
  context?: string;
  
  // Timestamp
  createdAt: string;
}

export interface OnboardingComplete {
  isComplete: boolean;
  fingerprint?: LearnerFingerprint;
  missingFields?: string[];
}

// Function to check if onboarding is complete
export function isOnboardingComplete(fingerprint: Partial<LearnerFingerprint>): OnboardingComplete {
  const requiredFields: (keyof LearnerFingerprint)[] = [
    'topic',
    'learningStyle', 
    'priorKnowledge',
    'learningGoal',
    'timeCommitment',
    'contentFormat',
    'challengePreference'
  ];
  
  const missingFields = requiredFields.filter(field => !fingerprint[field]);
  
  return {
    isComplete: missingFields.length === 0,
    fingerprint: missingFields.length === 0 ? fingerprint as LearnerFingerprint : undefined,
    missingFields
  };
}
