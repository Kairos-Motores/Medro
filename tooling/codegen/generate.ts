/**
 * Codegen: docs/_data/data-model.json → packages/shared/src/generated/*
 *
 * Gera, para cada tabela Dataverse e lista SharePoint:
 *  - interface TS da linha (leitura)
 *  - schema zod de escrita (só campos válidos para create/update, sem colunas de sistema)
 *  - metadados (entitySet, primaryId, primaryName) para o client da API
 *  - enums dos conjuntos de opção (Picklist/State/Status)
 *
 * Rodar: pnpm codegen
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const IN = resolve(ROOT, "docs/_data/data-model.json");
const OUT = resolve(ROOT, "packages/shared/src/generated");
mkdirSync(OUT, { recursive: true });

type Opt = { value: number | null; label: string | null };
type Attr = {
  logical: string;
  display: string | null;
  type: string;
  maxLength: number | null;
  required: string | null;
  validForCreate: boolean | null;
  validForUpdate: boolean | null;
  isPrimaryId: boolean | null;
  isPrimaryName: boolean | null;
  formula: string | null;
  targets: string[] | null;
  options?: Opt[];
};
type DvEntity = {
  name: string;
  logicalName: string;
  entitySet: string;
  displayCollection: string | null;
  description: string | null;
  primaryId: string;
  primaryName: string;
  writable: boolean;
  attributes: Attr[];
  manyToOne: { name: string; attribute: string; referencedEntity: string }[];
};
type SpColumn = {
  name: string;
  title: string | null;
  type: string | null;
  format: string | null;
  enum: unknown[] | null;
  readOnly: boolean | null;
  required: boolean;
};
type SpList = {
  name: string;
  title: string;
  dataset: string;
  table: string;
  permission: string | null;
  writable: boolean;
  columns: SpColumn[];
};
type Model = { dataverse: DvEntity[]; sharepoint: SpList[]; sql: SpList[]; services: { name: string }[] };

const model: Model = JSON.parse(readFileSync(IN, "utf8"));

// ── helpers ──────────────────────────────────────────────────────────────────
const SYSTEM_COLS = new Set([
  "ownerid", "owneridname", "owneridtype", "owningbusinessunit", "owningbusinessunitname",
  "owningteam", "owninguser", "createdby", "createdbyname", "createdon", "createdonbehalfby",
  "createdonbehalfbyname", "modifiedby", "modifiedbyname", "modifiedon", "modifiedonbehalfby",
  "modifiedonbehalfbyname", "overriddencreatedon", "importsequencenumber", "versionnumber",
  "timezoneruleversionnumber", "utcconversiontimezonecode", "msft_datastate",
]);

const pascal = (s: string) =>
  s
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const enumName = (entity: string, attr: string) => `${pascal(entity)}_${pascal(attr)}`;

const jsKey = (s: string) => (/^[A-Za-z_$][\w$]*$/.test(s) ? s : JSON.stringify(s));

const header = (title: string) =>
  `// ⚠️  ARQUIVO GERADO por tooling/codegen — não editar à mão.\n// Fonte: docs/_data/data-model.json  ·  regenerar: pnpm codegen\n// ${title}\n\n`;

// ── 1. enums.ts ──────────────────────────────────────────────────────────────
{
  let out = header("Conjuntos de opção (Picklist / State / Status)");
  out += `export type OptionSetMember = { value: number; label: string };\n\n`;
  const seen = new Set<string>();
  for (const e of model.dataverse) {
    for (const a of e.attributes) {
      if (!a.options?.length) continue;
      const name = enumName(e.logicalName, a.logical);
      if (seen.has(name)) continue;
      seen.add(name);
      const members = a.options
        .filter((o) => o.value !== null && o.label)
        .map((o) => ({ value: o.value as number, label: o.label as string }));
      out += `/** ${e.name}.${a.logical} — ${a.display ?? ""} */\n`;
      out += `export const ${name} = [\n`;
      for (const m of members) out += `  { value: ${m.value}, label: ${JSON.stringify(m.label)} },\n`;
      out += `] as const satisfies readonly OptionSetMember[];\n`;
      out += `export type ${name}Value = (typeof ${name})[number]["value"];\n\n`;
    }
  }
  writeFileSync(resolve(OUT, "enums.ts"), out);
  console.log(`enums.ts  · ${seen.size} option sets`);
}

// ── 2. Dataverse ─────────────────────────────────────────────────────────────
function dvTsType(a: Attr, entityLogical: string): string {
  switch (a.type) {
    case "String":
    case "Memo":
    case "Uniqueidentifier":
    case "Lookup":
    case "Owner":
    case "Customer":
    case "EntityName":
      return "string";
    case "Integer":
    case "BigInt":
    case "Decimal":
    case "Double":
    case "Money":
      return "number";
    case "Boolean":
      return "boolean";
    case "DateTime":
      return "string"; // ISO 8601
    case "Picklist":
    case "State":
    case "Status":
      return a.options?.length ? `E.${enumName(entityLogical, a.logical)}Value` : "number";
    case "Virtual":
      return a.options?.length ? `E.${enumName(entityLogical, a.logical)}Value[]` : "unknown";
    default:
      return "unknown";
  }
}

function dvZod(a: Attr, entityLogical: string): string {
  let z: string;
  switch (a.type) {
    case "String":
    case "Memo": {
      z = "z.string()";
      if (a.maxLength && a.maxLength > 0) z += `.max(${a.maxLength})`;
      break;
    }
    case "Uniqueidentifier":
    case "Lookup":
    case "Owner":
    case "Customer":
      z = "z.string().uuid()";
      break;
    case "Integer":
    case "BigInt":
      z = "z.number().int()";
      break;
    case "Decimal":
    case "Double":
    case "Money":
      z = "z.number()";
      break;
    case "Boolean":
      z = "z.boolean()";
      break;
    case "DateTime":
      z = "z.string().datetime({ offset: true })";
      break;
    case "Picklist":
    case "State":
    case "Status": {
      const lits = (a.options ?? []).filter((o) => o.value !== null).map((o) => o.value);
      if (lits.length === 0) z = "z.number().int()";
      else if (lits.length === 1) z = `z.literal(${lits[0]})`;
      else z = `z.union([${lits.map((v) => `z.literal(${v})`).join(", ")}])`;
      break;
    }
    default:
      z = "z.unknown()";
  }
  const req = a.required === "ApplicationRequired" || a.required === "SystemRequired";
  return req ? z : `${z}.nullish()`;
}

{
  let out = header("Tabelas Dataverse — tipos, schemas de escrita e metadados");
  out += `import { z } from "zod";\nimport type * as E from "./enums.js";\n\n`;
  out += `export type DataverseEntityMeta = {\n  name: string;\n  logicalName: string;\n  entitySet: string;\n  primaryId: string;\n  primaryName: string | null;\n  writable: boolean;\n};\n\n`;

  const registry: string[] = [];

  for (const e of model.dataverse) {
    const I = pascal(e.logicalName);
    // Row interface (leitura)
    out += `/** ${e.name} — \`${e.logicalName}\`${e.description ? ` · ${e.description}` : ""} */\n`;
    out += `export interface ${I}Row {\n`;
    for (const a of e.attributes) {
      if (a.type === "Virtual" && !a.options?.length) continue;
      const t = dvTsType(a, e.logicalName);
      out += `  ${jsKey(a.logical)}?: ${t} | null;\n`;
      if ((a.type === "Lookup" || a.type === "Owner") && a.targets?.length) {
        out += `  ${JSON.stringify("_" + a.logical + "_value")}?: string | null;\n`;
      }
    }
    out += `}\n\n`;

    // Write schema (create/update) — sem colunas de sistema
    const writable = e.attributes.filter(
      (a) =>
        (a.validForCreate || a.validForUpdate) &&
        !a.isPrimaryId &&
        !SYSTEM_COLS.has(a.logical) &&
        !a.logical.endsWith("name") &&
        !a.logical.endsWith("yominame") &&
        !a.formula &&
        a.type !== "Virtual",
    );
    out += `export const ${I}Write = z.object({\n`;
    for (const a of writable) {
      out += `  ${jsKey(a.logical)}: ${dvZod(a, e.logicalName)},\n`;
    }
    out += `}).partial();\n`;
    out += `export type ${I}Write = z.infer<typeof ${I}Write>;\n\n`;

    // Meta
    out += `export const ${I}Meta = {\n`;
    out += `  name: ${JSON.stringify(e.name)},\n`;
    out += `  logicalName: ${JSON.stringify(e.logicalName)},\n`;
    out += `  entitySet: ${JSON.stringify(e.entitySet)},\n`;
    out += `  primaryId: ${JSON.stringify(e.primaryId)},\n`;
    out += `  primaryName: ${JSON.stringify(e.primaryName)},\n`;
    out += `  writable: ${e.writable ? "true" : "false"},\n`;
    out += `} as const satisfies DataverseEntityMeta;\n\n`;

    registry.push(`  ${JSON.stringify(e.logicalName)}: ${I}Meta,`);
  }

  out += `export const DATAVERSE_ENTITIES = {\n${registry.join("\n")}\n} as const;\n`;
  out += `export type DataverseEntityKey = keyof typeof DATAVERSE_ENTITIES;\n`;

  writeFileSync(resolve(OUT, "dataverse.ts"), out);
  console.log(`dataverse.ts · ${model.dataverse.length} entidades`);
}

// ── 3. SharePoint / SQL ──────────────────────────────────────────────────────
function spTs(c: SpColumn): string {
  if (c.type === "integer" || c.type === "number") return "number";
  if (c.type === "boolean") return "boolean";
  if (c.type === "array") return "unknown[]";
  if (c.type === "object") return "Record<string, unknown>";
  return "string";
}
function spZod(c: SpColumn): string {
  let z: string;
  if (c.type === "integer") z = "z.number().int()";
  else if (c.type === "number") z = "z.number()";
  else if (c.type === "boolean") z = "z.boolean()";
  else if (c.type === "array") z = "z.array(z.unknown())";
  else if (c.type === "object") z = "z.record(z.unknown())";
  else if (c.format === "date-time" || c.format === "date") z = "z.string()";
  else z = "z.string()";
  return c.required ? z : `${z}.nullish()`;
}

for (const [file, lists, label] of [
  ["sharepoint.ts", model.sharepoint, "listas SharePoint"],
  ["protheus.ts", model.sql, "tabelas SQL/Protheus"],
] as const) {
  let out = header(`${label} — tipos e metadados`);
  out += `import { z } from "zod";\n\n`;
  const registry: string[] = [];
  const usedNames = new Set<string>();
  for (const l of lists) {
    let base = pascal(l.name);
    let I = base;
    let n = 1;
    while (usedNames.has(I)) I = `${base}${++n}`;
    usedNames.add(I);
    out += `/** ${l.name}${l.title && l.title !== l.name ? ` — ${l.title}` : ""} · dataset \`${l.dataset}\` */\n`;
    out += `export interface ${I}Row {\n`;
    for (const c of l.columns) out += `  ${jsKey(c.name)}?: ${spTs(c)} | null;\n`;
    out += `}\n\n`;
    out += `export const ${I}Write = z.object({\n`;
    for (const c of l.columns) {
      if (c.readOnly || c.name.startsWith("OData__")) continue;
      out += `  ${jsKey(c.name)}: ${spZod(c)},\n`;
    }
    out += `}).partial();\n`;
    out += `export type ${I}Write = z.infer<typeof ${I}Write>;\n\n`;
    out += `export const ${I}Meta = {\n  name: ${JSON.stringify(l.name)},\n  dataset: ${JSON.stringify(l.dataset)},\n  table: ${JSON.stringify(l.table)},\n  permission: ${JSON.stringify(l.permission)},\n} as const;\n\n`;
    registry.push(`  ${JSON.stringify(l.name)}: ${I}Meta,`);
  }
  const constName = file === "sharepoint.ts" ? "SHAREPOINT_LISTS" : "PROTHEUS_TABLES";
  out += `export const ${constName} = {\n${registry.join("\n")}\n} as const;\n`;
  writeFileSync(resolve(OUT, file), out);
  console.log(`${file} · ${lists.length} ${label}`);
}

// ── 4. barrel ────────────────────────────────────────────────────────────────
writeFileSync(
  resolve(OUT, "index.ts"),
  header("Barrel") +
    `export * from "./enums.js";\nexport * from "./dataverse.js";\nexport * from "./sharepoint.js";\nexport * from "./protheus.js";\n`,
);

console.log("codegen OK →", OUT);
