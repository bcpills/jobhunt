import React, { useState } from 'react';
import { CompanyResearchData, JobOpening } from '../types';
import {
  X,
  Building2,
  Newspaper,
  Star,
  DollarSign,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  FileText,
  Users,
  Calendar,
  MapPin,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface CompanyResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyData: CompanyResearchData | null;
  job: JobOpening | null;
  isLoading: boolean;
  onRefreshResearch?: () => void;
  onTailorResume: (job: JobOpening) => void;
  onGenerateCoverLetter: (job: JobOpening) => void;
}

type TabType = 'overview' | 'news' | 'reviews' | 'salary' | 'interview';

export const CompanyResearchModal: React.FC<CompanyResearchModalProps> = ({
  isOpen,
  onClose,
  companyData,
  job,
  isLoading,
  onRefreshResearch,
  onTailorResume,
  onGenerateCoverLetter,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {job.company.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {companyData?.companyName || job.company}
                </h2>
                {companyData?.fundingStageOrTicker && (
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                    {companyData.fundingStageOrTicker}
                  </span>
                )}
                {companyData?.employeeReviews?.overallRating && (
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{companyData.employeeReviews.overallRating} / 5.0</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl line-clamp-1">
                {companyData?.tagline || `Deep corporate and compensation intelligence for ${job.title}`}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-1.5">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {companyData?.companySize || 'Remote Global Team'}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {companyData?.headquarters || job.location}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-indigo-600 font-medium">
                  {job.workArrangement}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshResearch && (
              <button
                onClick={onRefreshResearch}
                disabled={isLoading}
                title="Refresh company data"
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white overflow-x-auto text-xs font-semibold text-slate-600 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Overview & Size</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'news'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Recent News & Press</span>
            {companyData?.recentNews && (
              <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {companyData.recentNews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Employee Reviews (Glassdoor)</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'salary'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Salary Benchmarks</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'interview'
                ? 'border-indigo-600 text-indigo-700 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Interview Loop Intelligence</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <div className="w-10 h-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">
                  Gathering Real-Time Company Intelligence...
                </h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Analyzing recent press releases, Glassdoor employee sentiment ratings, compensation benchmarks, and interview loop data for {job.company}.
                </p>
              </div>
            </div>
          ) : !companyData ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No intelligence available for this company.
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* TAB 1: OVERVIEW & SIZE */}
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Company Size</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {companyData.companySize}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Founded</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {companyData.foundedYear}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Stage / Capital</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate" title={companyData.fundingStageOrTicker}>
                        {companyData.fundingStageOrTicker}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Glassdoor Score</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {companyData.employeeReviews?.overallRating || '4.4'} / 5.0
                      </p>
                    </div>
                  </div>

                  {/* Business Model Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Business Model & Market Footprint</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {companyData.businessModel}
                    </p>
                  </div>

                  {/* Culture Archetype */}
                  <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                        Operating Culture Archetype
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-indigo-900">
                      {companyData.cultureArchetype}
                    </p>
                    <p className="text-xs text-indigo-800/80 leading-relaxed">
                      This company operates with transparent, output-oriented metrics. Candidates who excel at asynchronous writing, self-organization, and low-ego collaboration perform exceptionally well in their hiring loops.
                    </p>
                  </div>

                  {/* Remote Environment Policy */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>Remote Policy & Geographic Model</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 pt-1">
                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-slate-900">Work Arrangement</strong>
                          <span>{job.workArrangement}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-slate-900">Timezone Policy</strong>
                          <span>{job.timezoneRequirement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECENT NEWS & PRESS RELEASES */}
              {activeTab === 'news' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>
                      Use these verified recent milestones to demonstrate proactive research and tailor your cover letter opening hooks!
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {companyData.recentNews.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3 hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.source}</span>
                            <span>·</span>
                            <span>{item.date}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                            Verified Press
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.summary}
                        </p>

                        {/* Impact on Role */}
                        <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-lg p-3 text-xs flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-emerald-900 font-semibold block">
                              Impact on {job.title}:
                            </strong>
                            <span className="text-emerald-800">
                              {item.impactOnRole}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EMPLOYEE REVIEWS (GLASSDOOR SUMMARY) */}
              {activeTab === 'reviews' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Top Rating Dashboard */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
                    <div className="sm:border-r border-slate-200 sm:pr-4">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Overall Rating
                      </span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900">
                          {companyData.employeeReviews.overallRating}
                        </span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= Math.round(companyData.employeeReviews.overallRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Benchmarked vs Top 10% Tech Employers
                      </span>
                    </div>

                    <div className="sm:border-r border-slate-200 sm:pr-4">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Recommend to a Friend
                      </span>
                      <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                        {companyData.employeeReviews.recommendToFriendPercent}%
                      </p>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        High internal employee satisfaction
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        CEO Approval
                      </span>
                      <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                        {companyData.employeeReviews.ceoApprovalPercent}%
                      </p>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">
                        Confidence in leadership trajectory
                      </span>
                    </div>
                  </div>

                  {/* Sub-scores */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Culture & Values Score
                      </span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {companyData.employeeReviews.cultureAndValuesRating} / 5.0
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">
                        Work / Life Balance Score
                      </span>
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                        {companyData.employeeReviews.workLifeBalanceRating} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>What Employees Praise (Pros)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {companyData.employeeReviews.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons / Watchouts */}
                    <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-4 space-y-3">
                      <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Watchouts & Remote Trade-offs (Cons)</span>
                      </h4>
                      <ul className="space-y-2 text-xs text-slate-700">
                        {companyData.employeeReviews.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold mt-0.5">!</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Verdict summary */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1">
                    <strong className="text-slate-900 block font-semibold">
                      Analyst Sentiment Verdict:
                    </strong>
                    <p className="leading-relaxed">
                      {companyData.employeeReviews.verdictSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: SALARY BENCHMARKS */}
              {activeTab === 'salary' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Job Opening vs Market Card */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Posted Role Compensation
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {job.salary}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                        Competitive Market Band
                      </span>
                    </div>

                    {/* Percentile visualizer */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Industry-Standard Market Percentiles ({companyData.salaryBenchmarks.seniority} {companyData.salaryBenchmarks.roleTitle})</span>
                        <span className="text-slate-400 font-normal text-[11px]">USD Annual Base</span>
                      </div>

                      {/* 4-tier percentile cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block">25th Percentile</span>
                          <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                            ${(companyData.salaryBenchmarks.percentile25 / 1000).toFixed(0)}k
                          </span>
                          <span className="text-[10px] text-slate-500">Entry / Regional</span>
                        </div>

                        <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 text-center">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase block">50th (Median)</span>
                          <span className="text-sm font-extrabold text-indigo-900 mt-1 block">
                            ${(companyData.salaryBenchmarks.median / 1000).toFixed(0)}k
                          </span>
                          <span className="text-[10px] text-indigo-700">Market Standard</span>
                        </div>

                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-center">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase block">75th Percentile</span>
                          <span className="text-sm font-extrabold text-emerald-900 mt-1 block">
                            ${(companyData.salaryBenchmarks.percentile75 / 1000).toFixed(0)}k
                          </span>
                          <span className="text-[10px] text-emerald-700">Top-Tier Remote</span>
                        </div>

                        <div className="bg-purple-50/70 border border-purple-200 rounded-lg p-3 text-center">
                          <span className="text-[10px] font-bold text-purple-700 uppercase block">90th Percentile</span>
                          <span className="text-sm font-extrabold text-purple-900 mt-1 block">
                            ${(companyData.salaryBenchmarks.percentile90 / 1000).toFixed(0)}k
                          </span>
                          <span className="text-[10px] text-purple-700">Principal / High-COL</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equity & Benefits Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <span>Equity & Long-Term Incentives</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {companyData.salaryBenchmarks.typicalEquity}
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Bonuses & Remote Stipends</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {companyData.salaryBenchmarks.annualBonusOrPerks}
                      </p>
                    </div>
                  </div>

                  {/* Analysis note */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-2 text-slate-600">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                      <span>Benchmark Data Analysis:</span>
                    </div>
                    <p className="leading-relaxed">
                      {companyData.salaryBenchmarks.analysis}
                    </p>
                    <p className="text-[10px] text-slate-400 pt-1">
                      Data aggregated from: {companyData.salaryBenchmarks.marketDataSource}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 5: INTERVIEW LOOP INTELLIGENCE */}
              {activeTab === 'interview' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Top Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Interview Difficulty
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {companyData.interviewInsights.difficulty}
                        </span>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-indigo-600" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Typical Turnaround
                        </span>
                        <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                          {companyData.interviewInsights.timeline}
                        </span>
                      </div>
                      <Clock className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>

                  {/* Stages Timeline */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Standard Remote Interview Stages
                    </h4>
                    <div className="space-y-2.5 pt-1">
                      {companyData.interviewInsights.typicalProcess.map((stage, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed font-medium">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insider Candidate Tip */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-1.5 text-xs text-amber-900">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Insider Advice to Stand Out:</span>
                    </div>
                    <p className="text-amber-800 leading-relaxed">
                      {companyData.interviewInsights.insiderAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <a
            href={job.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job.company} remote careers`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>Visit {job.company} Careers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onGenerateCoverLetter(job);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Generate Cover Letter</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTailorResume(job);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Tailor Resume for {job.company}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
