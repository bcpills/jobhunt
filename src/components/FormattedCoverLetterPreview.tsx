import React from 'react';
import { ResumeStyleId, JobOpening, CandidateProfile } from '../types';
import { cleanCandidateName, extractContactLine } from '../utils/documentExporter';
import { Briefcase, Building, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

interface FormattedCoverLetterPreviewProps {
  text: string;
  job: JobOpening;
  profile?: CandidateProfile | null;
  styleId: ResumeStyleId;
  className?: string;
}

export const FormattedCoverLetterPreview: React.FC<FormattedCoverLetterPreviewProps> = ({
  text,
  job,
  profile,
  styleId,
  className = '',
}) => {
  const candidateName = cleanCandidateName(profile?.name, profile?.extractedResumeText);
  const contactLine = extractContactLine(profile, profile?.extractedResumeText);
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Clean raw text and remove any duplicate headers or N/A placeholders
  let sanitized = (text || '').trim();
  sanitized = sanitized
    .replace(/(?:Sincerely|Warm regards|Best regards|Regards|Cheers)[,\s]+N\/A\b/gi, `Sincerely,\n${candidateName}`)
    .replace(/\bN\/A\b/g, candidateName);

  // Split into paragraphs
  const rawParagraphs = sanitized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  // Filter out any redundant top header lines that match candidate name/contact/date
  const filteredParagraphs: string[] = [];
  let foundSalutation = false;

  for (const p of rawParagraphs) {
    const lower = p.toLowerCase();
    // If we haven't found the salutation yet, check if this is just redundant contact/date info
    if (!foundSalutation) {
      if (
        lower === candidateName.toLowerCase() ||
        lower.includes('@') ||
        lower.includes('linkedin.com') ||
        lower.includes('phone') ||
        /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4}$/i.test(p) ||
        p.startsWith('Hiring Team') ||
        p.startsWith('Hiring Manager') ||
        p.startsWith('RE:') ||
        p.startsWith('Subject:')
      ) {
        continue;
      }
      if (lower.startsWith('dear') || lower.startsWith('to the') || lower.startsWith('hello')) {
        foundSalutation = true;
      }
    }
    filteredParagraphs.push(p);
  }

  const displayParagraphs = filteredParagraphs.length > 0 ? filteredParagraphs : rawParagraphs;

  // Render Theme 1: Modern
  if (styleId === 'modern') {
    return (
      <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-letter ${className}`}>
        {/* Modern Letterhead */}
        <div className="border-l-4 border-indigo-600 pl-4 py-1 mb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
              {candidateName}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {contactLine}
            </p>
          </div>
          <div className="text-xs font-semibold text-indigo-600 sm:text-right shrink-0">
            {dateStr}
          </div>
        </div>

        {/* Recipient & Position Callout */}
        <div className="mb-6 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">Recipient</span>
            <div className="font-bold text-slate-900">Hiring Team · {job.company}</div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider block">Target Role</span>
            <div className="font-semibold text-slate-800">{job.title} <span className="text-indigo-600">({job.workArrangement})</span></div>
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
          {displayParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {/* Modern Signoff */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <p className="font-bold text-slate-900">{candidateName}</p>
          <p className="text-[11px] text-slate-500 font-medium">Applicant for {job.title}</p>
        </div>
      </div>
    );
  }

  // Render Theme 2: Executive
  if (styleId === 'executive') {
    return (
      <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-letter ${className}`}>
        {/* Executive Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase font-serif">
              {candidateName}
            </h1>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-widest font-mono">
              CONFIDENTIAL APPLICATION
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-sans">
            {contactLine}
          </p>
        </div>

        {/* Executive Addressee Block */}
        <div className="mb-6 space-y-1 text-xs text-slate-800">
          <div className="font-medium text-slate-500">{dateStr}</div>
          <div className="font-bold text-slate-900 mt-2">Hiring Committee & Leadership</div>
          <div className="font-semibold text-slate-800">{job.company}</div>
          <div className="pt-2 text-xs font-bold text-slate-900 uppercase tracking-wide">
            RE: FORMAL CANDIDACY FOR {job.title.toUpperCase()} ({job.workArrangement.toUpperCase()})
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed font-sans">
          {displayParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {/* Executive Signoff */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="font-bold text-slate-950 font-serif text-sm">{candidateName}</p>
          <p className="text-[11px] text-slate-600">Candidate · {job.title}</p>
        </div>
      </div>
    );
  }

  // Render Theme 3: Ivy League
  if (styleId === 'ivy') {
    return (
      <div className={`bg-white text-stone-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-stone-200 font-serif transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-letter ${className}`}>
        {/* Ivy Centered Letterhead */}
        <div className="text-center pb-5 mb-6 border-b border-stone-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-stone-950 uppercase">
            {candidateName}
          </h1>
          <p className="text-xs text-stone-600 mt-1 italic tracking-wide">
            {contactLine.replace(/•/g, ' ✦ ')}
          </p>
          <div className="mt-2 text-[10px] text-stone-400 font-sans tracking-widest uppercase">
            ✦   ✦   ✦
          </div>
        </div>

        {/* Date & Formal Salutation Info */}
        <div className="mb-6 text-xs text-stone-800 space-y-1">
          <p className="italic text-stone-600">{dateStr}</p>
          <p className="font-bold text-stone-900 mt-2">To the Hiring Authority</p>
          <p className="font-medium text-stone-800">{job.company}</p>
          <p className="text-stone-700 italic">Position under consideration: {job.title}</p>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-stone-900 text-xs sm:text-sm leading-relaxed">
          {displayParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line indent-4 sm:indent-6">
              {para}
            </p>
          ))}
        </div>

        {/* Ivy Signoff */}
        <div className="mt-8 pt-4 border-t border-stone-200">
          <p className="font-bold text-stone-950 italic text-sm">{candidateName}</p>
        </div>
      </div>
    );
  }

  // Render Theme 4: Minimal
  if (styleId === 'minimal') {
    return (
      <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-letter ${className}`}>
        {/* Minimal Letterhead */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-950 uppercase">
              {candidateName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {contactLine.replace(/•/g, ' / ')}
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono sm:text-right">
            {dateStr}
          </div>
        </div>

        {/* Minimal Addressee */}
        <div className="mb-6 text-xs text-slate-600 space-y-0.5">
          <div className="text-slate-900 font-semibold">{job.company}</div>
          <div>Role: {job.title} · {job.workArrangement}</div>
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
          {displayParagraphs.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>

        {/* Minimal Signoff */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-xs">
          <p className="font-semibold text-slate-950">{candidateName}</p>
        </div>
      </div>
    );
  }

  // Render Theme 5: Technical
  return (
    <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-letter ${className}`}>
      {/* Technical Letterhead */}
      <div className="border-t-4 border-teal-600 pt-3 pb-3 mb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {candidateName}
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1 font-mono">
            {contactLine}
          </p>
        </div>
        <div className="bg-teal-50 border border-teal-200/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-teal-800 shrink-0">
          DATE: {dateStr}
        </div>
      </div>

      {/* Structured Target Meta */}
      <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">COMPANY</span>
          <span className="font-bold text-slate-800">{job.company}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">POSITION</span>
          <span className="font-bold text-teal-700">{job.title}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-slate-400 block">ARRANGEMENT</span>
          <span className="font-semibold text-slate-700">{job.workArrangement}</span>
        </div>
      </div>

      {/* Letter Body */}
      <div className="space-y-4 text-slate-800 text-xs sm:text-sm leading-relaxed">
        {displayParagraphs.map((para, idx) => (
          <p key={idx} className="whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>

      {/* Technical Signoff */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-900">{candidateName}</p>
          <p className="text-[11px] text-teal-700 font-mono">Applicant ID: VERIFIED</p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
          <span>ATS Optimized</span>
        </div>
      </div>
    </div>
  );
};
