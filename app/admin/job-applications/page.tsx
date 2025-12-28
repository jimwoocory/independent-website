import {ensureRole, getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const statuses = ["new", "reviewing", "contacted", "rejected", "hired"];

async function fetchApplications() {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("job_applications")
    .select("id, job_id, applicant_name, email, phone, status, applied_at, jobs(title_i18n)")
    .order("applied_at", {ascending: false})
    .limit(200);
  if (error) {
    console.error("admin job applications", error);
    return [];
  }
  return data ?? [];
}

async function updateStatus(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || !status) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("job_applications").update({status}).eq("id", id);
}

export default async function AdminJobApplications() {
  const [applications, role] = await Promise.all([fetchApplications(), getRoleFromCookies()]);
  const canEdit = hasRequiredRole(role, "editor");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
        <h1 className="text-2xl font-semibold">职位投递{!canEdit ? "（只读）" : ""}</h1>
        <p className="text-sm text-slate-400">当前权限：{role || "未登录"}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">职位</th>
              <th className="px-4 py-3">姓名</th>
              <th className="px-4 py-3">联系方式</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">时间</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app: any) => {
              const title = (app.jobs?.title_i18n?.zh as string) || (app.jobs?.title_i18n?.en as string) || "-";
              return (
                <tr key={app.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-slate-100">{title}</td>
                  <td className="px-4 py-3">{app.applicant_name}</td>
                  <td className="px-4 py-3 text-slate-300">{app.email}{app.phone ? ` / ${app.phone}` : ""}</td>
                  <td className="px-4 py-3">
                    <form action={updateStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={app.id} />
                      <select
                        name="status"
                        defaultValue={app.status || "new"}
                        className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                        disabled={!canEdit}
                      >
                        {statuses.map((s) => (
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
                  </td>
                  <td className="px-4 py-3 text-slate-400">{app.applied_at?.slice(0, 19).replace("T", " ")}</td>
                </tr>
              );
            })}
            {applications.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={5}>
                  暂无投递
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
