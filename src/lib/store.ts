import { supabase } from "@/lib/supabase";

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const DEFAULT_SUBJECTS = [
  {
    name: "Mathematics",
    description: "Practice arithmetic, algebra, and problem-solving.",
    icon: "calculator",
  },
  {
    name: "Science",
    description: "Explore physics, chemistry, and biology basics.",
    icon: "atom",
  },
  {
    name: "English",
    description: "Improve grammar, comprehension, and vocabulary.",
    icon: "languages",
  },
  {
    name: "History",
    description: "Review timelines, events, and key civilizations.",
    icon: "history",
  },
  {
    name: "Economics",
    description: "Understand markets, trade, and basic finance concepts.",
    icon: "trending-up",
  },
  {
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
  id: string;
  studentName: string;
  testId: string;
  subjectId?: string;
  testTitle?: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // Percentage (DB 'score')
  date: string;
}

export async function getTestResults(): Promise<TestResult[]> {
  const { data, error } = await supabase
    .from("test_results")
    .select(`
      *,
      tests (
        id,
        title,
        subject_id,
        subjects (
          id,
          name
        )
      )
    `)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error fetching results:", error);
    return [];
  }

  return data.map((r: any) => ({
    id: r.id,
    studentName: r.student_name,
    testId: r.test_id,
    subjectId: r.tests?.subject_id,
    testTitle: r.tests?.title,
    totalQuestions: r.total_questions,
    correctAnswers: r.correct_answers || 0,
    score: r.score, 
    date: r.completed_at,
  }));
}

export async function saveTestResult(result: Omit<TestResult, "id" | "date" | "testTitle" | "subjectId">) {
  const { error } = await supabase.from("test_results").insert({
    test_id: result.testId,
    student_name: result.studentName,
    score: result.score,
    total_questions: result.totalQuestions,
    correct_answers: result.correctAnswers,
    // completed_at handled by DB default
  });

  if (error) {
    console.error("Error saving result:", error);
    throw error;
  }
}

// Subjects
export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase.from("subjects").select("*");
  if (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
  
  return data as Subject[];
}

export async function addSubject(subject: Omit<Subject, "id">) {
  const { error } = await supabase.from("subjects").insert(subject);
  if (error) console.error("Error adding subject:", error);
}

export async function updateSubject(id: string, updated: Partial<Subject>) {
  const { error } = await supabase.from("subjects").update(updated).eq("id", id);
  if (error) console.error("Error updating subject:", error);
}

export async function deleteSubject(id: string) {
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) console.error("Error deleting subject:", error);
  // Also cascading delete tests if not handled by DB constraint
  // With ON DELETE CASCADE in SQL, DB handles it.
}

// Tests
export async function getTests(): Promise<Test[]> {
  // Fetch tests with their questions
  const { data: testsData, error: testsError } = await supabase
    .from("tests")
    .select(`
      *,
      questions (*)
    `);

  if (testsError) {
    console.error("Error fetching tests:", testsError);
    return [];
  }

  // Transform to match interface
  return testsData.map((t: any) => ({
    id: t.id,
    subjectId: t.subject_id,
    title: t.title,
    duration: t.duration,
    questions: (t.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      correctIndex: q.correct_index,
    })),
  }));
}

export async function addTest(test: Omit<Test, "id">) {
  // 1. Insert test
  const { data: testData, error: testError } = await supabase
    .from("tests")
    .insert({
      subject_id: test.subjectId,
      title: test.title,
      duration: test.duration,
    })
    .select()
    .single();

  if (testError || !testData) {
    console.error("Error adding test:", testError);
    return;
  }

  // 2. Insert questions
  if (test.questions && test.questions.length > 0) {
    const questionsToInsert = test.questions.map((q) => ({
      test_id: testData.id,
      text: q.text,
      options: q.options,
      correct_index: q.correctIndex,
    }));

    const { error: qError } = await supabase.from("questions").insert(questionsToInsert);
    if (qError) console.error("Error adding questions:", qError);
  }
}

export async function updateTest(id: string, updated: Partial<Test>) {
  // 1. Update test fields
  const { error: testError } = await supabase
    .from("tests")
    .update({
      title: updated.title,
      duration: updated.duration,
      subject_id: updated.subjectId,
    })
    .eq("id", id);

  if (testError) {
    console.error("Error updating test:", testError);
    return;
  }

  // 2. Update questions (Full replacement strategy for simplicity)
  if (updated.questions) {
    await supabase.from("questions").delete().eq("test_id", id);

    const questionsToInsert = updated.questions.map((q) => ({
      test_id: id,
      text: q.text,
      options: q.options,
      correct_index: q.correctIndex,
    }));

    if (questionsToInsert.length > 0) {
      const { error: qError } = await supabase.from("questions").insert(questionsToInsert);
      if (qError) console.error("Error updating questions:", qError);
    }
  }
}

export async function deleteTest(id: string) {
  const { error } = await supabase.from("tests").delete().eq("id", id);
  if (error) console.error("Error deleting test:", error);
}

export async function getTestsBySubject(subjectId: string): Promise<Test[]> {
  const { data: testsData, error } = await supabase
    .from("tests")
    .select(`
      *,
      questions (*)
    `)
    .eq("subject_id", subjectId);

  if (error) {
    console.error("Error fetching tests by subject:", error);
    return [];
  }

  return testsData.map((t: any) => ({
    id: t.id,
    subjectId: t.subject_id,
    title: t.title,
    duration: t.duration,
    questions: (t.questions || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      options: q.options,
      correctIndex: q.correct_index,
    })),
  }));
}

export function generateId(): string {
  // Usually handled by DB, but kept for temp UI state if needed
  return Math.random().toString(36).substring(2, 10);
}
