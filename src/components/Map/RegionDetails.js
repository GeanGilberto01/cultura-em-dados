import React from 'react';

const RegionDetails = ({ region, onClose, className = '' }) => {
  if (!region) return null;

  const getTypeLabel = (tipo) => {
    const labels = {
      centro_cultural: 'Centro Cultural',
      teatro: 'Teatro',
      casa_cultura: 'Casa de Cultura',
      espaco_cultural: 'Espaço Cultural',
      biblioteca: 'Biblioteca',
      museu: 'Museu'
    };
    return labels[tipo] || tipo;
  };

  const getSegmentLabel = (segmento) => {
    const labels = {
      música: 'Música',
      teatro: 'Teatro',
      dança: 'Dança',
      literatura: 'Literatura',
      artes_visuais: 'Artes Visuais',
      cinema: 'Cinema'
    };
    return labels[segmento] || segmento;
  };

  return (
    <div className={`region-details ${className}`}>
      <div className="details-header">
        <h2 className="details-title">{region.nome}</h2>
        <button onClick={onClose} className="close-button">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="details-content">
        {/* Informações Básicas */}
        <div className="info-section">
          <h3 className="section-title">Informações Básicas</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tipo:</span>
              <span className="info-value">{getTypeLabel(region.tipo)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Endereço:</span>
              <span className="info-value">{region.endereco}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Avaliação:</span>
              <div className="rating-display">
                <span className="rating-value">{region.avaliacao}/10</span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`star ${i < Math.floor(region.avaliacao / 2) ? 'filled' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="stats-section">
          <h3 className="section-title">Estatísticas</h3>
          <div className="stats-grid">
            <div className="stat-card-small">
              <div className="stat-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Total de Ações</span>
                <span className="stat-value">{region.totalAcoes}</span>
              </div>
            </div>

            <div className="stat-card-small">
              <div className="stat-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-label">Participantes</span>
                <span className="stat-value">{region.participantes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segmentos Culturais */}
        <div className="segments-section">
          <h3 className="section-title">Segmentos Culturais</h3>
          <div className="segments-grid">
            {region.segmentos.map((segmento, index) => (
              <div key={index} className="segment-card">
                <span className="segment-name">{getSegmentLabel(segmento)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="description-section">
          <h3 className="section-title">Descrição</h3>
          <p className="description-text">{region.descricao}</p>
        </div>

        {/* Ações */}
        {/* <div className="actions-section">
          <button className="btn btn-primary">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Ver Relatório Completo
          </button>
          
          <button className="btn btn-secondary">
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Centralizar no Mapa
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default RegionDetails;

