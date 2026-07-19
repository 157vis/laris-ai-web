import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/lib/dashboard/actions";
import { ProductForm } from "@/components/dashboard/product-form";

export const metadata: Metadata = {
  title: "Tambah Produk",
  description: "Tambahkan produk baru ke inventaris warung Anda.",
};

export default async function NewProdukPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Bind action with FormData
  async function action(formData: FormData) {
    "use server";
    await createProduct(formData);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProductForm action={action} />
    </div>
  );
}
