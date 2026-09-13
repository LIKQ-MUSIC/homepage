import { appendFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const PROJECT = 'prj_JjowLHTkazNqJshCM0lUm0RqvrSL'
const TEAM = 'team_K9DzSb0Ak82AHpA6PwSYC4Pn'
const DOMAIN = 'dev.likqmusic.com'
const REPOSITORY = 'LIKQ-MUSIC/homepage'
const BRANCH = 'develop'

export function selectDeployment(deployments, sha) {
  return deployments
    .filter(d => d.meta?.githubCommitSha === sha &&
      d.meta?.githubCommitRef === BRANCH && d.target !== 'production')
    .sort((a, b) => b.created - a.created)[0]
}

export async function verifyDev({
  sha, api, getHead, readCommit, sleep, log = console.log,
  now = Date.now, timeoutMs = 15 * 60_000
}) {
  const deadline = now() + timeoutMs
  let readySince
  let assignedId
  let lastStatus = 'Waiting for Vercel to receive the push'
  const domains = await api(`/v9/projects/${PROJECT}/domains`)
  const domain = domains.domains.find(d => d.name === DOMAIN)
  if (domain?.gitBranch !== BRANCH || !domain.verified) {
    throw new Error(`${DOMAIN} must be verified and assigned to ${BRANCH} in Vercel project settings`)
  }

  while (now() < deadline) {
    if (await getHead() !== sha) {
      log('A newer commit is on develop; this run will not change its alias.')
      return { superseded: true }
    }
    const { deployments } = await api(`/v6/deployments?projectId=${PROJECT}&limit=100`)
    const deployment = selectDeployment(deployments, sha)
    if (deployment && ['ERROR', 'CANCELED'].includes(deployment.state)) {
      throw new Error(`Vercel ${deployment.state}: https://${deployment.url}`)
    }
    if (deployment?.state === 'READY') {
      readySince ??= now()
      const alias = await api(`/v4/aliases/${DOMAIN}`, { allow404: true })
      if (alias && alias.projectId !== PROJECT) {
        throw new Error(`${DOMAIN} belongs to a different project; refusing to reassign it`)
      }
      if (alias?.deploymentId !== deployment.uid) {
        lastStatus = `Build ready, waiting for ${DOMAIN} to point to ${deployment.uid}`
        // Give Vercel's Git integration time to finish its own alias assignment.
        if (now() - readySince >= 45_000 && assignedId !== deployment.uid) {
          if (await getHead() !== sha) return { superseded: true }
          await api(`/v2/deployments/${deployment.uid}/aliases`, {
            method: 'POST', body: { alias: DOMAIN }
          })
          assignedId = deployment.uid
          log(`Reassigned ${DOMAIN} to the current develop deployment`)
        }
      } else {
        // Use the ordinary URL: a cache-busting query could hide a stale cache.
        const served = await readCommit(`https://${DOMAIN}/`)
        if (served === sha) {
          if (await getHead() !== sha) return { superseded: true }
          log(`Verified ${DOMAIN} serves ${sha} from ${deployment.uid}`)
          return { deployment: deployment.url, sha }
        }
        lastStatus = `Alias is correct but homepage serves ${served || 'no X-LIKQ-Commit header'}; expected ${sha}`
      }
    } else if (deployment) {
      lastStatus = `Vercel ${deployment.state}: https://${deployment.url}`
    }
    log(lastStatus)
    await sleep(10_000)
  }
  throw new Error(`Dev deployment did not become current within 15 minutes. ${lastStatus}`)
}

async function main() {
  const { VERCEL_TOKEN, GITHUB_TOKEN, GITHUB_SHA, GITHUB_REF, GITHUB_REPOSITORY } = process.env
  if (!VERCEL_TOKEN || !GITHUB_TOKEN || !/^[a-f0-9]{40}$/.test(GITHUB_SHA || '')) {
    throw new Error('VERCEL_TOKEN, GITHUB_TOKEN and GITHUB_SHA are required')
  }
  if (GITHUB_REF !== 'refs/heads/develop' || GITHUB_REPOSITORY !== REPOSITORY) {
    throw new Error('This verifier only runs for LIKQ-MUSIC/homepage develop')
  }

  async function api(path, { method = 'GET', body, allow404 = false } = {}) {
    const url = new URL(path, 'https://api.vercel.com')
    url.searchParams.set('teamId', TEAM)
    const response = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000)
    })
    if (allow404 && response.status === 404) return null
    if (!response.ok) throw new Error(`Vercel ${method} ${url.pathname}: HTTP ${response.status}`)
    return response.json()
  }

  const result = await verifyDev({
    sha: GITHUB_SHA,
    api,
    async getHead() {
      const response = await fetch(`https://api.github.com/repos/${REPOSITORY}/git/ref/heads/${BRANCH}`, {
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
        signal: AbortSignal.timeout(30_000)
      })
      if (!response.ok) throw new Error(`Cannot check current develop HEAD: HTTP ${response.status}`)
      return (await response.json()).object.sha
    },
    async readCommit(url) {
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'manual', signal: AbortSignal.timeout(15_000) })
        return response.status === 200 ? response.headers.get('x-likq-commit') : null
      } catch {
        return null // Allow transient network/edge errors until the deadline.
      }
    },
    sleep: ms => new Promise(resolve => setTimeout(resolve, ms))
  })
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, result.superseded
      ? 'A newer develop commit superseded this run. No alias change was made after detecting it.\n'
      : `Verified https://${DOMAIN}/ serves commit \`${result.sha}\`.\n\nDeployment: https://${result.deployment}\n`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1 })
}
