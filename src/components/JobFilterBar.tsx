import React from 'react';
import { Search, MapPin, DollarSign, ArrowUpDown, Filter } from 'lucide-react';
import { JobFilterState } from '../types';
import { US_STATE_NAMES } from '../utils/clientResumeParser';

interface JobFilterBarProps {
  filters: JobFilterState;
  onChange: (newFilters: JobFilterState) => void;
  totalJobs: number;
  filteredCount: number;
  userState?: string;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  filters,
  onChange,
  totalJobs,
  filteredCount,
  userState = 'NC',
}) => {
  const currentState = filters.userState || userState;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs mb-6 space-y-3.5">
      {/* Search and Primary Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search role, company, or skill..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 text-slate-800"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Seniority Segment */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200/50 text-xs">
            {['All', 'Junior', 'Mid-Level', 'Senior'].map((lvl) => (
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

          {/* State / Location Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={filters.userState || 'All States'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  userState: e.target.value,
                  onlyMyState: e.target.value !== 'All States',
                })
              }
              className="text-xs bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All States">All US States (Nationwide)</option>
              {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  Eligible in {name} ({code})
                </option>
              ))}
            </select>
          </div>

          {/* Realistic Salary Ceiling Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <select
              value={filters.maxSalary || 0}
              onChange={(e) => onChange({ ...filters, maxSalary: Number(e.target.value) })}
              className="text-xs bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value={0}>Any Salary Range</option>
              <option value={75000}>Max $75k/yr (Achievable Tier)</option>
              <option value={90000}>Max $90k/yr (Mid-Level Tier)</option>
              <option value={115000}>Max $115k/yr (Experienced Tier)</option>
            </select>
          </div>

          {/* Algorithm Sorter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <select
              value={filters.sortBy || 'overallMatch'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sortBy: e.target.value as any,
                })
              }
              className="text-xs bg-transparent text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="overallMatch">Sort: Overall Algorithm Match</option>
              <option value="salaryLowToHigh">Sort: Salary (Achievable First)</option>
              <option value="trajectoryFit">Sort: Trajectory Fit</option>
              <option value="cultureFit">Sort: Culture Fit</option>
              <option value="skillOverlap">Sort: Skill Depth</option>
            </select>
          </div>
        </div>
      </div>

      {/* State Restriction Toggle & Quick Helper */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium select-none">
            <input
              type="checkbox"
              checked={filters.onlyMyState ?? false}
              onChange={(e) => onChange({ ...filters, onlyMyState: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>
              Show state-specific jobs eligible for <strong className="text-slate-900">{currentState}</strong>
            </span>
          </label>

          {filters.maxSalary && filters.maxSalary > 0 && (
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
              Capped at ${(filters.maxSalary / 1000).toFixed(0)}k/yr
            </span>
          )}
        </div>

        {/* Result count line */}
        <div className="flex items-center gap-2 text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-bold">{filteredCount}</strong> of{' '}
            <strong className="text-slate-900 font-bold">{totalJobs}</strong> realistic remote openings
          </span>

          {(filters.searchQuery ||
            filters.seniority !== 'All' ||
            (filters.userState && filters.userState !== 'All States') ||
            (filters.maxSalary && filters.maxSalary > 0) ||
            filters.onlyMyState) && (
            <button
              onClick={() =>
                onChange({
                  searchQuery: '',
                  seniority: 'All',
                  minSalary: 0,
                  maxSalary: 0,
                  userState: 'All States',
                  onlyMyState: false,
                  minMatchScore: 0,
                  region: 'All Regions',
                  sortBy: 'overallMatch',
                })
              }
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline decoration-indigo-200 ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
