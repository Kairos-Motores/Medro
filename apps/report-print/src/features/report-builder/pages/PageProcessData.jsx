import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ProcessData } from '../blocks/ProcessData';

export const PageProcessData = ({ data, pageNumber, onDataUpdate, isPrintMode }) => {
  const mappingFiliais = {
    '0101': 'Barcarena',
    '0102': 'São Luís',
    '0103': 'Parauapebas',
    '0104': 'São José dos Campos'
  };

  return (
    <div className="page a4-page">
      <Header
        unidade={mappingFiliais[data.cr4a1_zb6_filial]}
        cliente={data.cr4a1_cliente_nome}
      />
      <main className="page-body">
        <ProcessData data={data} onUpdate={onDataUpdate} isPrintMode={isPrintMode} />
      </main>
      <Footer pageNumber={pageNumber} unidade={mappingFiliais[data.cr4a1_zb6_filial]} />
    </div>
  );
};