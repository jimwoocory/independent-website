"use client";

import {useState, useEffect} from "react";
import {useTranslations} from "@/lib/translations";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft, X, GitCompare, Trash2} from "lucide-react";
import {getFavorites, removeFavorite, clearFavorites, type FavoriteVehicle} from "@/lib/favorites";
import {Button} from "@/components/ui/button";

export default function FavoritesPage({params}: {params: {locale: string}}) {
  const t = useTranslations();
  const [favorites, setFavorites] = useState<FavoriteVehicle[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFavorites(getFavorites());

    const handleChange = () => setFavorites(getFavorites());
    window.addEventListener("favoritesChanged", handleChange);
    return () => window.removeEventListener("favoritesChanged", handleChange);
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    selectedForCompare.delete(id);
    setSelectedForCompare(new Set(selectedForCompare));
  };

  const handleClearAll = () => {
    if (confirm(t("favorites.confirmClear"))) {
      clearFavorites();
      setSelectedForCompare(new Set());
    }
  };

  const toggleCompareSelection = (id: string) => {
    const newSelection = new Set(selectedForCompare);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      if (newSelection.size >= 3) {
        alert(t("favorites.maxCompare"));
        return;
      }
      newSelection.add(id);
    }
    setSelectedForCompare(newSelection);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${params.locale}`}
              className="rounded-lg border border-white/10 p-2 transition hover:border-white/30 hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">{t("favorites.title")}</h1>
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-100">
              {favorites.length} {t("favorites.items")}
            </span>
          </div>
          {favorites.length > 0 && (
            <div className="flex gap-2">
              {selectedForCompare.size >= 2 && (
                <Link href={`/${params.locale}/compare?ids=${Array.from(selectedForCompare).join(",")}`}>
                  <Button size="sm" className="gap-2">
                    <GitCompare className="h-4 w-4" />
                    {t("favorites.compare")} ({selectedForCompare.size})
                  </Button>
                </Link>
              )}
              <Button size="sm" variant="outline" onClick={handleClearAll} className="gap-2 border-red-500/50 text-red-100">
                <Trash2 className="h-4 w-4" />
                {t("favorites.clearAll")}
              </Button>
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-16 text-center">
            <p className="text-lg font-semibold text-slate-300">{t("favorites.empty")}</p>
            <p className="mt-2 text-sm text-slate-400">{t("favorites.emptyHint")}</p>
            <Link href={`/${params.locale}#featured`}>
              <Button className="mt-6">{t("favorites.browse")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((vehicle) => {
              const isSelected = selectedForCompare.has(vehicle.id);
              return (
                <div
                  key={vehicle.id}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b from-slate-900 to-black shadow-lg transition ${
                    isSelected ? "border-blue-400 ring-2 ring-blue-400/50" : "border-white/5"
                  }`}
                >
                  <div className="absolute right-3 top-3 z-10 flex gap-2">
                    <button
                      onClick={() => toggleCompareSelection(vehicle.id)}
                      className={`rounded-full border p-2 backdrop-blur transition ${
                        isSelected
                          ? "border-blue-400 bg-blue-500/40 text-white"
                          : "border-white/10 bg-black/40 text-white hover:border-blue-400"
                      }`}
                      title={t("favorites.addToCompare")}
                    >
                      <GitCompare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemove(vehicle.id)}
                      className="rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur transition hover:border-red-400 hover:bg-red-500/20"
                      title={t("favorites.remove")}
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>

                  <div className="relative aspect-[4/3] w-full bg-slate-900/60">
                    {vehicle.image ? (
                      <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">{t("featured.noImage")}</div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold text-blue-100">{vehicle.category}</span>
                      <span className="text-slate-400">{vehicle.price}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{vehicle.name}</h3>
                    <Link href={`/${params.locale}/vehicles/${vehicle.id}`}>
                      <Button size="sm" variant="outline" className="mt-4 w-full border-slate-700 text-slate-100">
                        {t("featured.cta.details")}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
