import React from 'react';
import { Bell, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useReminders } from '@/hooks/useReminders';

const ReminderSettings: React.FC = () => {
  const { preferences, loading, updatePreferences } = useReminders();

  if (loading) {
    return (
      <div className="bg-card rounded-2xl p-6 border border-border/50 animate-pulse">
        <div className="h-6 bg-secondary rounded w-1/3 mb-4" />
        <div className="h-4 bg-secondary rounded w-2/3" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-6">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-medium text-foreground">Daily Reminders</h3>
      </div>

      <div className="space-y-4">
        {/* Enable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-toggle" className="text-sm font-medium">
              Enable daily check-in reminder
            </Label>
            <p className="text-xs text-muted-foreground">
              Get a gentle nudge to check in with yourself
            </p>
          </div>
          <Switch
            id="reminder-toggle"
            checked={preferences.enabled}
            onCheckedChange={(checked) => updatePreferences({ enabled: checked })}
          />
        </div>

        {/* Time Picker */}
        {preferences.enabled && (
          <div className="flex items-center gap-4 pt-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Label htmlFor="reminder-time" className="text-sm text-muted-foreground">
                Remind me at
              </Label>
              <input
                id="reminder-time"
                type="time"
                value={preferences.time}
                onChange={(e) => updatePreferences({ time: e.target.value })}
                className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Reminders appear as in-app notifications when you visit ClearMind.
      </p>
    </div>
  );
};

export default ReminderSettings;
