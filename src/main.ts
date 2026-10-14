import './style.css'
import amadeusWordmark from './assets/amadeus-wordmark-dark-sky.svg'
import wavesImage from './assets/amadeus-graphic-waves-lightsky.png'
import { posts, renderMarkdown, reports, type Post } from './content'

type Route =
  | { name: 'home' }
  | { name: 'start' }
  | { name: 'story' }
  | { name: 'library' }
  | { name: 'post'; slug: string }

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

const icons = {
  arrow: '<span aria-hidden="true">↗</span>',
  arrowRight: '<span aria-hidden="true">→</span>',
  spark: '<span aria-hidden="true">✳</span>',
  check: '<span aria-hidden="true">✓</span>',
  menu: '<span aria-hidden="true">☰</span>',
  mail: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5.5" width="18" height="13" rx="2"></rect><path d="m4.2 7.2 7.8 5.2 7.8-5.2"></path></svg>',
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${date}T12:00:00`),
  )
}

function getRoute(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '')

  if (hash.startsWith('post/')) {
    return { name: 'post', slug: hash.replace('post/', '') }
  }

  if (hash === 'start') return { name: 'start' }
  if (hash === 'story') return { name: 'story' }
  if (hash === 'library') return { name: 'library' }
  return { name: 'home' }
}

function navLink(href: string, label: string, active = false): string {
  return `<a class="nav-link${active ? ' is-active' : ''}" href="${href}"${active ? ' aria-current="page"' : ''}>${label}</a>`
}

function renderHeader(route: Route): string {
  const active = route.name === 'home' ? 'home' : route.name

  return `
    <header class="site-header">
      <a class="wordmark" href="#/" aria-label="Amadeus Open Source home">
        <img class="wordmark-image" src="${amadeusWordmark}" alt="" width="1920" height="646" />
        <span class="wordmark-product">Open Source</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">${icons.menu}<span class="sr-only">Toggle navigation</span></button>
      <nav class="site-nav" id="site-nav" aria-label="Main navigation">
        ${navLink('#/story', 'Our story', active === 'story')}
        ${navLink('#/start', 'Start here', active === 'start')}
        ${navLink('#/library', 'Library', active === 'library')}
        <a class="nav-cta" href="https://github.com/AmadeusITGroup" target="_blank" rel="noreferrer">Explore GitHub ${icons.arrow}</a>
      </nav>
    </header>
  `
}

function renderFooter(): string {
  return `
    <footer class="site-footer">
      <div>
        <a class="wordmark wordmark-footer" href="#/" aria-label="Amadeus Open Source home">
          <img class="wordmark-image" src="${amadeusWordmark}" alt="" width="1920" height="646" />
          <span class="wordmark-product">Open Source</span>
        </a>
      </div>
      <div class="footer-links">
        <div><p class="eyebrow">Explore</p><a href="#/story">Our story</a><a href="#/start">Start here</a><a href="#/library">Library</a></div>
        <div><p class="eyebrow">Connect</p><a href="https://github.com/AmadeusITGroup" target="_blank" rel="noreferrer">GitHub ${icons.arrow}</a><a href="mailto:opensource@amadeus.com">Contact us ${icons.arrow}</a></div>
      </div>
    </footer>
  `
}

function renderPill(label: string): string {
  return `<span class="pill">${escapeHtml(label)}</span>`
}

function renderPostCard(post: Post, featured = false): string {
  return `
    <article class="post-card${featured ? ' post-card-featured' : ''}">
      <div class="post-card-top"><span class="category-label">${escapeHtml(post.category)}</span><span>${escapeHtml(post.readTime)}</span></div>
      <h3><a href="#/post/${encodeURIComponent(post.slug)}">${escapeHtml(post.title)}</a></h3>
      <p>${escapeHtml(post.deck)}</p>
      <div class="post-card-bottom"><span>${formatDate(post.date)}</span><a class="text-link" href="#/post/${encodeURIComponent(post.slug)}">Read ${icons.arrowRight}</a></div>
    </article>
  `
}

function renderHero(): string {
  return `
    <section class="hero section-shell">
      <div class="hero-copy">
        <p class="kicker"><span class="kicker-dot"></span>Amadeus Open Source</p>
        <h1>Engineering Travel in the Open.</h1>
        <p class="hero-lede">Amadeus builds the <strong>technology</strong> that helps power the <strong>global travel industry</strong>. Across a large and <strong>diverse engineering ecosystem</strong>, our teams use, create, maintain and contribute to various open source projects in areas such as <strong>Observability, Frontend, Developer Experience, AI, DevOps and Cloud-native technologies</strong>. Explore our projects, tools and contributions, and see how Amadeus engineers collaborate with the wider open source community.</p>
      </div>
      <div class="hero-stats" aria-label="Amadeus open source key figures">
        <div class="hero-stats-card">
          <ul class="hero-stats-list">
            <li><strong>65</strong><span>projects initiated since 2024</span></li>
            <li><strong>~220</strong><span>active members and contributors</span></li>
            <li><strong>350+</strong><span>followers and growing</span></li>
            <li><strong>~1,000</strong><span>contributions to +90 open source projects from Amadeus employees, per <a href="https://insights.linuxfoundation.org/organization/amadeus" target="_blank" rel="noreferrer">Linux Insights</a></span></li>
          </ul>
        </div>
      </div>
    </section>
  `
}

function renderImpact(): string {
  const projects = [
    {
      name: 'Perses',
      href: 'https://perses.dev/',
      tag: '#Observability',
      logo: 'https://perses.dev/assets/images/logos/Perses_light_theme.png',
      desc: 'Initiated in Amadeus, Perses is the dashboard tool to display a variety of observability data. Today supports Prometheus metrics, Tempo traces, Loki logs & Pyroscope profiles.',
    },
    {
      name: 'Argo CD',
      href: 'https://argo-cd.readthedocs.io/en/stable/',
      tag: '#DevOps · #UI/UX',
      logo: 'https://argo-cd.readthedocs.io/en/stable/assets/logo.png',
      desc: 'Argo CD is a core project of the Argo ecosystem, powering declarative GitOps continuous delivery for Kubernetes. Amadeus contributions spread across Argo CD’s hydration engine, CLI, webhooks, and UI/UX.',
    },
    {
      name: 'YGGY',
      href: 'https://amadeusitgroup.github.io/Yggy/',
      tag: '#Cloud-Native',
      logo: amadeusWordmark,
      logoAlt: 'Amadeus logo',
      desc: 'Yggy is an open-source framework for managing network connectivity across hybrid and multi-cloud environments. It acts as a single source of truth, translating connectivity requirements into platform-specific configurations.',
    },
    {
      name: 'ng-bootstrap',
      href: 'https://ng-bootstrap.github.io/#/home',
      tag: '#UI',
      logo: 'https://ng-bootstrap.github.io/img/logo.svg',
      desc: 'Mostly backed by Amadeus, ng-bootstrap is a widely used open-source library that brings Bootstrap into the Angular ecosystem to support modern web applications.',
    },
    {
      name: 'AgnosUI',
      href: 'https://www.agnosui.dev/latest/',
      tag: '#UI',
      logo: amadeusWordmark,
      logoAlt: 'Amadeus logo',
      desc: 'AgnosUI is an Amadeus open source project. Its framework-agnostic factories power consistent headless components for Angular, React and Svelte, usable with any CSS framework.',
    },
    {
      name: 'Otter',
      href: 'https://amadeusitgroup.github.io/otter/#/home',
      tag: '#UI',
      logo: amadeusWordmark,
      logoAlt: 'Amadeus logo',
      desc: 'Otter is an Amadeus open source project. This highly modular framework provides a common platform to accelerate Angular-based web app development, and lets you customize applications through a Content Management System.',
    },
    {
      name: 'Quarkus',
      href: 'https://quarkus.io/',
      tag: '#Cloud-Native',
      logo: 'https://github.com/quarkusio.png?size=200',
      desc: 'Quarkus is a cloud-native Java framework designed for fast, efficient application development across Kubernetes, JVM and native environments. Amadeus engineers actively contribute to the Quarkus ecosystem, including its core framework and extensions.',
    },
    {
      name: 'UVbox',
      href: 'https://github.com/AmadeusITGroup/uvbox#uvbox',
      tag: '#Developer Experience · #Python',
      logo: amadeusWordmark,
      logoAlt: 'Amadeus logo',
      desc: 'UVbox is an Amadeus open source project. Its standalone executable bootstraps an embedded uv install that downloads the right Python version, creates a virtual environment, installs dependencies and runs your app in isolation — no Python required on the target system, for any platform from any platform.',
    },
    {
      name: 'AI Primitives Hub',
      href: 'https://amadeusitgroup.github.io/ai-primitives-hub/',
      tag: '#Developer Experience · #AI',
      logo: amadeusWordmark,
      logoAlt: 'Amadeus logo',
      desc: 'AI Primitives Hub is an Amadeus open source project. A visual marketplace and registry for discovering, installing and managing Copilot prompt bundles in VS Code, it is the open source package manager for GenAI assets, gathering prompt libraries from multiple sources.',
    },
    {
      name: 'Carmen',
      href: 'https://greensoftware.foundation/tools/carmen/',
      tag: '#Sustainability',
      logo: 'https://greensoftware.foundation/assets/gsf-logo-full.svg',
      logoAlt: 'Green Software Foundation logo',
      desc: 'CARbon Measurement Emissions Engine measures software emissions at scale, helping accelerate practical, standardised green software tools and enabling community contributions.',
    },
  ]
  const cards = projects.map((p) => `<article class="project-card"><div class="project-card-top"><img src="${p.logo}" alt="${escapeHtml(p.logoAlt ?? `${p.name} logo`)}" loading="lazy"><span class="project-tag">${escapeHtml(p.tag)}</span></div><h3><a href="${p.href}" target="_blank" rel="noreferrer">${escapeHtml(p.name)} ${icons.arrowRight}</a></h3><p>${escapeHtml(p.desc)}</p></article>`).join('')
  return `
    <section class="projects-section" id="projects">
      <div class="section-shell">
        <div class="section-heading"><div><p class="eyebrow eyebrow-light">What we build together</p><h2>Some Open Source contributions examples</h2></div></div>
        <div class="projects-carousel">
          <div class="projects-track" tabindex="0" role="region" aria-label="Some open source contributions examples, scrollable list">${cards}</div>
          <div class="projects-controls">
            <button class="projects-arrow projects-arrow-prev" type="button" aria-label="Previous projects">${icons.arrowRight}</button>
            <div class="projects-dots" role="group" aria-label="Choose a page of projects"></div>
            <button class="projects-arrow projects-arrow-next" type="button" aria-label="Next projects">${icons.arrowRight}</button>
          </div>
        </div>
        <div class="projects-footer">
          <p class="projects-footer-text">Above are some examples of Amadeus engineers contributions, we could list as well: <a href="https://opentelemetry.io/" target="_blank" rel="noreferrer">OpenTelemetry</a>, <a href="https://prometheus.io/" target="_blank" rel="noreferrer">Prometheus</a>, <a href="https://microcks.io/" target="_blank" rel="noreferrer">Microcks</a> and so many more…</p>
          <a class="text-link text-link-light" href="https://github.com/AmadeusITGroup" target="_blank" rel="noreferrer">Explore our projects ${icons.arrowRight}</a>
        </div>
      </div>
    </section>
  `
}



function renderFollow(): string {
  return `
    <section class="follow-section">
      <div class="section-shell">
        <div class="follow-grid">
          <p class="eyebrow">Keep up with us</p>
          <h2>Follow us on</h2>
          <div class="follow-links">
            <a class="follow-card" style="background-image: url(${escapeHtml(wavesImage)})" href="https://www.linkedin.com/showcase/amadeus-for-engineers/posts/" target="_blank" rel="noreferrer"><span class="follow-kind">LinkedIn</span><strong>Amadeus for Engineers</strong><span class="follow-arrow">${icons.arrowRight}</span></a>
            <a class="follow-card" style="background-image: url(${escapeHtml(wavesImage)})" href="https://amadeus.com/en/engineering-blog" target="_blank" rel="noreferrer"><span class="follow-kind">Blog</span><strong>Amadeus Engineering blog</strong><span class="follow-arrow">${icons.arrowRight}</span></a>
          </div>
        </div>
        <div class="invitation">
          <h2>Have a question,<br /><em>an idea or a story?</em></h2>
          <a class="button button-primary" href="mailto:opensource@amadeus.com">Start a conversation ${icons.arrow}</a>
        </div>
      </div>
    </section>
  `
}

function renderHome(): string {
  return `${renderHero()}${renderImpact()}${renderFollow()}`
}

function renderStory(): string {
  return `
    <section class="section-shell story-intro"><div class="story-statement"><span class="quote-mark">“</span><p>We believe the best open source work starts with generosity: sharing context, making room for others and leaving the path clearer than we found it.</p><span class="quote-attribution">— The Amadeus OSPO team</span></div><div class="story-side"><aside class="manifesto-card"><p class="eyebrow">Our open source principles</p><a class="manifesto-link" href="https://github.com/AmadeusITGroup/opensource-manifesto">Amadeus Open Source Manifesto ${icons.arrowRight}</a><p class="manifesto-note">Our manifesto lists principles that guide how we use and contribute to open source in a responsible way.</p></aside></div></section>
    <!-- Copy below was supplied by the OSPO owner. The milestone dates, memberships, product and event names are reported claims that still need confirmation from the accountable owner before publication. -->
    <section class="section-shell journey-section"><div class="journey-grid"><div class="journey-heading"><p class="eyebrow">How we got here</p><h1>Our open source journey</h1><ol class="journey-timeline" aria-label="Milestones of the open source journey"><li><span class="tl-year">2013–14</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>First open source steps</strong></div></li><li><span class="tl-year">2017</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Joined the Linux Foundation</strong></div></li><li><span class="tl-year">2018–2021</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Sharing and publications</strong></div></li><li><span class="tl-year">2021</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Joined the OSPO Alliance</strong></div></li><li><span class="tl-year">2023</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Amadeus Open Source Manifesto</strong></div></li><li><span class="tl-year">2024</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Open source culture thrives at Amadeus</strong></div></li><li><span class="tl-year">2025</span><span class="tl-dot" aria-hidden="true"></span><div class="tl-text"><strong>Open Source Board and Community</strong></div></li></ol></div><div class="journey-copy"><p>Amadeus’ open source journey began more than a decade ago and has progressively evolved from early experimentation into a mature, strategic engineering capability.</p><p>Between 2013 and 2014, Amadeus made its first significant open source steps with technologies such as Aria Templates, which marked the beginning of active internal conversations around using, governing and learning from open source ecosystems.</p><p>By 2017, Amadeus joined the Linux Foundation, a meaningful milestone that positioned the company within the world’s most influential cloud and open technology communities. This move amplified our ability to learn, influence and contribute to foundational open source work shaping global infrastructure standards.</p><p>Between 2018 and 2021, open source found its way within Amadeus, with publications and dedicated open source events with Amadeus top management, encouraging contributions and promoting open source values and culture.</p><p>In 2021 Amadeus strengthened its commitment by joining the OSPO Alliance, gaining access to guidance and best practices for structuring internal open source operations and enabling effective participation in global communities.</p><p>The publication of the Amadeus Open Source Manifesto in 2023 formalised our principles and affirmed our commitment to responsible openness. It signalled a cultural shift and helped establish a shared language across engineering teams.</p><p>2024 saw a surge in engagement: interest grew significantly across engineering and leadership as open collaboration became increasingly central to how we build, document and improve our software.</p><p>In 2025, this momentum materialised structurally with the launch of the Open Source Community and the creation of the Amadeus Open Source Board, responsible for shaping contributions, advancing governance and supporting engineers on open source topics. Late 2025 also saw the Madrid Patent Wall inauguration, symbolising the cultural expansion of innovation and openness across global sites.</p><p>2026 is marked by increased open source maturity at Amadeus. Our Open Source Board and processes now actively facilitate contributions, clarify expectations and highlight open source values and impact across product teams, engineering leadership and the wider open source community.</p></div></div></section>
    <section class="members-section"><div class="section-shell"><div class="section-heading"><div><p class="eyebrow">Where we belong</p><h2>We are members of</h2></div></div><ul class="members-grid"><li><a class="member-card" href="https://ospo-alliance.org/"><img src="https://ospo-alliance.org/images/logos/OSPO_Alliance_Logo_wide.svg" alt="OSPO Alliance logo" loading="lazy"><span>OSPO Alliance</span></a></li><li><a class="member-card" href="https://www.cncf.io/"><img src="https://www.cncf.io/wp-content/uploads/2023/04/cncf-main-site-logo.svg" alt="Cloud Native Computing Foundation logo" loading="lazy"><span>Cloud Native Computing Foundation</span></a></li><li><a class="member-card" href="https://www.linuxfoundation.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/e/ed/Linux_Foundation_Logo.svg" alt="Linux Foundation logo" loading="lazy"><span>Linux Foundation</span></a></li><li><a class="member-card" href="https://greensoftware.foundation/"><img src="https://greensoftware.foundation/assets/gsf-logo-full.svg" alt="Green Software Foundation logo" loading="lazy"><span>Green Software Foundation</span></a></li><li><a class="member-card" href="https://www.eclipse.org/"><img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Eclipse_Foundation_Logo.svg" alt="Eclipse Foundation logo" loading="lazy"><span>Eclipse Foundation</span></a></li></ul></div></section>\r\n  `
}

