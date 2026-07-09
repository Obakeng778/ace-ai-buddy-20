// History persistence via localStorage
export type HistoryKind = "email" | "summary" | "chat";

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  content: string;
  createdAt: number;
  meta?: Record<string, string>;
}

const KEY = "tfy-history-v1";

function read(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 200)));
  window.dispatchEvent(new Event("tfy-history-changed"));
}

export const history = {
  list(): HistoryItem[] {
    return read().sort((a, b) => b.createdAt - a.createdAt);
  },
  add(item: Omit<HistoryItem, "id" | "createdAt">): HistoryItem {
    const full: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const items = read();
    items.unshift(full);
    write(items);
    return full;
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
};
