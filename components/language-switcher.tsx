'use client';

import {useRouter, usePathname} from "next/navigation";
import {useState, useRef, useEffect} from "react";

const locales = [
  { code: "en", name: "EN" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "ES" },
  { code: "pt", name: "PT" },
  { code: "fr", name: "FR" },
  { code: "ru", name: "RU" },
  { code: "ja", name: "日本語" },
];

export function LanguageSwitcher({current}: {current: string}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const handleLanguageChange = (code: string) => {
    if (code === current) {
      setIsOpen(false);
      return;
    }

    // Construct the new path by replacing the locale segment
    // pathname example: "/en/about" -> ["", "en", "about"]
    const segments = pathname.split('/');
    segments[1] = code;
    const newPath = segments.join('/') || `/${code}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{locales.find((l) => l.code === current)?.name || "EN"}</span>
        <svg 
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-32 rounded-lg border border-white/10 bg-slate-900 py-1 shadow-xl z-50">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleLanguageChange(loc.code)}
              className={`block w-full px-4 py-2 text-left text-xs transition ${loc.code === current ? "bg-blue-500/20 font-semibold text-white" : "text-slate-300 hover:bg-white/10"}`}
              role="menuitem"
            >
              {loc.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
