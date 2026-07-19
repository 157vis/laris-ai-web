import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Receipt, User, Phone, Calendar, CreditCard, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = {
  title: "Detail Transaksi",
  description: "Detail lengkap transaksi.",
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const PAYMENT_LABEL: Record<string, string> = {
  tunai: "💵 Tunai",
  qris: "📱 QRIS",
  transfer: "🏦 Transfer",
  kredit: "📝 Kredit",
};

export default async function KasDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tx } = await supabase
    .from("transactions")
    .select("*, transaction_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!tx) notFound();

  const items = Array.isArray(tx.transaction_items) ? tx.transaction_items : [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/kas">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Buku Kas
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4" />
          Cetak Struk
        </Button>
      </div>

      {/* Success banner */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-white/90">Transaksi Berhasil</p>
            <p className="text-2xl font-bold">{formatIDR(tx.total)}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Transaksi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(tx.created_at).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
          </div>
          {tx.customer_name && (
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{tx.customer_name}</span>
            </div>
          )}
          {tx.customer_phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{tx.customer_phone}</span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline">
              {PAYMENT_LABEL[tx.payment_method ?? "tunai"] ?? tx.payment_method}
            </Badge>
          </div>
          {tx.notes && (
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="text-xs text-muted-foreground">Catatan:</p>
              <p>{tx.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Item ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {items.map((item: { id: string; name: string; quantity: number; price: number; subtotal: number }) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatIDR(item.price)}
                  </p>
                </div>
                <p className="font-bold">{formatIDR(item.subtotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-2xl font-extrabold text-brand-600">{formatIDR(tx.total)}</span>
          </div>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        ID Transaksi: {tx.id}
      </p>
    </div>
  );
}
