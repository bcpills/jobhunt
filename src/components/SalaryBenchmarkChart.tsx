import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { JobOpening, CandidateProfile } from '../types';
import { parseSalaryRange, getEstimatedMarketBenchmark } from '../utils/salary';

interface SalaryBenchmarkChartProps {
  job: JobOpening;
  candidateProfile?: CandidateProfile | null;
}

export const SalaryBenchmarkChart: React.FC<SalaryBenchmarkChartProps> = ({
  job,
  candidateProfile,
}) => {
  const [viewMode, setViewMode] = useState<'range' | 'median'>('range');

  const parsedJob = parseSalaryRange(job.salary);

  // User expected range
  const userMin = candidateProfile?.salaryExpectationRange?.min || 135000;
  const userMax = candidateProfile?.salaryExpectationRange?.max || 175000;
  const userMid = Math.round((userMin + userMax) / 2);

  // Market average for role
  const market = getEstimatedMarketBenchmark(job.title, candidateProfile?.seniorityLevel);
  const marketMin = market.percentile25;
  const marketMid = market.median;
  const marketMax = market.percentile75;

  // Comparison metrics
  const diffFromUser = parsedJob.midpoint - userMid;
  const diffPercent = Math.round((diffFromUser / userMid) * 100);
  const diffFromMarket = parsedJob.midpoint - marketMid;
  const diffMarketPercent = Math.round((diffFromMarket / marketMid) * 100);

  // Data for Recharts Bar Chart
  const chartData = [
    {
      category: "This Job's Range",
      shortName: 'Job Offer',
      min: Math.round(parsedJob.min / 1000),
      spread: Math.round((parsedJob.max - parsedJob.min) / 1000),
      max: Math.round(parsedJob.max / 1000),
      median: Math.round(parsedJob.midpoint / 1000),
      fullRangeStr: `$${(parsedJob.min / 1000).toFixed(0)}k - $${(parsedJob.max / 1000).toFixed(0)}k`,
      barColor: '#4f46e5', // Indigo 600
    },
    {
      category: 'Your Target Expectation',
      shortName: 'Your Target',
      min: Math.round(userMin / 1000),
      spread: Math.round((userMax - userMin) / 1000),
      max: Math.round(userMax / 1000),
      median: Math.round(userMid / 1000),
      fullRangeStr: `$${(userMin / 1000).toFixed(0)}k - $${(userMax / 1000).toFixed(0)}k`,
      barColor: '#059669', // Emerald 600
    },
    {
      category: 'Market Benchmark (25th - 75th)',
      shortName: 'Market Avg',
      min: Math.round(marketMin / 1000),
      spread: Math.round((marketMax - marketMin) / 1000),
      max: Math.round(marketMax / 1000),
      median: Math.round(marketMid / 1000),
      fullRangeStr: `$${(marketMin / 1000).toFixed(0)}k - $${(marketMax / 1000).toFixed(0)}k (Med: $${(marketMid / 1000).toFixed(0)}k)`,
      barColor: '#d97706', // Amber 600
    },
  ];

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700 max-w-xs">
          <p className="font-bold text-slate-100 flex items-center justify-between gap-3">
            <span>{data.category}</span>
          </p>
          <div className="space-y-0.5 text-slate-300">
            <p>
              Range:{' '}
              <span className="font-semibold text-emerald-300">
                ${data.min}k – ${data.max}k
              </span>
            </p>
            <p>
              Midpoint / Target:{' '}
              <span className="font-semibold text-white">${data.median}k / yr</span>
            </p>
          </div>
          {data.shortName === 'Job Offer' && (
            <p className="text-[11px] text-indigo-200 border-t border-slate-700/80 pt-1 mt-1">
              {diffPercent >= 0
                ? `+${diffPercent}% above your target midpoint`
                : `${diffPercent}% below your target midpoint`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Compensation Benchmark Visualization
            </h4>
            <p className="text-[11px] text-slate-500">
              Interactive Recharts comparison against your expectations & verified market data
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('range')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'range'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Range Spread ($k)
          </button>
          <button
            onClick={() => setViewMode('median')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              viewMode === 'median'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Midpoint / Target ($k)
          </button>
        </div>
      </div>

      {/* High-level status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Job Base Salary
          </span>
          <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">
            ${(parsedJob.min / 1000).toFixed(0)}k – ${(parsedJob.max / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-slate-500">Midpoint: ${(parsedJob.midpoint / 1000).toFixed(0)}k</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Your Expected Range
          </span>
          <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">
            ${(userMin / 1000).toFixed(0)}k – ${(userMax / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-slate-500">Target Mid: ${(userMid / 1000).toFixed(0)}k</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
          <span className="text-[10px] text-slate-500 font-semibold uppercase block">
            Market Role Average
          </span>
          <span className="text-sm font-extrabold text-amber-700 block mt-0.5">
            ${(marketMin / 1000).toFixed(0)}k – ${(marketMax / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-slate-500">Median: ${(marketMid / 1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 8, right: 30, left: 10, bottom: 8 }}
            >
              <XAxis
                type="number"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
                tickFormatter={(val) => `$${val}k`}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                type="category"
                dataKey="shortName"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.7)' }} />

              {/* Reference line marking user target midpoint */}
              <ReferenceLine
                x={Math.round(userMid / 1000)}
                stroke="#059669"
                strokeDasharray="4 4"
                label={{
                  value: `Your Mid ($${Math.round(userMid / 1000)}k)`,
                  position: 'top',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {viewMode === 'range' ? (
                <>
                  {/* Floating range bar using stacked bars (transparent min base + colored spread) */}
                  <Bar dataKey="min" stackId="range" fill="transparent" />
                  <Bar
                    dataKey="spread"
                    stackId="range"
                    radius={[4, 4, 4, 4]}
                    name="Salary Range ($k)"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.barColor} />
                    ))}
                  </Bar>
                </>
              ) : (
                <Bar
                  dataKey="median"
                  radius={[0, 4, 4, 0]}
                  name="Midpoint / Target ($k)"
                  barSize={20}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-med-${index}`} fill={entry.barColor} />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Legend Key */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 inline-block" />
              <span>Job Offering ({parsedJob.rawText})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
              <span>Your Expected Range</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
              <span>Market 25th-75th</span>
            </span>
          </div>

          <span className="text-slate-400 text-[10px]">
            Values annualized in USD ($k)
          </span>
        </div>
      </div>

      {/* Strategic Salary Assessment */}
      <div className="p-3 rounded-lg border text-xs flex items-start gap-2.5 bg-white border-slate-200">
        {diffPercent >= 0 ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold block">
            {diffPercent >= 0
              ? `Competitive Compensation: +${diffPercent}% vs. Your Midpoint Target`
              : `Compensation Alignment Note: ${Math.abs(diffPercent)}% below target midpoint`}
          </strong>
          <span>
            This opening's midpoint of{' '}
            <strong className="text-slate-900">${(parsedJob.midpoint / 1000).toFixed(0)}k</strong>{' '}
            ranks{' '}
            <strong className="text-slate-900">
              {diffFromMarket >= 0
                ? `${Math.abs(diffMarketPercent)}% above`
                : `${Math.abs(diffMarketPercent)}% below`}
            </strong>{' '}
            the industry market benchmark of ${(marketMid / 1000).toFixed(0)}k for {job.title}.
            {diffPercent >= 0
              ? ' You hold strong bargaining leverage to negotiate toward the upper quartile.'
              : ' Consider emphasizing secondary compensation like equity grants, flexible asynchronous hours, and home office stipends.'}
          </span>
        </div>
      </div>
    </div>
  );
};