function renderStart(): string {
  const checklist = (items: [string, string][]): string => `<ul class="checklist">${items.map(([title, why]) => `<li><span>${icons.check}</span><div><strong>${title}</strong><p>${why}</p></div></li>`).join('')}</ul>`
  const pathCard = (id: string, title: string, intro: string, body: string): string => `<section class="path-card"><h2 class="path-card-title"><button class="path-card-summary" type="button" aria-expanded="false" aria-controls="${id}"><span class="path-card-name">${title}</span><span class="path-card-hint" aria-hidden="true"><span class="toggle-open">See the steps</span><span class="toggle-close">Hide the steps</span><span class="expand-chevron"></span></span></button></h2><p class="path-intro">${intro}</p><div class="path-body" id="${id}" hidden>${body}</div></section>`

  const pathOneBody = `<h3 class="path-subhead">Before you propose a change</h3>${checklist([['Read the README', 'Get the full project context before you change anything.'], ['Check the contribution guide', "See the project's preferred way to contribute."], ['Look at recent issues and pull requests', 'See what is in progress and avoid duplicate work.'], ['Understand how the community communicates', 'Follow the channels the project actually uses.']])}<h3 class="path-subhead">Good first steps</h3>${checklist([['Improve the documentation', 'Docs are often the fastest way to help.'], ['Reproduce an issue with a minimal test case', 'A clear reproduction makes a bug fixable.'], ['Clarify the setup instructions', 'Save the next person the friction you just met.'], ['Ask a well-prepared question', 'Context turns a question into a contribution.'], ['Propose a very small fix', 'Small changes are quick to review and easy to accept.']])}<h3 class="path-subhead">What a good contribution guide and code of conduct tell you</h3>${checklist([['How to set up the project', 'So your change runs as the maintainers expect.'], ['How to open an issue or a pull request', 'So your work lands where the project expects it.'], ['What review expectations look like', 'So you know what a maintainer will look for.'], ['How decisions are made', 'So you understand who decides, and how.'], ['How to communicate respectfully', 'So the conversation stays constructive.'], ['Where to ask for help', 'So you are not blocked on your own.']])}<p class="path-note">Even experienced contributors read these files for every project, because every community has its own conventions.</p>`
  const pathTwoBody = `<h3 class="path-subhead">A concise checklist</h3>${checklist([['Confirm that the contribution is in scope', 'Check the project wants this change before you build it.'], ['Read the contribution guide and code of conduct', "Align with the project's conventions from the start."], ['Check recent activity', 'Someone may already be working on it.'], ['Open or join a discussion if the direction is unclear', 'Agree on the approach before you write code.'], ['Prepare the smallest useful change', 'A focused change is easier to review and merge.'], ['Explain the context and evidence in the pull request', 'Reviewers decide faster when the why and the proof are clear.']])}<aside class="path-callout"><strong>Contributing as an Amadeus engineer?</strong><p>If the project is external, check the relevant internal open source process and contact the OSPO when needed. For small fixes, keep the path proportionate and pragmatic.</p></aside>`

  const projectIdeaCard = `<div class="start-card start-card-expand"><h2><button class="start-card-summary" type="button" aria-expanded="false" aria-controls="start-project"><span>I have a project idea</span><span class="start-card-hint" aria-hidden="true"><span class="toggle-open">Read more</span><span class="toggle-close">Hide</span><span class="expand-chevron"></span></span></button></h2><p>Shape the why, check the community need and prepare a responsible path to sharing.</p><div class="start-card-body" id="start-project" hidden><p>Amadeus engineers: consult the internal Confluence page Open Source Initiative &gt; Publishing of Amadeus Open Source Projects.</p><p>If you have any questions or want more internal guidance, join the OpenSource@1A internal Teams group.</p></div></div>`
  const helpCard = `<div class="start-card start-card-expand"><h2><button class="start-card-summary" type="button" aria-expanded="false" aria-controls="start-help"><span>I need help or advice</span><span class="start-card-hint" aria-hidden="true"><span class="toggle-open">Email us</span><span class="toggle-close">Hide</span><span class="expand-chevron"></span></span></button></h2><p>Bring the context. We can help you find the right people, process or resource.</p><div class="start-card-body" id="start-help" hidden><a class="mail-link" href="mailto:opensource@amadeus.com">${icons.mail}<span>opensource@amadeus.com</span></a></div></div>`

  return `
    <section class="page-hero section-shell page-hero-start"><p class="kicker"><span class="kicker-dot"></span>A good place to begin</p><h1>Everyone has<br /><em>a first step.</em></h1><p class="page-lede">You do not need to know all the rules before you join the conversation. Choose the path that sounds most like you and take one small step.</p></section>
    <section class="section-shell path-cards">${pathCard('start-path-01', 'New to <em>open source?</em>', 'This path is for anyone who is interested but not yet sure where to start. Open source contribution is not only about code, and a useful first contribution can be small, simple and well prepared. Start small, take time to observe and do not rush into a pull request.', pathOneBody)}${pathCard('start-path-02', 'I want to <em>contribute</em>', 'I already know how open source works and I have a project in mind. The core steps stay the same whether the project is hosted by Amadeus or elsewhere: understand the problem, align with the project conventions, keep the change easy to review and collaborate transparently with maintainers.', pathTwoBody)}</section>
    <section class="section-shell start-more"><div class="start-grid">${projectIdeaCard}${helpCard}</div></section>
  `
}

