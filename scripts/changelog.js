const { readFileSync, writeFileSync, existsSync } = require('fs')
const { join, resolve } = require('path')

const monorepoPath = resolve(__dirname, '..')

async function getLatestMergedPrInfo(repoOwner, repoName) {
  // GitHub ignores `head` unless it is `owner:branch`.
  const head = `${repoOwner}:changeset-release/main`
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls?state=closed&sort=updated&direction=desc&per_page=20&head=${encodeURIComponent(head)}`
  const headers = {
    'User-Agent': 'Node.js',
    Accept: 'application/vnd.github.v3+json',
  }
  // Unauthenticated calls from CI runners hit the rate limit.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const response = await fetch(apiUrl, { method: 'GET', headers })
  if (!response.ok) {
    throw new Error(
      `Failed to fetch merged PRs for ${repoOwner}/${repoName}: ${response.status} ${response.statusText}`,
    )
  }

  const pullRequests = await response.json()
  const pr = pullRequests.find((p) => p.merged_at !== null && p.title === 'Version Packages')
  if (!pr) {
    throw new Error('No merged "Version Packages" PR found')
  }

  const versionMatch = pr.body?.match(/## @plume-ui-react\/lib@(\d+\.\d+\.\d+)/)
  if (!versionMatch) {
    throw new Error(`Could not read the lib version from PR #${pr.number}`)
  }

  return {
    version: versionMatch[1],
    url: pr.html_url,
    date: new Date(pr.merged_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  }
}

async function generateChangelog() {
  let changelogEntries = []
  let releaseHeader = ''
  const mergedPrInfo = await getLatestMergedPrInfo('darioegb', 'plume-ui-react')
  releaseHeader = `# Version ${mergedPrInfo.version}\nExplore the changelog for Plume UI React version ${mergedPrInfo.version}. Learn about the latest features, bug fixes, and improvements.\n\n[${mergedPrInfo.url}] - ${mergedPrInfo.date}\n\n`

  const combinedChangelog = changelogEntries.join('\n\n')
  releaseHeader += combinedChangelog
  const parentChangelogPath = join(monorepoPath, 'CHANGELOG.md')
  let existingChangelog = ''
  if (existsSync(parentChangelogPath)) {
    existingChangelog = readFileSync(parentChangelogPath, 'utf8')
  }

  const finalChangelog = releaseHeader + '\n\n' + existingChangelog
  writeFileSync(parentChangelogPath, finalChangelog, 'utf8')
  console.log('Parent project changelog updated.')
}

generateChangelog().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
