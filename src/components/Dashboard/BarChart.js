import React from 'react';

const BarChart = ({ data, title, xAxisLabel, yAxisLabel }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  // Encontrar o valor máximo para normalizar as barras
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="bar-chart">
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-container">
              <div 
                className="bar"
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || 'var(--cultural-blue)'
                }}
                title={`${item.label}: ${item.value}`}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
            <div className="bar-label">{item.label}</div>
          </div>
        ))}
      </div>
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

export default BarChart;

