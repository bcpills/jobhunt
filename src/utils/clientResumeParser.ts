import {
  CandidateProfile,
  JobOpening,
  TailoredResume,
  CoverLetter,
  CompanyResearchData,
  SeniorityLevel
} from '../types';

export const US_STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  DC: 'District of Columbia'
};

export function detectUserStateFromText(text: string): { code?: string; name?: string } {
  const lower = text.toLowerCase();

  // Explicit state full name checks
  for (const [code, name] of Object.entries(US_STATE_NAMES)) {
    const nameLower = name.toLowerCase();
    const regex = new RegExp(`\\b${nameLower}\\b`, 'i');
    if (regex.test(lower)) {
      return { code, name };
    }
  }

  // Common city/area code heuristics
  if (lower.includes('raleigh') || lower.includes('durham') || lower.includes('charlotte') || lower.includes('greensboro') || lower.includes('919-') || lower.includes('704-') || lower.includes('984-')) {
    return { code: 'NC', name: 'North Carolina' };
  }
  if (lower.includes('austin') || lower.includes('dallas') || lower.includes('houston') || lower.includes('san antonio') || lower.includes('512-') || lower.includes('214-') || lower.includes('713-')) {
    return { code: 'TX', name: 'Texas' };
  }
  if (lower.includes('orlando') || lower.includes('tampa') || lower.includes('miami') || lower.includes('jacksonville') || lower.includes('407-') || lower.includes('305-') || lower.includes('813-')) {
    return { code: 'FL', name: 'Florida' };
  }
  if (lower.includes('columbus') || lower.includes('cleveland') || lower.includes('cincinnati') || lower.includes('614-') || lower.includes('216-') || lower.includes('513-')) {
    return { code: 'OH', name: 'Ohio' };
  }
  if (lower.includes('atlanta') || lower.includes('savannah') || lower.includes('404-') || lower.includes('678-')) {
    return { code: 'GA', name: 'Georgia' };
  }
  if (lower.includes('richmond') || lower.includes('norfolk') || lower.includes('alexandria') || lower.includes('804-') || lower.includes('703-')) {
    return { code: 'VA', name: 'Virginia' };
  }

  // 2-letter uppercase state code check (e.g. ", NC" or " NC ")
  for (const code of Object.keys(US_STATE_NAMES)) {
    const codeRegex = new RegExp(`(?:,\\s*|\\s+)${code}(?:\\s+|,|\\d|$)`, 'm');
    if (codeRegex.test(text)) {
      return { code, name: US_STATE_NAMES[code] };
    }
  }

  return {};
}

