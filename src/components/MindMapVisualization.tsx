import React, { useMemo, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

interface MindMapVisualizationProps {
  themes: Theme[];
  connections: Connection[];
}

interface Position {
  x: number;
  y: number;
}

const MindMapVisualization: React.FC<MindMapVisualizationProps> = ({ themes, connections }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate initial node positions in a circular layout
  const initialPositions = useMemo((): Record<string, Position> => {
    const centerX = 200;
    const centerY = 180;
    const radius = 120;

    const positions: Record<string, Position> = {};
    themes.forEach((theme, index) => {
      const angle = (2 * Math.PI * index) / themes.length - Math.PI / 2;
      positions[theme.title] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
    return positions;
  }, [themes]);

  // Track custom positions (overrides initial positions when dragged)
  const [customPositions, setCustomPositions] = useState<Record<string, Position>>({});

  // Get current position for a node (custom if exists, otherwise initial)
  const getNodePosition = useCallback((title: string): Position => {
    return customPositions[title] || initialPositions[title] || { x: 200, y: 180 };
  }, [customPositions, initialPositions]);

  // Reset all positions to initial layout
  const resetPositions = () => {
    setCustomPositions({});
  };

  // Handle drag
  const handleDrag = useCallback((title: string, event: any, info: any) => {
    if (!svgRef.current) return;
    
    // Get SVG dimensions for coordinate conversion
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    
    // Convert screen coordinates to SVG coordinates
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    
    const currentPos = getNodePosition(title);
    const newX = currentPos.x + info.delta.x * scaleX;
    const newY = currentPos.y + info.delta.y * scaleY;
    
    // Clamp to viewBox bounds with padding
    const padding = 40;
    const clampedX = Math.max(padding, Math.min(viewBox.width - padding, newX));
    const clampedY = Math.max(padding, Math.min(viewBox.height - padding, newY));
    
    setCustomPositions(prev => ({
      ...prev,
      [title]: { x: clampedX, y: clampedY }
    }));
  }, [getNodePosition]);

  // Find connections between nodes using current positions
  const connectionLines = useMemo(() => {
    return connections.map((conn, index) => {
      const fromTheme = themes.find(t => 
        t.title.toLowerCase().includes(conn.from.toLowerCase()) ||
        conn.from.toLowerCase().includes(t.title.toLowerCase())
      );
      const toTheme = themes.find(t => 
        t.title.toLowerCase().includes(conn.to.toLowerCase()) ||
        conn.to.toLowerCase().includes(t.title.toLowerCase())
      );

      if (fromTheme && toTheme) {
        const fromPos = getNodePosition(fromTheme.title);
        const toPos = getNodePosition(toTheme.title);
        return {
          x1: fromPos.x,
          y1: fromPos.y,
          x2: toPos.x,
          y2: toPos.y,
          relationship: conn.relationship,
          index,
        };
      }
      return null;
    }).filter(Boolean);
  }, [connections, themes, getNodePosition, customPositions]);

  // Color palette for nodes
  const nodeColors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(174, 58%, 45%)',
    'hsl(38, 90%, 50%)',
    'hsl(280, 60%, 55%)',
    'hsl(340, 65%, 55%)',
  ];

  const hasCustomPositions = Object.keys(customPositions).length > 0;

  if (themes.length === 0) return null;

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {hasCustomPositions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPositions}
            className="h-8 px-2 text-xs bg-card/80 backdrop-blur hover:bg-card"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-card/80 backdrop-blur text-xs text-muted-foreground">
          <Move className="w-3 h-3" />
          Drag nodes
        </div>
      </div>

      <svg
        ref={svgRef}
        viewBox="0 0 400 360"
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        {/* Definitions for gradients and filters */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowDrag" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {nodeColors.map((color, i) => (
            <linearGradient key={i} id={`nodeGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>

        {/* Connection lines between themes */}
        {connectionLines.map((line, index) => {
          if (!line) return null;
          const isHovered = hoveredConnection === index;
          
          // Calculate control point for curved line
          const midX = (line.x1 + line.x2) / 2;
          const midY = (line.y1 + line.y2) / 2;
          const dx = line.x2 - line.x1;
          const dy = line.y2 - line.y1;
          const curvature = 0.2;
          const controlX = midX - dy * curvature;
          const controlY = midY + dx * curvature;

          return (
            <g key={index}>
              <motion.path
                d={`M ${line.x1} ${line.y1} Q ${controlX} ${controlY} ${line.x2} ${line.y2}`}
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={isHovered ? 3 : 2}
                strokeOpacity={isHovered ? 0.8 : 0.3}
                strokeDasharray={isHovered ? "0" : "6 4"}
                filter={isHovered ? "url(#glow)" : undefined}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                onMouseEnter={() => setHoveredConnection(index)}
                onMouseLeave={() => setHoveredConnection(null)}
                className="cursor-pointer"
              />
              {/* Connection label on hover */}
              {isHovered && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <rect
                    x={midX - 60}
                    y={midY - 12}
                    width={120}
                    height={24}
                    rx={12}
                    fill="hsl(var(--card))"
                    stroke="hsl(var(--border))"
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY + 4}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                    style={{ fontSize: '10px' }}
                  >
                    {line.relationship.length > 20 
                      ? line.relationship.substring(0, 20) + '...' 
                      : line.relationship}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Center node */}
        <motion.circle
          cx={200}
          cy={180}
          r={25}
          fill="hsl(var(--card))"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        />
        <motion.text
          x={200}
          y={184}
          textAnchor="middle"
          className="text-xs font-medium fill-primary pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '11px' }}
        >
          Core
        </motion.text>

        {/* Lines from center to theme nodes */}
        {themes.map((theme, index) => {
          const pos = getNodePosition(theme.title);
          const color = nodeColors[index % nodeColors.length];
          
          return (
            <motion.line
              key={`line-${theme.title}`}
              x1={200}
              y1={180}
              x2={pos.x}
              y2={pos.y}
              stroke={color}
              strokeWidth={2}
              strokeOpacity={0.3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
            />
          );
        })}

        {/* Theme nodes (draggable) */}
        {themes.map((theme, index) => {
          const pos = getNodePosition(theme.title);
          const isSelected = selectedNode === theme.title;
          const isDragging = draggingNode === theme.title;
          const color = nodeColors[index % nodeColors.length];
          
          return (
            <motion.g
              key={theme.title}
              drag
              dragMomentum={false}
              dragElastic={0}
              onDrag={(event, info) => handleDrag(theme.title, event, info)}
              onDragStart={() => setDraggingNode(theme.title)}
              onDragEnd={() => setDraggingNode(null)}
              onClick={() => !isDragging && setSelectedNode(isSelected ? null : theme.title)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 200 
              }}
              style={{ 
                cursor: isDragging ? 'grabbing' : 'grab',
                touchAction: 'none'
              }}
            >
              {/* Outer glow ring */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isDragging ? 52 : isSelected ? 48 : 40}
                fill="none"
                stroke={color}
                strokeWidth={isDragging ? 2 : 1}
                strokeOpacity={isDragging ? 0.6 : isSelected ? 0.4 : 0.15}
                animate={{
                  r: isDragging ? 52 : isSelected ? [48, 52, 48] : 40,
                  strokeOpacity: isDragging ? 0.6 : isSelected ? [0.4, 0.6, 0.4] : 0.15,
                }}
                transition={{
                  duration: 2,
                  repeat: isSelected && !isDragging ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />

              {/* Main node circle */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={35}
                fill={`url(#nodeGradient${index % nodeColors.length})`}
                filter={isDragging ? "url(#glowDrag)" : isSelected ? "url(#glowStrong)" : "url(#glow)"}
                animate={{
                  scale: isDragging ? 1.2 : isSelected ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              {/* Node title */}
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-medium fill-background pointer-events-none select-none"
                style={{ fontSize: '11px' }}
              >
                {theme.title.length > 12 
                  ? theme.title.substring(0, 10) + '...' 
                  : theme.title}
              </text>

              {/* Thought count badge */}
              {theme.thoughts && theme.thoughts.length > 0 && (
                <g className="pointer-events-none">
                  <circle
                    cx={pos.x + 25}
                    cy={pos.y - 25}
                    r={10}
                    fill="hsl(var(--card))"
                    stroke={color}
                    strokeWidth={2}
                  />
                  <text
                    x={pos.x + 25}
                    y={pos.y - 21}
                    textAnchor="middle"
                    className="text-xs font-bold fill-foreground select-none"
                    style={{ fontSize: '9px' }}
                  >
                    {theme.thoughts.length}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Selected node details */}
      {selectedNode && !draggingNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur rounded-xl border border-border/50"
        >
          <h4 className="font-medium text-foreground mb-1">
            {themes.find(t => t.title === selectedNode)?.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {themes.find(t => t.title === selectedNode)?.description}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MindMapVisualization;
