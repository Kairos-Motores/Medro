import React, { useState, useEffect } from 'react';

export const ProcessData = ({ data, onUpdate, isPrintMode }) => {
  const [localData, setLocalData] = useState({ ...(data || {}) });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalData({ ...(data || {}) });
  }, [data]);

  const handleChange = (field, value) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(updated);
    } else {
      console.warn("ProcessData: onUpdate prop is not a function or is undefined.");
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onUpdate && typeof onUpdate === 'function') {
      onUpdate(localData);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  const mappingFiliais = {
    '0101': 'Barcarena',
    '0102': 'São Luís',
    '0103': 'Parauapebas',
    '0104': 'São José dos Campos'
  };

  const nomeFilial = mappingFiliais[localData.cr4a1_zb6_filial] || 'Não Identificada';

  const dadosCliente = [
    { field: 'cr4a1_cliente_nome', label: 'CLIENTE' },
    { field: 'cr4a1_cliente_area', label: 'ÁREA' },
    { field: 'cr4a1_cliente_pedido', label: 'Nº PEDIDO' },
    { field: 'cr4a1_cliente_om', label: 'OM CLIENTE' },
    { field: 'cr4a1_cliente_ni', label: 'NI' },
    { field: 'cr4a1_cliente_mo', label: 'ME' },
    { field: 'cr4a1_cliente_mo2', label: 'MO', fallback: '' },
    { field: 'cr4a1_tag_cliente', label: 'TAG CLIENTE' },
    { field: 'cr4a1_nf_remessa', label: 'NF REMESSA' },
    { field: 'cr4a1_data_rec', label: 'RECEBIMENTO' },
    { field: 'cr4a1_contato_cli', label: 'CONTATO' },
    { field: 'cr4a1_resp_tecnico', label: 'RESP. TÉCNICO' },
    { field: 'cr4a1_elab_relat', label: 'ELABORADOR' },
    { field: 'cr4a1_data_relat', label: 'DATA RELATÓRIO' },
    { field: 'filial', label: 'UNIDADE', fallback: nomeFilial },
  ];

  const dadosEquipamento = [
    { field: 'cr4a1_tag_kairos', label: 'TAG KAIRÓS' },
    { field: 'cr4a1_eq_descricao', label: 'DESCRIÇÃO' },
    { field: 'cr4a1_eq_fabricante', label: 'FABRICANTE' },
    { field: 'cr4a1_eq_modelo', label: 'MODELO' },
    { field: 'cr4a1_eq_carcaca', label: 'CARCAÇA' },
    { field: 'cr4a1_eq_potencia_cv', label: 'POTÊNCIA' },
    { field: 'cr4a1_eq_tensao', label: 'TENSÃO' },
    { field: 'cr4a1_eq_corrente', label: 'CORRENTE' },
    { field: 'cr4a1_eq_rpm', label: 'RPM' },
    { field: 'cr4a1_eq_serie', label: 'N° SÉRIE' },
    { field: 'cr4a1_eq_polaridade', label: 'POLARIDADE', fallback: localData.cr4a1_eq_rpm },
    { field: 'cr4a1_eq_freq', label: 'FREQUÊNCIA' },
    { field: 'cr4a1_eq_fc', label: 'FC', fallback: localData.cr4a1_cliente_mo },
    { field: 'cr4a1_eq_isol', label: 'CLASSE ISOL.' },
    { field: 'cr4a1_eq_regime', label: 'REGIME' },
    { field: 'cr4a1_eq_categoria', label: 'CATEGORIA' },
    { field: 'cr4a1_eq_ip', label: 'IP', fallback: localData.cr4a1_eq_carcaca },
    { field: 'cr4a1_eq_peso', label: 'PESO' },
  ];

  const getValue = (field, fallback) => {
    if (localData[field] !== undefined && localData[field] !== null) return localData[field];
    return fallback !== undefined ? fallback : '---';
  };

  const renderTable = (items) => (
    <table className="report-table">
      <tbody>
        {items.map((item, i) => (
          <tr key={i}>
            <td className="td-label">{item.label}</td>
            <td className="td-value">
              {/* Em modo de impressão, sempre exibe texto; caso contrário, obedece ao botão Salvar */}
              {isPrintMode || isSaved ? (
                <span>{getValue(item.field, item.fallback)}</span>
              ) : (
                <input
                  className="editable-field"
                  value={getValue(item.field, item.fallback)}
                  onChange={(e) => handleChange(item.field, e.target.value)}
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <section className="process-data-block">
      <h1 className="page-title">DADOS DO PROCESSO</h1>
      <p className="os-label">OS Kairós: <strong>{localData.cr4a1_novacoluna}</strong></p>

      <div className="tables-container">
        <div className="table-column">
          <h2 className="table-header">Dados do Cliente</h2>
          {renderTable(dadosCliente)}
        </div>

        <div className="table-column">
          <h2 className="table-header">Dados do Equipamento</h2>
          {renderTable(dadosEquipamento)}
        </div>
      </div>

      {/* Botão de Salvar/Editar aparece apenas fora do modo de impressão */}
      {!isPrintMode && (
        <div className="save-controls" style={{ textAlign: 'center', marginTop: '10px' }}>
          {!isSaved ? (
            <button className="btn-save" onClick={handleSave}>
              💾 Salvar dados
            </button>
          ) : (
            <button className="btn-edit" onClick={handleEdit}>
              ✏️ Editar dados
            </button>
          )}
        </div>
      )}

      <div className="technical-footer-text">
        <p>
          O presente relatório tem por objetivo descrever, de forma técnica, as inspeções realizadas nas máquinas,
          abrangendo análises visuais, dimensionais e funcionais de seus principais componentes, com a finalidade
          de identificar eventuais não conformidades, desgastes e falhas em relação às condições normais de
          operação, bem como indicar os componentes que necessitam de intervenção corretiva e/ou preventiva;
          adicionalmente, são apresentadas recomendações técnicas destinadas a subsidiar o cliente na tomada de
          decisão quanto às ações de manutenção, recuperação ou substituição que se fizerem necessárias, com
          foco na confiabilidade operacional, na segurança e na preservação da vida útil do equipamento.
        </p>
      </div>
    </section>
  );
};