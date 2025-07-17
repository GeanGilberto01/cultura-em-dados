import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/Dashboard/StatCard';
import ChartContainer from '../components/Dashboard/ChartContainer';
import BarChart from '../components/Dashboard/BarChart';
import PieChart from '../components/Dashboard/PieChart';
import LineChart from '../components/Dashboard/LineChart';
import FilterPanel from '../components/Dashboard/FilterPanel';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [filters, setFilters] = useState({});
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/locais_culturais.json`)
        const json = await response.json();
        setRawData(json.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, []);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAcoes: 0,
      totalParticipantes: 0,
      totalRegioes: 0,
      mediaAvaliacao: 0
    },
    acoesPorSegmento: [],
    participantesPorMes: [],
    acoesPorRegiao: [],
    distribuicaoPublico: []
  });

  useEffect(() => {
    if (rawData.length === 0) return;

    let totalAcoes = 0;
    let totalParticipantes = 0;
    let totalAvaliacao = 0;
    let totalLocais = 0;

    const segmentos = new Map();
    const meses = new Map();
    const regioes = new Map();
    const faixas = { Infantil: 0, Jovem: 0, Adulto: 0, Idoso: 0 };
    const regioesSet = new Set();

    rawData.forEach(local => {
      totalLocais++;
      totalAvaliacao += local.avaliacao || 0;
      regioesSet.add(local.endereco.regiao);

      local.eventos.forEach(evento => {
        totalAcoes++;

        const seg = evento.segmento || 'Outros';
        segmentos.set(seg, (segmentos.get(seg) || 0) + 1);

        const [dia, mesStr, ano] = evento.data.split('/');
        const mesAno = `${ano}-${mesStr.padStart(2, '0')}`;

        const totalPartEvento = Object.values(evento.participantes).reduce((a, b) => a + b, 0);
        meses.set(mesAno, (meses.get(mesAno) || 0) + totalPartEvento);

        totalParticipantes += totalPartEvento;

        for (const faixa in evento.participantes) {
          faixas[faixa] += evento.participantes[faixa];
        }

        const regiao = local.endereco.regiao;
        regioes.set(regiao, (regioes.get(regiao) || 0) + 1);
      });
    });

    // Montagem final
    const acoesPorSegmento = Array.from(segmentos.entries()).map(([label, value]) => ({
      label,
      value,
      color: gerarCor(label)
    }));

    const participantesPorMes = Array.from(meses.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([label, value]) => ({ label, value }));

    const acoesPorRegiao = Array.from(regioes.entries()).map(([label, value]) => ({
      label,
      value
    }));

    const distribuicaoPublico = Object.entries(faixas).map(([label, value]) => ({
      label: faixaLabelComIdade(label),
      value,
      color: gerarCor(label)
    }));

    const mediaAvaliacao = (totalAvaliacao / totalLocais).toFixed(1);

    setDashboardData({
      stats: {
        totalAcoes,
        totalParticipantes,
        totalRegioes: regioesSet.size,
        mediaAvaliacao: parseFloat(mediaAvaliacao)
      },
      acoesPorSegmento,
      participantesPorMes,
      acoesPorRegiao,
      distribuicaoPublico
    });

  }, [rawData]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const gerarCor = (label) => {
    const cores = {
      'Música': '	#191970',
      'Teatro': '#00FF00',
      'Dança': '#FF1493',
      'Literatura': '#8B008B',
      'Artes Visuais': '#ef4444',
      'Cinema': '#06b6d4',
      'História': '#10b981',
      'Ciência': '#f97316',
      'Fotografia': '#facc15',
      'Folclore': '#C71585',
      'Pintura': '#8b5cf6',
      'Escultura': '#F5DEB3',
      'Outros': '#84cc16',
      'Infantil': '#8B008B',
      'Jovem': '	#191970',
      'Adulto': '#00FF00',
      'Idoso': '#f97316'
    };
    return cores[label] || '#999999';
  };

  const faixaLabelComIdade = (faixa) => {
    switch (faixa) {
      case 'Infantil': return 'Infantil (0-17)';
      case 'Jovem': return 'Jovem (18-30)';
      case 'Adulto': return 'Adulto (31-50)';
      case 'Idoso': return 'Idoso (51+)';
      default: return faixa;
    }
  };

  const exportData = (format) => {
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8,"
        + dashboardData.acoesPorSegmento.map(e => `${e.label},${e.value}`).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "acoes_por_segmento.csv");
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1 className="dashboard-title">
            Dashboard Cultural
          </h1>
          <p className="dashboard-subtitle">
            Bem-vindo, {usuario?.nome}! Aqui estão as estatísticas culturais mais recentes.
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {/* Filtros */}
          {/* <FilterPanel 
            onFiltersChange={handleFiltersChange}
            regions={[
              { id: 1, nome: 'Centro' },
              { id: 2, nome: 'Norte' },
              { id: 3, nome: 'Sul' },
              { id: 4, nome: 'Leste' },
              { id: 5, nome: 'Oeste' }
            ]}
            segments={[
              { id: 1, nome: 'Música' },
              { id: 2, nome: 'Teatro' },
              { id: 3, nome: 'Dança' },
              { id: 4, nome: 'Literatura' },
              { id: 5, nome: 'Artes Visuais' }
            ]}
          /> */}

          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            <StatCard
              title="Total de Ações"
              value={dashboardData.stats.totalAcoes.toLocaleString()}
              change="+12%"
              changeType="increase"
              color="blue"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
            
            <StatCard
              title="Participantes"
              value={dashboardData.stats.totalParticipantes.toLocaleString()}
              change="+8%"
              changeType="increase"
              color="green"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
            
            <StatCard
              title="Regiões Ativas"
              value={dashboardData.stats.totalRegioes}
              change="+3"
              changeType="increase"
              color="orange"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            />
            
            <StatCard
              title="Avaliação Média"
              value={dashboardData.stats.mediaAvaliacao.toFixed(1)}
              change="+0.3"
              changeType="increase"
              color="purple"
              icon={
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              }
            />
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            {/* Ações por Segmento */}
            <ChartContainer 
              title="Ações por Segmento Cultural"
              actions={
                <button 
                  onClick={() => exportData('csv')}
                  className="btn-export"
                >
                  Exportar
                </button>
              }
            >
              <PieChart data={dashboardData.acoesPorSegmento} />
            </ChartContainer>

            {/* Participantes por Mês */}
            <ChartContainer title="Evolução de Participantes">
              <LineChart data={dashboardData.participantesPorMes}/>
            </ChartContainer>

            {/* Ações por Região */}
            <ChartContainer title="Ações por Região">
              <BarChart data={dashboardData.acoesPorRegiao}/>
            </ChartContainer>

            {/* Distribuição do Público */}
            <ChartContainer title="Distribuição do Público por Faixa Etária">
              <PieChart data={dashboardData.distribuicaoPublico} />
            </ChartContainer>
          </div>

          {/* Insights */}
          <div className="insights-section">
            <h2 className="insights-title">Insights e Tendências</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon positive">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h3>Crescimento Consistente</h3>
                  <p>O número de participantes cresceu 8% no último mês, indicando maior engajamento da comunidade.</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon info">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h3>Música Lidera</h3>
                  <p>Ações musicais representam 26% do total, sendo o segmento mais ativo da região.</p>
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-icon warning">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="insight-content">
                  <h3>Oportunidade de Expansão</h3>
                  <p>A região Oeste tem menor atividade cultural, representando uma oportunidade de investimento.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;