function renderLibrary(): string {
  return `
    <section class="page-hero section-shell library-hero"><p class="kicker"><span class="kicker-dot"></span>The OSPO library</p><h1>Useful things,<br /><em>made shareable.</em></h1><p class="page-lede">Guides, field notes, stories and reports for people making open source part of how they work.</p></section>
    <section class="section-shell library-content"><div class="library-toolbar"><div><p class="eyebrow">Content as code</p><p>New posts live in <code>src/content/posts</code>. Write in Markdown, open a pull request and let the site do the rest.</p></div><div class="filter-list" role="group" aria-label="Filter library"><button class="filter-button is-selected" type="button" data-filter="all">All</button><button class="filter-button" type="button" data-filter="Guide">Guides</button><button class="filter-button" type="button" data-filter="Field note">Field notes</button><button class="filter-button" type="button" data-filter="Story">Stories</button></div></div><div class="library-grid" id="library-grid">${posts.map((post) => `<div class="library-item" data-category="${escapeHtml(post.category)}">${renderPostCard(post)}</div>`).join('')}</div></section>
    <section class="section-shell reports-section"><div class="section-heading"><div><p class="eyebrow">Reports & briefs</p><h2>Proof, not performance theatre.</h2></div><p class="section-heading-note">We use evidence to learn where the program can remove friction and create more value.</p></div><div class="reports-grid">${reports.map((report) => `<article class="report-card"><div class="report-top"><span class="category-label">${escapeHtml(report.type)}</span><span class="report-status status-${report.status.toLowerCase().replace(' ', '-')}">${escapeHtml(report.status)}</span></div><h3>${escapeHtml(report.title)}</h3><p>${escapeHtml(report.description)}</p><ul>${report.highlights.map((highlight) => `<li>${icons.check}${escapeHtml(highlight)}</li>`).join('')}</ul><div class="report-date">${escapeHtml(report.date)}</div></article>`).join('')}</div></section>
  `
}

