import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bucket } from "@prisma/client";
import Link from "next/link";

interface RecentBucketsTableProps {
  buckets: Bucket[];
}

export default function RecentBucketsTable({ buckets }: RecentBucketsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {buckets.map((bucket) => (
          <TableRow key={bucket.id}>
            <TableCell>
              <Link href={`/buckets/${bucket.id}`} className="hover:underline">
                {bucket.name}
              </Link>
            </TableCell>
            <TableCell>
              <Badge variant={bucket.isLocked ? "destructive" : "default"}>
                {bucket.isLocked ? "Locked" : "Active"}
              </Badge>
            </TableCell>
            <TableCell>{new Date(bucket.createdAt).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}