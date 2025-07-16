import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Relatorios = () => {
  const { usuario } = useAuth();
  const [filtros, setFiltros] = useState({
    regiao_id: '',
    segmento_id: '',
    data_inicio: '',
    data_fim: '',
    tipo: 'acoes'
  });
  const [regioes, setRegioes] = useState([]);
  const [segmentos] = useState([
    { id: 1, nome: 'Música' },
    { id: 2, nome: 'Teatro' },
    { id: 3, nome: 'Dança' },
    { id: 4, nome: 'Literatura' },
    { id: 5, nome: 'Artes Visuais' },
    { id: 6, nome: 'Cinema' }
  ]);
  const [dadosRelatorio, setDadosRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      window.location.href = '/login';
      return;
    }
    carregarRegioes();
  }, [usuario]);

  const carregarRegioes = async () => {
    try {
      const response = await api.get('/api/regioes');
      setRegioes(response.data.regioes || []);
    } catch (error) {
      console.error('Erro ao carregar regiões:', error);
    }
  };

  const gerarRelatorio = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params.append(key, filtros[key]);
      });

      const response = await api.get(`/api/relatorios/dados?${params.toString()}`);
      setDadosRelatorio(response.data);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params.append(key, filtros[key]);
      });

      const response = await api.get(`/api/relatorios/csv?${params.toString()}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${filtros.tipo}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      setError('Erro ao exportar CSV. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const exportarPDF = () => {
    if (!dadosRelatorio) {
      alert('Gere um relatório primeiro');
      return;
    }

    // Criar conteúdo HTML para impressão
    const conteudoHTML = gerarConteudoHTML(dadosRelatorio);
    
    // Abrir nova janela para impressão
    const novaJanela = window.open('', '_blank');
    novaJanela.document.write(conteudoHTML);
    novaJanela.document.close();
    novaJanela.print();
  };

  const gerarConteudoHTML = (dados) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório Cultural - ${new Date().toLocaleDateString('pt-BR')}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat-item { text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório Cultural</h1>
          <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
          <p>Período: ${dados.metadata.periodo.data_inicio} até ${dados.metadata.periodo.data_fim}</p>
        </div>

        <div class="section">
          <h3>Resumo Executivo</h3>
          <div class="stats">
            <div class="stat-item">
              <div class="stat-number">${dados.resumo.total_acoes}</div>
              <div>Total de Ações</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${dados.resumo.participantes_totais.toLocaleString('pt-BR')}</div>
              <div>Participantes</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${dados.resumo.media_participantes_por_acao}</div>
              <div>Média por Ação</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Distribuição por Segmento Cultural</h3>
          <table>
            <thead>
              <tr><th>Segmento</th><th>Total de Ações</th></tr>
            </thead>
            <tbody>
              ${dados.distribuicao.por_segmento.map(item => 
                `<tr><td>${item.segmento}</td><td>${item.total}</td></tr>`
              ).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>Distribuição por Região</h3>
          <table>
            <thead>
              <tr><th>Região</th><th>Total de Ações</th></tr>
            </thead>
            <tbody>
              ${dados.distribuicao.por_regiao.map(item => 
                `<tr><td>${item.regiao}</td><td>${item.total}</td></tr>`
              ).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>Top 10 Ações por Participantes</h3>
          <table>
            <thead>
              <tr><th>Ação</th><th>Região</th><th>Segmento</th><th>Participantes</th><th>Avaliação</th></tr>
            </thead>
            <tbody>
              ${dados.top_acoes.slice(0, 10).map(acao => 
                `<tr>
                  <td>${acao.nome}</td>
                  <td>${acao.Regiao?.nome || 'N/A'}</td>
                  <td>${acao.SegmentoCultural?.nome || 'N/A'}</td>
                  <td>${acao.Indicador?.participantes || 0}</td>
                  <td>${acao.Indicador?.avaliacao_media || 'N/A'}</td>
                </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  };

  if (!usuario) {
    return (
      <div className="relatorios-page">
        <div className="container">
          <div className="access-denied">
            <h2>Acesso Restrito</h2>
            <p>Você precisa estar logado para acessar os relatórios.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relatorios-page">
      <div className="relatorios-header">
        <div className="container">
          <h1 className="relatorios-title">Relatórios Culturais</h1>
          <p className="relatorios-subtitle">Gere relatórios personalizados com dados culturais filtrados</p>
        </div>
      </div>

      <div className="relatorios-content">
        <div className="container">
          <div className="relatorios-layout">
            {/* Painel de Filtros */}
            <div className="filtros-panel">
              <h3>Filtros do Relatório</h3>
              
              <div className="form-group">
                <label>Tipo de Relatório:</label>
                <select 
                  value={filtros.tipo} 
                  onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
                >
                  <option value="acoes">Ações Culturais</option>
                  <option value="regioes">Regiões</option>
                  <option value="indicadores">Indicadores</option>
                </select>
              </div>

              <div className="form-group">
                <label>Região:</label>
                <select 
                  value={filtros.regiao_id} 
                  onChange={(e) => setFiltros({...filtros, regiao_id: e.target.value})}
                >
                  <option value="">Todas as regiões</option>
                  {regioes.map(regiao => (
                    <option key={regiao.id} value={regiao.id}>{regiao.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Segmento Cultural:</label>
                <select 
                  value={filtros.segmento_id} 
                  onChange={(e) => setFiltros({...filtros, segmento_id: e.target.value})}
                >
                  <option value="">Todos os segmentos</option>
                  {segmentos.map(segmento => (
                    <option key={segmento.id} value={segmento.id}>{segmento.nome}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Data Início:</label>
                <input 
                  type="date" 
                  value={filtros.data_inicio}
                  onChange={(e) => setFiltros({...filtros, data_inicio: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Data Fim:</label>
                <input 
                  type="date" 
                  value={filtros.data_fim}
                  onChange={(e) => setFiltros({...filtros, data_fim: e.target.value})}
                />
              </div>

              <div className="filtros-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={gerarRelatorio}
                  disabled={loading}
                >
                  {loading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
              </div>
            </div>

            {/* Área de Resultados */}
            <div className="resultados-panel">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Gerando relatório...</p>
                </div>
              )}

              {dadosRelatorio && !loading && (
                <div className="relatorio-resultado">
                  <div className="resultado-header">
                    <h3>Relatório Gerado</h3>
                    <div className="export-actions">
                      <button className="btn btn-secondary" onClick={exportarCSV}>
                        Exportar CSV
                      </button>
                      <button className="btn btn-secondary" onClick={exportarPDF}>
                        Exportar PDF
                      </button>
                    </div>
                  </div>

                  {/* Resumo */}
                  <div className="resumo-section">
                    <h4>Resumo Executivo</h4>
                    <div className="resumo-stats">
                      <div className="stat-card">
                        <div className="stat-number">{dadosRelatorio.resumo.total_acoes}</div>
                        <div className="stat-label">Total de Ações</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">{dadosRelatorio.resumo.participantes_totais.toLocaleString('pt-BR')}</div>
                        <div className="stat-label">Participantes</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-number">{dadosRelatorio.resumo.media_participantes_por_acao}</div>
                        <div className="stat-label">Média por Ação</div>
                      </div>
                    </div>
                  </div>

                  {/* Distribuição por Segmento */}
                  <div className="distribuicao-section">
                    <h4>Distribuição por Segmento</h4>
                    <div className="distribuicao-grid">
                      {dadosRelatorio.distribuicao.por_segmento.map((item, index) => (
                        <div key={index} className="distribuicao-item">
                          <span className="item-label">{item.segmento}</span>
                          <span className="item-value">{item.total} ações</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Ações */}
                  <div className="top-acoes-section">
                    <h4>Top 5 Ações por Participantes</h4>
                    <div className="top-acoes-list">
                      {dadosRelatorio.top_acoes.slice(0, 5).map((acao, index) => (
                        <div key={index} className="top-acao-item">
                          <div className="acao-info">
                            <h5>{acao.nome}</h5>
                            <p>{acao.Regiao?.nome} - {acao.SegmentoCultural?.nome}</p>
                          </div>
                          <div className="acao-stats">
                            <span className="participantes">{acao.Indicador?.participantes || 0} participantes</span>
                            <span className="avaliacao">★ {acao.Indicador?.avaliacao_media || 'N/A'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!dadosRelatorio && !loading && !error && (
                <div className="empty-state">
                  <h3>Nenhum relatório gerado</h3>
                  <p>Configure os filtros e clique em "Gerar Relatório" para visualizar os dados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;

