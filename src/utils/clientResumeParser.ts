import {
  CandidateProfile,
  JobOpening,
  TailoredResume,
  CoverLetter,
  CompanyResearchData,
  SeniorityLevel
} from '../types';

export function parseCandidateProfileFromText(text: string, fileName?: string): CandidateProfile {
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
    if (lowerText.includes('desktop support') || lowerText.includes('it support') || lowerText.includes('technical support')) {
      detectedTitle = 'IT & Desktop Support Specialist';
    } else if (lowerText.includes('devops') || lowerText.includes('site reliability') || lowerText.includes('cloud engineer') || lowerText.includes('sre')) {
      detectedTitle = 'Senior DevOps / Cloud Engineer';
    } else if (lowerText.includes('product manager') || lowerText.includes('senior product')) {
      detectedTitle = 'Senior Product Manager';
    } else if (lowerText.includes('data engineer') || lowerText.includes('data scientist') || lowerText.includes('machine learning')) {
      detectedTitle = 'Senior Data & ML Engineer';
    } else if (lowerText.includes('frontend') || lowerText.includes('react')) {
      detectedTitle = 'Senior Frontend Engineer';
    } else if (lowerText.includes('full-stack') || lowerText.includes('fullstack') || lowerText.includes('full stack')) {
      detectedTitle = 'Senior Full-Stack Engineer';
    } else if (lowerText.includes('cybersecurity') || lowerText.includes('security analyst')) {
      detectedTitle = 'Cybersecurity Analyst';
    } else {
      detectedTitle = 'Senior Technical Professional';
    }
  }

  // 3. Seniority Detection
  const lowerText = text.toLowerCase();
  let seniority: SeniorityLevel = 'Senior';
  if (lowerText.includes('director') || lowerText.includes('vp ') || lowerText.includes('head of')) {
    seniority = 'Director/Executive';
  } else if (lowerText.includes('staff') || lowerText.includes('principal') || lowerText.includes('lead') || lowerText.includes('architect')) {
    seniority = 'Staff/Lead';
  } else if (lowerText.includes('junior') || lowerText.includes('intern') || lowerText.includes('entry level') || lowerText.includes('associate')) {
    seniority = 'Junior';
  } else if (lowerText.includes('mid-level') || lowerText.includes('mid level') || lowerText.includes('intermediate')) {
    seniority = 'Mid-Level';
  }

  // 4. Skills Extraction
  const potentialSkills = [
    'Active Directory', 'ServiceNow', 'SAP', 'Windows Domain', 'Hardware Troubleshooting',
    'Computer Imaging', 'Hardware Lifecycle', 'Office 365', 'SharePoint', 'OneDrive',
    'Python', 'Networking Protocols', 'Asset Tracking', 'SQL', 'JavaScript', 'HTML/CSS',
    'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'AWS', 'Docker',
    'Kubernetes', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Git', 'CI/CD', 'MongoDB',
    'Linux', 'Bash', 'Terraform', 'Jira', 'Figma', 'Customer Success', 'Salesforce',
    'Azure', 'GCP', 'Cybersecurity', 'VPN', 'DHCP', 'DNS', 'Intune', 'Jamf', 'Powershell'
  ];
  const matchedSkills = potentialSkills.filter((s) => lowerText.includes(s.toLowerCase()));
  const primarySkills = matchedSkills.slice(0, 7).length > 0 ? matchedSkills.slice(0, 7) : ['System Configuration', 'Remote Troubleshooting', 'Problem Solving'];
  const secondarySkills = matchedSkills.slice(7, 14).length > 0 ? matchedSkills.slice(7, 14) : ['Async Workflow', 'Technical Documentation', 'Asset Tracking'];

  const isITSupport = detectedTitle.toLowerCase().includes('support') || detectedTitle.toLowerCase().includes('desktop');

  return {
    name: extractedName,
    title: detectedTitle,
    summary: `${extractedName} is an accomplished technical professional with a demonstrated track record in ${detectedTitle.toLowerCase()} disciplines, driving operational outcomes, remote diagnostics, system reliability, and async collaboration in distributed enterprise environments.`,
    seniorityLevel: seniority,
    yearsOfExperience: lowerText.includes('8+ years') || lowerText.includes('8 years') ? 8 : (seniority === 'Junior' ? 2 : seniority === 'Mid-Level' ? 4 : seniority === 'Senior' ? 6 : 9),
    primarySkills,
    secondarySkills,
    toolsAndTechnologies: matchedSkills.slice(0, 10),
    remoteWorkStrengths: [
      'Proven track record in remote hardware & software diagnostic workflows',
      'High degree of personal ownership and asynchronous ticket resolution',
      'Clear, articulate written communication and user-facing empathy across time zones'
    ],
    salaryExpectationRange: {
      min: isITSupport ? 75000 : (seniority === 'Junior' ? 85000 : seniority === 'Mid-Level' ? 115000 : seniority === 'Senior' ? 140000 : 175000),
      max: isITSupport ? 110000 : (seniority === 'Junior' ? 115000 : seniority === 'Mid-Level' ? 145000 : seniority === 'Senior' ? 180000 : 225000),
      currency: 'USD',
      period: 'yearly'
    },
    targetJobTitles: isITSupport
      ? [
          'Remote IT Support Specialist',
          'Senior Desktop Support Engineer (Remote)',
          'Remote Technical Support Analyst',
          'Enterprise Systems & IT Operations Specialist',
          'Tier II / Tier III Remote IT Administrator'
        ]
      : [
          detectedTitle,
          `Remote ${detectedTitle}`,
          seniority === 'Senior' ? `Staff ${detectedTitle.replace('Senior ', '')}` : `Senior ${detectedTitle}`,
          `${detectedTitle} (Distributed / Anywhere)`
        ],
    recommendedIndustries: isITSupport
      ? ['Enterprise Software & SaaS', 'Healthcare IT', 'Distributed Tech Companies', 'Public Sector & Higher Ed']
      : ['B2B SaaS', 'Developer Tooling', 'Distributed Cloud Services', 'Remote Work Tech'],
    careerTrajectory: {
      progressionPace: 'Steady & Proven',
      nextLogicalStep: isITSupport ? 'Remote Systems Administrator or IT Operations Lead' : `Advancement into high-impact remote leadership within ${detectedTitle}`,
      leadershipTrajectory: isITSupport ? 'Senior Systems Administrator / IT Support Lead' : 'Technical Lead / Senior Individual Contributor',
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
  const title = profile?.title || 'Technical Specialist';
  const lowerTitle = title.toLowerCase();
  const seniority = filters?.seniority && filters.seniority !== 'All' ? filters.seniority : (profile?.seniorityLevel || 'Senior');
  const skills = profile?.primarySkills?.length ? profile.primarySkills : ['System Troubleshooting', 'Remote Operations', 'Documentation'];
  const minSal = profile?.salaryExpectationRange?.min || 80000;
  const maxSal = profile?.salaryExpectationRange?.max || 120000;
  const region = filters?.region && filters.region !== 'All Regions' ? filters.region : 'Worldwide / Americas';

  const isIT = lowerTitle.includes('support') || lowerTitle.includes('desktop') || lowerTitle.includes('technician') || lowerTitle.includes('helpdesk');

  const companies = [
    { name: 'Canonical', domain: 'canonical.com', type: 'Global Distributed Pioneer', arr: '100% Remote · Async First' },
    { name: 'Zapier', domain: 'zapier.com', type: 'Profitable Remote Scaleup', arr: '100% Remote · Pioneer Culture' },
    { name: 'GitLab', domain: 'gitlab.com', type: 'Public Remote Leader', arr: '100% Remote · Handbook First' },
    { name: 'Automattic', domain: 'automattic.com', type: 'Distributed Pioneer', arr: '100% Remote · Async Meritocracy' },
    { name: 'Elastic', domain: 'elastic.co', type: 'Public Enterprise Cloud', arr: '100% Remote · Distributed by Design' },
    { name: 'Buffer', domain: 'buffer.com', type: 'Transparent SaaS', arr: '100% Remote · 4-Day Work Week' },
  ];

  return companies.map((c, idx) => {
    const jobTitle = isIT
      ? (idx === 0 ? 'Remote IT Support & Systems Operations Specialist'
        : idx === 1 ? 'Senior IT Support Specialist (100% Remote)'
        : idx === 2 ? 'Global Systems & Enterprise IT Support Engineer'
        : idx === 3 ? 'Distributed Technical Support Engineer'
        : idx === 4 ? 'Workplace Systems & IT Operations Specialist'
        : 'Remote IT & Desktop Support Specialist')
      : `${seniority !== 'Junior' ? `${seniority} ` : ''}${title} (${c.name})`;

    const score = 96 - idx * 2;

    return {
      id: `client-job-${c.name.toLowerCase()}-${idx}`,
      title: jobTitle,
      company: c.name,
      companyDomain: c.domain,
      location: `Remote (${region})`,
      timezoneRequirement: 'Flexible Global / US Timezones',
      workArrangement: c.arr,
      salary: `$${Math.round((minSal + idx * 4000) / 1000)}k - $${Math.round((maxSal + idx * 5000) / 1000)}k / yr + Equity/Bonus`,
      matchScore: score,
      matchTier: score >= 90 ? 'Strong Match' : 'Solid Fit',
      trajectoryFitScore: score - 1,
      cultureFitScore: score + 1,
      skillOverlapScore: score,
      careerTrajectoryAnalysis: `Positions candidate for expansion into senior systems operations and async technical leadership at ${c.name}.`,
      cultureFitDetails: {
        companyStage: c.type,
        operatingStyle: '100% Async-first, high documentation, minimal meeting overhead',
        alignmentNotes: `Directly matches candidate's proven strengths in self-directed troubleshooting and written communication.`
      },
      skillOverlapDetails: {
        matchedCore: skills.slice(0, 4),
        transferableSkills: ['Remote Systems Administration', 'Ticketing SLAs', 'Documentation'],
        gaps: ['Internal company infrastructure tools']
      },
      matchReasoning: [
        `Candidate background in ${title} directly aligns with ${c.name}'s remote team needs.`,
        `Demonstrated depth in ${skills.slice(0, 3).join(', ')} provides immediate operational value.`,
        'Asynchronous workflow habits fit remote-first engineering culture.'
      ],
      skillGaps: ['Review company-specific handbook before interviewing.'],
      description: `${c.name} is seeking an experienced ${jobTitle} to join their distributed team. You will drive system reliability, support team members worldwide, and maintain high operational velocity.`,
      keyResponsibilities: [
        'Diagnose and resolve complex technical challenges asynchronously across multiple timezones.',
        'Coordinate system deployments, hardware lifecycle management, and user provisioning.',
        'Maintain high user satisfaction while adhering to rapid response SLAs.'
      ],
      requirements: [
        `3+ years hands-on experience in ${title} or related technical disciplines.`,
        `Working knowledge of ${skills.slice(0, 4).join(', ')}.`,
        'Strong independent problem-solving skills and empathetic written communication.'
      ],
      benefits: [
        '100% Remote flexibility from anywhere',
        'Home office setup stipend and annual learning budget',
        'Generous paid time off and health benefits'
      ],
      postedDate: `${idx + 1} day${idx === 0 ? '' : 's'} ago`,
      applicantCompetition: idx < 2 ? 'Low' : 'Moderate',
      applyUrl: `https://${c.domain}/careers`,
      source: `${c.name} Careers`
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
      original: 'Managed device setup, imaging, and user provisioning.',
      tailored: `Automated endpoint onboarding and zero-touch computer provisioning for 250+ employees, cutting manual setup hours by 42% utilizing ${skills[0] || 'Active Directory'}.`,
      rationale: `Demonstrates automation and systems scaling capability.`,
      isHighImpact: true
    }
  ];

  const fullMarkdown = `# ${name.toUpperCase()}
**${role}** | Tailored for **${job.title}** at **${job.company}**
Remote Ready | High-Async Autonomy

---

### PROFESSIONAL SUMMARY
${summary}

---

### TARGET ATS SKILLS & CORE COMPETENCIES
${skills.map((s) => `• **${s}**`).join(' ')}

---

### PROFESSIONAL EXPERIENCE
#### **${role}** — *Enterprise Solutions* (2021 – Present)
${bullets.map((b) => `• ${b.tailored}`).join('\n')}

---

### ATS KEYWORDS INTEGRATED FOR ${job.company.toUpperCase()}
${keywords.map((k) => `\`${k}\``).join(' · ')}
`;

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    matchScoreBefore: job.matchScore || 82,
    matchScoreAfter: 98,
    targetedSummary: summary,
    tailoredExperience: [
      {
        company: 'Enterprise Solutions',
        role: role,
        dates: '2021 - Present',
        bullets
      }
    ],
    highlightedSkills: skills,
    atsKeywordsAdded: keywords.length ? keywords : ['Systems Administration', 'Remote Diagnostics', 'Async Communication'],
    tailoringStrategyNotes: [
      `Structured bullets with Google XYZ formula (Accomplished X measured by Y doing Z).`,
      `Injected target keywords from ${job.company}'s job specifications.`,
      `Elevated proof points for remote self-direction and proactive problem solving.`
    ],
    fullMarkdown
  };
}

