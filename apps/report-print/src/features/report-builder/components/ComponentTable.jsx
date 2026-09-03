import React from 'react';

export const ComponentTable = ({ title, data = {}, onUpdate, col1Label = "Ø", col2Label = "Batimento" }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="comp-table-isolated">
      <table className="pure-component-table">
        <colgroup>
          <col style={{ width: '22%' }} />
          <col style={{ width: '22%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          {/* LINHA 1: Título mesclado em todas as colunas */}
          <tr>
            <th colSpan="6" className="table-main-title">{title}</th>
          </tr>
          {/* LINHA 2: Cabeçalhos exatos da imagem */}
          <tr className="table-sub-headers">
            <th>{col1Label}</th>
            <th>{col2Label}</th>
            <th>Tolerância</th>
            <th>Excedente</th>
            <th colSpan="2" className="no-bottom-border"></th>
          </tr>
        </thead>
        <tbody>
          {/* LINHA 3: Inputs e Botões de Aprovação */}
          <tr>
            <td className="phi-cell">
              <input 
                className="no-print input-red" 
                value={data.phi || ""} 
                onChange={(e) => handleChange('phi', e.target.value)}
              />
              <span className="print-only red-text-bold">{data.phi || "---"}</span>
            </td>
            <td>
              <input className="no-print" value={data.batimento || ""} onChange={(e) => handleChange('batimento', e.target.value)} />
              <p className="print-only">{data.batimento || "---"}</p>
            </td>
            <td>
              <input className="no-print" value={data.toler || ""} onChange={(e) => handleChange('toler', e.target.value)} />
              <p className="print-only">{data.toler || "---"}</p>
            </td>
            <td>
              <input className="no-print" value={data.exced || ""} onChange={(e) => handleChange('exced', e.target.value)} />
              <p className="print-only">{data.exced || "---"}</p>
            </td>
            
            {/* Lógica de SIM / NÃO exata da imagem */}
            <td 
              className={`action-btn sim-btn ${data.approvedX === 'X' ? 'active-sim' : ''}`}
              onClick={() => handleChange('approvedX', 'X')}
            >
              SIM
            </td>
            <td 
              className={`action-btn nao-btn ${data.approvedX === 'N' ? 'active-nao' : ''}`}
              onClick={() => handleChange('approvedX', 'N')}
            >
              NÃO
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};