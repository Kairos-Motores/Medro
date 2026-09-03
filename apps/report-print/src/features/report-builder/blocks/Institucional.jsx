import React from 'react';

export const Institutional = () => {
  const unidades = [
    { nome: "Barcarena", img: "/unidades/barcarena.png" },
    { nome: "São Luís", img: "/unidades/saoluis.png" },
    { nome: "Aveiro-Portugal", img: "/unidades/portugal.png" },
    { nome: "Parauapebas-PA", img: "/unidades/parauapebas.png" }
  ];

  return (
    <section className="institutional-block">
      <div className="units-mosaic">
        {unidades.map((uni, idx) => (
          <div key={idx} className="unit-card">
            <img src={uni.img} alt={uni.nome} />
            <span className="unit-label">{uni.nome}</span>
          </div>
        ))}
      </div>

      <div className="company-info">
        <p className="intro-text">
          A <strong>Kairós Motores</strong> é Assistente Técnico Autorizado <strong>WEG</strong> há 18 anos. 
          Atuamos com manutenção de motores elétricos de baixa e média tensão, 
          manutenção de máquinas industriais e Revenda de partes e peças.
        </p>

        <div className="pillars-box">
          <p>Nosso propósito é sustentado por três pilares inegociáveis:</p>
          <div className="pillars-list">
            <span>SEGURANÇA</span>
            <span className="dot">•</span>
            <span>AGILIDADE</span>
            <span className="dot">•</span>
            <span>CONFIABILIDADE OPERACIONAL</span>
          </div>
        </div>

        <div className="expansion-note">
          <img src="/unidades/sede-nova.png" alt="Nova Sede São Luís" className="hq-img" />
          <div className="note-content">
            <p>
              No segundo semestre de 2026 será inaugurada a mais nova sede da Kairós Motores 
              no distrito industrial em São Luís/MA, o que ampliará a nossa capacidade de atendimento na região.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};