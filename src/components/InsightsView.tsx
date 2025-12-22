import React, { useState } from 'react';
import { TrendingUp, Activity, Hash, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInsights } from '@/hooks/useInsights';
import MoodChart from './insights/MoodChart';
import StatsCards from './insights/StatsCards';
import ThemeAnalysis from './insights/ThemeAnalysis';
import WeeklySummary from './insights/WeeklySummary';

const InsightsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<7 | 30>(30);
  const { data, loading } = useInsights(timeRange);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="space-y-2 mb-6">
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Your Insights
          </h1>
          <p className="text-muted-foreground">
            Patterns and progress in your wellness journey
          </p>
        </div>

        {/* Time Range Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeRange === 7
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              timeRange === 30
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            30 Days
          </button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mood" className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-secondary/50">
            <TabsTrigger value="mood" className="gap-1.5 text-xs">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Mood</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-1.5 text-xs">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="themes" className="gap-1.5 text-xs">
              <Hash className="w-4 h-4" />
              <span className="hidden sm:inline">Themes</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="gap-1.5 text-xs">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>

          {/* Mood Trends Tab */}
          <TabsContent value="mood" className="space-y-6">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Mood Trends</h3>
                {data?.averageMood ? (
                  <span className="text-xs text-muted-foreground">
                    Avg: {data.averageMood}/5
                  </span>
                ) : null}
              </div>
              <MoodChart 
                data={data?.moodTrends || []} 
                averageMood={data?.averageMood || 0} 
              />
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <h3 className="text-sm font-medium text-foreground mb-4">Your Activity</h3>
              <StatsCards
                totalConversations={data?.totalConversations || 0}
                totalJournalEntries={data?.totalJournalEntries || 0}
                totalUntangles={data?.totalUntangles || 0}
                currentStreak={data?.currentStreak || 0}
                daysSinceJoined={data?.daysSinceJoined || 0}
              />
            </div>
          </TabsContent>

          {/* Themes Tab */}
          <TabsContent value="themes" className="space-y-6">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <h3 className="text-sm font-medium text-foreground mb-4">Patterns & Themes</h3>
              <ThemeAnalysis
                moodByDayOfWeek={data?.moodByDayOfWeek || []}
                commonWords={data?.commonWords || []}
              />
            </div>
          </TabsContent>

          {/* AI Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            <div className="bg-card rounded-2xl p-4 border border-border/50">
              <WeeklySummary insightsData={data} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InsightsView;
