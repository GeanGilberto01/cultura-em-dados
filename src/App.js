import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Mapa from './pages/Mapa';
import Regioes from './pages/Regioes';
import Admin from './pages/Admin';
import Relatorios from './pages/Relatorios';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/mapa" element={<Mapa />} />
              <Route path="/regioes" element={<Regioes />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
