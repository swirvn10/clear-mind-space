import React, { useRef } from 'react';
import { User, Camera, Loader2 } from 'lucide-react';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ 
  currentAvatarUrl, 
  onUploadComplete 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadAvatar, uploading, progress } = useAvatarUpload();

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadAvatar(file, currentAvatarUrl);
      onUploadComplete(url);
      toast.success('Avatar updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload avatar');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Calculate progress ring
  const circumference = 2 * Math.PI * 30; // radius = 30
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={cn(
          "relative w-20 h-20 rounded-full overflow-hidden",
          "bg-secondary border-2 border-border",
          "transition-all duration-200",
          "hover:border-primary hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          uploading && "cursor-not-allowed opacity-80"
        )}
      >
        {/* Avatar Image or Placeholder */}
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
        )}

        {/* Hover Overlay */}
        {!uploading && (
          <div className="absolute inset-0 bg-background/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-foreground" />
          </div>
        )}

        {/* Loading Overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </button>

      {/* Progress Ring */}
      {uploading && (
        <svg
          className="absolute -inset-1 w-[88px] h-[88px] -rotate-90"
          viewBox="0 0 68 68"
        >
          <circle
            cx="34"
            cy="34"
            r="30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-200"
          />
        </svg>
      )}

      {/* Camera Badge */}
      {!uploading && (
        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1.5 shadow-md">
          <Camera className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload avatar"
      />
    </div>
  );
};

export default AvatarUpload;
