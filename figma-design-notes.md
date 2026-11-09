# Figma design notes

> **Direction change (2026-11-10):** Sushanta chose a full 3D site, taking bruno-simon.com as the reference for the *kind* of experience: an explorable real-time 3D world instead of scrolling pages. The Figma pages below become the plain-text fallback (same content, same pipeline concept). See "3D direction" at the end.

Source: https://www.figma.com/design/kiDhYUCZ8YMyfT5by4hLdC (page "v2 – pipeline"), read by eye in the browser on 2026-11-10.
Colours, fonts and sizes below are eyeballed, not exact values; pull exact ones with the Figma MCP when its limit resets.

## Concept

"The site runs like a CI/CD pipeline." Each page is a stage, each result is a green cell, and the run ends waiting for a recruiter's approval. Plain-English labels.

Stages: Home → Work → Case study → About → Contact (Contact shows a spinner: "waiting").

## Look

- Desktop frames 1440 wide; one mobile Home frame.
- Hero: dark navy band over a night-city highway photo (AI-generated, not a real place).
- Body: very light blue-grey background, dark navy text.
- Accent: bright green for buttons, check icons and result cells (light green tint).
- Bold grotesk sans for headings; monospace for tags/chips and small meta text.
- Nav: name left; Work, About, Contact, green "Resume" button right.
- Footer: navy strip "Sushanta Nandy, Gurugram" + LinkedIn, GitHub. Some pages end with a dark "Let's talk." band (Email, LinkedIn, GitHub).
- Yellow "MOTION ON THIS PAGE" strips are designer annotations, not site content.

## Motion

| Moment | What happens | Timing |
|---|---|---|
| Signal on the road | Green signal travels the road in the photo, hands off to the pipeline bar | 2.4s, once, on load |
| Pipeline run | Hero bar fills; each stage flips waiting → passed, ending on Contact "waiting on you". Slim version stays under the nav as page progress | stages 180ms each |
| Stage view fills | Table cells turn green left→right, row by row; numbers settle | 50ms stagger, 240ms/cell |
| Parallel lanes | Case study: three test lanes finish together vs one long serial lane | 1.6s, on scroll into view |
| Press and hover | Buttons scale to .97 on press; project rows nudge their arrow on hover (hover devices only) | 120–180ms |
| Copy email | Button morphs to "Copied" with slight blur crossfade | 200ms |

Easing cubic-bezier(.23,1,.32,1) for entrances. Content visible by default, never held back by motion. Reduced motion: movement removed, bar just shows progress.

Page notes: Work — dark panels loop a small diagram while on screen; cards enter with 50ms stagger on first load; hover lifts card 2px, click moves into the case study with a shared-element transition. Case study — the 40% counts up in sync with bars; next-project title wipes colour on hover. About — career line draws down on scroll; skill tags enter with 30ms stagger once; nothing else moves.

## Pages

### 01 Home
- Hero: "I test the systems that move other people's money." Sub: SDET specialising in wealth and asset management platforms. 5+ years, ISTQB certified, Playwright, Java and Appium. Based in Gurugram. Buttons: Download resume (green), See the results →.
- Pipeline bar: Profile (Who I am) · Results (Stage view) · Domain (Wealth platforms) · Projects (Six case studies) · Contact (Waiting on you).
- "Three roles, shown the way I read a pipeline." Table: Role | Automation | Pipeline | Specialism | Result
  - FNZ Group (running): migrated legacy regression suites to Playwright, parallel execution | BrowserStack and Jenkins | trading, portfolios, fees and charges, onboarding, HNI models | 40% faster release cycles; 60% less locator upkeep with Virtuoso
  - Deutsche Telekom Digital Labs: core E2E automation grown 0 → 220+ | Jenkins and BrowserStack, cross-device | LLM test case generator, API mocks with Charles Proxy and Mockoon | 30% less manual regression; 50% less environment downtime
  - Moolya Software Testing: 350+ Appium scripts, Robot Framework, Pytest | daily Jenkins pipelines | trade lifecycle, equity and fixed income, NAV, margin, P&L | 100+ API, performance and logic bugs tracked and closed
- Dark band: "Wealth platforms are where I'm most useful." + "A failed test here can mean a wrong fee or a broken trade…" List: Portfolio management, Trade order execution, Fees and charges engine, Transfers-out, Client onboarding, Multi-family and HNI models.
- "Selected work": 3 rows (title, company, green result, arrow) + "All six projects →".
- Closing: photo band with card "Waiting on your approval — Next stage: your team." Email Sushanta / Download resume.

### 01 Home – mobile
Same content stacked in one column.

