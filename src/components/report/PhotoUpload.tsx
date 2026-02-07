"use client";

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { MAX_PHOTO_WIDTH } from "@/lib/constants";

interface PhotoUploadProps {
  onPhotoReady: (file: File | null) => void;
}

function resizeImage(file: File, maxWidth: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      if (img.width <= maxWidth) {
        resolve(file);
        return;
      }

      const ratio = maxWidth / img.width;
      const canvas = document.createElement("canvas");
      canvas.width = maxWidth;
      canvas.height = img.height * ratio;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        0.85
      );
    };

    img.src = url;
  });
}

export default function PhotoUpload({ onPhotoReady }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const resized = await resizeImage(file, MAX_PHOTO_WIDTH);
    onPhotoReady(resized);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(resized);
  };

  const handleRemove = () => {
    setPreview(null);
    onPhotoReady(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <Camera className="w-4 h-4 inline mr-1" />
        写真（任意）
      </label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="プレビュー"
            className="w-full rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
        >
          <Camera className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <span className="text-sm text-gray-500">タップして写真を追加</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