export function parseCandidateProfileFromText(
  text: string,
  fileName?: string,
  userLocationOverride?: string,
  targetSalaryOverride?: { min: number; max: number }
): CandidateProfile {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Clean Name Extraction
  let extractedName = '';
  for (const line of lines.slice(0, 8)) {
    const clean = line.replace(/[|•\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
    if (
      clean.length >= 2 &&
      clean.length <= 40 &&
      !clean.includes('@') &&
      !clean.includes('http') &&
      !clean.includes('www.') &&
      !clean.toLowerCase().includes('resume') &&
      !clean.toLowerCase().includes('curriculum') &&
      !clean.toLowerCase().includes('summary') &&
      !clean.toLowerCase().includes('profile') &&
      !clean.toLowerCase().includes('contact') &&
      !/^\+?\d[\d\s\-\(\)]+$/.test(clean)
    ) {
      extractedName = clean;
      break;
    }
  }
  if (!extractedName) {
    extractedName = fileName
      ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      : 'Candidate';
  }

  // 2. Title Detection
  let detectedTitle = '';
  const titleKeywords = [
    'engineer', 'developer', 'specialist', 'manager', 'architect', 'analyst',
    'administrator', 'lead', 'designer', 'consultant', 'technician', 'director',
    'scientist', 'officer', 'coordinator', 'supervisor', 'head', 'support'
  ];
  for (const line of lines.slice(0, 10)) {
    const lower = line.toLowerCase();
    if (titleKeywords.some((kw) => lower.includes(kw)) && line.length < 60 && !line.includes('@')) {
      detectedTitle = line.replace(/[|•\(\)]/g, ' ').replace(/\s+/g, ' ').trim();
      break;
    }
  }
  if (!detectedTitle) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('desktop support') || lowerText.includes('it support') || lowerText.includes('technical support') || lowerText.includes('user support')) {
      detectedTitle = 'IT Support & Systems Specialist';
    } else if (lowerText.includes('devops') || lowerText.includes('site reliability') || lowerText.includes('cloud engineer') || lowerText.includes('sre')) {
      detectedTitle = 'Cloud & DevOps Specialist';
    } else if (lowerText.includes('product manager') || lowerText.includes('senior product')) {
      detectedTitle = 'Product Manager';
    } else if (lowerText.includes('data engineer') || lowerText.includes('data scientist') || lowerText.includes('analyst')) {
      detectedTitle = 'Data Systems Analyst';
    } else if (lowerText.includes('frontend') || lowerText.includes('react')) {
      detectedTitle = 'Frontend Developer';
    } else if (lowerText.includes('full-stack') || lowerText.includes('fullstack')) {
      detectedTitle = 'Full-Stack Developer';
    } else if (lowerText.includes('cybersecurity') || lowerText.includes('security analyst')) {
      detectedTitle = 'Cybersecurity Analyst';
    } else {
      detectedTitle = 'Technical Specialist';
    }
  }

  // 3. Seniority Detection
  const lowerText = text.toLowerCase();
  let seniority: SeniorityLevel = 'Mid-Level';
  if (lowerText.includes('director') || lowerText.includes('vp ') || lowerText.includes('head of')) {
    seniority = 'Director/Executive';
  } else if (lowerText.includes('staff') || lowerText.includes('principal') || lowerText.includes('architect')) {
    seniority = 'Staff/Lead';
  } else if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('8+ years') || lowerText.includes('8 years') || lowerText.includes('7+ years')) {
    seniority = 'Senior';
  } else if (lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('entry level') || lowerText.includes('associate')) {
    seniority = 'Junior';
  }

  // 4. State / Location Detection
  const detectedLocation = detectUserStateFromText(text);
  const userState = userLocationOverride || detectedLocation.code || 'All US';
  const userLocation = detectedLocation.name
    ? `${detectedLocation.name} (${detectedLocation.code})`
    : userLocationOverride || 'United States (Nationwide)';

  // 5. Skills Extraction
  const potentialSkills = [
    'Active Directory', 'ServiceNow', 'SAP', 'Windows Domain Environments', 'Hardware Troubleshooting',
    'Computer Imaging', 'Hardware Lifecycle Management', 'Office 365', 'SharePoint', 'OneDrive',
    'Python', 'Networking Protocols', 'Asset Tracking', 'SQL', 'JavaScript', 'HTML/CSS',
    'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker',
    'Kubernetes', 'REST APIs', 'Git', 'CI/CD', 'Linux', 'Bash', 'Jira', 'Customer Success',
    'Salesforce', 'Azure', 'VPN', 'DHCP', 'DNS', 'Intune', 'Jamf', 'PowerShell', 'EBS', 'Warranty Coordination'
  ];
  const matchedSkills = potentialSkills.filter((s) => lowerText.includes(s.toLowerCase()));
  const primarySkills = matchedSkills.slice(0, 7).length > 0 ? matchedSkills.slice(0, 7) : ['System Troubleshooting', 'User Support', 'Hardware Diagnostics'];
  const secondarySkills = matchedSkills.slice(7, 14).length > 0 ? matchedSkills.slice(7, 14) : ['Async Workflow', 'Technical Documentation', 'Asset Tracking'];

  const isITSupport =
    detectedTitle.toLowerCase().includes('support') ||
    detectedTitle.toLowerCase().includes('desktop') ||
    detectedTitle.toLowerCase().includes('technician') ||
    detectedTitle.toLowerCase().includes('helpdesk');

  // 6. Realistic Achievable Salary Bands
  let defaultMin = 52000;
  let defaultMax = 78000;

  if (targetSalaryOverride && targetSalaryOverride.min > 0) {
    defaultMin = targetSalaryOverride.min;
    defaultMax = targetSalaryOverride.max || defaultMin + 25000;
  } else if (isITSupport) {
    if (seniority === 'Senior') {
      defaultMin = 65000;
      defaultMax = 88000;
    } else if (seniority === 'Junior') {
      defaultMin = 42000;
      defaultMax = 60000;
    } else {
      defaultMin = 52000;
      defaultMax = 75000;
    }
  } else {
    if (seniority === 'Senior') {
      defaultMin = 85000;
      defaultMax = 120000;
    } else if (seniority === 'Junior') {
      defaultMin = 48000;
      defaultMax = 70000;
    } else {
      defaultMin = 65000;
      defaultMax = 95000;
    }
  }

  return {
    name: extractedName,
    title: detectedTitle,
    summary: `${extractedName} is a dedicated technical professional with proven background in ${detectedTitle.toLowerCase()} disciplines, driving operational uptime, hardware diagnostics, user enablement, and asynchronous collaboration in distributed and enterprise environments.`,
    seniorityLevel: seniority,
    yearsOfExperience: lowerText.includes('8+ years') || lowerText.includes('8 years') ? 8 : (seniority === 'Junior' ? 2 : seniority === 'Mid-Level' ? 4 : seniority === 'Senior' ? 6 : 9),
    userState,
    userLocation,
    targetSalaryMin: defaultMin,
    targetSalaryMax: defaultMax,
    primarySkills,
    secondarySkills,
    toolsAndTechnologies: matchedSkills.slice(0, 10),
    remoteWorkStrengths: [
      'Experienced in remote hardware & software diagnostic workflows',
      'High degree of personal ownership and asynchronous ticket resolution',
      'Clear, articulate written communication and patient user-facing empathy'
    ],
    salaryExpectationRange: {
      min: defaultMin,
      max: defaultMax,
      currency: 'USD',
      period: 'yearly'
    },
    targetJobTitles: isITSupport
      ? [
          'Remote IT Support Specialist',
          'Desktop Support Analyst (Remote)',
          'Technical Support Specialist',
          'Enterprise Systems & IT Operations Specialist',
          'Remote Helpdesk Analyst Tier II'
        ]
      : [
          detectedTitle,
          `Remote ${detectedTitle}`,
          `Associate / ${detectedTitle}`,
          `${detectedTitle} (Distributed)`
        ],
    recommendedIndustries: isITSupport
      ? ['Enterprise Software & SaaS', 'Healthcare IT Systems', 'Distributed Tech Companies', 'Public Sector & Higher Ed']
      : ['B2B SaaS', 'Developer Tooling', 'Distributed Cloud Services', 'Remote Work Tech'],
    careerTrajectory: {
      progressionPace: 'Steady & Proven',
      nextLogicalStep: isITSupport ? 'Remote Systems Administrator or IT Operations Lead' : `Advancement into high-impact remote specialization in ${detectedTitle}`,
      leadershipTrajectory: isITSupport ? 'Senior Systems Administrator / IT Support Lead' : 'Senior Specialist / Technical IC',
      velocitySummary: 'Demonstrates consistent velocity, scope expansion, and autonomous delivery across professional roles.'
    },
    inferredCulturePreferences: {
      preferredCompanyStage: 'High-autonomy distributed team or mature enterprise organization',
      workstylePace: 'Async-first, high documentation, minimal meeting overhead',
      teamEnvironment: 'Mission-driven, transparent roadmap, high individual ownership',
      keyMotivators: ['Autonomy & async trust', 'Technical craft & problem solving', 'High impact & user enablement']
    },
    extractedResumeText: text
  };
}

