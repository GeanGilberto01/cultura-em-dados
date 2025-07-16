import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { estaAutenticado } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-cultural-blue to-cultural-purple text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Cultura em Dados
          </h1>
          <p className="text-lg md:text-2xl max-w-2xl mx-auto mb-8">
            Analise estatísticas culturais por região e segmento para orientar decisões estratégicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="bg-white text-cultural-blue px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
              Explorar Dashboard
            </Link>
            <Link to="/mapa" className="bg-white text-cultural-blue px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
              Ver Mapa Interativo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Funcionalidades Principais
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-16">
            Ferramentas intuitivas para visualizar, filtrar e exportar dados culturais.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Dashboard */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cultural-blue rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Interativo</h3>
              <p className="text-gray-600 mb-6">
                Visualize estatísticas em tempo real com gráficos dinâmicos e filtros personalizáveis.
              </p>
              <Link 
                to="/dashboard" 
                className="text-cultural-blue font-semibold hover:text-blue-600 transition-colors"
              >
                Explorar Dashboard →
              </Link>
            </div>

            {/* Mapa */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cultural-green rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Mapa Interativo</h3>
              <p className="text-gray-600 mb-6">
                Explore dados culturais geograficamente com marcadores e informações detalhadas por região.
              </p>
              <Link 
                to="/mapa" 
                className="text-cultural-green font-semibold hover:text-green-600 transition-colors"
              >
                Ver Mapa →
              </Link>
            </div>

            {/* Relatórios */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-cultural-orange rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Relatórios Personalizados</h3>
              <p className="text-gray-600 mb-6">
                Gere relatórios em PDF e CSV com dados filtrados por período, região e segmento cultural.
              </p>
              <Link 
                to="/relatorios" 
                className="text-cultural-orange font-semibold hover:text-orange-600 transition-colors"
              >
                Gerar Relatórios →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Impacto dos Dados Culturais
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-16">
            Indicadores que mostram a relevância da cultura no desenvolvimento social.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <StatBox value="500+" label="Regiões Mapeadas" color="text-cultural-blue" />
            <StatBox value="1.2M+" label="Participantes" color="text-cultural-green" />
            <StatBox value="15" label="Segmentos Culturais" color="text-cultural-orange" />
            <StatBox value="98%" label="Precisão dos Dados" color="text-cultural-purple" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Explorar?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto">
            {estaAutenticado()
              ? 'Acesse o dashboard e comece a explorar os dados culturais da sua região.'
              : 'Crie uma conta gratuita para acessar todas as funcionalidades.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {estaAutenticado() ? (
              <Link to="/dashboard" className="bg-cultural-blue hover:bg-blue-600 px-8 py-3 rounded-full font-semibold transition">
                Acessar Dashboard
              </Link>
            ) : (
              <>
                <Link to="/registro" className="border bg-cultural-blue border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition">
                  Criar Conta
                </Link>
                <Link to="/login" className="border bg-cultural-blue border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition">
                  Fazer Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ iconBg, iconPath, title, description, link, linkText, textColor }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
    <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-4`}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link to={link} className={`${textColor} font-semibold hover:underline`}>{linkText} →</Link>
  </div>
);

const StatBox = ({ value, label, color }) => (
  <div>
    <div className={`text-4xl font-bold mb-2 ${color}`}>{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default Home;