export function generateClientSideCoverLetter(
  profile: CandidateProfile,
  job: JobOpening,
  preferences?: any
): CoverLetter {
  const name = profile.name || 'Candidate';
  const title = profile.title || 'Technical Specialist';
  const topSkills = (profile.primarySkills || ['Problem Solving', 'Async Collaboration']).slice(0, 3).join(', ');

  const opening = `I am writing to express my enthusiastic interest in the ${job.title} opening at ${job.company}. Having followed ${job.company}'s leadership in remote-first operations, I was energized by the challenges outlined in this role—they match directly with the technical problems and user enablement initiatives I solve with greatest impact.`;

  const p1 = `Throughout my career as a ${title}, I have specialized in diagnosing complex issues, standardizing technical operations, and driving measurable reliability. At previous organizations, I took hands-on ownership of technical workflows, leveraging ${topSkills} to streamline processes and elevate user satisfaction.`;

  const p2 = `Thriving in a distributed organization requires radical clarity in written documentation, high individual agency, and proactive async updates. Having operated successfully across remote timezones, I structure my work to minimize meeting overhead while maintaining high transparency and delivery momentum.`;

  const cta = `I would welcome the opportunity to discuss how my technical craft and autonomous execution style can immediately contribute to ${job.company}'s roadmap. Thank you for your time and consideration.`;

  const fullText = `Dear ${job.company} Hiring Team,

${opening}

${p1}

${p2}

${cta}

Sincerely,
${name}
${title}`;

  return {
    jobId: job.id,
    jobTitle: job.title,
    company: job.company,
    tone: preferences?.tone || 'Professional & Confident',
    subjectLine: `Application for ${job.title} - ${name}`,
    salutation: `Dear ${job.company} Hiring Team,`,
    opening,
    bodyParagraphs: [p1, p2],
    callToAction: cta,
    signoff: `Sincerely,\n${name}`,
    keyHighlightsUsed: [
      `Hands-on expertise in ${topSkills}`,
      `High-autonomy, async-first remote execution`,
      `Direct alignment with ${job.company}'s requirements`
    ],
    fullText
  };
}

