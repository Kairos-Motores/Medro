import { useEffect, useState } from "react";
import type { WidgetProps } from "../types";

/** Bloco de notas por instância — o texto vai no `config` do widget (persistido). */
export function NotasWidget({ config, setConfig }: WidgetProps) {
  const saved = typeof config.texto === "string" ? config.texto : "";
  const [texto, setTexto] = useState(saved);

  // reflete mudanças externas (ex.: reset)
  useEffect(() => {
    setTexto(typeof config.texto === "string" ? config.texto : "");
  }, [config.texto]);

  // salva com debounce
  useEffect(() => {
    if (texto === saved) return;
    const id = setTimeout(() => setConfig({ texto }), 400);
    return () => clearTimeout(id);
  }, [texto, saved, setConfig]);

  return (
    <textarea
      value={texto}
      onChange={(e) => setTexto(e.target.value)}
      placeholder="Anotações rápidas…"
      spellCheck={false}
      className="h-full w-full resize-none rounded-md bg-transparent text-[12px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
    />
  );
}
