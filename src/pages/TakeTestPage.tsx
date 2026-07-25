import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTests, saveTestResult } from "@/lib/store";
import type { Test } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Clock, ChevronLeft, ChevronRight, AlertCircle, Eye, EyeOff, CheckCircle,
  Pencil, ChevronDown, ChevronUp, Check, HelpCircle
} from "lucide-react";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";

const TakeTestPage = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const studentName = sessionStorage.getItem("studentName");
  
  const [test, setTest] = useState<Test | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  
  // Review States
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(true);
  
  const submittedRef = useRef(false);

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

  useEffect(() => {
    if (test) {
      setAnswers(new Array(test.questions.length).fill(null));
      const dur = test.duration || 10;
      setTimeLeft(dur * 60);
      setCurrentQ(0);
      setSubmitted(false);
      submittedRef.current = false;
      setIsReviewing(false);
      setReviewPage(0);
      setEditingRow(null);
    }
  }, [test]);

  const answersRef = useRef<(number | null)[]>([]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const handleSubmitRef = useRef(() => {});

  const handleFinalSubmit = async () => {
    if (!test || submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    
    let correct = 0;
    const currentAnswers = answersRef.current;
    
    test.questions.forEach((q, i) => {
      if (currentAnswers[i] === q.correctIndex) correct++;
    });

    const score = Math.round((correct / test.questions.length) * 100);

    try {
      await saveTestResult({
        testId: test.id,
        studentName: studentName || "Unknown",
        totalQuestions: test.questions.length,
        correctAnswers: correct,
        score: score
      });
    } catch (err) {
      console.error("Failed to save result", err);
    }

    const resultForDisplay = {
      studentName: studentName || "Unknown",
      testTitle: test.title,
      totalQuestions: test.questions.length,
      correctAnswers: correct,
      score: score,
    };
    sessionStorage.setItem("lastResult", JSON.stringify(resultForDisplay));
    navigate("/result");
  };

  handleSubmitRef.current = handleFinalSubmit;

  useEffect(() => {
    if (timeLeft < 0 || !test || submitted) return;
    if (timeLeft === 0) {
      // Auto-submit when time runs out
      handleSubmitRef.current();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test, submitted]);

  if (!studentName) { navigate("/"); return null; }
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-foreground">Loading test...</div>;
  if (!test) return <div className="min-h-screen flex items-center justify-center text-foreground">Test not found</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 60;

  const optionLabels = ["A", "B", "C", "D"];

  // --- Review View Logic ---
  const ITEMS_PER_PAGE = 10;
  
  const renderReviewPage = () => {
    const totalQuestions = test.questions.length;
    const answeredCount = answers.filter((a) => a !== null).length;
    const unansweredCount = totalQuestions - answeredCount;

    const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);
    const startIdx = reviewPage * ITEMS_PER_PAGE;
    const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalQuestions);
    const currentQuestions = test.questions.slice(startIdx, endIdx);

    return (
      <div className="flex-1 container mx-auto px-3 sm:px-4 py-4 md:py-8 max-w-4xl animate-fade-in">
        {/* Header Summary */}
        <div className="bg-card border border-border/60 rounded-2xl p-4 sm:p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Review Your Answers</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Check your responses below. Click <span className="font-semibold text-primary">Edit</span> on any row to expand and change your answer right on this table.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm shrink-0">
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/20">
              {answeredCount} / {totalQuestions} Answered
            </span>
            {unansweredCount > 0 && (
              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold px-3 py-1.5 rounded-xl border border-amber-500/20">
                {unansweredCount} Unanswered
              </span>
            )}
          </div>
        </div>
        
        {/* Tabular Format */}
        <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-card mb-6">
          <Table>
            <TableHeader className="bg-secondary/60">
              <TableRow className="hover:bg-transparent border-b border-border/80">
                <TableHead className="w-12 text-center font-bold text-foreground">#</TableHead>
                <TableHead className="font-bold text-foreground">Question</TableHead>
                <TableHead className="w-48 sm:w-64 font-bold text-foreground">Selected Answer</TableHead>
                <TableHead className="w-28 text-right font-bold text-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentQuestions.map((q, idx) => {
                const globalIndex = startIdx + idx;
                const selectedAnswerIndex = answers[globalIndex];
                const isExpanded = editingRow === globalIndex;

                return (
                  <React.Fragment key={q.id || globalIndex}>
                    <TableRow 
                      className={`transition-colors ${isExpanded ? "bg-primary/5" : "hover:bg-secondary/40"}`}
                    >
                      <TableCell className="text-center font-mono font-bold text-primary">
                        {globalIndex + 1}
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        <span className="line-clamp-2 text-sm sm:text-base">{q.text}</span>
                      </TableCell>
                      <TableCell>
                        {selectedAnswerIndex !== null && selectedAnswerIndex !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md gradient-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                              {optionLabels[selectedAnswerIndex]}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-foreground truncate max-w-[140px] sm:max-w-[200px]">
                              {q.options[selectedAnswerIndex]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
                            Not Answered
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={isExpanded ? "default" : "outline"} 
                          size="sm" 
                          className={`rounded-xl transition-all ${
                            isExpanded 
                              ? "gradient-primary text-primary-foreground shadow-sm" 
                              : "hover:bg-primary/10 hover:text-primary"
                          }`}
                          onClick={() => setEditingRow(isExpanded ? null : globalIndex)}
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1" />
                          {isExpanded ? "Close" : "Edit"}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Inline Dropdown Effect for Editing Answer */}
                    {isExpanded && (
                      <TableRow className="bg-primary/5 border-b border-primary/20 hover:bg-primary/5 animate-fade-in">
                        <TableCell colSpan={4} className="p-4 sm:p-6">
                          <div className="bg-card border border-primary/20 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                              <span className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4" /> Select answer for Question #{globalIndex + 1}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs rounded-lg"
                                onClick={() => setEditingRow(null)}
                              >
                                Done
                              </Button>
                            </div>
                            <p className="text-sm font-medium text-foreground mb-3">{q.text}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIdx) => {
                                if (!opt || !opt.trim()) return null;
                                const isSelected = answers[globalIndex] === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => {
                                      const newAnswers = [...answers];
                                      newAnswers[globalIndex] = optIdx;
                                      setAnswers(newAnswers);
                                    }}
                                    className={`text-left p-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                      isSelected
                                        ? "border-primary bg-primary/10 font-semibold shadow-sm text-primary"
                                        : "border-border hover:border-primary/40 hover:bg-secondary/60 text-foreground"
                                    }`}
                                  >
                                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                      isSelected 
                                        ? "gradient-primary text-primary-foreground" 
                                        : "bg-secondary text-muted-foreground"
                                    }`}>
                                      {optionLabels[optIdx]}
                                    </span>
                                    <span className="text-xs sm:text-sm flex-1">{opt}</span>
                                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Review Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-6 sm:mb-8">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl"
              disabled={reviewPage === 0}
              onClick={() => {
                setReviewPage(p => p - 1);
                setEditingRow(null);
              }}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
            </Button>
            <span className="text-xs sm:text-sm font-semibold px-4 py-1.5 bg-secondary rounded-xl border border-border">
              Page {reviewPage + 1} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl"
              disabled={reviewPage === totalPages - 1}
              onClick={() => {
                setReviewPage(p => p + 1);
                setEditingRow(null);
              }}
            >
              Next Page <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t pt-4 sm:pt-6">
          <Button
            variant="outline" 
            onClick={() => {
              setIsReviewing(false);
              setEditingRow(null);
            }}
            className="gap-2 w-full sm:w-auto rounded-xl"
          >
            <ChevronLeft className="w-4 h-4" /> Return to Question View
          </Button>
          
          <Button
            className="gradient-primary text-primary-foreground rounded-xl font-bold px-6 sm:px-8 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            onClick={handleFinalSubmit}
          >
            <CheckCircle className="h-4 w-4 mr-2" /> Confirm & Submit Exam
          </Button>
        </div>
      </div>
    );
  };
  
  // --- Standard Question Logic ---
  const question = test.questions[currentQ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="gradient-hero text-primary-foreground py-3 sm:py-4 px-3 sm:px-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-lg font-display font-bold">{test.title}</h1>
            <p className="text-sm opacity-80">{studentName}</p>
          </div>
          <div className="flex items-center gap-4">
            {!isReviewing && (
              <span className="text-xs sm:text-sm bg-primary-foreground/10 rounded-lg px-2 sm:px-3 py-1 backdrop-blur-sm">
                Question {currentQ + 1} / {test.questions.length}
              </span>
            )}
            
            <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg backdrop-blur-sm border border-primary-foreground/10 ${isLowTime ? "bg-destructive/80 animate-pulse" : "bg-primary-foreground/10"}`}>
              {showTimer ? (
                <>
                  <Clock className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-mono font-bold w-[4ch]">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                </>
              ) : (
                <span className="text-xs sm:text-sm font-medium">Timer Hidden</span>
              )}
              
              <button 
                onClick={() => setShowTimer(!showTimer)}
                className="ml-1 sm:ml-2 hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
                title={showTimer ? "Hide Timer" : "Show Timer"}
              >
                {showTimer ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isReviewing ? renderReviewPage() : (
        /* Question View */
        <div className="flex-1 container mx-auto px-3 sm:px-4 py-4 md:py-8 max-w-2xl md:max-w-3xl flex flex-col justify-center">
          {question && (
            <div className="bg-card rounded-2xl shadow-card p-4 sm:p-6 md:p-8 animate-fade-in border border-border/50">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-foreground mb-5 sm:mb-8 leading-relaxed">
                {question.text}
              </h2>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  if (!option || !option.trim()) return null;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        const newAnswers = [...answers];
                        newAnswers[currentQ] = idx;
                        setAnswers(newAnswers);
                      }}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 sm:gap-4 group ${
                        answers[currentQ] === idx
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-secondary/50"
                      }`}
                    >
                      <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-colors ${
                        answers[currentQ] === idx
                          ? "gradient-primary text-primary-foreground shadow-md"
                          : "bg-secondary text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                      }`}>
                        {optionLabels[idx]}
                      </span>
                      <span className={`text-sm sm:text-base md:text-lg ${answers[currentQ] === idx ? "text-primary font-medium" : "text-foreground"}`}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 sm:mt-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-4 sm:px-6"
              disabled={currentQ === 0}
              onClick={() => setCurrentQ((c) => c - 1)}
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Previous
            </Button>

            {currentQ < test.questions.length - 1 ? (
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground rounded-xl px-4 sm:px-6 hover:opacity-90 transition-opacity"
                onClick={() => setCurrentQ((c) => c + 1)}
              >
                Next <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="bg-accent text-accent-foreground rounded-xl px-4 sm:px-6 hover:opacity-90 transition-opacity font-semibold"
                onClick={() => {
                  setIsReviewing(true);
                  setReviewPage(0);
                  setEditingRow(null);
                }}
              >
                <AlertCircle className="h-5 w-5 mr-2" /> Review Answers
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTestPage;

