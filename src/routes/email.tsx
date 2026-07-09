import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton, downloadText } from "@/components/copy-button";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { Loader2, Mail, RefreshCw, Download } from "lucide-react";
import { history } from "@/lib/history";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Tech for you by OB" },
      { name: "description", content: "Generate professional emails with a chosen tone, recipient, and key points." },
    ],
  }),
  component: EmailPage,
});

type Tone = "professional" | "friendly" | "concise" | "persuasive" | "apologetic" | "enthusiastic";

function EmailPage() {
  const gen = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    if (purpose.trim().length < 2) {
      toast.error("Tell me what the email is about first.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { purpose, recipient, sender, tone, keyPoints } });
      setOutput(res.content);
      history.add({
        kind: "email",
        title: purpose.slice(0, 80),
        content: res.content,
        meta: { tone, recipient },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Email Generator</h1>
          <p className="text-sm text-muted-foreground">Draft polished emails in seconds.</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose *</Label>
              <Textarea
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Follow up with a client about the Q3 proposal and schedule a call next week"
                rows={3}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="recipient">Recipient</Label>
                <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Alex, Marketing team..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sender">From</Label>
                <Input id="sender" value={sender} onChange={(e) => setSender(e.target.value)} placeholder="Your name" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kp">Key points (optional)</Label>
              <Textarea
                id="kp"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Any specific details to include — dates, numbers, next steps..."
                rows={4}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading} className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                <span className="ml-2">{output ? "Regenerate" : "Generate email"}</span>
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

        <Card className="flex flex-col">
          <CardContent className="flex flex-1 flex-col gap-3 p-6">
            <div className="flex items-center justify-between">
              <Label>Output (editable)</Label>
              {output && (
                <div className="flex gap-1">
                  <CopyButton text={output} size="sm" variant="outline" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadText(`email-${Date.now()}.txt`, output)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="ml-2">Export</span>
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder={loading ? "Drafting…" : "Your email will appear here."}
              className="min-h-[420px] flex-1 font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
