"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "react-toastify";

export default function FileUploadDropzone({
  bucketID,
  revalidate,
}: {
  bucketID: string;
  revalidate: (id: string) => Promise<void>;
}) {
  return (
    <div className="mt-4">
      <UploadDropzone
        headers={{
          "bucket-id": bucketID,
        }}
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          revalidate(bucketID);
          toast.success(`${res.length} file(s) uploaded successfully`);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`Failed to upload file(s).`)
        }}
      />
    </div>
  );
}
