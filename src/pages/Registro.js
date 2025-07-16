import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Registro = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'publico'
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const { registrar } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErro('');
  };

  const validarFormulario = () => {
    if (formData.senha !== formData.confirmarSenha) {
      setErro('As senhas não coincidem');
      return false;
    }

    if (formData.senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!formData.nome.trim()) {
      setErro('O nome é obrigatório');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    if (!validarFormulario()) {
      setCarregando(false);
      return;
    }

    try {
      const resultado = await registrar(
        formData.nome,
        formData.email,
        formData.senha,
        formData.tipo
      );
      
      if (resultado.sucesso) {
        navigate('/dashboard');
      } else {
        setErro(resultado.mensagem);
      }
    } catch (error) {
      setErro('Erro inesperado. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-cultural-blue to-cultural-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CD</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-cultural-blue hover:text-blue-500"
            >
              entre na sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                autoComplete="name"
                required
                value={formData.nome}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-cultural-blue focus:border-cultural-blue focus:z-10 sm:text-sm"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-cultural-blue focus:border-cultural-blue focus:z-10 sm:text-sm"
                placeholder="Digite seu email"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                name="senha"
                type="password"
                autoComplete="new-password"
                required
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-cultural-blue focus:border-cultural-blue focus:z-10 sm:text-sm"
                placeholder="Digite sua senha (mínimo 6 caracteres)"
              />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-cultural-blue focus:border-cultural-blue focus:z-10 sm:text-sm"
                placeholder="Confirme sua senha"
              />
            </div>

            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                Tipo de conta
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-cultural-blue focus:border-cultural-blue sm:text-sm"
              >
                <option value="publico">Público Geral</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Selecione "Administrador" apenas se você tem permissão para gerenciar dados culturais.
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="termos"
              name="termos"
              type="checkbox"
              required
              className="h-4 w-4 text-cultural-blue focus:ring-cultural-blue border-gray-300 rounded"
            />
            <label htmlFor="termos" className="ml-2 block text-sm text-gray-900">
              Eu concordo com os{' '}
              <Link to="/termos" className="text-cultural-blue hover:text-blue-500">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link to="/privacidade" className="text-cultural-blue hover:text-blue-500">
                Política de Privacidade
              </Link>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={carregando}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cultural-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cultural-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </div>
              ) : (
                'Criar conta'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-cultural-blue hover:text-blue-500"
              >
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;

