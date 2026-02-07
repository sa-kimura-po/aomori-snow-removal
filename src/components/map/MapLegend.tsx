"use client";

import { useState } from "react";
import { REPORT_STATUSES } from "@/lib/constants";
import { Info, X } from "lucide-react";

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-3 min-w-[160px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">凡例</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1.5">
            {Object.entries(REPORT_STATUSES).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: value.color }}
                />
                <span className="text-xs text-gray-600">{value.label}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors"
          title="凡例を表示"
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}
