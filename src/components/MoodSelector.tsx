import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MoodSelectorProps {
  onSelect: (mood: number, note?: string) => void;
  selectedMood?: number | null;
  showNote?: boolean;
  compact?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const moods = [
  { value: 1, emoji: '😢', label: 'Struggling' },
  { value: 2, emoji: '😕', label: 'Low' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😊', label: 'Great' },
];

const MoodSelector: React.FC<MoodSelectorProps> = ({
  onSelect,
  selectedMood,
  showNote = false,
  compact = false,
  size = 'md',
}) => {
  const [selected, setSelected] = useState<number | null>(selectedMood ?? null);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleSelect = (value: number) => {
    setSelected(value);
    if (showNote) {
      setShowNoteInput(true);
    } else {
      onSelect(value);
    }
  };

  const handleSubmit = () => {
    if (selected) {
      onSelect(selected, note || undefined);
      setShowNoteInput(false);
      setNote('');
    }
  };

  const sizeClasses = {
    sm: { emoji: 'text-xl', container: 'p-1.5', gap: 'gap-1', label: 'text-[10px]' },
    md: { emoji: 'text-3xl', container: 'p-2', gap: 'gap-3', label: 'text-xs' },
    lg: { emoji: 'text-4xl', container: 'p-3', gap: 'gap-4', label: 'text-sm' },
  };

  const currentSize = compact ? sizeClasses.sm : sizeClasses[size];

  return (
    <div className="w-full">
      <div className={cn('flex justify-center', currentSize.gap)}>
        {moods.map((mood) => (
          <motion.button
            key={mood.value}
            onClick={() => handleSelect(mood.value)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex flex-col items-center transition-all rounded-xl',
              currentSize.container,
              selected === mood.value
                ? 'bg-primary/20 ring-2 ring-primary'
                : 'hover:bg-muted/50'
            )}
          >
            <span className={currentSize.emoji}>{mood.emoji}</span>
            {!compact && (
              <span className={cn('text-muted-foreground mt-1', currentSize.label)}>
                {mood.label}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showNoteInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              rows={2}
              className="w-full resize-none bg-muted/30 border border-border rounded-lg p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setShowNoteInput(false);
                  setSelected(null);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodSelector;
