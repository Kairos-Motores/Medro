import { useRef } from "react";
import {
  Sun,
  Moon,
  Image as ImageIcon,
  Check,
  Upload,
  RotateCcw,
  Palette,
} from "lucide-react";
import { useTheme, type WallpaperOption } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppearanceMenu() {
  const {
    theme,
    toggleTheme,
    setTheme,
    wallpaper,
    setWallpaper,
    customWallpapers,
    setCustomWallpaper,
  } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCustom = !!customWallpapers[wallpaper]?.[theme];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomWallpaper(wallpaper, theme, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex size-7 items-center justify-center rounded-md text-foreground-secondary transition hover:bg-surface hover:text-foreground active:scale-95"
            title="Aparência & Papel de Parede"
            aria-label="Aparência"
          >
            {theme === "dark" ? (
              <Moon className="size-3.5 text-primary" />
            ) : (
              <Sun className="size-3.5 text-amber-500" />
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-64 p-1.5">
          {/* Alternador de Tema */}
          <DropdownMenuLabel className="flex items-center justify-between text-[11px] uppercase tracking-wider">
            <span>Modo de Exibição</span>
            <span className="font-semibold text-primary">
              {theme === "dark" ? "Escuro" : "Claro"}
            </span>
          </DropdownMenuLabel>

          <div className="grid grid-cols-2 gap-1.5 p-1">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center justify-center gap-2 rounded-md border py-2 text-[12px] font-medium transition ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                  : "border-border/60 bg-surface/50 text-foreground-secondary hover:bg-surface hover:text-foreground"
              }`}
            >
              <Sun className="size-3.5 text-amber-500" />
              Claro
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center justify-center gap-2 rounded-md border py-2 text-[12px] font-medium transition ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary shadow-xs"
                  : "border-border/60 bg-surface/50 text-foreground-secondary hover:bg-surface hover:text-foreground"
              }`}
            >
              <Moon className="size-3.5 text-primary" />
              Escuro
            </button>
          </div>

          <DropdownMenuSeparator />

          {/* Opções de Papel de Parede */}
          <DropdownMenuLabel className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <ImageIcon className="size-3" />
            <span>Papel de Parede</span>
          </DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={() => setWallpaper("option-1")}
            className="justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">Opção 1</span>
              <span className="text-[11px] text-muted-foreground">
                Gradiente Orgânico Suave
              </span>
            </div>
            {wallpaper === "option-1" && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => setWallpaper("option-2")}
            className="justify-between"
          >
            <div className="flex flex-col">
              <span className="font-medium">Opção 2</span>
              <span className="text-[11px] text-muted-foreground">
                Geométrico / Técnico
              </span>
            </div>
            {wallpaper === "option-2" && <Check className="size-4 text-primary" />}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Teste imediato de upload local */}
          <div className="px-2 py-1 text-[11px] text-muted-foreground">
            {hasCustom ? (
              <div className="flex items-center justify-between">
                <span className="text-emerald-500 font-medium">Imagem personalizada ativa</span>
                <button
                  onClick={() => setCustomWallpaper(wallpaper, theme, undefined)}
                  className="flex items-center gap-1 text-danger hover:underline"
                  title="Restaurar imagem padrão"
                >
                  <RotateCcw className="size-3" /> Limpar
                </button>
              </div>
            ) : (
              <p>Pasta: <code className="rounded bg-surface-2 px-1 py-0.5 text-[10px]">public/wallpapers</code></p>
            )}
          </div>

          <DropdownMenuItem
            onSelect={() => fileInputRef.current?.click()}
            className="text-[12px] text-foreground-secondary"
          >
            <Upload className="size-3.5" />
            <span>Testar imagem local agora...</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
