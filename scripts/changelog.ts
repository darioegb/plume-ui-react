import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, resolve } from 'path'
import fetch from 'node-fetch'

const monorepoPath = resolve(__dirname, '..')

interface PrInfo {
  url: string
  date: string
  body: string
}

async function getLatestMergedPrInfo(
  repoOwner: string,
  repoName: string,
): Promise<PrInfo | null> {
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
      const pr = pullRequests?.pop()
      if (
        pr.user.login === 'github-actions[bot]' &&
        pr.merged_at !== null &&
        pr.title === 'Version Packages'
      ) {
        const prMergeDate = new Date(pr.merged_at)
        const prUrl = pr.html_url
        return {
          body: pr.body,
          url: prUrl,
          date: prMergeDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }
      }
    } else {
      console.error(
        `Failed to fetch merged PRs for ${repoOwner}/${repoName}: ${response.statusText}`,
      )
    }
  } catch (error) {
    console.error(
      `Failed to fetch merged PRs for ${repoOwner}/${repoName}: ${error}`,
    )
  }

  return null
}

async function generateChangelog() {
  const packageJsonPath = join(monorepoPath, 'package.json')
  let version = '1.0.0'
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    version = packageJson.version || version
  }

  let changelogEntries: Array<string> = []
  let releaseHeader = `# Version ${version}\nExplore the changelog for Plume UI React version ${version}. Learn about the latest features, bug fixes, and improvements.\n\n`
  const mergedPrInfo = await getLatestMergedPrInfo('darioegb', 'plume-ui-react')
  if (mergedPrInfo) {
    releaseHeader += `[${mergedPrInfo.url}] - ${mergedPrInfo.date}\n\n${mergedPrInfo.body}`
  } else {
    releaseHeader += 'URL_NOT_FOUND\n\n'
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
