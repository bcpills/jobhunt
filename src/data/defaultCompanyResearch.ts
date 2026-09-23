import { CompanyResearchData } from '../types';

export const DEFAULT_COMPANY_RESEARCH: Record<string, CompanyResearchData> = {
  GitLab: {
    companyName: 'GitLab',
    tagline: 'The leading DevSecOps platform powered by a global 100% remote team.',
    companySize: '2,100+ employees (100% remote across 65+ countries)',
    foundedYear: '2014',
    headquarters: 'San Francisco, CA · 100% Remote-First (No Physical HQ)',
    fundingStageOrTicker: 'Public (NASDAQ: GTLB)',
    businessModel: 'B2B enterprise SaaS offering single-application DevSecOps platform subscriptions (Free, Premium, Ultimate).',
    cultureArchetype: 'Async-First Engineering Meritocracy & Radical Transparency',
    recentNews: [
      {
        title: 'GitLab Duo AI Generative Code Security & Automated Refactoring Suite Reaches General Availability',
        date: 'Recent release',
        source: 'GitLab Product Newsroom',
        summary: 'GitLab launched native AI-assisted code suggestions, automated vulnerability remediation, and test generation integrated directly into the core collaboration workflow.',
        impactOnRole: 'Directly accelerates investments into real-time code collaboration and editor experience engineering.'
      },
      {
        title: 'GitLab Reports 28% Year-over-Year Revenue Growth Fueled by Enterprise DevSecOps Consolidation',
        date: 'Latest earnings release',
        source: 'Wall Street Journal / Business Wire',
        summary: 'Strong financial performance driven by enterprise customers migrating legacy CI/CD toolchains to GitLab unified platform.',
        impactOnRole: 'Signals durable headcount stability, healthy compensation budgets, and strong equity upside.'
      },
      {
        title: 'GitLab Updates Public Handbook With Advanced Asynchronous Workflow Playbooks for Distributed Engineering',
        date: 'Recent update',
        source: 'GitLab Culture Blog',
        summary: 'Published refined operational guidelines for async communication, documented RFC decision trees, and handbook-first engineering practices.',
        impactOnRole: 'Shows strong alignment with candidates who excel in structured writing and autonomous time management.'
      }
    ],
    employeeReviews: {
      overallRating: 4.4,
      recommendToFriendPercent: 87,
      ceoApprovalPercent: 92,
      cultureAndValuesRating: 4.6,
      workLifeBalanceRating: 4.5,
      pros: [
        'Total autonomy over work schedule—no micromanagement or attendance monitoring',
        'Transparent public handbook means zero political games or hidden decisions',
        '$2,500+ home office stipend and generous annual learning & development budget',
        'Strong compensation formulas tied to location-adjusted market bands'
      ],
      cons: [
        'Async collaboration demands strong self-discipline and extensive reading/writing daily',
        'Cross-timezone pull request review cycles can span 24 to 48 hours',
        'Fast product expansion requires adapting to evolving team scopes'
      ],
      verdictSummary: 'One of the top-rated remote organizations in tech for engineers who thrive on deep work, documented communication, and autonomy.'
    },
    salaryBenchmarks: {
      roleTitle: 'Senior Frontend Engineer',
      seniority: 'Senior',
      percentile25: 148000,
      median: 168000,
      percentile75: 188000,
      percentile90: 210000,
      currency: 'USD',
      typicalEquity: '$30,000 - $60,000 / yr annualized RSU grants with standard 4-year vesting',
      annualBonusOrPerks: '100% premium coverage healthcare, $2,500 desk budget, unlimited PTO (min 25 days)',
      marketDataSource: 'Levels.fyi & Carta Remote Compensation Benchmark Index 2024-2025',
      analysis: 'The posted salary of $148,000 - $182,000 sits comfortably in the 50th to 75th percentile of US/Global senior frontend engineering bands.'
    },
    interviewInsights: {
      difficulty: 'Moderate (3.3 / 5.0)',
      typicalProcess: [
        '30-min Recruiter Screen: Remote work fit, salary expectations, async readiness',
        '60-min Technical Architecture: Frontend system design, web performance, and state patterns',
        'Take-Home Async Review / Merge Request: Real-world asynchronous code review and RFC feedback',
        '45-min Values & Manager Interview: Collaboration, handling ambiguities, and culture alignment'
      ],
      timeline: '2 to 3 weeks from initial application to final offer letter',
      insiderAdvice: 'Read their public handbook before interviewing. Emphasize how you write RFCs, document architectural trade-offs, and conduct thoughtful PR reviews.'
    }
  },
  Supabase: {
    companyName: 'Supabase',
    tagline: 'The open-source Firebase alternative built on PostgreSQL.',
    companySize: '160+ employees (100% remote across 30+ countries)',
    foundedYear: '2020',
    headquarters: 'Singapore / San Francisco · Distributed Remote',
    fundingStageOrTicker: 'Series B ($116M raised, backed by Coatue, Lightspeed, Y Combinator)',
    businessModel: 'Developer cloud platform providing managed PostgreSQL, Auth, Realtime, Storage, and Edge Functions with developer-friendly usage tiers.',
    cultureArchetype: 'High-Velocity Open-Source Builder Culture',
    recentNews: [
      {
        title: 'Supabase Announces GA for Next-Gen Realtime Engine and Vector Search Upgrades',
        date: 'Recent Launch Week',
        source: 'Supabase Blog / Hacker News',
        summary: 'Major platform release introducing sub-10ms broadcast latency, pgvector AI integrations, and expanded Edge Function capabilities.',
        impactOnRole: 'Expands the scope of dashboard engineering for real-time monitoring and database telemetry tools.'
      },
      {
        title: 'Supabase Surpasses 1 Million Databases Created on Managed Cloud Platform',
        date: 'Recent milestone',
        source: 'TechCrunch',
        summary: 'Rapid adoption across both independent developers and enterprise engineering teams moving off proprietary clouds.',
        impactOnRole: 'Signals explosive platform growth, high hiring demand, and meaningful equity upside.'
      },
      {
        title: 'Community Contribution Velocity Doubled Following Open-Source Hackathon Series',
        date: 'Recent community event',
        source: 'Supabase GitHub News',
        summary: 'Massive influx of community pull requests and ecosystem extensions across TypeScript and Next.js libraries.',
        impactOnRole: 'Offers candidates chances to ship code directly in public open-source repositories.'
      }
    ],
    employeeReviews: {
      overallRating: 4.6,
      recommendToFriendPercent: 91,
      ceoApprovalPercent: 96,
      cultureAndValuesRating: 4.8,
      workLifeBalanceRating: 4.3,
      pros: [
        'Ship high-impact open-source software loved by tens of thousands of software developers daily',
        'Flat organizational hierarchy with immense autonomy for individual contributors',
        'High-energy "Launch Week" culture with rapid shipping rhythm',
        'Top-tier hardware setup (latest Apple Silicon MacBooks) and competitive token/equity grants'
      ],
      cons: [
        'Launch weeks can be fast-paced and require concentrated effort',
        'Less formal corporate process—requires comfortable navigation of ambiguity',
        'High public scrutiny given open-source GitHub visibility'
      ],
      verdictSummary: 'Dream workplace for builder-engineers who love developer tooling, open-source communities, and shipping fast without bureaucracy.'
    },
    salaryBenchmarks: {
      roleTitle: 'Full-Stack Software Engineer',
      seniority: 'Mid-Senior',
      percentile25: 135000,
      median: 155000,
      percentile75: 175000,
      percentile90: 195000,
      currency: 'USD',
      typicalEquity: 'Significant early-growth equity / token grant with substantial multiple potential',
      annualBonusOrPerks: 'Comprehensive international health benefits, flexible time off, annual in-person retreats',
      marketDataSource: 'Comprehensive Startup Tech Comp Index (YC / Carta Benchmark)',
      analysis: 'The posted salary of $140,000 - $170,000 + Equity aligns with the 60th to 80th percentile for tier-1 venture-backed developer infrastructure startups.'
    },
    interviewInsights: {
      difficulty: 'Moderate to High (3.5 / 5.0)',
      typicalProcess: [
        '30-min Founder or Engineering Lead Chat: Developer ethos, past open-source or SaaS projects',
        'Practical Technical Task: Real-world Next.js/React & SQL problem solving',
        'Pair Programming Session: Collaborative debugging or architectural extension',
        'Final Team Fit: Product sensibility and communication style'
      ],
      timeline: '1 to 2 weeks (very fast hiring turnaround)',
      insiderAdvice: 'Build a small demo or deploy something using Supabase before your interview. Showing authentic passion for developer experience carries immense weight.'
    }
  },
  Buffer: {
    companyName: 'Buffer',
    tagline: 'The pioneer of transparent remote work and the 4-day workweek.',
    companySize: '85+ employees (100% remote across 20+ countries)',
    foundedYear: '2010',
    headquarters: 'Remote-First (100% Distributed since 2012)',
    fundingStageOrTicker: 'Profitable & Independent ($4M early funding, founder-led)',
    businessModel: 'Profitable SaaS providing social media publishing, campaign analytics, and organic engagement tools for creators and SMBs.',
    cultureArchetype: 'Radical Transparency, 4-Day Workweek & Sustainable Growth',
    recentNews: [
      {
        title: 'Buffer Marks 4th Successful Year of Operating on a Permanent 4-Day Workweek',
        date: 'Recent retrospective',
        source: 'Buffer Open Culture Blog',
        summary: 'Data reveals sustained employee retention, zero drop in product shipping velocity, and record team happiness scores.',
        impactOnRole: 'Guarantees a permanent 32-hour work schedule with 100% full-time compensation.'
      },
      {
        title: 'Buffer Unveils AI Content Assistant to Power 150,000 Small Business Workflows',
        date: 'Product announcement',
        source: 'TechCrunch / Buffer Blog',
        summary: 'Integrated generative AI captioning and content repurposing directly into social scheduling pipelines.',
        impactOnRole: 'Opportunities to work on modern React interfaces and generative content workflows.'
      },
      {
        title: 'Buffer Publishes 2024 Remote Work Compensation and Salary Formula Update',
        date: 'Annual release',
        source: 'Buffer Open Salaries',
        summary: 'Refreshed public transparent salary formula benchmarking global tech living costs and role tiers.',
        impactOnRole: 'Complete salary transparency with zero stressful negotiation required.'
      }
    ],
    employeeReviews: {
      overallRating: 4.7,
      recommendToFriendPercent: 94,
      ceoApprovalPercent: 97,
      cultureAndValuesRating: 4.9,
      workLifeBalanceRating: 4.9,
      pros: [
        'Genuine 4-day workweek (Fridays off) with zero guilt and full-time pay',
        'Radical transparency—salaries, revenue, and strategy are openly published',
        '$3,000 annual working remotely stipend and $1,000 annual learning budget',
        '16 weeks fully paid family leave for all parents globally'
      ],
      cons: [
        'Compressed 32-hour week requires ruthless prioritization and clear boundaries',
        'Small, steady team means fewer rapid managerial promotion ladders',
        'High volume of applications for every open seat'
      ],
      verdictSummary: 'Gold standard for work-life harmony and authentic remote culture in the global tech ecosystem.'
    },
    salaryBenchmarks: {
      roleTitle: 'Senior Frontend Engineer',
      seniority: 'Senior',
      percentile25: 130000,
      median: 148000,
      percentile75: 165000,
      percentile90: 178000,
      currency: 'USD',
      typicalEquity: 'Transparent profit-sharing formula + stock option allocation',
      annualBonusOrPerks: '32-hour workweek, $3k remote stipend, international health insurance',
      marketDataSource: 'Buffer Transparent Public Salary Database & Levels.fyi',
      analysis: 'Posted compensation of $135,000 - $160,000 reflects top-tier compensation when evaluated on an hourly/effective rate (32 hrs/week).'
    },
    interviewInsights: {
      difficulty: 'Moderate (3.1 / 5.0)',
      typicalProcess: [
        'Culture & Written Alignment: Evaluating async communication and values',
        'Technical Walkthrough: Deep-dive into past frontend projects and architecture',
        'Take-Home Practical Task: Realistic React/GraphQL implementation with async notes',
        'Final Conversational Chat: Long-term mutual fit'
      ],
      timeline: '2 to 3 weeks',
      insiderAdvice: 'Show your empathy, self-awareness, and intentional remote work habits. Buffer cares deeply about how you collaborate and manage your focus.'
    }
  },
  Zapier: {
    companyName: 'Zapier',
    tagline: 'The world leader in no-code workflow automation connecting 6,000+ apps.',
    companySize: '1,200+ employees (100% remote across 35+ countries)',
    foundedYear: '2011',
    headquarters: 'Sunnyvale, CA · 100% Distributed since Day One',
    fundingStageOrTicker: 'Profitable Scaleup ($5B+ private valuation, backed by Sequoia & Bessemer)',
    businessModel: 'B2B freemium automation platform connecting thousands of SaaS apps via triggers, actions, and AI agents.',
    cultureArchetype: 'Documentation-First Remote Pioneer with Enterprise Scale',
    recentNews: [
      {
        title: 'Zapier Launches Zapier Central and AI Actions for Enterprise Automation',
        date: 'Recent release',
        source: 'Forbes / Zapier Press',
        summary: 'Introduced autonomous AI agents capable of triggering multi-app workflows based on natural language instructions.',
        impactOnRole: 'Drives engineering demand for scalable integration pipelines and real-time event streaming.'
      },
      {
        title: 'Zapier Surpasses $250M ARR Driven by Rapid Enterprise Adoption',
        date: 'Financial milestone',
        source: 'TechCrunch',
        summary: 'Continues exceptional profitability and cash flow generation without traditional venture dependency.',
        impactOnRole: 'Unmatched job security and healthy annual equity liquidity events.'
      },
      {
        title: 'Zapier Annual Company Retreat Brings 1,200 Remote Team Members Together',
        date: 'Recent event',
        source: 'Zapier Life Blog',
        summary: 'Bi-annual all-expenses-paid global team retreat fostering cross-team connection and hackathons.',
        impactOnRole: 'Combines the best of full-time remote freedom with high-touch in-person camaraderie.'
      }
    ],
    employeeReviews: {
      overallRating: 4.5,
      recommendToFriendPercent: 89,
      ceoApprovalPercent: 94,
      cultureAndValuesRating: 4.7,
      workLifeBalanceRating: 4.6,
      pros: [
        'Built for remote from day one in 2011—zero friction or second-class remote citizen feeling',
        'Two all-expenses-paid global retreats per year',
        '401(k) with 4% company match and generous technology allowances',
        'Empathetic, mature management culture with explicit focus on mental health'
      ],
      cons: [
        'Large scale means more alignment required across product divisions',
        'Extensive documentation (Slack, Async, internal wikis) can feel like information overload',
        'US timezone alignment preferred for certain team pods'
      ],
      verdictSummary: 'Exceptional destination for engineers looking for remote maturity, profitability, and deep technical scale.'
    },
    salaryBenchmarks: {
      roleTitle: 'Full-Stack Engineer',
      seniority: 'Senior',
      percentile25: 140000,
      median: 160000,
      percentile75: 178000,
      percentile90: 198000,
      currency: 'USD',
      typicalEquity: 'High-value private equity grants with established company-sponsored liquidity programs',
      annualBonusOrPerks: '4% 401(k) match, 2 company retreats/year, $2,000+ tech budget',
      marketDataSource: 'Levels.fyi & Radford High-Growth Tech Survey',
      analysis: 'Posted salary range of $142,000 - $175,000 is competitive with tier-1 US remote SaaS companies.'
    },
    interviewInsights: {
      difficulty: 'Moderate (3.2 / 5.0)',
      typicalProcess: [
        'Recruiter Screen: Career journey and remote alignment',
        'Hiring Manager Screen: Past engineering decisions and collaboration style',
        'Paid Technical Work Sample: Real-world, asynchronous programming task reflecting actual Zapier tickets',
        'Final Team & Culture Chat: Cross-functional communication'
      ],
      timeline: '2 to 3 weeks',
      insiderAdvice: 'Zapier places heavy weight on your written communication in their paid work sample. Write clear commit messages and explain your architectural trade-offs clearly.'
    }
  },
  Automattic: {
    companyName: 'Automattic',
    tagline: 'The distributed creators behind WordPress.com, WooCommerce, and Tumblr.',
    companySize: '2,000+ employees (100% remote across 90+ countries)',
    foundedYear: '2005',
    headquarters: 'Remote-First (Distributed across 90+ countries with no physical offices)',
    fundingStageOrTicker: 'Late-Stage Scaleup ($7.5B valuation, backed by Salesforce Ventures & Insight)',
    businessModel: 'Open web ecosystem generating subscription and transactional commerce revenue across WordPress.com, VIP, WooCommerce, Tumblr, and Day One.',
    cultureArchetype: 'Radical Autonomy & Creed of the Open Web',
    recentNews: [
      {
        title: 'WordPress Powers Over 43% of All Websites Worldwide as Open Web Initiative Expands',
        date: 'Industry report',
        source: 'W3Techs / WordPress.org',
        summary: 'Automattic continues to lead core open-source contributions, expanding editor capabilities and web performance standards.',
        impactOnRole: 'Directly impacts millions of publishers and site owners worldwide.'
      },
      {
        title: 'WooCommerce Integrates Next-Gen Merchant AI Tools for Autonomous Store Management',
        date: 'Product launch',
        source: 'Automattic Press',
        summary: 'Rollout of intelligent product descriptions, automated inventory suggestions, and multi-currency checkout.',
        impactOnRole: 'Expands the scope of modern React/TypeScript frontend engineering.'
      },
      {
        title: 'Automattic Expands 3-Month Paid Sabbatical Program for 5-Year Tenured Employees',
        date: 'Company announcement',
        source: 'Automattic Culture',
        summary: 'Reaffirmed commitment to long-term employee sustainability, offering 3 consecutive months of fully paid leave every 5 years.',
        impactOnRole: 'Unmatched long-term career sustainability and retention.'
      }
    ],
    employeeReviews: {
      overallRating: 4.4,
      recommendToFriendPercent: 86,
      ceoApprovalPercent: 91,
      cultureAndValuesRating: 4.7,
      workLifeBalanceRating: 4.6,
      pros: [
        'Unrivaled schedule flexibility—work whatever hours from wherever you want in the world',
        'Internal communication is almost 100% text-based on internal P2 blogs',
        'Open vacation policy that is actively supported and used',
        '3-month fully paid sabbatical every 5 years of tenure'
      ],
      cons: [
        'Radical autonomy means you must be a self-starter who does not need daily direction',
        'Text-heavy communication requires patience and active reading',
        'Compensation reviews can be less formulaic than public companies'
      ],
      verdictSummary: 'Beloved by independent builders who revere open-source philosophy and despise bureaucratic meeting cultures.'
    },
    salaryBenchmarks: {
      roleTitle: 'Senior Software Engineer',
      seniority: 'Senior',
      percentile25: 125000,
      median: 145000,
      percentile75: 165000,
      percentile90: 185000,
      currency: 'USD',
      typicalEquity: 'Private company stock option grants with long-term exercise windows',
      annualBonusOrPerks: 'Sabbatical every 5 yrs, open vacation, home office allowance',
      marketDataSource: 'Levels.fyi Remote Global Bands',
      analysis: 'The posted salary of $130,000 - $165,000 matches global remote engineering market medians.'
    },
    interviewInsights: {
      difficulty: 'Moderate (3.2 / 5.0)',
      typicalProcess: [
        'Text-Based Chat Screen: Conducted via Slack to assess written communication fluency',
        'Paid Trial Project: A 2-3 week paid part-time trial project working on real codebase tasks with the team',
        'Final Interview with Matt Mullenweg (CEO) or division head'
      ],
      timeline: '3 to 4 weeks (trial-based model provides highest mutual certainty)',
      insiderAdvice: 'The famous Automattic paid trial project is a major advantage: you get paid to do real work alongside future teammates before deciding to join.'
    }
  },
  Elastic: {
    companyName: 'Elastic',
    tagline: 'The search intelligence platform powering enterprise search, observability, and security.',
    companySize: '3,500+ employees (Distributed by Design across 45+ countries)',
    foundedYear: '2012',
    headquarters: 'Mountain View, CA / Amsterdam · Distributed by Design',
    fundingStageOrTicker: 'Public (NYSE: ESTC)',
    businessModel: 'Enterprise search and telemetry subscriptions across Elasticsearch Cloud, Kibana, Logstash, and Beats.',
    cultureArchetype: 'Enterprise Open Core with Distributed Engineering Rigor',
    recentNews: [
      {
        title: 'Elasticsearch Open Search AI Foundation Launches Native Semantic Search and Vector Database Capabilities',
        date: 'Recent announcement',
        source: 'Elastic Press Room / PR Newswire',
        summary: 'Enhanced Kibana visualization suite and vector search engine optimized for enterprise Retrieval-Augmented Generation (RAG).',
        impactOnRole: 'High focus on data visualization, charting, and search exploration frontends.'
      },
      {
        title: 'Elastic Reports Record Enterprise Cloud Expansion and Operating Margin Milestone',
        date: 'Quarterly report',
        source: 'Bloomberg / Reuters',
        summary: 'Cloud revenue grew over 25% year-over-year as enterprises consolidate observability and SIEM security.',
        impactOnRole: 'Strong financial health and stable long-term equity performance.'
      },
      {
        title: 'Elastic Celebrates Over 10 Years of Distributed-by-Design Culture With Global Virtual Hackdays',
        date: 'Internal event',
        source: 'Elastic Life',
        summary: 'Company-wide hackathons driving innovation across search and visualization interfaces.',
        impactOnRole: 'High culture of technical exploration and internal contribution.'
      }
    ],
    employeeReviews: {
      overallRating: 4.3,
      recommendToFriendPercent: 85,
      ceoApprovalPercent: 90,
      cultureAndValuesRating: 4.5,
      workLifeBalanceRating: 4.3,
      pros: [
        'True distributed culture where remote employees are the norm, not second-tier',
        'Exceptional engineering caliber and deep distributed systems challenges',
        'Public liquid equity (NYSE: ESTC) with regular vesting and ESPP discount plan',
        'Competitive healthcare and retirement matching'
      ],
      cons: [
        'Enterprise scale requires more stakeholder reviews and compliance sign-offs',
        'Complex multi-product codebase with high initial learning curve',
        'Global timezone coordination across North America and Europe'
      ],
      verdictSummary: 'Top destination for engineers seeking high technical complexity, deep data challenges, and public company stability in a remote model.'
    },
    salaryBenchmarks: {
      roleTitle: 'Senior Full-Stack Engineer',
      seniority: 'Senior',
      percentile25: 145000,
      median: 168000,
      percentile75: 188000,
      percentile90: 215000,
      currency: 'USD',
      typicalEquity: '$35,000 - $70,000 / yr in public liquid RSUs with quarterly vesting',
      annualBonusOrPerks: '15% Employee Stock Purchase Plan (ESPP), 401(k) match, wellness stipends',
      marketDataSource: 'Levels.fyi & Radford Technology Survey 2024-2025',
      analysis: 'Posted compensation of $150,000 - $185,000 + RSUs ranks in the 75th percentile of enterprise cloud engineering roles.'
    },
    interviewInsights: {
      difficulty: 'Moderate to High (3.4 / 5.0)',
      typicalProcess: [
        '30-min Recruiter Screen: Experience overview and remote readiness',
        '60-min Technical Architecture & Coding Screen: React, TypeScript, state management, and performance',
        'System Design & Data Architecture: Visualizing high-volume time-series telemetry',
        'Values & Cross-Team Collaboration Chat: Distributed team empathy and alignment'
      ],
      timeline: '2 to 3 weeks',
      insiderAdvice: 'Brush up on web performance, canvas/SVG charting considerations, and explain how you manage complex state in data-heavy dashboards.'
    }
  }
};
