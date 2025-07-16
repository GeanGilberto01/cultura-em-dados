import React from 'react';

const StatCard = ({ title, value, change, changeType, icon, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          icon: 'bg-green-500',
          text: 'text-green-600'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          icon: 'bg-orange-500',
          text: 'text-orange-600'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          icon: 'bg-purple-500',
          text: 'text-purple-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          icon: 'bg-blue-500',
          text: 'text-blue-600'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-header">
          <div className={`stat-icon ${color}`}>
            {icon}
          </div>
          <div className="stat-info">
            <p className="stat-title">{title}</p>
            <p className="stat-value">{value}</p>
          </div>
        </div>
        
        {change && (
          <div className="stat-change">
            <span className={`change-indicator ${changeType === 'increase' ? 'positive' : 'negative'}`}>
              {changeType === 'increase' ? (
                <svg className="change-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              ) : (
                <svg className="change-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              {change}
            </span>
            <span className="change-period">vs. mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

