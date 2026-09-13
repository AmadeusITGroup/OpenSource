import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const contentDirectory = resolve(root, 'src/content/posts')
const requiredFields = ['slug', 'title', 'deck', 'date', 'category', 'readTime', 'tags', 'featured']
const forbiddenPatterns = [
  /<script\b/i,
  /\bon(?:error|load|click)\s*=/i,
  /javascript\s*:/i,
  /sharepoint/i,
  /amadeusworkplace/i,
]

const files = (await readdir(contentDirectory)).filter((file) => file.endsWith('.md')).sort()
const slugs = new Set()
const errors = []

for (const file of files) {
  const source = await readFile(resolve(contentDirectory, file), 'utf8')
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)

  if (!match) {
    errors.push(`${file}: missing frontmatter delimiters`)
    continue
  }

  const metadata = Object.fromEntries(
    match[1]
      .split('\n')
      .filter((line) => line.includes(':'))
      .map((line) => {
        const separator = line.indexOf(':')
        return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
      }),
  )

  for (const field of requiredFields) {
    if (!metadata[field]) errors.push(`${file}: missing frontmatter field '${field}'`)
  }

  if (metadata.slug && slugs.has(metadata.slug)) {
    errors.push(`${file}: duplicate slug '${metadata.slug}'`)
  }
  if (metadata.slug) slugs.add(metadata.slug)

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) errors.push(`${file}: contains forbidden public-content pattern ${pattern}`)
  }
}

if (files.length === 0) errors.push('src/content/posts: no Markdown posts found')

if (errors.length > 0) {
  console.error('Content validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Content validation passed for ${files.length} Markdown post(s).`)
