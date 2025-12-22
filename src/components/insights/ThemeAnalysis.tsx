import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ThemeAnalysisProps {
  moodByDayOfWeek: { day: string; avgMood: number; count: number }[];
  commonWords: { word: string; count: number }[];
}

const moodColors = [
  'hsl(var(--destructive))',
  'hsl(38 90% 60%)',
  'hsl(var(--muted-foreground))',
  'hsl(174 58% 45%)',
  'hsl(var(--primary))'
];

const getMoodColor = (mood: number) => {
  if (mood === 0) return 'hsl(var(--muted))';
  const index = Math.min(Math.floor(mood) - 1, 4);
  return moodColors[index];
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { day, avgMood, count } = payload[0].payload;
    if (count === 0) return null;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium">{day}</p>
        <p className="text-sm text-muted-foreground">
          Avg: {avgMood.toFixed(1)}/5 ({count} check-ins)
        </p>
      </div>
    );
  }
  return null;
};

const ThemeAnalysis: React.FC<ThemeAnalysisProps> = ({ moodByDayOfWeek, commonWords }) => {
  const hasData = moodByDayOfWeek.some(d => d.count > 0);

  return (
    <div className="space-y-6">
      {/* Mood by Day of Week */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Mood by Day of Week</h4>
        {hasData ? (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodByDayOfWeek} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 5]}
                  hide
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgMood" radius={[4, 4, 0, 0]}>
                  {moodByDayOfWeek.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getMoodColor(entry.avgMood)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Check in more to see patterns</p>
        )}
      </div>

      {/* Common Themes */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Common Themes in Journal</h4>
        {commonWords.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {commonWords.map(({ word, count }) => (
              <span 
                key={word}
                className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                title={`Mentioned ${count} times`}
              >
                {word}
                <span className="ml-1 opacity-60">×{count}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Write more journal entries to discover themes</p>
        )}
      </div>
    </div>
  );
};

export default ThemeAnalysis;
