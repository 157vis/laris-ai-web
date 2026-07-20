import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTransaction } from "@/lib/dashboard/actions";
import { TransactionForm } from "@/components/dashboard/transaction-form";

export const metadata: Metadata = {
  title: "Catat Transaksi",
  description: "Catat transaksi penjualan baru.",
};

export default async function NewKasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, stock")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  async function action(formData: FormData) {
    "use server";
    await createTransaction(formData);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <TransactionForm products={products ?? []} action={action} />
    </div>
  );
}
