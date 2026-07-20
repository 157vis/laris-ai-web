import type { Metadata } from "next";
import { Map, CheckCircle2, Clock, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAdmin, getRoadmapItems, logAdminAction } from "@/lib/admin/rbac";

export const metadata: Metadata = {
  title: "Roadmap Laris.AI",
  description: "7 fase pengembangan platform Laris.AI",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES = {
  done: {
    icon: CheckCircle2,
    color: "border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-700",
    label: "Selesai",
  },
  next: {
    icon: Clock,
    color: "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-700",
    label: "Berikutnya",
  },
  todo: {
    icon: Circle,
    color: "border-slate-200 bg-slate-50/50 dark:bg-slate-950/20",
    badge: "bg-slate-100 text-slate-600",
    label: "Belum",
  },
};

export default async function AdminRoadmapPage() {
  const admin = await requireAdmin();
  const items = await getRoadmapItems();
  await logAdminAction(admin.id, "view_admin_roadmap", "admin_roadmap_page");

  const doneCount = items.filter((i) => i.status === "done").length;
  const totalCount = items.length;
  const progressPct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Map className="h-6 w-6" />
          Roadmap Laris.AI
        </h1>
        <p className="text-sm text-muted-foreground">
          Progress migrasi Streamlit → Next.js PWA
        </p>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Progress Total</p>
              <p className="text-3xl font-bold">
                {doneCount} / {totalCount} fase
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-emerald-600">{progressPct}%</p>
              <p className="text-xs text-muted-foreground">complete</p>
            </div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Phase list */}
      <div className="space-y-3">
        {items.map((item) => {
          const style =
            STATUS_STYLES[(item.status as keyof typeof STATUS_STYLES) ?? "todo"];
          const Icon = style.icon;
          return (
            <Card key={item.id} className={style.color}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white text-lg font-bold dark:bg-slate-900">
                  {item.phase}
                </div>
                <Icon
                  className={`h-6 w-6 shrink-0 ${
                    item.status === "done"
                      ? "text-emerald-500"
                      : item.status === "next"
                      ? "text-amber-500"
                      : "text-slate-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{item.title}</p>
                    <Badge className={style.badge}>{style.label}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        💡 Fitur edit roadmap (mark as done, tambah fase) akan ditambah di FASE berikutnya
      </p>
    </div>
  );
}
