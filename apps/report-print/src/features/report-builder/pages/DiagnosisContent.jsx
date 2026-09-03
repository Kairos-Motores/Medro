import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CAMPOS_COM_IA } from '../utils/pagination';

// Card exibido ao passar o mouse sobre uma barra do gráfico de histórico de
// manutenção — mostra o ano e a quantidade de cada serviço realizado naquele
// ano, só para as séries com valor (evita listar "0" para todo serviço).
const ServicosTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  const itens = payload.filter((entry) => Number(entry.value) > 0);
  if (itens.length === 0) return null;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e5e5',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0,0,0,0.14)',
        padding: '10px 14px',
        minWidth: '140px',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '11px', marginBottom: '6px', color: '#1d1b16' }}>
        Ano {label}
      </div>
      {itens.map((entry) => (
        <div
          key={entry.dataKey}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', padding: '1px 0' }}
        >
          <span
            style={{ width: '8px', height: '8px', borderRadius: '2px', background: entry.color, flex: 'none' }}
          />
          <span style={{ color: '#555' }}>{entry.name}</span>
          <span style={{ fontWeight: 700, marginLeft: 'auto', color: '#1d1b16' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Recebe uma fatia já calculada por splitDiagnosisIntoPages (utils/pagination.js)
// em vez de decidir sozinho quais campos cabem na página — a decisão de quebra
// já foi tomada antes, com base no tamanho real do texto de cada campo.
export const DiagnosisContent = ({
  historyData, fieldsSlice, showChart, values, onValueChange, diagVisibility, onToggleField,
  onGenerateAI, iaGeneratingField,
  onGenerateAllAI, isGeneratingAll, isFirstSlice,
}) => {
  const algumaGeracaoEmAndamento = !!iaGeneratingField || isGeneratingAll;
  return (
    <div className="diagnosis-history-block">
      <div className="section-box">
        <div className="diag-section-header">
          <h1 className="item-title">1 DIAGNÓSTICO TÉCNICO DO EQUIPAMENTO</h1>
          {isFirstSlice && onGenerateAllAI && (
            <button
              type="button"
              className="no-print ia-generate-all-btn"
              onClick={onGenerateAllAI}
              disabled={algumaGeracaoEmAndamento}
              title="Descreva o problema uma vez e a IA preenche os 4 campos de uma vez, numa única chamada"
            >
              {isGeneratingAll ? '⏳ Gerando diagnóstico...' : '✨ Gerar diagnóstico completo com IA'}
            </button>
          )}
        </div>
        <div className="compact-grid">
          {fieldsSlice.map((item) => (
            <div key={item.id} className="diag-field">
              <div className="diag-field-header">
                <label>
                  {item.id} {item.label}
                  {item.isContinuation ? ' (continuação)' : ''}
                  {item.continues ? ' →' : ''}
                </label>
                {!item.isContinuation && onGenerateAI && CAMPOS_COM_IA.has(item.key) && (
                  <button
                    type="button"
                    className="no-print ia-generate-btn"
                    onClick={() => onGenerateAI(item.key, item.label)}
                    disabled={algumaGeracaoEmAndamento}
                    title="Gerar sugestão com IA só para este campo, a partir de um resumo seu"
                  >
                    {iaGeneratingField === item.key ? '⏳ Gerando...' : '✨ Gerar com IA'}
                  </button>
                )}
                {!item.isContinuation && (
                  <span
                    className="no-print field-visibility-toggle"
                    onClick={() => onToggleField(item.key)}
                    title={diagVisibility[item.key] ? 'Ocultar campo' : 'Mostrar campo'}
                  >
                    {diagVisibility[item.key] ? '👁️' : '👁️‍🗨️'}
                  </span>
                )}
              </div>

              {item.isContinuation ? (
                <p className="no-print text-display" style={{ color: '#999', fontStyle: 'italic' }}>
                  (continua da página anterior — edite no início do campo)
                </p>
              ) : (
                <textarea
                  className="no-print"
                  value={values[item.key]}
                  onChange={(e) => onValueChange({ ...values, [item.key]: e.target.value })}
                />
              )}
              <p className="print-only text-display">{item.text || "---"}</p>
            </div>
          ))}
        </div>
      </div>

      {showChart && (
        <div className="section-box">
          <h1 className="item-title">2 HISTÓRICO DE MANUTENÇÃO</h1>
          <div className="chart-area">
            {historyData && historyData.length > 0 ? (
              <BarChart width={600} height={180} data={historyData} margin={{ top: 5, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="ano" tick={{fontSize: 10}} />
                <YAxis tick={{fontSize: 10}} allowDecimals={false} />
                <Tooltip content={<ServicosTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Legend iconSize={10} wrapperStyle={{fontSize: '10px'}} />
                <Bar name="Outros" dataKey="OUTROS" fill="#3498DB" isAnimationActive={false} />
                <Bar name="Rebobinamento" dataKey="REBOBINAMENTO" fill="#E74C3C" isAnimationActive={false} />
                <Bar name="Rejuvenescimento" dataKey="REJUVENESCIMENTO" fill="#2ECC71" isAnimationActive={false} />
              </BarChart>
            ) : (
              <p className="no-data">Carregando histórico...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
