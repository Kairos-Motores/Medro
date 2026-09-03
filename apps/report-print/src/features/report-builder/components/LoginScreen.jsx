import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../../config';

export const LoginScreen = ({ onLogin }) => {
  const [isClientMode, setIsClientMode] = useState(false);
  const [contato, setContato] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contato.trim() || !senha.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      if (isClientMode) {
        response = await fetch(`${API_BASE_URL}/cliente/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contato: contato.trim(), senha })
        });
      } else {
        response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ login: contato.trim(), senha })
        });
      }

      const data = await response.json();

      if (isClientMode) {
        if (data.token) {
          localStorage.setItem('kairos_token', data.token);
          localStorage.setItem('kairos_role', 'cliente');
          localStorage.setItem('kairos_login', contato.trim());
          onLogin({ role: 'cliente', token: data.token, userName: contato.trim() });
          toast.success('Bem-vindo!');
        } else {
          setError(data.error || 'Falha na autenticação.');
        }
      } else {
        if (data.success) {
          localStorage.setItem('kairos_token', data.token);
          localStorage.setItem('kairos_role', data.role);
          localStorage.setItem('kairos_login', contato.trim());
          onLogin({ role: data.role, token: data.token, userName: contato.trim() });
          toast.success(`Bem-vindo, ${contato.trim()}!`);
        } else {
          setError(data.message || 'Falha na autenticação.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Estilos inline que replicam as classes MD3 do main.scss
  const toggleContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
    paddingTop: '0',
    borderTop: 'none',
  };

  const toggleLabelStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#1d1b16',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    opacity: 0.8,
  };

  const toggleButtonsStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  };

  const baseBtnStyle = {
    padding: '10px 0',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: "'Montserrat', sans-serif",
    background: 'rgba(211, 47, 47, 0.08)',
    color: '#1d1b16',
    border: '1px solid transparent',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const activeBtnStyle = {
    ...baseBtnStyle,
    background: '#d32f2f',
    color: '#fff',
    borderColor: '#d32f2f',
  };

  return (
    <div className="login-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="login-card"
      >
        <div className="login-brand">Kairós Relatórios Técnicos</div>

        {/* Toggle MD3 com estilos inline */}
        <div style={toggleContainerStyle}>
          <span style={toggleLabelStyle}>Acessar como</span>
          <div style={toggleButtonsStyle}>
            <button
              type="button"
              style={!isClientMode ? activeBtnStyle : baseBtnStyle}
              onClick={() => setIsClientMode(false)}
            >
              FUNCIONÁRIO
            </button>
            <button
              type="button"
              style={isClientMode ? activeBtnStyle : baseBtnStyle}
              onClick={() => setIsClientMode(true)}
            >
              CLIENTE
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder={isClientMode ? 'Contato' : 'Login'}
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
          />
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};