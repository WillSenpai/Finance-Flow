import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram = ({ chart }: MermaidDiagramProps) => {
  const [svg, setSvg] = useState<string>("");
  const [jpgDataUrl, setJpgDataUrl] = useState<string>("");
  const [error, setError] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid/dist/mermaid.core.mjs")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          securityLevel: "loose",
        });
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const { svg: rendered } = await mermaid.render(id, chart);
        if (!cancelled) {
          setSvg(rendered);
          setError(false);
        }
      } catch (e) {
        console.error("Mermaid render error:", e);
        if (!cancelled) {
          setError(true);
          setSvg("");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  useEffect(() => {
    let isCancelled = false;

    const convertToJpg = async () => {
      if (!svg) {
        setJpgDataUrl("");
        return;
      }

      try {
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();

        const dataUrl = await new Promise<string>((resolve, reject) => {
          img.onload = () => {
            const width = Math.max(img.width, 800);
            const ratio = img.width > 0 ? width / img.width : 1;
            const height = Math.max(1, Math.round(img.height * ratio));
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas context unavailable"));
              return;
            }

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.92));
          };
          img.onerror = () => reject(new Error("Image conversion failed"));
          img.src = blobUrl;
        });

        URL.revokeObjectURL(blobUrl);
        if (!isCancelled) setJpgDataUrl(dataUrl);
      } catch (e) {
        console.error("Mermaid JPG conversion error:", e);
        if (!isCancelled) setJpgDataUrl("");
      }
    };

    void convertToJpg();
    return () => {
      isCancelled = true;
    };
  }, [svg]);

  if (error) {
    return (
      <pre className="bg-muted text-muted-foreground text-xs p-3 rounded-xl overflow-x-auto">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return <div className="bg-muted rounded-xl p-4 animate-pulse h-32" />;
  }

  const canOpenViewer = Boolean(jpgDataUrl);

  return (
    <>
      <button
        type="button"
        onClick={() => canOpenViewer && setViewerOpen(true)}
        className="my-2 w-full text-left overflow-x-auto rounded-xl bg-card border border-border/50 p-3 [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </button>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent
          className="max-w-[95vw] p-3 bg-background/95 border-border/60"
          aria-describedby={undefined}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="w-full max-h-[80vh] overflow-auto select-none">
            {jpgDataUrl ? (
              <img
                src={jpgDataUrl}
                alt="Mappa concettuale"
                className="w-full h-auto rounded-lg"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className="bg-muted rounded-xl p-4 animate-pulse h-40" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MermaidDiagram;
