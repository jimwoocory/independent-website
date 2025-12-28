import Link from "next/link";
import Image from "next/image";
import {ArrowRight, CheckCircle2} from "lucide-react";
import {useTranslations} from "@/lib/translations";
import {Button} from "@/components/ui/button";
import {LanguageSwitcher} from "@/components/language-switcher";
import {FavoritesCount} from "@/components/favorites-count";

export const revalidate = 3600; // 1小时缓存

const solutions = [
  {
    id: "africa",
    icon: "🌍",
    color: "from-amber-500/20 to-orange-600/10",
    borderColor: "border-amber-500/30",
    image: "https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "middle-east",
    icon: "🏜️",
    color: "from-blue-500/20 to-cyan-600/10",
    borderColor: "border-blue-500/30",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "south-america",
    icon: "🌎",
    color: "from-emerald-500/20 to-green-600/10",
    borderColor: "border-emerald-500/30",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "southeast-asia",
    icon: "🌏",
    color: "from-purple-500/20 to-violet-600/10",
    borderColor: "border-purple-500/30",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "rental-fleet",
    icon: "🚕",
    color: "from-red-500/20 to-rose-600/10",
    borderColor: "border-red-500/30",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "mining-industry",
    icon: "⛏️",
    color: "from-slate-500/20 to-gray-600/10",
    borderColor: "border-slate-500/30",
    image: "https://images.unsplash.com/photo-1586864387634-b28836d89f7d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function SolutionsPage({params}: {params: {locale: string}}) {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <Link href={`/${params.locale}`} className="text-lg font-semibold text-white">
            {t("brand.name")}
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm text-slate-200 md:flex">
            <Link href={`/${params.locale}#hero`} className="transition hover:text-white">
              {t("nav.home")}
            </Link>
            <Link href={`/${params.locale}#featured`} className="transition hover:text-white">
              {t("nav.vehicles")}
            </Link>
            <Link href={`/${params.locale}/solutions`} className="font-semibold text-blue-400">
              {t("nav.solutions")}
            </Link>
            <Link href={`/${params.locale}#services`} className="transition hover:text-white">
              {t("nav.services")}
            </Link>
            <Link href={`/${params.locale}#contact`} className="transition hover:text-white">
              {t("nav.contact")}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <FavoritesCount locale={params.locale} />
            <LanguageSwitcher current={params.locale} />
          </div>
        </div>
      </header>

      {/* Hero区域 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 via-slate-950 to-black py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="container relative mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-block rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-200">
              {t("solutions.badge")}
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t("solutions.hero.title")}
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">{t("solutions.hero.subtitle")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Button size="lg" asChild>
                <Link href={`/${params.locale}#contact`}>{t("solutions.hero.cta")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-700 text-slate-100" asChild>
                <Link href={`/${params.locale}#featured`}>{t("solutions.hero.browse")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 解决方案网格 */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white lg:text-4xl">{t("solutions.grid.title")}</h2>
            <p className="mt-3 text-slate-300">{t("solutions.grid.subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <Link
                key={solution.id}
                href={`/${params.locale}/solutions/${solution.id}`}
                className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 shadow-xl transition hover:scale-[1.02] hover:shadow-2xl ${solution.color} ${solution.borderColor}`}
              >
                {/* 背景图片 */}
                <div className="absolute inset-0 opacity-10 transition group-hover:opacity-20">
                  <Image src={solution.image} alt="" fill className="object-cover" sizes="400px" />
                </div>

                {/* 内容 */}
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{solution.icon}</div>
                    <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{t(`solutions.${solution.id}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{t(`solutions.${solution.id}.desc`)}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                      >
                        {t(`solutions.${solution.id}.tag${i}`)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 为什么选择我们 */}
      <section className="border-t border-white/5 bg-slate-950/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">{t("solutions.why.title")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="mb-2 font-semibold text-white">{t(`solutions.why.point${i}.title`)}</h3>
                    <p className="text-sm text-slate-300">{t(`solutions.why.point${i}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA区域 */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-indigo-600/20 p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white lg:text-4xl">{t("solutions.cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">{t("solutions.cta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href={`/${params.locale}#contact`}>{t("solutions.cta.primary")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-50" asChild>
                <a href="https://wa.me/8613800000000" target="_blank" rel="noreferrer">
                  {t("solutions.cta.secondary")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-white/5 bg-slate-950 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-slate-400">
          <p>{t("footer.rights")}</p>
        </div>
      </footer>
    </main>
  );
}
