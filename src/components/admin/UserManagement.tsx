import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, User, Calendar, Flame } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  streak_count: number | null;
  onboarding_completed: boolean | null;
  goals: string[] | null;
}

const USERS_PER_PAGE = 10;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<{ journals: number; chats: number; moods: number } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;

      let query = supabase
        .from('profiles')
        .select('id, display_name, avatar_url, created_at, streak_count, onboarding_completed, goals', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (searchQuery) {
        query = query.ilike('display_name', `%${searchQuery}%`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async (userId: string) => {
    try {
      const [journalRes, chatRes, moodRes] = await Promise.all([
        supabase.from('journal_entries').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('mood_checkins').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      ]);

      setUserStats({
        journals: journalRes.count || 0,
        chats: chatRes.count || 0,
        moods: moodRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUserClick = (user: UserProfile) => {
    setSelectedUser(user);
    setUserStats(null);
    fetchUserStats(user.id);
  };

  const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {searchQuery ? 'No users found matching your search' : 'No users yet'}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {user.display_name || 'Unnamed User'}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {user.streak_count && user.streak_count > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {user.streak_count}
                    </Badge>
                  )}
                  <Badge variant={user.onboarding_completed ? 'default' : 'outline'}>
                    {user.onboarding_completed ? 'Active' : 'Onboarding'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * USERS_PER_PAGE) + 1} - {Math.min(currentPage * USERS_PER_PAGE, totalCount)} of {totalCount}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedUser.display_name || 'Unnamed User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Joined {format(new Date(selectedUser.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{userStats?.journals ?? '...'}</p>
                  <p className="text-xs text-muted-foreground">Journal Entries</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{userStats?.chats ?? '...'}</p>
                  <p className="text-xs text-muted-foreground">Conversations</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{userStats?.moods ?? '...'}</p>
                  <p className="text-xs text-muted-foreground">Mood Check-ins</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedUser.onboarding_completed ? 'default' : 'outline'}>
                    {selectedUser.onboarding_completed ? 'Onboarding Complete' : 'Onboarding Pending'}
                  </Badge>
                  {selectedUser.streak_count && selectedUser.streak_count > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-500" />
                      {selectedUser.streak_count} day streak
                    </Badge>
                  )}
                </div>
              </div>

              {selectedUser.goals && selectedUser.goals.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Goals</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.goals.map((goal, i) => (
                      <Badge key={i} variant="outline">{goal}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
