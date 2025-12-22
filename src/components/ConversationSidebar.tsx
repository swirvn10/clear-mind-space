import { MessageSquarePlus, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Conversation } from '@/hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelect: (conversation: Conversation) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export default function ConversationSidebar({
  conversations,
  currentConversation,
  onSelect,
  onNew,
  onDelete,
}: ConversationSidebarProps) {
  return (
    <div className="h-full flex flex-col bg-card border-r border-border/50">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Button onClick={onNew} className="w-full gap-2" variant="default">
          <MessageSquarePlus className="w-4 h-4" />
          New Conversation
        </Button>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No conversations yet. Start a new one!
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversation?.id === conv.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => onSelect(conv)}
              >
                <MessageCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
