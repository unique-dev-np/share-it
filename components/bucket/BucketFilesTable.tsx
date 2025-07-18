"use client";

import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import { CloudDownload, CloudUpload, Eye, Files, Trash } from "lucide-react";
import Link from "next/link";
import DataTable from "react-data-table-component";
import FileSaver from "file-saver";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { bytesToMB } from "@/lib/utils";
import GlobalAlertDialog from "@/components/common/GlobalAlertDialog";

export default function FilesTable({
  files,
  revalidate,
  bucketName,
}: {
  files: File[];
  revalidate: (id: string) => Promise<void>;
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

  async function deleteFile(fileKey: string) {
    setLoading(true);
    console.log(fileKey);

    const res = await fetch("/api/bucket/file", {
      method: "DELETE",
      body: JSON.stringify({
        files: files.filter((a) => {
          return a.key == fileKey;
        }),
      }),
    });
    const { success, message } = await res.json();

    if (success) {
      await revalidate(files[0].bucketId);
      setSelectedRows([]);
      toast.success(message);
    } else {
      toast.error(message);
    }
    setLoading(false);
  }

  async function deleteMultipleFiles(selectedRows: File[]) {
    setLoading(true);
    if (selectedRows.length < 1) {
      const res = await fetch("/api/bucket/file", {
        method: "DELETE",
        body: JSON.stringify({ files }),
      });
      const { success, message } = await res.json();

      if (success) {
        await revalidate(files[0].bucketId);
        setSelectedRows([]);
        toast.success(message);
      } else {
        toast.error(message);
      }

      setLoading(false);
      return;
    }

    const res = await fetch("/api/bucket/file", {
      method: "DELETE",
      body: JSON.stringify({ files: selectedRows }),
    });
    const { success, message } = await res.json();

    if (success) {
      await revalidate(selectedRows[0].bucketId);
      setSelectedRows([]);
      toast.success(message);
    } else {
      toast.error(message);
    }
    setLoading(false);
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
          <GlobalAlertDialog
            action={() => deleteFile(row.key)}
            title={`Do you want to delete "${row.name}" ?`}
            description="This action is irreversible. This will delete the selected file from our servers."
            loading={loading}
            innerButtonElement={
              <Button variant="destructive">
                <Trash className="h-[20px] mr-2" /> Delete
              </Button>
            }
          >
            <Button size="icon" variant="destructive" className="my-2">
              <Trash className="h-[20px]" />
            </Button>
          </GlobalAlertDialog>
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
          <GlobalAlertDialog
            title={`Do you want to download ${selectedRows.length > 0 ? selectedRows.length : "all"
              } files`}
            description=""
            action={() => { }}
            innerButtonElement={
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
            }
          >
            <Button>
              <CloudDownload className="mr-2" /> Download{" "}
              {selectedRows.length > 0 ? selectedRows.length : "All"}
            </Button>
          </GlobalAlertDialog>

          <GlobalAlertDialog
            action={() => deleteMultipleFiles(selectedRows)}
            title={`Do you want to delete selected ${selectedRows.length} files?`}
            description="This action is irreversible. This will delete the selected files from our servers."
            loading={loading}
          >
            <Button disabled={selectedRows.length < 1} variant="destructive">
              <Trash className="mr-2" /> Delete
            </Button>
          </GlobalAlertDialog>
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
