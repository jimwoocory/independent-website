import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {SearchBar} from "@/components/search-bar";
import {AdvancedFilters} from "@/components/advanced-filters";
import {FavoriteButton} from "@/components/favorite-button";
import {FavoritesCount} from "@/components/favorites-count";
import {VehicleQuickFilter} from "@/components/vehicle-quick-filter";
import dynamic from "next/dynamic";
import {getSupabaseServerClient, isSupabaseConfigured} from "@/lib/supabase/server";
import type {Database} from "@/supabase/database.types";
import {getTranslations} from "next-intl/server";


const QuickInquiryButton = dynamic(
  () => import("@/components/quick-inquiry-button").then(mod => ({ default: mod.QuickInquiryButton })),
  { ssr: false }
);

export const revalidate = 60;

type Props = {
  params: {locale: string};
  searchParams: {
    q?: string;
    category?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
    brand?: string;
    minYear?: string;
    maxYear?: string;
    maxMileage?: string;
    page?: string;
  };
};

// 本地无 Supabase 时的兜底数据
const fallbackVehicles = [
  {
    id: "mg5-2026",
    name_i18n: {
      en: "MG5 2026 180DVVT Global Luxury",
      zh: "名爵 MG5 2026款 180DVVT 全球豪华版",
      es: "MG5 2026 180DVVT Lujo Global",
      ar: "MG5 2026 180DVVT الفاخرة العالمية"
    },
    description_i18n: {
      en: "The MG5 2026 180DVVT Global Luxury is a stylish compact sedan with excellent fuel efficiency, perfect for export to global markets. Features include: 1.5L DVVT engine, CVT transmission, advanced safety system, and premium interior.",
      zh: "名爵MG5 2026款180DVVT全球豪华版，一款时尚紧凑型轿车，燃油经济性出色，非常适合出口全球市场。配备：1.5L DVVT发动机、CVT变速箱、先进安全系统、豪华内饰。"
    },
    category: "Sedan",
    price_range_min: 9000,
    price_range_max: 11500,
    status: "active",
    created_at: new Date().toISOString(),
    specifications: {
      brand: "MG",
      year: "2026",
      model: "MG5",
      engine: "1.5L 180DVVT",
      transmission: "CVT",
      drive: "FWD",
      fuel: "Petrol",
      mileage: "0",
      color: "Multiple colors available"
    },
    vehicle_images: [
      {url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80", is_cover: true},
      {url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80", is_cover: false}
    ],
  },
  {
    id: "demo-suv",
    name_i18n: {en: "Demo SUV", zh: "演示SUV"},
    description_i18n: {en: "Comfortable SUV", zh: "舒适型SUV"},
    category: "SUV",
    price_range_min: 32000,
    price_range_max: 45000,
    status: "active",
    created_at: new Date().toISOString(),
    specifications: {brand: "Toyota", year: "2024", mileage: "0"},
    vehicle_images: [{url: "/placeholder.png", is_cover: true}],
  },
  {
    id: "demo-sedan",
    name_i18n: {en: "Demo Sedan", zh: "演示轿车"},
    description_i18n: {en: "Business sedan", zh: "商务轿车"},
    category: "sedan",
    price_range_min: 28000,
    price_range_max: 38000,
    status: "active",
    created_at: new Date().toISOString(),
    specifications: {brand: "Nissan", year: "2024", mileage: "0"},
    vehicle_images: [{url: "/placeholder.png", is_cover: true}],
  },
  {
    id: "demo-pickup",
    name_i18n: {en: "Demo Pickup", zh: "演示皮卡"},
    description_i18n: {en: "Durable pickup", zh: "耐用皮卡"},
    category: "pickup",
    price_range_min: 36000,
    price_range_max: 52000,
    status: "active",
    created_at: new Date().toISOString(),
    specifications: {brand: "Ford", year: "2024", mileage: "0"},
    vehicle_images: [{url: "/placeholder.png", is_cover: true}],
  },
];

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"];

type WithImages = VehicleRow & {vehicle_images: {url: string; is_cover: boolean}[]};

type ResponseData = {
  vehicles: WithImages[];
  count: number;
  totalPages: number;
};

export default async function VehiclesPage({params, searchParams}: Props) {
  const t = await getTranslations();

  // 本地或未配置 Supabase 时直接使用兜底数据
  if (!isSupabaseConfigured) {
    const count = fallbackVehicles.length;
    return renderPage({
      t,
      params,
      searchParams,
      vehicles: fallbackVehicles as WithImages[],
      count,
      totalPages: 1,
    });
  }

  const supabase = getSupabaseServerClient();

  // 分页参数
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 构建查询
  let query = supabase
    .from("vehicles")
    .select("*, vehicle_images(url, is_cover)", {count: "exact"})
    .eq("status", "active")
    .order("created_at", {ascending: false})
    .range(from, to);


  // 搜索关键词
  if (searchParams.q) {
    const keyword = searchParams.q.toLowerCase();
    query = query.or(
      `name_i18n->>en.ilike.%${keyword}%,name_i18n->>zh.ilike.%${keyword}%,description_i18n->>en.ilike.%${keyword}%`
    );
  }

  // 分类筛选
  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category);
  }

  // 价格筛选
  if (searchParams.minPrice) {
    query = query.gte("price_range_min", Number(searchParams.minPrice));
  }
  if (searchParams.maxPrice) {
    query = query.lte("price_range_max", Number(searchParams.maxPrice));
  }

  // 品牌筛选
  if (searchParams.brand && searchParams.brand !== "all") {
    query = query.ilike("specifications->>brand", searchParams.brand);
  }

  // 年份筛选
  if (searchParams.minYear) {
    query = query.gte("specifications->>year", searchParams.minYear);
  }
  if (searchParams.maxYear) {
    query = query.lte("specifications->>year", searchParams.maxYear);
  }

  // 里程筛选
  if (searchParams.maxMileage) {
    query = query.lte("specifications->>mileage", Number(searchParams.maxMileage));
  }

  const {data: vehicles, count, error} = await query;

  if (error) {
    console.error("Vehicles fetch error:", error);
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-red-400">{t("vehicles.loadError")}</p>
      </div>
    );
  }


  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return renderPage({
    t,
    params,
    searchParams,
    vehicles: (vehicles as WithImages[]) || [],
    count: count ?? 0,
    totalPages,
  });
}

