'use client';

import { useTranslations } from "@/lib/translations";
import { TrendingUp, Users, Globe, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "5000+", labelKey: "trust.stats.customers", color: "blue" },
  { icon: TrendingUp, value: "15+", labelKey: "trust.stats.years", color: "emerald" },
  { icon: Globe, value: "50+", labelKey: "trust.stats.countries", color: "purple" },
  { icon: Award, value: "500+", labelKey: "trust.stats.models", color: "amber" },
];

const clientLogos = [
  { name: "Lagos Motors Ltd", country: "Nigeria", logo: "🇳🇬" },
  { name: "Dubai Premium Cars", country: "UAE", logo: "🇦🇪" },
  { name: "Bangkok Auto Group", country: "Thailand", logo: "🇹🇭" },
  { name: "São Paulo Imports", country: "Brazil", logo: "🇧🇷" },
  { name: "Riyadh Fleet Services", country: "Saudi Arabia", logo: "🇸🇦" },
  { name: "Manila Transport Co", country: "Philippines", logo: "🇵🇭" },
  { name: "Jakarta Motors", country: "Indonesia", logo: "🇮🇩" },
  { name: "Buenos Aires Auto", country: "Argentina", logo: "🇦🇷" },
  { name: "Nairobi Vehicles", country: "Kenya", logo: "🇰🇪" },
  { name: "Jeddah Luxury Cars", country: "Saudi Arabia", logo: "🇸🇦" },
];

const testimonials = [
  {
    id: 1,
    name: "Ahmed Al-Rashid",
    company: "Dubai Premium Cars",
    country: "UAE",
    flag: "🇦🇪",
    rating: 5,
    textKey: "trust.testimonial1.text",
    yearKey: "trust.testimonial.partnership",
    years: "3",
  },
  {
    id: 2,
    name: "Carlos Silva",
    company: "São Paulo Imports",
    country: "Brazil",
    flag: "🇧🇷",
    rating: 5,
    textKey: "trust.testimonial2.text",
    yearKey: "trust.testimonial.partnership",
    years: "5",
  },
  {
    id: 3,
    name: "John Okafor",
    company: "Lagos Motors Ltd",
    country: "Nigeria",
    flag: "🇳🇬",
    rating: 5,
    textKey: "trust.testimonial3.text",
    yearKey: "trust.testimonial.partnership",
    years: "4",
  },
];

export function TrustSection() {
  const t = useTranslations();

  return (
    <section className="bg-gradient-to-b from-slate-950 to-black py-16">
      <div className="container mx-auto px-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">
            {t("trust.badge")}
          </p>
          <h2 className="text-3xl font-semibold text-white lg:text-4xl">
            {t("trust.title")}
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            {t("trust.subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.labelKey}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 transition hover:border-white/20"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl transition group-hover:scale-125" />
                <div className="relative space-y-3">
                  <div className={`inline-flex rounded-full bg-${stat.color}-500/10 p-3`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-400`} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-slate-300">{t(stat.labelKey)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Logos */}
        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold text-white">
            {t("trust.clients.title")}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {clientLogos.map((client) => (
              <div
                key={client.name}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 p-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="text-4xl">{client.logo}</div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-white">{client.name}</div>
                  <div className="text-xs text-slate-400">{client.country}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="space-y-6">
          <h3 className="text-center text-xl font-semibold text-white">
            {t("trust.testimonials.title")}
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-6 space-y-4"
              >
                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm text-slate-300 italic">
                  &ldquo;{t(testimonial.textKey)}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-2xl">
                    {testimonial.flag}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {testimonial.company}
                    </div>
                    <div className="text-xs text-blue-300">
                      {t(testimonial.yearKey, { years: testimonial.years })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
