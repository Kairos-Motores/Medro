import React from 'react';
import servicosImg from '../../../assets/nossos_servicos.jpg';

export const PageOurServices = () => {
  return (
    <div className="page a4-page full-bleed-page">
      <img src={servicosImg} alt="Nossos Serviços" className="full-page-bg" />
    </div>
  );
};