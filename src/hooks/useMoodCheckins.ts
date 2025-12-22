import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface MoodCheckin {
  id: string;
  user_id: string;
  mood: number;
  note: string | null;
  created_at: string;
}

export const useMoodCheckins = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<MoodCheckin[]>([]);
  const [todayCheckin, setTodayCheckin] = useState<MoodCheckin | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCheckins = async () => {
    if (!user) {
      setCheckins([]);
      setTodayCheckin(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mood_checkins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCheckins(data || []);
      
      // Check if there's a check-in from today
      const today = new Date().toDateString();
      const todayEntry = data?.find(
        (c) => new Date(c.created_at).toDateString() === today
      );
      setTodayCheckin(todayEntry || null);
    } catch (error) {
      console.error('Error fetching mood checkins:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCheckin = async (mood: number, note?: string) => {
    if (!user) {
      toast.error('Please sign in to track mood');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('mood_checkins')
        .insert({
          user_id: user.id,
          mood,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;
      setCheckins((prev) => [data, ...prev]);
      setTodayCheckin(data);
      toast.success('Mood recorded');
      return data;
    } catch (error) {
      console.error('Error creating mood checkin:', error);
      toast.error('Failed to record mood');
      return null;
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [user]);

  return {
    checkins,
    todayCheckin,
    loading,
    createCheckin,
    refetch: fetchCheckins,
  };
};
