import React from 'react';

const PhotoItem = ({ url, nome }) => (
  <div className="photo-item">
    <div className="image-container">
      <img src={url} alt={nome} />
    </div>
    <p className="caption">{nome}</p>
  </div>
);

const PhotoSection = ({ titulo, fotos }) => {
  if (!fotos || fotos.length === 0) return null;

  return (
    <section className="report-section photo-section page-break">
      <div className="section-header">
        <h2>{titulo}</h2>
      </div>
      
      <div className="photo-grid">
        {fotos.map((foto) => (
          <PhotoItem key={foto.id} url={foto.url} nome={foto.nome} />
        ))}
      </div>
    </section>
  );
};

export default PhotoSection;