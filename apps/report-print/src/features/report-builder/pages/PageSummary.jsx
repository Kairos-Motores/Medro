import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Summary } from '../blocks/Summary';

export const PageSummary = ({ unidade, pageNumber, pages, pageNumbers, onNavigate, onTitleChange, isPrintMode, osData }) => {
  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} />

      <main className="page-body content-centered">
        <Summary
          pages={pages}
          pageNumbers={pageNumbers}
          onNavigate={onNavigate}
          onTitleChange={onTitleChange}
          isPrintMode={isPrintMode}
        />
      </main>

      <Footer pageNumber={pageNumber} unidade={unidade} />
    </div>
  );
};