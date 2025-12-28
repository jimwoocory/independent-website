import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, X} from "lucide-react";
import {getTranslations} from "next-intl/server";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import type {Database} from "@/supabase/database.types";
import {Button} from "@/components/ui/button";

type VehicleRow = Database["public"]["Tables"]["vehicles"]["Row"] & {
  vehicle_images?: {url: string | null; is_cover: boolean | null}[];
  certificates?: {count: number}[];
};

async function getVehiclesForComparison(ids: string[], locale: string) {
  const supabase = getSupabaseServerClient();
  const {data, error} = await supabase
    .from("vehicles")
    .select("id, name_i18n, description_i18n, category, specifications, price_range_min, price_range_max, status, vehicle_images(url, is_cover), certificates(count)")
    .in("id", ids);

  if (error || !data) return [];
  return data as VehicleRow[];
}

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: {locale: string};
  searchParams?: {ids?: string};
}) {
  const t = await getTranslations();
  const ids = searchParams?.ids?.split(",").filter(Boolean) ?? [];

  if (ids.length < 2) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold">{t("compare.title")}</h1>
          <p className="mt-4 text-slate-300">{t("compare.selectMin")}</p>
          <Link href={`/${params.locale}/favorites`}>
            <Button className="mt-6">{t("compare.backToFavorites")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const vehicles = await getVehiclesForComparison(ids, params.locale);

  if (vehicles.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl font-bold">{t("compare.title")}</h1>
          <p className="mt-4 text-slate-300">{t("compare.noData")}</p>
          <Link href={`/${params.locale}/favorites`}>
            <Button className="mt-6">{t("compare.backToFavorites")}</Button>
          </Link>
        </div>
      </main>
    );
  }

  const getName = (v: VehicleRow) => {
    const name = (v.name_i18n as Record<string, string | undefined>)?.[params.locale];
    return name ?? (v.name_i18n as Record<string, string | undefined>)?.en ?? "Vehicle";
  };

  const getImage = (v: VehicleRow) => {
    return v.vehicle_images?.find((i) => i.is_cover)?.url || v.vehicle_images?.[0]?.url || null;
  };

  const getPrice = (v: VehicleRow) => {
    if (v.price_range_min && v.price_range_max) {
      return `$${Math.round(v.price_range_min / 1000)}k - $${Math.round(v.price_range_max / 1000)}k`;
    }
    if (v.price_range_min) return `$${Math.round(v.price_range_min / 1000)}k+`;
    return "—";
  };

  const getSpec = (v: VehicleRow, key: string) => {
    return (v.specifications as Record<string, any>)?.[key] ?? "—";
  };

  const specRows = [
    {key: "brand", label: t("compare.spec.brand")},
    {key: "model", label: t("compare.spec.model")},
    {key: "year", label: t("compare.spec.year")},
    {key: "power", label: t("detail.spec.power")},
    {key: "drive", label: t("detail.spec.drive")},
    {key: "transmission", label: t("detail.spec.transmission")},
    {key: "seats", label: t("detail.spec.seats")},
    {key: "mileage", label: t("compare.spec.mileage")},
    {key: "fuel", label: t("compare.spec.fuel")},
    {key: "color", label: t("compare.spec.color")},
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${params.locale}/favorites`}
              className="rounded-lg border border-white/10 p-2 transition hover:border-white/30 hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">{t("compare.title")}</h1>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
              {vehicles.length} {t("compare.vehicles")}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-48 bg-slate-950 p-4 text-left">
                  <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">{t("compare.feature")}</span>
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="min-w-[280px] p-4">
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        {getImage(v) ? (
                          <Image src={getImage(v)!} alt={getName(v)} fill className="object-cover" sizes="280px" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-slate-900 text-sm text-slate-400">
                            {t("featured.noImage")}
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white">{getName(v)}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100">{v.category}</span>
                        <span className="text-slate-300">{getPrice(v)}</span>
                      </div>
                      <Link href={`/${params.locale}/vehicles/${v.id}`}>
                        <Button size="sm" variant="outline" className="w-full border-slate-700 text-slate-100">
                          {t("featured.cta.details")}
                        </Button>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-white/5">
                <td className="sticky left-0 z-10 bg-slate-950 p-4 font-semibold text-white">{t("compare.price")}</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-4 text-center text-slate-200">
                    {getPrice(v)}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-white/5">
                <td className="sticky left-0 z-10 bg-slate-950 p-4 font-semibold text-white">{t("compare.status")}</td>
                {vehicles.map((v) => (
                  <td key={v.id} className="p-4 text-center">
                    <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                      {v.status ?? "active"}
                    </span>
                  </td>
                ))}
              </tr>
              {specRows.map((row) => (
                <tr key={row.key} className="border-t border-white/5">
                  <td className="sticky left-0 z-10 bg-slate-950 p-4 font-semibold text-white">{row.label}</td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-4 text-center text-slate-200">
                      {getSpec(v, row.key)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
