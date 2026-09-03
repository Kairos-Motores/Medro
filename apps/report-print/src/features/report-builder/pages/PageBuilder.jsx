import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PageEditableText } from './PageEditableText';
import { PageCustomTable } from './PageCustomTable';

export const PageBuilder = ({ id, pageNumber, blocks, onBlockChange, osData, isPrintMode, isViewerMode }) => {

   const handleFileToBase64 = (file, blockId) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
         onBlockChange(blockId, { url: reader.result });
      };
      reader.readAsDataURL(file);
   };

   return (
      <div className="page a4-page">
         <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="PÁGINA LIVRE" />

         <main className="page-body" style={{ padding: '15mm' }}>
            {blocks && blocks.map((block) => (
               <div key={block.id} className="builder-block-wrapper" style={{ marginBottom: '20px', borderBottom: '1px dashed #eee', paddingBottom: '10px' }}>

                  {/* Bloco de Texto */}
                  {block.type === 'text' && (
                     <PageEditableText
                        isInsideBuilder={true}
                        id={block.id}
                        data={block.data}
                        onChange={(id, val) => onBlockChange(id, val)}
                        isPrintMode={isPrintMode}
                        isViewerMode={isViewerMode}
                     />
                  )}

                  {/* Bloco de Tabela (com colunas e subcolunas) */}
                  {block.type === 'table' && (
                     <PageCustomTable
                        isInsideBuilder={true}
                        id={block.id}
                        columns={block.data.columns || [{ title: "Col1", subColumns: ["Sub1"] }]}
                        rows={block.data.rows || [[""]]}
                        setColumns={(c) => onBlockChange(block.id, { ...block.data, columns: c })}
                        setRows={(r) => onBlockChange(block.id, { ...block.data, rows: r })}
                        tableTitle={block.data.title || ""}
                        setTableTitle={(t) => onBlockChange(block.id, { ...block.data, title: t })}
                        hasSubColumns={block.data.hasSubColumns !== false}
                        setHasSubColumns={(v) => onBlockChange(block.id, { ...block.data, hasSubColumns: v })}
                        isPrintMode={isPrintMode}
                        isViewerMode={isViewerMode}
                     />
                  )}

                  {/* Bloco de Imagem */}
                  {block.type === 'image' && (
                     <div className="image-block-builder" style={{ width: '100%', position: 'relative' }}>
                        {!isViewerMode && (
                           <div className="no-print" style={{ marginBottom: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
                              <label style={{ display: 'block', fontSize: '9pt', fontWeight: 'bold', marginBottom: '5px' }}>Selecione a Imagem (Upload Local):</label>
                              <input
                                 type="file"
                                 accept="image/*"
                                 onChange={(e) => handleFileToBase64(e.target.files[0], block.id)}
                                 style={{ fontSize: '8pt', width: '100%' }}
                              />
                           </div>
                        )}
                        <div className="image-preview-container" style={{ width: '100%', textAlign: 'center' }}>
                           {block.data.url ? (
                              <img src={block.data.url} alt="Foto Upada" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }} />
                           ) : (
                              <div className="no-print" style={{ padding: '30px', border: '2px dashed #aaa', color: '#666', background: '#fafafa', textAlign: 'center' }}>
                                 Nenhuma imagem selecionada. Use o campo acima para upar.
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </main>

         <Footer pageNumber={pageNumber} />
      </div>
   );
};