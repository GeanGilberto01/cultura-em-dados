import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { regiaoService } from '../services/api';

const Regioes = () => {
  const { eAdmin } = useAuth();
  const [regioes, setRegioes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rawData, setRawData] = useState([]);
  const [regioesData, setRegioesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const itemsPerPage = 15;

  
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
  
  useEffect(() => {
    if (rawData.length === 0) return;

    const mapaRegioes = new Map();
    let id = 1;

    rawData.forEach(local => {
      const { bairro, cidade, estado, populacao, latitude, longitude } = local.endereco;
      const nome = bairro ? `${bairro} - ${cidade}` : cidade;
      const chave = nome;

      if (!mapaRegioes.has(chave)) {
        mapaRegioes.set(chave, {
          id: id++,
          nome,
          tipo: bairro ? 'bairro' : 'cidade',
          estado,
          populacao,
          latitude,
          longitude,
          total_acoes: local.eventos?.length || 0,
          ativo: true
        });
      } else {
        const regiaoExistente = mapaRegioes.get(chave);
        regiaoExistente.total_acoes += local.eventos?.length || 0;
      }
    });

    const dadosFinais = Array.from(mapaRegioes.values());
    setRegioesData(dadosFinais);
    loadRegioes(dadosFinais);
  }, [rawData]);

  useEffect(() => {
    if (regioesData.length > 0) {
      loadRegioes(regioesData);
    }
  }, [currentPage, searchTerm, filterType]);

  const loadRegioes = async (dados = regioesData) => {
    try {
      setLoading(true);
      let filteredData = dados;

      if (searchTerm) {
        filteredData = filteredData.filter(regiao =>
          regiao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          regiao.estado.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterType) {
        filteredData = filteredData.filter(regiao => regiao.tipo?.toLowerCase().includes(filterType.toLowerCase()));
      }

      setFilteredData(filteredData);
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = filteredData.slice(startIndex, startIndex + itemsPerPage);

      setRegioes(paginated);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setError('');
    } catch (err) {
      setError('Erro ao carregar regiões');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getTypeLabel = (tipo) => {
    const labels = {
      cidade: 'Cidade',
      bairro: 'Bairro',
      regiao: 'Região'
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="regioes-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Carregando regiões...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="regioes-page">
      {/* Header */}
      <div className="regioes-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="regioes-title">Regiões Culturais</h1>
              <p className="regioes-subtitle">
                Gerencie e visualize informações sobre regiões e suas atividades culturais
              </p>
            </div>
            {eAdmin() && (
              <div className="header-actions">
                <button className="btn btn-primary">
                  <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Nova Região
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="regioes-content">
        <div className="container">
          {/* Filtros e Busca */}
          <div className="filters-section">
            <div className="search-box">
              <div className="search-input-container">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por nome ou estado..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filter-controls">
              <select
                value={filterType}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Todos os tipos</option>
                <option value="cidade">Cidade</option>
                <option value="bairro">Bairro</option>
                <option value="regiao">Região</option>
              </select>
            </div>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon blue">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{filteredData.length}</span>
                <span className="stat-label"> Regiões Cadastradas</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{filteredData.reduce((sum, r) => sum + r.total_acoes, 0)}</span>
                <span className="stat-label"> Total de Ações</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="stat-info">
                <span className="stat-value">{(filteredData.reduce((sum, r) => sum + r.populacao, 0) / 1000000).toFixed(1)}M</span>
                <span className="stat-label"> População Total</span>
              </div>
            </div>
          </div>

          {/* Lista de Regiões */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <div className="regioes-list">
            {regioes.length === 0 ? (
              <div className="empty-state">
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3>Nenhuma região encontrada</h3>
                <p>Tente ajustar os filtros ou termos de busca.</p>
              </div>
            ) : (
              <div className="regioes-grid">
                {regioes.map((regiao) => (
                  <div key={regiao.id} className="regiao-card">
                    <div className="card-header">
                      <h3 className="card-title">{regiao.nome}</h3>
                      <span className={`status-badge ${regiao.ativo ? 'active' : 'inactive'}`}>
                        {regiao.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <div className="card-content">
                      <div className="card-info">
                        <div className="info-row">
                          <span className="info-label">Tipo:</span>
                          <span className="info-value">{getTypeLabel(regiao.tipo)}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Estado:</span>
                          <span className="info-value">{regiao.estado}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">População:</span>
                          <span className="info-value">{regiao.populacao.toLocaleString()}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Ações Culturais:</span>
                          <span className="info-value">{regiao.total_acoes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      {/* <button className="btn btn-secondary btn-sm" onClick={() => handleVerDetalhes(regiao)}>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Detalhes
                      </button>
                      
                      <button className="btn btn-secondary btn-sm" onClick={() => handleVerNoMapa(regiao)}>
                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ver no Mapa
                      </button> */}

                      {eAdmin() && (
                        <button className="btn btn-secondary btn-sm">
                          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Anterior
              </button>

              <span>Página {currentPage} de {totalPages}</span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Regioes;

