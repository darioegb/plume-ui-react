const { readFileSync, writeFileSync, existsSync } = require('fs')
const { join, resolve } = require('path')
const fetch = require('node-fetch')

const monorepoPath = resolve(__dirname, '..')

async function getLatestMergedPrInfo(repoOwner, repoName) {
  const branchName = 'changeset-release/main'
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/pulls?state=closed&sort=updated&head=${branchName}`
  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'Node.js',
      Accept: 'application/vnd.github.v3+json',
    },
  }

  try {
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const pullRequests = await response.json()
      const pr = pullRequests
        ?.filter((pr) => pr.merged_at !== null && pr.title === 'Version Packages')
        ?.pop()
      const prMergeDate = new Date(pr.merged_at)
      const prUrl = pr.html_url
      const versionMatch = pr.body.match(/## @plume-ui-react\/lib@(\d+\.\d+\.\d+)/)
      const version = versionMatch ? versionMatch[1] : '1.0.0'
      return {
        version,
        url: prUrl,
        date: prMergeDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }
    } else {
      console.error(
        `Failed to fetch merged PRs for ${repoOwner}/${repoName}: ${response.statusText}`,
      )
    }
  } catch (error) {
    console.error(`Failed to fetch merged PRs for ${repoOwner}/${repoName}: ${error}`)
  }

  return null
}

async function generateChangelog() {
  let changelogEntries = []
  let releaseHeader = ''
  const mergedPrInfo = await getLatestMergedPrInfo('darioegb', 'plume-ui-react')
  if (mergedPrInfo) {
    releaseHeader = `# Version ${mergedPrInfo.version}\nExplore the changelog for Plume UI React version ${mergedPrInfo.version}. Learn about the latest features, bug fixes, and improvements.\n\n[${mergedPrInfo.url}] - ${mergedPrInfo.date}\n\n`
  } else {
    releaseHeader = 'URL_NOT_FOUND\n\n'
  }

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

generateChangelog()
