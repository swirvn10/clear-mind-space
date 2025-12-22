import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, ArrowRight, Lightbulb, Heart, Target, Link2, Loader2, History, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface Theme {
  title: string;
  description: string;
  thoughts: string[];
}

interface Connection {
  from: string;
  to: string;
  relationship: string;
}

interface Emotion {
  emotion: string;
  intensity: 'low' | 'medium' | 'high';
  source: string;
}

interface ActionItem {
  action: string;
  priority: 'high' | 'medium' | 'low';
  theme: string;
}

interface Analysis {
  themes: Theme[];
  connections: Connection[];
  emotions: Emotion[];
  actionItems: ActionItem[];
  priorityFocus: {
    title: string;
    reason: string;
  };
  clarityStatement: string;
}

interface SavedUntangle {
  id: string;
  raw_input: string;
  analysis: Analysis;
  created_at: string;
}

const ThoughtUntanglerView: React.FC = () => {
  const { user } = useAuth();
  const [rawInput, setRawInput] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedUntangles, setSavedUntangles] = useState<SavedUntangle[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('thought_untangles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSavedUntangles((data || []) as unknown as SavedUntangle[]);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUntangle = async () => {
    if (!rawInput.trim()) {
      toast.error('Please enter your thoughts first');
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/untangle-thoughts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ rawInput }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to untangle thoughts');
      }

      const data = await response.json();
      setAnalysis(data.analysis);

      // Save to database
      if (user) {
        const { error: saveError } = await supabase
          .from('thought_untangles')
          .insert({
            user_id: user.id,
            raw_input: rawInput,
            analysis: data.analysis,
          });

        if (saveError) {
          console.error('Failed to save untangle:', saveError);
        } else {
          loadHistory();
        }
      }

      toast.success('Thoughts untangled!');
    } catch (error) {
      console.error('Untangle error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to untangle thoughts');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (untangle: SavedUntangle) => {
    setRawInput(untangle.raw_input);
    setAnalysis(untangle.analysis);
    setShowHistory(false);
  };

  const deleteFromHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('thought_untangles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSavedUntangles(prev => prev.filter(u => u.id !== id));
      toast.success('Deleted from history');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-accent/20 text-accent border-accent/30';
      case 'low': return 'bg-primary/20 text-primary border-primary/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getIntensityWidth = (intensity: string) => {
    switch (intensity) {
      case 'high': return 'w-full';
      case 'medium': return 'w-2/3';
      case 'low': return 'w-1/3';
      default: return 'w-1/2';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/20">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Thought Untangler</h1>
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Pour out your scattered thoughts and let AI organize them into clarity.
        </p>
      </header>

      <main className="px-6 space-y-6">
        {/* Input Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <Textarea
              placeholder="Write everything that's on your mind... Don't worry about structure, just let it flow. Include worries, ideas, tasks, feelings - anything that's taking up mental space."
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="min-h-[180px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
            />
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="text-muted-foreground"
              >
                <History className="w-4 h-4 mr-2" />
                History
                {showHistory ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
              </Button>
              <Button
                onClick={handleUntangle}
                disabled={isLoading || !rawInput.trim()}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Untangling...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Untangle My Thoughts
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Dropdown */}
        {showHistory && (
          <Card className="border-border/50 bg-card/50 backdrop-blur animate-slide-up">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingHistory ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : savedUntangles.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No previous sessions</p>
              ) : (
                savedUntangles.map((untangle) => (
                  <div
                    key={untangle.id}
                    onClick={() => loadFromHistory(untangle)}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background/80 cursor-pointer transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {untangle.analysis?.clarityStatement || untangle.raw_input.substring(0, 60) + '...'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(untangle.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => deleteFromHistory(untangle.id, e)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-muted-foreground animate-pulse">Organizing your thoughts...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !isLoading && (
          <div className="space-y-6 animate-fade-in">
            {/* Clarity Statement */}
            <Card className="border-primary/30 bg-primary/5 backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Lightbulb className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-primary mb-1">Core Insight</h3>
                    <p className="text-lg text-foreground font-medium">{analysis.clarityStatement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Focus */}
            {analysis.priorityFocus && (
              <Card className="border-accent/30 bg-accent/5 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/20">
                      <Target className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-accent mb-1">Focus First On</h3>
                      <p className="text-foreground font-medium">{analysis.priorityFocus.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.priorityFocus.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Themes */}
            {analysis.themes && analysis.themes.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Main Themes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.themes.map((theme, index) => (
                    <div key={index} className="p-4 rounded-lg bg-background/50 border border-border/50">
                      <h4 className="font-medium text-foreground mb-1">{theme.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
                      {theme.thoughts && theme.thoughts.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {theme.thoughts.map((thought, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {thought.length > 40 ? thought.substring(0, 40) + '...' : thought}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Connections */}
            {analysis.connections && analysis.connections.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-primary" />
                    Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.connections.map((connection, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <Badge variant="outline">{connection.from}</Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline">{connection.to}</Badge>
                      <span className="text-muted-foreground">— {connection.relationship}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Emotions */}
            {analysis.emotions && analysis.emotions.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Emotional Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.emotions.map((emotion, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{emotion.emotion}</span>
                        <Badge variant="secondary" className="text-xs capitalize">{emotion.intensity}</Badge>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full bg-primary/60 rounded-full ${getIntensityWidth(emotion.intensity)}`}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{emotion.source}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Action Items */}
            {analysis.actionItems && analysis.actionItems.length > 0 && (
              <Card className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.actionItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                      <Badge className={`capitalize ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                      <div>
                        <p className="text-foreground">{item.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">Related to: {item.theme}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ThoughtUntanglerView;
