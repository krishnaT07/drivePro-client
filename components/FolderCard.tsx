"use client";

import { Folder, Trash2, Pencil, Share2, Star } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function FolderCard({ folder }: { folder: any }) {
  const qc = useQueryClient();
  const router = useRouter();

  const moveToTrash = async () => {
    await api.patch(`/folders/${folder.id}`, { isDeleted: true });
    qc.invalidateQueries();
  };

  const renameFolder = async () => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (!newName) return;
    await api.patch(`/folders/${folder.id}`, { name: newName });
    qc.invalidateQueries();
  };

  const shareFolder = async () => {
    alert("🔗 Share link: " + window.location.origin + "/drive/" + folder.id);
  };

  const toggleStar = async () => {
    await api.post("/search/star", { resourceType: "folder", resourceId: folder.id });
    qc.invalidateQueries();
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="hover:shadow-lg transition cursor-pointer"
            onClick={() => router.push(`/drive/${folder.id}`)}
          >
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Folder className="h-4 w-4 text-blue-500" /> {folder.name}
              </CardTitle>
              <Trash2 className="h-4 w-4 text-red-500" />
            </CardHeader>
          </Card>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={renameFolder}>
            <Pencil className="h-4 w-4 mr-2" /> Rename
          </ContextMenuItem>
          <ContextMenuItem onClick={toggleStar}>
            <Star className="h-4 w-4 mr-2" /> {folder.starred ? "Unstar" : "Star"}
          </ContextMenuItem>
          <ContextMenuItem onClick={shareFolder}>
            <Share2 className="h-4 w-4 mr-2" /> Share
          </ContextMenuItem>
          <ContextMenuItem onClick={moveToTrash} className="text-red-600">
            <Trash2 className="h-4 w-4 mr-2" /> Move to Trash
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </motion.div>
  );
}
