import './style.css'
import { news, posts, renderMarkdown, reports, type Post } from './content'

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
      <a class="wordmark" href="#/" aria-label="Amadeus OSPO home">
        <span class="wordmark-mark" aria-hidden="true">Amadeus</span>
        <span class="wordmark-product">Open Source<br /><strong>Program Office</strong></span>
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
        <a class="wordmark wordmark-footer" href="#/" aria-label="Amadeus OSPO home">
          <span class="wordmark-mark" aria-hidden="true">Amadeus</span>
          <span class="wordmark-product">Open Source<br /><strong>Program Office</strong></span>
        </a>
        <p class="footer-note">Making open source easier to understand,<br />participate in and grow.</p>
      </div>
      <div class="footer-links">
        <div><p class="eyebrow">Explore</p><a href="#/story">Our story</a><a href="#/start">Start here</a><a href="#/library">Library</a></div>
        <div><p class="eyebrow">Connect</p><a href="https://github.com/AmadeusITGroup" target="_blank" rel="noreferrer">GitHub ${icons.arrow}</a><a href="mailto:opensource@amadeus.com">Say hello ${icons.arrow}</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 Amadeus OSPO</span><span>Built in the open · Content as code</span></div>
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
        <p class="kicker"><span class="kicker-dot"></span>Amadeus Open Source Program Office</p>
        <h1>Build openly.<br /><em>Move together.</em></h1>
        <p class="hero-lede">We help people at Amadeus use, contribute to and create open source—responsibly, confidently and with a little more joy.</p>
        <div class="hero-actions"><a class="button button-primary" href="#/start">Find your first step ${icons.arrow}</a><a class="button button-quiet" href="#/story">Why open source? ${icons.arrowRight}</a></div>
      </div>
      <div class="hero-art" aria-label="Abstract illustration representing open collaboration">
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit orbit-three"></div>
        <div class="orbit-dot dot-one"></div><div class="orbit-dot dot-two"></div><div class="orbit-dot dot-three"></div>
        <div class="hero-sticker sticker-one">open<br />by design</div><div class="hero-sticker sticker-two">share<br />the lift</div>
        <div class="hero-center"><span>am</span><small>open<br />source</small></div>
      </div>
      <div class="scroll-cue"><span class="scroll-line"></span><span>Scroll to explore</span></div>
    </section>
  `
}

function renderSignalStrip(): string {
  return `
    <section class="signal-strip" aria-label="What we make easier">
      <div class="section-shell signal-grid">
        <p class="signal-intro"><span class="eyebrow">What we make easier</span><strong>Open source is a team sport.</strong></p>
        <div class="signal-item"><span class="signal-number">01</span><div><h3>Understand</h3><p>Clear context for better choices.</p></div></div>
        <div class="signal-item"><span class="signal-number">02</span><div><h3>Participate</h3><p>A path from first question to contribution.</p></div></div>
        <div class="signal-item"><span class="signal-number">03</span><div><h3>Share</h3><p>Stories, patterns and proof that travel.</p></div></div>
      </div>
    </section>
  `
}

function renderFeatured(): string {
  const featured = posts.find((post) => post.featured) ?? posts[0]
  const supporting = posts.filter((post) => post.slug !== featured.slug).slice(0, 2)

  return `
    <section class="section-shell section-block" id="featured">
      <div class="section-heading"><div><p class="eyebrow">From the field</p><h2>Ideas worth passing on.</h2></div><a class="text-link" href="#/library">View the library ${icons.arrowRight}</a></div>
      <div class="featured-grid">${renderPostCard(featured, true)}<div class="supporting-posts">${supporting.map((post) => renderPostCard(post)).join('')}</div></div>
    </section>
  `
}

function renderImpact(): string {
  return `
    <section class="impact-section">
      <div class="section-shell impact-grid">
        <div class="impact-copy"><p class="eyebrow eyebrow-light">The point of the work</p><h2>Less friction.<br /><em>More contribution.</em></h2><p>Good open source programs do not add another gate. They make the right thing easier to do: find trusted code, share improvements upstream and build communities that last.</p><a class="button button-light" href="#/story">See how we work ${icons.arrow}</a></div>
        <div class="impact-orbit" aria-hidden="true"><div class="impact-ring ring-a"></div><div class="impact-ring ring-b"></div><div class="impact-ring ring-c"></div><span class="impact-label label-a">trust</span><span class="impact-label label-b">craft</span><span class="impact-label label-c">community</span><span class="impact-core">open<br /><strong>impact</strong></span></div>
      </div>
    </section>
  `
}

function renderNews(): string {
  return `
    <section class="section-shell section-block news-section"><div class="section-heading"><div><p class="eyebrow">Keep in the loop</p><h2>Notes from the open.</h2></div><a class="text-link" href="#/library">All updates ${icons.arrowRight}</a></div><div class="news-list">${news.map((item) => `<a class="news-row" href="${item.href}"><span class="news-kind">${escapeHtml(item.kind)}</span><span class="news-title">${escapeHtml(item.title)}</span><span class="news-date">${formatDate(item.date)}</span><span class="news-arrow">${icons.arrowRight}</span></a>`).join('')}</div></section>
  `
}

function renderHome(): string {
  return `${renderHero()}${renderSignalStrip()}${renderFeatured()}${renderImpact()}${renderNews()}<section class="section-shell invitation"><p class="eyebrow">You are welcome here</p><h2>Have a question,<br /><em>an idea or a story?</em></h2><a class="button button-primary" href="mailto:opensource@amadeus.com">Start a conversation ${icons.arrow}</a></section>`
}

function renderStory(): string {
  return `
    <section class="page-hero section-shell"><p class="kicker"><span class="kicker-dot"></span>The reason we show up</p><h1>Open source is<br /><em>how we move forward.</em></h1><p class="page-lede">Technology gets better when more people can understand it, improve it and build on it. Our job is to help make that possible at Amadeus.</p></section>
    <section class="section-shell story-intro"><div class="story-statement"><span class="quote-mark">“</span><p>We believe the best open source work starts with generosity: sharing context, making room for others and leaving the path clearer than we found it.</p><span class="quote-attribution">— The Amadeus OSPO team</span></div><div class="story-aside"><p class="eyebrow">Our role</p><p>We are a small, connected team that helps open source happen across Amadeus. We advise, enable, connect and tell the story.</p></div></section>
    <section class="principles-section"><div class="section-shell"><div class="section-heading"><div><p class="eyebrow">How we think</p><h2>Principles, not posters.</h2></div></div><div class="principles-grid"><article><span class="principle-number">01</span><h3>Make it useful</h3><p>Start from a real problem. Good open source creates value for people beyond the team that began it.</p></article><article><span class="principle-number">02</span><h3>Make it understandable</h3><p>Clear docs, visible decisions and a welcoming contribution path are part of the product.</p></article><article><span class="principle-number">03</span><h3>Make it sustainable</h3><p>Trust takes maintenance. We invest in communities, upstream relationships and the people who care for them.</p></article></div></div></section>
    <section class="section-shell story-next"><div><p class="eyebrow">A practical starting point</p><h2>Open source works<br /><em>best in the open.</em></h2></div><div><p>Whether you are consuming a dependency, contributing to a project or considering a public release, we can help you find the right next step.</p><a class="text-link" href="#/start">Find your path ${icons.arrowRight}</a></div></section>
  `
}

function renderStart(): string {
  const steps = [
    ['I am new to open source', 'Start with the language, habits and small wins that make participation feel natural.', 'first-steps'],
    ['I want to contribute', 'Find a project, prepare a useful change and build confidence through practice.', 'first-steps'],
    ['I have a project idea', 'Shape the why, check the community need and prepare a responsible path to sharing.', 'open-by-default'],
    ['I need help or advice', 'Bring the context. We can help you find the right people, process or resource.', 'story'],
  ]

  return `
    <section class="page-hero section-shell page-hero-start"><p class="kicker"><span class="kicker-dot"></span>A good place to begin</p><h1>Everyone has<br /><em>a first step.</em></h1><p class="page-lede">You do not need to know all the rules before you join the conversation. Choose the path that sounds most like you and take one small step.</p></section>
    <section class="section-shell start-grid">${steps.map(([title, description, href], index) => `<a class="start-card" href="#/${href === 'story' ? 'story' : `post/${href}`}"${index === 3 ? ' data-mail-link="true"' : ''}><span class="start-index">0${index + 1}</span><h2>${title}</h2><p>${description}</p><span class="start-card-arrow">${icons.arrow}</span></a>`).join('')}</section>
    <section class="section-shell checklist-section"><div><p class="eyebrow">The five-minute version</p><h2>Before you open<br /><em>that pull request.</em></h2></div><ol class="checklist"><li><span>${icons.check}</span><div><strong>Know the why</strong><p>What problem are you helping solve?</p></div></li><li><span>${icons.check}</span><div><strong>Read the room</strong><p>Find the README, guide and recent conversations.</p></div></li><li><span>${icons.check}</span><div><strong>Keep it focused</strong><p>Make the smallest useful change you can.</p></div></li><li><span>${icons.check}</span><div><strong>Share what you learned</strong><p>Every contribution can make the next one easier.</p></div></li></ol></section>
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
