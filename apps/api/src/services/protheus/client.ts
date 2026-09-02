import { config } from "../../config.js";

/**
 * Stub do cliente SQL Server / TOTVS Protheus (somente leitura).
 * Habilitar com PROTHEUS_ENABLED=true + credenciais + allowlist de IP no Render.
 * Tabelas: ZB6010 (dados da OS/equipamento), SCP010, ABF010.
 * Ao ativar: usar `mssql` (tedious), pool único, queries parametrizadas.
 */
export const protheus = {
  get enabled() {
    return config.PROTHEUS_ENABLED;
  },
  async query<T = Record<string, unknown>>(_sql: string, _params: unknown[] = []): Promise<T[]> {
    throw new Error("Protheus SQL ainda não configurado (PROTHEUS_ENABLED=false).");
  },
};
