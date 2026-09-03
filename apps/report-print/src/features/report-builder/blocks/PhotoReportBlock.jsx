import React, { useState, useRef } from 'react';
import { SharePointPicker } from './SharePointPicker';
import { API_BASE_URL } from '../../../config';

export const PhotoReportBlock = ({ osId, sectionKey, title, data, onUpdate, cliente, unidade, isViewerMode = false, isPrintMode = false }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [slotAtivo, setSlotAtivo] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const textareaRefs = useRef({});

  const DEFAULT_NAMES = ['Foto 1', 'Foto 2', 'Foto 3'];
  const photoNames = data.photoNames || DEFAULT_NAMES;

  const updatePhotoName = (idx, newName) => {
    const newNames = [...photoNames];
    newNames[idx] = newName;
    onUpdate(sectionKey, { ...data, photoNames: newNames });
  };

  // ⚠️ UPLOAD ORIGINAL RESTAURADO (sem alterações)
  const handleFileChange = async (idx, files) => {
    console.log('handleFileChange chamado', idx, files);
    if (!osId) {
      alert("Erro: OS ID não disponível para upload. Por favor, sincronize uma OS antes de fazer upload de fotos.");
      return;
    }
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    const newPhotos = [...(data.photos || [null, null, null])];
    if (!Array.isArray(newPhotos[idx])) {
      newPhotos[idx] = newPhotos[idx] ? [newPhotos[idx]] : [];
    }
    for (const file of fileArray) {
      const formData = new FormData();
      formData.append('foto', file);
      try {
        const res = await fetch(`${API_BASE_URL}/os/${osId}/upload-temp/Peritagem`, {
          method: 'POST',
          body: formData
        });
        const json = await res.json();
        console.log('Resposta da API:', json);
        if (json.success) {
          newPhotos[idx] = [...newPhotos[idx], json.foto];
        }
      } catch (err) {
        console.error("Erro no upload:", err);
      }
    }
    onUpdate(sectionKey, { ...data, photos: newPhotos });
  };

  const handleRemovePhoto = (idx, photoIndex) => {
    const newPhotos = [...(data.photos || [null, null, null])];
    if (Array.isArray(newPhotos[idx])) {
      newPhotos[idx] = newPhotos[idx].filter((_, i) => i !== photoIndex);
      if (newPhotos[idx].length === 0) newPhotos[idx] = null;
    }
    onUpdate(sectionKey, { ...data, photos: newPhotos });
  };

  const handleSharePointSelect = (foto) => {
    if (slotAtivo === null) return;
    const idx = slotAtivo;
    const newPhotos = [...(data.photos || [null, null, null])];
    if (!Array.isArray(newPhotos[idx])) {
      newPhotos[idx] = newPhotos[idx] ? [newPhotos[idx]] : [];
    }
    newPhotos[idx] = [...newPhotos[idx], foto];
    onUpdate(sectionKey, { ...data, photos: newPhotos });
    setShowPicker(false);
    setSlotAtivo(null);
  };

  const abrirPicker = (idx) => {
    setSlotAtivo(idx);
    setShowPicker(true);
  };

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);

  const updateText = (type, idx, val) => {
    const newList = [...(data[type] || ["", "", ""])];
    newList[idx] = val;
    onUpdate(sectionKey, { ...data, [type]: newList });
  };

  const autoResize = (el) => {
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  };

  const renderDataRows = (type, icon, placeholder) => {
    return [0, 1, 2].map((i) => {
      const refKey = `${type}-${i}`;
      return (
        <div key={i} className="data-grid-row">
          <div className="icon-column">{icon}</div>
          <div className="text-column">
            {!isPrintMode ? (
              <textarea
                ref={el => { textareaRefs.current[refKey] = el; }}
                className="edit-input"
                value={data[type]?.[i] || ""}
                placeholder={`${placeholder} ${i + 1}...`}
                rows="1"
                onInput={(e) => autoResize(e.target)}
                onChange={(e) => {
                  updateText(type, i, e.target.value);
                  autoResize(e.target);
                }}
                disabled={isViewerMode} // Garante que não esteja desabilitado para técnicos
                style={{ minHeight: '20px', overflow: 'hidden', resize: 'none' }} // Adicionado minHeight e overflow/resize explícitos
              />
            ) : (
            <p className="static-text" style={{ whiteSpace: 'pre-wrap' }}>
              {data[type]?.[i] || "........................................................"}
            </p>
            )}
          </div>
        </div>
      );
    });
  };

  const getFirstPhoto = (slot) => {
    if (!slot) return null;
    if (Array.isArray(slot)) return slot[0] || null;
    return slot;
  };

  // Garante 3 posições
  const photos = data.photos || [null, null, null];
  while (photos.length < 3) photos.push(null);

  return (
    <div className="photo-report-block">
      <div className="photo-grid-row">
        {photos.map((slot, idx) => {
          const firstPhoto = getFirstPhoto(slot);
          const name = photoNames[idx] || `Foto ${idx + 1}`;
          const hasImage = !!firstPhoto;

          return (
            <div key={idx} className="photo-card">
              <div
                className="photo-card-inner"
                onClick={() => {
                  if (hasImage && isViewerMode) {
                    openImageModal(firstPhoto.url);
                  } else if (!isViewerMode && osId) { // Only allow click if not in viewer mode AND osId is available
                    document.getElementById(`file-${sectionKey}-${idx}`).click();
                  } else if (!isViewerMode && !osId) {
                    alert("Por favor, sincronize uma OS antes de fazer upload de fotos.");
                  }
                }}
                style={{
                  position: 'relative',
                  cursor: hasImage && isViewerMode ? 'zoom-in' : (!isViewerMode && osId) ? 'pointer' : 'default' // Cursor change based on osId availability
                }}
              >
                {hasImage ? (
                  <>
                    <img src={firstPhoto.url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'rgba(0,0,0,0.6)', color: '#fff', textAlign: 'center',
                      padding: '4px 8px', fontSize: '12px', fontWeight: 600,
                      cursor: !isViewerMode ? 'text' : 'default',
                    }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isViewerMode) {
                          const newName = prompt('Editar nome da foto:', name);
                          if (newName && newName.trim() !== '') {
                            updatePhotoName(idx, newName.trim());
                          }
                        }
                      }}
                      title={!isViewerMode ? 'Clique para editar o nome' : name}
                    >
                      {name}
                    </div>
                  </>
                ) : (
                  <div className="upload-placeholder no-print" style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, textAlign: 'center', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{name}</span>
                    {!isViewerMode && <span>+ Foto</span>}
                  </div>
                )}
              </div>

              {/* Miniaturas extras (apenas se slot for array e tiver mais de um elemento) */}
              {Array.isArray(slot) && slot.length > 1 && (
                <div className="photo-thumbnails no-print">
                  {slot.slice(1).map((photo, i) => (
                    <div key={i} className="thumbnail-wrapper">
                      <img
                        src={photo.url}
                        alt={`Extra ${i + 1}`}
                        onClick={() => isViewerMode && openImageModal(photo.url)}
                        style={{ cursor: isViewerMode ? 'zoom-in' : 'default' }}
                      />
                      {!isViewerMode && (
                        <button className="remove-thumb" onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx, i + 1); }}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {hasImage && !isViewerMode && (
                <button className="remove-main-photo no-print" onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx, 0); }}>✕</button>
              )}

              {!isViewerMode && (
                <button className="sp-buscar-btn no-print" onClick={(e) => { e.stopPropagation(); abrirPicker(idx); }} title="Buscar no SharePoint" disabled={!osId || isPrintMode}>📁 SharePoint</button>
              )}

              <input
                type="file"
                id={`file-${sectionKey}-${idx}`}
                hidden
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(idx, e.target.files)}
              />
            </div>
          );
        })}
      </div>

      <div className="metadata-container">
        <div className="table-header-main">
          {!isViewerMode ? (
            <input className="no-print title-edit" value={data.title !== undefined ? data.title : title} onChange={(e) => onUpdate(sectionKey, { ...data, title: e.target.value })} />
          ) : (
            <span style={{ fontSize: '14pt', fontWeight: 'bold' }}>{data.title || title}</span>
          )}
          <span className="print-only">{data.title || title}</span>
        </div>
        <div className="table-section">
          <div className="section-title">DESCRIÇÃO DAS EVIDÊNCIAS</div>
          {renderDataRows('evidences', '⚠️', 'Evidência')}
        </div>
        <div className="table-section services-area">
          <div className="section-title">SERVIÇOS A SEREM EXECUTADOS:</div>
          {renderDataRows('services', '✅', 'Serviço')}
        </div>
      </div>

      {showPicker && (
        <SharePointPicker osId={osId} unidade={unidade || 'São Luís'} cliente={cliente || ''} onSelect={handleSharePointSelect} onClose={() => { setShowPicker(false); setSlotAtivo(null); }} />
      )}

      {modalImage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }} onClick={closeImageModal}>
          <img src={modalImage} alt="Visualização ampliada" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', borderRadius: '8px' }} />
          <button onClick={closeImageModal} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}
    </div>
  );
};