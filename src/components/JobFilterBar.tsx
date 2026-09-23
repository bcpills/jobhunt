import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { JobFilterState } from '../types';

interface JobFilterBarProps {
  filters: JobFilterState;
  onChange: (newFilters: JobFilterState) => void;
  totalJobs: number;
  filteredCount: number;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  filters,
  onChange,
  totalJobs,
  filteredCount,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs mb-6 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search role title, company, or tech..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 text-slate-800"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Seniority Segment */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200/50 text-xs">
            {['All', 'Mid-Level', 'Senior', 'Staff/Lead'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChange({ ...filters, seniority: lvl })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filters.seniority === lvl
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Region Selector */}
          <select
            value={filters.region}
            onChange={(e) => onChange({ ...filters, region: e.target.value })}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-slate-800"
          >
            <option value="All Regions">Any Region</option>
            <option value="Worldwide">100% Worldwide</option>
            <option value="US / Americas">US / Americas</option>
            <option value="EMEA">EMEA / Europe</option>
          </select>

          {/* Min Match Selector */}
          <select
            value={filters.minMatchScore}
            onChange={(e) => onChange({ ...filters, minMatchScore: Number(e.target.value) })}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden focus:border-slate-800"
          >
            <option value={0}>All Match Tiers</option>
            <option value={85}>85%+ High Fit</option>
            <option value={90}>90%+ Top Match</option>
          </select>

          {/* Algorithm Dimension Sorter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3 h-3 text-indigo-600" />
            <select
              value={filters.sortBy || 'overallMatch'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sortBy: e.target.value as 'overallMatch' | 'trajectoryFit' | 'cultureFit' | 'skillOverlap',
                })
              }
              className="text-xs bg-transparent text-slate-700 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="overallMatch">Sort: Overall Algorithm Match</option>
              <option value="trajectoryFit">Sort: Career Trajectory Fit</option>
              <option value="cultureFit">Sort: Inferred Culture Fit</option>
              <option value="skillOverlap">Sort: Technical Skill Overlap</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count line */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>
          Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
          <strong className="text-slate-800">{totalJobs}</strong> realistic remote openings matched to your profile
        </span>
        {(filters.searchQuery || filters.seniority !== 'All' || filters.region !== 'All Regions' || filters.minMatchScore > 0 || filters.sortBy) && (
          <button
            onClick={() =>
              onChange({
                searchQuery: '',
                seniority: 'All',
                minSalary: 0,
                minMatchScore: 0,
                region: 'All Regions',
                sortBy: 'overallMatch',
              })
            }
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
