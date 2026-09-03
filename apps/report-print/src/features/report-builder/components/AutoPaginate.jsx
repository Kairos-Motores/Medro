// src/features/report-builder/components/AutoPaginate.jsx
import React from 'react';
import { PaginatedPage } from './PaginatedPage';

export const AutoPaginate = ({
  items,
  maxItems,
  PageContentComponent,
  startPageNumber,
  baseId,
  pageTitle,
  unidade,
  cliente,
  isPrintMode,
  // outras props específicas do conteúdo
  ...rest
}) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += maxItems) {
    chunks.push(items.slice(i, i + maxItems));
  }

  return chunks.map((chunk, index) => {
    const pageNum = String(startPageNumber + index).padStart(2, '0');
    return (
      <PaginatedPage
        key={`${baseId}-${index}`}
        pageNumber={pageNum}
        title={pageTitle}
        unidade={unidade}
        cliente={cliente}
      >
        <PageContentComponent
          chunk={chunk}
          pageIndex={startPageNumber + index}
          chunkIndex={index}
          chunkStart={index * maxItems}
          isFirstChunk={index === 0}
          isLastChunk={index === chunks.length - 1}
          isPrintMode={isPrintMode}
          {...rest}
        />
      </PaginatedPage>
    );
  });
};