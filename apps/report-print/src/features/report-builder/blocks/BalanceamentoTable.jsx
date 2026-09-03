import React from 'react';

export const BalanceamentoTable = ({ data }) => {
  if (!data) {
    return <p>Nenhum dado de balanceamento encontrado para esta OS.</p>;
  }

  const dados = data.Dados || {};
  const gramas = data.Gramas || {};
  const isog = data.ISOG || {};
  const gmm = data.gmm || {};

  return (
    <div className="balanceamento-block">
      {/* Tabela Geometria */}
      <table className="m3-table">
        <thead>
          <tr>
            <th colSpan="5" className="m3-table-main-title">Geometria da Peça</th>
          </tr>
          <tr>
            <th>Raio 1 (mm)</th>
            <th>Raio 2 (mm)</th>
            <th>Peso (kg)</th>
            <th>RPM Trabalho</th>
            <th>RPM Balanc.</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{dados.Raio1 || '-'}</td>
            <td>{dados.Raio2 || '-'}</td>
            <td>{dados.PesoRotor || '-'}</td>
            <td>{dados.RPMTrabalho || '-'}</td>
            <td>{dados.RPMBalanceamento || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabelas de Plano 1 e Plano 2 */}
      {[1, 2].map(plano => (
        <table key={plano} className="m3-table" style={{ marginTop: '12px' }}>
          <thead>
            <tr>
              <th colSpan="4" className="m3-table-main-title">Resultado Plano {plano}</th>
            </tr>
            <tr>
              <th></th>
              <th>Grama (g)</th>
              <th>ISOG (mm/s)</th>
              <th>g.mm</th>
            </tr>
          </thead>
          <tbody>
            {['Inicial', 'Limite', 'Final'].map((tipo, i) => {
              const chave = tipo === 'Inicial' ? `Inicial${plano}` : tipo === 'Final' ? `Final${plano}` : `Ideal${plano}`;
              return (
                <tr key={tipo}>
                  <td className="td-label">{tipo}</td>
                  <td>{gramas[chave] || '-'}</td>
                  <td>{isog[chave] || '-'}</td>
                  <td>{gmm[chave] || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ))}
    </div>
  );
};