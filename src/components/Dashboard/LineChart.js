import React from 'react';

const LineChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const width = 600;
  const height = 350;
  const padding = 60;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((item.value - minValue) / range) * (height - 2 * padding);
    return { x, y, ...item };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-svg">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Y-axis */}
        <line 
          x1={padding} 
          y1={padding} 
          x2={padding} 
          y2={height - padding} 
          stroke="#6b7280" 
          strokeWidth="1"
        />
        
        {/* X-axis */}
        <line 
          x1={padding} 
          y1={height - padding} 
          x2={width - padding} 
          y2={height - padding} 
          stroke="#6b7280" 
          strokeWidth="1"
        />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="var(--cultural-blue)"
          strokeWidth="2"
          className="line-path"
        />
        
        {/* Points */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="var(--cultural-blue)"
            stroke="white"
            strokeWidth="2"
            className="line-point"
            title={`${point.label}: ${point.value}`}
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const value = Math.round(minValue + ratio * range);
          const y = height - padding - ratio * (height - 2 * padding);
          return (
            <text
              key={index}
              x={padding - 10}
              y={y + 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {value}
            </text>
          );
        })}
        
        {/* X-axis labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={height - padding + 20}
            textAnchor="middle"
            fontSize="12"
            fill="#6b7280"
          >
            {point.label}
          </text>
        ))}
      </svg>
      
      {yAxisLabel && (
        <div className="y-axis-label">
          <span>{yAxisLabel}</span>
        </div>
      )}
      {xAxisLabel && (
        <div className="x-axis-label">
          <span>{xAxisLabel}</span>
        </div>
      )}
    </div>
  );
};

export default LineChart;

