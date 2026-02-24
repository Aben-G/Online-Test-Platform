import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTests } from "@/lib/store";
import type { Test, TestResult } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const TakeTestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const studentName = sessionStorage.getItem("studentName");
  
  const [test, setTest] = useState<Test | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTest() {
      const allTests = await getTests();
      if (testId) {
        setTest(allTests.find((t) => t.id === testId));
      }
      setIsLoading(false);
    }
    fetchTest();
  }, [testId]);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (test) {
      setAnswers(new Array(test.questions.length).fill(null));
      const dur = test.duration || 10;
      setTimeLeft(dur * 60);
      setCurrentQ(0);
      setSubmitted(false);
      submittedRef.current = false;
    }
  }, [test]);


  
  const answersRef = useRef<(number | null)[]>([]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const handleSubmitRef = useRef(() => {});

  const handleSubmit = () => {
    if (!test || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    
    let correct = 0;
    const currentAnswers = answersRef.current;
    
    test.questions.forEach((q, i) => {
      if (currentAnswers[i] === q.correctIndex) correct++;
    });

    const result: TestResult = {
      studentName: studentName || "Unknown",
      testTitle: test.title,
      totalQuestions: test.questions.length,
      correctAnswers: correct,
      score: Math.round((correct / test.questions.length) * 100),
    };
    sessionStorage.setItem("lastResult", JSON.stringify(result));
    navigate("/result");
  };

  handleSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (timeLeft < 0 || !test || submitted) return;
    if (timeLeft === 0) {
      handleSubmitRef.current();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test, submitted]);

  if (!studentName) { navigate("/"); return null; }
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading test...</div>;
  if (!test) return <div className="min-h-screen flex items-center justify-center text-foreground">Test not found</div>;

  const question = test.questions[currentQ];
  if (!question) return <div>Question not found</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="gradient-hero text-primary-foreground py-4 px-4">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-display font-bold">{test.title}</h1>
            <p className="text-sm opacity-80">{studentName}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-primary-foreground/10 rounded-lg px-3 py-1">
              {currentQ + 1} / {test.questions.length}
            </span>
            <span className={`flex items-center gap-1 text-sm font-mono font-bold px-3 py-1 rounded-lg ${isLowTime ? "bg-destructive/80 animate-pulse" : "bg-primary-foreground/10"}`}>
              <Clock className="h-4 w-4" />
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-8 animate-fade-in" key={currentQ}>
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const newAnswers = [...answers];
                  newAnswers[currentQ] = idx;
                  setAnswers(newAnswers);
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  answers[currentQ] === idx
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                  answers[currentQ] === idx
                    ? "gradient-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {optionLabels[idx]}
                </span>
                <span className="text-foreground">{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            className="rounded-xl"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ((c) => c - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          {currentQ < test.questions.length - 1 ? (
            <Button
              className="gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              onClick={() => setCurrentQ((c) => c + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              className="bg-accent text-accent-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold"
              onClick={handleSubmit}
            >
              <AlertCircle className="h-4 w-4 mr-2" /> Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeTestPage;
