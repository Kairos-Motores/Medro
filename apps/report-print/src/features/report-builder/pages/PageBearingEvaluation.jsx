import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MechanicalTable } from '../components/MechanicalTable';
import mancaisImg from '../../../assets/mancais.png';
import { API_BASE_URL } from '../../../config';

export const PageBearingEvaluation = ({ osData, mechData, onUpdate, isViewerMode }) => {
  
  const handlePhotoUpload = async (key, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('foto', file);
    try {
      const res = await fetch(`${API_BASE_URL}/os/${osData.cr4a1_novacoluna}/upload-temp/Qualidade`, {
        method: 'POST', body: formData
      });
      const json = await res.json();
      if (json.success) onUpdate(key, { ...mechData[key], photo: json.foto });
    } catch (err) { console.error(err); }
  };

  const renderBlock = (key, title, side) => (
    <div className="mech-column">
      <div className="photo-frame-fixed" onClick={() => !isViewerMode && document.getElementById(`up-${key}`).click()}>
        {mechData[key]?.photo ? (
          <img src={mechData[key].photo.url} alt="Evidência" />
        ) : (
          !isViewerMode && <div className="placeholder no-print">+ Foto {side}</div>
        )}
        {!isViewerMode && <input type="file" id={`up-${key}`} hidden onChange={(e) => handlePhotoUpload(key, e.target.files[0])} />}
      </div>
      <MechanicalTable title={title} data={mechData[key]} onUpdate={(d) => onUpdate(key, d)} isViewerMode={isViewerMode} />
    </div>
  );

  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="RELATÓRIO TÉCNICO" />
      
      <main className="page-body mech-eval-rigid">
        <div className="mech-row">
          {renderBlock('assento_la', 'Assento do rolamento LA', 'LA')}
          {renderBlock('assento_loa', 'Assento do rolamento LOA', 'LOA')}
        </div>

        <div className="blue-bar-separator">Avaliação dos mancais</div>
        
        <div className="rotor-rigid-box">
          <img src={mancaisImg} alt="Diagrama dos Mancais" />
        </div>

        <div className="mech-row">
          {renderBlock('cubo_la', 'Cubo da tampa LA', 'LA')}
          {renderBlock('cubo_loa', 'Cubo da tampa LOA', 'LOA')}
        </div>
      </main>

      <Footer pageNumber="10" unidade={osData.unidade_nome} />
    </div>
  );
};