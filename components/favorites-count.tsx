"use client";

import {useState, useEffect} from "react";
import {Heart} from "lucide-react";
import {getFavorites} from "@/lib/favorites";
import Link from "next/link";

export function FavoritesCount({locale}: {locale: string}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getFavorites().length);

    const handleChange = () => setCount(getFavorites().length);
    window.addEventListener("favoritesChanged", handleChange);
    return () => window.removeEventListener("favoritesChanged", handleChange);
  }, []);

  return (
    <Link
      href={`/${locale}/favorites`}
      className="relative rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur transition hover:border-red-400 hover:bg-red-500/20"
    >
      <Heart className="h-5 w-5 text-white" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
