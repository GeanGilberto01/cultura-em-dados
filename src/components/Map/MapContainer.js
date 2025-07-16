import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrigir ícones padrão
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapController = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  return null;
};

const createCustomIcon = (color, type) => {
  const iconHtml = `
    <div style="
      background-color: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">
      ${type}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

const getMarkerColor = (tipo) => {
  const colors = {
    'Centro Cultural': '#0ea5e9',
    'Teatro': '#10b981',
    'Casa de Cultura': '#f97316',
    'Espaço Cultural': '#8b5cf6',
    'Biblioteca': '#ef4444',
    'Museu': '#06b6d4',
    'Galeria de Arte': '#facc15',
    'Cinema': '#C71585',
  };
  return colors[tipo] || '#6b7280';
};

const getMarkerIcon = (tipo) => {
  const icons = {
    'Centro Cultural': 'CC',
    'Casa de Cultura': 'CA',
    'Teatro': 'T',
    'Espaço Cultural': 'E',
    'Biblioteca': 'B',
    'Museu': 'M',
    'Galeria de Arte': 'GA',
    'Cinema': 'C',
  };
  return icons[tipo] || '?';
};

const CulturalMap = ({
  selectedRegion = null,
  onRegionSelect = () => {},
  filters = {},
  className = '',
}) => {
  const [mapCenter, setMapCenter] = useState([-15.7942, -47.8822]);
  const [mapZoom, setMapZoom] = useState(4);
  const [culturalRegions, setCulturalRegions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/locais_culturais.json');
        const json = await res.json();

        if (!Array.isArray(json.data)) {
          console.error('Formato inválido:', json);
          return;
        }

        const parsed = json.data.map((item, index) => {
          const totalAcoes = item.eventos.length;
          const participantes = item.eventos.reduce((total, ev) => {
            return total + Object.values(ev.participantes).reduce((soma, val) => soma + val, 0);
          }, 0);

          return {
            id: index + 1,
            nome: item.local,
            tipo: item.tipo,
            latitude: item.endereco.latitude,
            longitude: item.endereco.longitude,
            totalAcoes,
            participantes,
            segmentos: item.segmentosCulturais,
            avaliacao: item.avaliacao,
            endereco: `${item.endereco.logradouro}, ${item.endereco.bairro} - ${item.endereco.cidade}/${item.endereco.estado}`,
            descricao: item.descricao
          };
        });

        setCulturalRegions(parsed);
      } catch (error) {
        console.error('Erro ao carregar JSON:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const region = culturalRegions.find(r => r.id === selectedRegion);
      if (region) {
        setMapCenter([region.latitude, region.longitude]);
        setMapZoom(12);
      }
    }
  }, [selectedRegion, culturalRegions]);

  const filteredRegions = culturalRegions.filter(region => {
    if (filters.tipo && region.tipo !== filters.tipo) return false;
    if (filters.segmento && !region.segmentos.includes(filters.segmento)) return false;
    if (filters.avaliacaoMin && region.avaliacao < parseFloat(filters.avaliacaoMin)) return false;
    if (filters.participantesMin && region.participantes < parseInt(filters.participantesMin)) return false;
    return true;
  });

  return (
    <div className={`cultural-map ${className}`}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filteredRegions.map(region => (
          <Marker
            key={region.id}
            position={[region.latitude, region.longitude]}
            icon={createCustomIcon(getMarkerColor(region.tipo), getMarkerIcon(region.tipo))}
            eventHandlers={{ click: () => onRegionSelect(region) }}
          >
            <Popup>
              <div className="map-popup">
                <h3 className="popup-title">{region.nome}</h3>
                <p className="popup-address">{region.endereco}</p>
                <p className="popup-description">{region.descricao}</p>
                <div className="popup-stats">
                  <div className="stat-item"><strong>Ações:</strong> {region.totalAcoes}</div>
                  <div className="stat-item"><strong>Participantes:</strong> {region.participantes.toLocaleString()}</div>
                  <div className="stat-item"><strong>Avaliação:</strong> {region.avaliacao}/10</div>
                </div>
                <div className="popup-segments">
                  <strong>Segmentos:</strong>
                  <ul>
                    {region.segmentos.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CulturalMap;
