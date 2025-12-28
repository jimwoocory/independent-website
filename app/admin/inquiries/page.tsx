import {ensureRole} from "@/lib/admin-auth";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// 定义询价数据类型
interface Inquiry {
  id: string;
  contact_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  quantity: number | null;
  status: string | null;
  created_at: string | null;
  vehicle_id: string | null;
}

const statuses = ["new", "processing", "done"];

async function fetchInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("inquiries")
    .select("id, contact_name, email, phone, country, quantity, status, created_at, vehicle_id")
    .order("created_at", {ascending: false})
    .limit(50);
  if (error) {
    console.error("admin inquiries", error);
    return [];
  }
  return (data as Inquiry[]) ?? [];
}

async function updateStatus(formData: FormData) {
  "use server";
  if (!ensureRole("editor")) return;
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();
  if (!id || !status) return;
  const supabase = getSupabaseServerClient();
  await supabase.from("inquiries").update({status}).eq("id", id);
}


export default async function AdminInquiries() {
  const inquiries = await fetchInquiries();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
        <h1 className="text-2xl font-semibold">询价管理</h1>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow">
        <table className="w-full text-sm text-slate-100">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">联系人</th>
              <th className="px-4 py-3">邮箱</th>
              <th className="px-4 py-3">电话</th>
              <th className="px-4 py-3">国家</th>
              <th className="px-4 py-3">数量</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">时间</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((q: Inquiry) => (
              <tr key={q.id} className="border-t border-white/5">
                <td className="px-4 py-3">{q.contact_name}</td>
                <td className="px-4 py-3 text-slate-300">{q.email}</td>
                <td className="px-4 py-3 text-slate-300">{q.phone || "-"}</td>
                <td className="px-4 py-3 text-slate-300">{q.country || "-"}</td>
                <td className="px-4 py-3 text-slate-300">{q.quantity ?? "-"}</td>
                <td className="px-4 py-3">
                  <form action={updateStatus} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={q.id} />
                    <select name="status" defaultValue={q.status || "new"} className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white">
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button className="rounded border border-white/20 px-2 py-1 text-xs text-slate-100 hover:border-white/40" type="submit">
                      更新
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-slate-400">{q.created_at?.slice(0, 19).replace("T", " ")}</td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-center text-slate-400" colSpan={7}>
                  暂无询价
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
