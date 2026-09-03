import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config';

export const SharePointPicker = ({ osId, unidade, cliente, onSelect, onClose }) => {
  const [pastas, setPastas] = useState([]);
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [caminhoAtual, setCaminhoAtual] = useState('');
  const [selecionadas, setSelecionadas] = useState([]);

  const [unidadeSel, setUnidadeSel] = useState('');
  const [clienteSel, setClienteSel] = useState('');
  const [osSel, setOsSel] = useState('');
  const [tipoSel, setTipoSel] = useState('');

  // Navegação automática ao montar
  useEffect(() => {
    const navegar = async () => {
      setLoading(true);
      try {
        // Se tem unidade, vai direto para os clientes
        if (unidade) {
          setUnidadeSel(unidade);
          const clientes = await carregarPastasRaw(`/Fotos Peritagens/${unidade}`);
          if (cliente && clientes.includes(cliente)) {
            setClienteSel(cliente);
            const oss = await carregarPastasRaw(`/Fotos Peritagens/${unidade}/${cliente}`);
            if (osId && oss.includes(osId)) {
              setOsSel(osId);
              const tipos = await carregarPastasRaw(`/Fotos Peritagens/${unidade}/${cliente}/${osId}`);
              setPastas(tipos);  // exibe os tipos de serviço
              return;
            } else {
              setPastas(oss);    // exibe as OS do cliente
              return;
            }
          } else {
            setPastas(clientes);   // exibe clientes da unidade
            return;
          }
        } else {
          // Sem unidade, mostra as unidades
          setPastas(await carregarPastasRaw('/Fotos Peritagens'));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    navegar();
  }, []);

  // Helper que apenas retorna as pastas sem alterar estado
  const carregarPastasRaw = async (path) => {
    const res = await fetch(`${API_BASE_URL}/sharepoint/pastas?path=${encodeURIComponent(path)}`);
    const data = await res.json();
    return data;
  };

  const carregarPastas = async (path) => {
    setLoading(true);
    try {
      const data = await carregarPastasRaw(path);
      setPastas(data);
      setImagens([]);
      setCaminhoAtual(path);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const carregarImagens = async (path) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/sharepoint/imagens?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setImagens(data);
      setPastas([]);
      setCaminhoAtual(path);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Handlers de clique nos níveis
  const handleUnidadeClick = (nome) => {
    setUnidadeSel(nome);
    setClienteSel(''); setOsSel(''); setTipoSel('');
    carregarPastas(`/Fotos Peritagens/${nome}`);
  };

  const handleClienteClick = (nome) => {
    setClienteSel(nome);
    setOsSel(''); setTipoSel('');
    carregarPastas(`/Fotos Peritagens/${unidadeSel}/${nome}`);
  };

  const handleOsClick = (nome) => {
    setOsSel(nome);
    setTipoSel('');
    carregarPastas(`/Fotos Peritagens/${unidadeSel}/${clienteSel}/${nome}`);
  };

  const handleTipoClick = (nome) => {
    setTipoSel(nome);
    carregarImagens(`/Fotos Peritagens/${unidadeSel}/${clienteSel}/${osSel}/${nome}`);
  };

  const handleImportar = async () => {
    for (const img of selecionadas) {
      if (!osSel && !osId) {
        alert("OS não selecionada. Por favor, sincronize uma OS antes de importar fotos.");
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/sharepoint/importar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            osId: osSel || osId,
            servico: tipoSel || 'Peritagem',
            sharepointPath: img.path,
          }),
        });
        const data = await res.json();
        if (data.success) onSelect(data.foto);
      } catch (e) {
        console.error(e);
      }
    }
    onClose();
  };

  const toggleSelecao = (img) => {
    setSelecionadas(prev =>
      prev.some(i => i.id === img.id)
        ? prev.filter(i => i.id !== img.id)
        : [...prev, img]
    );
  };

  return (
    <div className="sp-picker-overlay">
      <div className="sp-picker-modal">
        <div className="sp-picker-header">
          <h3>Selecionar imagens do SharePoint</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="sp-picker-body">
          {loading && <div className="sp-loading">Carregando...</div>}
          {!loading && (
            <div className="sp-navegacao">
              <div className="sp-breadcrumb">
                <span onClick={() => carregarPastas('/Fotos Peritagens')}>Unidades</span>
                {unidadeSel && <span onClick={() => carregarPastas(`/Fotos Peritagens/${unidadeSel}`)}> &gt; {unidadeSel}</span>}
                {clienteSel && <span onClick={() => carregarPastas(`/Fotos Peritagens/${unidadeSel}/${clienteSel}`)}> &gt; {clienteSel}</span>}
                {osSel && <span onClick={() => carregarPastas(`/Fotos Peritagens/${unidadeSel}/${clienteSel}/${osSel}`)}> &gt; {osSel}</span>}
                {tipoSel && <span> &gt; {tipoSel}</span>}
              </div>

              {pastas.length > 0 && (
                <div className="sp-lista-pastas">
                  {pastas.map(pasta => (
                    <button
                      key={pasta}
                      className="sp-pasta-item"
                      onClick={() => {
                        if (!unidadeSel) handleUnidadeClick(pasta);
                        else if (!clienteSel) handleClienteClick(pasta);
                        else if (!osSel) handleOsClick(pasta);
                        else handleTipoClick(pasta);
                      }}
                    >
                      📁 {pasta}
                    </button>
                  ))}
                </div>
              )}

              {imagens.length > 0 && (
                <>
                  <div className="sp-lista-imagens">
                    {imagens.map(img => (
                      <div
                        key={img.id}
                        className={`sp-imagem-item ${selecionadas.some(s => s.id === img.id) ? 'selecionada' : ''}`}
                        onClick={() => toggleSelecao(img)}
                      >
                        <img src={img.thumbnailMediumUrl || img.thumbnailSmallUrl || img.webUrl} alt={img.name} />
                        <span>{img.name}</span>
                      </div>
                    ))}
                  </div>
                  <button className="sp-importar-btn" onClick={handleImportar} disabled={selecionadas.length === 0}>
                    Importar {selecionadas.length} imagem(ns)
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};