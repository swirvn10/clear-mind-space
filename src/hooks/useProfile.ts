import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Profile {
  displayName: string | null;
  goals: string[] | null;
  avatarUrl: string | null;
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
          .select('display_name, goals, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        setProfile({
          displayName: data?.display_name || null,
          goals: data?.goals || null,
          avatarUrl: data?.avatar_url || null,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading };
};
