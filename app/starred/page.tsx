"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import FileCard from "@/components/FileCard";
import FolderCard from "@/components/FolderCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Star, 
  Grid3X3, 
  List, 
  Filter, 
  Search, 
  SortAsc, 
  Calendar,
  FileText,
  Folder,
  Sparkles
} from "lucide-react";

async function fetchStarred() {
  const res = await api.get("/search/starred");
  return res.data.stars;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "date" | "type";
type FilterType = "all" | "files" | "folders";

export default function StarredPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery({ 
    queryKey: ["starred"], 
    queryFn: fetchStarred,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and sort data
  const filteredData = data?.filter((star: any) => {
    const matchesSearch = star.file?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         star.folder?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "files" && star.resourceType === "file") ||
                         (filterType === "folders" && star.resourceType === "folder");
    return matchesSearch && matchesFilter;
  }).sort((a: any, b: any) => {
    if (sortBy === "name") {
      const aName = a.file?.name || a.folder?.name || "";
      const bName = b.file?.name || b.folder?.name || "";
      return aName.localeCompare(bName);
    }
    if (sortBy === "date") {
      const aDate = a.file?.updatedAt || a.folder?.updatedAt || "";
      const bDate = b.file?.updatedAt || b.folder?.updatedAt || "";
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }
    if (sortBy === "type") {
      return a.resourceType.localeCompare(b.resourceType);
    }
    return 0;
  }) || [];

  const fileCount = filteredData.filter((star: any) => star.resourceType === "file").length;
  const folderCount = filteredData.filter((star: any) => star.resourceType === "folder").length;

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Loading your starred items
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Gathering your favorite files and folders...
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <motion.div 
              className="text-center space-y-4 max-w-md mx-auto p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Star className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Unable to load starred items
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  There was an issue fetching your starred content. Please try again.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        
        <motion.div
          className="flex-1 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header Section */}
          <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 z-10">
            <div className="p-6 pb-4">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Starred
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {fileCount} files • {folderCount} folders
                    </p>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Controls Bar */}
              <motion.div
                className="flex items-center justify-between space-x-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search starred items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters and Sort */}
                <div className="flex items-center space-x-2">
                  {/* Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Items</option>
                    <option value="files">Files Only</option>
                    <option value="folders">Folders Only</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="date">Sort by Date</option>
                    <option value="type">Sort by Type</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredData.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-6">
                  <Star className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {searchQuery ? "No matching starred items" : "No starred items yet"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  {searchQuery 
                    ? `No starred items match "${searchQuery}". Try adjusting your search or filters.`
                    : "Start starring your favorite files and folders to see them here."
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                    }}
                    className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                      : "space-y-2"
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {filteredData.map((star: any, i: number) => (
                    <motion.div
                      key={star.resourceId}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(i * 0.05, 1),
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      {star.resourceType === "file" ? (
                        <FileCard file={star.file} />
                      ) : (
                        <FolderCard folder={star.folder} />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}