'use client';

import { useState, useEffect } from 'react';

interface DemoChartProps {
  className?: string;
  height?: number;
}

export function DemoChart({ className = '', height = 256 }: DemoChartProps) {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  // Mock data points for the chart
  const yesData = [5, 8, 12, 15, 20, 18, 22, 25, 30, 28, 32, 35];
  const noData = [95, 92, 88, 85, 80, 82, 78, 75, 70, 72, 68, 65];
  const labels = ['Oct 12', 'Oct 13', 'Oct 14', 'Oct 15', 'Oct 16', 'Oct 17', 'Oct 18', 'Oct 19', 'Oct 20', 'Oct 21', 'Oct 22', 'Oct 23'];

  // Convert data to SVG coordinates
  const width = 400;
  const chartHeight = height - 80; // Leave space for labels
  const padding = 40;

  const getYCoordinate = (value: number) => {
    return chartHeight - (value / 100) * chartHeight + padding;
  };

  const getXCoordinate = (index: number) => {
    return (index / (yesData.length - 1)) * (width - 2 * padding) + padding;
  };

  // Generate SVG path for Yes line
  const yesPath = yesData
    .map((value, index) => {
      const x = getXCoordinate(index);
      const y = getYCoordinate(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate SVG path for No line
  const noPath = noData
    .map((value, index) => {
      const x = getXCoordinate(index);
      const y = getYCoordinate(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ');

  // Generate area path for Yes (for gradient fill)
  const yesAreaPath = yesData
    .map((value, index) => {
      const x = getXCoordinate(index);
      const y = getYCoordinate(value);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    })
    .join(' ') + ` L ${getXCoordinate(yesData.length - 1)} ${chartHeight + padding} L ${getXCoordinate(0)} ${chartHeight + padding} Z`;

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="yesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
          </linearGradient>
          <linearGradient id="noGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 20, 40, 60, 80, 100].map((value) => (
          <g key={value}>
            <line
              x1={padding}
              y1={getYCoordinate(value)}
              x2={width - padding}
              y2={getYCoordinate(value)}
              stroke="rgba(156, 163, 175, 0.2)"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={getYCoordinate(value)}
              fill="rgba(156, 163, 175, 0.7)"
              fontSize="12"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {value}%
            </text>
          </g>
        ))}

        {/* Area fill for Yes */}
        <path
          d={yesAreaPath}
          fill="url(#yesGradient)"
        />

        {/* Yes line */}
        <path
          d={yesPath}
          stroke="#22c55e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* No line */}
        <path
          d={noPath}
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {yesData.map((value, index) => (
          <circle
            key={`yes-${index}`}
            cx={getXCoordinate(index)}
            cy={getYCoordinate(value)}
            r="4"
            fill="#22c55e"
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer hover:r-6 transition-all"
            onMouseEnter={() => setActivePoint(index)}
            onMouseLeave={() => setActivePoint(null)}
          />
        ))}

        {noData.map((value, index) => (
          <circle
            key={`no-${index}`}
            cx={getXCoordinate(index)}
            cy={getYCoordinate(value)}
            r="4"
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth="2"
            className="cursor-pointer hover:r-6 transition-all"
            onMouseEnter={() => setActivePoint(index)}
            onMouseLeave={() => setActivePoint(null)}
          />
        ))}

        {/* X-axis labels */}
        {labels.map((label, index) => (
          <text
            key={label}
            x={getXCoordinate(index)}
            y={height - 10}
            fill="rgba(156, 163, 175, 0.7)"
            fontSize="11"
            textAnchor="middle"
          >
            {index % 2 === 0 ? label : ''}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex items-center gap-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-foreground">
            Yes {yesData[yesData.length - 1]}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-foreground">
            No {noData[noData.length - 1]}%
          </span>
        </div>
      </div>

      {/* Tooltip for active point */}
      {activePoint !== null && (
        <div
          className="absolute bg-background border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none z-10"
          style={{
            left: `${(getXCoordinate(activePoint) / width) * 100}%`,
            top: `${(getYCoordinate(yesData[activePoint]) / height) * 100}%`,
            transform: 'translate(-50%, -100%)',
            marginTop: '-10px',
          }}
        >
          <div className="text-xs font-medium">{labels[activePoint]}</div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-500">Yes: {yesData[activePoint]}%</span>
            <span className="text-blue-500">No: {noData[activePoint]}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
