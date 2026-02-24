import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSubjects, addSubject, updateSubject, deleteSubject,
  getTests, addTest, updateTest, deleteTest,
  generateId,
} from "@/lib/store";
import type { Subject, Test, Question } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Plus, Trash2, Pencil, BookOpen, FileText, HelpCircle,
  LayoutDashboard, Save, X, ChevronDown, ChevronUp,
  Code, Calculator, Atom, Languages, Palette, Music, History, TrendingUp, Landmark, Globe,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const iconOptions = [
  "code",
  "calculator",
  "atom",
  "languages",
  "palette",
  "music",
  "history",
  "trending-up",
  "landmark",
  "globe",
];

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-4 w-4" />,
  calculator: <Calculator className="h-4 w-4" />,
  atom: <Atom className="h-4 w-4" />,
  languages: <Languages className="h-4 w-4" />,
  palette: <Palette className="h-4 w-4" />,
  music: <Music className="h-4 w-4" />,
  history: <History className="h-4 w-4" />,
  "trending-up": <TrendingUp className="h-4 w-4" />,
  landmark: <Landmark className="h-4 w-4" />,
  globe: <Globe className="h-4 w-4" />,
};

const AdminPage = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [tab, setTab] = useState<"subjects" | "tests">("subjects");

  // Subject form
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [subjectDesc, setSubjectDesc] = useState("");
  const [subjectIcon, setSubjectIcon] = useState("code");

  // Test form
  const [showTestForm, setShowTestForm] = useState(false);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState("");
  const [testSubjectId, setTestSubjectId] = useState("");
  const [testDuration, setTestDuration] = useState("10");
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  const refresh = async () => {
    setSubjects(await getSubjects());
    setTests(await getTests());
  };

  useEffect(() => {
    refresh();
  }, []);

  // Subject CRUD
  const openNewSubject = () => {
    setEditSubjectId(null);
    setSubjectName("");
    setSubjectDesc("");
    setSubjectIcon("code");
    setShowSubjectForm(true);
  };

  const openEditSubject = (s: Subject) => {
    setEditSubjectId(s.id);
    setSubjectName(s.name);
    setSubjectDesc(s.description);
    setSubjectIcon(s.icon);
    setShowSubjectForm(true);
  };

  const saveSubjectForm = async () => {
    if (!subjectName.trim()) return;
    if (editSubjectId) {
      await updateSubject(editSubjectId, { name: subjectName, description: subjectDesc, icon: subjectIcon });
    } else {
      await addSubject({ name: subjectName, description: subjectDesc, icon: subjectIcon });
    }
    setShowSubjectForm(false);
    refresh();
  };

  const removeSubject = async (id: string) => {
    await deleteSubject(id);
    refresh();
  };

  // Test CRUD
  const openNewTest = () => {
    setEditTestId(null);
    setTestTitle("");
    setTestSubjectId(subjects[0]?.id || "");
    setTestDuration("10");
    setTestQuestions([]);
    setShowTestForm(true);
  };

  const openEditTest = (t: Test) => {
    setEditTestId(t.id);
    setTestTitle(t.title);
    setTestSubjectId(t.subjectId);
    setTestDuration(String(t.duration));
    // Questions are now part of Test object from getTests
    setTestQuestions([...t.questions]);
    setShowTestForm(true);
  };

  const addQuestion = () => {
    setTestQuestions([
      ...testQuestions,
      { id: generateId(), text: "", options: ["", "", "", ""], correctIndex: 0 },
    ]);
    setExpandedQ(testQuestions.length);
  };

  const updateQuestion = (idx: number, updates: Partial<Question>) => {
    const newQ = [...testQuestions];
    newQ[idx] = { ...newQ[idx], ...updates };
    setTestQuestions(newQ);
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQ = [...testQuestions];
    const opts = [...newQ[qIdx].options] as [string, string, string, string];
    opts[oIdx] = value;
    newQ[qIdx] = { ...newQ[qIdx], options: opts };
    setTestQuestions(newQ);
  };

  const removeQuestion = (idx: number) => {
    setTestQuestions(testQuestions.filter((_, i) => i !== idx));
  };

  const saveTestForm = async () => {
    if (!testTitle.trim() || !testSubjectId) return;
    const testData = {
      title: testTitle,
      subjectId: testSubjectId,
      duration: parseInt(testDuration) || 10,
      questions: testQuestions,
    };
    if (editTestId) {
      await updateTest(editTestId, testData);
    } else {
      await addTest(testData);
    }
    setShowTestForm(false);
    refresh();
  };

  const removeTest = async (id: string) => {
    await deleteTest(id);
    refresh();
  };

  const totalQuestions = tests.reduce((acc, t) => acc + t.questions.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-primary-foreground py-6 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Home
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Subjects", value: subjects.length, icon: BookOpen },
            { label: "Tests", value: tests.length, icon: FileText },
            { label: "Questions", value: totalQuestions, icon: HelpCircle },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl shadow-card p-5 text-center">
              <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["subjects", "tests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setShowSubjectForm(false); setShowTestForm(false); }}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                tab === t ? "gradient-primary text-primary-foreground shadow-card" : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {t === "subjects" ? "Subjects" : "Tests & Questions"}
            </button>
          ))}
        </div>

        {/* SUBJECTS TAB */}
        {tab === "subjects" && (
          <div className="animate-fade-in">
            {!showSubjectForm && (
              <Button className="gradient-primary text-primary-foreground rounded-xl mb-4 hover:opacity-90" onClick={openNewSubject}>
                <Plus className="h-4 w-4 mr-2" /> New Subject
              </Button>
            )}

            {showSubjectForm && (
              <div className="bg-card rounded-2xl shadow-card p-6 mb-6 animate-scale-in">
                <h3 className="font-display font-semibold text-foreground mb-4">{editSubjectId ? "Edit" : "New"} Subject</h3>
                <div className="space-y-3">
                  <Input placeholder="Subject name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="rounded-xl" />
                  <Input placeholder="Description" value={subjectDesc} onChange={(e) => setSubjectDesc(e.target.value)} className="rounded-xl" />
                  <Select value={subjectIcon} onValueChange={setSubjectIcon}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((i) => (
                        <SelectItem key={i} value={i}>
                          <span className="inline-flex items-center gap-2">
                            {iconMap[i]}
                            {i}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button className="gradient-primary text-primary-foreground rounded-xl hover:opacity-90" onClick={saveSubjectForm}>
                      <Save className="h-4 w-4 mr-2" /> Save
                    </Button>
                    <Button variant="outline" className="rounded-xl" onClick={() => setShowSubjectForm(false)}>
                      <X className="h-4 w-4 mr-2" /> Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {subjects.map((s) => (
                <div key={s.id} className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center">
                      {iconMap[s.icon] || <BookOpen className="h-4 w-4" />}
                    </div>
                    <div>
                    <h4 className="font-semibold text-foreground">{s.name}</h4>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={() => openEditSubject(s)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeSubject(s.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTS TAB */}
        {tab === "tests" && (
          <div className="animate-fade-in">
            {!showTestForm && (
              <Button className="gradient-primary text-primary-foreground rounded-xl mb-4 hover:opacity-90" onClick={openNewTest} disabled={subjects.length === 0}>
                <Plus className="h-4 w-4 mr-2" /> New Test
              </Button>
            )}
            {subjects.length === 0 && !showTestForm && (
              <p className="text-muted-foreground text-sm mb-4">Create subjects first before adding tests.</p>
            )}

            {showTestForm && (
              <div className="bg-card rounded-2xl shadow-card p-6 mb-6 animate-scale-in">
                <h3 className="font-display font-semibold text-foreground mb-4">{editTestId ? "Edit" : "New"} Test</h3>
                <div className="space-y-3 mb-6">
                  <Input placeholder="Test title" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} className="rounded-xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={testSubjectId} onValueChange={setTestSubjectId}>
                      <SelectTrigger className="rounded-xl"><SelectValue placeholder="Subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Duration (min)" value={testDuration} onChange={(e) => setTestDuration(e.target.value)} className="rounded-xl" />
                  </div>
                </div>

                {/* Questions */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-semibold text-foreground">Questions ({testQuestions.length})</h4>
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={addQuestion}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {testQuestions.map((q, qi) => (
                      <div key={q.id} className="border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedQ(expandedQ === qi ? null : qi)}>
                          <span className="text-sm font-medium text-foreground">
                            Q{qi + 1}: {q.text || "(empty)"}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeQuestion(qi); }}>
                              <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                            {expandedQ === qi ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </div>
                        </div>

                        {expandedQ === qi && (
                          <div className="mt-3 space-y-3 animate-fade-in">
                            <Input
                              placeholder="Question text"
                              value={q.text}
                              onChange={(e) => updateQuestion(qi, { text: e.target.value })}
                              className="rounded-xl"
                            />
                            {q.options.map((opt, oi) => (
                              <div key={oi} className="flex items-center gap-2">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                  q.correctIndex === oi ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                                }`}>
                                  {["A", "B", "C", "D"][oi]}
                                </span>
                                <Input
                                  placeholder={`Option ${["A", "B", "C", "D"][oi]}`}
                                  value={opt}
                                  onChange={(e) => updateOption(qi, oi, e.target.value)}
                                  className="rounded-xl flex-1"
                                />
                                <button
                                  onClick={() => updateQuestion(qi, { correctIndex: oi })}
                                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                                    q.correctIndex === oi
                                      ? "gradient-primary text-primary-foreground"
                                      : "bg-secondary text-muted-foreground hover:bg-muted"
                                  }`}
                                >
                                  ✓
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button className="gradient-primary text-primary-foreground rounded-xl hover:opacity-90" onClick={saveTestForm}>
                    <Save className="h-4 w-4 mr-2" /> Save Test
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => setShowTestForm(false)}>
                    <X className="h-4 w-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Existing tests */}
            {!showTestForm && (
              <div className="space-y-3">
                {tests.map((t) => {
                  const subj = subjects.find((s) => s.id === t.subjectId);
                  return (
                    <div key={t.id} className="bg-card rounded-2xl shadow-card p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">{t.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {subj?.name || "Unknown"} · {t.duration} min · {t.questions.length} questions
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg" onClick={() => openEditTest(t)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => removeTest(t.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
