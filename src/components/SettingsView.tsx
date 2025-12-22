import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, LogOut, Moon, Sun, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserRole } from '@/hooks/useUserRole';
import ReminderSettings from './ReminderSettings';
import AvatarUpload from './AvatarUpload';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

interface SettingsViewProps {
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { theme, setTheme } = useTheme();
  
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!updateProfile) return;
    
    setIsSaving(true);
    try {
      await updateProfile({ displayName });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (url: string) => {
    if (!updateProfile) return;
    try {
      await updateProfile({ avatarUrl: url });
    } catch (error) {
      toast.error('Failed to save avatar');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const hasChanges = profile && displayName !== (profile.displayName || '');

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-4 px-4 py-4 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <section className="bg-card rounded-2xl p-6 border border-border/50 space-y-6">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">Profile</h2>
          </div>

          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <AvatarUpload 
              currentAvatarUrl={profile?.avatarUrl || null}
              onUploadComplete={handleAvatarUpload}
            />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click avatar to upload
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="bg-secondary"
            />
          </div>


          {/* Save Button */}
          {hasChanges && (
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </section>

        {/* Theme Section */}
        <section className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <Moon className="w-5 h-5 text-primary" />
            ) : (
              <Sun className="w-5 h-5 text-primary" />
            )}
            <h2 className="text-lg font-medium text-foreground">Appearance</h2>
          </div>

          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex-1"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex-1"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
          </div>
        </section>

        {/* Reminder Settings */}
        <ReminderSettings />

        {/* Admin Dashboard Link - Only for admins */}
        {isAdmin && (
          <section className="bg-card rounded-2xl p-6 border border-border/50">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="w-full"
            >
              <Shield className="w-4 h-4 mr-2" />
              Admin Dashboard
            </Button>
          </section>
        )}

        {/* Sign Out */}
        <section className="bg-card rounded-2xl p-6 border border-border/50">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </section>

        {/* App Info */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>ClearMind v1.0.0</p>
          <p className="mt-1">A quiet space to find clarity.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
