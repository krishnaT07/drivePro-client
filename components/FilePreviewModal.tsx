"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";

export default function FilePreviewModal({
  file,
  open,
  onOpenChangeAction,   // ✅ renamed
}: {
  file: any;
  open: boolean;
  onOpenChangeAction: (v: boolean) => void;
}) {
  useEffect(() => {
    if (!open) return;
    // Optional: analytics or preload file
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{file?.name}</DialogTitle>
        </DialogHeader>

        <div className="flex h-full w-full items-center justify-center">
          {file?.mimetype?.startsWith("image/") && (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
          {file?.mimetype === "application/pdf" && (
            <iframe src={file.url} className="w-full h-full rounded-lg" />
          )}
          {file?.mimetype?.startsWith("text/") && (
            <iframe src={file.url} className="w-full h-full rounded-lg bg-gray-50" />
          )}
          {!file?.mimetype && (
            <p className="text-gray-500">Preview not available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
