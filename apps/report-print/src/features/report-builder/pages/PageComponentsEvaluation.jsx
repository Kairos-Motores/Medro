import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PageComponentsEvaluation = ({ osData, p11Data, onUpdate, isViewerMode }) => {
  
  const data = p11Data || {};
  const instruments = data.instruments || [];
  const rolamentos = data.rolamentos || { desc: "", qty: "", replace: "" };
  const vedacao = data.vedacao || { desc: "", replace: "" };
  const auxiliar = data.auxiliar || { desc: "", qty: "", replace: "" };

  const handleInstChange = (index, field, val) => {
    const newInst = [...instruments];
    if (!newInst[index]) newInst[index] = { name: "", nr: "", date: "" };
    newInst[index] = { ...newInst[index], [field]: val };
    onUpdate('instruments', newInst);
  };

  const handleCompChange = (key, field, val) => {
    onUpdate(key, { 
      ...(data[key] || {}), 
      [field]: val 
    });
  };

  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="RELATÓRIO TÉCNICO" />
      
      <main className="page-body p11-final-layout">
        
        <table className="instruments-table">
          <thead>
            <tr>
              <th style={{ width: '45%' }}>Instrumento</th>
              <th style={{ width: '25%' }}>N° do instrumento</th>
              <th style={{ width: '30%' }}>Data de Calibração</th>
            </tr>
          </thead>
          <tbody>
            {instruments.map((inst, idx) => (
              <tr key={idx}>
                <td>
                  {isViewerMode ? (
                    <span>{inst.name || "---"}</span>
                  ) : (
                    <>
                      <input 
                        className="no-print"
                        value={inst.name || ""} 
                        onChange={(e) => handleInstChange(idx, 'name', e.target.value)} 
                        placeholder="Nome do instrumento..."
                      />
                      <span className="print-only">{inst.name || "---"}</span>
                    </>
                  )}
                </td>
                <td>
                  {isViewerMode ? (
                    <span>{inst.nr || "---"}</span>
                  ) : (
                    <>
                      <input 
                        className="no-print"
                        value={inst.nr || ""} 
                        onChange={(e) => handleInstChange(idx, 'nr', e.target.value)} 
                        placeholder="N°..."
                      />
                      <span className="print-only">{inst.nr || "---"}</span>
                    </>
                  )}
                </td>
                <td>
                  {isViewerMode ? (
                    <span>{inst.date || "---"}</span>
                  ) : (
                    <>
                      <input 
                        className="no-print"
                        value={inst.date || ""} 
                        onChange={(e) => handleInstChange(idx, 'date', e.target.value)} 
                        placeholder="DD/MM/AAAA..."
                      />
                      <span className="print-only">{inst.date || "---"}</span>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <section className="section-33">
          <h2 className="title-33">3.3 Avaliação de componentes</h2>
          <p className="text-33">
            As informações a seguir referem-se à avaliação dos componentes auxiliares do equipamento, tais como elementos de vedação, fixação, transporte e rolamentos, entre outros. A inspeção tem por objetivo verificar a integridade, a conformidade e a adequação funcional desses componentes, os quais são essenciais para a segurança operacional, a confiabilidade do funcionamento, a correta sustentação dos conjuntos rotativos e a preservação dos conjuntos principais do equipamento.
          </p>
        </section>

        {/* BLOCO 1: ROLAMENTOS */}
        <div className="comp-block">
          <div className="comp-header">Rolamentos</div>
          <table className="comp-sub-table">
            <thead>
              <tr>
                <th style={{ width: '55%', textAlign: 'left', paddingLeft: '8px' }}>Descrição:</th>
                <th style={{ width: '15%' }}>Quantidade</th>
                <th style={{ width: '30%' }} colSpan="2">Substituir?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {isViewerMode ? (
                    <span>{rolamentos.desc || "---"}</span>
                  ) : (
                    <>
                      <textarea 
                        className="no-print"
                        value={rolamentos.desc || ""} 
                        onChange={(e) => handleCompChange('rolamentos', 'desc', e.target.value)} 
                        placeholder="Descrição técnica..."
                      />
                      <span className="print-only style-print-text">{rolamentos.desc || "---"}</span>
                    </>
                  )}
                </td>
                <td>
                  {isViewerMode ? (
                    <span>{rolamentos.qty || "---"}</span>
                  ) : (
                    <>
                      <input 
                        className="no-print"
                        value={rolamentos.qty || ""} 
                        onChange={(e) => handleCompChange('rolamentos', 'qty', e.target.value)} 
                      />
                      <span className="print-only">{rolamentos.qty || "---"}</span>
                    </>
                  )}
                </td>
                {!isViewerMode ? (
                  <>
                    <td 
                      className={`btn-toggle sim ${rolamentos.replace === 'X' ? 'active-sim' : ''}`}
                      onClick={() => handleCompChange('rolamentos', 'replace', 'X')}
                    >
                      <div className="mark">{rolamentos.replace === 'X' ? 'X' : ''}</div>
                      <span>SIM</span>
                    </td>
                    <td 
                      className={`btn-toggle nao ${rolamentos.replace === 'N' ? 'active-nao' : ''}`}
                      onClick={() => handleCompChange('rolamentos', 'replace', 'N')}
                    >
                      <div className="mark">{rolamentos.replace === 'N' ? 'X' : ''}</div>
                      <span>NÃO</span>
                    </td>
                  </>
                ) : (
                  <td colSpan="2">
                    <span className={`status-text ${rolamentos.replace === 'X' ? 'green' : 'red'}`}>
                      {rolamentos.replace === 'X' ? 'SIM' : rolamentos.replace === 'N' ? 'NÃO' : '---'}
                    </span>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* BLOCO 2: VEDAÇÃO DOS MANCAIS E CARCAÇA */}
        <div className="comp-block">
          <div className="comp-header">Vedação dos mancais e carcaça</div>
          <table className="comp-sub-table">
            <thead>
              <tr>
                <th style={{ width: '70%', textAlign: 'left', paddingLeft: '8px' }}>Descrição</th>
                <th style={{ width: '30%' }} colSpan="2">Substituir?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {isViewerMode ? (
                    <span>{vedacao.desc || "---"}</span>
                  ) : (
                    <>
                      <textarea 
                        className="no-print"
                        value={vedacao.desc || ""} 
                        onChange={(e) => handleCompChange('vedacao', 'desc', e.target.value)} 
                        placeholder="Descrição técnica..."
                      />
                      <span className="print-only style-print-text">{vedacao.desc || "---"}</span>
                    </>
                  )}
                </td>
                {!isViewerMode ? (
                  <>
                    <td 
                      className={`btn-toggle sim ${vedacao.replace === 'X' ? 'active-sim' : ''}`}
                      onClick={() => handleCompChange('vedacao', 'replace', 'X')}
                    >
                      <div className="mark">{vedacao.replace === 'X' ? 'X' : ''}</div>
                      <span>SIM</span>
                    </td>
                    <td 
                      className={`btn-toggle nao ${vedacao.replace === 'N' ? 'active-nao' : ''}`}
                      onClick={() => handleCompChange('vedacao', 'replace', 'N')}
                    >
                      <div className="mark">{vedacao.replace === 'N' ? 'X' : ''}</div>
                      <span>NÃO</span>
                    </td>
                  </>
                ) : (
                  <td colSpan="2">
                    <span className={`status-text ${vedacao.replace === 'X' ? 'green' : 'red'}`}>
                      {vedacao.replace === 'X' ? 'SIM' : vedacao.replace === 'N' ? 'NÃO' : '---'}
                    </span>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

        {/* BLOCO 3: COMPONENTES AUXILIARES ADICIONAIS */}
        <div className="comp-block">
          <div className="comp-header">&nbsp;</div>
          <table className="comp-sub-table">
            <thead>
              <tr>
                <th style={{ width: '55%', textAlign: 'left', paddingLeft: '8px' }}>Descrição:</th>
                <th style={{ width: '15%' }}>Quantidade</th>
                <th style={{ width: '30%' }} colSpan="2">Substituir?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  {isViewerMode ? (
                    <span>{auxiliar.desc || "---"}</span>
                  ) : (
                    <>
                      <textarea 
                        className="no-print"
                        value={auxiliar.desc || ""} 
                        onChange={(e) => handleCompChange('auxiliar', 'desc', e.target.value)} 
                        placeholder="Descrição técnica..."
                      />
                      <span className="print-only style-print-text">{auxiliar.desc || "---"}</span>
                    </>
                  )}
                </td>
                <td>
                  {isViewerMode ? (
                    <span>{auxiliar.qty || "---"}</span>
                  ) : (
                    <>
                      <input 
                        className="no-print"
                        value={auxiliar.qty || ""} 
                        onChange={(e) => handleCompChange('auxiliar', 'qty', e.target.value)} 
                      />
                      <span className="print-only">{auxiliar.qty || "---"}</span>
                    </>
                  )}
                </td>
                {!isViewerMode ? (
                  <>
                    <td 
                      className={`btn-toggle sim ${auxiliar.replace === 'X' ? 'active-sim' : ''}`}
                      onClick={() => handleCompChange('auxiliar', 'replace', 'X')}
                    >
                      <div className="mark">{auxiliar.replace === 'X' ? 'X' : ''}</div>
                      <span>SIM</span>
                    </td>
                    <td 
                      className={`btn-toggle nao ${auxiliar.replace === 'N' ? 'active-nao' : ''}`}
                      onClick={() => handleCompChange('auxiliar', 'replace', 'N')}
                    >
                      <div className="mark">{auxiliar.replace === 'N' ? 'X' : ''}</div>
                      <span>NÃO</span>
                    </td>
                  </>
                ) : (
                  <td colSpan="2">
                    <span className={`status-text ${auxiliar.replace === 'X' ? 'green' : 'red'}`}>
                      {auxiliar.replace === 'X' ? 'SIM' : auxiliar.replace === 'N' ? 'NÃO' : '---'}
                    </span>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>

      </main>
      <Footer pageNumber="11" unidade={osData?.unidade_nome} />
    </div>
  );
};