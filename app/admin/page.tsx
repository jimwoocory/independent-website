import Link from "next/link";

export const dynamic = "force-dynamic";

const cards = [
  {title: "数据仪表盘", desc: "查看统计数据与快捷操作", href: "/admin/dashboard", featured: true},
  {title: "车辆管理", desc: "新增 / 编辑车辆、图片与证书", href: "/admin/vehicles"},
  {title: "询价管理", desc: "查看客户询价与状态", href: "/admin/inquiries"},
  {title: "文档资料", desc: "管理 documents 下载与分类", href: "/admin/documents"},
  {title: "职位发布", desc: "发布 / 编辑 jobs", href: "/admin/jobs"},
  {title: "职位投递", desc: "查看并更新 job applications", href: "/admin/job-applications"},
];


export default function AdminHome() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
            <h1 className="text-3xl font-semibold">控制台</h1>
            <p className="text-sm text-slate-400">管理车辆、证书、询价数据</p>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/10">
              退出登录
            </button>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`rounded-2xl border p-4 shadow-lg transition ${
                c.featured
                  ? "border-blue-500/50 bg-gradient-to-br from-blue-500/20 to-blue-600/10 hover:border-blue-400 hover:shadow-blue-500/20"
                  : "border-white/10 bg-slate-950 hover:border-white/30 hover:bg-slate-900"
              }`}
            >
              <div className={`text-lg font-semibold ${c.featured ? "text-blue-100" : "text-white"}`}>{c.title}</div>
              <p className={`text-sm ${c.featured ? "text-blue-200" : "text-slate-400"}`}>{c.desc}</p>
              {c.featured && (
                <div className="mt-2 inline-block rounded-full bg-blue-400/20 px-2 py-0.5 text-xs font-semibold text-blue-100">
                  推荐
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

