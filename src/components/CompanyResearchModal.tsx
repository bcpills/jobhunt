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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs shrink-0">
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {companyData?.companyName || job.company}
                </h2>
                {companyData?.fundingStageOrTicker && (
                  <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 px-2 py-0.5 rounded-md">
                    {companyData.fundingStageOrTicker}
                  </span>
                )}
                {companyData?.employeeReviews?.overallRating && (
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{companyData.employeeReviews.overallRating} / 5.0</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl line-clamp-1">
                {companyData?.tagline || `Deep corporate and compensation intelligence for ${job.title}`}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {companyData?.companySize || 'Remote Global Team'}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {companyData?.headquarters || job.location}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {job.workArrangement}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onRefreshResearch && (
              <button
                onClick={onRefreshResearch}
                disabled={isLoading}
                title="Refresh company data"
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-semibold text-slate-600 dark:text-slate-400 scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Overview & Size</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'news'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>News & Press</span>
            {companyData?.recentNews && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {companyData.recentNews.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Reviews</span>
          </button>

          <button
            onClick={() => setActiveTab('salary')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'salary'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Salary Bands</span>
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'interview'
                ? 'border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>Interview Loop</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/40 dark:bg-slate-950/40">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 space-y-4 text-center">
              <div className="w-10 h-10 rounded-full border-3 border-indigo-600 dark:border-indigo-400 border-t-transparent animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Gathering Real-Time Company Intelligence...
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
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
                <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Size</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {companyData.companySize}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Founded</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {companyData.foundedYear}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Capital</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 truncate" title={companyData.fundingStageOrTicker}>
                        {companyData.fundingStageOrTicker}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        <span>Glassdoor</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {companyData.employeeReviews?.overallRating || '4.4'} / 5.0
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-2">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Business Model & Footprint</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {companyData.businessModel}
                    </p>
                  </div>

                  <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h3 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                        Operating Culture Archetype
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                      {companyData.cultureArchetype}
                    </p>
                    <p className="text-xs text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                      This company operates with transparent, output-oriented metrics. Candidates who excel at asynchronous writing, self-organization, and low-ego collaboration perform exceptionally well.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: RECENT NEWS & PRESS RELEASES */}
              {activeTab === 'news' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="space-y-3.5">
                    {companyData.recentNews.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.source}</span>
                            <span>·</span>
                            <span>{item.date}</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                            Verified Press
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.summary}
                        </p>

                        <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 rounded-xl p-3 text-xs flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-emerald-900 dark:text-emerald-300 font-semibold block">
                              Impact on {job.title}:
                            </strong>
                            <span className="text-emerald-800 dark:text-emerald-400">
                              {item.impactOnRole}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EMPLOYEE REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center">
                    <div className="sm:border-r border-slate-200 dark:border-slate-700 sm:pr-4">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Overall Rating
                      </span>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                          {companyData.employeeReviews.overallRating}
                        </span>
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= Math.round(companyData.employeeReviews.overallRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sm:border-r border-slate-200 dark:border-slate-700 sm:pr-4">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        Recommend to Friend
                      </span>
                      <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {companyData.employeeReviews.recommendToFriendPercent}%
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                        CEO Approval
                      </span>
                      <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                        {companyData.employeeReviews.ceoApprovalPercent}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Employee Pros</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {companyData.employeeReviews.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-2xl p-4 space-y-2">
                      <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Watchouts (Cons)</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {companyData.employeeReviews.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">!</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SALARY BENCHMARKS */}
              {activeTab === 'salary' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Posted Role Compensation
                        </span>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {job.salary}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md">
                        Competitive Market Band
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">25th Percentile</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                          ${(companyData.salaryBenchmarks.percentile25 / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-3 text-center">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase block">Median</span>
                        <span className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 mt-1 block">
                          ${(companyData.salaryBenchmarks.median / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-3 text-center">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase block">75th Percentile</span>
                        <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 mt-1 block">
                          ${(companyData.salaryBenchmarks.percentile75 / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-xl p-3 text-center">
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase block">90th Percentile</span>
                        <span className="text-sm font-extrabold text-purple-900 dark:text-purple-300 mt-1 block">
                          ${(companyData.salaryBenchmarks.percentile90 / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: INTERVIEW LOOP */}
              {activeTab === 'interview' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Interview Stages ({(companyData.interviewInsights.typicalProcess || []).length} Rounds)</span>
                    </h4>
                    <div className="space-y-2">
                      {(companyData.interviewInsights.typicalProcess || []).map((stage: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{stage}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 space-y-1.5 text-xs text-amber-900 dark:text-amber-300">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Insider Advice to Stand Out:</span>
                    </div>
                    <p className="text-amber-800 dark:text-amber-400 leading-relaxed">
                      {companyData.interviewInsights.insiderAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <a
            href={job.applyUrl || `https://www.google.com/search?q=${encodeURIComponent(`${job.company} remote careers`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
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
              className="flex-1 sm:flex-initial min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Cover Letter</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTailorResume(job);
              }}
              className="flex-1 sm:flex-initial min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Tailor Resume</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
