import React from 'react';
import { resolveCoverImage } from '../utils/cover';

export const PageCover = ({ modelConfig }) => {
  return (
    // Adicionamos style padding: 0 para garantir que nada empurre a imagem
    <div className="page full-bleed-page" style={{ padding: 0, margin: 0 }}>
      <img 
        src={resolveCoverImage(modelConfig)}
        alt="Capa do Relatório" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', // Garante que a imagem preencha sem distorcer
          display: 'block'    // Remove espaço branco residual embaixo da imagem
        }} 
      />
    </div>
  );
};