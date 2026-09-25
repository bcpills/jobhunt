import { JobOpening } from '../types';

export const DEFAULT_REMOTE_JOBS: JobOpening[] = [
  {
    id: 'job-canonical-it-1',
    title: 'Remote IT Support & Systems Operations Specialist',
    company: 'Canonical',
    companyDomain: 'canonical.com',
    location: 'Remote (US - All 50 States)',
    timezoneRequirement: 'US / Americas Flexible',
    workArrangement: '100% Remote · Distributed Pioneer',
    salary: '$68,000 - $88,000 / yr + Performance Bonus',
    matchScore: 97,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA', 'IL', 'PA'],
    stateEligibilityNote: 'Nationwide Remote: Open to all 50 US states (including NC, TX, FL, OH, VA)',
    isStateSpecific: false,
    trajectoryFitScore: 96,
    cultureFitScore: 98,
    skillOverlapScore: 97,
    careerTrajectoryAnalysis:
      'Direct promotion trajectory from enterprise desktop support to global distributed IT infrastructure & systems operations at a premier open-source company.',
    cultureFitDetails: {
      companyStage: 'Global Distributed Pioneer (1,000+ staff across 70+ countries)',
      operatingStyle: '100% Remote since inception, written documentation first, high autonomy and asynchronous delivery',
      alignmentNotes:
        'Perfect match for candidates experienced in independent troubleshooting, cross-location user support, and structured ticketing workflows.',
    },
    skillOverlapDetails: {
      matchedCore: ['Hardware & Software Troubleshooting', 'Active Directory', 'ServiceNow / ITSM', 'Computer Imaging & Deployment', 'Asset Management'],
      transferableSkills: ['Python Scripting Fundamentals', 'Network Protocols', 'Warranty Coordination & Hardware Lifecycle'],
      gaps: ['Ubuntu Linux desktop automation tooling (Landscape)'],
    },
    matchReasoning: [
      '8+ years supporting large enterprise environments directly aligns with Canonical’s global remote workforce requirements.',
      'Extensive Active Directory, computer imaging, and software deployment track record.',
      'Strong ITSM ticketing (ServiceNow) and asset lifecycle management (SAP/EBS) skills.',
      'Python programming foundation allows rapid transition into IT operations automation.'
    ],
    skillGaps: [
      'Review Canonical Landscape and Linux remote management utilities before technical screen.'
    ],
    description: `Canonical (publishers of Ubuntu) is hiring a Remote IT Support & Systems Operations Specialist to support our distributed team worldwide. You will diagnose and resolve complex hardware and software issues, manage user access via Active Directory and cloud identity, oversee computer imaging and hardware lifecycles, and automate tier-2 IT workflows.`,
    keyResponsibilities: [
      'Provide comprehensive tier-2 remote technical support for distributed employees across multiple continents.',
      'Administer user provisioning, group policies, and domain equipment within Active Directory and cloud directories.',
      'Coordinate hardware lifecycle, equipment imaging, warranty replacements, and asset tracking.',
      'Manage support requests and SLAs using ServiceNow, maintaining high user satisfaction scores.',
      'Leverage Python and command-line scripts to automate repetitive onboarding and configuration tasks.'
    ],
    requirements: [
      '3+ years of hands-on technical/desktop support in an enterprise or remote environment.',
      'Demonstrated expertise with Active Directory, Windows OS, computer imaging, and peripheral troubleshooting.',
      'Experience with enterprise ticketing systems (ServiceNow, Jira Service Desk, or similar).',
      'Strong asynchronous written communication, patient customer service, and independent problem-solving mindset.'
    ],
    benefits: [
      '100% Remote work from anywhere in the US',
      'Twice-yearly all-expenses-paid global company sprints',
      'Home office stipend ($1,200) and high-spec workstation allowance',
      'Comprehensive healthcare, 401(k), and generous paid leave'
    ],
    postedDate: 'Just now',
    applicantCompetition: 'Low',
    applyUrl: 'https://canonical.com/careers',
    source: 'Canonical Distributed Careers'
  },
  {
    id: 'job-redhat-support-2',
    title: 'Enterprise Technical Support Specialist (State-Specific Remote)',
    company: 'Red Hat',
    companyDomain: 'redhat.com',
    location: 'Remote (Hiring in NC, VA, SC, GA, FL, TX, OH, TN)',
    timezoneRequirement: 'US Eastern / Central',
    workArrangement: '100% Remote · Flexible Hours',
    salary: '$58,000 - $78,000 / yr + 401(k) Match',
    matchScore: 95,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'VA', 'SC', 'GA', 'FL', 'TX', 'OH', 'TN'],
    stateEligibilityNote: 'State-Specific Remote: Open to North Carolina (Headquarters hub), VA, SC, GA, FL, TX, OH, TN',
    isStateSpecific: true,
    trajectoryFitScore: 94,
    cultureFitScore: 96,
    skillOverlapScore: 95,
    careerTrajectoryAnalysis:
      'Capitalizes on strong NC enterprise IT background with Red Hat’s Raleigh-founded open-source culture. Provides a clear path to Senior Systems Support Engineer.',
    cultureFitDetails: {
      companyStage: 'Established Open Source Leader (IBM Subsidiary, 19,000+ staff)',
      operatingStyle: 'Open organization culture, meritocracy, comprehensive internal documentation, flexible schedules',
      alignmentNotes: 'Deep appreciation for public sector & state agency IT experience, structured service level management, and ticketing precision.',
    },
    skillOverlapDetails: {
      matchedCore: ['Active Directory', 'Hardware Diagnostics', 'User Support & Troubleshooting', 'ServiceNow', 'Asset Management'],
      transferableSkills: ['Python Scripting', 'Virtual Machine Configuration', 'Patch Management'],
      gaps: ['Red Hat Enterprise Linux (RHEL) basic command line'],
    },
    matchReasoning: [
      'State-specific remote role ideal for North Carolina residents with enterprise desktop support background.',
      'Direct experience handling high-volume tickets and warranty dispatch with vendors.',
      'Background with large departmental environments (DOT/IT) maps directly to Red Hat user operations.'
    ],
    skillGaps: ['Review basic bash commands and Red Hat customer portal workflows.'],
    description: `Red Hat is seeking an Enterprise Technical Support Specialist to join our distributed customer & employee systems team. In this role, you will assist internal teams and enterprise users with hardware diagnostics, operating system troubleshooting, domain administration, and remote application deployment.`,
    keyResponsibilities: [
      'Deliver friendly, structured remote support for Windows, Linux, and mobile hardware.',
      'Maintain asset tracking records and coordinate hardware swap logistics and warranty repairs.',
      'Manage access permissions, multi-factor authentication, and Active Directory object records.',
      'Document troubleshooting resolutions in team knowledge base articles.'
    ],
    requirements: [
      '2-6 years supporting computer hardware, peripherals, and software suites in an enterprise setting.',
      'Familiarity with Active Directory and automated endpoint management.',
      'Excellent written and verbal communication with proven customer service empathy.'
    ],
    benefits: [
      '100% Remote with Raleigh, NC regional hub access if desired',
      'Quarterly company recharge days (extra paid days off)',
      'Tuition reimbursement and certification sponsorships (RHCSA, CompTIA, ITIL)',
      'Comprehensive medical, dental, vision, and 401(k) match'
    ],
    postedDate: '1 day ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://redhat.com/en/jobs',
    source: 'Red Hat Remote Careers'
  },
  {
    id: 'job-helpscout-support-3',
    title: 'Customer Operations & IT Systems Support Associate',
    company: 'Help Scout',
    companyDomain: 'helpscout.com',
    location: 'Remote (US - 40 Eligible States)',
    timezoneRequirement: 'US Timezones (EST / CST preferred)',
    workArrangement: '100% Remote · B-Corp Culture',
    salary: '$52,000 - $70,000 / yr + Equity & Profit Sharing',
    matchScore: 93,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'PA', 'IL', 'CO', 'MI', 'IN', 'TN', 'All US'],
    stateEligibilityNote: 'Remote across 40 US states (including NC, TX, FL, OH, VA, GA, PA)',
    isStateSpecific: false,
    trajectoryFitScore: 92,
    cultureFitScore: 96,
    skillOverlapScore: 91,
    careerTrajectoryAnalysis:
      'Transitions enterprise support proficiency into high-growth SaaS customer systems operations and internal workplace IT tooling.',
    cultureFitDetails: {
      companyStage: 'Certified B-Corp Remote Pioneer (150+ employees)',
      operatingStyle: 'High empathy, async-first, transparent compensation bands, no weekend emergency pager rotations',
      alignmentNotes: 'Rewards candidates who communicate with genuine warmth, clarity, and patience.'
    },
    skillOverlapDetails: {
      matchedCore: ['IT Troubleshooting', 'Ticket SLA Management', 'Customer Communication', 'Knowledge Base Writing'],
      transferableSkills: ['Basic Web & Scripting (HTML/CSS/Python)', 'User Training'],
      gaps: ['Help Scout API webhooks']
    },
    matchReasoning: [
      'Exceptional customer satisfaction track record in enterprise support.',
      'Hands-on proficiency with ticketing and SLA tracking.',
      'Strong problem-solving discipline with clear, step-by-step written guidance.'
    ],
    skillGaps: ['Explore Help Scout product features via free trial.'],
    description: `Help Scout makes customer service software loved by over 12,000 growing businesses. We are hiring a Customer Operations & IT Systems Support Associate to troubleshoot user issues, manage SaaS tool access, and assist team members with desktop configurations.`,
    keyResponsibilities: [
      'Answer incoming user inquiries and technical tickets via email and async channels.',
      'Investigate technical issues, browser quirks, account permissions, and integrations.',
      'Write and update internal troubleshooting guides and user-facing documentation.'
    ],
    requirements: [
      '2+ years in technical support, helpdesk, or customer operations.',
      'Clear, friendly, and concise written communication in English.',
      'Familiarity with troubleshooting cloud software, operating systems, and browsers.'
    ],
    benefits: [
      '100% Remote since 2011',
      '4 weeks paid vacation + 1 week company holiday week in December',
      '$1,800/yr personal learning stipend',
      'Full health, dental, and vision insurance with 100% premiums paid'
    ],
    postedDate: '2 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://www.helpscout.com/careers/',
    source: 'Help Scout Remote Careers'
  },
  {
    id: 'job-zapier-it-4',
    title: 'Distributed IT Specialist & SaaS Administrator',
    company: 'Zapier',
    companyDomain: 'zapier.com',
    location: 'Remote (US & Americas)',
    timezoneRequirement: 'US Timezones Flexible',
    workArrangement: '100% Remote · Async First',
    salary: '$72,000 - $94,000 / yr + Profit Sharing',
    matchScore: 94,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'CA', 'NY', 'OH', 'VA', 'GA', 'IL'],
    stateEligibilityNote: 'Nationwide Remote: Open to all US states (100% distributed workforce since 2011)',
    isStateSpecific: false,
    trajectoryFitScore: 95,
    cultureFitScore: 97,
    skillOverlapScore: 92,
    careerTrajectoryAnalysis:
      'Moves from legacy on-premise hardware provisioning to cloud-native identity management (Okta/Google Workspace), SaaS orchestration, and automated onboarding.',
    cultureFitDetails: {
      companyStage: 'Profitable Remote Pioneer (1,000+ employees)',
      operatingStyle: 'Async Slack + internal blog (Async tool), strict no-meeting Wednesdays, radical autonomy',
      alignmentNotes: 'Directly values independent troubleshooting and documented processes.'
    },
    skillOverlapDetails: {
      matchedCore: ['Active Directory / Identity', 'IT Asset Tracking', 'Hardware Management', 'ServiceNow / Ticket Resolution'],
      transferableSkills: ['Python Scripting for Automations', 'Vendor Warranty Coordination'],
      gaps: ['Okta Workflows and Jamf Pro MDM']
    },
    matchReasoning: [
      'Proven background managing computer imaging, user accounts, and hardware lifecycles.',
      'Foundational Python skills make automation of IT onboarding workflows straightforward.',
      'Strong alignment with Zapier’s async documentation culture.'
    ],
    skillGaps: ['Review Okta identity lifecycle management concepts.'],
    description: `Zapier automates workflows for over 3 million users. We are hiring a Distributed IT Specialist to support our 1,000+ teammates worldwide. You will manage SaaS access, coordinate hardware deliveries and security compliance, and streamline onboarding.`,
    keyResponsibilities: [
      'Manage user account lifecycle (onboarding, role changes, offboarding) across cloud identity systems.',
      'Coordinate laptop provisioning, endpoint imaging, and hardware replacements globally.',
      'Resolve internal IT tickets promptly with empathetic, clear communication.',
      'Build Zapier workflows to automate routine IT helpdesk tasks.'
    ],
    requirements: [
      '3+ years in IT support, desktop support, or systems administration.',
      'Hands-on experience with identity management (Active Directory, Okta, or Google Admin).',
      'Desire to automate repetitive tasks using scripts or workflow tools.'
    ],
    benefits: [
      '100% Remote with flexible hours',
      'Competitive salary with annual profit sharing bonuses',
      'Unlimited PTO (minimum 2-3 weeks encouraged)',
      '$2,000 annual education stipend and computer equipment budget'
    ],
    postedDate: '3 days ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://zapier.com/jobs',
    source: 'Zapier Remote Careers'
  },
  {
    id: 'job-automattic-ops-5',
    title: 'Remote Workplace Systems & Technical Support Specialist',
    company: 'Automattic',
    companyDomain: 'automattic.com',
    location: 'Remote (Worldwide / US)',
    timezoneRequirement: 'Any Timezone',
    workArrangement: '100% Remote · Async Pioneer',
    salary: '$62,000 - $82,000 / yr (Transparent Formula)',
    matchScore: 92,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
    stateEligibilityNote: 'Worldwide / All 50 US states eligible (Employees across 90+ countries)',
    isStateSpecific: false,
    trajectoryFitScore: 91,
    cultureFitScore: 95,
    skillOverlapScore: 90,
    careerTrajectoryAnalysis:
      'Async meritocracy: Work independently on internal IT tools, endpoint security, and global hardware dispatch for the makers of WordPress.com and Tumblr.',
    cultureFitDetails: {
      companyStage: 'Distributed Pioneer (2,000+ staff across 90+ countries)',
      operatingStyle: 'P2 blogs, no mandatory video meetings, text-based collaboration, high personal autonomy',
      alignmentNotes: 'Ideal for self-starters who manage their day without micromanagement.'
    },
    skillOverlapDetails: {
      matchedCore: ['Desktop Support', 'Hardware Provisioning', 'User Authentication', 'Technical Documentation'],
      transferableSkills: ['Web Basics (HTML/CSS/PHP)', 'Python Scripting', 'Asset Tracking'],
      gaps: ['P2 internal WordPress blogging tools']
    },
    matchReasoning: [
      'Solid experience managing hardware configurations, warranties, and enterprise software.',
      'Basic programming awareness (Python, PHP, HTML) fits Automattic open web ethos.',
      'Strong ability to diagnose problems independently through text.'
    ],
    skillGaps: ['Get familiar with WordPress.com admin interface.'],
    description: `Automattic (WordPress.com, WooCommerce, Tumblr) is looking for a Remote Workplace Systems & Technical Support Specialist to support our distributed team. You will handle hardware rollouts, maintain systems security, and solve technical hurdles.`,
    keyResponsibilities: [
      'Support Automatticians globally with computer setups, peripherals, and OS troubleshooting.',
      'Maintain software licensing, inventory records, and security compliance standards.',
      'Write clear, asynchronous documentation for internal setup guides.'
    ],
    requirements: [
      '3+ years troubleshooting Windows and macOS systems in a business or academic environment.',
      'Strong written communication in English.',
      'Familiarity with hardware lifecycle management and vendor coordination.'
    ],
    benefits: [
      'Work from anywhere in the world',
      'Open vacation policy with no maximum',
      'Home office allowance and coworking membership stipend',
      'Company-sponsored sabbatical every 5 years'
    ],
    postedDate: '4 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://automattic.com/work-with-us/',
    source: 'Automattic Remote Jobs'
  },
  {
    id: 'job-state-nc-remote-6',
    title: 'Senior Information Systems Support Analyst (Remote / Hybrid Eligible)',
    company: 'NC State University / Distance Operations',
    companyDomain: 'ncsu.edu',
    location: 'Remote (North Carolina Residents Only)',
    timezoneRequirement: 'US Eastern (EST)',
    workArrangement: 'Remote within NC · State Government Benefits',
    salary: '$54,000 - $72,000 / yr + State Pension & Health',
    matchScore: 96,
    matchTier: 'Strong Match',
    eligibleStates: ['NC'],
    stateEligibilityNote: 'State-Specific Remote: Restricted to North Carolina residents (NC State Government / UNC System)',
    isStateSpecific: true,
    trajectoryFitScore: 97,
    cultureFitScore: 96,
    skillOverlapScore: 96,
    careerTrajectoryAnalysis:
      'Seamless continuation of North Carolina state enterprise experience (DOT/DIT) into higher-tier institutional IT systems with state retirement stability.',
    cultureFitDetails: {
      companyStage: 'Major Research University (UNC System, 9,000+ faculty & staff)',
      operatingStyle: 'Collaborative, stable public sector pace, excellent state pension, 24+ paid state holidays',
      alignmentNotes: '100% matched to candidate background in NCDOT/DIT, state domain protocols, and SAP/EBS systems.'
    },
    skillOverlapDetails: {
      matchedCore: ['State Domain Active Directory', 'ServiceNow Ticketing', 'SAP/EBS Asset Management', 'Computer Imaging', 'Hardware Repair'],
      transferableSkills: ['Network Cable & Protocol Testing', 'State Procurement Guidelines', 'User Training'],
      gaps: ['Campus-specific distance education LMS integrations']
    },
    matchReasoning: [
      'Candidate’s current experience with NC Department of Transportation directly carries over with zero onboarding friction.',
      'Familiarity with state Active Directory schemas, state IT policies, and ServiceNow.',
      'Recognized state service years count towards NC state pension vesting.'
    ],
    skillGaps: ['Review NCSU OIT security protocols.'],
    description: `NC State University is seeking an Information Systems Support Analyst for our distributed colleges and distance education programs. You will provide remote and field support for institutional desktop systems, manage state IT assets, image workstations, and resolve tier-2 user tickets.`,
    keyResponsibilities: [
      'Troubleshoot hardware, peripherals, and software for university faculty and staff.',
      'Deploy and image state-owned computers following NC state IT security guidelines.',
      'Administer Active Directory user groups, network shares, and Microsoft 365 permissions.',
      'Track state assets and equipment lifecycle through university ERP.'
    ],
    requirements: [
      '3+ years in computer support, user support, or network administration.',
      'North Carolina residency required for payroll and state benefits.',
      'Working knowledge of Active Directory, Windows enterprise deployment, and ticketing tools.'
    ],
    benefits: [
      'North Carolina State Teachers and State Employees Retirement System (TSERS) pension',
      'Comprehensive State Health Plan with low employee premiums',
      '24+ paid holidays and generous vacation/sick accrual',
      'Tuition waiver for up to 3 courses per academic year'
    ],
    postedDate: 'Just now',
    applicantCompetition: 'Low',
    applyUrl: 'https://jobs.ncsu.edu/',
    source: 'NC State University Careers'
  },
  {
    id: 'job-duke-health-remote-7',
    title: 'Tier 2 Desktop Systems & Clinic Tech Specialist (Remote in NC)',
    company: 'Duke University Health System',
    companyDomain: 'dukehealth.org',
    location: 'Remote (North Carolina & Surrounding States)',
    timezoneRequirement: 'US Eastern (EST)',
    workArrangement: 'Remote · Healthcare IT Systems',
    salary: '$56,000 - $75,000 / yr + Tuition Assistance',
    matchScore: 94,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'VA', 'SC', 'TN'],
    stateEligibilityNote: 'State-Specific Remote: Open to North Carolina, Virginia, South Carolina, and Tennessee',
    isStateSpecific: true,
    trajectoryFitScore: 93,
    cultureFitScore: 95,
    skillOverlapScore: 94,
    careerTrajectoryAnalysis:
      'High-stability healthcare IT systems career track with opportunities to specialize in clinical informatics, Epic integration, and enterprise endpoint management.',
    cultureFitDetails: {
      companyStage: 'Top-Ranked Academic Health System (26,000+ employees)',
      operatingStyle: 'Patient-first mission, clinical uptime priority, structured ticket SLA tiers',
      alignmentNotes: 'Directly values reliable hardware maintenance, warranty coordination, and rapid user response.'
    },
    skillOverlapDetails: {
      matchedCore: ['Hardware Troubleshooting', 'Active Directory', 'ServiceNow Ticketing', 'Computer Imaging', 'Peripherals Support'],
      transferableSkills: ['Hardware Lifecycle Management', 'Asset Tracking', 'Python Scripting'],
      gaps: ['Epic EHR workstation registration']
    },
    matchReasoning: [
      'Proven expertise handling enterprise ticketing systems (ServiceNow) and equipment deployments.',
      'Experience coordinating hardware repairs and vendor warranties.',
      'Patient, calm communication style essential for medical and administrative staff.'
    ],
    skillGaps: ['Complete Duke Health HIPAA and basic clinical device overview.'],
    description: `Duke Health is hiring a Tier 2 Desktop Systems Specialist to remotely support clinical and administrative operations across North Carolina. You will configure virtual workstations, troubleshoot peripherals and imaging software, and manage user identity.`,
    keyResponsibilities: [
      'Provide tier-2 remote diagnosis for computing equipment, scanners, badge readers, and monitors.',
      'Configure and image workstations with standard clinical and business software images.',
      'Manage user accounts, group policies, and access tokens in Active Directory.',
      'Coordinate hardware swap-outs and equipment replenishment.'
    ],
    requirements: [
      '3+ years of enterprise technical support experience.',
      'Demonstrated proficiency with Active Directory, Windows 10/11, and ServiceNow.',
      'Must reside in North Carolina, Virginia, South Carolina, or Tennessee.'
    ],
    benefits: [
      'Duke University retirement plan (up to 8.9% employer contribution)',
      'Duke Children’s Campus and employee tuition assistance up to 90%',
      'Comprehensive dental, vision, and healthcare benefits',
      'Generous paid time off policy'
    ],
    postedDate: '1 day ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://careers.dukehealth.org/',
    source: 'Duke Health Remote Careers'
  },
  {
    id: 'job-gitlab-it-8',
    title: 'Workplace Operations & Identity Support Analyst',
    company: 'GitLab',
    companyDomain: 'gitlab.com',
    location: 'Remote (US - All States)',
    timezoneRequirement: 'US Timezones Flexible',
    workArrangement: '100% Remote · Handbook First',
    salary: '$74,000 - $98,000 / yr + Equity',
    matchScore: 93,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
    stateEligibilityNote: 'Nationwide Remote: Open to all 50 US states (100% remote pioneer with transparent handbook)',
    isStateSpecific: false,
    trajectoryFitScore: 93,
    cultureFitScore: 97,
    skillOverlapScore: 91,
    careerTrajectoryAnalysis:
      'World-class handbook-first documentation culture: Rapidly elevate your profile in all-remote IT operations, Okta identity, and Slack/Zoom enterprise management.',
    cultureFitDetails: {
      companyStage: 'Public Remote Pioneer (2,000+ team members, NASDAQ: GTLB)',
      operatingStyle: 'Handbook first, public Slack channels, asynchronous RFCs, no fixed working hours',
      alignmentNotes: 'Ideal for candidates who like clear documentation and structured processes.'
    },
    skillOverlapDetails: {
      matchedCore: ['User Access & Identity', 'Hardware Deployment', 'IT Troubleshooting', 'Ticketing Systems'],
      transferableSkills: ['Python Foundations', 'Technical Documentation Writing'],
      gaps: ['Git / GitLab issues for IT requests']
    },
    matchReasoning: [
      '8+ years supporting user systems provides deep troubleshooting maturity.',
      'Strong knowledge of Active Directory principles easily translates to cloud identity.',
      'High personal responsibility and written communication discipline.'
    ],
    skillGaps: ['Read the GitLab public IT handbook and practice creating a GitLab issue.'],
    description: `GitLab is an all-remote company. We are looking for a Workplace Operations & Identity Support Analyst to support our global team. You will administer cloud identity systems, handle hardware procurement and replacement requests, and write internal IT runbooks.`,
    keyResponsibilities: [
      'Provide asynchronous support to GitLab team members across various technical inquiries.',
      'Manage provisioning and deprovisioning workflows in Okta, Google Workspace, and 1Password.',
      'Contribute directly to the public GitLab IT handbook and document troubleshooting steps.'
    ],
    requirements: [
      '3+ years in IT support or systems administration.',
      'Demonstrated interest in automation and scripting (Python, Bash, or PowerShell).',
      'Comfortable communicating almost entirely in writing.'
    ],
    benefits: [
      'Work from anywhere with flexible schedule',
      'Equity compensation (RSUs)',
      'Home office setup reimbursement and monthly tech stipend',
      'Unlimited paid time off'
    ],
    postedDate: '2 days ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://about.gitlab.com/jobs/',
    source: 'GitLab Careers'
  },
  {
    id: 'job-chewy-it-9',
    title: 'Associate IT Service Desk Specialist (Remote - Southeast / East Hub)',
    company: 'Chewy',
    companyDomain: 'chewy.com',
    location: 'Remote (Open to NC, FL, TX, GA, PA, OH, VA, IN, KY)',
    timezoneRequirement: 'US Eastern / Central',
    workArrangement: '100% Remote · High Growth E-Commerce',
    salary: '$50,000 - $68,000 / yr + Pet Insurance & 401(k)',
    matchScore: 92,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'FL', 'TX', 'GA', 'PA', 'OH', 'VA', 'IN', 'KY'],
    stateEligibilityNote: 'State-Specific Remote: Open to NC, FL, TX, GA, PA, OH, VA, IN, and KY residents',
    isStateSpecific: true,
    trajectoryFitScore: 91,
    cultureFitScore: 94,
    skillOverlapScore: 92,
    careerTrajectoryAnalysis:
      'Fast-paced consumer brand with massive logistics and corporate workforce. Excellent springboard into Enterprise Systems Administration or Cloud Ops.',
    cultureFitDetails: {
      companyStage: 'Public E-Commerce Giant (20,000+ employees, NYSE: CHWY)',
      operatingStyle: 'Customer obsession, operational speed, high team camaraderie, structured metric tracking',
      alignmentNotes: 'Rewards candidates who love solving hardware and software roadblocks with high customer satisfaction.'
    },
    skillOverlapDetails: {
      matchedCore: ['Active Directory', 'ServiceNow Ticketing', 'Remote Desktop Troubleshooting', 'Hardware Replacement'],
      transferableSkills: ['ITSM SLAs', 'Asset Management', 'Phone & Chat Support'],
      gaps: ['Cisco Meraki network portals']
    },
    matchReasoning: [
      'Direct match for ServiceNow and Active Directory management skills.',
      'Extensive track record troubleshooting enterprise endpoints.',
      'Eligible in North Carolina and Southeastern US.'
    ],
    skillGaps: ['Review Meraki dashboard basics.'],
    description: `Chewy is looking for an Associate IT Service Desk Specialist to support our corporate and fulfillment operations team remotely. You will answer incoming IT tickets, configure user permissions, diagnose equipment malfunctions, and support software rollouts.`,
    keyResponsibilities: [
      'Provide tier 1 and tier 2 technical troubleshooting for Windows systems, mobile devices, and SaaS tools.',
      'Administer user accounts, security groups, and distribution lists in Active Directory and Office 365.',
      'Log and update incident tickets in ServiceNow with thorough resolution details.'
    ],
    requirements: [
      '2+ years in technical support, help desk, or IT customer service.',
      'Working knowledge of Windows 10/11, Active Directory, and Microsoft 365.',
      'Strong organizational skills and ability to manage multiple priorities.'
    ],
    benefits: [
      '100% Remote flexibility',
      'Chewy team member product discounts and pet insurance',
      'Comprehensive medical, dental, and vision insurance',
      '401(k) matching plan'
    ],
    postedDate: '3 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://careers.chewy.com/',
    source: 'Chewy Remote Jobs'
  },
  {
    id: 'job-invision-it-10',
    title: 'Remote Workplace Systems Coordinator',
    company: 'InVision',
    companyDomain: 'invisionapp.com',
    location: 'Remote (US - All 50 States)',
    timezoneRequirement: 'US Timezones Flexible',
    workArrangement: '100% Remote · Fully Distributed',
    salary: '$55,000 - $75,000 / yr + Equipment Budget',
    matchScore: 91,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA', 'IL'],
    stateEligibilityNote: 'Nationwide Remote: Open to candidates across all 50 states',
    isStateSpecific: false,
    trajectoryFitScore: 90,
    cultureFitScore: 93,
    skillOverlapScore: 91,
    careerTrajectoryAnalysis:
      'Manage distributed workplace hardware logistics, identity access, and remote support workflows across a creative software company.',
    cultureFitDetails: {
      companyStage: 'Remote-First Pioneer (500+ employees)',
      operatingStyle: 'Async communication, high trust, flexible schedules, focus on outcomes',
      alignmentNotes: 'Values clear written explanations and proactive equipment management.'
    },
    skillOverlapDetails: {
      matchedCore: ['Hardware Lifecycle Management', 'Asset Tracking', 'Troubleshooting', 'User Support'],
      transferableSkills: ['Vendor Repair Coordination', 'Software Provisioning'],
      gaps: ['Jamf Connect / MDM configurations']
    },
    matchReasoning: [
      'Expertise in hardware tracking, warranty coordination, and computer imaging.',
      'Proven ability to work autonomously with minimal supervision.',
      'Solid user support communication skills.'
    ],
    skillGaps: ['Review cloud MDM deployment workflows.'],
    description: `InVision is looking for a Remote Workplace Systems Coordinator to support our remote workforce. You will manage equipment lifecycles, assist users with software setups, and coordinate warranty replacements with vendors.`,
    keyResponsibilities: [
      'Coordinate computer orders, imaging, and secure delivery to remote employees.',
      'Manage software licensing and track hardware assets through their complete lifecycle.',
      'Resolve technical issues for remote teammates via Slack and ticket channels.'
    ],
    requirements: [
      '2+ years in IT support or computer asset management.',
      'Experience coordinating with hardware manufacturers for warranty repairs.',
      'Strong problem-solving and communication skills.'
    ],
    benefits: [
      '100% Remote work from anywhere in the US',
      'Generous paid time off',
      'Home office stipend and annual wellness allowance',
      'Comprehensive health coverage'
    ],
    postedDate: '4 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://invisionapp.com/careers',
    source: 'InVision Careers'
  },
  {
    id: 'job-buffer-support-11',
    title: 'Customer Advocate & Technical Troubleshooter',
    company: 'Buffer',
    companyDomain: 'buffer.com',
    location: 'Remote (Worldwide / US)',
    timezoneRequirement: 'US / Americas Friendly',
    workArrangement: '100% Remote · 4-Day Work Week',
    salary: '$54,000 - $72,000 / yr (Transparent 4-Day Pay)',
    matchScore: 90,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
    stateEligibilityNote: 'Worldwide Remote / All US States Eligible (4-Day Work Week company)',
    isStateSpecific: false,
    trajectoryFitScore: 89,
    cultureFitScore: 96,
    skillOverlapScore: 88,
    careerTrajectoryAnalysis:
      'Experience a true 32-hour 4-day work week while applying your troubleshooting skills to help thousands of businesses thrive online.',
    cultureFitDetails: {
      companyStage: 'Bootstrapped SaaS Pioneer (85 employees)',
      operatingStyle: '4-day work week (32 hours, 100% pay), radical transparent salaries, async-first',
      alignmentNotes: 'Unmatched work-life balance and supportive, empathetic team culture.'
    },
    skillOverlapDetails: {
      matchedCore: ['Technical Diagnostics', 'Empathetic User Communication', 'Issue Resolution', 'Documentation'],
      transferableSkills: ['Social Media SaaS Platforms', 'Browser Extension Debugging'],
      gaps: ['Buffer platform internal settings']
    },
    matchReasoning: [
      'Customer-centric technical mindset honed through 8 years of user support.',
      'Comfortable explaining complex technical steps in plain, encouraging language.',
      'Great fit for Buffer’s transparent, low-stress culture.'
    ],
    skillGaps: ['Review Buffer’s transparent salary formula and values online.'],
    description: `Buffer is hiring a Customer Advocate & Technical Troubleshooter to provide outstanding support across our social media tools. You will work a 4-day work week, helping users solve technical glitches and get the most out of our products.`,
    keyResponsibilities: [
      'Provide thoughtful, timely help to users via email and community channels.',
      'Reproduce technical bugs, identify root causes, and write detailed tickets for engineers.',
      'Contribute to our comprehensive help center and FAQ guides.'
    ],
    requirements: [
      '2+ years in technical support, helpdesk, or customer success.',
      'Superb written communication skills with strong empathy and attention to detail.',
      'Ability to thrive in an independent, async remote environment.'
    ],
    benefits: [
      '4-Day Work Week (32 hours, Monday-Thursday)',
      'Transparent salary formula with profit sharing',
      'Unlimited vacation (minimum 3 weeks recommended)',
      'Free books, home office budget, and health insurance'
    ],
    postedDate: '5 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://buffer.com/journey',
    source: 'Buffer Careers'
  },
  {
    id: 'job-basecamp-support-12',
    title: 'Customer & Technical Support Specialist',
    company: '37signals (Basecamp)',
    companyDomain: '37signals.com',
    location: 'Remote (Worldwide / US)',
    timezoneRequirement: 'US Timezones (EST / CST)',
    workArrangement: '100% Remote · Calm Company Pioneer',
    salary: '$65,000 - $85,000 / yr + Summer Hours',
    matchScore: 91,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
    stateEligibilityNote: 'Nationwide & Worldwide Remote: Open to all states (Creators of Basecamp & Ruby on Rails)',
    isStateSpecific: false,
    trajectoryFitScore: 90,
    cultureFitScore: 95,
    skillOverlapScore: 89,
    careerTrajectoryAnalysis:
      'Join the original pioneers of remote work and calm company culture. Excellent mentorship in pragmatic software support and clear writing.',
    cultureFitDetails: {
      companyStage: 'Bootstrapped Remote Pioneer (60 employees)',
      operatingStyle: 'No meetings, 32-hour summer weeks, 40-hour winter weeks, high craftsmanship, calm work',
      alignmentNotes: 'Deep appreciation for thoughtful writing and independent execution.'
    },
    skillOverlapDetails: {
      matchedCore: ['Technical Diagnostics', 'User Assistance', 'Documentation', 'Ticketing'],
      transferableSkills: ['Basecamp Project Tools', 'HEY Email'],
      gaps: ['37signals internal support toolset']
    },
    matchReasoning: [
      'Decade of practical user troubleshooting matches 37signals’ emphasis on real-world problem solving.',
      'Strong independent work ethic fits calm remote ethos.',
      'High level of respect for customer time and clear answers.'
    ],
    skillGaps: ['Read "It Doesn\'t Have to Be Crazy at Work" by Jason Fried & DHH.'],
    description: `37signals (makers of Basecamp and HEY) is hiring a Technical Support Specialist. You will help our customers solve technical questions, report bugs, and ensure their projects run smoothly.`,
    keyResponsibilities: [
      'Answer customer inquiries with thoughtful, personalized, well-written responses.',
      'Investigate technical issues across web, iOS, and desktop applications.',
      'Collaborate with developers to surface recurring user pain points.'
    ],
    requirements: [
      '3+ years helping people solve computer or software problems.',
      'Outstanding writing skills with a calm, friendly tone.',
      'Strong analytical curiosity and willingness to figure things out independently.'
    ],
    benefits: [
      '32-hour 4-day work weeks from May through October',
      'Top 10% Chicago market rate compensation regardless of where you live',
      '100% coverage of health, dental, and vision insurance premiums',
      '$2,000 vacation stipend every year after your first year'
    ],
    postedDate: '5 days ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://37signals.com/jobs',
    source: '37signals Careers'
  },
  {
    id: 'job-metlife-remote-13',
    title: 'IT Operations Support Analyst (Remote - Cary / Raleigh Hub)',
    company: 'MetLife Global Technology',
    companyDomain: 'metlife.com',
    location: 'Remote (Hiring in NC, SC, VA, GA, FL, TX, OH)',
    timezoneRequirement: 'US Eastern (EST)',
    workArrangement: '100% Remote · Enterprise Finance & Insurance',
    salary: '$58,000 - $76,000 / yr + Annual Corporate Bonus',
    matchScore: 94,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'SC', 'VA', 'GA', 'FL', 'TX', 'OH'],
    stateEligibilityNote: 'State-Specific Remote: Open to North Carolina (Cary Tech Campus hub), SC, VA, GA, FL, TX, OH',
    isStateSpecific: true,
    trajectoryFitScore: 93,
    cultureFitScore: 94,
    skillOverlapScore: 95,
    careerTrajectoryAnalysis:
      'Leverage enterprise IT support experience in MetLife’s major North Carolina technology center. Strong pathways into ITIL Problem Management or Cloud Infrastructure.',
    cultureFitDetails: {
      companyStage: 'Fortune 50 Enterprise (45,000+ employees, NYSE: MET)',
      operatingStyle: 'Structured enterprise governance, strict compliance, excellent corporate benefits and stability',
      alignmentNotes: 'Directly values experience with Active Directory, ServiceNow ticketing, and structured hardware lifecycle policies.'
    },
    skillOverlapDetails: {
      matchedCore: ['Active Directory Domain Admin', 'ServiceNow ITSM', 'Hardware Imaging & Repair', 'Asset Tracking (SAP)', 'User Support'],
      transferableSkills: ['ITIL Frameworks', 'Vendor Warranty Processing', 'Python Scripts'],
      gaps: ['Financial industry compliance protocols']
    },
    matchReasoning: [
      'Direct match for large enterprise environment experience (8+ years).',
      'Deep fluency in ServiceNow, Active Directory, and SAP/EBS asset systems.',
      'Cary, NC regional presence provides high local employer recognition.'
    ],
    skillGaps: ['Review ITIL Foundation v4 key concepts.'],
    description: `MetLife Global Technology is hiring an IT Operations Support Analyst to support our remote corporate employees and regional offices. You will diagnose software and hardware incidents, configure domain permissions, and oversee computer deployments.`,
    keyResponsibilities: [
      'Resolve tier-2 incident tickets within SLA target windows using ServiceNow.',
      'Manage user security groups, password resets, and access rights in Active Directory.',
      'Coordinate hardware shipments, warranty repairs, and equipment returns with logistics partners.',
      'Assist with corporate software patch rollouts and desktop imaging.'
    ],
    requirements: [
      '3+ years in enterprise IT desktop support or service desk operations.',
      'Proven expertise with Active Directory, Windows 10/11 Enterprise, and Office 365.',
      'Familiarity with enterprise ticketing tools (ServiceNow preferred).'
    ],
    benefits: [
      '100% Remote with Cary, NC campus facilities available',
      'Annual performance incentive bonus',
      'Generous 401(k) matching up to 6% plus defined contribution retirement',
      'Tuition reimbursement and professional training programs'
    ],
    postedDate: 'Just now',
    applicantCompetition: 'Low',
    applyUrl: 'https://jobs.metlife.com/',
    source: 'MetLife Technology Careers'
  },
  {
    id: 'job-cisco-support-14',
    title: 'Customer Systems & Desktop Support Specialist (Remote - RTP Hub)',
    company: 'Cisco Systems',
    companyDomain: 'cisco.com',
    location: 'Remote (Eligible in NC, VA, GA, FL, TX, CA, OH, All US)',
    timezoneRequirement: 'US Timezones',
    workArrangement: 'Remote-First · Hybrid RTP Optional',
    salary: '$64,000 - $84,000 / yr + Employee Stock Purchase',
    matchScore: 93,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'VA', 'GA', 'FL', 'TX', 'CA', 'OH', 'All US'],
    stateEligibilityNote: 'Remote across US states with major Research Triangle Park (RTP, NC) hub support',
    isStateSpecific: false,
    trajectoryFitScore: 92,
    cultureFitScore: 94,
    skillOverlapScore: 93,
    careerTrajectoryAnalysis:
      'World-class networking and infrastructure leader. Deepen networking fundamentals and bridge into cloud collaboration and security administration.',
    cultureFitDetails: {
      companyStage: 'Global Tech Leader (84,000+ employees, NASDAQ: CSCO)',
      operatingStyle: 'Continuous learning focus, strong employee resource networks, generous time off for giving back',
      alignmentNotes: 'Strong appreciation for networking fundamentals, hardware troubleshooting, and Wake Tech community college certifications.'
    },
    skillOverlapDetails: {
      matchedCore: ['Hardware & Software Diagnostics', 'Active Directory', 'Networking Protocols', 'Ticketing Systems'],
      transferableSkills: ['Python Foundations', 'Cloud Computing Concepts', 'Equipment Provisioning'],
      gaps: ['Cisco Webex Admin & Meraki AP setup']
    },
    matchReasoning: [
      'Wake Tech Community College certifications in Computing Fundamentals and Python align with Cisco RTP educational ties.',
      'Extensive hands-on hardware diagnosis and enterprise software deployment.',
      'Solid grasp of networking protocols and customer service patience.'
    ],
    skillGaps: ['Review Cisco CCNA basic concepts.'],
    description: `Cisco is looking for a Customer Systems & Desktop Support Specialist to support our distributed team and enterprise clients. You will troubleshoot network connectivity, deploy standardized workstation images, and manage ticket queues.`,
    keyResponsibilities: [
      'Provide tier 2 support for desktop operating systems, collaboration tools, and peripherals.',
      'Diagnose network configuration issues, VPN connections, and domain authentication failures.',
      'Maintain hardware tracking records and coordinate equipment swaps.'
    ],
    requirements: [
      '3+ years in IT technical support, desktop support, or network support.',
      'Understanding of TCP/IP, DNS, DHCP, and Active Directory.',
      'Strong problem-solving methodology and clear communication.'
    ],
    benefits: [
      'Remote-first flexibility with RTP campus access',
      'Employee Stock Purchase Plan (ESPP) with 15% discount',
      '10 days paid time off for volunteering per year',
      'Comprehensive healthcare and wellness reimbursement'
    ],
    postedDate: '1 day ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://jobs.cisco.com/',
    source: 'Cisco Careers'
  },
  {
    id: 'job-epic-games-it-15',
    title: 'Studio IT Support Specialist (Remote Eligible)',
    company: 'Epic Games',
    companyDomain: 'epicgames.com',
    location: 'Remote (Hiring in NC, WA, CA, TX, NY, GA, FL)',
    timezoneRequirement: 'US Eastern / Central',
    workArrangement: 'Remote · Cary, NC Studio Ties',
    salary: '$65,000 - $86,000 / yr + Studio Profit Bonus',
    matchScore: 91,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'WA', 'CA', 'TX', 'NY', 'GA', 'FL'],
    stateEligibilityNote: 'State-Specific Remote: Open to North Carolina (HQ Cary), WA, CA, TX, NY, GA, FL',
    isStateSpecific: true,
    trajectoryFitScore: 90,
    cultureFitScore: 93,
    skillOverlapScore: 91,
    careerTrajectoryAnalysis:
      'Support high-performance workstation builds, GPU diagnostics, and creative developer tools at the creators of Unreal Engine and Fortnite in Cary, NC.',
    cultureFitDetails: {
      companyStage: 'Premier Gaming & 3D Interactive Pioneer (4,000+ employees)',
      operatingStyle: 'High innovation velocity, creative problem solving, high-performance hardware focus',
      alignmentNotes: 'Directly values hands-on PC hardware repair, component replacement, and rapid user troubleshooting.'
    },
    skillOverlapDetails: {
      matchedCore: ['PC Hardware Assembly & Diagnostics', 'Component Replacement', 'Operating System Imaging', 'Active Directory'],
      transferableSkills: ['Python Scripting', 'Asset Tracking', 'High-End Peripherals'],
      gaps: ['Perforce version control basic client troubleshooting']
    },
    matchReasoning: [
      'Strong hardware repair and troubleshooting background (repairing broken hardware, component replacement).',
      'Local North Carolina presence matching Epic’s Cary headquarters.',
      'Python programming familiarity supports studio automation workflows.'
    ],
    skillGaps: ['Learn basic Perforce Helix Core terminology.'],
    description: `Epic Games is looking for a Studio IT Support Specialist to support our distributed developers, artists, and creators. You will troubleshoot high-end workstation hardware, configure developer software suites, and manage inventory.`,
    keyResponsibilities: [
      'Provide tier 2 desktop support for Windows workstations, GPU configurations, and specialized peripherals.',
      'Deploy system images and automate developer workstation onboarding tasks.',
      'Track IT assets, coordinate warranty replacements, and maintain lab hardware.'
    ],
    requirements: [
      '3+ years supporting PC hardware, Windows OS, and enterprise peripherals.',
      'Deep passion for hardware troubleshooting, component swaps, and PC diagnostics.',
      'Residency in North Carolina or an eligible studio state.'
    ],
    benefits: [
      'Competitive salary with generous annual studio bonus',
      '100% company-paid health, dental, and vision insurance premiums for you and family',
      '401(k) matching up to 7%',
      'Generous game and software allowance'
    ],
    postedDate: '2 days ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://www.epicgames.com/site/en-US/careers',
    source: 'Epic Games Careers'
  },
  {
    id: 'job-linode-akamai-16',
    title: 'Cloud Systems Customer Support Specialist (Remote)',
    company: 'Akamai (Linode Cloud)',
    companyDomain: 'akamai.com',
    location: 'Remote (US - All 50 States)',
    timezoneRequirement: 'US Timezones Flexible',
    workArrangement: '100% Remote · Cloud Infrastructure',
    salary: '$56,000 - $74,000 / yr + Certification Bonuses',
    matchScore: 92,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'PA', 'IL'],
    stateEligibilityNote: 'Nationwide Remote: Open to all 50 US states',
    isStateSpecific: false,
    trajectoryFitScore: 91,
    cultureFitScore: 94,
    skillOverlapScore: 91,
    careerTrajectoryAnalysis:
      'Bridge enterprise IT support into cloud server operations, DNS, virtual machine troubleshooting, and Linux hosting administration.',
    cultureFitDetails: {
      companyStage: 'Enterprise Cloud & CDN Pioneer (9,000+ employees, NASDAQ: AKAM)',
      operatingStyle: 'Technical curiosity, developer enablement, continuous learning culture',
      alignmentNotes: 'Directly values networking fundamentals, Python foundation, and structured troubleshooting methodology.'
    },
    skillOverlapDetails: {
      matchedCore: ['Networking Protocols', 'Hardware Diagnostics', 'Python Fundamentals', 'Customer Service'],
      transferableSkills: ['Cloud Computing Fundamentals', 'Linux Command Line', 'DNS & Routing'],
      gaps: ['Akamai Connected Cloud virtualization stack']
    },
    matchReasoning: [
      'Wake Tech certificates in Computing Fundamentals & Python match technical screen requirements.',
      'Solid foundation in networking protocols and hardware troubleshooting.',
      'Customer-first mindset ideal for technical developer support.'
    ],
    skillGaps: ['Spin up a basic Linux virtual instance on Linode/Akamai.'],
    description: `Akamai Cloud (formerly Linode) makes cloud computing simple and accessible. We are hiring a Cloud Systems Support Specialist to assist developers and businesses with virtual server deployments, DNS configurations, and connectivity troubleshooting.`,
    keyResponsibilities: [
      'Investigate technical tickets related to server connectivity, networking, and OS boot issues.',
      'Guide customers through command-line troubleshooting and cloud best practices.',
      'Collaborate with cloud operations teams to report infrastructure disruptions.'
    ],
    requirements: [
      '2+ years in technical support, help desk, or systems operations.',
      'Understanding of networking concepts (DNS, IP routing, SSH, firewalls).',
      'Enthusiasm for learning Linux systems and cloud technologies.'
    ],
    benefits: [
      '100% Remote work from any US state',
      'Free cloud hosting credits for personal projects',
      'Certification incentives ($500-$2,000 per completed tech certification)',
      'Comprehensive healthcare and 401(k) match'
    ],
    postedDate: '3 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://www.akamai.com/careers',
    source: 'Akamai Careers'
  },
  {
    id: 'job-redventures-it-17',
    title: 'Workplace Technology & Helpdesk Analyst (Remote - Carolinas)',
    company: 'Red Ventures',
    companyDomain: 'redventures.com',
    location: 'Remote (North Carolina & South Carolina)',
    timezoneRequirement: 'US Eastern (EST)',
    workArrangement: 'Remote · Carolinas Region Hub',
    salary: '$54,000 - $72,000 / yr + Performance Bonus',
    matchScore: 93,
    matchTier: 'Strong Match',
    eligibleStates: ['NC', 'SC'],
    stateEligibilityNote: 'State-Specific Remote: Restricted to North Carolina and South Carolina residents',
    isStateSpecific: true,
    trajectoryFitScore: 92,
    cultureFitScore: 93,
    skillOverlapScore: 94,
    careerTrajectoryAnalysis:
      'Join one of the largest digital media portfolios (CNET, Bankrate, Lonely Planet) headquartered in the Carolinas. Move into enterprise SaaS and workplace systems leadership.',
    cultureFitDetails: {
      companyStage: 'Private Digital Media Enterprise (4,500+ employees)',
      operatingStyle: 'High-energy, meritocratic, rapid career progression, data-driven',
      alignmentNotes: 'Deep familiarity with North Carolina tech talent and enterprise IT operations.'
    },
    skillOverlapDetails: {
      matchedCore: ['Active Directory', 'ServiceNow Ticketing', 'Hardware Imaging', 'User Provisioning', 'Desktop Troubleshooting'],
      transferableSkills: ['SaaS Tool Management', 'Asset Tracking', 'Python'],
      gaps: ['Slack enterprise grid automation']
    },
    matchReasoning: [
      'State-specific remote role tailored for Carolinas-based IT talent.',
      'Immediate proficiency in Active Directory, ServiceNow, and computer imaging.',
      'Demonstrated reliability supporting thousands of enterprise users.'
    ],
    skillGaps: ['Review Red Ventures portfolio brands and digital platforms.'],
    description: `Red Ventures is looking for a Workplace Technology Analyst to support our remote and hybrid workforce across our digital brands. You will resolve hardware and software tickets, maintain identity systems, and coordinate computer rollouts.`,
    keyResponsibilities: [
      'Provide tier 1 and tier 2 technical support for Windows and Mac computers.',
      'Manage user accounts, group policies, and software licenses in Active Directory and Okta.',
      'Track equipment inventory and coordinate warranty repairs with hardware vendors.'
    ],
    requirements: [
      '2+ years of hands-on experience in IT desktop or help desk support.',
      'Must reside in North Carolina or South Carolina.',
      'Strong diagnostic skills with a friendly, customer-focused approach.'
    ],
    benefits: [
      'Remote work with access to state-of-the-art campus amenities',
      'Generous paid time off policy',
      'Full healthcare coverage including medical, dental, and vision',
      '401(k) retirement plan with company match'
    ],
    postedDate: '4 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://www.redventures.com/careers',
    source: 'Red Ventures Careers'
  },
  {
    id: 'job-rackspace-support-18',
    title: 'Remote Tier 2 Systems & Infrastructure Support Specialist',
    company: 'Rackspace Technology',
    companyDomain: 'rackspace.com',
    location: 'Remote (US - All States)',
    timezoneRequirement: 'US Timezones Flexible',
    workArrangement: '100% Remote · "Fanatical Support" Culture',
    salary: '$60,000 - $80,000 / yr + Incentive Bonus',
    matchScore: 92,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'TN', 'PA'],
    stateEligibilityNote: 'Nationwide Remote: Open to all 50 states (Texas & US-wide remote workforce)',
    isStateSpecific: false,
    trajectoryFitScore: 91,
    cultureFitScore: 93,
    skillOverlapScore: 92,
    careerTrajectoryAnalysis:
      'Rackspace is famous for Fanatical Support®. Strong technical training programs allow you to transition from desktop support to cloud administration (AWS, Azure, GCP).',
    cultureFitDetails: {
      companyStage: 'Public Cloud Services Leader (6,000+ Rackers, NASDAQ: RXT)',
      operatingStyle: 'Customer obsession, collaborative team pods, ongoing certification incentives',
      alignmentNotes: 'Directly values patient customer service, ticketing speed, and hardware/systems diagnostics.'
    },
    skillOverlapDetails: {
      matchedCore: ['Hardware & Systems Diagnostics', 'Active Directory', 'ITSM Ticketing', 'Vendor Warranty Coordination'],
      transferableSkills: ['Python Foundations', 'Cloud Fundamentals', 'Network Protocols'],
      gaps: ['Cloud portal administration (AWS/Azure basic console)']
    },
    matchReasoning: [
      '8+ years in enterprise user support demonstrates high technical stamina.',
      'Extensive ticket management and hardware lifecycle experience.',
      'Python programming coursework provides strong foundation for automation.'
    ],
    skillGaps: ['Take a free AWS Cloud Practitioner or Azure Fundamentals primer.'],
    description: `Rackspace Technology is seeking a Tier 2 Systems Support Specialist to deliver Fanatical Support to our internal teams and clients. You will investigate complex technical issues, manage account access, and ensure high system uptime.`,
    keyResponsibilities: [
      'Provide tier 2 remote support for desktop environments, servers, and identity infrastructure.',
      'Coordinate hardware warranty service requests and asset tracking.',
      'Document troubleshooting resolutions and automate repetitive tasks using scripts.'
    ],
    requirements: [
      '3+ years in IT technical support, desktop support, or systems administration.',
      'Demonstrated skill with Active Directory, Windows enterprise OS, and ticketing systems.',
      'Strong commitment to customer satisfaction and clear written communication.'
    ],
    benefits: [
      '100% Remote work from anywhere in the US',
      'Free training and paid exams for AWS, Microsoft Azure, and Google Cloud certifications',
      'Generous paid time off and volunteer time',
      'Comprehensive health benefits and 401(k) matching'
    ],
    postedDate: '5 days ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://jobs.rackspace.com/',
    source: 'Rackspace Careers'
  },
  {
    id: 'job-squarespace-support-19',
    title: 'Customer Operations & Technical Support Associate',
    company: 'Squarespace',
    companyDomain: 'squarespace.com',
    location: 'Remote (US - 35 Eligible States)',
    timezoneRequirement: 'US Timezones (EST / CST / PST)',
    workArrangement: '100% Remote · Creative Web Platforms',
    salary: '$50,000 - $66,000 / yr + Equity',
    matchScore: 90,
    matchTier: 'Solid Fit',
    eligibleStates: ['NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA', 'IL', 'PA', 'All US'],
    stateEligibilityNote: 'Remote in 35 US states (including NC, TX, FL, OH, VA, GA, NY, CA)',
    isStateSpecific: false,
    trajectoryFitScore: 89,
    cultureFitScore: 92,
    skillOverlapScore: 89,
    careerTrajectoryAnalysis:
      'Leverage technical diagnostic skills and web programming coursework (HTML, CSS, JavaScript) to help entrepreneurs build their digital presence.',
    cultureFitDetails: {
      companyStage: 'Public Creative SaaS (1,700+ employees)',
      operatingStyle: 'Design excellence, high written communication polish, independent problem solving',
      alignmentNotes: 'Rewards candidates who communicate with clarity, empathy, and technical curiosity.'
    },
    skillOverlapDetails: {
      matchedCore: ['User Technical Support', 'Diagnostic Troubleshooting', 'Web Fundamentals (HTML/CSS/JS)'],
      transferableSkills: ['Ticketing SLAs', 'Documentation'],
      gaps: ['Squarespace CMS internal dashboard']
    },
    matchReasoning: [
      'Coursework and certificates in web programming (HTML, CSS, JavaScript, Python).',
      'Proven customer service and user enablement patience.',
      'Strong written communication skills.'
    ],
    skillGaps: ['Build a sample test site on Squarespace to understand the platform interface.'],
    description: `Squarespace empowers millions of dreamers, makers, and businesses. We are hiring a Customer Operations & Technical Support Associate to solve customer questions, troubleshoot custom code and domains, and provide friendly guidance.`,
    keyResponsibilities: [
      'Provide accurate, empathetic technical support via live chat and email.',
      'Diagnose issues with custom domains, DNS records, browser formatting, and platform tools.',
      'Identify and report bugs to product development teams with clear reproduction steps.'
    ],
    requirements: [
      '1-3 years in technical support, customer operations, or web help desk.',
      'Familiarity with basic HTML, CSS, and how web domains function.',
      'Strong writing speed, empathy, and attention to detail.'
    ],
    benefits: [
      '100% Remote work from home',
      'Free Squarespace accounts and subscriptions for you and friends',
      'Equity grant and 401(k) with company match',
      '100% company-paid healthcare premiums'
    ],
    postedDate: '1 week ago',
    applicantCompetition: 'Moderate',
    applyUrl: 'https://www.squarespace.com/about/careers',
    source: 'Squarespace Careers'
  },
  {
    id: 'job-duckduckgo-ops-20',
    title: 'Workplace Operations & Security Support Specialist',
    company: 'DuckDuckGo',
    companyDomain: 'duckduckgo.com',
    location: 'Remote (Worldwide / US)',
    timezoneRequirement: 'Any Timezone',
    workArrangement: '100% Remote · Privacy First',
    salary: '$70,000 - $92,000 / yr + Team Profit Share',
    matchScore: 91,
    matchTier: 'Strong Match',
    eligibleStates: ['All US', 'NC', 'TX', 'FL', 'OH', 'VA', 'GA', 'NY', 'CA'],
    stateEligibilityNote: 'Worldwide Remote / All 50 US States (100% distributed since founding)',
    isStateSpecific: false,
    trajectoryFitScore: 91,
    cultureFitScore: 95,
    skillOverlapScore: 90,
    careerTrajectoryAnalysis:
      'Privacy-first search and browser company: Lead internal hardware security, endpoint compliance, and remote user onboarding.',
    cultureFitDetails: {
      companyStage: 'Profitable Privacy Leader (250+ employees)',
      operatingStyle: 'Strictly asynchronous, transparent project roadmaps, no meetings, high autonomy',
      alignmentNotes: 'Deep respect for user privacy, independent initiative, and documented processes.'
    },
    skillOverlapDetails: {
      matchedCore: ['Endpoint Hardware Diagnostics', 'Security & Access Control', 'User Support', 'Asset Management'],
      transferableSkills: ['Python Scripting', 'Privacy Best Practices', 'Documentation'],
      gaps: ['Open-source privacy auditing tools']
    },
    matchReasoning: [
      'Experience managing enterprise domain security, Active Directory, and equipment provisioning.',
      'Proven capacity to work independently with zero micromanagement.',
      'Python programming foundation allows ongoing task automation.'
    ],
    skillGaps: ['Review DuckDuckGo’s open company culture guides and privacy mission.'],
    description: `DuckDuckGo is the independent privacy company. We are hiring a Workplace Operations & Security Support Specialist to maintain our distributed team’s laptops, manage password and identity tools, and ensure endpoint security standards.`,
    keyResponsibilities: [
      'Procure, configure, and securely ship encrypted workstations to team members globally.',
      'Administer cloud identity access, password managers, and multi-factor authentication systems.',
      'Resolve IT and hardware questions asynchronously through project tickets and chat.'
    ],
    requirements: [
      '3+ years in IT technical support, systems security, or desktop operations.',
      'Passion for digital privacy and endpoint security best practices.',
      'Exceptional written communication skills in English.'
    ],
    benefits: [
      '100% Remote from anywhere in the world',
      'Flexible hours with zero mandatory meetings',
      'Annual team profit sharing bonus',
      'Generous hardware and co-working allowance'
    ],
    postedDate: '1 week ago',
    applicantCompetition: 'Low',
    applyUrl: 'https://duckduckgo.com/hiring',
    source: 'DuckDuckGo Remote Jobs'
  }
];