function renderPage({
  t,
  params,
  searchParams,
  vehicles,
  count,
  totalPages,
}: {
  t: (key: string, options?: any) => string;
  params: Props["params"];
  searchParams: Props["searchParams"];
  vehicles: WithImages[];
  count: number;
  totalPages: number;
}) {
  // 从车辆数据中提取唯一品牌列表
  const brands = Array.from(
    new Set(
      vehicles
        .map(v => (v.specifications as Record<string, any>)?.brand)
        .filter((brand): brand is string => brand !== undefined && brand !== null)
    )
  ).sort();

  // 当前筛选条件
  const currentFilters = {
    brand: searchParams.brand,
    year_min: searchParams.minYear ? Number(searchParams.minYear) : undefined,
    year_max: searchParams.maxYear ? Number(searchParams.maxYear) : undefined,
    mileage_max: searchParams.maxMileage ? Number(searchParams.maxMileage) : undefined,
  };

  // 应用筛选回调
  const handleApplyFilters = (filters: Record<string, string | number>) => {
    // 构建新的查询参数
    const newSearchParams = new URLSearchParams(searchParams as Record<string, string>);
    
    // 清除旧的高级筛选参数
    newSearchParams.delete('brand');
    newSearchParams.delete('minYear');
    newSearchParams.delete('maxYear');
    newSearchParams.delete('maxMileage');
    
    // 添加新的筛选参数
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        // 映射组件内的参数名到 URL 参数名
        const paramNameMap: Record<string, string> = {
          brand: 'brand',
          year_min: 'minYear',
          year_max: 'maxYear',
          mileage_max: 'maxMileage'
        };
        newSearchParams.set(paramNameMap[key] || key, String(value));
      }
    });
    
    // 重置到第一页
    newSearchParams.set('page', '1');
    
    // 导航到新的 URL
    window.location.href = `/${params.locale}/vehicles?${newSearchParams.toString()}`;
  };

  // 当前页码
  const page = Number(searchParams.page) || 1;
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href={`/${params.locale}`} className="text-xl font-bold tracking-tight">
            {t("brand.name")}
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link href={`/${params.locale}`} className="transition hover:text-blue-400">
              {t("nav.home")}
            </Link>
            <Link href={`/${params.locale}/about`} className="transition hover:text-blue-400">
              {t("nav.about")}
            </Link>
            <Link href={`/${params.locale}/vehicles`} className="font-semibold text-blue-400">
              {t("nav.vehicles")}
            </Link>
            <Link href={`/${params.locale}/solutions`} className="transition hover:text-blue-400">
              {t("nav.solutions")}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <FavoritesCount locale={params.locale} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-white/5 bg-gradient-to-r from-blue-950 via-slate-950 to-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <span className="inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
              {t("vehicles.badge")}
            </span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t("vehicles.title")}
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            {t("vehicles.subtitle")}
          </p>
          <div className="mt-8">
            <SearchBar locale={params.locale} />
          </div>
        </div>
      </section>

      {/* Quick Filter Section */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <VehicleQuickFilter locale={params.locale} />
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-slate-900/40 p-6">
              <h3 className="mb-4 font-semibold">{t("filters.title")}</h3>
              <AdvancedFilters 
                brands={brands} 
                currentFilters={currentFilters} 
                onApply={handleApplyFilters} 
              />
            </div>
          </aside>

          {/* Vehicles Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                {count} {t("vehicles.results")} {searchParams.q && `"${searchParams.q}"`}
              </p>
              <select className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm">
                <option>{t("filters.sort.newest")}</option>
                <option>{t("filters.sort.priceAsc")}</option>
                <option>{t("filters.sort.priceDesc")}</option>
              </select>
            </div>

            {/* Vehicles Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {vehicles?.map((v) => {
                const title = (v.name_i18n as Record<string, string>)?.[params.locale] || "Vehicle";
                const coverImg = v.vehicle_images?.find((img) => img.is_cover)?.url || v.vehicle_images?.[0]?.url || "/placeholder.png";
                const specs = v.specifications as Record<string, any> || {};
                
                // 构建收藏按钮所需的 vehicle 对象
                const vehicle = {
                  id: v.id,
                  name: title,
                  image: coverImg,
                  price: `${v.price_range_min?.toLocaleString()} - ${v.price_range_max?.toLocaleString()}`,
                  category: v.category || "Vehicle",
                };

                return (
                  <div
                    key={v.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 transition hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10"
                  >
                    <div className="absolute right-3 top-3 z-10">
                      <FavoriteButton vehicle={vehicle} />
                    </div>
                    <Link href={`/${params.locale}/vehicles/${v.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={coverImg}
                          alt={title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
                        <div className="mb-3 flex flex-wrap gap-2">
                          {v.category && (
                            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                              {v.category}
                            </span>
                          )}
                          {specs.year && (
                            <span className="rounded-full bg-slate-700/50 px-2.5 py-0.5 text-xs text-slate-300">
                              {specs.year}
                            </span>
                          )}
                        </div>
                        {(v.price_range_min || v.price_range_max) && (
                          <p className="mb-4 text-sm text-slate-400">
                            {t("featured.priceRange")}: ${v.price_range_min?.toLocaleString()} - ${v.price_range_max?.toLocaleString()}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <QuickInquiryButton vehicleName={title} vehicleId={v.id} />
                          <Button size="sm" variant="outline" className="flex-1 border-slate-700 text-slate-100">
                            {t("featured.cta.details")}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {vehicles?.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 py-20 text-center">
                <p className="text-lg text-slate-400">{t("vehicles.noResults")}</p>
                <Link href={`/${params.locale}/vehicles`}>
                  <Button className="mt-4" variant="outline">
                    {t("vehicles.clearFilters")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <Link
                  href={`/${params.locale}/vehicles?${new URLSearchParams({...searchParams, page: String(page - 1)})}`}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    page === 1
                      ? "cursor-not-allowed border-white/5 text-slate-600"
                      : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
                  }`}
                  aria-disabled={page === 1}
                >
                  {t("pagination.prev")}
                </Link>
                <div className="flex items-center gap-2">
                  {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                    const pageNum = page > 3 ? page - 2 + i : i + 1;
                    if (pageNum > totalPages) return null;
                    return (
                      <Link
                        key={pageNum}
                        href={`/${params.locale}/vehicles?${new URLSearchParams({...searchParams, page: String(pageNum)})}`}
                        className={`rounded-lg border px-4 py-2 text-sm transition ${
                          pageNum === page
                            ? "border-blue-500 bg-blue-500/20 font-semibold text-white"
                            : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>
                <Link
                  href={`/${params.locale}/vehicles?${new URLSearchParams({...searchParams, page: String(page + 1)})}`}
                  className={`rounded-lg border px-4 py-2 text-sm transition ${
                    page === totalPages
                      ? "cursor-not-allowed border-white/5 text-slate-600"
                      : "border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10"
                  }`}
                  aria-disabled={page === totalPages}
                >
                  {t("pagination.next")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
