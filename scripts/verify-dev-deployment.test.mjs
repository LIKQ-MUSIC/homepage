import test from 'node:test'
import assert from 'node:assert/strict'
import { selectDeployment, verifyDev } from './verify-dev-deployment.mjs'

const sha = 'a'.repeat(40)
const projectId = 'prj_JjowLHTkazNqJshCM0lUm0RqvrSL'
const current = {
  uid: 'dpl_current', url: 'current.vercel.app', state: 'READY', created: 2,
  target: null, meta: { githubCommitSha: sha, githubCommitRef: 'develop' }
}

function fixture(overrides = {}) {
  let time = 0
  let alias = { deploymentId: current.uid, projectId }
  const writes = []
  const options = {
    sha, now: () => time, timeoutMs: 90_000, log: () => {},
    sleep: async ms => { time += ms },
    getHead: async () => sha,
    readCommit: async () => sha,
    api: async (path, request) => {
      if (request?.method === 'POST') {
        writes.push({ path, body: request.body })
        alias = { deploymentId: current.uid, projectId }
        return {}
      }
      if (path.includes('/domains')) return { domains: [{ name: 'dev.likqmusic.com', gitBranch: 'develop', verified: true }] }
      if (path.startsWith('/v6/')) return { deployments: [current] }
      if (path.startsWith('/v4/')) return alias
      throw new Error(`Unexpected request: ${path}`)
    },
    ...overrides
  }
  return { options, writes, setAlias: value => { alias = value }, now: () => time }
}

test('selects only the latest deployment for this SHA and develop, excluding production', () => {
  assert.equal(selectDeployment([
    { ...current, uid: 'wrong-sha', meta: { ...current.meta, githubCommitSha: 'b'.repeat(40) }, created: 10 },
    { ...current, uid: 'other-branch', meta: { ...current.meta, githubCommitRef: 'master' }, created: 11 },
    { ...current, uid: 'production', target: 'production', created: 12 },
    { ...current, uid: 'older', created: 1 }, current
  ], sha).uid, current.uid)
})

test('passes only when alias and public homepage match the expected commit', async () => {
  const f = fixture()
  assert.equal((await verifyDev(f.options)).sha, sha)
  assert.equal(f.writes.length, 0)
})

test('repairs a stale alias after allowing automatic assignment to finish', async () => {
  const f = fixture()
  f.setAlias({ deploymentId: 'dpl_old', projectId })
  assert.equal((await verifyDev(f.options)).sha, sha)
  assert.ok(f.now() >= 45_000)
  assert.deepEqual(f.writes, [{
    path: '/v2/deployments/dpl_current/aliases', body: { alias: 'dev.likqmusic.com' }
  }])
})

test('does not report success for a stale homepage even if the alias is correct', async () => {
  const f = fixture({ readCommit: async () => 'old-commit' })
  await assert.rejects(verifyDev(f.options), /homepage serves old-commit/)
  assert.equal(f.writes.length, 0)
})

test('never reassigns an alias after a newer push supersedes the run', async () => {
  let checks = 0
  const f = fixture({ getHead: async () => ++checks <= 6 ? sha : 'new-commit' })
  f.setAlias({ deploymentId: 'dpl_old', projectId })
  assert.equal((await verifyDev(f.options)).superseded, true)
  assert.equal(f.writes.length, 0)
})

test('refuses an alias owned by another project', async () => {
  const f = fixture()
  f.setAlias({ deploymentId: 'dpl_other', projectId: 'other-project' })
  await assert.rejects(verifyDev(f.options), /different project/)
  assert.equal(f.writes.length, 0)
})

test('fails on a broken build instead of repointing the alias to another commit', async () => {
  const f = fixture()
  const api = f.options.api
  f.options.api = async (path, request) => path.startsWith('/v6/')
    ? { deployments: [{ ...current, state: 'ERROR' }] }
    : api(path, request)
  await assert.rejects(verifyDev(f.options), /Vercel ERROR/)
  assert.equal(f.writes.length, 0)
})

test('does not change domain configuration when its branch mapping is wrong', async () => {
  const f = fixture()
  f.options.api = async () => ({ domains: [{ name: 'dev.likqmusic.com', gitBranch: 'master', verified: true }] })
  await assert.rejects(verifyDev(f.options), /assigned to develop/)
  assert.equal(f.writes.length, 0)
})
