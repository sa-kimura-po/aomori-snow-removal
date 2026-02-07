import { ExternalLink } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/constants";

export default function ExternalLinks() {
  return (
    <div className="space-y-3">
      {EXTERNAL_LINKS.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{link.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
          </div>
        </a>
      ))}
    </div>
  );
}
