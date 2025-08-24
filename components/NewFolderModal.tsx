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
import { Input } from "@/components/ui/input";

interface NewFolderModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function NewFolderModal({ open, onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      setFolderName("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create New Folder</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!folderName.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
