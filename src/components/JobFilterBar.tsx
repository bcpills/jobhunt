import React, { useState } from 'react';
import { Search, MapPin, ArrowUpDown, BookmarkCheck, SlidersHorizontal, ChevronDown, ChevronUp, RotateCcw, Sparkles, Rocket } from 'lucide-react';
import { JobFilterState } from '../types';
import { US_STATE_NAMES } from '../utils/clientResumeParser';

interface JobFilterBarProps {
  filters: JobFilterState;
  onChange: (newFilters: JobFilterState) => void;
  totalJobs: number;
  filteredCount: number;
  appliedCount?: number;
  userState?: string;
}

export const JobFilterBar: React.FC<JobFilterBarProps> = ({
  filters,
  onChange,
  totalJobs,
  filteredCount,
  appliedCount = 0,
  userState = 'NC',
}) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const currentState = filters.userState || userState;

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    (filters.onlyApplied ? 1 : 0) +
    (filters.seniority !== 'All' ? 1 : 0) +
    (filters.userState && filters.userState !== 'All States' ? 1 : 0) +
    (filters.maxSalary && filters.maxSalary > 0 ? 1 : 0) +
    (filters.region !== 'All Regions' ? 1 : 0) +
    (filters.includeStretchRoles === false ? 1 : 0) +
    (filters.matchTierFilter && filters.matchTierFilter !== 'all' ? 1 : 0);

  const resetFilters = () => {
    onChange({
      searchQuery: '',
      seniority: 'All',
      minSalary: 0,
      maxSalary: 0,
      userState: 'All States',
      onlyMyState: false,
      onlyApplied: false,
      minMatchScore: 0,
      region: 'All Regions',
      sortBy: 'overallMatch',
      includeStretchRoles: true,
      matchTierFilter: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-2xs mb-6 space-y-3">
      {/* Search and Primary Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Search input with clean mobile sizing */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search role, company, or skill..."
            value={filters.searchQuery}
            onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            {mobileExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>

          {/* Mobile Applied Quick Filter */}
          <button
            onClick={() => onChange({ ...filters, onlyApplied: !filters.onlyApplied })}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filters.onlyApplied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Applied ({appliedCount})</span>
          </button>
        </div>

        {/* Desktop Quick Filters */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          {/* Match Tier Segment: All / Achievable / Stretch */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700 text-xs">
            <button
              onClick={() => onChange({ ...filters, matchTierFilter: 'all', includeStretchRoles: true })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.matchTierFilter === 'all' || !filters.matchTierFilter
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Openings
            </button>
            <button
              onClick={() => onChange({ ...filters, matchTierFilter: 'achievableOnly' })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.matchTierFilter === 'achievableOnly'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Filter to grounded achievable roles matching your target compensation"
            >
              Achievable
            </button>
            <button
              onClick={() => onChange({ ...filters, matchTierFilter: 'stretchOnly', includeStretchRoles: true })}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                filters.matchTierFilter === 'stretchOnly'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Filter to stretch & reach roles with higher compensation bands"
            >
              🚀 Stretch Roles
            </button>
          </div>

          {/* Quick Stretch Roles Toggle Button */}
          <button
            onClick={() =>
              onChange({
                ...filters,
                includeStretchRoles: filters.includeStretchRoles === false ? true : false,
                matchTierFilter: filters.includeStretchRoles === false ? 'all' : filters.matchTierFilter,
              })
            }
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              filters.includeStretchRoles !== false
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300/80 dark:border-amber-800 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
            }`}
            title="Include less achievable stretch roles with higher compensation and broader scope"
          >
            <Rocket className="w-3.5 h-3.5 text-amber-500" />
            <span>{filters.includeStretchRoles !== false ? 'Include Stretch Roles: ON' : 'Stretch Roles: OFF'}</span>
          </button>

          {/* Applied Filter Toggle */}
          <button
            onClick={() => onChange({ ...filters, onlyApplied: !filters.onlyApplied })}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              filters.onlyApplied
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
            title="Filter to show only jobs you have marked as applied for"
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Applied</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filters.onlyApplied
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              }`}
            >
              {appliedCount}
            </span>
          </button>

          {/* Seniority Segment */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700 text-xs">
            {['All', 'Junior', 'Mid-Level', 'Senior'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => onChange({ ...filters, seniority: lvl })}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  filters.seniority === lvl
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* State / Location Filter */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <select
              value={filters.userState || 'All States'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  userState: e.target.value,
                  onlyMyState: e.target.value !== 'All States',
                })
              }
              className="text-xs bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="All States" className="dark:bg-slate-900">All US States (Nationwide)</option>
              {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code} className="dark:bg-slate-900">
                  Eligible in {name} ({code})
                </option>
              ))}
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <select
              value={filters.sortBy || 'overallMatch'}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
              className="text-xs bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="overallMatch" className="dark:bg-slate-900">Highest Match</option>
              <option value="trajectoryFit" className="dark:bg-slate-900">Career Trajectory Fit</option>
              <option value="cultureFit" className="dark:bg-slate-900">Culture Fit Alignment</option>
              <option value="skillOverlap" className="dark:bg-slate-900">Skill Overlap Depth</option>
              <option value="salaryHighToLow" className="dark:bg-slate-900">Salary: High to Low</option>
              <option value="salaryLowToHigh" className="dark:bg-slate-900">Salary: Low to High</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Expandable Filter Drawer */}
      {mobileExpanded && (
        <div className="sm:hidden pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Role Match Tier</label>
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              <button
                onClick={() => onChange({ ...filters, matchTierFilter: 'all', includeStretchRoles: true })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.matchTierFilter === 'all' || !filters.matchTierFilter
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => onChange({ ...filters, matchTierFilter: 'achievableOnly' })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.matchTierFilter === 'achievableOnly'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Achievable
              </button>
              <button
                onClick={() => onChange({ ...filters, matchTierFilter: 'stretchOnly', includeStretchRoles: true })}
                className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filters.matchTierFilter === 'stretchOnly'
                    ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                🚀 Stretch
              </button>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Seniority</label>
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
              {['All', 'Junior', 'Mid-Level', 'Senior'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onChange({ ...filters, seniority: lvl })}
                  className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filters.seniority === lvl
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">State Eligibility</label>
            <select
              value={filters.userState || 'All States'}
              onChange={(e) =>
                onChange({
                  ...filters,
                  userState: e.target.value,
                  onlyMyState: e.target.value !== 'All States',
                })
              }
              className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="All States">All US States (Nationwide)</option>
              {Object.entries(US_STATE_NAMES).map(([code, name]) => (
                <option key={code} value={code}>
                  Eligible in {name} ({code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">Sort Results By</label>
            <select
              value={filters.sortBy || 'overallMatch'}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
              className="w-full text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-medium"
            >
              <option value="overallMatch">Highest Match Score</option>
              <option value="trajectoryFit">Career Trajectory Fit</option>
              <option value="cultureFit">Culture Fit Alignment</option>
              <option value="skillOverlap">Skill Overlap Depth</option>
              <option value="salaryHighToLow">Salary: High to Low</option>
              <option value="salaryLowToHigh">Salary: Low to High</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="w-full py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
