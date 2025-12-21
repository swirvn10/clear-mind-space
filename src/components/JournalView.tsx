import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface JournalEntry {
  id: string;
  date: Date;
  preview: string;
  content: string;
}

const JournalView: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000),
      preview: "Felt overwhelmed at work today. The meeting didn't go as planned...",
      content: "Felt overwhelmed at work today. The meeting didn't go as planned and I found myself spiraling into worst-case scenarios.",
    },
    {
      id: '2',
      date: new Date(Date.now() - 172800000),
      preview: "Better day. Took a walk during lunch and it helped clear my head...",
      content: "Better day. Took a walk during lunch and it helped clear my head. Small wins matter.",
    },
  ]);
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSaveEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      preview: newEntry.slice(0, 80) + (newEntry.length > 80 ? '...' : ''),
      content: newEntry,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
    setIsWriting(false);
  };

  return (
    <div className="min-h-screen px-6 pb-24 pt-12 animate-fade-in">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading font-semibold text-foreground mb-2">Journal</h1>
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
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveEntry}
                  disabled={!newEntry.trim()}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries list */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card
              key={entry.id}
              className="cursor-pointer hover:border-primary/30 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-primary font-medium">
                      {formatDate(entry.date)}
                    </span>
                    <p className="mt-2 text-foreground/80 line-clamp-2">
                      {entry.preview}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {entries.length === 0 && !isWriting && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No entries yet. Start writing to capture your thoughts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JournalView;
