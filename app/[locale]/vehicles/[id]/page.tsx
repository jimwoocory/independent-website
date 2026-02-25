import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {Button} from "@/components/ui/button";
import {getSupabaseServerClient, isSupabaseConfigured} from "@/lib/supabase/server";

import type {Database} from "@/supabase/database.types";
import {getTranslations} from "next-intl/server";

// 动态导入 - 仅管理员可见的上传组件懒加载
const UploadWidget = dynamic(() => import("@/components/upload-widget").then(mod => ({default: mod.UploadWidget})), {
  loading: () => <div className="text-sm text-slate-400">Loading...</div>,
  ssr: false,
});

// 动态导入 - 询价表单懒加载
const InquiryForm = dynamic(() => import("@/components/inquiry-form").then(mod => ({default: mod.InquiryForm})), {
  loading: () => <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center text-slate-400">Loading form...</div>,
  ssr: false,
});


// ISR 配置：每60秒重新验证详情页数据
export const revalidate = 60;

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"] & {
  vehicle_images?: {url: string | null; is_cover: boolean | null; display_order: number | null}[];
  certificates?: {id: string; title_i18n: unknown; pdf_url: string | null; issue_date: string | null; expiry_date: string | null}[];
};

const fallback: VehicleRow = {
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
  specifications: {
    brand: "MG",
    year: "2026",
    model: "MG5",
    engine: "1.5L 180DVVT",
    transmission: "CVT",
    drive: "FWD",
    fuel: "Petrol",
    mileage: "0",
    color: "Multiple colors available",
    power: "120HP",
    torque: "150N·m",
    fuelEconomy: "5.8L/100km",
    length: "4675mm",
    width: "1842mm",
    height: "1480mm",
    wheelbase: "2680mm",
    cargo: "485L"
  },
  price_range_min: 9000,
  price_range_max: 11500,
  status: "active",
  created_at: null,
  vehicle_images: [
    {url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80", is_cover: true, display_order: 1},
    {url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80", is_cover: false, display_order: 2},
    {url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80", is_cover: false, display_order: 3},
    {url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80", is_cover: false, display_order: 4},
  ],
  certificates: [
    {
      id: "cert-1",
      title_i18n: {en: "GCC Conformity Certificate", zh: "GCC合格证书"},
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      issue_date: "2024-01-01",
      expiry_date: "2026-01-01",
    },
    {
      id: "cert-2",
      title_i18n: {en: "Export Certificate", zh: "出口证书"},
      pdf_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      issue_date: "2024-01-01",
      expiry_date: "2027-01-01",
    },
  ],
};

function getName(v: VehicleRow, locale: string) {
  return (v.name_i18n as Record<string, string | undefined>)?.[locale] ??
    (v.name_i18n as Record<string, string | undefined>)?.en ?? "Vehicle";
}

function getDesc(v: VehicleRow, locale: string) {
  return (v.description_i18n as Record<string, string | undefined>)?.[locale] ??
    (v.description_i18n as Record<string, string | undefined>)?.en ?? "";
}

function price(v: VehicleRow) {
  if (v.price_range_min && v.price_range_max) return `$${Math.round(v.price_range_min / 1000)}k - $${Math.round(v.price_range_max / 1000)}k`;
  if (v.price_range_min) return `$${Math.round(v.price_range_min / 1000)}k+`;
  return "—";
}

async function fetchVehicle(id: string) {
  // 本地开发无Supabase时自动启用fallback
  const enableFallback = !isSupabaseConfigured || (process.env.NODE_ENV !== 'production' && process.env.ENABLE_FALLBACK === 'true');
  
  // 测试数据：根据ID返回对应的fallback
  const testVehicles: Record<string, VehicleRow> = {
    "mg5-2026": fallback,
  };
  
  if (enableFallback) {
    // 如果有对应的测试数据就返回，否则用默认fallback
    return testVehicles[id] || fallback;
  }
  
  try {
    const supabase = getSupabaseServerClient();


    const {data, error} = await supabase
      .from("vehicles")
      .select(
        "id, name_i18n, description_i18n, category, price_range_min, price_range_max, status, created_at, specifications, vehicle_images(url,is_cover,display_order), certificates(id,title_i18n,pdf_url,issue_date,expiry_date)"
      )
      .eq("id", id)
      .single();
    if (error || !data) {
      if (enableFallback) {
        console.warn('[DEV] Using fallback vehicle data - no data from database');
        return fallback;
      }
      return null;
    }
    return data as VehicleRow;
  } catch (err) {
    console.error("fetchVehicle error:", err);
    if (enableFallback) {
      console.warn('[DEV] Using fallback vehicle data due to error');
      return fallback;
    }
    throw err;
  }
}

export default async function VehicleDetail({params}: {params: {locale: string; id: string}}) {
  const t = await getTranslations(params.locale);
  const vehicle = await fetchVehicle(params.id);
  
  // 如果没有找到车辆数据（生产环境且数据库无数据）
  if (!vehicle) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Vehicle Not Found</h1>
          <Link href={`/${params.locale}`} className="text-blue-400 hover:underline">
            Return to Home
          </Link>
        </div>
      </main>
    );
  }
  
  const title = getName(vehicle, params.locale);
  const desc = getDesc(vehicle, params.locale);
  const cover = vehicle.vehicle_images?.find((i) => i.is_cover)?.url || vehicle.vehicle_images?.[0]?.url;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="border-b border-white/5 bg-black/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href={`/${params.locale}`} className="text-sm text-slate-300 hover:text-white">{t("detail.back")}</Link>
            <span className="text-white">/</span>
            <span className="text-white font-semibold">{title}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-slate-700 text-slate-100">{t("nav.quote")}</Button>
            <Button size="sm">WhatsApp</Button>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-6 py-10 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60">
            {cover ? (
              <div className="relative h-[420px] w-full">
                <Image 
                  src={cover} 
                  alt={title} 
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex h-[420px] items-center justify-center text-slate-400">{t("detail.noImages")}</div>
            )}
          </div>
          {vehicle.vehicle_images && vehicle.vehicle_images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {vehicle.vehicle_images.slice(0, 8).map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-white/10 bg-slate-900/40">
                  {img.url ? (
                    <div className="relative h-28 w-full">
                      <Image 
                        src={img.url} 
                        alt={title} 
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  ) : (
                    <div className="flex h-28 items-center justify-center text-xs text-slate-500">{t("featured.noImage")}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              {t("detail.noImages")}
            </div>
          )}
          <div className="pt-2">
            <UploadWidget type="vehicle_image" label={t("detail.uploadImage")}
            />
          </div>

        </div>


          <div className="space-y-4 rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 to-black p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100">{vehicle.category ?? "Vehicle"}</span>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-100">{vehicle.status ?? "Active"}</span>
            </div>
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
            <p className="text-slate-300">{desc}</p>
            <div className="text-lg font-semibold text-white">{price(vehicle)}</div>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-200">
              {vehicle.specifications && Object.keys(vehicle.specifications).length > 0 ? (
                Object.entries(vehicle.specifications as Record<string, string | number>).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-white/5 bg-white/5 px-3 py-2">
                    <p className="text-xs uppercase text-slate-400">{t(`detail.spec.${k}` as any) ?? k}</p>
                    <p className="font-semibold text-white">{v as string}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-2 rounded-lg border border-dashed border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
                  {t("detail.noSpecs")}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button className="flex-1 min-w-[140px]">{t("featured.cta.inquiry")}</Button>
              <Button variant="outline" className="flex-1 min-w-[140px] border-slate-700 text-slate-100">{t("featured.cta.details")}</Button>
              <a
                href={`https://wa.me/8613800000000?text=${encodeURIComponent(`Hi, I'm interested in ${title}`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-emerald-500/60 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300 hover:bg-emerald-500/15"
              >
                {t("hero.social.whatsapp")}
              </a>
            </div>
          </div>

      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{t("detail.certificates")}</h2>
              <span className="text-sm text-slate-300">{vehicle.certificates?.length ?? 0} {t("detail.items")}</span>
            </div>
            <div className="space-y-3">
              {(vehicle.certificates?.length ?? 0) === 0 && (
                <p className="text-sm text-slate-400">{t("detail.noCerts")}</p>
              )}
              {vehicle.certificates?.map((c) => {
                const title = (c.title_i18n as Record<string, string | undefined>)?.[params.locale] ??
                  (c.title_i18n as Record<string, string | undefined>)?.en ?? "Certificate";
                return (
                  <div key={c.id} className="rounded-xl border border-white/5 bg-white/5 px-4 py-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{title}</p>
                        <p className="text-xs text-slate-400">
                          {c.issue_date ? `${t("detail.issued")}: ${c.issue_date}` : ""}
                          {c.expiry_date ? ` · ${t("detail.expires")}: ${c.expiry_date}` : ""}
                        </p>
                      </div>
                      {c.pdf_url && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-slate-700 text-slate-100" asChild>
                            <Link href={c.pdf_url} target="_blank" rel="noreferrer">
                              {t("detail.viewPdf")}
                            </Link>
                          </Button>
                          <Button size="sm" variant="ghost" className="text-slate-100" asChild>
                            <Link href={c.pdf_url} target="_blank" rel="noreferrer" download>
                              {t("detail.download")}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {vehicle.certificates?.[0]?.pdf_url ? (
              <div className="mt-2 space-y-2 rounded-xl border border-white/10 bg-black/40 p-3">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{t("detail.preview")}</span>
                  <Link href={vehicle.certificates[0].pdf_url} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 text-xs">
                    {t("detail.viewPdf")}
                  </Link>
                </div>
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-900">
                  <iframe
                    src={vehicle.certificates[0].pdf_url + "#toolbar=0&navpanes=0&scrollbar=1"}
                    className="h-72 w-full"
                    loading="lazy"
                    title="certificate"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">{t("detail.noCerts")}</p>
            )}
            <div className="pt-3 space-y-2">
              <UploadWidget type="certificate_pdf" label={t("detail.uploadCert")}
              />
            </div>
          </div>


          <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950 p-6">
            <h2 className="text-lg font-semibold text-white">{t("cta.title")}</h2>
            <p className="text-slate-300">{t("cta.subtitle")}</p>
            <InquiryForm
              locale={params.locale}
              vehicleId={vehicle.id}
              whatsappNumber="8613800000000"
              defaultMessage={`Hi, I'm interested in ${title}`}
              labels={{
                name: t("inquiry.form.name"),
                email: t("inquiry.form.email"),
                phone: t("inquiry.form.phone"),
                country: t("inquiry.form.country"),
                quantity: t("inquiry.form.quantity"),
                message: t("inquiry.form.message"),
                submit: t("inquiry.form.submit"),
                success: t("inquiry.form.success"),
                error: t("inquiry.form.error"),
                whatsappSend: t("inquiry.form.whatsappSend"),
                whatsappHint: t("inquiry.form.whatsappHint"),
              }}
            />

          </div>
        </div>
      </section>
    </main>
  );
}
