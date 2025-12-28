import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, CheckCircle2, TrendingUp, Users, Globe, Shield} from "lucide-react";
import {useTranslations} from "@/lib/translations";
import {Button} from "@/components/ui/button";
import {LanguageSwitcher} from "@/components/language-switcher";
import {FavoritesCount} from "@/components/favorites-count";
import {notFound} from "next/navigation";

export const revalidate = 3600;

const validSolutionIds = [
  "africa",
  "middle-east",
  "south-america",
  "southeast-asia",
  "rental-fleet",
  "mining-industry",
];

const solutionMeta = {
  africa: {
    icon: "🌍",
    color: "from-amber-500/20 to-orange-600/10",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-400",
    image: "https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?auto=format&fit=crop&w=1200&q=80",
  },
  "middle-east": {
    icon: "🏜️",
    color: "from-blue-500/20 to-cyan-600/10",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80",
  },
  "south-america": {
    icon: "🌎",
    color: "from-emerald-500/20 to-green-600/10",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-400",
    image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80",
  },
  "southeast-asia": {
    icon: "🌏",
    color: "from-purple-500/20 to-violet-600/10",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-400",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  },
  "rental-fleet": {
    icon: "🚕",
    color: "from-red-500/20 to-rose-600/10",
    borderColor: "border-red-500/30",
    accentColor: "text-red-400",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  },
  "mining-industry": {
    icon: "⛏️",
    color: "from-slate-500/20 to-gray-600/10",
    borderColor: "border-slate-500/30",
    accentColor: "text-slate-400",
    image: "https://images.unsplash.com/photo-1586864387634-b28836d89f7d?auto=format&fit=crop&w=1200&q=80",
  },
};

export default function SolutionDetailPage({params}: {params: {locale: string; id: string}}) {
  const t = useTranslations();
  const {id} = params;

  if (!validSolutionIds.includes(id)) {
    notFound();
  }

  const meta = solutionMeta[id as keyof typeof solutionMeta];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <Link href={`/${params.locale}`} className="text-lg font-semibold text-white">
            {t("brand.name")}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href={`/${params.locale}/solutions`}
              className="hidden text-sm text-slate-300 transition hover:text-white md:block"
            >
              {t("nav.solutions")}
            </Link>
            <FavoritesCount locale={params.locale} />
            <LanguageSwitcher current={params.locale} />
          </div>
        </div>
      </header>

      {/* Hero区域 */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0 opacity-20">
          <Image src={meta.image} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />

        <div className="container relative mx-auto px-6">
          <Link
            href={`/${params.locale}/solutions`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("solutions.detail.back")}
          </Link>

          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-7xl">{meta.icon}</div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {t(`solutions.${id}.title`)}
            </h1>
            <p className="text-lg text-slate-300 md:text-xl">{t(`solutions.${id}.longDesc`)}</p>
          </div>
        </div>
      </section>

      {/* 核心优势 */}
      <section className="border-t border-white/5 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">{t("solutions.detail.advantages")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => {
                const icons = [TrendingUp, Users, Globe, Shield];
                const Icon = icons[(i - 1) % 4];
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border bg-gradient-to-br p-6 ${meta.color} ${meta.borderColor}`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                        <Icon className={`h-6 w-6 ${meta.accentColor}`} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        {t(`solutions.${id}.advantage${i}.title`)}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {t(`solutions.${id}.advantage${i}.desc`)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 服务流程 */}
      <section className="border-t border-white/5 bg-slate-950/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">{t("solutions.detail.process")}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${meta.color} border ${meta.borderColor} font-bold ${meta.accentColor}`}>
                    {i}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-white">{t(`solutions.${id}.step${i}.title`)}</h3>
                    <p className="text-sm text-slate-300">{t(`solutions.${id}.step${i}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 成功案例 */}
      <section className="border-t border-white/5 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">{t("solutions.detail.cases")}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black p-6 shadow-xl"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${meta.accentColor}`}>
                      {t(`solutions.${id}.case${i}.title`)}
                    </h3>
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-slate-300">
                    {t(`solutions.${id}.case${i}.desc`)}
                  </p>
                  <div className="space-y-2 rounded-lg bg-white/5 p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t("solutions.detail.vehicles")}:</span>
                      <span className="font-semibold text-white">{t(`solutions.${id}.case${i}.vehicles`)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t("solutions.detail.timeline")}:</span>
                      <span className="font-semibold text-white">{t(`solutions.${id}.case${i}.timeline`)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">{t("solutions.detail.result")}:</span>
                      <span className={`font-semibold ${meta.accentColor}`}>
                        {t(`solutions.${id}.case${i}.result`)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 bg-slate-950/50 py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-10 text-center text-3xl font-bold text-white">{t("solutions.detail.faq")}</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-white">
                    {t(`solutions.${id}.faq${i}.q`)}
                    <span className="text-slate-400 transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="border-t border-white/10 p-5 text-sm leading-relaxed text-slate-300">
                    {t(`solutions.${id}.faq${i}.a`)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className={`rounded-3xl border bg-gradient-to-br p-12 text-center shadow-2xl ${meta.color} ${meta.borderColor}`}>
            <h2 className="text-3xl font-bold text-white lg:text-4xl">{t("solutions.detail.cta.title")}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-200">{t("solutions.detail.cta.subtitle")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild>
                <Link href={`/${params.locale}#contact`}>{t("solutions.detail.cta.primary")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-50" asChild>
                <Link href={`/${params.locale}#featured`}>{t("solutions.detail.cta.secondary")}</Link>
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
