import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/lib/validation/admin-phase7";

export const ALLOWED_IMAGE_MIME_SET = new Set<string>(ALLOWED_IMAGE_MIME_TYPES);

export function extensionFromFile(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName) {
    if (fromName === "jpeg") {
      return "jpg";
    }

    if (["jpg", "png", "webp", "avif"].includes(fromName)) {
      return fromName;
    }
  }

  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };

  return mimeMap[file.type] ?? "jpg";
}

export function formatUploadBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_SET.has(file.type)) {
    return "סוג הקובץ אינו נתמך. ניתן להעלות JPEG, PNG, WebP או AVIF.";
  }

  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return `גודל הקובץ חורג מהמגבלה (${formatUploadBytes(MAX_IMAGE_UPLOAD_BYTES)}).`;
  }

  return null;
}
