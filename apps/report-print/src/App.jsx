import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './styles/main.scss';

import { LoginScreen } from './features/report-builder/components/LoginScreen';
import { AutoPaginate } from '../src/features/report-builder/components/AutoPaginate';
import { ClientCatalog } from './features/report-builder/pages/ClientCatalog';
import { ClientReportViewer } from './features/report-builder/pages/ClientReportViewer';

import { PageCover } from './features/report-builder/pages/PageCover';
import { resolveCoverImage } from './features/report-builder/utils/cover';
import { PageBackCover } from './features/report-builder/pages/PageBackCover';
import { PageOurServices } from './features/report-builder/pages/PageOurServices';
import { PageSummary } from './features/report-builder/pages/PageSummary';
import { PageProcessData } from './features/report-builder/pages/PageProcessData';
import { PageMotorElectric } from './features/report-builder/pages/PageMotorElectric';
import { PageMechanicalEvaluation } from './features/report-builder/pages/PageMechanicalEvaluation';
import { PageBearingEvaluation } from './features/report-builder/pages/PageBearingEvaluation';
import { PageComponentsEvaluation } from './features/report-builder/pages/PageComponentsEvaluation';
import { PageResistanceTests } from './features/report-builder/pages/PageResistanceTests';
import { PageNormativeReferences } from './features/report-builder/pages/PageNormativeReferences';
import { PageStaticTestsDescription } from './features/report-builder/pages/PageStaticTestsDescription';
import { PageCustomTable } from './features/report-builder/pages/PageCustomTable';
import { PageBalanceamento } from './features/report-builder/pages/PageBalanceamento';
import { PageFinal } from './features/report-builder/pages/PageFinal';
import { PageEditableText } from './features/report-builder/pages/PageEditableText';
import { PageImageBlock } from './features/report-builder/pages/PageImageBlock';
import { PageBuilder } from './features/report-builder/pages/PageBuilder';

import { BuilderContent } from './features/report-builder/pages/BuilderContent';
import { DiagnosisContent } from './features/report-builder/pages/DiagnosisContent';
import { MotorElectricContent } from './features/report-builder/pages/MotorElectricContent';
import { PaginatedPage } from './features/report-builder/components/PaginatedPage';
import { splitDiagnosisIntoPages, computeLayoutPageCounts, computeStartingPageNumbers, DIAG_ITEMS_COM_IA } from './features/report-builder/utils/pagination';
import { API_BASE_URL } from './config';

