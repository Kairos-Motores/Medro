import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { PageCover } from './PageCover';
import { PageBackCover } from './PageBackCover';
import { PageOurServices } from './PageOurServices';
import { PageSummary } from './PageSummary';
import { PageProcessData } from './PageProcessData';
import { PageMotorElectric } from './PageMotorElectric';
import { PageMechanicalEvaluation } from './PageMechanicalEvaluation';
import { PageBearingEvaluation } from './PageBearingEvaluation';
import { PageComponentsEvaluation } from './PageComponentsEvaluation';
import { PageResistanceTests } from './PageResistanceTests';
import { PageNormativeReferences } from './PageNormativeReferences';
import { PageStaticTestsDescription } from './PageStaticTestsDescription';
import { PageCustomTable } from './PageCustomTable';
import { PageBalanceamento } from './PageBalanceamento';
import { PageFinal } from './PageFinal';
import { PageEditableText } from './PageEditableText';
import { PageImageBlock } from './PageImageBlock';
import { PageBuilder } from './PageBuilder';
import { BuilderContent } from './BuilderContent';
import { DiagnosisContent } from './DiagnosisContent';
import { PaginatedPage } from '../components/PaginatedPage';
import { splitDiagnosisIntoPages, computeLayoutPageCounts, computeStartingPageNumbers } from '../utils/pagination';
import { API_BASE_URL } from '../../../config';

