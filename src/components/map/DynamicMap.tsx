"use client";

import { useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";
import { AOMORI_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import { useReports } from "@/hooks/useReports";
import { useAuth } from "@/hooks/useAuth";
import ReportMarker from "./ReportMarker";
import MapLegend from "./MapLegend";
import "leaflet/dist/leaflet.css";

interface DynamicMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  interactive?: boolean;
  selectedPosition?: { lat: number; lng: number } | null;
}

// 選択位置のマーカーアイコン
const selectedIcon = L.divIcon({
  html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="3"/>
    <circle cx="16" cy="16" r="4" fill="white"/>
  </svg>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function MapEventHandler({
  onLocationSelect,
  onBoundsChange,
}: {
  onLocationSelect?: (lat: number, lng: number) => void;
  onBoundsChange: () => void;
}) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
    },
    moveend() {
      onBoundsChange();
    },
    zoomend() {
      onBoundsChange();
    },
  });
  return null;
}

export default function DynamicMap({
  onLocationSelect,
  interactive = false,
  selectedPosition,
}: DynamicMapProps) {
  const { reports, fetchReports } = useReports();
  const { user } = useAuth();
  const mapRef = useRef<L.Map | null>(null);

  const handleBoundsChange = useCallback(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    fetchReports({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [fetchReports]);

  useEffect(() => {
    // 初回読み込み時にデフォルト範囲で取得
    const timer = setTimeout(() => {
      if (mapRef.current) {
        handleBoundsChange();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [handleBoundsChange]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[AOMORI_CENTER.lat, AOMORI_CENTER.lng]}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventHandler
          onLocationSelect={interactive ? onLocationSelect : undefined}
          onBoundsChange={handleBoundsChange}
        />

        {/* 投稿マーカー（投稿選択モードでない場合のみ表示） */}
        {!interactive &&
          reports.map((report) => (
            <ReportMarker
              key={report.id}
              report={report}
              currentUserId={user?.id}
              onDeleted={handleBoundsChange}
            />
          ))}

        {/* 選択位置マーカー */}
        {selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={selectedIcon}
          />
        )}
      </MapContainer>

      {/* 凡例（投稿モードでない場合のみ） */}
      {!interactive && <MapLegend />}
    </div>
  );
}
