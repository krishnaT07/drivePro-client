"use client";

import { Star, Trash2, File, Share2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import FilePreviewModal from "@/components/FilePreviewModal";

interface FileCardProps {
  file: any;
  listView?: boolean;
}

export default function FileCard({ file, listView }: FileCardProps) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const toggleStar = async () => {
    await api.post("/search/star", {
      resourceType: "file",
      resourceId: file.id,
    });
    qc.invalidateQueries();
  };

  const moveToTrash = async () => {
    await api.patch(`/files/${file.id}`, { isDeleted: true });
    qc.invalidateQueries();
  };

  const renameFile = async () => {
    const newName = prompt("Enter new name:", file.name);
    if (!newName) return;
    await api.patch(`/files/${file.id}`, { name: newName });
    qc.invalidateQueries();
  };

  const shareFile = async () => {
    alert("🔗 Share link: " + window.location.origin + "/files/" + file.id);
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <ContextMenu>
          <ContextMenuTrigger>
            <Card
              className={`hover:shadow-lg transition cursor-pointer ${
                listView ? "flex items-center justify-between p-3" : ""
              }`}
              onClick={() => setOpen(true)} // 👈 opens preview modal
            >
              <CardHeader
                className={`${
                  listView
                    ? "flex flex-row items-center justify-between p-0"
                    : "flex flex-row items-center justify-between space-y-0 pb-2"
                }`}
              >
                <CardTitle
                  className={`flex items-center gap-2 text-sm font-medium ${
                    listView ? "truncate max-w-xs" : ""
                  }`}
                >
                  <File className="h-4 w-4 text-blue-500" /> {file.name}
                </CardTitle>
                <Star
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar();
                  }}
                  className={`h-4 w-4 cursor-pointer ${
                    file.starred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </CardHeader>

              {!listView && (
                <CardContent>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </CardContent>
              )}

              {listView && (
                <div className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </div>
              )}
            </Card>
          </ContextMenuTrigger>

          {/* Right-click menu */}
          <ContextMenuContent className="w-40">
            <ContextMenuItem onClick={renameFile}>
              <Pencil className="h-4 w-4 mr-2" /> Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={toggleStar}>
              <Star className="h-4 w-4 mr-2" />{" "}
              {file.starred ? "Unstar" : "Star"}
            </ContextMenuItem>
            <ContextMenuItem onClick={shareFile}>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </ContextMenuItem>
            <ContextMenuItem onClick={moveToTrash} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" /> Move to Trash
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* ✅ File Preview Modal */}
      <FilePreviewModal file={file} open={open} onOpenChangeAction={setOpen} />
    </>
  );
}
