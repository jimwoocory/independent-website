import Link from "next/link";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function fetchJobs() {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("jobs")
    .select("id, title_i18n, location, employment_type, status, created_at")
    .order("created_at", {ascending: false})
    .limit(200);
  if (error) {
    console.error("admin jobs", error);
    return [];
  }
  return data ?? [];
}

export default async function AdminJobs() {
  const [jobs, role] = await Promise.all([fetchJobs(), getRoleFromCookies()]);
  const canEdit = hasRequiredRole(role, "editor");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">职位管理{!canEdit ? "（只读）" : ""}</h1>
          <p className="text-sm text-slate-400">当前权限：{role || "未登录"}</p>
        </div>
        {canEdit && (
          <Link href="/admin/jobs/new" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            新增职位
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">地点</th>
              <th className="px-4 py-3">类型</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job: any) => {
              const title = (job.title_i18n?.zh as string) || (job.title_i18n?.en as string) || "-";
              return (
                <tr key={job.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{title}</td>
                  <td className="px-4 py-3 text-slate-300">{job.location || "-"}</td>
                  <td className="px-4 py-3 text-slate-300">{job.employment_type || "-"}</td>
                  <td className="px-4 py-3">{job.status || "open"}</td>
                  <td className="px-4 py-3 text-slate-400">{job.created_at?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    {canEdit ? (
                      <Link href={`/admin/jobs/${job.id}`} className="text-blue-300 hover:text-blue-200">编辑</Link>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {jobs.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={6}>
                  暂无职位
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
