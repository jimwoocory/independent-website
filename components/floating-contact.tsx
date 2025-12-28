'use client';

import { useState } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { useTranslations } from "@/lib/translations";

const WHATSAPP_NUMBER = "+8613800000000";
const PHONE_NUMBER = "+86 138 0000 0000";
const EMAIL = "export@autoexport.com";

export function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const handleWhatsApp = () => {
    const message = encodeURIComponent(t("floating.whatsapp.message"));
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  const handlePhone = () => {
    window.location.href = `tel:${WHATSAPP_NUMBER}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(t("floating.email.subject"))}`;
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contact Menu */}
      <div
        className={`fixed right-6 z-50 transition-all duration-300 ${
          isOpen ? "bottom-40" : "bottom-24 pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col gap-3">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="group flex items-center gap-3 rounded-full border border-emerald-500/60 bg-emerald-600 px-4 py-3 shadow-lg transition hover:bg-emerald-500 hover:shadow-xl"
          >
            <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="font-medium text-white">{t("floating.whatsapp")}</span>
          </button>

          {/* Phone */}
          <button
            onClick={handlePhone}
            className="group flex items-center gap-3 rounded-full border border-blue-500/60 bg-blue-600 px-4 py-3 shadow-lg transition hover:bg-blue-500 hover:shadow-xl"
          >
            <Phone className="h-6 w-6 text-white" />
            <span className="font-medium text-white">{t("floating.phone")}</span>
          </button>

          {/* Email */}
          <button
            onClick={handleEmail}
            className="group flex items-center gap-3 rounded-full border border-slate-500/60 bg-slate-600 px-4 py-3 shadow-lg transition hover:bg-slate-500 hover:shadow-xl"
          >
            <Mail className="h-6 w-6 text-white" />
            <span className="font-medium text-white">{t("floating.email")}</span>
          </button>
        </div>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg transition hover:scale-110 hover:shadow-xl active:scale-95"
        aria-label={t("floating.toggle")}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* WeChat QR Code Popup (Optional) */}
      {isOpen && (
        <div className="fixed bottom-56 right-6 z-50 hidden md:block">
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4 shadow-xl">
            <div className="mb-2 text-center text-sm font-semibold text-white">
              {t("floating.wechat")}
            </div>
            <div className="h-32 w-32 rounded-lg bg-white p-2">
              {/* Placeholder for QR code - replace with actual QR image */}
              <div className="flex h-full items-center justify-center text-xs text-slate-600">
                QR Code
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-slate-400">
              {t("floating.wechat.scan")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
