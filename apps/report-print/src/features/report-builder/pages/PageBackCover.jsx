import React from 'react';
import contracapaImg from '../../../assets/contracapa_padrao.jpg';

export const PageBackCover = () => {
  return (
    <div className="page a4-page full-bleed-page">
      <img src={contracapaImg} alt="Contracapa" className="full-page-bg" />
    </div>
  );
};