"use client";
/* eslint-disable @next/next/no-img-element */

import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

type ImageUploaderProps = {
  imageUrl: string;
  onChange: (imageUrl: string) => void;
  error?: string;
};

export function ImageUploader({ imageUrl, onChange, error }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setLocalError("Зөвхөн PNG, JPG, эсвэл WEBP зураг оруулна уу.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setLocalError(`Зургийн хэмжээ ${MAX_FILE_SIZE_MB}MB-ээс бага байх ёстой.`);
      return;
    }

    setLocalError("");
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#183153]">Зураг оруулах</p>
          <p className="text-sm text-[#6d7f9c]">Зургийг урьдчилан харах, солих, устгах боломжтой.</p>
        </div>
        <input
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-dashed border-[#c7d8ef] bg-[#f8fbff]">
        {imageUrl ? (
          <img alt="Асуултын зураг" className="h-52 w-full object-cover" src={imageUrl} />
        ) : (
          <div className="flex h-52 flex-col items-center justify-center gap-3 text-[#7d8ca5]">
            <ImagePlus className="h-8 w-8" />
            <p className="text-sm">Одоогоор зураг сонгогдоогүй байна.</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-10 items-center rounded-xl border border-[#d7e2f1] bg-white px-3 text-sm font-semibold text-[#365077] transition hover:border-[#aac8f8] hover:text-[#1f6feb]"
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Upload className="mr-2 h-4 w-4" />
          {imageUrl ? "Зураг солих" : "Зураг оруулах"}
        </button>
        {imageUrl ? (
          <button
            className="inline-flex h-10 items-center rounded-xl border border-[#f0d0d0] bg-[#fff5f5] px-3 text-sm font-semibold text-[#c95050] transition hover:bg-[#ffe9e9]"
            onClick={() => onChange("")}
            type="button"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Зураг устгах
          </button>
        ) : null}
      </div>

      <p className="text-xs text-[#7d8ca5]">Зөвшөөрөх төрөл: PNG, JPG, WEBP. Дээд хэмжээ: 5MB.</p>
      {localError || error ? (
        <p className="text-sm font-medium text-[#d34f4f]">{localError || error}</p>
      ) : null}
    </div>
  );
}
