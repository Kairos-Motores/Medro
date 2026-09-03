import React, { useState, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const PageCustomTable = ({
  id,
  pageNumber,
  columns,
  setColumns,
  headers,
  setHeaders,
  rows,
  setRows,
  isInsideBuilder,
  osData,
  tableTitle,
  setTableTitle,
  hasSubColumns,
  setHasSubColumns,
  isPrintMode,
  displayRowRange,
  showColumnControls = true,
  showAddRowButton = true,
}) => {
  // Referência para controlar se a mudança é interna
  const isInternalUpdate = useRef(false);

  const isPrintModeFinal = isPrintMode || new URLSearchParams(window.location.search).get('print') === 'true';

  // Inicialização do estado interno
  const [internalCols, setInternalCols] = useState(() => {
    if (columns && columns.length > 0) return columns;
    if (headers && headers.length > 0) {
      return headers.map((h) => ({
        title: typeof h === 'string' ? h : h.title || 'Coluna',
        subColumns: hasSubColumns !== false ? (h.subColumns || ['Sub1']) : [],
      }));
    }
    return [{ title: 'Col1', subColumns: hasSubColumns !== false ? ['Sub1'] : [] }];
  });

  // Sincronização SOMENTE quando as props mudam externamente
  useEffect(() => {
    // Ignora se a mudança foi causada por uma atualização interna
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    // Se columns foi fornecido (objeto completo), use-o
    if (columns && columns.length > 0) {
      setInternalCols(columns);
      return;
    }

    // Se headers foi fornecido (array de strings), converta
    if (headers && headers.length > 0) {
      setInternalCols(
        headers.map((h) => ({
          title: typeof h === 'string' ? h : h.title || 'Coluna',
          subColumns: hasSubColumns !== false ? (h.subColumns || ['Sub1']) : [],
        }))
      );
    }
  }, [columns, headers, hasSubColumns]);

  // Autocorreção: tabelas salvas por versões antigas (com o bug de
  // colunas/subcolunas dessincronizando as linhas) podem ter `rows` com
  // um número de células diferente do número de colunas atuais. Sempre
  // que isso for detectado, normaliza as linhas (preenche ou corta) em
  // vez de deixar a tabela renderizada torta.
  useEffect(() => {
    const totalCells = internalCols.reduce(
      (sum, col) => sum + (hasSubColumns !== false ? (col.subColumns.length || 1) : 1),
      0
    );
    const needsFix = rows.some((row) => row.length !== totalCells);
    if (!needsFix) return;
    setRows(
      rows.map((row) => {
        if (row.length === totalCells) return row;
        if (row.length < totalCells) return [...row, ...Array(totalCells - row.length).fill('')];
        return row.slice(0, totalCells);
      })
    );
  }, [internalCols, hasSubColumns, rows, setRows]);

  // Função para notificar o pai de mudanças internas
  const notifyParent = (newCols) => {
    isInternalUpdate.current = true;
    if (setColumns) {
      setColumns(newCols);
    } else if (setHeaders) {
      setHeaders(newCols.map((c) => c.title));
    }
  };

  // As demais funções permanecem EXATAMENTE como na última versão estável,
  // apenas chamando notifyParent ao final.

  const toggleSubColumns = () => {
    const newHasSub = !hasSubColumns;
    if (setHasSubColumns) setHasSubColumns(newHasSub);
    const newCols = internalCols.map((col) => ({
      ...col,
      subColumns: newHasSub ? (col.subColumns.length > 0 ? col.subColumns : ['Sub1']) : [],
    }));
    setInternalCols(newCols);
    notifyParent(newCols);
    const totalCells = newCols.reduce((sum, col) => sum + (newHasSub ? (col.subColumns.length || 1) : 1), 0);
    const newRows = rows.map((row) => {
      if (row.length === totalCells) return row;
      if (row.length < totalCells) return [...row, ...Array(totalCells - row.length).fill('')];
      return row.slice(0, totalCells);
    });
    setRows(newRows);
  };

  const getAbsoluteIndex = (colIndex, subIndex, cols = internalCols) => {
    let absIdx = 0;
    for (let i = 0; i < colIndex; i++) {
      absIdx += cols[i].subColumns.length || 1;
    }
    return absIdx + subIndex;
  };

  const handleAddMainColumn = () => {
    const newCols = [
      ...internalCols,
      {
        title: `Coluna ${internalCols.length + 1}`,
        subColumns: hasSubColumns !== false ? ['Sub 1'] : [],
      },
    ];
    setInternalCols(newCols);
    notifyParent(newCols);
    setRows(rows.map((row) => [...row, '']));
  };

  const handleRemoveMainColumn = (colIndex) => {
    if (internalCols.length <= 1) return;
    const count = internalCols[colIndex].subColumns.length || 1;
    const start = getAbsoluteIndex(colIndex, 0);
    const newCols = internalCols.filter((_, i) => i !== colIndex);
    setInternalCols(newCols);
    notifyParent(newCols);
    const newRows = rows.map((row) => {
      const newRow = [...row];
      newRow.splice(start, count);
      return newRow;
    });
    setRows(newRows);
  };

  const handleAddSubColumn = (colIndex) => {
    const newSubColumns = [
      ...internalCols[colIndex].subColumns,
      `Sub ${internalCols[colIndex].subColumns.length + 1}`,
    ];
    const newCols = internalCols.map((col, i) =>
      i === colIndex ? { ...col, subColumns: newSubColumns } : col
    );
    setInternalCols(newCols);
    notifyParent(newCols);
    const insertIdx = getAbsoluteIndex(colIndex, newSubColumns.length - 1, newCols);
    setRows(
      rows.map((row) => {
        const newRow = [...row];
        newRow.splice(insertIdx, 0, '');
        return newRow;
      })
    );
  };

  const handleRemoveSubColumn = (colIndex, subIndex) => {
    // Nunca deixa uma coluna sem nenhuma subcoluna: isso quebrava o alinhamento
    // do cabeçalho (a coluna principal continuava ocupando 1 espaço, mas a
    // linha de subcabeçalhos ficava sem célula, deslocando as seguintes).
    if ((internalCols[colIndex].subColumns.length || 1) <= 1) return;
    const removeIdx = getAbsoluteIndex(colIndex, subIndex, internalCols);
    const newCols = internalCols.map((col, i) =>
      i === colIndex ? { ...col, subColumns: col.subColumns.filter((_, j) => j !== subIndex) } : col
    );
    setInternalCols(newCols);
    notifyParent(newCols);
    const newRows = rows.map((row) => {
      const newRow = [...row];
      newRow.splice(removeIdx, 1);
      return newRow;
    });
    setRows(newRows);
  };

  const updateMainHeader = (colIndex, value) => {
    const newCols = internalCols.map((col, i) => (i === colIndex ? { ...col, title: value } : col));
    setInternalCols(newCols);
    notifyParent(newCols);
  };

  const updateSubHeader = (colIndex, subIndex, value) => {
    const newCols = internalCols.map((col, i) =>
      i === colIndex
        ? { ...col, subColumns: col.subColumns.map((s, j) => (j === subIndex ? value : s)) }
        : col
    );
    setInternalCols(newCols);
    notifyParent(newCols);
  };

  const handleAddRow = () => {
    const totalCells = internalCols.reduce(
      (sum, col) => sum + (hasSubColumns !== false ? (col.subColumns.length || 1) : 1),
      0
    );
    setRows([...rows, Array(totalCells).fill('')]);
  };

  const handleRemoveRow = (rowIndex) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex, cellIndex, value) => {
    const newRows = rows.map((row, i) =>
      i === rowIndex ? row.map((c, j) => (j === cellIndex ? value : c)) : row
    );
    setRows(newRows);
  };

  // Quando a tabela é dividida em várias páginas (ver AutoPaginate em App.jsx),
  // displayRowRange restringe quais linhas aparecem nesta página, mas os índices
  // usados em updateCell/handleRemoveRow continuam sendo os do array `rows` completo.
  const visibleRows = displayRowRange
    ? rows
        .map((row, i) => [i, row])
        .slice(displayRowRange[0], displayRowRange[1])
    : rows.map((row, i) => [i, row]);

  const containerClass = isInsideBuilder ? 'builder-block-content' : 'page a4-page';
  const mainStyle = isInsideBuilder
    ? { padding: '5mm 0', width: '100%', overflowX: 'auto' }
    : { padding: '15mm' };

  return (
    <div className={containerClass}>
      {!isInsideBuilder && (
        <Header
          unidade={osData?.unidade_nome}
          cliente={osData?.cr4a1_cliente_nome}
          titulo="TABELA PERSONALIZADA"
        />
      )}

      <main className={isInsideBuilder ? '' : 'page-body'} style={mainStyle}>
        {tableTitle && tableTitle.trim() !== '' && (
          <h3 style={{ textAlign: 'center', margin: '0 0 10px' }}>{tableTitle}</h3>
        )}

        {isInsideBuilder && !isPrintMode && showColumnControls && (
          <div className="table-title-container" style={{ marginBottom: '10px' }}>
            <input
              value={tableTitle || ''}
              onChange={(e) => setTableTitle && setTableTitle(e.target.value)}
              placeholder="Título da tabela (opcional)"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '12pt',
                fontWeight: 'bold',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </div>
        )}

        {!isPrintMode && (showColumnControls || showAddRowButton) && (
          <div
            className="table-controls"
            style={{
              marginBottom: '15px',
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '10px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {showAddRowButton && (
                <button onClick={handleAddRow} style={btnStyle('#00a859')}>
                  + Adicionar Linha
                </button>
              )}
              {showColumnControls && (
                <button onClick={handleAddMainColumn} style={btnStyle('#0056b3')}>
                  + Adicionar Coluna
                </button>
              )}
              {showColumnControls && (
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '10px',
                    marginLeft: 'auto',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={hasSubColumns !== false}
                    onChange={toggleSubColumns}
                  />
                  Subcolunas
                </label>
              )}
            </div>

            {showColumnControls && hasSubColumns !== false && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {internalCols.map((col, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#e0e0e0',
                      padding: '8px',
                      borderRadius: '6px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '5px',
                      }}
                    >
                      <span style={{ fontSize: '10px', fontWeight: 'bold' }}>
                        Col {i + 1}
                      </span>
                      <button
                        onClick={() => handleRemoveMainColumn(i)}
                        style={btnStyle('#d32f2f')}
                      >
                        X
                      </button>
                    </div>
                    {col.subColumns.map((sub, j) => (
                      <div
                        key={j}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginLeft: '10px',
                          marginTop: '3px',
                        }}
                      >
                        <span style={{ fontSize: '9px' }}>↳ Sub {j + 1}</span>
                        {col.subColumns.length > 1 && (
                          <button
                            onClick={() => handleRemoveSubColumn(i, j)}
                            style={btnStyle('#d32f2f')}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddSubColumn(i)}
                      style={btnStyle('#1976d2')}
                    >
                      + Sub
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '10pt',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <thead>
            <tr>
              {internalCols.map((col, i) => (
                <th
                  key={i}
                  colSpan={
                    hasSubColumns !== false ? col.subColumns.length || 1 : 1
                  }
                  style={{
                    border: '1px solid #333',
                    padding: '5px',
                    background: '#e8e8e8',
                    textAlign: 'center',
                  }}
                >
                  {isPrintMode ? (
                    <span style={{ fontWeight: 'bold' }}>{col.title}</span>
                  ) : (
                    <input
                      value={col.title}
                      onChange={(e) => updateMainHeader(i, e.target.value)}
                      style={{
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        fontWeight: 'bold',
                        textAlign: 'center',
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
            {hasSubColumns !== false && (
              <tr>
                {internalCols.flatMap((col, i) =>
                  col.subColumns.map((sub, j) => (
                    <th
                      key={`${i}-${j}`}
                      style={{
                        border: '1px solid #333',
                        padding: '5px',
                        background: '#f5f5f5',
                        textAlign: 'center',
                      }}
                    >
                      {isPrintMode ? (
                        <span style={{ fontWeight: 'bold', fontSize: '9pt' }}>
                          {sub}
                        </span>
                      ) : (
                        <input
                          value={sub}
                          onChange={(e) => updateSubHeader(i, j, e.target.value)}
                          style={{
                            width: '100%',
                            border: 'none',
                            background: 'transparent',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: '9pt',
                          }}
                        />
                      )}
                    </th>
                  ))
                )}
              </tr>
            )}
          </thead>
          <tbody>
            {visibleRows.map(([i, row]) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ border: '1px solid #333', padding: '5px' }}>
                    {isPrintMode ? (
                      <span style={{ whiteSpace: 'pre-wrap' }}>{cell}</span>
                    ) : (
                      <textarea
                        value={cell}
                        onChange={(e) => updateCell(i, j, e.target.value)}
                        style={{
                          width: '100%',
                          border: 'none',
                          resize: 'vertical',
                          minHeight: '30px',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                        }}
                      />
                    )}
                  </td>
                ))}
                {!isPrintMode && (
                  <td
                    style={{
                      border: 'none',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }}
                  >
                    <button
                      onClick={() => handleRemoveRow(i)}
                      style={btnStyle('#d32f2f')}
                    >
                      X
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      {!isInsideBuilder && <Footer pageNumber={pageNumber} />}
    </div>
  );
};

const btnStyle = (bgColor) => ({
  padding: '5px 10px',
  background: bgColor,
  color: '#fff',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  fontSize: '10px',
});