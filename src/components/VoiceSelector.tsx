import React from 'react';
import { Volume2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AI_VOICES, AIVoice } from '@/constants/voices';

interface VoiceSelectorProps {
  value: AIVoice;
  onChange: (voice: AIVoice) => void;
  disabled?: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({ value, onChange, disabled }) => {
  const selectedVoice = AI_VOICES.find(v => v.id === value);

  return (
    <div className="w-full max-w-xs space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <Volume2 className="w-4 h-4" />
        AI Voice
      </label>
      <Select 
        value={value} 
        onValueChange={(v) => onChange(v as AIVoice)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-card border-border">
          <SelectValue>
            {selectedVoice && (
              <span className="flex items-center gap-2">
                <span className="font-medium">{selectedVoice.name}</span>
                <span className="text-muted-foreground text-xs">– {selectedVoice.description}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {AI_VOICES.map((voice) => (
            <SelectItem 
              key={voice.id} 
              value={voice.id}
              className="cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{voice.name}</span>
                <span className="text-muted-foreground text-xs">– {voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VoiceSelector;
