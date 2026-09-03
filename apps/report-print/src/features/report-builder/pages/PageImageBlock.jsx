import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PageImageBlock = ({ id, pageNumber, photoUrl, onPhotoChange, isInsideBuilder, osData, isViewerMode, unidade, cliente }) => {
  const containerClass = isInsideBuilder ? "builder-block-content" : "page a4-page";
  const mainStyle = isInsideBuilder ? { padding: '5mm 0' } : { padding: '15mm' };

  return (
    <div className={containerClass}>
      {!isInsideBuilder && <Header unidade={unidade} cliente={cliente} titulo="RELATÓRIO FOTOGRÁFICO" />}
      
      <main className={isInsideBuilder ? "" : "page-body"} style={mainStyle}>
        
        {/* Controle de Edição – oculto no modo cliente */}
        {!isViewerMode && !isInsideBuilder && (
          <div className="no-print" style={{ marginBottom: '10px', background: '#f5f5f5', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
             <label style={{ display: 'block', fontSize: '10pt', fontWeight: 'bold', marginBottom: '5px' }}>Link da Imagem:</label>
             <input 
                type="text" 
                placeholder="Cole a URL da imagem aqui..."
                value={photoUrl || ""}
                onChange={(e) => onPhotoChange(id, e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '3px' }}
             />
          </div>
        )}

        {/* Visualização da Imagem */}
        <div className="image-container" style={{ width: '100%', textAlign: 'center' }}>
            {photoUrl ? (
                <img src={photoUrl} alt="Foto do Equipamento" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', border: '1px solid #ccc' }} />
            ) : (
                <div className="no-print" style={{ padding: '40px', border: '2px dashed #aaa', color: '#666', background: '#fafafa' }}>
                    Nenhuma imagem inserida neste bloco. Cole uma URL acima.
                </div>
            )}
        </div>

      </main>

      {!isInsideBuilder && <Footer pageNumber={pageNumber} />}
    </div>
  );
};