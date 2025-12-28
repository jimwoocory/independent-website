import {redirect} from "next/navigation";
import Image from "next/image";
import {ensureRole, getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";


const categories = ["", "SUV", "Pickup", "Sedan", "EV", "其他"];
const statuses = ["active", "new", "fast"];

async function fetchVehicle(id: string) {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("vehicles")
    .select(
      "id, name_i18n, description_i18n, category, status, price_range_min, price_range_max, vehicle_images(url,is_cover,display_order), certificates(title_i18n,pdf_url,issue_date,expiry_date)"
    )
    .eq("id", id)
    .single();
  if (error || !data) {
    console.error("admin vehicle", error);
    return null;
  }
  return data;
}

async function updateVehicle(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const id = formData.get("id")?.toString();
  if (!id) return;
  const nameEn = formData.get("nameEn")?.toString() || "";
  const nameZh = formData.get("nameZh")?.toString() || "";
  const descEn = formData.get("descEn")?.toString() || "";
  const descZh = formData.get("descZh")?.toString() || "";
  const category = formData.get("category")?.toString() || "";
  const status = formData.get("status")?.toString() || "active";
  const priceMin = Number(formData.get("priceMin")) || null;
  const priceMax = Number(formData.get("priceMax")) || null;
  const name_i18n: any = {};
  if (nameEn) name_i18n.en = nameEn;
  if (nameZh) name_i18n.zh = nameZh;
  const description_i18n: any = {};
  if (descEn) description_i18n.en = descEn;
  if (descZh) description_i18n.zh = descZh;
  const supabase = getSupabaseServerClient();
  await supabase
    .from("vehicles")
    .update({name_i18n, description_i18n, category, status, price_range_min: priceMin, price_range_max: priceMax})
    .eq("id", id);
  redirect(`/admin/vehicles/${id}`);
}


async function deleteVehicle(formData: FormData) {
  "use server";
  if (!ensureRole("admin")) return;
  const id = formData.get("id")?.toString();
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("vehicles").delete().eq("id", id);
  redirect("/admin/vehicles");
}


async function addImage(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const vehicleId = formData.get("vehicleId")?.toString();
  const url = formData.get("url")?.toString();
  const isCover = formData.get("isCover") === "on";
  const displayOrder = formData.get("displayOrder")?.toString();
  if (!vehicleId || !url) return;
  const supabase = getSupabaseServerClient();
  if (isCover) {
    await supabase.from("vehicle_images").update({is_cover: false}).eq("vehicle_id", vehicleId);
  }
  await supabase.from("vehicle_images").insert({vehicle_id: vehicleId, url, is_cover: isCover, display_order: displayOrder ? Number(displayOrder) : null});
  redirect(`/admin/vehicles/${vehicleId}`);
}


async function addCert(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const vehicleId = formData.get("vehicleId")?.toString();
  const title = formData.get("title")?.toString();
  const pdfUrl = formData.get("pdfUrl")?.toString();
  const issueDate = formData.get("issueDate")?.toString();
  const expiryDate = formData.get("expiryDate")?.toString();
  if (!vehicleId || !title) return;
  const supabase = getSupabaseServerClient();
  await supabase
    .from("certificates")
    .insert({vehicle_id: vehicleId, title_i18n: {en: title}, pdf_url: pdfUrl ?? null, issue_date: issueDate || null, expiry_date: expiryDate || null});
  redirect(`/admin/vehicles/${vehicleId}`);
}


export default async function AdminVehicleDetail({params}: {params: {id: string}}) {
  const vehicle = await fetchVehicle(params.id);
  if (!vehicle) {
    return <div className="text-slate-200">未找到车辆</div>;
  }
  const name = (vehicle.name_i18n as any)?.zh || (vehicle.name_i18n as any)?.en || "车辆";
  const role = getRoleFromCookies();
  const canEdit = hasRequiredRole(role, "editor");
  const canDelete = hasRequiredRole(role, "admin");

  return (

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">编辑车辆：{name}{!canEdit ? "（只读）" : ""}</h1>
          <p className="text-sm text-slate-400">当前权限：{role || "未登录"}</p>
        </div>
        <form action={deleteVehicle} onSubmit={(e) => { if (!confirm("确定删除该车辆？")) e.preventDefault(); }}>

          <input type="hidden" name="id" value={vehicle.id} />
          <button
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={!canDelete}
          >
            删除车辆
          </button>
        </form>

      </div>

      <form action={updateVehicle} className="space-y-4 rounded-2xl border border-white/10 bg-slate-950 p-6">
        <input type="hidden" name="id" value={vehicle.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">名称（英文）</span>
            <input name="nameEn" defaultValue={(vehicle.name_i18n as any)?.en || ""} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">名称（中文）</span>
            <input name="nameZh" defaultValue={(vehicle.name_i18n as any)?.zh || ""} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（英文）</span>
            <textarea name="descEn" defaultValue={(vehicle.description_i18n as any)?.en || ""} rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（中文）</span>
            <textarea name="descZh" defaultValue={(vehicle.description_i18n as any)?.zh || ""} rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">类别</span>
            <select name="category" defaultValue={vehicle.category ?? ""} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              {categories.map((c) => (
                <option key={c || "all"} value={c}>{c || "未选择"}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">状态</span>
            <select name="status" defaultValue={vehicle.status ?? "active"} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">最低价</span>
            <input type="number" name="priceMin" defaultValue={vehicle.price_range_min ?? ""} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">最高价</span>
            <input type="number" name="priceMax" defaultValue={vehicle.price_range_max ?? ""} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
        </div>
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={!canEdit}
        >
          保存
        </button>

      </form>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">图片</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vehicle.vehicle_images?.map((img: any, idx: number) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-300">
                  <span>{img.is_cover ? "封面" : ""}</span>
                  <span className="text-slate-500">{img.display_order ?? "-"}</span>
                </div>
                {img.url ? (
                  <div className="relative h-28 w-full">
                    <Image 
                      src={img.url} 
                      alt="Vehicle" 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="h-28" />
                )}
              </div>
            ))}
            {(!vehicle.vehicle_images || vehicle.vehicle_images.length === 0) && <p className="text-sm text-slate-400">暂无图片</p>}
          </div>
          <form action={addImage} className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
            <input type="hidden" name="vehicleId" value={vehicle.id} />
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">图片 URL</span>
              <input name="url" required className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">显示顺序</span>
              <input name="displayOrder" type="number" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" name="isCover" className="h-4 w-4 rounded border border-white/20 bg-black/40" />
              设为封面
            </label>
            <button
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!canEdit}
            >
              添加图片
            </button>

          </form>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">证书</h2>
          </div>
          <div className="space-y-2">
            {vehicle.certificates?.map((c: any, idx: number) => (
              <div key={idx} className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-semibold">{(c.title_i18n as any)?.en || "证书"}</div>
                    <div className="text-xs text-slate-400">{c.issue_date || ""} {c.expiry_date ? `→ ${c.expiry_date}` : ""}</div>
                  </div>
                  {c.pdf_url && (
                    <a href={c.pdf_url} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 text-xs">查看</a>
                  )}
                </div>
              </div>
            ))}
            {(!vehicle.certificates || vehicle.certificates.length === 0) && <p className="text-sm text-slate-400">暂无证书</p>}
          </div>
          <form action={addCert} className="space-y-2 rounded-lg border border-white/10 bg-black/30 p-3">
            <input type="hidden" name="vehicleId" value={vehicle.id} />
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">标题（英文）</span>
              <input name="title" required className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">PDF URL</span>
              <input name="pdfUrl" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <div className="grid gap-2 md:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="text-slate-300">签发日期</span>
                <input type="date" name="issueDate" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
              </label>
              <label className="space-y-1 text-sm">
                <span className="text-slate-300">到期日期</span>
                <input type="date" name="expiryDate" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
              </label>
            </div>
            <button
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={!canEdit}
            >
              添加证书
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
