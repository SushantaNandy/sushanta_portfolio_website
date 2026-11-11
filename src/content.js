// Copy for the black site. Every fact comes from the résumé or was confirmed by Sushanta.
export const STRENGTHS = [
  { n: '01', title: 'Automation', kicker: 'Frameworks that last', body: 'I move legacy regression suites onto Playwright, Selenium, Appium and RestAssured, with parallel runs on BrowserStack and Jenkins, so a release is gated by evidence instead of a manual checklist.' },
  { n: '02', title: 'Domain', kicker: 'Wealth platforms, end to end', body: 'Trading, portfolio management, fees and charges, transfers-out, onboarding and multi-family HNI models. A failed test here can mean a wrong fee or a broken trade, so I automate the flows that must hold up in client reporting and audits.' },
  { n: '03', title: 'Speed', kicker: 'Shorter feedback loops', body: '40% faster release cycles at FNZ. An E2E pipeline grown from 0 to 220+ scenarios at Deutsche Telekom. API mocks with Charles Proxy and Mockoon that cut environment downtime by 50%.' },
  { n: '04', title: 'Precision', kicker: 'Numbers that must be right', body: 'Automation matrices for fees and charges calculations, client reporting checks, user access and multi-layer permissions. Plus the delivery side: burn-down charts, resource planning and goal-wise status for senior stakeholders.' },
];

// The home-page story, told as one pipeline run: each career stage is a stage that passes as you scroll.
// status: 'pass' turns green when read, 'run' is the stage still in progress, 'next' is after hours.
export const STORY = [
  {
    stage: '00', when: '2016 – Dec 2021', where: 'OEC', title: 'The wrong branch', role: 'B.Tech, Mechanical Engineering', status: 'pass',
    story: 'I trained to design machines, not software. After internships at Tata Steel and Uranium Corporation of India, I finished my degree in December 2021 with no CS background, and decided to build a career in software testing anyway.',
    built: ['Picked up Java on the way (HackerRank certified)', 'Solved 400+ LeetCode problems', 'ISTQB certified'],
    stack: ['Java', 'ISTQB'],
    log: ['$ git checkout -b software', "Switched to a new branch 'software'"],
  },
  {
    stage: '01', when: 'Jan 2022 – Jan 2024', where: 'Moolya · Bengaluru', title: 'Learning at a startup', role: 'Software Engineer', status: 'pass',
    story: 'My first team was Moolya, a Bengaluru testing startup. Its clients were my classroom: Hotstar, an OTT app streaming to millions, and Paytm. I learned how real releases ship, and how they break.',
    built: ['350+ Appium mobile scripts on daily Jenkins pipelines', 'CI on Jenkins and TeamCity, mobile runs on BrowserStack', 'API testing in Postman, trace logs in OpenSearch', '100+ API, performance and logic bugs closed', 'Best Mentor Award, 2023'],
    stack: ['Appium', 'Jenkins', 'TeamCity', 'BrowserStack', 'Postman', 'OpenSearch', 'Robot Framework', 'Pytest'],
    log: ['$ run mobile-regression --cloud browserstack', '350+ scripts · daily'],
  },
  {
    stage: '02', when: 'Jan 2024 – Jan 2026', where: 'Deutsche Telekom Digital Labs · Gurugram', title: 'From the first release', role: 'SDET', status: 'pass',
    story: "Deutsche Telekom is one of the two biggest telecom providers in the world, and number one in Germany. I joined the TMUS team building T-Life, T-Mobile US's customer app, at its first release, and built its test automation from scratch as the app grew.",
    built: ['Core E2E pipeline from 0 to 220+ scenarios on Jenkins and BrowserStack', 'Appium mobile framework with AI self-healing locators, moved from Jenkins to GitLab CI', 'An in-house AI tool that writes test cases, then the Playwright scripts for them', 'LLM test case generator fed by API payload schemas', 'Daily app-health matrix from Grafana and Dynatrace, mailed to leadership', 'Charles Proxy and Mockoon mocks: 50% less environment downtime', '30% less manual regression, 25% more test bandwidth'],
    stack: ['Appium', 'Playwright', 'GitLab CI', 'Jenkins', 'BrowserStack', 'Grafana', 'Dynatrace', 'LLMs', 'Mockoon', 'Charles Proxy'],
    log: ['$ e2e --suite t-life --heal-locators', '0 → 220+ scenarios', '$ mail health-report --to leadership', 'sent · daily'],
  },
  {
    stage: '03', when: 'Feb 2026 – now', where: 'FNZ · Gurugram', title: "Other people's money", role: 'Automation Test Analyst', status: 'run',
    story: 'FNZ runs wealth management platforms for clients like Stonehage Fleming, Barclays and Quilter. Here a wrong number is a wrong pension or a wrong fee, so I automate the calculations that have to be exact.',
    built: ['Pension calculations, correspondence, portfolio management and adviser charges', 'Own the cron jobs that run on the database', 'Migrating the Virtuoso suites to an in-house Playwright framework (in progress)', '40% faster release cycles'],
    stack: ['Playwright', 'Virtuoso', 'Jenkins', 'BrowserStack'],
    log: ['$ migrate virtuoso → playwright', 'running…'],
  },
  {
    stage: '04', when: 'After hours', where: 'Personal project', title: 'Learning to trade with code', role: 'Quant trading platform', status: 'next',
    story: "Outside work I'm learning quantitative trading by building my own platform: algorithmic strategies, and backtesting them with AI.",
    built: ['Algo trading strategies', 'AI-assisted backtesting'],
    stack: ['Algo trading', 'AI', 'Backtesting'],
    log: ['$ backtest --strategy draft', 'nightly'],
  },
];