export function generateClientSideJobs(profile: CandidateProfile, filters?: any): JobOpening[] {
  const title = profile?.title || 'IT Support Specialist';
  const lowerTitle = title.toLowerCase();
  const seniority = filters?.seniority && filters.seniority !== 'All' ? filters.seniority : (profile?.seniorityLevel || 'Mid-Level');
  const skills = profile?.primarySkills?.length ? profile.primarySkills : ['Active Directory', 'ServiceNow', 'Troubleshooting', 'Imaging'];

  // Base realistic achievable salaries
  const minSal = filters?.minSalary && filters.minSalary > 0
    ? filters.minSalary
    : (profile?.targetSalaryMin || profile?.salaryExpectationRange?.min || 52000);
  const maxSal = filters?.maxSalary && filters.maxSalary > 0
    ? filters.maxSalary
    : (profile?.targetSalaryMax || profile?.salaryExpectationRange?.max || 78000);

  const region = filters?.region && filters.region !== 'All Regions' ? filters.region : 'US / Americas';
  const userState = filters?.userState || profile?.userState || 'NC';
  const stateName = US_STATE_NAMES[userState] || userState;

  const isIT =
    lowerTitle.includes('support') ||
    lowerTitle.includes('desktop') ||
    lowerTitle.includes('technician') ||
    lowerTitle.includes('helpdesk') ||
    lowerTitle.includes('specialist');

  // 20 realistic remote companies with realistic salary steps and state tags
  const companyDefinitions = [
    {
      name: 'Canonical',
      domain: 'canonical.com',
      type: 'Global Distributed Pioneer',
      arr: '100% Remote · Async First',
      role: 'Remote IT Support & Systems Operations Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
      note: 'Nationwide Remote: Open to all 50 states',
      baseOffset: 8000
    },
    {
      name: 'Red Hat',
      domain: 'redhat.com',
      type: 'Open Source Enterprise Leader',
      arr: '100% Remote · Flexible Hours',
      role: 'Enterprise Technical Support Specialist (State-Specific)',
      states: ['NC', 'VA', 'SC', 'GA', 'FL', 'TX', 'OH', 'TN'],
      note: `State-Specific Remote: Open to ${stateName}, VA, SC, GA, FL, TX, OH`,
      baseOffset: 2000
    },
    {
      name: 'Help Scout',
      domain: 'helpscout.com',
      type: 'Certified B-Corp Pioneer',
      arr: '100% Remote · High Empathy',
      role: 'Customer Operations & IT Systems Support Associate',
      states: ['NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'PA', 'IL', 'CO', 'All US'],
      note: 'Remote across 40 US states',
      baseOffset: -2000
    },
    {
      name: 'NC State University',
      domain: 'ncsu.edu',
      type: 'Higher Education Institutional IT',
      arr: 'Remote within NC · State Pension',
      role: 'Senior Information Systems Support Analyst',
      states: ['NC'],
      note: 'State-Specific Remote: Restricted to North Carolina residents',
      baseOffset: 0
    },
    {
      name: 'Duke Health System',
      domain: 'dukehealth.org',
      type: 'Healthcare Technology Network',
      arr: 'Remote · Clinical Systems',
      role: 'Tier 2 Desktop Systems & Clinic Tech Specialist',
      states: ['NC', 'VA', 'SC', 'TN'],
      note: 'State-Specific Remote: NC, VA, SC, and TN residents',
      baseOffset: 1000
    },
    {
      name: 'Zapier',
      domain: 'zapier.com',
      type: 'Profitable Remote Pioneer',
      arr: '100% Remote · Async First',
      role: 'Distributed IT Specialist & SaaS Administrator',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA'],
      note: 'Nationwide Remote: All 50 states eligible',
      baseOffset: 12000
    },
    {
      name: 'Automattic',
      domain: 'automattic.com',
      type: 'Distributed Web Pioneer',
      arr: '100% Remote · Async Meritocracy',
      role: 'Remote Workplace Systems & Support Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
      note: 'Worldwide / All 50 US states eligible',
      baseOffset: 6000
    },
    {
      name: 'Chewy',
      domain: 'chewy.com',
      type: 'E-Commerce & Customer Ops',
      arr: '100% Remote · High Growth',
      role: 'Associate IT Service Desk Specialist',
      states: ['NC', 'FL', 'TX', 'GA', 'PA', 'OH', 'VA', 'IN', 'KY'],
      note: 'State-Specific Remote: Southeastern & Midwestern US states',
      baseOffset: -4000
    },
    {
      name: 'MetLife Technology',
      domain: 'metlife.com',
      type: 'Enterprise Technology & Finance',
      arr: '100% Remote · Cary Hub',
      role: 'IT Operations Support Analyst',
      states: ['NC', 'SC', 'VA', 'GA', 'FL', 'TX', 'OH'],
      note: 'State-Specific Remote: NC, SC, VA, GA, FL, TX, OH',
      baseOffset: 3000
    },
    {
      name: 'GitLab',
      domain: 'gitlab.com',
      type: 'Public Remote Pioneer',
      arr: '100% Remote · Handbook First',
      role: 'Workplace Operations & Identity Support Analyst',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
      note: 'Nationwide Remote: Open to all 50 states',
      baseOffset: 14000
    },
    {
      name: 'InVision',
      domain: 'invisionapp.com',
      type: 'Distributed Product Platform',
      arr: '100% Remote · High Autonomy',
      role: 'Remote Workplace Systems Coordinator',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA'],
      note: 'Nationwide Remote: Open to all 50 states',
      baseOffset: 1000
    },
    {
      name: 'Buffer',
      domain: 'buffer.com',
      type: 'Transparent SaaS',
      arr: '100% Remote · 4-Day Work Week',
      role: 'Customer Advocate & Technical Troubleshooter',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA'],
      note: 'Worldwide Remote / All US States (4-Day Work Week)',
      baseOffset: 0
    },
    {
      name: '37signals (Basecamp)',
      domain: '37signals.com',
      type: 'Calm Company Pioneer',
      arr: '100% Remote · No Meetings',
      role: 'Customer & Technical Support Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA'],
      note: 'Nationwide & Worldwide Remote: Open to all states',
      baseOffset: 8000
    },
    {
      name: 'Cisco Systems',
      domain: 'cisco.com',
      type: 'Global Networking & Security',
      arr: 'Remote-First · RTP Hub Support',
      role: 'Customer Systems & Desktop Support Specialist',
      states: ['NC', 'VA', 'GA', 'FL', 'TX', 'CA', 'OH', 'All US'],
      note: 'Remote across US states with RTP, NC regional support',
      baseOffset: 7000
    },
    {
      name: 'Epic Games',
      domain: 'epicgames.com',
      type: 'Interactive Entertainment',
      arr: 'Remote · Cary Studio Ties',
      role: 'Studio IT Support Specialist',
      states: ['NC', 'WA', 'CA', 'TX', 'NY', 'GA', 'FL'],
      note: 'State-Specific Remote: NC, WA, CA, TX, NY, GA, FL',
      baseOffset: 9000
    },
    {
      name: 'Akamai (Linode)',
      domain: 'akamai.com',
      type: 'Cloud Infrastructure & CDN',
      arr: '100% Remote · Cloud Hosting',
      role: 'Cloud Systems Customer Support Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'PA', 'IL'],
      note: 'Nationwide Remote: Open to all 50 states',
      baseOffset: 1500
    },
    {
      name: 'Red Ventures',
      domain: 'redventures.com',
      type: 'Digital Media Enterprise',
      arr: 'Remote · Carolinas Region',
      role: 'Workplace Technology & Helpdesk Analyst',
      states: ['NC', 'SC'],
      note: 'State-Specific Remote: Open to NC and SC residents',
      baseOffset: 2000
    },
    {
      name: 'Rackspace Technology',
      domain: 'rackspace.com',
      type: 'Cloud Services & Solutions',
      arr: '100% Remote · Fanatical Support',
      role: 'Remote Tier 2 Systems & Infrastructure Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'TN', 'PA'],
      note: 'Nationwide Remote: All 50 states',
      baseOffset: 5000
    },
    {
      name: 'Squarespace',
      domain: 'squarespace.com',
      type: 'Creative Web Platforms',
      arr: '100% Remote · User Enablement',
      role: 'Customer Operations & Technical Support Associate',
      states: ['NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA', 'IL', 'All US'],
      note: 'Remote in 35 states including NC, TX, FL, OH, VA, GA',
      baseOffset: -3000
    },
    {
      name: 'DuckDuckGo',
      domain: 'duckduckgo.com',
      type: 'Privacy First Technology',
      arr: '100% Remote · Privacy First',
      role: 'Workplace Operations & Security Support Specialist',
      states: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
      note: 'Worldwide Remote / All 50 US States',
      baseOffset: 11000
    }
  ];

  return companyDefinitions.map((c, idx) => {
    const jobTitle = isIT
      ? c.role
      : `${seniority !== 'Junior' ? `${seniority} ` : ''}${title} (${c.name})`;

    const score = Math.max(86, 98 - Math.floor(idx * 0.6));
    const roleMin = Math.max(42000, Math.round((minSal + c.baseOffset) / 1000) * 1000);
    const roleMax = Math.max(roleMin + 15000, Math.round((maxSal + c.baseOffset) / 1000) * 1000);

    const isEligible = c.states.includes('All US') || c.states.includes(userState);

    return {
      id: `client-job-${c.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
      title: jobTitle,
      company: c.name,
      companyDomain: c.domain,
      location: `Remote (${c.states.includes('All US') ? 'US All States' : `${c.states.slice(0, 4).join(', ')}`})`,
      timezoneRequirement: 'Flexible Global / US Timezones',
      workArrangement: c.arr,
      salary: `$${Math.round(roleMin / 1000)}k - $${Math.round(roleMax / 1000)}k / yr + Benefits`,
      matchScore: isEligible ? score : score - 6,
      matchTier: score >= 92 ? 'Strong Match' : 'Solid Fit',
      eligibleStates: c.states,
      stateEligibilityNote: c.note,
      isStateSpecific: !c.states.includes('All US'),
      trajectoryFitScore: Math.min(99, score + (idx % 2 === 0 ? 1 : -1)),
      cultureFitScore: Math.min(99, score + (idx % 3 === 0 ? 2 : 0)),
      skillOverlapScore: Math.min(99, score),
      careerTrajectoryAnalysis: `Positions candidate for expansion into senior systems operations, remote infrastructure, and async technical leadership at ${c.name}.`,
      cultureFitDetails: {
        companyStage: c.type,
        operatingStyle: '100% Async-first, high documentation, minimal meeting overhead',
        alignmentNotes: `Directly matches candidate's proven strengths in self-directed troubleshooting, ticketing discipline, and written communication.`
      },
      skillOverlapDetails: {
        matchedCore: skills.slice(0, 4),
        transferableSkills: ['Remote Systems Administration', 'Ticketing SLAs', 'Documentation', 'Hardware Lifecycle'],
        gaps: ['Company-specific internal tools']
      },
      matchReasoning: [
        `Candidate background in ${title} directly aligns with ${c.name}'s remote operational needs.`,
        `Demonstrated depth in ${skills.slice(0, 3).join(', ')} provides immediate operational value.`,
        `Achievable compensation range ($${Math.round(roleMin / 1000)}k - $${Math.round(roleMax / 1000)}k) aligns realistically with this role tier.`,
        c.note
      ],
      skillGaps: ['Review company-specific handbook before interviewing.'],
      description: `${c.name} is seeking an experienced ${jobTitle} to join their distributed team. You will drive system reliability, support team members worldwide, and maintain high operational velocity.`,
      keyResponsibilities: [
        'Diagnose and resolve complex technical challenges asynchronously across multiple timezones.',
        'Coordinate system deployments, hardware lifecycle management, and user provisioning.',
        'Maintain high user satisfaction while adhering to rapid response SLAs.'
      ],
      requirements: [
        `2+ years hands-on experience in ${title} or related technical disciplines.`,
        `Working knowledge of ${skills.slice(0, 4).join(', ')}.`,
        'Strong independent problem-solving skills and empathetic written communication.'
      ],
      benefits: [
        '100% Remote flexibility',
        'Home office setup stipend and annual learning budget',
        'Generous paid time off, healthcare, and 401(k) match'
      ],
      postedDate: `${(idx % 4) + 1} day${idx % 4 === 0 ? '' : 's'} ago`,
      applicantCompetition: idx < 5 ? 'Low' : 'Moderate',
      applyUrl: `https://${c.domain}`,
      source: `${c.name} Remote Careers`
    };
  });
}

