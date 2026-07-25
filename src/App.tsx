import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SubjectsPage from "./pages/SubjectsPage";
import TestsListPage from "./pages/TestsListPage";
import TakeTestPage from "./pages/TakeTestPage";
import ResultPage from "./pages/ResultPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import { LoginPage } from "./pages/LoginPage";
import { useAuth } from "@/lib/auth";

// Protected wrapper for admin route
const AdminRoute = () => {
  const { isAuthenticated } = useAuth();
  const isAuthed = isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
  return isAuthed ? <AdminPage /> : <Navigate to="/login" replace />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId/tests" element={<TestsListPage />} />
          <Route path="/test/:testId" element={<TakeTestPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
