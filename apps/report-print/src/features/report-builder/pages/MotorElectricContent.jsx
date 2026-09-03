// src/features/report-builder/pages/MotorElectricContent.jsx
import React from 'react';
import { PhotoReportBlock } from '../blocks/PhotoReportBlock';

export const MotorElectricContent = ({ data, sections, onUpdate, pageKeys, cliente, unidade, chunk, isPrintMode, isViewerMode }) => {
  const sectionKey = chunk[0]; // chunk contém uma única chave (ex.: 'p7_block1')
  const sectionData = sections[sectionKey] || { evidences: ["", "", ""], services: ["", "", ""] };

  return (
    <PhotoReportBlock
      osId={data.cr4a1_novacoluna}
      sectionKey={sectionKey}
      title="RELATÓRIO FOTOGRÁFICO"
      data={sectionData}
      onUpdate={onUpdate}
      cliente={cliente}
      unidade={unidade}
      isPrintMode={isPrintMode}
      isViewerMode={isViewerMode} // Repassando a propriedade
    />
  );
};