function renderPost(post: Post): string {
  return `
    <article class="article-page section-shell"><a class="back-link" href="#/library">${icons.arrowRight} Back to the library</a><div class="article-header"><div class="post-card-top"><span class="category-label">${escapeHtml(post.category)}</span><span>${escapeHtml(post.readTime)}</span></div><h1>${escapeHtml(post.title)}</h1><p class="article-deck">${escapeHtml(post.deck)}</p><div class="article-meta"><span>${formatDate(post.date)}</span>${post.tags.map(renderPill).join('')}</div></div><div class="article-layout"><aside class="article-aside"><p class="eyebrow">In this note</p><p>Ideas, practices and stories to help open source travel further.</p><a class="text-link" href="mailto:opensource@amadeus.com">Share a thought ${icons.arrow}</a></aside><div class="article-body">${renderMarkdown(post.body)}</div></div></article>
  `
}

function renderNotFound(): string {
  return `<section class="page-hero section-shell"><p class="kicker"><span class="kicker-dot"></span>That page moved</p><h1>Let’s find<br /><em>another way in.</em></h1><p class="page-lede">The page you are looking for is not here, but there is plenty more to explore.</p><a class="button button-primary" href="#/">Back home ${icons.arrow}</a></section>`
}

let carouselResizeBound = false

