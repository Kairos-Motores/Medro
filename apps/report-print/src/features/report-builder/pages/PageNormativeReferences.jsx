import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import legendAbsorcao from '../../../assets/indice-absorcao.png';
import legendPolarizacao from '../../../assets/indice-polarizacao.png';
import legendResistencia from '../../../assets/medicao-resistencia.png';

export const PageNormativeReferences = ({ osData, normativeData, onUpdate, isViewerMode }) => {
  const [ia30s, setIa30s] = useState(normativeData?.ia_30s || "");
  const [ia60s, setIa60s] = useState(normativeData?.ia_60s || "");
  const [ip1m, setIp1m] = useState(normativeData?.ip_1m || "");
  const [ip10m, setIp10m] = useState(normativeData?.ip_10m || "");
  const [res30s, setRes30s] = useState(normativeData?.res_30s || "");
  const [res1m, setRes1m] = useState(normativeData?.res_1m || "");
  const [res10m, setRes10m] = useState(normativeData?.res_10m || "");

  useEffect(() => {
    setIa30s(normativeData?.ia_30s || "");
    setIa60s(normativeData?.ia_60s || "");
    setIp1m(normativeData?.ip_1m || "");
    setIp10m(normativeData?.ip_10m || "");
    setRes30s(normativeData?.res_30s || "");
    setRes1m(normativeData?.res_1m || "");
    setRes10m(normativeData?.res_10m || "");
  }, [normativeData]);

  const handleFieldChange = (field, setter, value) => {
    setter(value);
    onUpdate(field, value);
  };

  const vIa30s = parseFloat(ia30s) || 0;
  const vIa60s = parseFloat(ia60s) || 0;
  const calculatedIA = vIa30s > 0 ? (vIa60s / vIa30s) : 0;
  const getIaY = (val) => Math.max(20, Math.min(150, 150 - (Math.min(val, 2.5) * 52)));
  const pointsIA = vIa30s > 0 && vIa60s > 0 ? `${50},150 ${160},${getIaY(1.0)} ${370},${getIaY(calculatedIA)}` : "";
  const getIaColor = (val) => {
    if (val >= 1.6) return "#4cd137";
    if (val >= 1.25) return "#00a8ff";
    if (val >= 1.0) return "#fbc531";
    return "#e84118";
  };

  const vIp1m = parseFloat(ip1m) || 0;
  const vIp10m = parseFloat(ip10m) || 0;
  const calculatedIP = vIp1m > 0 ? (vIp10m / vIp1m) : 0;
  const getIpY = (val) => Math.max(20, Math.min(150, 150 - (Math.min(val, 5.0) * 26)));
  const pointsIP = vIp1m > 0 && vIp10m > 0 ? `${50},150 ${160},${getIpY(1.0)} ${370},${getIpY(calculatedIP)}` : "";
  const getIpColor = (val) => {
    if (val >= 4.0) return "#4cd137";
    if (val >= 2.0) return "#00a8ff";
    if (val >= 1.0) return "#fbc531";
    return "#e84118";
  };

  const vRes30s = parseFloat(res30s) || 0;
  const vRes1m = parseFloat(res1m) || 0;
  const vRes10m = parseFloat(res10m) || 0;
  const maxMegal = Math.max(vRes30s, vRes1m, vRes10m, 100);
  const getResY = (val) => Math.max(20, Math.min(150, 150 - ((val / maxMegal) * 130)));
  const pointsResistencia = vRes30s > 0 || vRes1m > 0 || vRes10m > 0 ? `${50},150 ${130},${getResY(vRes30s)} ${230},${getResY(vRes1m)} ${370},${getResY(vRes10m)}` : "";
  const getResColor = (val) => {
    if (val >= maxMegal * 0.75) return "#4cd137";
    if (val >= maxMegal * 0.5) return "#00a8ff";
    if (val >= maxMegal * 0.2) return "#fbc531";
    return "#e84118";
  };

  return (
    <div className="page a4-page">
      <Header unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} titulo="RELATÓRIO TÉCNICO" />
      
      <main className="page-body p13-references-layout">
        <section className="section-head-normative">
          <h2 className="main-title">3.4 Referências de acordo com a norma IEEE-43-2013</h2>
          <p className="description-text">
            Os gráficos a seguir ilustram o comportamento independente de cada ensaio realizado no equipamento, plotados dinamicamente sobre suas respectivas faixas normativas coloridas.
          </p>
        </section>

        {/* GRÁFICO 1: ÍNDICE DE ABSORÇÃO */}
        <div className="normative-row">
          {!isViewerMode && (
            <div className="no-print input-chart-panel">
              <div className="panel-title">Dados do IA</div>
              <div className="input-group">
                <label>R30s (MΩ):</label>
                <input type="number" value={ia30s} onChange={(e) => handleFieldChange('ia_30s', setIa30s, e.target.value)} placeholder="0" />
              </div>
              <div className="input-group">
                <label>R1m (MΩ):</label>
                <input type="number" value={ia60s} onChange={(e) => handleFieldChange('ia_60s', setIa60s, e.target.value)} placeholder="0" />
              </div>
              {calculatedIA > 0 && <div className="calc-result">IA: <strong>{calculatedIA.toFixed(2)}</strong></div>}
            </div>
          )}

          <div className="chart-wrapper">
            <span className="chart-label">Gráfico - Índice de Absorção (IA)</span>
            <svg viewBox="0 0 400 180" className="svg-normative-chart">
              <rect x="50" y="20" width="320" height="47" fill="#4cd137" />
              <rect x="50" y="67" width="320" height="18" fill="#00a8ff" />
              <rect x="50" y="85" width="320" height="13" fill="#fbc531" />
              <rect x="50" y="98" width="320" height="52" fill="#e84118" />
              <line x1="50" y1="150" x2="370" y2="150" stroke="#000" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="150" stroke="#000" strokeWidth="1.5" />
              <text x="42" y="153" fontSize="7" fontWeight="bold" textAnchor="end">0.0</text>
              <text x="42" y="101" fontSize="7" fontWeight="bold" textAnchor="end">1.0</text>
              <text x="42" y="70" fontSize="7" fontWeight="bold" textAnchor="end">1.6</text>
              <text x="370" y="163" fontSize="7.5" fontWeight="bold" textAnchor="middle">60s</text>
              {pointsIA && <polyline points={pointsIA} fill="none" stroke={getIaColor(calculatedIA)} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
              {pointsIA && <circle cx="370" cy={getIaY(calculatedIA)} r="5.5" fill="#fff" stroke="#000" strokeWidth="2" />}
            </svg>
          </div>
          <div className="legend-wrapper">
            <img src={legendAbsorcao} alt="Legenda IA" />
          </div>
        </div>

        {/* GRÁFICO 2: ÍNDICE DE POLARIZAÇÃO */}
        <div className="normative-row">
          {!isViewerMode && (
            <div className="no-print input-chart-panel">
              <div className="panel-title">Dados do IP</div>
              <div className="input-group">
                <label>R1m (MΩ):</label>
                <input type="number" value={ip1m} onChange={(e) => handleFieldChange('ip_1m', setIp1m, e.target.value)} placeholder="0" />
              </div>
              <div className="input-group">
                <label>R10m (MΩ):</label>
                <input type="number" value={ip10m} onChange={(e) => handleFieldChange('ip_10m', setIp10m, e.target.value)} placeholder="0" />
              </div>
              {calculatedIP > 0 && <div className="calc-result">IP: <strong>{calculatedIP.toFixed(2)}</strong></div>}
            </div>
          )}

          <div className="chart-wrapper">
            <span className="chart-label">Gráfico - Índice de Polarização (IP)</span>
            <svg viewBox="0 0 400 180" className="svg-normative-chart">
              <rect x="50" y="20" width="320" height="26" fill="#4cd137" />
              <rect x="50" y="46" width="320" height="52" fill="#00a8ff" />
              <rect x="50" y="98" width="320" height="26" fill="#fbc531" />
              <rect x="50" y="124" width="320" height="26" fill="#e84118" />
              <line x1="50" y1="150" x2="370" y2="150" stroke="#000" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="150" stroke="#000" strokeWidth="1.5" />
              <text x="42" y="153" fontSize="7" fontWeight="bold" textAnchor="end">0.0</text>
              <text x="42" y="127" fontSize="7" fontWeight="bold" textAnchor="end">1.0</text>
              <text x="42" y="101" fontSize="7" fontWeight="bold" textAnchor="end">2.0</text>
              <text x="42" y="50" fontSize="7" fontWeight="bold" textAnchor="end">4.0</text>
              <text x="370" y="163" fontSize="7.5" fontWeight="bold" textAnchor="middle">10 min</text>
              {pointsIP && <polyline points={pointsIP} fill="none" stroke={getIpColor(calculatedIP)} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
              {pointsIP && <circle cx="370" cy={getIpY(calculatedIP)} r="5.5" fill="#fff" stroke="#000" strokeWidth="2" />}
            </svg>
          </div>
          <div className="legend-wrapper">
            <img src={legendPolarizacao} alt="Legenda IP" />
          </div>
        </div>

        {/* GRÁFICO 3: TENDÊNCIA DE ISOLAMENTO */}
        <div className="normative-row">
          {!isViewerMode && (
            <div className="no-print input-chart-panel">
              <div className="panel-title">Absoluto MΩ</div>
              <div className="input-group">
                <label>R30s:</label>
                <input type="number" value={res30s} onChange={(e) => handleFieldChange('res_30s', setRes30s, e.target.value)} placeholder="0" />
              </div>
              <div className="input-group">
                <label>R1m:</label>
                <input type="number" value={res1m} onChange={(e) => handleFieldChange('res_1m', setRes1m, e.target.value)} placeholder="0" />
              </div>
              <div className="input-group">
                <label>R10m:</label>
                <input type="number" value={res10m} onChange={(e) => handleFieldChange('res_10m', setRes10m, e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          <div className="chart-wrapper">
            <span className="chart-label">Gráfico - Tendência de Isolamento Mínimo</span>
            <svg viewBox="0 0 400 180" className="svg-normative-chart">
              <rect x="50" y="20" width="320" height="47" fill="#4cd137" />
              <rect x="50" y="67" width="320" height="33" fill="#00a8ff" />
              <rect x="50" y="100" width="320" height="25" fill="#fbc531" />
              <rect x="50" y="125" width="320" height="25" fill="#e84118" />
              <line x1="50" y1="150" x2="370" y2="150" stroke="#000" strokeWidth="1.5" />
              <line x1="50" y1="20" x2="50" y2="150" stroke="#000" strokeWidth="1.5" />
              <text x="44" y="153" fontSize="6.5" fontWeight="bold" textAnchor="end">0</text>
              <text x="44" y="25" fontSize="6.5" fontWeight="bold" textAnchor="end">{maxMegal}MΩ</text>
              <text x="130" y="163" fontSize="7" fontWeight="bold" textAnchor="middle">30s</text>
              <text x="230" y="163" fontSize="7" fontWeight="bold" textAnchor="middle">1m</text>
              <text x="370" y="163" fontSize="7" fontWeight="bold" textAnchor="middle">10m</text>
              {pointsResistencia && <polyline points={pointsResistencia} fill="none" stroke={getResColor(vRes10m)} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.5))' }} />}
              {vRes30s > 0 && <circle cx="130" cy={getResY(vRes30s)} r="4.5" fill="#fff" stroke="#000" strokeWidth="1.5" />}
              {vRes1m > 0 && <circle cx="230" cy={getResY(vRes1m)} r="4.5" fill="#fff" stroke="#000" strokeWidth="1.5" />}
              {vRes10m > 0 && <circle cx="370" cy={getResY(vRes10m)} r="5.5" fill="#fff" stroke="#000" strokeWidth="2" />}
            </svg>
          </div>
          <div className="legend-wrapper">
            <img src={legendResistencia} alt="Legenda Limites Mínimos" />
          </div>
        </div>

        <section className="normative-footer-notes">
          <p className="note-text-highlight description-text">
            <strong>Nota:</strong> De acordo com o item 12.2.2 da norma IEEE-43-2013 quando o índice de isolamento é superior a 5.000 MΩ (5,0GΩ) o valor de IA e IP é dispensável e o isolamento é considerado ótimo.
          </p>
          
          <div className="normative-final-desc">
            <h3>Referências de acordo com a norma IEEE-43-2013</h3>
            <p className="description-text">
              Os ensaios elétricos deste equipamento foram realizados conforme a norma IEEE 43:2013, referência internacional para medição e interpretação da condição do sistema isolante em máquinas elétricas girantes. Além da Resistência de Isolação, a avaliação considera o Índice de Absorção e o Índice de Polarização, parâmetros obtidos a partir de leituras em tempos padronizados durante o ensaio, que permitem analisar a evolução da resistência ao longo do tempo. Esses índices são amplamente utilizados para indicar a presença de umidade e contaminação, bem como para avaliar a estabilidade dielétrica do enrolamento e a sua condição geral de isolamento.
            </p>
          </div>
        </section>

      </main>
      <Footer pageNumber="13" unidade={osData?.unidade_nome} />
    </div>
  );
};