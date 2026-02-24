export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: "subj-math",
    name: "Mathematics",
    description: "Practice arithmetic, algebra, and problem-solving.",
    icon: "calculator",
  },
  {
    id: "subj-science",
    name: "Science",
    description: "Explore physics, chemistry, and biology basics.",
    icon: "atom",
  },
  {
    id: "subj-english",
    name: "English",
    description: "Improve grammar, comprehension, and vocabulary.",
    icon: "languages",
  },
  {
    id: "subj-history",
    name: "History",
    description: "Review timelines, events, and key civilizations.",
    icon: "history",
  },
  {
    id: "subj-economics",
    name: "Economics",
    description: "Understand markets, trade, and basic finance concepts.",
    icon: "trending-up",
  },
  {
    id: "subj-social-studies",
    name: "Social Studies",
    description: "Learn civics, society, and world communities.",
    icon: "landmark",
  },
];

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3
}

export interface Test {
  id: string;
  subjectId: string;
  title: string;
  duration: number; // minutes
  questions: Question[];
}

export interface TestResult {
  studentName: string;
  testTitle: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
}

const SUBJECTS_KEY = "examplatform_subjects";
const TESTS_KEY = "examplatform_tests";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Subjects
export function getSubjects(): Subject[] {
  const subjects = load<Subject[]>(SUBJECTS_KEY, []);
  if (subjects.length === 0) {
    saveSubjects(DEFAULT_SUBJECTS);
    return DEFAULT_SUBJECTS;
  }
  return subjects;
}

export function saveSubjects(subjects: Subject[]) {
  save(SUBJECTS_KEY, subjects);
}

export function addSubject(subject: Subject) {
  const subjects = getSubjects();
  subjects.push(subject);
  saveSubjects(subjects);
}

export function updateSubject(id: string, updated: Partial<Subject>) {
  const subjects = getSubjects().map((s) => (s.id === id ? { ...s, ...updated } : s));
  saveSubjects(subjects);
}

export function deleteSubject(id: string) {
  saveSubjects(getSubjects().filter((s) => s.id !== id));
  // Also delete tests under this subject
  saveTests(getTests().filter((t) => t.subjectId !== id));
}

// Tests
export function getTests(): Test[] {
  return load<Test[]>(TESTS_KEY, []);
}

export function saveTests(tests: Test[]) {
  save(TESTS_KEY, tests);
}

export function addTest(test: Test) {
  const tests = getTests();
  tests.push(test);
  saveTests(tests);
}

export function updateTest(id: string, updated: Partial<Test>) {
  const tests = getTests().map((t) => (t.id === id ? { ...t, ...updated } : t));
  saveTests(tests);
}

export function deleteTest(id: string) {
  saveTests(getTests().filter((t) => t.id !== id));
}

export function getTestsBySubject(subjectId: string): Test[] {
  return getTests().filter((t) => t.subjectId === subjectId);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