function buildCarouselDots(track: HTMLElement): void {
  const dotsWrap = track.parentElement?.querySelector<HTMLElement>('.projects-dots')
  if (!dotsWrap) return
  const width = Math.max(1, track.clientWidth)
  const count = Math.max(1, Math.round(track.scrollWidth / width))
  dotsWrap.innerHTML = ''
  if (count < 2) {
    updateCarouselDots(track)
    return
  }
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  for (let index = 0; index < count; index += 1) {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = 'projects-dot'
    dot.setAttribute('aria-label', `Show projects page ${index + 1} of ${count}`)
    dot.addEventListener('click', () => {
      track.scrollTo({ left: index * width, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      updateCarouselDots(track)
    })
    dotsWrap.append(dot)
  }
  updateCarouselDots(track)
}

function updateCarouselDots(track: HTMLElement): void {
  const carousel = track.parentElement
  const dotsWrap = carousel?.querySelector<HTMLElement>('.projects-dots')
  if (!dotsWrap) return
  const width = Math.max(1, track.clientWidth)
  const count = Math.max(1, Math.round(track.scrollWidth / width))
  const active = Math.min(count - 1, Math.round(track.scrollLeft / width))
  dotsWrap.querySelectorAll<HTMLButtonElement>('.projects-dot').forEach((dot, index) => {
    const isActive = index === active
    dot.classList.toggle('is-active', isActive)
    if (isActive) dot.setAttribute('aria-current', 'true')
    else dot.removeAttribute('aria-current')
  })
  const prev = carousel?.querySelector<HTMLButtonElement>('.projects-arrow-prev')
  const next = carousel?.querySelector<HTMLButtonElement>('.projects-arrow-next')
  if (prev) prev.disabled = active <= 0
  if (next) next.disabled = active >= count - 1
}

function bindProjectCarousels(): void {
  const tracks = document.querySelectorAll<HTMLElement>('.projects-track')
  if (!tracks.length) return

  const rebuild = (): void => {
    window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('.projects-track').forEach((track) => buildCarouselDots(track))
    })
  }

  tracks.forEach((track) => {
    buildCarouselDots(track)
    track.addEventListener('scroll', () => updateCarouselDots(track), { passive: true })
    if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(track)
    const prev = track.parentElement?.querySelector<HTMLButtonElement>('.projects-arrow-prev')
    const next = track.parentElement?.querySelector<HTMLButtonElement>('.projects-arrow-next')
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const step = (direction: -1 | 1): void => {
      track.scrollBy({ left: direction * track.clientWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
      updateCarouselDots(track)
    }
    prev?.addEventListener('click', () => step(-1))
    next?.addEventListener('click', () => step(1))
  })

  if (!carouselResizeBound) {
    carouselResizeBound = true
    window.addEventListener('resize', rebuild)
  }
}

function bindDisclosures(): void {
  document.querySelectorAll<HTMLButtonElement>('.path-card-summary, .start-card-summary').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true'
      button.setAttribute('aria-expanded', String(!expanded))
      const panel = document.getElementById(button.getAttribute('aria-controls') ?? '')
      if (panel) panel.hidden = expanded
    })
  })
}

