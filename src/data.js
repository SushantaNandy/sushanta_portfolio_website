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

export const PROJECTS = [
  { id: 'playwright-migration', title: 'Playwright migration', where: 'FNZ', stack: 'Playwright, BrowserStack, Jenkins', result: '40% faster release cycles', href: '/work/playwright-migration/' },
  { id: 'virtuoso', title: 'AI testing with Virtuoso', where: 'FNZ', stack: 'Virtuoso', result: '60% less locator upkeep' },
  { id: 'core-e2e', title: 'Core E2E pipeline', where: 'DTDL', stack: 'Jenkins, BrowserStack', result: '0 to 220+ scenarios, 30% less manual regression' },
  { id: 'llm-generator', title: 'LLM test case generator', where: 'DTDL', stack: 'LLM, API schemas', result: 'Test inputs generated from API schemas' },
  { id: 'api-sandbox', title: 'API sandbox', where: 'DTDL', stack: 'Charles Proxy, Mockoon', result: '50% less environment downtime' },
  { id: 'mobile-scale', title: 'Mobile automation at scale', where: 'Moolya', stack: 'Appium, Jenkins', result: '350+ scripts, run daily' },
];
