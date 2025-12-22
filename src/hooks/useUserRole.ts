import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

type AppRole = 'admin' | 'moderator' | 'user';

interface UserRoleState {
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  hasRole: (role: AppRole) => boolean;
  refetch: () => Promise<void>;
}

export function useUserRole(): UserRoleState {
  const { user } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async () => {
    if (!user) {
      setRoles([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        setRoles([]);
      } else {
        setRoles(data?.map(r => r.role as AppRole) || []);
      }
    } catch (err) {
      console.error('Error fetching user roles:', err);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [user?.id]);

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    loading,
    isAdmin: hasRole('admin'),
    isModerator: hasRole('moderator'),
    hasRole,
    refetch: fetchRoles,
  };
}
