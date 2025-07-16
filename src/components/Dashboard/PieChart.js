import React from 'react';

const PieChart = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  const createPath = (percentage, cumulativePercentage) => {
    const startAngle = cumulativePercentage * 3.6; // Convert to degrees
    const endAngle = (cumulativePercentage + percentage) * 3.6;
    
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = 50 + 40 * Math.cos(startAngleRad);
    const y1 = 50 + 40 * Math.sin(startAngleRad);
    const x2 = 50 + 40 * Math.cos(endAngleRad);
    const y2 = 50 + 40 * Math.sin(endAngleRad);
    
    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="pie-chart">
      <div className="pie-chart-container">
        <svg viewBox="0 0 100 100" className="pie-svg">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const path = createPath(percentage, cumulativePercentage);
            cumulativePercentage += percentage;
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`}
                stroke="white"
                strokeWidth="0.5"
                className="pie-slice"
                title={`${item.label}: ${item.value} (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </svg>
      </div>
      
      <div className="pie-legend">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{
                  backgroundColor: item.color || `hsl(${index * 360 / data.length}, 70%, 50%)`
                }}
              ></div>
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value} ({percentage}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;

