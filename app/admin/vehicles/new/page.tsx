import {redirect} from "next/navigation";
import {ensureRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const categories = ["SUV", "Pickup", "Sedan", "EV", "其他"];
const statuses = ["active", "new", "fast"];

async function createVehicle(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const supabase = getSupabaseServerClient();
  const nameEn = formData.get("nameEn")?.toString().trim() || "";
  const nameZh = formData.get("nameZh")?.toString().trim() || "";
  const descEn = formData.get("descEn")?.toString().trim() || "";
  const descZh = formData.get("descZh")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const status = formData.get("status")?.toString().trim() || "active";
  const priceMin = Number(formData.get("priceMin")) || null;
  const priceMax = Number(formData.get("priceMax")) || null;
  if (!nameEn && !nameZh) return;

  const name_i18n: any = {};
  if (nameEn) name_i18n.en = nameEn;
  if (nameZh) name_i18n.zh = nameZh;
  const description_i18n: any = {};
  if (descEn) description_i18n.en = descEn;
  if (descZh) description_i18n.zh = descZh;

  const {error, data} = await supabase
    .from("vehicles")
    .insert({name_i18n, description_i18n, category, status, price_range_min: priceMin, price_range_max: priceMax})
    .select("id")
    .single();
  if (error) {
    console.error("create vehicle", error);
    return;
  }
  redirect(`/admin/vehicles/${data.id}`);
}


export default function NewVehicle() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
        <h1 className="text-2xl font-semibold">新增车辆</h1>
      </div>

      <form action={createVehicle} className="space-y-4 rounded-2xl border border-white/10 bg-slate-950 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">名称（英文）</span>
            <input name="nameEn" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">名称（中文）</span>
            <input name="nameZh" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（英文）</span>
            <textarea name="descEn" rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（中文）</span>
            <textarea name="descZh" rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">类别</span>
            <select name="category" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              <option value="">未选择</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">状态</span>
            <select name="status" defaultValue="active" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">最低价</span>
            <input type="number" name="priceMin" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">最高价</span>
            <input type="number" name="priceMax" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
        </div>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" type="submit">
          创建
        </button>
      </form>
    </div>
  );
}
