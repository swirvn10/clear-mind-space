import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all conversations
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching conversations:', error);
      return;
    }

    setConversations(data || []);
    setLoading(false);
  }, [user]);

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data?.map(m => ({
      ...m,
      role: m.role as 'user' | 'assistant'
    })) || []);
  }, []);

  // Create a new conversation
  const createConversation = useCallback(async (title: string = 'New Conversation') => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title })
      .select()
      .single();

    if (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
      return null;
    }

    setConversations(prev => [data, ...prev]);
    setCurrentConversation(data);
    setMessages([]);
    return data;
  }, [user]);

  // Select a conversation
  const selectConversation = useCallback(async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    await fetchMessages(conversation.id);
  }, [fetchMessages]);

  // Add a message to the current conversation
  const addMessage = useCallback(async (role: 'user' | 'assistant', content: string) => {
    if (!currentConversation) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        role,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding message:', error);
      return null;
    }

    // Update conversation timestamp and title if first user message
    if (role === 'user' && messages.length === 0) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await supabase
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id);
      
      setCurrentConversation(prev => prev ? { ...prev, title } : null);
      setConversations(prev => 
        prev.map(c => c.id === currentConversation.id ? { ...c, title } : c)
      );
    } else {
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', currentConversation.id);
    }

    return data;
  }, [currentConversation, messages.length]);

  // Update the last message (for streaming)
  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant') {
        return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
      }
      return [...prev, {
        id: `temp-${Date.now()}`,
        role: 'assistant' as const,
        content,
        created_at: new Date().toISOString(),
      }];
    });
  }, []);

  // Finalize the assistant message after streaming
  const finalizeAssistantMessage = useCallback(async (content: string) => {
    if (!currentConversation) return;

    // Remove temp message
    setMessages(prev => prev.filter(m => !m.id.startsWith('temp-')));

    // Save to database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        role: 'assistant',
        content,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, { ...data, role: 'assistant' as const }]);
    }
  }, [currentConversation]);

  // Delete a conversation
  const deleteConversation = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Failed to delete conversation');
      return;
    }

    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
      setMessages([]);
    }
  }, [currentConversation]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    createConversation,
    selectConversation,
    addMessage,
    updateLastMessage,
    finalizeAssistantMessage,
    deleteConversation,
    setMessages,
  };
}
