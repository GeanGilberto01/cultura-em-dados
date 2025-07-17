import React, { useState, useEffect } from 'react';
import CulturalMap from '../components/Map/MapContainer';
import MapFilters from '../components/Map/MapFilters';

const Map = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableSegments, setAvailableSegments] = useState([]);

  useEffect(() => {
    fetch('./locais_culturais.json')
      .then((res) => res.json())
      .then((json) => {
        const locais = json.data;
        setData(locais);

        // Extrair tipos únicos
        const tiposUnicos = [...new Set(locais.map(loc => loc.tipo))];
        setAvailableTypes(tiposUnicos);

        // Extrair todos os segmentos culturais únicos
        const segmentosUnicos = [...new Set(locais.flatMap(loc => loc.segmentosCulturais || []))];
        setAvailableSegments(segmentosUnicos);
      })
      .catch((err) => {
        console.error('Erro ao carregar JSON:', err);
      });
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Aplicar os filtros ao JSON
  const filteredData = data.filter((item) => {
    if (filters.tipo && item.tipo !== filters.tipo) return false;
    if (filters.segmento && !(item.segmentosCulturais || []).includes(filters.segmento)) return false;
    if (filters.avaliacaoMin && item.avaliacao < parseFloat(filters.avaliacaoMin)) return false;

    const totalParticipantes = (item.eventos || []).reduce((sum, evento) => {
      return sum + Object.values(evento.participantes || {}).reduce((a, b) => a + b, 0);
    }, 0);

    if (filters.participantesMin && totalParticipantes < parseInt(filters.participantesMin)) return false;

    return true;
  });

  return (
    <div
      className="map-wrapper"
      style={{ display: 'flex', height: '100vh', width: '100vw' }}
    >
      <div style={{ width: 320, padding: 16, borderRight: '1px solid #ccc', overflowY: 'auto' }}>
        <MapFilters
          onFiltersChange={handleFiltersChange}
          availableTypes={availableTypes}
          availableSegments={availableSegments}
        />
      </div>

      <div style={{ flexGrow: 1 }}>
        <CulturalMap
          regions={filteredData}
          filters={filters}
        />
      </div>
    </div>
  );
};

export default Map;