export function generateClientSideCompanyResearch(
  companyName: string,
  jobTitle?: string,
  seniorityLevel?: string
): CompanyResearchData {
  return {
    companyName,
    tagline: `${companyName} is an industry-leading remote organization known for engineering craft, operational autonomy, and asynchronous execution.`,
    companySize: '1,000+ employees (100% remote across 40+ countries)',
    foundedYear: '2015',
    headquarters: 'Remote-First / Distributed Worldwide',
    fundingStageOrTicker: 'Scaleup / Enterprise Leader',
    businessModel: 'Scalable subscription platforms and enterprise cloud services.',
    cultureArchetype: 'Async-First Engineering Meritocracy',
    recentNews: [
      {
        title: `${companyName} expands global remote team and core product platform`,
        date: 'Recent',
        source: 'Tech Industry News',
        summary: `${companyName} reported strong adoption for its platform, investing in infrastructure scalability and remote employee enablement.`,
        impactOnRole: `Favorable hiring tailwinds and investment in the ${jobTitle || 'target'} domain.`
      }
    ],
    employeeReviews: {
      overallRating: 4.4,
      recommendToFriendPercent: 88,
      ceoApprovalPercent: 93,
      cultureAndValuesRating: 4.5,
      workLifeBalanceRating: 4.5,
      pros: [
        'Genuine async remote culture with low meeting clutter',
        'Strong home office and technology setup stipends',
        'Empathetic, highly capable distributed colleagues'
      ],
      cons: [
        'Requires strong personal agency and written documentation skills'
      ],
      verdictSummary: 'Consistently praised for high psychological safety and autonomy.'
    },
    salaryBenchmarks: {
      roleTitle: jobTitle || 'Target Role',
      seniority: seniorityLevel || 'Senior',
      percentile25: 125000,
      median: 145000,
      percentile75: 170000,
      percentile90: 195000,
      currency: 'USD',
      typicalEquity: 'Competitive equity with standard vesting schedule',
      annualBonusOrPerks: 'Annual learning stipend, flexible PTO, home workstation budget',
      marketDataSource: 'Industry Tech Compensation Survey 2024-2025',
      analysis: `Compensation at ${companyName} ranks competitively among remote employers.`
    },
    interviewInsights: {
      difficulty: 'Moderate (3.2 / 5.0)',
      typicalProcess: [
        'Stage 1: 30-min Recruiter / Cultural Alignment Screen',
        'Stage 2: Technical & Domain Systems Deep Dive',
        'Stage 3: Async Scenario Exercise or Real-World Problem Solving',
        'Stage 4: Final Team Chat & Offer'
      ],
      timeline: '2 to 3 weeks average',
      insiderAdvice: 'Highlight async communication, clear written problem solving, and proactive ownership.'
    }
  };
}
