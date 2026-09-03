export interface FilialCardData {
  id: number;
  nome: string;
  ocupacao: number;
  status: string;
  colaboradoresAtivos: number;
  colaboradoresTotal: number;
  cod: string;
}

export interface SetorItem {
  id: string;
  nome: string;
  disp: number;
  alocada: number;
  cr_vermelho: number;
  cr_amarelo: number;
  os_no_prazo: number;
  os_fora_prazo: number;
  os_criticos: number;
  os_sem_aprovacao: number;
}

export interface CarcacaEquiv {
  id: string;
  original: string;
  equivalente: string;
  tipo: string;
  observacao?: string;
}

export interface GrupoPorte {
  id: string;
  nome: string;
  tensao: "BT" | "AT";
  faixaCarcaca: string;
  potenciaMin: number;
  potenciaMax: number;
  tempoPadraoHH: number;
}

export interface FarolConfig {
  diasNoPrazo: number;
  diasAtencao: number;
  crCritico: number;
  crAlerta: number;
}
