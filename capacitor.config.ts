import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.23225815f3af4115a135f7b36524aec4',
  appName: 'ClearMind',
  webDir: 'dist',
  server: {
    url: 'https://23225815-f3af-4115-a135-f7b36524aec4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0a0e17'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0e17',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
