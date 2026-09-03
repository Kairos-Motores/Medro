import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";

export function WallpaperBackground() {
  const { theme, wallpaper, customWallpapers } = useTheme();

  // Se houver um upload local específico salvo pelo usuário
  const customSrc = customWallpapers[wallpaper]?.[theme];

  // Ordem de busca padrão nos arquivos públicos:
  // 1. .jpg
  // 2. .png
  // 3. .svg (fallback gerado com a paleta oficial)
  const defaultSvg = `/wallpapers/${wallpaper}-${theme}.svg`;
  const defaultJpg = `/wallpapers/${wallpaper}-${theme}.jpg`;
  const defaultPng = `/wallpapers/${wallpaper}-${theme}.png`;

  const [activeSrc, setActiveSrc] = useState<string>(customSrc || defaultSvg);

  useEffect(() => {
    if (customSrc) {
      setActiveSrc(customSrc);
      return;
    }

    let isMounted = true;

    // Tenta carregar .jpg primeiro
    const imgJpg = new Image();
    imgJpg.src = defaultJpg;
    imgJpg.onload = () => {
      if (isMounted) setActiveSrc(defaultJpg);
    };
    imgJpg.onerror = () => {
      // Se não houver .jpg, tenta .png
      const imgPng = new Image();
      imgPng.src = defaultPng;
      imgPng.onload = () => {
        if (isMounted) setActiveSrc(defaultPng);
      };
      imgPng.onerror = () => {
        // Fallback garantido para o SVG oficial com a paleta exata
        if (isMounted) setActiveSrc(defaultSvg);
      };
    };

    return () => {
      isMounted = false;
    };
  }, [theme, wallpaper, customSrc, defaultJpg, defaultPng, defaultSvg]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden transition-all duration-500"
      aria-hidden="true"
    >
      {/* Imagem de fundo com transição suave */}
      <div
        key={activeSrc}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 animate-in fade-in"
        style={{ backgroundImage: `url("${activeSrc}")` }}
      />

      {/* Camada sutil de vinheta/profundidade macOS */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 dark:from-black/20 dark:to-black/35" />
    </div>
  );
}
