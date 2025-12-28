"use client";

import {useState, useCallback} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {Search, X} from "lucide-react";
import {useTranslations} from "@/lib/translations";
import {debounce} from "@/lib/utils";

interface SearchBarProps {
  locale: string;
  placeholder?: string;
}

export function SearchBar({locale, placeholder}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const t = useTranslations();

  // 实时搜索建议（可选，需要API支持）
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value.trim()) {
        params.set("q", value.trim());
      } else {
        params.delete("q");
      }
      params.delete("page"); // 重置分页
      router.push(`${pathname}?${params.toString()}#featured`);
    }, 500),
    [pathname, searchParams]
  );

  const handleChange = (value: string) => {
    setQuery(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}?${params.toString()}#featured`);
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center rounded-lg border bg-black/40 transition-colors ${
          isFocused ? "border-blue-400 bg-black/60" : "border-white/10"
        }`}
      >
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder ?? t("search.placeholder")}
          className="w-full bg-transparent py-2.5 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 text-slate-400 transition hover:text-white"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
