import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface ReminderPreferences {
  enabled: boolean;
  time: string;
  timezone: string;
}

export const useReminders = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ReminderPreferences>({
    enabled: false,
    time: '09:00',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [loading, setLoading] = useState(true);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Fetch preferences
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('reminder_preferences')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data?.reminder_preferences && typeof data.reminder_preferences === 'object') {
          const prefs = data.reminder_preferences as unknown as ReminderPreferences;
          setPreferences({
            enabled: prefs.enabled ?? false,
            time: prefs.time ?? '09:00',
            timezone: prefs.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
          });
        }

        // Check if user has checked in today
        const today = new Date().toISOString().split('T')[0];
        const { data: checkins } = await supabase
          .from('mood_checkins')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', today)
          .limit(1);

        setHasCheckedInToday((checkins?.length || 0) > 0);
      } catch (error) {
        console.error('Error fetching reminder preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  // Show reminder if needed
  useEffect(() => {
    if (!user || loading || !preferences.enabled || hasCheckedInToday) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = preferences.time.split(':').map(Number);
      const reminderTime = new Date();
      reminderTime.setHours(hours, minutes, 0, 0);

      // Show reminder if current time is past reminder time
      if (now >= reminderTime) {
        const lastShown = localStorage.getItem('lastReminderShown');
        const today = now.toISOString().split('T')[0];
        
        if (lastShown !== today) {
          toast("Time for your daily check-in", {
            description: "Take a moment to notice how you're feeling today.",
            duration: 10000,
          });
          localStorage.setItem('lastReminderShown', today);
        }
      }
    };

    checkReminder();
  }, [user, loading, preferences, hasCheckedInToday]);

  const updatePreferences = useCallback(async (newPrefs: Partial<ReminderPreferences>) => {
    if (!user) return;

    const updatedPrefs = { ...preferences, ...newPrefs };
    setPreferences(updatedPrefs);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ reminder_preferences: updatedPrefs })
        .eq('id', user.id);

      if (error) throw error;

      // Request notification permission if enabling reminders
      if (newPrefs.enabled && 'Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast.info('Enable browser notifications to receive reminders even when the app is in the background');
        }
      }

      toast.success('Reminder settings saved');
    } catch (error) {
      console.error('Error updating reminder preferences:', error);
      toast.error('Could not save reminder settings');
    }
  }, [user, preferences]);

  return { preferences, loading, updatePreferences, hasCheckedInToday };
};
