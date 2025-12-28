import {redirect} from "next/navigation";
import {ensureRole, getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const statuses = ["open", "closed", "draft"];
const applicationStatuses = ["new", "reviewing", "contacted", "rejected", "hired"];

async function fetchJob(id: string) {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("jobs")
    .select(
      "id, title_i18n, description_i18n, requirements_i18n, location, employment_type, status, created_at, job_applications(id, applicant_name, email, phone, status, applied_at)"
    )
    .eq("id", id)
    .single();
  if (error || !data) {
    console.error("admin job detail", error);
    return null;
  }
  return data;
}

async function updateJob(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const id = formData.get("id")?.toString();
  if (!id) return;
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
  await supabase
    .from("jobs")
    .update({title_i18n, description_i18n, location, employment_type: employmentType, requirements_i18n, status})
    .eq("id", id);
  redirect(`/admin/jobs/${id}`);
}

async function deleteJob(formData: FormData) {
  "use server";
  if (!ensureRole("admin")) return;
  const id = formData.get("id")?.toString();
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("jobs").delete().eq("id", id);
  redirect("/admin/jobs");
}

async function updateApplicationStatus(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  const jobId = formData.get("jobId")?.toString();
  if (!id || !status || !jobId) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("job_applications").update({status}).eq("id", id);
  redirect(`/admin/jobs/${jobId}`);
}

export default async function AdminJobDetail({params}: {params: {id: string}}) {
  const job = await fetchJob(params.id);
  if (!job) return <div className="text-slate-200">未找到职位</div>;
  const role = getRoleFromCookies();
  const canEdit = hasRequiredRole(role, "editor");
  const canDelete = hasRequiredRole(role, "admin");
  const title = (job.title_i18n as any)?.zh || (job.title_i18n as any)?.en || "职位";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">编辑职位：{title}{!canEdit ? "（只读）" : ""}</h1>
          <p className="text-sm text-slate-400">当前权限：{role || "未登录"}</p>
        </div>
        <form action={deleteJob} onSubmit={(e) => { if (!confirm("确定删除该职位？")) e.preventDefault(); }}>
          <input type="hidden" name="id" value={job.id} />
          <button
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100 hover:border-red-400 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={!canDelete}
          >
            删除职位
          </button>
        </form>
      </div>

      <form action={updateJob} className="space-y-4 rounded-2xl border border-white/10 bg-slate-950 p-6">
        <input type="hidden" name="id" value={job.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">标题（英文）</span>
            <input
              name="titleEn"
              defaultValue={(job.title_i18n as any)?.en || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">标题（中文）</span>
            <input
              name="titleZh"
              defaultValue={(job.title_i18n as any)?.zh || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（英文）</span>
            <textarea
              name="descEn"
              rows={3}
              defaultValue={(job.description_i18n as any)?.en || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">描述（中文）</span>
            <textarea
              name="descZh"
              rows={3}
              defaultValue={(job.description_i18n as any)?.zh || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">地点</span>
            <input
              name="location"
              defaultValue={job.location || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">雇佣类型</span>
            <input
              name="employmentType"
              defaultValue={job.employment_type || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">任职要求（英文）</span>
            <textarea
              name="reqEn"
              rows={3}
              defaultValue={(job.requirements_i18n as any)?.en || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm md:col-span-2">
            <span className="text-slate-300">任职要求（中文）</span>
            <textarea
              name="reqZh"
              rows={3}
              defaultValue={(job.requirements_i18n as any)?.zh || ""}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">状态</span>
            <select
              name="status"
              defaultValue={job.status || "open"}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white"
              disabled={!canEdit}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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

      <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">职位投递</h2>
        </div>
        <div className="space-y-2">
          {job.job_applications?.map((app: any) => (
            <div key={app.id} className="rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-slate-100">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">{app.applicant_name}</div>
                  <div className="text-xs text-slate-400">{app.email} {app.phone ? `· ${app.phone}` : ""}</div>
                  <div className="text-xs text-slate-400">{app.applied_at?.slice(0, 19).replace("T", " ")}</div>
                </div>
                <form action={updateApplicationStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={app.id} />
                  <input type="hidden" name="jobId" value={job.id} />
                  <select
                    name="status"
                    defaultValue={app.status || "new"}
                    className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                    disabled={!canEdit}
                  >
                    {applicationStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className="rounded border border-white/20 px-2 py-1 text-xs text-slate-100 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                    type="submit"
                    disabled={!canEdit}
                  >
                    更新
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(!job.job_applications || job.job_applications.length === 0) && <p className="text-sm text-slate-400">暂无投递</p>}
        </div>
      </div>
    </div>
  );
}
