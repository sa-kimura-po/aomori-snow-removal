"use client";

import { MapPin, Navigation } from "lucide-react";
import MapContainer from "@/components/map/MapContainer";

interface LocationPickerProps {
  position: { lat: number; lng: number } | null;
  onPositionChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({
  position,
  onPositionChange,
}: LocationPickerProps) {
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onPositionChange(pos.coords.latitude, pos.coords.longitude);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-1" />
        場所を選択
      </label>

      <div className="h-64 rounded-lg overflow-hidden border border-gray-300 mb-2">
        <MapContainer
          interactive
          onLocationSelect={onPositionChange}
          selectedPosition={position}
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-1 text-sm text-blue-700 hover:text-blue-600"
        >
          <Navigation className="w-4 h-4" />
          現在地を使用
        </button>

        {position && (
          <span className="text-xs text-gray-500">
            {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </span>
        )}
      </div>

      {!position && (
        <p className="text-xs text-gray-400 mt-1">
          地図をタップするか、現在地を使用してください
        </p>
      )}
    </div>
  );
}
