import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import Logo from '@/components/Logo';
import { ArrowLeft, Lock, User, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem('isAuthenticated') === 'true') {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (cleanUser === 'admin' && cleanPass === '123456') {
      login();
      navigate('/admin');
    } else {
      setError('Invalid username or password. Please try admin and 123456');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative px-4">
      {/* Background Glow */}
      <div className="absolute inset-0 gradient-hero opacity-10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md animate-scale-in relative z-10">
        <div className="bg-card border border-border/70 rounded-3xl shadow-elevated p-8 space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-3">
            <div className="flex justify-center mb-2">
              <Logo size="lg" className="rounded-2xl shadow-sm" />
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground tracking-tight">
              Admin Portal Login
            </h2>
            <p className="text-xs text-muted-foreground">
              Tshaye Tsidq Leadership and Mission College
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-3 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <Input
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/80"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-border/80"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 gradient-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md hover:opacity-95 transition-opacity mt-2"
            >
              Sign In to Admin Dashboard
            </Button>
          </form>

          {/* Back Link */}
          <div className="pt-2 text-center border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground rounded-xl"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Return to Main Site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