### 02 Work
- Hero: "Work — Six projects, each with the result it shipped."
- Table: Project | Where | Stack | Result
  1. Playwright migration — FNZ — Playwright, BrowserStack, Jenkins — 40% faster release cycles
  2. AI testing with Virtuoso — FNZ — Virtuoso — 60% less locator upkeep
  3. Core E2E pipeline — DTDL — Jenkins, BrowserStack — 0 to 220+ scenarios, 30% less manual regression
  4. LLM test case generator — DTDL — LLM, API schemas — test inputs from API schemas
  5. API sandbox — DTDL — Charles Proxy, Mockoon — 50% less environment downtime
  6. Mobile automation at scale — Moolya — Appium, Jenkins — 350+ scripts, run daily
- Below: a grid of dark project cards (e.g. "GET /service → 200 from Mockoon", "350+") — partly covered by a footer, see issues.

### 03 Case study — "Moving a regression suite to Playwright"
- Sub: FNZ Group. Automation Test Analyst, Feb 2026 – Present.
- Left step list: The result ✓, What I did ✓, What made it hard (running), Next project.
- 40% faster release cycles + diagram: "One after another" (one long bar) vs "In parallel" (three short green bars). "Illustration of the idea, not measured data."
- What I did: led the migration of legacy regression suites to Playwright, standardised parallel execution, deployed to BrowserStack and Jenkins. Tags: Playwright, BrowserStack, Jenkins.
- What made it hard: placeholder box asking for your input.
- Next project → AI testing with Virtuoso.

### 04 About — "From mobile test scripts to automation strategy for wealth platforms."
- Sub: also runs delivery: burn-down reports, resource planning, milestone tracking for senior stakeholders.
- Build history: FNZ Group (running now), Deutsche Telekom Digital Labs, Moolya Software Testing (Best Mentor Award, 2023).
- Right column chips: Automation (Playwright, Selenium, Appium, RestAssured, TestNG, Pytest); Infrastructure (Jenkins, BrowserStack, GitLab, TeamCity, OpenSearch); AI and virtualisation (Virtuoso, LLM test generation, Charles Proxy, Mockoon).
- Credentials: ISTQB, AI For Everyone (DeepLearning.AI), CEH v11 (Skillsoft), HackerRank Java, 400+ LeetCode. Education: B.Tech OEC; Japanese Language Certificate, St. Stephen's; English, German (Goethe A1–A2), Japanese (basic).

### 05 Contact
- Full-bleed photo; card: "Waiting on your approval — Next stage: your team." Email nandysushanta8@gmail.com with Copy button; Download resume, LinkedIn, GitHub; "Gurugram, India". No phone number.

## Decisions (2026-11-10)

1. **Moolya wording stays.** Robot Framework, Pytest and "trade lifecycle, equity and fixed income, NAV, margin, P&L" are confirmed true, even though the résumé omits them.
2. **Case study "What made it hard":** waiting on Sushanta's text. Until it arrives, the section is left out of the build (no placeholder on the live site).
3. **Leftover layers:** ignore. Build each page as designed down to its intended ending; the content under the mid-page footers on Work and About is not built.
4. **Page ending:** Home ends with the photo "Next stage: your team." card; Work, Case study and About end with the dark "Let's talk." band. Contact is itself the photo card.
5. **Case studies:** only "Moving a regression suite to Playwright" gets a page. The other five stay as rows on Work with their results and no link.
6. **Hero photo (2026-11-10):** keep the Unsplash stock night-motorway photo (F7Rl02ir0Gg) instead of the Figma AI image.

## 3D direction

Reference: bruno-simon.com — a real-time 3D world (Three.js) the visitor drives through, where portfolio content sits in the world. Take the *idea* only. Do not reuse its car, world, models, art style, sounds or layout.

- **Own concept:** the CI/CD pipeline as a 3D world. The visitor moves through it (keyboard, drag or tap), and each stage is a station: Home/Profile → Results → Domain → Projects → About → Contact ("waiting on your approval"). Stations pass from waiting to green as the visitor reaches them.
- **Content:** same text and numbers as the Figma pages and PRODUCT.md. Nothing invented.
- **Recruiter safety net:**
  - Name, role, résumé download and contact are visible on the first screen, before and during loading.
  - A "Skip to plain version" link is always visible; the plain version is the Figma pages built as normal HTML.
  - `prefers-reduced-motion`, no WebGL, or a slow device → plain version automatically.
  - Loading shows progress and the core facts; target a fast first view, with the 3D streaming in after.
- **Movement (decided):** the visitor drives a vehicle freely through the world (keyboard on desktop, on-screen/touch controls on mobile).
- **Vehicle (decided):** a small glowing hover pod carrying a "build" through the pipeline. Not a car or truck.
- **Art style (decided):** night city from the Figma design: dark navy world, city lights, bright green accents; stations turn green when passed.
- **Sound (decided):** off by default, with a visible toggle.
