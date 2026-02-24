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
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-primary-foreground py-6 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10 mb-4" onClick={() => navigate("/subjects")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Subjects
          </Button>
          <h1 className="text-3xl font-display font-bold">{subject?.name || "Tests"}</h1>
          <p className="opacity-80 mt-1">Available tests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {tests.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">No Tests Available</h2>
            <p className="text-muted-foreground">No tests have been created for this subject yet.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-card rounded-2xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-card-hover transition-shadow"
              >
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground">{test.title}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" /> {test.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-4 w-4" /> {test.questions.length} questions
                    </span>
                  </div>
                </div>
                <Button
                  className="gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                  onClick={() => navigate(`/test/${test.id}`)}
                  disabled={test.questions.length === 0}
                >
                  <PlayCircle className="h-4 w-4 mr-2" /> Start Test
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
