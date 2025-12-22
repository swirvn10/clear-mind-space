import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { startOfWeek, endOfWeek, subDays, format, differenceInDays } from 'date-fns';

export interface MoodDataPoint {
  date: string;
  mood: number;
  formattedDate: string;
}

export interface InsightsData {
  moodTrends: MoodDataPoint[];
  averageMood: number;
  totalConversations: number;
  totalJournalEntries: number;
  totalUntangles: number;
  currentStreak: number;
  longestStreak: number;
  daysSinceJoined: number;
  moodByDayOfWeek: { day: string; avgMood: number; count: number }[];
  commonWords: { word: string; count: number }[];
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'can', 'will', 'just', 'should', 'now', 'i', 'me', 'my', 'myself',
  'we', 'our', 'ours', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its',
  'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'this', 'that', 'these',
  'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
  'had', 'having', 'do', 'does', 'did', 'doing', 'would', 'could', 'ought', 'im',
  'youre', 'hes', 'shes', 'its', 'were', 'theyre', 'ive', 'youve', 'weve', 'theyve',
  'id', 'youd', 'hed', 'shed', 'wed', 'theyd', 'ill', 'youll', 'hell', 'shell',
  'well', 'theyll', 'isnt', 'arent', 'wasnt', 'werent', 'hasnt', 'havent', 'hadnt',
  'doesnt', 'dont', 'didnt', 'wont', 'wouldnt', 'shouldnt', 'couldnt', 'cant',
  'cannot', 'mustnt', 'lets', 'thats', 'whos', 'whats', 'heres', 'theres', 'whens',
  'wheres', 'whys', 'hows', 'because', 'as', 'until', 'while', 'although', 'though',
  'if', 'unless', 'since', 'whether', 'feel', 'feeling', 'felt', 'like', 'really',
  'think', 'know', 'get', 'got', 'going', 'go', 'want', 'need', 'make', 'made',
  'day', 'today', 'time', 'thing', 'things', 'lot', 'way', 'much', 'many', 'also'
]);

export const useInsights = (days: number = 30) => {
  const { user } = useAuth();
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const startDate = subDays(new Date(), days);
        const startDateStr = format(startDate, 'yyyy-MM-dd');

        // Fetch all data in parallel
        const [moodResult, conversationsResult, journalResult, untanglesResult, profileResult] = await Promise.all([
          supabase
            .from('mood_checkins')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', startDateStr)
            .order('created_at', { ascending: true }),
          supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user.id),
          supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('thought_untangles')
            .select('id')
            .eq('user_id', user.id),
          supabase
            .from('profiles')
            .select('streak_count, created_at')
            .eq('id', user.id)
            .single()
        ]);

        // Process mood trends
        const moodCheckins = moodResult.data || [];
        const moodTrends: MoodDataPoint[] = moodCheckins.map(checkin => ({
          date: checkin.created_at,
          mood: checkin.mood,
          formattedDate: format(new Date(checkin.created_at), 'MMM d')
        }));

        // Calculate average mood
        const avgMood = moodCheckins.length > 0
          ? moodCheckins.reduce((sum, c) => sum + c.mood, 0) / moodCheckins.length
          : 0;

        // Calculate mood by day of week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const moodByDay: { [key: number]: { total: number; count: number } } = {};
        moodCheckins.forEach(checkin => {
          const dayOfWeek = new Date(checkin.created_at).getDay();
          if (!moodByDay[dayOfWeek]) {
            moodByDay[dayOfWeek] = { total: 0, count: 0 };
          }
          moodByDay[dayOfWeek].total += checkin.mood;
          moodByDay[dayOfWeek].count += 1;
        });

        const moodByDayOfWeek = dayNames.map((day, index) => ({
          day,
          avgMood: moodByDay[index] ? moodByDay[index].total / moodByDay[index].count : 0,
          count: moodByDay[index]?.count || 0
        }));

        // Extract common words from journal entries
        const journalEntries = journalResult.data || [];
        const wordFrequency: { [key: string]: number } = {};
        journalEntries.forEach(entry => {
          const words = entry.content
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !STOP_WORDS.has(word));
          
          words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
          });
        });

        const commonWords = Object.entries(wordFrequency)
          .map(([word, count]) => ({ word, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // Calculate days since joined
        const joinDate = profileResult.data?.created_at 
          ? new Date(profileResult.data.created_at) 
          : new Date();
        const daysSinceJoined = differenceInDays(new Date(), joinDate);

        setData({
          moodTrends,
          averageMood: Math.round(avgMood * 10) / 10,
          totalConversations: conversationsResult.data?.length || 0,
          totalJournalEntries: journalEntries.length,
          totalUntangles: untanglesResult.data?.length || 0,
          currentStreak: profileResult.data?.streak_count || 0,
          longestStreak: profileResult.data?.streak_count || 0, // Would need separate tracking for longest
          daysSinceJoined,
          moodByDayOfWeek,
          commonWords
        });
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user, days]);

  return { data, loading };
};
