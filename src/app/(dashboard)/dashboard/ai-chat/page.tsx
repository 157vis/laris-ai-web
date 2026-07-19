"use client";

import { useState } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Message = { id: string; role: "user" | "ai"; content: string };

const SUGGESTED = [
  "Produk apa yang paling laris minggu ini?",
  "Berapa total penjualan 7 hari terakhir?",
  "Stok apa yang hampir habis?",
  "Bagaimana cara tambah produk baru?",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "0",
      role: "ai",
      content: "Halo! Saya AI asisten Laris AI. Saya bisa bantu analisis penjualan, cek stok, dan kasih saran untuk tokomu. Silakan tanya apa saja!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  async function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    // Placeholder AI response — real implementation di FASE 5
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `🤖 [FASE 5] Maaf, fitur AI Chat lengkap sedang dalam pengembangan. Pertanyaan kamu: "${text}" sudah tercatat.`,
      };
      setMessages((m) => [...m, aiMsg]);
      setIsTyping(false);
    }, 800);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col space-y-4">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Bot className="h-7 w-7 text-brand-500" />
          AI Chat
        </h1>
        <p className="text-sm text-muted-foreground">
          Tanya apa saja tentang tokomu. AI akan bantu analisis.
        </p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Percakapan
          </CardTitle>
          <CardDescription>Powered by GPT-4 (segera)</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "bg-brand-500 text-white"
                    : "bg-muted"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-4 py-2.5 text-sm">
                <span className="animate-pulse">● ● ●</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggested prompts (only when chat empty) */}
      {messages.length === 1 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-muted"
            >
              💡 {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tanya AI..."
          className="flex-1 rounded-lg border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <Button type="submit" disabled={!input.trim() || isTyping}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
