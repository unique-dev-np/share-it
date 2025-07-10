"use client";

import { UploadDropzone } from "@/lib/uploadthing";

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
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
}
