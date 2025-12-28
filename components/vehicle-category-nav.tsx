"use client";

import {useState} from "react";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useTranslations} from "@/lib/translations";
import {ChevronDown} from "lucide-react";

const categories = [
  {
    id: "suv",
    labelKey: "categoryNav.suv",
    brands: [
      {id: "toyota", nameKey: "categoryNav.brands.toyota", models: ["RAV4", "Land Cruiser", "Highlander"]},
      {id: "honda", nameKey: "categoryNav.brands.honda", models: ["CR-V", "Pilot"]},
      {id: "nissan", nameKey: "categoryNav.brands.nissan", models: ["X-Trail", "Patrol"]},
      {id: "byd", nameKey: "categoryNav.brands.byd", models: ["Tang", "Yuan Plus"]},
      {id: "geely", nameKey: "categoryNav.brands.geely", models: ["Coolray", "Monjaro"]},
    ],
  },
  {
    id: "sedan",
    labelKey: "categoryNav.sedan",
    brands: [
      {id: "toyota", nameKey: "categoryNav.brands.toyota", models: ["Camry", "Corolla"]},
      {id: "honda", nameKey: "categoryNav.brands.honda", models: ["Accord", "Civic"]},
      {id: "mazda", nameKey: "categoryNav.brands.mazda", models: ["Mazda3", "Mazda6"]},
      {id: "byd", nameKey: "categoryNav.brands.byd", models: ["Han", "Seal"]},
    ],
  },
  {
    id: "mpv",
    labelKey: "categoryNav.mpv",
    brands: [
      {id: "toyota", nameKey: "categoryNav.brands.toyota", models: ["Alphard", "Vellfire"]},
      {id: "honda", nameKey: "categoryNav.brands.honda", models: ["Odyssey", "Elysion"]},
      {id: "buick", nameKey: "categoryNav.brands.buick", models: ["GL8"]},
    ],
  },
  {
    id: "pickup",
    labelKey: "categoryNav.pickup",
    brands: [
      {id: "toyota", nameKey: "categoryNav.brands.toyota", models: ["Hilux", "Tundra"]},
      {id: "nissan", nameKey: "categoryNav.brands.nissan", models: ["Navara", "Titan"]},
      {id: "ford", nameKey: "categoryNav.brands.ford", models: ["Ranger", "F-150"]},
      {id: "gw", nameKey: "categoryNav.brands.gw", models: ["Poer", "Cannon"]},
    ],
  },
];

export function VehicleCategoryNav() {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale as string;
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <nav className="relative z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <ul className="flex items-center gap-8">
          {categories.map((category) => (
            <li
              key={category.id}
              className="group relative"
              onMouseEnter={() => setOpenCategory(category.id)}
              onMouseLeave={() => setOpenCategory(null)}
            >
              {/* Category Button */}
              <button className="flex items-center gap-1.5 py-4 text-sm font-medium text-slate-200 transition hover:text-white">
                {t(category.labelKey)}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openCategory === category.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {openCategory === category.id && (
                <div className="absolute left-0 top-full w-screen max-w-4xl">
                  <div className="mt-2 rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-6">
                      {category.brands.map((brand) => (
                        <div key={brand.id} className="space-y-2">
                          {/* Brand Name */}
                          <h3 className="mb-3 text-sm font-semibold text-white">
                            {t(brand.nameKey)}
                          </h3>
                          {/* Models List */}
                          <ul className="space-y-1.5">
                            {brand.models.map((model) => (
                              <li key={model}>
                                <Link
                                  href={`/${locale}/vehicles?category=${category.id}&brand=${brand.id}&model=${encodeURIComponent(model)}`}
                                  className="block rounded-md px-3 py-1.5 text-sm text-slate-300 transition hover:bg-blue-500/10 hover:text-blue-300"
                                >
                                  {model}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          {/* View All Brand */}
                          <Link
                            href={`/${locale}/vehicles?category=${category.id}&brand=${brand.id}`}
                            className="mt-2 block rounded-md bg-slate-800/50 px-3 py-1.5 text-center text-xs font-medium text-blue-300 transition hover:bg-slate-800"
                          >
                            {t("categoryNav.viewAll")} {t(brand.nameKey)}
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* View All Category */}
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <Link
                        href={`/${locale}/vehicles?category=${category.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-500/30"
                      >
                        {t("categoryNav.viewAllCategory")} {t(category.labelKey)}
                        <span className="text-xs opacity-60">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}

          {/* All Vehicles Link */}
          <li>
            <Link
              href={`/${locale}/vehicles`}
              className="block py-4 text-sm font-medium text-blue-400 transition hover:text-blue-300"
            >
              {t("categoryNav.allVehicles")}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
