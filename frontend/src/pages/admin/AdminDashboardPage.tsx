import React, { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMultipleDayAnalytics } from '@/hooks/useQueries';
import { SEOHead } from '@/components/seo/SEOHead';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users, Eye, EyeOff, Zap, TrendingUp, LogOut, BarChart2,
  MousePointer, Settings, CheckCircle, AlertCircle, KeyRound, UserCog,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">{icon}</div>
      </div>
      <p className="font-display font-bold text-2xl text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      {sub && <p className="text-xs text-primary mt-1">{sub}</p>}
    </div>
  );
}

// ─── Change Username Card ─────────────────────────────────────────────────────

function ChangeUsernameCard() {
  const { changeCredentials, currentUsername } = useAuth();

  const [newUsername, setNewUsername] = useState(currentUsername);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!newUsername.trim() || !currentPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    // Keep the same password, only change username
    const creds = sessionStorage.getItem('admin_credentials');
    const parsed = creds ? JSON.parse(creds) : { password: 'Anurag@123' };
    const result = changeCredentials(newUsername, currentPassword, parsed.password);

    if (result.success) {
      setSuccessMsg('Username updated successfully!');
      setCurrentPassword('');
    } else {
      setErrorMsg(result.error ?? 'Failed to update username.');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <UserCog size={18} className="text-primary" />
          Change Username
        </CardTitle>
        <CardDescription>
          Update your admin username. Your current password is required to confirm the change.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-username">New Username</Label>
            <Input
              id="new-username"
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              autoComplete="off"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username-current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="username-current-password"
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
              <CheckCircle size={15} className="mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Update Username'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Change Password Card ─────────────────────────────────────────────────────

function ChangePasswordCard() {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 400));

    const result = changePassword(currentPassword, newPassword);

    if (result.success) {
      setSuccessMsg('Password updated successfully! Use your new password next time you log in.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setErrorMsg(result.error ?? 'Failed to update password.');
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <KeyRound size={18} className="text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your admin password. You'll need your current password to make changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="pw-current">Current Password</Label>
            <div className="relative">
              <Input
                id="pw-current"
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="pw-new">New Password</Label>
            <div className="relative">
              <Input
                id="pw-new"
                type={showNewPw ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-2">
            <Label htmlFor="pw-confirm">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="pw-confirm"
                type={showConfirmPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400 text-sm">
              <CheckCircle size={15} className="mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="space-y-6 max-w-lg">
      <ChangeUsernameCard />
      <Separator />
      <ChangePasswordCard />
      <p className="text-xs text-muted-foreground px-1">
        <strong>Note:</strong> Credentials are stored in your browser session. They will reset to defaults if you clear your browser data or open a new tab.
      </p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/admin/login' });
  }, [isAuthenticated, navigate]);

  const last7Days = useMemo(() => {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    return days;
  }, []);

  const { data: analyticsData = [], isLoading } = useMultipleDayAnalytics(last7Days);

  const totalVisitors = analyticsData.reduce((sum, d) => sum + Number(d.visitorCount), 0);
  const todayData = analyticsData.find(d => d.date === last7Days[last7Days.length - 1]);
  const todayVisitors = todayData ? Number(todayData.visitorCount) : 0;

  const toolUsageMap: Record<string, number> = {};
  for (const day of analyticsData) {
    for (const tu of day.toolUsage) {
      toolUsageMap[tu.toolName] = (toolUsageMap[tu.toolName] || 0) + Number(tu.usageCount);
    }
  }
  const sortedTools = Object.entries(toolUsageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const totalToolUsage = sortedTools.reduce((sum, [, v]) => sum + v, 0);
  const adClickSim = Math.round(totalVisitors * 0.03);

  const chartData = last7Days.map(date => {
    const day = analyticsData.find(d => d.date === date);
    return {
      date: date.slice(5),
      visitors: day ? Number(day.visitorCount) : 0,
    };
  });

  if (!isAuthenticated) return null;

  return (
    <>
      <SEOHead title="Admin Dashboard - ToolsHub Free" description="Admin analytics dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Analytics & site performance overview</p>
          </div>
          <button
            onClick={() => { logout(); navigate({ to: '/admin/login' }); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all text-sm"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <Tabs defaultValue="analytics">
          <TabsList className="mb-6">
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <BarChart2 size={14} /> Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Settings size={14} /> Settings
            </TabsTrigger>
          </TabsList>

          {/* ── Analytics Tab ── */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={<Users size={18} className="text-primary" />} label="Total Visitors" value={totalVisitors.toLocaleString()} />
              <StatCard icon={<TrendingUp size={18} className="text-primary" />} label="Today's Visitors" value={todayVisitors.toLocaleString()} />
              <StatCard icon={<Eye size={18} className="text-primary" />} label="Page Views" value={(totalVisitors * 2.4).toFixed(0)} sub="~2.4 pages/visit" />
              <StatCard icon={<MousePointer size={18} className="text-primary" />} label="Ad Clicks (Est.)" value={adClickSim.toLocaleString()} sub="~3% CTR simulation" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Chart */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart2 size={18} className="text-primary" />
                  <h2 className="font-display font-semibold text-foreground">Daily Visitors (Last 7 Days)</h2>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading analytics...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.025 265)" />
                      <XAxis dataKey="date" tick={{ fill: 'oklch(0.6 0.03 265)', fontSize: 11 }} />
                      <YAxis tick={{ fill: 'oklch(0.6 0.03 265)', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          background: 'oklch(0.16 0.018 265)',
                          border: '1px solid oklch(0.28 0.025 265)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0.01 265)',
                        }}
                      />
                      <Bar dataKey="visitors" fill="oklch(0.72 0.19 195)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Top Tools */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={18} className="text-primary" />
                  <h2 className="font-display font-semibold text-foreground">Top Tools</h2>
                </div>
                {sortedTools.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No tool usage data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {sortedTools.map(([name, count], i) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-foreground font-medium truncate">{i + 1}. {name}</span>
                          <span className="text-muted-foreground shrink-0 ml-2">{count}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-bg rounded-full"
                            style={{ width: `${totalToolUsage > 0 ? (count / sortedTools[0][1]) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tool usage table */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display font-semibold text-foreground mb-4">All Tool Usage</h2>
              {sortedTools.length === 0 ? (
                <p className="text-muted-foreground text-sm">No data available. Tool usage will appear here as users interact with the site.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground font-medium">Rank</th>
                        <th className="text-left py-2 text-muted-foreground font-medium">Tool</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Uses</th>
                        <th className="text-right py-2 text-muted-foreground font-medium">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTools.map(([name, count], i) => (
                        <tr key={name} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="py-2.5 text-muted-foreground">#{i + 1}</td>
                          <td className="py-2.5 text-foreground font-medium">{name}</td>
                          <td className="py-2.5 text-right text-foreground">{count.toLocaleString()}</td>
                          <td className="py-2.5 text-right text-primary">
                            {totalToolUsage > 0 ? ((count / totalToolUsage) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
