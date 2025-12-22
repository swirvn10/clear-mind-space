import React, { useState } from 'react';
import { Sparkles, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { InsightsData } from '@/hooks/useInsights';

interface WeeklySummaryProps {
  insightsData: InsightsData | null;
}

const WeeklySummary: React.FC<WeeklySummaryProps> = ({ insightsData }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const generateSummary = async () => {
    if (!insightsData) {
      toast.error('No data available for summary');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-insights', {
        body: {
          averageMood: insightsData.averageMood,
          moodTrends: insightsData.moodTrends.slice(-7),
          totalConversations: insightsData.totalConversations,
          totalJournalEntries: insightsData.totalJournalEntries,
          currentStreak: insightsData.currentStreak,
          commonWords: insightsData.commonWords.slice(0, 5)
        }
      });

      if (error) throw error;

      setSummary(data.summary);
      setLastGenerated(new Date());
      toast.success('Insights generated');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Could not generate insights right now');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h4 className="text-sm font-medium text-foreground">AI Weekly Reflection</h4>
        </div>
        {lastGenerated && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {lastGenerated.toLocaleDateString()}
          </span>
        )}
      </div>

      {summary ? (
        <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
            {summary}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateSummary}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Regenerate
          </Button>
        </div>
      ) : (
        <div className="bg-secondary/30 rounded-xl p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Get a personalized reflection on your week's mental wellness journey
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSummary}
            disabled={loading || !insightsData}
            className="gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Reflection
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WeeklySummary;
