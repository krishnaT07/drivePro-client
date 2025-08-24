"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export default function UploadDropzone({
  open,
  onOpenChangeAction,
}: {
  open: boolean;
  onOpenChangeAction: (v: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const qc = useQueryClient();

  const handleUpload = async () => {
    if (!file) return;
    const res = await api.post("/files/upload-url", { fileName: file.name, fileSize: file.size });
    const { uploadUrl, fileId } = res.data;

    await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    await api.post("/files/confirm", { fileId });
    qc.invalidateQueries({ queryKey: ["drive"] });
    onOpenChangeAction(false); // 👈 updated
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />
        <Button onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
}

