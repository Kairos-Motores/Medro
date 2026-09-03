// src/features/report-builder/blocks/Summary.jsx
import React from 'react';

export const Summary = ({ pages = [], pageNumbers = {}, onNavigate, onTitleChange, isPrintMode }) => {
  const summaryItems = pages
    .filter(page => page.id !== 'cover' && page.id !== 'back_cover')
    .map((page, index) => ({
      id: page.id,
      label: page.title || page.type.replace('Page', ''),
      pageNumber: String(pageNumbers[page.id] ?? index + 1).padStart(2, '0')
    }));

  return (
    <section className="summary-block">
      <h1 className="summary-title">SUMÁRIO</h1>
      <div className="summary-list">
        {summaryItems.map((item) => (
          <div key={item.id} className="summary-item clickable">
            {/* Modo edição (apenas fora do print) */}
            {!isPrintMode ? (
              <input
                className="summary-item-input"
                value={item.label}
                onChange={(e) => onTitleChange && onTitleChange(item.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Editar título de ${item.label}`}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: '600',
                  color: '#1d1b16',
                  width: '100%',
                  outline: 'none',
                  borderBottom: '1px dashed transparent',
                  padding: '2px 0',
                }}
                onFocus={(e) => e.target.style.borderBottomColor = '#d32f2f'}
                onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
              />
            ) : (
              <span className="label">{item.label}</span>
            )}

            {/* Área clicável para navegação */}
            <span
              className="dots"
              onClick={() => onNavigate && onNavigate(item.id)}
              style={{ flex: 1, cursor: 'pointer' }}
            ></span>
            <span
              className="page-num"
              onClick={() => onNavigate && onNavigate(item.id)}
              style={{ cursor: 'pointer' }}
            >
              {item.pageNumber}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};