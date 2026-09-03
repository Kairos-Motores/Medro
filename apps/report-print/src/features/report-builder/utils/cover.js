// utils/cover.js
import capaStandard from '../../../assets/capa_padrao.jpg';
import capaAlternativa from '../../../assets/nossos_servicos.jpg';

// Mesma regra de resolução de capa usada em PageCover.jsx, extraída para ser
// reaproveitada em qualquer lugar que precise de uma miniatura (álbum de
// modelos do técnico, catálogo do cliente) sem duplicar a lógica.
export function resolveCoverImage(modelConfig) {
  if (modelConfig?.capaAtiva === 'custom' && modelConfig?.customCoverUrl) {
    return modelConfig.customCoverUrl;
  }
  switch (modelConfig?.capaAtiva) {
    case 'cliente_azul':
      return capaAlternativa;
    case 'padrao':
    default:
      return capaStandard;
  }
}