const LoadingScreen = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontFamily: "'Montserrat', sans-serif", background: '#fdf8f6',
  }}>
    <div style={{ fontSize: '24px', fontWeight: 600, color: '#1d1b16', marginBottom: '20px' }}>
      Abrindo relatório
      <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.2, repeat: Infinity }}>.</motion.span>
      <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}>.</motion.span>
      <motion.span animate={{ opacity: [0,1,0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}>.</motion.span>
    </div>
  </div>
);

export const ClientReportViewer = () => {
  const { osId } = useParams();
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') || 'padrao';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [osData, setOsData] = useState(null);
  const [reportState, setReportState] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('kairos_token');
        const res = await fetch(`${API_BASE_URL}/cliente/relatorio/${osId}?tipo=${tipo}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Erro ao carregar relatório');
        const data = await res.json();
        setOsData(data.osData);
        setReportState(data.snapshot);
        toast.success('Relatório carregado com sucesso!');
      } catch (err) {
        console.error(err);
        toast.error('Não foi possível carregar o relatório.');
        navigate('/cliente/catalogo');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [osId, tipo, navigate]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSummaryNavigate = (pageId) => {
    const element = document.getElementById(pageId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem('kairos_token');
      const response = await fetch(`${API_BASE_URL}/cliente/relatorio/${osId}/pdf?tipo=${tipo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Falha na geração do PDF');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Relatorio_${osId}_${tipo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Erro ao gerar PDF. Tente novamente.');
    }
  };

  const uniqueLayout = useMemo(() => {
    if (!reportState?.modelConfig?.layout) return [];
    const seenIds = new Set();
    return reportState.modelConfig.layout.map((page, index) => {
      let uniqueId = page.id;
      if (seenIds.has(uniqueId)) {
        uniqueId = `${page.id}_${index}`;
        while (seenIds.has(uniqueId)) uniqueId = `${page.id}_${index}_${Math.random().toString(36).substr(2, 5)}`;
      }
      seenIds.add(uniqueId);
      return { ...page, id: uniqueId };
    });
  }, [reportState]);

  const motorSections = reportState?.motorSections || {};
  const freePageBlocks = reportState?.freePageBlocks || {};
  const customTableRows = reportState?.customTableRows || {};
  const diagValues = reportState?.diagValues || {};
  const diagVisibility = reportState?.diagVisibility || {};

  // Mesma lógica de paginação usada no construtor (App.jsx) — precisa ser
  // idêntica aqui, senão o cliente vê uma numeração/quebra de página diferente
  // da que o técnico viu ao montar o relatório.
  const diagnosisPageSlices = useMemo(
    () => splitDiagnosisIntoPages(diagValues, diagVisibility),
    [reportState]
  );
  const layoutPageCounts = useMemo(
    () => computeLayoutPageCounts(uniqueLayout, {
      freePageBlocks,
      customTableRows,
      diagnosisPageCount: diagnosisPageSlices.length,
    }),
    [uniqueLayout, reportState, diagnosisPageSlices]
  );
  const startingPageNumbers = useMemo(
    () => computeStartingPageNumbers(uniqueLayout, layoutPageCounts),
    [uniqueLayout, layoutPageCounts]
  );

  if (loading) return <LoadingScreen />;
  if (!reportState || !reportState.modelConfig) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
        <p>Relatório não encontrado ou incompleto.</p>
      </div>
    );
  }

  const modelConfig = { ...reportState.modelConfig, layout: uniqueLayout };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: '#f5f6f8', minHeight: '100vh' }} className="viewer-mode">
      {/* Estilo injetado para esconder controles de edição e mostrar conteúdo de impressão */}
      <style>{`
        .viewer-mode .no-print { display: none !important; }
        .viewer-mode .print-only { display: block !important; }
        /* Mantém botões específicos clicáveis (eles não têm .no-print) */
        .viewer-mode .btn-pdf, .viewer-mode .scroll-top-fab { pointer-events: auto !important; }
      `}</style>

      <Toaster position="top-right" toastOptions={{
        style: { borderRadius: '16px', background: '#f7f2ef', color: '#1d1b16', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
        success: { iconTheme: { primary: '#2e7d32', secondary: '#fff' } },
        error: { iconTheme: { primary: '#d32f2f', secondary: '#fff' } },
      }} />

      {/* Header do cliente */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100, margin: '0 auto', borderRadius: '0 0 16px 16px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1d1b16', margin: 0 }}>Relatório Técnico</h1>
          <p style={{ fontSize: '12px', color: '#807671', margin: '4px 0 0' }}>OS: {osId} ({tipo})</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleDownloadPDF} style={{ padding: '8px 20px', background: '#1d1b16', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: "'Montserrat', sans-serif" }}>📄 Baixar PDF</button>
          <button onClick={() => navigate('/cliente/catalogo')} style={{ padding: '8px 20px', background: 'transparent', color: '#1d1b16', border: '1px solid #807671', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', fontSize: '13px', fontFamily: "'Montserrat', sans-serif" }}>← Voltar</button>
        </div>
      </div>

      <main className="report-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        <AnimatePresence>
          {uniqueLayout.flatMap((page, index) => {
            const startNum = startingPageNumbers[page.id] ?? index + 1;

            // Seções que podem gerar mais de uma página física: cada uma
            // devolve um array de { key, content } em vez de um único elemento.
            if (page.type === 'PageDiagnosisAndHistory') {
              return diagnosisPageSlices.map((slice, i) => ({
                key: `page-${page.id}-${i}`,
                id: i === 0 ? page.id : undefined,
                content: (
                  <PaginatedPage
                    pageNumber={String(startNum + i).padStart(2, '0')}
                    title={page.title || 'DIAGNÓSTICO E HISTÓRICO'}
                    unidade={osData?.unidade_nome}
                    cliente={osData?.cr4a1_cliente_nome}
                  >
                    <DiagnosisContent
                      historyData={reportState.historyData || []}
                      fieldsSlice={slice.fields}
                      showChart={slice.showChart}
                      values={diagValues}
                      onValueChange={() => {}}
                      diagVisibility={diagVisibility}
                      onToggleField={() => {}}
                    />
                  </PaginatedPage>
                ),
              }));
            }

            if (page.type === 'PageCustomTable') {
              const rows = customTableRows[page.id]?.rows || [['', '']];
              if (rows.length > 10) {
                const paginas = [];
                for (let i = 0; i < rows.length; i += 10) paginas.push([i, Math.min(i + 10, rows.length)]);
                return paginas.map(([start, end], i) => ({
                  key: `page-${page.id}-${i}`,
                  id: i === 0 ? page.id : undefined,
                  content: (
                    <PaginatedPage
                      pageNumber={String(startNum + i).padStart(2, '0')}
                      title={page.title || 'TABELA PERSONALIZADA'}
                      unidade={osData?.unidade_nome}
                      cliente={osData?.cr4a1_cliente_nome}
                    >
                      <PageCustomTable
                        id={page.id}
                        headers={reportState.tableHeaders?.[page.id] || ["Coluna 1", "Coluna 2"]}
                        columns={reportState.tableColumns?.[page.id] || null}
                        rows={rows}
                        tableTitle={reportState.customTableRows?.[page.id]?.title || ''}
                        hasSubColumns={reportState.tableSubColumns?.[page.id] !== false}
                        osData={osData}
                        isPrintMode={true}
                        isInsideBuilder={true}
                        displayRowRange={[start, end]}
                        showColumnControls={i === 0}
                        showAddRowButton={false}
                      />
                    </PaginatedPage>
                  ),
                }));
              }
            }

            if (page.type === 'PageBuilder') {
              const blocks = freePageBlocks[page.id] || [];
              if (blocks.length > 3) {
                const paginas = [];
                for (let i = 0; i < blocks.length; i += 3) paginas.push(blocks.slice(i, i + 3));
                return paginas.map((chunk, i) => ({
                  key: `page-${page.id}-${i}`,
                  id: i === 0 ? page.id : undefined,
                  content: (
                    <PaginatedPage
                      pageNumber={String(startNum + i).padStart(2, '0')}
                      title={page.title || 'PÁGINA LIVRE'}
                      unidade={osData?.unidade_nome}
                      cliente={osData?.cr4a1_cliente_nome}
                    >
                      <BuilderContent blocks={chunk} onBlockChange={() => {}} isPrintMode={true} isViewerMode={true} />
                    </PaginatedPage>
                  ),
                }));
              }
            }

            const uniqueKey = `page-${page.id}-${index}`;
            const pageNumStr = String(startNum).padStart(2, '0');
            const pageContent = (() => {
              switch (page.type) {
                case 'PageCover': return <PageCover modelConfig={modelConfig} />;
                case 'PageBackCover': return <PageBackCover />;
                case 'PageOurServices': return <PageOurServices />;
                case 'PageSummary': return <PageSummary unidade={osData?.unidade_nome || "São Luís"} pageNumber={pageNumStr} pages={uniqueLayout} pageNumbers={startingPageNumbers} onNavigate={handleSummaryNavigate} osData={osData || {}} isPrintMode={true} />;
                case 'PageProcessData': return <PageProcessData data={osData || {}} pageNumber={pageNumStr} isPrintMode={true} />;
                case 'PageMotorElectric': {
                  const keys = page.keys || [];
                  const sections = {};
                  keys.forEach(key => {
                    sections[key] = {
                      evidences: ["", "", ""],
                      services: ["", "", ""],
                      photos: [null, null, null],
                      ...(motorSections[key] || {})
                    };
                  });
                  return (
                    <PageMotorElectric
                      key={page.id}
                      data={osData || {}}
                      sections={sections}
                      pageKeys={keys}
                      pageNumber={pageNumStr}
                      cliente={osData?.cr4a1_cliente_nome}
                      unidade={osData?.unidade_nome}
                      isPrintMode={true}
                      isViewerMode={true}
                      onUpdate={() => {}}
                    />
                  );
                }
                case 'PageMechanicalEvaluation': return <PageMechanicalEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} mechData={reportState.mechData || {}} pageNumber={pageNumStr} isPrintMode={true} onUpdate={() => {}} />;
                case 'PageBearingEvaluation': return <PageBearingEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} mechData={reportState.mechData || {}} pageNumber={pageNumStr} isPrintMode={true} onUpdate={() => {}} />;
                case 'PageComponentsEvaluation': return <PageComponentsEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} p11Data={reportState.p11Data || {}} pageNumber={pageNumStr} isPrintMode={true} onUpdate={() => {}} />;
                case 'PageResistanceTests': return <PageResistanceTests unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} resistanceData={reportState.resistanceData || {}} pageNumber={pageNumStr} isPrintMode={true} onUpdate={() => {}} />;
                case 'PageNormativeReferences': return <PageNormativeReferences unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} normativeData={reportState.normativeData || {}} pageNumber={pageNumStr} isPrintMode={true} onUpdate={() => {}} />;
                case 'PageStaticTestsDescription': return <PageStaticTestsDescription unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} osData={osData || {}} pageNumber={pageNumStr} isPrintMode={true} />;
                case 'PageEditableText': return <PageEditableText unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} id={page.id} pageNumber={pageNumStr} data={reportState.textBlocks?.[page.id] || {}} isPrintMode={true} />;
                case 'PageImageBlock': return <PageImageBlock unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} id={page.id} pageNumber={pageNumStr} photoUrl={reportState.imageBlocks?.[page.id]} isPrintMode={true} />;
                case 'PageCustomTable': return <PageCustomTable id={page.id} pageNumber={pageNumStr} headers={reportState.tableHeaders?.[page.id] || ["Coluna 1", "Coluna 2"]} columns={reportState.tableColumns?.[page.id] || null} rows={reportState.customTableRows?.[page.id]?.rows || [['', '']]} tableTitle={reportState.customTableRows?.[page.id]?.title || ''} hasSubColumns={reportState.tableSubColumns?.[page.id] !== false} osData={osData} isPrintMode={true} />;
                case 'PageBuilder': return <PageBuilder unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} id={page.id} pageNumber={pageNumStr} blocks={reportState.freePageBlocks?.[page.id] || []} isPrintMode={true} />;
                case 'PageBalanceamento': return <PageBalanceamento data={osData || {}} pageNumber={pageNumStr} balanceData={reportState.balanceData} isPrintMode={true} />;
                case 'PageFinal': return <PageFinal />;
                default: return null;
              }
            })();

            return [{ key: uniqueKey, id: page.id, content: pageContent }];
          }).map(({ key, id, content }) => (
            <motion.div key={key} id={id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} style={{ scrollMarginTop: '80px' }}>
              {content}
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            style={{ position: 'fixed', bottom: '24px', right: '24px', width: '48px', height: '48px', borderRadius: '50%', background: '#f0f2f5', color: '#d32f2f', border: '1px solid rgba(128,118,113,0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', cursor: 'pointer', zIndex: 1000 }}
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Voltar ao topo"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};