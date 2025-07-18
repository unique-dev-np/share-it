import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { File } from "@prisma/client";
import Link from "next/link";

interface RecentFilesTableProps {
  files: File[];
}

export default function RecentFilesTable({ files }: RecentFilesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell>
              <Link href={`/buckets/${file.bucketId}`} className="hover:underline text-blue-600">
                {file.name}
              </Link>
            </TableCell>
            <TableCell>{file.type}</TableCell>
            <TableCell>{(file.size / (1024)).toFixed(2)} KB</TableCell>
            <TableCell>{new Date(file.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
