import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Offline = () => {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6">
        <WifiOff className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h1 className="text-2xl font-bold text-foreground mb-2">
        You're Offline
      </h1>
      
      <p className="text-muted-foreground mb-8 max-w-sm">
        It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
      </p>
      
      <Button onClick={handleRetry} className="gap-2">
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
      
      <p className="text-sm text-muted-foreground mt-8">
        Your previous data is still available while offline
      </p>
    </main>
  );
};

export default Offline;
