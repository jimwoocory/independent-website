import Link from "next/link";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 定义车辆数据类型
interface Vehicle {
  id: string;
  name_i18n: Record<string, string>;
  category: string | null;
  status: string | null;
  price_range_min: number | null;
  price_range_max: number | null;
  created_at: string | null;
}

const categories = ["", "SUV", "Pickup", "Sedan", "EV", "其他"];
const statuses = ["", "active", "new", "fast"];

async function fetchVehicles(q: string, category: string, status: string): Promise<Vehicle[]> {
  const supabase = getSupabaseServerClient();
  let query = supabase
    .from("vehicles")
    .select("id, name_i18n, category, status, price_range_min, price_range_max, created_at")
    .order("created_at", {ascending: false})
    .limit(100);

  if (q) {
    query = query.or(`name_i18n->>en.ilike.%${q}%,name_i18n->>zh.ilike.%${q}%`);
  }
  if (category) {
    query = query.eq("category", category);
  }
  if (status) {
    query = query.eq("status", status);
  }

  const {data, error} = await query;
  if (error) {
    console.error("admin vehicles", error);
    return [];
  }
  return (data as Vehicle[]) ?? [];
}

export default async function AdminVehicles({searchParams}: {searchParams?: {q?: string; category?: string; status?: string}}) {
  const q = searchParams?.q?.trim() || "";
  const category = searchParams?.category || "";
  const status = searchParams?.status || "";
  const vehicles = await fetchVehicles(q, category, status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">车辆管理</h1>
        </div>

        <Link
          href="/admin/vehicles/new"
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          新增车辆
        </Link>
      </div>

      <form className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950 p-4 md:grid-cols-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="搜索名称（中/英）"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
        />
        <select name="category" defaultValue={category} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
          {categories.map((c) => (
            <option key={c || "all"} value={c}>{c || "全部类别"}</option>
          ))}
        </select>
        <select name="status" defaultValue={status} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
          {statuses.map((s) => (
            <option key={s || "all"} value={s}>{s || "全部状态"}</option>
          ))}
        </select>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" type="submit">
          筛选
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">车型</th>
              <th className="px-4 py-3">类别</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">价格</th>
              <th className="px-4 py-3">创建时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v: Vehicle) => {
              const name = (v.name_i18n as any)?.zh || (v.name_i18n as any)?.en || Object.values(v.name_i18n as any)[0] || "—";
              const price = v.price_range_min
                ? `$${Math.round(Number(v.price_range_min) / 1000)}k${v.price_range_max ? ` - $${Math.round(Number(v.price_range_max) / 1000)}k` : "+"}`
                : "—";
              return (
                <tr key={v.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{name}</td>
                  <td className="px-4 py-3 text-slate-300">{v.category || "-"}</td>
                  <td className="px-4 py-3">{v.status || "-"}</td>
                  <td className="px-4 py-3 text-slate-300">{price}</td>
                  <td className="px-4 py-3 text-slate-400">{v.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/vehicles/${v.id}`} className="text-blue-300 hover:text-blue-200">编辑</Link>
                  </td>
                </tr>
              );
            })}
            {vehicles.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={6}>
                  暂无车辆
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
