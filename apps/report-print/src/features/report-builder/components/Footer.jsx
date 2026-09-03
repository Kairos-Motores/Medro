import React from 'react';

export const Footer = ({ pageNumber, unidade }) => {
  return (
    <footer className="m3-report-footer">
      <span className="m3-footer-unit">Unidade: {unidade || "Kairós Motores"}</span>
      <span className="m3-footer-page">{pageNumber}</span>
    </footer>
  );
};