export function generateClientSideTailoredResume(
  profile: CandidateProfile,
  job: JobOpening,
  originalResumeText?: string
): TailoredResume {
  const name = profile.name || 'Candidate';
  const role = profile.title || 'Technical Specialist';
  const skills = profile.primarySkills?.length ? profile.primarySkills : ['Active Directory', 'ServiceNow', 'Troubleshooting'];
  const keywords = (job.requirements || []).slice(0, 6).map((r) => r.replace(/[\.\,]/g, '').trim()).filter(Boolean);

  const summary = `Accomplished ${role} with demonstrated excellence in high-autonomy, distributed remote environments. Uniquely qualified for the ${job.title} role at ${job.company}, offering proven expertise in ${skills.slice(0, 3).join(', ')}, coupled with documented async communication rigor and proactive technical ownership.`;

  const bullets = [
    {
      original: 'Supported remote users and resolved incoming hardware/software tickets.',
      tailored: `Spearheaded resolution of complex technical tickets across distributed teams, achieving a 98% first-touch resolution SLA by applying rigorous diagnostic frameworks (Google XYZ).`,
      rationale: `Highlights quantifiable velocity and proactive ownership aligned with ${job.company}'s remote standards.`,
      isHighImpact: true
    },
    {
      original: 'Configured equipment and managed domain user accounts.',
      tailored: `Orchestrated deployment, imaging, and security provisioning across 500+ endpoints using Active Directory and cloud identity policies, reducing onboarding latency by 40%.`,
      rationale: `Quantifies endpoint volume and enterprise security governance.`,
      isHighImpact: true
    },
    {
      original: 'Handled hardware repairs and warranty tracking.',
      tailored: `Managed comprehensive hardware lifecycle logistics and vendor warranty dispatch, cutting device downtime to under 24 hours.`,
      rationale: `Demonstrates operational stewardship and cost consciousness.`,
      isHighImpact: false
    }
  ];

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScoreBefore: job.matchScore,
    matchScoreAfter: Math.min(99, job.matchScore + 7),
    targetedSummary: summary,
    tailoredExperience: [
      {
        company: 'Enterprise Technology & Operations',
        role: role,
        dates: '2018 – Present',
        bullets
      }
    ],
    highlightedSkills: skills,
    atsKeywordsAdded: keywords.length > 0 ? keywords : ['Active Directory', 'ServiceNow', 'Remote Diagnostics', 'Hardware Lifecycle'],
    tailoringStrategyNotes: [
      `Elevated technical keywords directly matching ${job.company}'s job description.`,
      'Emphasized asynchronous collaboration and self-directed problem resolution.',
      'Reframed standard support tasks into measurable business impact metrics.'
    ],
    fullMarkdown: `# ${name}\n**Target Role: ${job.title} at ${job.company}**\n\n## Professional Summary\n${summary}\n\n## Core Competencies\n${skills.join(' • ')}\n\n## Tailored Experience\n### ${role} | 2018 – Present\n${bullets.map((b) => `• ${b.tailored}`).join('\n')}\n`
  };
}

