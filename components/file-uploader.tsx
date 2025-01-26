"use client";
import { fileUploadAction } from "@/app/actions/file-action";
import { formatFileSize, getFileType, getFileUrl } from "@/utils/file-utils";
import { X } from "lucide-react";
import Image from "next/image";
import path from "path";
import { ChangeEvent, useState } from "react";
import SubmitButton from "./submit-button";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const FileUploader = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    const result = await fileUploadAction(file);

    if (!result.success) {
      setErrorMessage(result.message);
    } else {
      setErrorMessage(null);
      setFile(null);
    }
  };

  const handleFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <Card>
      <CardHeader>File Upload</CardHeader>
      <CardContent>
        <form
          className="h-full flex flex-col items-center justify-center space-y-8"
          action={handleUpload}
        >
          {!file ? (
            <label
              className="space-y-4 w-full border-2 border-dashed border-[#44475a] rounded-lg p-6 bg-[#1e1f29]"
              htmlFor="file"
            >
              <input
                onChange={handleFilesChange}
                required
                id="file"
                type="file"
                name="file"
                className="cursor-pointer file:cursor-pointer text-muted-foreground file:p-2 file:rounded-lg file:border-0 file:text-xs file:text-muted file:bg-primary"
              />
              <p className="mt-2 text-muted-foreground">
                Max file size: {"100 MB"}
              </p>
            </label>
          ) : (
            <Card className="max-w-[250]">
              <CardHeader>
                <div className="flex justify-between gap-6">
                  <p className="truncate">{file.name}</p>
                  <Button
                    type="button"
                    className="w-6 h-6"
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => setFile(null)}
                  >
                    <X className="" color="red" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Image
                  src={getFileUrl(file)}
                  alt="uploaded-file"
                  width={250}
                  height={250}
                />
              </CardContent>
              <CardFooter>
                <div className="">
                  <p>{getFileType(path.extname(file.type))}</p>
                  <p>{formatFileSize(file.size)}</p>
                </div>
              </CardFooter>
            </Card>
          )}

          {errorMessage && <p className="text-[#ff5555]">{errorMessage}</p>}
          <SubmitButton className="w-full" label="File Upload" />
        </form>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
