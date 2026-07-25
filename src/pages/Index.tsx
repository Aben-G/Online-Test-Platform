import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Timer,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Check,
  Sun,
  Moon,
} from "lucide-react";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(() => sessionStorage.getItem("studentName") ?? "");
  const [showHelp, setShowHelp] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("appTheme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("appTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const canContinue = useMemo(() => name.trim().length > 0, [name]);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem("studentName", trimmed);
    navigate("/subjects");
  };

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col relative ${
      isDark ? "bg-[#080d1a] text-slate-100" : "bg-white text-slate-900"
    }`}>
      {/* Transparent Floating Header Navbar (Logo Left, Theme Toggle & Help Right) */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-transparent border-0 py-6 px-4 sm:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <button
            type="button"
            className="flex items-center gap-3 text-left group"
            onClick={() => navigate("/")}
          >
            <Logo size="md" className="transition-transform group-hover:scale-105" />
            <div className="leading-tight text-left">
              <div className={`font-display font-bold text-sm sm:text-base ${isDark ? "text-white" : "text-slate-900"}`}>
                Tshaye Tsidq Leadership and Mission College
              </div>
              <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Excellence • Leadership • Faith
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs font-semibold backdrop-blur-md px-3.5 py-2 transition-all shadow-sm ${
                isDark 
                  ? "bg-slate-900/60 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800" 
                  : "bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              onClick={toggleTheme}
              title={isDark ? "Switch to Full White Light Theme" : "Switch to Dark Blue Theme"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className={`rounded-full text-xs font-semibold backdrop-blur-md px-4 py-2 transition-all shadow-sm ${
                isDark 
                  ? "bg-slate-900/60 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800" 
                  : "bg-white/80 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
              }`}
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="w-4 h-4 mr-1.5 text-amber-500" /> Help
            </Button>
          </div>
        </div>
      </header>

      {/* Help Modal Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className={`rounded-3xl max-w-md ${
          isDark 
            ? "bg-slate-900 border-slate-700 text-slate-100" 
            : "bg-white border-slate-200 text-slate-900"
        }`}>
          <DialogHeader>
            <DialogTitle className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
              <HelpCircle className="w-5 h-5 text-amber-500" /> Exam Instructions & Help
            </DialogTitle>
            <DialogDescription className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Tshaye Tsidq Leadership and Mission College Portal Guide
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 font-bold flex items-center justify-center shrink-0 text-xs">1</div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Enter Your Name</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Type your full name on the homepage and click "Start Examination".</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center shrink-0 text-xs">2</div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Select a Course Subject</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Choose from the available college subjects and tests list.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-500 font-bold flex items-center justify-center shrink-0 text-xs">3</div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Answer & Review</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Complete the timed questions. Review your table of answers and edit inline before final submission.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center shrink-0 text-xs">4</div>
              <div>
                <p className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Instant Scoring</p>
                <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>Your exam score will be graded automatically upon submission.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative pt-32 pb-20 md:pt-40 md:pb-28 px-4 overflow-hidden transition-colors duration-300 ${
          isDark 
            ? "bg-gradient-to-b from-[#080d1a] via-[#0f172a] to-[#080d1a]" 
            : "bg-gradient-to-b from-slate-50 via-white to-slate-50"
        }`}>
          {/* Ambient Glowing Orbs */}
          {isDark ? (
            <>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
            </>
          ) : (
            <>
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-amber-200/40 rounded-full blur-[100px] pointer-events-none" />
            </>
          )}

          {/* Grid pattern overlay */}
          <div className={`absolute inset-0 bg-[size:3rem_3rem] pointer-events-none ${
            isDark 
              ? "bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)]" 
              : "bg-[linear-gradient(to_right,#cbd5e125_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e125_1px,transparent_1px)]"
          }`} />

          <div className="container mx-auto max-w-xl relative z-10 text-center animate-fade-in space-y-7">
            {/* Portal Label Text (No Card/Border Wrapper) */}
            <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}>
              <GraduationCap className="h-4 w-4 text-amber-500" />
              <span>Tshaye Tsidq Examination Portal</span>
            </div>

            {/* Heading */}
            <h1 className={`font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] ${
              isDark ? "text-white" : "text-slate-900"
            }`}>
              Empowering Faith & <br className="hidden sm:inline" />
              <span className="gradient-gold-text">Leadership Excellence</span>
            </h1>

            <p className={`text-base sm:text-lg max-w-lg mx-auto font-normal leading-relaxed ${
              isDark ? "text-slate-300" : "text-slate-600"
            }`}>
              Welcome to the official testing platform. Enter your full name below to begin your evaluation session.
            </p>

            {/* Clean Seamless Input & Action */}
            <div className="max-w-md mx-auto space-y-3 pt-2">
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className={`h-13 rounded-2xl text-base px-5 shadow-xl transition-colors ${
                  isDark 
                    ? "bg-slate-900/90 border-slate-700/80 text-white placeholder:text-slate-500 focus-visible:ring-amber-400 focus-visible:border-amber-400" 
                    : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                }`}
                autoComplete="name"
              />
              <Button
                className={`w-full h-13 font-extrabold rounded-2xl text-base transition-all shadow-lg active:scale-[0.99] ${
                  isDark 
                    ? "bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20" 
                    : "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-500/25"
                }`}
                onClick={handleContinue}
                disabled={!canContinue}
              >
                Start Examination <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Feature Badges */}
            <div className={`flex justify-center items-center gap-6 pt-4 text-xs ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}>
              <div className="flex items-center gap-2 font-medium">
                <Timer className="h-4 w-4 text-amber-500" /> Timed Countdown
              </div>
              <div className="flex items-center gap-2 font-medium">
                <BarChart3 className="h-4 w-4 text-blue-500" /> Instant Grading
              </div>
              <div className="flex items-center gap-2 font-medium">
                <BookOpen className="h-4 w-4 text-indigo-500" /> Multi-Subject
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-14 px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`font-display text-2xl sm:text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              College Testing Features
            </h2>
            <p className={`mt-2 text-sm sm:text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Designed for simple, smooth, and reliable examination workflows.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className={`rounded-2xl border p-6 shadow-sm transition-all ${
              isDark ? "border-slate-800 bg-slate-900/60 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Browse Courses & Subjects</h3>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Select from available college courses and evaluation modules.</p>
            </div>
            <div className={`rounded-2xl border p-6 shadow-sm transition-all ${
              isDark ? "border-slate-800 bg-slate-900/60 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Timed & Protected Exams</h3>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>Take structured timed tests with smooth progression controls.</p>
            </div>
            <div className={`rounded-2xl border p-6 shadow-sm transition-all ${
              isDark ? "border-slate-800 bg-slate-900/60 hover:border-slate-700" : "border-slate-200 bg-white hover:border-slate-300"
            }`}>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Instant Grade Reports</h3>
              <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>View your detailed score report immediately upon submitting your exam.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`border-t transition-colors duration-300 mt-auto ${
        isDark ? "border-slate-800/80 bg-[#080d1a]" : "border-slate-200 bg-slate-50"
      }`}>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Logo size="sm" className="rounded-lg" />
              <div>
                <div className={`font-display font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                  Tshaye Tsidq Leadership and Mission College
                </div>
                <div className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Official Examination Platform
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-sm" aria-label="Footer navigation">
              <a href="#features" className={`transition-colors ${isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                Features
              </a>
            </nav>
          </div>

          <Separator className={`my-6 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />

          <div className={`flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between ${
            isDark ? "text-slate-400" : "text-slate-500"
          }`}>
            <p>© {new Date().getFullYear()} Tshaye Tsidq Leadership and Mission College. All rights reserved.</p>
            <p>Secure Student Evaluation System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


