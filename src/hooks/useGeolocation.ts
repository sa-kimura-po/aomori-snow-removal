"use client";

import { useState, useCallback } from "react";

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "お使いのブラウザは位置情報に対応していません",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let message = "位置情報の取得に失敗しました";
        if (error.code === error.PERMISSION_DENIED) {
          message = "位置情報の使用が許可されていません";
        } else if (error.code === error.TIMEOUT) {
          message = "位置情報の取得がタイムアウトしました";
        }
        setState((prev) => ({ ...prev, error: message, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, getCurrentPosition };
}
