import React, { useState } from 'react';
import { Plus, ChevronRight, Trash2, Edit2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useJournalEntries, JournalEntry } from '@/hooks/useJournalEntries';
import { useAuth } from '@/hooks/useAuth';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const JournalView: React.FC = () => {
  const { user } = useAuth();
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useJournalEntries();
  const { checkLimit, incrementUsage, getUsageDisplay, isPremium } = usePremium();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<JournalEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const journalCheck = checkLimit('journal');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPreview = (content: string) => {
    return content.slice(0, 80) + (content.length > 80 ? '...' : '');
  };

  const handleSaveEntry = async () => {
    if (!newEntry.trim()) return;
    
    // Check journal limit for free users
    if (!journalCheck.allowed && !isPremium) {
      toast.error('Monthly journal limit reached', {
        description: 'Upgrade to Premium for unlimited entries.',
      });
      return;
    }

    setSaving(true);
    await incrementUsage('journal');
    await createEntry(newEntry);
    setNewEntry('');
    setIsWriting(false);
    setSaving(false);
  };

  const handleUpdateEntry = async () => {
    if (!editingEntry || !editContent.trim()) return;
    
    setSaving(true);
    await updateEntry(editingEntry.id, editContent);
    setEditingEntry(null);
    setEditContent('');
    setExpandedEntry(null);
    setSaving(false);
  };

  const handleDeleteEntry = async (id: string) => {
    await deleteEntry(id);
    setDeleteConfirm(null);
    setExpandedEntry(null);
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setEditContent(entry.content);
  };

  if (!user) {
    return (
      <div className="min-h-screen px-6 pb-24 pt-12 animate-fade-in">
        <div className="max-w-lg mx-auto text-center py-12">
          <p className="text-muted-foreground">
            Please sign in to access your journal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pb-24 pt-12 animate-fade-in">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-heading font-semibold text-foreground mb-2">Journal</h1>
            {!isPremium && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {getUsageDisplay('journal')}
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            A space for your thoughts, unfiltered.
          </p>
        </div>

        {/* New entry button or form */}
        {!isWriting ? (
          <Button
            variant="calm"
            size="lg"
            onClick={() => setIsWriting(true)}
            className="w-full mb-8"
          >
            <Plus className="w-5 h-5" />
            New entry
          </Button>
        ) : (
          <Card className="mb-8 border-primary/30">
            <CardContent className="p-4">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="What's on your mind?"
                rows={6}
                autoFocus
                className="w-full resize-none bg-transparent text-body placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsWriting(false);
                    setNewEntry('');
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEntry}
                  disabled={!newEntry.trim() || saving}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Entries list */}
        {!loading && (
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <Card
                key={entry.id}
                className="cursor-pointer hover:border-primary/30 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setExpandedEntry(entry)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-primary font-medium">
                        {formatDate(entry.created_at)}
                      </span>
                      <p className="mt-2 text-foreground/80 line-clamp-2">
                        {getPreview(entry.content)}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && entries.length === 0 && !isWriting && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No entries yet. Start writing to capture your thoughts.
            </p>
          </div>
        )}

        {/* Expanded entry modal */}
        {expandedEntry && !editingEntry && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-primary font-medium">
                    {formatDate(expandedEntry.created_at)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(expandedEntry)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirm(expandedEntry.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpandedEntry(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[60vh]">
                  <p className="text-foreground whitespace-pre-wrap">
                    {expandedEntry.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit entry modal */}
        {editingEntry && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-primary font-medium">
                    Editing entry
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingEntry(null);
                      setEditContent('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  autoFocus
                  className="w-full resize-none bg-muted/30 rounded-lg p-3 text-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingEntry(null);
                      setEditContent('');
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleUpdateEntry}
                    disabled={!editContent.trim() || saving}
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete entry?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteConfirm && handleDeleteEntry(deleteConfirm)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default JournalView;
