import React from 'react';

const ChartContainer = ({ title, children, className = '', actions }) => {
  return (
    <div className={`chart-container ${className}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {actions && (
          <div className="chart-actions">
            {actions}
          </div>
        )}
      </div>
      <div className="chart-content">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;

