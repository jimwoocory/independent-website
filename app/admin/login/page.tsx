import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminLogin({searchParams}: {searchParams?: {error?: string}}) {
  const error = searchParams?.error;
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-blue-300/70">后台</p>
          <h1 className="text-2xl font-semibold">后台登录</h1>
          <p className="text-sm text-slate-400">请输入管理员 / 编辑 / 查看密码访问后台</p>

        </div>

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">密码错误，请重试</div>
        )}
        <form method="POST" action="/api/admin/login" className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="password">密码</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
              placeholder="管理员密码"

            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            登录
          </button>
        </form>
        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="text-blue-300 hover:text-blue-200">返回首页</Link>
        </div>
      </div>
    </main>
  );
}
