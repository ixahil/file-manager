import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { deleteFileAction, getFilesAction } from "@/app/actions/file-action";
import { groupFilesByType } from "@/utils/file-utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

const FileList = async () => {
  const { files } = await getFilesAction();

  const groupedFiles = groupFilesByType(files as string[]);

  const filesArray = Object.entries(groupedFiles);
  return (
    <Card>
      <CardHeader>Uploaded Files</CardHeader>
      <CardContent>
        {filesArray.length > 0 ? (
          <div className="p-4">
            <List data={filesArray} />
          </div>
        ) : (
          <p className="flex items-center justify-center text-muted-foreground">
            No Files uploaded yet
          </p>
        )}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

const List = ({ data }: { data: [string, string[]][] }) => {
  const handleDelete = async (fileName: string) => {
    "use server";
    await deleteFileAction(fileName);
  };

  return data.map(([type, typeFiles]) => (
    <div key={type} className="mb-8">
      <h2 className="text-xl font-semibold mb-4 capitalize">{type}s </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {typeFiles.map((file) => (
          <div
            key={file}
            className="bg-[#282a36] p-4 rounded-lg border border-[#44475a]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f8f8f2] truncate">
                  {file.substring(file.indexOf("-") + 1)}
                </p>
                <p className="text-xs text-[#6272a4]">
                  {new Date(parseInt(file.split("-")[0])).toLocaleDateString()}
                </p>
              </div>
              <form action={handleDelete.bind(null, file)}>
                <Button
                  type="submit"
                  className=""
                  variant={"destructive"}
                  size={"icon"}
                >
                  <Trash2 color="black" />
                </Button>
              </form>
            </div>
            {type === "image" && (
              <div className="relative aspect-video bg-[#1e1f29] rounded-md w-full">
                <Image
                  src={`/api/download/${file}`}
                  alt={file}
                  fill
                  className="rounded-md object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            {type === "video" && (
              <video
                className="w-full rounded-md bg-[#1e1f29]"
                controls
                src={`/api/download/${file}`}
              />
            )}
            {type === "audio" && (
              <audio
                className="w-full mt-3"
                controls
                src={`/api/download/${file}`}
                preload="none"
              />
            )}
            {(type === "document" || type === "other") && (
              <div className="mt-2">
                <a
                  href={`/api/download/${file}`}
                  className="text-[#bd93f9] hover:text-[#ff79c6] text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ));
};

export default FileList;
