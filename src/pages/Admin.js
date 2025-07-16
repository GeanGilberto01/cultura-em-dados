import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Admin = () => {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState('acoes');
  const [acoes, setAcoes] = useState([]);
  const [regioes, setRegioes] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'acao', 'regiao', 'segmento'
  const [editingItem, setEditingItem] = useState(null);

  // Verificar se é admin
  useEffect(() => {
    if (!usuario || usuario.tipo !== 'admin') {
      window.location.href = '/';
    }
  }, [usuario]);

  // Carregar dados
  useEffect(() => {
    carregarDados();
  }, [activeTab]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'acoes':
          const responseAcoes = await api.get('/api/acoes');
          setAcoes(responseAcoes.data.acoes || []);
          break;
        case 'regioes':
          const responseRegioes = await api.get('/api/regioes');
          setRegioes(responseRegioes.data.regioes || []);
          break;
        case 'segmentos':
          // Implementar quando necessário
          break;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (tipo, item = null) => {
    setModalType(tipo);
    setEditingItem(item);
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const salvarItem = async (dados) => {
    try {
      if (editingItem) {
        // Atualizar
        await api.put(`/api/${modalType}s/${editingItem.id}`, dados);
      } else {
        // Criar
        await api.post(`/api/${modalType}s`, dados);
      }
      fecharModal();
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar item');
    }
  };

  const deletarItem = async (tipo, id) => {
    if (window.confirm('Tem certeza que deseja deletar este item?')) {
      try {
        await api.delete(`/api/${tipo}s/${id}`);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar:', error);
        alert('Erro ao deletar item');
      }
    }
  };

  if (!usuario || usuario.tipo !== 'admin') {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h2>Acesso Negado</h2>
            <p>Você precisa ser um administrador para acessar esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1 className="admin-title">Painel Administrativo</h1>
          <p className="admin-subtitle">Gerencie ações culturais, regiões e configurações do sistema</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          {/* Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab-button ${activeTab === 'acoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('acoes')}
            >
              Ações Culturais
            </button>
            <button 
              className={`tab-button ${activeTab === 'regioes' ? 'active' : ''}`}
              onClick={() => setActiveTab('regioes')}
            >
              Regiões
            </button>
            <button 
              className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuários
            </button>
            <button 
              className={`tab-button ${activeTab === 'relatorios' ? 'active' : ''}`}
              onClick={() => setActiveTab('relatorios')}
            >
              Relatórios
            </button>
          </div>

          {/* Conteúdo das tabs */}
          <div className="tab-content">
            {activeTab === 'acoes' && (
              <AcoesTab 
                acoes={acoes}
                loading={loading}
                onAdd={() => abrirModal('acao')}
                onEdit={(acao) => abrirModal('acao', acao)}
                onDelete={(id) => deletarItem('acao', id)}
              />
            )}

            {activeTab === 'regioes' && (
              <RegioesTab 
                regioes={regioes}
                loading={loading}
                onAdd={() => abrirModal('regiao')}
                onEdit={(regiao) => abrirModal('regiao', regiao)}
                onDelete={(id) => deletarItem('regiao', id)}
              />
            )}

            {activeTab === 'usuarios' && (
              <UsuariosTab />
            )}

            {activeTab === 'relatorios' && (
              <RelatoriosTab />
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal 
          tipo={modalType}
          item={editingItem}
          onSave={salvarItem}
          onClose={fecharModal}
        />
      )}
    </div>
  );
};

// Componente para tab de ações
const AcoesTab = ({ acoes, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading-state">Carregando ações...</div>;
  }

  return (
    <div className="tab-panel">
      <div className="panel-header">
        <h2>Ações Culturais</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          Adicionar Ação
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Data Início</th>
              <th>Região</th>
              <th>Segmento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {acoes.map(acao => (
              <tr key={acao.id}>
                <td>{acao.nome}</td>
                <td>{acao.tipo || 'N/A'}</td>
                <td>{acao.data_inicio ? new Date(acao.data_inicio).toLocaleDateString('pt-BR') : 'N/A'}</td>
                <td>{acao.Regiao?.nome || 'N/A'}</td>
                <td>{acao.SegmentoCultural?.nome || 'N/A'}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => onEdit(acao)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(acao.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para tab de regiões
const RegioesTab = ({ regioes, loading, onAdd, onEdit, onDelete }) => {
  if (loading) {
    return <div className="loading-state">Carregando regiões...</div>;
  }

  return (
    <div className="tab-panel">
      <div className="panel-header">
        <h2>Regiões</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          Adicionar Região
        </button>
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>População</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {regioes.map(regiao => (
              <tr key={regiao.id}>
                <td>{regiao.nome}</td>
                <td>{regiao.tipo}</td>
                <td>{regiao.estado || 'N/A'}</td>
                <td>{regiao.populacao ? regiao.populacao.toLocaleString('pt-BR') : 'N/A'}</td>
                <td>
                  <span className={`status-badge ${regiao.ativo ? 'active' : 'inactive'}`}>
                    {regiao.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => onEdit(regiao)}>
                    Editar
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(regiao.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para tab de usuários
const UsuariosTab = () => {
  return (
    <div className="tab-panel">
      <div className="panel-header">
        <h2>Usuários</h2>
      </div>
      <div className="coming-soon">
        <p>Funcionalidade de gerenciamento de usuários será implementada em breve.</p>
      </div>
    </div>
  );
};

// Componente para tab de relatórios
const RelatoriosTab = () => {
  const [loading, setLoading] = useState(false);

  const gerarRelatorio = async (tipo) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/relatorios/csv?tipo=${tipo}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert('Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-panel">
      <div className="panel-header">
        <h2>Relatórios</h2>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Relatório de Ações Culturais</h3>
          <p>Exportar dados completos de todas as ações culturais cadastradas.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => gerarRelatorio('acoes')}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar CSV'}
          </button>
        </div>

        <div className="report-card">
          <h3>Relatório de Regiões</h3>
          <p>Exportar dados das regiões e suas estatísticas.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => gerarRelatorio('regioes')}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar CSV'}
          </button>
        </div>

        <div className="report-card">
          <h3>Relatório de Indicadores</h3>
          <p>Exportar indicadores de participação e avaliação.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => gerarRelatorio('indicadores')}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Modal (simplificado)
const Modal = ({ tipo, item, onSave, onClose }) => {
  const [formData, setFormData] = useState(item || {});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{item ? 'Editar' : 'Adicionar'} {tipo}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nome:</label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
            />
          </div>

          {tipo === 'acao' && (
            <>
              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Data de Início:</label>
                <input
                  type="date"
                  value={formData.data_inicio ? formData.data_inicio.split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                  required
                />
              </div>
            </>
          )}

          {tipo === 'regiao' && (
            <>
              <div className="form-group">
                <label>Tipo:</label>
                <select
                  value={formData.tipo || ''}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="cidade">Cidade</option>
                  <option value="bairro">Bairro</option>
                  <option value="regiao">Região</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado:</label>
                <input
                  type="text"
                  value={formData.estado || ''}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                />
              </div>
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

