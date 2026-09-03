import React from 'react';

export const EditableText = ({ content, onChange }) => {
  return (
    <div className="editable-block-text">
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite seu texto aqui..."
        style={{ width: '100%', minHeight: '50px', border: '1px solid #ccc', padding: '10px' }}
      />
    </div>
  );
};