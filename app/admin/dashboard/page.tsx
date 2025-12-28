import {getSupabaseServerClient} from "@/lib/supabase/server";
import {Car, FileText, Briefcase, MessageSquare, TrendingUp, Clock} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 定义数据类型接口
interface VehicleData {
  id: string;
  status: string;
  created_at: string | null;
}

interface InquiryData {
  id: string;
  status: string;
  created_at: string | null;
}

interface JobData {
  id: string;
  status: string;
}

interface ApplicationData {
  id: string;
  status: string;
}

async function getDashboardStats() {
  const supabase = getSupabaseServerClient();

  try {
    // 并行获取所有统计数据
    const [vehiclesRes, docsRes, jobsRes, appsRes, inquiriesRes] = await Promise.all([
      supabase.from("vehicles").select("id, status, created_at", {count: "exact"}),
      supabase.from("documents").select("id", {count: "exact"}),
      supabase.from("jobs").select("id, status", {count: "exact"}),
      supabase.from("job_applications").select("id, status", {count: "exact"}),
      supabase.from("inquiries").select("id, status, created_at", {count: "exact"}),
    ]);

    // 车辆统计
    const totalVehicles = vehiclesRes.count ?? 0;
    const activeVehicles = vehiclesRes.data?.filter((v: VehicleData) => v.status === "active").length ?? 0;
    const newVehicles = vehiclesRes.data?.filter((v: VehicleData) => v.status === "new").length ?? 0;

    // 最近7天新增车辆
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentVehicles = vehiclesRes.data?.filter((v: VehicleData) => v.created_at && new Date(v.created_at) >= sevenDaysAgo).length ?? 0;

    // 询价统计
    const totalInquiries = inquiriesRes.count ?? 0;
    const pendingInquiries = inquiriesRes.data?.filter((i: InquiryData) => i.status === "new" || i.status === "pending").length ?? 0;
    const recentInquiries = inquiriesRes.data?.filter((i: InquiryData) => i.created_at && new Date(i.created_at) >= sevenDaysAgo).length ?? 0;

    // 职位统计
    const totalJobs = jobsRes.count ?? 0;
    const activeJobs = jobsRes.data?.filter((j: JobData) => j.status === "active").length ?? 0;
    const totalApplications = appsRes.count ?? 0;
    const pendingApps = appsRes.data?.filter((a: ApplicationData) => a.status === "pending" || a.status === "new").length ?? 0;

    return {
      vehicles: {total: totalVehicles, active: activeVehicles, new: newVehicles, recent: recentVehicles},
      inquiries: {total: totalInquiries, pending: pendingInquiries, recent: recentInquiries},
      jobs: {total: totalJobs, active: activeJobs},
      applications: {total: totalApplications, pending: pendingApps},
      documents: {total: docsRes.count ?? 0},
    };
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return {
      vehicles: {total: 0, active: 0, new: 0, recent: 0},
      inquiries: {total: 0, pending: 0, recent: 0},
      jobs: {total: 0, active: 0},
      applications: {total: 0, pending: 0},
      documents: {total: 0},
    };
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      title: "车辆总数",
      value: stats.vehicles.total,
      subtitle: `${stats.vehicles.active} 在售 · ${stats.vehicles.new} 新品`,
      icon: Car,
      color: "blue",
      href: "/admin/vehicles",
      badge: stats.vehicles.recent > 0 ? `+${stats.vehicles.recent} (7天)` : null,
    },
    {
      title: "待处理询价",
      value: stats.inquiries.pending,
      subtitle: `${stats.inquiries.total} 总询价`,
      icon: MessageSquare,
      color: "red",
      href: "/admin/inquiries",
      badge: stats.inquiries.recent > 0 ? `+${stats.inquiries.recent} 新` : null,
    },
    {
      title: "招聘职位",
      value: stats.jobs.active,
      subtitle: `${stats.jobs.total} 总职位`,
      icon: Briefcase,
      color: "emerald",
      href: "/admin/jobs",
    },
    {
      title: "职位申请",
      value: stats.applications.pending,
      subtitle: `${stats.applications.total} 总申请`,
      icon: TrendingUp,
      color: "amber",
      href: "/admin/job-applications",
    },
    {
      title: "文档资料",
      value: stats.documents.total,
      subtitle: "可下载文件",
      icon: FileText,
      color: "indigo",
      href: "/admin/documents",
    },
  ];

  const quickActions = [
    {label: "添加车辆", href: "/admin/vehicles/new", color: "blue"},
    {label: "查看询价", href: "/admin/inquiries", color: "red"},
    {label: "发布职位", href: "/admin/jobs/new", color: "emerald"},
    {label: "管理文档", href: "/admin/documents", color: "indigo"},
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 页头 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">管理后台</p>
            <h1 className="text-4xl font-bold">数据仪表盘</h1>
            <p className="mt-1 text-sm text-slate-400">实时统计与快捷操作</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin" className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/10">
              返回控制台
            </Link>
            <form action="/api/admin/logout" method="POST">
              <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/10">
                退出登录
              </button>
            </form>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            const colorClasses = {
              blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
              red: "from-red-500/20 to-red-600/10 border-red-500/30",
              emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
              amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
              indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
            };

            return (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-xl transition hover:shadow-2xl ${
                  colorClasses[card.color as keyof typeof colorClasses]
                }`}
              >
                {card.badge && (
                  <div className="absolute right-4 top-4 rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                    {card.badge}
                  </div>
                )}
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">{card.title}</h3>
                </div>
                <div className="text-4xl font-bold text-white">{card.value}</div>
                <p className="mt-2 text-sm text-slate-300">{card.subtitle}</p>
                <div className="mt-4 text-xs text-slate-400 transition group-hover:text-slate-200">点击查看详情 →</div>
              </Link>
            );
          })}
        </div>

        {/* 快捷操作 */}
        <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-300" />
            <h2 className="text-lg font-semibold text-white">快捷操作</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => {
              const colorMap = {
                blue: "border-blue-500/50 hover:bg-blue-500/20 hover:border-blue-400",
                red: "border-red-500/50 hover:bg-red-500/20 hover:border-red-400",
                emerald: "border-emerald-500/50 hover:bg-emerald-500/20 hover:border-emerald-400",
                indigo: "border-indigo-500/50 hover:bg-indigo-500/20 hover:border-indigo-400",
              };

              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`rounded-lg border bg-black/40 px-4 py-3 text-center text-sm font-semibold text-white transition ${
                    colorMap[action.color as keyof typeof colorMap]
                  }`}
                >
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 系统提示 */}
        {stats.inquiries.pending > 0 && (
          <div className="rounded-xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-600/10 p-4">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-red-300" />
              <div>
                <h3 className="font-semibold text-red-100">待处理询价提醒</h3>
                <p className="mt-1 text-sm text-red-200">
                  您有 <strong>{stats.inquiries.pending}</strong> 条未处理询价，请及时响应客户需求。
                </p>
                <Link href="/admin/inquiries" className="mt-2 inline-block text-sm font-semibold text-red-100 underline">
                  立即处理 →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
