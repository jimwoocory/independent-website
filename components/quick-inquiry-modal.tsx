"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/translations";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickInquiryModalProps {
  vehicleName: string;
  vehicleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickInquiryModal({ vehicleName, vehicleId, isOpen, onClose }: QuickInquiryModalProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      country: formData.get("country"),
      quantity: formData.get("quantity"),
      message: `Inquiry for: ${vehicleName} (ID: ${vehicleId})`,
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-white">
            {t("quickInquiry.title")}
          </h3>
          <p className="mt-1 text-sm text-slate-400">{vehicleName}</p>
        </div>

        {/* Form */}
        {isSuccess ? (
          <div className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-4 text-center">
            <div className="mb-2 text-4xl">✓</div>
            <p className="font-semibold text-emerald-100">
              {t("quickInquiry.success")}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                {t("inquiry.form.name")} *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  {t("inquiry.form.email")} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                  {t("inquiry.form.phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-300">
                  {t("inquiry.form.country")} *
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-300">
                  {t("inquiry.form.quantity")}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  defaultValue="1"
                  className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-slate-700 text-slate-100"
                onClick={onClose}
              >
                {t("quickInquiry.cancel")}
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? t("quickInquiry.sending") : t("quickInquiry.send")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
