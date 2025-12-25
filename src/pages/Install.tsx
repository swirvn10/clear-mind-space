import { useEffect, useState } from 'react';
import { ArrowLeft, Download, Share, Plus, MoreVertical, Smartphone, Monitor, Apple } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

const Install = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const renderIOSInstructions = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">1</span>
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium">Tap the Share button</p>
          <p className="text-sm text-muted-foreground">At the bottom of Safari</p>
        </div>
        <Share className="w-6 h-6 text-primary" />
      </div>

      <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">2</span>
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium">Scroll and tap "Add to Home Screen"</p>
          <p className="text-sm text-muted-foreground">In the share menu</p>
        </div>
        <Plus className="w-6 h-6 text-primary" />
      </div>

      <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-lg font-bold text-primary">3</span>
        </div>
        <div className="flex-1">
          <p className="text-foreground font-medium">Tap "Add"</p>
          <p className="text-sm text-muted-foreground">In the top right corner</p>
        </div>
      </div>
    </div>
  );

  const renderAndroidInstructions = () => (
    <div className="space-y-6">
      {deferredPrompt ? (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Tap the button below to install ClearMind</p>
          <Button onClick={handleInstall} size="lg" className="gap-2">
            <Download className="w-5 h-5" />
            Install ClearMind
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">Tap the menu button</p>
              <p className="text-sm text-muted-foreground">Three dots in Chrome</p>
            </div>
            <MoreVertical className="w-6 h-6 text-primary" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">Tap "Add to Home screen"</p>
              <p className="text-sm text-muted-foreground">Or "Install app"</p>
            </div>
            <Download className="w-6 h-6 text-primary" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">3</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">Tap "Install"</p>
              <p className="text-sm text-muted-foreground">Confirm the installation</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderDesktopInstructions = () => (
    <div className="space-y-6">
      {deferredPrompt ? (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Click the button below to install ClearMind</p>
          <Button onClick={handleInstall} size="lg" className="gap-2">
            <Download className="w-5 h-5" />
            Install ClearMind
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">1</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">Look for the install icon</p>
              <p className="text-sm text-muted-foreground">In the address bar (Chrome/Edge)</p>
            </div>
            <Download className="w-6 h-6 text-primary" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-card/50 rounded-xl border border-border">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">2</span>
            </div>
            <div className="flex-1">
              <p className="text-foreground font-medium">Click "Install"</p>
              <p className="text-sm text-muted-foreground">Confirm the installation</p>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const getPlatformIcon = () => {
    switch (platform) {
      case 'ios':
        return <Apple className="w-6 h-6" />;
      case 'android':
        return <Smartphone className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  const getPlatformName = () => {
    switch (platform) {
      case 'ios':
        return 'iPhone / iPad';
      case 'android':
        return 'Android';
      default:
        return 'Desktop';
    }
  };

  if (isInstalled) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <Download className="w-8 h-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Already Installed!</h1>
        <p className="text-muted-foreground mb-6">ClearMind is installed on your device</p>
        <Button onClick={() => navigate('/')} variant="outline">
          Go to App
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Install ClearMind</h1>
        </div>
      </header>

      <div className="container max-w-lg mx-auto px-4 py-8">
        <section className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Install the App</h2>
          <p className="text-muted-foreground">
            Add ClearMind to your home screen for quick access and an app-like experience
          </p>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            {getPlatformIcon()}
            <span>Instructions for {getPlatformName()}</span>
          </div>

          {platform === 'ios' && renderIOSInstructions()}
          {platform === 'android' && renderAndroidInstructions()}
          {platform === 'desktop' && renderDesktopInstructions()}
        </section>

        <section className="bg-card/30 rounded-xl p-4 border border-border">
          <h3 className="font-semibold text-foreground mb-3">Benefits of Installing</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Quick access from your home screen
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Full-screen app experience
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Works offline
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              Faster loading times
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Install;
