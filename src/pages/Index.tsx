import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Timer,
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const navigate = useNavigate();

  const [name, setName] = useState(() => sessionStorage.getItem("studentName") ?? "");

  const canContinue = useMemo(() => name.trim().length > 0, [name]);

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    sessionStorage.setItem("studentName", trimmed);
    navigate("/subjects");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center py-4">
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            onClick={() => navigate("/")}
          >
            <Logo size="sm" />
            <div className="leading-tight">
              <div className="font-display font-semibold">Online Test</div>
              <div className="text-xs text-muted-foreground">Practice • Track • Improve</div>
            </div>
          </button>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-15" />
          <div className="container relative py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="text-left">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Simple, fast setup
                  </Badge>
                  <Badge variant="secondary" className="gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Local-only data
                  </Badge>
                </div>

                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
                  A cleaner way to run
                  <span className="text-primary"> online tests</span>
                </h1>
                <p className="mt-4 text-muted-foreground text-lg max-w-xl">
                  Choose a subject, take a timed quiz, and get instant results—no sign-up required.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    className="gradient-primary text-primary-foreground"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!canContinue}
                  >
                    Start as Student <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
                  <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
                    <Timer className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium">Timed tests</div>
                      <div className="text-xs text-muted-foreground">Stay focused</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
                    <BarChart3 className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Instant scoring</div>
                      <div className="text-xs text-muted-foreground">See results fast</div>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Quick start</CardTitle>
                  <CardDescription>Enter your name and begin your test.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-2">Your name</div>
                      <Input
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                        className="h-11"
                        autoComplete="name"
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        Used to label results on this device.
                      </div>
                    </div>
                    <Button
                      className="w-full gradient-primary text-primary-foreground"
                      onClick={handleContinue}
                      disabled={!canContinue}
                    >
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    Multiple subjects supported
                  </div>
                  <Badge variant="outline">v1</Badge>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="container py-10">
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <h2 className="font-display text-2xl font-semibold">What you can do</h2>
              <p className="text-muted-foreground mt-1">
                Everything you need for practice tests.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browse subjects</CardTitle>
                <CardDescription>Pick a topic and start learning.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Take timed tests</CardTitle>
                <CardDescription>Stay on track with a countdown.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get results instantly</CardTitle>
                <CardDescription>See your score the moment you finish.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <div className="container">
          <Separator />
        </div>

        <section id="faq" className="container py-10">
          <div className="text-left">
            <h2 className="font-display text-2xl font-semibold">FAQ</h2>
            <p className="text-muted-foreground mt-1">Common questions about taking tests.</p>
          </div>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="item-1">
              <AccordionTrigger>Do I need an account?</AccordionTrigger>
              <AccordionContent>
                No. Enter your name and start immediately.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How can I view my past scores?</AccordionTrigger>
              <AccordionContent>
                After finishing a test, your score is stored locally and can be seen on the results page when you enter the same name again.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I retake a test?</AccordionTrigger>
              <AccordionContent>
                Yes. Simply select the same subject and test again; previous attempts won’t affect new scores.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <footer className="border-t bg-card/30">
        <div className="container py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3">
                <Logo size="sm" className="rounded-lg" />
                <div>
                  <div className="font-display font-semibold text-foreground">Online Test Platform</div>
                  <div className="text-sm text-muted-foreground">Practice smarter with timed assessments.</div>
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-6 text-sm" aria-label="Footer navigation">
              <a href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</a>
              <a href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</a>
              <a href="/" className="text-muted-foreground transition-colors hover:text-foreground">Home</a>
            </nav>
          </div>

          <Separator className="my-5" />

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Online Test Platform. All rights reserved.</p>
            <p>Secure, local-first experience for students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
