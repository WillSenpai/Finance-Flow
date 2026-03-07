import { useRef, useCallback } from "react";
import { Bold, Italic, Underline, Highlighter } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const FORMATS = [
  { icon: Bold, wrap: ["<b>", "</b>"], label: "Grassetto" },
  { icon: Italic, wrap: ["<i>", "</i>"], label: "Corsivo" },
  { icon: Underline, wrap: ["<u>", "</u>"], label: "Sottolineato" },
  { icon: Highlighter, wrap: ["<mark>", "</mark>"], label: "Evidenziato" },
] as const;

const RichTextEditor = ({ value, onChange, placeholder, rows = 4, className }: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = useCallback((before: string, after: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);

    // Restore cursor position
    requestAnimationFrame(() => {
      ta.focus();
      if (selected.length > 0) {
        ta.setSelectionRange(start + before.length, end + before.length);
      } else {
        const cursor = start + before.length;
        ta.setSelectionRange(cursor, cursor);
      }
    });
  }, [value, onChange]);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
        {FORMATS.map(({ icon: Icon, wrap, label }) => (
          <button
            key={label}
            type="button"
            title={label}
            onClick={() => applyFormat(wrap[0], wrap[1])}
            className="p-2 rounded-lg hover:bg-background active:scale-90 transition-all text-muted-foreground hover:text-foreground"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
};

export default RichTextEditor;
