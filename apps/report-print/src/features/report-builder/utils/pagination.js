// utils/pagination.js
//
// Paginação por conteúdo real para a página de Diagnóstico, e cálculo de
// numeração de página acumulada para todo o relatório.
//
// Antes desse módulo, cada entrada de modelConfig.layout contava sempre como
// exatamente 1 página física (numeração = índice na lista + 1). Isso já era
// impreciso para qualquer seção que gerasse mais de uma página (ex.: fotos
// automáticas), e ficou insustentável para o Diagnóstico assim que os campos
// passaram a ter até ~150 linhas cada — um único campo pode, sozinho, precisar
// de várias páginas.

export const DIAG_ITEMS = [
  { id: '1.1', label: 'Histórico de falha', key: 'f1' },
  { id: '1.2', label: 'Principal falha apresentada', key: 'f2' },
  { id: '1.3', label: 'Causa provável da falha', key: 'f3' },
  { id: '1.4', label: 'Sintomas apresentados', key: 'f4' },
  { id: '1.5', label: 'Parecer Técnico', key: 'f5' },
  { id: '1.6', label: 'Conclusão', key: 'f6' },
  { id: '1.7', label: 'Recomendações', key: 'f7' },
  { id: '1.8', label: 'Observações', key: 'f8' },
];

// Campos do Diagnóstico que a IA pode ajudar a redigir — mapeamento definido
// na discussão de arquitetura da feature de IA/RAG (falha principal, sintomas,
// parecer técnico e conclusão; histórico/causa/recomendações/observações
// ficam de fora por serem mais factuais ou dependerem de dados que a IA não tem).
// Fonte única — reusado tanto pelo botão individual por campo quanto pelo
// botão "gerar tudo de uma vez" (App.jsx e DiagnosisContent.jsx).
export const CAMPOS_COM_IA = new Set(['f2', 'f4', 'f5', 'f6']);
export const DIAG_ITEMS_COM_IA = DIAG_ITEMS.filter(item => CAMPOS_COM_IA.has(item.key));

// --- Constantes calibradas contra o layout impresso real -------------------
// Fonte: frontend/src/styles/blocks/_diagnosis-history.scss (fonte/altura de
// linha dos campos) e frontend/src/styles/core/_layout.scss (dimensões da
// página A4, cabeçalho e rodapé). Se o estilo do relatório mudar, recalibrar
// aqui — ver Tarefa "Calibrar constantes" para o procedimento de verificação.
const MM_PER_PT = 0.352778;

const PAGE_CONTENT_HEIGHT_MM = 252; // 297mm - padding(10+10) - header(12+3) - footer(8) - margem do page-body(2)
const TITLE_HEIGHT_MM = 7.5;        // "1 DIAGNÓSTICO TÉCNICO DO EQUIPAMENTO" (item-title, 12pt + margem)
const GRID_MARGIN_BOTTOM_MM = 3;    // .compact-grid { margin-bottom: 3mm }
const CHART_SECTION_HEIGHT_MM = 57; // "2 HISTÓRICO DE MANUTENÇÃO" (só na 1ª página da seção)
const FIELD_LABEL_HEIGHT_MM = 4;    // label do campo (8pt) + margem
const FIELD_GAP_MM = 1.5;           // .compact-grid { gap: 1.5mm 0 }
const LINE_HEIGHT_MM = 8.5 * 1.2 * MM_PER_PT; // .diag-field p { font-size: 8.5pt; line-height: 1.2 }
const CHARS_PER_LINE = 115;         // ~180mm de largura útil / largura média de caractere a 8.5pt

// Quantas "linhas visuais" um texto vai ocupar, estimando quebra de linha por
// contagem de caracteres. Cada linha lógica (separada por \n) conta como pelo
// menos 1 linha visual, mais se for longa o suficiente para quebrar.
function countVisualLines(text) {
  const linhas = (text || '').split('\n');
  let total = 0;
  for (const linha of linhas) {
    total += Math.max(1, Math.ceil(linha.length / CHARS_PER_LINE));
  }
  return total || 1;
}

// Corta um texto nas primeiras `maxVisualLines` linhas visuais, sempre em uma
// fronteira de linha lógica (nunca no meio de uma linha). Devolve
// [parte, resto].
function takeVisualLines(text, maxVisualLines) {
  const linhas = (text || '').split('\n');
  let usadas = 0;
  let i = 0;
  for (; i < linhas.length; i++) {
    const linhaVisual = Math.max(1, Math.ceil(linhas[i].length / CHARS_PER_LINE));
    if (usadas > 0 && usadas + linhaVisual > maxVisualLines) break;
    usadas += linhaVisual;
    if (usadas >= maxVisualLines) { i++; break; }
  }
  return [linhas.slice(0, i).join('\n'), linhas.slice(i).join('\n')];
}

