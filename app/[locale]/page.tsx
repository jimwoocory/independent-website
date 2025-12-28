'use client';

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {Button} from "@/components/ui/button";
import {SearchBar} from "@/components/search-bar";
import {FavoritesCount} from "@/components/favorites-count";
import {FavoriteButton} from "@/components/favorite-button";
import {TrustSection} from "@/components/trust-section";
import {FloatingContact} from "@/components/floating-contact";
import {LanguageSwitcher} from "@/components/language-switcher";
import { useTranslations } from '@/lib/translations';

// Dynamic import for client-only component
const QuickInquiryButton = dynamic(
  () => import("@/components/quick-inquiry-button").then(mod => ({ default: mod.QuickInquiryButton })),
  { ssr: false }
);

// 动态导入大型组件 - 懒加载优化
const InquiryForm = dynamic(() => import("@/components/inquiry-form").then(mod => ({default: mod.InquiryForm})), {
  loading: () => <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-400">加载表单中...</div>,
  ssr: false, // 表单不需要 SSR
});


// Stats are now dynamically translated in the component

const socials = [
  {label: "WhatsApp", href: "https://wa.me/8613800000000"},
  {label: "Facebook", href: "https://facebook.com"},
  {label: "Instagram", href: "https://instagram.com"},
  {label: "TikTok", href: "https://tiktok.com"},
];

// Services are now dynamically translated

const inquiryContacts = [
  {label: "WhatsApp", value: "+86 138 0000 0000", href: "https://wa.me/8613800000000"},
  {label: "邮箱", value: "export@autoexport.com", href: "mailto:export@autoexport.com"},
  {label: "电话", value: "+86 138 0000 0000", href: "tel:+8613800000000"},
];

const categories = [
  {value: "all", label: "全部", badge: "#CBD5E1"},
  {value: "SUV", label: "SUV", badge: "#60A5FA"},
  {value: "Pickup", label: "皮卡", badge: "#34D399"},
  {value: "Sedan", label: "轿车", badge: "#FBBF24"},
  {value: "EV", label: "新能源", badge: "#A78BFA"},
];

const statuses = [
  {value: "all", label: "全部", badge: "#CBD5E1"},
  {value: "active", label: "活跃", badge: "#22C55E"},
  {value: "new", label: "新品", badge: "#38BDF8"},
  {value: "fast", label: "快速交付", badge: "#F97316"},
];

const sortOptions = [
  {value: "newest", label: "最新发布"},
  {value: "price_asc", label: "价格从低到高"},
  {value: "price_desc", label: "价格从高到低"},
];


// 定义车辆类型
interface VehicleImage {
  url: string | null;
  is_cover: boolean | null;
  display_order: number | null;
}

interface Certificate {
  count: number | null;
}

interface VehicleRow {
  id: string;
  name_i18n: Record<string, string>;
  description_i18n: Record<string, string> | null;
  category: string;
  specifications: any;
  price_range_min: number;
  price_range_max: number;
  status: string;
  created_at: string | null;
  vehicle_images?: VehicleImage[];
  certificates?: Certificate[];
}

