"use client";

import {useState} from "react";
import {useTranslations} from "@/lib/translations";
import {Filter, ChevronDown} from "lucide-react";
import {Button} from "@/components/ui/button";

interface AdvancedFiltersProps {
  brands: string[];
  currentFilters: {
    brand?: string;
    year_min?: number;
    year_max?: number;
    mileage_max?: number;
  };
  onApply: (filters: Record<string, string | number>) => void;
}

export function AdvancedFilters({brands, currentFilters, onApply}: AdvancedFiltersProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [brand, setBrand] = useState(currentFilters.brand ?? "all");
  const [yearMin, setYearMin] = useState(currentFilters.year_min ?? "");
  const [yearMax, setYearMax] = useState(currentFilters.year_max ?? "");
  const [mileageMax, setMileageMax] = useState(currentFilters.mileage_max ?? "");

  const handleSubmit = () => {
    const filters: Record<string, string | number> = {};
    if (brand && brand !== "all") filters.brand = brand;
    if (yearMin) filters.year_min = Number(yearMin);
    if (yearMax) filters.year_max = Number(yearMax);
    if (mileageMax) filters.mileage_max = Number(mileageMax);
    onApply(filters);
    setIsOpen(false);
  };

  const handleClear = () => {
    setBrand("all");
    setYearMin("");
    setYearMax("");
    setMileageMax("");
    onApply({});
  };

  const activeCount = [
    brand !== "all",
    yearMin,
    yearMax,
    mileageMax,
  ].filter(Boolean).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white transition hover:border-white/30 hover:bg-white/5"
      >
        <Filter className="h-4 w-4" />
        <span>{t("filters.advanced")}</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold">
            {activeCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-white/10 bg-slate-950/95 p-6 shadow-2xl backdrop-blur">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">{t("filters.brand")}</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              >
                <option value="all">{t("filters.all")}</option>
                {brands.map((b) => (
                  <option key={b} value={b} className="bg-slate-900">
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">{t("filters.year")}</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder={t("filters.yearMin")}
                  value={yearMin}
                  onChange={(e) => setYearMin(e.target.value)}
                  min={1990}
                  max={new Date().getFullYear()}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
                <input
                  type="number"
                  placeholder={t("filters.yearMax")}
                  value={yearMax}
                  onChange={(e) => setYearMax(e.target.value)}
                  min={1990}
                  max={new Date().getFullYear()}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">{t("filters.mileage")}</label>
              <input
                type="number"
                placeholder={t("filters.mileageMax")}
                value={mileageMax}
                onChange={(e) => setMileageMax(e.target.value)}
                min={0}
                step={1000}
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              />
              <p className="text-xs text-slate-400">{t("filters.mileageHint")}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleClear}
                className="flex-1 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/5"
              >
                {t("filters.clear")}
              </button>
              <Button onClick={handleSubmit} className="flex-1 px-4 py-2 text-sm">
                {t("filters.apply")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
