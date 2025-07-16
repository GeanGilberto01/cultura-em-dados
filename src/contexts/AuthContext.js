import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const tokenSalvo = localStorage.getItem('token');
      const usuarioSalvo = localStorage.getItem('usuario');

      if (tokenSalvo && usuarioSalvo) {
        try {
          setToken(tokenSalvo);
          setUsuario(JSON.parse(usuarioSalvo));
          
          // Verificar se o token ainda é válido
          await authService.perfil();
        } catch (error) {
          console.error('Token inválido:', error);
          logout();
        }
      }
      setCarregando(false);
    };

    verificarAutenticacao();
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      
      setToken(response.token);
      setUsuario(response.usuario);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      return { sucesso: true, mensagem: response.mensagem };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        sucesso: false, 
        mensagem: error.response?.data?.erro || 'Erro ao fazer login' 
      };
    }
  };

  const registrar = async (nome, email, senha, tipo = 'publico') => {
    try {
      const response = await authService.registrar(nome, email, senha, tipo);
      
      setToken(response.token);
      setUsuario(response.usuario);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('usuario', JSON.stringify(response.usuario));
      
      return { sucesso: true, mensagem: response.mensagem };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        sucesso: false, 
        mensagem: error.response?.data?.erro || 'Erro ao registrar usuário' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  const estaAutenticado = () => {
    return !!token && !!usuario;
  };

  const eAdmin = () => {
    return usuario?.tipo === 'admin';
  };

  const value = {
    usuario,
    token,
    carregando,
    login,
    registrar,
    logout,
    estaAutenticado,
    eAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

