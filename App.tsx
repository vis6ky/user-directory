
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { User, FilterParams, ApiResponse } from './types';
import { ApiGateway } from './services/apiGateway';
import FilterPanel from './components/FilterPanel';
import UserCard from './components/UserCard';
import SkeletonCard from './components/SkeletonCard';
import StreamingTerminal from './components/StreamingTerminal';
import WorkerTaskBoard from './components/WorkerTaskBoard';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showTaskBoard, setShowTaskBoard] = useState(false);
  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    nationality: '',
    hobby: '',
    minAge: 18,
    maxAge: 100,
    page: 1,
    limit: 12
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const columnCount = 3;
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < allUsers.length; i += columnCount) {
      result.push(allUsers.slice(i, i + columnCount));
    }
    return result;
  }, [allUsers]);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiGateway.getUsers({ ...filters, page: 1 });
      setAllUsers(response.data);
      setTotalResults(response.total);
      setFilters(prev => ({ ...prev, page: 1 }));
      if (parentRef.current) parentRef.current.scrollTop = 0;
    } catch (err) {
      setError('Backend connection failed. Check Node server.');
    } finally {
      setIsLoading(false);
    }
  }, [filters.search, filters.nationality, filters.hobby, filters.minAge, filters.maxAge]);

  const loadMoreData = useCallback(async () => {
    if (isFetchingNextPage || allUsers.length >= totalResults) return;

    setIsFetchingNextPage(true);
    const nextPage = filters.page + 1;
    try {
      const response = await ApiGateway.getUsers({ ...filters, page: nextPage });
      setAllUsers(prev => [...prev, ...response.data]);
      setFilters(prev => ({ ...prev, page: nextPage }));
    } catch (err) {
      console.error('Error loading more users:', err);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [filters, allUsers.length, totalResults, isFetchingNextPage]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 132,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (
      lastItem.index >= rows.length - 1 &&
      allUsers.length < totalResults &&
      !isFetchingNextPage &&
      !isLoading
    ) {
      loadMoreData();
    }
  }, [virtualItems, rows.length, allUsers.length, totalResults, isFetchingNextPage, isLoading, loadMoreData]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shrink-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">UserDirectory <span className="text-indigo-600">Pro</span></h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="hidden lg:flex items-center px-3 py-1.5 bg-green-50 rounded-lg border border-green-100 mr-4">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
              <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">Node.js Online</span>
            </div>

            <button 
              onClick={() => setShowTaskBoard(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Worker Tasks</span>
            </button>

            <button 
              onClick={() => setShowTerminal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-black transition-all group"
            >
              <svg className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Stream terminal</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full px-4 pt-8 pb-4 gap-8">
        <aside className="hidden lg:block w-80 shrink-0">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {isLoading ? 'Fetching from Node Server...' : `${totalResults.toLocaleString()} Members`}
              </h2>
            </div>
            <div className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              Viewing {allUsers.length} profiles
            </div>
          </div>

          <div className="lg:hidden mb-6 shrink-0 overflow-x-auto">
             <FilterPanel filters={filters} setFilters={setFilters} />
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <button 
                onClick={loadInitialData}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-lg shadow-red-100"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <div 
              ref={parentRef}
              className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-inner custom-scrollbar"
              style={{ scrollbarGutter: 'stable' }}
            >
              {isLoading ? (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : allUsers.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                   <h3 className="text-xl font-bold text-gray-800">No matches found</h3>
                </div>
              ) : (
                <div 
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                  className="p-6"
                >
                  {virtualItems.map((virtualRow) => (
                    <div
                      key={virtualRow.key}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6"
                    >
                      {rows[virtualRow.index].map((user) => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  ))}
                  
                  {isFetchingNextPage && (
                    <div className="absolute left-0 w-full p-8 flex justify-center items-center gap-3 bg-white/80 backdrop-blur-sm" style={{ top: `${rowVirtualizer.getTotalSize()}px` }}>
                      <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-bold text-indigo-600 tracking-wide">Syncing data...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="shrink-0 bg-white border-t border-gray-100 py-4 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
          <span className="flex items-center gap-4">
            <span className="text-indigo-600">Full Stack Pro v3.0</span>
            <span className="text-gray-200">|</span>
            <span>REST API & Socket.io Backend</span>
          </span>
          <span className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-gray-900 text-white rounded">NODE_ENV: production</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Server Heartbeat: 20ms
            </span>
          </span>
        </div>
      </footer>

      {showTerminal && (
        <StreamingTerminal onClose={() => setShowTerminal(false)} />
      )}
      
      {showTaskBoard && (
        <WorkerTaskBoard onClose={() => setShowTaskBoard(false)} />
      )}
    </div>
  );
};

export default App;