const fallbackVehicles: VehicleRow[] = [
  {
    id: "mock-1",
    name_i18n: {en: "Toyota Land Cruiser 300", zh: "兰德酷路泽 300", es: "Toyota Land Cruiser 300", ar: "تويوتا لاند كروزر 300"},
    description_i18n: null,
    category: "SUV",
    specifications: null,
    price_range_min: 68000,
    price_range_max: 82000,
    status: "active",
    created_at: null,
    vehicle_images: [{url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80", is_cover: true, display_order: 1}],
    certificates: [{count: 2}],
  },
  {
    id: "mock-2",
    name_i18n: {en: "Ford F-150 Platinum", zh: "福特 F-150 铂金版", es: "Ford F-150 Platinum", ar: "فورد F-150 بلايتينيوم"},
    description_i18n: null,
    category: "Pickup",
    specifications: null,
    price_range_min: 52000,
    price_range_max: 65000,
    status: "fast",
    created_at: null,
    vehicle_images: [{url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=80", is_cover: true, display_order: 1}],
    certificates: [{count: 1}],
  },
  {
    id: "mock-3",
    name_i18n: {en: "BYD Song Plus DM-i", zh: "比亚迪宋PLUS DM-i", es: "BYD Song Plus DM-i", ar: "بي واي دي سونغ بلس DM-i"},
    description_i18n: null,
    category: "EV",
    specifications: null,
    price_range_min: 28000,
    price_range_max: 35000,
    status: "new",
    created_at: null,
    vehicle_images: [{url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80", is_cover: true, display_order: 1}],
    certificates: [{count: 0}],
  },
];


function getName(v: VehicleRow, locale: string) {
  const name = (v.name_i18n as Record<string, string | undefined>)?.[locale];
  return name ?? (v.name_i18n as Record<string, string | undefined>)?.en ?? "Vehicle";
}

function formatPriceRange(v: VehicleRow) {
  if (v.price_range_min && v.price_range_max) {
    return `$${Math.round(v.price_range_min / 1000)}k - $${Math.round(v.price_range_max / 1000)}k`;
  }
  if (v.price_range_min) return `$${Math.round(v.price_range_min / 1000)}k+`;
  return "—";
}

function coverImage(v: VehicleRow) {
  return v.vehicle_images?.find((i) => i.is_cover)?.url || v.vehicle_images?.[0]?.url || null;
}

function certificateCount(v: VehicleRow) {
  return v.certificates?.[0]?.count ?? 0;
}


function buildQuery(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    const value = String(v);
    if ((k === "category" || k === "status") && value === "all") return;
    if (k === "page" && value === "1") return;
    usp.set(k, value);
  });
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

export default function HomePage({
  params,
  searchParams,
}: {
  params: {locale: string};
  searchParams?: {
    category?: string;
    status?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
    page?: string;
    q?: string;
    brand?: string;
    year_min?: string;
    year_max?: string;
    mileage_max?: string;
  };
}) {
  // Get client-side translation function
  const t = useTranslations();


  const category = searchParams?.category ?? "all";
  const status = searchParams?.status ?? "all";
  const priceMin = Number(searchParams?.priceMin ?? "") || undefined;
  const priceMax = Number(searchParams?.priceMax ?? "") || undefined;
  const sort = searchParams?.sort ?? "newest";
  const page = Number(searchParams?.page ?? "1") || 1;
  const searchQuery = searchParams?.q ?? "";
  const brand = searchParams?.brand ?? undefined;
  const yearMin = Number(searchParams?.year_min ?? "") || undefined;
  const yearMax = Number(searchParams?.year_max ?? "") || undefined;
  const mileageMax = Number(searchParams?.mileage_max ?? "") || undefined;

  // Using fallback vehicles data directly since fetchVehicles is async
  const items = fallbackVehicles;
  const count = fallbackVehicles.length;
  const limit = 6;
  const totalPages = Math.max(1, Math.ceil(count / limit));
  const currentPage = Math.min(page, totalPages);

  const baseParams = {
    category,
    status,
    priceMin: priceMin ?? undefined,
    priceMax: priceMax ?? undefined,
    sort,
    q: searchQuery || undefined,
    brand: brand ?? undefined,
    year_min: yearMin ?? undefined,
    year_max: yearMax ?? undefined,
    mileage_max: mileageMax ?? undefined,
  };

  const selectedFilters = [
    category !== "all" ? `分类: ${categories.find((c) => c.value === category)?.label ?? "全部"}` : null,
    status !== "all" ? `状态: ${statuses.find((s) => s.value === status)?.label ?? "全部"}` : null,
    typeof priceMin === "number" ? `价格从: $${priceMin}` : null,
    typeof priceMax === "number" ? `价格到: $${priceMax}` : null,
    searchQuery ? `搜索: "${searchQuery}"` : null,
    brand ? `品牌: ${brand}` : null,
    yearMin ? `最低年份: ${yearMin}` : null,
    yearMax ? `最高年份: ${yearMax}` : null,
    mileageMax ? `最大里程: ${mileageMax}km` : null,
  ].filter(Boolean) as string[];

  const filterForm = (
    <form className="space-y-4" method="get">
      <input type="hidden" name="sort" value={sort} />
      <div className="space-y-2">
        <div className="text-sm font-semibold text-white">{t('filters.category')}</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = category === c.value;
            return (
              <label
                key={c.value}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition " +
                  (active
                    ? "border-blue-400 bg-blue-500/20 text-blue-100"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-white/30")
                }
              >
                <input type="radio" name="category" value={c.value} className="sr-only" defaultChecked={active} />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{backgroundColor: c.badge}}
                />
                <span>{t(`filters.${c.value}`)}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-semibold text-white">{t('filters.status')}</div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const active = status === s.value;
            return (
              <label
                key={s.value}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition " +
                  (active
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                    : "border-white/10 bg-white/5 text-slate-200 hover:border-white/30")
                }
              >
                <input type="radio" name="status" value={s.value} className="sr-only" defaultChecked={active} />
                <span
                  className="h-2 w-2 rounded-full"
                  style={{backgroundColor: s.badge}}
                />
                <span>{t(`status.${s.value}`)}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-semibold text-white">
          <span>{t('filters.price')}</span>
          <span className="text-xs font-normal text-slate-400">
            {typeof priceMin === "number" || typeof priceMax === "number"
              ? `$${Math.round((priceMin ?? 0) / 1000)}k - $${Math.round((priceMax ?? 0) / 1000) || ""}k`.replace(" - $0k", "+")
              : t('filters.any')}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-xs text-slate-300">
            <span className="block">{t('filters.priceMin')}</span>
            <input
              type="number"
              name="priceMin"
              min={0}
              step={1000}
              defaultValue={priceMin ?? ""}
              placeholder="0"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
            />
          </label>
          <label className="space-y-1 text-xs text-slate-300">
            <span className="block">{t('filters.priceMax')}</span>
            <input
              type="number"
              name="priceMax"
              min={0}
              step={1000}
              defaultValue={priceMax ?? ""}
              placeholder="100000"
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/${params.locale}${buildQuery({})}#featured`}
          className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 text-center"
        >
          {t('filters.clear')}
        </Link>
        <Button type="submit" className="flex-1 px-4 py-2 text-sm">
          {t('filters.apply')}
        </Button>
      </div>
    </form>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <Link href={`/${params.locale}`} className="text-lg font-semibold text-white">
            {t("brand.name")}
          </Link>
          <nav className="flex flex-1 items-center justify-center gap-8 text-sm font-medium text-white md:flex">
            <Link href={`/${params.locale}`} className="transition hover:text-blue-400">{t('nav.home')}</Link>
            <Link href={`/${params.locale}/about`} className="transition hover:text-blue-400">{t('nav.about')}</Link>
            <Link href={`/${params.locale}/vehicles`} className="transition hover:text-blue-400">{t('nav.vehicles')}</Link>
            <Link href={`/${params.locale}/solutions`} className="transition hover:text-blue-400">{t('nav.solutions')}</Link>
            <Link href={`/${params.locale}/resources`} className="transition hover:text-blue-400">{t('nav.resources')}</Link>
            <Link href="#contact" className="transition hover:text-blue-400">{t('nav.contact')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <Button variant="outline" className="border-blue-500 text-white hover:bg-blue-500/20" size="sm">
                获取报价
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
                WhatsApp
              </Button>
            </div>
            <LanguageSwitcher current={params.locale} />
            <FavoritesCount locale={params.locale} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.25),transparent_40%)]" />
        <div className="container relative mx-auto grid min-h-screen place-items-center px-6 py-24 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-blue-300/70">
              <span>Auto Export · B2B</span>
              <span className="h-1 w-1 rounded-full bg-blue-300/70" />
              <span>{t('hero.contactLine')}</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="max-w-xl text-lg text-slate-300 md:text-xl">
                {t('hero.subtitle')}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                {t('hero.ctaPrimary')}
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 border-2 border-white text-white hover:bg-white/10 font-medium shadow-lg hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                {t('hero.ctaSecondary')}
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
              {[
                { value: "50+", key: "hero.stats.countries" },
                { value: "10k+", key: "hero.stats.vehicles" },
                { value: "< 2h", key: "hero.stats.response" }
              ].map((item) => (
                <div key={item.key} className="text-center">
                  <div className="text-2xl font-semibold text-white">{item.value}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-300">
                    {t(item.key)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur">
              <span className="text-sm font-semibold text-slate-200">{t('hero.social.title')}</span>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(`hero.social.${s.label.toLowerCase()}`)}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute -right-10 bottom-10 h-20 w-20 rounded-full bg-indigo-400/30 blur-3xl" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-tr from-slate-800 via-slate-900 to-black shadow-2xl">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_40%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-slate-200">
                  <span className="text-sm font-semibold">Fleet Overview</span>
                  <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-blue-100">LIVE</span>
                </div>
                <div className="space-y-3 text-slate-100">
                  <div className="flex items-center justify-between text-sm">
                    <span>SUV · Hybrid</span>
                    <span className="font-semibold">68 units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pick-up · Diesel</span>
                    <span className="font-semibold">42 units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Sedan · Gasoline</span>
                    <span className="font-semibold">75 units</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>EV · Fast Shipping</span>
                    <span className="font-semibold">23 units</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-slate-300 text-xs">
                  <span>Updated · 5m ago</span>
                  <span>ETA · 14 days avg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 精选车型 */}
      <section id="featured" className="bg-black py-16">
        <div className="container mx-auto px-6 space-y-6 lg:space-y-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">{t('featured.badge')}</p>
              <h2 className="text-3xl font-semibold text-white lg:text-4xl">{t('featured.title')}</h2>
              <p className="text-slate-300">{t('featured.subtitle')}</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-blue-500 text-white hover:bg-blue-500/20 font-medium px-4 py-2" size="sm">
                {t('featured.action.catalog')}
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2">
                {t('featured.action.quote')}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px,1fr] lg:items-start">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl">
                <div className="mb-4 text-sm font-semibold text-slate-100">筛选条件</div>
                {filterForm}
              </div>
            </aside>

            <div className="space-y-4">
              <details className="lg:hidden rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-lg">
                <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-white">
                  筛选条件
                  <span className="text-xs font-normal text-slate-400">(点击展开)</span>
                </summary>
                <div className="mt-4 space-y-4 border-t border-white/5 pt-4">{filterForm}</div>
              </details>

              {/* 搜索栏 */}
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 shadow-lg">
                <SearchBar locale={params.locale} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedFilters.length === 0 ? (
                    <span className="text-xs text-slate-400">无筛选条件</span>
                  ) : (
                    selectedFilters.map((f) => (
                      <span
                        key={f}
                        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100"
                      >
                        {f}
                      </span>
                    ))
                  )}
                  {selectedFilters.length > 0 && (
                    <Link
                      href={`/${params.locale}${buildQuery({})}#featured`}
                      className="text-xs font-semibold text-blue-300 transition hover:text-blue-200"
                    >
                      清除所有
                    </Link>
                  )}
                </div>

                <form method="get" className="flex items-center gap-2 text-sm text-white">
                  <input type="hidden" name="category" value={category} />
                  <input type="hidden" name="status" value={status} />
                  {typeof priceMin === "number" ? <input type="hidden" name="priceMin" value={priceMin} /> : null}
                  {typeof priceMax === "number" ? <input type="hidden" name="priceMax" value={priceMax} /> : null}
                  <label className="text-xs text-slate-400" htmlFor="sort-select">
                    排序
                  </label>
                  <select
                    id="sort-select"
                    name="sort"
                    defaultValue={sort}
                    className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" variant="outline" className="border-slate-700 text-slate-100">
                    应用筛选
                  </Button>
                </form>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {items.length === 0 && searchQuery ? (
                  <div className="col-span-full rounded-2xl border border-white/10 bg-slate-950/80 p-12 text-center">
                    <p className="text-lg font-semibold text-white">没有找到匹配的车辆</p>
                    <p className="mt-2 text-sm text-slate-400">
                      尝试使用不同的关键词或 {
                        <Link href={`/${params.locale}#featured`} className="text-blue-400 hover:underline">
                          清除筛选条件
                        </Link>
                      }
                    </p>
                  </div>
                ) : (
                  items.map((v) => {
                  const title = getName(v, params.locale);
                  const price = formatPriceRange(v);
                  const img = coverImage(v);
                  const certs = certificateCount(v);
                  const statusLabel = statuses.find((s) => s.value === v.status)?.label ?? "活跃";
                  return (
                    <div key={v.id} className="overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 to-black shadow-lg">
                      <div className="relative aspect-[4/3] w-full bg-slate-900/60">
                        {img ? (
                          <Image
                            src={img}
                            alt={title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            暂无图片
                          </div>
                        )}
                        <div className="absolute left-3 top-3 flex gap-2 text-xs">
                          <span className="rounded-full bg-blue-500/80 px-3 py-1 font-semibold text-white">{statusLabel}</span>
                          {certs > 0 && (
                            <span className="rounded-full bg-emerald-500/80 px-3 py-1 font-semibold text-white">
                              {certs} 证书
                            </span>
                          )}
                        </div>
                        <div className="absolute right-3 top-3">
                          <FavoriteButton
                            vehicle={{
                              id: v.id,
                              name: title,
                              image: img,
                              price,
                              category: v.category ?? "Vehicle",
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between text-sm text-blue-200">
                          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100">
                            {v.category ?? "Vehicle"}
                          </span>
                          <span className="text-slate-400">{price}</span>
                        </div>
                        <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
                        <p className="mt-1 text-sm text-slate-300 line-clamp-2">
                          {(v.description_i18n as Record<string, string | undefined>)?.[params.locale] ?? ""}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                      <QuickInquiryButton vehicleName={title} vehicleId={v.id} />
                      <Link href={`/${params.locale}/vehicles/${v.id}`}>
                        <Button size="sm" variant="outline" className="border-blue-500 text-white hover:bg-blue-500/20 font-medium">
                          查看详情
                        </Button>
                      </Link>
                    </div>
                      </div>
                    </div>
                  );
                })
                )}
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <Link
                  href={`/${params.locale}${buildQuery({...baseParams, page: Math.max(1, currentPage - 1)})}#featured`}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
                  aria-disabled={currentPage <= 1}
                >
                  上一页
                </Link>
                <span className="text-sm text-slate-300">
                  {currentPage} / {totalPages}
                </span>
                <Link
                  href={`/${params.locale}${buildQuery({...baseParams, page: Math.min(totalPages, currentPage + 1)})}#featured`}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:border-white/40 hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
                  aria-disabled={currentPage >= totalPages}
                >
                  下一页
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 信任背书系统 */}
      <TrustSection />

      {/* 服务优势 */}
      <section id="services" className="bg-slate-950 py-16">
        <div className="container mx-auto px-6 space-y-8">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.25em] text-blue-300/70">{t('services.badge')}</p>
            <h2 className="text-3xl font-semibold text-white lg:text-4xl">{t('services.title')}</h2>
            <p className="text-slate-300">{t('services.subtitle')}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { key: 'logistics', titleKey: 'services.logistics', descKey: 'services.logistics.desc' },
              { key: 'compliance', titleKey: 'services.compliance', descKey: 'services.compliance.desc' },
              { key: 'inspection', titleKey: 'services.inspection', descKey: 'services.inspection.desc' },
              { key: 'finance', titleKey: 'services.finance', descKey: 'services.finance.desc' }
            ].map((service) => (
              <div key={service.key} className="rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900 to-black p-6">
                <h3 className="text-lg font-semibold text-white">{t(service.titleKey)}</h3>
                <p className="mt-2 text-sm text-slate-300">{t(service.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 询价 CTA */}
      <section id="contact" className="bg-black py-16">
        <div className="container mx-auto px-6">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-indigo-600/20 p-8 shadow-2xl md:p-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-blue-200">{t('cta.badge')}</p>
                <h2 className="text-3xl font-semibold text-white lg:text-4xl">{t('cta.title')}</h2>
                <p className="text-slate-200">{t('cta.subtitle')}</p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg">{t('cta.primary')}</Button>
                  <Button size="lg" variant="outline" className="border-slate-200 text-slate-50">
                    {t('cta.secondary')}
                  </Button>
                </div>
              </div>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-sm font-semibold text-slate-100">{t('cta.contactTitle')}</p>
                {inquiryContacts.map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    className="flex items-center justify-between rounded-lg border border-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-white/30 hover:bg-white/5"
                  >
                    <span>{t(`contact.${c.label.toLowerCase()}`)}</span>
                    <span className="font-semibold">{c.value}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="border-t border-white/5 bg-slate-950 py-8">
        <div className="container mx-auto flex flex-col gap-4 px-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-slate-300">
            <p className="text-white font-semibold">{t("brand.name")}</p>
            <p className="text-sm">{t('footer.rights')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-300">{t('footer.socialTitle')}</span>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-100 transition hover:border-white/40 hover:bg-white/10"
                target="_blank"
                rel="noreferrer"
              >
                {t(`hero.social.${s.label.toLowerCase()}`)}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Floating Contact Button */}
      <FloatingContact />
    </main>
  );
}
