import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { resolveCoverImage } from '../utils/cover';
import { API_BASE_URL } from '../../../config';

const parseDate = (dateString) => {
  if (!dateString || dateString.length !== 8) return null;
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
};

const formatDate = (date) => {
  if (!date) return 'Data não informada';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Retorna as duas primeiras palavras do nome do cliente.
 * Ex.: "HYDRO ALUNORTE" → "HYDRO ALUNORTE"
 *      "EMPRESA BRASILEIRA DE ALIMENTOS" → "EMPRESA BRASILEIRA"
 */
const getShortName = (fullName) => {
  if (!fullName) return '—';
  const words = fullName.trim().split(/\s+/);
  return words.slice(0, 2).join(' ');
};

export const ClientCatalog = () => {
  const [laudos, setLaudos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showOnlyWithReport, setShowOnlyWithReport] = useState(true);
  const navigate = useNavigate();
  const contato = localStorage.getItem('kairos_login') || 'Cliente';

  useEffect(() => {
    const fetchLaudos = async () => {
      try {
        const token = localStorage.getItem('kairos_token');
        const res = await fetch(`${API_BASE_URL}/cliente/os`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLaudos(data);
        } else {
          toast.error('Erro ao carregar laudos.');
        }
      } catch (err) {
        toast.error('Erro de conexão.');
      } finally {
        setLoading(false);
      }
    };
    fetchLaudos();
  }, []);

  useEffect(() => {
    if (!loading && laudos.length > 0) {
      const totalRelatorios = laudos.reduce((acc, l) => acc + l.relatorios.length, 0);
      toast.success(`Bem-vindo(a), ${contato}! Você tem ${totalRelatorios} relatório(s) disponível(is).`, {
        duration: 4000,
        icon: '👋',
      });
    }
  }, [loading]);

  const filteredLaudos = laudos
    .filter(l => !showOnlyWithReport || l.relatorios.length > 0)
    .filter(l => l.osId?.toLowerCase().includes(search.toLowerCase()));

  const handleLogout = () => {
    localStorage.removeItem('kairos_token');
    localStorage.removeItem('kairos_role');
    localStorage.removeItem('kairos_login');
    window.location.href = '/';
  };

  const totalOSComRelatorio = laudos.filter(l => l.relatorios.length > 0).length;
  const totalRelatorios = laudos.reduce((acc, l) => acc + l.relatorios.length, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: "'Montserrat', sans-serif" }}>
        <p>Carregando seus laudos...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: "'Montserrat', sans-serif", 
      minHeight: '100vh', 
      background: '#f5f6f8', 
      padding: '40px 5vw'
    }}>
      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '16px', background: '#f7f2ef', color: '#1d1b16', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        success: { iconTheme: { primary: '#2e7d32', secondary: '#fff' } },
        error: { iconTheme: { primary: '#d32f2f', secondary: '#fff' } },
      }} />

      {/* Cabeçalho */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '8px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1d1b16', margin: 0 }}>
            Bem-vindo(a), {contato}
          </h1>
          <p style={{ fontSize: '16px', color: '#807671', marginTop: '8px' }}>
            {totalOSComRelatorio > 0 
              ? `${totalOSComRelatorio} OS com relatório · ${totalRelatorios} relatório(s) no total`
              : 'Nenhum relatório disponível no momento'}
          </p>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none',
          border: '1px solid #807671',
          borderRadius: '12px',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          color: '#1d1b16',
          fontFamily: "'Montserrat', sans-serif",
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = 'rgba(211,47,47,0.08)'}
        onMouseLeave={e => e.target.style.background = 'none'}
        >Sair</button>
      </div>

      {/* Barra de pesquisa + Filtro */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Pesquisar por número da OS..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, maxWidth: '500px', padding: '14px 20px', fontSize: '15px',
            border: '1px solid #807671', borderRadius: '28px', fontFamily: "'Montserrat', sans-serif",
            outline: 'none', boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        />
        <div className="mode-switch" style={{ margin: 0, padding: 0, border: 'none' }}>
          <div className="mode-buttons" style={{ display: 'flex', gap: '8px' }}>
            <button className={`mode-btn ${showOnlyWithReport ? 'active' : ''}`} onClick={() => setShowOnlyWithReport(true)}
              style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif",
                background: showOnlyWithReport ? '#d32f2f' : 'rgba(211, 47, 47, 0.08)',
                color: showOnlyWithReport ? '#fff' : '#1d1b16', border: '1px solid transparent', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              📄 Com relatório
            </button>
            <button className={`mode-btn ${!showOnlyWithReport ? 'active' : ''}`} onClick={() => setShowOnlyWithReport(false)}
              style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, fontFamily: "'Montserrat', sans-serif",
                background: !showOnlyWithReport ? '#d32f2f' : 'rgba(211, 47, 47, 0.08)',
                color: !showOnlyWithReport ? '#fff' : '#1d1b16', border: '1px solid transparent', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              📋 Todas
            </button>
          </div>
        </div>
      </div>

      {/* Grid de laudos */}
      {filteredLaudos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#807671', fontSize: '16px', marginTop: '40px' }}>Nenhum laudo encontrado.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredLaudos.map((laudo) => {
            const date = parseDate(laudo.data);
            const formattedDate = formatDate(date);
            const shortName = getShortName(laudo.cliente);

            return (
              <motion.div key={laudo.osId} whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                style={{ background: '#fff', border: '2px solid rgba(128, 118, 113, 0.2)', borderRadius: '24px', padding: '28px 24px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', transition: 'all 0.2s ease',
                  position: 'relative', opacity: laudo.relatorios.length > 0 ? 1 : 0.7 }}>
                {/* Avatar com nome abreviado */}
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #d32f2f, #b71c1c)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  padding: '4px',
                  boxShadow: '0 4px 12px rgba(211,47,47,0.3)',
                  wordBreak: 'break-word',
                }}>
                  {shortName}
                </div>

                {/* Informações da OS */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#1d1b16' }}>
                    OS: {laudo.osId}
                  </div>
                  <div style={{ fontSize: '14px', color: '#807671', marginTop: '6px' }}>
                    {laudo.cliente}
                  </div>
                </div>

                {/* Tipos de relatório */}
                {laudo.relatorios.length > 0 ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {laudo.relatorios.map(rel => (
                      <button key={rel.tipo} onClick={() => navigate(`/cliente/relatorio/${laudo.osId}?tipo=${rel.tipo}`)}
                        style={{ width: '100%', padding: '10px 16px 10px 10px', background: '#f7f2ef', color: '#1d1b16',
                          border: '1px solid rgba(128, 118, 113, 0.3)', borderRadius: '12px', fontWeight: 600, fontSize: '14px',
                          fontFamily: "'Montserrat', sans-serif", cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={resolveCoverImage({ capaAtiva: rel.capaAtiva, customCoverUrl: rel.customCoverUrl })}
                          alt=""
                          style={{ width: '32px', height: '44px', objectFit: 'cover', borderRadius: '4px', flex: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                        />
                        <span style={{ flex: 1 }}>{rel.label}</span>
                        <span style={{ fontSize: '12px', fontWeight: 400, color: '#807671' }}>{formattedDate}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#d32f2f', fontWeight: 600,
                    background: 'rgba(211,47,47,0.08)', padding: '6px 16px', borderRadius: '16px' }}>Aguardando relatório</div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};