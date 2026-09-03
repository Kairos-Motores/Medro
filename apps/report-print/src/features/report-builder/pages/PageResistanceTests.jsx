import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import equacaoUm from '../../../assets/equacao-um.png';
import equacaoDois from '../../../assets/equacao-dois.png';

export const PageResistanceTests = ({ osData, resistanceData, onUpdate, isViewerMode }) => {
  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="RELATÓRIO TÉCNICO" />
      
      <main className="page-body p12-resistance-layout">
        
        <section className="section-head-33">
          <h2 className="main-title">3.4 Ensaios de resistência elétrica</h2>
          <p className="description-text">
            As informações a seguir referem-se aos ensaios de resistência elétrica do motor, incluindo medições de resistência ôhmica dos enrolamentos por meio de miliomímetro, com foco na verificação de possíveis desequilíbrios ôhmicos entre fases, bem como ensaios de resistência de isolamento executados com megômetro. Esses ensaios têm como objetivo avaliar a integridade elétrica dos enrolamentos, identificar assimetrias, conexões defeituosas ou degradações no isolamento, sendo fundamentais para a confiabilidade operacional, a segurança elétrica e a prevenção de falhas prematuras do equipamento.
          </p>
        </section>

        {/* SUBSEÇÃO 1: RESISTÊNCIA DE ISOLAÇÃO */}
        <section className="sub-test-section">
          <div className="sub-section-header">
            <h3>Resistência de isolação</h3>
            <span className="norma-tag">Norma IEEE-43-2013</span>
            <span className="param-tag">Tensão aplicada: 0,5 kV</span>
          </div>

          <div className="tables-side-by-side-grid">
            <table className="resistance-pure-table">
              <thead>
                <tr>
                  <th>Duração:</th>
                  <th>Medição:</th>
                  <th>Unidade (Ω):</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fixed-gray-label">30 Seg</td>
                  <td>
                    {isViewerMode ? (
                      <span>{resistanceData.medicao30s || "---"}</span>
                    ) : (
                      <input className="no-print" value={resistanceData.medicao30s} onChange={(e) => onUpdate('medicao30s', e.target.value)} />
                    )}
                    {!isViewerMode && <p className="print-only">{resistanceData.medicao30s || "---"}</p>}
                  </td>
                  <td className="fixed-gray-label">Mega (Ω)</td>
                </tr>
                <tr>
                  <td className="fixed-gray-label">01 Min</td>
                  <td>
                    {isViewerMode ? (
                      <span>{resistanceData.medicao1m || "---"}</span>
                    ) : (
                      <input className="no-print" value={resistanceData.medicao1m} onChange={(e) => onUpdate('medicao1m', e.target.value)} />
                    )}
                    {!isViewerMode && <p className="print-only">{resistanceData.medicao1m || "---"}</p>}
                  </td>
                  <td className="fixed-gray-label">Mega (Ω)</td>
                </tr>
                <tr>
                  <td className="fixed-gray-label">10 Min</td>
                  <td>
                    {isViewerMode ? (
                      <span>{resistanceData.medicao10m || "---"}</span>
                    ) : (
                      <input className="no-print" value={resistanceData.medicao10m} onChange={(e) => onUpdate('medicao10m', e.target.value)} />
                    )}
                    {!isViewerMode && <p className="print-only">{resistanceData.medicao10m || "---"}</p>}
                  </td>
                  <td className="fixed-gray-label">Mega (Ω)</td>
                </tr>
              </tbody>
            </table>

            <table className="resistance-pure-table">
              <thead>
                <tr>
                  <th>IA</th>
                  <th>IP</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {isViewerMode ? (
                      <span>{resistanceData.ia || "---"}</span>
                    ) : (
                      <input className="no-print" value={resistanceData.ia} onChange={(e) => onUpdate('ia', e.target.value)} />
                    )}
                    {!isViewerMode && <p className="print-only">{resistanceData.ia || "---"}</p>}
                  </td>
                  <td>
                    {isViewerMode ? (
                      <span>{resistanceData.ip || "---"}</span>
                    ) : (
                      <input className="no-print" value={resistanceData.ip} onChange={(e) => onUpdate('ip', e.target.value)} />
                    )}
                    {!isViewerMode && <p className="print-only">{resistanceData.ip || "---"}</p>}
                  </td>
                  <td className="status-cell-toggle">
                    {isViewerMode ? (
                      <span className={`status-text ${resistanceData.statusIsolacao === 'Aprovado' ? 'green' : 'red'}`}>
                        {resistanceData.statusIsolacao}
                      </span>
                    ) : (
                      <>
                        <div className="no-print toggle-buttons">
                          <button className={`btn-mini sim ${resistanceData.statusIsolacao === 'Aprovado' ? 'active' : ''}`} onClick={() => onUpdate('statusIsolacao', 'Aprovado')}>APROV.</button>
                          <button className={`btn-mini nao ${resistanceData.statusIsolacao === 'Reprovado' ? 'active' : ''}`} onClick={() => onUpdate('statusIsolacao', 'Reprovado')}>REPROV.</button>
                        </div>
                        <span className="print-only status-text">{resistanceData.statusIsolacao}</span>
                      </>
                    )}
                  </td>
                </tr>
                <tr><td colSpan="3" className="empty-align-cell"></td></tr>
                <tr><td colSpan="3" className="empty-align-cell"></td></tr>
              </tbody>
            </table>
          </div>
          
          <p className="note-text">
            <strong>Nota:</strong> De acordo com o item 12.2.2 da norma IEEE-43-2013 quando o índice de isolamento é superior a 5.000 MΩ (5,0GΩ) o valor de IP é dispensável e o isolamento é considerado ótimo.
          </p>
        </section>

        {/* SUBSEÇÃO 2: RESISTÊNCIA ÔHMICA DO ENROLAMENTO */}
        <section className="sub-test-section" style={{ marginTop: '3mm' }}>
          <div className="sub-section-header">
            <h3>Resistência Ôhmica do enrolamento</h3>
            <span className="norma-tag">Normas: NBR 5383 / IEC 60034-1</span>
          </div>

          <table className="resistance-pure-table ohmica-full-table">
            <thead>
              <tr>
                <th>Quantidade de Cabos →</th>
                <th style={{ background: '#fff' }}>
                  {isViewerMode ? (
                    <span>{resistanceData.qtdCabos}</span>
                  ) : (
                    <input value={resistanceData.qtdCabos} onChange={(e) => onUpdate('qtdCabos', e.target.value)} style={{ fontWeight: 'bold' }} />
                  )}
                </th>
                <th>Fase: R-S</th>
                <td>
                  {isViewerMode ? (
                    <span>{resistanceData.faseRS || "---"}</span>
                  ) : (
                    <>
                      <input className="no-print" value={resistanceData.faseRS} onChange={(e) => onUpdate('faseRS', e.target.value)} />
                      <p className="print-only">{resistanceData.faseRS || "---"}</p>
                    </>
                  )}
                </td>
                <th>Ω</th>
                <th>Variação da Resistência:</th>
                <td>
                  {isViewerMode ? (
                    <span>{resistanceData.variacaoDelta || "---"}</span>
                  ) : (
                    <>
                      <input className="no-print" value={resistanceData.variacaoDelta} onChange={(e) => onUpdate('variacaoDelta', e.target.value)} />
                      <p className="print-only">{resistanceData.variacaoDelta || "---"}</p>
                    </>
                  )}
                </td>
                <th>Δ%</th>
                <th>Status</th>
                <td className="status-cell-toggle">
                  {isViewerMode ? (
                    <span className={`status-text ${resistanceData.statusOhmica === 'Aprovado' ? 'green' : 'red'}`}>
                      {resistanceData.statusOhmica}
                    </span>
                  ) : (
                    <>
                      <div className="no-print toggle-buttons">
                        <button className={`btn-mini sim ${resistanceData.statusOhmica === 'Aprovado' ? 'active' : ''}`} onClick={() => onUpdate('statusOhmica', 'Aprovado')}>OK</button>
                        <button className={`btn-mini nao ${resistanceData.statusOhmica === 'Reprovado' ? 'active' : ''}`} onClick={() => onUpdate('statusOhmica', 'Reprovado')}>X</button>
                      </div>
                      <span className="print-only status-text">{resistanceData.statusOhmica}</span>
                    </>
                  )}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="2" className="empty-align-cell"></td>
                <th>Fase: R-T</th>
                <td>
                  {isViewerMode ? (
                    <span>{resistanceData.faseRT || "---"}</span>
                  ) : (
                    <>
                      <input className="no-print" value={resistanceData.faseRT} onChange={(e) => onUpdate('faseRT', e.target.value)} />
                      <p className="print-only">{resistanceData.faseRT || "---"}</p>
                    </>
                  )}
                </td>
                <th>Ω</th>
                <td colSpan="5" rowSpan="2" className="acceptance-formula-placeholder-cell">
                  <span className="formula-text-fallback">Cálculo de variação percentual referenciada</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="empty-align-cell"></td>
                <th>Fase: S-T</th>
                <td>
                  {isViewerMode ? (
                    <span>{resistanceData.faseST || "---"}</span>
                  ) : (
                    <>
                      <input className="no-print" value={resistanceData.faseST} onChange={(e) => onUpdate('faseST', e.target.value)} />
                      <p className="print-only">{resistanceData.faseST || "---"}</p>
                    </>
                  )}
                </td>
                <th>Ω</th>
              </tr>
            </tbody>
          </table>

          <p className="note-text">
            <strong>Critério de aceitação:</strong> A variação máxima da resistência ôhmica é de 3% do maior para o menor.
          </p>

          <p className="note-text" style={{ marginTop: '2mm' }}>
            A Resistência Ôhmica deve ser medida em cada bobinado do estator com eles em temperatura ambiente. Quando não for possível medir com os bobinados em temperatura ambiente e iguais, o mesmo deve ser referido a mesma temperatura utilizando a fórmula abaixo:
          </p>
        </section>

        <div className="equations-bottom-box">
          <div className="equation-wrapper">
            <img src={equacaoUm} alt="Equação de correção de temperatura" />
          </div>
          <div className="equation-wrapper">
            <img src={equacaoDois} alt="Equação de desequilíbrio percentual" />
          </div>
        </div>

      </main>

      <Footer pageNumber="12" unidade={osData.unidade_nome} />
    </div>
  );
};