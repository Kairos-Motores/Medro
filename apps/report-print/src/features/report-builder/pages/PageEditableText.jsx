import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PageEditableText = ({ id, pageNumber, data, onChange, isInsideBuilder, onValueChange, osData }) => {
  const safeData = data || { title: "", content: "" };

  // SE ESTIVER DENTRO DA PÁGINA LIVRE (BUILDER)
  if (isInsideBuilder) {
    return (
      <div style={{ width: '100%', marginBottom: '20px', position: 'relative', zIndex: 10 }}>
        {/* Lógica de Edição */}
        <div className="no-print" style={{ marginBottom: '10px' }}>
          <input 
            type="text"
            placeholder="Título..."
            value={safeData.title || ""}
            onChange={(e) => onChange(id, { ...safeData, title: e.target.value })}
            style={{ width: '100%', fontSize: '18pt', fontWeight: 'bold', border: 'none', borderBottom: '2px solid #d32f2f', padding: '5px', background: 'transparent' }}
          />
        </div>
        <div className="no-print">
            <textarea 
              placeholder="Conteúdo..."
              value={safeData.content || ""}
              onChange={(e) => onChange(id, { ...safeData, content: e.target.value })}
              style={{ width: '100%', height: '200px', border: '1px solid #ccc', padding: '10px', fontSize: '11pt', fontFamily: 'Montserrat, sans-serif', background: '#fff', position: 'relative', zIndex: 20 }}
            />
        </div>

        {/* Lógica de Impressão */}
        <div className="only-print">
            <h1 style={{ fontSize: '18pt', fontWeight: 'bold', borderBottom: '2px solid #d32f2f', margin: '0 0 10px 0' }}>
                {safeData.title || " "}
            </h1>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '11pt' }}>
                {safeData.content || " "}
            </div>
        </div>
      </div>
    );
  }

  // SE FOR UMA PÁGINA A4 INDEPENDENTE
  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="EDITOR DE TEXTO" />
      <main className="page-body" style={{ padding: '15mm' }}>
        <div className="no-print" style={{ marginBottom: '10px' }}>
          <input 
            type="text"
            placeholder="Título..."
            value={safeData.title || ""}
            onChange={(e) => onChange(id, { ...safeData, title: e.target.value })}
            style={{ width: '100%', fontSize: '18pt', fontWeight: 'bold', border: 'none', borderBottom: '2px solid #d32f2f', padding: '5px' }}
          />
        </div>
        <div className="no-print">
            <textarea 
              placeholder="Conteúdo..."
              value={safeData.content || ""}
              onChange={(e) => onChange(id, { ...safeData, content: e.target.value })}
              style={{ width: '100%', height: '200px', border: '1px solid #ccc', padding: '10px', fontSize: '11pt', fontFamily: 'Montserrat, sans-serif' }}
            />
        </div>

        <div className="only-print">
            <h1 style={{ fontSize: '18pt', fontWeight: 'bold', borderBottom: '2px solid #d32f2f', margin: '0 0 10px 0' }}>
                {safeData.title || " "}
            </h1>
            <div style={{ whiteSpace: 'pre-wrap', fontSize: '11pt' }}>
                {safeData.content || " "}
            </div>
        </div>
      </main>
      <Footer pageNumber={pageNumber} />
    </div>
  );
};