function App() {
  // === Autenticação (unificada) ===
  const [auth, setAuth] = useState(() => {
    const savedRole = localStorage.getItem('kairos_role');
    const savedToken = localStorage.getItem('kairos_token');
    const savedLogin = localStorage.getItem('kairos_login');
    if (savedRole && savedToken) {
      return {
        isAuthenticated: true,
        role: savedRole,
        token: savedToken,
        userName: savedLogin || ''
      };
    }
    return { isAuthenticated: false, role: null, token: null, userName: '' };
  });

  // === Estados do relatório ===
  const [osInput, setOsInput] = useState('');
  const [osData, setOsData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [photos, setPhotos] = useState({});
  const [peritagemAutoImported, setPeritagemAutoImported] = useState(false);
  const [fotosAutoImportTrigger, setFotosAutoImportTrigger] = useState(0);
  const [isSincronizandoFotos, setIsSincronizandoFotos] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  // Modo "prévia embutida": o módulo Gerador de Laudos do Medro carrega este
  // bundle num iframe (?print=true&embed=1) e empurra o estado do rascunho por
  // postMessage — sem nenhuma chamada à API (evita CORS) e sem a interface
  // antiga (toolbar, FABs). Só a folha A4 do laudo é renderizada.
  const isEmbed =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === '1';

  const [balanceData, setBalanceData] = useState(null);
  const [progresso, setProgresso] = useState(0);
  const [mensagemProgresso, setMensagemProgresso] = useState('');
  const [templatesAlbum, setTemplatesAlbum] = useState([]);
  const [newModelName, setNewModelName] = useState('');
  // Modelo do álbum usado para montar o laudo atual — precisa sobreviver ao
  // save/load do rascunho porque é ele que diz qual prompt/chave de IA usar
  // ao gerar texto no Diagnóstico (a config de IA vive no modelo, não na OS).
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [customTableRows, setCustomTableRows] = useState({});
  const [tableHeaders, setTableHeaders] = useState({});
  const [tableColumns, setTableColumns] = useState({});
  const [tableSubColumns, setTableSubColumns] = useState({});
  const [textBlocks, setTextBlocks] = useState({});
  const [imageBlocks, setImageBlocks] = useState({});
  const [freePageBlocks, setFreePageBlocks] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recentOs, setRecentOs] = useState(() => {
    try {
      const saved = localStorage.getItem('kairos_recent_os');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [pdfHistory, setPdfHistory] = useState([]);
  const [diagVisibility, setDiagVisibility] = useState({
    f1: true, f2: true, f3: true, f4: true,
    f5: true, f6: true, f7: true, f8: true,
  });

  const toggleDiagField = (fieldKey) => {
    setDiagVisibility(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };

  const addToRecentOs = (osNumber) => {
    if (!osNumber) return;
    setRecentOs(prev => {
      const filtered = prev.filter(item => item !== osNumber);
      const updated = [osNumber, ...filtered].slice(0, 5);
      localStorage.setItem('kairos_recent_os', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentOs = () => {
    setRecentOs([]);
    localStorage.removeItem('kairos_recent_os');
  };

  const fetchPdfHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/historico-pdf`);
      if (res.ok) {
        const data = await res.json();
        setPdfHistory(data);
      }
    } catch (e) {
      console.error('Erro ao buscar histórico:', e);
    }
  };

  const [modelConfig, setModelConfig] = useState({
    capaAtiva: 'padrao',
    customCoverUrl: null,
    layout: [
      { id: 'cover', type: 'PageCover', title: 'Capa' },
      { id: 'back_cover', type: 'PageBackCover', title: 'Contracapa' },
      { id: 'our_services', type: 'PageOurServices', title: 'Nossos Serviços' },
      { id: 'summary', type: 'PageSummary', title: 'Resumo do Equipamento' },
      { id: 'process_data', type: 'PageProcessData', title: 'Dados de Processo' },
      { id: 'diagnosis', type: 'PageDiagnosisAndHistory', title: 'Diagnóstico e Histórico' },
      { id: 'motor_p7', type: 'PageMotorElectric', title: 'Relatório Fotográfico P07', keys: ['p7_block1', 'p7_block2'] },
      { id: 'motor_p8', type: 'PageMotorElectric', title: 'Relatório Fotográfico P08', keys: ['p8_block1', 'p8_block2'] },
      { id: 'mechanical', type: 'PageMechanicalEvaluation', title: 'Avaliação Mecânica' },
      { id: 'bearing', type: 'PageBearingEvaluation', title: 'Avaliação de Mancais' },
      { id: 'components', type: 'PageComponentsEvaluation', title: 'Componentes Auxiliares' },
      { id: 'resistance', type: 'PageResistanceTests', title: 'Ensaios de Resistência' },
      { id: 'normative', type: 'PageNormativeReferences', title: 'Referências Normativas' },
      { id: 'static_desc', type: 'PageStaticTestsDescription', title: 'Descrição dos Ensaios' },
      { id: 'custom_table_default', type: 'PageCustomTable', title: 'Tabela Livre Customizada' },
      { id: 'balanceamento', type: 'PageBalanceamento', title: 'Balanceamento Dinâmico' },
      { id: 'final', type: 'PageFinal', title: 'Encerramento' }
    ]
  });

  const [motorSections, setMotorSections] = useState({
    p7_block1: { evidences: ["", "", ""], services: ["", "", ""] },
    p7_block2: { evidences: ["", "", ""], services: ["", "", ""] },
    p8_block1: { evidences: ["", "", ""], services: ["", "", ""] },
    p8_block2: { evidences: ["", "", ""], services: ["", "", ""] },
  });

  const [diagValues, setDiagValues] = useState({ f1: "", f2: "", f3: "", f4: "", f5: "", f6: "", f7: "", f8: "" });
  const [mechData, setMechData] = useState({
    batimento_la: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    batimento_loa: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    ponta_la: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    ponta_loa: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    assento_la: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    assento_loa: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    cubo_la: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
    cubo_loa: { phi: "", interf: "", toler: "", exced: "", approvedX: "", photo: null },
  });
  const [p11Data, setP11Data] = useState({
    instruments: [
      { name: "Relógio comparador (batimento)", nr: "", date: "" },
      { name: "Relógio comparador de diâmetro", nr: "", date: "" },
      { name: "Micrômetro externo", nr: "", date: "" },
      { name: "", nr: "", date: "" }, { name: "", nr: "", date: "" }, { name: "", nr: "", date: "" },
    ],
    rolamentos: { desc: "Refer.", qty: "1", replace: "X" },
    vedacao: { desc: "Realizamos a substituição de todas as vedações de forma preventiva...", replace: "X" },
    auxiliar: { desc: "Refer.", qty: "1", replace: "X" }
  });
  const [resistanceData, setResistanceData] = useState({
    medicao30s: "", medicao1m: "", medicao10m: "", ia: "", ip: "",
    statusIsolacao: "Aprovado", qtdCabos: "3", faseRS: "", faseRT: "", faseST: "",
    variacaoDelta: "", statusOhmica: "Aprovado"
  });
  const [normativeData, setNormativeData] = useState({
    ia_30s: "", ia_60s: "", ip_1m: "", ip_10m: "", res_30s: "", res_1m: "", res_10m: ""
  });

  // Handlers de update
  const updateMotorData = (key, newData) => setMotorSections(prev => ({ ...prev, [key]: newData }));
  const updateMechData = (key, newData) => setMechData(prev => ({ ...prev, [key]: newData }));
  const updateP11Data = (key, value) => setP11Data(prev => ({ ...prev, [key]: value }));
  const updateResistanceData = (field, value) => setResistanceData(prev => ({ ...prev, [field]: value }));
  const updateNormativeData = (field, value) => setNormativeData(prev => ({ ...prev, [field]: value }));

  // --- Automação de fotos da peritagem (mapeamento por nome de arquivo no SharePoint) ---
  const gerarBlocoDeFotos = (fatia) => ({
    evidences: [0, 1, 2].map((j) => fatia[j]?.evidencia || ''),
    services: [0, 1, 2].map((j) => fatia[j]?.servicos || ''),
    photoNames: [0, 1, 2].map((j) => fatia[j]?.itemDescricao || ''),
    photos: [0, 1, 2].map((j) => (fatia[j] ? [{ id: fatia[j].id, nome: fatia[j].nome, url: fatia[j].url }] : null)),
  });

  // Distribui a lista já ordenada/sequencial de fotos em blocos de 3 (2 blocos = 1 página,
  // igual ao layout existente do relatório fotográfico). Usa primeiro as páginas fixas
  // P07/P08; se sobrarem fotos, cria páginas extras automaticamente.
  const aplicarFotosAutomaticas = (itensFotos) => {
    if (!itensFotos || itensFotos.length === 0) {
      setPeritagemAutoImported(true);
      return;
    }

    const paginasFotos = [];
    for (let i = 0; i < itensFotos.length; i += 6) {
      paginasFotos.push(itensFotos.slice(i, i + 6));
    }

    const chavesFixasPorPagina = [
      ['p7_block1', 'p7_block2'],
      ['p8_block1', 'p8_block2'],
    ];

    const novasSections = {};
    const paginasExtras = [];

    paginasFotos.forEach((fotosPagina, pageIdx) => {
      const blocoA = gerarBlocoDeFotos(fotosPagina.slice(0, 3));
      const blocoB = gerarBlocoDeFotos(fotosPagina.slice(3, 6));

      if (pageIdx < chavesFixasPorPagina.length) {
        const [chaveA, chaveB] = chavesFixasPorPagina[pageIdx];
        novasSections[chaveA] = blocoA;
        novasSections[chaveB] = blocoB;
      } else {
        const extraIdx = pageIdx - chavesFixasPorPagina.length;
        const chaveA = `peritagem_auto_${extraIdx}_block1`;
        const chaveB = `peritagem_auto_${extraIdx}_block2`;
        novasSections[chaveA] = blocoA;
        novasSections[chaveB] = blocoB;
        paginasExtras.push({
          id: `peritagem_auto_${extraIdx}`,
          type: 'PageMotorElectric',
          title: `Relatório Fotográfico (Peritagem) ${extraIdx + 3}`,
          keys: [chaveA, chaveB],
        });
      }
    });

    setMotorSections(prev => ({ ...prev, ...novasSections }));

    if (paginasExtras.length > 0) {
      setModelConfig(prev => {
        const idxP8 = prev.layout.findIndex(pg => pg.id === 'motor_p8');
        const novoLayout = [...prev.layout];
        const posInsercao = idxP8 >= 0 ? idxP8 + 1 : novoLayout.length;
        novoLayout.splice(posInsercao, 0, ...paginasExtras);
        return { ...prev, layout: novoLayout };
      });
    }

    setPeritagemAutoImported(true);
    setFotosAutoImportTrigger(t => t + 1);
  };

  // Busca e aplica o mapeamento automático de fotos para a OS informada.
  const sincronizarFotosPeritagem = async (osId, unidade, cliente) => {
    if (!osId || !unidade || !cliente) return;
    try {
      const url = `${API_BASE_URL}/os/${osId}/peritagem-fotos?unidade=${encodeURIComponent(unidade)}&cliente=${encodeURIComponent(cliente)}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.exists && json.itens?.length > 0) {
        aplicarFotosAutomaticas(json.itens);
        if (json.naoReconhecidos?.length > 0) {
          console.warn('Fotos de peritagem com nome não reconhecido (ignoradas):', json.naoReconhecidos);
        }
      } else {
        setPeritagemAutoImported(true);
      }
    } catch (e) {
      console.error('Erro ao sincronizar fotos de peritagem:', e);
    }
  };

  const handleSincronizarFotosManual = async () => {
    if (!osData?.cr4a1_novacoluna) return;
    setIsSincronizandoFotos(true);
    try {
      await sincronizarFotosPeritagem(osData.cr4a1_novacoluna, osData.unidade_nome, osData.cr4a1_cliente_nome);
      toast.success('Fotos da peritagem sincronizadas.');
    } finally {
      setIsSincronizandoFotos(false);
    }
  };

  // Salva o rascunho assim que o auto-import de fotos roda pela primeira vez para uma OS,
  // para que a marcação "já importado" (e as fotos aplicadas) sobrevivam a um recarregamento
  // mesmo que o técnico ainda não tenha clicado em "Gerar PDF".
  useEffect(() => {
    if (fotosAutoImportTrigger === 0) return;
    if (!osData?.cr4a1_novacoluna || isPrintMode) return;
    fetch(`${API_BASE_URL}/rascunho`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        osId: osData.cr4a1_novacoluna,
        state: {
          osData: JSON.parse(JSON.stringify(osData)),
          historyData: JSON.parse(JSON.stringify(historyData)),
          photos: JSON.parse(JSON.stringify(photos)),
          balanceData: JSON.parse(JSON.stringify(balanceData)),
          modelConfig, customTableRows, tableHeaders, tableColumns, tableSubColumns,
          textBlocks, imageBlocks, freePageBlocks,
          diagValues, motorSections, mechData, p11Data, resistanceData, normativeData,
          diagVisibility, peritagemAutoImported: true, activeTemplateId,
        }
      })
    }).catch(e => console.error('Erro ao salvar rascunho após auto-import de fotos:', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fotosAutoImportTrigger]);

  const handleTitleChange = (pageId, newTitle) => {
    setModelConfig(prev => ({
      ...prev,
      layout: prev.layout.map(p =>
        p.id === pageId ? { ...p, title: newTitle } : p
      )
    }));
  };

  // Wrapper para ações com progresso
  const withProgress = async (etapas) => {
    setIsLoading(true);
    setProgresso(0);
    let blobResult = null;

    for (const etapa of etapas) {
      setMensagemProgresso(etapa.mensagem);
      setProgresso(etapa.progresso);
      try {
        const result = await etapa.acao();
        if (etapa.id === 'gerar-pdf') {
          blobResult = result;
        }
      } catch (e) {
        console.error(e);
        toast.error(`Erro: ${e.message || 'Falha desconhecida'}`);
        setIsLoading(false);
        setProgresso(0);
        setMensagemProgresso('');
        return;
      }
    }

    setIsLoading(false);
    setProgresso(0);
    setMensagemProgresso('');
    return blobResult;
  };

  // Reordenação de páginas
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(modelConfig.layout);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setModelConfig(prev => ({ ...prev, layout: items }));
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === 'true') {
      console.log('Modo impressão ativado');
      setIsPrintMode(true);
      setAuth(prev => ({ ...prev, role: 'admin', isAuthenticated: true }));
      setIsAdminMode(false);
    }
  }, []);

  useEffect(() => {
    const savedRole = localStorage.getItem('kairos_role');
    const savedToken = localStorage.getItem('kairos_token');
    if (savedRole && savedToken) {
      setAuth(prev => ({ ...prev, role: savedRole, isAuthenticated: true }));
      if (savedRole === 'tecnico') setIsAdminMode(false);
    }
    const savedLogin = localStorage.getItem('kairos_login');
    if (savedLogin && savedLogin !== 'undefined') {
      setAuth(prev => ({ ...prev, userName: savedLogin }));
    }
    if (localStorage.getItem('kairos_login') === 'undefined') {
      localStorage.removeItem('kairos_login');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // No worker de PDF não há histórico obrigatório nem localStorage: assim que
    // a OS estiver carregada, marca pronto (com folga para as imagens).
    if (isPrintMode && osData && osData.cr4a1_novacoluna) {
      const timer = setTimeout(() => {
        window.reportIsReady = true;
        setIsReady(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isPrintMode, osData, historyData]);

  // Prévia embutida: recebe o estado inteiro do rascunho do Medro por
  // postMessage e reidrata os mesmos setters que o loadFullData usa a partir do
  // snapshot — em tempo real, a cada tecla no editor, sem tocar na API.
  useEffect(() => {
    if (!isEmbed) return;
    const onMsg = (e) => {
      const msg = e.data;
      if (!msg || msg.type !== 'laudo:preview' || !msg.state) return;
      const s = msg.state;
      if (s.osData) setOsData(s.osData);
      if (s.historyData) setHistoryData(s.historyData);
      if (s.photos) setPhotos(s.photos);
      if ('balanceData' in s) setBalanceData(s.balanceData);
      if (s.modelConfig?.layout) {
        const correctedLayout = s.modelConfig.layout.map((page, index) => ({
          ...page,
          id:
            page.id +
            (s.modelConfig.layout.filter((p) => p.id === page.id).length > 1 ? `_${index}` : ''),
        }));
        setModelConfig({ ...s.modelConfig, layout: correctedLayout });
      }
      if (s.customTableRows) setCustomTableRows(s.customTableRows);
      if (s.tableHeaders) setTableHeaders(s.tableHeaders);
      if (s.tableColumns) setTableColumns(s.tableColumns);
      if (s.tableSubColumns) setTableSubColumns(s.tableSubColumns);
      if (s.textBlocks) setTextBlocks(s.textBlocks);
      if (s.imageBlocks) setImageBlocks(s.imageBlocks);
      if (s.freePageBlocks) setFreePageBlocks(s.freePageBlocks);
      if (s.diagValues) setDiagValues(s.diagValues);
      if (s.motorSections) setMotorSections(s.motorSections);
      if (s.mechData) setMechData(s.mechData);
      if (s.p11Data) setP11Data(s.p11Data);
      if (s.resistanceData) setResistanceData(s.resistanceData);
      if (s.normativeData) setNormativeData(s.normativeData);
      if (s.diagVisibility) setDiagVisibility(s.diagVisibility);
      setIsLoading(false);
      setIsReady(true);
      window.reportIsReady = true;
    };
    window.addEventListener('message', onMsg);
    // avisa o Medro que o iframe já pode receber o estado
    try {
      window.parent?.postMessage({ type: 'laudo:preview-ready' }, '*');
    } catch (_) {}
    return () => window.removeEventListener('message', onMsg);
  }, [isEmbed]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter' && osData && isReady && !isLoading && !isPrintMode) {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [osData, isReady, isLoading, isPrintMode]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.role === 'admin') {
      fetchPdfHistory();
    }
  }, [auth.isAuthenticated, auth.role]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // Callback do LoginScreen
  const handleLogin = (userData) => {
    setAuth({
      isAuthenticated: true,
      role: userData.role,
      token: userData.token,
      userName: userData.userName
    });
    if (userData.role === 'tecnico') setIsAdminMode(false);
    else setIsAdminMode(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('kairos_role');
    localStorage.removeItem('kairos_token');
    localStorage.removeItem('kairos_login');
    clearRecentOs();
    setAuth({ isAuthenticated: false, role: null, token: null, userName: '' });
    setOsData(null);
    setIsReady(false);
    toast.success('Sessão encerrada.');
  };

  const handleOsSearch = () => {
    if (osInput.trim()) {
      loadFullData(osInput.trim());
    }
  };

  const handleOsKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleOsSearch();
    }
  };

  const handleAddBlockToPage = (pageId, blockType) => {
    setFreePageBlocks(prev => ({
      ...prev,
      [pageId]: [...(prev[pageId] || []), { id: Date.now(), type: blockType, data: {} }]
    }));
    toast.success(`Bloco "${blockType}" adicionado.`);
  };

  const handleBlockUpdate = (pageId, blockId, newData) => {
    setFreePageBlocks(prev => ({
      ...prev,
      [pageId]: prev[pageId].map(b => b.id === blockId ? { ...b, data: newData } : b)
    }));
  };

  const handleDeletePage = (pageId) => {
    if (pageId === 'cover' || pageId === 'final') {
      toast.error('A Capa e o Encerramento não podem ser removidos.');
      return;
    }
    setModelConfig(prev => ({ ...prev, layout: prev.layout.filter(p => p.id !== pageId) }));
    toast.success('Página removida.');
  };

  const handleAddPage = (type) => {
    const timestampId = `dynamic_${Date.now()}`;
    let titleStr = type.replace('Page', '');
    if (type === 'PageBuilder') titleStr = 'Página Livre';
    if (type === 'PageMotorElectric') titleStr = 'Relatório Fotográfico';
    let newPageObj = { id: timestampId, type: type, title: titleStr };
    if (type === 'PageMotorElectric') newPageObj.keys = [`${timestampId}_b1`, `${timestampId}_b2`];
    setModelConfig(prev => {
      const updatedLayout = [...prev.layout];
      updatedLayout.splice(updatedLayout.length - 1, 0, newPageObj);
      return { ...prev, layout: updatedLayout };
    });
    toast.success(`"${titleStr}" adicionada.`);
    setTimeout(() => {
      const el = document.getElementById(timestampId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await withProgress([
      {
        mensagem: 'Enviando capa...', progresso: 50, acao: async () => {
          const formData = new FormData();
          formData.append('capa', file);
          const res = await fetch(`${API_BASE_URL}/upload-capa`, { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            setModelConfig(prev => ({ ...prev, capaAtiva: 'custom', customCoverUrl: data.url }));
            toast.success('Capa carregada com sucesso!');
          } else {
            throw new Error(data.error || 'Falha no upload');
          }
        }
      }
    ]);
  };

  const fetchTemplatesAlbum = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/modelos`);
      if (res.ok) setTemplatesAlbum(await res.json());
    } catch (e) { console.error("Erro ao ler Dataverse:", e); }
  };

  useEffect(() => {
    if (isEmbed) return; // prévia embutida: estado vem por postMessage, nada de API
    if (auth.isAuthenticated) {
      fetchTemplatesAlbum();
      const params = new URLSearchParams(window.location.search);
      const osId = params.get('os');
      if (osId) { setOsInput(osId); loadFullData(osId); }
    }
  }, [auth.isAuthenticated]);

  const loadFullData = async (osId) => {
    setIsLoading(true);
    setIsReady(false);
    const printMode = new URLSearchParams(window.location.search).get('print') === 'true';
    const toastId = !printMode ? toast.loading('Buscando dados da OS...') : null;
    try {
      const snapRes = await fetch(`${API_BASE_URL}/rascunho/${osId}`);
      let snapshotData = null;
      if (snapRes.ok) {
        snapshotData = await snapRes.json();
        // 🔥 Correção de IDs duplicados ao carregar do snapshot
        if (snapshotData.modelConfig) {
          const correctedLayout = snapshotData.modelConfig.layout.map((page, index) => ({
            ...page,
            id: page.id + (snapshotData.modelConfig.layout.filter(p => p.id === page.id).length > 1 ? `_${index}` : '')
          }));
          setModelConfig({ ...snapshotData.modelConfig, layout: correctedLayout });
        }
        if (snapshotData.customTableRows) setCustomTableRows(snapshotData.customTableRows);
        if (snapshotData.tableHeaders) setTableHeaders(snapshotData.tableHeaders);
        if (snapshotData.tableColumns) setTableColumns(snapshotData.tableColumns);
        if (snapshotData.tableSubColumns) setTableSubColumns(snapshotData.tableSubColumns);
        if (snapshotData.textBlocks) setTextBlocks(snapshotData.textBlocks);
        if (snapshotData.imageBlocks) setImageBlocks(snapshotData.imageBlocks);
        if (snapshotData.freePageBlocks) setFreePageBlocks(snapshotData.freePageBlocks);
        if (snapshotData.diagValues) setDiagValues(snapshotData.diagValues);
        if (snapshotData.motorSections) setMotorSections(snapshotData.motorSections);
        if (snapshotData.mechData) setMechData(snapshotData.mechData);
        if (snapshotData.p11Data) setP11Data(snapshotData.p11Data);
        if (snapshotData.resistanceData) setResistanceData(snapshotData.resistanceData);
        if (snapshotData.normativeData) setNormativeData(snapshotData.normativeData);
        if (snapshotData.balanceData) setBalanceData(snapshotData.balanceData);
        if (snapshotData.diagVisibility) setDiagVisibility(snapshotData.diagVisibility);
        setActiveTemplateId(snapshotData.activeTemplateId || null);
        setPeritagemAutoImported(!!snapshotData.peritagemAutoImported);
      } else {
        setActiveTemplateId(null);
        setPeritagemAutoImported(false);
      }

      if (printMode) {
        const savedPrintState = localStorage.getItem('kairos_print_state_' + osId);
        if (savedPrintState) {
          const printState = JSON.parse(savedPrintState);
          // 🔥 Correção de IDs duplicados ao carregar do localStorage
          if (printState.modelConfig) {
            const correctedLayout = printState.modelConfig.layout.map((page, index) => ({
              ...page,
              id: page.id + (printState.modelConfig.layout.filter(p => p.id === page.id).length > 1 ? `_${index}` : '')
            }));
            setModelConfig({ ...printState.modelConfig, layout: correctedLayout });
          }
          if (printState.customTableRows) setCustomTableRows(printState.customTableRows);
          if (printState.tableHeaders) setTableHeaders(printState.tableHeaders);
          if (printState.tableColumns) setTableColumns(printState.tableColumns);
          if (printState.tableSubColumns) setTableSubColumns(printState.tableSubColumns);
          if (printState.textBlocks) setTextBlocks(printState.textBlocks);
          if (printState.imageBlocks) setImageBlocks(printState.imageBlocks);
          if (printState.freePageBlocks) setFreePageBlocks(printState.freePageBlocks);
          if (printState.diagValues) setDiagValues(printState.diagValues);
          if (printState.motorSections) setMotorSections(printState.motorSections);
          if (printState.mechData) setMechData(printState.mechData);
          if (printState.p11Data) setP11Data(printState.p11Data);
          if (printState.resistanceData) setResistanceData(printState.resistanceData);
          if (printState.normativeData) setNormativeData(printState.normativeData);
          if (printState.balanceData) setBalanceData(printState.balanceData);
          if (printState.diagVisibility) setDiagVisibility(printState.diagVisibility);
          setTimeout(() => {
            localStorage.removeItem('kairos_print_state_' + osId);
          }, 5000);
        }
        if (snapshotData?.osData) setOsData(snapshotData.osData);
        if (snapshotData?.historyData) setHistoryData(snapshotData.historyData);
        if (snapshotData?.photos) setPhotos(snapshotData.photos);
        setIsLoading(false);
        return;
      }

      const jaImportouFotosPeritagem = !!snapshotData?.peritagemAutoImported;

      const res = await fetch(`${API_BASE_URL}/os/${osId}`);
      if (!res.ok) throw new Error("Falha ao buscar OS");
      const json = await res.json();
      setOsData(json);
      console.log(osData);
      addToRecentOs(json.cr4a1_novacoluna);

      // Auto-mapeamento de fotos da peritagem: só roda na primeira vez que esta OS é
      // carregada (não sobrescreve ajustes manuais feitos depois em cargas seguintes).
      if (!jaImportouFotosPeritagem) {
        sincronizarFotosPeritagem(json.cr4a1_novacoluna, json.unidade_nome, json.cr4a1_cliente_nome);
      }

      try {
        const balRes = await fetch(`${API_BASE_URL}/balanceamento/${json.cr4a1_novacoluna}`);
        const balJson = await balRes.json();
        if (balJson.encontrado) {
          setBalanceData(balJson.dados);
        } else {
          setBalanceData(null);
        }
      } catch (e) {
        console.error('Erro ao buscar balanceamento:', e);
        setBalanceData(null);
      }

      const [h, p] = await Promise.all([
        fetch(`${API_BASE_URL}/historico-servicos/${json.cr4a1_tag_kairos}`).then(r => r.json()),
        fetch(`${API_BASE_URL}/os/${json.cr4a1_novacoluna}/fotos/all?unidade=${json.unidade_nome || "São Luís"}&cliente=${json.cr4a1_cliente_nome}`).then(r => r.json())
      ]);
      setHistoryData(h);
      setPhotos(p);
      setIsReady(true);
      window.reportIsReady = true;
      if (!printMode) toast.success('Dados carregados com sucesso!', { id: toastId });
    } catch (e) {
      console.error("Erro no carregamento:", e);
      setIsReady(true);
      window.reportIsReady = true;
      if (!printMode) toast.error('Falha ao carregar OS.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummaryNavigate = (pageId) => {
    const element = document.getElementById(pageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (menuOpen) setMenuOpen(false);
    }
  };

  const handleSaveToAlbum = async () => {
    if (!newModelName.trim()) {
      toast.error('Informe um nome para o modelo.');
      return;
    }

    // Garantir que os ids das páginas sejam únicos antes de salvar
    const seenIds = new Set();
    const uniqueLayout = modelConfig.layout.map((page, index) => {
      let newId = page.id;
      if (seenIds.has(newId)) {
        newId = `${page.id}_${index}`;
      }
      seenIds.add(newId);
      return { ...page, id: newId };
    });

    const updatedModelConfig = { ...modelConfig, layout: uniqueLayout };

    // Atualizar o estado local também para refletir a mudança
    setModelConfig(updatedModelConfig);

    await withProgress([
      {
        mensagem: 'Salvando modelo...', progresso: 50, acao: async () => {
          await fetch(`${API_BASE_URL}/modelos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cr4a1_nome_modelo: newModelName,
              cr4a1_configuracao_json: JSON.stringify({
                modelConfig: updatedModelConfig,
                customTableRows,
                tableHeaders,
                tableColumns,
                tableSubColumns,
                textBlocks,
                imageBlocks,
                freePageBlocks,
                diagVisibility
              })
            })
          });
          toast.success('Modelo salvo no álbum!');
          fetchTemplatesAlbum();
        }
      }
    ]);
  };

  const handleSelectTemplate = (templateJson) => {
    try {
      setActiveTemplateId(templateJson.cr4a1_modelos_relatoriosid || null);
      const parsed = typeof templateJson.cr4a1_configuracao_json === 'string' ? JSON.parse(templateJson.cr4a1_configuracao_json) : templateJson.cr4a1_configuracao_json;
      // 🔥 Correção de IDs duplicados ao selecionar template
      if (parsed.modelConfig) {
        const correctedLayout = parsed.modelConfig.layout.map((page, index) => ({
          ...page,
          id: page.id + (parsed.modelConfig.layout.filter(p => p.id === page.id).length > 1 ? `_${index}` : '')
        }));
        setModelConfig({ ...parsed.modelConfig, layout: correctedLayout });
      }
      if (parsed.customTableRows) setCustomTableRows(parsed.customTableRows);
      if (parsed.tableHeaders) setTableHeaders(parsed.tableHeaders);
      if (parsed.tableColumns) setTableColumns(parsed.tableColumns);
      if (parsed.tableSubColumns) setTableSubColumns(parsed.tableSubColumns);
      if (parsed.textBlocks) setTextBlocks(parsed.textBlocks);
      if (parsed.imageBlocks) setImageBlocks(parsed.imageBlocks);
      if (parsed.freePageBlocks) setFreePageBlocks(parsed.freePageBlocks);
      if (parsed.diagVisibility) setDiagVisibility(parsed.diagVisibility);
      else setFreePageBlocks({});
      toast.success('Modelo aplicado com sucesso!');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao aplicar modelo. Configuração inválida.');
    }
  };

  const handlePrint = async () => {
    await withProgress([
      {
        id: 'snapshot',
        mensagem: 'Preparando dados...',
        progresso: 10,
        acao: async () => {
          const printState = {
            timestamp: Date.now(),
            modelConfig,
            customTableRows,
            tableHeaders,
            tableColumns,
            tableSubColumns,
            textBlocks,
            imageBlocks,
            freePageBlocks,
            diagValues,
            motorSections,
            mechData,
            p11Data,
            resistanceData,
            normativeData,
            balanceData,
            diagVisibility,
          };
          localStorage.setItem('kairos_print_state_' + osData.cr4a1_novacoluna, JSON.stringify(printState));

          const currentUrl = new URL('http://localhost:5173' + window.location.pathname);
          currentUrl.searchParams.set('os', osData.cr4a1_novacoluna);
          currentUrl.searchParams.set('print', 'true');
          const fullReportUrl = currentUrl.toString();

          await fetch(`${API_BASE_URL}/rascunho`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              osId: osData.cr4a1_novacoluna,
              state: {
                osData: JSON.parse(JSON.stringify(osData)),
                historyData: JSON.parse(JSON.stringify(historyData)),
                photos: JSON.parse(JSON.stringify(photos)),
                balanceData: JSON.parse(JSON.stringify(balanceData)),
                modelConfig, customTableRows, tableHeaders, tableColumns, tableSubColumns,
                textBlocks, imageBlocks, freePageBlocks,
                diagValues, motorSections, mechData, p11Data, resistanceData, normativeData,
                diagVisibility, peritagemAutoImported, activeTemplateId
              }
            })
          });
          return fullReportUrl;
        }
      },
      {
        id: 'gerar-pdf',
        mensagem: 'Gerando PDF...',
        progresso: 40,
        acao: async () => {
          const currentUrl = new URL('http://localhost:5173' + window.location.pathname);
          currentUrl.searchParams.set('os', osData.cr4a1_novacoluna);
          currentUrl.searchParams.set('print', 'true');
          const fullReportUrl = currentUrl.toString();

          const response = await fetch(`${API_BASE_URL}/relatorio/imprimir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportUrl: fullReportUrl, osId: osData.cr4a1_novacoluna })
          });

          if (!response.ok) throw new Error('Falha na geração do PDF');

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          toast.success('PDF aberto em nova aba!');
          return blob;
        }
      },
      {
        id: 'upload-sharepoint',
        mensagem: 'Salvando no SharePoint...',
        progresso: 70,
        acao: async () => {
          const currentUrl = new URL('http://localhost:5173' + window.location.pathname);
          currentUrl.searchParams.set('os', osData.cr4a1_novacoluna);
          currentUrl.searchParams.set('print', 'true');

          const response = await fetch(`${API_BASE_URL}/relatorio/imprimir`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reportUrl: currentUrl.toString(), osId: osData.cr4a1_novacoluna })
          });

          if (!response.ok) throw new Error('Falha ao obter PDF para upload');

          const blob = await response.blob();
          const formData = new FormData();
          formData.append('pdf', blob, `Relatorio_${osData.cr4a1_novacoluna}.pdf`);
          formData.append('unidade', osData?.unidade_nome || '');
          formData.append('cliente', osData?.cr4a1_cliente_nome || '');
          formData.append('osId', osData.cr4a1_novacoluna);

          const uploadRes = await fetch(`${API_BASE_URL}/sharepoint/upload-pdf`, {
            method: 'POST',
            body: formData,
          });

          if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error || 'Falha no upload para SharePoint');
          }

          toast.success('PDF arquivado no SharePoint!');
        }
      },
      {
        id: 'historico',
        mensagem: 'Registrando histórico...',
        progresso: 90,
        acao: async () => {
          await fetch(`${API_BASE_URL}/historico-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              usuario: auth.userName || 'Desconhecido',
              os: osData.cr4a1_novacoluna,
              cliente: osData.cr4a1_cliente_nome || 'Não informado'
            })
          });
          if (auth.role === 'admin') fetchPdfHistory();
        }
      },
      {
        mensagem: 'Concluído!',
        progresso: 100,
        acao: async () => { }
      }
    ]);
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  // ========== PROPS PARA AdminApp ==========
  const adminProps = {
    auth, onLogout: handleLogout,
    osInput, setOsInput, osData, historyData, photos,
    isLoading, isReady, isAdminMode, setIsAdminMode,
    menuOpen, setMenuOpen, isPrintMode,
    balanceData, progresso, mensagemProgresso,
    templatesAlbum, newModelName, setNewModelName, activeTemplateId,
    customTableRows, tableHeaders, tableColumns, tableSubColumns,
    textBlocks, imageBlocks, freePageBlocks, showScrollTop,
    recentOs, clearRecentOs, pdfHistory, fetchPdfHistory,
    diagVisibility, toggleDiagField,
    modelConfig, setModelConfig,
    motorSections, setMotorSections,
    diagValues, setDiagValues,
    mechData, setMechData,
    p11Data, setP11Data,
    resistanceData, setResistanceData,
    normativeData, setNormativeData,
    updateMotorData, updateMechData, updateP11Data, updateResistanceData, updateNormativeData,
    handleTitleChange, handlePrint, handleOsSearch, handleOsKeyDown,
    handleAddBlockToPage, handleBlockUpdate, handleDeletePage, handleAddPage,
    handleCoverUpload, fetchTemplatesAlbum, loadFullData,
    handleSummaryNavigate, handleSaveToAlbum, handleSelectTemplate,
    scrollToTop, toggleMenu, closeMenu,
    handleDragEnd,
    handleSincronizarFotosManual, isSincronizandoFotos
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              auth.role === 'cliente' ? <Navigate to="/cliente/catalogo" /> : <Navigate to="/admin" />
            ) : (
              <>
                <Toaster position="top-center" />
                <LoginScreen onLogin={handleLogin} />
              </>
            )
          }
        />
        <Route
          path="/admin"
          element={
            (auth.isAuthenticated && auth.role !== 'cliente') || new URLSearchParams(window.location.search).get('print') === 'true'
              ? <AdminApp {...adminProps} />
              : <Navigate to="/" />
          }
        />
        <Route path="/cliente/catalogo" element={
          auth.isAuthenticated && auth.role === 'cliente' ? <ClientCatalog /> : <Navigate to="/" />
        } />
        <Route path="/cliente/relatorio/:osId" element={
          auth.isAuthenticated && auth.role === 'cliente' ? <ClientReportViewer /> : <Navigate to="/" />
        } />
      </Routes>
    </BrowserRouter>
  );
}