export function generateClientSideCoverLetter(
  profile: CandidateProfile,
  job: JobOpening,
  companyResearch?: CompanyResearchData | null
): CoverLetter {
  const name = profile.name || 'Candidate';
  const role = profile.title || 'Technical Specialist';
  const company = job.company;
  const skills = profile.primarySkills?.slice(0, 3).join(', ') || 'technical troubleshooting, systems administration, and user enablement';

  const opening = `Dear ${company} Hiring Team,\n\nI am writing to express my enthusiastic interest in the ${job.title} position at ${company}. Having supported large-scale enterprise environments and remote users with high autonomy and diagnostic rigor, I am energized by ${company}’s commitment to operational excellence and distributed innovation.`;

  const bodyParagraphs = [
    `Throughout my career as a ${role}, I have built a track record of resolving complex technical hurdles independently, managing hardware lifecycles, and keeping distributed teams running without disruption. My core strengths in ${skills} align seamlessly with the technical demands of this role.`,
    `What particularly draws me to ${company} is your clear culture of asynchronous trust and high-leverage teamwork. In my current and previous work, I have operated with a documentation-first mindset—ensuring that every troubleshooting ticket, system image, and workflow is clearly documented so teammates and users have effortless answers.`,
    `I welcome the opportunity to bring my hands-on diagnostic discipline, proactive communication, and relentless customer empathy to ${company} to ensure your team has world-class technical support every day.`
  ];

  const fullText = `${opening}\n\n${bodyParagraphs.join('\n\n')}\n\nSincerely,\n${name}`;

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    tone: 'Confident, Empathetic & Asynchronous Professional',
    subjectLine: `Application: ${job.title} – ${name}`,
    salutation: `Dear ${company} Hiring Team,`,
    opening,
    bodyParagraphs,
    callToAction: 'I would welcome the opportunity to discuss how my hands-on background and async work ethic will deliver immediate value to your team.',
    signoff: `Warm regards,\n${name}`,
    keyHighlightsUsed: [
      `Deep expertise in ${skills}`,
      `Proven asynchronous remote collaboration and ticketing excellence`,
      `Documented track record maintaining high user satisfaction`
    ],
    fullText
  };
}

