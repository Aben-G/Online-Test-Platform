import { useNavigate } from "react-router-dom";
import type { TestResult } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle, XCircle, ArrowRight, Home } from "lucide-react";

const ResultPage = () => {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem("lastResult");
  const result: TestResult | null = raw ? JSON.parse(raw) : null;

  if (!result) {
    navigate("/");
    return null;
  }

  const wrong = result.totalQuestions - result.correctAnswers;
  const passed = result.score >= 50;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-scale-in">
        <div className="bg-card rounded-2xl shadow-elevated p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? "gradient-primary" : "bg-destructive"}`}>
            <Trophy className="h-10 w-10 text-primary-foreground" />
          </div>

          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            {passed ? "Great Job!" : "Keep Trying!"}
          </h1>
          <p className="text-muted-foreground mb-6 font-medium">{result.studentName} • {result.testTitle}</p>

          <div className="text-6xl font-display font-bold text-primary mb-6">
            {result.score}%
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-2xl font-bold text-foreground">{result.totalQuestions}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <div className="flex items-center justify-center gap-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-2xl font-bold text-foreground">{result.correctAnswers}</span>
              </div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <div className="flex items-center justify-center gap-1">
                <XCircle className="h-4 w-4 text-destructive" />
                <span className="text-2xl font-bold text-foreground">{wrong}</span>
              </div>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
              onClick={() => navigate("/subjects")}
            >
              Take Another Test <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full rounded-xl" onClick={() => navigate("/")}>
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
