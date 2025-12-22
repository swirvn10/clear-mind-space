import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MoodDataPoint } from '@/hooks/useInsights';

interface MoodChartProps {
  data: MoodDataPoint[];
  averageMood: number;
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm text-muted-foreground">{payload[0].payload.formattedDate}</p>
        <p className="text-lg font-medium">
          {moodEmojis[mood - 1]} Mood: {mood}/5
        </p>
      </div>
    );
  }
  return null;
};

const MoodChart: React.FC<MoodChartProps> = ({ data, averageMood }) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-muted-foreground">
        <p>No mood data yet. Start checking in daily!</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="formattedDate" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => moodEmojis[value - 1] || ''}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={averageMood} 
            stroke="hsl(var(--primary))" 
            strokeDasharray="3 3" 
            strokeOpacity={0.5}
          />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
