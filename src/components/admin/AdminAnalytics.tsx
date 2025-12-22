import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DailyData {
  date: string;
  count: number;
}

const AdminAnalytics: React.FC = () => {
  const [signupData, setSignupData] = useState<DailyData[]>([]);
  const [moodData, setMoodData] = useState<DailyData[]>([]);
  const [journalData, setJournalData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const days = 14;
      const startDate = startOfDay(subDays(new Date(), days - 1));
      
      // Initialize date arrays
      const dateMap: Record<string, number> = {};
      const moodMap: Record<string, number> = {};
      const journalMap: Record<string, number> = {};
      
      for (let i = 0; i < days; i++) {
        const date = format(subDays(new Date(), days - 1 - i), 'MMM d');
        dateMap[date] = 0;
        moodMap[date] = 0;
        journalMap[date] = 0;
      }

      // Fetch signups
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      profiles?.forEach(p => {
        const date = format(new Date(p.created_at), 'MMM d');
        if (date in dateMap) dateMap[date]++;
      });

      // Fetch mood checkins
      const { data: moods } = await supabase
        .from('mood_checkins')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      moods?.forEach(m => {
        const date = format(new Date(m.created_at), 'MMM d');
        if (date in moodMap) moodMap[date]++;
      });

      // Fetch journal entries
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      journals?.forEach(j => {
        const date = format(new Date(j.created_at), 'MMM d');
        if (date in journalMap) journalMap[date]++;
      });

      setSignupData(Object.entries(dateMap).map(([date, count]) => ({ date, count })));
      setMoodData(Object.entries(moodMap).map(([date, count]) => ({ date, count })));
      setJournalData(Object.entries(journalMap).map(([date, count]) => ({ date, count })));
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border/50 h-64 animate-pulse">
            <div className="h-4 bg-muted rounded w-32 mb-4" />
            <div className="h-full bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Signups Chart */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-medium text-foreground mb-4">User Signups (Last 14 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={signupData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Signups"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Check-ins Chart */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-medium text-foreground mb-4">Daily Mood Check-ins</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
                name="Check-ins"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Journal Entries Chart */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-medium text-foreground mb-4">Journal Entries Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={journalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                allowDecimals={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
                name="Entries"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
