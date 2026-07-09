import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { history } from "@/lib/history";
import { toast } from "sonner";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tech for you by OB" },
      { name: "description", content: "Appearance, data, and privacy settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
          <SettingsIcon className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Settings</h1>
          <p className="text-sm text-muted-foreground">Personalize your workspace.</p>
        </div>
      </header>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="text-base font-medium">Appearance</h2>
              <p className="text-sm text-muted-foreground">Choose how the app looks on this device.</p>
            </div>
            {mounted && (
              <RadioGroup value={theme ?? "system"} onValueChange={setTheme} className="grid gap-2 sm:grid-cols-3">
                {["light", "dark", "system"].map((t) => (
                  <Label
                    key={t}
                    htmlFor={`theme-${t}`}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border bg-card p-3 capitalize transition-colors hover:border-primary/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/40"
                  >
                    <RadioGroupItem value={t} id={`theme-${t}`} />
                    <span>{t}</span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <h2 className="text-base font-medium">Data & privacy</h2>
              <p className="text-sm text-muted-foreground">
                All history, chats, and preferences are stored in your browser's local storage — never sent to a server.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  history.clear();
                  toast.success("History cleared");
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="ml-2">Clear generation history</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("tfy-chat-v1");
                  toast.success("Chat cleared");
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="ml-2">Clear chat conversation</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <h2 className="text-base font-medium">About</h2>
            <p className="text-sm text-muted-foreground">
              <strong>Tech for you by OB</strong> is an AI productivity suite for writing emails, summarizing meetings,
              and having quick workplace conversations. Powered by Lovable AI.
            </p>
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
