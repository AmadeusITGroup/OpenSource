import { marked } from 'marked'
import DOMPurify from 'dompurify'

export type ContentType = 'Guide' | 'Field note' | 'Story' | 'Report' | 'Announcement'

export interface Post {
  slug: string
  title: string
  deck: string
  date: string
  category: ContentType
  readTime: string
  tags: string[]
  featured: boolean
  body: string
}

export interface NewsItem {
  title: string
  excerpt: string
  date: string
  kind: 'Announcement' | 'Event' | 'Community note'
  href: string
}

export interface Report {
  title: string
  description: string
  date: string
  type: 'Snapshot' | 'Brief' | 'Playbook'
  status: 'Draft' | 'Coming soon' | 'Published'
  highlights: string[]
}

const rawPostFiles = import.meta.glob('./content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

type FrontmatterValue = string | string[] | boolean

function parseFrontmatterValue(value: string): FrontmatterValue {
  const trimmed = value.trim()

  if (trimmed === 'true' || trimmed === 'false') {
    return trimmed === 'true'
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
  }

  return trimmed.replace(/^['"]|['"]$/g, '')
}

function parseFrontmatter(source: string): {
  metadata: Record<string, FrontmatterValue>
  body: string
} {
  const normalized = source.replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) {
    return { metadata: {}, body: normalized }
  }

  const metadata: Record<string, FrontmatterValue> = {}

  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const value = line.slice(separator + 1)
    metadata[key] = parseFrontmatterValue(value)
  }

  return { metadata, body: match[2].trim() }
}

function getString(metadata: Record<string, FrontmatterValue>, key: string, fallback: string): string {
  const value = metadata[key]
  return typeof value === 'string' ? value : fallback
}

function getStringArray(metadata: Record<string, FrontmatterValue>, key: string): string[] {
  const value = metadata[key]
  return Array.isArray(value) ? value : []
}

function getBoolean(metadata: Record<string, FrontmatterValue>, key: string): boolean {
  return metadata[key] === true
}

function fileSlug(path: string): string {
  return path.split('/').pop()?.replace(/\.md$/, '') ?? 'post'
}

export const posts: Post[] = Object.entries(rawPostFiles)
  .map(([path, source]) => {
    const { metadata, body } = parseFrontmatter(source)

    return {
      slug: getString(metadata, 'slug', fileSlug(path)),
      title: getString(metadata, 'title', 'Untitled post'),
      deck: getString(metadata, 'deck', ''),
      date: getString(metadata, 'date', '2026-09-01'),
      category: getString(metadata, 'category', 'Field note') as ContentType,
      readTime: getString(metadata, 'readTime', '5 min read'),
      tags: getStringArray(metadata, 'tags'),
      featured: getBoolean(metadata, 'featured'),
      body,
    }
  })
  .sort((first, second) => second.date.localeCompare(first.date))

marked.setOptions({
  gfm: true,
  breaks: false,
})

export function renderMarkdown(markdown: string): string {
  const rendered = marked.parse(markdown, { async: false }) as string
  return DOMPurify.sanitize(rendered)
}

export const news: NewsItem[] = [
  {
    title: 'Working snapshot: Amadeus open source in 2026',
    excerpt: 'A dated view of the journey, Board pipeline, contributor activity and the evidence framework we can share next.',
    date: '2026-09-10',
    kind: 'Announcement',
    href: '#/post/open-source-in-2026',
  },
  {
    title: 'The contributor journey is now a shared design problem',
    excerpt: 'A short field note on making the first contribution feel less like a maze and more like an invitation.',
    date: '2026-08-18',
    kind: 'Community note',
    href: '#/post/first-steps',
  },
  {
    title: 'Open source office hours: bring your first question',
    excerpt: 'A lightweight format for sharing context, finding the right path and learning from colleagues who have done it before.',
    date: '2026-07-30',
    kind: 'Event',
    href: '#/start',
  },
]

export const reports: Report[] = [
  {
    title: 'Amadeus open source in 2026',
    description: 'A working snapshot connecting the Open Source Board, contributor activity, public project stories and the method behind the numbers.',
    date: '10 Sep 2026',
    type: 'Snapshot',
    status: 'Draft',
    highlights: ['39 Board cases', '180-member activity cohort', 'Evidence-led public framework'],
  },
  {
    title: 'The first contribution playbook',
    description: 'A practical, reusable path from “I found a project” to “I made a contribution I can stand behind.”',
    date: 'v0.1',
    type: 'Playbook',
    status: 'Published',
    highlights: ['Find your entry point', 'Prepare with care', 'Close the loop'],
  },
  {
    title: 'Open source at a glance',
    description: 'A briefing format for leaders who want the signal: why open source matters, how we participate and what good looks like.',
    date: '2026',
    type: 'Brief',
    status: 'Coming soon',
    highlights: ['Strategy and value', 'Trust and compliance', 'People and community'],
  },
]
