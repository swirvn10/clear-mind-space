import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const useAvatarUpload = () => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Please upload a valid image (JPG, PNG, GIF, or WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Image must be less than 2MB';
    }
    return null;
  };

  const deleteOldAvatar = async (currentAvatarUrl: string | null) => {
    if (!currentAvatarUrl || !user) return;
    
    // Extract path from URL if it's from our storage
    const storageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/`;
    if (currentAvatarUrl.startsWith(storageUrl)) {
      const path = currentAvatarUrl.replace(storageUrl, '');
      await supabase.storage.from('avatars').remove([path]);
    }
  };

  const uploadAvatar = async (file: File, currentAvatarUrl: string | null): Promise<string> => {
    if (!user) throw new Error('Not authenticated');

    const validationError = validateFile(file);
    if (validationError) throw new Error(validationError);

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress for better UX (Supabase doesn't provide upload progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Delete old avatar first
      await deleteOldAvatar(currentAvatarUrl);
      setProgress(30);

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      setProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicUrl;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return { uploadAvatar, uploading, progress, validateFile };
};
