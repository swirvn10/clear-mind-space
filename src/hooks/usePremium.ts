import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface UsageData {
  chat_count: number;
  journal_count: number;
  untangle_count: number;
  voice_seconds: number;
}

export interface PremiumLimits {
  daily_chats: number;
  monthly_journals: number;
  daily_untangles: number;
  voice_seconds: number;
}

export const FREE_LIMITS: PremiumLimits = {
  daily_chats: 5,
  monthly_journals: 10,
  daily_untangles: 1,
  voice_seconds: 30,
};

export const PREMIUM_LIMITS: PremiumLimits = {
  daily_chats: Infinity,
  monthly_journals: Infinity,
  daily_untangles: Infinity,
  voice_seconds: Infinity,
};

export type FeatureType = 'chat' | 'journal' | 'untangle' | 'voice';

export function usePremium() {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [tier, setTier] = useState<'free' | 'premium'>('free');
  const [usage, setUsage] = useState<UsageData>({
    chat_count: 0,
    journal_count: 0,
    untangle_count: 0,
    voice_seconds: 0,
  });
  const [monthlyJournalCount, setMonthlyJournalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch subscription
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (subscription) {
        setTier(subscription.tier as 'free' | 'premium');
        setIsPremium(subscription.tier === 'premium' && subscription.status === 'active');
      } else {
        // Create default free subscription
        await supabase.from('subscriptions').insert({
          user_id: user.id,
          tier: 'free',
          status: 'active',
        });
      }

      // Fetch today's usage
      const { data: usageData } = await supabase.rpc('get_or_create_daily_usage', {
        p_user_id: user.id,
      });

      if (usageData) {
        setUsage({
          chat_count: usageData.chat_count,
          journal_count: usageData.journal_count,
          untangle_count: usageData.untangle_count,
          voice_seconds: usageData.voice_seconds,
        });
      }

      // Fetch monthly journal count
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: monthlyUsage } = await supabase
        .from('usage_tracking')
        .select('journal_count')
        .eq('user_id', user.id)
        .gte('date', startOfMonth.toISOString().split('T')[0]);

      if (monthlyUsage) {
        const total = monthlyUsage.reduce((sum, day) => sum + day.journal_count, 0);
        setMonthlyJournalCount(total);
      }
    } catch (error) {
      console.error('Error fetching premium status:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const getLimits = useCallback((): PremiumLimits => {
    return isPremium ? PREMIUM_LIMITS : FREE_LIMITS;
  }, [isPremium]);

  const checkLimit = useCallback((feature: FeatureType): { allowed: boolean; remaining: number; limit: number } => {
    const limits = getLimits();

    switch (feature) {
      case 'chat':
        return {
          allowed: usage.chat_count < limits.daily_chats,
          remaining: Math.max(0, limits.daily_chats - usage.chat_count),
          limit: limits.daily_chats,
        };
      case 'journal':
        return {
          allowed: monthlyJournalCount < limits.monthly_journals,
          remaining: Math.max(0, limits.monthly_journals - monthlyJournalCount),
          limit: limits.monthly_journals,
        };
      case 'untangle':
        return {
          allowed: usage.untangle_count < limits.daily_untangles,
          remaining: Math.max(0, limits.daily_untangles - usage.untangle_count),
          limit: limits.daily_untangles,
        };
      case 'voice':
        return {
          allowed: usage.voice_seconds < limits.voice_seconds,
          remaining: Math.max(0, limits.voice_seconds - usage.voice_seconds),
          limit: limits.voice_seconds,
        };
    }
  }, [usage, monthlyJournalCount, getLimits]);

  const incrementUsage = useCallback(async (feature: FeatureType, amount: number = 1): Promise<boolean> => {
    if (!user) return false;

    const check = checkLimit(feature);
    if (!check.allowed && !isPremium) {
      return false;
    }

    try {
      const { data } = await supabase.rpc('increment_usage', {
        p_user_id: user.id,
        p_feature: feature,
        p_amount: amount,
      });

      if (data) {
        setUsage({
          chat_count: data.chat_count,
          journal_count: data.journal_count,
          untangle_count: data.untangle_count,
          voice_seconds: data.voice_seconds,
        });

        if (feature === 'journal') {
          setMonthlyJournalCount(prev => prev + amount);
        }
      }

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  }, [user, checkLimit, isPremium]);

  const getUsageDisplay = useCallback((feature: FeatureType): string => {
    const check = checkLimit(feature);
    if (isPremium) return 'Unlimited';
    
    if (feature === 'voice') {
      return `${check.remaining}s remaining`;
    }
    
    const period = feature === 'journal' ? 'this month' : 'today';
    return `${check.remaining} of ${check.limit} ${period}`;
  }, [checkLimit, isPremium]);

  return {
    isPremium,
    tier,
    usage,
    loading,
    checkLimit,
    incrementUsage,
    getUsageDisplay,
    refreshUsage: fetchSubscription,
  };
}
