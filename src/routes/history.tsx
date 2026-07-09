import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { history, type HistoryItem } from "@/lib/history";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CopyButton, downloadText } from "@/components/copy-button";
import { Markdown } from "@/components/markdown";
import { History as HistoryIcon, Trash2, Mail, FileText, MessagesSquare, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Tech for you by OB" },
      { name: "description", content: "Your recent generations, saved in this browser." },
    ],
  }),
  component: HistoryPage,
});

const ICONS = { email: Mail, summary: FileText, chat: MessagesSquare } as const;
const LABELS = { email: "Email", summary: "Summary", chat: "Chat" } as const;

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const refresh = () => setItems(history.list());
    refresh();
    window.addEventListener("tfy-history-changed", refresh);
    return () => window.removeEventListener("tfy-history-changed", refresh);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <HistoryIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-3xl tracking-tight sm:text-4xl">History</h1>
            <p className="text-sm text-muted-foreground">Saved locally in your browser. Nothing on our servers.</p>
          </div>
        </div>
        {items.length > 0 && (
          <Button variant="outline" onClick={() => { history.clear(); setSelected(null); }}>
            <Trash2 className="h-4 w-4" />
            <span className="ml-2">Clear all</span>
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-sm text-muted-foreground">
            No history yet. Generate an email, summary, or chat message and it will appear here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = ICONS[item.kind];
              const active = selected?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40",
                    active && "border-primary/60 bg-accent/60",
                  )}
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
                      {LABELS[item.kind]}
                      <span>·</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-sm">{item.title || "Untitled"}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="h-fit lg:sticky lg:top-20">
            <CardContent className="p-6">
              {selected ? (
                <>
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {LABELS[selected.kind]} · {new Date(selected.createdAt).toLocaleString()}
                      </div>
                      <h2 className="text-lg font-medium">{selected.title || "Untitled"}</h2>
                    </div>
                    <div className="flex gap-1">
                      <CopyButton text={selected.content} size="sm" variant="outline" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadText(`${selected.kind}-${selected.id}.md`, selected.content)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => { history.remove(selected.id); setSelected(null); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <Markdown>{selected.content}</Markdown>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Select an item to preview it.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