// Short excerpts from LinkedIn recommendations Sushanta received (linkedin.com/in/sushantanandy).
export const RECS = [
  { quote: 'He is one of the strongest SDETs I have worked with. He has an excellent eye for detail, a strong understanding of test automation, and a deep commitment to quality.', name: 'Saksham Agrawal', role: 'Senior Quality Analyst', rel: 'Worked on the same team · Apr 2026' },
  { quote: 'He is a quick problem solver, detail-oriented, and consistently delivers high-quality results.', name: 'Amir Khan', role: 'Lead SDET', rel: 'Managed Sushanta directly · Mar 2026' },
  { quote: 'He consistently demonstrated strong testing fundamentals, attention to detail, and a proactive approach to quality.', name: 'Prakhar Singh', role: 'SDET-II at Sprinklr, ex-DTDL', rel: 'Worked together at DTDL for 1.4 years · Feb 2026' },
];

// Things about him that the Home story and the Work page don't cover.
export const OFF_CLOCK = [
  { icon: '⛺', title: 'Bug reports, even off duty', body: 'Shopping for a tent for a Ladakh hike, I hit a checkout blocker and a raw localization string on a big retailer\'s site, and wrote the whole thing up on LinkedIn.' },
  { icon: '📄', title: 'Reads the research', body: 'I took apart the Ray paper on distributed AI backends, from its task scheduler to its self-healing lineage, to explain it as a video series.' },
  { icon: '📈', title: 'Learning AI by building', body: 'A customer churn prediction project, and now my own quant trading platform with AI backtesting.' },
  { icon: '🛡️', title: 'Thinks like an attacker', body: 'Certified in CEH v11 hacking phases and TryHackMe Pre Security, because good tests find the holes first.' },
  { icon: '🗣️', title: 'Three languages, two in progress', body: 'English at full professional level, German at Goethe A1–A2, and a Japanese language certificate from St. Stephen\'s College.' },
  { icon: '🤝', title: 'Teaches what I learn', body: 'Best Mentor Award at Moolya in 2023, and 2,600+ people follow what I share on LinkedIn.' },
];

export const CREDENTIALS = [
  { name: 'ISTQB Certified Tester', by: 'ISTQB', when: '' },
  { name: 'SOLID Principles', by: 'Udemy', when: 'Jul 2025' },
  { name: 'Pre Security', by: 'TryHackMe', when: 'Nov 2024' },
  { name: 'Rainmaker', by: 'Rainmaker', when: 'Nov 2024' },
  { name: 'Generative AI for Everyone', by: 'DeepLearning.AI', when: 'May 2024' },
  { name: 'AI For Everyone', by: 'DeepLearning.AI', when: 'May 2024' },
  { name: 'CEH v11: Hacking Phases & Concepts', by: 'Skillsoft', when: 'Feb 2024' },
  { name: 'Java (Basic)', by: 'HackerRank', when: 'Sep 2023' },
  { name: 'Best Mentor Award', by: 'Moolya Software Testing', when: '2023' },
  { name: 'Japanese Language Certificate', by: "St. Stephen's College", when: '2025–26' },
  { name: 'B.Tech, Mechanical Engineering', by: 'OEC', when: '2016–21' },
];

export const TOOLS = ['Playwright', 'Selenium', 'Appium', 'RestAssured', 'TestNG', 'Jenkins', 'BrowserStack', 'Virtuoso'];
