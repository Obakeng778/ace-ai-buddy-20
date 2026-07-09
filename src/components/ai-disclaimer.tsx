import { AlertTriangle } from "lucide-react";

export function AiDisclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="h-3 w-3" />
        AI-generated content — review before professional use. Do not share confidential data.
      </p>
    );
  }
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        AI-generated content may be inaccurate. Please review before professional use, and do not enter
        confidential or sensitive information.
      </span>
    </div>
  );
}
