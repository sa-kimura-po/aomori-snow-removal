"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { REPORT_STATUSES } from "@/lib/constants";
import type { Report } from "@/lib/types";
import type { ReportStatus } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

function createMarkerIcon(status: ReportStatus) {
  const color = REPORT_STATUSES[status].color;
  return L.divIcon({
    html: `<svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="10" fill="${color}" stroke="white" stroke-width="3"/>
    </svg>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

interface ReportMarkerProps {
  report: Report;
}

export default function ReportMarker({ report }: ReportMarkerProps) {
  const statusInfo = REPORT_STATUSES[report.status];
  const icon = createMarkerIcon(report.status);
  const timeAgo = formatDistanceToNow(new Date(report.created_at), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Marker position={[report.lat, report.lng]} icon={icon}>
      <Popup>
        <div className="min-w-[180px]">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: statusInfo.color }}
            />
            <span className="font-semibold text-sm">{statusInfo.label}</span>
          </div>

          {report.comment && (
            <p className="text-sm text-gray-700 mb-1">{report.comment}</p>
          )}

          {report.photo_url && (
            <img
              src={report.photo_url}
              alt="投稿写真"
              className="w-full rounded mb-1"
              loading="lazy"
            />
          )}

          <div className="text-xs text-gray-400 mt-1">
            <span>{report.display_name ?? "匿名"}</span>
            <span className="mx-1">·</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
