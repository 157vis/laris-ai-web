"use client";

import { useState, useTransition } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Stok adjuster — tombol +/- untuk restock cepat.
 * Optimistic update dengan toast feedback.
 */
export function StockAdjuster({
  productId,
  stock,
  adjustStock,
}: {
  productId: string;
  stock: number;
  adjustStock: (id: string, delta: number) => Promise<void>;
}) {
  const [val, setVal] = useState(stock);
  const [delta, setDelta] = useState(1);
  const [isPending, startTransition] = useTransition();

  function handleChange(newDelta: number) {
    startTransition(async () => {
      try {
        await adjustStock(productId, newDelta);
        setVal((v) => Math.max(0, v + newDelta));
        toast.success(newDelta > 0 ? `+${newDelta} stok` : `${newDelta} stok`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal update stok");
      }
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background px-1 py-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleChange(-delta)}
        disabled={isPending || val <= 0}
      >
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
      </Button>
      <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums">
        {val}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleChange(delta)}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
      </Button>
      <Input
        type="number"
        min={1}
        value={delta}
        onChange={(e) => setDelta(Math.max(1, Number(e.target.value) || 1))}
        className="h-7 w-12 text-center text-xs"
      />
    </div>
  );
}
