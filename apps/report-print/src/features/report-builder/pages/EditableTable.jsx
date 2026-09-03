import React from 'react';
import { AutoPaginate } from '../components/AutoPaginate';

export const EditableTable = ({ headers, setHeaders, rows, setRows }) => {
  const addRow = () => setRows([...rows, Array(headers.length).fill("")]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));

  const updateHeader = (idx, val) => {
    const newHeaders = [...headers];
    newHeaders[idx] = val;
    setHeaders(newHeaders);
  };

  const updateCell = (rIdx, cIdx, val) => {
    const newRows = [...rows];
    newRows[rIdx][cIdx] = val;
    setRows(newRows);
  };

  return (
    <AutoPaginate
    items={keys}
    pageComponent={MechanicalPageInternal}
    maxItems={4}
    startPageNumber={Number(pageNumber)}
    baseId={id}
    headers={headers}
    setHeaders={setHeaders}
    rows={rows}
    setRows={setRows}
    updateHeader={updateHeader}
    updateCell={updateCell}
    addRow={addRow}
    removeRow={removeRow}
    >

    <div className="editable-table-container">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                <input value={h} onChange={(e) => updateHeader(i, e.target.value)} style={{ fontWeight: 'bold' }} />
              </th>
            ))}
            <th className="no-print">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>
                  <input value={cell} onChange={(e) => updateCell(rIdx, cIdx, e.target.value)} />
                </td>
              ))}
              <td className="no-print">
                <button onClick={() => removeRow(rIdx)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="no-print" onClick={addRow}>+ Linha</button>
    </div>
    </AutoPaginate >
  );
};