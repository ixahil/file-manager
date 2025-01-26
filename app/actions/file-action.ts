"use server";

import path from "path";
import { UPLOAD_DIR } from "../../constants/files";
import fs from "fs/promises";
import { revalidatePath } from "next/cache";

type UploadResult = {
  success: boolean;
  message: string;
  fileName?: string;
};

type GetFileResult = {
  success: boolean;
  message: string;
  files?: string[];
};
type DeleteResult = {
  success: boolean;
  message: string;
};

export const fileUploadAction = async (
  file: File | null
): Promise<UploadResult> => {
  try {
    if (!file) {
      return {
        success: false,
        message: "No files uploaded",
      };
    }

    if (!file.size) {
      return {
        success: false,
        message: "No files uploaded",
      };
    }

    // TODO: CHECK FILE TYPES

    // TODO: CHECK FILE SIZE EXCEED

    const timeStamp = Date.now();
    const safeFileName = `${timeStamp}-${file.name}`;

    const filePath = path.join(UPLOAD_DIR, safeFileName);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.writeFile(filePath, buffer);

    const stats = await fs.stat(filePath);

    if (stats.size !== file.size) {
      await fs.unlink(filePath);
      return { success: false, message: "File Upload verification failed" };
    }

    revalidatePath("/");

    return {
      success: true,
      message: "File uploaded successfully",
      fileName: safeFileName,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

export const getFilesAction = async (): Promise<GetFileResult> => {
  try {
    const files = await fs.readdir(UPLOAD_DIR);
    return {
      success: true,
      message: "success",
      files,
    };
  } catch (error) {
    console.error(error);
    await fs.mkdir("uploads", { recursive: true });
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};

export const deleteFileAction = async (
  fileName: string
): Promise<DeleteResult> => {
  try {
    await fs.unlink(path.join(UPLOAD_DIR, fileName));
    revalidatePath("/");
    return {
      success: true,
      message: "success",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown Error",
    };
  }
};
