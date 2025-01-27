import { ALLOWED_TYPES, PLACEHOLDERS_TYPES } from "@/constants/files";
import path from "path";

export const canShowInBrowser = (fileExt: string): boolean => {
  const browserViewableTypes = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".pdf",
    ".txt",
    ".mp3",
    ".wav",
    ".mp4",
    ".webm",
  ];
  return browserViewableTypes.includes(fileExt.toLowerCase());
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
};

export const getFileType = (extension: string): string => {
  const typeMap: Record<string, string> = {
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".webp": "image",
    ".svg": "image",

    ".pdf": "document",
    ".doc": "document",
    ".docx": "document",
    ".xls": "document",
    ".xlsx": "document",
    ".txt": "document",
    ".csv": "document",
    ".sheet": "document",

    ".mp3": "audio",
    ".wav": "audio",

    ".mp4": "video",
    ".webm": "video",
  };
  return typeMap[extension] || "other";
};

export const getPlaceholder = (extension: string) => {
  return PLACEHOLDERS_TYPES[extension] || "/placeholder/placeholder.webp";
};

export const getMimeTypeFromExtension = (fileExt: string): string | null => {
  for (const [mimeType, extensions] of Object.entries(ALLOWED_TYPES)) {
    if (extensions.includes(fileExt.toLowerCase())) {
      return mimeType;
    }
  }
  return null;
};

export const getFileUrl = (file: File): string => {
  let fileUrl = "";
  if (file.type.includes("image")) {
    fileUrl = URL.createObjectURL(file);
  } else {
    fileUrl = getPlaceholder(file.type);
  }
  return fileUrl;
};

// export const groupFilesByType = (files: string[]) => {
//   return files.reduce((acc, file) => {
//     const ext = path.extname(file).toLowerCase();
//     const type = getFileType(ext);
//     if (!acc[type]) acc[type] = [];
//     acc[type].push(file);
//     return acc;
//   }, {} as Record<string, string[]>);
// };

type Blob = {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

export const groupFilesByType = (blobs: Blob[]) => {
  return blobs.reduce((acc, blob) => {
    const ext = path.extname(blob.pathname).toLowerCase();
    const type = getFileType(ext);
    if (!acc[type]) acc[type] = [];
    acc[type].push(blob);
    return acc;
  }, {} as Record<string, Blob[]>);
};
