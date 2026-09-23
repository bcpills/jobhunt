export interface SampleResume {
  id: string;
  name: string;
  targetRole: string;
  yearsExp: number;
  seniority: string;
  text: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'fullstack-engineer',
    name: 'Alex Rivera',
    targetRole: 'Senior Full-Stack Engineer',
    yearsExp: 6,
    seniority: 'Senior',
    text: `ALEX RIVERA
Remote / San Francisco, CA | alex.rivera.eng@example.com | github.com/alexrivera-dev | linkedin.com/in/alexrivera-dev

SENIOR FULL-STACK ENGINEER (React / TypeScript / Node.js)
Results-driven Full-Stack Engineer with 6+ years of experience architecting distributed web applications and high-throughput SaaS platforms in remote-first environments. Deep expertise in modern frontend architectures (React, Next.js, TypeScript, Tailwind) and scalable microservices (Node.js, GraphQL, PostgreSQL, Redis, AWS). Passionate about high-leverage async communication, design systems, and web performance optimization.

CORE TECHNICAL SKILLS
- Languages & Frontend: TypeScript, JavaScript (ESNext), React 18/19, Next.js, Redux Toolkit, Zustand, Tailwind CSS, HTML5/CSS3, WebSockets
- Backend & Data: Node.js, Express, Fastify, GraphQL, REST APIs, PostgreSQL, Redis, Prisma, Docker, Kafka
- Cloud & Infrastructure: AWS (S3, Lambda, ECS, CloudFront), Terraform, Vercel, CI/CD (GitHub Actions)
- Remote & Async Practices: RFC-driven design, asynchronous issue tracking, distributed team sprint planning, comprehensive technical documentation

PROFESSIONAL EXPERIENCE

Senior Full-Stack Engineer | CloudSync Technologies (100% Remote)
March 2022 – Present
- Spearheaded frontend rewrite of core collaborative workspace from legacy monolithic codebase to Next.js and TypeScript, slashing p95 bundle load time by 48% and reducing customer churn by 14%.
- Designed and delivered real-time document collaboration engine using WebSockets, CRDTs, and Redis pub/sub, scaling concurrent active editors from 2,000 to over 35,000.
- Authored 12+ architectural RFCs and led async code review cadence across an 8-person distributed team spanning 5 time zones.
- Automated end-to-end integration testing and preview deployments via GitHub Actions, decreasing weekly regression bugs by 32%.

Full-Stack Software Engineer | Horizon Financial SaaS (Hybrid Remote / Austin, TX)
August 2019 – February 2022
- Built customer onboarding and analytics dashboard handling $40M+ monthly transaction volume using React, Node.js, and PostgreSQL.
- Optimized slow SQL reporting queries and implemented multi-tier caching with Redis, improving median query execution speed by 3.4x.
- Partnered closely with Product and UX teams to establish company-wide accessible UI component library, accelerating new feature development velocity by 25%.

Junior Web Developer | PixelCraft Studio
July 2018 – July 2019
- Built responsive client web portals and internal tooling using JavaScript, React, and RESTful APIs.
- Collaborated in daily agile standups and sprint retrospectives.

EDUCATION
B.S. in Computer Science | University of California, Davis (2014 – 2018)`,
  },
  {
    id: 'product-manager',
    name: 'Sarah Lin',
    targetRole: 'Senior Product Manager',
    yearsExp: 7,
    seniority: 'Senior',
    text: `SARAH LIN
Remote / Seattle, WA | sarah.lin.pm@example.com | linkedin.com/in/sarahlin-product

SENIOR PRODUCT MANAGER (B2B SaaS / Product-Led Growth)
Analytical and user-obsessed Senior Product Manager with 7+ years driving 0-to-1 feature discovery, expansion revenue, and product-led growth (PLG) loops for enterprise cloud software. Track record of turning qualitative user insights and SQL data into high-converting self-serve funnels. Exceptional async communicator skilled at leading cross-functional engineering, design, and GTM teams across global timezones.

CORE COMPETENCIES
- Product Strategy: Product-Led Growth (PLG), Enterprise B2B SaaS, 0-to-1 Product Development, Customer Journey Mapping, Pricing & Packaging
- Analytics & Execution: SQL, Mixpanel, Amplitude, Segment, PostHog, A/B Testing, User Interviews, Agile / Scrum, Roadmapping
- Remote Leadership: Async PRD authoring, Loom walkthroughs, stakeholder alignment across distributed US & EU teams

PROFESSIONAL EXPERIENCE

Senior Product Manager, Growth & Self-Serve | Elevate Cloud (Remote)
January 2022 – Present
- Led cross-functional growth squad (6 engineers, 2 designers, 1 data analyst) responsible for the self-serve signup-to-paid conversion funnel.
- Launched revamped free-trial onboarding workflow with interactive product tours, increasing trial-to-paid conversion from 4.2% to 6.8% and adding $2.1M in ARR.
- Re-architected pricing tiers and checkout experience based on 45+ customer interviews and price-sensitivity analysis, lifting average revenue per user (ARPU) by 19%.
- Established rigorous experimentation program running 25+ concurrent A/B tests per year with documented statistical significance thresholds.

Product Manager | Omnichannel CRM Systems (Remote)
June 2019 – December 2021
- Owned core messaging automation engine used by 1,400+ mid-market customers.
- Prioritized backlog, defined specs, and partnered with distributed engineering squads across EMEA and Americas to ship automated workflow builders.
- Reduced onboarding setup drop-off by 27% by releasing template libraries and contextual inline guides.

Associate Product Manager | VentureLab Accelerator
July 2017 – May 2019
- Conducted competitive market analyses and managed customer feedback loops for early-stage portfolio startups.

EDUCATION
B.A. in Economics & Information Systems | University of Washington (2013 – 2017)`,
  },
  {
    id: 'data-ml-engineer',
    name: 'Marcus Vance',
    targetRole: 'Data & Machine Learning Engineer',
    yearsExp: 5,
    seniority: 'Senior',
    text: `MARCUS VANCE
Remote / Denver, CO | marcus.vance.data@example.com | github.com/marcusvance-ml

DATA & MACHINE LEARNING ENGINEER
Data & ML Engineer with 5+ years building production ETL pipelines, feature stores, and generative AI microservices. Specialized in Python, PyTorch, LangChain, Snowflake, dbt, and Kafka. Experienced in deploying model inference APIs at scale and operating fault-tolerant data infrastructure in distributed, remote-first startups.

CORE TECHNICAL SKILLS
- Programming & Frameworks: Python (FastAPI, Flask, Pandas, NumPy), PyTorch, Hugging Face Transformers, LangChain, LlamaIndex, SQL
- Data Engineering & Pipelines: Apache Airflow, dbt, Apache Kafka, Snowflake, PostgreSQL, BigQuery, Vector Databases (Pinecone, Qdrant, Chroma)
- MLOps & Cloud: Docker, Kubernetes, AWS (SageMaker, S3, EMR), MLflow, CI/CD, Weights & Biases

PROFESSIONAL EXPERIENCE

Senior Machine Learning Engineer | CogniWave AI (Remote)
April 2022 – Present
- Architected and deployed RAG (Retrieval-Augmented Generation) document intelligence pipeline serving 500k+ daily queries with sub-250ms p90 latency.
- Built hybrid semantic search and vector retrieval system combining dense embeddings with BM25 keyword matching, lifting search retrieval accuracy by 22%.
- Created automated evaluation framework for LLM outputs measuring hallucination rate, factuality, and latency benchmarks across model updates.
- Mentored junior data engineers and spearheaded weekly async paper-reading discussions.

Data Engineer | StreamMetric Data Solutions (Remote)
October 2019 – March 2022
- Designed scalable streaming ingestion pipelines in Apache Kafka and PySpark processing 120M+ events/day into Snowflake data warehouse.
- Implemented dbt data transformation models and automated data quality tests, reducing broken dashboard incidents by 40%.
- Optimized Snowflake compute warehouses and partitioned tables, driving an annual cloud cost savings of $65,000.

EDUCATION
B.S. in Data Science & Statistics | University of Colorado Boulder (2015 – 2019)`,
  },
  {
    id: 'customer-success-lead',
    name: 'Elena Gomez',
    targetRole: 'Customer Success & Operations Lead',
    yearsExp: 5,
    seniority: 'Mid-Level',
    text: `ELENA GOMEZ
Remote / Chicago, IL | elena.gomez.cs@example.com | linkedin.com/in/elenagomez-cx

CUSTOMER SUCCESS & CLIENT OPERATIONS LEAD (Remote B2B SaaS)
Strategic, empathetic Customer Success and Operations Lead with 5+ years driving customer retention, proactive onboarding, and net revenue retention (NRR) for high-growth SaaS companies. Expert at establishing scalable support workflows, async customer documentation, and health-score monitoring systems in 100% remote organizations.

CORE COMPETENCIES
- Customer Success Strategy: Onboarding Optimization, Retention & Churn Reduction, Upsell & Expansion, Executive Business Reviews (QBRs)
- Tools & Systems: Salesforce, HubSpot, Zendesk, Intercom, Gainsight, Notion, Jira, Slack, Zapier
- Skills: Async Client Management, Team Leadership, Process Automation, Voice of Customer (VoC) Reporting

PROFESSIONAL EXPERIENCE

Customer Success Lead | TalentFlow SaaS (100% Remote)
February 2022 – Present
- Managed portfolio of 45 high-touch enterprise accounts representing $3.2M in annual recurring revenue with a 112% Net Revenue Retention (NRR) rate.
- Designed standardized 30-day onboarding playbook that reduced average time-to-first-value (TTFV) from 24 days to 11 days.
- Built automated churn risk alert triggers in Zendesk and HubSpot using customer usage drop signals, enabling proactive interventions that saved $280k in ARR.
- Authored comprehensive customer knowledge base articles and Loom video tutorials, cutting inbound routine ticket volume by 35%.

Senior Customer Success Specialist | WorkflowHQ (Remote)
July 2020 – January 2022
- Managed account renewals and customer health scores for 80+ mid-market customers.
- Delivered over 100 interactive product training sessions and quarterly strategic check-ins.
- Achieved highest CSAT rating (98.4%) across the support and success organization for four consecutive quarters.

Customer Support Associate | TaskMaster Software
June 2019 – June 2020
- Handled tier-1 and tier-2 customer support tickets via chat, email, and scheduled video calls.

EDUCATION
B.A. in Communications | Northwestern University (2015 – 2019)`,
  },
];
