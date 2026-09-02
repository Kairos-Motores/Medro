import { config } from "../../config.js";

/**
 * Stub do cliente SharePoint via Microsoft Graph.
 * Habilitar quando a app registration tiver `Sites.ReadWrite.All` (ou identidade dedicada).
 * Listas e datasets em docs/01-modelo-de-dados.md / packages/shared generated/sharepoint.ts.
 */
export const sharepoint = {
  get enabled() {
    return config.GRAPH_ENABLED;
  },
  async listItems(_listName: string, _query: Record<string, string> = {}): Promise<never> {
    throw new Error("SharePoint/Graph ainda não configurado (GRAPH_ENABLED=false).");
  },
};
