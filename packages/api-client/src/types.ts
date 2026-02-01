// Shared types for web and mobile apps

export type CourseStatus = 'generating' | 'complete' | 'error';

export interface Course {
  id: string;
  userId?: string;
  topic: string;
  title: string;
  subtitle?: string;
  modules: Module[];
  createdAt: string;
  status: CourseStatus;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: Quiz;
}

export interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface User {
  id: string;
  email: string;
  plan: 'free' | 'per_course' | 'pro';
  createdAt: string;
}

export interface OwnedCourse {
  courseId: string;
  userId: string;
  purchaseType: 'free' | 'purchased';
  purchasedAt: string;
}