// ========== COMPONENTE ADMIN/TÉCNICO ==========
function AdminApp(props) {
  const {
    auth, onLogout,
    osInput, setOsInput, osData, historyData, photos,
    isLoading, isReady, isAdminMode, setIsAdminMode,
    menuOpen, setMenuOpen, isPrintMode,
    balanceData, progresso, mensagemProgresso,
    templatesAlbum, newModelName, setNewModelName, activeTemplateId,
    customTableRows, tableHeaders, tableColumns, tableSubColumns,
    textBlocks, imageBlocks, freePageBlocks, showScrollTop,
    recentOs, clearRecentOs, pdfHistory, fetchPdfHistory,
    diagVisibility, toggleDiagField,
    modelConfig, setModelConfig,
    motorSections, setMotorSections,
    diagValues, setDiagValues,
    mechData, setMechData,
    p11Data, setP11Data,
    resistanceData, setResistanceData,
    normativeData, setNormativeData,
    updateMotorData, updateMechData, updateP11Data, updateResistanceData, updateNormativeData,
    handleTitleChange, handlePrint, handleOsSearch, handleOsKeyDown,
    handleAddBlockToPage, handleBlockUpdate, handleDeletePage, handleAddPage,
    handleCoverUpload, fetchTemplatesAlbum, loadFullData,
    handleSummaryNavigate, handleSaveToAlbum, handleSelectTemplate,
    scrollToTop, toggleMenu, closeMenu,
    handleDragEnd,
    handleSincronizarFotosManual, isSincronizandoFotos
  } = props;

  // Prévia embutida no Medro: esconde toda a interface antiga (toolbar, FABs,
  // overlays) — só a folha A4 do laudo fica visível dentro do iframe.
  const isEmbed =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === '1';

  // 👇 NOVO: estado para o modal de compartilhamento
  const [shareModal, setShareModal] = useState({ isOpen: false, contato: '', senha: '' });

  // Config de IA por modelo (admin) — prompt fixo + provedor + chave. A
  // chave nunca volta em texto puro do backend, só o preview (últimos 4
  // caracteres); campo em branco ao salvar significa "manter a atual".
  const IA_CONFIG_EMPTY = { isOpen: false, templateId: null, nome: '', prompt: '', provider: 'gemini', apiKey: '', apiKeyPreview: null, loading: false, saving: false };
  const [iaConfigModal, setIaConfigModal] = useState(IA_CONFIG_EMPTY);

  const openIaConfig = async (template) => {
    setIaConfigModal({
      ...IA_CONFIG_EMPTY,
      isOpen: true, loading: true,
      templateId: template.cr4a1_modelos_relatoriosid,
      nome: template.cr4a1_nome_modelo
    });
    try {
      const res = await fetch(`${API_BASE_URL}/modelos/${template.cr4a1_modelos_relatoriosid}/ia-config`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao carregar configuração.');
      setIaConfigModal(prev => ({
        ...prev, prompt: data.prompt, provider: data.provider, apiKeyPreview: data.apiKeyPreview, loading: false
      }));
    } catch (e) {
      toast.error(e.message);
      setIaConfigModal(IA_CONFIG_EMPTY);
    }
  };

  const saveIaConfig = async () => {
    setIaConfigModal(prev => ({ ...prev, saving: true }));
    try {
      const res = await fetch(`${API_BASE_URL}/modelos/${iaConfigModal.templateId}/ia-config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ prompt: iaConfigModal.prompt, provider: iaConfigModal.provider, apiKey: iaConfigModal.apiKey })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao salvar.');
      toast.success('Configuração de IA salva.');
      setIaConfigModal(IA_CONFIG_EMPTY);
    } catch (e) {
      toast.error(e.message);
      setIaConfigModal(prev => ({ ...prev, saving: false }));
    }
  };

  // Geração de texto por IA no Diagnóstico (técnico + admin) — usa o prompt
  // fixo e a chave configurados no modelo ativo (activeTemplateId). Não
  // salva nada sozinho: só preenche o campo para o técnico revisar e editar
  // antes de gerar o PDF, mantendo a revisão humana obrigatória.
  const [iaGeneratingField, setIaGeneratingField] = useState(null);

  const handleGenerateAI = async (fieldKey, fieldLabel) => {
    if (!activeTemplateId) {
      toast.error('Este laudo não está vinculado a nenhum modelo do álbum com IA configurada.');
      return;
    }
    const resumo = window.prompt(`Descreva resumidamente o problema para a IA sugerir o texto de "${fieldLabel}":`);
    if (!resumo || !resumo.trim()) return;
    setIaGeneratingField(fieldKey);
    try {
      const res = await fetch(`${API_BASE_URL}/modelos/${activeTemplateId}/ia-gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ resumo, campoLabel: fieldLabel })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao gerar texto.');
      setDiagValues(prev => ({ ...prev, [fieldKey]: data.texto }));
      toast.success('Sugestão da IA inserida — revise antes de gerar o PDF.');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIaGeneratingField(null);
    }
  };

  // Versão "lote" do botão acima: pede o resumo uma única vez e preenche os
  // 4 campos de IA numa chamada só, em vez de uma chamada por campo — economiza
  // cota de requisições do provedor e mantém os 4 textos coerentes entre si.
  // O botão por campo continua existindo para regenerar um campo isolado sem
  // sobrescrever os outros três.
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const handleGenerateAllAI = async () => {
    if (!activeTemplateId) {
      toast.error('Este laudo não está vinculado a nenhum modelo do álbum com IA configurada.');
      return;
    }
    const resumo = window.prompt('Descreva resumidamente o problema do equipamento — a IA vai usar isso para preencher os 4 campos do Diagnóstico de uma vez:');
    if (!resumo || !resumo.trim()) return;
    setIsGeneratingAll(true);
    try {
      const res = await fetch(`${API_BASE_URL}/modelos/${activeTemplateId}/ia-gerar-lote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
        body: JSON.stringify({ resumo, campos: DIAG_ITEMS_COM_IA })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha ao gerar diagnóstico.');
      setDiagValues(prev => ({ ...prev, ...data.campos }));
      toast.success('Diagnóstico completo gerado pela IA — revise antes de gerar o PDF.');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsGeneratingAll(false);
    }
  };

  // 👇 NOVA: função de compartilhar com cliente
  const handleShareWithClient = async () => {
    if (!osData) return;
    try {
      const res = await fetch(`${API_BASE_URL}/cliente/associar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ osId: osData.cr4a1_novacoluna })
      });
      const data = await res.json();
      if (data.success) {
        setShareModal({
          isOpen: true,
          contato: data.contato,
          senha: data.senha || ''
        });
      } else {
        toast.error(data.error || 'Erro ao associar cliente.');
      }
    } catch (err) {
      toast.error('Erro de conexão.');
    }
  };

  // Paginação real do Diagnóstico: corta o texto de cada campo (f1-f8) em
  // páginas com base no espaço que ele realmente ocupa, em vez de assumir que
  // os 8 campos sempre cabem numa página só.
  const diagnosisPageSlices = useMemo(
    () => splitDiagnosisIntoPages(diagValues, diagVisibility),
    [diagValues, diagVisibility]
  );

  // Número de páginas físicas que cada entrada de modelConfig.layout realmente
  // gera (diagnóstico via medição de conteúdo; tabela livre/página livre/fotos
  // via contagem de itens, replicando a mesma regra do AutoPaginate abaixo) e,
  // a partir disso, o número inicial de página de cada entrada — numeração
  // acumulada de verdade, não a posição da entrada na lista.
  const layoutPageCounts = useMemo(
    () => computeLayoutPageCounts(modelConfig.layout, {
      freePageBlocks,
      customTableRows,
      diagnosisPageCount: diagnosisPageSlices.length,
    }),
    [modelConfig.layout, freePageBlocks, customTableRows, diagnosisPageSlices]
  );
  const startingPageNumbers = useMemo(
    () => computeStartingPageNumbers(modelConfig.layout, layoutPageCounts),
    [modelConfig.layout, layoutPageCounts]
  );

  // Função renderDynamicPage replicada (usa as props)
  const renderDynamicPage = (page, index) => {
    const pageNumStr = String(startingPageNumbers[page.id] ?? index + 1).padStart(2, '0');
    const commonProps = {
      unidade: osData?.unidade_nome,
      cliente: osData?.cr4a1_cliente_nome,
      osData: osData || {},
    };

    // Diagnóstico não usa o AutoPaginate genérico (que fatia por contagem de
    // itens) — usa as fatias já calculadas por medição real de conteúdo
    // (diagnosisPageSlices), porque um único campo pode sozinho precisar de
    // várias páginas.
    if (page.type === 'PageDiagnosisAndHistory') {
      const startNum = startingPageNumbers[page.id] ?? index + 1;
      return (
        <div id={page.id} key={page.id}>
          {diagnosisPageSlices.map((slice, i) => (
            <PaginatedPage
              key={`${page.id}-${i}`}
              pageNumber={String(startNum + i).padStart(2, '0')}
              title={page.title || 'DIAGNÓSTICO E HISTÓRICO'}
              unidade={commonProps.unidade}
              cliente={commonProps.cliente}
            >
              <DiagnosisContent
                historyData={historyData}
                fieldsSlice={slice.fields}
                showChart={slice.showChart}
                values={diagValues}
                onValueChange={setDiagValues}
                diagVisibility={diagVisibility}
                onToggleField={toggleDiagField}
                onGenerateAI={handleGenerateAI}
                iaGeneratingField={iaGeneratingField}
                onGenerateAllAI={handleGenerateAllAI}
                isGeneratingAll={isGeneratingAll}
                isFirstSlice={i === 0}
              />
            </PaginatedPage>
          ))}
        </div>
      );
    }

    const paginationConfig = {
      PageBuilder: {
        items: freePageBlocks[page.id] || [],
        maxItems: 3,
        pageTitle: page.title || 'PÁGINA LIVRE',
        component: (props) => (
          <BuilderContent
            blocks={props.chunk}
            onBlockChange={(blockId, newData) => handleBlockUpdate(page.id, blockId, newData)}
            isPrintMode={isPrintMode}
            {...props}
          />
        ),
      },
      PageCustomTable: {
        items: (customTableRows[page.id]?.rows) || [],
        maxItems: 10,
        pageTitle: page.title || 'TABELA PERSONALIZADA',
        component: (props) => {
          const pageData = customTableRows[page.id] || { title: '', rows: [['', '']] };
          const hasSub = tableSubColumns[page.id] !== false;
          return (
            <PageCustomTable
              id={page.id}
              pageNumber={String(props.pageIndex).padStart(2, '0')}
              headers={tableHeaders[page.id] || ["Coluna 1", "Coluna 2"]}
              setHeaders={(h) => setTableHeaders(prev => ({ ...prev, [page.id]: h }))}
              columns={tableColumns[page.id] || null}
              setColumns={(c) => setTableColumns(prev => ({ ...prev, [page.id]: c }))}
              rows={pageData.rows || [['', '']]}
              setRows={(r) => setCustomTableRows(prev => ({ ...prev, [page.id]: { ...prev[page.id], rows: r } }))}
              tableTitle={pageData.title || ''}
              setTableTitle={(t) => setCustomTableRows(prev => ({ ...prev, [page.id]: { ...prev[page.id], title: t } }))}
              hasSubColumns={hasSub}
              setHasSubColumns={(v) => setTableSubColumns(prev => ({ ...prev, [page.id]: v }))}
              osData={osData}
              isPrintMode={isPrintMode}
              isInsideBuilder={true}
              displayRowRange={[props.chunkStart, props.chunkStart + props.chunk.length]}
              showColumnControls={props.isFirstChunk}
              showAddRowButton={props.isLastChunk}
            />
          );
        },
      },
      PageMotorElectric: {
        items: page.keys || [],
        maxItems: 2,
        pageTitle: page.title || 'RELATÓRIO FOTOGRÁFICO',
        component: (props) => (
          <MotorElectricContent
            data={osData || {}}
            sections={motorSections}
            onUpdate={updateMotorData}
            pageKeys={page.keys}
            cliente={osData?.cr4a1_cliente_nome}
            unidade={osData?.unidade_nome}
            isPrintMode={isPrintMode}
            {...props}
          />
        ),
      },
    };

    const config = paginationConfig[page.type];
    if (config && config.items.length > config.maxItems) {
      return (
        <div id={page.id} key={page.id}>
          <AutoPaginate
            items={config.items}
            maxItems={config.maxItems}
            PageContentComponent={config.component}
            startPageNumber={startingPageNumbers[page.id] ?? index + 1}
            baseId={page.id}
            pageTitle={page.title}
            unidade={commonProps.unidade}
            cliente={commonProps.cliente}
            isPrintMode={isPrintMode}
            isViewerMode={auth.role === 'cliente'} // Repasse do modo de visualização
          />
        </div>
      );
    }

    const pageContent = (() => {
      switch (page.type) {
        case 'PageCover': return <PageCover key={page.id} modelConfig={modelConfig} />;
        case 'PageBackCover': return <PageBackCover key={page.id} />;
        case 'PageOurServices': return <PageOurServices key={page.id} />;
        case 'PageSummary': return (
          <PageSummary
            key={page.id}
            unidade={osData?.unidade_nome || "São Luís"}
            pageNumber={pageNumStr}
            pages={modelConfig.layout}
            pageNumbers={startingPageNumbers}
            onNavigate={handleSummaryNavigate}
            onTitleChange={handleTitleChange}
            isPrintMode={isPrintMode}
            osData={osData || {}}
          />
        );
        case 'PageProcessData': return (
          <PageProcessData key={page.id} data={osData || {}} pageNumber={pageNumStr} onDataUpdate={(updatedData) => setOsData(updatedData)} isPrintMode={isPrintMode} />
        );
        case 'PageMotorElectric':
          const keys = page.keys || [`${page.id}_b1`, `${page.id}_b2`];
          return (
            <PageMotorElectric
              key={page.id}
              data={osData || {}}
              sections={motorSections}
              onUpdate={updateMotorData}
              pageKeys={keys}
              pageNumber={pageNumStr}
              cliente={osData?.cr4a1_cliente_nome}
              unidade={osData?.unidade_nome}
              isPrintMode={isPrintMode}
              isViewerMode={auth.role === 'cliente'} // Repasse do modo de visualização
            />
          );
        case 'PageMechanicalEvaluation': return <PageMechanicalEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} mechData={mechData} onUpdate={updateMechData} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageBearingEvaluation': return <PageBearingEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} mechData={mechData} onUpdate={updateMechData} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageComponentsEvaluation': return <PageComponentsEvaluation unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} p11Data={p11Data} onUpdate={updateP11Data} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageResistanceTests': return <PageResistanceTests unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} resistanceData={resistanceData} onUpdate={updateResistanceData} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageNormativeReferences': return <PageNormativeReferences unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} normativeData={normativeData} onUpdate={updateNormativeData} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageStaticTestsDescription': return <PageStaticTestsDescription unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} osData={osData || {}} pageNumber={pageNumStr} isPrintMode={isPrintMode} />;
        case 'PageEditableText':
          return <PageEditableText unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} id={page.id} pageNumber={pageNumStr} data={textBlocks[page.id] ? textBlocks[page.id] : { title: "", content: "" }} onChange={(id, val) => setTextBlocks(prev => ({ ...prev, [id]: val }))} isPrintMode={isPrintMode} />;
        case 'PageImageBlock':
          return <PageImageBlock unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} id={page.id} pageNumber={pageNumStr} photoUrl={imageBlocks[page.id]} onPhotoChange={(id, val) => setImageBlocks(prev => ({ ...prev, [id]: val }))} isPrintMode={isPrintMode} />;
        case 'PageCustomTable': {
          const pageData = customTableRows[page.id] || { title: '', rows: [['', '']] };
          const hasSub = tableSubColumns[page.id] !== false;
          return (
            <PageCustomTable
              key={page.id}
              id={page.id}
              pageNumber={pageNumStr}
              headers={tableHeaders[page.id] || ["Coluna 1", "Coluna 2"]}
              setHeaders={(h) => setTableHeaders(prev => ({ ...prev, [page.id]: h }))}
              columns={tableColumns[page.id] || null}
              setColumns={(c) => setTableColumns(prev => ({ ...prev, [page.id]: c }))}
              rows={pageData.rows || [['', '']]}
              setRows={(r) => setCustomTableRows(prev => ({ ...prev, [page.id]: { ...prev[page.id], rows: r } }))}
              tableTitle={pageData.title || ''}
              setTableTitle={(t) => setCustomTableRows(prev => ({ ...prev, [page.id]: { ...prev[page.id], title: t } }))}
              hasSubColumns={hasSub}
              setHasSubColumns={(v) => setTableSubColumns(prev => ({ ...prev, [page.id]: v }))}
              osData={osData}
              isPrintMode={isPrintMode}
            />
          );
        }
        case 'PageBuilder':
          return <PageBuilder unidade={osData?.unidade_nome} cliente={osData?.cr4a1_cliente_nome} key={page.id} id={page.id} pageNumber={pageNumStr} blocks={freePageBlocks[page.id] || []} onBlockChange={(blockId, newData) => handleBlockUpdate(page.id, blockId, newData)} isPrintMode={isPrintMode} />;
        case 'PageBalanceamento': return (
          <PageBalanceamento
            key={page.id}
            data={osData || {}}
            pageNumber={pageNumStr}
            balanceData={balanceData}
            isPrintMode={isPrintMode}
          />
        );
        case 'PageFinal': return <PageFinal key={page.id} />;
        default: return null;
      }
    })();

    return (
      <motion.div key={page.id} id={page.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }} style={{ scrollMarginTop: '80px' }}>
        {pageContent}
      </motion.div>
    );
  };

  // JSX do Admin
  return (
    <div className={`report-app ${menuOpen ? 'menu-open' : ''} ${isEmbed ? 'embed-mode' : ''}`}>
      {isEmbed && (
        <style>{`
          /* interface antiga do bundle — fora da prévia */
          .embed-mode .report-toolbar,
          .embed-mode .menu-fab,
          .embed-mode .menu-overlay,
          .embed-mode .scroll-top-fab,
          .embed-mode .loading-overlay,
          .embed-mode .loading-bar { display: none !important; }
          /* a prévia é só leitura: replica o @media print — some com os inputs/
             botões de edição e mostra os valores. A edição é toda na interface
             Medro; sobram interações "de documento" (sumário, gráficos). */
          .embed-mode .no-print { display: none !important; }
          .embed-mode .print-only { display: revert !important; }
          /* nenhum campo editável na prévia (alguns não têm .no-print) */
          .embed-mode input,
          .embed-mode textarea,
          .embed-mode select { display: none !important; }
          .embed-mode { background: #fff; }
          .embed-mode .report-container { margin: 0 auto; }
        `}</style>
      )}
      {!isPrintMode && (
        <Toaster
          position="top-right"
          toastOptions={{
            style: { borderRadius: '16px', background: '#f7f2ef', color: '#1d1b16', fontWeight: 600, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
            success: { iconTheme: { primary: '#2e7d32', secondary: '#fff' } },
            error: { iconTheme: { primary: '#d32f2f', secondary: '#fff' } },
          }}
        />
      )}

      {isLoading && (
        <>
          <div className="loading-bar" />
          <div className="loading-overlay">
            <motion.div
              className="progress-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${progresso}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
              <div className="progress-text">
                <span>{mensagemProgresso}</span>
                <span>{progresso}%</span>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {!isPrintMode && (
        <motion.button className="menu-fab no-print" onClick={toggleMenu} disabled={isLoading} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}>
          {menuOpen ? '✕' : '☰'}
        </motion.button>
      )}

      <AnimatePresence>
        {menuOpen && <motion.div className="menu-overlay no-print" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />}
      </AnimatePresence>

      <motion.aside
        className={`no-print report-toolbar${menuOpen ? '' : ' collapsed'}`}
        animate={{ x: menuOpen ? 0 : -380 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="toolbar-brand">Kairós Relatórios Técnicos</div>
        <div className="user-info">
          <span className="user-role-badge">{auth.role === 'admin' ? '🔧 Admin' : '📋 Técnico'}</span>
          <span className="user-role-badge">{auth.userName || 'Usuário'}</span>
          <button className="logout-btn" onClick={onLogout} title="Sair">Sair</button>
        </div>
        <div className="toolbar-controls">
          <div className="os-search-group">
            <input className="os-input" value={osInput} onChange={(e) => setOsInput(e.target.value)} onKeyDown={handleOsKeyDown} placeholder="Número da OS..." disabled={isLoading} aria-label="Número da ordem de serviço" />
            <button className={`os-load-btn ${isLoading ? 'btn-loading' : ''}`} onClick={handleOsSearch} disabled={isLoading || !osInput.trim()}>
              {isLoading ? 'Carregando' : 'Carregar'}
            </button>
          </div>

          {recentOs.length > 0 && (
            <div className="recent-os">
              <div className="recent-os-header">
                <span className="recent-os-label">Recentes</span>
                <button className="recent-os-clear" onClick={clearRecentOs} title="Limpar histórico">🗑️</button>
              </div>
              <div className="recent-os-chips">
                {recentOs.map(os => (
                  <button
                    key={os}
                    className="recent-os-chip"
                    onClick={() => { setOsInput(os); loadFullData(os); }}
                    disabled={isLoading}
                  >
                    {os}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="album-selector">
            <span className="album-label">Catálogo do Álbum</span>
            <div className="album-grid">
              {templatesAlbum.length === 0 ? (
                <p className="album-empty">Nenhum modelo salvo ainda.</p>
              ) : (
                templatesAlbum.map((template) => {
                  let capaUrl = null;
                  try {
                    const config = typeof template.cr4a1_configuracao_json === 'string'
                      ? JSON.parse(template.cr4a1_configuracao_json)
                      : template.cr4a1_configuracao_json;
                    capaUrl = resolveCoverImage(config?.modelConfig);
                  } catch (e) { /* mantém capaUrl nulo, cai no avatar de letra */ }

                  return (
                    <motion.div key={template.cr4a1_modelos_relatoriosid} className="album-card" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      {auth.role === 'admin' && (
                        <button
                          className="no-print ia-gear-btn"
                          onClick={(e) => { e.stopPropagation(); openIaConfig(template); }}
                          disabled={isLoading}
                          title="Configurar IA deste modelo"
                        >
                          ⚙️
                        </button>
                      )}
                      <button className="album-card-select-btn" onClick={() => handleSelectTemplate(template)} disabled={isLoading} title={`Aplicar modelo: ${template.cr4a1_nome_modelo}`}>
                        <div className="album-card-thumb">
                          {capaUrl ? (
                            <img src={capaUrl} alt="" className="album-card-cover" />
                          ) : (
                            <span className="album-card-avatar">{template.cr4a1_nome_modelo?.charAt(0).toUpperCase() || '📄'}</span>
                          )}
                        </div>
                        <span className="album-card-name">{template.cr4a1_nome_modelo}</span>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
          {auth.role === 'admin' && (
            <div className="mode-switch">
              <span className="mode-label">Modo de Interface</span>
              <div className="mode-buttons">
                <button className={`mode-btn ${isAdminMode ? 'active' : ''}`} onClick={() => setIsAdminMode(true)} disabled={isLoading}>ADMIN</button>
                <button className={`mode-btn ${!isAdminMode ? 'active' : ''}`} onClick={() => setIsAdminMode(false)} disabled={isLoading}>TÉCNICO</button>
              </div>
            </div>
          )}
          {auth.role === 'admin' && isAdminMode && (
            <div className="admin-config-panel">
              <span className="admin-title">Configurador</span>
              <div className="cover-customizer">
                <label className="cover-label">Design da Capa</label>
                <select className="cover-select" value={modelConfig.capaAtiva || 'padrao'} onChange={(e) => setModelConfig(prev => ({ ...prev, capaAtiva: e.target.value }))} disabled={isLoading}>
                  <option value="padrao">Capa Escura Padrão</option>
                  <option value="custom">Capa Customizada (Upload)</option>
                </select>
                <input className="cover-file-input" type="file" accept="image/*" onChange={handleCoverUpload} disabled={isLoading} />
              </div>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="pages">
                  {(provided) => (
                    <div className="layout-editor-list" {...provided.droppableProps} ref={provided.innerRef}>
                      {modelConfig.layout.map((page, index) => (
                        <Draggable key={page.id} draggableId={page.id} index={index} isDragDisabled={page.id === 'cover' || page.id === 'final'}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`layout-page-item ${snapshot.isDragging ? 'dragging' : ''}`}
                            >
                              <div className="page-header">
                                <span className="drag-handle" title="Arraste para reordenar">⠿</span>
                                <span className="page-title">{index + 1}. {page.title}</span>
                                {page.id !== 'cover' && page.id !== 'final' && (
                                  <button className="page-delete-btn" onClick={() => handleDeletePage(page.id)} disabled={isLoading} title="Remover página">✕</button>
                                )}
                              </div>
                              {page.type === 'PageBuilder' && (
                                <div className="page-builder-actions">
                                  <button className="builder-btn" onClick={() => handleAddBlockToPage(page.id, 'text')} disabled={isLoading} title="Adicionar bloco de texto">+ Txt</button>
                                  <button className="builder-btn" onClick={() => handleAddBlockToPage(page.id, 'image')} disabled={isLoading} title="Adicionar bloco de imagem">+ Img</button>
                                  <button className="builder-btn" onClick={() => handleAddBlockToPage(page.id, 'table')} disabled={isLoading} title="Adicionar bloco de tabela">+ Tbl</button>
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="page-injector">
                <button className="injector-btn" onClick={() => handleAddPage('PageMotorElectric')} disabled={isLoading}>+ Relatório Fotográfico</button>
                <button className="injector-btn" onClick={() => handleAddPage('PageCustomTable')} disabled={isLoading}>+ Tabela Fixa</button>
                <button className="injector-btn" onClick={() => handleAddPage('PageEditableText')} disabled={isLoading}>+ Texto Fixo</button>
                <button className="injector-btn" onClick={() => handleAddPage('PageImageBlock')} disabled={isLoading}>+ Imagem Fixa</button>
                <button className="injector-btn special" onClick={() => handleAddPage('PageBuilder')} disabled={isLoading}>+ Nova Pág. Livre</button>
              </div>
              <div className="album-save-group">
                <input className="album-name-input" value={newModelName} onChange={(e) => setNewModelName(e.target.value)} placeholder="Nome do Modelo..." disabled={isLoading} />
                <button className={`album-save-btn ${isLoading ? 'btn-loading' : ''}`} onClick={handleSaveToAlbum} disabled={isLoading}>
                  {isLoading ? 'Salvando...' : 'Salvar no Álbum'}
                </button>
              </div>
            </div>
          )}
          {osData && isReady && (
            <>
              <button onClick={handlePrint} className={`btn-pdf ${isLoading ? 'btn-loading' : ''}`} disabled={isLoading} title="Gerar PDF (Ctrl+Enter)">
                {isLoading ? 'Gerando PDF' : 'Gerar PDF'}
              </button>
              <button
                onClick={handleSincronizarFotosManual}
                className="btn-pdf"
                style={{ background: '#0056b3', marginTop: '12px' }}
                disabled={isLoading || isSincronizandoFotos}
                title="Reprocessa a pasta Peritagem do SharePoint e reaplica as fotos automáticas (substitui as páginas de relatório fotográfico geradas automaticamente)"
              >
                {isSincronizandoFotos ? 'Sincronizando fotos...' : '🔄 Sincronizar Fotos'}
              </button>
              <button
                onClick={handleShareWithClient}
                className="btn-pdf"
                style={{ background: '#2e7d32', marginTop: '12px' }}
                disabled={isLoading}
                title="Compartilhar com cliente"
              >
                📤 Compartilhar com Cliente
              </button>
            </>
          )}

          {auth.role === 'admin' && (
            <div className="pdf-history-section">
              <div className="history-header">
                <span className="history-label">Histórico de PDFs</span>
                <button className="history-refresh-btn" onClick={fetchPdfHistory} title="Atualizar">🔄</button>
              </div>
              <div className="history-list">
                {pdfHistory.length === 0 ? (
                  <p className="history-empty">Nenhum registro ainda.</p>
                ) : (
                  pdfHistory.map((entry, i) => (
                    <div key={i} className="history-entry">
                      <div className="entry-main">
                        <span className="entry-os">{entry.cr4a1_os}</span>
                        <span className="entry-client">{entry.cr4a1_cliente}</span>
                      </div>
                      <div className="entry-meta">
                        <span className="entry-user">{entry.cr4a1_usuario}</span>
                        <span className="entry-date">{new Date(entry.cr4a1_adicionado_em).toLocaleString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      <main className="report-container" key={JSON.stringify(modelConfig.layout)}>
        <AnimatePresence>
          {modelConfig?.layout && Array.isArray(modelConfig.layout) ? (
            modelConfig.layout.map((page, index) => renderDynamicPage(page, index))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', width: '100%' }}>Carregando estrutura do relatório...</div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-fab no-print"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Voltar ao topo"
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>

      {/* Modal de compartilhamento */}
      {shareModal.isOpen && (
        <div className="menu-overlay" style={{ opacity: 1, pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShareModal({ isOpen: false, contato: '', senha: '' })}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="login-card"
            style={{ width: '400px', maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto', zIndex: 10003 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="login-brand" style={{ marginBottom: '16px' }}>Acesso do Cliente</div>
            <p style={{ fontSize: '14px', color: '#1d1b16', marginBottom: '16px' }}>
              {shareModal.senha
                ? 'Estamos enviando junto do relatório o acesso à nossa plataforma para visualizar o laudo técnico.'
                : 'O cliente já possui acesso à plataforma. Utilize a senha existente.'}
            </p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#1d1b16', marginBottom: '8px' }}>
              Contato: <strong>{shareModal.contato}</strong>
            </p>
            {shareModal.senha && (
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#1d1b16', marginBottom: '16px' }}>
                Senha: <strong>{shareModal.senha}</strong>
              </p>
            )}
            <button
              className="login-btn"
              onClick={() => setShareModal({ isOpen: false, contato: '', senha: '' })}
              style={{ width: '100%' }}
            >
              Fechar
            </button>
          </motion.div>
        </div>
      )}

      {/* Modal de configuração de IA por modelo (admin) */}
      {iaConfigModal.isOpen && (
        <div className="menu-overlay" style={{ opacity: 1, pointerEvents: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => !iaConfigModal.saving && setIaConfigModal(IA_CONFIG_EMPTY)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="login-card ia-config-modal"
            style={{ width: '460px', maxWidth: '90%', maxHeight: '85vh', overflowY: 'auto', zIndex: 10003 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ia-config-title">🤖 IA do modelo: {iaConfigModal.nome}</div>
            {iaConfigModal.loading ? (
              <p className="ia-loading">Carregando...</p>
            ) : (
              <>
                <div className="ia-field">
                  <label>Provedor</label>
                  <select
                    value={iaConfigModal.provider}
                    onChange={(e) => setIaConfigModal(prev => ({ ...prev, provider: e.target.value }))}
                  >
                    <option value="gemini">Gemini</option>
                    <option value="deepseek">DeepSeek</option>
                  </select>
                </div>

                <div className="ia-field">
                  <label>
                    Chave de API
                    <span className="ia-field-hint">{iaConfigModal.apiKeyPreview ? `Atual: ${iaConfigModal.apiKeyPreview}` : 'Nenhuma configurada ainda'}</span>
                  </label>
                  <input
                    type="password"
                    value={iaConfigModal.apiKey}
                    onChange={(e) => setIaConfigModal(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Deixe em branco para manter a chave atual"
                  />
                </div>

                <div className="ia-field">
                  <label>Prompt fixo (como a IA deve agir para este modelo)</label>
                  <textarea
                    value={iaConfigModal.prompt}
                    onChange={(e) => setIaConfigModal(prev => ({ ...prev, prompt: e.target.value }))}
                    rows={8}
                    placeholder="Ex.: Você é um engenheiro eletricista sênior redigindo laudos técnicos de motores elétricos. Use linguagem técnica, objetiva e formal..."
                  />
                </div>

                <div className="ia-config-actions">
                  <button className="login-btn secondary" onClick={() => setIaConfigModal(IA_CONFIG_EMPTY)} disabled={iaConfigModal.saving}>
                    Cancelar
                  </button>
                  <button className="login-btn" onClick={saveIaConfig} disabled={iaConfigModal.saving}>
                    {iaConfigModal.saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;