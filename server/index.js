// Feature flags used by this app (create in LaunchDarkly if they don't exist):
// - new-dashboard-section, premium-feature, signup-button-variant (client-side)
// - api-integration-kill-switch (server-side, evaluated here)
// See README for setup instructions.

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

import express from 'express'
import cors from 'cors'
import { init } from '@launchdarkly/node-server-sdk'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: true }))
app.use(express.json())

let ldClient = null

async function getLDClient() {
  if (ldClient) return ldClient
  const sdkKey = process.env.LD_SDK_KEY
  if (!sdkKey || sdkKey === 'your-sdk-key-here') {
    return null
  }
  ldClient = init(sdkKey)
  await ldClient.waitForInitialization({ timeout: 5 })
  return ldClient
}

app.get('/api/feature-status', async (req, res) => {
  try {
    const client = await getLDClient()
    if (!client) {
      return res.json({
        configured: false,
        message: 'Backend not configured. Set LD_SDK_KEY in server/.env',
        integrationEnabled: null,
      })
    }

    const plan = req.query.plan || 'free'
    const role = req.query.role || 'User'
    const key = req.query.key || `demo-user-${plan}`
    const debug = req.query.debug === 'true'

    const context = {
      kind: 'user',
      key,
      name: plan === 'premium' ? 'Premium User' : 'Free User',
      plan,
      role,
      debug,
    }

    const integrationEnabled = await client.variation(
      'api-integration-kill-switch',
      context,
      true
    )

    return res.json({
      configured: true,
      integrationEnabled,
      context: { key, plan, role, debug },
      message: integrationEnabled
        ? 'Integration is enabled (flag on).'
        : 'Kill switch active - integration disabled (flag off).',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: err.message,
      message: 'Failed to evaluate feature flag.',
    })
  }
})

async function setKillSwitchFlag(enabled) {
  const token = process.env.LD_ACCESS_TOKEN
  const projectKey = process.env.LD_PROJECT_KEY || 'default'
  const envKey = process.env.LD_ENVIRONMENT_KEY || 'test'
  const flagKey = 'api-integration-kill-switch'

  if (!token || token === 'your-api-token-here') {
    return { success: false, error: 'LD_ACCESS_TOKEN not configured' }
  }

  const instruction = enabled ? { kind: 'turnFlagOn' } : { kind: 'turnFlagOff' }
  const body = {
    environmentKey: envKey,
    instructions: [instruction],
  }

  const url = `https://app.launchdarkly.com/api/v2/flags/${projectKey}/${flagKey}`
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json; domain-model=launchdarkly.semanticpatch',
      Authorization: token,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    return { success: false, error: err || res.statusText }
  }
  return { success: true }
}

app.post('/api/kill-switch/disable', async (req, res) => {
  try {
    const result = await setKillSwitchFlag(false)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/kill-switch/enable', async (req, res) => {
  try {
    const result = await setKillSwitchFlag(true)
    return res.json(result)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
