import MapContainer from "@/components/map/MapContainer";
import { Info } from "lucide-react";

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-3.5rem-4rem)] flex flex-col">
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800">
          市民のみなさんが投稿した除排雪状況をリアルタイムで表示しています。マーカーをタップすると詳細を確認できます。
        </p>
      </div>
      <div className="flex-1">
        <MapContainer />
      </div>
    </div>
  );
}