/**
 * Distribui os campos de diagnóstico (respeitando diagVisibility) em páginas,
 * cortando o texto de um campo entre páginas quando ele sozinho não cabe.
 *
 * Devolve um array de páginas; cada página é { fields, showChart }, onde
 * fields é a lista de fatias { id, key, label, text, isContinuation, continues }
 * a renderizar naquela página, e showChart indica se o gráfico de histórico
 * de manutenção deve aparecer nela (só a primeira página da seção).
 */
export function splitDiagnosisIntoPages(diagValues, diagVisibility) {
  const campos = DIAG_ITEMS.filter((item) => diagVisibility[item.key] !== false);
  if (campos.length === 0) return [{ fields: [], showChart: true }];

  const paginas = [];
  let paginaAtual = [];
  let alturaUsadaMm = 0;

  const espacoDisponivelMm = () => {
    let disponivel = PAGE_CONTENT_HEIGHT_MM - TITLE_HEIGHT_MM - GRID_MARGIN_BOTTOM_MM;
    if (paginas.length === 0) disponivel -= CHART_SECTION_HEIGHT_MM;
    return disponivel;
  };

  const fecharPagina = () => {
    paginas.push({ fields: paginaAtual, showChart: paginas.length === 0 });
    paginaAtual = [];
    alturaUsadaMm = 0;
  };

  for (const campo of campos) {
    let textoRestante = diagValues[campo.key] || '';
    let primeiroTrechoDoCampo = true;

    // Sempre entra pelo menos uma vez, mesmo com texto vazio (o rótulo do
    // campo precisa aparecer em algum lugar).
    do {
      const gapMm = paginaAtual.length > 0 ? FIELD_GAP_MM : 0;
      const espacoParaTextoMm = espacoDisponivelMm() - alturaUsadaMm - gapMm - FIELD_LABEL_HEIGHT_MM;
      let linhasQueCabem = Math.max(0, Math.floor(espacoParaTextoMm / LINE_HEIGHT_MM));
      // Página vazia sempre aceita pelo menos 1 linha — evita loop infinito
      // se as constantes de calibração ficarem erradas no futuro.
      if (paginaAtual.length === 0) linhasQueCabem = Math.max(1, linhasQueCabem);

      if (linhasQueCabem <= 0) {
        fecharPagina();
        continue;
      }

      const cabeInteiro = countVisualLines(textoRestante) <= linhasQueCabem;
      const [parte, resto] = cabeInteiro ? [textoRestante, ''] : takeVisualLines(textoRestante, linhasQueCabem);

      paginaAtual.push({
        id: campo.id,
        key: campo.key,
        label: campo.label,
        text: parte,
        isContinuation: !primeiroTrechoDoCampo,
        continues: resto.length > 0,
      });
      alturaUsadaMm += gapMm + FIELD_LABEL_HEIGHT_MM + countVisualLines(parte) * LINE_HEIGHT_MM;
      textoRestante = resto;
      primeiroTrechoDoCampo = false;

      if (resto.length > 0) fecharPagina();
    } while (textoRestante.length > 0);
  }

  if (paginaAtual.length > 0) fecharPagina();
  return paginas;
}

/**
 * Número de páginas físicas que cada entrada de modelConfig.layout vai gerar,
 * replicando a mesma regra que renderDynamicPage usa para decidir entre
 * AutoPaginate e renderização de página única — mas usada ANTES da
 * renderização, para calcular a numeração acumulada corretamente.
 */
export function computeLayoutPageCounts(layout, { freePageBlocks, customTableRows, diagnosisPageCount }) {
  const counts = {};
  for (const page of layout) {
    if (page.type === 'PageDiagnosisAndHistory') {
      counts[page.id] = diagnosisPageCount;
    } else if (page.type === 'PageBuilder') {
      const total = (freePageBlocks[page.id] || []).length;
      counts[page.id] = total > 3 ? Math.ceil(total / 3) : 1;
    } else if (page.type === 'PageMotorElectric') {
      const total = (page.keys || []).length;
      counts[page.id] = total > 2 ? Math.ceil(total / 2) : 1;
    } else if (page.type === 'PageCustomTable') {
      const total = (customTableRows[page.id]?.rows || []).length;
      counts[page.id] = total > 10 ? Math.ceil(total / 10) : 1;
    } else {
      counts[page.id] = 1;
    }
  }
  return counts;
}

/** Número inicial de página física de cada entrada, a partir da contagem acumulada. */
export function computeStartingPageNumbers(layout, pageCounts) {
  const starts = {};
  let running = 1;
  for (const page of layout) {
    starts[page.id] = running;
    running += pageCounts[page.id] || 1;
  }
  return starts;
}
