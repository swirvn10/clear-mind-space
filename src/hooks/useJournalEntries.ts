import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: number | null;
  created_at: string;
  updated_at: string;
}

export const useJournalEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (content: string, mood?: number) => {
    if (!user) {
      toast.error('Please sign in to save entries');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content,
          mood: mood || null,
        })
        .select()
        .single();

      if (error) throw error;
      setEntries((prev) => [data, ...prev]);
      toast.success('Entry saved');
      return data;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast.error('Failed to save entry');
      return null;
    }
  };

  const updateEntry = async (id: string, content: string, mood?: number) => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({ content, mood: mood || null })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? data : entry))
      );
      toast.success('Entry updated');
      return data;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast.error('Failed to update entry');
      return null;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      toast.success('Entry deleted');
      return true;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast.error('Failed to delete entry');
      return false;
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
};
