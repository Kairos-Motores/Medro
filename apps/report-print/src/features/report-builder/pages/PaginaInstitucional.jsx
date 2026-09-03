import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Institutional } from '../blocks/Institutional';

export const PageInstitutional = ({ unidade, osData }) => {
  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="INSTITUCIONAL"/>
      
      <main className="page-body">
        <Institutional />
      </main>

      <Footer pageNumber="02" unidade={unidade} />
    </div>
  );
};