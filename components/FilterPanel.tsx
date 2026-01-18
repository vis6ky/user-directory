
import React from 'react';
import { FilterParams } from '../types';
import { NATIONALITIES, HOBBIES_POOL } from '../constants';

interface FilterPanelProps {
  filters: FilterParams;
  setFilters: (filters: FilterParams) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const toggleNationality = (nat: string) => {
    setFilters({ 
      ...filters, 
      nationality: filters.nationality === nat ? '' : nat, 
      page: 1 
    });
  };

  const toggleHobby = (hobby: string) => {
    setFilters({ 
      ...filters, 
      hobby: filters.hobby === hobby ? '' : hobby, 
      page: 1 
    });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = parseInt(e.target.value) || 0;
    setFilters({ 
      ...filters, 
      [type === 'min' ? 'minAge' : 'maxAge']: val,
      page: 1 
    });
  };

  const handleReset = () => {
    setFilters({ 
      search: '', 
      nationality: '', 
      hobby: '',
      minAge: 18, 
      maxAge: 100, 
      page: 1, 
      limit: 12 
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-8 lg:h-[calc(100vh-180px)] overflow-y-auto">
      {/* Search Section */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Find by Name</label>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search first or last name..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm outline-none shadow-sm"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <svg className="w-5 h-5 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Age Section */}
      <div>
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Age Range</label>
        <div className="grid grid-cols-2 gap-3">
          <input 
            type="number" 
            placeholder="Min"
            className="w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filters.minAge || ''}
            onChange={(e) => handleAgeChange(e, 'min')}
          />
          <input 
            type="number" 
            placeholder="Max"
            className="w-full px-3 py-2.5 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            value={filters.maxAge || ''}
            onChange={(e) => handleAgeChange(e, 'max')}
          />
        </div>
      </div>

      {/* Nationalities Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Nationalities</label>
          {filters.nationality && (
            <button onClick={() => toggleNationality('')} className="text-[10px] text-indigo-600 font-bold hover:underline">Clear</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {NATIONALITIES.map((nat) => (
            <button
              key={nat}
              onClick={() => toggleNationality(nat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                filters.nationality === nat 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50'
              }`}
            >
              {nat}
            </button>
          ))}
        </div>
      </div>

      {/* Hobbies Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Hobbies</label>
          {filters.hobby && (
            <button onClick={() => toggleHobby('')} className="text-[10px] text-indigo-600 font-bold hover:underline">Clear</button>
          )}
        </div>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {HOBBIES_POOL.slice(0, 20).map((hobby) => (
            <button
              key={hobby}
              onClick={() => toggleHobby(hobby)}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                filters.hobby === hobby 
                  ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{hobby}</span>
              {filters.hobby === hobby && (
                <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-100 mt-auto">
        <button 
          onClick={handleReset}
          className="w-full py-3 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-100 transition-colors uppercase tracking-widest"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
