"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  RotateCcw, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  FileText, 
  Folder, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Archive,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";

async function fetchTrash() {
  const res = await api.get("/search/trash");
  return res.data;
}

type FilterType = "all" | "files" | "folders";
type SortBy = "name" | "date" | "type";

export default function TrashPage() {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<{[key: string]: boolean}>({});
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { data, isLoading, error } = useQuery({ 
    queryKey: ["trash"], 
    queryFn: fetchTrash,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
  
  const qc = useQueryClient();

  // Combine and filter data
  const allItems = data ? [
    ...data.files.map((file: any) => ({ ...file, type: "file" })),
    ...data.folders.map((folder: any) => ({ ...folder, type: "folder" }))
  ] : [];

  const filteredItems = allItems.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "files" && item.type === "file") ||
                         (filterType === "folders" && item.type === "folder");
    return matchesSearch && matchesFilter;
  }).sort((a: any, b: any) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "date") {
      return new Date(b.deletedAt || b.updatedAt).getTime() - new Date(a.deletedAt || a.updatedAt).getTime();
    }
    if (sortBy === "type") {
      return a.type.localeCompare(b.type);
    }
    return 0;
  });

  const fileCount = filteredItems.filter(item => item.type === "file").length;
  const folderCount = filteredItems.filter(item => item.type === "folder").length;

  const restore = async (type: "file" | "folder", id: string) => {
    const key = `${type}-${id}`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      await api.post(`/search/trash/restore/${type}/${id}`);
      qc.invalidateQueries({ queryKey: ["trash"] });
      
      // Show success animation
      setTimeout(() => {
        setActionLoading(prev => ({ ...prev, [key]: false }));
      }, 500);
    } catch (error) {
      setActionLoading(prev => ({ ...prev, [key]: false }));
      console.error("Restore failed:", error);
    }
  };

  const purge = async (type: "file" | "folder", id: string) => {
    const key = `${type}-${id}-purge`;
    setActionLoading(prev => ({ ...prev, [key]: true }));
    
    try {
      await api.delete(`/search/trash/${type}/${id}`);
      qc.invalidateQueries({ queryKey: ["trash"] });
      
      setTimeout(() => {
        setActionLoading(prev => ({ ...prev, [key]: false }));
      }, 500);
    } catch (error) {
      setActionLoading(prev => ({ ...prev, [key]: false }));
      console.error("Purge failed:", error);
    }
  };

  const bulkRestore = async () => {
    // Implementation for bulk restore
    console.log("Bulk restore:", selectedItems);
  };

  const bulkPurge = async () => {
    // Implementation for bulk purge
    console.log("Bulk purge:", selectedItems);
  };

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
                className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Archive className="w-8 h-8 text-white" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Loading trash contents
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Gathering deleted items...
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
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Unable to load trash
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  There was an issue accessing the trash. Please try again.
                </p>
              </div>
              <button 
                onClick={() => qc.invalidateQueries({ queryKey: ["trash"] })}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
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
                  <div className="p-2 rounded-xl bg-gradient-to-r from-red-400 to-pink-500">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Trash
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {fileCount} files • {folderCount} folders
                    </p>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedItems.length} selected
                    </span>
                    <button
                      onClick={bulkRestore}
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={bulkPurge}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </motion.div>
                )}
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
                    placeholder="Search trash..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters and Sort */}
                <div className="flex items-center space-x-2">
                  {/* Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Items</option>
                    <option value="files">Files Only</option>
                    <option value="folders">Folders Only</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="date">Sort by Date Deleted</option>
                    <option value="name">Sort by Name</option>
                    <option value="type">Sort by Type</option>
                  </select>

                  {/* Refresh */}
                  <button
                    onClick={() => qc.invalidateQueries({ queryKey: ["trash"] })}
                    className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Warning Banner */}
              {filteredItems.length > 0 && (
                <motion.div
                  className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center space-x-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Items in trash will be automatically deleted after 30 days
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mb-6">
                  <Trash2 className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {searchQuery ? "No matching items in trash" : "Trash is empty"}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  {searchQuery 
                    ? `No deleted items match "${searchQuery}". Try adjusting your search or filters.`
                    : "When you delete files or folders, they'll appear here where you can restore or permanently delete them."
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilterType("all");
                    }}
                    className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredItems.map((item: any, i: number) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      transition={{
                        duration: 0.3,
                        delay: Math.min(i * 0.05, 1),
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-center justify-between p-4">
                          {/* Item Info */}
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(prev => [...prev, item.id]);
                                } else {
                                  setSelectedItems(prev => prev.filter(id => id !== item.id));
                                }
                              }}
                              className="rounded border-slate-300 dark:border-slate-600 text-red-500 focus:ring-red-500"
                            />

                            {/* Icon */}
                            <div className="flex-shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                              {item.type === "file" ? (
                                <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              ) : (
                                <Folder className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {item.name}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  Deleted {formatDistanceToNow(new Date(item.deletedAt || item.updatedAt), { addSuffix: true })}
                                </span>
                              </div>
                              {item.size && (
                                <p className="text-xs text-slate-400 mt-1">
                                  {(item.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => restore(item.type, item.id)}
                              disabled={actionLoading[`${item.type}-${item.id}`]}
                              className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200 disabled:opacity-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {actionLoading[`${item.type}-${item.id}`] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                            </motion.button>

                            <motion.button
                              onClick={() => purge(item.type, item.id)}
                              disabled={actionLoading[`${item.type}-${item.id}-purge`]}
                              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 disabled:opacity-50"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {actionLoading[`${item.type}-${item.id}-purge`] ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}