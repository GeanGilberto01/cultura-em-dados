import React, { useState } from 'react';

const FilterPanel = ({ onFiltersChange, regions = [], segments = [] }) => {
  const [filters, setFilters] = useState({
    regiao: '',
    segmento: '',
    periodo: 'ultimo_mes',
    dataInicio: '',
    dataFim: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      regiao: '',
      segmento: '',
      periodo: 'ultimo_mes',
      dataInicio: '',
      dataFim: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3 className="filter-title">Filtros</h3>
        <button 
          onClick={clearFilters}
          className="btn-clear-filters"
        >
          Limpar
        </button>
      </div>

      <div className="filter-grid">
        {/* Filtro de Região */}
        <div className="filter-group">
          <label className="form-label">Região</label>
          <select
            value={filters.regiao}
            onChange={(e) => handleFilterChange('regiao', e.target.value)}
            className="form-input"
          >
            <option value="">Todas as regiões</option>
            {regions.map(regiao => (
              <option key={regiao.id} value={regiao.id}>
                {regiao.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Segmento */}
        <div className="filter-group">
          <label className="form-label">Segmento Cultural</label>
          <select
            value={filters.segmento}
            onChange={(e) => handleFilterChange('segmento', e.target.value)}
            className="form-input"
          >
            <option value="">Todos os segmentos</option>
            {segments.map(segmento => (
              <option key={segmento.id} value={segmento.id}>
                {segmento.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Período */}
        <div className="filter-group">
          <label className="form-label">Período</label>
          <select
            value={filters.periodo}
            onChange={(e) => handleFilterChange('periodo', e.target.value)}
            className="form-input"
          >
            <option value="ultimo_mes">Último mês</option>
            <option value="ultimos_3_meses">Últimos 3 meses</option>
            <option value="ultimo_semestre">Último semestre</option>
            <option value="ultimo_ano">Último ano</option>
            <option value="personalizado">Período personalizado</option>
          </select>
        </div>

        {/* Filtros de Data Personalizada */}
        {filters.periodo === 'personalizado' && (
          <>
            <div className="filter-group">
              <label className="form-label">Data Início</label>
              <input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="filter-group">
              <label className="form-label">Data Fim</label>
              <input
                type="date"
                value={filters.dataFim}
                onChange={(e) => handleFilterChange('dataFim', e.target.value)}
                className="form-input"
              />
            </div>
          </>
        )}
      </div>

      {/* Resumo dos filtros ativos */}
      <div className="active-filters">
        {Object.entries(filters).map(([key, value]) => {
          if (!value || key === 'dataInicio' || key === 'dataFim') return null;
          
          let displayValue = value;
          if (key === 'regiao') {
            const regiao = regions.find(r => r.id.toString() === value);
            displayValue = regiao ? regiao.nome : value;
          } else if (key === 'segmento') {
            const segmento = segments.find(s => s.id.toString() === value);
            displayValue = segmento ? segmento.nome : value;
          } else if (key === 'periodo') {
            const periodos = {
              'ultimo_mes': 'Último mês',
              'ultimos_3_meses': 'Últimos 3 meses',
              'ultimo_semestre': 'Último semestre',
              'ultimo_ano': 'Último ano',
              'personalizado': 'Personalizado'
            };
            displayValue = periodos[value] || value;
          }

          return (
            <span key={key} className="filter-tag">
              {displayValue}
              <button
                onClick={() => handleFilterChange(key, '')}
                className="filter-tag-remove"
              >
                ×
              </button>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPanel;

