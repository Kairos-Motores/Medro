import React from "react";
import { X, ZoomIn, ZoomOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subTitle?: string;
  imageUrl: string | null;
}

export function FotoModal({ isOpen, onClose, title, subTitle, imageUrl }: FotoModalProps) {
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    if (isOpen) setScale(1);
  }, [isOpen]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-surface text-foreground shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-surface-2/50">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {subTitle && <p className="text-xs text-muted-foreground">{subTitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="neutral"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
              title="Diminuir Zoom"
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-xs text-muted-foreground min-w-10 text-center font-mono">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="neutral"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setScale((s) => Math.min(3, s + 0.25))}
              title="Aumentar Zoom"
            >
              <ZoomIn className="size-4" />
            </Button>
            <a
              href={imageUrl}
              download={`caldeiraria-${title.toLowerCase().replace(/\s+/g, "-")}.png`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-2 text-foreground hover:bg-surface-2/80"
              title="Baixar Imagem"
            >
              <Download className="size-4" />
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-4 bg-surface-2/30 min-h-[350px]">
          <img
            src={imageUrl}
            alt={title}
            style={{ transform: `scale(${scale})`, transition: "transform 0.15s ease-out" }}
            className="max-h-[75vh] max-w-full rounded-md object-contain shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
