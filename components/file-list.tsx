import { groupFilesByType } from "@/utils/file-utils";
import { del, list } from "@vercel/blob";
import { Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

type BlobGroup = {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
};

const FileList = async () => {
  const response = await list();
  const groupedFiles = groupFilesByType(response.blobs);

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

const List = ({ data }: { data: [string, BlobGroup[]][] }) => {
  const handleDelete = async (fileUrl: string) => {
    "use server";
    await del(fileUrl);
    revalidatePath("/");
  };

  return data.map(([type, typeFiles]) => (
    <div key={type} className="mb-8">
      <h2 className="text-xl font-semibold mb-4 capitalize">{type}s </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {typeFiles.map((file, idx) => (
          <div
            key={file.pathname + idx}
            className="bg-[#282a36] p-4 rounded-lg border border-[#44475a]"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#f8f8f2] truncate">
                  {file.pathname.substring(file.pathname.indexOf("-") + 1)}
                </p>
                <p className="text-xs text-[#6272a4]">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <form action={handleDelete.bind(null, file.url)}>
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
                  src={file.downloadUrl}
                  alt={file.pathname.split("/")[1]}
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
                src={file.downloadUrl}
              />
            )}
            {type === "audio" && (
              <audio
                className="w-full mt-3"
                controls
                src={file.downloadUrl}
                preload="none"
              />
            )}
            {(type === "document" || type === "other") && (
              <div className="mt-2">
                <a
                  href={file.downloadUrl}
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
