"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuickInquiryModal } from "@/components/quick-inquiry-modal";

interface QuickInquiryButtonProps {
  vehicleName: string;
  vehicleId: string;
}

export function QuickInquiryButton({ vehicleName, vehicleId }: QuickInquiryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-blue-500/30 transition-all duration-300">
        快速询价
      </Button>
      <QuickInquiryModal
        vehicleName={vehicleName}
        vehicleId={vehicleId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
