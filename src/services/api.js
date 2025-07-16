import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/api/usuarios/login', { email, senha });
    return response.data;
  },
  
  registrar: async (nome, email, senha, tipo = 'publico') => {
    const response = await api.post('/api/usuarios/registrar', { nome, email, senha, tipo });
    return response.data;
  },
  
  perfil: async () => {
    const response = await api.get('/api/usuarios/perfil');
    return response.data;
  }
};

// Serviços de regiões
export const regiaoService = {
  listar: async (params = {}) => {
    const response = await api.get('/api/regioes', { params });
    return response.data;
  },
  
  obterPorId: async (id) => {
    const response = await api.get(`/api/regioes/${id}`);
    return response.data;
  },
  
  criar: async (dados) => {
    const response = await api.post('/api/regioes', dados);
    return response.data;
  },
  
  atualizar: async (id, dados) => {
    const response = await api.put(`/api/regioes/${id}`, dados);
    return response.data;
  },
  
  deletar: async (id) => {
    const response = await api.delete(`/api/regioes/${id}`);
    return response.data;
  },
  
  estatisticas: async (id) => {
    const response = await api.get(`/api/regioes/${id}/estatisticas`);
    return response.data;
  }
};

// Serviço de saúde da API
export const healthService = {
  verificar: async () => {
    const response = await api.get('/api/health');
    return response.data;
  }
};

export default api;

