import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';

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

interface NodePosition {
  x: number;
  y: number;
  theme: Theme;
}

const MindMapVisualization: React.FC<MindMapVisualizationProps> = ({ themes, connections }) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<number | null>(null);

  // Calculate node positions in a circular layout
  const nodePositions = useMemo((): NodePosition[] => {
    const centerX = 200;
    const centerY = 180;
    const radius = 120;

    return themes.map((theme, index) => {
      const angle = (2 * Math.PI * index) / themes.length - Math.PI / 2;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        theme,
      };
    });
  }, [themes]);

  // Find connections between nodes
  const connectionLines = useMemo(() => {
    return connections.map((conn, index) => {
      const fromNode = nodePositions.find(n => 
        n.theme.title.toLowerCase().includes(conn.from.toLowerCase()) ||
        conn.from.toLowerCase().includes(n.theme.title.toLowerCase())
      );
      const toNode = nodePositions.find(n => 
        n.theme.title.toLowerCase().includes(conn.to.toLowerCase()) ||
        conn.to.toLowerCase().includes(n.theme.title.toLowerCase())
      );

      if (fromNode && toNode) {
        return {
          x1: fromNode.x,
          y1: fromNode.y,
          x2: toNode.x,
          y2: toNode.y,
          relationship: conn.relationship,
          index,
        };
      }
      return null;
    }).filter(Boolean);
  }, [connections, nodePositions]);

  // Color palette for nodes
  const nodeColors = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(174, 58%, 45%)',
    'hsl(38, 90%, 50%)',
    'hsl(280, 60%, 55%)',
    'hsl(340, 65%, 55%)',
  ];

  if (themes.length === 0) return null;

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <svg
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
          {nodeColors.map((color, i) => (
            <linearGradient key={i} id={`nodeGradient${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={color} stopOpacity="0.6" />
            </linearGradient>
          ))}
        </defs>

        {/* Connection lines */}
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
          className="text-xs font-medium fill-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '11px' }}
        >
          Core
        </motion.text>

        {/* Theme nodes */}
        {nodePositions.map((node, index) => {
          const isSelected = selectedNode === node.theme.title;
          const color = nodeColors[index % nodeColors.length];
          
          return (
            <motion.g
              key={node.theme.title}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 200 
              }}
              onClick={() => setSelectedNode(isSelected ? null : node.theme.title)}
              className="cursor-pointer"
            >
              {/* Connection line to center */}
              <motion.line
                x1={200}
                y1={180}
                x2={node.x}
                y2={node.y}
                stroke={color}
                strokeWidth={2}
                strokeOpacity={0.3}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              />

              {/* Outer glow ring */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isSelected ? 48 : 40}
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeOpacity={isSelected ? 0.4 : 0.15}
                animate={{
                  r: isSelected ? [48, 52, 48] : 40,
                  strokeOpacity: isSelected ? [0.4, 0.6, 0.4] : 0.15,
                }}
                transition={{
                  duration: 2,
                  repeat: isSelected ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />

              {/* Main node circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={35}
                fill={`url(#nodeGradient${index % nodeColors.length})`}
                filter={isSelected ? "url(#glowStrong)" : "url(#glow)"}
                whileHover={{ scale: 1.1 }}
                animate={{
                  scale: isSelected ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 300 }}
              />

              {/* Node title */}
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-medium fill-background pointer-events-none"
                style={{ fontSize: '11px' }}
              >
                {node.theme.title.length > 12 
                  ? node.theme.title.substring(0, 10) + '...' 
                  : node.theme.title}
              </text>

              {/* Thought count badge */}
              {node.theme.thoughts && node.theme.thoughts.length > 0 && (
                <g>
                  <circle
                    cx={node.x + 25}
                    cy={node.y - 25}
                    r={10}
                    fill="hsl(var(--card))"
                    stroke={color}
                    strokeWidth={2}
                  />
                  <text
                    x={node.x + 25}
                    y={node.y - 21}
                    textAnchor="middle"
                    className="text-xs font-bold fill-foreground"
                    style={{ fontSize: '9px' }}
                  >
                    {node.theme.thoughts.length}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Selected node details */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur rounded-xl border border-border/50"
        >
          <h4 className="font-medium text-foreground mb-1">
            {nodePositions.find(n => n.theme.title === selectedNode)?.theme.title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {nodePositions.find(n => n.theme.title === selectedNode)?.theme.description}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MindMapVisualization;
