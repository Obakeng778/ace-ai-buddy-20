import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, MessagesSquare, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AiDisclaimer } from "@/components/ai-disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Tech for you by OB" },
      { name: "description", content: "Your AI workplace copilot: draft emails, summarize meetings, and chat with an assistant." },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails in seconds. Set tone, recipient, and key points.",
  },
  {
    to: "/summarizer" as const,
    icon: FileText,
    title: "Meeting Notes Summarizer",
    desc: "Turn transcripts into crisp summaries, decisions, and action items.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Chat Assistant",
    desc: "Ask anything. Get structured, ready-to-use answers with markdown.",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-soft sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-brand opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3" /> Powered by Lovable AI
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
            Your workplace,{" "}
            <span className="text-gradient-brand italic">gently accelerated.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
            One quiet toolkit for the writing, summarizing, and thinking that fills a workday.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start chatting <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur hover:bg-accent"
            >
              Draft an email
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.to} to={t.to} className="group">
            <Card className="h-full overflow-hidden border-border/70 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-glow">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-glow">
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Fast by default", desc: "Streaming responses, no ceremony." },
          { icon: Shield, title: "Private by intent", desc: "Nothing stored beyond your browser unless you choose." },
          { icon: Sparkles, title: "Editable outputs", desc: "Every result is yours to refine, copy, and export." },
        ].map((f) => (
          <div key={f.title} className="rounded-2xl border bg-card p-5">
            <f.icon className="h-4 w-4 text-primary" />
            <h4 className="mt-3 font-medium">{f.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <div className="mt-10">
        <AiDisclaimer />
      </div>
    </div>
  );
}
