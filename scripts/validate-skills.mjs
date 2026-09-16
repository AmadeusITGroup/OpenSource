import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillsRoot = resolve(root, '.github/skills')
const agentsPath = resolve(root, 'AGENTS.md')
const legacyInstructionsPath = resolve(root, '.github/copilot-instructions.md')
const requiredSkills = [
  'ospo-content-authoring',
  'ospo-dependency-security',
  'ospo-design-accessibility',
  'ospo-evidence-refresh',
  'ospo-maintainer',
  'ospo-publication-review',
  'ospo-site-validation',
]
const errors = []

function parseFrontmatter(source, file) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) {
    errors.push(`${file}: missing YAML frontmatter`)
    return {}
  }

  return Object.fromEntries(
    match[1]
      .split('\n')
      .filter((line) => line.includes(':'))
      .map((line) => {
        const separator = line.indexOf(':')
        const key = line.slice(0, separator).trim()
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
        return [key, value]
      }),
  )
}

async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function validateLinks(source, filePath) {
  const links = [...source.matchAll(/\]\((\.\.?\/[^)#]+)(?:#[^)]+)?\)/g)].map((match) => match[1])
  for (const link of links) {
    const target = resolve(dirname(filePath), link)
    if (!(await exists(target))) {
      errors.push(`${relative(root, filePath)}: missing relative resource '${link}'`)
    }
  }
}

if (!(await exists(agentsPath))) {
  errors.push('AGENTS.md: missing project-wide agent guidance')
} else {
  const source = await readFile(agentsPath, 'utf8')
  const requiredGuidance = [
    '.tmp/',
    '.memories/',
    'npm run validate',
    'git diff --check',
    'ospo-maintainer',
    'Human decision gates',
  ]
  for (const guidance of requiredGuidance) {
    if (!source.includes(guidance)) {
      errors.push(`AGENTS.md: missing required guidance '${guidance}'`)
    }
  }
}

if (await exists(legacyInstructionsPath)) {
  errors.push('.github/copilot-instructions.md: remove legacy duplicate; use root AGENTS.md')
}

const skillDirectories = (await readdir(skillsRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

for (const name of requiredSkills) {
  if (!skillDirectories.includes(name)) errors.push(`.github/skills/${name}: required skill is missing`)
}

for (const directory of skillDirectories) {
  const skillPath = resolve(skillsRoot, directory, 'SKILL.md')
  const displayPath = relative(root, skillPath)
  if (!(await exists(skillPath))) {
    errors.push(`${displayPath}: missing SKILL.md`)
    continue
  }

  const source = await readFile(skillPath, 'utf8')
  const metadata = parseFrontmatter(source, displayPath)
  if (metadata.name !== directory) {
    errors.push(`${displayPath}: frontmatter name '${metadata.name ?? ''}' must match '${directory}'`)
  }
  if (!/^[a-z0-9-]{1,64}$/.test(metadata.name ?? '')) {
    errors.push(`${displayPath}: name must be 1-64 lowercase letters, numbers or hyphens`)
  }
  if (!metadata.description) {
    errors.push(`${displayPath}: description is required`)
  } else if (metadata.description.length > 1024) {
    errors.push(`${displayPath}: description exceeds 1024 characters`)
  }
  if (source.split('\n').length > 500) {
    errors.push(`${displayPath}: keep SKILL.md below 500 lines and move detail to resources`)
  }
  await validateLinks(source, skillPath)
}

if (errors.length > 0) {
  console.error('Skill validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Skill validation passed for ${skillDirectories.length} repository skill(s).`)
