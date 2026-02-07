"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-sm text-gray-500">地図を読み込んでいます...</p>
      </div>
    </div>
  ),
});

interface MapContainerProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  selectedPosition?: { lat: number; lng: number } | null;
}

export default function MapContainer({
  onLocationSelect,
  interactive = false,
  selectedPosition,
}: MapContainerProps) {
  return (
    <DynamicMap
      onLocationSelect={onLocationSelect}
      interactive={interactive}
      selectedPosition={selectedPosition}
    />
  );
}
