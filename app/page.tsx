import FileList from "@/components/file-list";
import FileUploader from "@/components/file-uploader";

export default function Home() {
  return (
    <div className="space-y-8">
      <FileUploader />
      <FileList />
    </div>
  );
}
