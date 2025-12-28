import {redirect} from "next/navigation";
import {ensureRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const statuses = ["open", "closed", "draft"];

async function createJob(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const titleEn = formData.get("titleEn")?.toString().trim() || "";
  const titleZh = formData.get("titleZh")?.toString().trim() || "";
  if (!titleEn && !titleZh) return;
  const descEn = formData.get("descEn")?.toString().trim() || "";
  const descZh = formData.get("descZh")?.toString().trim() || "";
  const location = formData.get("location")?.toString().trim() || null;
  const employmentType = formData.get("employmentType")?.toString().trim() || null;
  const reqEn = formData.get("reqEn")?.toString().trim() || "";
  const reqZh = formData.get("reqZh")?.toString().trim() || "";
  const status = formData.get("status")?.toString().trim() || "open";

  const title_i18n: Record<string, string> = {};
  if (titleEn) title_i18n.en = titleEn;
  if (titleZh) title_i18n.zh = titleZh;
  const description_i18n: Record<string, string> = {};
  if (descEn) description_i18n.en = descEn;
  if (descZh) description_i18n.zh = descZh;
  const requirements_i18n: Record<string, string> = {};
  if (reqEn) requirements_i18n.en = reqEn;
  if (reqZh) requirements_i18n.zh = reqZh;

  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("jobs")
    .insert({title_i18n, description_i18n, location, employment_type: employmentType, requirements_i18n, status})
    .select("id")
    .single();
  if (error) {
    console.error("create job", error);
    return;
  }
  redirect(`/admin/jobs/${data.id}`);
}

export default function NewJob() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
        <h1 className="text-2xl font-semibold">新增职位</h1>
      </div>

      <form action={createJob} className="space-y-4 rounded-2xl border border-white/10 bg-slate-950 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">标题（英文）</span>
            <input name="titleEn" required className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">标题（中文）</span>
            <input name="titleZh" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
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
            <span className="text-slate-300">地点</span>
            <input name="location" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">雇佣类型</span>
            <input name="employmentType" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">任职要求（英文）</span>
            <textarea name="reqEn" rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">任职要求（中文）</span>
            <textarea name="reqZh" rows={3} className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">状态</span>
            <select name="status" defaultValue="open" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white">
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" type="submit">
          创建
        </button>
      </form>
    </div>
  );
}
