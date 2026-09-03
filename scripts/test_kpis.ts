import assert from "node:assert";
import {
  critOsNaFilial,
  critOsAprovadas,
  critOsDentroPrazo,
  critOsForaPrazo,
  calculateFiliaisKpis,
} from "../packages/shared/src/medroPro.js";

console.log("🧪 Iniciando bateria de testes do motor Medro Pro / ZB6...");

// Teste 1: OS na filial
assert.strictEqual(
  critOsNaFilial({ "Dt Entreg Eq": "" }),
  true,
  "Deve considerar OS na filial quando Dt Entreg Eq está vazia",
);
assert.strictEqual(
  critOsNaFilial({ "Dt Entreg Eq": "10/05/2026" }),
  false,
  "Não deve considerar OS na filial quando Dt Entreg Eq está preenchida",
);

// Teste 2: OS aprovadas
assert.strictEqual(
  critOsAprovadas({ "Dt Entreg Eq": "", "DT Autoriza": "01/05/2026" }),
  true,
  "Deve considerar aprovada quando sem entrega e com autorização",
);
assert.strictEqual(
  critOsAprovadas({ "Dt Entreg Eq": "10/05/2026", "DT Autoriza": "01/05/2026" }),
  false,
  "Não deve considerar aprovada se já foi entregue",
);
assert.strictEqual(
  critOsAprovadas({ "Dt Entreg Eq": "", "DT Autoriza": "" }),
  false,
  "Não deve considerar aprovada se não tem autorização",
);

// Teste 3: Prazos com data de referência fixa (02/09/2026)
const refDate = new Date(2026, 8, 2); // 02/09/2026

// Autorizado em 01/09/2026 com 10 dias de prazo -> vence em 11/09/2026 (dentro do prazo)
const osNoPrazo = {
  "Dt Entreg Eq": "",
  "DT Autoriza": "01/09/2026",
  "Prazo Contra": "10",
};
assert.strictEqual(
  critOsDentroPrazo(osNoPrazo, refDate),
  true,
  "Deve estar no prazo quando data limite >= hoje",
);
assert.strictEqual(
  critOsForaPrazo(osNoPrazo, refDate),
  false,
  "Não deve estar fora do prazo quando data limite >= hoje",
);

// Autorizado em 01/08/2026 com 10 dias de prazo -> venceu em 11/08/2026 (fora do prazo)
const osAtrasada = {
  "Dt Entreg Eq": "",
  "DT Autoriza": "01/08/2026",
  "Prazo Contra": "10",
};
assert.strictEqual(
  critOsDentroPrazo(osAtrasada, refDate),
  false,
  "Não deve estar no prazo quando data limite < hoje",
);
assert.strictEqual(
  critOsForaPrazo(osAtrasada, refDate),
  true,
  "Deve estar fora do prazo quando data limite < hoje",
);

// Teste 4: Agrupamento por filiais e filtro de vendas
const mockData = [
  // São Luís: 1 no prazo, 1 atrasada, 1 venda descartada
  {
    Filial: "São Luís",
    "Dt Entreg Eq": "",
    "DT Autoriza": "01/09/2026",
    "Prazo Contra": "10",
    "OS Kairos": "OS-100",
  },
  {
    Filial: "São Luís",
    "Dt Entreg Eq": "",
    "DT Autoriza": "01/08/2026",
    "Prazo Contra": "5",
    "OS Kairos": "OS-101",
  },
  {
    Filial: "São Luís",
    "Dt Entreg Eq": "",
    "DT Autoriza": "01/09/2026",
    "Prazo Contra": "10",
    "OS Kairos": "VENDA DIRETA PEÇA",
  },
  // Parauapebas: 1 sem aprovação
  {
    Filial: "Parauapebas",
    "Dt Entreg Eq": "",
    "DT Autoriza": "",
    "Prazo Contra": "15",
    "OS Kairos": "OS-200",
  },
];

const kpis = calculateFiliaisKpis(mockData, refDate);
assert.strictEqual(kpis["São Luís"]?.os_na_filial, 2, "São Luís deve ter 2 OS na filial (venda ignorada)");
assert.strictEqual(kpis["São Luís"]?.os_aprovadas, 2, "São Luís deve ter 2 OS aprovadas");
assert.strictEqual(kpis["São Luís"]?.os_dentro_prazo, 1, "São Luís deve ter 1 OS no prazo");
assert.strictEqual(kpis["São Luís"]?.os_fora_prazo, 1, "São Luís deve ter 1 OS fora do prazo");

assert.strictEqual(kpis["Parauapebas"]?.os_na_filial, 1, "Parauapebas deve ter 1 OS na filial");
assert.strictEqual(kpis["Parauapebas"]?.os_aprovadas, 0, "Parauapebas deve ter 0 OS aprovadas");

console.log("✅ Todos os 10 testes do motor ZB6 / Medro Pro passaram com sucesso!");
