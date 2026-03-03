import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk'
import { createContextKey } from './utils/contextKey.js'
import App from './App.jsx'
import './index.css'

const clientId = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID
const isConfigured = clientId && clientId !== 'your-client-side-id-here'

const contextKey = createContextKey()

async function init() {
  if (!isConfigured) {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <h1>LaunchDarkly Feature Flag Demo</h1>
          <p>
            To get started, copy <code>.env.example</code> to <code>.env</code> and add your LaunchDarkly
            client-side ID. Find it in LaunchDarkly: Project Settings → Environments → [Your env] → Client-side ID.
          </p>
        </main>
      </StrictMode>
    )
    return
  }

  const LDProvider = await asyncWithLDProvider({
    clientSideID: clientId,
    context: {
      kind: 'user',
      key: contextKey,
      name: 'Premium User',
      plan: 'premium',
      role: 'User',
      debug: false,
    },
  })

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <LDProvider>
        <App contextKey={contextKey} />
      </LDProvider>
    </StrictMode>
  )
}

init()
