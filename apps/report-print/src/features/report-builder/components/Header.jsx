import React from 'react';
import logoImg from '../../../assets/LOGO.png';

export const Header = ({ titulo, unidade, cliente }) => {
  return (
    <header className="m3-report-header">
      <div className="m3-header-titles">
        <h1 className="m3-header-main-title">RELATÓRIO TÉCNICO</h1>
        <span className="m3-header-subtitle">
          {unidade && cliente 
            ? `${unidade} | ${cliente} | FRM:	135	REV.:	04	Data:	23/04/2026`
            : 'FRM:	135	REV.:	04	Data:	23/04/2026'}
        </span>
      </div>
      <img src={logoImg} alt="Kairós Motores" className="m3-header-logo" />
    </header>
  );
};