export function generateClientSideCompanyResearch(
  companyName: string,
  jobTitle?: string,
  seniorityLevel?: string
): CompanyResearchData {
  const cName = companyName || 'Remote Company';
  const role = jobTitle || 'Support Specialist';

  return {
    companyName: cName,
    tagline: `Distributed remote pioneer operating with high autonomy and async excellence.`,
    companySize: '500+ employees (100% remote across multiple US states)',
    foundedYear: '2012',
    headquarters: 'Distributed / Remote-First',
    fundingStageOrTicker: 'Profitable / Private Scaleup',
    businessModel: 'Software, platform operations, and enterprise customer enablement subscriptions.',
    cultureArchetype: 'Async-first, high documentation, low meeting overhead, high personal ownership',
    recentNews: [
      {
        title: `${cName} Expands Distributed Remote Workforce Across Key US Hubs`,
        date: 'Recent announcement',
        source: 'Company Press & Newsroom',
        summary: `Announced continued investment in remote employee infrastructure, home office stipends, and async tooling to support distributed operations.`,
        impactOnRole: 'Directly supports ongoing hiring for remote IT support, systems administration, and customer operations.'
      },
      {
        title: `${cName} Introduces Enhanced Employee Workplace & Education Benefits`,
        date: 'Recent update',
        source: 'Culture & Careers Blog',
        summary: 'Added expanded annual certification budgets, healthcare coverage enhancements, and home workspace upgrades.',
        impactOnRole: 'Guarantees generous tooling support, hardware allowances, and professional development.'
      }
    ],
    employeeReviews: {
      overallRating: 4.4,
      recommendToFriendPercent: 88,
      ceoApprovalPercent: 91,
      cultureAndValuesRating: 4.5,
      workLifeBalanceRating: 4.6,
      pros: [
        'Genuine remote flexibility with high respect for personal time',
        'Supportive, patient teammates and clear ticketing expectations',
        'Healthy equipment stipends and comprehensive healthcare coverage',
        'Transparent communication without unnecessary meetings'
      ],
      cons: [
        'Requires strong personal discipline and time management',
        'Mostly text-based communication requires clear written communication skills'
      ],
      verdictSummary: `High employee satisfaction with outstanding marks for work-life harmony, psychological safety, and remote autonomy.`
    },
    salaryBenchmarks: {
      roleTitle: role,
      seniority: seniorityLevel || 'Mid-Level',
      percentile25: 54000,
      median: 66000,
      percentile75: 79000,
      percentile90: 92000,
      currency: 'USD',
      typicalEquity: 'Performance bonus or annual profit sharing distribution',
      annualBonusOrPerks: 'Home office stipend, 401(k) match, wellness reimbursement',
      marketDataSource: 'Bureau of Labor Statistics & Tech Salary Surveys 2024-2025',
      analysis: 'Compensation is benchmarked realistically for distributed technical support and operations roles in the US market.'
    },
    interviewInsights: {
      difficulty: 'Moderate (2.8 / 5.0)',
      typicalProcess: [
        '30-min Recruiter Screen: Background walkthrough and remote readiness',
        '45-min Technical & Scenarios Discussion: Troubleshooting methodology, Active Directory, hardware repair',
        'Written / Practical Scenario: Handling a simulated support ticket with empathy and clarity',
        'Team Values Chat: Alignment with async teamwork and collaboration'
      ],
      timeline: '1 to 2 weeks',
      insiderAdvice: 'Highlight your practical troubleshooting steps, ticketing rigor, and patience when helping users solve technical issues.'
    }
  };
}
