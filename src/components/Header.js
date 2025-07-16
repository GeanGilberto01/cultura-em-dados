import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { usuario, estaAutenticado, logout, eAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuMobileAberto(false);
  };

  const toggleMenuMobile = () => {
    setMenuMobileAberto(!menuMobileAberto);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cultural-blue to-cultural-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CD</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cultura em Dados</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-8"  style={{ display: 'flex', gap: '4ch' }}>
            <Link 
              to="/" 
              className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Início
            </Link>
            <Link 
              to="/dashboard" 
              className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/regioes" 
              className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Regiões
            </Link>
            <Link 
              to="/mapa" 
              className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Mapa
            </Link>
            {estaAutenticado() && (
              <Link 
                to="/relatorios" 
                className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Relatórios
              </Link>
            )}
            {eAdmin() && (
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Administração
              </Link>
            )}
          </nav>

          {/* Botões de Autenticação */}
          <div className="hidden md:flex items-center space-x-4">
            {estaAutenticado() ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Olá, <span className="font-medium">{usuario?.nome}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/registro"
                  className="bg-cultural-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Registrar
                </Link>
              </div>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenuMobile}
              className="text-gray-700 hover:text-cultural-blue p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuMobileAberto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {menuMobileAberto && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link 
                to="/" 
                className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuMobileAberto(false)}
              >
                Início
              </Link>
              <Link 
                to="/dashboard" 
                className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuMobileAberto(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/regioes" 
                className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuMobileAberto(false)}
              >
                Regiões
              </Link>
              <Link 
                to="/mapa" 
                className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuMobileAberto(false)}
              >
                Mapa
              </Link>
              {eAdmin() && (
                <Link 
                  to="/admin" 
                  className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMenuMobileAberto(false)}
                >
                  Administração
                </Link>
              )}
              
              {/* Botões de autenticação mobile */}
              <div className="pt-4 border-t border-gray-200">
                {estaAutenticado() ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-700">
                      Olá, <span className="font-medium">{usuario?.nome}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-base font-medium"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block text-gray-700 hover:text-cultural-blue px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuMobileAberto(false)}
                    >
                      Entrar
                    </Link>
                    <Link
                      to="/registro"
                      className="block bg-cultural-blue hover:bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setMenuMobileAberto(false)}
                    >
                      Registrar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

