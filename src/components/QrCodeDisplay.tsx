"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { generateQrDataUrl } from "@/lib/pdfReceipt";

interface QrCodeDisplayProps {
  payload: string;
  size?: number;
  boosted?: boolean;
}

export function QrCodeDisplay({ payload, size = 148, boosted = false }: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    generateQrDataUrl(payload)
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [payload]);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white p-2.5 transition-colors ${
        boosted ? "ring-4 ring-white" : "border border-white/20"
      }`}
      style={{ width: size + 20, height: size + 20 }}
    >
      {dataUrl ? (
        <Image
          src={dataUrl}
          alt="Admission QR Code"
          width={size}
          height={size}
          unoptimized
          className="block rounded-sm"
        />
      ) : (
        <div
          className="animate-pulse rounded bg-neutral-200"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  );
}
