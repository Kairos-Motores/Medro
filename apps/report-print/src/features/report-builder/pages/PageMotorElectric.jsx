import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { PhotoReportBlock } from '../blocks/PhotoReportBlock';

export const PageMotorElectric = ({ data, sections, onUpdate, pageKeys, pageNumber, cliente, unidade, isPrintMode, isViewerMode }) => {
  const b1Key = pageKeys?.[0];
  const b2Key = pageKeys?.[1];

  const b1Data = sections?.[b1Key] || { evidences: ["", "", ""], services: ["", "", ""], photos: [null, null, null] };
  const b2Data = sections?.[b2Key] || { evidences: ["", "", ""], services: ["", "", ""], photos: [null, null, null] };

  return (
    <div className="page a4-page">
      <Header unidade={unidade} cliente={cliente} />
      <main className="page-body">
        <PhotoReportBlock
          osId={data.cr4a1_novacoluna}
          sectionKey={b1Key}
          title="RELATÓRIO FOTOGRÁFICO"
          data={b1Data}
          onUpdate={onUpdate}
          cliente={cliente}
          unidade={unidade} 
          isPrintMode={isPrintMode}
          isViewerMode={isViewerMode}
        />
        <PhotoReportBlock
          osId={data.cr4a1_novacoluna}
          sectionKey={b2Key}
          title="RELATÓRIO FOTOGRÁFICO"
          data={b2Data}
          onUpdate={onUpdate}
          cliente={cliente}
          unidade={unidade} 
          isPrintMode={isPrintMode}
          isViewerMode={isViewerMode}
        />
      </main>
      <Footer pageNumber={pageNumber} unidade={unidade || "São Luís"} />
    </div>
  );
};