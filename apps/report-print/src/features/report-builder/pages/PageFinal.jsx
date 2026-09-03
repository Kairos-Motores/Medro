import React from 'react';
import finalImg from '../../../assets/final.jpg';

export const PageFinal = () => {
  return (
    <div className="page a4-page full-bleed-page final-overlay-page">
      {/* Imagem de Fundo Completa */}
      <img src={finalImg} alt="Encerramento" className="full-page-bg" />

      {/* Container de Texto Sobreposto */}
      <div className="addresses-overlay-container">
        
        {/* Bloco 1: Matriz Barcarena */}
        <div className="address-card">
          <h4>Matriz Barcarena</h4>
          <p className="label-title">Endereço:</p>
          <p className="label-desc">Rua Manoel Paraense, nº 10, Vila dos Cabanos, 68.447-000, Barcarena - PA</p>
          <p className="label-title">Fone:</p>
          <p className="label-desc">(91) 4042-1935</p>
        </div>

        {/* Bloco 2: Filial Parauapebas */}
        <div className="address-card">
          <h4>Filial Parauapebas</h4>
          <p className="label-title">Endereço:</p>
          <p className="label-desc">Acesso Gleba Taboca, Carajás III, S/N, Qd.03, Lt.01, Fazenda Chico Oliveira, 68.515-000, Parauapebas – PA</p>
          <p className="label-title">Fone:</p>
          <p className="label-desc">(94) 3199-0208</p>
        </div>

        {/* Bloco 3: Filial São Luís */}
        <div className="address-card">
          <h4>Filial São Luís</h4>
          <p className="label-title">Endereço:</p>
          <p className="label-desc">Rua Seis, nº 02, Quadra L, Forquilha, 65.054-100, São Luís - MA</p>
          <p className="label-title">Fone:</p>
          <p className="label-desc">(98) 3303-5123/5124</p>
        </div>

        {/* Bloco 4: Filial Aveiro – Portugal */}
        <div className="address-card">
          <h4>Filial Aveiro – Portugal</h4>
          <p className="label-title">Endereço:</p>
          <p className="label-desc">Rua do Monte Novo, nº 16, Zona Industrial de Taboeira, Freguesia de Esgueira, Concelho de Aveiro, 3800-043, Aveiro – Portugal</p>
          <p className="label-title">Fone:</p>
          <p className="label-desc">+351 234 310 049</p>
        </div>

        {/* Bloco 5: Filial São José dos Campos */}
        <div className="address-card">
          <h4>Filial São José dos Campos</h4>
          <p className="label-title">Endereço:</p>
          <p className="label-desc">Av. Dois, 150 - Condomínio Eldorado – Eldorado, 12.238-580, São José dos Campos – SP</p>
          <p className="label-title">Fone:</p>
          <p className="label-desc">(12) 2012-1332</p>
        </div>

      </div>
    </div>
  );
};