function bindInteractions(): void {
  const menuToggle = document.querySelector<HTMLButtonElement>('.menu-toggle')
  const nav = document.querySelector<HTMLElement>('.site-nav')

  menuToggle?.addEventListener('click', () => {
    const isOpen = nav?.classList.toggle('is-open') ?? false
    menuToggle.setAttribute('aria-expanded', String(isOpen))
  })

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open')
      menuToggle?.setAttribute('aria-expanded', 'false')
    })
  })

  document.querySelectorAll<HTMLButtonElement>('.filter-button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-button').forEach((item) => item.classList.remove('is-selected'))
      button.classList.add('is-selected')
      const filter = button.dataset.filter ?? 'all'
      document.querySelectorAll<HTMLElement>('.library-item').forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.category !== filter
      })
    })
  })

  bindProjectCarousels()
  bindDisclosures()
}

function render(): void {
  const route = getRoute()
  const content = route.name === 'home'
    ? renderHome()
    : route.name === 'story'
      ? renderStory()
      : route.name === 'start'
        ? renderStart()
        : route.name === 'library'
          ? renderLibrary()
          : route.name === 'post'
            ? renderPost(posts.find((post) => post.slug === route.slug) ?? posts[0])
            : renderNotFound()

  if (!app) return

  app.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a>${renderHeader(route)}<main id="main-content" tabindex="-1">${content}</main>${renderFooter()}`
  window.scrollTo({ top: 0, behavior: 'instant' })
  bindInteractions()
}

window.addEventListener('hashchange', render)
render()
