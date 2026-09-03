import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { BalanceamentoTable } from '../blocks/BalanceamentoTable';
import { AutoPaginate } from '../components/AutoPaginate';

export const PageBalanceamento = ({ data, pageNumber, balanceData, keys }) => {
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
        <h2 className="page-title">BALANCEAMENTO DINÂMICO</h2>
        <BalanceamentoTable data={balanceData} />
      </main>
      <Footer pageNumber={pageNumber} unidade={mappingFiliais[data.cr4a1_zb6_filial]} />
    </div>
  );
};