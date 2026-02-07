"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Report, MapBounds } from "@/lib/types";

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchReports = useCallback(
    async (bounds: MapBounds) => {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc(
        "get_reports_in_bounds",
        {
          min_lat: bounds.south,
          max_lat: bounds.north,
          min_lng: bounds.west,
          max_lng: bounds.east,
        }
      );

      if (rpcError) {
        setError("投稿データの取得に失敗しました");
        console.error(rpcError);
      } else {
        setReports((data as Report[]) ?? []);
      }

      setLoading(false);
    },
    [supabase]
  );

  return { reports, loading, error, fetchReports };
}
