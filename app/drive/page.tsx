'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Grid3X3,
  List,
  Folder,
  FileText,
  Trash2,
  Share2,
  Edit2,
  Menu,
  X,
  Upload,
  FolderPlus,
  Search,
  Download,
  MoreVertical,
  Cloud,
  HardDrive,
  Users,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Zap,
  Shield,
  Image,
  Video,
  Music,
  Archive,
  Code,
  File,
  Plus,
  Eye,
  User,
  Filter
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file';
  size: number;
  mimeType: string;
  starred: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  owner: string;
  permissions: string;
  parentId?: string | null;
}

interface FolderItem {
  id: string;
  name: string;
  type: 'folder';
  starred: boolean;
  shared: boolean;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  color: string;
  owner: string;
  permissions: string;
  parentId?: string | null;
}

type DriveItem = FileItem | FolderItem;

const DriveSystem: React.FC = () => {
  // Core state
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Project Proposal.pdf',
      type: 'file',
      size: 2048576,
      mimeType: 'application/pdf',
      starred: true,
      shared: false,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      owner: 'current-user',
      permissions: 'owner',
      parentId: null
    },
    {
      id: '2',
      name: 'vacation-photo.jpg',
      type: 'file',
      size: 5242880,
      mimeType: 'image/jpeg',
      starred: false,
      shared: true,
      createdAt: '2024-01-14T15:45:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      owner: 'current-user',
      permissions: 'owner',
      parentId: null
    },
    {
      id: '3',
      name: 'presentation.pptx',
      type: 'file',
      size: 15728640,
      mimeType: 'application/vnd.ms-powerpoint',
      starred: true,
      shared: true,
      createdAt: '2024-01-13T09:20:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      owner: 'current-user',
      permissions: 'owner',
      parentId: null
    }
  ]);

  const [folders, setFolders] = useState<FolderItem[]>([
    {
      id: 'folder-1',
      name: 'Work Documents',
      type: 'folder',
      starred: true,
      shared: false,
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      itemCount: 12,
      color: 'blue',
      owner: 'current-user',
      permissions: 'owner',
      parentId: null
    },
    {
      id: 'folder-2',
      name: 'Personal Photos',
      type: 'folder',
      starred: false,
      shared: true,
      createdAt: '2024-01-05T16:20:00Z',
      updatedAt: '2024-01-14T11:15:00Z',
      itemCount: 45,
      color: 'green',
      owner: 'current-user',
      permissions: 'owner',
      parentId: null
    }
  ]);

  // Mock user data
  const user = {
    id: 'user-1',
    email: 'user@example.com',
    name: 'John Doe',
    plan: 'Pro'
  };

  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: 'My Drive' }
  ]);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [selectedItem, setSelectedItem] = useState<DriveItem | null>(null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [shareEmail, setShareEmail] = useState('');
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info' | 'warning', message: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const billingInfo = {
    storage: { used: 5368709120, total: 15000000000 },
    bandwidth: { used: 1073741824, total: 100000000 }
  };

  // Utility functions
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getFileIcon = (mimeType: string, size = 'w-5 h-5') => {
    const iconClasses = `${size}`;
    
    if (mimeType.startsWith('image/')) return <Image className={`${iconClasses} text-green-500`} />;
    if (mimeType.startsWith('video/')) return <Video className={`${iconClasses} text-red-500`} />;
    if (mimeType.startsWith('audio/')) return <Music className={`${iconClasses} text-purple-500`} />;
    if (mimeType === 'application/pdf') return <FileText className={`${iconClasses} text-red-600`} />;
    if (mimeType.includes('presentation')) return <FileText className={`${iconClasses} text-orange-500`} />;
    if (mimeType.includes('spreadsheet')) return <FileText className={`${iconClasses} text-green-600`} />;
    if (mimeType.includes('zip') || mimeType.includes('rar')) return <Archive className={`${iconClasses} text-yellow-600`} />;
    if (mimeType.startsWith('text/')) return <Code className={`${iconClasses} text-blue-600`} />;
    
    return <File className={`${iconClasses} text-gray-500`} />;
  };

  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Navigation
  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    const newHistory = [...folderHistory];
    const existingIndex = newHistory.findIndex(item => item.id === folderId);
    
    if (existingIndex > -1) {
      setFolderHistory(newHistory.slice(0, existingIndex + 1));
    } else {
      setFolderHistory([...newHistory, { id: folderId, name: folderName }]);
    }
  };

  const navigateBack = () => {
    if (folderHistory.length > 1) {
      const newHistory = folderHistory.slice(0, -1);
      setFolderHistory(newHistory);
      const lastItem = newHistory[newHistory.length - 1];
      setCurrentFolder(lastItem.id);
    }
  };

  // CRUD Operations
  const handleCreateFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    setIsLoading(true);
    try {
      const uploads = Array.from(fileList);
      
      for (const file of uploads) {
        const newFile: FileItem = {
          id: `file-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          starred: false,
          shared: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          owner: 'current-user',
          permissions: 'owner',
          parentId: currentFolder
        };
        
        setFiles(prev => [...prev, newFile]);
      }
      
      showNotification('success', `${uploads.length} file(s) uploaded successfully`);
    } catch (error) {
      showNotification('error', 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setIsLoading(true);
      
      const newFolder: FolderItem = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        type: 'folder',
        starred: false,
        shared: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        itemCount: 0,
        color: 'blue',
        owner: 'current-user',
        permissions: 'owner',
        parentId: currentFolder
      };
      
      setFolders(prev => [...prev, newFolder]);
      showNotification('success', 'Folder created successfully');
      setNewFolderName('');
      setShowCreateFolderModal(false);
    } catch (error) {
      showNotification('error', 'Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'file' | 'folder') => {
    try {
      setIsLoading(true);
      
      if (type === 'file') {
        setFiles(prev => prev.filter(file => file.id !== id));
      } else {
        setFolders(prev => prev.filter(folder => folder.id !== id));
      }
      
      showNotification('success', 'Item deleted successfully');
      setShowDeleteConfirm(false);
      setShowMobileActions(false);
    } catch (error) {
      showNotification('error', 'Failed to delete item');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStarred = async (id: string, type: 'file' | 'folder') => {
    try {
      if (type === 'file') {
        setFiles(prev => prev.map(file => 
          file.id === id ? { ...file, starred: !file.starred } : file
        ));
      } else {
        setFolders(prev => prev.map(folder => 
          folder.id === id ? { ...folder, starred: !folder.starred } : folder
        ));
      }
      
      showNotification('success', 'Item updated');
    } catch (error) {
      showNotification('error', 'Failed to update item');
    }
  };

  // Filter logic
  const getFilteredItems = () => {
    let filteredFolders = folders.filter(folder => {
      if (currentPage === 'starred' && !folder.starred) return false;
      if (currentPage === 'shared' && !folder.shared) return false;
      if (searchQuery && !folder.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return folder.parentId === currentFolder;
    });

    let filteredFiles = files.filter(file => {
      if (currentPage === 'starred' && !file.starred) return false;
      if (currentPage === 'shared' && !file.shared) return false;
      if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return file.parentId === currentFolder;
    });

    return { folders: filteredFolders, files: filteredFiles };
  };

  const { folders: displayFolders, files: displayFiles } = getFilteredItems();

  // Components
  const Notification = () => {
    if (!notification) return null;

    const icons = {
      success: <CheckCircle className="w-5 h-5" />,
      error: <XCircle className="w-5 h-5" />,
      info: <AlertCircle className="w-5 h-5" />,
      warning: <AlertCircle className="w-5 h-5" />
    };

    const colors = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
        <div className={`flex items-center gap-3 p-4 border rounded-xl shadow-lg backdrop-blur-sm ${colors[notification.type]}`}>
          {icons[notification.type]}
          <span className="flex-1 font-medium">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const Sidebar = () => (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 shadow-2xl border-r border-gray-200/50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Drive Pro
              </h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.name || user.email}</p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {[
              { id: 'drive', icon: HardDrive, label: 'My Drive', count: displayFolders.length + displayFiles.length },
              { id: 'starred', icon: Star, label: 'Starred', count: [...displayFolders, ...displayFiles].filter(item => item.starred).length },
              { id: 'shared', icon: Share2, label: 'Shared with me', count: [...displayFolders, ...displayFiles].filter(item => item.shared).length },
              { id: 'trash', icon: Trash2, label: 'Trash', count: 0 },
              { id: 'billing', icon: CreditCard, label: 'Storage & Billing' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border border-blue-100 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    currentPage === item.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.count}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 ${currentPage === item.id ? 'text-blue-600' : 'text-gray-400'}`} />
              </button>
            ))}
          </nav>

          {/* Storage indicator */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">Storage Usage</span>
                <Crown className="w-4 h-4 text-purple-600" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(billingInfo.storage.used / billingInfo.storage.total) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{formatSize(billingInfo.storage.used)} used</span>
                <span>{formatSize(billingInfo.storage.total)} total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const Header = () => (
    <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {!isSearchActive ? (
              <div className="flex items-center gap-2">
                {folderHistory.length > 1 && (
                  <button
                    onClick={navigateBack}
                    className="p-2 hover:bg-gray-100 rounded-xl text-blue-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                    {folderHistory[folderHistory.length - 1]?.name || 'My Drive'}
                  </h1>
                  <div className={`flex items-center gap-1 text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isSearchActive ? (
              <button
                onClick={() => setIsSearchActive(true)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsSearchActive(false);
                  setSearchQuery('');
                }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {currentPage === 'drive' && !isSearchActive && (
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
            <button
              onClick={() => setShowCreateFolderModal(true)}
              className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              <FolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const CreateFolderModal = () => {
    if (!showCreateFolderModal) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Create New Folder</h3>
            <button
              onClick={() => setShowCreateFolderModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              autoFocus
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MobileActionsSheet = () => {
    if (!showMobileActions || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-end justify-center z-50">
        <div className="bg-white rounded-t-3xl p-6 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              {selectedItem.type === 'folder' ? (
                <Folder className="w-6 h-6" />
              ) : (
                getFileIcon(selectedItem.mimeType, 'w-6 h-6')
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{selectedItem.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedItem.type === 'folder' 
                  ? `${selectedItem.itemCount} items`
                  : formatSize(selectedItem.size)
                }
              </p>
            </div>
            <button
              onClick={() => setShowMobileActions(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                toggleStarred(selectedItem.id, selectedItem.type);
                setShowMobileActions(false);
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <Star className={`w-5 h-5 ${selectedItem.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
              <span className="font-medium text-gray-900">
                {selectedItem.starred ? 'Remove from Starred' : 'Add to Starred'}
              </span>
            </button>

            <button
              onClick={() => {
                setShowShareModal(true);
                setShowMobileActions(false);
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <Share2 className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900">Share</span>
            </button>

            <button
              onClick={() => {
                showNotification('success', 'Rename feature coming soon');
                setShowMobileActions(false);
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
            >
              <Edit2 className="w-5 h-5 text-green-500" />
              <span className="font-medium text-gray-900">Rename</span>
            </button>

            {selectedItem.type === 'file' && (
              <button
                onClick={() => {
                  showNotification('success', 'Download started');
                  setShowMobileActions(false);
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <Download className="w-5 h-5 text-purple-500" />
                <span className="font-medium text-gray-900">Download</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowDeleteConfirm(true);
                setShowMobileActions(false);
              }}
              className="w-full flex items-center gap-3 p-4 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
              <span className="font-medium text-red-600">Delete</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = () => {
    if (!showDeleteConfirm || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Item</h3>
            <p className="text-gray-600">
              Are you sure you want to delete "{selectedItem.name}"? This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedItem.id, selectedItem.type)}
              disabled={isLoading}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ShareModal = () => {
    if (!showShareModal || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Share Item</h3>
            <button
              onClick={() => setShowShareModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-3 px-4 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  showNotification('success', 'Item shared successfully!');
                  setShareEmail('');
                  setShowShareModal(false);
                }}
                disabled={!shareEmail.trim() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState = ({ page }: { page: string }) => {
    const states = {
      drive: {
        icon: HardDrive,
        title: 'Your drive is empty',
        description: 'Upload files or create folders to get started',
        action: 'Upload Files'
      },
      starred: {
        icon: Star,
        title: 'No starred items',
        description: 'Star files and folders to find them quickly',
        action: null
      },
      shared: {
        icon: Share2,
        title: 'No shared items',
        description: 'Files shared with you will appear here',
        action: null
      },
      trash: {
        icon: Trash2,
        title: 'Trash is empty',
        description: 'Deleted items will appear here',
        action: null
      }
    };

    const state = states[page as keyof typeof states] || states.drive;
    const Icon = state.icon;

    return (
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{state.title}</h3>
        <p className="text-gray-500 mb-6 max-w-sm">{state.description}</p>
        {state.action && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {state.action}
          </button>
        )}
      </div>
    );
  };

  const FileGrid = () => {
    const hasItems = displayFolders.length > 0 || displayFiles.length > 0;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your files...</p>
          </div>
        </div>
      );
    }

    if (!hasItems && !searchQuery) {
      return <EmptyState page={currentPage} />;
    }

    if (!hasItems && searchQuery) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Try adjusting your search terms or browse your files
          </p>
        </div>
      );
    }

    return (
      <div className="p-4 lg:p-6 pb-20">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {/* Folders */}
            {displayFolders.map((folder) => (
              <div 
                key={folder.id} 
                className="group cursor-pointer p-4 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
                onClick={() => navigateToFolder(folder.id, folder.name)}
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-br ${
                    folder.color === 'blue' ? 'from-blue-100 to-blue-200' :
                    folder.color === 'green' ? 'from-green-100 to-green-200' :
                    folder.color === 'purple' ? 'from-purple-100 to-purple-200' :
                    folder.color === 'orange' ? 'from-orange-100 to-orange-200' :
                    'from-gray-100 to-gray-200'
                  }`}>
                    <Folder className={`w-8 h-8 ${
                      folder.color === 'blue' ? 'text-blue-600' :
                      folder.color === 'green' ? 'text-green-600' :
                      folder.color === 'purple' ? 'text-purple-600' :
                      folder.color === 'orange' ? 'text-orange-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <p className="font-semibold text-gray-900 truncate mb-1">{folder.name}</p>
                  <p className="text-xs text-gray-500">{folder.itemCount} items</p>
                </div>
                
                <div className="flex justify-between items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {folder.shared && <Share2 className="w-3 h-3 text-blue-500" />}
                    {folder.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(folder);
                      setShowMobileActions(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}

            {/* Files */}
            {displayFiles.map((file) => (
              <div 
                key={file.id} 
                className="group cursor-pointer p-4 border border-gray-200 rounded-2xl hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
                onClick={() => {
                  showNotification('info', 'File preview not implemented');
                }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    {getFileIcon(file.mimeType, 'w-8 h-8')}
                  </div>
                  <p className="font-semibold text-gray-900 truncate mb-1">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                </div>
                
                <div className="flex justify-between items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {file.shared && <Share2 className="w-3 h-3 text-blue-500" />}
                    {file.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(file);
                      setShowMobileActions(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-2">
            {/* Folders */}
            {displayFolders.map((folder) => (
              <div 
                key={folder.id} 
                className="group cursor-pointer flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200"
                onClick={() => navigateToFolder(folder.id, folder.name)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                  folder.color === 'blue' ? 'from-blue-100 to-blue-200' :
                  folder.color === 'green' ? 'from-green-100 to-green-200' :
                  folder.color === 'purple' ? 'from-purple-100 to-purple-200' :
                  folder.color === 'orange' ? 'from-orange-100 to-orange-200' :
                  'from-gray-100 to-gray-200'
                }`}>
                  <Folder className={`w-6 h-6 ${
                    folder.color === 'blue' ? 'text-blue-600' :
                    folder.color === 'green' ? 'text-green-600' :
                    folder.color === 'purple' ? 'text-purple-600' :
                    folder.color === 'orange' ? 'text-orange-600' :
                    'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{folder.name}</p>
                    <div className="flex gap-1">
                      {folder.shared && <Share2 className="w-3 h-3 text-blue-500" />}
                      {folder.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {folder.itemCount} items • {formatDate(folder.updatedAt)}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(folder);
                    setShowMobileActions(true);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}

            {/* Files */}
            {displayFiles.map((file) => (
              <div 
                key={file.id} 
                className="group cursor-pointer flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200"
                onClick={() => {
                  showNotification('info', 'File preview not implemented');
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                  {getFileIcon(file.mimeType, 'w-6 h-6')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                    <div className="flex gap-1">
                      {file.shared && <Share2 className="w-3 h-3 text-blue-500" />}
                      {file.starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatSize(file.size)} • {formatDate(file.updatedAt)}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(file);
                    setShowMobileActions(true);
                  }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main render
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'billing':
        return (
          <div className="p-4 lg:p-6 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Storage & Billing</h2>
                <p className="text-gray-600">Manage your storage plan and view usage</p>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Usage</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Storage Used</span>
                      <span className="text-sm text-gray-500">
                        {formatSize(billingInfo.storage.used)} / {formatSize(billingInfo.storage.total)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${(billingInfo.storage.used / billingInfo.storage.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 lg:p-6 pb-20">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                <p className="text-gray-600">Manage your account and preferences</p>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Profile</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                      {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{user.name || user.email}</h4>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <FileGrid />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCreateFile}
        multiple
        className="hidden"
      />

      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-0' : ''}`}>
        <Header />
        
        <main className="relative">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Modals */}
      <Notification />
      <CreateFolderModal />
      <MobileActionsSheet />
      <DeleteConfirmModal />
      <ShareModal />
    </div>
  );
};

export default DriveSystem;