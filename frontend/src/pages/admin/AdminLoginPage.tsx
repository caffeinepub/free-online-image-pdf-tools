import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

export function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) navigate({ to: '/admin/dashboard' });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 500)); // simulate async
    const success = login(username, password);
    if (success) {
      navigate({ to: '/admin/dashboard' });
    } else {
      setError('Invalid username or password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Lock size={24} className="text-background" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to access the dashboard</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle size={14} />
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-gradient w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" /> Signing in...</>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Default: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
