import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { CopyButton } from "@/components/copy-button";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { MessagesSquare, Send, Sparkles, StopCircle, Trash2 } from "lucide-react";
import { history } from "@/lib/history";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Tech for you by OB" },
      { name: "description", content: "A workplace-savvy AI assistant with markdown, chat history, and quick prompts." },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "tfy-chat-v1";

const SUGGESTIONS = [
  "Draft a polite reply declining a meeting",
  "Give me 5 questions to ask in a stakeholder interview",
  "Turn these bullets into a status update: …",
  "Explain OKRs vs KPIs in 3 sentences",
];

function loadMessages(): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

function extractText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("").trim();
}

function ChatPage() {
  const [initial, setInitial] = useState<UIMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInitial(loadMessages());
    setHydrated(true);
  }, []);

  if (!hydrated) return <div className="p-6" />;
  return <ChatInner initial={initial} />;
}

function ChatInner({ initial }: { initial: UIMessage[] }) {
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initial,
    transport,
    onError: (e) => toast.error(e.message || "Chat failed"),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Save last assistant reply to history when stream completes
    if (status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    const text = extractText(last);
    if (!text) return;
    const firstUser = messages.find((m) => m.role === "user");
    history.add({
      kind: "chat",
      title: firstUser ? extractText(firstUser).slice(0, 80) : "Chat",
      content: text,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [messages.length]);

  const busy = status === "submitted" || status === "streaming";

  async function submit(text?: string) {
    const value = (text ?? input).trim();
    if (!value || busy) return;
    setInput("");
    await sendMessage({ text: value });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col px-4 sm:px-6">
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-glow">
            <MessagesSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl tracking-tight">AI Chat</h1>
            <p className="text-xs text-muted-foreground">Your workplace productivity copilot.</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([]);
              localStorage.removeItem(STORAGE_KEY);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Clear</span>
          </Button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 space-y-6 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-2xl py-8 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="mt-4 font-display text-3xl">How can I help today?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="rounded-xl border bg-card p-3 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent/50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => <MessageBubble key={m.id} message={m} />)
        )}
        {status === "submitted" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
            Thinking…
          </div>
        )}
      </div>

      <div className="border-t bg-background/80 py-3 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="relative rounded-2xl border bg-card shadow-soft focus-within:border-primary/50"
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
            placeholder="Ask anything — I can draft, summarize, brainstorm, and more."
            rows={2}
            className="min-h-[64px] resize-none border-0 bg-transparent pr-14 focus-visible:ring-0"
          />
          <div className="absolute bottom-2 right-2">
            {busy ? (
              <Button type="button" size="icon" variant="secondary" onClick={() => stop()}>
                <StopCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <div className="mt-2">
          <AiDisclaimer compact />
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = extractText(message);
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "group max-w-[85%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground shadow-glow"
            : "bg-transparent text-foreground",
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{text}</p>
        ) : (
          <>
            <Markdown>{text}</Markdown>
            {text && (
              <div className="mt-2 opacity-0 transition-opacity group-hover:opacity-100">
                <CopyButton text={text} size="sm" variant="ghost" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
