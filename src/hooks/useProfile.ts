import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AIVoice } from '@/constants/voices';

interface Profile {
  displayName: string | null;
  goals: string[] | null;
  avatarUrl: string | null;
  preferredVoice: AIVoice;
}

interface UpdateProfileData {
  displayName?: string;
  avatarUrl?: string;
  preferredVoice?: AIVoice;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, goals, avatar_url, preferred_voice')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        setProfile({
          displayName: data?.display_name || null,
          goals: data?.goals || null,
          avatarUrl: data?.avatar_url || null,
          preferredVoice: (data?.preferred_voice as AIVoice) || 'sage',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!user) return;

    const updateData: Record<string, string | null> = {};
    if (data.displayName !== undefined) {
      updateData.display_name = data.displayName || null;
    }
    if (data.avatarUrl !== undefined) {
      updateData.avatar_url = data.avatarUrl || null;
    }
    if (data.preferredVoice !== undefined) {
      updateData.preferred_voice = data.preferredVoice;
    }

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    if (error) throw error;

    // Update local state
    setProfile(prev => prev ? {
      ...prev,
      displayName: data.displayName ?? prev.displayName,
      avatarUrl: data.avatarUrl ?? prev.avatarUrl,
      preferredVoice: data.preferredVoice ?? prev.preferredVoice,
    } : null);
  }, [user]);

  const updateVoicePreference = useCallback(async (voice: AIVoice) => {
    await updateProfile({ preferredVoice: voice });
  }, [updateProfile]);

  return { profile, loading, updateProfile, updateVoicePreference };
};
