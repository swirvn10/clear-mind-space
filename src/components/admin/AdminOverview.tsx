import React, { useEffect, useState } from 'react';
import { Users, BookOpen, MessageSquare, Heart, Flame, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalJournalEntries: number;
  totalConversations: number;
  totalMoodCheckins: number;
  activeUsers: number;
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersThisWeek: 0,
    totalJournalEntries: 0,
    totalConversations: 0,
    totalMoodCheckins: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const [
          profilesRes,
          newUsersRes,
          journalRes,
          conversationsRes,
          moodRes,
          activeRes,
        ] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString()),
          supabase.from('journal_entries').select('id', { count: 'exact', head: true }),
          supabase.from('conversations').select('id', { count: 'exact', head: true }),
          supabase.from('mood_checkins').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true })
            .gt('streak_count', 0),
        ]);

        setStats({
          totalUsers: profilesRes.count || 0,
          newUsersThisWeek: newUsersRes.count || 0,
          totalJournalEntries: journalRes.count || 0,
          totalConversations: conversationsRes.count || 0,
          totalMoodCheckins: moodRes.count || 0,
          activeUsers: activeRes.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'New This Week', value: stats.newUsersThisWeek, icon: Calendar, color: 'text-green-500' },
    { label: 'Journal Entries', value: stats.totalJournalEntries, icon: BookOpen, color: 'text-purple-500' },
    { label: 'Conversations', value: stats.totalConversations, icon: MessageSquare, color: 'text-orange-500' },
    { label: 'Mood Check-ins', value: stats.totalMoodCheckins, icon: Heart, color: 'text-pink-500' },
    { label: 'Active Streaks', value: stats.activeUsers, icon: Flame, color: 'text-amber-500' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border/50 animate-pulse">
            <div className="h-4 bg-muted rounded w-24 mb-3" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-xl p-6 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-medium text-foreground mb-4">Quick Summary</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="text-foreground font-medium">{stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%</span> of users have active streaks
          </p>
          <p>
            <span className="text-foreground font-medium">{stats.totalUsers > 0 ? (stats.totalJournalEntries / stats.totalUsers).toFixed(1) : 0}</span> average journal entries per user
          </p>
          <p>
            <span className="text-foreground font-medium">{stats.totalUsers > 0 ? (stats.totalMoodCheckins / stats.totalUsers).toFixed(1) : 0}</span> average mood check-ins per user
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
