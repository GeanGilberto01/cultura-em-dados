import React, { useState } from 'react';

const MapFilters = ({
  onFiltersChange,
  className = '',
  availableTypes = [],
  availableSegments = []
}) => {
  const [filters, setFilters] = useState({
    tipo: '',
    segmento: '',
    avaliacaoMin: '',
    participantesMin: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      tipo: '',
      segmento: '',
      avaliacaoMin: '',
      participantesMin: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={`map-filters ${className}`}>
      {hasActiveFilters && (
        <button onClick={clearFilters} className="clear-button">
          Limpar
        </button>
      )}

      <div className="filters-content">
        <div className="filters-grid">
          {/* Tipo de Local */}
          <div className="filter-group">
            <label className="form-label">Tipo de Local</label>
            <select
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              className="form-input"
            >
              <option value="">Todos os tipos</option>
              {availableTypes.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          {/* Segmento Cultural */}
          <div className="filter-group">
            <label className="form-label">Segmento Cultural</label>
            <select
              value={filters.segmento}
              onChange={(e) => handleFilterChange('segmento', e.target.value)}
              className="form-input"
            >
              <option value="">Todos os segmentos</option>
              {availableSegments.map((segmento) => (
                <option key={segmento} value={segmento}>{segmento}</option>
              ))}
            </select>
          </div>

          {/* Avaliação mínima */}
          <div className="filter-group">
            <label className="form-label">Avaliação Mínima</label>
            <select
              value={filters.avaliacaoMin}
              onChange={(e) => handleFilterChange('avaliacaoMin', e.target.value)}
              className="form-input"
            >
              <option value="">Qualquer avaliação</option>
              <option value="5">5.0 ou mais ★</option>
              <option value="6">6.0 ou mais ★</option>
              <option value="7">7.0 ou mais ★</option>
              <option value="8">8.0 ou mais ★</option>
              <option value="9">9.0 ou mais ★</option>
              <option value="10">10.0 ★</option>
            </select>
          </div>

          {/* Participantes mínimos */}
          <div className="filter-group">
            <label className="form-label">Participantes Mínimos</label>
            <select
              value={filters.participantesMin}
              onChange={(e) => handleFilterChange('participantesMin', e.target.value)}
              className="form-input"
            >
              <option value="">Qualquer quantidade</option>
              <option value="500">500 ou mais</option>
              <option value="1000">1.000 ou mais</option>
              <option value="1500">1.500 ou mais</option>
              <option value="2000">2.000 ou mais</option>
            </select>
          </div>
        </div>

        {/* Legenda */}
        <div className="map-legend">
          <h4 className="legend-title">Legenda</h4>
          <div className="legend-items">
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#0ea5e9' }}>CC</div><span>Centro Cultural</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#10b981' }}>T</div><span>Teatro</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#f97316' }}>CA</div><span>Casa de Cultura</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#8b5cf6' }}>E</div><span>Espaço Cultural</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#ef4444' }}>B</div><span>Biblioteca</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#06b6d4' }}>M</div><span>Museu</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#facc15' }}>GA</div><span>Galeria de Arte</span></div>
            <div className="legend-item"><div className="legend-marker" style={{ backgroundColor: '#C71585' }}>C</div><span>Cinema</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFilters;
