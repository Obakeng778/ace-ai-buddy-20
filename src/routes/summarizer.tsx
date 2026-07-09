import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton, downloadText } from "@/components/copy-button";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Markdown } from "@/components/markdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Loader2, RefreshCw, Download } from "lucide-react";
import { history } from "@/lib/history";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Tech for you by OB" },
      { name: "description", content: "Turn meeting notes into concise summaries, decisions, and action items." },
    ],
  }),
  component: SummarizerPage,
});

type Style = "executive" | "detailed" | "bullets";

function SummarizerPage() {
  const gen = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [style, setStyle] = useState<Style>("executive");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (notes.trim().length < 20) {
      toast.error("Paste at least a paragraph of notes to summarize.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { notes, style } });
      setOutput(res.content);
      history.add({
        kind: "summary",
        title: notes.slice(0, 80).replace(/\s+/g, " "),
        content: res.content,
        meta: { style },
      });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Summarization failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Meeting Summarizer</h1>
          <p className="text-sm text-muted-foreground">Notes in. Summary, decisions, and action items out.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Meeting notes or transcript *</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste raw notes, transcript, or bullet points here…"
                className="min-h-[380px] font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Summary style</Label>
              <Select value={style} onValueChange={(v) => setStyle(v as Style)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive summary + sections</SelectItem>
                  <SelectItem value="detailed">Detailed narrative + sections</SelectItem>
                  <SelectItem value="bullets">Bullet points only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading} className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                <span className="ml-2">{output ? "Regenerate" : "Summarize"}</span>
              </Button>
              {output && (
                <Button variant="outline" onClick={run} disabled={loading}>
                  <RefreshCw className="h-4 w-4" />
                  <span className="ml-2">Try again</span>
                </Button>
              )}
            </div>
            <AiDisclaimer compact />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <Label>Result</Label>
              {output && (
                <div className="flex gap-1">
                  <CopyButton text={output} size="sm" variant="outline" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadText(`summary-${Date.now()}.md`, output)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-2">Export</span>
                  </Button>
                </div>
              )}
            </div>
            <Tabs defaultValue="preview">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="min-h-[400px] rounded-lg border bg-muted/30 p-4">
                  {output ? (
                    <Markdown>{output}</Markdown>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {loading ? "Working through the notes…" : "Your summary will render here as markdown."}
                    </p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="edit">
                <Textarea
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="Edit the raw markdown here."
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
