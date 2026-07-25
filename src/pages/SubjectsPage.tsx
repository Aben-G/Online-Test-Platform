import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, type Subject } from "@/lib/store";
import {
  BookOpen,
  ArrowLeft,
  Code,
  Calculator,
  Atom,
  Languages,
  Palette,
  Music,
  History,
  TrendingUp,
  Landmark,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-8 w-8" />,
  calculator: <Calculator className="h-8 w-8" />,
  atom: <Atom className="h-8 w-8" />,
  languages: <Languages className="h-8 w-8" />,
  palette: <Palette className="h-8 w-8" />,
  music: <Music className="h-8 w-8" />,
  history: <History className="h-8 w-8" />,
  "trending-up": <TrendingUp className="h-8 w-8" />,
  landmark: <Landmark className="h-8 w-8" />,
  globe: <Globe className="h-8 w-8" />,
};

const SubjectsPage = () => {
  const navigate = useNavigate();
  const studentName = sessionStorage.getItem("studentName");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    getSubjects().then(setSubjects);
  }, []);

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
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <span className="text-sm font-semibold opacity-95 text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">
              Hi, {studentName}
            </span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Choose a Subject</h1>
          <p className="opacity-90 mt-1 text-sm text-slate-200">Select a subject to view available tests</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {subjects.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <BookOpen className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="text-xl font-display font-semibold text-foreground dark:text-white mb-2">No Subjects Yet</h2>
            <p className="text-muted-foreground dark:text-slate-300">The admin hasn't created any subjects yet. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => navigate(`/subjects/${subject.id}/tests`)}
                className="bg-card border border-border/60 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 text-left group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[subject.icon] || <BookOpen className="h-8 w-8" />}
                </div>
                <h3 className="text-lg font-display font-bold text-foreground dark:text-white mb-1">{subject.name}</h3>
                <p className="text-sm text-muted-foreground dark:text-slate-300">{subject.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
