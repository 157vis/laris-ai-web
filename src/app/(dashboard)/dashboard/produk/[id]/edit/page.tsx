import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct } from "@/lib/dashboard/actions";
import { ProductForm } from "@/components/dashboard/product-form";

export const metadata: Metadata = {
  title: "Edit Produk",
  description: "Edit informasi produk di inventaris Anda.",
};

type Props = { params: Promise<{ id: string }> };

export default async function EditProdukPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!product) notFound();

  async function action(formData: FormData) {
    "use server";
    await updateProduct(id, formData);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProductForm initial={{ ...product, id: product.id }} action={action} />
    </div>
  );
}
