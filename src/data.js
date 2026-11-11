export const EMAIL = 'nandysushanta8@gmail.com';
export const RESUME = '/Sushanta-Nandy-Resume.pdf';
export const LINKEDIN = 'https://www.linkedin.com/in/sushantanandy';
export const GITHUB = 'https://github.com/SushantaNandy';

// Page order = pipeline order; the slim bar under the nav reads from this.
export const PAGES = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'work', label: 'Work', href: '/work/' },
  { key: 'case', label: 'Case study', href: '/work/playwright-migration/' },
  { key: 'about', label: 'About', href: '/about/' },
  { key: 'contact', label: 'Contact', href: '/contact/' },
];

export const ROLES = [
  {
    company: 'FNZ Group',
    status: 'running',
    automation: 'Migrated legacy regression suites to Playwright, with parallel execution',
    pipeline: 'BrowserStack and Jenkins',
    specialism: 'Trading, portfolios, fees and charges, onboarding, HNI models',
    results: ['40% faster release cycles', '60% less locator upkeep with Virtuoso'],
  },
  {
    company: 'Deutsche Telekom Digital Labs',
    status: 'passed',
    automation: 'Core E2E automation grown from 0 to 220+ scenarios',
    pipeline: 'Jenkins and BrowserStack, cross-device',
    specialism: 'LLM test case generator; API mocks with Charles Proxy and Mockoon',
    results: ['30% less manual regression', '50% less environment downtime'],
  },
  {
    company: 'Moolya Software Testing',
    status: 'passed',
    automation: '350+ Appium scripts, Robot Framework, Pytest',
    pipeline: 'Daily Jenkins pipelines',
    specialism: 'Trade lifecycle, equity and fixed income, NAV, margin, P&L',
    results: ['100+ API, performance and logic bugs tracked and closed'],
  },
];

