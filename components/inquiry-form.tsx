'use client';

import {useState} from "react";
import {Button} from "@/components/ui/button";

interface Props {
  locale: string;
  vehicleId?: string;
  whatsappNumber?: string;
  defaultMessage?: string;
  labels: {
    name: string;
    email: string;
    phone: string;
    country: string;
    quantity: string;
    message: string;
    submit: string;
    success: string;
    error: string;
    whatsappHint?: string;
    whatsappSend?: string;
  };
}

export function InquiryForm({locale, vehicleId, whatsappNumber, defaultMessage, labels}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [sendWhatsApp, setSendWhatsApp] = useState(Boolean(whatsappNumber));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      vehicle_id: vehicleId ?? null,
      contact_name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      phone: formData.get("phone")?.toString().trim() || "",
      country: formData.get("country")?.toString().trim() || "",
      quantity: Number(formData.get("quantity")) || null,
      message: formData.get("message")?.toString().trim() || "",
      locale,
    };

    if (!payload.contact_name || !payload.email) {
      setToast(labels.error);
      return;
    }

    try {
      setSubmitting(true);
      setToast(null);
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setToast(labels.success);
      event.currentTarget.reset();

      if (sendWhatsApp && whatsappNumber) {
        const text = payload.message || defaultMessage || "I want to inquire about a vehicle";
        const normalized = whatsappNumber.replace(/[^0-9]/g, "");
        const url = `https://wa.me/${normalized}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error(err);
      setToast(labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input name="name" placeholder={labels.name} required className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
        <input name="email" type="email" placeholder={labels.email} required className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
        <input name="phone" placeholder={labels.phone} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
        <input name="country" placeholder={labels.country} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
        <input name="quantity" type="number" min={1} placeholder={labels.quantity} className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none" />
        <div className="md:col-span-2">
          <textarea
            name="message"
            placeholder={labels.message}
            defaultValue={defaultMessage}
            rows={4}
            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {whatsappNumber && (
        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={sendWhatsApp}
            onChange={(e) => setSendWhatsApp(e.target.checked)}
            className="h-4 w-4 rounded border border-white/20 bg-black/40"
          />
          <span>
            {labels.whatsappSend || "Also send via WhatsApp"}
            {labels.whatsappHint ? ` · ${labels.whatsappHint}` : ""}
          </span>
        </label>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "..." : labels.submit}
      </Button>
      {toast && <p className="text-sm text-slate-100">{toast}</p>}
    </form>
  );
}

