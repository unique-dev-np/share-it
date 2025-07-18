"use client";

import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import { CloudDownload, Eye, Files } from "lucide-react";
import Link from "next/link";
import DataTable from "react-data-table-component";
import FileSaver from "file-saver";
import { useEffect, useState } from "react";
import { bytesToMB } from "@/lib/utils";

export default function FilesTable({
  files,
  bucketName,
}: {
  files: File[];
  bucketName: string;
}) {
  const [loading, setLoading] = useState(false);
  const [isClient, setClient] = useState(false);
  const [selectedRows, setSelectedRows] = useState<File[]>([]);

  useEffect(() => {
    setClient(true);
  }, []);

  function onSelectedRowsChange({ selectedRows }: { selectedRows: File[] }) {
    setSelectedRows(selectedRows);
  }

  function saveFile(url: string, name: string) {
    setLoading(true);
    const promise = new Promise((resolve, reject) => {
      FileSaver.saveAs(url, name);
      setTimeout(() => {
        resolve("");
      }, 2000);
    });

    promise.then(() => {
      setLoading(false);
    });
  }

  const columns = [
    {
      name: "Name",
      selector: (row: File) => row.name,
      sortable: true,
    },
    {
      name: "Size (MB)",
      selector: (row: File) => bytesToMB(row.size).toFixed(2),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: File) => row.type,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: File, index: number) => (
        <div className="flex gap-4 items-center ">
          <Button asChild size="icon" variant="link" className="my-2">
            <Link href={`${row.url}`} target="_blank">
              <Eye className="h-[20px]" />
            </Link>
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              saveFile(row.url, row.name);
            }}
            variant="secondary"
            size="icon"
            className="my-2"
          >
            <CloudDownload className="h-[20px]" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="pb-10">
      <div className="files-top flex justify-between  items-center mt-16">
        <h1 className="font-bold text-2xl my-8 flex  items-center">
          <Files className="mr-2" /> Files{" "}
        </h1>
        <div className="actions flex gap-2 items-center">
          <Button asChild disabled={selectedRows.length < 1}>
            <Link
              href={
                selectedRows.length > 0
                  ? `/api/archive?images=${encodeURIComponent(
                    JSON.stringify({ selectedRows, bucketName })
                  )}`
                  : `/api/archive?images=${encodeURIComponent(
                    JSON.stringify({ files, bucketName })
                  )}`
              }
              className="flex items-center"
              target="_blank"
            >
              <CloudDownload className="mr-2" /> Download{" "}
              {selectedRows.length > 0 ? selectedRows.length : "All"}
            </Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={files}
        selectableRows
        onSelectedRowsChange={onSelectedRowsChange}
        pagination={isClient}

      />
    </div>
  );
}
