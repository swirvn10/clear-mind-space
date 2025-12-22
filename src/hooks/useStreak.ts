import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface StreakData {
  streakCount: number;
  lastActiveDate: string | null;
  isNewMilestone: boolean;
  milestone: number | null;
}

const MILESTONES = [3, 7, 14, 21, 30, 60, 90, 180, 365];

export const useStreak = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    streakCount: 0,
    lastActiveDate: null,
    isNewMilestone: false,
    milestone: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const updateAndFetchStreak = async () => {
      try {
        // Call the streak update function
        const { data: newStreak, error: updateError } = await supabase
          .rpc('update_user_streak', { p_user_id: user.id });

        if (updateError) throw updateError;

        // Fetch the updated profile
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('streak_count, last_active_date')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        const streakCount = profile?.streak_count || 0;
        
        // Check if this is a new milestone
        const milestone = MILESTONES.find(m => m === streakCount);
        const isNewMilestone = milestone !== undefined && streakCount === newStreak;

        setStreakData({
          streakCount,
          lastActiveDate: profile?.last_active_date || null,
          isNewMilestone,
          milestone: isNewMilestone ? milestone : null,
        });
      } catch (error) {
        console.error('Error updating streak:', error);
      } finally {
        setLoading(false);
      }
    };

    updateAndFetchStreak();
  }, [user]);

  const clearMilestone = () => {
    setStreakData(prev => ({ ...prev, isNewMilestone: false, milestone: null }));
  };

  return { ...streakData, loading, clearMilestone };
};
