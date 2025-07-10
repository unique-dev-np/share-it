import JSZip from "jszip";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const data = JSON.parse(searchParams.get("images") || "");

  console.log(data);

  const { files: images, bucketName } = data;

  console.log(images, bucketName);

  interface ImageDownload {
    name: string;
    url: string;
  }

  const downloads = await Promise.all(
    images.map(async (image: ImageDownload) => {
      const response = await fetch(image.url, { cache: "no-store" });
      const contentType = response.headers.get("Content-Type");

      console.log(contentType);

      const data = await response.arrayBuffer();
      return {
        ...image,
        data,
        type: contentType?.split("/")[1],
      };
    })
  );

  const zip = new JSZip();

  downloads.forEach((download) => {
    zip.file(`${download.name}`, download.data);
  });

  const archive = await zip.generateAsync({ type: "blob" });

  return new Response(archive, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
    },
  });
}
