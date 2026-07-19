"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Tombol hapus dengan konfirmasi inline.
 * Generic: pakai untuk produk atau transaksi.
 */
export function DeleteButton({
  id,
  name,
  deleteAction,
  redirectTo,
}: {
  id: string;
  name: string;
  deleteAction: (id: string) => Promise<void>;
  redirectTo?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteAction(id);
        toast.success(`"${name}" berhasil dihapus`);
        if (redirectTo) {
          // Server action redirect, fallback client-side
          window.location.href = redirectTo;
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Gagal menghapus");
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "..." : "Hapus"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Batal
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setConfirming(true)}
      aria-label={`Hapus ${name}`}
    >
      <Trash2 className="h-4 w-4 text-rose-500" />
    </Button>
  );
}
