import React from 'react';

export const MechanicalTable = ({ title, data = {}, onUpdate }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="mech-table-container">
      <table className="mechanical-tech-table">
        <thead>
          {/* LINHA 1: TÍTULO E Ø */}
          <tr className="main-header">
            <th className="cell-phi-label">Ø</th>
            <th className="cell-phi-value">
              <input 
                className="no-print input-red" 
                value={data.phi || ""} 
                onChange={(e) => handleChange('phi', e.target.value)}
              />
              <span className="print-only red-text">{data.phi || "xx"}</span>
              <span className="unit">mm</span>
            </th>
            <th className="cell-title-gray" colSpan="3">
              {title}
            </th>
          </tr>
          {/* LINHA 2: SUB-CABEÇALHOS */}
          <tr className="sub-header">
            <th style={{ width: '25%' }}>Interferência</th>
            <th style={{ width: '25%' }}>Tolerância</th>
            <th style={{ width: '20%' }}>Excedente</th>
            <th style={{ width: '30%' }} colSpan="2">Aprovado</th>
          </tr>
        </thead>
        <tbody>
          {/* LINHA 3: DADOS */}
          <tr>
            <td>
              <input className="no-print" value={data.interf || ""} onChange={(e) => handleChange('interf', e.target.value)} />
              <p className="print-only">{data.interf || "---"}</p>
            </td>
            <td>
              <input className="no-print" value={data.toler || ""} onChange={(e) => handleChange('toler', e.target.value)} />
              <p className="print-only">{data.toler || "---"}</p>
            </td>
            <td>
              <input className="no-print" value={data.exced || ""} onChange={(e) => handleChange('exced', e.target.value)} />
              <p className="print-only">{data.exced || "---"}</p>
            </td>
            <td className="cell-mark-x">
              {data.approvedX === 'X' || data.approvedX === 'N' ? 'X' : ''}
            </td>
            <td className="cell-labels-stack">
              <div 
                className={`label-item sim ${data.approvedX === 'X' ? 'active-sim' : ''}`}
                onClick={() => handleChange('approvedX', 'X')}
              >SIM</div>
              <div 
                className={`label-item nao ${data.approvedX === 'N' ? 'active-nao' : ''}`}
                onClick={() => handleChange('approvedX', 'N')}
              >NÃO</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};