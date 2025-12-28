import {redirect} from "next/navigation";
import {ensureRole, getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function fetchDocuments() {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("documents")
    .select("id, title_i18n, category, file_url, file_size, created_at")
    .order("created_at", {ascending: false})
    .limit(200);
  if (error) {
    console.error("admin documents", error);
    return [];
  }
  return data ?? [];
}

async function createDocument(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const titleEn = formData.get("titleEn")?.toString().trim() || "";
  const titleZh = formData.get("titleZh")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || null;
  const fileUrl = formData.get("fileUrl")?.toString().trim() || "";
  const fileSize = formData.get("fileSize")?.toString().trim();
  if (!titleEn && !titleZh) return;
  if (!fileUrl) return;

  const title_i18n: Record<string, string> = {};
  if (titleEn) title_i18n.en = titleEn;
  if (titleZh) title_i18n.zh = titleZh;

  const supabase = getSupabaseServerClient();
  await supabase.from("documents").insert({title_i18n, category, file_url: fileUrl, file_size: fileSize ? Number(fileSize) : null});
  redirect("/admin/documents");
}

async function deleteDocument(formData: FormData) {
  "use server";
  if (!ensureRole("admin")) return;
  const id = formData.get("id")?.toString();
  if (!id) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("documents").delete().eq("id", id);
  redirect("/admin/documents");
}

function formatSize(bytes?: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function AdminDocuments() {
  const [documents, role] = await Promise.all([fetchDocuments(), getRoleFromCookies()]);
  const canEdit = hasRequiredRole(role, "editor");
  const canDelete = hasRequiredRole(role, "admin");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">文档管理{!canEdit ? "（只读）" : ""}</h1>
          <p className="text-sm text-slate-400">当前权限：{role || "未登录"}</p>
        </div>
      </div>

      {canEdit && (
        <form action={createDocument} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">标题（英文）</span>
              <input name="titleEn" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">标题（中文）</span>
              <input name="titleZh" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">类别</span>
              <input name="category" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-slate-300">文件大小（字节）</span>
              <input type="number" name="fileSize" className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
            </label>
          </div>
          <label className="space-y-1 text-sm">
            <span className="text-slate-300">文件 URL</span>
            <input name="fileUrl" required className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" />
          </label>
          <button className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white" type="submit">新增文档</button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">类别</th>
              <th className="px-4 py-3">大小</th>
              <th className="px-4 py-3">创建时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc: any) => {
              const title = (doc.title_i18n?.zh as string) || (doc.title_i18n?.en as string) || "-";
              return (
                <tr key={doc.id} className="border-t border-white/5">
                  <td className="px-4 py-3">
                    <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200">{title}</a>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{doc.category || "-"}</td>
                  <td className="px-4 py-3 text-slate-300">{formatSize(doc.file_size)}</td>
                  <td className="px-4 py-3 text-slate-400">{doc.created_at?.slice(0, 19).replace("T", " ")}</td>
                  <td className="px-4 py-3">
                    {canDelete ? (
                      <form action={deleteDocument}>
                        <input type="hidden" name="id" value={doc.id} />
                        <button className="text-red-300 hover:text-red-200" type="submit">删除</button>
                      </form>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {documents.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={5}>
                  暂无文档
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
