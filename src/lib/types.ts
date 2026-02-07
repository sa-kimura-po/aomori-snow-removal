import type { ReportStatus } from "./constants";

export interface Report {
  id: string;
  user_id: string;
  lat: number;
  lng: number;
  status: ReportStatus;
  comment: string | null;
  photo_url: string | null;
  created_at: string;
  expires_at: string;
  display_name?: string;
}

export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface ReportInsert {
  lat: number;
  lng: number;
  status: ReportStatus;
  comment?: string;
  photo_url?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
