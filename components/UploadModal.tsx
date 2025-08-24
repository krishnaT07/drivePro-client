"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function UploadModal({ open, onClose, onUpload }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (file) {
      onUpload(file);
      setFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Upload File</DialogTitle>
        </DialogHeader>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500 border border-gray-200 rounded-lg cursor-pointer focus:outline-none"
        />
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
