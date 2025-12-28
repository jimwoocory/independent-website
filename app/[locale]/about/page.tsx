import { useTranslations } from "@/lib/translations";
import Link from "next/link";
import { Building2, Users, Globe, Award, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us - Rongqi Auto Service",
  description: "Learn about our 15+ years of automotive export expertise",
};

const milestones = [
  { year: "2010", titleKey: "about.timeline.2010.title", descKey: "about.timeline.2010.desc" },
  { year: "2013", titleKey: "about.timeline.2013.title", descKey: "about.timeline.2013.desc" },
  { year: "2016", titleKey: "about.timeline.2016.title", descKey: "about.timeline.2016.desc" },
  { year: "2019", titleKey: "about.timeline.2019.title", descKey: "about.timeline.2019.desc" },
  { year: "2022", titleKey: "about.timeline.2022.title", descKey: "about.timeline.2022.desc" },
  { year: "2025", titleKey: "about.timeline.2025.title", descKey: "about.timeline.2025.desc" },
];

const team = [
  { icon: Users, titleKey: "about.team.export", countKey: "about.team.export.count" },
  { icon: Globe, titleKey: "about.team.logistics", countKey: "about.team.logistics.count" },
  { icon: Award, titleKey: "about.team.quality", countKey: "about.team.quality.count" },
  { icon: Building2, titleKey: "about.team.support", countKey: "about.team.support.count" },
];

const certifications = [
  { emoji: "📜", nameKey: "about.cert.export", yearKey: "about.cert.export.year" },
  { emoji: "🏆", nameKey: "about.cert.iso", yearKey: "about.cert.iso.year" },
  { emoji: "✅", nameKey: "about.cert.customs", yearKey: "about.cert.customs.year" },
  { emoji: "🌐", nameKey: "about.cert.trade", yearKey: "about.cert.trade.year" },
];

const values = [
  { icon: CheckCircle, titleKey: "about.values.integrity.title", descKey: "about.values.integrity.desc" },
  { icon: Globe, titleKey: "about.values.global.title", descKey: "about.values.global.desc" },
  { icon: TrendingUp, titleKey: "about.values.excellence.title", descKey: "about.values.excellence.desc" },
  { icon: Users, titleKey: "about.values.customer.title", descKey: "about.values.customer.desc" },
];

const offices = [
  { city: "Shanghai", country: "China", flag: "🇨🇳", role: "about.offices.hq" },
  { city: "Dubai", country: "UAE", flag: "🇦🇪", role: "about.offices.middle" },
  { city: "Lagos", country: "Nigeria", flag: "🇳🇬", role: "about.offices.africa" },
  { city: "São Paulo", country: "Brazil", flag: "🇧🇷", role: "about.offices.latam" },
];

export default function AboutPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <Link href={`/${params.locale}`} className="text-lg font-semibold text-white">
            {t("brand.name")}
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-200">
            <Link href={`/${params.locale}`} className="transition hover:text-white">
              {t("nav.home")}
            </Link>
            <Link href={`/${params.locale}/about`} className="font-semibold text-white">
              {t("nav.about")}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="container relative mx-auto px-6 text-center space-y-4">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
            {t("about.hero.badge")}
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t("about.hero.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            {t("about.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-white md:text-3xl">
              {t("about.mission.title")}
            </h2>
            <p className="text-lg leading-relaxed text-slate-300">
              {t("about.mission.text1")}
            </p>
            <p className="text-lg leading-relaxed text-slate-300">
              {t("about.mission.text2")}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
              {t("about.timeline.badge")}
            </p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.timeline.title")}
            </h2>
          </div>

          <div className="relative mx-auto max-w-4xl">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 via-blue-400/30 to-transparent md:left-1/2" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Year Badge */}
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-950 bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                      {milestone.year}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6">
                      <h3 className="text-lg font-semibold text-white">
                        {t(milestone.titleKey)}
                      </h3>
                      <p className="mt-2 text-sm text-slate-300">
                        {t(milestone.descKey)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
              {t("about.team.badge")}
            </p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.team.title")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => {
              const Icon = member.icon;
              return (
                <div
                  key={member.titleKey}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 text-center space-y-4"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Icon className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{t(member.countKey)}</div>
                    <div className="mt-1 text-sm text-slate-300">{t(member.titleKey)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
              {t("about.cert.badge")}
            </p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.cert.title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {certifications.map((cert) => (
              <div
                key={cert.nameKey}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 text-center transition hover:border-white/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 transition group-hover:opacity-100" />
                <div className="relative space-y-3">
                  <div className="text-5xl">{cert.emoji}</div>
                  <div>
                    <div className="font-semibold text-white">{t(cert.nameKey)}</div>
                    <div className="text-sm text-slate-400">{t(cert.yearKey)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
              {t("about.values.badge")}
            </p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.values.title")}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.titleKey}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 space-y-4"
                >
                  <div className="inline-flex rounded-full bg-emerald-500/10 p-3">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{t(value.titleKey)}</h3>
                    <p className="mt-2 text-sm text-slate-300">{t(value.descKey)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="bg-slate-950 py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
              {t("about.offices.badge")}
            </p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.offices.title")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {offices.map((office) => (
              <div
                key={office.city}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 text-center space-y-3"
              >
                <div className="text-5xl">{office.flag}</div>
                <div>
                  <div className="text-xl font-semibold text-white">{office.city}</div>
                  <div className="text-sm text-slate-400">{office.country}</div>
                  <div className="mt-2 text-xs text-blue-300">{t(office.role)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-indigo-600/20 p-8 text-center space-y-6 md:p-12">
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">
              {t("about.cta.title")}
            </h2>
            <p className="mx-auto max-w-2xl text-slate-200">
              {t("about.cta.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${params.locale}#contact`}>
                <Button size="lg">{t("about.cta.primary")}</Button>
              </Link>
              <Link href={`/${params.locale}#featured`}>
                <Button size="lg" variant="outline" className="border-slate-200 text-slate-50">
                  {t("about.cta.secondary")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-slate-400">
          <p>{t("footer.rights")}</p>
        </div>
      </footer>
    </main>
  );
}