// Projects, newest first. `scene` picks what the 3D workshop on /work/ shows for each one.
// Only facts from the résumé or confirmed by Sushanta; no invented numbers.
export const PROJECTS = [
  {
    id: 'playwright-migration', scene: 'migrate', where: 'FNZ', when: '2026 – now', client: 'Stonehage Fleming · Barclays · Quilter',
    title: 'From Virtuoso to Playwright', result: '40% faster release cycles', href: '/work/playwright-migration/',
    summary: "FNZ's regression suites lived in legacy tooling and the Virtuoso AI engine. I moved the legacy suites to Playwright with parallel runs, and I'm now migrating the Virtuoso suites into an in-house Playwright framework.",
    built: ['Migrated legacy regression suites to Playwright', 'Standardised parallel execution on BrowserStack and Jenkins', 'Configured Virtuoso for responsive UI checks', 'Now: moving the Virtuoso suites into an in-house Playwright framework'],
    numbers: [['40%', 'faster release cycles'], ['60%', 'less locator upkeep with Virtuoso']],
    stack: ['Playwright', 'Virtuoso', 'BrowserStack', 'Jenkins'],
  },
  {
    id: 'wealth-calcs', scene: 'ledger', where: 'FNZ', when: '2026 – now', client: 'Stonehage Fleming · Barclays · Quilter',
    title: 'Money that must add up', result: 'Pensions, adviser charges and fees, checked automatically',
    summary: 'On a wealth platform a wrong number is a wrong pension or a wrong fee. I automate the calculations and the flows around them, and I own the cron jobs that run on the database.',
    built: ['Pension calculation checks', 'Adviser charges and fees and charges matrices', 'Correspondence pods and portfolio management flows', 'Client reporting validation for HNI audits', 'User access and multi-layer permission tests', 'In charge of the cron jobs that run on the database'],
    numbers: [],
    stack: ['Playwright', 'Jenkins', 'Database cron jobs'],
  },
  {
    id: 'ai-test-writer', scene: 'ai', where: 'DTDL', when: '2024 – 2026', client: 'T-Mobile US · T-Life app',
    title: 'An AI that writes the tests', result: 'Test cases and their Playwright scripts, generated',
    summary: 'I built a proprietary AI tool for DTDL that generates test cases, then writes the Playwright scripts for them. It reads the API payload schemas to produce realistic test inputs.',
    built: ['LLM test case generator fed by API payload schemas', 'Generates synthetically accurate test inputs', 'Writes the Playwright script for each generated case'],
    numbers: [],
    stack: ['LLMs', 'Playwright', 'API schemas'],
  },
  {
    id: 'self-healing', scene: 'heal', where: 'DTDL', when: '2024 – 2026', client: 'T-Mobile US · T-Life app',
    title: 'A mobile framework that heals itself', result: 'Broken locators repaired by AI during the run',
    summary: 'I developed the core mobile automation framework for T-Life in Appium. It runs on BrowserStack devices, moved from Jenkins to GitLab CI, and repairs broken locators with AI instead of failing the run.',
    built: ['Core Appium framework, built from scratch', 'AI self-healing locators', 'Integrated with Jenkins, then migrated to GitLab CI', 'Runs on real devices on BrowserStack'],
    numbers: [],
    stack: ['Appium', 'GitLab CI', 'Jenkins', 'BrowserStack', 'AI'],
  },
  {
    id: 'core-e2e', scene: 'bars', where: 'DTDL', when: '2024 – 2026', client: 'T-Mobile US · T-Life app',
    title: 'Core E2E pipeline', result: '0 to 220+ scenarios, 30% less manual regression',
    summary: 'I joined T-Life at its first release, before any automation existed. I architected the E2E pipeline and grew it scenario by scenario, wired into Jenkins and BrowserStack for cross-device runs.',
    built: ['Primary E2E pipeline, from 0 to 220+ high-value scenarios', 'Cross-device runs on Jenkins and BrowserStack', 'Coverage strategy chosen to cut manual regression'],
    numbers: [['220+', 'E2E scenarios'], ['30%', 'less manual regression'], ['25%', 'more test bandwidth']],
    stack: ['Jenkins', 'BrowserStack', 'Appium'],
  },
  {
    id: 'app-health', scene: 'health', where: 'DTDL', when: '2024 – 2026', client: 'T-Mobile US · T-Life app',
    title: 'App health, in leadership inboxes', result: 'A health report from every daily suite run',
    summary: 'I integrated an observability matrix that checks the health of the app on the daily suite run, using Grafana and Dynatrace, plus a mail chain that delivers it to senior leadership.',
    built: ['Observability matrix on the daily suite run', 'Logs and metrics from Grafana and Dynatrace', 'Mail chain to senior leadership'],
    numbers: [],
    stack: ['Grafana', 'Dynatrace', 'Jenkins'],
  },
  {
    id: 'api-sandbox', scene: 'mock', where: 'DTDL', when: '2024 – 2026', client: 'T-Mobile US · T-Life app',
    title: 'API sandbox', result: '50% less environment downtime',
    summary: "I mocked microservice behaviour with Charles Proxy and Mockoon, so testing no longer waits on other teams' servers.",
    built: ['Mock microservices with Mockoon', 'Traffic rewriting with Charles Proxy', 'Fewer downstream server dependencies'],
    numbers: [['50%', 'less environment downtime']],
    stack: ['Charles Proxy', 'Mockoon'],
  },
  {
    id: 'mobile-scale', scene: 'phones', where: 'Moolya', when: '2022 – 2024', client: 'Hotstar · Paytm',
    title: 'Mobile automation at scale', result: '350+ scripts, run daily',
    summary: "At Moolya, a Bengaluru testing startup, I tested Hotstar's OTT app and Paytm. That's where I learned CI, device clouds and API debugging.",
    built: ['350+ Appium scripts on daily Jenkins pipelines', 'CI on Jenkins and TeamCity', 'Mobile runs on BrowserStack', 'API testing in Postman, trace logs in OpenSearch', 'Robot Framework and Pytest suites'],
    numbers: [['350+', 'mobile scripts'], ['100+', 'bugs closed'], ['2023', 'Best Mentor Award']],
    stack: ['Appium', 'Jenkins', 'TeamCity', 'BrowserStack', 'Postman', 'OpenSearch'],
  },
  {
    id: 'quant', scene: 'candles', where: 'Personal', when: 'After hours', client: 'Learning project',
    title: 'Quant trading platform', result: 'Algo trading and AI backtesting, in progress',
    summary: "Outside work I'm learning quantitative trading by building my own platform: algorithmic strategies, backtested with AI.",
    built: ['Algo trading strategies', 'AI-assisted backtesting'],
    numbers: [],
    stack: ['Algo trading', 'Backtesting', 'AI'],
  },
];
