import React from 'react';
import { ResumeStyleId } from '../types';

export interface ResumeDataPayload {
  name: string;
  contactLine: string;
  summary: string;
  skills: string[];
  experiences: Array<{
    title: string;
    company: string;
    dates: string;
    bullets: string[];
  }>;
  education: string[];
  atsKeywords?: string[];
}

interface FormattedResumePreviewProps {
  data: ResumeDataPayload;
  styleId: ResumeStyleId;
  className?: string;
}

export const FormattedResumePreview: React.FC<FormattedResumePreviewProps> = ({
  data,
  styleId,
  className = '',
}) => {
  const { name, contactLine, summary, skills, experiences, education } = data;

  // Render appropriate style
  switch (styleId) {
    case 'modern':
      return (
        <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-resume ${className}`}>
          {/* Modern Header: Left accent border */}
          <div className="border-l-4 border-indigo-600 pl-4 py-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
              {name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {contactLine}
            </p>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1 mb-2 border-b border-indigo-100 flex items-center justify-between">
                <span>Professional Summary</span>
                <span className="w-8 h-0.5 bg-indigo-600 rounded-full" />
              </h2>
              <p className="text-slate-700 leading-relaxed">
                {summary}
              </p>
            </div>
          )}

          {/* Technical Competencies (Pill Badges) */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1 mb-2.5 border-b border-indigo-100 flex items-center justify-between">
                <span>Core Technical Skills & Competencies</span>
                <span className="w-8 h-0.5 bg-indigo-600 rounded-full" />
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50/80 text-indigo-900 border border-indigo-200/80 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1 mb-3 border-b border-indigo-100 flex items-center justify-between">
                <span>Professional Experience</span>
                <span className="w-8 h-0.5 bg-indigo-600 rounded-full" />
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-semibold text-indigo-600">{exp.company}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.dates}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-slate-700 pl-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">▸</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-indigo-900 uppercase tracking-wider pb-1 mb-2 border-b border-indigo-100 flex items-center justify-between">
                <span>Education & Certifications</span>
                <span className="w-8 h-0.5 bg-indigo-600 rounded-full" />
              </h2>
              <ul className="space-y-1 text-slate-700">
                {education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'ivy':
      return (
        <div className={`bg-stone-50/60 text-stone-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-stone-200 font-serif transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-resume ${className}`}>
          {/* Ivy Editorial Header: Centered & Timeless */}
          <div className="text-center pb-4 mb-5 border-b border-stone-300">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-widest text-stone-900 uppercase">
              {name}
            </h1>
            <p className="text-[11px] text-stone-600 mt-1.5 italic font-sans tracking-wide">
              {contactLine.replace(/•/g, '✦')}
            </p>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-5">
              <h2 className="text-center text-[11px] font-bold text-stone-800 uppercase tracking-widest pb-1 mb-2 border-b border-stone-200">
                — Professional Summary —
              </h2>
              <p className="text-stone-800 leading-relaxed font-serif text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Core Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-center text-[11px] font-bold text-stone-800 uppercase tracking-widest pb-1 mb-2 border-b border-stone-200">
                — Core Technical Competencies —
              </h2>
              <p className="text-center text-stone-800 leading-relaxed font-serif">
                {skills.join('  ✦  ')}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-5">
              <h2 className="text-center text-[11px] font-bold text-stone-800 uppercase tracking-widest pb-1 mb-3 border-b border-stone-200">
                — Professional Experience —
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between border-b border-stone-200/60 pb-0.5">
                      <span className="font-bold text-stone-900 text-sm">{exp.title}</span>
                      <span className="text-[11px] text-stone-600 italic font-sans">{exp.dates}</span>
                    </div>
                    <div className="text-[11px] font-serif italic text-stone-700 font-semibold mb-1">
                      {exp.company}
                    </div>

                    <ul className="space-y-1 text-stone-800 pl-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-stone-500 shrink-0 mt-0.5">▪</span>
                          <span className="leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-center text-[11px] font-bold text-stone-800 uppercase tracking-widest pb-1 mb-2 border-b border-stone-200">
                — Education & Credentials —
              </h2>
              <ul className="space-y-1 text-stone-800 text-center">
                {education.map((edu, idx) => (
                  <li key={idx} className="font-serif italic">
                    {edu}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'minimal':
      return (
        <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-resume ${className}`}>
          {/* Minimalist Header: High contrast, clean whitespace */}
          <div className="pb-5 mb-5 border-b border-slate-200">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 uppercase">
              {name}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              {contactLine}
            </p>
          </div>

          {/* Summary */}
          {summary && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Summary
              </h2>
              <p className="text-slate-800 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Skills & Tech Stack
              </h2>
              <p className="text-slate-800 leading-relaxed">
                {skills.join('  /  ')}
              </p>
            </div>
          )}

          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-5">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <span className="font-bold text-slate-950">{exp.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{exp.dates}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {exp.company}
                    </div>

                    <ul className="space-y-1 text-slate-700 pt-0.5">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-slate-300 select-none shrink-0">—</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Education
              </h2>
              <ul className="space-y-1 text-slate-700">
                {education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-slate-300 select-none shrink-0">—</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'technical':
      return (
        <div className={`bg-white text-slate-900 p-5 sm:p-8 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-snug max-w-3xl mx-auto printable-resume ${className}`}>
          {/* Technical Header: Compact density, emerald accent */}
          <div className="pb-3 mb-4 border-b-2 border-emerald-600 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                {name}
              </h1>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                {contactLine}
              </p>
            </div>
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded text-[10px] font-bold font-mono">
              STATUS: READY FOR HIRE
            </div>
          </div>

          {/* Technical Competencies Box */}
          {skills && skills.length > 0 && (
            <div className="mb-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <h2 className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                <span>Core Technical Proficiencies</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-medium text-slate-800">
                    <span className="text-emerald-600 font-bold shrink-0">■</span>
                    <span className="truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {summary && (
            <div className="mb-4">
              <h2 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                <span>Executive Technical Summary</span>
              </h2>
              <p className="text-slate-700 leading-relaxed text-[11.5px]">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider pb-1 mb-2.5 border-b border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                <span>Professional Work Experience</span>
              </h2>
              <div className="space-y-3.5">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{exp.title}</span>
                        <span className="text-slate-400">|</span>
                        <span className="font-semibold text-emerald-700 text-xs">{exp.company}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {exp.dates}
                      </span>
                    </div>

                    <ul className="space-y-1 text-slate-700 pl-1 text-[11.5px]">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 shrink-0 font-bold mt-0.5">■</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider pb-1 mb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-xs bg-emerald-600" />
                <span>Education & Certifications</span>
              </h2>
              <ul className="space-y-1 text-slate-700 text-[11.5px]">
                {education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 shrink-0 font-bold mt-0.5">■</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );

    case 'executive':
    default:
      return (
        <div className={`bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-200 font-sans transition-all text-xs leading-relaxed max-w-3xl mx-auto printable-resume ${className}`}>
          {/* Classic Executive Header: Centered & Crisp */}
          <div className="text-center pb-4 mb-5 border-b-2 border-slate-300">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-900 uppercase">
              {name}
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              {contactLine}
            </p>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 mb-2 border-b border-indigo-500/80 flex items-center justify-between">
                <span>Professional Summary</span>
              </h2>
              <p className="text-slate-800 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Core Technical Skills */}
          {skills && skills.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 mb-2 border-b border-indigo-500/80 flex items-center justify-between">
                <span>Core Technical Skills & Competencies</span>
              </h2>
              <p className="text-slate-800 leading-relaxed">
                {skills.join('   •   ')}
              </p>
            </div>
          )}

          {/* Professional Experience */}
          {experiences && experiences.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 mb-3 border-b border-indigo-500/80 flex items-center justify-between">
                <span>Professional Experience</span>
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <span className="font-bold text-slate-900 text-sm">{exp.title}</span>
                      <span className="text-[11px] font-bold text-slate-500">{exp.dates}</span>
                    </div>
                    <div className="text-xs font-bold text-indigo-700 mb-1">
                      {exp.company}
                    </div>

                    <ul className="space-y-1.5 text-slate-800 pl-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 mb-2 border-b border-indigo-500/80 flex items-center justify-between">
                <span>Education & Technical Certifications</span>
              </h2>
              <ul className="space-y-1 text-slate-800">
                {education.map((edu, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{edu}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
  }
};
