import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestsBySubject, getSubjects, type Subject, type Test } from "@/lib/store";
import { ArrowLeft, Clock, FileText, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestsListPage = () => {
  const navigate = useNavigate();
  const { subjectId } = useParams<{ subjectId: string }>();
  const studentName = sessionStorage.getItem("studentName");
  
  const [subject, setSubject] = useState<Subject | undefined>(undefined);
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!subjectId) return;
      const allSubjects = await getSubjects();
      setSubject(allSubjects.find((s) => s.id === subjectId));
      
      const subjectTests = await getTestsBySubject(subjectId);
      setTests(subjectTests);
    }
    loadData();
  }, [subjectId]);

  if (!studentName) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="gradient-hero text-primary-foreground py-6 px-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm shadow-sm transition-all"
              onClick={() => navigate("/subjects")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Subjects
            </Button>
            <span className="text-sm font-semibold opacity-95 text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Hi, {studentName}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">{subject?.name || "Tests"}</h1>
          <p className="opacity-90 mt-1 text-sm text-slate-200">Available tests for evaluation</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {tests.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <FileText className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground dark:text-white mb-2">No Tests Available</h2>
            <p className="text-muted-foreground dark:text-slate-300">No tests have been created for this subject yet.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-card border border-border/60 rounded-2xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card-hover transition-all"
              >
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground dark:text-white">{test.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground dark:text-slate-300">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-4 w-4 text-amber-500" /> {test.duration} min
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="h-4 w-4 text-blue-400" /> {test.questions.length} questions
                    </span>
                  </div>
                </div>
                <Button
                  className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl shadow-md transition-all px-6 py-2.5 active:scale-95 border-0"
                  onClick={() => navigate(`/test/${test.id}`)}
                  disabled={test.questions.length === 0}
                >
                  <PlayCircle className="h-5 w-5 mr-2" /> Start Test
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestsListPage;
