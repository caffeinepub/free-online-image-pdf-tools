import React, { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useMultipleDayAnalytics } from '@/hooks/useQueries';
import { SEOHead } from '@/components/seo/SEOHead';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Eye, Zap, TrendingUp, LogOut, BarChart2, MousePointer } from 'lucide-react';

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
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

export function AdminDashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) navigate({ to: '/admin/login' });
  }, [isAuthenticated, navigate]);

  // Get last 7 days
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

  // Aggregate tool usage across all days
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
  const adClickSim = Math.round(totalVisitors * 0.03); // 3% CTR simulation

  const chartData = last7Days.map(date => {
    const day = analyticsData.find(d => d.date === date);
    return {
      date: date.slice(5), // MM-DD
      visitors: day ? Number(day.visitorCount) : 0,
    };
  });

  if (!isAuthenticated) return null;

  return (
    <>
      <SEOHead title="Admin Dashboard - ToolsHub Free" description="Admin analytics dashboard" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

        {/* Stats Grid */}
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
                    contentStyle={{ background: 'oklch(0.16 0.018 265)', border: '1px solid oklch(0.28 0.025 265)', borderRadius: '8px', color: 'oklch(0.95 0.01 265)' }}
                  />
                  <Bar dataKey="visitors" fill="oklch(0.72 0.19 195)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Tool usage */}
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
                      <td className="py-2.5 text-right text-primary">{totalToolUsage > 0 ? ((count / totalToolUsage) * 100).toFixed(1) : 0}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
