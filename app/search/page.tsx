"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import FileCard from "@/components/FileCard";
import FolderCard from "@/components/FolderCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import ViewToggle from "@/components/ViewToggle";

async function searchDrive(query: string) {
  const res = await api.get(`/search?q=${query}`);
  return res.data;
}

const LoadingState = ({ query }: { query: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium">
        Searching for "{query}"...
      </p>
    </div>
  </div>
);

const EmptySearchState = ({ query }: { query: string }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
      No results found for "{query}"
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
      We couldn't find any files or folders matching your search. Try using different keywords or check your spelling.
    </p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
        Try Different Keywords
      </button>
      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors duration-200">
        Browse All Files
      </button>
    </div>
  </motion.div>
);

const SearchStats = ({ data, query, filteredData }: { data: any, query: string, filteredData: any }) => {
  const totalResults = (data?.folders?.length || 0) + (data?.files?.length || 0);
  const totalFiles = filteredData?.files?.length || 0;
  const totalFolders = filteredData?.folders?.length || 0;
  const totalSize = filteredData?.files?.reduce((sum: number, file: any) => sum + (file.size || 0), 0) || 0;
  
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Results</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalResults}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Files</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalFiles}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Folders</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{totalFolders}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatSize(totalSize)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const FilterBar = ({ 
  view, 
  setView,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  searchQuery
}: { 
  view: "grid" | "list", 
  setView: (view: "grid" | "list") => void,
  typeFilter: string,
  setTypeFilter: (filter: string) => void,
  sortBy: string,
  setSortBy: (sort: string) => void,
  searchQuery: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6"
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by type:</span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'files', 'folders'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTypeFilter(filter)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  typeFilter === filter
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">Relevance</option>
            <option value="name">Name</option>
            <option value="date">Date Modified</option>
            <option value="size">Size</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Results for: <span className="font-medium text-gray-700 dark:text-gray-300">"{searchQuery}"</span>
        </div>
        <ViewToggle view={view} setViewAction={setView} />
      </div>
    </div>
  </motion.div>
);

const ListViewItem = ({ item, type, searchQuery }: { item: any, type: 'folder' | 'file', searchQuery: string }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => (
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    ));
  };

  return (
    <div className="group p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            type === 'folder' 
              ? 'bg-blue-100 dark:bg-blue-900/30' 
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {type === 'folder' ? (
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {highlightText(item.name, searchQuery)}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {type === 'folder' ? 'Folder' : formatSize(item.size || 0)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.updatedAt ? formatDate(item.updatedAt) : 'Unknown'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
          </div>
          
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all duration-200">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SearchPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchDrive(q),
    enabled: !!q,
  });

  // Filter and sort data
  const filteredData = useMemo(() => {
    if (!data) return { files: [], folders: [] };

    let files = data.files || [];
    let folders = data.folders || [];

    // Apply type filter
    if (typeFilter === 'files') {
      folders = [];
    } else if (typeFilter === 'folders') {
      files = [];
    }

    // Apply sorting
    const sortFunction = (a: any, b: any) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'date': return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
        case 'size': return (b.size || 0) - (a.size || 0);
        case 'type': return (a.name.split('.').pop() || '').localeCompare(b.name.split('.').pop() || '');
        default: return 0; // relevance - keep original order
      }
    };

    return {
      files: files.sort(sortFunction),
      folders: folders.sort(sortFunction)
    };
  }, [data, typeFilter, sortBy]);

  if (isLoading && q) {
    return <LoadingState query={q} />;
  }

  if (!q) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <div className="flex items-center justify-center flex-1">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search Your Drive</h1>
              <p className="text-gray-600 dark:text-gray-400">Enter a search query to find files and folders</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasResults = (filteredData.folders.length > 0 || filteredData.files.length > 0);

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
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {hasResults 
                  ? `Found ${(filteredData.folders.length + filteredData.files.length)} results for "${q}"`
                  : `No results found for "${q}"`
                }
              </p>
            </motion.div>

            {hasResults && <SearchStats data={data} query={q} filteredData={filteredData} />}
            {hasResults && (
              <FilterBar 
                view={view} 
                setView={setView}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                searchQuery={q}
              />
            )}

            {/* Content Section */}
            <AnimatePresence mode="wait">
              {!hasResults ? (
                <EmptySearchState query={q} />
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
                  {filteredData.folders.map((folder: any, i: number) =>
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
                        <ListViewItem item={folder} type="folder" searchQuery={q} />
                      </motion.div>
                    )
                  )}

                  {/* Files */}
                  {filteredData.files.map((file: any, i: number) =>
                    view === "grid" ? (
                      <motion.div
                        key={`file-${file.id}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (filteredData.folders.length + i) * 0.05, duration: 0.3 }}
                      >
                        <FileCard file={file} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={`file-${file.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (filteredData.folders.length + i) * 0.05, duration: 0.3 }}
                      >
                        <ListViewItem item={file} type="file" searchQuery={q} />
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