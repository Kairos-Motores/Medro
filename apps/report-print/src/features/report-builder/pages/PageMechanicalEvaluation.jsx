import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MechanicalTable } from '../components/MechanicalTable';
import rotorImg from '../../../assets/rotor.png';
import { API_BASE_URL } from '../../../config';

export const PageMechanicalEvaluation = ({ osData, mechData, onUpdate, isViewerMode }) => {
  
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
        <section className="intro-section">
          <h2 className="section-title">3.2 Avaliação mecânica</h2>
          <p className="full-description">
            As evidências a seguir referem-se ao <strong>processo de avaliação</strong> mecânica e metrológica dos assentos e cubos do motor elétrico, realizada com o objetivo de verificar a conformidade dimensional, geométrica e funcional dessas superfícies críticas. A inspeção contempla a análise de possíveis desgastes, ovalizações, desalinhamentos e desvios dimensionais que possam comprometer o correto assentamento dos componentes, o alinhamento do conjunto rotativo e a confiabilidade operacional do equipamento.
          </p>
          <p className="norma-txt">Norma NBR-5432/2008 - Máquina Elétrica Girante - Dimensões e Potencias Nominais</p>
        </section>

        <div className="blue-bar-separator">Avaliação do eixo</div>
        
        <div className="rotor-rigid-box">
          <img src={rotorImg} alt="Rotor" />
        </div>

        <div className="grid-2-rows">
          <div className="mech-row">
            {renderBlock('batimento_la', 'Batimento Ponta do eixo LA', 'LA')}
            {renderBlock('batimento_loa', 'Batimento Ponta do eixo LOA', 'LOA')}
          </div>
          <div className="mech-row">
            {renderBlock('ponta_la', 'Ponta do eixo LA', 'LA')}
            {renderBlock('ponta_loa', 'Ponta do eixo LOA', 'LOA')}
          </div>
        </div>
      </main>

      <Footer pageNumber="09" unidade={osData.unidade_nome} />
    </div>
  );
};