"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import FileCard from "@/components/FileCard";
import FolderCard from "@/components/FolderCard";
import { motion, AnimatePresence } from "framer-motion";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { useState } from "react";
import ViewToggle from "@/components/ViewToggle";

type View = "grid" | "list";

interface File {
  id: string;
  name: string;
  size?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Folder {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

async function fetchFolder(id: string) {
  const [folderRes, pathRes] = await Promise.all([
    api.get(`/folders/${id}`),
    api.get(`/folders/${id}/path`),
  ]);
  return { ...folderRes.data, path: pathRes.data.path };
}

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        Loading folder contents...
      </p>
    </div>
  </div>
);

const EmptyFolderState = ({ folderName }: { folderName: string }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
      <svg
        className="w-12 h-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      "{folderName}" is empty
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
      This folder doesn't contain any files or subfolders yet. Add some content
      to get started.
    </p>
    <div className="flex gap-3">
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
        Upload Files
      </button>
      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200">
        Create Subfolder
      </button>
    </div>
  </motion.div>
);

const ActionBar = ({
  view,
  setView,
  folderName,
}: {
  view: View;
  setView: (view: View) => void;
  folderName: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload to {folderName}
        </button>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-200 hover:scale-105">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Subfolder
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Sort by:
          </span>
          <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="name">Name</option>
            <option value="date">Date</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
        </div>

        <ViewToggle view={view} setViewAction={setView} />
      </div>
    </div>
  </motion.div>
);

export default function FolderPage({ params }: { params: { id: string } }) {
  const [view, setView] = useState<View>("grid");

  const { data, isLoading } = useQuery<{
    folder: Folder;
    folders: Folder[];
    files: File[];
    path: any[];
  }>({
    queryKey: ["folder", params.id],
    queryFn: () => fetchFolder(params.id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const hasContent = data?.folders?.length || data?.files?.length;
  const folderName = data?.folder?.name || "Unknown Folder";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <motion.div
          className="flex-1 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {folderName}
                    </h1>
                  </div>
                  <BreadcrumbNav path={data?.path || []} />
                </div>
              </div>
            </motion.div>

            {hasContent && (
              <ActionBar view={view} setView={setView} folderName={folderName} />
            )}

            {/* Content Section */}
            <AnimatePresence mode="wait">
              {!hasContent ? (
                <EmptyFolderState folderName={folderName} />
              ) : (
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-3"
                  }
                >
                  {/* Folders */}
                  {data?.folders?.map((folder, i) =>
                    view === "grid" ? (
                      <motion.div
                        key={`folder-${folder.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        <FolderCard folder={folder} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`folder-${folder.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3 }}
                      >
                        {/* You can reuse your ListViewItem here if needed */}
                      </motion.div>
                    )
                  )}

                  {/* Files */}
                  {data?.files?.map((file, i) =>
                    view === "grid" ? (
                      <motion.div
                        key={`file-${file.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: (data.folders?.length + i) * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <FileCard file={file} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`file-${file.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: (data.folders?.length + i) * 0.05,
                          duration: 0.3,
                        }}
                      >
                        {/* You can reuse your ListViewItem here if needed */}
                      </motion.div>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
