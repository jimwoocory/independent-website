import Link from "next/link";
import type {ReactNode} from "react";

export const dynamic = "force-dynamic";

const nav = [
  {href: "/admin", label: "总览"},
  {href: "/admin/vehicles", label: "车辆"},
  {href: "/admin/documents", label: "文档"},
  {href: "/admin/jobs", label: "职位"},
  {href: "/admin/job-applications", label: "投递"},
  {href: "/admin/inquiries", label: "询价"},
];


export default function AdminLayout({children}: {children: ReactNode}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-lg font-semibold">后台控制台</div>
          <nav className="flex items-center gap-4 text-sm text-slate-200">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-2 py-1 hover:bg-white/10">
                {item.label}
              </Link>
            ))}
            <form action="/api/admin/logout" method="POST">
              <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/10">
                退出登录
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}

