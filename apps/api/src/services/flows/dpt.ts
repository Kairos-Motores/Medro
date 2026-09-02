import {
  getLaudoPdf,
  getLaudoShareLink,
  type LaudoRef,
} from "../sharepoint/docTecnicos.js";

/**
 * Port dos Flows do Departamento Técnico (docs/03-flows.md), agora via Microsoft Graph:
 *  - obterLaudo      → GET do PDF na biblioteca "Doc Tcnicos"
 *  - gerarlinkLaudo  → createLink (view / anonymous)
 *
 * Requer GRAPH_ENABLED=true + permissão Sites/Files no app registration; caso contrário
 * as funções lançam erro com code "SHAREPOINT_NOT_CONFIGURED" (a UI trata como indisponível).
 */

export async function obterLaudoPdf(l: LaudoRef) {
  return getLaudoPdf(l);
}

export async function gerarLinkLaudo(l: LaudoRef) {
  return getLaudoShareLink(l);
}
